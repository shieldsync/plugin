<?php
namespace ShieldSync\Admin;

class RestApi {
    public static function register() {
        add_action( 'rest_api_init', [self::class, 'register_routes'] );
    }

    public static function register_routes() {
        
        // GET /wp-json/shieldsync/v1/stats - Get security stats
        register_rest_route( 'shieldsync/v1', '/stats', [
            'methods'  => 'GET',
            'callback' => [self::class, 'get_stats'],
            'permission_callback' => function () {
                return current_user_can( 'manage_options' );
            },
        ]);

        // GET /wp-json/shieldsync/v1/logs - Get recent security logs
        register_rest_route( 'shieldsync/v1', '/logs', [
            'methods'  => 'GET',
            'callback' => [self::class, 'get_logs'],
            'permission_callback' => function () {
                return current_user_can( 'manage_options' );
            },
        ]);

        // GET /wp-json/shieldsync/v1/blocked-ips - Get list of currently blocked IPs
        register_rest_route( 'shieldsync/v1', '/blocked-ips', [
            'methods'  => 'GET',
            'callback' => [self::class, 'get_blocked_ips'],
            'permission_callback' => function () {
                return current_user_can( 'manage_options' );
            },
        ]);

        // POST /wp-json/shieldsync/v1/block-ip - Manually block an IP
        register_rest_route( 'shieldsync/v1', '/block-ip', [
            'methods'  => 'POST',
            'callback' => [self::class, 'block_ip'],
            'permission_callback' => function () {
                return current_user_can( 'manage_options' );
            },
        ]);

        // DELETE /wp-json/shieldsync/v1/unblock-ip - Manually unblock an IP
        register_rest_route( 'shieldsync/v1', '/unblock-ip', [
            'methods'  => 'DELETE',
            'callback' => [self::class, 'unblock_ip'],
            'permission_callback' => function () {
                return current_user_can( 'manage_options' );
            },
        ]);
    }

    // Get Dashboard stats 
    public static function get_stats() {
        global $wpdb;

        $today = current_time('Y-m-d');

        $attacks_today = $wpdb->get_var(
            "SELECT COUNT(*) FROM {$wpdb->prefix}ss_attack_logs 
             WHERE DATE(created_at) = '$today'"
        );

        $blocked_ips = $wpdb->get_var(
            "SELECT COUNT(*) FROM {$wpdb->prefix}ss_ip_reputation 
             WHERE status = 'blocked'"
        );

        $attack_types = $wpdb->get_results(
            "SELECT attack_type, COUNT(*) as count 
             FROM {$wpdb->prefix}ss_attack_logs 
             WHERE DATE(created_at) = '$today'
             GROUP BY attack_type 
             ORDER BY count DESC"
        );

        $attacks_week = $wpdb->get_results(
            "SELECT DATE(created_at) as date, COUNT(*) as count
             FROM {$wpdb->prefix}ss_attack_logs
             WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
             GROUP BY DATE(created_at)
             ORDER BY date ASC"
        );

        // Calculate security score
        $score = 100;
        if ( $attacks_today > 10 ) $score -= 10;
        if ( $attacks_today > 50 ) $score -= 20;

        return rest_ensure_response([
            'security_score' => $score,
            'attacks_today'  => (int) $attacks_today,
            'blocked_ips'    => (int) $blocked_ips,
            'attack_types'   => $attack_types,
            'attacks_week'   => $attacks_week,
        ]);
    }

    // Get recent attack logs
    public static function get_logs() {
        global $wpdb;

        $logs = $wpdb->get_results(
            "SELECT * FROM {$wpdb->prefix}ss_attack_logs 
             ORDER BY created_at DESC 
             LIMIT 50"
        );

        return rest_ensure_response( $logs );
    }

    // Get blocked IPs
    public static function get_blocked_ips(){
        global $wpdb;

        $blocked_ips = $wpdb->get_results(
            "SELECT * FROM {$wpdb->prefix}ss_ip_reputation
            WHERE status = 'blocked'
            ORDER BY updated_at DESC"
        );

        return rest_ensure_response( $blocked_ips );
    }

    // Block an IP manually
    public static function block_ip( $request ){
        global $wpdb;

        $ip = sanitize_text_field( $request->get_param('ip') );
        $reason = sanitize_text_field( $request->get_param('reason') );

        if ( !filter_var( $ip, FILTER_VALIDATE_IP) ) {
            return new WP_Error( 'invalid_ip', 'IP address is required', ['status' => 400] );
        }

        $wpdb->replace(
            $wpdb->prefix . 'ss_ip_reputation',
            [
                'ip_address'   => $ip,
                'status'       => 'blocked',
                'threat_score' => 100,
                'source'       => 'manual',
                'updated_at'   => current_time( 'mysql' ),
            ],
            ['%s', '%s', '%d', '%s', '%s']
        );

        return rest_ensure_response( ['success' => true, 'ip' => $ip, 'message' => "IP $ip has been blocked. Reason: $reason"] );
    }

    // Unblock an IP
    public static function unblock_ip($request){
        global $wpdb;

        $ip = sanitize_text_field( $request->get_param('ip') );

        if ( !filter_var( $ip, FILTER_VALIDATE_IP) ) {
            return new WP_Error( 'invalid_ip', 'IP address is required', ['status' => 400] );
        }

        $wpdb->delete(
            $wpdb->prefix . 'ss_ip_reputation',
            ['ip_address' => $ip],
            ['%s']
        );

        return rest_ensure_response( ['success' => true, 'ip' => $ip, 'message' => "IP $ip has been unblocked."] );
    }



}
?>
<?php
namespace ShieldSync\Detectors;

class CsrfGuard {

    private static $excluded_actions = [
        'wp-login.php',
        'wp-cron.php',
        'xmlrpc.php',
        'admin-ajax.php',
    ];

    public static function scan(): int {

        $method = $_SERVER['REQUEST_METHOD'] ?? '';
        if ( ! in_array( $method, ['POST', 'PUT', 'DELETE'] ) ) {
            return 0;
        }

        $uri = $_SERVER['REQUEST_URI'] ?? '';
        foreach ( self::$excluded_actions as $excluded ) {
            if ( strpos( $uri, $excluded ) !== false ) {
                return 0;
            }
        }

        // Check Origin first
        $origin_score = self::check_origin();
        if ( $origin_score > 0 ) {
            return $origin_score;
        }

        // Then check Referer
        $referer_score = self::check_referer();
        if ( $referer_score > 0 ) {
            return $referer_score;
        }

        return 0;
    }

    private static function check_referer(): int {

        $referer = $_SERVER['HTTP_REFERER'] ?? '';

        // ✅ Fixed - removed undefined $host variable
        if ( empty( $referer ) ) {
            return 60;
        }

        $site_host    = parse_url( home_url(), PHP_URL_HOST );
        $referer_host = parse_url( $referer, PHP_URL_HOST );

        if ( $site_host !== $referer_host ) {
            return 85;
        }

        return 0;
    }

    private static function check_origin(): int {

        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

        if ( empty( $origin ) ) {
            return 0;
        }

        $site_host   = parse_url( home_url(), PHP_URL_HOST );
        $origin_host = parse_url( $origin, PHP_URL_HOST );

        if ( $site_host !== $origin_host ) {
            return 85;
        }

        return 0;
    }

    public static function generate_token(): string {
        if ( ! session_id() ) {
            session_start();
        }
        $token = bin2hex( random_bytes( 32 ) );
        $_SESSION['ss_csrf_token'] = $token;
        return $token;
    }

    public static function verify_token( string $token ): bool {
        if ( ! session_id() ) {
            session_start();
        }
        $stored = $_SESSION['ss_csrf_token'] ?? '';
        if ( empty( $stored ) || empty( $token ) ) {
            return false;
        }
        return hash_equals( $stored, $token );
    }
}
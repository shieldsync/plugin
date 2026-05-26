<?php
/**
 * ShieldSync WAF Core
 * Must-Use plugin — loads before everything else
 */

add_action( 'muplugins_loaded', function() {
    global $wpdb;

    $ip = $_SERVER['REMOTE_ADDR'] ?? '';

    if ( empty( $ip ) ) return;

    $blocked = $wpdb->get_var( $wpdb->prepare(
        "SELECT id FROM {$wpdb->prefix}ss_ip_reputation 
         WHERE ip_address = %s 
         AND status = 'blocked' 
         AND (expires_at IS NULL OR expires_at > NOW())",
        $ip
    ));

    if ( $blocked ) {
        http_response_code( 403 );
        die('<!DOCTYPE html>
<html>
<head>
    <title>Access Denied — ShieldSync</title>
    <style>
        body { font-family: sans-serif; text-align: center; padding: 80px 20px; background: #f9f9f9; }
        .box { background: white; border-radius: 8px; padding: 40px; max-width: 480px; margin: 0 auto; box-shadow: 0 2px 12px rgba(0,0,0,0.1); }
        h1 { color: #e53e3e; font-size: 28px; }
        p { color: #666; margin-top: 12px; }
        .badge { background: #e53e3e; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="box">
        <p><span class="badge">403 FORBIDDEN</span></p>
        <h1>Access Denied</h1>
        <p>Your IP address has been blocked by ShieldSync Security.</p>
        <p style="font-size:13px; margin-top:20px;">IP: ' . esc_html($ip) . '</p>
    </div>
</body>
</html>');
    }
});
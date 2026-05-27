<?php
namespace ShieldSync\Detectors;

class BruteForce {

    // Max login attempts before blocking
    const MAX_ATTEMPTS = 5;

    // Lockout duration in minutes
    const LOCKOUT_MINUTES = 30;

    /**
     * Check if this request is a brute force attempt
     * Returns threat score (0 = clean, 100 = blocked)
     */
    public static function scan(): int {

        // Only check login page POST requests
        if ( ! self::is_login_attempt() ) {
            return 0;
        }

        $ip = $_SERVER['REMOTE_ADDR'] ?? '';

        if ( empty( $ip ) ) return 0;

        $attempts = self::get_attempts( $ip );

        if ( $attempts >= self::MAX_ATTEMPTS ) {
            return 100; // Block immediately
        }

        // Record this attempt
        self::record_attempt( $ip );

        return 0;
    }

    /**
     * Check if this is a login page POST request
     */
    private static function is_login_attempt(): bool {
        $uri = $_SERVER['REQUEST_URI'] ?? '';
        $method = $_SERVER['REQUEST_METHOD'] ?? '';

        return (
            $method === 'POST' &&
            ( strpos( $uri, 'wp-login.php' ) !== false ||
              strpos( $uri, 'wp-admin' ) !== false )
        );
    }

    /**
     * Get number of recent login attempts for this IP
     */
    private static function get_attempts( string $ip ): int {
        $key = 'ss_bf_' . md5( $ip );
        $attempts = get_transient( $key );
        return $attempts ? (int) $attempts : 0;
    }

    /**
     * Record a login attempt for this IP
     */
    private static function record_attempt( string $ip ): void {
        $key = 'ss_bf_' . md5( $ip );
        $attempts = self::get_attempts( $ip );
        $attempts++;

        // Store with lockout expiry
        set_transient(
            $key,
            $attempts,
            self::LOCKOUT_MINUTES * 60
        );
    }

    /**
     * Manually clear attempts for an IP (for admin use)
     */
    public static function clear_attempts( string $ip ): void {
        $key = 'ss_bf_' . md5( $ip );
        delete_transient( $key );
    }
}
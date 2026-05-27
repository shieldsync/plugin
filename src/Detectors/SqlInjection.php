<?php
namespace ShieldSync\Detectors;

class SqlInjection {

    // Common SQLi patterns to detect
    private static $patterns = [
        '/(\%27)|(\')|(\-\-)|(\%23)|(#)/i',
        '/((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i',
        '/\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i',
        '/((\%27)|(\'))union/i',
        '/exec(\s|\+)+(s|x)p\w+/i',
        '/union([^a-z])+select/i',
        '/select.+from/i',
        '/insert.+into/i',
        '/delete.+from/i',
        '/drop\s+table/i',
        '/update.+set/i',
        '/or\s+1\s*=\s*1/i',
        '/or\s+\'1\'\s*=\s*\'1\'/i',
    ];

    /**
     * Scan all request inputs for SQLi patterns
     * Returns threat score (0 = clean, 100 = definite attack)
     */
    public static function scan(): int {
        $inputs = self::get_all_inputs();

        foreach ( $inputs as $input ) {
            $score = self::check( $input );
            if ( $score > 0 ) {
                return $score;
            }
        }

        return 0;
    }

    /**
     * Check a single string for SQLi patterns
     */
    public static function check( string $value ): int {
        $value = urldecode( $value );

        foreach ( self::$patterns as $pattern ) {
            if ( preg_match( $pattern, $value ) ) {
                return 90; // High threat score
            }
        }

        return 0;
    }

    /**
     * Collect all request inputs to scan
     */
    private static function get_all_inputs(): array {
        $inputs = [];

        // GET parameters
        foreach ( $_GET as $key => $value ) {
            $inputs[] = is_array($value) ? implode(' ', $value) : $value;
            $inputs[] = $key;
        }

        // POST parameters
        foreach ( $_POST as $key => $value ) {
            $inputs[] = is_array($value) ? implode(' ', $value) : $value;
            $inputs[] = $key;
        }

        // Request URI
        $inputs[] = $_SERVER['REQUEST_URI'] ?? '';

        // User agent
        $inputs[] = $_SERVER['HTTP_USER_AGENT'] ?? '';

        return array_filter( $inputs );
    }
}
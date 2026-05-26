<?php
namespace ShieldSync\Detectors;

class XssDetector {

    private static $patterns = [
        // Script tags
        '/<script\b[^>]*>(.*?)<\/script>/is',
        '/<script\b[^>]*>/i',

        // Event handlers
        '/\bon\w+\s*=\s*["\']?[^"\'>\s]/i',

        // Javascript protocol
        '/javascript\s*:/i',
        '/vbscript\s*:/i',

        // Data URI with script
        '/data\s*:\s*text\/html/i',

        // Common XSS vectors
        '/<iframe/i',
        '/<object/i',
        '/<embed/i',
        '/<svg\s+onload/i',
        '/expression\s*\(/i',

        // Encoded XSS
        '/&#x?[0-9a-f]+;/i',
        '/%3cscript/i',
        '/%3c%2fscript/i',

        // alert/confirm/prompt functions
        '/\balert\s*\(/i',
        '/\bconfirm\s*\(/i',
        '/\bprompt\s*\(/i',
        '/\bdocument\.cookie\b/i',
        '/\bdocument\.write\s*\(/i',
    ];

    /**
     * Scan all inputs for XSS patterns
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
     * Check a single value for XSS
     */
    public static function check( string $value ): int {
        // Decode before checking
        $value = html_entity_decode( $value, ENT_QUOTES );
        $value = urldecode( $value );

        foreach ( self::$patterns as $pattern ) {
            if ( preg_match( $pattern, $value ) ) {
                return 90;
            }
        }

        return 0;
    }

    /**
     * Collect all inputs to scan
     */
    private static function get_all_inputs(): array {
        $inputs = [];

        foreach ( $_GET as $key => $value ) {
            $inputs[] = is_array($value) ? implode(' ', $value) : $value;
        }

        foreach ( $_POST as $key => $value ) {
            $inputs[] = is_array($value) ? implode(' ', $value) : $value;
        }

        $inputs[] = $_SERVER['REQUEST_URI'] ?? '';
        $inputs[] = $_SERVER['HTTP_REFERER'] ?? '';
        $inputs[] = $_SERVER['HTTP_USER_AGENT'] ?? '';

        return array_filter( $inputs );
    }
}
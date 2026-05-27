<?php
namespace ShieldSync\Detectors;

class FileUpload {

    // Dangerous file extensions
    private static $dangerous_extensions = [
        'php', 'php3', 'php4', 'php5', 'php7', 'phtml',
        'phar', 'exe', 'sh', 'bash', 'py', 'pl', 'cgi',
        'asp', 'aspx', 'jsp', 'htaccess', 'htpasswd',
    ];

    // Allowed MIME types
    private static $allowed_mime_types = [
        'image/jpeg', 'image/png', 'image/gif',
        'image/webp', 'image/svg+xml',
        'application/pdf',
        'text/plain', 'text/csv',
        'application/zip',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    // PHP code patterns to detect in files
    private static $php_patterns = [
        '/<\?php/i',
        '/<\?=/i',
        '/eval\s*\(/i',
        '/base64_decode\s*\(/i',
        '/system\s*\(/i',
        '/exec\s*\(/i',
        '/shell_exec\s*\(/i',
        '/passthru\s*\(/i',
        '/popen\s*\(/i',
    ];

    /**
     * Scan uploaded files for threats
     * Returns threat score
     */
    public static function scan(): int {

        if ( empty( $_FILES ) ) return 0;

        foreach ( $_FILES as $file ) {
            $score = self::check_file( $file );
            if ( $score > 0 ) {
                return $score;
            }
        }

        return 0;
    }

    /**
     * Check a single uploaded file
     */
    private static function check_file( array $file ): int {

        if ( ! isset( $file['tmp_name'] ) || empty( $file['tmp_name'] ) ) {
            return 0;
        }

        // Check 1 — Dangerous extension
        $ext = strtolower( pathinfo( $file['name'], PATHINFO_EXTENSION ) );
        if ( in_array( $ext, self::$dangerous_extensions ) ) {
            return 100;
        }

        // Check 2 — MIME type validation
        $finfo = finfo_open( FILEINFO_MIME_TYPE );
        $mime  = finfo_file( $finfo, $file['tmp_name'] );
        finfo_close( $finfo );

        if ( ! in_array( $mime, self::$allowed_mime_types ) ) {
            return 80;
        }

        // Check 3 — Scan file contents for PHP code
        $contents = file_get_contents( $file['tmp_name'], false, null, 0, 1024 );
        if ( $contents ) {
            foreach ( self::$php_patterns as $pattern ) {
                if ( preg_match( $pattern, $contents ) ) {
                    return 100;
                }
            }
        }

        // Check 4 — Double extension (file.php.jpg)
        $filename = $file['name'];
        $parts    = explode( '.', $filename );
        if ( count( $parts ) > 2 ) {
            foreach ( $parts as $part ) {
                if ( in_array( strtolower( $part ), self::$dangerous_extensions ) ) {
                    return 90;
                }
            }
        }

        return 0;
    }
}
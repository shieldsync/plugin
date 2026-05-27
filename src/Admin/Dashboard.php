<?php
namespace ShieldSync\Admin;

class Dashboard {

    public static function register() {
        add_action( 'admin_menu', [ self::class, 'add_menu' ] );
        add_action( 'admin_enqueue_scripts', [ self::class, 'enqueue_assets' ] );
    }

    public static function add_menu() {
        add_menu_page(
            'ShieldSync Security',
            'ShieldSync',
            'manage_options',
            'shield-sync',
            [ self::class, 'render_page' ],
            'dashicons-shield',
            81
        );

        add_submenu_page(
            'shield-sync',
            'Dashboard',
            'Dashboard',
            'manage_options',
            'shield-sync',
            [ self::class, 'render_page' ]
        );

        add_submenu_page(
            'shield-sync',
            'Attack Logs',
            'Attack Logs',
            'manage_options',
            'shield-sync-logs',
            [ self::class, 'render_page' ]
        );

        add_submenu_page(
            'shield-sync',
            'Blocked IPs',
            'Blocked IPs',
            'manage_options',
            'shield-sync-ips',
            [ self::class, 'render_page' ]
        );

        add_submenu_page(
            'shield-sync',
            'Settings',
            'Settings',
            'manage_options',
            'shield-sync-settings',
            [ self::class, 'render_page' ]
        );
    }

    public static function enqueue_assets( $hook ) {

        // Only load on ShieldSync pages
        if ( strpos( $hook, 'shield-sync' ) === false ) return;

        $js_file  = SHIELD_SYNC_PATH . 'assets/js/shield-sync-dashboard.js';
        $css_file = SHIELD_SYNC_PATH . 'assets/js/shield-sync-dashboard.css';

        // Load built React app if it exists
        if ( file_exists( $js_file ) ) {
            wp_enqueue_script(
                'shield-sync-dashboard',
                SHIELD_SYNC_URL . 'assets/js/shield-sync-dashboard.js',
                [],
                SHIELD_SYNC_VERSION,
                true
            );
        }

        if ( file_exists( $css_file ) ) {
            wp_enqueue_style(
                'shield-sync-dashboard',
                SHIELD_SYNC_URL . 'assets/js/shield-sync-dashboard.css',
                [],
                SHIELD_SYNC_VERSION
            );
        }

        // Pass WordPress data to React
        wp_localize_script(
            'shield-sync-dashboard',
            'shieldSyncData',
            [
                'apiUrl'   => rest_url('shieldsync/v1'),
                'nonce'    => wp_create_nonce('wp_rest'),
                'version'  => SHIELD_SYNC_VERSION,
                'adminUrl' => admin_url(),
                'siteUrl'  => get_site_url(),
            ]
        );
    }

    public static function render_page() {
        // Get current page
        $page = $_GET['page'] ?? 'shield-sync';
        ?>
        <div class="wrap">
            <div id="shield-sync-root" data-page="<?php echo esc_attr($page); ?>">

                <?php if ( ! file_exists( SHIELD_SYNC_PATH . 'assets/js/shield-sync-dashboard.js' ) ): ?>
                <!-- Show temporary dashboard until React is built -->
                <style>
                    .ss-temp { font-family: -apple-system, sans-serif; padding: 20px 0; }
                    .ss-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
                    .ss-header h1 { margin: 0; font-size: 24px; color: #1a1a2e; }
                    .ss-badge { background: #e53e3e; color: white; padding: 3px 10px; border-radius: 20px; font-size: 12px; }
                    .ss-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
                    .ss-card { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
                    .ss-card h3 { margin: 0 0 8px; font-size: 13px; color: #666; font-weight: 500; }
                    .ss-card .value { font-size: 32px; font-weight: 700; color: #1a1a2e; }
                    .ss-card .value.green { color: #38a169; }
                    .ss-card .value.red { color: #e53e3e; }
                    .ss-table-wrap { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
                    .ss-table-wrap h2 { margin: 0 0 16px; font-size: 16px; }
                    table.ss-table { width: 100%; border-collapse: collapse; }
                    table.ss-table th { text-align: left; padding: 8px 12px; background: #f7f7f7; font-size: 12px; color: #666; text-transform: uppercase; }
                    table.ss-table td { padding: 10px 12px; border-bottom: 1px solid #f0f0f0; font-size: 13px; }
                    .ss-pill { padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 600; }
                    .ss-pill.sqli { background: #fff5f5; color: #c53030; }
                    .ss-pill.xss { background: #fffbeb; color: #b7791f; }
                    .ss-pill.brute { background: #ebf8ff; color: #2b6cb0; }
                    .ss-pill.csrf { background: #f0fff4; color: #276749; }
                    .ss-pill.upload { background: #faf5ff; color: #6b46c1; }
                    .ss-build-notice { background: #ebf8ff; border: 1px solid #bee3f8; border-radius: 8px; padding: 16px; margin-bottom: 24px; font-size: 13px; color: #2b6cb0; }
                </style>

                <?php
                global $wpdb;
                $today = current_time('Y-m-d');

                $attacks_today = (int) $wpdb->get_var(
                    "SELECT COUNT(*) FROM {$wpdb->prefix}ss_attack_logs 
                     WHERE DATE(created_at) = '$today'"
                );

                $blocked_ips = (int) $wpdb->get_var(
                    "SELECT COUNT(*) FROM {$wpdb->prefix}ss_ip_reputation 
                     WHERE status = 'blocked'"
                );

                $total_attacks = (int) $wpdb->get_var(
                    "SELECT COUNT(*) FROM {$wpdb->prefix}ss_attack_logs"
                );

                $score = max(0, 100 - ($attacks_today * 2));

                $recent_logs = $wpdb->get_results(
                    "SELECT * FROM {$wpdb->prefix}ss_attack_logs 
                     ORDER BY created_at DESC LIMIT 10"
                );
                ?>

                <div class="ss-temp">
                    <div class="ss-header">
                        <h1>🛡️ ShieldSync Security</h1>
                        <span class="ss-badge">ACTIVE</span>
                    </div>

                    <div class="ss-build-notice">
                        ⚡ <strong>React dashboard not built yet.</strong> 
                        Run <code>cd dashboard && npm run build</code> inside your plugin folder to enable the full dashboard.
                        Showing live data below in the meantime.
                    </div>

                    <div class="ss-cards">
                        <div class="ss-card">
                            <h3>Security Score</h3>
                            <div class="value <?php echo $score > 70 ? 'green' : 'red'; ?>">
                                <?php echo $score; ?>/100
                            </div>
                        </div>
                        <div class="ss-card">
                            <h3>Attacks Today</h3>
                            <div class="value <?php echo $attacks_today > 0 ? 'red' : 'green'; ?>">
                                <?php echo $attacks_today; ?>
                            </div>
                        </div>
                        <div class="ss-card">
                            <h3>Blocked IPs</h3>
                            <div class="value"><?php echo $blocked_ips; ?></div>
                        </div>
                        <div class="ss-card">
                            <h3>Total Attacks Blocked</h3>
                            <div class="value"><?php echo $total_attacks; ?></div>
                        </div>
                    </div>

                    <div class="ss-table-wrap">
                        <h2>Recent Attack Log</h2>
                        <table class="ss-table">
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>IP Address</th>
                                    <th>Attack Type</th>
                                    <th>Threat Score</th>
                                    <th>URL</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if ( empty($recent_logs) ): ?>
                                <tr>
                                    <td colspan="5" style="text-align:center;color:#999;padding:30px;">
                                        ✅ No attacks logged yet — your site is clean!
                                    </td>
                                </tr>
                                <?php else: ?>
                                <?php foreach ( $recent_logs as $log ): ?>
                                <?php
                                $type_class = match( strtolower($log->attack_type) ) {
                                    'sql injection' => 'sqli',
                                    'xss attack'    => 'xss',
                                    'brute force'   => 'brute',
                                    'csrf attack'   => 'csrf',
                                    'malicious upload' => 'upload',
                                    default         => 'sqli'
                                };
                                ?>
                                <tr>
                                    <td><?php echo esc_html( human_time_diff( strtotime($log->created_at) ) . ' ago' ); ?></td>
                                    <td><code><?php echo esc_html($log->ip_address); ?></code></td>
                                    <td><span class="ss-pill <?php echo $type_class; ?>"><?php echo esc_html($log->attack_type); ?></span></td>
                                    <td><?php echo esc_html($log->threat_score); ?>/100</td>
                                    <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                                        <?php echo esc_html($log->request_uri); ?>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
                <?php endif; ?>

            </div>
        </div>
        <?php
    }
}
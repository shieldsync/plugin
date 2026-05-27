<?php
/**
 * Plugin Name: ShieldSync Security
 * Plugin URI:  https://getshieldsync.com
 * Description: WordPress Firewall & Intrusion Prevention System
 * Version:     1.0.0
 * Author:      ShieldSync
 * Author URI:  https://getshieldsync.com
 * License:     GPL-2.0+
 * Text Domain: shield-sync
 */

if ( ! defined( 'ABSPATH' ) ) exit;

define( 'SHIELD_SYNC_VERSION', '1.0.0' );
define( 'SHIELD_SYNC_PATH', plugin_dir_path( __FILE__ ) );
define( 'SHIELD_SYNC_URL', plugin_dir_url( __FILE__ ) );

require_once SHIELD_SYNC_PATH . 'src/Activator/Activator.php';
require_once SHIELD_SYNC_PATH . 'src/Admin/RestApi.php';
//require_once SHIELD_SYNC_PATH . 'src/Admin/Dashboard.php';

register_activation_hook( __FILE__, ['ShieldSync\Activator\Activator', 'activate'] );

add_action( 'plugins_loaded', function() {
    ShieldSync\Admin\RestApi::register();

});
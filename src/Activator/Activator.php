<?php
namespace ShieldSync\Activator;

class Activator {
    public static function activate() {
        self::create_tables();
    }

    private static function create_tables() {
        global $wpdb;
        $charset = $wpdb->get_charset_collate();

        $wpdb->query("
            CREATE TABLE IF NOT EXISTS {$wpdb->prefix}ss_attack_logs (
                id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                ip_address VARCHAR(45) NOT NULL,
                attack_type VARCHAR(50) NOT NULL,
                threat_score TINYINT UNSIGNED NOT NULL,
                request_uri TEXT,
                blocked TINYINT(1) DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_ip (ip_address),
                INDEX idx_type (attack_type),
                INDEX idx_created (created_at)
            ) $charset
        ");

        $wpdb->query("
            CREATE TABLE IF NOT EXISTS {$wpdb->prefix}ss_ip_reputation (
                id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                ip_address VARCHAR(45) NOT NULL UNIQUE,
                status ENUM('blocked','trusted','monitored') DEFAULT 'monitored',
                threat_score TINYINT UNSIGNED DEFAULT 0,
                hit_count INT UNSIGNED DEFAULT 1,
                source VARCHAR(50) DEFAULT 'local',
                expires_at DATETIME NULL,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_ip (ip_address),
                INDEX idx_status (status)
            ) $charset
        ");

        $wpdb->query("
            CREATE TABLE IF NOT EXISTS {$wpdb->prefix}ss_firewall_rules (
                id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                rule_name VARCHAR(100) NOT NULL,
                rule_type ENUM('block','allow','throttle') DEFAULT 'block',
                pattern TEXT NOT NULL,
                target ENUM('ip','uri','useragent','header') DEFAULT 'ip',
                is_active TINYINT(1) DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            ) $charset
        ");

        update_option('shield_sync_db_version', '1.0.0');
    }
}
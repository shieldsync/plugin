# ShieldSync — WordPress Security Firewall & IPS

> A pre-WordPress Web Application Firewall and Intrusion Prevention System that protects sites before the CMS loads.

[![WordPress Compatible](https://img.shields.io/badge/WordPress-6.0%2B-blue?logo=wordpress)](https://wordpress.org)
[![PHP Version](https://img.shields.io/badge/PHP-8.1%2B-purple?logo=php)](https://php.net)
[![License](https://img.shields.io/badge/License-GPLv2-green)](LICENSE)
[![Plugin Version](https://img.shields.io/badge/Version-1.0.0-orange)]()

---

## Overview

ShieldSync is a WordPress security plugin built to intercept and score HTTP requests before WordPress initializes. The core module delivers open source WAF protections, while the Pro option adds cloud threat intelligence, reputation sharing, and analytics.

---

## Features

### Core WAF (Free)

| Protection | Description |
|---|---|
| SQL Injection | Detects and blocks SQLi patterns in GET, POST, cookies, and headers |
| Cross-Site Scripting (XSS) | Filters XSS attempts across all input vectors |
| Brute Force Protection | Rate-limits login attempts and locks out abusive IPs |
| File Upload Protection | Validates MIME types, strips EXIF data, and filters extensions |
| CSRF Protection | Verifies request nonces for protected actions |
| Bot Detection | Uses UA fingerprinting, reverse DNS checks, and behavioral scoring |
| XML-RPC Protection | Blocks or restricts XML-RPC access |
| Rate Limiting | Configurable per-IP request throttling |

### Pro Features (Cloud Subscription)

- Real-time threat intelligence synchronization
- AI/ML anomaly detection via lightweight ONNX models
- Global IP reputation network with crowdsourced blocks
- Advanced analytics dashboard for traffic and attack trends
- Single-pane multi-site management
- Priority support channel

---

## Architecture

Incoming requests are processed by the mu-plugin WAF before WordPress loads. Each request receives a risk score and is allowed, throttled, challenged, or blocked according to configured policies.

```
Incoming HTTP Request
        │
        ▼
┌─────────────────────┐
│   mu-plugin WAF     │
│   (Hot Path)        │
│   ThreatScorer.php  │
└────────┬────────────┘
         │
    ┌────▼────┐
    │  Score  │  0-100 risk score per request
    └────┬────┘
         │
   ┌─────▼──────┐
   │  Decision  │  Block / Throttle / Challenge / Allow
   └─────┬──────┘
         │
    ┌────▼────────────────┐
    │  Local DB + Cache   │  APCu → Redis → Transients
    └────┬────────────────┘
         │
    ┌────▼────────────────┐     ┌─────────────────────┐
    │  WordPress loads    │────►│  ShieldSync Cloud   │
    │  (safe request)     │     │  (Pro: threat sync) │
    └─────────────────────┘     └─────────────────────┘
```

---

## Installation

### From WordPress.org (Recommended)

1. In WordPress admin, go to **Plugins → Add New**
2. Search for **ShieldSync**
3. Click **Install Now** and **Activate**
4. Open **ShieldSync → Dashboard** to configure

### Manual Installation

```bash
wget https://github.com/shieldsync/plugin/releases/latest/download/shield-sync.zip
unzip shield-sync.zip -d /path/to/wp-content/plugins/
```

Activate the plugin under **Plugins → Installed Plugins**.

### Must-Use Plugin Setup (Recommended)

For the earliest possible request interception, copy the mu-plugin file into `wp-content/mu-plugins/`:

```bash
cp wp-content/plugins/shield-sync/mu-plugin/shield-sync-core.php \
   wp-content/mu-plugins/shield-sync-core.php
```

---

## Requirements

| Requirement | Minimum |
|---|---|
| WordPress | 6.0+ |
| PHP | 8.1+ |
| MySQL | 5.7+ / MariaDB 10.3+ |
| PHP Extensions | `mbstring`, `openssl`, `curl` |

**Recommended for improved performance:**
- APCu
- Redis

---

## Tech Stack

**Plugin repository**
- PHP 8.1+ — WAF engine, detectors, WordPress integration
- React + Vite — Admin dashboard UI
- MySQL — Local threat logs and IP reputation tables

**Central server (private repo)**
- Laravel — REST API for threat intelligence sync
- PostgreSQL — Central threat database
- Redis — High-performance caching
- Laravel Queues — Asynchronous processing

---

## Configuration

After activation, configure ShieldSync from the admin menu:

- Dashboard — live threat feed and security score
- Firewall Rules — allow/block rules
- Attack Detectors — enable or disable detection modules
- IP Management — manual blocklist/allowlist
- Rate Limiting — request thresholds and enforcement
- Logs — detailed event history
- Settings — general, notifications, Pro license, advanced options

---

## Compatibility

ShieldSync includes built-in compatibility rules for popular WordPress plugins:

| Plugin | Compatibility |
|---|---|
| WooCommerce | Automatic allowlist for REST API and AJAX endpoints |
| Elementor | Editor payloads and builder nonces whitelisted |
| WP REST API | Configurable endpoint protection |
| Contact Form 7 | Form submission nonces respected |
| Yoast SEO | Sitemap requests excluded from rate limiting |

---

## Development

### Prerequisites

```bash
composer install
cd dashboard && npm install
```

### Build the dashboard

```bash
cd dashboard
npm run dev
npm run build
```

### Run tests

```bash
composer test
```

### Project structure

```
plugin/
├── mu-plugin/              # WAF hot path (copy to mu-plugins/)
│   └── shield-sync-core.php
├── src/
│   ├── Engine/             # Threat scoring engine
│   ├── Detectors/          # Attack detection modules
│   ├── Firewall/           # IP reputation and rate limiting
│   ├── Sync/               # Cloud threat feed integration
│   ├── Cache/              # APCu/Redis/Transients abstraction
│   ├── Database/           # Installer and migrator
│   └── Admin/              # Dashboard and REST API
├── dashboard/              # React admin UI
├── languages/              # i18n translation files
├── shield-sync.php         # Plugin entry point
├── readme.txt              # WordPress.org readme
└── composer.json
```

---

## Contributing

Contributions are welcome. Please review [docs/contributing.md](docs/contributing.md) before submitting a pull request.

1. Fork the repository
2. Create a branch: `git checkout -b feature/my-new-feature`
3. Commit your changes
4. Push your branch
5. Open a pull request against `main`

### Security disclosures

Do not disclose security vulnerabilities in a public issue. Report them to **security@getshieldsync.com**. We aim to respond within 24 hours.

See [docs/security-policy.md](docs/security-policy.md).

---

## Roadmap

- [ ] v1.0 — Core WAF functionality
- [ ] v1.1 — Admin dashboard with live threat feed
- [ ] v1.2 — Cloud threat intelligence sync (Pro)
- [ ] v1.3 — AI/ML anomaly detection (Pro)
- [ ] v1.4 — Multi-site management dashboard (Pro)
- [ ] v2.0 — Global threat intelligence network

---

## License

ShieldSync core is licensed under the [GNU General Public License v2.0](LICENSE).

The ShieldSync Pro cloud services and central server are proprietary and require a paid subscription.

---

## Links

- Website: [getshieldsync.com](https://getshieldsync.com)
- Documentation: [docs.getshieldsync.com](https://docs.getshieldsync.com)
- Bug Reports: [GitHub Issues](https://github.com/shieldsync/plugin/issues)
- Support: [support@getshieldsync.com](mailto:support@getshieldsync.com)
- Security: [security@getshieldsync.com](mailto:security@getshieldsync.com)

---

<p align="center">Built for the WordPress community</p>

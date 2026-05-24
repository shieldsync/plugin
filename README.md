# 🛡️ ShieldSync — WordPress Security Firewall & IPS

> Real-time WordPress protection against modern cyber threats. Blocks attacks before WordPress fully loads.

[![WordPress Compatible](https://img.shields.io/badge/WordPress-6.0%2B-blue?logo=wordpress)](https://wordpress.org)
[![PHP Version](https://img.shields.io/badge/PHP-8.1%2B-purple?logo=php)](https://php.net)
[![License](https://img.shields.io/badge/License-GPLv2-green)](LICENSE)
[![Plugin Version](https://img.shields.io/badge/Version-1.0.0-orange)]()

---

## What is ShieldSync?

ShieldSync is an intelligent **Web Application Firewall (WAF)** and **Intrusion Prevention System (IPS)** for WordPress. Unlike traditional security plugins that react after an attack, ShieldSync operates at the `mu-plugin` level — intercepting and scoring every HTTP request before WordPress even loads your theme or plugins.

The **Pro tier** connects your site to the ShieldSync cloud threat intelligence network, sharing and receiving real-time IP reputation data, attack signatures, and threat feeds across all protected sites.

---

## Features

### 🔒 Core WAF (Free — Open Source)

| Protection | Description |
|---|---|
| **SQL Injection** | Detects and blocks SQLi patterns in GET, POST, cookies, and headers |
| **XSS** | Filters cross-site scripting attempts across all input vectors |
| **Brute Force** | Rate-limits login attempts with IP-based lockout |
| **File Upload Exploits** | MIME validation, EXIF stripping, extension filtering |
| **CSRF Protection** | Nonce-based request verification |
| **Bot Detection** | UA fingerprinting, reverse DNS validation, behavioral scoring |
| **XML-RPC Abuse** | Block or restrict XML-RPC access |
| **Rate Limiting** | Per-IP request throttling with configurable thresholds |

### ☁️ Pro Features (Cloud Subscription)

- **Real-time threat intelligence sync** — receive IP blocklists and attack signatures within minutes of detection across the network
- **AI/ML anomaly detection** — lightweight ONNX model detects zero-day patterns
- **Global IP reputation network** — crowdsourced threat data from all ShieldSync installations
- **Advanced analytics dashboard** — traffic trends, attack maps, security scoring over time
- **Multi-site management** — manage all your sites from one Pro dashboard
- **Priority support** — dedicated support channel

---

## Architecture

```
Incoming HTTP Request
        │
        ▼
┌─────────────────────┐
│   mu-plugin WAF     │  ← Fires before WordPress loads
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

1. Go to **Plugins → Add New** in your WordPress admin
2. Search for **ShieldSync**
3. Click **Install Now** → **Activate**
4. Navigate to **ShieldSync → Dashboard** to configure

### Manual Installation

```bash
# Download the latest release
wget https://github.com/shieldsync/plugin/releases/latest/download/shield-sync.zip

# Extract to your plugins directory
unzip shield-sync.zip -d /path/to/wp-content/plugins/
```

Then activate via **Plugins → Installed Plugins** in WordPress admin.

### Must-Use Plugin Setup (Recommended for maximum protection)

For the earliest possible request interception, copy the WAF core to your `mu-plugins` directory:

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

**Optional (for better performance):**
- APCu extension (fast IP lookup cache)
- Redis (distributed caching for multi-server setups)

---

## Tech Stack

**Plugin (this repo)**
- PHP 8.1+ — WAF engine, attack detectors, WordPress integration
- React + Vite — Admin dashboard UI
- MySQL — Local threat logs and IP reputation tables

**Central Server ([private repo](https://github.com/shieldsync/server))**
- Laravel (PHP) — REST API for threat intelligence sync
- PostgreSQL — Central threat database
- Redis — High-performance caching
- Laravel Queues — Async threat data processing

---

## Configuration

After activation, visit **ShieldSync → Settings** to configure:

```
ShieldSync
├── Dashboard          ← Live threat feed, security score
├── Firewall Rules     ← Custom allow/block rules
├── Attack Detectors   ← Enable/disable per attack type
├── IP Management      ← Manual blocklist/allowlist
├── Rate Limiting      ← Configure thresholds
├── Logs               ← Full attack log history
└── Settings
    ├── General
    ├── Notifications  ← Email alerts
    ├── Pro License    ← Enter license key
    └── Advanced
```

---

## Plugin Compatibility

ShieldSync ships with built-in compatibility rules for:

| Plugin | Compatibility |
|---|---|
| WooCommerce | ✅ Automatic allowlist for WC REST API and AJAX |
| Elementor | ✅ Editor payloads and builder nonces whitelisted |
| WP REST API | ✅ Configurable endpoint protection |
| Contact Form 7 | ✅ Form submission nonces respected |
| Yoast SEO | ✅ Sitemap requests excluded from rate limiting |

---

## Development

### Prerequisites

```bash
# PHP dependencies
composer install

# Dashboard UI dependencies
cd dashboard && npm install
```

### Build the dashboard

```bash
cd dashboard
npm run dev      # Development with hot reload
npm run build    # Production build
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
│   ├── Firewall/           # IP reputation, rate limiting
│   ├── Sync/               # Cloud threat feed integration
│   ├── Cache/              # APCu/Redis/Transients abstraction
│   ├── Database/           # Table installer and migrator
│   └── Admin/              # Dashboard and REST API
├── dashboard/              # React admin UI
├── languages/              # i18n translation files
├── shield-sync.php         # Plugin entry point
├── readme.txt              # WordPress.org readme
└── composer.json
```

---

## Contributing

Contributions are welcome! Please read our [Contributing Guide](docs/contributing.md) before submitting a pull request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -m 'feat: add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Open a Pull Request against `main`

### Reporting Security Vulnerabilities

Please **do not** open a public GitHub issue for security vulnerabilities. Email us directly at **security@getshieldsync.com** — we aim to respond within 24 hours.

See our full [Security Policy](docs/security-policy.md).

---

## Roadmap

- [ ] v1.0 — Core WAF (SQLi, XSS, Brute Force, File Upload, CSRF)
- [ ] v1.1 — Admin dashboard with live threat feed
- [ ] v1.2 — Cloud threat intelligence sync (Pro)
- [ ] v1.3 — AI/ML anomaly detection (Pro)
- [ ] v1.4 — Multi-site management dashboard (Pro)
- [ ] v2.0 — Global threat intelligence network

---

## License

ShieldSync core is open source software licensed under the [GNU General Public License v2.0](LICENSE) — the same license as WordPress.

The ShieldSync Pro cloud services and central server are proprietary and require a paid subscription.

---

## Links

- 🌐 Website: [getshieldsync.com](https://getshieldsync.com)
- 📖 Documentation: [docs.getshieldsync.com](https://docs.getshieldsync.com)
- 🐛 Bug Reports: [GitHub Issues](https://github.com/shieldsync/plugin/issues)
- 💬 Support: [support@getshieldsync.com](mailto:support@getshieldsync.com)
- 🔒 Security: [security@getshieldsync.com](mailto:security@getshieldsync.com)

---

<p align="center">Built with ❤️ for the WordPress community</p>

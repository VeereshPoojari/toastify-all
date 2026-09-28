# Security Policy

## Supported Versions

We actively maintain and provide security updates for the following versions of `toastify-all`:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

---

## Security Architecture & Design Principles

`toastify-all` is built with a **Zero-Trust, Zero-Dependency** security model for toast notifications across all frontend frameworks:

1. **Context-Aware Safe DOM Insertion**:
   - Notification titles and message contents are rendered via safe DOM APIs (`textContent` or sanitized Nodes), strictly preventing stored and DOM-based Cross-Site Scripting (XSS).
2. **Zero External Runtime Dependencies**:
   - Zero runtime npm dependencies eliminates 100% of third-party supply-chain attacks and malicious dependency vulnerabilities.
3. **Safe Audio Synthesis**:
   - Audio chimes utilize the native browser Web Audio API oscillator synthesis, eliminating external audio asset requests and untrusted network loads.
4. **Content Security Policy (CSP) Compatibility**:
   - Designed to run cleanly under strict Content Security Policies without requiring `unsafe-eval`.

---

## Reporting a Vulnerability

We take the security of `toastify-all` very seriously. If you discover a security vulnerability, please do **NOT** open a public issue.

Instead, please report it via one of the following channels:

- **GitHub Private Vulnerability Reporting**: [Submit a Security Advisory](https://github.com/VeereshPoojari/toastify-all/security/advisories/new)
- **Email Security Team**: Contact `veeresha3993@gmail.com` with the subject `[SECURITY VULNERABILITY] toastify-all`.

### What to Include in Your Report:
- Detailed steps to reproduce the issue (including reproduction snippets or payloads).
- The version of `toastify-all` and framework/browser environment used.
- Impact assessment of the vulnerability.
- Any suggested mitigations or patches, if available.

### Response SLA:
- **Initial Response**: Within 24–48 hours.
- **Triage & Status Update**: Within 72 hours.
- **Fix & Advisory Release**: Coordinated disclosure within 7–14 days depending on severity.

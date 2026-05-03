# Security Policy

## Supported Versions

The following versions of the project are currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

Security is a top priority for Chunav Saarthi. If you discover a vulnerability, we would like to know about it so we can take steps to address it as quickly as possible.

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them directly to the maintainers via email at:
`security@chunavsaarthi.in` (Placeholder for hackathon)

Please include the following information in your report:
- Description of the vulnerability.
- Steps to reproduce the issue.
- Potential impact.
- Any suggested mitigations.

We will acknowledge receipt of your vulnerability report within 48 hours and strive to send you regular updates about our progress. If you report a vulnerability, we will credit you in our security advisories and release notes, unless you request to remain anonymous.

## Security Features Implemented

As part of our commitment to security, this project includes:
1. **Strict Content Security Policy (CSP)** to mitigate Cross-Site Scripting (XSS).
2. **HTTP Strict Transport Security (HSTS)** to enforce HTTPS.
3. **No hardcoded credentials**: Secrets are injected via secure CI/CD pipelines.
4. **Least Privilege Containerization**: The Docker container runs as a non-root user.
5. **Anti-Clickjacking Headers**: `X-Frame-Options` is set to `DENY`.
6. **Input Sanitization**: Client-side rendering protects against raw DOM injection.

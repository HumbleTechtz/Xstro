# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please **do not create a public issue**. Instead, report it privately by emailing one of the maintainers or opening a private discussion if GitHub discussions are enabled.

- **Email**: [devastro0010@gamil.com]
- **GitHub private security advisory**: [https://github.com/AstroXTeam/whatsapp-bot/security/advisories](https://github.com/AstroXTeam/whatsapp-bot/security/advisories)

We aim to respond within 72 hours. After confirming the issue and preparing a fix, we will coordinate the public disclosure.

## Supported Versions

Only the latest stable branch is supported for security updates.

## Security Best Practices

### Sensitive Information

- **Never share your session credentials, QR codes, or tokens with anyone.**
- **Do not run this bot on untrusted, public, or shared servers.** Unauthorized access can hijack your WhatsApp session.
- **Keep your `.env` and configuration files secure.** These often contain sensitive API keys and credentials.
- **Review any code or plugins you add.** Malicious code can compromise your WhatsApp account or leak data.

### Deployment

- Ensure environment variables (such as `API_KEY`, `USER_NUMBER`, `PROXY`) are stored securely and never committed to the repository.
- Use deployment platforms' secret management tools to store credentials securely.
- Rotate credentials regularly and immediately if you suspect exposure.

### Coding and Dependency Management

- Follow secure coding practices in TypeScript and JavaScript.
- Keep dependencies up to date using tool `pnpm audit`, or GitHub’s Dependabot alerts.
- Regularly review and update the `pnpm-lock.yaml` and remove unused dependencies.
- Avoid using deprecated or unmaintained third-party packages.

### Automated Security

- Enable GitHub security features such as Dependabot alerts and code scanning.
- Run tests and linting before merging code (see contribution guidelines).

### Responsible Use

- Understand that WhatsApp may restrict or ban accounts using automation tools.
- You are solely responsible for the risks and consequences of running this software.

## Incident Response

If you suspect that your deployment or credentials have been compromised:

1. Stop the bot immediately.
2. Review logs and environment for unauthorized access.
3. Logout your WhatsApp session.
4. Rotate all credentials and update your `.env` or deployment secrets.
5. Report the incident to the maintainers if you believe it is a wider project vulnerability.

## Acknowledgement

The maintainers will never ask for your WhatsApp QR code, session, phone number, or any sensitive credentials.

---

For more information, see the [README.md](./README.md) and [CONTRIBUTING.md](./CONTRIBUTING.md).

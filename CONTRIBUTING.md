# Contributing

Thank you for your interest in contributing to Xstro.  
We welcome all types of contributions, including bug reports, new features, improvements, and documentation enhancements. This guide outlines our processes and standards to ensure contributions are effective, secure, and maintainable.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Project Structure](#project-structure)
4. [Types of Contributions](#types-of-contributions)
5. [Development Workflow](#development-workflow)
6. [Coding Standards](#coding-standards)
7. [Testing and Linting](#testing-and-linting)
8. [Pull Request Guidelines](#pull-request-guidelines)
9. [Security Issues](#security-issues)
10. [Community and Support](#community-and-support)

## Code of Conduct

Participation in this project requires adherence to our [Code of Conduct](CODE_OF_CONDUCT.md). All contributors are expected to foster an open, welcoming, and respectful environment.

## Getting Started

1. **Fork and Clone**

   - Fork this repository on GitHub and clone your fork to your local machine:
     ```bash
     git clone https://github.com/<your-username>/whatsapp-bot.git
     cd whatsapp-bot
     ```

2. **Set Up the Environment**

   - Install dependencies using [pnpm](https://pnpm.io/):
     ```bash
     pnpm install
     ```
   - Copy `.env.example` to `.env` and provide the required environment variables.

3. **Run the Bot**
   - For development:
     ```bash
     pnpm dev
     ```
   - For production:
     ```bash
     pnpm start
     ```

## Project Structure

- `src/` — Core source code and event/message handlers
- `plugins/` — Official and user-contributed plugins/commands
- `docs/` — Additional documentation
- `tests/` — Test suite
- `.env.example` — Example environment variables
- `pnpm-lock.yaml` — Dependency lockfile

Further details are available in [README.md](./README.md) and [docs/USAGE.md](./docs/USAGE.md).

## Types of Contributions

You may contribute in the following ways:

- **Bug Reports:** File an issue if you identify a bug.
- **Feature Requests:** Propose new features or improvements.
- **Code Contributions:** Implement features, fix bugs, refactor code, or improve performance.
- **Plugins:** Add new plugins or commands in the `plugins/` directory.
- **Documentation:** Improve existing documentation or add new content.
- **Tests:** Write or enhance automated tests.

## Development Workflow

1. **Create a Branch**

   - Create a branch for your feature or fix:
     ```bash
     git checkout -b feature/your-feature
     ```

2. **Implement Changes**

   - Write your code, following the standards outlined below.
   - Update or add tests as appropriate.

3. **Test Locally**

   - Run linting and tests before committing:
     ```bash
     pnpm lint
     pnpm test
     ```

4. **Commit Changes**

   - Use clear and descriptive commit messages.
   - Example: `fix(plugin): resolve issue with group join events handling`

5. **Push and Open a Pull Request**

   - Push your branch to your fork and open a Pull Request (PR) against the `stable` branch.
   - Complete the PR template and clearly describe your changes.

6. **Respond to Feedback**
   - Address comments and suggestions from maintainers and reviewers in a timely manner.

## Coding Standards

- Use **TypeScript** for all new code in `src/` and `plugins/`.
- Adhere to the existing project structure and file organization.
- Maintain consistent naming and coding style throughout your contribution.
- Include JSDoc/type annotations where appropriate.
- Avoid introducing unnecessary dependencies.
- Never commit sensitive information (API keys, credentials, etc.).

## Testing and Linting

- Lint your code with:
  ```bash
  pnpm lint
  ```
- Run tests (if available) with:
  ```bash
  pnpm test
  ```
- Ensure new features or fixes are accompanied by relevant tests.

## Pull Request Guidelines

- Pull requests should target the `stable` branch.
- Focus each PR on a single topic (bugfix, feature, documentation, etc.).
- Reference related issues in your PR description.
- Clearly explain what your PR changes and the reasons for the changes.
- Provide test instructions or reproduction steps where applicable.
- Do not merge your PR yourself; wait for a maintainer to review and merge.

## Security Issues

If you discover a security vulnerability, do not create a public issue or PR.  
Please follow our [Security Policy](SECURITY.md) for responsible disclosure procedures.

## Community and Support

- For questions or proposals, open a discussion (if enabled).
- Contact maintainers for direct assistance if needed.
- Engage respectfully and constructively in all interactions.

Thank you for contributing to the improvement of this WhatsApp automation tool.

# `xstro`

> [!IMPORTANT]
> **Use at Your Own Risk**
>
> WhatsApp’s [Terms of Service](https://www.whatsapp.com/legal/terms-of-service) **explicitly prohibit the use of unauthorized third-party automation tools** that interact with its platform. This includes bots, automation frameworks, and reverse-engineered clients. **Violations can result in permanent bans or legal action.**
>
> Be vigilant against scammers and social engineering. The project maintainers will **never ask for your WhatsApp session or credentials**.
> For full security information and user responsibilities, see [Security Notice](#security-notice).
>
> By using this project, you acknowledge and accept all associated risks and liabilities.

<div align="center">
  <img src="https://avatars.githubusercontent.com/u/188756392?s=200&v=4" height="96" alt="xstro logo" />
  <h3>Open Source WhatsApp Automation via Baileys Web API Client</h3>
  <p>
    <a href="https://github.com/AstroXTeam/whatsapp-bot/actions"><img src="https://img.shields.io/github/actions/workflow/status/AstroXTeam/whatsapp-bot/docker-image.yml?branch=stable&style=flat-square" alt="CI Status" /></a>
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="License" /></a>
    <a href="https://github.com/WhiskeySockets/Baileys"><img src="https://img.shields.io/badge/Baileys-Web%20API-orange?style=flat-square" alt="Powered by Baileys" /></a>
  </p>
  <p>
    <strong>Simple, open-source, and fast WhatsApp automation for developers and teams.</strong>
  </p>
</div>

## Overview

**xstro** is an open-source WhatsApp automation tool utilizing the [Baileys Web API Client](https://github.com/WhiskeySockets/Baileys) to send, receive, manage, and process WhatsApp messages and events.  
It is designed to provide a straightforward and reliable way to automate WhatsApp interactions for personal and small project usage.

- Written in TypeScript for reliability and maintainability.
- No cloud or third-party accounts are required; you control your session and data.
- MIT licensed.

## Table of Contents

- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Configuration](#configuration)
- [Usage](#usage)
- [Features](#features)
- [Development](#development)
- [Contributing](#contributing)
- [Security Notice](#security-notice)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v23 or newer required)
- [pnpm](https://pnpm.io/) and [yarn](https://yarnpkg.com/) (both required for dependency management)
- [ffmpeg](https://ffmpeg.org/) (required for some media features)

### Installation

```bash
# Install pnpm and yarn globally if you do not have them
npm i -g pnpm yarn

# Clone the repository (using the stable branch)
git clone --branch stable https://github.com/AstroXTeam/whatsapp-bot.git
cd whatsapp-bot

# Install dependencies
pnpm install
```

## Deployment

> [!NOTE]
> After deployment, a WhatsApp pairing code will appear in your logs or terminal. Scan it with your WhatsApp mobile app to link your session and activate the bot.

Deploy easily on these platforms, or use your own server:

<div align="center">

  <a href="https://www.heroku.com/deploy?template=https://github.com/AstroX11/Xstro" target="_blank"><img src="https://img.shields.io/badge/-Heroku-black?style=for-the-badge&logo=heroku&logoColor=white" alt="Deploy to Heroku"></a>
  <a href="https://app.koyeb.com/deploy?name=xstro&repository=AstroX11%2FXstro&branch=stable&builder=dockerfile" target="_blank"><img src="https://img.shields.io/badge/-Koyeb-black?style=for-the-badge&logo=koyeb&logoColor=white" alt="Deploy to Koyeb"></a>
  <a href="https://render.com/deploy?repo=https://github.com/AstroX11/Xstro" target="_blank"><img src="https://img.shields.io/badge/-Render-black?style=for-the-badge&logo=render&logoColor=white" alt="Deploy to Render"></a>
  <a href="https://pterodactyl.io/" target="_blank"><img src="https://img.shields.io/badge/-Panel-black?style=for-the-badge&logo=pterodactyl&logoColor=white" alt="Deploy on Pterodactyl"></a>
  <a href="https://replit.com/github/AstroX11/Xstro" target="_blank"><img src="https://img.shields.io/badge/-Replit-black?style=for-the-badge&logo=Replit&logoColor=white" alt="Run on Replit"></a>
</div>

### Manual Start (VPS/Ubuntu/Windows)

1. Follow the installation steps above.
2. Set up your configuration as shown below.
3. Start the bot:

   ```bash
   pnpm start
   ```

## Configuration

1. **Environment Variables**

   Generate a `.env.example` file automatically from `config.mjs`:

   ```bash
   node config.mjs --gen-env-example
   ```

   This will create a `.env.example` file containing all required environment variables and descriptions.

2. **Customization**

   - Most logic and handlers can be modified in the [`src/`](src/) directory.
   - You can add custom modules or plugins for your use case.
   - For more advanced configuration, see comments in the source files.

## Usage

Start the bot:

```bash
pnpm start
```

- A pairing code or QR code will appear in your terminal or logs. Scan this on WhatsApp to authenticate your device.
- The bot will start and listen for messages, events, or commands as defined in your configuration.

For more usage examples and advanced options, see [`docs/USAGE.md`](docs/USAGE.md) if available.

## Features

- **Send & Receive Messages:** Automate replies or notifications.
- **Group Messaging:** Send messages to groups you manage or participate in.
- **Media Support:** Send and receive images, stickers, audio, and documents (requires ffmpeg for some features).
- **Custom Scripting:** Add your own logic or plugins in the `src/` directory.
- **Simple Deployment:** Run on Heroku, Koyeb, Render, Replit, Pterodactyl, or your own VPS.
- **No Data Collection:** Your credentials and sessions are always local to your deployment.

> **Note:** Feature set may evolve over time. See the project source and workflow status for updates.

## Development

### Project Structure

```
.
├── src/           # Core source code and handlers
├── plugins/       # Optional plugins and extensions
├── docs/          # Documentation (if available)
├── .env.example   # Example environment configuration (auto-generated)
└── ...
```

### Scripts

- `pnpm start` – Start the bot in production mode
- `pnpm dev` – Start in development mode (auto-reloads if configured)
- `pnpm test` – Run test suite if available

## Contributing

We welcome and appreciate contributions from the community!  
If you have ideas, improvements, bugfixes, or want to add new features, please follow the steps below:

1. **Read the Guidelines**
   - Please review our [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines, and our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for community standards.

2. **Getting Started**
   - Fork this repository and clone it to your local machine.
   - Create a new branch for your feature or fix:  
     ```bash
     git checkout -b feature/my-feature
     ```
   - Make your changes, write clear commit messages, and include tests if possible.

3. **Linting & Testing**
   - Run `pnpm lint` (mandatory) to ensure your code meets formatting and style guidelines.
   - Run `pnpm test` (if available) to ensure nothing is broken and your contribution is stable.

4. **Pull Requests Only**
   - Once your changes are ready, push your branch to your fork and open a Pull Request (PR) against the `stable` branch.
   - Clearly describe what your PR changes, reference any related context, and include steps to reproduce or test if applicable.
   - Be responsive to feedback and willing to make necessary adjustments.
   - Only Pull Requests are considered for changes; issues and discussions are currently disabled.

**Thank you! Your contributions are what drive this project forward.**

## Security Notice

Security is critical when using automation tools that interact with private accounts and data.

- **Never share your session credentials, QR codes, or tokens with anyone.**
- **Do not run this bot on untrusted, public, or shared servers.** Your WhatsApp session can be hijacked if unauthorized parties access your deployment or log files.
- **Keep your `.env` and configuration files secure.** These files may contain sensitive information.
- **Always review any code or plugins you add.** Malicious code can compromise your WhatsApp account, leak your data, or perform unwanted actions.
- **Understand the risks:** WhatsApp may permanently ban or restrict accounts using automation tools. You are solely responsible for any consequences resulting from your use of this project.
- The maintainers of this project will never ask for your WhatsApp QR code, session, phone number, or any sensitive credentials.
- If you ever suspect a security issue or have concerns, immediately stop the bot, review your environment, and reset your WhatsApp session.

By using this tool, you agree to accept all risks and responsibilities that come with automation.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

**[Baileys](https://github.com/WhiskeySockets/Baileys)**  
**[Node.js](https://nodejs.org/)**  
**[TypeScript](https://www.typescriptlang.org/)**  
**[ffmpeg](https://ffmpeg.org/)**  
**[Baileys](https://github.com/WhiskeySockets/Baileys)**

**Made with 💙 <a href="https://github.com/AstroX11" target="_blank"><strong>AstroX11</strong></a>
<img src="https://avatars.githubusercontent.com/u/188756392?s=200&v=4" alt="AstroX11" width="24" height="24" style="border-radius: 50%; vertical-align: middle;"/>**

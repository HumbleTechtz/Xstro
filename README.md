# `xstro`

> [!IMPORTANT]
> WhatsApp’s [Terms of Service](https://www.whatsapp.com/legal/terms-of-service) **explicitly prohibit the use of unauthorized third-party automation tools** that interact with its platform. This includes bots, automation frameworks, and reverse-engineered clients. **Violations can result in permanent bans or legal action.**
> By using this project, you acknowledge and accept all associated risks and liabilities.

<div align="center">
  <img src="https://avatars.githubusercontent.com/u/188756392?s=200&v=4" height="96" alt="xstro logo" />
  <h4>Xstro is an Open Source WhatsApp Automation that has the ability to send, receive, manage, and process WhatsApp messages and events. It provides a reliable way to automate WhatsApp interactions for personal and small project usage.</h4>
  <p>
    <a href="https://github.com/AstroXTeam/whatsapp-bot/actions"><img src="https://img.shields.io/github/actions/workflow/status/AstroXTeam/whatsapp-bot/docker-image.yml?branch=stable&style=flat-square" alt="CI Status" /></a>
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="License" /></a>
    <a href="https://github.com/WhiskeySockets/Baileys"><img src="https://img.shields.io/badge/Baileys-Web%20API-orange?style=flat-square" alt="Powered by Baileys" /></a>
  </p>
</div>

## Getting Started

#### Prerequisites (Windows | VPS)

- [Node.js 24](https://nodejs.org/)
- [Ffmpeg](https://ffmpeg.org/)

```bash
npm i -g pnpm yarn
git clone --branch stable https://github.com/AstroXTeam/whatsapp-bot.git
cd whatsapp-bot
pnpm install
```

## Features

- **Send & Receive Messages:** Automate replies or notifications.
- **Group Messaging:** Send messages to groups you manage or participate in.
- **Media Support:** Send and receive images, stickers, audio, and documents (requires ffmpeg for some features).
- **Custom Scripting:** Add your own logic or plugins in the `src/` directory.
- **Simple Deployment:** Run on Heroku, Koyeb, Render, Replit, Pterodactyl, or your own VPS.
- **No Data Collection:** Your credentials and sessions are always local to your deployment.

> **Note:** Feature set will evolve over time.

## Deployment

> [!NOTE]
> Before Deployment ensure you put in your Phone Number in the `USER_NUMBER` variable, once `pnpm` installation is complete, a pair code would appear and you will use it to connect your account to the robot.

Deploy easily on these platforms, or use your own server:

<div align="center">

<a href="#heroku" target="_blank"><img src="https://img.shields.io/badge/-Heroku-black?style=for-the-badge&logo=heroku&logoColor=white" alt="Deploy to Heroku"></a>
<a href="https://app.koyeb.com/deploy?name=xstro&repository=AstroX11%2FXstro&branch=stable&builder=dockerfile" target="_blank"><img src="https://img.shields.io/badge/-Koyeb-black?style=for-the-badge&logo=koyeb&logoColor=white" alt="Deploy to Koyeb"></a>
<a href="https://render.com/deploy?repo=https://github.com/AstroX11/Xstro" target="_blank"><img src="https://img.shields.io/badge/-Render-black?style=for-the-badge&logo=render&logoColor=white" alt="Deploy to Render"></a>
<a href="https://pterodactyl.io/" target="_blank"><img src="https://img.shields.io/badge/-Panel-black?style=for-the-badge&logo=pterodactyl&logoColor=white" alt="Deploy on Pterodactyl"></a>
<a href="https://replit.com/github/AstroX11/Xstro" target="_blank"><img src="https://img.shields.io/badge/-Replit-black?style=for-the-badge&logo=Replit&logoColor=white" alt="Run on Replit"></a>

</div>

### Heroku

1. Create an [Heroku Account](https://heroku.com) if you don't have one.
2. Watch a Tutorial On how to [Deploy to heroku](https://github.com/AstroX11/deploy-videos/raw/refs/heads/main/heroku.mp4)
3. [Click Here to Deploy](https://www.heroku.com/deploy?template=https://github.com/AstroX11/Xstro)

### Panel Pterodactyl Server

1. Download the panel deployment file [here.](https://github.com/AstroX11/deploy-videos/raw/refs/heads/main/deploy.zip)
2. Ensure you have created [Pterodactyl Account](https://pterodactyl.io/)
3. Create your server and [Watch a Tutorial](https://github.com/AstroX11/deploy-videos/raw/refs/heads/main/help.mp4) if you don't know how to deploy on it.

### Manual Start (VPS/Ubuntu/Windows)

1. Follow the installation steps above.
2. Set up your configuration as shown below.
3. Start the bot:

   ```bash
   pnpm start
   ```

## Configuration

1. **Environment Variables**

   Create a `config.env` file or rename the existing `config.env.example` to `config.env`:

   ```bash
   USER_NUMBER=1234567890
   OWNER_NAME=AstroX11
   BOT_NAME=Xstro
   PROXY=156.228.115.84:3128
   PORT=8080
   DEBUG=false
   ```

   Edit the existing values to your needs.

2. **Customization**

   - Most logic and handlers can be modified in the [`src/`](src/) directory.
   - You can add custom modules or plugins for your use case.
   - For more advanced configuration, see comments in the source files.

## Contributing

We welcome and appreciate contributions from the community!  
If you have ideas, improvements, bugfixes, or want to add new features, please follow the steps below:
Please review our [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines, and our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for community standards.

**Thank you! Your contributions are what drive this project forward.**

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

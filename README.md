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
> Before deployment, set your Phone Number in the `USER_NUMBER` variable. After `pnpm` installation, a pair code will appear for connecting your account to the robot.

Choose a deployment platform below. Click a button to proceed with account creation, documentation, tutorials, or one-click deployment. Each button opens the relevant site or guide.

### Heroku

<div align="left">

<a href="https://heroku.com" target="_blank"><img src="https://img.shields.io/badge/Create%20Heroku%20Account-7056bf?style=for-the-badge&logo=heroku&logoColor=white&labelWidth=240&height=40" alt="Create Heroku Account"></a><br>
<a href="https://github.com/AstroX11/deploy-videos/raw/refs/heads/main/heroku.mp4" target="_blank"><img src="https://img.shields.io/badge/Heroku%20Tutorial-7056bf?style=for-the-badge&logo=heroku&logoColor=white&labelWidth=240&height=40" alt="Heroku Tutorial"></a><br>
<a href="https://www.heroku.com/deploy?template=https://github.com/AstroX11/Xstro" target="_blank"><img src="https://img.shields.io/badge/Deploy%20to%20Heroku-7056bf?style=for-the-badge&logo=heroku&logoColor=white&labelWidth=240&height=40" alt="Deploy to Heroku"></a>

</div>

### Koyeb

<div align="left">

<a href="https://app.koyeb.com/" target="_blank"><img src="https://img.shields.io/badge/Create%20Koyeb%20Account-24292f?style=for-the-badge&logo=koyeb&logoColor=white&labelWidth=240&height=40" alt="Create Koyeb Account"></a><br>
<a href="https://app.koyeb.com/deploy?name=whatsapp-bot&repository=AstroXTeam%2Fwhatsapp-bot&branch=stable&builder=dockerfile&instance_type=free&instances_min=0&autoscaling_sleep_idle_delay=300&env%5BUSER_NUMBER%5D=&env%5BOWNER_NAME%5D=&env%5BBOT_NAME%5D=&env%5BPORT%5D=8000" target="_blank"><img src="https://img.shields.io/badge/Deploy%20on%20Koyeb-24292f?style=for-the-badge&logo=koyeb&logoColor=white&labelWidth=240&height=40" alt="Deploy on Koyeb"></a><br>
<a href="https://docs.koyeb.com/" target="_blank"><img src="https://img.shields.io/badge/Koyeb%20Docs-24292f?style=for-the-badge&logo=koyeb&logoColor=white&labelWidth=240&height=40" alt="Koyeb Docs"></a>

</div>

### Render

<div align="left">

<a href="https://render.com/" target="_blank"><img src="https://img.shields.io/badge/Create%20Render%20Account-000000?style=for-the-badge&logo=render&logoColor=white&labelWidth=240&height=40" alt="Create Render Account"></a><br>
<a href="https://render.com/deploy?repo=https://github.com/AstroX11/Xstro" target="_blank"><img src="https://img.shields.io/badge/Deploy%20on%20Render-000000?style=for-the-badge&logo=render&logoColor=white&labelWidth=240&height=40" alt="Deploy on Render"></a><br>
<a href="https://render.com/docs" target="_blank"><img src="https://img.shields.io/badge/Render%20Docs-000000?style=for-the-badge&logo=render&logoColor=white&labelWidth=240&height=40" alt="Render Docs"></a>

</div>

### Panel Pterodactyl Server

<div align="left">

<a href="https://github.com/AstroX11/deploy-videos/raw/refs/heads/main/deploy.zip" target="_blank"><img src="https://img.shields.io/badge/Download%20Panel%20Deploy%20File-181d2b?style=for-the-badge&logo=pterodactyl&logoColor=white&labelWidth=240&height=40" alt="Download Panel Deploy File"></a><br>
<a href="https://pterodactyl.io/" target="_blank"><img src="https://img.shields.io/badge/Create%20Pterodactyl%20Account-181d2b?style=for-the-badge&logo=pterodactyl&logoColor=white&labelWidth=240&height=40" alt="Create Pterodactyl Account"></a><br>
<a href="https://github.com/AstroX11/deploy-videos/raw/refs/heads/main/help.mp4" target="_blank"><img src="https://img.shields.io/badge/Panel%20Tutorial-181d2b?style=for-the-badge&logo=pterodactyl&logoColor=white&labelWidth=240&height=40" alt="Panel Tutorial"></a>

</div>

### Replit

<div align="left">

<a href="https://replit.com/" target="_blank"><img src="https://img.shields.io/badge/Create%20Replit%20Account-667881?style=for-the-badge&logo=Replit&logoColor=white&labelWidth=240&height=40" alt="Create Replit Account"></a><br>
<a href="https://replit.com/github/AstroX11/Xstro" target="_blank"><img src="https://img.shields.io/badge/Run%20on%20Replit-667881?style=for-the-badge&logo=Replit&logoColor=white&labelWidth=240&height=40" alt="Run on Replit"></a><br>
<a href="https://docs.replit.com/" target="_blank"><img src="https://img.shields.io/badge/Replit%20Docs-667881?style=for-the-badge&logo=Replit&logoColor=white&labelWidth=240&height=40" alt="Replit Docs"></a>

</div>

### Railway

<div align="left">

<a href="https://railway.app/" target="_blank"><img src="https://img.shields.io/badge/Create%20Railway%20Account-191724?style=for-the-badge&logo=railway&logoColor=white&labelWidth=240&height=40" alt="Create Railway Account"></a><br>
<a href="https://railway.app/new/template?template=https://github.com/AstroX11/Xstro" target="_blank"><img src="https://img.shields.io/badge/Deploy%20on%20Railway-191724?style=for-the-badge&logo=railway&logoColor=white&labelWidth=240&height=40" alt="Deploy on Railway"></a><br>
<a href="https://docs.railway.app/" target="_blank"><img src="https://img.shields.io/badge/Railway%20Docs-191724?style=for-the-badge&logo=railway&logoColor=white&labelWidth=240&height=40" alt="Railway Docs"></a>

</div>

### Fly.io

<div align="left">

<a href="https://fly.io/" target="_blank"><img src="https://img.shields.io/badge/Create%20Fly.io%20Account-000000?style=for-the-badge&logo=flydotio&logoColor=white&labelWidth=240&height=40" alt="Create Fly.io Account"></a><br>
<a href="https://fly.io/docs/" target="_blank"><img src="https://img.shields.io/badge/Fly.io%20Docs-000000?style=for-the-badge&logo=flydotio&logoColor=white&labelWidth=240&height=40" alt="Fly.io Docs"></a>

</div>

### Vercel

<div align="left">

<a href="https://vercel.com/" target="_blank"><img src="https://img.shields.io/badge/Create%20Vercel%20Account-000000?style=for-the-badge&logo=vercel&logoColor=white&labelWidth=240&height=40" alt="Create Vercel Account"></a><br>
<a href="https://vercel.com/docs" target="_blank"><img src="https://img.shields.io/badge/Vercel%20Docs-000000?style=for-the-badge&logo=vercel&logoColor=white&labelWidth=240&height=40" alt="Vercel Docs"></a>

</div>

### Docker

<div align="left">

<a href="https://hub.docker.com/" target="_blank"><img src="https://img.shields.io/badge/Docker%20Hub-2496ed?style=for-the-badge&logo=docker&logoColor=white&labelWidth=240&height=40" alt="Docker Hub"></a><br>
<a href="https://docs.docker.com/" target="_blank"><img src="https://img.shields.io/badge/Docker%20Docs-2496ed?style=for-the-badge&logo=docker&logoColor=white&labelWidth=240&height=40" alt="Docker Docs"></a>

</div>

- Example Docker usage:

```bash
docker build -t whatsapp-bot .
docker run -e USER_NUMBER=your_number -p 8000:8000 whatsapp-bot
```

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

**Made with 💙 <a href="https://github.com/AstroX11" target="_blank"><strong>AstroX11</strong></a>**

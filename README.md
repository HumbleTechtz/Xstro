<div align="center">
  <img src="https://avatars.githubusercontent.com/u/211725231??s=200v=4" height="96" alt="xstro logo" />
  <p>
    A simple, privacy-focused third-party automation tool designed to send, receive, process, and interact with WhatsApp Web via WebSocket.
  </p>
  <p>
    <a href="https://github.com/AstroX11/whatsapp-bot/actions">
      <img src="https://img.shields.io/github/actions/workflow/status/AstroX11/whatsapp-bot/docker-image.yml?branch=stable&style=flat-square" alt="CI Status" />
    </a>
    <a href="https://opensource.org/licenses/MIT">
      <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="License" />
    </a>
    <a href="https://github.com/WhiskeySockets/Baileys">
      <img src="https://img.shields.io/badge/Baileys-Web%20API-orange?style=flat-square" alt="Powered by Baileys" />
    </a>
  </p>
</div>

## Features

- Send and receive messages
- Group messaging support
- Media handling (images, audio, stickers, docs)
- Extendable with custom scripts
- Easy deployment to any platform
- Fully self-hosted; no data collection

`NOTE: Feature set will evolve over time.`

## Deployment

Before deploying, set your phone number in `USER_NUMBER`. A connection code will appear on first run.

### Heroku

1. If you don’t have a Heroku account, [create one](https://heroku.com).
2. Watch this [Heroku tutorial video](https://github.com/AstroX11/deploy-videos/raw/refs/heads/main/heroku.mp4).
3. Deploy using the [Heroku deploy template](https://www.heroku.com/deploy?template=https://github.com/AstroX11/whatsapp-bot).

### Koyeb

- [Create a Koyeb account](https://app.koyeb.com/).
- [Deploy on Koyeb from repo](https://app.koyeb.com/deploy?name=whatsapp-bot&repository=AstroX11%2Fwhatsapp-bot&branch=stable&builder=dockerfile&instance_type=free).
- See the [Koyeb docs](https://docs.koyeb.com/).

### Render

- [Create a Render account](https://render.com/).
- [Deploy on Render from repo](https://render.com/deploy?repo=https://github.com/AstroX11/whatsapp-bot).
- Read the [Render docs](https://render.com/docs).

### Pterodactyl Panel

- [Download deploy file](https://github.com/AstroX11/deploy-videos/raw/refs/heads/main/deploy.zip).
- Visit the [Pterodactyl docs](https://pterodactyl.io/).
- Watch the [Panel tutorial video](https://github.com/AstroX11/deploy-videos/raw/refs/heads/main/help.mp4).

### Manual Start (VPS / Ubuntu / Windows)

1. Install [Bun](https://bun.sh) and Git

2. Clone the repository:

   ```bash
   git clone https://github.com/AstroX11/whatsapp-bot.git
   cd whatsapp-bot
   ```

3. Create `config.env` with your WhatsApp user number:

   ```env
   USER_NUMBER=your-phone-number-with-country-code
   ```

4. Start the bot:

   ```bash
   bun start
   ```

## Contributing

We welcome and appreciate contributions from the community!  
If you have ideas, improvements, bugfixes, or want to add new features, please follow the steps below:
Please review our [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines, and our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for community standards.

**Thank you! Your contributions are what drive this project forward.**

**Made with 💙 <a href="https://github.com/AstroX11" target="_blank"><strong>AstroX11</strong></a>**

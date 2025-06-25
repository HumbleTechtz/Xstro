### `whatsapp-bot`

A simple, privacy-focused third-party automation tool for sending, receiving, processing, and interacting with WhatsApp Web via WebSocket. It supports group messaging, media handling, and can be extended with custom scripts. Fully self-hosted with you managing literally everything, and easily deployable on any platform.

**Features**

- Send and receive messages
- Group messaging support
- Media handling (images, audio, stickers, docs)
- Extendable with custom scripts
- Easy deployment to any platform

`NOTE: Feature set will evolve over time.`

### Deployment

Before deploying, set your phone number in `USER_NUMBER`. A connection code will appear on first run.

| `config`      | `value`             |
| ------------- | ------------------- |
| `USER_NUMBER` | _(your number)_     |
| `OWNER_NAME`  | _(your name)_       |
| `BOT_NAME`    | _(your bot name)_   |
| `PORT`        | _(http port sever)_ |

#### Heroku

1. _[Create Heroku Account](https://heroku.com)._
2. _[Heroku Tutorial](https://github.com/AstroX11/deploy-videos/raw/refs/heads/main/heroku.mp4)._
3. _[Deploy to Heroku](https://www.heroku.com/deploy?template=https://github.com/AstroX11/whatsapp-bot)._

#### Koyeb

1. _[Create a Koyeb account](https://app.koyeb.com/)._
2. _[Deploy on Koyeb from repo](https://app.koyeb.com/deploy?name=whatsapp-bot&repository=AstroX11%2Fwhatsapp-bot&branch=stable&builder=dockerfile&instance_type=free&instances_min=0&autoscaling_sleep_idle_delay=300&env%5BUSER_NUMBER%5D=)._

#### Render

1. _[Create a Render account](https://render.com/)._
2. _[Deploy on Render from repo](https://render.com/deploy?repo=https://github.com/AstroX11/whatsapp-bot)._

#### Pterodactyl Panel

1. _[Deployment](https://github.com/AstroX11/deploy-videos/raw/refs/heads/main/deploy.zip)._
2. _[Panel Tutorial](https://github.com/AstroX11/deploy-videos/raw/refs/heads/main/help.mp4)._

#### VPS / Ubuntu / Windows

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

_Thank you!._

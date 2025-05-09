# `xstro`

### Getting started

Xstro is a simple, open-source, fast, and reliable WhatsApp automation system that operates via the Baileys Web API to send, receive, manage, and process various WhatsApp-related events.

> ⚠️ **Important**: WhatsApp's Terms of Service prohibit the use of third-party automation tools. Use this project at your own risk.
> Keep yourself away from stupid scammers, and social enginners, I will not ask you for your session of any kind, the moment you chose to use this software you have chosen to manage everything you do with it.

For more information about Baileys, see:
[https://github.com/WhiskeySockets/Baileys](https://github.com/WhiskeySockets/Baileys)

#### Deployment

Once the deployment is complete and the bot starts, it will generate a local pairing code. You’ll be required to enter this code to connect the bot to your WhatsApp account.

<a href='https://www.heroku.com/deploy?template=https://github.com/AstroX11/Xstro' target="_blank"><img alt='DEPLOY' src='https://img.shields.io/badge/-Heroku-black?style=for-the-badge&logo=heroku&logoColor=white'/></a>

<a href='https://app.koyeb.com/deploy?name=xstro&repository=AstroX11%2FXstro&branch=core&builder=dockerfile&instance_type=free&instances_min=0&autoscaling_sleep_idle_delay=300&env%5BUSER_NUMBER%5D=' target="_blank"><img alt='DEPLOY' src='https://img.shields.io/badge/-Koyeb-black?style=for-the-badge&logo=koyeb&logoColor=white'/></a>

<a href='https://render.com/deploy?repo=https://github.com/AstroX11/Xstro' target="_blank"><img alt='DEPLOY' src='https://img.shields.io/badge/-Render-black?style=for-the-badge&logo=render&logoColor=white'/></a>

<a href='https://pterodactyl.io/' target="_blank"><img alt='DEPLOY' src='https://img.shields.io/badge/-Panel-black?style=for-the-badge&logo=pterodactyl&logoColor=white'/></a>

<a href='https://replit.com/github/AstroX11/Xstro' target="_blank"><img alt='DEPLOY' src='https://img.shields.io/badge/-Replit-black?style=for-the-badge&logo=Replit&logoColor=white'/></a>

#### RUN ON VPS/UBUNTU/WINDOWS

1. Install NodeJs, ffmpeg
2. Installation
   ```
   npm i -global pnpm
   git clone https://github.com/AstroX11/Xstro.git
   cd Xstro
   pnpm install
   ```
3. Configuration
   ```
   echo "USER_NUMBER=" > config.env
   ```

- Start
  ```
  pnpm start
  ```
  <br>

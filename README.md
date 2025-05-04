# `xstro`

### Getting started

Xstro is a simple, open-source, fast, and reliable WhatsApp automation system that operates via the Baileys Web API to send, receive, manage, and process various WhatsApp-related events.

> ⚠️ **Important**: WhatsApp's Terms of Service prohibit the use of third-party automation tools. Use this project at your own risk.
> Keep yourself away from stupid scammers, and social enginners, I will not ask you for your session of any kind, the moment you chose to use this software you have chosen to manage everything you do with it.

For more information about Baileys, see:
[https://github.com/WhiskeySockets/Baileys](https://github.com/WhiskeySockets/Baileys)

---

### Deployment for Node.js Platforms

You do not need a so-called _session ID_ to run the bot. Once the deployment is complete and the bot starts, it will generate a local pairing code. You’ll be required to enter this code to connect the bot to your WhatsApp account.

[Heroku](https://www.heroku.com/deploy?template=https://github.com/AstroX11/Xstro)

[Koyeb](https://app.koyeb.com/services/deploy?name=xstro&repository=AstroX11/Xstro&branch=core&builder=dockerfile&instance_type=free&instances_min=0&env[NUMBER]=)

[Render](https://render.com/deploy?repo=https://github.com/AstroX11/Xstro)

[Panel](https://pterodactyl.io/)

[Replit](https://replit.com/github/AstroX11/Xstro)

### Installation

If you are using a local PC to run this, Docker is recommended for isolation and ease of setup.

---

#### **Windows**

- [Download Docker](https://www.docker.com/get-started)

- **Clone the Repository**

```bash
git clone https://github.com/AstroX11/Xstro.git
cd Xstro
```

- **Configurations `.env`**
  Create an `.env` file and fill in the required variables. Most importantly, set your WhatsApp number—without it, the bot won't connect.

```env
NUMBER=yournumber
```

- **Build the Docker Image**

```bash
docker build -t xstro .
```

- **Run the Container**

```bash
docker run -it --rm xstro
```

---

#### **Linux & macOS**

- Ensure Docker is installed. You can follow the [official guide for Linux/macOS](https://docs.docker.com/get-docker/).

- **Clone the Repository**

```bash
git clone https://github.com/AstroX11/Xstro.git
cd Xstro
```

- **Set up the Environment File**

```bash
cp .env.example .env
# Then edit the file with your number
nano .env
```

Make sure your `.env` file contains:

```env
NUMBER=yournumber
```

- **Build the Docker Image**

```bash
docker build -t xstro .
```

- **Run the Container**

```bash
docker run -it --rm xstro
```

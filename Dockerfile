# We are building via Node.js 24 Package
# We Install FFmpeg, Git, and other Tools
# We ensure yarn is installed for Baileys Transpiliation or Build
# Other tools will Support Building packages like Sharp
# We clone and use Pnpm which is the best and most recommmended standard tool
# For Installing packages Effieicently
FROM node:24

RUN apt-get update && apt-get install -y git ffmpeg && rm -rf /var/lib/apt/lists/*

RUN corepack enable && \
	corepack prepare pnpm@latest --activate && \
	corepack prepare yarn@stable --activate

RUN git clone https://github.com/AstroX11/Xstro /Xstro

WORKDIR /Xstro

RUN pnpm install

CMD ["pnpm", "start"]

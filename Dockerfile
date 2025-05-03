FROM node:23

RUN apt-get update && apt-get install -y git ffmpeg && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@latest --activate

RUN git clone https://github.com/AstroX11/Xstro /Xstro

WORKDIR /Xstro

RUN pnpm install

CMD ["pnpm", "start"]

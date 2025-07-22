FROM node:current-bullseye-slim

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y --no-install-recommends git ffmpeg && \
    corepack enable && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN git clone https://github.com/Astrox11/whatsapp-bot.git . && \
    pnpm install

CMD ["pnpm", "start"]

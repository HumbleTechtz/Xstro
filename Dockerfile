FROM node:current-slim

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    ffmpeg \
    curl \
    && corepack enable \
    && npm install -g pnpm \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

RUN git clone https://github.com/Astrox11/whatsapp-bot.git && \
    cd whatsapp-bot && \
    pnpm install

WORKDIR /workspace/whatsapp-bot

CMD [ "pnpm", "start" ]

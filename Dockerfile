FROM node:24.1.0

RUN apt-get update && \
    apt-get install -y git ffmpeg && \
    rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/AstroXTeam/whatsapp-bot /whatsapp-bot

WORKDIR /whatsapp-bot

RUN npm install -g npm@latest pnpm@latest pnpm install

CMD ["pnpm", "start"]

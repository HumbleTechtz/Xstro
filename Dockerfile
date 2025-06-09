FROM node:24.1.0

RUN apt-get update && \
    apt-get install -y \
    git \
    ffmpeg \
    build-essential \
    python3 \
    python3-pip \
    libcairo2-dev \
    libjpeg-dev \
    libpango1.0-dev \
    libgif-dev \
    librsvg2-dev \
    libsqlite3-dev && \
    rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/AstroXTeam/whatsapp-bot /whatsapp-bot

WORKDIR /whatsapp-bot

RUN npm install -g npm@latest pnpm@latest
RUN pnpm install

CMD ["pnpm", "start"]

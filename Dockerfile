FROM oven/bun:latest AS bun
FROM node:lts-slim AS node
FROM oven/bun:latest

RUN apt-get update && \
  apt-get install -y \
  git \
  build-essential \
  ffmpeg \
  libnspr4 \
  libnss3 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libatspi2.0-0 \
  libxcomposite1 \
  libxdamage1 \
  libgtk-3-0 \
  libgstreamer1.0-0 \
  libgtk-4-1 \
  libgraphene-1.0-0 \
  libxslt1.1 \
  libwoff1 \
  libevent-2.1-7 \
  libgstreamer-plugins-base1.0-0 \
  libwebpdemux2 \
  libharfbuzz-icu0 \
  libenchant-2-2 \
  libsecret-1-0 \
  libhyphen0 \
  libmanette-0.2-0 \
  libgles2 \
  && rm -rf /var/lib/apt/lists/*

COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules

RUN git clone https://github.com/AstroX11/whatsapp-bot /whatsapp-bot

WORKDIR /whatsapp-bot

RUN bun install
RUN bunx playwright install

CMD ["bun", "start"]

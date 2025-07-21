FROM node:latest

RUN apt-get update && \
	apt-get install -y \
	git \
	ffmpeg && \
	rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/AstroX11/whatsapp-bot /whatsapp-bot

WORKDIR /whatsapp-bot

RUN pnpm install

CMD ["pnpm", "start"]

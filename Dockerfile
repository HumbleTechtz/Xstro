FROM oven/bun:latest

RUN apt-get update && \
	apt-get install -y \
	git \
	build-essential \
	ffmpeg && \
	rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/AstroX11/whatsapp-bot /whatsapp-bot

WORKDIR /whatsapp-bot

RUN bun install

CMD ["bun", "start"]

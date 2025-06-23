FROM oven/bun:latest

RUN apt-get update && \
	apt-get install -y \
	git \
	build-essential \
	libcairo2-dev \
	libjpeg-dev \
	libpango1.0-dev \
	libgif-dev \
	librsvg2-dev && \
	rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/AstroX11/whatsapp-bot /whatsapp-bot

WORKDIR /whatsapp-bot

RUN bun install

CMD ["bun", "start"]

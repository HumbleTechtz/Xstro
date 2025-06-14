FROM oven/bun:1.1.13

RUN apt-get update && \
	apt-get install -y \
	git \
	build-essential \
	python3 \
	python3-pip \
	libcairo2-dev \
	libjpeg-dev \
	libpango1.0-dev \
	libgif-dev \
	librsvg2-dev && \
	rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/AstroXTeam/whatsapp-bot /whatsapp-bot

WORKDIR /whatsapp-bot

RUN bun install

CMD ["bun", "start"]

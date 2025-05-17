# We are building via Node.js 24 Package
# We install FFmpeg, Git, and other tools
# We ensure Yarn is installed for Baileys transpilation or build
# Other tools will support building packages like Sharp
# We use the latest and most recommended tool — pnpm — for efficient package installs
# We clone the repository and install dependencies using pnpm
# Finally, we start the application using pnpm

FROM node:24
RUN apt-get update && apt-get install -y git ffmpeg && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm@latest yarn@stable
RUN git clone https://github.com/AstroX11/Xstro /Xstro
WORKDIR /Xstro
RUN pnpm install
CMD ["pnpm", "start"]

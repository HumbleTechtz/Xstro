import fs from "fs/promises";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import * as PImage from "pureimage";

const __dirname = dirname(fileURLToPath(import.meta.url));

function fetchPost() {
	return new Promise<string[]>(async (resolvePromise, reject) => {
		try {
			const files = await fs.readdir(resolve(__dirname, "./images"));
			const memes = files
				.filter(file => file.toLowerCase().endsWith(".png"))
				.map(file => file.replace(".png", ""));
			resolvePromise(memes);
		} catch (err) {
			reject(err);
		}
	});
}

export function createMeme(txt: string, actor: string) {
	return new Promise<Buffer>(async (resolve, reject) => {
		try {
			const templates = await fetchPost();

			if (!templates.includes(actor)) {
				throw new Error(
					`Template "${actor}" not found. Available templates: ${templates.join(", ")}`
				);
			}

			const imagePath = join(__dirname, "./images", `${actor}.png`);
			const baseImage = await PImage.decodePNGFromStream(await fs.open(imagePath).then(f => f.createReadStream()));

			const canvas = PImage.make(baseImage.width, baseImage.height);
			const ctx = canvas.getContext("2d");

			ctx.drawImage(baseImage, 0, 0);

			const fontPath = join(__dirname, "Roboto-Regular.ttf");
			const font = PImage.registerFont(fontPath, 'Sans');
			await font.load();

			ctx.fillStyle = "black";
			ctx.font = "20pt Sans";
			ctx.textAlign = "left";

			const wrapText = (
				text: string,
				x: number,
				y: number,
				maxWidth: number,
				lineHeight: number
			) => {
				const words = text.split(" ");
				let line = "";
				let currentY = y;

				for (const word of words) {
					const testLine = line + word + " ";
					const width = ctx.measureText(testLine).width;
					if (width > maxWidth && line) {
						ctx.fillText(line, x, currentY);
						line = word + " ";
						currentY += lineHeight;
					} else {
						line = testLine;
					}
				}
				ctx.fillText(line, x, currentY);
			};

			wrapText(txt, 20, 140, 780, 30);

			const { PassThrough } = await import('stream');
			const stream = new PassThrough();
			PImage.encodePNGToStream(canvas, stream);
			const chunks: Buffer[] = [];
			for await (const chunk of stream) {
				chunks.push(Buffer.from(chunk));
			}
			resolve(Buffer.concat(chunks));
		} catch (err) {
			reject(err);
		}
	});
}

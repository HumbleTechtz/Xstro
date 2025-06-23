import { createCanvas, loadImage } from "canvas";
import fs from "fs/promises";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function fetchPost() {
	return new Promise<string[]>(async (resolvePromise, reject) => {
		try {
			const files = await fs.readdir(resolve(__dirname, "../media"));
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
					`Template "${actor}" not found. Available templates: ${templates.join(
						", "
					)}`
				);
			}

			const canvas = createCanvas(825, 462);
			const ctx = canvas.getContext("2d");
			const image = await loadImage(
				join(__dirname, "../media", `${actor}.png`)
			);
			ctx.drawImage(image, 0, 0);

			Object.assign(ctx, {
				font: "20px Sans-Serif",
				fillStyle: "black",
				textAlign: "left",
				textBaseline: "top",
			});

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
					const { width } = ctx.measureText(testLine);
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
			resolve(canvas.toBuffer("image/png"));
		} catch (err) {
			reject(err);
		}
	});
}

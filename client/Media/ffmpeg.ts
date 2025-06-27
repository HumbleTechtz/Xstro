import ffmpeg from "fluent-ffmpeg";
import { join, parse } from "path";
import { writeFileSync, readFileSync, unlinkSync } from "fs";
import { tmpdir } from "os";
import { randomBytes } from "crypto";

export const ImgToWebp = async (
	input: string | Buffer
): Promise<string | Buffer> => {
	const isBuffer = Buffer.isBuffer(input);
	let inputPath: string;
	let outputPath: string;

	if (isBuffer) {
		const tmpId = randomBytes(6).toString("hex");
		inputPath = join(tmpdir(), `${tmpId}_in`);
		outputPath = join(tmpdir(), `${tmpId}_out.webp`);
		writeFileSync(inputPath, input);
	} else {
		inputPath = input;
		const { dir, name } = parse(input);
		outputPath = join(dir, `${name}.webp`);
	}

	await new Promise((resolve, reject) => {
		ffmpeg(inputPath)
			.outputOptions([
				"-vf",
				"scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000",
				"-pix_fmt yuva420p",
				"-lossless 0",
				"-quality 80",
			])
			.toFormat("webp")
			.output(outputPath)
			.on("end", resolve)
			.on("error", reject)
			.run();
	});

	if (isBuffer) {
		const result = readFileSync(outputPath);
		unlinkSync(inputPath);
		unlinkSync(outputPath);
		return result;
	}

	return outputPath;
};

export const videoToWebp = async (
	input: string | Buffer
): Promise<string | Buffer> => {
	const isBuffer = Buffer.isBuffer(input);
	let inputPath: string;
	let outputPath: string;

	if (isBuffer) {
		const tmpId = randomBytes(6).toString("hex");
		inputPath = join(tmpdir(), `${tmpId}_in.mp4`);
		outputPath = join(tmpdir(), `${tmpId}_out.webp`);
		writeFileSync(inputPath, input);
	} else {
		inputPath = input;
		const { dir, name } = parse(input);
		outputPath = join(dir, `${name}.webp`);
	}

	await new Promise((resolve, reject) => {
		ffmpeg(inputPath)
			.outputOptions([
				"-vf",
				"scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000,fps=15",
				"-pix_fmt yuva420p",
				"-loop 0",
				"-t 5",
				"-an",
			])
			.toFormat("webp")
			.output(outputPath)
			.on("end", resolve)
			.on("error", reject)
			.run();
	});

	if (isBuffer) {
		const result = readFileSync(outputPath);
		unlinkSync(inputPath);
		unlinkSync(outputPath);
		return result;
	}

	return outputPath;
};

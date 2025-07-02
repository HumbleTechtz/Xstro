import ffmpeg from "fluent-ffmpeg";
import { join, parse } from "path";
import { writeFileSync, readFileSync, unlinkSync, existsSync } from "fs";
import { tmpdir } from "os";
import { randomBytes } from "crypto";
import { getBuffer } from "../common";

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

const downloadIfURL = async (
	input: string
): Promise<{ path: string; cleanup: boolean }> => {
	if (/^https?:\/\//.test(input)) {
		const tmpId = randomBytes(6).toString("hex");
		const path = join(tmpdir(), `${tmpId}_in`);
		const buffer = await getBuffer(input);
		writeFileSync(path, Buffer.from(buffer));
		return { path, cleanup: true };
	}
	return { path: input, cleanup: false };
};

/**
 * Converts input to MP3.
 */
export async function toMp3(input: string): Promise<string> {
	const { path: inputPath, cleanup } = await downloadIfURL(input);
	const { dir, name } = parse(inputPath);
	const output = join(dir, `${name}.mp3`);

	await new Promise<void>((resolve, reject) => {
		ffmpeg(inputPath)
			.outputOptions(["-c:a libmp3lame", "-b:a 192k"])
			.toFormat("mp3")
			.output(output)
			.on("end", resolve)
			.on("error", reject)
			.run();
	});

	if (cleanup && existsSync(inputPath)) unlinkSync(inputPath);
	return output;
}

/**
 * Converts input to PTT (.opus).
 */
export async function toPTT(input: string): Promise<string> {
	const { path: inputPath, cleanup } = await downloadIfURL(input);
	const { dir, name } = parse(inputPath);
	const output = join(dir, `${name}.opus`);

	await new Promise<void>((resolve, reject) => {
		ffmpeg(inputPath)
			.audioCodec("libopus")
			.audioChannels(1)
			.audioFrequency(48000)
			.audioBitrate("128k")
			.outputOptions("-application voip")
			.toFormat("opus")
			.output(output)
			.on("end", resolve)
			.on("error", reject)
			.run();
	});

	if (cleanup && existsSync(inputPath)) unlinkSync(inputPath);
	return output;
}

/**
 * Converts input to MP4 video.
 */
export async function toVideo(input: string): Promise<string> {
	const { path: inputPath, cleanup } = await downloadIfURL(input);
	const { dir, name } = parse(inputPath);
	const output = join(dir, `${name}.mp4`);

	await new Promise<void>((resolve, reject) => {
		ffmpeg(inputPath)
			.videoCodec("libx264")
			.audioCodec("aac")
			.outputOptions(["-crf 32", "-preset slow", "-b:a 128k", "-ar 44100"])
			.toFormat("mp4")
			.output(output)
			.on("end", resolve)
			.on("error", reject)
			.run();
	});

	if (cleanup && existsSync(inputPath)) unlinkSync(inputPath);
	return output;
}

interface DataTypeResult {
	mimeType: string;
	contentType: "text" | "audio" | "image" | "video" | "webp" | "document";
	ext: string;
}

const SIGNATURE_MAP = new Map<
	string,
	{ mime: string; type: DataTypeResult["contentType"]; ext: string }
>([
	["ffd8ff", { mime: "image/jpeg", type: "image", ext: "jpg" }],
	["89504e", { mime: "image/png", type: "image", ext: "png" }],
	["474946", { mime: "image/gif", type: "image", ext: "gif" }],
	["52494646", { mime: "image/webp", type: "image", ext: "webp" }],
	["424d", { mime: "image/bmp", type: "image", ext: "bmp" }],
	["49492a00", { mime: "image/tiff", type: "image", ext: "tiff" }],
	["4d4d002a", { mime: "image/tiff", type: "image", ext: "tiff" }],
	["000000", { mime: "video/mp4", type: "video", ext: "mp4" }],
	["1a45dfa3", { mime: "video/webm", type: "video", ext: "webm" }],
	["464c5601", { mime: "video/x-flv", type: "video", ext: "flv" }],
	["000001", { mime: "video/mpeg", type: "video", ext: "mpeg" }],
	["52494646", { mime: "video/avi", type: "video", ext: "avi" }],
	["494433", { mime: "audio/mpeg", type: "audio", ext: "mp3" }],
	["fff3", { mime: "audio/mpeg", type: "audio", ext: "mp3" }],
	["fff2", { mime: "audio/mpeg", type: "audio", ext: "mp3" }],
	["fffb", { mime: "audio/mpeg", type: "audio", ext: "mp3" }],
	["4f676753", { mime: "audio/ogg", type: "audio", ext: "ogg" }],
	["52494646", { mime: "audio/wav", type: "audio", ext: "wav" }],
	["664c6143", { mime: "audio/flac", type: "audio", ext: "flac" }],
	["4d546864", { mime: "audio/midi", type: "audio", ext: "midi" }],
	["25504446", { mime: "application/pdf", type: "document", ext: "pdf" }],
	["504b0304", { mime: "application/zip", type: "document", ext: "zip" }],
	["504b0506", { mime: "application/zip", type: "document", ext: "zip" }],
	["504b0708", { mime: "application/zip", type: "document", ext: "zip" }],
	["d0cf11e0", { mime: "application/msword", type: "document", ext: "doc" }],
	[
		"504b0304",
		{
			mime: "application/vnd.openxmlformats-officedocument",
			type: "document",
			ext: "docx",
		},
	],
	[
		"377abcaf",
		{ mime: "application/x-7z-compressed", type: "document", ext: "7z" },
	],
	["1f8b08", { mime: "application/gzip", type: "document", ext: "gz" }],
	["425a68", { mime: "application/x-bzip2", type: "document", ext: "bz2" }],
	[
		"526172",
		{ mime: "application/x-rar-compressed", type: "document", ext: "rar" },
	],
]);

const TEXT_SIGNATURES = new Set([
	"3c21444f",
	"3c48544d",
	"3c3f786d",
	"7b0a2020",
	"5b0a2020",
	"7b227665",
	"3c737667",
	"23212f62",
	"2f2a2a2a",
]);

function extractSignature(buffer: Buffer, length: number = 4): string {
	return buffer.subarray(0, length).toString("hex").toLowerCase();
}

function detectBySignature(buffer: Buffer): DataTypeResult | null {
	for (let i = 8; i >= 2; i--) {
		const signature = extractSignature(buffer, i);
		const match = SIGNATURE_MAP.get(signature);
		if (match)
			return { mimeType: match.mime, contentType: match.type, ext: match.ext };
	}
	return null;
}

function detectTextContent(buffer: Buffer): boolean {
	const signature = extractSignature(buffer, 4);
	if (TEXT_SIGNATURES.has(signature)) return true;

	const sample = buffer.subarray(0, Math.min(1024, buffer.length));
	const nonPrintable = sample.filter(
		byte => byte < 32 && byte !== 9 && byte !== 10 && byte !== 13
	).length;

	return nonPrintable / sample.length < 0.1;
}

function detectWebPSticker(buffer: Buffer): boolean {
	if (buffer.length < 12) return false;
	const riffHeader = buffer.subarray(0, 4).toString();
	const webpHeader = buffer.subarray(8, 12).toString();
	return riffHeader === "RIFF" && webpHeader === "WEBP";
}

export function getDataType(buffer: Buffer): Promise<DataTypeResult> {
	return new Promise(resolve => {
		if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
			resolve({
				mimeType: "application/octet-stream",
				contentType: "document",
				ext: "bin",
			});
			return;
		}

		if (detectWebPSticker(buffer)) {
			resolve({ mimeType: "image/webp", contentType: "webp", ext: "webp" });
			return;
		}

		const signatureResult = detectBySignature(buffer);
		if (signatureResult) {
			resolve(signatureResult);
			return;
		}

		if (detectTextContent(buffer)) {
			resolve({ mimeType: "text/plain", contentType: "text", ext: "txt" });
			return;
		}

		resolve({
			mimeType: "application/octet-stream",
			contentType: "document",
			ext: "bin",
		});
	});
}

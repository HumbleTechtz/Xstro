interface DataTypeResult {
	mimeType: string;
	contentType: "text" | "audio" | "image" | "video" | "sticker" | "document";
}

const SIGNATURE_MAP = new Map<
	string,
	{ mime: string; type: DataTypeResult["contentType"] }
>([
	["ffd8ff", { mime: "image/jpeg", type: "image" }],
	["89504e", { mime: "image/png", type: "image" }],
	["474946", { mime: "image/gif", type: "image" }],
	["52494646", { mime: "image/webp", type: "image" }],
	["424d", { mime: "image/bmp", type: "image" }],
	["49492a00", { mime: "image/tiff", type: "image" }],
	["4d4d002a", { mime: "image/tiff", type: "image" }],
	["000000", { mime: "video/mp4", type: "video" }],
	["1a45dfa3", { mime: "video/webm", type: "video" }],
	["464c5601", { mime: "video/x-flv", type: "video" }],
	["000001", { mime: "video/mpeg", type: "video" }],
	["52494646", { mime: "video/avi", type: "video" }],
	["494433", { mime: "audio/mpeg", type: "audio" }],
	["fff3", { mime: "audio/mpeg", type: "audio" }],
	["fff2", { mime: "audio/mpeg", type: "audio" }],
	["fffb", { mime: "audio/mpeg", type: "audio" }],
	["4f676753", { mime: "audio/ogg", type: "audio" }],
	["52494646", { mime: "audio/wav", type: "audio" }],
	["664c6143", { mime: "audio/flac", type: "audio" }],
	["4d546864", { mime: "audio/midi", type: "audio" }],
	["25504446", { mime: "application/pdf", type: "document" }],
	["504b0304", { mime: "application/zip", type: "document" }],
	["504b0506", { mime: "application/zip", type: "document" }],
	["504b0708", { mime: "application/zip", type: "document" }],
	["d0cf11e0", { mime: "application/msword", type: "document" }],
	[
		"504b0304",
		{ mime: "application/vnd.openxmlformats-officedocument", type: "document" },
	],
	["377abcaf", { mime: "application/x-7z-compressed", type: "document" }],
	["1f8b08", { mime: "application/gzip", type: "document" }],
	["425a68", { mime: "application/x-bzip2", type: "document" }],
	["526172", { mime: "application/x-rar-compressed", type: "document" }],
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
		if (match) return { mimeType: match.mime, contentType: match.type };
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
			});
			return;
		}

		if (detectWebPSticker(buffer)) {
			resolve({ mimeType: "image/webp", contentType: "sticker" });
			return;
		}

		const signatureResult = detectBySignature(buffer);
		if (signatureResult) {
			resolve(signatureResult);
			return;
		}

		if (detectTextContent(buffer)) {
			resolve({ mimeType: "text/plain", contentType: "text" });
			return;
		}

		resolve({ mimeType: "application/octet-stream", contentType: "document" });
	});
}

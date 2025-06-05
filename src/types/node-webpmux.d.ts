declare module "node-webpmux" {
	export class Image {
		exif: Buffer;
		constructor();
		load(filePath: string | Buffer): Promise<void>;
		save(outputPath?: string): Promise<Buffer>;
	}
}

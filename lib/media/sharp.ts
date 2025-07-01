import sharp from "sharp";

export type FlipDirection = "horizontal" | "vertical" | "left" | "right";

/**
 * Flips or rotates an image in the specified direction.
 * @param input Image buffer or file path.
 * @param direction Flip or rotate direction.
 * @returns Output info.
 */
export const flipImage = async (
	input: Buffer | string,
	direction: FlipDirection
) => {
	let image = sharp(input);

	if (direction === "horizontal") image = image.flop();
	else if (direction === "vertical") image = image.flip();
	else if (direction === "left") image = image.rotate(-90);
	else if (direction === "right") image = image.rotate(90);

	return image.toBuffer()
};
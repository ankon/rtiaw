import { Writable } from 'stream';
import { Color } from './color';

export interface ImageStream {
	readonly width: number;
	readonly height: number;

	writeLine(line: Color[]): void;
	finish(): void;
}

export interface PPMOptions {
	width: number;
	height: number;
	maxColor?: 255;
	gamma?: number;
}

export function ppm(
	out: Writable,
	{ width, height, maxColor = 255, gamma = 2.0 }: PPMOptions
): ImageStream {
	out.write(`P3\n`);
	out.write(`${width} ${height}\n`);
	out.write(`${maxColor}\n`);

	const gammaCorrect: (c: number) => number =
		gamma === 1
			? (c) => c
			: gamma === 2
			? (c) => Math.sqrt(c)
			: (c) => Math.pow(c, 1 / gamma);

	const bytesPerComponent = Math.ceil(Math.log10(maxColor));
	/**
	 * Precalculated mapping for color component value to actual buffer to write
	 *
	 * Note that the values are pre-padded already!
	 */
	const lut: Buffer[] = new Array(maxColor + 1);
	for (let i = 0; i < maxColor + 1; i++) {
		lut[i] = Buffer.from(String(i).padStart(bytesPerComponent));
	}

	/**
	 * Bytes needed to write a single color component
	 *
	 * This has 4 bytes per color component: space/newline after it.
	 */
	const outputBytesPerComponent = bytesPerComponent + 1;

	return {
		get width() {
			return width;
		},
		get height() {
			return height;
		},
		writeLine(line) {
			/** Buffer for constructing a single line to write */
			// We could reuse this, IFF we ensure that the previous content has been written first!
			const lineBuffer = Buffer.alloc(
				width * 3 * outputBytesPerComponent
			);

			let lineBufferIndex = 0;
			for (let i = 0; i < line.length; i++) {
				const c = line[i];
				for (let j = 0; j < 3; j++) {
					const gammaCorrected = gammaCorrect(c[j]);
					const value = Math.floor(maxColor * gammaCorrected);
					const bytes = lut[value];
					lineBuffer.set(bytes, lineBufferIndex);
					lineBuffer.set(
						j === 2 ? [10] : [32],
						lineBufferIndex + bytesPerComponent
					);

					lineBufferIndex += outputBytesPerComponent;
				}
			}
			out.write(lineBuffer);
		},
		async finish() {
			out.end();
		},
	};
}

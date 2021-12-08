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
	return {
		get width() {
			return width;
		},
		get height() {
			return height;
		},
		writeLine(line) {
			for (let i = 0; i < line.length; i++) {
				const c = line[i];
				for (let j = 0; j < 3; j++) {
					const gammaCorrected = gammaCorrect(c[j]);
					const value = Math.floor(255 * gammaCorrected);
					out.write(String(value));
					out.write(' ');
				}
				out.write('\n');
			}
			out.write('\n');
		},
		finish() {},
	};
}

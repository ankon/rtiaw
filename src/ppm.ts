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
}
export function ppm(
	out: Writable,
	{ width, height, maxColor = 255 }: PPMOptions
): ImageStream {
	out.write(`P3\n`);
	out.write(`${width} ${height}\n`);
	out.write(`${maxColor}\n`);

	return {
		get width() {
			return width;
		},
		get height() {
			return height;
		},
		writeLine(line) {
			out.write(
				line
					.map((color) =>
						color.map((c) => Math.floor(255 * c)).join(' ')
					)
					.join('\n')
			);
			out.write('\n');
		},
		finish() {},
	};
}

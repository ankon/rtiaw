import { createWriteStream } from 'fs';
import { Writable } from 'stream';

import { color, Color, colorToString } from './color';
import { DEBUG, makeLogger } from './logger';
import { direction, ray, Ray } from './ray';
import { point3, vec3 } from './vec3';
import { add, scaled, subtract, unit, unscaled, Vector } from './vector';

const logger = makeLogger('index', process.stderr, DEBUG);

/**
 * Linear blend/interpolate between `v1` and `v2`
 *
 * @param v1
 * @param v2
 * @param t
 * @returns
 */
function lerp<N extends number>(
	v1: Vector<N>,
	v2: Vector<N>,
	t: number
): Vector<N> {
	return add(scaled(v1, 1.0 - t), scaled(v2, t));
}

function rayColor(r: Ray<3>): Color {
	const [, y] = unit(direction(r));
	const t = 0.5 * (y + 1.0);
	return lerp(color(1.0, 1.0, 1.0), color(0.5, 0.7, 1.0), t);
}

function createPPM(
	out: Writable,
	{ imageWidth = 256, imageHeight = 256 } = {}
) {
	// TODO: Scene setup
	// Camera
	const aspectRatio = imageWidth / imageHeight;

	const viewportHeight = 2.0;
	const viewportWidth = aspectRatio * viewportHeight;
	const focalLength = 1.0;

	const origin = point3(0, 0, 0);
	const horizontal = vec3(viewportWidth, 0, 0);
	const vertical = vec3(0, viewportHeight, 0);
	const lowerLeftCorner = subtract(
		origin,
		unscaled(horizontal, 2),
		unscaled(vertical, 2),
		vec3(0, 0, focalLength)
	);

	// TODO: Separate out a image buffer
	out.write(`P3\n`);
	out.write(`${imageWidth} ${imageHeight}\n`);
	out.write(`255\n`);

	for (let j = imageHeight - 1; j >= 0; j--) {
		logger.debug(`Remaining ${j}`);
		for (let i = 0; i < imageWidth; i++) {
			const u = i / (imageWidth - 1);
			const v = j / (imageHeight - 1);
			const r = ray(
				origin,
				add(
					lowerLeftCorner,
					scaled(horizontal, u),
					scaled(vertical, v),
					scaled(origin, -1)
				)
			);
			const color = rayColor(r);
			out.write(`${colorToString(color)}\n`);
		}
	}
	logger.debug('Done');
}

function main(out: Writable = process.stdout) {
	const aspectRatio = 16.0 / 9.0;
	const imageWidth = 400;
	const imageHeight = imageWidth / aspectRatio;

	createPPM(out, { imageWidth, imageHeight });
}

main(
	process.argv.length > 2
		? createWriteStream(process.argv[2])
		: process.stdout
);

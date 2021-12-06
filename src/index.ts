import { createWriteStream } from 'fs';
import { Writable } from 'stream';

import { color, Color } from './color';
import { Hit, Hittable } from './hittable';
import { DEBUG, makeLogger } from './logger';
import { ImageStream, ppm } from './ppm';
import { direction, ray, Ray } from './ray';
import { sphere } from './sphere';
import { point3, vec3, x, y, z } from './vec3';
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

/**
 * Determine the color of the given ray
 *
 * @param r
 * @returns
 */
// FIXME: Effectively this is the "setup scene" + "trace the ray" function combined.
function rayColor(hittables: Hittable<3>[], r: Ray<3>): Color {
	const hit: Hit<3> = {
		t: Number.POSITIVE_INFINITY,
		p: point3(0, 0, 0),
		n: point3(0, 0, 1),
		isFrontFace: false,
	};
	for (const hittable of hittables) {
		hittable(r, 0, hit.t, hit);
	}

	if (Number.isFinite(hit.t)) {
		return scaled(color(x(hit.n) + 1, y(hit.n) + 1, z(hit.n) + 1), 0.5);
	}

	// Background color
	const background = unit(direction(r));
	const t = 0.5 * (y(background) + 1.0);
	return lerp(color(1.0, 1.0, 1.0), color(0.5, 0.7, 1.0), t);
}

function render(scene: Hittable<3>[], image: ImageStream) {
	// Camera
	const aspectRatio = image.width / image.height;

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

	// Render line-by-line
	// XXX: This is rendered with a decreasing y (i.e. "bottom up"), which might
	//      be a bit confusing.
	const line: Color[] = new Array(image.width);
	for (let j = image.height - 1; j >= 0; j--) {
		logger.debug(`Remaining ${j}`);
		for (let i = 0; i < image.width; i++) {
			const u = i / (image.width - 1);
			const v = j / (image.height - 1);
			const r = ray(
				origin,
				add(
					lowerLeftCorner,
					scaled(horizontal, u),
					scaled(vertical, v),
					scaled(origin, -1)
				)
			);
			const color = rayColor(scene, r);
			line[i] = color;
		}
		image.writeLine(line);
	}
	image.finish();
	logger.debug('Done');
}

function main(out: Writable = process.stdout) {
	const aspectRatio = 16.0 / 9.0;
	const imageWidth = 400;
	const imageHeight = imageWidth / aspectRatio;

	const image = ppm(out, {
		width: imageWidth,
		height: imageHeight,
	});

	const scene: Hittable<3>[] = [sphere(point3(0, 0, -1), 0.5)];

	render(scene, image);
}

main(
	process.argv.length > 2
		? createWriteStream(process.argv[2])
		: process.stdout
);

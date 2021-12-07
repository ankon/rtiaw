import { createWriteStream } from 'fs';
import { Writable } from 'stream';
import { CastRay } from './camera';

import { color, Color } from './color';
import { Hittable } from './hittable';
import { DEBUG, makeLogger } from './logger';
import { ImageStream, ppm } from './ppm';
import { direction, Ray } from './ray';
import { complexScene } from './scenes';
import { random } from './utils';
import { y } from './vec3';
import {
	add,
	multiply,
	scaled,
	translate,
	unit,
	unscaled,
	Vector,
} from './vector';

const logger = makeLogger('rtiaw', process.stderr, DEBUG);

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

const BLACK = color(0, 0, 0);

/**
 * Determine the color of the given ray
 *
 * @param r
 * @returns
 */
function rayColor(world: Hittable<3>, r: Ray<3>, depth: number): Color {
	if (depth <= 0) {
		return BLACK;
	}

	// 0.0001: Avoid "Shadow Acne"
	const hit = world(r, 0.0001, Number.POSITIVE_INFINITY);
	if (hit) {
		if (!hit.material) {
			throw new Error(`No material on hit`);
		}

		const m = hit.material(r, hit.p, hit.n, hit.isFrontFace);
		if (!m) {
			return BLACK;
		}

		// Follow this ray to its next hit
		const sourceColor = rayColor(world, m.scatteredRay, depth - 1);

		// Combine the source color of the ray with the attenuation of the material
		// TODO: This `multiply` is something one would want to configure.
		return multiply(sourceColor, m.attenuation);
	}

	// Background color
	const background = unit(direction(r));
	const t = 0.5 * (y(background) + 1.0);
	return lerp(color(1.0, 1.0, 1.0), color(0.5, 0.7, 1.0), t);
}

/**
 * Tracer for debugging to show how deep we went
 *
 * @param world
 * @param r
 * @param maxDepth
 * @param depth
 * @returns
 */
function heatColor(
	world: Hittable<3>,
	r: Ray<3>,
	maxDepth: number,
	depth: number
): Color {
	if (depth <= 0) {
		return color(1, 0, 0);
	}

	// 0.0001: Avoid "Shadow Acne"
	const hit = world(r, 0.0001, Number.POSITIVE_INFINITY);
	if (hit) {
		if (!hit.material) {
			throw new Error(`No material on hit`);
		}

		const m = hit.material(r, hit.p, hit.n, hit.isFrontFace);
		if (!m) {
			return color((maxDepth - depth) / maxDepth, 0, 0);
		}

		// Let the color pass through unchanged
		return heatColor(world, m.scatteredRay, maxDepth, depth - 1);
	}

	return color((maxDepth - depth) / maxDepth, 0, 0);
}

interface RenderOptions {
	samplesPerPixel: number;
	maxDepth: number;
	trace: (world: Hittable<3>, r: Ray<3>, depth: number) => Color;
}

function render(
	world: Hittable<3>,
	castRay: CastRay<3>,
	image: ImageStream,
	{
		samplesPerPixel = 1,
		maxDepth = 1,
		trace = rayColor,
	}: Partial<RenderOptions>
) {
	// Render line-by-line
	// XXX: This is rendered with a decreasing y (i.e. "bottom up"), which might
	//      be a bit confusing.
	const line: Color[] = new Array(image.width);
	for (let j = image.height - 1; j >= 0; j--) {
		logger.debug(`Remaining ${j}`);
		for (let i = 0; i < image.width; i++) {
			const pixel = color(0, 0, 0);
			for (let s = 0; s < samplesPerPixel; s++) {
				const u = (i + random()) / (image.width - 1);
				const v = (j + random()) / (image.height - 1);

				const r = castRay(u, v);
				translate(pixel, trace(world, r, maxDepth));
			}
			line[i] = unscaled(pixel, samplesPerPixel);
		}
		image.writeLine(line);
	}
	image.finish();
	logger.debug('Done');
}

function main(out: Writable = process.stdout) {
	const aspectRatio = 3 / 2; // 16.0 / 9.0;
	const imageWidth = 1200; // 400;
	const imageHeight = Math.floor(imageWidth / aspectRatio);

	const image = ppm(out, {
		width: imageWidth,
		height: imageHeight,
	});

	const { world, cam } = complexScene(aspectRatio);

	const samplesPerPixel = 50;
	const maxDepth = 50;
	render(world, cam, image, {
		samplesPerPixel,
		maxDepth,
		trace:
			process.env.DEBUG ?? false
				? (world, r, depth) => heatColor(world, r, maxDepth, depth)
				: rayColor,
	});
}

main(
	process.argv.length > 2
		? createWriteStream(process.argv[2])
		: process.stdout
);

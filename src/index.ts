import { createWriteStream } from 'fs';
import { Writable } from 'stream';
import { camera, CastRay } from './camera';

import { color, Color } from './color';
import { diffuse } from './diffuse';
import { Hit, Hittable, scene } from './hittable';
import { DEBUG, makeLogger } from './logger';
import { ImageStream, ppm } from './ppm';
import { direction, Ray } from './ray';
import { sphere } from './sphere';
import { random } from './utils';
import { point3, y } from './vec3';
import { add, scaled, translate, unit, unscaled, Vector } from './vector';

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

	const hit: Hit<3> = {
		t: Number.POSITIVE_INFINITY,
		p: point3(0, 0, 0),
		n: point3(0, 0, 1),
		isFrontFace: false,
		material: () => undefined,
		// XXX: What's a good default here?
		attenuation: 0.5,
	};

	// 0.0001: Avoid "Shadow Acne"
	world(r, hit, 0.0001, hit.t);

	if (Number.isFinite(hit.t)) {
		if (!hit.material) {
			throw new Error(`No material on hit`);
		}

		const scatteredRay = hit.material(r, hit.p, hit.n);
		if (!scatteredRay) {
			return BLACK;
		}

		// Follow this ray to its next hit, and only attenuate
		// the result of that calculation.
		const sourceColor = rayColor(world, scatteredRay, depth - 1);
		return scaled(sourceColor, hit.attenuation);
	}

	// Background color
	const background = unit(direction(r));
	const t = 0.5 * (y(background) + 1.0);
	return lerp(color(1.0, 1.0, 1.0), color(0.5, 0.7, 1.0), t);
}

function render(
	world: Hittable<3>,
	castRay: CastRay<3>,
	image: ImageStream,
	{ samplesPerPixel = 20, maxDepth = 50 } = {}
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
				translate(pixel, rayColor(world, r, maxDepth));
			}
			line[i] = unscaled(pixel, samplesPerPixel);
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

	// World
	const world: Hittable<3> = scene(
		sphere(point3(0, 0, -1), 0.5, diffuse(), 0.5),
		sphere(point3(0, -100.5, -1), 100, diffuse(), 0.5)
	);

	// Camera
	const viewportHeight = 2.0;
	const viewportWidth = aspectRatio * viewportHeight;
	const cam = camera(point3(0, 0, 0), { viewportWidth, viewportHeight });

	render(world, cam, image);
}

main(
	process.argv.length > 2
		? createWriteStream(process.argv[2])
		: process.stdout
);

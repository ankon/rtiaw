import { camera, CastRay } from './camera';
import { color } from './color';
import { dielectric } from './dielectric';
import { diffuse } from './diffuse';
import { Hittable, scene, named } from './hittable';
import { metal } from './metal';
import { sphere } from './sphere';
import { random } from './utils';
import { point3 } from './vec3';
import { length, multiply, randomVector, subtract, vector } from './vector';

export interface Scene {
	world: Hittable<3>;
	cam: CastRay<3>;
}

export function simpleSceneWith3Spheres(aspectRatio: number): Scene {
	const world: Hittable<3> = scene(
		// Ground
		named(
			sphere(point3(0, -100.5, -1), 100, diffuse(color(0.8, 0.8, 0))),
			'ground'
		),
		// Center
		named(
			sphere(point3(0, 0, -1), 0.5, diffuse(color(0.1, 0.2, 0.5))),
			'center'
		),
		// Left
		named(
			sphere(point3(-1.0, 0, -1), 0.5, dielectric(1.5, color(1, 1, 1))),
			'left'
		),
		named(
			sphere(point3(-1.0, 0, -1), -0.45, dielectric(1.5, color(1, 1, 1))),
			'left_inner'
		),
		// Right
		named(
			sphere(point3(1.0, 0, -1), 0.5, metal(color(0.8, 0.6, 0.2), 0.1)),
			'right'
		)
	);

	// Camera
	const cam = camera(vector(-2, 2, 1), vector(0, 0, -1), 40, {
		aspectRatio,
		aperture: 2.0,
	});

	return { world, cam };
}

export function complexScene(aspectRatio: number): Scene {
	const hittables: Hittable<3>[] = [];

	hittables.push(
		sphere(point3(0, -1000, 0), 1000, diffuse(color(0.5, 0.5, 0.5)))
	);

	for (let a = -11; a < 11; a++) {
		for (let b = -11; b < 11; b++) {
			const choose_mat = random();
			const center = point3(a + 0.9 * random(), 0.2, b + 0.9 * random());

			if (length(subtract(center, point3(4, 0.2, 0))) > 0.9) {
				if (choose_mat < 0.8) {
					// diffuse
					const albedo = multiply(randomVector(3), randomVector(3));
					hittables.push(sphere(center, 0.2, diffuse(albedo)));
				} else if (choose_mat < 0.95) {
					// metal
					const albedo = randomVector(3, 0.5, 1);
					const fuzz = random(0, 0.5);
					hittables.push(sphere(center, 0.2, metal(albedo, fuzz)));
				} else {
					// glass
					hittables.push(sphere(center, 0.2, dielectric(1.5)));
				}
			}
		}
	}

	hittables.push(sphere(point3(0, 1, 0), 1.0, dielectric(1.5)));

	hittables.push(
		sphere(point3(-4, 1, 0), 1.0, diffuse(color(0.4, 0.2, 0.1)))
	);

	hittables.push(
		sphere(point3(4, 1, 0), 1.0, metal(color(0.7, 0.6, 0.5), 0.0))
	);

	const cam = camera(point3(13, 2, 3), point3(0, 0, 0), 20, {
		aspectRatio,
		aperture: 0.1,
		focusDistance: 10,
	});

	return { world: scene(...hittables), cam };
}

import { camera, CastRay } from './camera';
import { color } from './color';
import { dielectric } from './dielectric';
import { diffuse } from './diffuse';
import { Hittable, scene, named } from './hittable';
import { metal } from './metal';
import { sphere } from './sphere';
import { point3 } from './vec3';
import { vector } from './vector';

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

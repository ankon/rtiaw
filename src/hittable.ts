import { DEBUG_MODE } from './debug';
import { Material } from './material';
import { direction, Ray } from './ray';
import { dot, scaled, Vector } from './vector';

export interface Hit {
	p: Vector;
	n: Vector;
	t: number;
	isFrontFace: boolean;
	/** The material that was hit */
	material: Material;
}

/**
 *
 * @param r
 * @param t
 * @param p
 * @param n The normal pointing outwards from the face. This should be unit-length.
 * @param material
 */
export function hit(
	r: Ray,
	t: number,
	p: Vector,
	n: Vector,
	material: Material
): Hit {
	const isFrontFace = dot(direction(r), n) < 0;
	return {
		t,
		p,
		n: isFrontFace ? n : scaled(n, -1),
		isFrontFace,
		material,
	};
}

export type Hittable = (r: Ray, tMin: number, tMax: number) => Hit | undefined;

export function scene(...hittables: Hittable[]): Hittable {
	return (r, tMin, tMax) => {
		let closest: Hit | undefined;
		for (let i = 0; i < hittables.length; i++) {
			const hittable = hittables[i];
			const max = closest ? closest.t : tMax;
			const hit = hittable(r, tMin, max);
			if (hit) {
				if (!closest || hit.t < closest.t) {
					closest = hit;
				}
			}
		}
		return closest;
	};
}

export function named(hittable: Hittable, name: string): Hittable {
	if (!DEBUG_MODE) {
		return hittable;
	}

	return (r, tMin, tMax) => {
		const result = hittable(r, tMin, tMax);
		if (!result) {
			return undefined;
		}

		return { ...result, name };
	};
}

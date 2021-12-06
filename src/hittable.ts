import { Material } from './material';
import { direction, Ray } from './ray';
import { dot, scaled, Vector } from './vector';

export interface Hit<N extends number> {
	p: Vector<N>;
	n: Vector<N>;
	t: number;
	isFrontFace: boolean;
	/** The material that was hit */
	material: Material<N>;
}

/**
 *
 * @param r
 * @param t
 * @param p
 * @param n The normal pointing outwards from the face. This should be unit-length.
 * @param material
 */
export function hit<N extends number>(
	r: Ray<N>,
	t: number,
	p: Vector<N>,
	n: Vector<N>,
	material: Material<N>
): Hit<N> {
	const isFrontFace = dot(direction(r), n) < 0;
	return {
		t,
		p,
		n: isFrontFace ? n : scaled(n, -1),
		isFrontFace,
		material,
	};
}

export type Hittable<N extends number> = (
	r: Ray<N>,
	tMin: number,
	tMax: number
) => Hit<N> | undefined;

export function scene<N extends number>(
	...hittables: Hittable<N>[]
): Hittable<N> {
	return (r, tMin, tMax) => {
		let closest: Hit<N> | undefined;
		for (const hittable of hittables) {
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

export function named<N extends number>(
	hittable: Hittable<N>,
	name: string
): Hittable<N> {
	return (r, tMin, tMax) => {
		const result = hittable(r, tMin, tMax);
		if (!result) {
			return undefined;
		}

		return { ...result, name };
	};
}

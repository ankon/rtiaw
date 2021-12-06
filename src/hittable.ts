import { ScatterRay } from './material';
import { direction, Ray } from './ray';
import { dot, scaled, Vector } from './vector';

export interface Hit<N extends number> {
	p: Vector<N>;
	n: Vector<N>;
	t: number;
	isFrontFace: boolean;
	/** The material that was hit */
	material: ScatterRay<N>;
	/** Attenuation caused by the material */
	attenuation: number;
}

export type Hittable<N extends number> = (
	r: Ray<N>,
	hit: Hit<N>,
	tMin: number,
	tMax: number
) => boolean;

/**
 *
 * @param hit
 * @param r
 * @param n The normal pointing outwards from the face. This should be unit-length.
 */
export function setHitNormal<N extends number>(
	hit: Hit<N>,
	r: Ray<N>,
	n: Vector<N>
): void {
	hit.isFrontFace = dot(direction(r), n) < 0;
	hit.n = hit.isFrontFace ? n : scaled(n, -1);
}

export function scene<N extends number>(
	...hittables: Hittable<N>[]
): Hittable<N> {
	return (r, hit, tMin, tMax) => {
		let result = false;
		for (const hittable of hittables) {
			result ||= hittable(r, hit, tMin, Math.min(hit.t, tMax));
		}
		return result;
	};
}

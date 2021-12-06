import { direction, Ray } from './ray';
import { dot, scaled, Vector } from './vector';

export interface Hit<N extends number> {
	p: Vector<N>;
	n: Vector<N>;
	t: number;
	isFrontFace: boolean;
}

export type Hittable<N extends number> = (
	r: Ray<N>,
	tMin: number,
	tMax: number,
	hit: Hit<N>
) => void;

export function setHitNormal<N extends number>(
	hit: Hit<N>,
	r: Ray<N>,
	n: Vector<N>
): void {
	hit.isFrontFace = dot(direction(r), n) < 0;
	hit.n = hit.isFrontFace ? n : scaled(n, -1);
}

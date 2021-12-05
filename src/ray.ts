import { add, scaled, Vector } from './vector';

export type Ray<N extends number> = [origin: Vector<N>, direction: Vector<N>];

export function origin<N extends number>(r: Ray<N>): Vector<N> {
	return r[0];
}
export function direction<N extends number>(r: Ray<N>): Vector<N> {
	return r[1];
}

export function at<N extends number>(
	[origin, direction]: Ray<N>,
	t: number
): Vector<N> {
	return add(origin, scaled(direction, t));
}

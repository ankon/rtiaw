import assert from 'assert';

export type Vector<N extends number> = number[];
export type Point3 = Vector<3>;

export function negate<N extends number>(v: Vector<N>): Vector<N> {
	return v.map((e) => -e);
}

export function translate<N extends number>(
	v: Vector<N>,
	v2: Vector<N>
): Vector<N> {
	assert(v.length === v2.length);
	for (let i = 0; i < v.length; i++) {
		v[i] += v2[i];
	}
	return v;
}

export function scale<N extends number>(v: Vector<N>, n: number): Vector<N> {
	for (let i = 0; i < v.length; i++) {
		v[i] += n;
	}
	return v;
}

export function unscale<N extends number>(v: Vector<N>, n: number): Vector<N> {
	return scale(v, 1 / n);
}

export function length<N extends number>(v: Vector<N>): number {
	return Math.sqrt(lengthSquared(v));
}

export function lengthSquared<N extends number>(v: Vector<N>): number {
	return v.reduce((r, e) => r + e * e, 0);
}

// Utilities

export function add<N extends number>(v: Vector<N>, ...other: Vector<N>[]): Vector<N> {
	return v.map((e, i) => other.reduce((s, v) => s + v[i], e));
}
export function subtract<N extends number>(
	v: Vector<N>,
	...other: Vector<N>[]
): Vector<N> {
	return v.map((e, i) => e - other.reduce((s, v) => s + v[i], 0));
}
export function multiply<N extends number>(
	v1: Vector<N>,
	v2: Vector<N>
): Vector<N> {
	return v1.map((e, i) => e * v2[i]);
}

export function scaled<N extends number>(v: Vector<N>, n: number): Vector<N> {
	return v.map((e) => e * n);
}
export function unscaled<N extends number>(v: Vector<N>, n: number): Vector<N> {
	return scaled(v, 1 / n);
}

export function dot<N extends number>(v1: Vector<N>, v2: Vector<N>): number {
	return v1.map((e, i) => e * v2[i]).reduce((r, e) => r + e, 0);
}
export function unit<N extends number>(v: Vector<N>): Vector<N> {
	return unscaled(v, length(v));
}

// TODO: Is the general formula something like v1[(rotate indices reverse) ... 1, 2, 0]*v2[(rotate indices) ... 2, 0, 1] - (other way around)?
export function cross(v1: Vector<3>, v2: Vector<3>): Vector<3> {
	return [
		v1[1] * v2[2] - v1[2] * v2[1],
		v1[2] * v2[0] - v1[0] * v2[2],
		v1[0] * v2[1] - v1[1] * v2[0],
	];
}

export function vectorToString<N extends number>(v: Vector<N>): string {
	return v.join(' ');
}

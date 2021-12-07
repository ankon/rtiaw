import assert from 'assert';
import { random } from './utils';

export type Vector = [number, number, number];

export function vector(e0: number, e1: number, e2: number): Vector {
	return [e0, e1, e2];
}

export function randomVector(min = 0, max = 1): Vector {
	return [random(min, max), random(min, max), random(min, max)];
}

export function negate([e0, e1, e2]: Vector): Vector {
	return [-e0, -e1, -e2];
}

export function translate(v: Vector, v2: Vector): Vector {
	assert(v.length === v2.length);
	for (let i = 0; i < v.length; i++) {
		v[i] += v2[i];
	}
	return v;
}

export function scale(v: Vector, n: number): Vector {
	for (let i = 0; i < v.length; i++) {
		v[i] += n;
	}
	return v;
}

export function unscale(v: Vector, n: number): Vector {
	return scale(v, 1 / n);
}

export function length(v: Vector): number {
	return Math.sqrt(lengthSquared(v));
}

export function lengthSquared([e0, e1, e2]: Vector): number {
	return e0 * e0 + e1 * e1 + e2 * e2;
}

// Utilities

export function add(v: Vector, ...other: Vector[]): Vector {
	const result: Vector = [...v];
	for (let i = 0; i < other.length; i++) {
		result[0] += other[i][0];
		result[1] += other[i][1];
		result[2] += other[i][2];
	}
	return result;
}
export function subtract(v: Vector, ...other: Vector[]): Vector {
	const result: Vector = [...v];
	for (let i = 0; i < other.length; i++) {
		result[0] -= other[i][0];
		result[1] -= other[i][1];
		result[2] -= other[i][2];
	}
	return result;
}
export function multiply(v1: Vector, v2: Vector): Vector {
	return [v1[0] * v2[0], v1[1] * v2[1], v1[2] * v2[2]];
}

export function scaled([e0, e1, e2]: Vector, n: number): Vector {
	return [e0 * n, e1 * n, e2 * n];
}
export function unscaled(v: Vector, n: number): Vector {
	return scaled(v, 1 / n);
}

export function dot(v1: Vector, v2: Vector): number {
	return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
}
export function unit(v: Vector): Vector {
	return unscaled(v, length(v));
}

export function nearZero(v: Vector): boolean {
	const s = 1e-8;
	return v.every((e) => Math.abs(e) < s);
}

export function reflect(v: Vector, n: Vector) {
	return subtract(v, scaled(n, 2 * dot(v, n)));
}

export function refract(v: Vector, n: Vector, etaIOverEtaT: number): Vector {
	const cosTheta = Math.min(dot(negate(v), n), 1.0);
	const rPerpendicular = scaled(add(v, scaled(n, cosTheta)), etaIOverEtaT);
	const rParallel = scaled(
		n,
		-Math.sqrt(Math.abs(1.0 - lengthSquared(rPerpendicular)))
	);
	return add(rPerpendicular, rParallel);
}

export function vectorToString(v: Vector): string {
	return v.join(' ');
}

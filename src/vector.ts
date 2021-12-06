import assert from 'assert';
import { random } from './utils';

export type Vector<N extends number> = number[];

export function vector<N extends number>(...e: number[]): Vector<N> {
	return e;
}

export function randomVector<N extends number>(
	n: number,
	min = 0,
	max = 1
): Vector<N> {
	const result = new Array(n);
	for (let i = 0; i < n; i++) {
		result[i] = random(min, max);
	}
	return result;
}

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
	assert(v1.length === v2.length);
	return v1.map((e, i) => e * v2[i]);
}

export function scaled<N extends number>(v: Vector<N>, n: number): Vector<N> {
	return v.map((e) => e * n);
}
export function unscaled<N extends number>(v: Vector<N>, n: number): Vector<N> {
	return scaled(v, 1 / n);
}

export function dot<N extends number>(v1: Vector<N>, v2: Vector<N>): number {
	assert(v1.length === v2.length);
	return v1.map((e, i) => e * v2[i]).reduce((r, e) => r + e, 0);
}
export function unit<N extends number>(v: Vector<N>): Vector<N> {
	return unscaled(v, length(v));
}

export function nearZero<N extends number>(v: Vector<N>): boolean {
	const s = 1e-8;
	return v.every((e) => Math.abs(e) < s);
}

export function vectorToString<N extends number>(v: Vector<N>): string {
	return v.join(' ');
}

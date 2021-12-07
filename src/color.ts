import { vector, Vector } from './vector';

export type Color = Vector;

export function color(r: number, g: number, b: number): Color {
	return vector(r, g, b);
}

export function colorToString([r, g, b]: Color): string {
	return `${Math.floor(255 * r)} ${Math.floor(255 * g)} ${Math.floor(
		255 * b
	)}`;
}

export function clampColor(v: Vector, min = 0, max = 1): Vector {
	return [
		v[0] < min ? min : v[0] > max ? max : v[0],
		v[1] < min ? min : v[1] > max ? max : v[1],
		v[2] < min ? min : v[2] > max ? max : v[2],
	];
}

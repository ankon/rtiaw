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

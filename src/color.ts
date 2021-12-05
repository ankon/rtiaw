import { Vector } from './vector';

export type Color = Vector<3>;

export function colorToString([r, g, b]: Color): string {
	return `${Math.floor(255 * r)} ${Math.floor(255 * g)} ${Math.floor(
		255 * b
	)}`;
}

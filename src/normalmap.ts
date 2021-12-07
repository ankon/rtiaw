import { Color, color } from './color';
import { Point3, x, y, z } from './vec3';
import { Vector, scaled } from './vector';

// TODO: Abstract this further, we don't want to make a color, do we?
export function normalmap(at: Point3, n: Vector): Color {
	return scaled(color(x(n) + 1, y(n) + 1, z(n) + 1), 0.5);
}

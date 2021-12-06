import { direction, origin, Ray } from './ray';
import { Point3 } from './vec3';
import { subtract, dot } from './vector';

export function hitSphere(center: Point3, radius: number, r: Ray<3>): boolean {
	const oc = subtract(origin(r), center);
	const a = dot(direction(r), direction(r));
	const b = 2 * dot(oc, direction(r));
	const c = dot(oc, oc) - radius * radius;
	const discriminant = b * b - 4 * a * c;
	return discriminant > 0;
}
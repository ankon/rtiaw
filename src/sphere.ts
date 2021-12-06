import { direction, origin, Ray } from './ray';
import { Point3 } from './vec3';
import { subtract, dot, lengthSquared } from './vector';

export function hitSphere(center: Point3, radius: number, r: Ray<3>): number {
	const oc = subtract(origin(r), center);
	const a = lengthSquared(direction(r));
	const half_b = dot(oc, direction(r));
	const c = lengthSquared(oc) - radius * radius;
	const discriminant = half_b * half_b - 2 * a * c;
	if (discriminant < 0) {
		return -1.0;
	} else {
		return (-half_b - Math.sqrt(discriminant)) / a;
	}
}

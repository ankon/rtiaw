import { hit, Hittable } from './hittable';
import { Material } from './material';
import { at, direction, origin } from './ray';
import { Point3 } from './vec3';
import { subtract, dot, lengthSquared, unscaled } from './vector';

export function sphere(
	center: Point3,
	radius: number,
	material: Material<3>
): Hittable<3> {
	return (r, tMin, tMax) => {
		const oc = subtract(origin(r), center);
		const a = lengthSquared(direction(r));
		const half_b = dot(oc, direction(r));
		const c = lengthSquared(oc) - radius * radius;
		const discriminant = half_b * half_b - a * c;
		if (discriminant < 0) {
			// Not hitting anything
			return undefined;
		}

		const sqrtd = Math.sqrt(discriminant);
		let t = (-half_b - sqrtd) / a;
		if (t < tMin || t > tMax) {
			// Try the other root of the function
			t = (-half_b + sqrtd) / a;
			if (t < tMin || t > tMax) {
				// Still out of range, ignore
				return undefined;
			}
		}

		// Update the hit: For a value of t along the ray
		// we hit this sphere, at the point p.
		const p = at(r, t);
		const n = unscaled(subtract(p, center), radius);
		return hit(r, t, p, n, material);
	};
}

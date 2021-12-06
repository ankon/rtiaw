import { ray, Ray } from './ray';
import { Point3, vec3 } from './vec3';
import { subtract, unscaled, add, scaled } from './vector';

export type CastRay<N extends number> = (u: number, v: number) => Ray<N>;

export interface CamOptions {
	viewportWidth: number;
	viewportHeight: number;
}

export function camera(
	origin: Point3,
	{ viewportWidth, viewportHeight }: CamOptions
): CastRay<3> {
	const focalLength = 1.0;

	const horizontal = vec3(viewportWidth, 0, 0);
	const vertical = vec3(0, viewportHeight, 0);
	const lowerLeftCorner = subtract(
		origin,
		unscaled(horizontal, 2),
		unscaled(vertical, 2),
		vec3(0, 0, focalLength)
	);

	return (u: number, v: number) => {
		return ray(
			origin,
			add(
				lowerLeftCorner,
				scaled(horizontal, u),
				scaled(vertical, v),
				scaled(origin, -1)
			)
		);
	};
}

import { ray, Ray } from './ray';
import { degreesToRadians } from './utils';
import { cross3, Point3 } from './vec3';
import {
	subtract,
	unscaled,
	add,
	scaled,
	Vector,
	vector,
	unit,
} from './vector';

export type CastRay<N extends number> = (u: number, v: number) => Ray<N>;

export interface CamOptions {
	aspectRatio: number;
	vUp?: Vector<3>;
}

/**
 *
 * @param lookfrom
 * @param lookat
 * @param vup
 * @param vfov vertical field-of-view in degrees
 * @param options
 * @returns
 */
export function camera(
	lookfrom: Point3,
	lookat: Point3,
	vfov: number,
	{ aspectRatio, vUp = vector(0, 1, 0) }: CamOptions
): CastRay<3> {
	const theta = degreesToRadians(vfov);
	const h = Math.tan(theta / 2);
	const viewportHeight = 2.0 * h;
	const viewportWidth = aspectRatio * viewportHeight;

	const w = unit(subtract(lookfrom, lookat));
	const u = unit(cross3(vUp, w));
	const v = cross3(w, u);

	const origin = lookfrom;
	const horizontal = scaled(u, viewportWidth);
	const vertical = scaled(v, viewportHeight);
	const lowerLeftCorner = subtract(
		origin,
		unscaled(horizontal, 2),
		unscaled(vertical, 2),
		w
	);

	return (s: number, t: number) => {
		return ray(
			origin,
			add(
				lowerLeftCorner,
				scaled(horizontal, s),
				scaled(vertical, t),
				scaled(origin, -1)
			)
		);
	};
}

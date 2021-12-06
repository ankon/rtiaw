import { Color } from './color';
import { Material } from './material';
import { direction, ray } from './ray';
import { dot, reflect, unit } from './vector';

export function metal(albedo: Color): Material<3> {
	return (r, at, n) => {
		const d = reflect(unit(direction(r)), n);

		// If this is on the "inside": Don't reflect anything
		if (dot(d, n) <= 0) {
			return undefined;
		}

		return {
			scatteredRay: ray(at, d),
			attenuation: albedo,
		};
	};
}

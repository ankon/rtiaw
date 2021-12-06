import { Color } from './color';
import { Material } from './material';
import { direction, ray } from './ray';
import { randomVectorInUnitSphere } from './utils';
import { dot, reflect, scaled, translate, unit } from './vector';

export function metal(albedo: Color, fuzz: number = 0): Material<3> {
	return (r, at, n) => {
		const d = reflect(unit(direction(r)), n);
		if (fuzz) {
			translate(d, scaled(randomVectorInUnitSphere(3), fuzz));
		}

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

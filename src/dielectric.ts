import { color } from './color';
import { Material } from './material';
import { direction, ray } from './ray';
import { random } from './utils';
import { dot, negate, reflect, refract, unit } from './vector';

function reflectance(cosine: number, refractionIndex: number) {
	// Use Schlick's approximation for reflectance.
	// XXX: [AK] Check the maths here, this is called with the refraction_Ratio_.
	let r0 = (1 - refractionIndex) / (1 + refractionIndex);
	r0 = r0 * r0;
	return r0 + (1 - r0) * Math.pow(1 - cosine, 5);
}

// TODO: The "random()" might want to be a parameter?
export function dielectric(
	refractionIndex: number,
	attenuation = color(1, 1, 1)
): Material {
	return (r, at, n, isFrontFace) => {
		const refractionRatio = isFrontFace
			? 1.0 / refractionIndex
			: refractionIndex;

		const unitDirection = unit(direction(r));

		const cosTheta = Math.min(dot(negate(unitDirection), n), 1.0);
		const sinTheta = Math.sqrt(1.0 - cosTheta * cosTheta);
		const cannotRefract = refractionRatio * sinTheta > 1.0;

		let d;
		if (
			cannotRefract ||
			reflectance(cosTheta, refractionRatio) > random()
		) {
			d = reflect(unitDirection, n);
		} else {
			d = refract(unitDirection, n, refractionRatio);
		}

		const scattered = ray(at, d);
		return {
			scatteredRay: scattered,
			attenuation,
		};
	};
}

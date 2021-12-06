import { Color } from './color';
import { Material } from './material';
import { ray } from './ray';
import { randomVectorInUnitSphere } from './utils';
import { Point3 } from './vec3';
import { Vector, add, unit, dot, negate, subtract, nearZero } from './vector';

export function lazyHackDiffuse(at: Point3, n: Vector<3>): Vector<3> {
	const randomVector = randomVectorInUnitSphere(3);
	return add(at, n, randomVector);
}

export function lambertianDiffuse(at: Point3, n: Vector<3>): Vector<3> {
	const randomVector = randomVectorInUnitSphere(3);
	return add(at, n, unit(randomVector));
}

// "Old school"
export function hemisphericalScatteringDiffuse(
	at: Point3,
	n: Vector<3>
): Vector<3> {
	const randomVector = randomVectorInUnitSphere(3);
	// Check whether this is in the same hemisphere as the normal, otherwise
	// negate it.
	const inHemisphere =
		dot(randomVector, n) > 0.0 ? randomVector : negate(randomVector);
	return add(at, inHemisphere);
}

/**
 * Diffuse material: Sends the ray further in a random direction from the point where it hit the world.
 *
 * @param albedo the natural "color" of this material
 * @param calculateDiffuseTarget
 * @returns
 */
export function diffuse(
	albedo: Color,
	calculateDiffuseTarget = lambertianDiffuse
): Material<3> {
	return (r, at, n) => {
		const target = calculateDiffuseTarget(at, n);
		let d = subtract(target, at);
		if (nearZero(d)) {
			d = n;
		}

		return {
			attenuation: albedo,
			scatteredRay: ray(at, d),
		};
	};
}

import { randomVectorInUnitSphere } from './utils';
import { Point3 } from './vec3';
import { Vector, add, unit, dot, negate } from './vector';

export function lazyHackDiffuse(at: Point3, n: Vector<3>): Vector<3> {
	const randomVector = randomVectorInUnitSphere(3);
	return add(at, n, randomVector);
}

export function lambertianDiffuse(at: Point3, n: Vector<3>): Vector<3> {
	const randomVector = randomVectorInUnitSphere(3);
	return add(at, n, unit(randomVector));
}

// "Old school"
export function hemisphericalScatteringDiffuse(at: Point3, n: Vector<3>): Vector<3> {
	const randomVector = randomVectorInUnitSphere(3);
	// Check whether this is in the same hemisphere as the normal, otherwise
	// negate it.
	const inHemisphere = dot(randomVector, n) > 0.0 ? randomVector : negate(randomVector);
	return add(at, inHemisphere);
}

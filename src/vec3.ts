import { vector, Vector } from './vector';


export function x(p: Vector<3>): number {
	return p[0];
}
export function y(p: Vector<3>): number {
	return p[1];
}
export function z(p: Vector<3>): number {
	return p[2];
}


// TODO: Is the general formula something like v1[(rotate indices reverse) ... 1, 2, 0]*v2[(rotate indices) ... 2, 0, 1] - (other way around)?
export function cross3(v1: Vector<3>, v2: Vector<3>): Vector<3> {
	return [
		v1[1] * v2[2] - v1[2] * v2[1],
		v1[2] * v2[0] - v1[0] * v2[2],
		v1[0] * v2[1] - v1[1] * v2[0],
	];
}

export type Point3 = Vector<3>;
export function point3(x: number, y: number, z: number): Point3 {
	return vector(x, y, z);
}

/** @deprecated Use `vector` directly */
export const vec3 = point3;

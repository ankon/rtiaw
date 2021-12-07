import { add, scaled, Vector } from './vector';

export type Ray = [origin: Vector, direction: Vector];

export function ray(origin: Vector, direction: Vector): Ray {
	return [origin, direction];
}

export function origin(r: Ray): Vector {
	return r[0];
}
export function direction(r: Ray): Vector {
	return r[1];
}

export function at([origin, direction]: Ray, t: number): Vector {
	return add(origin, scaled(direction, t));
}

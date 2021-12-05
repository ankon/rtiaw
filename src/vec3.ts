import { Vector } from './vector';

export type Point3 = Vector<3>;

export function x(p: Point3): number {
	return p[0];
}
export function y(p: Point3): number {
	return p[1];
}
export function z(p: Point3): number {
	return p[2];
}

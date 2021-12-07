import { Color } from './color';
import { Ray } from './ray';
import { Vector } from './vector';

export type Material = (
	r: Ray,
	at: Vector,
	n: Vector,
	isFrontFace: boolean
) => { attenuation: Color; scatteredRay: Ray } | undefined;

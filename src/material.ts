import { Color } from './color';
import { Ray } from './ray';
import { Vector } from './vector';

export type Material<N extends number> = (
	r: Ray<N>,
	at: Vector<N>,
	n: Vector<N>,
	isFrontFace: boolean
) => { attenuation: Color; scatteredRay: Ray<N> } | undefined;

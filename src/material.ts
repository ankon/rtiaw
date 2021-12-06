import { Ray } from './ray';
import { Vector } from './vector';

export type ScatterRay<N extends number> = (
	r: Ray<N>,
	at: Vector<N>,
	n: Vector<N>
) => Ray<N> | undefined;

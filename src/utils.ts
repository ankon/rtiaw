import { lengthSquared, randomVector, vector, Vector } from './vector';

export function degreesToRadians(degrees: number): number {
	return (degrees * Math.PI) / 180.0;
}

export function random(min = 0, max = 1) {
	return Math.random() * (max - min) + min;
}

export function clamp(v: number, min: number, max: number) {
	if (v < min) {
		return min;
	} else if (v > max) {
		return max;
	} else {
		return v;
	}
}

export function randomVectorInUnitSphere<N extends number>(
	n: number
): Vector<N> {
	while (true) {
		const v = randomVector(n, -1, 1);
		if (lengthSquared(v) < 1) {
			return v;
		}
	}
}

export function randomVectorInUnitDisk(): Vector<3> {
	while (true) {
		const v = vector(random(-1, 1), random(-1, 1), 0);
		if (lengthSquared(v) < 1) {
			return v;
		}
	}
}

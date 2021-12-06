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

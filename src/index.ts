import { Writable } from 'stream';

function createPPM(
	out: Writable,
	{ imageWidth = 256, imageHeight = 256 } = {}
) {
	out.write(`P3\n`);
	out.write(`${imageWidth} ${imageHeight}\n`);
	out.write(`255\n`);

	for (let j = imageHeight - 1; j >= 0; j--) {
		for (let i = 0; i < imageWidth; i++) {
			const r = i / (imageWidth - 1);
			const g = j / (imageHeight - 1);
			const b = 0.25;

			out.write(
				`${Math.floor(255 * r)} ${Math.floor(255 * g)} ${Math.floor(
					255 * b
				)}\n`
			);
		}
	}
}

createPPM(process.stdout);

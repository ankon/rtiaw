import { Writable } from 'stream';

import { DEBUG, makeLogger } from './logger';

const logger = makeLogger('index', process.stderr, DEBUG);

function createPPM(
	out: Writable,
	{ imageWidth = 256, imageHeight = 256 } = {}
) {
	out.write(`P3\n`);
	out.write(`${imageWidth} ${imageHeight}\n`);
	out.write(`255\n`);

	for (let j = imageHeight - 1; j >= 0; j--) {
		logger.debug(`Remaining ${j}`);
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
	logger.debug('Done');
}

createPPM(process.stdout);

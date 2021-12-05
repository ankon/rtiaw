import { Writable } from 'stream';

export interface Logger {
	log(message: string, ...args: any[]): void;
	debug(message: string, ...args: any[]): void;
	warn(message: string, ...args: any[]): void;
	error(message: string, ...args: any[]): void;
}

export const DEBUG = 100;
export const INFO = 200;
export const WARN = 300;
export const ERROR = 400;

const LEVEL_NAMES: Record<number, string> = {
	[DEBUG]: 'D',
	[INFO]: 'I',
	[WARN]: 'W',
	[ERROR]: 'E',
};

export function makeLogger(
	name: string,
	out: Writable,
	atLevel: number = INFO
): Logger {
	function format(level: number, message: string, args: any[]): string {
		const other = args.join(' ');
		return `${Date.now()} ${LEVEL_NAMES[level]} ${name} ${message}${
			other ? `[${other}]` : ''
		}\n`;
	}
	function log(level: number, message: string, args: any[]): void {
		if (level >= atLevel) {
			out.write(format(level, message, args));
		}
	}

	return {
		debug(message, ...args) {
			log(DEBUG, message, args);
		},
		log(message, ...args) {
			log(INFO, message, args);
		},
		warn(message, ...args) {
			log(INFO, message, args);
		},
		error(message, ...args) {
			log(INFO, message, args);
		},
	};
}

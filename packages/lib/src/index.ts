export const reverse = <T>(arr: T[]): T[] =>
	[...arr].reverse();

export const sort = <T>(arr: T[], comparator: (a: T, b: T) => number): T[] =>
	[...arr].sort(comparator);

export const isString = (value: unknown): value is string =>
	typeof value === 'string';

export const isNumber = (value: unknown): value is number =>
	typeof value === 'number';

export const isBoolean = (value: unknown): value is boolean =>
	typeof value === 'boolean';
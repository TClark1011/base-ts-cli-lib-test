export const reverse = <T>(arr: T[]): T[] =>
	[...arr].reverse();

export const sort = <T>(arr: T[], comparator: (a: T, b: T) => number): T[] =>
	[...arr].sort(comparator);

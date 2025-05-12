/**
 * Return a sorted copy of an array using the provided comparator function.
 */
export const sort = <T>(arr: T[], comparator: (a: T, b: T) => number): T[] =>
	[...arr].sort(comparator);

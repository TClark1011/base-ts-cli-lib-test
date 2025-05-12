
/**
 * Returns a sorted copy of the given array by comparing
 * the values returned by the provided function.
 */
export const sortBy = <T>(
	arr: T[],
	getKey: (item: T) => string | number | boolean,
): T[] => [...arr].sort((a, b) => {
	const aKey = getKey(a);
	const bKey = getKey(b);

	if (aKey < bKey) return -1;
	if (aKey > bKey) return 1;
	return 0;
})
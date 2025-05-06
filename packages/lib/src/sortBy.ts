
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
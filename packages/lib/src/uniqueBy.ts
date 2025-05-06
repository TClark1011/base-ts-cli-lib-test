
export const uniqueBy = <T>(
	arr: T[],
	getKey: (item: T) => string | number | boolean,
): T[] => {
	const seen = new Set<string | number | boolean>();
	return arr.filter((item) => {
		const key = getKey(item);
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}
/**
 * Returns a copy of the given array with duplicate items removed.
 * Equality is determined using the provided key extractor function.
 */
export const uniqueBy = (arr, getKey) => {
    const seen = new Set();
    return arr.filter((item) => {
        const key = getKey(item);
        if (seen.has(key))
            return false;
        seen.add(key);
        return true;
    });
};

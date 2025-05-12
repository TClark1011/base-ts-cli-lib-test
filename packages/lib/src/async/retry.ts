/**
 * Retries the given function the specified number
 * of times.
 */
export const retry = async <T>(
	fn: () => Promise<T>,
	options: {
		times?: number
		delay?: number | null
		backoff?: (count: number) => number
		// how many ms to wait before retrying
	},
): Promise<T> => {
	const { times = 3, delay = 0, backoff } = options;

	for (let i = 0; i < times; i++) {
		try {
			return await fn();
		} catch (e) {
			if (i === times - 1) {
				throw e;
			}

			if (backoff) {
				await new Promise((resolve) => setTimeout(resolve, backoff(i)));
			} else if (delay) {
				await new Promise((resolve) => setTimeout(resolve, delay));
			}
		}
	}

	throw new Error("Retry failed");
}
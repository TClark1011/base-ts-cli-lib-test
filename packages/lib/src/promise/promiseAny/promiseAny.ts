/**
 * A description of the function.
 */
export const promiseAny = <T>(
	promises: Promise<T>[],
	condition: (value: T) => boolean,
): Promise<boolean> => {
	return new Promise(async (resolve, reject) => {
		promises.forEach(promise => {
			promise.then(value => {
				if (condition(value)) {
					resolve(true)
				}
			})
		})

		await Promise.all(promises);

		resolve(false)
	})
}
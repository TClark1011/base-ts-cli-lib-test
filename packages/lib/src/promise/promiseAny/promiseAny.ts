/**
 * Returns a promise that resolves to true if any of the promises in the array
 * resolves to a value that satisfies the provided condition, otherwise resolves
 * to false. Once a satisfying value is found the function resolves immediately
 * without waiting for the other promises to resolve.
 */
export const promiseAny = <T>(
  promises: Promise<T>[],
  condition: (value: T) => boolean,
): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    promises.forEach((promise) => {
      promise.then((value) => {
        if (condition(value)) {
          resolve(true);
        }
      });
    });

    await Promise.all(promises);

    resolve(false);
  });
};

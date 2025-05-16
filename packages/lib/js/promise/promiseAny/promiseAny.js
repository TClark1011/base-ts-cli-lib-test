/**
 * A description of the function.
 */
export const promiseAny = (promises, condition) => {
    return new Promise(async (resolve, reject) => {
        promises.forEach(promise => {
            promise.then(value => {
                if (condition(value)) {
                    resolve(true);
                }
            });
        });
        await Promise.all(promises);
        resolve(false);
    });
};

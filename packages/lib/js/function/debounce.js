/**
 * Debounce a function
 */
export const debounce = (func, delay) => {
    let timer = undefined;
    let active = true;
    const debounced = (...args) => {
        if (active) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                active && func(...args);
                timer = undefined;
            }, delay);
        }
        else {
            func(...args);
        }
    };
    debounced.isPending = () => {
        return timer !== undefined;
    };
    debounced.cancel = () => {
        active = false;
    };
    debounced.flush = func;
    return debounced;
};

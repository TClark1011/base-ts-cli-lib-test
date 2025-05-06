export const reverse = (arr) => [...arr].reverse();
export const sort = (arr, comparator) => [...arr].sort(comparator);
export const isString = (value) => typeof value === 'string';
export const isNumber = (value) => typeof value === 'number';
export const isBoolean = (value) => typeof value === 'boolean';
export const isNot = (value, guard) => !guard(value);

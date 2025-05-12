/**
 * Determine if a value does *not* match a type guard.
 */
export const isNot = (value, guard) => !guard(value);

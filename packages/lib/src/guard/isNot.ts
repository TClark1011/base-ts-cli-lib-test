/**
 * Determine if a value does *not* match a type guard.
 */
export const isNot = <Base, T extends Base>(
	value: Base,
	guard: (value: Base) => value is T
): value is Exclude<Base, T> => !guard(value);
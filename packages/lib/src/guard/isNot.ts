export const isNot = <Base, T extends Base>(
	value: Base,
	guard: (value: Base) => value is T
): value is Exclude<Base, T> => !guard(value);
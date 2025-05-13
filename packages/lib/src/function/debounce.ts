export type DebouncedFunction<TArgs extends any[]> = {
	(...args: TArgs): void
	/**
	 * Cancels the debounced function
	 */
	cancel(): void
	/**
	 * Checks if there is any invocation debounced
	 */
	isPending(): boolean
	/**
	 * Runs the debounced function immediately
	 */
	flush(...args: TArgs): void
}

/**
 * Debounce a function
 */
export const debounce = <TArgs extends any[]>(
	func: (...args: TArgs) => unknown,
	delay: number,
): DebouncedFunction<TArgs> => {
	let timer: NodeJS.Timeout | undefined = undefined
	let active = true

	const debounced: DebouncedFunction<TArgs> = (...args: TArgs) => {
		if (active) {
			clearTimeout(timer)
			timer = setTimeout(() => {
				active && func(...args)
				timer = undefined
			}, delay)
		} else {
			func(...args)
		}
	}
	debounced.isPending = () => {
		return timer !== undefined
	}
	debounced.cancel = () => {
		active = false
	}
	debounced.flush = func

	return debounced
}

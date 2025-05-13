---
title: retry
---

Retries the given function the specified number
of times.

## Signature

```ts
function retry<T>(fn: () => Promise<T>, options: {
		times?: number
		delay?: number | null
		backoff?: (count: number) => number
		// how many ms to wait before retrying
	}): Promise<T>
```
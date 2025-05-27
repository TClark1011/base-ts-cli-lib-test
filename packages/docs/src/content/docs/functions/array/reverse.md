---
title: reverse
---

Returns a new array with the elements of the provided array in reverse order.
Does not modify the original array.

## Example

```ts
const result = reverse([1, 2, 3]);
result; // [3, 2, 1]
```

## Signature

```ts
function reverse<T>(arr: T[]): T[]
```
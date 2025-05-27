---
title: promiseAny
---

Returns a promise that resolves to true if any of the promises in the array
resolves to a value that satisfies the provided condition, otherwise resolves
to false. Once a satisfying value is found the function resolves immediately
without waiting for the other promises to resolve.

## Example

```ts
let resolvedPromises: number = 0;

promiseAny(
  [
    sleep(10).then(() => {
      resolvedPromises++;
      return 1;
    }),
    sleep(15).then(() => {
      resolvedPromises++;
      return 0;
    }),
    sleep(20).then(() => {
      resolvedPromises++;
      return 0;
    }),
  ],
  (value) => value > 0,
).then((result) => {
  result; // true
  resolvedPromises; // 1
});
```

## Signature

```ts
function promiseAny<T>(promises: Promise<T>[], condition: (value: T) => boolean): Promise<boolean>
```
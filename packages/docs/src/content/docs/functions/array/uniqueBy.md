---
title: uniqueBy
---

Returns a copy of the given array with duplicate items removed.
Equality is determined using the provided key extractor function.

## Signature

```ts
function uniqueBy<T>(arr: T[], getKey: (item: T) => string | number | boolean): T[]
```
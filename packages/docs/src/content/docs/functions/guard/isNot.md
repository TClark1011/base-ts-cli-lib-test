---
title: isNot
---

Determine if a value does *not* match a type guard.

## Signature

```ts
function isNot<Base, T extends Base>(value: Base, guard: (value: Base) => value is T): boolean
```
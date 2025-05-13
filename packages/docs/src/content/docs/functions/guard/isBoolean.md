---
title: isBoolean
---

Determine if a value is a boolean.

## Example

```ts
isBoolean(true); // true
isBoolean({}); // false
isBoolean(false); // true
isBoolean("true"); // false
```

## Signature

```ts
function isBoolean(value: unknown): boolean
```
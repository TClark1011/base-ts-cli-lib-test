---
title: debounce
---

Debounce a function

## Signature

```ts
function debounce<TArgs extends any[]>(func: (...args: TArgs) => unknown, delay: number): {
    (...args: TArgs): void;
    cancel(): void;
    isPending(): boolean;
    flush(...args: TArgs): void;
}
```
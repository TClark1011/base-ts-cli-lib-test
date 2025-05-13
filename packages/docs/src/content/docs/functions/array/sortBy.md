---
title: sortBy
---

Returns a sorted copy of the given array by comparing
the values returned by the provided function.

## Example

```ts
const fruits = [{
	name: 'banana',
	color: 'yellow',
}, {
	name: 'Kiwi',
	color: 'green',
}, {
	name: 'grape',
	color: 'purple',
}]

sortBy(fruits, (f) => f.color)
// [{
// 	name: 'Kiwi',
// 	color: 'green',
// }, {
// 	name: 'grape',
// 	color: 'purple',
// }, {
// 	name: 'banana',
// 	color: 'yellow',
// }]
```

## Signature

```ts
function sortBy<T>(arr: T[], getKey: (item: T) => string | number | boolean): T[]
```
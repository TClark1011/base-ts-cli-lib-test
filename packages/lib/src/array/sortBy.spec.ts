import { describe, it } from "vitest";
import { sortBy } from "./sortBy";
import assert from "node:assert";

describe("sortBy", () => {
	it("Sorts an array of numbers", () => {
		const numbers = [3, 1, 1, 2];

		assert.deepEqual(
			sortBy(numbers, (n) => n),
			[1, 1, 2, 3],
			"Sorting failed"
		);

		assert.deepEqual(
			numbers,
			[3, 1, 1, 2],
			"Original array was mutated"
		);
	});

	it("Sorts an array of objects by a string key", () => {
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

		assert.deepEqual(
			sortBy(fruits, (f) => f.color),
			[{
				name: 'Kiwi',
				color: 'green',
			}, {
				name: 'grape',
				color: 'purple',
			}, {
				name: 'banana',
				color: 'yellow',
			}]
		)
	})
})
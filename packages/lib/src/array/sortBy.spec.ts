import { describe, it } from "node:test";
import { sortBy } from "./sortBy";
import assert from "node:assert";

describe("sortBy", () => {
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
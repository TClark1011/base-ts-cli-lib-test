import { it } from "vitest";
import { reverse } from './array/reverse';
import assert from "node:assert";

it("does not mutate the original array", () => {
	const input = [1, 2, 3];
	reverse(input);

	assert.deepEqual(input, [1, 2, 3]);
})
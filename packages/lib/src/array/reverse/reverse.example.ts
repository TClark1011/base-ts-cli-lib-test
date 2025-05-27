import assert from "node:assert";
import { reverse } from "./reverse";

const result = reverse([1, 2, 3]);
assert.deepEqual(result, [3, 2, 1]);

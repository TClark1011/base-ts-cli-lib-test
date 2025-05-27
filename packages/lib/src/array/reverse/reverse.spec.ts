import { describe, it, expect } from "vitest";
import { reverse } from "./reverse";

describe("reverse", () => {
  it("returns a reversed array", () => {
    const result = reverse([1, 2, 3]);
    expect(result).toEqual([3, 2, 1]);
  });

  it("does not modify the original array", () => {
    const original = [1, 2, 3];
    reverse(original);
    expect(original).toEqual([1, 2, 3]);
  });
});

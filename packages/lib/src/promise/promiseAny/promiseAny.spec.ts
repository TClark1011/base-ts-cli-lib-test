import { describe, it, expect } from "vitest";
import { promiseAny } from "./promiseAny";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("promiseAny", () => {
  it("returns true when any meet condition", async () => {
    const result = await promiseAny(
      [
        sleep(10).then(() => false),
        sleep(10).then(() => true),
        sleep(10).then(() => false),
      ],
      (value) => !!value,
    );

    expect(result).toBe(true);
  });

  it("returns false when none meet condition", async () => {
    const result = await promiseAny(
      [
        sleep(10).then(() => false),
        sleep(10).then(() => false),
        sleep(10).then(() => false),
      ],
      (value) => !!value,
    );

    expect(result).toBe(false);
  });

  it("returns false for an empty array", async () => {
    const result = await promiseAny([], (value) => !!value);
    expect(result).toBe(false);
  });

  it("will not wait for all promises to resolve once satisfied", async () => {
    let secondResolved = false;
    let thirdResolved = false;

    const result = await promiseAny(
      [
        sleep(10).then(() => 1),
        sleep(15).then(() => {
          secondResolved = true;
          return 2;
        }),
        sleep(20).then(() => {
          thirdResolved = true;
          return 3;
        }),
      ],
      (value) => value > 0,
    );
    // once first promise resolves in 100ms and satisfies the condition
    // it should move on without waiting for the other promises to resolve

    expect(result).toBe(true);
    expect(secondResolved, "second promise was waited on").toBe(false);
    expect(thirdResolved, "third promise was waited on").toBe(false);
  });

  it("waits on all promises if none meet condition", async () => {
    let secondResolved = false;
    let thirdResolved = false;

    const result = await promiseAny(
      [
        sleep(10).then(() => 1),
        sleep(15).then(() => {
          secondResolved = true;
          return 2;
        }),
        sleep(20).then(() => {
          thirdResolved = true;
          return 3;
        }),
      ],
      (value) => value > 3,
    );
    // once first promise resolves in 100ms and does not satisfy the condition
    // it should wait for the other promises to resolve

    expect(result).toBe(false);
    expect(secondResolved, "second promise was not waited on").toBe(true);
    expect(thirdResolved, "third promise was not waited on").toBe(true);
  });
});

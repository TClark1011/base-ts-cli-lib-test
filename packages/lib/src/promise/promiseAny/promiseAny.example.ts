import assert from "node:assert";
import { sleep } from "../../utils";
import { promiseAny } from "./promiseAny";

let resolvedPromises: number = 0;

promiseAny(
  [
    sleep(10).then(() => {
      resolvedPromises++;
      return 1;
    }),
    sleep(15).then(() => {
      resolvedPromises++;
      return 0;
    }),
    sleep(20).then(() => {
      resolvedPromises++;
      return 0;
    }),
  ],
  (value) => value > 0,
).then((result) => {
  assert.equal(result, true);
  assert.equal(resolvedPromises, 1);
});

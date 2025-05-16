import { sleep } from "../../src/utils";
import { promiseAny } from "../../src/promise/promiseAny/promiseAny";

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
  result; // true
  resolvedPromises; // 1
});

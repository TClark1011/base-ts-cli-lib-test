import { isBoolean } from "../../src/guard/isBoolean";

isBoolean(true); // true
isBoolean({}); // false
isBoolean(false); // true
isBoolean("true"); // false
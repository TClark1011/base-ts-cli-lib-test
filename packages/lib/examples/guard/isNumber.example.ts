import { isNumber } from '../../src/guard/isNumber';

isNumber(1); // true
isNumber('hello'); // false
isNumber('1'); // false
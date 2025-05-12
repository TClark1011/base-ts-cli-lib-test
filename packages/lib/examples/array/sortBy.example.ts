
import { sortBy } from '../../src/array/sortBy';

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

sortBy(fruits, (f) => f.color)
// [{
// 	name: 'Kiwi',
// 	color: 'green',
// }, {
// 	name: 'grape',
// 	color: 'purple',
// }, {
// 	name: 'banana',
// 	color: 'yellow',
// }]
# Instant
Immutable datetime objects that wrap the native Date class. This package is a work in progress and can throw 'unimplemented' errors.

## Usage
```ts
import Instant from '@twharmon/instant'

const x = new Instant() // x is immutable
const y = x.plus(5, 'days')
console.log(x.format('MMM, D, YYYY')) // Jan 7, 2021
console.log(y.format('MMM, D, YYYY')) // Jan 12, 2021

const z = new Instant('2021-01-07T11:17:42-00:00)
console.log(z.format('h:mm a')) // 11:17 am (if in GMT time zone)
```

## Formatting
The following outputs are based on 2:08:06.123 am January 7, 2021 CDT (Central Daylight Time).

### Year
| Token | Output  |
| ----- | ------- |
| YYYY  | 2021    |
| YY    | 21      |


### Month
| Token | Output  |
| ----- | ------- |
| MMMM  | January |
| MMM   | Jan     |
| MM    | 01      |
| M     | 1       |


### Date
| Token | Output  |
| ----- | ------- |
| DD    | 07      |
| D     | 7       |


### Hour
| Token | Output  |
| ----- | ------- |
| HH    | 14      |
| H     | 14      |
| hh    | 02      |
| h     | 2       |


### Minute
| Token | Output  |
| ----- | ------- |
| mm    | 08      |
| m     | 8       |


### Second
| Token | Output  |
| ----- | ------- |
| ss    | 06      |
| s     | 6       |


### Millisecond
| Token | Output  |
| ----- | ------- |
| SSS   | 123     |
| SS    | 12      |
| S     | 1       |


### AM / PM
| Token | Output  |
| ----- | ------- |
| A     | PM      |
| a     | pm      |


### Time Zone
| Token | Output  |
| ----- | ------- |
| Z     | -06:00  |

## Contibuting
Make a pull request.
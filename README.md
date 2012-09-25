simhash
=======

A node module to calculate the simhash (http://matpalm.com/resemblance/simhash/)

## Installation

```JavaScript
npm install simhash
```

## Example

Simhash is hash that returns similar hash(es) for similar input - in contrast to other hashing algorithms.

```JavaScript
// will use crc32 as crypto algorithm as standard
var simhash1 = require('simhash')();

var result1 = simhash1(['a', 'list', 'of', 'tokens']);
// returns an array of zeros and ones

// you can also define what algorithm to use
var simhash2 = require('simhash')('md5');

var result2 = simhash2(['a', 'list', 'of', 'tokens']);
// result2 is an array of zeros and ones
console.assert(result1 !== result2);
```
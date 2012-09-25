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
var simhash = require('simhash')();

var result1 = simhash(['a', 'list', 'of', 'a', 'couple', 'of', 'tokens']);
// return1 is [0,0,0,1,0,0,1,1,1,0,1,1,0,1,1,0,1,0,0,0,1,1,0,1,0,1,0,1,0,0,1,0]

var result2 = simhash(['a', 'list', 'of', 'a', 'couple', 'of', 'tokens', '!']);
// result2 is [0,0,0,1,0,0,0,1,1,0,0,1,0,1,1,0,1,0,0,0,1,1,0,1,0,1,0,1,0,0,1,0]
```

You can also choose to use another algoritm than the standard crc32 one

```Javascript
var simhash = require('simhash')('md5');

var result = simhash(['a', 'list', 'of', 'a', 'couple', 'of', 'tokens']);
```
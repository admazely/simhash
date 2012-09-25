var crypto = require('crypto');
var crc32 = require('buffer-crc32');

function Simhash(algorithm) {
    // crc32 is the default algorithm
    if (algorithm === 'crc32' || !algorithm) {
        this._hash = crc32;
    } else {
        this._hash = function(buffer) {
            var hash = crypto.createHash(algorithm);
            hash.update(buffer.toString('binary'), 'binary');
            return new Buffer(hash.digest('binary'), 'binary');
        }
    }
    this.hashLength = this._hash(new Buffer('')).length;
}

Simhash.prototype.accumulate = function(buffers) {
    var self = this;
    var accumulated = new Array(this.hashLength * 8);
    for(var i = 0; i < accumulated.length; ++i) {
        accumulated[i] = 0;
    }
    buffers.forEach(function(buffer) {
        for(var i = 0; i < self.hashLength * 8; ++i) {
            var j = i % 8;
            var k = parseInt(i / 8, 10);
            var a = (buffer[k] & (1 << j)) ? 1 : -1;
            accumulated[i] += a;
        }
    });
    return accumulated;
}

Simhash.prototype.hash = function(tokens) {
    var hashed = [];
    for(var i = 0; i < tokens.length; ++i) {
        var token = tokens[i];
        hashed.push(crc32(token));
    }
    var result = this.accumulate(hashed);
    for(var i = 0; i < result.length; ++i) {
        result[i] = result[i] > 0 ? 1 : 0;
    }
    return result;
}

module.exports = function (algorithm) {
    var simhash = new Simhash(algorithm);
    return simhash.hash.bind(simhash);
}

module.exports.Simhash = Simhash;
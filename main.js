var crypto = require('crypto');
var crc32 = require('buffer-crc32');

function Simhash(algorithm) {
    this.algorithm = algorithm;
    // crc32 is the default algorithm
    if (!algorithm) {
        this.algorithm = 'crc32';
    }
    var tmp = this._hashBuffer(new Buffer(''));
    if (typeof(tmp) === 'number') {
        this.hashLength = 32;
    } else {
        this.hashLength = tmp.length * 8;
    }
    this._hashed = [];
}

Simhash.prototype._accumulateNumber = function(input) {
    
}

Simhash.prototype._accumulate = function(input) {
    var self = this;
    var accumulated = new Array(this.hashLength);
    var i = this.hashLength;
    while(--i >= 0) {
        accumulated[i] = 0;
    }
    if (typeof(input[0]) === 'number'){
        i = input.length;
        while(--i >= 0) {
            var data = input[i];
            var j = this.hashLength;
            while(--j >= 0) {
                accumulated[j] += (data & (1 << j)) ? 1 : -1;
            }
        }
    } else {
        i = input.length;
        while(--i >= 0) {
            var data = input[i];
            var j = 0;
            var l = 3;
            while(j < self.hashLength) {
                for(var k = 0; k < 8; ++k) {
                    accumulated[j] += (data[l] & (1 << k)) ? 1 : -1;
                    j++;
                }
                l--;
            }
        };
    }
    return accumulated;
}

Simhash.prototype._hashBuffer = function(buffer) {
    if (this.algorithm === 'crc32') {
        return crc32.signed(buffer);
    }

    var hash = crypto.createHash(this.algorithm);
    hash.update(buffer.toString('binary'), 'binary');
    return new Buffer(hash.digest('binary'), 'binary');
}

Simhash.prototype.hash = function(tokens) {
    this._hashed.length = tokens.length;
    // var  hashed = new Array(tokens.length);
    for(var i = 0; i < tokens.length; ++i) {
        this._hashed[i] = this._hashBuffer(tokens[i]);
    }
    var result = this._accumulate(this._hashed);
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
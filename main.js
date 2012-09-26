var crypto = require('crypto');
var crc32 = require('buffer-crc32');

function Simhash(algorithm) {
    this.algorithm = algorithm;
    // crc32 is the default algorithm
    if (!algorithm) {
        this.algorithm = 'crc32';
    }
    this.hashLength = this._hashBuffer(new Buffer('')).length;
}

Simhash.prototype._accumulate = function(buffers) {
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

Simhash.prototype._hashBuffer = function(buffer) {
    if (!Buffer.isBuffer(buffer)) {
        buffer = new Buffer(buffer);
    }

    if (this.algorithm === 'crc32') {
        return crc32(buffer);
    }

    var hash = crypto.createHash(this.algorithm);
    hash.update(buffer.toString('binary'), 'binary');
    return new Buffer(hash.digest('binary'), 'binary');
}

Simhash.prototype.hash = function(tokens) {
    var hashed = new Array(tokens.length);
    for(var i = 0; i < tokens.length; ++i) {
        var token = tokens[i];
        hashed[i] = this._hashBuffer(token);
    }
    var result = this._accumulate(hashed);
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
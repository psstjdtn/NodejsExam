var crypto = require('crypto');

var password = 'test1234!@$';
var shasum = crypto.createHash('sha256');
shasum.update(password);
var output = shasum.digest('hex');

console.log('password='+password);
console.log('hash='+output);

var shasum2 = crypto.createHash('sha256');
shasum2.update('test1234~@##');
var output2 = shasum2.digest('hex');
console.log('wrong hash='+output2);
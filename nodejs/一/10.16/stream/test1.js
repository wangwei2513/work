var fs = require('fs')
var zlib = require('zlib')

// 压缩文件
fs.createReadStream('./output.txt').pipe(zlib.createGzip()).pipe(fs.createWriteStream('output.zip'))
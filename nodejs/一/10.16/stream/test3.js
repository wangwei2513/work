const fs = require('fs');
const zlib =require('zlib');
fs.createReadStream('output.zip')
    .pipe(zlib.createGzip())
    .pipe(fs.createWriteStream('input.txt'))
var fs = require('fs')
var data = ''
var readStream = fs.createReadStream('../../input.txt') //创建一个可读流
readStream.setEncoding('utf-8')
readStream.on('data', function(a) {
    data += a
})
readStream.on('error', function(err) {
    console.log(err.stack)
})
readStream.on('end', function() {
    console.log(data)
})
console.log('ok')
var writeStream = fs.createWriteStream('./output.txt') //创建一个可写流
var str = 'asxcccecevrtgtth7j'
writeStream.write(str, 'utf-8') //写入数据
    // writeStream.end()
writeStream.on('finish', function() {
    console.log('wancheng')
})
writeStream.on('error', function(err) {
    console.log(err.stack)
})
readStream.pipe(writeStream) //管道流操作，将可读流里的内容复制到可写流的文件中
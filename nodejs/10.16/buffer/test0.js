var buf = new Buffer(256)
var len = buf.write('56456489456456') //写入数据、并返回写入数据的长度
console.log(len)
var buf0 = new Buffer(50)
for (var i = 0; i < 26; i++) {
    buf0[i] = i + 97
}
console.log(buf0.toString('ascii')) //从缓冲去读取数据
console.log(buf0.toString('ascii', 0, 5))
console.log(buf0.toString(undefined, 0, 5))
console.log(buf0.toString('utf-8', 0, 5))
var buf1 = new Buffer('acascascasccev')
console.log(buf1.toJSON())

// 合成缓冲区
var buf2 = Buffer.concat([buf, buf0, buf1])
console.log(buf2.toString())

// 缓冲区的比较
var result = buf.compare(buf1)
console.log(result)

// 拷贝缓冲区
var aaa = new Buffer('aaaaaa')
var buf3 = new Buffer(6)
aaa.copy(buf3)
console.log('buf3:' + buf3.toString('utf-8'))
console.log('buf0' + buf0.toString())
var buffer1 = new Buffer('ABC');
// 拷贝一个缓冲区
var buffer2 = new Buffer(3);
buffer1.copy(buffer2);
console.log("buffer2 content: " + buffer2.toString());

// 缓冲区裁剪
var buf4 = buf3.slice(0, 4)
console.log('buf4' + buf4.toString())

// 缓冲区的长度
console.log(buf4.length)
// buffer 缓冲
const buff0 = Buffer.alloc(10);//创建一个长度10的buffer
const buff1 = Buffer.alloc(10,1)//创建一个长度为10、用0x1填充的buff\
const buff3 = Buffer.allocUnsafe(10)//更快的创建一个长度为10的buff、但是buf中可能存在旧数据、需要用fill()或write()重写//可能引入安全漏洞
const buff4 = Buffer.from([1,2,3])//创建一个包含0x1,0x2,0x3的buffer
const buff5 = Buffer.from('test')//创建一个包含utf-8字符的buff
// 类方法
console.log(Buffer.isBuffer(buff0)) //判断参数是否是buffer

console.log(Buffer.compare(buff0,buff1))
for(const pair of buff5.entries()){
    console.log(pair)
}
console.log(buff0.equals(buff1))
console.log(buff0.equals(buff3))
buff3.fill('h',3,6)//填充
console.log(buff3)
console.log(buff0.includes(0))
console.log(buff5.toString())
// buffer.write()写入
buff0.write('me',3)
console.log(buff0.toJSON())
buff0.copy(buff1);
console.log(buff0.toString())
console.log(buff0.toJSON())
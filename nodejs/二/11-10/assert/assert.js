// assert断言
const assert = require('assert');
assert.deepEqual(66, '66') //测试两个值是否相等
const obj1 = {
    a: {
        b: 1
    }
}
const obj2 = {
    a: {
        b: 1
    }
}
const obj3 = {
    a: {
        b: 2
    }
}
const obj4 = Object.create(obj1)
// assert.deepEqual(obj1,obj3)//抛出错误、b的之不相等
// assert.deepEqual(obj1,obj4)//会抛出错误、因为不测试原型
// assert.deepStrictEqual(66,'66')//抛出错误、严格不相等
assert.equal('1',1)
assert.ifError(0)//如果 value 为真，则抛出 value。 可用于测试回调函数的 error 参数。
// assert.ifError('error')
// assert.ifError('1')
// assert.ifError(1)
// assert.notDeepEqual()//和deepEqual相反
// assert.notDeepStrictEqual();//和deepStrictEqual相反、不完全相等
// assert.notEqual()//和equal相反
// assert.ok(0,'0不是1')//判断参数是否为真值
// assert.strictEqual(1,'1')//用===去判断两个参数是否相等

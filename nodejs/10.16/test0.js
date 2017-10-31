var event = require('events')
var eventEmmiter = new event.EventEmitter()
var connection = function connected() {
    console.log('链接成功')
    eventEmmiter.emit('data-device')
}
eventEmmiter.on('connection', connection)
eventEmmiter.on('data-device', function() {
    console.log('发送成功')
})
eventEmmiter.emit('connection')
console.log('程序执行完毕')
var events = require('events')
var eventsEmitter = new events.EventEmitter();
var connectHandler = function connected() {
    console.log("连接成功")
    eventsEmitter.emit('data_received')
}
eventsEmitter.on('connection', connectHandler)
eventsEmitter.on("data_received", function() {
    console.log('数据接受成功')
})
eventsEmitter.emit('connection')
console.log('wancheng')
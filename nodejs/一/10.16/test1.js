var event = require('events')
var eventEmitter = new event.EventEmitter()
var listener1 = function() {
    console.log('这是监听1')
}
var listener2 = function() {
    console.log('这是监听2')
}
eventEmitter.addListener('connection', listener1)
eventEmitter.on('connection', listener2)
var eventListenners = require('events').EventEmitter.listenerCount(eventEmitter, 'connection')
console.log(eventListenners + '个监听器')
eventEmitter.emit('connection')
eventEmitter.removeListener('connection', listener1)
eventListenners = require('events').EventEmitter.listenerCount(eventEmitter, 'connection')
console.log(eventListenners)
eventEmitter.emit('connection')
console.log('执行结束')
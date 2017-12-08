var event = require('events')
var eventEmitter = new event.EventEmitter()
    // eventEmitter.emit('error')
var listenner0 = function listenner0() {
    console.log("监听1")
}
var listenner1 = function listenner1() {
    console.log('监听2')
}
eventEmitter.addListener('connection', listenner0)
eventEmitter.on('connection', listenner1)
var eventEmitters = require('events').EventEmitter.listenerCount(eventEmitter, 'connection');
console.log(eventEmitters + '个监听器')
eventEmitter.emit('connection')
eventEmitter.removeListener('connection', listenner0)
console.log('一出监听器1')
eventEmitter.emit('connection')
eventEmitters = require('events').EventEmitter.listenerCount(eventEmitter, 'connection');
console.log(eventEmitters + '个监听器')
const event = require('events')
const eventEmitter = new event.EventEmitter()
let listener0 = function listener0 () {
  console.log('监听0')
}
let listener1 = function () {
  console.log('监听1')
}
eventEmitter.on('connection', listener0)
eventEmitter.on('connection', listener1)
eventEmitter.emit('connection')
let max = eventEmitter.getMaxListeners('connection')
console.log(max)

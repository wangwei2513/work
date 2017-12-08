var event = require('events')
var eventEmiter = new event.EventEmitter();
eventEmiter.on('someevent', function(arg1, arg2) {
    console.log('listener0', arg1, arg2)
})
eventEmiter.on('someevent', function(arg1, arg2) {
    console.log('listener2', arg1, arg2)
})
eventEmiter.once('once', function() {
    console.log('执行一次')
})
setInterval(function() {
    eventEmiter.emit('someevent', 'arg1参数1', 'arg2参数2')
    eventEmiter.emit('once')
}, 1000)
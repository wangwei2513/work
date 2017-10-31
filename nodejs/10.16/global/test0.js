console.log(__filename)
console.log(__dirname)
console.time('计时开始')
    // setTimeout
    // setInterval
    // 先创建在执行

// process
process.on('exit', function(code) {
    setTimeout(function() {
        console.log('aaa')
    }, 0)
    console.log('推出码为', code)
})
console.log('over')
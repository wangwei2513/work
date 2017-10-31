// 先定义再传递
function say(str) {
    console.log(str)
}

function e(fun, value) {
    fun(value)
}
e(say, 'aaa')
    // 函数传递让http工作
function response(request, response) {
    response.writeHead(200, { 'ContentType': 'text/plain' })
    response.write('hello')
    response.end()
}

var http = require('http')
http.createServer(response).listen(8888)
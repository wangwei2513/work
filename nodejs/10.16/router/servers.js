const http = require('http')
const url = require('url')

function start(route) {
    function onRequest(request, response) {
        var pathName = url.parse(request.url).pathname
        console.log('requst for' + pathName + 'recived')
        route(pathName)
        response.writeHead(200, { 'ContentType': 'text/plain' })
        response.write('hello')
        response.end()
    }
    http.createServer(onRequest).listen(8888)
    console.log('server is start')
}
exports.start = start;
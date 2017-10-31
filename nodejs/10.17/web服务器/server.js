var http = require('http')
var fs = require('fs')
var url = require('url')
http.createServer(function(request, response) {
    let pathname = url.parse(request.url).pathname
    console.log('文件名' + pathname)
    fs.readFile(pathname.substr(1), function(err, data) {
        if (err) {
            console.error(err)
            response.writeHead(404, { 'Content-Type': 'text/html' })
        } else {
            response.write(data.toString())
            response.writeHead(200, { 'Content-Type': 'text/html' })
        }
        response.on('end', function() {

        })
    })
}).listen(8081)
console.log('server running at 127.0.0.7:8081')
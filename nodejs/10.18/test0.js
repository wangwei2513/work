const http = require('http')
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain;charset=utf8'})
  res.write('hello wrold')
  res.end('world')
}).listen(1001)

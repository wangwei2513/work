const http = require('http')
const url = require('url')
const util = require('util')

http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' })
    var params = url.parse(req.url, true).query
    res.write('canshu' + params.JSONscrify)
        // res.write("网站名：" + params.name);
    console.log(params)
    res.end()
        // JSONscrify
}).listen(3002)
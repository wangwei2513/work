// const http = require('http')
// let point = {
//     host: 'localhost',
//     prot: '8081',
//     path: '/index.html'
// }
// let callback = function(response) {
//         // 不断更新数据
//         let body = '';
//         response.on('data', function(data) {
//             body += data
//         })
//         response.on('end', function() {
//             // 接收完成
//             console.log(body)
//         })
//     }
//     // 向服务器端发送请求
// let req = http.request(point, callback)
// req.end()

var http = require('http');

// 用于请求的选项
var options = {
    host: 'localhost',
    port: '8081',
    path: '/index.htm'
};

// 处理响应的回调函数
var callback = function(response) {
        // 不断更新数据
        var body = '';
        response.on('data', function(data) {
            body += data;
        });

        response.on('end', function() {
            // 数据接收完成
            console.log(body);
        });
    }
    // 向服务端发送请求
var req = http.request(options, callback);
req.end();
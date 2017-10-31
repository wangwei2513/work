// 文件读取、同步和异步
const fs = require('fs')
    // fs.readFile('../../input.txt', function(error, data) {
    //     if (error) {
    //         return console.error(error)
    //     }
    //     console.log('异步读取' + data.toString())
    // })
    // let data = fs.readFileSync('../../input.txt')
    // console.log('同步读取数据' + data)

// // 打开文件
// console.log('准备打开文件')
// fs.open('../../input.txt', 'r+', function(err, fd) {
//     if (err) {
//         return console.error(err)
//     }
//     console.log('打开文件成功')
// })


// // 获取文件信息
// fs.stat('../../input.txt', function(err, stats) {
//     console.log(stats)
// })

// // 写入文件
// let str = 'fs写入文件'
// fs.writeFile('../../input.txt', str, function(err) {
//     if (err) {
//         console.error(err)
//     }

// })
// fs.readFile('../../input.txt', function(err, data) {
//     if (err) {
//         console.error(err)
//     }
//     console.log(data.toString())
// })

// 读取文件
// open后的读取文件
let buffer0 = new Buffer(1024)
fs.open('../../input.txt', 'r+', function(err, fd) {
        if (err) {
            return console.error(err)
        }
        fs.ftruncate(fd, 10, function(err, ) {
            if (err) {
                console.error(err)
            }
            fs.read(fd, buffer0, 0, buffer0.length, 0, function(err, bytes) {
                if (err) {
                    return console.error(err)
                }
                console.log(bytes + '字节被读取')
                if (bytes > 0) {
                    console.log(buffer0.slice(0, bytes).toString())
                }
                fs.close(fd, function(err) {
                    if (err) {
                        console.error(err)
                    }
                    console.log('closed')
                })
            })
        })

    })
    // var buf = new Buffer(1024);

// console.log("准备打开已存在的文件！");
// fs.open('../../input.txt', 'r+', function(err, fd) {
//     if (err) {
//         return console.error(err);
//     }
//     console.log("文件打开成功！");
//     console.log("准备读取文件：");
//     fs.read(fd, buf, 0, buf.length, 0, function(err, bytes) {
//         if (err) {
//             console.log(err);
//         }
//         console.log(bytes + "  字节被读取");

//         // 仅输出读取的字节
//         if (bytes > 0) {
//             console.log(buf.slice(0, bytes).toString());
//         }
//     });
// });

// 删除文件
fs.unlink('../../input.txt', function() {

})
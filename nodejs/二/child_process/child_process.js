// 子进程
// 创建子进程
// nodejs里的spawn 和exec\都是打开一个子进程。
const { spawn } = require('child_process')
const ls = spawn()
// 创建异步进程
child_process.spawn()
child_process.exec()
child_process.fork()
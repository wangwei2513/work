const path = require('path')
path.normalize() //规范化
path.join() //拼接路径
path.isAbsolute(path) //判断路径是不是绝对路径
path.resolve([from], to) //将 to参数解析为绝对路径
path.dirname(p)//返回路径中的文件夹部分
path.basename(p)//返回路径最后一部分
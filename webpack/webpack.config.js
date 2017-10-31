module.exports = {
  'entry': '' //入口文件
}

// 常见场景
//分离 应用程序(app) 和 公共库(vendor) 入口
module.exports = {
  'entry': {
    app: './src/app.js',
    vendors: './src/vendors.js'
  }
}
// 多个页面
module.exports = {
  'entry':{
    pageone:'./src/pageone/index.js',
    pagetwo:'./src/pagetwo/index.js',
    pagethree:'./src/pagethree/index.js'
  }
}

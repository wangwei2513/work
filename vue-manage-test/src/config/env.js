// 配置编译环境和线上环境直接切换
// baseUrl:域名地址
// routerMode:路由模式
// baseImgPath:图片存放地址
let baseUrl = ''
let routerMode = 'history'
let baseImgPath = './src/assets/'
if (process.env.NODE_ENV === 'development') {
}else {
}
export { baseUrl, routerMode, baseImgPath }

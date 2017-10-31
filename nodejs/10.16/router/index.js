const router = require('./router')
const server = require('./servers')

server.start(router.route)
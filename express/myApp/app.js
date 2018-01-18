let express = require('express');
let app = express()
app.get('/', function (req, res) {
  res.send('hello world')
})
const server = app.listen(3000, function (req, res) {
  let host = server.address().address
  let port = server.address().post
  console.log('Example app listening at http://%s:%s', host, port)
})
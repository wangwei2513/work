const express = require('express')
const app = new express()
app.get('/', function (req, res) {
  res.send('hello world')
})
app.listen(3000, function () {
  console.log(3000)
})

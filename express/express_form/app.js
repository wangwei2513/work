const express = require('express')
const app = new express()
app.use(express.static(__dirname + '/public')) //设置静态文件路径
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/usertest')
const Schema = mongoose.Schema
let userSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  }
})
let User = mongoose.model('user', userSchema)
app.get('/process_get', function (req, res) {
  let user = new User({
    first_name: req.query.first_name,
    last_name: req.query.last_name
  })
  user.save(function () {
    console.log('数据添加成功！')
  })
})
app.listen(3000, function () {
  console.log('3000')
})
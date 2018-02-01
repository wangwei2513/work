const mongoose = require('mongoose')
var db = require('../lib/mongoose')
// 一个用户模型
let UserSchema = new mongoose.Schema({
  userName: {type: String},
  passWord: {type: String},
  avatar: {type: String},
  age: {type: Number,default: 0},
  description: {type: String},
  email: {type: String},
  gitHub: {type: String},
  time: {type: Date,default: Date.now}
})
// 创建model
let userSchema = db.model('user', UserSchema)
module.exports = userSchema

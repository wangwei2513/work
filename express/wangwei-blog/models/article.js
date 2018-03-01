const mongoose = require('mongoose')
const db = require('../lib/mongoose')
let articleSchema = new mongoose.Schema({
  title: {type: String},
  label: {type: String},
  content: {type: String},
  file: {type: String},
  date: {type: Date,default: Date.now}
})
const articleModel = mongoose.model('wangwei-articles', articleSchema)
module.exports = articleModel

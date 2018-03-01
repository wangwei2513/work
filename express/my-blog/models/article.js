var mongoose = require('mongoose')
var db = require('../lib/mongo')
var articleSchema = new mongoose.Schema({
  title: {type: String},
  label: {type: String},
  content: {type: String},
  date: {type: Date,default: Date.now}
})

var articleModel = mongoose.model('articles', articleSchema)

module.exports = articleModel

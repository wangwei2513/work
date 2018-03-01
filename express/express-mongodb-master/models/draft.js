var mongoose = require('mongoose')
var db = require('../lib/mongo')

var draftSchema = new mongoose.Schema({
  title: { type: String },
  label: {type: String},
  content: {type: String},
  date: { type: Date, default: Date.now }
})

var draftModel = db.model('draft', draftSchema)

module.exports = draftModel

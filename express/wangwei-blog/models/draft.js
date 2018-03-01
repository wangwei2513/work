const mongoose = require('mongoose')
const db = require('../lib/mongoose')
let draftSchema = new mongoose.Schema({
  title: {type: String},
  label: {type: String},
  content: {type: String},
  file: {type: String},
  date: {type: Date,default: Date.now}
})
const draftModel = mongoose.model('wangwei-drafts', draftSchema)
module.exports = draftModel

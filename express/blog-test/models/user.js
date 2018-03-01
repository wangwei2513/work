const mongoose = require('mongoose')
const db = require('../lib/mongo')
let UserSchema = new mongoose.Schema({
  title: { type: String },
  label: {type: String},
  content: {type: String},
  date: { type: Date, default: Date.now }
})
let UserModel = mongoose.model('user', UserSchema)
module.exports = UserModel

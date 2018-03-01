const express = require('express')
const mongoose = require('mongoose')
const db = require('../lib/mongoose')
const billSchema = new mongoose.Schema({
  title: {type: String},
  date: {type: Date,default: Date.now},
  message: {type: String},
  mode: {type: String},
  dateLabel: {type: String},
  number: {type: Number},
  totle: {type: Number}
})
const billModel = mongoose.model('bill',billSchema)
module.exports = billModel
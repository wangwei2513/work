const mongoose = require('mongoose')
const db = mongoose.connect('http://localhost:27017/bill-database')
module.exports = db
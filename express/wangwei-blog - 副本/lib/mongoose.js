const mongoose = require('mongoose')
const db = mongoose.connect('mongodb://localhost:27017/bill-database')
module.exports = db 
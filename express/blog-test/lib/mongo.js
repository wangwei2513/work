const mongoose = require('mongoose')
const db = mongoose.connect('mongodb//localhost:20127/blogtest')
module.exports = db 
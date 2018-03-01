// var config = require('../config/index')

var mongoose = require("mongoose");

var db = mongoose.connect('mongodb://localhost:27017/my-blog');

module.exports = db
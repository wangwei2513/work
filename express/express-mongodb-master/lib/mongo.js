var config = require('../config/index')

var mongoose = require("mongoose");

var db = mongoose.connect(config.mongodb);

module.exports = db
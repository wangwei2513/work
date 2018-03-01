require('babel-core/register');
var express = require('express');
var router = express.Router();
require('../server/server')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

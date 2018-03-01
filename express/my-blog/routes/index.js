var express = require('express')
var router = express.Router()
var api = require('../lib/api')
// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' })
// })
router.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Access-Token')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('X-Powered-By', ' 3.2.1')
  res.header('Content-Type', 'application/json;charset=utf-8')
  next()
})

router.post('/addDraft', function (req, res, next) {
  let drarft = {
    title: req.body.title,
    label: req.body.label,
    content: req.body.content,
    date: req.body.date
  }
  api.saveDraft(drarft)
    .then(result => {
      if (result) {
        res.json({
          'data': result,
          'success': true
        })
      } else {
        res.json({
          'success': false
        })
      }
    })
    .catch(error => {
      console.log(error)
    })
})
router.get('/getDrafts', function (req, res, next) {
  api.findDraft({})
  .then(result => {
    if (result) {
      res.json({
        'data':result,
        'success':true
      })
    } else {
      res.json({
        'success':false
      })
    }
  })
})

module.exports = router

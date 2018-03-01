var express = require('express')
var router = express.Router()
const api = require('../lib/api')
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
  let draft = {
    title: req.body.title,
    label: req.body.label,
    content: req.body.content,
    file: req.body.file,
    date: req.body.date
  }
  api.saveDraft(draft)
    .then(result => {
      if (result) {
        res.send({
          'data': result,
          'success': true
        })
      } else {
        res.send({
          'success': false
        })
      }
    })
})
router.post('/addArticle', function (req, res, next) {
  let article = {
    title: req.body.title,
    label: req.body.label,
    content: req.body.content,
    file: req.body.file,
    date: req.body.date
  }
  api.saveArticle(article)
    .then(result => {
      if (result) {
        res.send({
          'data': result,
          'success': true
        })
      } else {
        res.send({
          'success': false
        })
      }
    })
})
router.get('/getAllDraft', function (req, res, next) {
  let _id = req.body._id
  let obj
  if (_id) {
    obj = {
      '_id': _id
    }
  }
  api.findDraft(obj)
    .then(result => {
      if (result) {
        res.send({
          'data': result,
          'success': true
        })
      } else {
        res.send({
          'success': false
        })
      }
    })
})
router.get('/getAllArticles', function (req, res, next) {
  let _id = req.body._id
  let obj
  if (_id) {
    obj = {
      '_id': _id
    }
  }
  api.findArticle(obj)
    .then(result => {
      if (result) {
        res.send({
          'data': result,
          'success': true
        })
      } else {
        res.send({
          'success': false
        })
      }
    })
})

router.get('/getOneDraft', function (req, res, next) {
  let _id = req.body._id
  let obj
  if (_id) {
    obj = {
      '_id': _id
    }
  }
  api.findOneDraft(obj)
    .then(result => {
      if (result) {
        res.send({
          'data': result,
          'success': true
        })
      } else {
        res.send({
          'success': false
        })
      }
    })
})
router.get('/getOneArticles', function (req, res, next) {
  let _id = req.body._id
  let obj
  if (_id) {
    obj = {
      '_id': _id
    }
  }
  api.findOneArticle(obj)
    .then(result => {
      if (result) {
        res.send({
          'data': result,
          'success': true
        })
      } else {
        res.send({
          'success': false
        })
      }
    })
})

router.post('/deleteDraft', function (req, res, next) {
  let draft = {
    _id: req.body._id
  }
  api.removeDraft(draft)
    .then(result => {
      if (result) {
        res.send({
          'data': result,
          'success': true
        })
      } else {
        res.send({
          'success': false
        })
      }
    })
})
router.post('/deleteArticle', function (req, res, next) {
  let article = {
    _id: req.body._id
  }
  api.removeArticle(article)
    .then(result => {
      if (result) {
        res.send({
          'data': result,
          'success': true
        })
      } else {
        res.send({
          'success': false
        })
      }
    })
})
module.exports = router

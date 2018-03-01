var express = require('express')
var router = express.Router()
const api = require('../lib/api')
/* GET home page. */
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

router.post('/addBill', function (req, res, next) {
  let bill = {
    title: req.body.title,
    message: req.body.message,
    mode: req.body.mode,
    dateLabel: req.body.dateLabel,
    number: req.body.number,
    totle: req.body.totle,
    dateTime: req.body.dateTime
  }
  console.log(bill)
  api.saveBill(bill)
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
    .catch(result => {
      res.send({
        data: result,
        success: false
      })
    })
})
router.get('/getAllBill', function (req, res, next) {
  let id = req.body._id
  let obj
  if (id) {
    obj = {
      '_id': id
    }
  }
  api.findBill()
    .then(result => {
      if (result) {
        res.send({
          'data': result,
          'success': true
        })
      } else {
        console.log(result)
        res.send({
          'data': result,
          'ssss': false
        })
      }
    })
    .catch(error => {
      res.send({
        data: error,
        success: false
      })
    // console.log(error)
    })
})
router.post('/removeBill', function (req, res, next) {
  let id = req.body._id
  let obj = {
    '_id': id
  }
  api.removeBill(obj)
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
    .catch(error => {
      res.send({
        success: false
      })
    })
})
module.exports = router

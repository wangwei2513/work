var express = require('express');
var router = express.Router();
const api = require('../lib/api')
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.post('/addBill', function (req, res, next) {
  let bill = {
    title: req.body.title,
    message: req.body.message,
    mode: req.body.mode,
    dateLabel: req.body.date,
    number: req.body.number,
    totle: req.body.totle
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
    
    // .catch(result => {
    //   res.send({
    //     data: result,
    //     success: false
    //   })
    //   console.log(result)
    // })
    .then(result => {
      if (result) {
        res.send({
          'data': result,
          'success': true
        })
      } else {
        console.log(result)
        res.send({
          'data':result,
          'success': false
        })
      }
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
module.exports = router;

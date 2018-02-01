const express = require('express')
const router = express.Router()
const api = require('../lib/api')

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' })
// })
router.post('/login', function (req, res, next) {
  let user = {
    userName: req.body.userName,
    passWord: req.body.passWord
  }
  api.findOne(user)
    .then(result => {
      console.log(result)
    })
})
router.post('/sign_up', function (req, res, next) {
  let user = {
    userName: req.body.userName,
    passWord: req.body.passWord,
    email: req.body.email
  }
  api.save(user)
    .then(result => {
      console.log(result)
    })
})
router.get('/user_list', function (req, res, next) {
  // 返回所有用户
  api.find({})
    .then(result => {
      console.log(result)
    })
  // 返回只包含一个键值的name、age的所有数据
  api.find('', {name: 1,age: 1,_id: 0})
    .then(result => {
      console.log(result)
    })
  // 返回所有age大与18的数据
  api.find({'age': {'$gt': 18}})
    .then(result => {
      console.log(result)
    })
  // 返回20条数据
  api.find({}, null, {limit: 20})
    .catch(result => {
      console.log(result)
    })
})

module.exports = router

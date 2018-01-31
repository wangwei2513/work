const express = require('express')
const utility = require('utility')
const crypto = require('crypto')
const app = new express()
app.get('/', function (req, res) {
  let q = req.query.q
  let md5Value = utility.md5(q)
  let sha = utility.sha1(q,'base64')
  let sha1 = crypto.createHash('sha1')
  sha1.update(q)
  let sha1q = sha1.digest('hex')
  res.send(sha1q)
})
app.listen(3000, function () {
  console.log(3000)
})
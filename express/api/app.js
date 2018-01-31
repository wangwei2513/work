const express = require('express')
const app = express()

app.get('/random/:min/:max', function (req, res) {
  let min = parseInt(req.params.min)
  let max = parseInt(req.params.max)
  if (isNaN(min) || isNaN(max)) {
    res.status(400)
    res.json({
      error: 'Bad requst!'
    })
  }
  let result = Math.round(Math.random() * (max - min) + min)
  res.json({
    result: result
  })
})
app.listen(3000, function () {
  console.log('app start at port 3000')
})
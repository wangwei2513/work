const fs = require('fs')
let data = fs.readFileSync('input.txt')
console.log(data.toString())
fs.readFile('input.txt',function (err,data) {
  if (err) {
    console.error(err)
  }
  console.log(data.toString())
})
console.log('ok')
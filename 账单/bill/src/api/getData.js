import axios from 'axios'
export default async (url, data, type) => {
  return new Promise((resolve, reject) => {
    let dataStr = ''
    let url0 = 'http://localhost:1000' + url
    if (data) {
      Object.keys(data).forEach((key) => {
        dataStr += key + '=' + data[key] + '&'
      })
    }
    if (type === 'post') {
      axios.post(url0, data)
        .then(function (response) {
          console.log(response)
          resolve(response.data)
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      if (dataStr != '') {
        dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'))
        url0 += "?" + dataStr
        console.log(url0)
      }
      axios.get(url0)
        .then((response) => {
          console.log("response" + response)
          resolve(response.data)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  })

}

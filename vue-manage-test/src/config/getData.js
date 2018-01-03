// 请求数据
import axios from 'axios'
export default async(url, data, type) => {
  return new Promise((resolve, reject) => {
    let dataStr = ""; //参数
    if (data) {
      Object.keys(data).forEach(key => {
        dataStr += key + "=" + data[key] + "&";
      });
    }
    if (dataStr !== "") {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf("&"));
      url = url + "?" + dataStr;
      console.log(url);
    }
    if (type == 'post') {
      axios.post(url, data)
        .then(function (response) {
          console.log("response=" + JSON.stringify(response.data))
          resolve(response.data)
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      axios.get(url)
        .then(function (response) {
          console.log("response=" + JSON.stringify(response.data))
          resolve(response.data)
        })
        .catch(function (error) {
          console.log('error=' + error);
        });
    }
  })

}

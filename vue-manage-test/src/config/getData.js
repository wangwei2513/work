// 请求数据
import axios from 'axios'
export default async(url, data, type) => {
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
    await axios.post(url, data)
      .then(function (response) {
        console.log("response=" + JSON.stringify(response.data))
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    await axios.get(url)
      .then(function (response) {
        console.log("response=" + JSON.stringify(response))
        return response.data;
      })
      .catch(function (error) {
        console.log('error=' + error);
      });
  }
}

// 请求数据
import {
  baseUrl
} from './env.js'
export default async(url = '', data = {}, type = 'get', method = 'fetch') => {
  type = type.toUpperCase();
  url = baseUrl + url;
  if (type === 'get') {
    let dataStr = ''; //参数
    Object.keys(data).forEach(key => {
      dataStr += key + "=" + data[key] + '&';
    })
    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
      url = url + "?" + dataStr;
      console.log(url)
    }
  }
  if (window.fetch && method == 'fetch') {
    let requestConfig = {
      credentials: 'include',
      method: type,
      headers: {
        'Accept': 'applicaton/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      cache: 'force-cache'
    }
    if (type == 'post') {
      Object.defineProperty(requestConfig, 'body', {
        value: JSON.stringify(data)
      })
    }
    try {
      console.log(url)
      const response = await fetch(url, requestConfig);
      const responseJson = await responseJson.json();
      return responseJson;
    } catch (error) {
      throw new Error(error)
    }
  } else {
    return new Promise((resolve, reject) => {
      let requestObj;
      if (window.XMLHttpRequest) {
        requestObj = new XMLHttpRequest();
      } else {
        requestObj = new ActiveXObject();
      }
      let sendData = '';
      if (type == 'POST') {
        sendData = JSON.stringify(data);
      }
      requestObj.open(type, url, true);
      requestObj.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      requestObj.send(sendData);
      requestObj.onReadystatechange = () => {
        if (requestObj.readyState === 4) {
          if (requestObj.status === 200) {
            let obj = requestObj.response;
            if (typeof (obj) !== 'object') {
              obj = JSON.parse(obj)
            }
          } else {
            reject(requestObj)
          }
        }
      }
    })
  }
}

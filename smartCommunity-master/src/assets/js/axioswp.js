import axios from 'axios'
import router from './../../router/index'
import Cookies from './cookie'
import { Message, MessageBox } from 'element-ui'

// var portalRoot = 'http://192.168.20.157:8081/portal_cms_sc'
var portalRoot = 'http://192.168.41.124:8081/portal_cms_sc'
var loginMsgShow = false

var axioswp = axios.create({
  timeout: 10000,
  withCredentials: true
})

axioswp.defaults.headers.post['Content-Type'] = 'application/json'
axioswp.defaults.headers.put['Content-Type'] = 'application/json'

axioswp.interceptors.request.use(function (config) {
  console.log(config)
  // 拦截器
  // 在所有非登录接口,都需要加上`Authorization`请求头
  if (!config.url.includes('/login')) {
    config.headers.Authorization = Cookies.get('token')
  }

  // denghy接口处理
  if (config.url.includes(portalRoot)) {
    config.withCredentials = false
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

axioswp.interceptors.response.use(function (response) {
  // 拦截器
  // Do something with response data
  var data = response.data
  // 403禁止访问
  if (data.code && data.code === '403') {
    localStorage.loginValid = ''
    if (!loginMsgShow) {
      loginMsgShow = true
      MessageBox.alert('用户信息已失效,请重新登录!', '提示', {
        confirmButtonText: '确定',
        callback: action => {
          router.push('/login')
          loginMsgShow = false
        }
      })
    }
    return Promise.reject(data)
  } else if (data.code && data.code === '401') {
    MessageBox.alert('您未取得该接口的使用权限!', '提示', {
      confirmButtonText: '确定',
      callback: action => {
      }
    })
    return Promise.reject(data)
  } else if (data.code && data.code !== '200') {
    return Promise.reject(data)
  } else if (typeof data.success !== 'undefined' && data.success !== true) {
    return Promise.reject(data)
  }
  return data
}, function (error) {
  if (axios.isCancel(error)) {
    // 取消请求
    console.log('cancel request ' + error.message)
    return Promise.reject({
      code: 6000,
      msg: 'cancel request'
    })
  } else {
    // Do something with response error
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.state === 403) {
        localStorage.loginValid = ''
        MessageBox.alert('用户信息已失效,请重新登录!', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            router.push('/login')
          }
        })
      } else {
        Message({
          message: '服务器返回数据错误!',
          type: 'error'
        })
      }
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser
      MessageBox.alert(error.code === 'ECONNABORTED' ? '请求超时,请稍后重试!' : error.message, '提示', {
        confirmButtonText: '确定',
        callback: action => {
          if (!window.location.href.includes('login')) {
            // router.push('/error')
          }
        }
      })
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message)
    }
    return Promise.reject(error)
  }
})

export {
  axioswp
}

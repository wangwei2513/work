// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { axioswp } from './assets/js/axioswp'
import axios from 'axios'
import ElementUI from 'element-ui'
import Cookies from './assets/js/cookie'
import bus from './assets/js/bus'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/reset.css'
import './../static/icon/iconfont.css'

Vue.use(ElementUI, {size: 'small'})
Vue.prototype.axios = axioswp
Vue.prototype.CancelToken = axios.CancelToken
Vue.config.productionTip = false
// 全局路由拦截
router.beforeEach((to, from, next) => {
  const noAuth = to.meta && to.meta.noAuth
  console.log(to.meta)
  if (!noAuth) {
    if (!Cookies.get('token')) {
      setTimeout(() => {
        ElementUI.MessageBox.alert('未登录用户，请先登录!', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            router.push('/login')
          }
        })
      }, 0)
    } else {
      next()
    }
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<app/>',
  components: {
    App
  }
})

/* 全局事件绑定begin */
$(document).on('click', function (e) {
  e.stopPropagation() // 阻止事件冒泡
  var $parents = $(e.target).parents('.ipanel-cascader')
  if ($parents.length === 0) {
    bus.$emit('hideCascader')
  }
  $parents = $(e.target).parents('.ipanel-cc2p')
  if ($parents.length === 0) {
    bus.$emit('hideCC2P')
  }
})
/* 全局事件绑定end */

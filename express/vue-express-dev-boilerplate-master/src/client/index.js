import Vue from 'vue'
import App from './App'
import router from './router/index'
import store from './store/store'

import axios from 'axios'

import iView from 'iview'
import 'iview/dist/styles/iview.css'


Vue.config.debug = true
Vue.config.productionTip = false
Vue.prototype.$axios = axios

Vue.use(iView)


new Vue({
  el: '#app',
  router: router,
  store: store,
  template: '<App/>',
  components: { App }
})

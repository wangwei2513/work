import Vue from 'vue'
import Router from 'vue-router'
import index from '../view/index.vue'
import test from '../view/test'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/test',
      name: 'test',
      component: test
    }
  ]
})

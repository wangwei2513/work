import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import index from '../view/index.vue'
import addBill from '../view/addBill.vue'
import detail from '../view/detail.vue'
import bills from '../view/bills.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      children: [{
        path:'/detail',
        name:'detail',
        component:detail
      }, {
        path: '/addBill',
        name: 'addBill',
        component: addBill
      }, {
        path: '/bills',
        name: 'bills',
        component: bills
      }]
    }
  ]
})

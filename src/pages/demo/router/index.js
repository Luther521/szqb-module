import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: () => import('../view/HelloWorld')
    },
    {
      path: '/fisrtPage/wdsd',
      name: 'fisrtPage',
      component: () => import('../view/fisrtPage')
    }
  ]
})

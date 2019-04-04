import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Toc from './views/Toc.vue'
import Discourse from './views/Discourse.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/toc',
      name: 'toc',
      component: Toc
    },
    {
      path: '/discourse',
      name: 'discourse',
      component: Discourse
    }
  ]
})

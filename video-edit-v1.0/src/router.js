import Vue from 'vue'
import Router from 'vue-router'
import VideoCut from './components/VideoCutMain.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: VideoCut
    }
  ]
})

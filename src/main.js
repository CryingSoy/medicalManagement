import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import axios from 'axios'
import routes from './router/router.config'
import store from './store/'

Vue.use(ElementUI)

Vue.prototype.$axios = axios

Vue.use(VueRouter)

const router = new VueRouter({// mode: 'history', //切换路径模式，变成history模式
  scrollBehavior: () => ({
    y: 0
  }), // 滚动条滚动的行为，不加这个默认就会记忆原来滚动条的位置
  routes
})

/* eslint-disable no-new */

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})

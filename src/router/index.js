import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/login', component: Login },
  { path: '/', redirect: '/login' },
  { path: '/home', component: Home }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') { return next() } // 没有判断将不会跳转
  if (to.path === '/home') {
    if (window.sessionStorage.getItem('token')) { return next() } else { return next('/login') }
  }
})

export default router

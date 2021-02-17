import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/users/Users.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/login', component: Login },
  { path: '/', redirect: '/login' },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/ ' }
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') { return next() } // 没有判断将不会跳转
  if (to.path === '/home') {
    if (window.sessionStorage.getItem('token')) { return next() } else { return next('/login') }
  }
  if (to.path === '/home/welcome') {
    if (window.sessionStorage.getItem('token')) { return next() } else { return next('/login') }
  }
  if (to.path === '/welcome') {
    if (window.sessionStorage.getItem('token')) { return next() } else { return next('/login') }
  }
  if (to.path) {
    return next()
  }
})

export default router

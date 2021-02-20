import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/users/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Categories from '../components/good/Categories.vue'
import Params from '../components/good/Params.vue'
import Goods from '../components/good/List.vue'
import AddGoods from '../components/good/AddGoods.vue'
import Order from '../components/order/Order.vue'
import Report from '../components/report/Report.vue'

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
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Categories },
      { path: '/params', component: Params },
      { path: '/goods', component: Goods },
      { path: '/goods/add', component: AddGoods },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
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

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
import ZkTable from 'vue-table-with-tree-grid'

Vue.component('tree-table', ZkTable)
// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.config.productionTip = false
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token') // 添加请求头信息
  return config
})
Vue.prototype.$http = axios
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

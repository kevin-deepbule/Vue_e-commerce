"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _vueRouter = _interopRequireDefault(require("vue-router"));

var _Login = _interopRequireDefault(require("../components/Login.vue"));

var _Home = _interopRequireDefault(require("../components/Home.vue"));

var _Welcome = _interopRequireDefault(require("../components/Welcome.vue"));

var _Users = _interopRequireDefault(require("../components/users/Users.vue"));

var _Rights = _interopRequireDefault(require("../components/power/Rights.vue"));

var _Roles = _interopRequireDefault(require("../components/power/Roles.vue"));

var _Categories = _interopRequireDefault(require("../components/good/Categories.vue"));

var _Params = _interopRequireDefault(require("../components/good/Params.vue"));

var _List = _interopRequireDefault(require("../components/good/List.vue"));

var _AddGoods = _interopRequireDefault(require("../components/good/AddGoods.vue"));

var _Order = _interopRequireDefault(require("../components/order/Order.vue"));

var _Report = _interopRequireDefault(require("../components/report/Report.vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_vue["default"].use(_vueRouter["default"]);

var routes = [{
  path: '/login',
  component: _Login["default"]
}, {
  path: '/',
  redirect: '/login'
}, {
  path: '/home',
  component: _Home["default"],
  redirect: '/welcome',
  children: [{
    path: '/welcome',
    component: _Welcome["default"]
  }, {
    path: '/users',
    component: _Users["default"]
  }, {
    path: '/rights',
    component: _Rights["default"]
  }, {
    path: '/roles',
    component: _Roles["default"]
  }, {
    path: '/categories',
    component: _Categories["default"]
  }, {
    path: '/params',
    component: _Params["default"]
  }, {
    path: '/goods',
    component: _List["default"]
  }, {
    path: '/goods/add',
    component: _AddGoods["default"]
  }, {
    path: '/orders',
    component: _Order["default"]
  }, {
    path: '/reports',
    component: _Report["default"]
  }]
}];
var router = new _vueRouter["default"]({
  routes: routes
});
router.beforeEach(function (to, from, next) {
  if (to.path === '/login') {
    return next();
  } // 没有判断将不会跳转


  if (to.path === '/home') {
    if (window.sessionStorage.getItem('token')) {
      return next();
    } else {
      return next('/login');
    }
  }

  if (to.path === '/home/welcome') {
    if (window.sessionStorage.getItem('token')) {
      return next();
    } else {
      return next('/login');
    }
  }

  if (to.path === '/welcome') {
    if (window.sessionStorage.getItem('token')) {
      return next();
    } else {
      return next('/login');
    }
  }

  if (to.path) {
    return next();
  }
});
var _default = router;
exports["default"] = _default;
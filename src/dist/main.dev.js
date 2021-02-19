"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _App = _interopRequireDefault(require("./App.vue"));

var _router = _interopRequireDefault(require("./router"));

require("./plugins/element.js");

require("./assets/css/global.css");

var _axios = _interopRequireDefault(require("axios"));

var _vueTableWithTreeGrid = _interopRequireDefault(require("vue-table-with-tree-grid"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_vue["default"].component('tree-table', _vueTableWithTreeGrid["default"]); // 配置请求根路径


_axios["default"].defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
_vue["default"].config.productionTip = false;

_axios["default"].interceptors.request.use(function (config) {
  config.headers.Authorization = window.sessionStorage.getItem('token'); // 添加请求头信息

  return config;
});

_vue["default"].prototype.$http = _axios["default"];
new _vue["default"]({
  router: _router["default"],
  render: function render(h) {
    return h(_App["default"]);
  }
}).$mount('#app');
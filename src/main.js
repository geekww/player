import 'babel-polyfill' //写在最前面，用于编译es6语法，babel-runtime不需要手动引入
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex'
import VueLazyload from 'vue-lazyload'

import './common/stylus/index.styl'

import Store from './common/js/localstorage'
Vue.use(Store)

import fastclick from 'fastclick'
fastclick.attach(document.body) //body上的所有元素都没有300ms延迟了

Vue.use(VueLazyload, {
	loading: require('@/components/header/logo@3y.png'),
	error: require('@/components/header/logo@3y.png'),
	preLoad: 1
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

// Babel默认只转换新的JavaScript句法（syntax），而不转换新的API，
// 比如Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise等全局对象，
// 以及一些定义在全局对象上的方法（比如Object.assign()）都不会转码。
// 举例来说，Array.from()等方法，Babel就不会转码这个方法。
// 如果想让这个方法运行，必须使用babel-polyfill，为当前环境提供一个垫片。


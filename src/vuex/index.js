import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'
import createLogger from 'vuex/dist/logger' //插件,和vue-tools选一个使用即可

Vue.use(Vuex)

// 调试工具，开发环境下开启
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
	state,
	getters,
	mutations,
	actions,
	strict: debug, //当state的改变不是来自于mutations，会发出警告
	plugins: debug ? [createLogger()] : []
})
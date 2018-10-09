import * as types from './mutations-types'

const mutations = {
	[types.SET_RANK](state, payload) {
		state.rank = payload
	},
	[types.SET_RECOMMEND](state, payload) {
		state.recommend = payload
	},
	[types.SET_SINGER](state, payload) {
		state.singer = payload
	},
	[types.SET_PLAYING_STATE](state, flag) {  //播放状态（true/false）
      state.playing = flag
	},
	[types.SET_FULL_SCREEN](state, flag) {  //播放器全屏（true/false）
	  state.fullScreen = flag
	},
	[types.SET_PLAYLIST](state, list) {  //播放列表（list）
	  state.playList = list
	},
	[types.SET_SEQUENCE_LIST](state, list) {  //默认播放列表（list）
	  state.sequenceList = list
	},
	[types.SET_PLAY_MODE](state, mode) {  //播放模式（0/1/2）
	  state.mode = mode
	},
	[types.SET_CURRENT_INDEX](state, index) {  //当前播放歌曲索引（index）
	  state.currentIndex = index
	},
	[types.SET_SEARCH_HISTORY](state, histroy) {  //搜索列表
	  state.searchHistroy = histroy
	},
	[types.SET_LOVE_LIST](state, love) {  //收藏列表
	  state.loveList = love
	},
	[types.SET_INPUT_POS](state, pos) {  //收藏列表
	  state.inputPos = pos
	}
}

export default mutations
import {mapGetters} from 'vuex'

export const adaptBottomMixin = {
	computed: {
		...mapGetters([
		    'playList'
		])
	},
	mounted(){  
		this.adaptBottom( this.playList )
	},
	activated(){ //keep-alive 组件激活时调用
		this.adaptBottom( this.playList )
	},
	watch: {
		playList(val, oldVal) {
			this.adaptBottom( val )
		}
	},
	// 在mounted、activated以及playList变化时调用的统一方法
	methods: {
		adaptBottom(playList) {
			throw new Error("Mixins Error:组件必须重写此方法！")
		}
	}
}
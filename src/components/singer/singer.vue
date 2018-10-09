<template>
  <div class="singer" ref="singer">
  	<scroll 
  		class="singer-list" 
  		:data="singerList" 
  		:listenScroll="listenScroll"
  		:probeType="probeType"
  		@scroll="_scroll"
  		ref="scroll"
  		>
  		<ul>
		  <li v-for="group,index in singerList" class="list-group" ref="listGroup">
		  	<i class="icon-huo" v-if="showHot && index===0"></i>
		    <h2 class="list-group-title">{{group.tag}}</h2>
		    <ul>
		      <li @click="selectSinger(item,index)" v-for="(item,index) in group.items" class="list-group-item">
		        <img class="pic" v-lazy="item.pic">
		        <span class="name">{{item.name}}</span>
		      </li>
		    </ul>
		  </li>
		</ul>
		<!-- 右侧快速入口 -->
		<div class="list-shortcut" @touchstart.stop.prevent="onTouchStart" @touchmove.stop.prevent="onTouchMove" @touchend="onTouchend" v-show="singerList.length"
         >
         	<span class="shortcutDot" ref="shortcutDot"></span>
         	<div class="shortcutLight" ref="shortcutLight">{{fixedTitle}}</div>
	        <ul>
	          <li v-for="(item, index) in shortcutList" :data-index="index" class="item"
	            :class="{'current':currentIndex===index}">{{item}}
	          </li>
	          
	        </ul>
        </div>
		<div class="list-fixed" v-show="fixedTitle" ref="fixedTitle">
			<i class="icon-huo" v-if="showHot"></i>
			<h1 class="fixed-title">{{fixedTitle}}</h1>
		</div>
		<div class="loading-container" v-show="!singerList.length">
      		<loading></loading>
    	</div>
    	<!-- 子路由（歌手详情页） -->
    	<router-view></router-view>
  	</scroll>
  </div>	
</template>

<script>
import {createSinger} from '@/common/js/singer'
import Scroll from '@/baseComponents/scroll/scroll'
import getSingerList from '@/api/singerList'
import Loading from '@/baseComponents/loading/loading'
import {ERR_OK} from '@/api/config'
import {getAttr} from '@/common/js/dom'
import {mapMutations} from 'vuex'
import {adaptBottomMixin} from '@/common/js/mixins'
const HOT_NAME = '热门'
const HOT_SINGER_NUM = 10
const FIXED_HEIGHT = 30
const TITLE_HEIGHT = 40
const ANCHOR_HEIGHT = 18
const color_theme_d = "rgb(230,230,230)"
const color_sub_theme = "#F5CD19"
export default {
	mixins: [adaptBottomMixin],
	data(){
		return {
			singerList: [],
			listenScroll: true,
			scrollY: -1,
			currentIndex: 0,
			listHeight: [],
			probeType: 3,
			gap: -1,
			touch: {}
		}
	},
	computed: {
		shortcutList() {
	        return this.singerList.map((group) => {
	          return group.tag.substr(0, 1)
	        })
        },
		fixedTitle() {
			if( this.scrollY > 0 ){
				return ''
			} 
			return this.singerList[this.currentIndex] ? this.singerList[this.currentIndex].tag : ''
		},
		showHot(){
			return this.scrollY > 0 || this.fixedTitle === HOT_NAME
		}	
	},
	created(){
		// this.touch = {}
		this._getSingerList()		
	},
	methods: {
		_getSingerList(){
			getSingerList().then( (res) => {
				if( res.code === ERR_OK ){
					this.singerList = this._sortSingerList(res.data.list)
					//console.log(this.singerList)
				}
			} ).catch( (err) => {
				console.log(err)
			} )
		},
		// 变成我要的数据结构
		_sortSingerList(list) {
			let map = {
				hot: {
					tag: HOT_NAME,
					items: []
				}
			}
			list.forEach( (item, index) => {
				// 如果index<10,以hot为key放进hot
				if( index < HOT_SINGER_NUM ){
					// map.hot.items.push( new Singer({  //把singer抽象成类
					// 	id: item.Fsinger_mid,
					// 	name: item.Fsinger_name
					// }) )
					map.hot.items.push( createSinger(item) )
				}
				// 其余的以a-z为key放进a-z
				let k = item.Findex 
				if( !map[k] ){
					map[k] = {
						tag: k,
						items: []
					}
				}
				map[k].items.push( createSinger(item) )			
			} )
			
			// 为了使map按照一定顺序排序，这里进行处理
			let hot = [],
			 	oth = []
			for( let key in map ) {
				let con = map[key]
				if( con.tag.match(/[a-zA-Z]/) ){
					oth.push(con)
				}else if( con.tag === HOT_NAME ){
					hot.push(con)
				}
			}
			oth.sort((a, b) => {
				return a.tag.charCodeAt(0) - b.tag.charCodeAt(0)
			})
			return hot.concat(oth)
		},
		onTouchStart(e) {
	        let anchorIndex = getAttr(e.target, 'index')
	        this.touch.y1 = e.touches[0].pageY
	        this.touch.anchorIndex = parseInt( anchorIndex )

	        this._scrollTo(anchorIndex)
	        
	        this.$refs.shortcutDot.style.background = color_sub_theme
	        this.$refs.shortcutLight.style.display = 'block'
        },
	    onTouchMove(e) {
	      this.touch.y2 = e.touches[0].pageY
	      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
	      let anchorIndex = parseInt(this.touch.anchorIndex) + delta  //通过getAttr（）获取的属性值为字符串

	      this._scrollTo(anchorIndex)
	    },
	    onTouchend() {
	    	this.$refs.shortcutDot.style.background = color_theme_d
	    	this.$refs.shortcutLight.style.display = 'none'
	    },
      _scrollTo(index) {
        if (!index && index !== 0) {
          return
        }
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        this.scrollY = -this.listHeight[index]
        this.$refs.scroll._scrollToElement(this.$refs.listGroup[index], 0)
      },
		// scroll组件触发scroll事件
		_scroll(pos){
			this.scrollY = pos.y
		},
		// 计算高度
		_caculateHeight(){
			let listGroup = this.$refs.listGroup,
			    height = 0
			this.listHeight.push(height)
			for( let i = 0; i < listGroup.length; i ++ ){
				let list = listGroup[i]
				height += list.clientHeight
				this.listHeight.push(height)
			}
		},
		// 点击歌手跳转至歌手详情页
		selectSinger(item,index){
			this.$router.push({
				path: `/singer/${item.id}`
			})
			this.setSinger(item)  //相当于提交了mutation
		},
		...mapMutations({
			setSinger: 'SET_SINGER'
		}),
		// 重写mixins方法
		adaptBottom(playList){
			const bottom = this.playList.length > 0 ? '40px' : ''
			this.$refs.singer.style.bottom = bottom
			this.$refs.scroll._refresh()
		}

	},
	watch: {
		singerList() {  //数据的变化到DOM的变化有延迟
			setTimeout(() => {
               this._caculateHeight()
			}, 20);
		},
		scrollY(val, oldVal) {

			const _heights = this.listHeight
			 // 当滚动到顶部
	        if (val > 0) {
	          this.currentIndex = 0
	          return
	        }
			// 正常在中间滚动时
			for( let i = 0; i < _heights.length - 1; i ++ ){
				let preHeight = _heights[i],
				    nextHeight = _heights[i + 1]
				if( -val >= preHeight && -val < nextHeight ){ //向上滚动时val为负
					this.currentIndex = i
					//console.log(this.currentIndex)
					this.gap = nextHeight + val  //为gap赋值
					//console.log(this.gap, nextHeight, val)
					return
				}
			}
			// 当滚动到底部，且-val大于最后一个元素的上限
	        this.currentIndex = _heights.length - 2
		},
		gap(val, oldVal) {
			let fixedTop = ( val > 0 && val < FIXED_HEIGHT ) ? val - FIXED_HEIGHT : 0
			this.$refs.fixedTitle.style.transform = `translate3d(0, ${fixedTop}px, 0)` //开启硬件加速
		}
	},
	components: {
		Scroll,
		Loading
	}
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable"
@import "../../common/stylus/mixin"
.singer
  position: fixed
  top: 88px
  bottom: 0
  width: 100%
  .singer-list
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .icon-huo
        float:left
        color:red
        margin: 6px 6px 0 6px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .pic
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
          no-wrap()
          width: 240px
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 10px 0 20px
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .shortcutDot
        display: inline-block
        width: 12px
        height: 12px
        border-radius: 50%
        background: $color-background
      .shortcutLight
        position: absolute
        right: 30px
        top: 0
        background: $color-theme-d
        width: 60px
        height: 60px
        border-radius: 50%
        text-align: center
        line-height: 60px
        display: none
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .icon-huo
        float:left
        color:red
        margin: 6px 6px 0 6px
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)

</style>
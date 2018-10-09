<template>
	<div class="music-list">
		<div class="back" @click="back">
			<i class="icon-fanhui"></i>
		</div>
		<div class="detail">
			<i class="icon-share"></i>
		</div>
		<div class="bg-image" :style="bgStyle" ref="bgImage">
			<h1 class="title" ref="title" v-html="title"></h1>
			<div class="play-wrapper" ref="playBtn" v-show="songs.length">
				<div class="play" @click="playAll">
					<i class="icon-bofang1"></i>
					<span class="text">一键播放,GO!</span>
				</div>
			</div>
			<div class="filter" ref="filter"></div>
		</div>
		<div class="bg-layer" ref="bgLayer"></div>
		<scroll 
			:data="songs" 
			:probeType="probeType" 
			:listenScroll="listenScroll" 
			@scroll="_scroll" 
			class="list" 
			ref="scroll">
			<div class="song-list-wrapper">
				<music @selectSong="_selectSong" :songs="songs"></music>
			</div>
			<div v-show="!songs.length" class="loading-container">
        		<loading></loading>
      		</div>
		</scroll>
	</div>
</template>

<script type="text/javascript">
import Scroll from '@/baseComponents/scroll/scroll'
import Music from '@/baseComponents/music/music'
import Loading from '@/baseComponents/loading/loading'
import prefixStyle from '@/common/js/prefixStyle'
import {mapActions} from 'vuex'
import {adaptBottomMixin} from '@/common/js/mixins'
let Transform = prefixStyle('transform')
const TITLE_HEIGHT = 40
const PADDING_TOP = '70%'
const TITLE_PREV_SIZE = 30
const TITLE_NEXT_SIZE = 18
	export default {
		mixins: [adaptBottomMixin],
		props: {
			songs: {
				type: Array,
				default: []
			},
			bgImage: {
				type: String,
				default: ''
			},
			title: {
				type: String,
				default: ''
			}
		},
		data(){
			return {
				probeType: 3,
				listenScroll: true,
				scrollY: 0
			}
		},
		computed: {
			bgStyle(){
				return `background-image:url(${this.bgImage})`
			}
		},
		mounted(){
			this.clientH = this.$refs.bgImage.clientHeight
			this.minY = - this.clientH + TITLE_HEIGHT
			this.$refs.scroll.$el.style.top = `${this.clientH}px`
		},
		methods: {
			_scroll(pos) {
				this.scrollY = pos.y
			},
			back(){
				this.$router.back()
			},
			_selectSong(song, index){
				this.toPlay({
					list: this.songs,
					index
				})
			},
			playAll(){
				this.toPlay({
					list: this.songs,
					index: 0
				})
			},
			...mapActions([
				'toPlay'
			]),
			// 重写mixins方法
			adaptBottom(playList){
				const bottom = this.playList.length > 0 ? '40px' : ''
				this.$refs.scroll.$el.style.bottom = bottom
				this.$refs.scroll._refresh()
			}
		},
		watch: {
			scrollY(val, oldVal) {
				let bgLayerTranslate = Math.max( this.minY, val )
				let zIndex = 0
				this.$refs.bgLayer.style[Transform] = `translate3d(0, ${bgLayerTranslate}px, 0)`
				if( val < this.minY ){
					zIndex = 10
					this.$refs.bgImage.style.paddingTop = 0
					this.$refs.bgImage.style.height = `${TITLE_HEIGHT}px`
					this.$refs.playBtn.style.display = 'none'
										
				}else{
					this.$refs.bgImage.style.paddingTop = PADDING_TOP
					this.$refs.bgImage.style.height = 0
					this.$refs.playBtn.style.display = ''
				}
				this.$refs.bgImage.style.zIndex = zIndex
				// 下拉图片等比放大,上划图片渐暗
				let scale = 1
				let blur = 0
				let scaleTitle = 0
				let moveTitle = 0
				const PERCENT = Math.abs( val / this.clientH )
				if( val > 0 ) {
					scale += PERCENT
					zIndex = 10
					this.$refs.bgImage.style[Transform] = `scale(${scale})`
					this.$refs.bgImage.style.zIndex = zIndex
				}else{					
					blur = Math.min( 0.2 + PERCENT, 0.8)
					scaleTitle = Math.max(TITLE_PREV_SIZE * ( 1 - PERCENT ), TITLE_NEXT_SIZE)
					moveTitle = - (0.6 * Math.min( 1.2 * PERCENT, 1)) * this.clientH 
					this.$refs.filter.style.backgroundColor = `rgba(7, 17, 27, ${blur})`
					this.$refs.title.style.fontSize = `${scaleTitle}px`
					this.$refs.title.style[Transform] = `translate3d(0, ${moveTitle}px, 0)`
					if( val < this.minY ){
						this.$refs.title.style[Transform] = `translate3d(0, ${-TITLE_HEIGHT * 0.6}px, 0)`
					}
				}
			}
		},
		components: {
			Scroll,
			Music,
			Loading
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable"
@import "../../common/stylus/mixin"
  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-fanhui
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-text
    .detail
      position absolute
      top: 0
      right: 6px
      z-index: 50
      .icon-share
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-text
    .title
      position: absolute
      top: 60%
      left: 0
      z-index: 40
      width: 100%
      no-wrap()
      text-align: center
      height: 40px
      line-height: 40px
      //font-size: $font-size-large  18px 
      font-size: 30px
      color: $color-background
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 120px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          //border: 1px solid $color-theme
          background-color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-bofang1
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-X
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.2)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
<template>
  <div class="slider" ref="slider">
  	<div class="slider-group" ref="sliderGroup">
  		<slot></slot>
  	</div>
  	<div class="dots">
  		<span class="dot" v-for="(item, index) in dots"  :class="{active: currentPageIndex === index}"></span>
  	</div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import {addClass} from '@/common/js/dom'
export default {
	data(){
		return {
			dots: [],
			currentPageIndex: 0,
			sliderHeight: 0
		}
	},
	props: {
		loop:{//循环
			type: Boolean,
			default: true
		},
		autoPlay:{
			type: Boolean,
			default: true
		},
		interval:{
			type: Number,
			default: 3000
		}
	},
	mounted(){
		setTimeout(() => {  //在dom渲染完成后初始化better-scroll
			this._setSliderWidth()
			this._initDots()
			this._initSlider()
			this.autoPlay && this._autoPlay()
			this.computedHeight()
		}, 20)
		// 改变窗口大小轮播图自适应
		window.addEventListener( 'resize', () => {
			if( !this.slider ) {return} // 如果没有初始化return
			this._setSliderWidth(true)  //防止复制多余的dom
			this.slider.refresh()  //调用better-scroll内置refresh方法
			this.computedHeight()
		} )
	},
    deactivated() {
      clearInterval(this.timer)
    },
	beforeDestroy(){
	  clearInterval(this.timer)
	},
	methods: {
		computedHeight(){
			this.sliderHeight = this.$refs.slider.clientHeight
			this.$emit( 'sliderHeight',  this.sliderHeight)
		},
		_setSliderWidth(onResize){  //初始化slider前计算并设置宽度
			this.children = this.$refs.sliderGroup.children  // 获取子元素
			let totalWidth = 0  //图片水平排列总宽度
			let sliderWidth = this.$refs.slider.clientWidth  //父容器宽度

			for( let i = 0; i < this.children.length; i++ ){
				let child = this.children[i]
				addClass( child, 'slider-item' )  //添加class
				child.style.width = sliderWidth + 'px'  //图片宽度设置为父容器一样宽度
				totalWidth += sliderWidth  //累加得到总宽度
			}
			if( this.loop && !onResize){ //如果循环，那么会多复制2个图片
				totalWidth += 2 * sliderWidth
			}
			this.$refs.sliderGroup.style.width = totalWidth + 'px'
		},
		_initDots(){  //初始化圆点
			this.dots = new Array( this.children.length )
		},
		_initSlider(){//初始化slider
			this.slider = new BScroll( this.$refs.slider, {
				scrollX: true,
				scroolY: false,
				momentum: false, //惯性
				snap: {
					loop: this.loop,
					threshold: 0.3,
					snapSpeed: 400
				}
			} )
			// 每翻一页都会派发scrollEnd事件，在这里获取currentPageIndex
			this.slider.on( 'scrollEnd', () => {
				let _index =  this.slider.getCurrentPage().pageX
				if( this.loop ){ _index -= 1 }
				this.currentPageIndex = _index
				// 每次翻页清除定时器并设置下一个
				if( this.autoPlay ){
					clearInterval(this.timer);
					this._autoPlay()
				}
			} )
		},
		_autoPlay(){
			let _index = this.currentPageIndex + 1
			if( this.loop ) { _index += 1 }
			this.timer = setInterval(() => {
				this.slider.goToPage( _index, 0, 400 )
			}, this.interval);
		}
	}
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          background: $color-text-ll

</style>
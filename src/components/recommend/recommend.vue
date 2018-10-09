<template>
<div class="recommend" ref="recommend">
   <!-- <div class="fixed-wrapper" ref="fixedWrapper"  v-show="pullupSH">
    <i class="icon-huo"></i>
    <h1 class="fixed-title" ref="fixedTitle">热门歌单</h1>
   </div> -->
   <scroll ref="scroll" class="recommend-content" 
      :data="songsList" 
      :listen-scroll="listenScroll"      
      :probe-type="probeType" 
      @scroll="_scroll"    
      >

    <div class="wrapper">
      <!-- <div class="loading-wrapper">
        <loading v-show="pullDownRefresh" :title="loadingTitle"></loading>
      </div>  -->     
     	<!-- 获取图片数据是异步的，拿到数据前slider组件已经被mounted，不能正确渲染，需要如下判断 -->
     	<div v-if="recommends.length" class="slider-wrapper">
     		<slider @sliderHeight="_sliderHeight">
     			<div v-for="item in recommends">
     				<a :href="item.linkUrl">
     					<img :src="item.picUrl"/>
     				</a>
     			</div>
     		</slider>
     	</div>
     	<div class="recommend-list">
        <i class="icon-huo"></i>
     		<h1 class="list-title">热门歌单</h1>       
     		<ul class="clearfix">
          <li v-for="item, index in songsList" class="item" @click="chooseItem(item)" ref="listGroup">
            <div class="icon">
              <img class="needsclick" width="100%" v-lazy="item.picUrl">
              <span class="listenNum">{{listenNum[index]}}</span>
            </div>
            <div class="text">
              <h2 class="name" v-html="item.songListDesc"></h2>
              <p class="desc" v-html="item.songListAuthor"></p>
            </div>
          </li> 
        </ul>
     	</div>
    </div>
   
    <div class="loading-container" v-show="!songsList.length">
      <loading></loading>
    </div>
   </scroll>
   <router-view></router-view>
 </div>

</template>

<script>
import getRecommend from '@/api/recommend'
import getDesList from '@/api/deslist'
import getLyric from '@/api/lyric'
import {ERR_OK} from '@/api/config'
import Slider from '@/baseComponents/slider/slider'
import Scroll from '@/baseComponents/scroll/scroll'
import Loading from '@/baseComponents/loading/loading'
import {adaptBottomMixin} from '@/common/js/mixins'
import {mapMutations} from 'vuex'
const NO_DATA = "暂无数据，稍后再试吧"
const NEW_DATA = "刷新成功"
export default {	
  mixins: [adaptBottomMixin],
  data(){
    return{
      recommends: [],
      songsList: [],
      // pullDownRefresh: true,
      // pullDownRefreshThreshold: 90,
      // pullDownRefreshStop: 40,
      listenScroll: true,
      probeType: 3,
      scrollY: -1,   
      sliderHeight: 0,
      listenNum: []
    }
  },
	created(){
		this._getRecommend()
    this._getDesList()
	},
	methods: {
		_getRecommend(){
			getRecommend().then( (res) => {
				if(res.code === ERR_OK){
					this.recommends = res.data.slider
				}
			} ).catch((err) => {
				console.log(err)
			})
		 },
    _getDesList(){
      getDesList().then( (res) => {
        if(res.code === ERR_OK){
          this.songsList = res.data.songList
          this.listenNum = this.changeListenNum(res.data.songList)
        }
      } ).catch( (err) => {
        console.log(err)
      } )
    },
    chooseItem(item) {
      window.location.href = `https://y.qq.com/w/taoge.html?ADTAG=newyqq.taoge&id=${item.id}`

      // this.$router.push({
      //   // path: `/recommend/${item.id}`
      //   path: `https://y.qq.com/w/taoge.html?ADTAG=myqq&from=myqq&channel=10007100&id=${item.id}`
      // })
      // this.setRecommend(item)
    },
    changeListenNum(nums) {
      let str, ret = []
      nums.forEach((item) => {
        str = ( item.accessnum / 10000 ).toString()
        str = str.substr(0, str.indexOf('.') + 2)
        str = str + "万人听过"
        ret.push(str)
      }) 
      return ret  
    },
    ...mapMutations({
      setRecommend: 'SET_RECOMMEND'
    }),
    _scroll(pos){
      this.scrollY = pos.y
    },
    // pullupSH(){
    //   // if( !this.sliderHeight ) { return }  //修复首页滚动时fixedTitle bug
    //    if( this.scrollY <= - this.sliderHeight && this.$route.fullPath === '/recommend') {
    //       return true
    //     }else{
    //       return false
    //     }
    // },
    _sliderHeight(h){
      this.sliderHeight = h
    },
    // 重写mixins方法
    adaptBottom(playList){
        const bottom = this.playList.length > 0 ? '40px' : ''
        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll._refresh()
    },
	},
  watch: {
      scrollY(val,oldVal){
          if( val > 80 ) {
            this.loadingTitle = "释放刷新"
          }else {
            this.loadingTitle = "下拉刷新"
          }
       }
    },
	components: {
		Slider,
    Scroll,
    Loading
	}
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
 @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .fixed-wrapper
      position: fixed
      top: 86px
      left: 0
      width: 100%
      padding-left: 20px
      height: 60px
      line-height: 60px
      background: $color-background 
      z-index: 999
      text-align: center
      display: none
      transition: all 2s
      .icon-huo
        float:left
        color: red
        font-size:$font-size-large
      .fixed-title       
        font-size: $font-size-large
        color: $color-text-l
        margin-left: 2px
        float: left            
    .recommend-content
      width: 100%
      height: 100%
      overflow: hidden
      .loading-wrapper
        position: absolute
        top: -80px
        left: 50%
        transform: translate(-50%, 0)
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        position:relative
        .icon-huo
          float:left
          color: red
          font-size:$font-size-large
          height: 65px
          line-height: 65px
          margin-left: 20px
        .list-title
          height: 65px
          line-height: 65px
          padding-left: 40px
          font-size: $font-size-large
          color: $color-text-l
        ul
          padding: 0 10px
          &.clearfix:after
            display: table
            content: ''
            clear: both
            height: 0
          &.clearfix
            *zoom: 1
          .item
            float: left
            width: 48%
            &:nth-child(odd)
              margin-right: 10px
            .icon
              position: relative
              .listenNum
                position: absolute
                bottom: 10px
                left: 5px
            .text
              display: flex
              flex-direction: column
              justify-content: center
              line-height: 20px
              font-size: $font-size-medium
              margin-bottom: 10px
              .name
                margin-bottom: 0px
                color: $color-text-l
                no-wrap()
              .desc                
                color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
.updateTip
  position: fixed
  display: none
  width: 100%
  height: 30px
  line-height: 30px
  text-align: center
  background: $color-theme
  top: 88px
  left: 0
      
</style>
<template>
  <div class="player" v-show="playList.length">
    <transition name="full">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="hide_fullScreen">
            <i class="icon-fanhui"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="singerName"></h2>
          <div class="detail">
            <i class="icon-share"></i>
          </div>
        </div>
        <div class="middle" ref="middle" 
        @touchstart.prevent="touchstart" @touchmove.prevent="touchmove" @touchend="touchend">
          <div class="middle-l" ref="cd">
              <div class="cd-wrapper">
                <div class="cd"  :class=rotateCD>
                  <img class="image" v-lazy="currentSong.image">
                </div>
              </div>
              <div class="playing-lyric-wrapper">
                <div class="playing-lyric">{{playingLyricTXT}}</div>
              </div>
          </div>
          <scroll class="middle-r" ref="scroll" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine" 
                class="text" 
                :class="{current: currentLineNum === index}" 
                v-for="(line, index) in currentLyric.lines"
                >{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{active: currentDot === 'cd'}"></span>
            <span class="dot" :class="{active: currentDot === 'ly'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{sortCurrentTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :progressPercent="progressPercent" @customProgress="customProgress"></progress-bar>
            </div>
            <span class="time time-r">{{sortCurrentTime(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changePlayMode">
              <i :class="iconPlayMode"></i>
            </div>
            <div class="icon i-left" :class=disabled>
              <i @click="prevSong" class="icon-xiayiqu1"></i>
            </div>
            <div class="icon i-center" :class=disabled>
              <i @click="togglePlay" :class="toggleIcon"></i>
            </div>
            <div class="icon i-right" :class=disabled>
              <i @click="nextSong" class="icon-xiayiqu"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-bofangqi_shouyegequliebiao_"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" ref="miniPlayer" v-show="!fullScreen" @click="show_fullScreen">
        <div class="icon">
           <little-progress :percent="progressPercent" :radius="radius">
          <img width="40" :src="currentSong.image" :class="rotateCD">
           </little-progress>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer" v-if="!playing"></p>
          <p class="desc" v-else="playing">{{playingLyricTXT}}</p>
        </div>       
        <div class="control">
          <i class="icon-mini" @click.stop="togglePlay" :class="miniToggleIcon"></i>
        </div>       
        <div class="control">
          <i :class="iconToggleLove" @click.stop="toggleLove"></i>
        </div>
      </div>
    </transition>
    <audio ref="audio" :src="currentSong.url" 
    @canplay="canplay" @error="error" @timeupdate="_currentTime" @ended="over"></audio>
  </div>
</template>

<script type="text/javascript">
import {mapGetters, mapMutations} from 'vuex'
import ProgressBar from '@/baseComponents/progress/progress'
import LittleProgress from '@/baseComponents/circleProgress/circleProgress'
import {playMode} from '@/common/js/config'
import {shuffle} from '@/common/js/utils'
import lyric from '@/api/lyric'
import Lyric  from 'lyric-parser'
import Scroll from '@/baseComponents/scroll/scroll'
import prefixStyle from '@/common/js/prefixStyle'
const Transform = prefixStyle('transform')
const TransitionDuration = prefixStyle('transitionDuration')
const STAY_LINE = 6

	export default {
    components: {
      ProgressBar,
      LittleProgress,
      Scroll
    },
    data(){
      return {
        canBePlayed: false,
        currentTime: 0,
        radius: 48,
        currentLyric: null,
        currentLineNum: 0,
        currentDot: 'cd',
        playingLyricTXT: '',
        iconToggleLove: "icon-xihuan"
      }
    },
   computed: {
    clienH() {
      return document.body.clientHeight
    },
    ...mapGetters([
        'fullScreen',
        'playList',
        'currentSong',
        'playing',
        'currentIndex',
        'mode',
        'sequenceList',
        'inputPos'
      ]),
    singerName(){
      return `-  ${this.currentSong.singer}  -`
    },
    toggleIcon() {  // 根据this.playing改变图标class
      return this.playing ? "icon-zanting" : "icon-bofang1"
    },
    miniToggleIcon(){
      return this.playing ? "icon-pause" : "icon-play"
    },
    rotateCD(){  //旋转的CD
      return this.playing ? "play" : "play pause"
    },
    disabled(){  //弱网络环境下歌曲未load完成时图标变灰
      return this.canBePlayed ? '' : "disable"
    },
    progressPercent(){
      return this.currentTime / this.currentSong.duration
    },
    iconPlayMode(){
      switch (this.mode){
        case playMode.sequence:
          return "icon-liebiaoxunhuan"
          break
        case playMode.loop:
          return "icon-danquxunhuan"
          break
        case playMode.random:
          return "icon-iconfontsuijibofang0101"
          break
      }
    }
   },
   methods: {
    hide_fullScreen(){
      this.switch(false)
    },
    show_fullScreen(){
      this.switch(true)
    },
    togglePlay(){  //点击提交mutations改变playing状态，通过watch这个playing的状态来播放暂停歌曲
      this.setPlayingState(!this.playing)
      this.currentLyric && this.currentLyric.togglePlay()  //lyricBug：修复歌曲暂停是歌词继续滚动BUG
    },
    toggleLove() {  
      if( this.iconToggleLove === "icon-xihuan" ) {      //喜欢 
        if( this.$local.get("name").login ) {
          this.iconToggleLove = "icon-loveList"
          this.$local.set("song"+this.currentSong.id, this.currentSong )
          this._setLovelists()
        }else {
          this.$router.push({
            path: '/login'
          })
        }
      }else if ( this.iconToggleLove === "icon-loveList" ) {  //取消喜欢
        this.iconToggleLove = "icon-xihuan"
        this.$local.removeItem("song"+this.currentSong.id )
        this._setLovelists()
      }
    },
    _setLovelists() {  //设置收藏列表
       let obj = this.$local.valueOf()
        let loveLists = []
        for( let key in obj ) {
          let reg = /^song\d+/
          if(key.match(reg)){
            loveLists.push(JSON.parse(obj[key]))
          }
        }
        this.setLoveList(loveLists)
    },
    prevSong(){
      if( !this.canBePlayed ) { return }
       if( this.playList.length === 1 ){ 
       this.loopSong() 
       return 
       } //特殊情况：如果不判断则不能watch到currentSong的变化
      let index = this.currentIndex - 1
      if( index === -1 ) { index = this.playList.length - 1 }
      this.setCurrentIndex(index)

      this.canBePlayed = false 
    },
    nextSong(){
      if( !this.canBePlayed ) { return }
      if( this.playList.length === 1 ){ 
        this.loopSong() 
        return } //特殊情况：如果不判断则不能watch到currentSong的变化
      let index = this.currentIndex + 1
      if( index === this.playList.length ) { index = 0 }
      this.setCurrentIndex(index) 

      this.canBePlayed = false 
    },
    canplay(){  //标识：歌曲canplay时置为true
      this.canBePlayed = true
    },
    error(){  //防止加载歌曲出错时播放器挂起
      this.canBePlayed = true
    },
    ...mapMutations({
      switch: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST',
      setLoveList: 'SET_LOVE_LIST'
    }),
    // 当前歌曲播放事件进度
    _currentTime(e){
      this.currentTime = e.target.currentTime
    },
    sortCurrentTime(t){  //改变时间格式
      t = t | 0
      let minute = this._pad( t / 60 | 0 )
      let second = this._pad( t % 60 )
      return `${minute}:${second}`
    },
    _pad(t){  //把时间统一变为两位数
      const n = 2
      let len = t.toString().length
      while( len < n ) {
        t = '0' + t
        len++
      }
      return t
    },
    // 接收progress组件派发的拉动进度条事件，这时改变歌曲播放进度
    customProgress(percent){
      const updateTime = percent * this.currentSong.duration
      this.$refs.audio.currentTime = updateTime
      if( !this.playing ){  //拖动进度条时如果歌曲是暂停的，那么还是可以播放
        this.togglePlay()
      }
      //lyricBug: 修复拉动进度条时歌词不跟随BUG
      this.currentLyric && this.currentLyric.seek( updateTime * 1000 )
    },
    changePlayMode(){  //点击按钮改变播放模式（提交mutations）
      let nextMode = ( this.mode + 1) % 3
      this.setPlayMode(nextMode)
      let list = []
      if( this.mode === playMode.random ) { //随机播放打乱播放列表
        list = shuffle( this.sequenceList )
      }else{         //否则是顺序列表
        list = this.sequenceList
      }
      this.stayCurrentIndex(list) //改变歌曲顺序前先重设当前歌曲索引
      this.setPlayList(list)  //提交mutations改变歌曲顺序     
    },
    // 改变播放模式时当前播放歌曲索引发生变化，需要重设索引防止播放列表不可控制
    stayCurrentIndex(list){
      // findIndex是es6的数组方法，返回数组中满足条件的第一个元素的索引
      let stayIndex = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(stayIndex)
    },
    over(){  //歌曲播放结束时的逻辑
      this.mode === playMode.loop ? this.loopSong() : this.nextSong()
    },
    loopSong(){
      this.setPlayingState(true)
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      this.currentLyric && this.currentLyric.seek(0)  // lyricBug:修复单曲循环结束时歌词不回到开头BUG
    },
    // 歌词
    _getLyric(){

      if( this.currentSong.lyric ) {  //修复收藏歌单播放时歌词错误
        this.currentLyric = new Lyric(this.currentSong.lyric, this.lyricCallback)
        if( this.playing ) {
          this.currentLyric.play()
        } 
        return
      }
        
      this.currentSong.getLyric().then((lyric) => {
        if( this.currentSong.lyric !== lyric ){ return } //lyricBug:修复快速切歌歌词错乱
        this.currentLyric = new Lyric(lyric, this.lyricCallback)  //创建歌词实例
        if( this.playing ) {
          this.currentLyric.play()
        } 
      }).catch(() => {
        this.currentLyric = null
        this.playingLyricTXT = ''
        this.currentLineNum = 0
      })
    },
    lyricCallback({lineNum, txt}){  //歌词改变时调用这个回调，lineNum表示当前歌词所在行数
      this.currentLineNum = lineNum  //根据设置当前行 高亮
      if( lineNum > STAY_LINE ) {
        let currentL = this.$refs.lyricLine[lineNum - STAY_LINE]
        this.$refs.scroll._scrollToElement( currentL, 1000 )
      }else{
        this.$refs.scroll._scrollTo( 0, 0, 1000 )
      }
      this.playingLyricTXT = txt
    },
    // 切换cd与歌词
    touchstart(e){
      this.touchMove.isInited = true
      this.touchMove.startX = e.touches[0].pageX
      this.touchMove.startY = e.touches[0].pageY
    },
    touchmove(e){
      if( !this.touchMove.isInited ){ return }
      let moveX = e.touches[0].pageX - this.touchMove.startX
      let moveY = e.touches[0].pageY - this.touchMove.startY
      if( Math.abs(moveY) > Math.abs(moveX) ){ return }  //纵向滚动歌词
      const WINDOW_WIDTH = window.innerWidth
      let lyric_static = this.currentDot === 'cd' ? 0 : - WINDOW_WIDTH  //歌词区到屏幕右边的静态距离
      let lyric_showWidth = Math.min( 0, Math.max( - WINDOW_WIDTH, lyric_static + moveX) )
      this.touchMove.percent = Math.abs( lyric_showWidth /  WINDOW_WIDTH ) //记录滑动比例

      this.$refs.scroll.$el.style[Transform] = `translate3d(${lyric_showWidth}px, 0, 0)`
      this.$refs.cd.style.opacity = 1 - this.touchMove.percent
      this.$refs.scroll.$el.style[TransitionDuration] = `0ms`  //滑动时需要关闭TransitionDuration
      this.$refs.cd.style[TransitionDuration] = `0ms`
    },
    touchend(){
      let lyric_showWidth, cd_opacity
      const WINDOW_WIDTH = window.innerWidth
      if( this.currentDot === 'cd' ){
        if( this.touchMove.percent > 0.1 ){
          lyric_showWidth = - WINDOW_WIDTH
          cd_opacity = 0
          this.currentDot = 'ly'
        }else{
          lyric_showWidth = 0
          cd_opacity = 1
        }
      }else{
        if( this.touchMove.percent < 0.9 ){
          lyric_showWidth = 0
          cd_opacity = 1
          this.currentDot = 'cd'
        }else{
          lyric_showWidth = - WINDOW_WIDTH
          cd_opacity = 0
        }
      }
      this.$refs.scroll.$el.style[Transform] = `translate3d(${lyric_showWidth}px, 0, 0)`
      this.$refs.scroll.$el.style[TransitionDuration] = `300ms`
      this.$refs.cd.style.opacity = cd_opacity
      this.$refs.cd.style[TransitionDuration] = `300ms`
    }
   },
   created(){
    this.touchMove = {}  //这个对象用于存储左右滑动时的信息
   },
   watch: {  
    currentSong(newSong, oldSong){  //在currentSong变化时执行播放，注意在dom ready后才能执行play方法
      if (!newSong.id || newSong.id === oldSong.id) {
          return
      }
      this.currentLyric && this.currentLyric.stop() //lyricBug:修复切歌时歌词跳动BUG，实际上是在歌词改变前清除旧的定时器
      this.$nextTick(() => {
        this.$refs.audio.play()
        this.setPlayingState(true)
        this._getLyric() //歌词
      })

      if( this.$local.get("song"+newSong.id).id === newSong.id ) {
        this.iconToggleLove = "icon-loveList"
      }else {
        this.iconToggleLove = "icon-xihuan"
      }
      
    },
    playing(val, oldVal){ 
      const audio = this.$refs.audio
      this.$nextTick(() => {
        val ? audio.play() : audio.pause()
      })
    },

    // inputPos(val, oldVal){
    //   if( val === true ) {
    //     this.$refs.miniPlayer.style.display = 'none'
    //   }else {
    //     this.$refs.miniPlayer.style.display = 'block'
    //   }
    // },
    // clientH(val, oldVal){
    //   console.log(val)
    //   if( val > oldVal ) {
    //     this.$refs.miniPlayer.style.display = 'block'
    //   }else{
    //     this.$refs.miniPlayer.style.display = 'none'
    //   }
    // }
   }
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable"
@import "../../common/stylus/mixin"
  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-text-ll
      .background
        position: absolute
        left: 0
        top: 0
        width: 180%
        z-index: -1
        opacity: 0.3
        filter: blur(15px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-fanhui
            display: block
            padding: 9px
            font-size: $font-size-large-xl
            color: $color-text
        .detail
          position absolute
          top: 0
          right: 6px
          z-index: 50
          .icon-share
            display: block
            padding: 10px
            font-size: $font-size-large-xl
            color: $color-text
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-theme
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-d
            &.active
              width: 20px
              border-radius: 5px
              background: $color-background
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-theme
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
            margin: 0 5px
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-bofangqi_shouyegequliebiao_
            color: $color-theme
            font-size: 40px !important
      &.full-enter-active, &.full-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(.6,.35,.4,1.26)
        .middle
          .middle-l
            transition: all 0.4s cubic-bezier(.6,.35,.4,1.26)
      &.full-enter, &.full-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
        .middle
          .middle-l
            transform: translate3d(100%, 0, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          position: absolute
          top: 4px
          left: 4px
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text-l
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        padding: 0 10px
        .icon-play, .icon-pause, .icon-xihuan, .icon-loveList
          display: inline-block
          font-size: 32px
          width:32px
          height:32px
          color: $color-theme
          z-index:-10
        .icon-xihuan
          color: $color-theme
          margin-bottom: 6px
        .icon-loveList
          color: red
          margin-bottom: 6px
        .icon-mini
          font-size: 32px
          left: 0px
          top: 0px
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
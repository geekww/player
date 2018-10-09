<template>
  <div class="progress-bar" ref="progressBar" @click="clickChangeProgress">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
        @touchstart.prevent="touchstart" @touchmove.prevent="touchmove" @touchend="touchend">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import prefixStyle from '@/common/js/prefixStyle'
const Transform = prefixStyle('transform')
const DOT_WIDTH = 16
export default {
  props: {
    progressPercent: {
      type: Number,
      default: 0
    }
  },
  watch: {
    progressPercent(val, oldVal) {
      const totalW = this.$refs.progressBar.clientWidth - DOT_WIDTH
      const leftW = this.progressPercent * totalW
      if( !this.touchMove.isInited ) {
        this.setW(leftW)
      }
    }
  },
  created() {
    this.touchMove = {}  //这个对象用于存储拖动进度条时的信息
  },
  methods: {
    touchstart(e) {
      this.touchMove.isInited = true
      this.touchMove.startX = e.touches[0].pageX
      this.touchMove.leftW = this.$refs.progress.clientWidth
    },
    touchmove(e) {
      if( !this.touchMove.isInited ) {return}
      let move = e.touches[0].pageX - this.touchMove.startX
      // 控制进度不能超出progressbar
      let L = Math.min(this.$refs.progressBar.clientWidth - DOT_WIDTH, Math.max(0, move +  this.touchMove.leftW) )
      this.setW(L)
    },
    touchend() {
      this.touchMove.isInited = false
      this.setP()
    },
    setW(l) {
      this.$refs.progress.style.width = `${l}px`
      this.$refs.progressBtn.style[Transform] = `translate3d(${l}px, 0, 0)`
    },
    setP() {  //向父组件派发当前拉动进度百分比
      const moveW = this.$refs.progressBar.clientWidth - DOT_WIDTH
      let percentW =  this.$refs.progress.clientWidth / moveW
      this.$emit( 'customProgress', percentW )
    },
    clickChangeProgress(e) {
      // 这里不可直接用e.offsetX（点击进度条区正常，但是点击进度小球后会有问题）
      //this.setW( e.offsetX )
      const BAR_LEFT = this.$refs.progressBar.offsetLeft
      let clickX = e.clientX - BAR_LEFT
      this.setW( clickX )
      this.setP()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/variable'

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-theme
          border-radius: 50%
          background: $color-theme
</style>
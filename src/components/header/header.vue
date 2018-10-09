<template>
  <div class="m-header">
    <router-link :to='path'>
      <i class="icon-geren" ></i>
    </router-link>
    <!-- <div class="icon"></div> -->
    <h1 class="text">Music Player</h1>
    <i class="icon-mulu"></i>
  </div>
</template>

<script type="text/javascript">

 export default {
    data() {
      return {
        isLogin: false
      }
    },
    created() {
      this.isLogin  = this.$local.get("name").login
    },
    watch: {
      $route() {
        this.isLogin  = this.$local.get("name").login
      }
    },
    computed: {
      path() {
        return this.isLogin ? '/person' : '/login'
      }
    }
 }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .m-header
    position: relative
    height: 44px
    text-align: center
    color: $color-theme
    font-size: 0
    background: $color-theme
    vertical-align: middle
    .icon-geren, .icon-mulu
      color: $color-text
      position: absolute
      top: 50%
      transform: translate(0, -50%)
    .icon-geren
      float: left     
      left:10px
      font-size: 30px 
    .icon-mulu
      float: right
      right:10px
      font-size: 20px
    .icon
      display: inline-block
      vertical-align: top
      margin-top: 6px
      width: 32px
      height: 32px
      margin-right: 9px
      // bg-image('logo')
      background-size: 32px 32px
    .text
      font-weight: bold
      display: inline-block
      vertical-align: top
      line-height: 44px
      font-size: $font-size-large
      color: $color-text
    .mine
      position: absolute
      top: 0
      right: 0
      .icon-mine
        display: block
        padding: 12px
        font-size: 20px
        color: $color-text
</style>
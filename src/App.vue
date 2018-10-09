<template>
  <div id="app">
    <d-header></d-header>
    <tab></tab>
    
      <transition :name="dir">
        <keep-alive>
    	    <router-view></router-view>
        </keep-alive>
      </transition>
    
    <player></player>
  </div>
</template>

<script>
import DHeader from '@/components/header/header'
import Tab from '@/components/tab/tab'
import Player from '@/components/player/player'
export default {
  components: {
  	DHeader,
  	Tab,
    Player
  },
  data(){
    return {
      dir: ""
    }
  },
  watch: {
    $route(to, from) {
      if(to.meta.index > from.meta.index) {
        this.dir = "left"
      }else if( to.meta.index < from.meta.index ) {
        this.dir = "right"
      }else if(  !from.meta.index ) {
        this.dir = ""
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.left-enter-active, .left-leave-active
  transition: all 0.3s
.left-enter
  transform: translate3d(100%, 0, 0)
.left-leave-to
  transform: translate3d(-100%, 0, 0)

.right-enter-active, .right-leave-active
  transition: all 0.3s
.right-enter
  transform: translate3d(-100%, 0, 0)
.right-leave-to
  transform: translate3d(100%, 0, 0)

</style>
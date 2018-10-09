<template>
    <div class="wrapper" ref="wrapper">
      <div class="login-header">
        <i class="icon-fanhui" @click="back"></i>
        <p class="title">个人中心</p>
        <span class="loginout" @click="loginOut">退出</span>
      </div>
      <scroll :data="loveLists" class="scroll" ref="scroll">
        <div>
          <div class="flex">
            <div class="img">
              <img src="./person.png">
            </div>
            <div class="info">
              <h2>{{username}}</h2>
              <p>简介：我是一只鱼</p>
            </div>
          </div>
          <div class="loveList">
            <div class="title">
              <h2>我喜欢的</h2>
            </div>
            <div class="list">
              <ul v-if="loveListChange">
                <li v-for="item in loveList" class="loveListItem" @click="selectItem(item)">
                  <div class="icon">
                    <i class="icon-play"></i>
                  </div>
                  <div class="name">
                    <p class="text" v-html="singer(item)"></p>
                  </div>
                </li>
              </ul>
              <ul v-else>
                <li v-for="item in loveLists" class="loveListItem" @click="selectItem(item)">
                  <div class="icon">
                    <i class="icon-play"></i>
                  </div>
                  <div class="name">
                    <p class="text" v-html="singer(item)"></p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div> 
      </scroll>  
    </div>
</template>

<script type="text/javascript">
import {mapGetters,mapActions} from 'vuex'
import Scroll from '@/baseComponents/scroll/scroll'
import {adaptBottomMixin} from '@/common/js/mixins'
 export default {
  components: {
    Scroll
  },
  mixins: [adaptBottomMixin],
  data() {
    return {
      username: name,
      loveLists: [],
      loveListChange: false
    }
  },
  computed: {
    ...mapGetters([
      'loveList'
    ])
  },
  methods: {
    back(){
      this.$router.push({
        path: '/recommend'
      })
    },
    loginOut() {
      this.$local.removeItem("name")
      this.$router.go(-2)
    },
    getLoveList() {
      let obj = this.$local.valueOf()
      for( let key in obj ) {
        let reg = /^song\d+/
        if(key.match(reg)){
          this.loveLists.push(JSON.parse(obj[key]))
        }
      }
    },
    singer(item) {
      return `${item.name}--${item.singer}`
    },
    selectItem(item) {
      this.searchToPlay(item)
    },
    ...mapActions([
      'searchToPlay'
    ]),
    // 重写mixins方法
    adaptBottom(playList){
        const bottom = this.playList.length > 0 ? '60px' : ''
        this.$refs.scroll.$el.style.bottom = bottom
        this.$refs.scroll._refresh()
    }        
  },
  created() {
    this.username = this.$local.get("name").value
    this.getLoveList()
  },
  watch: {
    loveList(val,oldVal) {
      this.loveListChange = true
    }
  }
 }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"
.wrapper
  position: fixed
  top: 0
  bottom: 0
  z-index: 100
  width: 100%
  background: $color-background
  .login-header
    position: relative
    top: 0
    left: 0
    width: 100%
    height: 44px
    line-height: 44px
    background: $color-theme
    text-align: center
    .icon-fanhui
      position: absolute
      display: inline-block
      margin-left: 10px
      font-size: $font-size-large-xl
      left: 0
    .title
      font-size: $font-size-large-x
    .loginout
      position: absolute
      right: 10px
      top: 0
  .scroll
    // height: 100%
    overflow: hidden
    position: fixed
    top: 44px
    bottom: 0
    width: 100%
  .flex
    display: flex
    padding: 16px
    position: relative
    thick-line-bottom()
    thick-line-top()
    .img
      width: 60px
      height: 60px
      border-radius: 50%
      overflow: hidden
      margin-right: 16px
    .info
      display: flex
      flex-direction: column
      justify-content: space-around
      h2
        color: $color-theme
        font-size: $font-size-large
      p
        color: $color-text-d       
  .loveList
    padding: 20px 20px 0
    .title
      text-align: center
      color: $color-theme
      font-size: $font-size-large
    .list
      margin-top: 20px
      .loveListItem
        display: flex
        margin-bottom: 6px       
        .icon
          flex: 0 0 30px
          width: 30px
          .icon-play
            font-size: $font-size-large-x
            color: $color-text-d
        .name
          flex: 1
          color: $color-text-d
          overflow: hidden
          position: relative         
          .text
            width: 96%
            no-wrap()
            font-size: $font-size-medium
            position: absolute
            top: 50%
            transform: translateY(-50%)
</style>
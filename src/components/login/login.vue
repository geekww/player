<template>
  <transition>
    <div class="wrapper">
      <div class="login-header">
        <i class="icon-fanhui" @click="back"></i>
        <p class="title">登录</p>
      </div>
      <div class="login-content">
        <form @submit.prevent="submit">
        <div class="input-group">
          <input type="text" class="input" ref="name" placeholder="请输入账号：章鱼" />
          <input type="text" class="input" ref="keyword" placeholder="请输入密码：123456" />
        </div>
        <div class="login-btn">
          <input type="submit" value="登录" class="btn">
        </div>
        </form>
        <div class="missName" ref="missName">用户名或密码错误！</div>
      </div>
      
    </div>
</transition>
</template>

<script type="text/javascript">
 export default {
  methods: {
    back(){
      this.$router.back()
    },
    submit() {
      let name = this.$refs.name.value
      let keyword = this.$refs.keyword.value
      if( name === "章鱼" & keyword === "123456" ) {
        this.$local.set( "name", {
          login: true,
          value: name
        } )
        this.$router.push({
          path: '/person'
        })
      }else {
        this.missName()
      }
    },
    missName() {
      this.$refs.missName.style.display = "block"
      setTimeout(() => {
        this.$refs.missName.style.display = "none"
      }, 1000);
    },
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
  &.v-enter-active, &.v-leave-active
    transition: all 0.3s
  &.v-enter, &.v-leave-to
    transform: translate3d(-100%, 0, 0)
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
      font-size: $font-size-large-xl
  .login-content
    height: 100%
    padding: 20px 
    margin-top: 50px 
    position: relative
    .input-group
      width: 100% 
      height: 100px
      border-radius: 5px
      overflow: hidden
      .input
        width: 100%
        height: 50%
        padding-left: 10px
        outline: none
    .login-btn
      width: 100%
      height: 50px
      border-radius: 5px
      overflow: hidden
      margin-top: 20px
      .btn
        width: 100%
        height: 100%
        background: $color-theme
        color: $color-background
    .missName
      width: 90%
      height: 50px
      text-align: center
      line-height: 50px
      background: $color-sup-theme
      border-radius: 5px
      position:absolute
      top: -40px
      left: 50%
      transform: translateX(-50%)
      display: none

</style>
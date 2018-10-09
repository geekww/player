<template>
  <div class="song_wrapper">
    <div class="rank">
      <i :class="computedClass()">{{computedTXT()}}</i>
    </div>
    <slot></slot>
  </div>
</template>

<script type="text/javascript">
	export default {
    props: {
      index: {
        type: Number,
        default: 0
      }
    },
    methods: {
      computedClass(){
        if(this.index <= 2){
          switch (this.index){
            case 0:
              return "icon-first"
              break
            case 1:
              return "icon-second"
              break
            case 2:
              return "icon-third"
              break
          }   
        }else{
          return "text"
        }
      },
      computedTXT(){
        if(this.index > 2){
          return this.index + 1
        }
      }
    }
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable"

  .song_wrapper
    display: flex
    .rank
      flex: 0 0 25px
      width: 25px
      margin-right: 10px
      text-align: center
      line-height: 20px
      .icon-first
        color: red
        font-size: $font-size-large-xl
        line-height: 25px
      .icon-second
        color: $color-sub-theme
        font-size: $font-size-large-x
        line-height: 23px
      .icon-third
        color: $color-theme
        font-size: $font-size-large
      .text
        color: $color-text-l
        font-size: $font-size-medium  
</style>
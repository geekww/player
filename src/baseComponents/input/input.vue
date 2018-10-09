<template>
  <div class="search-wrapper">
    <i class="icon-search"></i>
    <input ref="input" class="box" :placeholder="placeholder" v-model="searchTxt" 
    />
    <i class="icon-dismiss" v-show="searchTxt" @click="clearTXT()"></i>
  </div>
</template>

<script>
import {throttle} from '@/common/js/utils'
import {mapMutations} from 'vuex'
  export default {
      props: {
        placeholder: {
          type: String,
          default: '搜索歌手、歌曲，搜索结果上拉可以加载更多'
        }
      },
      data(){
        return {
          searchTxt: ''
        }
      },
      methods:{
        clearTXT(){
          this.searchTxt = ''
        },
        setTXT(k){  //让父组件调用这个方法
          this.searchTxt = k
        },
        _blur(){  //让父组件调用这个方法
          this.$refs.input.blur()         
        }
        // focusInput(){
        //   this.setInputPos(true)
        // },
        // blurInput(){
        //   this.setInputPos(false)
        // },
        // ...mapMutations({
        //   setInputPos: 'SET_INPUT_POS'
        // })
      },
      created(){
        this.$watch( 'searchTxt', throttle((newTXT, oldTXT) => {
          this.$emit( 'onTXTchange', newTXT )
        }, 300))
      }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"

  .search-wrapper
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: $font-size-large-xl
      color: $color-text-d
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text-l
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
      outline: 0
    .icon-dismiss
      font-size: $font-size-large-x
      color: $color-text-d
</style>
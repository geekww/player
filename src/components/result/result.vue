<template>
  <div ref="wrapper" class="wrapper">
  <scroll class="result" :data="result" :pullUpLoad="pullUpLoad" @pullUpLoad="_pullUpLoad" 
  :beforeScrollStart="beforeScrollStart" @beforeScroll="_beforeScroll" ref="result">
    <ul class="result-list">
      <li class="result-item" v-for="item in result" @click="selectItem(item)">
        <div class="icon">
          <i :class="showWhichIcon(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="showName(item)" :class="{hightLight: item.type === 'singer'}"></p>
        </div>
      </li>
      <loading v-show="loadMore" :title="title"></loading>
    </ul>
    <div class="cannotfind-wrapper">
      <can-not-find v-show="!loadMore && !result.length"></can-not-find> 
    </div>  
  </scroll>
  </div>
</template>

<script>
import getResult from '@/api/result'
import {ERR_OK} from '@/api/config'
import {createSong} from '@/common/js/song'
import Scroll from '@/baseComponents/scroll/scroll'
import Loading from '@/baseComponents/loading/loading'
import CanNotFind from '@/baseComponents/cannotfind/cannotfind'
import Singer from '@/common/js/singer'
import {mapMutations, mapActions} from 'vuex'
import {adaptBottomMixin} from '@/common/js/mixins'
const PERPAGE = 20
export default {
  mixins: [adaptBottomMixin],
  props: {
    searchTxt: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data(){
    return{
      page: 1,
      result: [],
      pullUpLoad: true,
      beforeScrollStart: true,
      loadMore: true,
      title: ''
    }
  },
  methods: {
    _search(){
      // 三个初始化设置，否则bug
      this.loadMore = true 
      this.page = 1  
      this.$refs.result._scrollTo(0, 0, 500)
      getResult(this.searchTxt, this.page, this.showSinger, PERPAGE).then((res) => {
        if( res.code === ERR_OK ){
          this.result = this._sortResult( res.data )
          console.log(this.result)
          this.check_loadMore( res.data.song )  //搜索完一组数据后计算并更新this.loadMore
        }      
      })
      
    },
    // 上拉加载
    _pullUpLoad(){
      if( !this.loadMore ) { return }
      this.page++
      getResult(this.searchTxt, this.page, this.showSinger, PERPAGE).then((res) => {
        if( res.code === ERR_OK ){
          if( this.result[0].singerid ){ //防止每次加载搜索列表中出现多个重复歌手
            this.result = this.result.concat( this._sortResult( res.data ).slice(1) )
          }else{
            this.result = this.result.concat( this._sortResult( res.data ) )
          }
          this.check_loadMore( res.data.song )  //搜索完一组数据后计算并更新this.loadMore
        }      
      })
      
    },
    check_loadMore(song){
      if( !song.list.length || (PERPAGE * song.curpage + song.curnum) > song.totalnum ){
        this.loadMore = false
      }
    },
    _sortResult(data){
      let arr = []
      if( data.zhida && data.zhida.singerid ){
        arr.push( {...data.zhida, ...{type: "singer"}} )
      }
      if( data.song ){
        arr = arr.concat( this._createSongs(data.song.list) )
      }
      return arr
    },
    _createSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
    },
    showWhichIcon(item){
      if( item.type === "singer" ){
        return "icon-icon"
      }else{
        return "icon-play"
      }
    },
    showName(item){
      if( item.type === "singer" ){
        return item.singername
      }else{
        return `${item.name}——${item.singer}`
      }
    },
    selectItem(item) {
       if( item.type === "singer" ) {
          let singer = new Singer({
            id: item.singermid,
            name: item.singername
          })        
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
       }else {
        this.searchToPlay(item)
       }
       this.setHistroy(item)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER',
      setHistroy: 'SET_SEARCH_HISTORY'
    }),
    ...mapActions([
      'searchToPlay'
    ]),
    _beforeScroll(){
      this.$emit( '_beforeScroll' )
    },
    adaptBottom(playList){
        const bottom = this.playList.length > 0 ? '60px' : ''
        this.$refs.wrapper.style.bottom = bottom
        this.$refs.result._refresh()
    }
  },
  watch: {
    searchTxt(){
      this._search()
    }
  },
  components: {
    Scroll,
    Loading,
    CanNotFind
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"
.wrapper
  position: fixed
  width: 100%
  top: 160px
  bottom: 0
  .result
    height: 100%
    overflow: hidden
    .result-list
      padding: 0 30px
      .result-item
        display: flex
        align-items: center
        padding-bottom: 20px
        .hightLight
          color: $color-theme
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: $font-size-large-x
          color: $color-text-d
        .icon-icon
          color: $color-theme
          font-size: $font-size-large-xl
      .name
        flex: 1
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
          font-size: $font-size-medium
    .cannotfind-wrapper
      position: absolute
      width: 100%
      top: 20%
</style>
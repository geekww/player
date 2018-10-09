<template>
  <div class="song-list">
    <ul>     
      <li v-for="(song, index) in songs" class="item" @click="selectSong(song, index)" :class="{hightLight: song.id === currentSong.id}">      
        <song-rank-complex :index="index"  v-if="showWhich()">
          <div class="content">
            <h2 class="name" :class="{hightLight: song.id === currentSong.id}">{{song.name}}</h2>
            <p class="desc" :class="{hightLight: song.id === currentSong.id}">{{getDesc(song)}}</p>
          </div>
        </song-rank-complex>
         <song-rank-simple :index="index" v-else>
          <div class="content">
            <h2 class="name" :class="{hightLight: song.id === currentSong.id}">{{song.name}}</h2>
            <p class="desc" :class="{hightLight: song.id === currentSong.id}">{{getDesc(song)}}</p>
          </div>
        </song-rank-simple>
        <div class="currentIcon" v-if="song.id === currentSong.id">
          <i class="icon-playing"></i>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/javascript">
import SongRankSimple from '@/baseComponents/songRank/songranksimple'
import SongRankComplex from '@/baseComponents/songRank/songrankcomplex'
import {mapGetters} from 'vuex'
// 基础组件，不涉及业务逻辑，点击后向父组件song.vue派发事件
	export default {
    props: {
      songs: {
        type: Array,
        default: []
      }
    },
    computed: {
      ...mapGetters([
        'currentIndex',
        'currentSong',
        'playing'
      ])
    },
    methods: {
      getDesc(s){
        return `${s.singer} · ${s.album}`
      },
      selectSong( song, index ){
        this.$emit( 'selectSong', song, index )
      },
      showWhich(){
        return this.$route.matched[0].path ==='/rank'
      }
    },
    components: {
      SongRankSimple,
      SongRankComplex
    }
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable"
@import "../../common/stylus/mixin"

  .song-list
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $font-size-medium
      position: relative
      .hightLight
        color: $color-theme !important
      &:after
        position: absolute
        height: 1px
        content: ''
        background: $color-text-d
        transform: scaleY(0.2)
        width: 100%
        top: 100%
        left: 0
      .currentIcon
        position: absolute
        right: 2px
        font-size: $font-size-large
        color: $color-theme
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text-l
          width: 240px
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text-d
          width: 240px
</style>
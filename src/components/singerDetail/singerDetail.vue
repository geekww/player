<template>
  <transition>
    <song-page :songs="songsList" :bg-image="bgImage" :title="title"></song-page>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import {createSong} from '@/common/js/song'
import getSingerDetail from '@/api/singerdetail'
import SongPage from '@/components/song/song'
export default {
  components: {
    SongPage
  },
  data() {
    return {
      songsList: []
    }
  },
  computed: {
      ...mapGetters([  //singer存储歌手详细信息
        'singer'
      ]),
      bgImage(){               
        return this.singer.pic       
      },
      title(){
        return this.singer.name       
      }
  },
  created(){
    this._getSingerDetail()
  },
  methods: {
    // 获取歌手详细信息(歌曲信息musicData)
    _getSingerDetail(){

      if( !this.singer.id ) {  //点击歌手时才可获取到歌手id值，那么在歌手详情页刷新页面无法获得id，需要返回歌手列表页面
        this.$router.push({
          path: '/singer'
        })
        return
      }
      getSingerDetail( this.singer.id ).then((res) => {
        
        this.songsList = this._sortSongsList( res.data.list )
        //console.log(res.data.list)

      }).catch((err) => {
        console.log(err)
      })

    },
    _sortSongsList(list) {
      let ret = []
      list.forEach((item, index) => {
        let musicData = item.musicData //只需要musicData的数据
        if( musicData.songid && musicData.albummid ){
          ret.push( createSong( musicData ) )
        }
      })
      return ret
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable"

  .v-enter-active, .v-leave-active
    transition: all 0.5s
  .v-enter, .v-leave-to
    transform: translate3d(100%, 0, 0)

</style>
<template>
  <transition>
    <song-page :bg-image="bgImage" :title="title" :songs="rankDetail"></song-page>
  </transition>
</template>

<script>
import SongPage from '@/components/song/song'
import {mapGetters} from 'vuex'
import getRankDetail from '@/api/rankDetail'
import {createSong} from '@/common/js/song'
import {ERR_OK} from '@/api/config'
  export default {
    components: {
      SongPage
    },
    computed: {
      ...mapGetters([
        'rank'
      ]),
      title(){
        return this.rank.topTitle
      },
      bgImage(){
        if( this.rankDetail.length ){  //数据加载完成后才能获得，否则会报错
          return this.rankDetail[1].image
        }
      }
    },
    data(){
      return {
        rankDetail: []
      }
    },
    created(){
      this._getRankDetail()
    },
    methods: {
      _getRankDetail(){
        if( !this.rank.id ){
          this.$router.push({
            path: '/rank'
          })
          return
        }
        getRankDetail(this.rank.id).then((res) => {
          if( res.code === ERR_OK ){
            console.log(res.songlist)
            this.rankDetail = this._sortSongsList( res.songlist )
          }
        })
      },
      _sortSongsList(list) {
        let ret = []
        list.forEach((item) => {
          const m_data = item.data
          if( m_data.songid && m_data.albummid ){
            ret.push( createSong( m_data ) )
          }
        })
        return ret
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"


</style>
<template>
  <transition>
    <song-page :bg-image="bgImage" :title="title" :songs="recommendList"></song-page>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import SongPage from '@/components/song/song'
import getDesDetail from '@/api/recommendDetail'
import {createSong} from '@/common/js/song'
import {ERR_OK} from '@/api/config'
export default {
  components: {
    SongPage
  },
  data(){
  	return{
  		recommendList: []
  	}
  },
  computed: {
  	...mapGetters([
        'recommend'
  	]), 
  	title(){
  		return this.recommend.songListAuthor
  	},
  	bgImage(){               
        return this.recommend.picUrl       
    },
  },
  created(){
  	// this._getDesDetail()
  	
  },
  methods: {
  	_getDesDetail(){
  		if( !this.recommend.id ) {  //点击歌单时才可获取到歌单id值，刷新页面无法获得id，需要返回歌手列表页面
        this.$router.push({
          path: '/recommend'
        })
        return
      }
  		getDesDetail(this.recommend.id).then((res) => {
  			if( res.code === ERR_OK ){
  				this.recommendList = this._sortSongsList(res.cdlist[0].songlist) 

  			}			
  		})
  	},
  	_sortSongsList(list) {
      let ret = []
      list.forEach((item) => {
        if( item.songid && item.albummid ){
          ret.push( createSong( item ) )
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
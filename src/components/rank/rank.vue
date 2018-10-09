<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" ref="scroll" :data="rank">
      <ul>
        <li class="item" v-for="item in rank" @click="chooseItem(item)">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl"/>
          </div>
          <ul class="songlist">
            <li class="song" v-for="song,index in item.songList">
              <span>{{index + 1}}</span>
              <span>{{song.songname}} - {{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!rank.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import Scroll from '@/baseComponents/scroll/scroll'
import Loading from '@/baseComponents/loading/loading'
import getRank from '@/api/rank'
import {adaptBottomMixin} from '@/common/js/mixins'
import {mapMutations} from 'vuex'
  export default {
  	mixins: [adaptBottomMixin],
  	components: {
  		Scroll,
  		Loading
  	},
    created(){
    	setTimeout(()=> {
    		this._getRank()
    	},500);
    },
    data(){
    	return {
    		rank: []
    	}
    },
    methods: {
    	_getRank(){
    		getRank().then((res) => {
    			this.rank = res.data.topList
    	    })
    	},
    	chooseItem(item){
    		this.$router.push({
    			path: `/rank/${item.id}`
    		})
    		this.setRank(item)
    	},
    	...mapMutations({
    		setRank: 'SET_RANK'
    	}),

    	// 重写mixins方法
	    adaptBottom(playList){
	        const bottom = this.playList.length > 0 ? '40px' : ''
	        this.$refs.rank.style.bottom = bottom
	        this.$refs.scroll._refresh()
	    }   	
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

.rank
  position: fixed
  width: 100%
  top: 88px
  bottom: 0
  .toplist
    height: 100%
    overflow: hidden
    ul
      padding-bottom: 40px
      .item
        display: flex
        margin: 20px 20px 0 20px
        height: 100px
        border-radius: 10px
        overflow: hidden
        &:last-child
          //margin-bottom: 40px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
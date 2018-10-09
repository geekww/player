<template>
	<div class="search">
		<div class="search-box-wrapper">
			<s-input ref="sinput" @onTXTchange="onTXTchange"></s-input>
		</div>
		<div class="hotkey-wrapper" v-show="!searchTxt">
			<div class="shortcut">
				<div class="hotkey">
					<i class="icon-huo"></i>
					<h1 class="title">热门搜索</h1>
					<ul>
						<li @click="selectItem(item.k, index)" class="item" 
							v-for="item,index in hotKey" 
							:class="{hightLight: index === 0}"
						>{{item.k}}</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="search-result" v-show="searchTxt">
			<result :searchTxt="searchTxt" @_beforeScroll="_beforeScroll"></result>
		</div>
	<router-view></router-view>
	</div>
</template>

<script>
import SInput from '@/baseComponents/input/input'
import Result from '@/components/result/result'
import getHotKey from '@/api/search'
import {ERR_OK} from '@/api/config'
export default {
	components: {
		SInput,
		Result
	},
	data(){
		return {
			hotKey: [],
			searchTxt: ''
		}
	},
	created(){
		this._getHotKey()	
	},
	methods: {
		_getHotKey(){
			getHotKey().then((res) => {
				this.hotKey = res.data.hotkey.slice(0,20)
				this.hotKey.unshift({
					"k": res.data.special_key,
					"url": res.data.special_url
				})
			})
		},
		selectItem(k, index){
			if( index === 0 ){  //第一个是特殊关键字，点击自动跳转相应页面
				window.location.href = this.hotKey[0].url
				this.$refs.sinput.setTXT('')
			}else{
				this.$refs.sinput.setTXT(k)  //子组件内定义的方法可以在父组件中调用，只要获得子组件的引用即可
			}
		},
		onTXTchange(newTXT){
			this.searchTxt = newTXT
		},
		_beforeScroll(){
			this.$refs.sinput._blur()
		}
	}
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
 @import "../../common/stylus/variable"
 @import "../../common/stylus/mixin"
  .search
    .search-box-wrapper
      margin: 10px
    .hotkey-wrapper
      position: fixed
      top: 170px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hotkey
          margin: 0 20px 20px 20px
          .icon-huo
            float: left
            color: red
            font-size:18px
            margin-right: 4px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
            font-weight: bold
            height: 18px
            line-height: 18px
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 100px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
          .hightLight
            color: red
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0

</style>
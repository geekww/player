import getLyric from '@/api/lyric'
import {ERR_OK} from '@/api/config'
import {Base64} from 'js-base64'
export default class Song {
	constructor({id, mid, singer, name, album, duration, image, url}){
		this.id = id
		this.mid = mid
		this.name = name
		this.singer = singer
		this.album = album
		this.duration = duration
		this.image = image
		this.url = url		
	}
	// 将歌词数据作为Song类的属性，lyric()将在play.vue中currentSong发生变化时执行
	getLyric(){
		// 每次currentSong发生变化时执行这个函数就会发送ajax请求，这显然不合理，如下判断
		if( this.lyric ) {  //如果有这个歌词，那么直接返回一个Promise对象
			return Promise.resolve( this.lyric )
		}

		return new Promise((resolve, reject) => {
			getLyric(this.mid).then((res) => {
			if(res.code === ERR_OK){
				this.lyric = Base64.decode( res.lyric )
				//console.log(this.lyric)
				resolve( this.lyric )
			}else{
				reject( 'Lyric error' )
			}
		})
		})
		
	}
}

export function createSong( musicData ){
	return new Song({
		id: musicData.songid,
		mid: musicData.songmid,
		singer: switchToString(musicData.singer),
		name: musicData.songname,
		album: musicData.albumname,
		duration: musicData.interval, //时长
		image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`, //专辑图片
		// url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`  //播放源
		url: `http://dl.stream.qqmusic.qq.com/C400${
        musicData.songmid
      }.m4a?guid=9035189320&vkey=F45CF08E99A296E05513E32A93FB60D08AB5BFC9141579AEE02158FA73B176DB7775B506740ED3940F48B51C15FB40FBB1C20F6DBADE946D&uin=&fromtag=999`
	})
}
// musicData里面singer的数据结构是数组，我要的数据结构是字符串，并且多个歌手用'/'拼接
export function switchToString(singer) {
	let ret = []
	if(!singer){
		return ''
	}
	singer.forEach((item) => {
		ret.push( item.name )
	})
	return ret.join( '/' )

}

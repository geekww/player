export default class Singer {
	constructor({id, name}){
		this.id = id
		this.name = name
		this.pic = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
	}
}

// 不用在sort歌手数据结构时每次调用new
export function createSinger(item){
	return new Singer({
		id: item.Fsinger_mid,
		name: item.Fsinger_name,
		pic: `https://y.gtimg.cn/music/photo_new/T001R150x150M000${item.Fsinger_mid}.jpg?max_age=2592000`
	})
}
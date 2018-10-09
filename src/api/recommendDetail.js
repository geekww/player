import axios from 'axios'
import jsonp from '@/common/js/jsonp'
import {commonParams, options} from './config'

export default function getDesDetail(disstid){
	const url = "https://y.qq.com/w/taoge.html"
	const data = Object.assign( {}, commonParams, {
		g_tk:5381,
		platform:'h5',
        needNewCode:1,
        new_format:1,
        pic:500,
        disstid:disstid,
        type:1,
        json:1,
        utf8:1,
        onlysong:0,
        picmid:1,
        nosign:1,
        song_begin:0,
        song_num:15,
        _:1515050425384
	})
	return jsonp( url, data, options )
	// const url = '/api/getDesDetail'
	// // 把公共参数和其他参数合并
	// const data = Object.assign( {}, commonParams, {
	// 	type:1,
	// 	json:1,
	// 	utf8:1,
	// 	onlysong:0,
	// 	disstid:disstid,
	// 	format:'json',
	// 	g_tk:5381,
	// 	loginUin:0,
	// 	hostUin:0,
	// 	platform:'yqq',
	// 	needNewCode:0
	// })
	// return axios.get( url, {
	// 	params: data
	// } ).then( (res) => {
	// 	return Promise.resolve( res.data )
	// } )
}
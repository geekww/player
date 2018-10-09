import axios from 'axios'
import jsonp from '@/common/js/jsonp'
import {commonParams, options} from './config'

export default function getDesList(){

	// const url = '/api/getDesList'
	const url = "https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg"
	// 把公共参数和其他参数合并
	const data = Object.assign( {}, commonParams, {
		// picmid:1,
		// rnd:Math.random(),
		// g_tk:5381,
		// loginUin:0,
		// hostUin:0,
		// platform:'yqq',
		// needNewCode:0,
		// categoryId:99,
		// sortId:5,
		// sin:0,
		// ein:29
		g_tk:5381,
        platform:"h5",
        needNewCode:1,
        _:1515039362521
	})
	return jsonp( url, data, options )
	// return axios.get( url, {
	// 	params: data
	// } ).then( (res) => {
	// 	return Promise.resolve( res.data )
	// } )
}
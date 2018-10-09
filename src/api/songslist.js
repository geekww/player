import axios from 'axios'
import {commonParams, options} from './config'

export default function getDesList(){

	const url = '/api/getDesList'
	// 把公共参数和其他参数合并
	const data = Object.assign( {}, commonParams, {
		picmid:1,
		rnd:Math.random(),
		g_tk:5381,
		loginUin:0,
		hostUin:0,
		format:'jsonp',
		platform:'yqq',
		needNewCode:0,
		categoryId:99,
		sortId:5,
		sin:0,
		ein:29
	})
	return axios.get( url, {
		params: data
	} ).then( (res) => {
		return Promise.resolve( res.data )
	} )
}
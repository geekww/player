import jsonp from '@/common/js/jsonp'
import {commonParams, options} from './config'

export default function getRankDetail(topid){

	const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
	// 把公共参数和其他参数合并
	const data = Object.assign( {}, commonParams, {
		g_tk:5381,
		format:'jsonp',
		platform:'h5',
		needNewCode:1,
		tpl:3,
		page:'detail',
		type:'top',
		topid:topid
	})
	return jsonp( url, data, options )
}
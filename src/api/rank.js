import jsonp from '@/common/js/jsonp'
import {commonParams, options} from './config'

export default function getRank(){

	const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
	// 把公共参数和其他参数合并
	const data = Object.assign( {}, commonParams, {
		g_tk:5381,
		uin:0,
		format:'jsonp',
		platform:'h5',
		needNewCode:1,
		_:1513161782839
	})
	return jsonp( url, data, options )
}
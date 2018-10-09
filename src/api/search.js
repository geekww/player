import jsonp from '@/common/js/jsonp'
import {commonParams, options} from './config'

export default function getHotKey(){

	const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
	// 把公共参数和其他参数合并
	const data = Object.assign( {}, commonParams, {
		g_tk:5381,
		platform:'h5',
		needNewCode:1,
		_:1513243875804
	})
	return jsonp( url, data, options )
}
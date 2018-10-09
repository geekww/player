import jsonp from '@/common/js/jsonp'
import {commonParams, options} from './config'

export default function getRcommend(){

	const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
	// 把公共参数和其他参数合并
	const data = Object.assign( {}, commonParams, {
		g_tk: 1937468452,
		platform: 'h5',
		uin: 0,
		needNewCode: 1,
		_: 1512458339757
	})
	return jsonp( url, data, options )
}


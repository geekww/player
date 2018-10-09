import jsonp from '@/common/js/jsonp'
import {commonParams, options} from './config'

export default function getSingerList(){

	const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
	// 把公共参数和其他参数合并
	const data = Object.assign( {}, commonParams, {
		channel: 'singer',
		page: 'list',
		key: 'eu_team_all',
		pagesize: 100,
		pagenum: 1,
		loginUin: 0,
		hostUin: 0,
		g_tk: 450152082,
		platform: 'yqq',
		needNewCode: 0,
		format: 'jsonp'
	})
	return jsonp( url, data, options )
}

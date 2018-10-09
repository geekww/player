import jsonp from '@/common/js/jsonp'
import {commonParams, options} from './config'

export default function getSingerDetail(singerId){

	const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
	// 把公共参数和其他参数合并
	const data = Object.assign( {}, commonParams, {
		singermid: singerId,
		loginUin: 0,
		hostUin: 0,
		g_tk: 5381,
		platform: 'yqq',
		needNewCode: 0,
		format: 'jsonp',
		order:'listen',
		begin:0,
		num:100,
		songstatus:1
	})
	return jsonp( url, data, options )
}
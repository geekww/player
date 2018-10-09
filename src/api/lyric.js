import axios from 'axios'

import {commonParams, options} from './config'

export default function getLyric(mid){

	const url = '/api/getLyric'
	const data = Object.assign( {}, commonParams, {
		pcachetime: + new Date() ,
		songmid: mid,
		g_tk: 5381,
		loginUin: 0,
		hostUin: 0,
		format: 'json',
		platform:'yqq',
		needNewCode: 0
	})

	return axios.get( url, {
		params: data
	} ).then( (res) => {
		return Promise.resolve( res.data )
	} )
}
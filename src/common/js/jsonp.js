//基于https://github.com/webmodules/jsonp的封裝，提供更加友好的api
import originJSONP from 'jsonp'

export default function jsonp( url, data, opt ) {

	url += (url.indexOf('?') < 0 ? '?' : '&') + params(data) //如果url本身没有'?'那么加上'?',否则直接加上'&'

	return new Promise( (resolve, reject) => {
		originJSONP( url, opt, (err, data) => {
			if( !err ){
				resolve(data)
			}else{
				reject(err)
			}
		} )
	} )
}
// 把data添加到url后面
function params(data){
	let url = '';
	for( let k in data ){
		let value = data[k] !== undefined ? data[k] : ''
		url += '&' + k + '=' + encodeURIComponent(value)
	}
	return url ? url.substring(1) : ''
}
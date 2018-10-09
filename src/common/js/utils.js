// 返回随机整数
export function random_digit(min, max) {
	return Math.floor( Math.random() * ( max - min + 1 ) + min )
} 
// 数组洗牌
// 为了不修改原数组，需要对原数组的副本进行操作
export function shuffle(arr) {
	let _arr = arr.slice()
	for (let i = 0; i < _arr.length - 1; i++) {
		let j = random_digit( 0, i )
		let mid = _arr[i]
		_arr[i] = _arr[j]
		_arr[j] = mid
	}
	return _arr
}

// 节流
export function throttle( func, delay ) {
	let timer
	return function(...args) {
		if( timer ) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
            func.apply( this, args ) 
		}, delay);
	}
}
// 添加事件
export function addEvent(obj,type,fn,capture){
    if(obj.addEventListener){
        obj.addEventListener(type,fn,capture);
    }else if(obj.attachEvent){
        obj.attachEvent("on"+type,fn);
    }
}
// 移除事件
export function removeEvent(obj,type,fn,capture){
    if(obj.removeEventListener){
        obj.removeEventListener(type,fn,capture);
    }else if(obj.detachEvent){
        obj.detachEvent("on"+type,fn);
    }
} 
// 阻止默认行为
export function preDef(ev){
    var ev = ev || window.event;
    if(ev.preventDefault){
        ev.preventDefault();
    }else {
        ev.returnValue = false;
    }
}
// 获取事件目标元素
export function getTarget(ev){
    var ev = ev || window.event;
    if(ev.target){
        return ev.target;
    }else if(window.event.srcElement){
        return window.event.srcElement;
    }
}
// 获取滚动位置
export function getSP(){
    return {
        top : document.documentElement.scrollTop || document.body.scrollTop,
        left : document.documentElement.scrollLeft || document.body.scrollLeft
    }
}
// 获取可视化窗口大小
export function getWindow(){
    if(window.innerWidth !== void 0){
        return {
            width : window.innerWidth,
            height : window.innerHeight
        }    
    }else{
            return {
                width : document.documentElement.clientWidth,
                height : document.documentElement.clientHeight
            }        
        }
}
// 获取屏幕坐标（相对于整个页面而不是可视区）
export function getMouse(ev){
    if(ev.pageX !== void 0){
        return {x:ev.pageX,y:ev.pageY};
    }    
    return {
        x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
        y:ev.clientY + document.body.scrollTop - document.body.clientTop
    }
}
// 原生拖拽
export function onDrop(ele){
    if(ele.nodeType !== 1){ return }
    ele.style.position = "relative";
    ele.onmousedown = function(ev){
        var ev = ev || window.event;
        var diffX = ev.clientX - parseInt(ele.style.left+"0"),
            diffY = ev.clientY - parseInt(ele.style.top+"0");
        document.onmousemove = function(e){
            var e = e || window.event;
            ele.style.left = e.clientX - diffX + "px";
            ele.style.top = e.clientY - diffY + "px";
        };
        document.onmouseup = function(e){
            var e = e || window.event;
            this.onmousemove = null;
            this.onmouseup = null;
        };
    } 
} 
// 获取随机颜色
export function getColor(){
    return "#"+Math.random().toString(16).substr(2,6);
}
// 千分隔位
export function separator(str){
    if(!isNaN(+str)){
        str = (+str).toFixed(2);
        return str.replace(/\B(?=(?:\d{3})+\.)/g,",");
    }
}
// 获取计算后的样式
export function getCpStyle(ele,attribute){
    if(typeof getComputedStyle === "function"){
        return getComputedStyle(ele)[attribute];
    }else if(ele.currentStyle){
        return ele.currentStyle[attribute];
    }
}
// 获取XMLHTTPRequest对象
export function getXHR(){
    var xhr;
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }else if(window.ActiveXObject){
        xhr = new ActiveXObject("Microsoft.XMLHttp");
    }    return xhr;
}
// 类名操作（有则删除，没有则添加）
export function setClass(ele,className){
    if(ele.className !== void 0){
        var str = ele.className,reg=new RegExp("\\b"+className+"\\s");
        if(reg.test(str)){
            str=str.replace(reg,"");
        }else{
            str += " "+className+" ";
        }        ele.className = str.replace(/\s+/," ");
    }
}
// ajax
export const Ajax={
    get: function(url, fn) {
        var obj = new XMLHttpRequest();
        obj.open('GET', url, true);
        obj.onreadystatechange = function() {
            if (obj.readyState == 4 && obj.status == 200 || obj.status == 304) {
                fn.call(this, obj.responseText);
             }        
        };
        obj.send();
    },
    post: function (url, data, fn) {
          var obj = new XMLHttpRequest();
        obj.open("POST", url, true);
        obj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        obj.onreadystatechange = function() {
            if (obj.readyState == 4 && (obj.status == 200 || obj.status == 304)) {
                 fn.call(this, obj.responseText);
            }        
        };
        obj.send(data);
    }
}
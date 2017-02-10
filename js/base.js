//获得地址栏参数
getparam = function() {
	var param = {};
	var p = location.href.split('?');
	if (p.length > 1) {
		p = p[1].split('&');
		$.each(p, function(i, n) {
			p2 = n.split('=');
			param[p2[0]] = decodeURI(p2[1]) || '';
		});
	}
	return param;
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function(fmt) { //author: meizz 
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

//写cookies
function setCookie(name, value) {
	var Days = 30;
	var exp = new Date();
	exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
	document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
}

//读取cookie
function getCookie(name) {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if (arr = document.cookie.match(reg))
		return unescape(arr[2]);
	else
		return null;
}

//删除cookie
function delCookie(name) {
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = getCookie(name);
	if (cval != null)
		document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/";
}

function getBrowser() {
	//ios|android-oasisapp-client|doctor|nurse/2.5.4
	var browser = {};
	var ua = navigator.userAgent;
	//完整ua
	browser.ua = ua;
	//是否泓华app
	browser.isapp = ua.indexOf('oasisapp') > 0;
	//是否安卓设备
	browser.isandroid = ua.indexOf('android-oasisapp') > 0;
	//是否ios设备
	browser.isios = ua.indexOf('ios-oasisapp') > 0;
	//是否客户端
	browser.isclient = ua.indexOf('oasisapp-client') > 0;
	//是否医生端
	browser.isdoctor = ua.indexOf('oasisapp-doctor') > 0;
	//是否护士端
	browser.isnurse = ua.indexOf('oasisapp-nurse') > 0;
	//如果是app
	if (browser.isapp) {
		//泓华完整标识
		browser.oasis = ua.split('&&&')[1] || ua.split('oasisapp-')[1];
		//设备 iso|android
		browser.device = browser.oasis.split('-')[0];
		//客户端类型 client|doctor|nurse
		browser.client = ua.split('-oasisapp-')[1].split('/')[0];
		//客户端版本号
		browser.version = ua.split('-oasisapp-')[1].split('/')[1];
	}

	return browser;
}

;
(function($) {
	$.fn.share = function(title, content, href) {
		return this.each(function() {
			if (!getBrowser().isapp) {
				$(this).hide();

			} else {
				$(this).show().click(function() {
					var v = getBrowser().version.split('.')
						//console.log(location.href = 'oasis://share?&&&' + encodeURIComponent(title) + '&&&' + encodeURIComponent(content) + '&&&' +encodeURIComponent(location.href));
					if (getBrowser().isios&&parseInt(v[0])>= 2 && parseInt(v[1]) >= 6 && parseInt(v[2]) > 8) { //版本小于等于2.6.9 不加?
						
						str = 'oasis://share?';
					} else {
						str = 'oasis://share';
					}
					location.href = str + '&&&' + encodeURI(title) + '&&&' + encodeURI(content) + '&&&' + encodeURI(location.href) + '';
				})
			}
		})

	}

})(Zepto);
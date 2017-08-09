(function(){
	function getsearch () {
	    var arr = location.search.substring(1).split('&');
	    var data = {};
	    for (var i = 0; i < arr.length; i++) {
	        var pos = arr[i].indexOf('=');
	        if (pos === -1) {
	            continue;
	        }
	        data[arr[i].substring(0, pos)] = decodeURIComponent(arr[i].substring(pos + 1));
	    }
	    return data;
	}

	function getcookies (name) {
		if (document.cookie.length > 0) {
			var start = document.cookie.indexOf(name + "=")
			if (start != -1) {
				start = start + name.length + 1;
				var end = document.cookie.indexOf(";", start);
				if (end == -1) end = document.cookie.length
				return unescape(document.cookie.substring(start, end))
			}
		}
		return ""
	}

	function iswechat () {
        var ua = navigator.userAgent;
        if (/MicroMessenger/i.test(ua)) {
            return true;
        } else {
            return false;
        }
	}

    var search = getsearch();

    var arr = [];

    for(var r in search){
        arr.push(r + '=' + search[r]);            
    }

    arr.push('pathname='+location.pathname)

    if(iswechat() && location.hostname.indexOf('springrass.com') > -1){
    	if(!getcookies('__KEY__') && !search.code){
			location = location.protocol + '//' + location.host + '/new/redirect.html?'+arr.join('&');
    	}
    }
	// if(!getcookies('__KEY__') && !search.code && iswechat() && location.hostname.indexOf('springrass.com') > -1){			
	//    location = location.protocol + '//' + location.host + '/new/redirect.html?'+arr.join('&');					
	// }
})()
define(function (require, exports, module) {
   var env = require('../../config/env');
   var Ajax = {
		post : function(url,data,successful,fail){
			var layermask = true;
			if(!typeof url === 'string') return false;
			if(typeof data === 'function'){
				fail = successful;
				successful = data;
				data = {};
			}
			if(data.layermask === false){
				layermask = data.layermask;
			}
			return this.request(url,data,successful,fail,layermask);
		},
		request:function(url,data,successful,fail,layermask){
			var index = 0;
			if(layermask){
				index = layer.open({ type:2});
			}
	        return $.ajax({
	            type : 'post',
	            cache: false,
	            dataType : 'json',
	            timeout  : 10000,
	            url : this.getUrl(url),
	            data: this.extends(data||{}),
	            success: function(response,xhr) {
                    this.success(response,successful,fail);
	            }.bind(this),
	            error: function(response, xhr) {
	            	this.fail(response,fail);
	            }.bind(this),
	            complete: function() {
	                layermask && layer.close(index);
	            }
	        });
		},
		success:function(response,success,fail){
            if (response.code == 0) {
            	success && success(response.data)
            } else {
            	this.fail(response,fail);
            }			
		},
		fail:function(response,fail){	
	        if (response.code == 900003) {
                //token失效
	        } else if (response.code == 900007) {
	            //微信绑定接口
	        } else {
	        	//debugger;
	        	//console.log(response);
	        	var message = response.msg || response.statusText;
		        layer.open({ content: message || '网络有点小情绪', time: 2 });
	        }
	        fail && fail(response);		    		
		},
		getUrl: function(url) {
			if (env === "production") {
				return 'https://api.springrass.com/rest/' + url;
			} else if (env === "preventive") {
				return 'https://preapi.springrass.com/rest/' + url;
			} else {
				return 'https://api.tes.springrass.com/rest/' + url;
			}
		},
		extends: function(data) {
			var defaults = {
				app_key: 'channel_wechat_1',
				app_version: '1.0.0',
				api_version: '1.0.0',
				timestamp: new Date().Format("yyyy-MM-dd hh:mm:ss")
			}
			for (var d in data) {
				if(data[d] == '') {
					delete data[d];
				};
				if(data[d] == null || data[d] == 'null'){
					delete data[d];
				};
				if(data[d] == undefined || data[d] == 'undefined'){
                    delete data[d];
				};
			}
			for (var r in defaults) {
				data[r] = defaults[r];
			}
			return data;
		}
   }

   module.exports = Ajax;
})
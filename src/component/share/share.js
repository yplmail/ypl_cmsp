define(function(require, exports, module) {
	var ajax  = require('ajax');
	module.exports = function (share) {
		ajax.post('user/wechatShare',{
			layermask:false,
			url: location.href.replace(/#.+$/, '')
		},function(data) {
			wx.config({
				appId    : data.wxConfig.appId,
				timestamp: data.wxConfig.timeStamp,
				nonceStr : data.wxConfig.nonceStr,
				signature: data.wxConfig.signature,
				jsApiList: ['showOptionMenu', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone']
			});
			wx.ready(function() {
				// 分享到朋友圈
				wx.onMenuShareTimeline(share);
				// 分享给朋友
				wx.onMenuShareAppMessage(share);
				// 分享到QQ
				wx.onMenuShareQQ(share);
				//分享到QQ空间
				wx.onMenuShareWeibo(share);
			});                
			wx.error(function(res) {
				layer.open({
					content: '微信初始化信息验证失败',
					time: 2
				});
		    });
	    })
	}
})           

   
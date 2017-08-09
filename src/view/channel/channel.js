define(function (require, exports, module) {
	var common = require('common');
	var ajax   = require('ajax');
    var channel = {
        init: function() {
            this.pageIndex = 1;
            this.pageSize = 10;
            this.serach = common.getsearch();
            this.fetchChannelInfo();
            this.fetchChannelVideo();
            this.initEvent();
        },

        fetchChannelInfo: function() {
            ajax.post('uservideo/channelInfo',{
            	channelUserId: this.serach.channelId
            },function(response) {
                $("#channelAvatar").attr('src', common.joinImageUrl(response.avatar));
                $("#nickName").text(response.nickName || '草莓看客');
                if(response.introduction.length > 41){
                    $("#introduction").text(response.introduction.substr(0, 41) + '...');                        
                }else{
                    $("#introduction").text(response.introduction);     
                }
                $("#fans").text(response.fans);
                $("#praise").text(response.praise);
                $("#attention").text(response.attention);
            }.bind(this));
        },

        fetchChannelVideo: function() {
        	ajax.post('video/ownerVideoList',{
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                ownerId: this.serach.channelId,
                userType: this.serach.channelId ? 0 : 1        		
        	},function(response){
                this.pageCount = response.pageCount;
                this.isLoading = false;
                if (response.totalCount > 0) {
                    var tpl = _.template($("#videoListTpl").html());
                    $(".scroll-outer").append(tpl(response.datas));
                    if (this.pageIndex < this.pageCount) {
                        $(".scroll-loading").show();
                    } else {
                        $(".scroll-loading").hide();
                    }
                } else {
                    $(".scroll-outer").append($("#emptyTpl").html());
                }
        	}.bind(this));
        },


        initEvent: function() {       	
            window.addEventListener('scroll', this.scrollEvent.bind(this), false);
            $(".edit-channel").on('click', function() {
                var index = layer.open({
                    content: '通过APP才能操作哦！',
                    style: 'background-color:#fff; color:#323232;width:70%', //自定风格
                    btn: ['确定', '取消'],
                    yes: function(index) {
                        layer.close(index)
                        location.href = "https://m.springrass.com/multipage/download.html";
                    }.bind(this)
                });
            })
        },

        scrollEvent: function(event) {
            event.preventDefault();
            var body = document.querySelector('body');        
            var scrollpos = $(window).height() + body.scrollTop;
            var maxHeight = body.offsetHeight;
            if(scrollpos >= maxHeight){
                if(this.isLoading) return false;
                if(this.pageIndex < this.pageCount){
                    ++this.pageIndex;
                    this.isLoading = true;
                    this.fetchChannelVideo();                  
                }
            }
        }
    }
    channel.init();
})

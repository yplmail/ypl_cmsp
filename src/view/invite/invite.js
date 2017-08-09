define(function (require, exports, module) {
    var common = require('common');
	var ajax   = require('ajax');
    var share  = require('share');
    var invite = {
    	init:function(){
           this.search = common.getsearch(); 
           this.fetchWechatUId(); 
        },
        fetchWechatUId:function(){           
            if(common.getcookies('__KEY__')){
                this.fetchInviteData();
            }else{
                if(this.search.code){
                    ajax.post('user/getWxAccessKey',{
                        code  : this.search.code,
                        state : this.search.state
                    },function(res){
                        common.setcookies('__KEY__',res.wxAccessKey,365);
                        this.fetchInviteData();
                    }.bind(this))                      
                }
            }
        },        
    	fetchInviteData:function(){
    		ajax.post('user/inviteH5Page',{
                wxAccessKey : common.getcookies('__KEY__')
            },function(data){
                $("#inviteImg").attr('src',data.invitePicUrl);
                $("#inviteCount").text(data.friends);
                $(".share-warp").show();
                this.shareInvite(data.invitePicUrl);
    		}.bind(this),function(error){
                if(error.code == '100101'){
                    $(".share-error").show();
                }  
            })
    	},
        shareInvite:function(url){
            share({
                title : '草莓视频',
                desc  : '草莓视频邀请函，带您GET生活小技巧',
                link  : location.protocol + '//' + location.hostname + '/new/view/invite/invitation.html?img='+encodeURIComponent(url),
                imgUrl: location.protocol + '//' + location.hostname + '/new/images/logo.png'
            });
        }
    }

    invite.init();	
})
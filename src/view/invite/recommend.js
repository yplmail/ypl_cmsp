define(function (require, exports, module) {
    var common = require('common');
	var ajax   = require('ajax');
    var recommend = {
    	init:function(){
           common.hideDownload();
           this.search = common.getsearch();
           this.fetchData();
           this.initEvent(); 
    	},
    	initEvent:function(){
    		$(".mobile").on('input',function(){
				var val = $(this).val();
				if(val == ''){
					$(".tip").text('');
				}
    		})       
    		$(".button").on('click',function(){
				if($(".mobile").val() == ''){
					return false;
				} 
				if(!/^1\d{10}$/.test($(".mobile").val())){
					$(".tip").text('请输入正确的手机号码');
					return false;
				}
                this.getReward();
			}.bind(this))

			$(".reward-close").on('click',function(){
				$(".recommend-rewardouter").hide();
			})

			$(".reward-btn").on('click',function(){
				$(".recommend-rewardouter").hide();
				location = 'https://m.springrass.com/multipage/download.html';
			})		
    	},
    	fetchData:function(){
            ajax.post('user/inviteSharePage',{
                recommendCode : this.search.recommendCode,
            },function(res){
	            $("#headerImg").attr('src',common.joinImageUrl(res.avatar));            		
                $(".nikename").text(res.nickName);
                var tpl = _.template($("#recommendListTpl").html());
                $("#recommendListUi").append(tpl(res.rewards))
            }.bind(this))      		
    	},
    	getReward:function(){
            ajax.post('user/inviteRelation',{
                mobile  : $(".mobile").val(),
                recommendCode : this.search.recommendCode,
                wxAccessRewardKey : this.search.wxAccessRewardKey
            },function(res){
                $(".recommend-rewardouter").show();
            }.bind(this))        		
    	}
    }
    recommend.init();	
})
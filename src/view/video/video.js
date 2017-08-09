define(function (require, exports, module) {
    var common = require('common');
    var ajax   = require('ajax');
    var env    = require('env');
    var share  = require('share');
	var video = {
		init:function(){
           this.first     = true;
           this.pageIndex = 0;
           this.pageSize  = 10;
           this.isLoading = false;
           common.hideDownload();
           this.ratio = common.remRatio();
           this.search = common.getsearch();
           this.fetchWechatUId(); 
           this.fetchVideoData();
           this.fetchRelatedVideo();
           this.fetchCommentData();
           this.initWechatShare();               
           this.initSrcoll();
           this.initEvents();
		},
        fetchWechatUId:function(){
            if(this.search.code && !common.getcookies('__KEY__')){
                ajax.post('user/getWxAccessKey',{
                    code  : this.search.code,
                    state : this.search.state
                },function(res){
                    common.setcookies('__KEY__',res.wxAccessKey,365);
                }.bind(this))                
            }
        },
        fetchVideoData:function(){
            ajax.post('publish/detail',{
                publishId: this.search.publishId,
                videoId  : this.search.videoId
            },function(res){
                this.videoData = res;
                this.videoId   = res.videoId;
                this.initData(res);
                this.initVideoPerpety(res);
                if(res.disableReason){
                    $('.video-invalid').show();   
                }else{
                    this.initPlayer(res);                    
                }
                var timer = setTimeout(function(){
                    clearTimeout(timer);
                    this.refresh();                     
                }.bind(this),0);                  
            }.bind(this))
        },
        fetchCommentData:function(bool){
            ajax.post('comment/talkListNew',{
                publishId: this.search.publishId,
                videoId  : this.search.videoId,
                pageIndex: this.pageIndex,
                pageSize : 3,
                layermask : bool,  
            },function(res){
                this.pageCount = res.pageCount;
                if(res.datas.length == 0){
                    $("#commentUl").append($("#commentEmptyTpl").html());              
                }else{
                    $(".comment-lastmore").show();
                    var tpl = _.template($("#commentTpl").html());
                    $("#commentUl").append(tpl(res.datas));
                    if(this.pageIndex < this.pageCount){
                        $(".scroll-loading").show();
                    }else{
                        $(".scroll-loading").hide();
                    }                                 
                }
                var timer = setTimeout(function(){
                    clearTimeout(timer);
                    this.refresh();                     
                }.bind(this),0);                
            }.bind(this))            
        },
        fetchRelatedVideo:function(){
            ajax.post('video/relatedVideos',{
                publishId: this.search.publishId,
                videoId  : this.search.videoId
            },function(res){
                var arr = res.datas;
                if(res.datas.length == 0){
                    $("#relatedUl").html($("#relatedEmptyTpl").html());
                }else{
                    var tpl = _.template($("#relatedTpl").html());
                    $("#relatedUl").css('width',arr.length * 3 * common.remRatio());
                    $("#relatedUl").html(tpl(arr))                    
                }
                var timer = setTimeout(function(){
                    clearTimeout(timer);
                    new IScroll('.related-iscroll',{
                        scrollX: true, 
                        scrollY: false,
                        click  : true
                    });
                    this.refresh();                     
                }.bind(this),0);
            }.bind(this))            
        },  
        initWechatShare:function(){
            share({
                title: '草莓视频',
                desc : 'GET生活小技巧, 草莓视频带你活得更精彩！',
                link : location.protocol + '//' + location.hostname + '/new/view/video/video.html?publishId='+this.search.publishId+"&videoId="+this.search.videoId,
                imgUrl: location.protocol + '//' + location.hostname + '/new/images/logo.png',
                success:function(){
                    $(".mask").hide();
                    $(".player-cover").hide();
                    $(".prism-player").show();  
                }.bind(this)
            });
        },              
        initData:function(data){
            $(".synopsis").text(data.title);
            $(".video-playcount").text(data.playTimes + '次观看');   
            $("#pariseCount").text(data.pariseCount); 
            $("#talkCount").text(data.talkCount); 
            $("#channelAvatar").attr('src',common.joinImageUrl(data.channelAvatar)); 
            $("#channelName").text(data.channelName || '草莓看客'); 
            $("#channelfans").text(data.channelFlowCount + '人关注');
            $(".winner-outer").attr('publishId',data.publishId);
            $("#commentAllCount").text('评论'+ data.talkCount);            
            if(data.productUrl){
                $(".product-info").show();
                $("#productLink").attr('href',data.productUrl);                
            }
            if(data.publishVideoDesc){
                $(".synopsis-btn").show();
            }
            if(data.redpackFlag == "1"){
                $(".winner-outer").show();
            }
        },
        initVideoPerpety:function(data){
            if(data.cateId){
                $("#propertyUl").append('<li><img class="classfiy" src="../../images/classfiy.png"/>'+data.cateName+'</li>');
            }
            if(data.locationStr){
                $("#propertyUl").append('<li><img class="classfiy" src="../../images/location.png"/>'+data.locationStr+'</li>');
            }         
            data.tagList.forEach(function(item){
                $("#propertyUl").append('<li>#'+item.tagName+'</li>'); 
            })
            var childNodes = $("#propertyUl").children();
            childNodes.length > 0 && $(".video-property").show();
            var width  = childNodes.length * 0.3 * this.ratio
            childNodes.forEach(function(node){
                width = width + $(node).width();
            });        
            $("#propertyUl").css('width',width);
            var timer = setTimeout(function(){
                clearTimeout(timer);
                new IScroll('.video-property',{
                    scrollX: true, 
                    scrollY: false,
                    click  : true
                });                                   
            }.bind(this),0);              
        },
        initPlayer: function(data) {
            $('#cover').css('background-image','url('+data.coverUrl+')');   
            this.player = common.player('player',data);
            this.player.on('play', function(event) {
                this.first && this.startPlay();                
            }.bind(this))
            //this.player.on('pause', function(event) {}.bind(this))
            this.player.on('ended', function(event) {
                $(".prism-player").hide();
                $(".player-cover").show();
                $(".layerup-close").trigger('click');
                this.first  = true;
                this.endPlay();
                if(common.getcookies('__KEY__')){
                    this.showNewsPacket();                    
                }
            }.bind(this))    
        }, 
        startPlay:function(){
            ajax.post('publish/startPlay',{
                publishId: this.search.publishId,
                videoId  : this.videoId,
                fromUrl: document.referrer,
                shareUserId: this.search.shareId,
                clientType: 1,
                layermask : false               
            },function(res){
                this.first = false;
                this.playId = res.videoPlayRecordId;
            }.bind(this))            
        },
        endPlay:function(){
            ajax.post('publish/endPlay',{
                videoPlayRecordId:this.playId,
                layermask : false             
            },function(res){
                this.playId = '';
            }.bind(this))                
        },
        showNewsPacket:function(){
            ajax.post('user/wxNewReward',{
                wxAccessRewardKey:common.getcookies('__KEY__'),
                videoPlayRecordId:this.playId,
                publishId: this.search.publishId,
                videoId  : this.videoId,
                layermask : false                
            },function(res){
                if(res.rewardAmount > 0){
                    $(".packet-amount").text(res.rewardAmount);
                    $(".video-packet").show();                    
                }
            }.bind(this))   
        },
        initSrcoll:function(){
            $(".scroll-container").css('height',$(window).height()-this.ratio*1.26-200);
            this.scroll = new IScroll('.scroll-outer',{
                scrollY: true,
                scrollX: false, 
                click  : true
            });           
        }, 
        refresh:function(){
            this.scroll && this.scroll.refresh();
        },
        openLayer:function(msg,btntext){
            layer.open({
                content: msg,
                btn: btntext,
                yes: function(index){
                  layer.close(index);
                  location = 'https://m.springrass.com/multipage/download.html';
                }                    
            });               
        },      
        initEvents:function(){
            $(".player-cover").on('click',function(){
                $(".player-cover").hide();
                $(".prism-player").show();
                this.player.replay();
            }.bind(this))
            $(".packet-close").on('click',function(){
                $(".video-packet").hide();
            })
            $("#inviteBtn").on('click',function(){
                $(".video-packet").hide();
                $(".mask").show();
            })
            $(".mask").on('click',function(){
                $(".mask").hide();
                $(".player-cover").hide();
                $(".prism-player").show();                 
            })
            $(".share-outer").on('click',function(){
                $(".mask").show();
                $(".player-cover").show();
                $(".prism-player").hide();                
            }.bind(this))
            $("#openBtn").on('click',function(){
                $(".video-packet").hide();  
                location = 'https://m.springrass.com/multipage/download.html';              
            })
            $(".heart-outer").on('click',function(){
                this.openLayer('通过APP才能点赞哦！','下载APP');              
            }.bind(this))
            $(".talk-outer").on('click',function(){
                this.openLayer('通过APP才能评论哦！','下载APP');              
            }.bind(this))                        
            $("#channelFollow").on('click',function(){
                this.openLayer('通过APP才能关注哦！','下载APP');                 
            }.bind(this))
            $(".comment-list").on('click','.comment-more',function(){
                this.openLayer('下载APP查看更多精彩评论','下载APP');  
            }.bind(this))
            $(".comment-lastmore").on('click',function(){
                this.openLayer('下载APP查看更多精彩评论','下载APP');  
            }.bind(this))            
            
            $(".winner-outer").on('click',function(){
                var id = $(".winner-outer").attr('publishId');
                if(env == 'production'){
                    location = 'https://m.springrass.com/index.html#/winningLevel/'+id;                    
                }else if(env == 'preventive'){
                    location = 'https://prem.springrass.com/index.html#/winningLevel/'+id;    
                }else{
                    location = 'https://m.tes.springrass.com/index.html#/winningLevel/'+id;    
                }
            })
            $(".synopsis-btn").on('click',function(){
                var tpl = _.template($('#synopsisTpl').html());
                var height = $(window).height()-this.ratio*1.26-200 - 20;
                var index = layer.open({
                    type: 1,
                    content: tpl(this.videoData),
                    anim: 'up',
                    style: 'position:fixed; bottom:0; left:0; width:100%; overflow:auto; height: '+height+'px; padding:10px 0; border:none;',
                    success: function(elem){
                        $('.layerup-close').on('click',function(){
                            layer.close(index);
                        })  
                    } 
                });                                  
            }.bind(this))
        }
	};
	video.init();
})

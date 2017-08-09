define(function (require, exports, module) {  
    var common = require('common');
	var ajax   = require('ajax');
    var Slider = require('silder');
    var share  = require('share');
    var discovery = {
		init:function(){
           this.pageIndex = 1;
           this.pageSize  = 10;
           this.isLoading = false;
           this.search = common.getsearch();
           this.ratio = common.remRatio();
           common.hideDownload();
           this.fetchWechatUId();
           this.fetchHotClassfiy();
           this.fetchHotTag();
           this.fetchHotChannel();
           this.fetchHotAdv();
           this.fetchHotVideo();
           this.initDiscoveryScroll();
           this.initWechatShare();
           this.initEvent();        
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
        fetchHotClassfiy:function(){
            ajax.post('hot/category',{pageIndex:1,pageSize:100},function(res){
                if(res.datas.length > 0){
                    $(".hot-classfiy").show();
                    var arr = res.datas;
                    var tpl = _.template($('#classfiyTpl').html());
                    $('#classfiyUl').css('width',arr.length * 2.15 * this.ratio);
                    $('#classfiyUl').html(tpl(arr));
                    var timer = setTimeout(function(){
                        clearTimeout(timer);
                        new IScroll('.classfiy-scroll',{
                            scrollX: true, 
                            scrollY: false,
                            click  : true
                        });
                        this.refresh();                                       
                    }.bind(this),0);
                }
            }.bind(this));
        },
        fetchHotTag:function(){
            ajax.post('hot/tag',{pageIndex:1,pageSize:100},function(res){
                if(res.datas.length > 0){
                    $(".hot-tag").show();
                    var arr = res.datas;
                    var tpl = _.template($('#tagTpl').html());
                    var width  = arr.length * 0.3 * this.ratio
                    $('#tagUl').html(tpl(arr));
                    $('#tagUl').children().forEach(function(node){
                        width = width + $(node).width();
                    });
                    $('#tagUl').css('width',width);
                    var timer = setTimeout(function(){
                        clearTimeout(timer);
                        new IScroll('.tag-scroll',{
                            scrollX: true, 
                            scrollY: false,
                            click  : true
                        });
                        this.refresh();                                       
                    }.bind(this),0);                                    
                }
            }.bind(this));            
        },
        fetchHotChannel:function(){
            ajax.post('hot/channel',{pageIndex:1,pageSize:100},function(res){
                if(res.datas.length > 0){
                    $(".hot-channel").show();
                    var arr = res.datas;
                    var tpl = _.template($('#channelTpl').html());
                    $('#channelUl').css('width',arr.length * 3.43 * this.ratio);
                    $('#channelUl').html(tpl(arr));
                    var timer = setTimeout(function(){
                        clearTimeout(timer);
                        new IScroll('.channel-scroll',{
                            scrollX: true, 
                            scrollY: false,
                            click  : true
                        });
                        this.refresh();                                       
                    }.bind(this),0);
                }                  
            }.bind(this));              
        },
        fetchHotAdv:function(){
            ajax.post('publicity/bannerList',function(res){
                if(res.datas && res.datas.length > 0){
                    $(".hot-adv").show();
                    var tpl = _.template($('#advTpl').html());
                    $('#advUl').html(tpl(res.datas));                
                    var timer = setTimeout(function(){
                        clearTimeout(timer);
                        new Slider({
                            wrap: document.getElementsByClassName('adv-scroll')[0],
                            pagination:true
                        }); 
                        this.refresh();                             
                    }.bind(this),0)                   
                }
            }.bind(this))               
        },
        fetchHotVideo:function(bool){
            ajax.post('video/searchVideoList',{
               pageIndex:this.pageIndex,
               pageSize :this.pageSize,
               layermask : bool    
            },function(res){
                if(res.datas && res.datas.length > 0){
                    $(".hot-video").show();
                    this.isLoading = false;
                    this.pageCount = res.pageCount;
                    if(res.datas.length == 0){
                        $("#videoUl").append($("#videoEmptyTpl").html());
                        return false
                    }
                    var tpl = _.template($("#videoTpl").html());
                    $("#videoUl").append(tpl(res.datas));
                    if(this.pageIndex < this.pageCount){
                        $(".scroll-loading").show();
                    }else{
                        $(".scroll-loading").hide();
                    }
                    this.refresh(); 
                }     
            }.bind(this))                
        },
        initWechatShare:function(){
            share({
                title: '草莓视频',
                desc: 'GET生活小技巧, 草莓视频带你活得更精彩！',
                link: location.protocol + '//' + location.hostname + '/new/view/discovery/discovery.html',
                imgUrl: location.protocol + '//' + location.hostname + '/new/images/logo.png'
            });
        },
        initDiscoveryScroll:function(){
            $('.discovery-wrap').css('height',$(window).height());
            this.discoveryscroll  =  new IScroll('.discovery-wrap',{
                scrollX: false, 
                scrollY: true,                
                click  : true
            }); 
            this.discoveryscroll.on('scrollEnd',function(scroll){
                if(this.discoveryscroll.y < 0 && Math.abs(this.discoveryscroll.y) >= Math.abs(this.discoveryscroll.maxScrollY)){
                    if(this.isLoading) return false;
                    if(this.pageIndex < this.pageCount){
                        ++this.pageIndex;
                        this.isLoading = true;
                        this.fetchHotVideo(false);                  
                    }
                }
            }.bind(this))
        },
        refresh:function(){
            this.discoveryscroll && this.discoveryscroll.refresh();
        },
        openLayer:function(msg){
            layer.open({
                content: msg,
                btn    : "下载APP",
                yes    : function(index){
                  layer.close(index);
                  location = 'https://m.springrass.com/multipage/download.html';
                }                    
            });               
        },     
        initEvent:function(){
           // $("#classfiyUl").on('click','li',function(){
           //    this.openLayer('下载APP查看更多分类详情！');
           // }.bind(this))            

           // $("#tagUl").on('click','li',function(){
           //    this.openLayer('下载APP查看更多标签详情！');
           // }.bind(this))            

           $("#channelUl").on('click','li',function(){
              this.openLayer('下载APP查看更多频道详情！');
           }.bind(this)) 
        }
    };

    discovery.init();
})



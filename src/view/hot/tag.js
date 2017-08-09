define(function (require, exports, module) {
    var common = require('common');
	var ajax   = require('ajax');
    var classfiy = {
    	init:function(){
           this.search = common.getsearch(); 
           this.pageIndex = 1;
           this.pageSize  = 10;
           this.pageCount = 0;
           this.fetchTagDetail();
           this.fetchTagVideo(); 
           this.initEvent();
           common.hideDownload();
        },
        fetchTagDetail:function(){
            ajax.post('videoTag/tagInfo',{
                tagId : this.search.tagId
            },function(res){
                var tpl = _.template($("#tagTpl").html());
                $('.tag-header').append(tpl(res));               
            }.bind(this))             
        },
        fetchTagVideo:function(){           
            ajax.post('video/tagVideoList',{
                tagId       : this.search.tagId,
                pageIndex   : this.pageIndex,
                pageSize    : this.pageSize
            },function(res){
                this.isLoading = false;
                this.pageCount = res.pageCount;
                this.renderTpl(res.datas);
                if(this.pageIndex < this.pageCount){
                    $(".scroll-loading").show();
                }else{
                    $(".scroll-loading").hide();
                }                 
            }.bind(this),function(){
                this.isLoading = false;
            }.bind(this))             
        },
        renderTpl:function(datas){
            if(datas.length > 0){
                var tpl = _.template($("#tagVideoTpl").html());
                $('.videolist-outer').append(tpl(datas));
            }else{
                $('.videolist-outer').append($("#videoEmptyTpl").html());                                 
            }
        },
        scrollEvent: function(event) {
            event.preventDefault();
            var body = document.querySelector('body');
            var scrollpos = $(window).height() + body.scrollTop;
            var maxHeight = body.scrollHeight;
            if(scrollpos >= maxHeight){
                if(this.isLoading) return false;
                if(this.pageIndex < this.pageCount){
                    ++this.pageIndex;
                    this.isLoading = true;
                    this.fetchTagVideo();                  
                }
            }
        },        
        initEvent:function(){
            window.addEventListener('scroll', this.scrollEvent.bind(this), false);
        }
    }
    classfiy.init();	
})
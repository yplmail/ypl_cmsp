define(function (require, exports, module) {
    var common = require('common');
	var ajax   = require('ajax');
    var classfiy = {
    	init:function(){
           this.search = common.getsearch(); 
           this.pageIndex = 1;
           this.pageSize  = 10;
           this.pageCount = 0;
           this.fetchClassfiyDetail(); 
           this.initEvent();
           common.hideDownload();
           $("#classfiy").text(this.search.classfiy);
        },
        fetchClassfiyDetail:function(){           
            ajax.post('video/categoryVideoList',{
                categoryId  : this.search.classfiyId,
                pageIndex   : this.pageIndex,
                pageSize    : this.pageSize
            },function(res){
                $("#videocount").text(res.totalCount);
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
                var tpl = _.template($("#classfiyTpl").html());
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
                    this.fetchClassfiyDetail();                  
                }
            }
        },        
        initEvent:function(){

            window.addEventListener('scroll', this.scrollEvent.bind(this), false);

            $('.publish').on('click',function(){
                layer.open({
                    content: '下载APP才能进行投稿哦！',
                    btn    : "下载APP",
                    yes    : function(index){
                      layer.close(index);
                      location = 'https://m.springrass.com/multipage/download.html';
                    }                    
                });                 
            })
        }
    }
    classfiy.init();	
})
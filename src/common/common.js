define(function(require, exports, module) {
    var env = require('../config/env');
    var common = {
        hideDownload: function() {
            setTimeout(function(){
    			var ua = navigator.userAgent.toLowerCase();
    			var sf = (s = ua.match(/version\/([\d.]+).*safari/)) ? s[1] : 0;
                if(this.iswechat()){
                    $(".header-donwload").show();
                }else{            
        			if (!sf) {
        				$(".header-donwload").show();
        			}
                }               
            }.bind(this),0);
        },

        minutes: function(ms) {
            var m = parseInt(ms / (1000 * 60));
            if (m < 10) m = '0' + m;
            var s = parseInt((ms % (1000 * 60)) / 1000);
            if (s < 10) s = '0' + s;
            return m + ':' + s;
        },

        iswechat: function() {
            var ua = navigator.userAgent;
            if (/MicroMessenger/i.test(ua)) {
                return true;
            } else {
                return false;
            }
        },

        getsearch: function() {
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
        },

        joinImageUrl: function(url) {
            if (url) {
                if (/^http:\/\//.test(url) || /^https:\/\//.test(url)) {
                    return url;
                } else {
                    if (env === "production") {
                        return 'http://file.springrass.com' + url;
                    } else {
                        return 'http://prefile.springrass.com' + url;
                    }
                }
            } else {
                return '../../images/person_img.png'
            }
        },

        domain: function() {
            return location.protocol + '//' + location.host + '/'
        },

        remRatio: function() {
            var width = Math.min(window.innerWidth, 414);
            return width / 7.5;
        },

        setcookies: function(name, value, expiredays) {
            var d = new Date()
            d.setDate(d.getDate() + expiredays)
            document.cookie = name + "=" + escape(value) +
                ((expiredays == null) ? "" : ";expires=" + d.toGMTString()) + ";path=/";
        },

        getcookies: function(name) {
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
        },

        isMT: function() {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/android/i) == "android") {
                return 'android';
            } else if (ua.match(/iphone/i) == "iphone" || ua.match(/ipad/i) == "ipad") {
                return 'ios'
            } else {
                return 'other'
            }
        },

        transformThousand: function(n) {
            if (isNaN(n)) {
                return n;
            } else {
                var num = n * 　1;
                if (num < 10000) {
                    return num;
                } else {
                    return (num / 10000) + '万';
                }
            }
        },

        getDateDiff: function(str) {
            str = str ? str.replace(/-/g, '/') : '';
            if (!str) return '';
            var now = Date.now();
            var timeStamp = new Date(str).getTime();
            var diffValue = now - timeStamp;
            if (diffValue < 0) return ''
            var minute = 1000 * 60;
            var hour = minute * 60;
            var day = hour * 24;
            var half = day * 15;
            var month = day * 30;
            var monthC = diffValue / month;
            var weekC = diffValue / (7 * day);
            var dayC = diffValue / day;
            var hourC = diffValue / hour;
            var minC = diffValue / minute;
            if (monthC >= 1) {
                return parseInt(monthC) + "月前";
            } else if (weekC >= 1) {
                return parseInt(weekC) + "周前";
            } else if (dayC >= 1) {
                return parseInt(dayC) + "天前";
            } else if (hourC >= 1) {
                return parseInt(hourC) + "小时前";
            } else if (minC >= 1) {
                return parseInt(minC) + "分钟前";
            } else {
                return '刚刚'
            }
        },
        player: function(id, data) {
            var player = new prismplayer({
                id: id,
                source: data.playUrl,
                width: "100%",
                height: '200px',
                cover: data.coverUrl,
                preload: true,
                playsinline: true,
                autoplay: true,
                showBuffer: true
                // skinLayout: [{
                //     "name": "bigPlayButton",
                //     "align": "cc",
                //     "x": 30,
                //     "y": 80
                // }, {
                //     "name": "controlBar",
                //     "align": "blabs",
                //     "x": 0,
                //     "y": 0,
                //     "children": [{
                //         "name": "playButton",
                //         "align": "blabs",
                //         "x": 20,
                //         "y": 6
                //     }, {
                //         "name": "timeDisplay",
                //         "align": "tlabs",
                //         "x": 50,
                //         "y": 0
                //     }, {
                //         "name": "fullScreenButton",
                //         "align": "brabs",
                //         "x": 20,
                //         "y": 6
                //     }]
                // }]
            });
            return player;
        }
    }
    module.exports = window.common = common;
})
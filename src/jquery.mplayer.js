;(function ($, window, undefined) {
    var slice = [].slice;
    function Mplayer (option) {
        var defaultOption = {
            mp3: null,
            ogg: null,
            cover: null,
            artist: null,
            album: null,
            title: null
        };

        option = $.extend(defaultOption, option);

        this.music = option;
        this.eventList = {};

        this.init();
    }

    Mplayer.fn = Mplayer.prototype;

    Mplayer.fn.load = function () {

    };

    Mplayer.fn.init = function () {
        
    };

    Mplayer.fn.play = function () {

    };

    Mplayer.fn.pause = function () {

    };

    Mplayer.fn.stop = function () {

    };

    Mplayer.fn.on = function (name, fn, context, once) {
        this.eventList[name] = this.eventList[name] || [];
        this.eventList[name].push({fn: fn, context: context || this, once: once});
        return this;
    };

    Mplayer.fn.emit = function (name) {
        var arg = slice.call(arguments, 1);
        if (this.eventList[name] && this.eventList[name].length) {
            this.eventList[name].forEach(function (item) {
                if (item.once && item.called) {
                    return;
                }
                item.fn.apply(item.context, arg);
                item.called = true;
            });
        }
    };

    Mplayer.fn.off = function (name, fn) {
        if (!this.eventList[name]) {
            return;
        }
        if (!fn) {
            this.eventList[name].splice(this.eventList[name].length);
        } else {
            for (var i = 0; i < this.eventList[name].length; i += 1) {
                var handler = this.eventList[name][i];
                if (handler.fn === fn) {
                    this.eventList[name].splice(i, 1);
                    i -= 1;
                }
            }
        }
    };

    $.fn.Mplayer = Mplayer;
    
})($,window);
;(function ($, window, undefined) {
    var slice = [].slice;
    function Mplayer (option, element) {
        var defaultOption = {
            mp3: null,
            ogg: null,
            cover: null,
            artist: null,
            album: null,
            title: null,
            currentTime: 0,
            duration: 0
        };
        this.option = {};
        $.extend(this.option, defaultOption, option);
        this.element = element;
        this.eventList = {};
    }

    Mplayer.tmpl = function (string) {
        var index = 0;
        var source = 'var text="';
        var render;
        string.replace(/\${{(.*?)}}|$/g, function (origin, str, offset) {
            source += string.slice(index, offset).replace(/"/g, '\\"');
            index = offset + origin.length;
            source += '"+' + (str || '""') + '+"';
        });
        source = 'with(obj){\n' + source + '";\n}\nreturn text;';
        try {
            render = new Function ('obj', source);
        } catch (err) {
            err.source = source;
            throw err;
        }
        return function (obj) {
            return render.call(this, obj);
        };
    };

    Mplayer.fn = Mplayer.prototype;

    Mplayer.fn.load = function () {
        var tmp = this.Mplayer.detach();
        var source = '<source src="${{ogg}}"></source><source src="${{mp3}}"></source>';
        tmp.find('source').remove();
        tmp.append(Mplayer.tmpl(source)(this.option));
        this.element.append(tmp);
    };

    Mplayer.fn.init = function () {
        this.Mplayer = $('<audio></audio>');
        this.element.append(this.Mplayer);
        this.load();
        this.Mplayer.on('play', function () {

        }).on('pause', function () {

        }).on('ended', function () {
            
        });
    };

    Mplayer.fn.play = function () {
        this.Mplayer.get(0).play();
    };

    Mplayer.fn.pause = function () {
        this.Mplayer.get(0).pause();
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

    $.fn.Mplayer = function (options) {
        var mplayer = new Mplayer(options, this);
        mplayer.init();
        return mplayer;
    };

    window.Mplayer = Mplayer;
    
})($,window);
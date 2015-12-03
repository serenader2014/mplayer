;(function ($, window, undefined) {
    var slice = [].slice;
    function Mplayer (element, track, option) {
        var defaultOption = {
            autoPlay: false,
            autoBuffer: false,
            buffered: false,
            loop: false,
            preload: false,
            volume: 0.8
        };
        var defaultTrack = {
            mp3: null,
            ogg: null,
            cover: null,
            artist: null,
            album: null,
            title: null,
            duration: 0,
            currentTime: 0
        };
        if (typeof track === 'string') {
            track = {mp3: track};
        }
        this.option = {};
        this.track = {};
        $.extend(this.option, defaultOption, option);
        $.extend(this.track, defaultTrack, track);
        this.element = element;
        this.status = 'pending';
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

    // 220, [h]:[m]:[s] ==> 03:40
    Mplayer.parseTime = function (time, type) {
        var hour = Math.floor(time/3600);
        var minute = Math.floor(time/60);
        var second = Math.floor(time%60);
        type = type || '[m]:[s]';
        hour = hour > 9 ? hour.toString() : '0' + hour.toString();
        minute = minute > 9 ? minute.toString() : '0' + minute.toString();
        second = second > 9 ? second.toString() : '0' + second.toString();
        type = type.replace(/\[h\]/ig, hour);
        type = type.replace(/\[m\]/ig, minute);
        type = type.replace(/\[s\]/ig, second);
        return type;
    };

    Mplayer.fn = Mplayer.prototype;

    Mplayer.fn.load = function () {
        var tmp = this.Mplayer.detach();
        var source = '<source src="${{ogg}}"></source><source src="${{mp3}}"></source>';
        tmp.find('source').remove();
        tmp.append(Mplayer.tmpl(source)(this.track));
        this.element.append(tmp);
        this.Mplayer.get(0).load();
        return this;
    };

    Mplayer.fn.init = function () {
        var self = this;
        var attrs = '';
        $.each(self.option, function (name, value) {
            if (value) {
                attrs += name + '=' + value + ' ';
            }
        });
        self.Mplayer = $('<audio ' + attrs + '></audio>');
        self.element.append(self.Mplayer);
        self.load();
        self.bindEvent();
        return this;
    };

    Mplayer.fn.bindEvent = function () {
        var self = this;
        this.on('play', function () {
            self.status = 'playing';
        }).on('pause', function () {
            self.status = 'pause';
        }).on('ended', function () {
            self.status = 'ended';
        }).on('stop', function () {
            self.status = 'stop';
        }).on('loadedmetadata', function () {
            self.track.duration = self.Mplayer.get(0).duration;
        }).on('progress', function () {
            self.track.currentTime = self.Mplayer.get(0).currentTime;
        });
    };

    Mplayer.fn.play = function () {
        this.emit('prePlay');
        this.Mplayer.get(0).play();
        return this;
    };

    Mplayer.fn.pause = function () {
        this.emit('prePause');
        this.Mplayer.get(0).pause();
        return this;
    };

    Mplayer.fn.stop = function () {
        this.emit('preStop');
        this.setProgress(0).pause();
        this.emit('stop');
        return this;
    };

    Mplayer.fn.setProgress = function (time) {
        this.Mplayer.get(0).currentTime = time;
        this.emit('setProgress');
        return this;
    };

    Mplayer.fn.getProgress = function (type) {
        if (type) {
            return Mplayer.parseTime(this.Mplayer.get(0).currentTime, type);
        } else {
            return this.Mplayer.get(0).currentTime;
        }
    };

    Mplayer.fn.setVolume = function (vol) {
        this.emit('preVolumechange');
        this.Mplayer.get(0).volume = vol;
        this.option.volume = vol;
        return this;
    };

    Mplayer.fn.getDuration = function (type) {
        if (type) {
            return Mplayer.parseTime(this.Mplayer.get(0).duration, type);
        } else {
            return this.Mplayer.get(0).duration;
        }
    };

    Mplayer.fn.on = function () {
        this.Mplayer.on.apply(this.Mplayer, arguments);
        return this;
    };

    Mplayer.fn.emit = function () {
        this.Mplayer.trigger.apply(this.Mplayer, arguments);
        return this;
    };

    Mplayer.fn.off = function () {
        this.Mplayer.off.apply(this.Mplayer, arguments);
        return this;
    };

    $.fn.Mplayer = function (track, option) {
        var mplayer = new Mplayer(this, track, option);
        mplayer.init();
        return mplayer;
    };

    window.Mplayer = Mplayer;
    
})($,window);
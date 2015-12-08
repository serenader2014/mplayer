;(function ($, window, undefined) {
    var slice = [].slice;
    function Mplayer (element, track, option) {
        var defaultOption = {
            autoPlay: false,
            autoBuffer: false,
            buffered: false,
            loop: false,
            preload: false,
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

    Mplayer.plugin = function (name, cb, option) {
        if (option && option.require) {
            var notFound = [];
            $.each(option.require, function (index, plugin) {
                if (!Mplayer.pluginList[plugin]) {
                    notFound.push(plugin);
                }
            });
            if (notFound.length) {
                Mplayer.Error('REQUIRE_PLUGIN_NOT_FOUND', notFound, name);
                return;
            }
        }
        Mplayer.pluginList = Mplayer.pluginList || {};
        Mplayer.pluginList[name] = cb;
    };

    Mplayer.Error = function (type) {
        var errorMap = {
            'PLUGIN_NOT_FOUND': function (args) {
                var name = args[0];
                var allPluginsName = [];
                $.each(Mplayer.pluginList, function (name) {
                    allPluginsName.push(name);
                });
                this.message = 'Can not find the plugin ' + name;
                this.description = 'Can not find the plugin "' + name 
                            + '", current installed plugin(s) is(are): ' + allPluginsName.join(', ');
                this.toString = function () {
                    return this.description;
                };
            },
            'REQUIRE_PLUGIN_NOT_FOUND': function (args) {
                var list = args[0];
                var name = args[1];
                this.message = 'Can not find dependencies: ' + list.join(', ');
                this.description = 'Can not find dependencies required by ' + name
                                + ': ' + list.join(', ');
                this.toString = function () {
                    return this.description;
                };
            }
        };

        if (errorMap[type]) {
            var args = slice.call(arguments, 1);
            throw new errorMap[type](args);
        }

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
            if (value && name !== 'plugin') {
                attrs += name + '=' + value + ' ';
            }
        });
        self.loadPlugin();
        self.Mplayer = $('<audio ' + attrs + '></audio>');
        self.renderGUI();
        self.load();
        self.bindEvent();
        return this;
    };

    Mplayer.fn.renderGUI = function () {
        this.element.append(this.Mplayer).append(this.getTemplate());
        return this;
    };

    Mplayer.fn.getTemplate = function () {
        var template = ['<div class="mplayer">',
                        '<img src="${{cover}}" alt="" class="mplayer-track-cover">',
                        '<div class="mplayer-track-info"><p class="mplayer-track-title">${{title}}</p>',
                        '<p><span class="mplayer-track-artist">${{artist}}</span> - ',
                        '<span class="mplayer-track-album">${{album}}</span></p>',
                        '<div class="mplayer-progress-bar"><span class="mplayer-time-num">',
                        '<span class="mplayer-current-time-num">${{currentTime}}</span>/',
                        '<span class="mplayer-duration-num">${{duration}}</span>',
                        '</span><div class="mplayer-duration">',
                        '<div class="mplayer-current-time"></div></div>',
                        '</div></div>',
                        '<div class="mplayer-control">',
                        '<button class="mplayer-play mplayer-btn icon-play"></button>',
                        '<button class="mplayer-pause mplayer-btn icon-pause"></button>',
                        '</div>',
                    '</div>'].join('');
        return Mplayer.tmpl(template)(this.track);
    };

    Mplayer.fn.loadPlugin = function () {
        var self = this;
        var pluginList = self.option.plugin || [];
        var extend = function (obj) {
            $.each(obj, function (name, cb) {
                if (!Mplayer.fn[name]) {
                    Mplayer.fn[name] = function () {
                        return cb.apply(self, arguments);
                    };
                }
            });
        };
        $.each(pluginList, function (name, option) {
            if (Mplayer.pluginList[name]) {
                Mplayer.pluginList[name].call(self, option, extend);
            } else {
                Mplayer.Error('PLUGIN_NOT_FOUND', name);
            }
        });
    };

    Mplayer.fn.bindEvent = function () {
        var self = this;
        self.on('play', function () {
            self.status = 'playing';
            self.emit('statusChanged', self.status);
        }).on('pause', function () {
            self.status = 'pause';
            self.emit('statusChanged', self.status);
        }).on('ended', function () {
            self.status = 'ended';
            self.emit('statusChanged', self.status);
        }).on('loadedmetadata', function () {
            self.track.duration = self.Mplayer.get(0).duration;
            self.status = 'loaded';
            self.emit('statusChanged', self.status);
        }).on('seeking', function () {
            self.status = 'seeking';
            self.emit('statusChanged', self.status);
        }).on('seeked', function () {
            self.status = 'seeked';
            self.emit('statusChanged', self.status);
        }).on('timeupdate', function () {
            self.track.currentTime = self.Mplayer.get(0).currentTime;
            var percentage = Math.floor(100*self.track.currentTime/self.track.duration);
            self.element.find('.mplayer-current-time-num').html(self.getProgress('[m]:[s]'));
            if (percentage !== self.element.find('.mplayer-current-time').width()) {
                self.element.find('.mplayer-current-time')
                    .css({width: percentage + '%'});
            }
        }).on('statusChanged', function (event, status) {
            if (status === 'loaded') {
                self.element.find('.mplayer-duration-num').html(self.getDuration('[m]:[s]'));
                self.element.find('.mplayer-current-time-num').html(Mplayer.parseTime(0));
            }
            if (status === 'playing') {
                self.element.find('.mplayer-play').hide().end().find('.mplayer-pause').show();
            } else {
                self.element.find('.mplayer-play').show().end().find('.mplayer-pause').hide();
            }
        });

        self.element.find('.mplayer-play').on('click', function () {
            if (self.status !== 'playing') {
                self.play();
            }
        }).end().find('.mplayer-pause').on('click', function () {
            if (self.status === 'playing') {
                self.pause();
            }
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
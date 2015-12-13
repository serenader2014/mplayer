/* global Mplayer */
(function ($, window, undefined) {
    if (typeof Mplayer === 'undefined') {
        throw new Error('Mplayer not found.');
    }
    var template = ['<div class="mplayer mplayer-has-playlist">',
                '<img src="${{cover}}" alt="" class="mplayer-track-cover">',
                '<div class="mplayer-track-info"><p title="${{title}}" ',
                'class="mplayer-track-title">${{title}}</p>',
                '<p><span class="mplayer-track-artist">${{artist}}</span> - ',
                '<span class="mplayer-track-album">${{album}}</span></p>',
                '<div class="mplayer-progress-bar"><span class="mplayer-time-num">',
                '<span class="mplayer-current-time-num">${{currentTimeNum}}</span>/',
                '<span class="mplayer-duration-num">${{durationNum}}</span>',
                '</span><div class="mplayer-duration">',
                '<div class="mplayer-current-time"></div></div>',
                '</div><div class="mplayer-volume"><button class="icon-volume"></button>',
                '<div class="mplayer-volume-wrapper"><div class="mplayer-full-volume">',
                '<div class="mplayer-current-volume"></div>',
                '</div></div></div></div><div class="mplayer-control">',
                '<button class="mplayer-repeat ${{repeat}} mplayer-btn icon-repeat"></button>',
                '<button class="mplayer-prev mplayer-btn icon-prev"></button>',
                '<button class="mplayer-play mplayer-btn icon-play"></button>',
                '<button class="mplayer-pause mplayer-btn icon-pause"></button>',
                '<button class="mplayer-next mplayer-btn icon-next"></button>',
                '<button class="mplayer-shuffle ${{shuffle}} mplayer-btn icon-shuffle"></button>',
                '</div><ul class="mplayer-playlist">${{playlist}}</ul>',
            '</div>'].join('');
    Mplayer.plugin('multiTrack', function (option, extend) {
        if (!option.list || !option.list.length) {
            throw new Error('No playlist.');
        }
        var defaultOption = {
            repeat: false,
            shuffle: false,
            list: []
        };
        var opt = $.extend({}, defaultOption, option);
        var self = this;
        extend({
            next: function () {
                if (this.currentTrack >= this.playlist.length - 1) {
                    return;
                }
                this.loadTrack(this.currentTrack + 1);
            },
            prev: function () {
                if (this.currentTrack <= 0) {
                    return;
                }
                this.loadTrack(this.currentTrack - 1);
            },
            loadTrack: function (index) {
                var track = this.playlist[index];
                var self = this;
                self.currentTrack = index;
                $.extend(self.track, track);
                self.load();
                self.renderGUI(self.track);
                self.emit('trackChanged', option.list[self.currentTrack]);
                self.one('loadeddata', function () {
                    self.play();
                });
            },
            shuffle: function () {
                var self = this;
                self.isShuffle = !self.isShuffle;
                if (self.isShuffle) {
                    if (!self.originalList) {
                        self.originalList = [];
                        self.playlist.forEach(function (item, index) {
                            self.originalList[index] = item;
                        });
                    }
                    //Fisher-Yates Shuffle Algorithm
                    var k, t, l = self.playlist.length;
                    if (l < 2) {
                        return;
                    }
                    while (l) {
                        k = Math.floor(Math.random() * l--);
                        t = self.playlist[l];
                        self.playlist[l] = self.playlist[k];
                        self.playlist[k] = t;
                    }
                    self.loadTrack(0);
                } else {
                    self.originalList.forEach(function (item, index) {
                        self.playlist[index] = item;
                    });
                    self.loadTrack(0);
                }
            }
        });
        self.currentTrack = 0;
        self.playlist = opt.list;
        self.repeat = opt.repeat;
        self.isShuffle = false;
        if (opt.shuffle) {
            self.one('loadeddata', function () {
                self.shuffle();
            });
        }
        self.on('ended', function () {
            if (self.repeat === 'single') {
                self.play();
                return;
            }
            if (self.currentTrack >= option.list.length - 1) {
                if (self.repeat) {
                    self.loadTrack(0);
                    self.one('loadeddata', function () {
                        self.play();
                    });
                }
                return;
            }
            self.next();
            self.one('loadeddata', function () {
                self.play();
            });
        });
        $.extend(self.track, option.list[self.currentTrack]);
        self.getTemplate = function () {
            var obj = $.extend({}, self.track);
            var str = '';
            $.each(self.playlist, function (index, track) {
                var trackClass = '';
                var order = index + 1;
                if (index === self.currentTrack) {
                    trackClass = 'mplayer-current';
                    order = '<div class="icon-play"></div>';
                }
                str = [str, 
                '<li class="mplayer-track ',
                trackClass,
                '"><span class="mplayer-order">',
                order,
                '</span><span class="mplayer-list-title">',
                track.title,
                '</span><span class="mplayer-list-artist">',
                track.artist,
                '</li>'
                ].join('');
            });
            obj.playlist = str;
            if (!self.isShuffle) {
                obj.shuffle = 'mplayer-no-shuffle';
            }
            if (self.repeat === 'single') {
                obj.repeat = 'mplayer-single-repeat';
            } else if (!self.repeat) {
                obj.repeat = 'mplayer-no-repeat';
            }
            return Mplayer.tmpl(template)(obj);
        };
        var oldBindEvent = self.bindDOMEvent;
        self.bindDOMEvent = function () {
            oldBindEvent.apply(self, arguments);
            self.element.find('.mplayer-next').on('click', function () {
                self.next();
            }).end().find('.mplayer-prev').on('click', function () {
                self.prev();
            }).end().find('.mplayer-shuffle').on('click', function () {
                self.shuffle();
            }).end().find('.mplayer-repeat').on('click', function () {
                self.repeat = self.repeat === 'single' ? false : (self.repeat ? 'single' : true);
                var element = self.element.find('.mplayer-repeat');
                if (self.repeat === 'single') {
                    element
                        .removeClass('mplayer-no-repeat')
                        .addClass('mplayer-single-repeat');
                } else if (!self.repeat) {
                    element
                        .removeClass('mplayer-single-repeat')
                        .addClass('mplayer-no-repeat');
                } else {
                    element
                        .removeClass('mplayer-no-repeat')
                        .removeClass('mplayer-single-repeat');
                }
            }).end().find('.mplayer-track').on('click', function () {
                var list = self.element.find('.mplayer-track');
                var index = list.index(this);
                self.loadTrack(index);
            });
        };
    });
})($, window);
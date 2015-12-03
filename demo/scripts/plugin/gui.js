/* global Mplayer */
;(function ($, window, undefined) {
    if (typeof window.Mplayer !== 'function') {
        throw 'Mplayer not found.';
    }
    var template = ['<div class="mplayer">',
                      '<div class="mplayer-control">',
                        '<button class="mplayer-play mplayer-btn">Play</button>',
                        '<button class="mplayer-pause mplayer-btn">Pause</button>',
                      '</div>',
                      '<span class="status"></span>',
                      '<div class="mplayer-track-info">',
                        '<img src="${{cover}}" alt="" class="mplayer-track-cover">',
                        '<p class="mplayer-track-title">${{title}}</p>',
                        '<p class="mplayer-track-album">${{album}}</p>',
                        '<p class="mplayer-track-artist">${{artist}}</p>',
                        '<p class="mplayer-track-time">',
                          '<span class="mplayer-track-current-time">${{currentTime}}</span>',
                          '<span class="mplayer-track-duration">${{duration}}</span>',
                        '</p>',
                      '</div>',
                    '</div>'].join('');

    Mplayer.plugin('GUI', function (option, extend) {
        extend({
            createView: function () {
                var self = this;
                var e = $(Mplayer.tmpl(template)(self.track));
                self.element.append(e);
                self.on('statusChanged', function (event, status) {
                    if (status === 'loaded') {
                        e.find('.mplayer-track-duration').html(self.getDuration('[m]:[s]'));
                    }
                    e.find('.status').html(status);
                }).on('timeupdate', function () {
                    e.find('.mplayer-track-current-time').html(self.getProgress('[m]:[s]'));
                });
                self.bindGUIEvent();
            },
            bindGUIEvent: function () {
                var self = this;
                var e = self.element.find('.mplayer');
                e
                .find('.mplayer-play').on('click', function () {
                    if (self.status !== 'playing') {
                        self.play();
                    }
                }).end()
                .find('.mplayer-pause').on('click', function () {
                    if (self.status === 'playing') {
                        self.pause();
                    }
                });
            }
        });
        this.createView();
    });
})($, window);
/* global Mplayer */
(function ($, window, undefined) {
    if (typeof Mplayer === 'undefined') {
        throw new Error('Mplayer not found.');
    }
    Mplayer.plugin('multiTrack', function (option, extend) {
        if (!option.list || !option.list.length) {
            throw new Error('No playlist.');
        }
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

            }
        });
        self.currentTrack = 0;
        self.playlist = option.list;
        self.repeat = false;
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
    });
})($, window);
/* global Mplayer */
(function ($, window, undefined) {
    if (typeof Mplayer === 'undefined') {
        throw new Error('Mplayer not found.');
    }
    Mplayer.plugin('lyric', function (option, extend) {
    });
})($, window);
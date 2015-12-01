;(function ($, window, undefined) {
    if (typeof window.Mplayer !== 'function') {
        throw 'Mplayer not found.';
    }
    var template = ['<div class="mplayer">',
                      '<audio class="mplayer-audio">',
                        '<source src="${{ogg}}"></source>',
                        '<source src="${{mp3}}"></source>',
                      '</audio>',
                      '<div class="mplayer-control">',
                        '<button class="mplayer-play mplayer-btn">Play</button>',
                        '<button class="mplayer-pause mplayer-btn">Pause</button>',
                        '<button class="mplayer-stop mplayer-btn">Stop</button>',
                      '</div>',
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


})($, window);
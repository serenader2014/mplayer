/* global ID3 */
;(function ($, window, undefined) {
    var slice = [].slice;
    var defaultTrack = {
        mp3: null,
        ogg: null,
        cover: 'data:image/jpeg;base64,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P4AAADhCSU0EDQAAAAAABAAAAB44QklNBBkAAAAAAAQAAAAeOEJJTQPzAAAAAAAJAAAAAAAAAAABADhCSU0nEAAAAAAACgABAAAAAAAAAAE4QklNA/UAAAAAAEgAL2ZmAAEAbGZmAAYAAAAAAAEAL2ZmAAEAoZmaAAYAAAAAAAEAMgAAAAEAWgAAAAYAAAAAAAEANQAAAAEALQAAAAYAAAAAAAE4QklNA/gAAAAAAHAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAOEJJTQQIAAAAAAAQAAAAAQAAAkAAAAJAAAAAADhCSU0EHgAAAAAABAAAAAA4QklNBBoAAAAAA0EAAAAGAAAAAAAAAAAAAAAwAAAAMgAAAAYASABpAFIAZQBzADMAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAADIAAAAwAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAEAAAAAAABudWxsAAAAAgAAAAZib3VuZHNPYmpjAAAAAQAAAAAAAFJjdDEAAAAEAAAAAFRvcCBsb25nAAAAAAAAAABMZWZ0bG9uZwAAAAAAAAAAQnRvbWxvbmcAAAAwAAAAAFJnaHRsb25nAAAAMgAAAAZzbGljZXNWbExzAAAAAU9iamMAAAABAAAAAAAFc2xpY2UAAAASAAAAB3NsaWNlSURsb25nAAAAAAAAAAdncm91cElEbG9uZwAAAAAAAAAGb3JpZ2luZW51bQAAAAxFU2xpY2VPcmlnaW4AAAANYXV0b0dlbmVyYXRlZAAAAABUeXBlZW51bQAAAApFU2xpY2VUeXBlAAAAAEltZyAAAAAGYm91bmRzT2JqYwAAAAEAAAAAAABSY3QxAAAABAAAAABUb3AgbG9uZwAAAAAAAAAATGVmdGxvbmcAAAAAAAAAAEJ0b21sb25nAAAAMAAAAABSZ2h0bG9uZwAAADIAAAADdXJsVEVYVAAAAAEAAAAAAABudWxsVEVYVAAAAAEAAAAAAABNc2dlVEVYVAAAAAEAAAAAAAZhbHRUYWdURVhUAAAAAQAAAAAADmNlbGxUZXh0SXNIVE1MYm9vbAEAAAAIY2VsbFRleHRURVhUAAAAAQAAAAAACWhvcnpBbGlnbmVudW0AAAAPRVNsaWNlSG9yekFsaWduAAAAB2RlZmF1bHQAAAAJdmVydEFsaWduZW51bQAAAA9FU2xpY2VWZXJ0QWxpZ24AAAAHZGVmYXVsdAAAAAtiZ0NvbG9yVHlwZWVudW0AAAARRVNsaWNlQkdDb2xvclR5cGUAAAAATm9uZQAAAAl0b3BPdXRzZXRsb25nAAAAAAAAAApsZWZ0T3V0c2V0bG9uZwAAAAAAAAAMYm90dG9tT3V0c2V0bG9uZwAAAAAAAAALcmlnaHRPdXRzZXRsb25nAAAAAAA4QklNBCgAAAAAAAwAAAACP/AAAAAAAAA4QklNBBQAAAAAAAQAAAABOEJJTQQMAAAAAAVkAAAAAQAAADIAAAAwAAAAmAAAHIAAAAVIABgAAf/Y/+0ADEFkb2JlX0NNAAH/7gAOQWRvYmUAZIAAAAAB/9sAhAAMCAgICQgMCQkMEQsKCxEVDwwMDxUYExMVExMYEQwMDAwMDBEMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMAQ0LCw0ODRAODhAUDg4OFBQODg4OFBEMDAwMDBERDAwMDAwMEQwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAwADIDASIAAhEBAxEB/90ABAAE/8QBPwAAAQUBAQEBAQEAAAAAAAAAAwABAgQFBgcICQoLAQABBQEBAQEBAQAAAAAAAAABAAIDBAUGBwgJCgsQAAEEAQMCBAIFBwYIBQMMMwEAAhEDBCESMQVBUWETInGBMgYUkaGxQiMkFVLBYjM0coLRQwclklPw4fFjczUWorKDJkSTVGRFwqN0NhfSVeJl8rOEw9N14/NGJ5SkhbSVxNTk9KW1xdXl9VZmdoaWprbG1ub2N0dXZ3eHl6e3x9fn9xEAAgIBAgQEAwQFBgcHBgU1AQACEQMhMRIEQVFhcSITBTKBkRShsUIjwVLR8DMkYuFygpJDUxVjczTxJQYWorKDByY1wtJEk1SjF2RFVTZ0ZeLys4TD03Xj80aUpIW0lcTU5PSltcXV5fVWZnaGlqa2xtbm9ic3R1dnd4eXp7fH/9oADAMBAAIRAxEAPwD1Vc9m/WquzMs6f0ksttpcWZOXZJprcPpUsaz35WQz89jH100/4a//AAay/wDGf9bLOh9KrwcJ/p5/UdzG2NMOrqH89c0/m2O3enV/25/g1wHQerMxqmVM9rWiAElPXfXLM6tjdPORj9VyvVj3PrcKm/2a8drdn/btq89wPrp9b6rN1fV8olvAsebR/mX+q1db1fObm9KuYXSWtn4f+RXnuKA2qyw8Awkp9M+rf+N21trcX6x1NNZ0+30NI2/ysjGG72/y8f8A7YXptF9ORSy+h7babWh9djCHNc06tcxzfpNcvmH1JMr0X/FN9a7cXOH1dynziZW52GT/AIO76b6W/wDB3t3O/wCO/wCNSU+upJJJKf/Q5/8AxrZdmX9csmsklmHVVSweEt+0O/6dy5WrIspOhXW/40sJ+N9csqwghuXVVczzhvoP/wCnSuPNTnHw+KSnaxmWZlDbbzvrM+nUT7RGm9zfz3u/lImd0YjfTZT9myGjgtLHAkbm76/b7XKr0/NZTSMa1wbtnY93BB12z+a5q0vteX1HK9Kh5zc24aDdvOgj1LrSTtrrb+8qGT3vdNXxX6f3eF6zlP8ARv3GHF7ft+3+v4uH3fe/S/r8Xz8P/jTycwYPI5VrBz34Wbj5lZizGtZcwjmWOD/4K9n/AFfvwyd7S7xd4/ylRxMB+X1DGwagTZk2spaB4vcGfxV95N+mvXr8fzPU/spJehX4fmen/ZSSU//R6H/Gd9VLut9LZnYLN/UOnbnCsfSspOt1Lf3rG7fVq/8AUi8T9QHuvqBcJ9cf8VmB1u2zqHSntwOoPl1jSD6Frj+dY1nupsd+fbX/ANtep+kSU+MveNp81c+q+c7C6zRcDoTtcPEFaHUP8Xn1zwXlj+m2XtHFmPFzSPEelus/z2IOB9SvrhbkMNXSMprg4EGxhqH+ff6bElPqXVuk4+bg/aWNB3NnTWCVh/4t/qn9p65Z9YLm/qWE51eGTxZd/N2Wt/eqx/czd/p/+JXVdG+r/Wrem14XV3sxMeItpoeX3PHDqnZI2Mx6nfn/AGb9P/3ZYunx8ejGorx8ettVNTQyutgDWtaNGta0JKSJJJJKf//ZOEJJTQQhAAAAAABdAAAAAQEAAAAPAEEAZABvAGIAZQAgAFAAaABvAHQAbwBzAGgAbwBwAAAAFwBBAGQAbwBiAGUAIABQAGgAbwB0AG8AcwBoAG8AcAAgAEMAQwAgADIAMAAxADUAAAABADhCSU0EBgAAAAAABwAEAAAAAQEA/+EOlGh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMwNjcgNzkuMTU3NzQ3LCAyMDE1LzAzLzMwLTIzOjQwOjQyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczppbGx1c3RyYXRvcj0iaHR0cDovL25zLmFkb2JlLmNvbS9pbGx1c3RyYXRvci8xLjAvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIGRjOmZvcm1hdD0iaW1hZ2UvanBlZyIgeG1wOkNyZWF0b3JUb29sPSJJbGx1c3RyYXRvciIgeG1wOkNyZWF0ZURhdGU9IjIwMDktMDMtMzBUMTA6MjI6MzktMDQ6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE1LTEyLTEzVDE3OjM1OjI5KzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE1LTEyLTEzVDE3OjM1OjI5KzA4OjAwIiB4bXBNTTpEb2N1bWVudElEPSJ1dWlkOkRCMjI4QTI3MzYxRERFMTE5NzhCREJDMzQxQjY2MzFDIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmY0NGFlYjFjLTJlNGEtNDJlYy04M2YxLTQ3MjkxYjQwMzE3ZiIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ1dWlkOkRCMjI4QTI3MzYxRERFMTE5NzhCREJDMzQxQjY2MzFDIiBpbGx1c3RyYXRvcjpTdGFydHVwUHJvZmlsZT0iQmFzaWMgUkdCIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiPiA8ZGM6dGl0bGU+IDxyZGY6QWx0PiA8cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiPkJhc2ljIFJHQjwvcmRmOmxpPiA8L3JkZjpBbHQ+IDwvZGM6dGl0bGU+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ1dWlkOkRBMjI4QTI3MzYxRERFMTE5NzhCREJDMzQxQjY2MzFDIiBzdFJlZjpkb2N1bWVudElEPSJ1dWlkOkQ5MjI4QTI3MzYxRERFMTE5NzhCREJDMzQxQjY2MzFDIi8+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmY0NGFlYjFjLTJlNGEtNDJlYy04M2YxLTQ3MjkxYjQwMzE3ZiIgc3RFdnQ6d2hlbj0iMjAxNS0xMi0xM1QxNzozNToyOSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg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',
        artist: 'Unknown',
        album: 'Unknown',
        title: 'Unknown',
    };
    var template = ['<div class="mplayer">',
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
                '<button class="mplayer-play mplayer-btn icon-play"></button>',
                '<button class="mplayer-pause mplayer-btn icon-pause"></button>',
                '</div>',
            '</div>'].join('');
    function Mplayer (element, track, option) {
        var defaultOption = {
            autoPlay: false,
            autoBuffer: false,
            buffered: false,
            loop: false,
            preload: false,
        };
        this.option = {};
        this.track = track;
        $.extend(this.option, defaultOption, option);
        this.element = element;
        this.status = 'pending';
        this.init();
    }

    Mplayer.defaultTrack = defaultTrack;

    Mplayer.tmpl = function (string) {
        var index = 0;
        var source = 'var text="';
        var render;
        string.replace(/\${{(.*?)}}|$/g, function (origin, str, offset) {
            source += string.slice(index, offset).replace(/"/g, '\\"');
            index = offset + origin.length;
            source += '"+(typeof ' + (str || '""') + '!=="undefined" ? ' + (str || '""') +':"")+"';
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
            },
            'LOAD_TRACK_INFO_ERROR': function (args) {
                var url = args[0];
                var reason = args[1];
                this.message = 'Load track info error: ' + reason.error + ' error';
                this.description = 'Load "' + url + '" track info error: ' + reason.error + ' error';
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
        var self = this;
        var tmp = self.Mplayer.detach();
        var source = '<source src="${{ogg}}"></source><source src="${{mp3}}"></source>';
        tmp.find('source').remove();
        tmp.append(Mplayer.tmpl(source)(self.track));
        self.element.append(tmp);
        self.Mplayer.get(0).load();
        return self;
    };

    Mplayer.fn.parseID3 = function (url, callback) {
        ID3.loadTags(url, function () {
            var tags = ID3.getAllTags(url);
            tags = $.extend({}, defaultTrack, tags);
            if (tags.picture) {
                var image = tags.picture;
                var base64String = '';
                for (var i = 0; i < image.data.length; i+=1) {
                    base64String += String.fromCharCode(image.data[i]);
                }
                tags.cover = 'data:' + image.format + ';base64,' + window.btoa(base64String);
            }
            if (typeof callback === 'function') {callback(undefined, tags);}
        }, {
            tags: ['artist', 'title', 'album', 'year', 'comment', 'track', 'genre', 'picture'],
            onError: function (err) {
                if (typeof callback === 'function') {callback(err);}
            }
        });
    };

    Mplayer.fn.init = function () {
        var self = this;
        var attrs = '';
        $.each(self.option, function (name, value) {
            if (value && name !== 'plugin') {
                attrs += name + '=' + value + ' ';
            }
        });
        self.Mplayer = $('<audio ' + attrs + '></audio>');
        self.loadPlugin();
        function getTrack (callback) {
            if (typeof self.track === 'string') {
                self.parseID3(self.track, function (err, tags) {
                    if (err) {
                        Mplayer.Error('LOAD_TRACK_INFO_ERROR', self.track, err);
                        return ;
                    }
                    var obj = {
                        mp3: self.track, 
                        ogg: self.track,
                        title: tags.title,
                        album: tags.album,
                        artist: tags.artist,
                        cover: tags.cover
                    };
                    callback(self.track = obj);
                });
            } else {
                callback(self.track);
            }
        }
        getTrack(function (track) {
            self.load();
            self.renderGUI(track);
            self.bindAudioEvent();
        });
        return this;
    };

    Mplayer.fn.renderGUI = function (obj) {
        this.element.get(0).innerHTML = this.getTemplate(obj);
        this.updateGUIVolume();
        this.updateGUIVolume(this.Mplayer.get(0).volume);
        this.bindDOMEvent();
        return this;
    };

    Mplayer.fn.getTemplate = function (obj) {
        return Mplayer.tmpl(template)(obj);
    };

    Mplayer.fn.loadPlugin = function () {
        var self = this;
        var pluginList = self.option.plugin || {};
        var extend = function (obj) {
            $.each(obj, function (name, cb) {
                if (!self[name]) {
                    self[name] = function () {
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

    Mplayer.fn.bindAudioEvent = function () {
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
            self.track.durationNum = Mplayer.parseTime(self.track.duration);
            self.track.currentTimeNum = Mplayer.parseTime(0);
            self.renderGUI(self.track);
            self.status = 'loaded';
            self.emit('statusChanged', self.status);
        }).on('loadeddata', function () {
            self.status = 'loadeddata';
            self.emit('statusChanged', self.status);            
        }).on('seeking', function () {
            self.prevStatus = self.status;
            self.status = 'seeking';
            self.emit('statusChanged', self.status);
        }).on('seeked', function () {
            self.status = 'seeked';
            self.emit('statusChanged', self.status);
            self.status = self.prevStatus;
            self.emit('statusChanged', self.status);
            delete self.prevStatus;
        }).on('timeupdate', function () {
            self.track.currentTime = self.Mplayer.get(0).currentTime;
            self.updateGUITime(self.track.currentTime);
        }).on('statusChanged', function (event, status) {
            self.updateGUIButton(status);
        }).on('volumechange', function () {
            self.updateGUIVolume(self.Mplayer.get(0).volume);
        });
    };

    Mplayer.fn.updateGUIVolume = function (volume) {
        var percentage = (volume*100).toString() + '%';
        this.element.find('.mplayer-current-volume').css({
            width: percentage
        });
    };

    Mplayer.fn.updateGUITime = function (time) {
        this.element.find('.mplayer-current-time-num').get(0).innerHTML = Mplayer.parseTime(time);
        this.element.find('.mplayer-current-time').css({
            width: Math.floor(100*this.track.currentTime/this.track.duration).toString() + '%'
        });
    };

    Mplayer.fn.updateGUIButton = function (status) {
        if (status === 'playing') {
            this.element.find('.mplayer-play').hide().end().find('.mplayer-pause').show();
        } else if (status === 'pause') {
            this.element.find('.mplayer-play').show().end().find('.mplayer-pause').hide();
        }
    };

    Mplayer.fn.bindDOMEvent = function () {
        var self = this;
        self.element.find('.mplayer-play').on('click', function () {
            self.play();
        }).end().find('.mplayer-pause').on('click', function () {
            self.pause();
        }).end().find('.mplayer-progress-bar').on('click', function (event) {
            var pos = event.pageX - $(this).offset().left;
            var width = $(this).width();
            self.setProgress(self.track.duration*pos/width);
        }).end().find('.mplayer-volume-wrapper').on('click', function (event) {
            event.stopPropagation();
            var pos = event.pageX - $(this).offset().left;
            var width = $(this).width();
            self.setVolume(pos/width);
        }).end().find('.icon-volume').on('click', function (event) {
            event.stopPropagation();
            var volumeBar = self.element.find('.mplayer-full-volume');
            var doc = $(window);
            volumeBar.css({width: 50});
            var hideVolume = function () {
                doc.off('click', hideVolume);
                volumeBar.css({width: 0});
            };
            doc.on('click', hideVolume);
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

    Mplayer.fn.one = function () {
        this.Mplayer.one.apply(this.Mplayer, arguments);
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
        return mplayer;
    };

    window.Mplayer = Mplayer;
    
})($,window);
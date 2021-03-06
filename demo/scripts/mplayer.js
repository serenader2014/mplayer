;(function ($, window, undefined) {
    var Mplayer = function (e) {
        this.Version = "0.2.2"; //修复手机浏览器的播放列表功能,添加一些功能。改用一种新的方式创建实例。
        this.element = e;
        this.playlist = [];
        this.currentTrack = 0;
        this.index = Mplayer.count++;
        this.loop = "false";
        this.isPlaying = false;
        this.css = {};
    };

    Mplayer.count = 0;
    Mplayer.message = {
        isInitialized: "This instance is aleady initialized",
        isSingleMode: "This instance is in single mode, doesn't support this function.",
        isSingleAudio: "This instance only has one audio, can not delete the only one audio.",
        itemInvalid: "The item you added is not valid.",

    };

    Mplayer.parseAudio = function (item) {
        if (typeof item === "object") {
            item.artist = item.artist|| "undefined";
            item.title = item.title || "undefined";
            item.cover = item.cover || "undefined";
            item.mp3 = item.mp3 || "undefined";
            item.ogg = item.ogg || "undefined";

            return item;
        } else if (typeof item === "string") {
            var tmp = {},
                fileName = item.substring(item.lastIndexOf("/")+1),
                middleScore = fileName.indexOf("-");
            if (middleScore !== -1) {
                tmp.artist = $.trim(fileName.substring(0, middleScore-1));
                tmp.title = $.trim(fileName.substring(middleScore+1,fileName.lastIndexOf(".")));
            } else {
                tmp.artist = "undefined";
                tmp.title = $.trim(item.substring(item.lastIndexOf(".")));
            }
            tmp.cover = item.substring(0,item.lastIndexOf(".")) + ".jpg";
            tmp.mp3 = item.substring(0,item.lastIndexOf(".")) + ".mp3";
            tmp.ogg = item.substring(0,item.lastIndexOf(".")) + ".ogg";

            return tmp;
        }
    };

    Mplayer.createView = function (instance) {
        //缺省模式下自动生成GUI。也可以自写GUI。
        var MGUI = {},
            self = instance,
            length = self.playlist.length;

        if (self.element.find(self.css.player).length > 0) {
            throw new Error(Mplayer.message.isInitialized);
        }

        MGUI.mplayer = $("<div class='mplayer-" + self.index + " "+self.css.player.substring(1)+"'></div>");
        MGUI.main = $("<div class='"+self.css.main.substring(1)+"'></div>");
        MGUI.audio = $("<audio class='"+self.css.audio.substring(1)+"'></audio>");
        MGUI.source = $("<source></source><source></source>");
        MGUI.control = $("<div class='"+self.css.control.substring(1)+"'></div>");
        MGUI.artist = $("<p class='icon-artist "+self.css.artist.substring(1)+"'></p>");
        MGUI.title = $("<p class='icon-track "+self.css.title.substring(1)+"'></p>");
        MGUI.progress = $("<span class='"+self.css.progressBar.substring(1)+"'></span>")
            .append($("<span class='"+self.css.playedTime.substring(1)+"'></span>"));
        MGUI.volume = $("<span class='"+self.css.volumeBar.substring(1)+"'></span>")
            .append($("<span class='"+self.css.volumeValue.substring(1)+"'></span>"));
        MGUI.mute = $("<span></span>")
            .append("<a class='icon-mute "+self.css.mute.substring(1)+"' href='javascript:;'></a>");
        MGUI.maxVolume = $("<span></span>")
            .append($("<a class='icon-volume "+self.css.maxVolume.substring(1)+"' href='javascript:;'></a>"));
        MGUI.time = $("<span class='icon-clock "+self.css.time.substring(1)+"'></span>")
            .append($("<span class='"+self.css.currentTime.substring(1)+"'>-:--</span>"))
            .append($("<span>/</span>"))
            .append($("<span class='"+self.css.duration.substring(1)+"'>-:--</span>"));
        MGUI.play = $("<span></span>")
            .append($("<a class='icon-play "+self.css.play.substring(1)+"' href='javascript:;'></a>"));
        MGUI.loop = $("<span></span>")
            .append($("<a class='icon-repeat "+self.css.loop.substring(1)+"' href='javascript:;'></a>"));
        MGUI.cover = $("<img class='"+self.css.cover.substring(1)+"' src=''>");

        //当播放列表只有一首时，不生成以下元素。
        if (length > 1) {
            MGUI.playlist = $("<div class='"+self.css.playlist.substring(1)+"'></div>");

            MGUI.playlistMenu = $("<span></span>")
                .append($("<a class='icon-list "+self.css.playlistMenu.substring(1)+"' href='javascript:;'></a>"));

            MGUI.shuffle = $("<span></span>")
                .append($("<a class='icon-shuffle "+self.css.shuffle.substring(1)+"' href='javascript:;'></a>"));

            MGUI.next = $("<span></span>")
                .append($("<a class='icon-next "+self.css.next.substring(1)+"' href='javascript:;'></a>"));

            MGUI.prev = $("<span></span>").
                append($("<a class='icon-prev "+self.css.prev.substring(1)+"' href='javascript:;'></a>"));
        } else {
            MGUI.playlist = MGUI.playlistMenu = MGUI.shuffle = MGUI.next = MGUI.prev = "";
        }


        MGUI.audio.append(MGUI.source);
        MGUI.control
            .append(MGUI.artist)
            .append(MGUI.title)
            .append(MGUI.playlistMenu)
            .append(MGUI.time)
            .append(MGUI.progress)
            .append(MGUI.prev)
            .append(MGUI.play)
            .append(MGUI.next)
            .append(MGUI.mute)
            .append(MGUI.volume)
            .append(MGUI.maxVolume)
            .append(MGUI.shuffle)
            .append(MGUI.loop);
        MGUI.main.append(MGUI.audio).append(MGUI.cover).append(MGUI.control);
        self.element.append(MGUI.mplayer.append(MGUI.main).append(MGUI.playlist));
    };

    Mplayer.css = {
        player: ".mplayer",
        main: ".mplayer-main",
        playlist: ".mplayer-playlist",
        audio: ".mplayer-audio",
        control: ".mplayer-control",
        play: ".mplayer-btn-play",
        pause: ".mplayer-btn-pause",
        next: ".mplayer-btn-next",
        prev: ".mplayer-btn-prev",
        loop: ".mplayer-btn-noloop",
        singleLoop: ".mplayer-btn-single",
        allLoop: ".mplayer-btn-all",
        shuffle: ".mplayer-btn-shuffle",
        song: ".mplayer-song",
        current: ".mplayer-current",
        cover: ".mplayer-cover",
        title: ".mplayer-title",
        artist: ".mplayer-artist",
        progressBar: ".mplayer-progress",
        playedTime: ".mplayer-played-time",
        volumeBar: ".mplayer-volume",
        volumeValue: ".mplayer-volume-value",
        currentTime: ".mplayer-current-time",
        duration: ".mplayer-duration",
        time: ".mplayer-time",
        mute: ".mplayer-mute",
        maxVolume: ".mplayer-max-volum",
        playlistMenu: ".mplayer-list",
        deleteBtn: ".mplayer-delete-btn",
        addBtn: ".mplayer-add-btn",
        addAudio: ".mplayer-add",
        addArtist: ".mplayer-add-artist",
        addTitle: ".mplayer-add-title",
        addCover: ".mplayer-add-cover",
        addMp3: ".mplayer-add-mp3",
        addOgg: ".mplayer-add-ogg",
        addSubmit: ".mplayer-add-submit",
        addCancel: ".mplayer-add-cancel"
    };

    Mplayer.defaultEventBinding = function (instance) {
        var e = instance.element,
            self = instance;

        var getPos = function (element) {
            var acturalLeft = element.offsetLeft;
            var acturalTop = element.offsetTop;
            var current = element.offsetParent;
            while(current !== null){
                acturalLeft = acturalLeft + current.offsetLeft;
                acturalTop = acturalTop + current.offsetTop;
                current = current.offsetParent;
            }
            return {
                left: acturalLeft,
                top: acturalTop
            };
        };

        //使用事件委托，因为有些元素是经过脚本修改的，只有通过委托才能获取正确的元素。
        e.find(self.css.control).on("click", self.css.play, function () {
            self.switchTrack(self.currentTrack,true);
        }).on("click", self.css.pause, function () {
            self.pause();
        }).on("click", self.css.next, function () {
            self.next();
        }).on("click", self.css.prev, function () {
            self.prev();
        }).on("click", self.css.loop, function () {
            self.loop = "single";
            $(this).removeClass(self.css.loop.substring(1)).addClass(self.css.singleLoop.substring(1));
        }).on("click", self.css.singleLoop, function () {
            self.loop = "all";
            $(this).removeClass(self.css.singleLoop.substring(1)).addClass(self.css.allLoop.substring(1));
        }).on("click", self.css.allLoop, function () {
            self.loop = "false";
            $(this).removeClass(self.css.allLoop.substring(1)).addClass(self.css.loop.substring(1));
        }).on("click", self.css.shuffle, function () {
            self.shuffle();
        });

        e.find(self.css.playlist).on("click", self.css.deleteBtn, function () {
            self.delete($(self.css.deleteBtn).index($(this)));
        }).on("click", self.css.addBtn, function () {
            if ($(this).html() === "添加...") {
                var container = $("<div class='"+self.css.addAudio.substring(1)+"'></div>"),
                    artist = $("<input class='"+self.css.addArtist.substring(1)+"' placeholder='歌手名字'>"),
                    title = $("<input class='"+self.css.addTitle.substring(1)+"' placeholder='歌曲名字'>"),
                    cover = $("<input class='"+self.css.addCover.substring(1)+"' placeholder='专辑封面地址'>"),
                    mp3 = $("<input class='"+self.css.addMp3.substring(1)+"' placeholder='Mp3文件地址'>"),
                    ogg = $("<input class='"+self.css.addOgg.substring(1)+"' placeholder='Ogg文件地址'>"),
                    submit = $("<button class='"+self.css.addSubmit.substring(1)+"'>添加</button>"),
                    cancel = $("<button class='"+self.css.addCancel.substring(1)+"'>取消</button>");
                container.append(artist).append(title).append(cover).append(mp3).append(ogg).append(submit).append(cancel);
                e.find(self.css.playlist).append(container);
                $(this).html("取消");
            } else {
                e.find(self.css.addAudio).remove();
                $(this).html("添加...");
            }
        }).on("click", self.css.addSubmit ,function () {
            var artist = e.find(self.css.addArtist).val(),
                title = e.find(self.css.addTitle).val(),
                cover = e.find(self.css.addCover).val(),
                mp3 = e.find(self.css.addMp3).val(),
                ogg = e.find(self.css.addOgg).val(),
                tmp = mp3 || ogg;

            if (tmp) {
                if (artist || title || cover) {
                    self.add({
                        artist: artist,
                        title: title,
                        cover: cover,
                        mp3: mp3,
                        ogg: ogg
                    });
                } else {
                    self.add(tmp);
                }

            } else {
                alert(Mplayer.message.itemInvalid);
                return false;
            }
        }).on("click", self.css.addCancel, function () {
            e.find(self.css.addAudio).remove();
            e.find(self.css.addBtn).html("添加...");
        }).on("click", self.css.song, function () {
            self.switchTrack(e.find(self.css.song).index($(this)));
        });

        e.find(self.css.progressBar).on("click", function (event) {
            if (self.isPlaying) {
                var pos = event.pageX - getPos(this).left,
                    width = $(self.css.progressBar).width();
                self.setProgress(self.audio[0].duration*(pos/width));
            }
        });

        e.find(self.css.volumeBar).on("click", function (event) {
            var pos = event.pageX - getPos(this).left,
                width = $(self.css.volumeBar).width();
            self.setVolume(pos/width);
        });

        e.find(self.css.mute).on("click", function () {
            self.setVolume(0);
        });

        e.find(self.css.maxVolume).on("click", function () {
            self.setVolume(1);
        });

        e.find(self.css.playlistMenu).on("click", function ()  {
            var playlist = e.find(self.css.playlist);
            if (playlist.is(":animated")) {
                return false;
            } else {
                playlist.slideToggle(400);
            }
            $(this).toggleClass("mplayer-btn-active");
        });
    };

    Mplayer.audioEventListener = function (instance) {
        var self = instance,
            e = self.element;

        self.audio.on("play", function () {
            var currentTime,
                duration = self.audio[0].duration;
            e.find(self.css.duration).html(self.getDuration());
            update = setInterval(function () {
                currentTime = self.audio[0].currentTime;
                duration = self.audio[0].duration;
                e.find(self.css.currentTime).html(self.getCurrentTime());
                e.find(self.css.playedTime).css({"width":(currentTime/duration)*100+"%"});
                e.find(self.css.volumeValue).css({"width":self.audio[0].volume*4+"rem"});
            },500);
        }).on("pause", function () {
            clearInterval(update);
        });

        self.audio.on("ended", function () {
            if (self.loop === "single") {
                self.play();
            } else {
                if (self.playlist.length === 1) {
                    self.pause();
                } else {
                    self.next();
                }
            }
        });

        self.audio.on("playerOnChanged", function () {
            if (self.isPlaying) {
                e.find(self.css.play)
                    .removeClass(self.css.play.substring(1))
                    .removeClass("icon-play")
                    .addClass(self.css.pause.substring(1))
                    .addClass("icon-pause");
            } else {
                e.find(self.css.pause)
                    .removeClass(self.css.pause.substring(1))
                    .removeClass("icon-pause")
                    .addClass(self.css.play.substring(1))
                    .addClass("icon-play");
            }
        });
    };

    Mplayer.prototype = {
        initialize: function (list, css) {
            var self = this,
                i;
            if (self.element.find(Mplayer.css.player).length > 0) {
                throw new Error(Mplayer.message.isInitialized);
            }
            if ($.isArray(list)) {
                list.forEach(function (item, index) {
                    self.playlist.push(Mplayer.parseAudio(item));
                });
            } else {
                throw new Error("Invalid playlist.");
            }

            if (css && typeof css === "object") {
                $.extend(self.css, Mplayer.css, css);
            } else {
                $.extend(self.css, Mplayer.css);
                Mplayer.createView(self);
            }


            if (self.playlist.length > 1) {
                self.updatePlaylist();
            }

            //缓存audio元素，并存储在每个实例中。方便读取
            //该属性不能直接在 $.Mplayer 里面定义是因为执行 $.Mplayer() 时尚未生成 audio 标签，
            //故该元素无法获取。在 createView() 方法执行之后再缓存该属性才能正常工作。
            self.audio = self.element.find(self.css.audio);
            self.load(0);

            //以下两个方法都需要先正确获取 this.audio 元素之后才能正常工作。
            Mplayer.defaultEventBinding(self);
            Mplayer.audioEventListener(self);
            self.audio[0].volume = 0.8;
            return this;
        },

        play: function () { 
            this.audio[0].play();
            this.isPlaying = true;
            this.audio.trigger("playerOnChanged");
            return this;
        },

        pause: function () { 
            this.audio[0].pause();
            this.isPlaying = false;
            this.audio.trigger("playerOnChanged");
            return this;
        },

        next: function () {
            if (this.playlist.length <= 1) {
                throw new Error(Mplayer.message.isSingleMode);
            }
            if (this.currentTrack === this.playlist.length - 1) {
                if (this.loop === "false") {
                    this.audio[0].currentTime = 0;
                    this.pause();
                } else if (this.loop === "all") {
                    this.switchTrack(0);
                }
            } else {
                this.switchTrack(this.currentTrack + 1);
            }
            return this;
        },

        prev: function () {
            if (this.playlist.length <= 1) {
                throw new Error(Mplayer.message.isSingleMode);
            }
            if (this.currentTrack === 0) {
                if (this.loop === "false") {
                    return false;
                } else if (this.loop === "all") {
                    this.switchTrack(this.playlist.length - 1);
                }
            } else {
                this.switchTrack(this.currentTrack - 1);
            }
            return this;
        },

        shuffle: function () {
            if (this.playlist.length <= 1) {
                throw new Error(Mplayer.message.isSingleMode);
            }
            var self = this;
            self.originalList = [];
            self.playlist.forEach(function (item, index) {
                self.originalList[index] = item;
            });
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

            self.updatePlaylist();
            self.element.find(self.css.song).each(function (index, item, arr) {
                $(item).on("click", function () {
                    self.switchTrack(index);
                });
            });
            self.switchTrack(0);
            return this;
        },

        load: function (i) {
            var self = this,
                audio,
                e = self.element;
            e.find(self.css.current).removeClass(self.css.current.substring(1)).end()
                .find(self.css.song).eq(i).addClass(self.css.current.substring(1));

            //修复手机浏览器不能播放列表的问题。
            //之前实现列表播放的方法是改变audio元素的src属性，然后将其强制加载音频文件。这种方法在电脑浏览器中可以正常运行。但是无法在手机浏览器运行。
            //修复的方法是，将原来的audio元素从文档流中移除，但是不是完全删除该元素（使用jQuery的.detach()方法）。然后再将移除出来的audio重新append进
            //文档中。从而浏览器会重新获得该元素，然后开始下载音频文件。这样就不会出现之前的在手机端中无法下载媒体文件的问题。
            audio = e.find(self.css.audio).detach();
            e.append(audio);

            self.audio.find("source")
                .eq(0).attr("src", this.playlist[i].mp3).end()
                .eq(1).attr("src", this.playlist[i].ogg);
            e.find(self.css.cover).attr("src", self.playlist[i].cover).end()
                .find(self.css.artist).html(self.playlist[i].artist).end()
                .find(self.css.title).html(self.playlist[i].title).end()
                .find(self.css.duration).html(self.audio[0].duration);
            self.audio[0].load();
            
            return this;
        },

        switchTrack: function (i,isPaused) {
            var self = this;
            if (isPaused) {
                self.play();
            } else {
                self.load(i);
                self.currentTrack = i;
                self.audio.on("canplay", function () {
                    self.play();
                });
            }
            return this;
        },

        updatePlaylist: function () {
            var self = this;

            if (self.playlist.length <= 1) {
                throw new Error(Mplayer.message.isSingleMode);
            }
            self.element.find(self.css.playlist+" ul,"+self.css.addAudio).remove().end()
                .find(self.css.playlist).append($("<ul>"));
            self.playlist.forEach(function (item, index, arr) {
                self.element.find(self.css.playlist+" ul")
                    .append($("<li></li>")
                        .append($("<a href='javascript:;' class='"+self.css.song.substring(1)+"'>" + (index*1+1) +". "+ item.artist + " - " + item.title+ "</a>"))
                        .append($("<a href='javascript:;' class='icon-circle-cross  "+self.css.deleteBtn.substring(1)+"'></a>")));
            });

            self.element.find(self.css.playlist+ " ul").append(
                $("<li><a href='javascript:;' class='"+self.css.addBtn.substring(1)+"'>添加...</a></li>"));

            return this;
        },

        delete: function (i) {
            var self = this;
            if (self.playlist.length === 1) {
                throw new Error(Mplayer.message.isSingleAudio);
            }
            self.playlist.splice(i, 1);
            if (self.playlist.length === 1) {
                self.updateSingleMode();
            } else {
                self.updatePlaylist();
            }
            if (self.currentTrack === i) {
                if (i === self.playlist.length-1) {
                    self.switchTrack(0);
                } else {
                    self.switchTrack(i);
                }
            }

            return this;
        },

        add: function (item) {
            var self = this;

            self.playlist.push(Mplayer.parseAudio(item));
            self.updatePlaylist();

            return this;
        },

        updateSingleMode: function () {
            var self = this;
            if (self.playlist.length === 1) {
                self.element.find(self.css.playlist).remove().end()
                    .find(self.css.playlistMenu).remove().end()
                    .find(self.css.next).remove().end()
                    .find(self.css.prev).remove().end()
                    .find(self.css.shuffle).remove();
            }

            return this;
        },

        setProgress: function (i) {
            if (typeof i === "number") {
                this.audio[0].currentTime = i;
                this.play();
            } else if (typeof i === "string" && i.indexOf(":") !== -1) {
                this.play();
                var arr = i.split(":");
                this.audio[0].currentTime = arr[0]*60 + arr[1]*1;
                this.play();
            }
            return this;
        },

        setVolume: function (i) {
            this.audio[0].volume = i;
            return this;
        },

        getCurrentTime: function () {
            var self = this;
            var    currentTime = self.audio[0].currentTime;
            var    CTMin = currentTime/60 >= 10 ? Math.floor(currentTime/60) : "0" + Math.floor(currentTime/60),
                CTSec = currentTime%60 >= 10 ? Math.floor(currentTime%60) : "0" + Math.floor(currentTime%60);

            return CTMin+":"+CTSec;
        },

        getDuration: function () {
            var self = this;
            var    duration = self.audio[0].duration;
            var    DMin = duration/60 >= 10 ? Math.floor(duration/60) : "0" + Math.floor(duration/60),
                DSec = duration%60 >= 10 ? Math.floor(duration%60) : "0" + Math.floor(duration%60);

            return DMin+":"+DSec;
        },
    };

    $.fn.Mplayer = function (list,css) {
        var instance = new Mplayer(this);
        instance.initialize(list,css);
        return instance;
    };
})(jQuery, window);
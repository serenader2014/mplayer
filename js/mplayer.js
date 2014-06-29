;(function ($, window, undefined) {
	var Mplayer = function (e) {
		this.Version = "0.1.0";
		this.element = e;
		this.playlist = [];
		this.currentTrack = 0;
		this.index = Mplayer.count++;
		this.loop = "false";
		this.isPlaying = false;
	};

	Mplayer.count = 0;

	Mplayer.prototype = {
		initialize: function (list, css) {
			var self = this,
				i;

			list.forEach(function (item, index) {
				if (typeof item === "object") {
					item.artist = item.artist ? item.artist: "undefined";
					item.title = item.title ? item.title : "undefined";
					item.cover = item.cover ? item.cover : "undefined";
					item.mp3 = item.mp3 ? item.mp3 : "undefined";
					item.ogg = item.ogg ? item.ogg : "undefined";
					
					self.playlist.push(item);
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

					self.playlist.push(tmp);
				}
			});

			if (css && typeof css === "object") {
				for (i in css) {
					self.css[i] = css[i];
				}
				self.updatePlaylist();
			} else {
				self.createView().updatePlaylist();
			}

			//缓存audio元素，并存储在每个实例中。方便读取
			//该属性不能直接在 $.Mplayer 里面定义是因为执行 $.Mplayer() 时尚未生成 audio 标签，
			//故该元素无法获取。在 createView() 方法执行之后再缓存该属性才能正常工作。
			self.audio = self.element.find(self.css.audio);
			self.load(0);

			//以下两个方法都需要先正确获取 this.audio 元素之后才能正常工作。
			self.defaultEventBinding().eventListener();
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
			if (this.currentTrack === this.playlist.length - 1) {
				if (this.loop === "false") {
					this.pause();
					//this.audio[0].currentTime = 0;
				} else if (this.loop === "all") {
					this.switchTrack(0);
				}
			} else {
				this.switchTrack(this.currentTrack + 1);
			}
			return this;
		},

		prev: function () {
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
			var self = this;
			self.element
				.find(self.css.current).removeClass(self.css.current.substring(1)).end()
				.find(self.css.song).eq(i).addClass(self.css.current.substring(1));
			self.audio.find("source")
				.eq(0).attr("src", this.playlist[i].mp3).end()
				.eq(1).attr("src", this.playlist[i].ogg);
			self.element.find(self.css.cover).attr("src", self.playlist[i].cover);
			self.element.find(self.css.artist).html(self.playlist[i].artist).end()
				.find(self.css.title).html(self.playlist[i].title);
			
			return this;
		},

		switchTrack: function (i,isPaused) {
			var self = this;
			if (isPaused) {
				self.play();
			} else {
				self.load(i);
				self.currentTrack = i;
				self.audio[0].load();
				self.audio.on("canplay", function () {
					self.play();
				});
				self.element.find(self.css.duration).html(self.audio[0].duration);
			}
			return this;
		},

		createView: function () {
			//缺省模式下自动生成GUI。也可以自写GUI。
			var MGUI = {},
				self = this;

			MGUI.mplayer = $("<div class='mplayer-" + self.index + " "+self.css.player.substring(1)+"'></div>");
			MGUI.main = $("<div class='"+self.css.main.substring(1)+"'></div>");
			MGUI.playlist = $("<div class='"+self.css.playlist.substring(1)+"'></div>");
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
			MGUI.playlistMenu = $("<span></span>")
				.append($("<a class='icon-list "+self.css.playlistMenu.substring(1)+"' href='javascript:;'></a>"));
			MGUI.play = $("<span></span>")
				.append($("<a class='icon-play "+self.css.play.substring(1)+"' href='javascript:;'></a>"));
			MGUI.next = $("<span></span>")
				.append($("<a class='icon-next "+self.css.next.substring(1)+"' href='javascript:;'></a>"));
			MGUI.prev = $("<span></span>").
				append($("<a class='icon-prev "+self.css.prev.substring(1)+"' href='javascript:;'></a>"));
			MGUI.loop = $("<span></span>")
				.append($("<a class='icon-repeat "+self.css.loop.substring(1)+"' href='javascript:;'></a>"));
			MGUI.shuffle = $("<span></span>")
				.append($("<a class='icon-shuffle "+self.css.shuffle.substring(1)+"' href='javascript:;'></a>"));
			MGUI.cover = $("<img class='"+self.css.cover.substring(1)+"' src=''>");

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

			return this;
		},

		updatePlaylist: function () {
			var self = this;

			self.element.find(self.css.playlist+" ul").remove().end()
				.find(self.css.playlist).append($("<ul>"));
			self.playlist.forEach(function (item, index, arr) {
				self.element.find(self.css.playlist+" ul")
					.append($("<li></li>")
						.append($("<a href='javascript:;'>" + (index*1+1) +". "+ item.artist + " - " + item.title+ "</a>")
							.addClass(self.css.song.substring(1))));
			});

			return this;
		},

		css: {
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
			playlistMenu: ".mplayer-list"
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
			var	currentTime = self.audio[0].currentTime;
			var	CTMin = currentTime/60 >= 10 ? Math.floor(currentTime/60) : "0" + Math.floor(currentTime/60),
				CTSec = currentTime%60 >= 10 ? Math.floor(currentTime%60) : "0" + Math.floor(currentTime%60);

			return CTMin+":"+CTSec;
		},

		getDuration: function () {
			var self = this;
			var	duration = self.audio[0].duration;
			var	DMin = duration/60 >= 10 ? Math.floor(duration/60) : "0" + Math.floor(duration/60),
				DSec = duration%60 >= 10 ? Math.floor(duration%60) : "0" + Math.floor(duration%60);

			return DMin+":"+DSec;
		},

		defaultEventBinding: function () {
			var e = this.element,
				self = this;

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

			e.find(self.css.song).each(function (index, item, arr) {
				$(item).on("click", function () {
					self.switchTrack(index);
				});
			});

			var update;

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

			return this;
		},

		eventListener: function () {
			var self = this;
			self.audio.on("ended", function () {
				if (self.loop === "single") {
					self.play();
				} else {
					self.next();
				}
			});

			self.audio.on("playerOnChanged", function () {
				if (self.isPlaying) {
					self.element.find(self.css.play)
						.removeClass(self.css.play.substring(1))
						.removeClass("icon-play")
						.addClass(self.css.pause.substring(1))
						.addClass("icon-pause");
				} else {
					self.element.find(self.css.pause)
						.removeClass(self.css.pause.substring(1))
						.removeClass("icon-pause")
						.addClass(self.css.play.substring(1))
						.addClass("icon-play");
				}
			});
			return this;
		},

	};

	$.fn.Mplayer = function () {
		return new Mplayer(this);
	};
})(jQuery, window);
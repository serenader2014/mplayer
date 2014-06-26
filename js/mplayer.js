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
		initialize: function (list) {
			var self = this;

			list.forEach(function (item, index) {
				self.playlist.push(item);
			});

			this.createView();

			//缓存audio元素，并存储在每个实例中。方便读取
			//该属性不能直接在 $.Mplayer 里面定义是因为执行 $.Mplayer() 时尚未生成 audio 标签，
			//故该元素无法获取。在 createView() 方法执行之后再缓存该属性才能正常工作。
			this.audio = this.element.find("audio");

			//以下两个方法都需要先正确获取 this.audio 元素之后才能正常工作。
			this.defaultEventBinding().eventListener();
			return this;
		},

		play: function () { 
			this.audio[0].play();
			this.isPlaying = true;
			this.audio.trigger("playerOnChanged");
		},

		pause: function () { 
			this.audio[0].pause();
			this.isPlaying = false;
			this.audio.trigger("playerOnChanged");
		},

		next: function () {
			if (this.currentTrack === this.playlist.length - 1) {
				if (this.loop === "false") {
					return false;
				} else if (this.loop === "all") {
					this.switchTrack(0);
				}
			} else {
				this.switchTrack(this.currentTrack + 1);
			}			
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
		},

		shuffle: function () {
			var self = this;
			//Fisher-Yates Shuffle Algorithm
			var k, t, l = self.playlist.length, tmp = {};
			if (l < 2) {
				return;
			}

			while (l) {
				k = Math.floor(Math.random() * l--);
				t = self.playlist[l];
				self.playlist[l] = self.playlist[k];
				self.playlist[k] = t;
				tmp[l] = k;
			}

			console.log(tmp);

			self.element.find(".mplayer-playlist").html("");
			self.playlist.forEach(function (item, index) {
				self.element.find(".mplayer-playlist")
					.append($("<li><a class='mplayer-song' href='javascript:;'>" + (index*1+1) +". "+ item+ "</a></li>"));	
			});
			//self.defaultEventBinding().switchTrack(0);
		},

		loadTrack: function () {

		},

		switchTrack: function (i) {
			var self = this;
			this.element
				.find(".mplayer-current").removeClass("mplayer-current").end()
				.find(".mplayer-song").eq(i).addClass("mplayer-current");
			this.audio.find("source").eq(0).attr("src", this.playlist[i]);
			this.audio[0].load();
			this.audio.on("canplay", function () {
				self.play();
				self.currentTrack = i;
			});
		},

		createView: function () {
			var MGUI = {};
			MGUI.mplayer = $("<div class='mplayer mplayer-" + this.index + "'></div>");
			MGUI.main = $("<div class='mplayer-main'></div>");
			MGUI.playlist = $("<div class='mplayer-playlist'></div>");
			MGUI.audio = $("<audio class='mplayer-audio'></audio>");
			MGUI.source = $("<source></source><source></source>");
			MGUI.controll = $("<div class='mplayer-control'></div>");
			MGUI.play = $("<span><a class='mplayer-btn-play' href='javascript:;'>PLAY</a></span>");
			MGUI.next = $("<span><a class='mplayer-btn-next' href='javascript:;'>NEXT</a></span>");
			MGUI.prev = $("<span><a class='mplayer-btn-prev' href='javascript:;'>PREV</a></span>");
			MGUI.loop = $("<span><a class='mplayer-btn-noloop' href='javascript:;'>LOOP</a></span>");
			MGUI.shuffle = $("<span><a class='mplayer-btn-shuffle' href='javascript:;'>SHUFFLE</a></span>");

			this.playlist.forEach(function (item, index, arr) {
				MGUI.playlist
					.append($("<li><a class='mplayer-song' href='javascript:;'>" + (index*1+1) +". "+ item+ "</a></li>"));
			});
			MGUI.audio.append(MGUI.source).find("source").eq(0).attr("src", this.playlist[0]);
			MGUI.controll
				.append(MGUI.play)
				.append(MGUI.next)
				.append(MGUI.prev)
				.append(MGUI.loop)
				.append(MGUI.shuffle);
			MGUI.main.append(MGUI.audio).append(MGUI.controll);
			this.element.append(MGUI.mplayer.append(MGUI.main).append(MGUI.playlist));

			return this;
		},

		defaultEventBinding: function () {
			var e = this.element,
				self = this;

			//使用事件委托，因为有些元素是经过脚本修改的，只有通过委托才能获取正确的元素。
			e.find(".mplayer-control").on("click", ".mplayer-btn-play", function () {
				self.switchTrack(self.currentTrack);
			}).on("click", ".mplayer-btn-pause", function () {
				self.pause();
			}).on("click", ".mplayer-btn-next", function () {
				self.next();
			}).on("click", ".mplayer-btn-prev", function () {
				self.prev();
			}).on("click", ".mplayer-btn-noloop", function () {
				self.loop = "single";
				$(this).removeClass("mplayer-btn-noloop").addClass("mplayer-btn-single").html("SINGLE");
			}).on("click", ".mplayer-btn-single", function () {
				self.loop = "all";
				$(this).removeClass("mplayer-btn-single").addClass("mplayer-btn-all").html("LOOP ALL");
			}).on("click", ".mplayer-btn-all", function () {
				self.loop = "false";
				$(this).removeClass("mplayer-btn-all").addClass("mplayer-btn-noloop").html("LOOP");
			}).on("click", ".mplayer-btn-shuffle", function () {
				self.shuffle();
			});

			e.find(".mplayer-song").each(function (index, item, arr) {
				$(item).on("click", function () {
					self.switchTrack(index);
				});
			});
			self.audio.on("play", function () {
				console.log("playing");
			}).on("pause", function () {
				console.log("pause");
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
					self.element.find(".mplayer-btn-play")
						.removeClass("mplayer-btn-play")
						.addClass("mplayer-btn-pause")
						.html("PAUSE");
				} else {
					self.element.find(".mplayer-btn-pause")
						.removeClass("mplayer-btn-pause")
						.addClass("mplayer-btn-play")
						.html("PLAY");				
				}
			});
		},
	};

	$.fn.Mplayer = function () {
		return new Mplayer(this);
	};
})(jQuery, window);
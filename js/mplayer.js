;(function ($, window, undefined) {
	var Mplayer = function (e) {
		this.Version = "0.1.0";
		this.element = e;
		this.playlist = [];
		this.currentTrack = 0;
		this.index = Mplayer.count++;
		this.loop = "false";
	};

	Mplayer.count = 0;

	Mplayer.prototype = {
		initialize: function (list) {
			var self = this;

			list.forEach(function (item, index) {
				self.playlist.push(item);
			});

			this.createView().defaultEventBinding();

			//缓存audio元素，并存储在每个实例中。方便读取
			//该属性不能直接在 $.Mplayer 里面定义是因为执行 $.Mplayer() 时尚未生成 audio 标签，
			//故该元素无法获取。在 createView() 方法执行之后再缓存该属性才能正常工作。
			this.audio = this.element.find("audio");

			return this;
		},

		play: function () { 
			this.audio[0].play();
		},

		pause: function () { 
			this.audio[0].pause();
		},

		next: function () {
			if (this.currentTrack === this.playlist.length - 1) {
				if (this.loop === "false") {
					return false;
				} else if (this.loop === "single") {
					this.switchTrack(this.currentTrack);
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
				} else if (this.loop === "single") {
					this.switchTrack(this.currentTrack);
				} else if (this.loop === "all") {
					this.switchTrack(this.playlist.length - 1);
				}
			} else {
				this.switchTrack(this.currentTrack -1);
			}
		},

		loadTrack: function () {

		},

		switchTrack: function (i) {
			var self = this;
			console.log(this.element.find(".mplayer-current"));
			this.element.find(".mplayer-current").removeClass("mplayer-current");
			console.log(this.element.find(".mplayer-current"));
			this.audio.find("source").eq(0).attr("src", this.playlist[i]);
			this.audio[0].load();
			this.audio.on("canplay", function () {
				self.play();
				self.currentTrack = i;
				$(self.element.find(".mplayer-song")[i]).addClass("mplayer-current");
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
			MGUI.pause = $("<span><a class='mplayer-btn-pause' href='javascript:;'>PAUSE</a></span>");
			MGUI.next = $("<span><a class='mplayer-btn-next' href='javascript:;'>NEXT</a></span>");
			MGUI.prev = $("<span><a class='mplayer-btn-prev' href='javascript:;'>PREV</a></span>");
			MGUI.loop = $("<span class='mplayer-btn-loop'><a class='mplayer-btn-noloop' href='javascript:;'>LOOP</a></span>");

			this.playlist.forEach(function (item, index, arr) {
				MGUI.playlist.append($("<li><a class='mplayer-song' href='javascript:;'>" + item+ "</a></li>"));
			});
			MGUI.audio.append(MGUI.source).find("source").eq(0).attr("src", this.playlist[0]);
			MGUI.controll
				.append(MGUI.play)
				.append(MGUI.pause)
				.append(MGUI.next)
				.append(MGUI.prev)
				.append(MGUI.loop);
			this.element.append(MGUI.mplayer.append(MGUI.main).append(MGUI.playlist));
			MGUI.main.append(MGUI.audio).append(MGUI.controll);

			return this;
		},

		defaultEventBinding: function () {
			var e = this.element,
				self = this;

			e.find(".mplayer-btn-play").on("click", function () {
				self.switchTrack(self.currentTrack);
			});

			e.find(".mplayer-btn-pause").on("click", function () {
				self.pause();
			});

			e.find(".mplayer-btn-next").on("click", function () {
				self.next();
			});

			e.find(".mplayer-btn-prev").on("click", function () {
				self.prev();
			});

			e.find(".mplayer-btn-loop").on("click", ".mplayer-btn-noloop", function () {
				self.loop = "single";
				$(this).removeClass("mplayer-btn-noloop").addClass("mplayer-btn-single").html("single");
			}).on("click", ".mplayer-btn-single", function () {
				self.loop = "all";
				$(this).removeClass("mplayer-btn-single").addClass("mplayer-btn-all").html("loop all");
			}).on("click", ".mplayer-btn-all", function () {
				self.loop = "false";
				$(this).removeClass("mplayer-btn-all").addClass("mplayer-btn-noloop").html("loop");
			});

			e.find(".mplayer-song").each(function (index, item, arr) {
				$(item).on("click", function () {
					self.switchTrack(index);
				});
			});

			$("audio").on("play", function () {
				console.log("playing");
			}).on("pause", function () {
				console.log("pause");
			});

			return this;
		}
	};

	$.fn.Mplayer = function () {
		return new Mplayer(this);
	};
})(jQuery, window);
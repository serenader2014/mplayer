;(function ($, window, undefined) {
	$.fn.Mplayer = function () {
		return new $.Mplayer(this);
	};

	$.Mplayer = function (e) {
		this.Version = "0.1.0";
		this.element = e;
		this.audio = this.element.find("audio");
		this.playlist = [];
		this.currentTrack = 0;
		this.count = $.Mplayer.count++;
	};

	$.Mplayer.count = 0;

	$.Mplayer.prototype = {
		initialize: function (list) {
			var self = this;

			list.forEach(function (item, index) {
				self.playlist.push(item);
			});

			this.createView();
			this.defaultEventBinding();
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
				return false;
			} else {
				this.currentTrack = this.currentTrack + 1;
				this.switchTrack(this.currentTrack);
			}
		},

		prev: function () {

		},

		loadTrack: function () {

		},

		switchTrack: function (i) {
			var self = this;
			this.audio.find("source").eq(0).attr("src", this.playlist[i]);
			this.audio[0].load();
			this.audio.on("canplay", function () {
				self.play();
			});
		},

		createView: function () {
			var MGUI = {};
			MGUI.mplayer = $("<div class='mplayer mplayer-" + this.count + "'></div>");
			MGUI.main = $("<div class='mplayer-main'></div>");
			MGUI.playlist = $("<div class='mplayer-playlist'></div>");
			MGUI.audio = $("<audio class='mplayer-audio'></audio>");
			MGUI.source = $("<source></source><source></source>");
			MGUI.controll = $("<div class='mplayer-controll'></div>");
			MGUI.play = $("<span><a class='mplayer-btn-play' href='javascript:;'>PLAY</a></span>");
			MGUI.pause = $("<span><a class='mplayer-btn-pause' href='javascript:;'>PAUSE</a></span>");
			MGUI.next = $("<span><a class='mplayer-btn-next' href='javascript:;'>NEXT</a></span>");
			MGUI.prev = $("<span><a class='mplayer-btn-prev' href='javascript:;'>PREV</a></span>");

			MGUI.audio.append(MGUI.source).find("source").eq(0).attr("src", this.playlist[0]);
			MGUI.controll.append(MGUI.play).append(MGUI.pause).append(MGUI.next).append(MGUI.prev);
			this.element.append(MGUI.mplayer.append(MGUI.main).append(MGUI.playlist));
			MGUI.main.append(MGUI.audio).append(MGUI.controll);

			return this;
		},

		defaultEventBinding: function () {
			var e = this.element,
				self = this;

			e.find(".mplayer-btn-play").on("click", function () {
				//self.play();
				console.log(self);
			});

			e.find(".mplayer-btn-pause").on("click", function () {
				self.pause();
			});
		}
	};
})(jQuery, window);
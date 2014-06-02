;(function($) {
	function Mplayer (element) {
		this.target = element;
		this.Version = "0.1.0";
		this.events = {};
		this.methods = {};
		this.playlist = {};
		this.currentTrack = 0;
		this.isPlaying = false;
		this.loop = 0;
	}

	Mplayer.extend = function (obj) {
		for (var i in obj) {
			this.prototype[i] = obj[i];
		}
	};

	Mplayer.fn = Mplayer.prototype;

	Mplayer.handleList = function (list, dist) {
		var finalList;

		if ($.isArray(list)) {
			finalList = [];
			list.forEach(function (item, index, array) {

				if (item.indexOf("http") !== -1) {
					finalList.push({
						title: item.substring(item.lastIndexOf("-") + 1, item.lastIndexOf(".")),
						artist: item.substring(item.lastIndexOf("/") + 1, item.lastIndexOf("-")),
						mp3: item.substring(0, item.lastIndexOf(".")) + ".mp3",
						ogg: item.substring(0, item.lastIndexOf(".")) + ".ogg",
						cover: item.substring(0, item.lastIndexOf(".")) + ".jpg"
					});

				} else {

					finalList.push({
						title: item.substring(item.indexOf("-") + 1, item.length),
						artist: item.substring(0, item.indexOf("-")),
						mp3: dist + item + ".mp3",
						ogg: dist + item + ".ogg",
						cover: dist + item + ".jpg"
					});

				}
			});
		} else {
			if (list.indexOf("http") !== -1) {
				finalList = {
					title: list.substring(list.lastIndexOf("-") + 1, list.lastIndexOf(".")),
					artist: list.substring(list.lastIndexOf("/") + 1, list.lastIndexOf("-")),
					mp3: list.substring(0, list.lastIndexOf(".")) + ".mp3",
					ogg: list.substring(0, list.lastIndexOf(".")) + ".ogg",
					cover: list.substring(0, list.lastIndexOf(".")) + ".jpg"
				};
			} else {
				finalList = {
					title: list.substring(list.indexOf("-") + 1, list.length),
					artist: list.substring(0, list.indexOf("-")),
					mp3: dist + list + ".mp3",
					ogg: dist + list + ".ogg",
					cover: dist + list + ".jpg"
				};
			}
		}

		return finalList;
	};

	Mplayer.eventHandler = function () {
		var event, target, optionalValue, arr;
		for (var i in this.events) {
			arr = i.split(" ");
			target = arr[0];
			event = arr[1];
			optionalValue = arr[2];
			$(target).on(event, optionalValue, this.methods[this.events[i]]);
		}
	};

	Mplayer.fn.initialize = function (list, isUerDefined, config) {
		var self = this;
		var $container,
			$main,
			$controllBtn,
			$playBtn,
			$pauseBtn,
			$nextBtn,
			$prevBtn,
			$shuffleBtn,
			$loopBtn,
			$audio,
			$playlist,
			playlist,
			fileDirectory = "audios/";
		// {
		// 	trackDetails: [
		// 	{
		// 		"title": "",
		// 		"artist": "",
		// 		"mp3": "",
		// 		"ogg": "",
		// 		"cover": ""
		// 	},
		// 	{
		// 		"title": "",
		// 		"artist": "",
		// 		"mp3": "",
		// 		"ogg": "",
		// 		"cover": ""
		// 	}
		// 	],
		// 	fileDirectory: "",
		// 	loop: "",
		// 	shuffle: "",
		// 	autoPlay: "",
		// 	...
		// }
		playlist  = this.playlist = Mplayer.handleList(list, fileDirectory);
		if (config) {
			if (config.trackDetails && $.isArray(config.trackDetails)) {
				config.trackDetails.forEach(function (item, index, array) {
					for (var i in item) {
						playlist[index][i] = self.playlist[index][i] = item[i];
					}
				});
			}

			if (config.fileDirectory) {
				fileDirectory = config.fileDirectory;
			}

			if (config.loop) {
				this.loop = config.loop;
			}

			if (config.shuffle) {
				this.shuffleList();
			}
		}


		if (isUerDefined === false) {
			$audio = $("<audio preload = 'true' class='mplayer-audio'></audio>");
			$audio.append("<source></source><source></source>");
			$container = $("<div class='mplayer'></div>");
			$main = $("<div class='mplayer-main'></div>");
			$controllBtn = $("<div class='mplayer-controll'></div>");
			$playBtn = $("<span><a class='mplayer-btn mplayer-btn-play'href='javascript:;'>Play</a></span>");
			$pauseBtn = $("<span><a class='mplayer-btn mplayer-btn-pause' href='javascript:;'>Pause</a></span>");
			$nextBtn = $("<span><a class='mplayer-btn mplayer-btn-next'href='javascript:;'>Next</a></span>");
			$prevBtn = $("<span><a class='mplayer-btn mplayer-btn-prev'href='javascript:;'>Prev</a></span>");
			$shuffleBtn = $("<span><a class='mplayer-btn mplayer-btn-shuffle' href='javascript:;'>Shuffle</a></span>");
			$loopBtn = $("<span><a class='mplayer-btn mplayer-btn-loop' href='javascript:;'>Loop</a></span>");
			$playlist = $("<div class='mplayer-playlist'></div>");

			$controllBtn.append($playBtn).append($pauseBtn).append($nextBtn).append($prevBtn).append($shuffleBtn).append($loopBtn);
			$container.append($main).append($playlist);
			$main.append($controllBtn);
			this.target.append($container);
		} else if (isUerDefined === true) {
			$container = this.target.find(".mplayer");
			$main = this.target.find(".mplayer-main");
			$controllBtn = this.target.find(".mplayer-controll");
			$playlist = this.target.find(".mplayer-playlist");
		}

		
		this.playlist.forEach(function (item, index, array) {
			$playlist.append("<li><a href='javascript:;'>" + index + ". " + item.artist + " - " + item.title + "</a></li>");
		});
		$main.append($audio);

		this.loadTrack(0, playlist);
		this.defaultEventBinding();

		delete $container,$main,$controllBtn,$playBtn,$pauseBtn,$nextBtn,$prevBtn,$audio,$playlist,playlist;
		
		return this;
	};

	Mplayer.fn.loadTrack = function (i, playlist) {
		var self = this,
			$audio = this.target.find("audio");
		$audio.find("source").eq(0).attr("src", playlist[i].mp3);
		$audio.find("source").eq(1).attr("src", playlist[i].ogg);

		$audio.on("ended", function () {
			self.next();
		});
	};

	Mplayer.fn.switchTrack = function () {
		var self = this,
			$audio = self.target.find("audio"),
			current = self.playlist[self.currentTrack];
		self.target.find("source").eq(0).attr("src", current.mp3);
		self.target.find("source").eq(1).attr("src", current.ogg);
		self.target.find("audio")[0].load();
		$audio.on("progress", function () {
			$audio.on("canplay", function () {
				self.play();
			});
		});

		return this;
	};

	Mplayer.fn.play = function () {
		this.target.find("audio")[0].play();
		this.isPlaying = true;
		console.log(this.loop);
		console.log(this.currentTrack);

		return this;
	};

	Mplayer.fn.pause = function () {
		this.target.find("audio")[0].pause();
		this.isPlaying = false;

		return this;
	};

	Mplayer.fn.next = function () {
		if (this.loop === 2) {
			this.switchTrack(this.currentTrack);
		} else {
			if (this.currentTrack >= this.playlist.length - 1) {
				if (this.loop === 0) return;
				if (this.loop === 1) {
					this.currentTrack = 0;
					this.switchTrack();
				}
			} else {
				this.currentTrack = this.currentTrack + 1;
				this.switchTrack(this.currentTrack);
			}
		}


		return this;
	};

	Mplayer.fn.prev = function () {
		if (this.loop === 2) {
			this.switchTrack(this.currentTrack);
		} else {
			if (this.currentTrack <= 0) {
				if (this.loop === 0) return;
				if (this.loop === 1) {
					this.currentTrack = this.playlist.length - 1;
					this.switchTrack();
				}
			} else {
				this.currentTrack = this.currentTrack - 1;
				this.switchTrack(this.currentTrack);
			}
		}

		return this;
	};

	Mplayer.fn.shuffleList = function () {
		var self = this;
		//Fisher-Yates Shuffle Algorithm
		var k, t, l = this.playlist.length;
		if (l < 2) {
			return;
		}

		while (l) {
			k = Math.floor(Math.random() * l--);
			t = this.playlist[l];
			this.playlist[l] = this.playlist[k];
			this.playlist[k] = t;
		}

		this.currentTrack = -1;
		this.target.find(".mplayer-playlist").html("");
		this.playlist.forEach(function (item, index, array) {
			self.target.find(".mplayer-playlist").append("<li><a href='javascript:;'>" + index + ". " + item.artist + " - " + item.title + "</a></li>");
		});
	};

	Mplayer.fn.loopTrack = function () {
		if (this.loop === 0) {
			this.loop = 1;
		} else if (this.loop === 1) {
			this.loop = 2;
		} else if (this.loop === 2) {
			this.loop = 0;
		}
	};


	Mplayer.fn.defaultEventBinding = function () {
		var self = this,
			t = this.target;

		t.find(".mplayer-btn-play").on("click", function () {
			self.play();
		});

		t.find(".mplayer-btn-pause").on("click", function () {
			self.pause();
		});

		t.find(".mplayer-btn-next").on("click", function () {
			self.next();
		});

		t.find(".mplayer-btn-prev").on("click", function () {
			self.prev();
		});

		t.find(".mplayer-btn-shuffle").on("click", function () {
			self.shuffleList();
		});

		t.find(".mplayer-btn-loop").on("click", function () {
			self.loopTrack();
		});
	};

	Mplayer.fn.extend = function (obj) {
		if (Object.prototype.toString.call(obj) === "[object Object]") {
			var extended = obj.extended;

			if (obj.events) {
				for (var i in obj.events) {
					this.events[i] = obj.events[i];
				}
			}

			if (obj.methods) {
				for (var i in obj.methods) {
					this.methods[i] = obj.methods[i];
				}
			}

			for (var i in obj) {
				this[i] = obj[i];
			}

			if (extended) {
				extended();
			}
		}

		return this;
	};


	$.extend({
		Mplayer: Mplayer
	});
})(jQuery);
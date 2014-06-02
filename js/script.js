(function($) {
	var p1 = new $.Mplayer($(".test1"));
	var p2 = new $.Mplayer($(".test2"));
	var p3 = new $.Mplayer($(".test3"));

	p2.initialize([
		"Jay Sean - What Happened To Us",
		"Jordan Pruitt - In Love For A Day",
		"Maroon 5 - Won't Go Home Without You",
		"Pixie Lott - When You Were My Man (Live At The Pool／2013)",
		"Queensberry - too young",

		], false, {
			trackDetails: [
			{
				title: "test title",
				artist: "damn",
			}
			]
		});
	p1.initialize([
		"Shontelle - Impossible",
		"Snow Patrol - Run - Revised Album Version",
		"The Vamps - Can We Dance",
		"Tynisha Keli - You & Me Against The World (Non-Album Track)",
		"李志 - 和你在一起",
		"猛虎巧克力 - 别让我孤单"
		], false);
})(jQuery);
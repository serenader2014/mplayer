var fs = require('fs');
var path = require('path');
var str = 'var playlist = [';
fs.readdir(path.join(__dirname, 'mp3'), function (err, files) {
	var arr = [];
	files.forEach(function (item) {
		if (path.extname(item) !== '.mp3') {return;}
		arr.push('"/mp3/' + item + '"');
	});
	str += arr.join(',\n') + '];';
	fs.writeFile(path.join(__dirname, 'scripts', 'playlist.js'), str, function (err) {
		if (err) {console.error(err);return;}
		console.log('done');
	});
});

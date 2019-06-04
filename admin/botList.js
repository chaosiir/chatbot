var fs = require('file-system');
var Bot = require('../bot/bot');

var bots = [];

fs.recurseSync('./bot/save', [
	'*.json'
], function(filepath, relative, filename) {
	if (filename) {
		//console.log(filepath+" : "+filename+" : "+relative );
		fs.readFile('./bot/save/'+filename, async (err, data) => {
			if (!err) {
				var info = JSON.parse(data);
				var bot = new Bot(info.name);
				bot.load().then(()=>{
					bots.push(bot)
				});
			}
		});
	}
});

module.exports = bots;
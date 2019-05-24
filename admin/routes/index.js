var express = require('express');
var router = express.Router();
const Bot = require('../../bot/bot');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/start', async (req, res, next) => {
	var name = req.query.name;
	var bot = new Bot(name);
	await bot.init(50000);
	res.send(bot.name + " has been created !!!");
});

module.exports = router;

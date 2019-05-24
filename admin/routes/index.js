var express = require('express');
var router = express.Router();
const startBot = require('../../bot/bin/server');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/start', (req, res, next)=>{
	var name = req.query.name;
	var bot = startBot(name, 50000);
});

module.exports = router;

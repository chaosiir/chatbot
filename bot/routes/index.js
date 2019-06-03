var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: req.app.locals.name});
});

router.options('/reply', function(req, res, next){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.send();
});

router.post('/reply', function(req, res, next) {
	console.log(req);
	// var msg = req.query.msg;
	// var user = req.query.user;
	// var answer=app.locals.brain.reply(user,msg);
	res.header("Access-Control-Allow-Origin", "*");
	res.send("Hello there ");
});



module.exports = router;

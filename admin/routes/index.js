var express = require('express');
var router = express.Router();
const Bot = require('../../bot/bot');
var botList = require('../botList');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});


router.post('/:name/start', async (req, res, next) => {
	var name = req.params.name;
	var flag = true;
	for (elt of botList){
		if(name===elt.name) {
			if(elt.status==="online"){
				res.send(name + " is already running !");
			}else{
				elt.startServer(50000);
				res.send(name + " has been turned on !!!");
			}
			flag = false;
			break;
		}
	}
	if(flag){
		var bot = new Bot(name);
		await bot.init(50000);
		botList.push(bot);
		res.send(bot.name + " has been created and turned on !!!");
	}

});

router.patch('/:name/brain', async (req, res, next) => {
	var name = req.params.name;
	var flag = true;

	for (elt of botList){
		if(name===elt.name) {

		}
	}
	if(flag){
	}
});

router.patch('/:name/stop', async (req, res, next) => {
	var name = req.params.name;
	var flag = true;

	for (elt of botList){
		if(name===elt.name) {
			if(elt.status==="offline"){
				res.send(name + " is already shut down !");
			}else {
				elt.stopServer();
				res.send(elt.name + " has been shut down !");
			}
			flag=false;
			break;
		}
	}
	if(flag){
		res.status(400).send('Ce n\'est pas le robot que vous recherchez');
	}
});

router.delete('/:name', async (req, res, next) => {
	var name = req.params.name;
	var flag = true;
	for (elt of botList){
		if(name===elt.name) {
			elt.stopServer();
			res.send(elt.name +" has been deleted !");
			botList= botList.filter(e => e !== elt);
			flag=false;
			break;
		}
	}
	if(flag){
		res.status(400).send('Ce n\'est pas le robot que vous recherchez');
	}
});

router.get('/status', (req, res, next) => {
	let status = [];
	for(bot of botList){
		status.push({
			"name":bot.name,
			"port":bot.port,
			"status":bot.status
		})
	}
	res.json(status);
});

module.exports = router;

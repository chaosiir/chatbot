var express = require('express');
var router = express.Router();
const Bot = require('../../bot/bot');
var botList = require('../botList');
const RiveScript = require('rivescript');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express'});
});

//!!!!!! pre condition : deux chatbot ne peuvent pas avoir le meme nom
router.post('/:name/start', async (req, res, next) => {
	var name = req.params.name;
	var flag = true;
	var portUsed = [];
	for (elt of botList){
		if(name===elt.name) {
			if(elt.status==="online"){ //already exist and already online
				res.send(name + " is already running ! (listening on port "+elt.port+")\n");
			}else{ //already exist but offline
				elt.startServer(elt.port);
				res.send(name + " has been turned on !!! (listening on port "+elt.port+")\n");
			}
			flag = false;
		}
		portUsed.push(elt.port);
	}
	if(flag){ //new bot
		var bot = new Bot(name);
		var port = Math.max(...portUsed) + 1;
		await bot.startNew(port);
		botList.push(bot);
		res.send(bot.name + " has been created and turned on !!! (listening on port "+bot.port+")\n");
	}
});


router.put('/:name/addbrain/:brain', async (req, res, next) => {
	let name = req.params.name;
	let brain= req.params.brain;
	for (elt of botList){
		if(name===elt.name) {
			try {
				elt.addBrain(brain);
				res.send(name +" brain has been added\n")
			}catch (e) {
				res.send(e)
			}
		}
	}
});


router.put('/:name/newbrain/:brain', async (req, res, next) => {
	let name = req.params.name;
	let brain= req.params.brain;
	for (elt of botList) {
		if (name === elt.name) {
			elt.changeBrain(brain).then(() => {
				res.send(name + " brain has been changed\n")
			}).catch((err) => {
				res.send(err)
			})
		}
	}
});


router.patch('/:name/stop', async (req, res, next) => {
	var name = req.params.name;
	var flag = true;
	for (elt of botList){
		if(name===elt.name) {
			if(elt.status==="offline"){
				res.send(name + " is already shut down !\n");
			}else {
				elt.stopServer();
				res.send(elt.name + " has been shut down !\n");
			}
			flag=false;
			break;
		}
	}
	if(flag){ //bot "name" doesn't exist
		res.status(400).send('Ce n\'est pas le robot que vous recherchez\n');
	}
});


router.delete('/:name', async (req, res, next) => {
	var name = req.params.name;
	var flag = true;
	for (elt of botList){
		if(name===elt.name) {
			elt.stopServer();
			res.send(elt.name +" has been deleted !\n");
			botList= botList.filter(e => e !== elt);
			const fs = require('fs');
			fs.unlink("./bot/save/"+elt.name+".json", (err) => {
				if (err) console.error(err);
				console.log('./bot/save/"+elt.name+".json was deleted');
			});
			flag=false;
			break;
		}
	}
	if(flag){ //bot "name" doesn't exist
		res.status(400).send('Ce n\'est pas le robot que vous recherchez\n');
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

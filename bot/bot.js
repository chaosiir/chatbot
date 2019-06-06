const RiveScript = require('rivescript');
const fs = require('fs');
const express = require('express');

class Bot{
	constructor(name) {
		this.name = name;
		this.brain = new RiveScript();
		this.status="offline";
		this.app = require('./app')(express());
		this.app.locals.brain = this.brain;
		this.app.locals.name = this.name;
		this.files = [];
		this.clients = {};
	}

	async connectToDiscord(botName){
		if(this.clients[botName]!==undefined){
			console.log(botName+" already connected");
		}else{
			const Discord = require('discord.js');
			const client = new Discord.Client();
			fs.readFile("./bot/token.json" , (err, data) => {
				if (err) console.log(err);
				const token = JSON.parse(data);
				console.log(token);
				if(token[botName]!==undefined) {
					client.on('ready', () => {
						console.log(`Logged in as ${client.user.tag}!`);
						this.load();
						this.clients[botName] = client;
					});

					client.on('message', msg => {
						if (msg.isMemberMentioned(client.user) ) { // à voir si c'est pas .tag ou .id ou .username ou .avatar
							console.log(msg.cleanContent);
							let cleanmsg=msg.cleanContent.trim().split("@"+botName).join('');
							this.brain.reply(msg.author.username, cleanmsg).then(reply => msg.reply(reply)).catch(err => console.error(err));
						}
					});
					client.login(token[botName]);
				}
				else {
					console.log("undefined Discord bot")
				}
			});

		}
	}
	async disconnectFromDiscord(botName){
		if(this.clients[botName]===undefined){
			console.log(botName+" already disconnected");
		}else{
		    this.save();
			this.clients[botName].destroy();//exterminate
			delete this.clients[botName];
		}
	}

	async startNew(port){
	    this.addBrain("default");
	    await this.findPort(port);
		this.startServer();
	}

	async stopServer(){
		if(this.server!=null && this.status!=="offline"){
			this.brain = this.app.locals.brain;
			this.server.close();
			this.status="offline";
			this.save();
		}
	}

	addBrain(filename){
		this.brain = this.app.locals.brain;
		this.brain.loadFile("./bot/brain/"+filename+".rive").then(()=>{
			this.files.push("./bot/brain/"+filename+".rive");
			this.brain.sortReplies()
		}).catch(()=>console.log("file not found"));
	}

	async changeBrain(filename){
		var uservars = await this.getUservars();
		console.log(uservars);
		this.brain = new RiveScript();
		this.files = [];
		var currentBrain=this.brain;
		var bot=this;
		console.log(this.brain===currentBrain);
		return new Promise(((resolve, reject) => {
			currentBrain.loadFile("./bot/brain/"+filename+".rive").then(function(){
				currentBrain.sortReplies();
				bot.files.push("./bot/brain/"+filename+".rive");

				for(let user of Object.keys(uservars)){
					currentBrain.setUservars(user, uservars[user]);
				}
				bot.app.locals.brain = currentBrain;
				resolve(true);
			})/*.catch(()=>
				reject("File "+filename+".rive not found\n");
			});*/
		}));
	}

	async load(){
		fs.readFile('./bot/save/'+this.name+'.json', (err, data) => {
			if (err) console.log(err);
			var save = JSON.parse(data);
			//console.log(save);
			this.port=save.port;
			this.brain=new RiveScript();
			let bot=this;
			return new Promise(((resolve, reject) => {
				bot.brain.loadFile(save.files).then(function(){
					bot.brain.sortReplies();
					bot.files=save.files;
					for(let user of Object.keys(save.uservars)){
						bot.brain.setUservars(user, save.uservars[user]);
					}
					bot.app.locals.brain = bot.brain;
					resolve(true);
				}).catch((err)=>{
					console.log(err);
					reject(err);
				})
			}));
		});
	}

	save(){
		this.getUservars().then((uservars)=>{
			let save = {
				name: this.name,
				port: this.port,
				files: this.files,
				uservars: uservars
			};
			let data = JSON.stringify(save, null, 2);
			fs.writeFileSync('./bot/save/'+this.name+'.json', data);

		});
	}

	async getUservars(){
		return this.brain.getUservars();
	}

	async findPort(defaultPort){
		this.port = await normalizePort(process.env.PORT || defaultPort);
		this.app.set('port', this.port);

		/**
		 * Normalize a port into a number, string, or false.
		 */
		async function normalizePort(val) {
			const checkPort = require('tcp-port-used');
			var port = parseInt(val, 10);

			if (isNaN(port)) {
				// named pipe
				return val;
			}

			if (port >= 0) {
				// port number
				var used = await checkPort.check(port);
				while (used) {
					port += 1;
					used = await checkPort.check(port);
				}
				return port;
			}
			return false;
		}
	}

	async startServer(){
		/**
		 * Module dependencies.
		 */
		var debug = require('debug')('chatbot:server');
		var http = require('http');

		/**
		 * Create HTTP server.
		 */
		var server = http.createServer(this.app);

		/**
		 * Listen on provided port, on all network interfaces.
		 */
		server.listen(this.port);
		server.on('error', onError);
		server.on('listening', onListening);

		/**
		 * Event listener for HTTP server "error" event.
		 */
		function onError(error) {
			if (error.syscall !== 'listen') {
				throw error;
			}

			var bind = typeof this.port === 'string'
				? 'Pipe ' + this.port
				: 'Port ' + this.port;

			// handle specific listen errors with friendly messages
			switch (error.code) {
				case 'EACCES':
					console.error(bind + ' requires elevated privileges');
					process.exit(1);
					break;
				case 'EADDRINUSE':
					console.error(bind + ' is already in use');
					process.exit(1);
					break;
				default:
					throw error;
			}
		}

		var name = this.name;
		/**
		 * Event listener for HTTP server "listening" event.
		 */
		function onListening() {
			var addr = server.address();
			var bind = typeof addr === 'string'
				? 'pipe ' + addr
				: 'port ' + addr.port;
			debug('Bot '+ name +' listening on ' + bind);
		}

		this.status = "online";
		this.server = server;
	}
}


module.exports = Bot;
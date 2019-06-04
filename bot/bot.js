const RiveScript = require('rivescript');
const fs = require('file-system');
const express = require('express');

class Bot{//le despot
//NTgyNTY0NjM0MDU4NDI0MzIx.XOvqag.pkbJ7A_H17Bfvn-QyA0Nb6bEdDI
	constructor(name) {
		this.name = name;
		this.brain = new RiveScript();
		this.status="offline";
		this.app = require('./app')(express());
		this.app.locals.brain = this.brain;
		this.app.locals.name = this.name;
		this.files = [];
	}

	async startNew(port){
	    this.addBrain("default");
		this.startServer(port);
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
			this.files.push(filename);
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
				bot.files.push(filename);
				//TODO (y compris fichier)
				// TODO mettre sur discord
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

	load(){
		fs.readFile('./bot./save/'+this.name+'.json', (err, data) => {
			if (err)
			var save = JSON.parse(data);
			console.log(save);
			this.port=save.port;
			this.brain=new RiveScript();
			this.brain.load(save.files)
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

	async startServer(portNum){
		/**
		 * Module dependencies.
		 */
		var debug = require('debug')('chatbot:server');
		var http = require('http');

		//todo: peut être redondant
		this.app.locals.brain = this.brain;
		this.app.locals.name = this.name;

		/**
		 * Get port from environment and store in Express.
		 */


		if(this.port===null) this.port = await normalizePort(process.env.PORT || portNum);
		this.app.set('port', this.port);

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
				while(used){
					port+=1;
					used = await checkPort.check(port);
				}
				return port;
			}

			return false;
		}

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
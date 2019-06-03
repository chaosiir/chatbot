const RiveScript = require('rivescript');

class Bot{//le despot
//NTgyNTY0NjM0MDU4NDI0MzIx.XOvqag.pkbJ7A_H17Bfvn-QyA0Nb6bEdDI
	constructor(name) {
		this.name = name;
		this.brain = new RiveScript();
		this.status="offline";
		this.app = require('./app');
		this.app.locals.brain = this.brain;
	}

	async init( port){
	    this.addBrain("default");
		this.startServer(port);
		this.status="online";
	}

	async stopServer(){
		if(this.server!=null && this.status!=="offline"){
			this.server.close();
			this.status="offline";
		}
	}

	addBrain(filename){
		this.brain = this.app.locals.brain;
		this.brain.loadFile("./bot/brain/"+filename+".rive").then(()=>this.brain.sortReplies());
	}

	async changeBrain(filename){
		var uservars = this.stop();
		console.log(uservars);
		this.brain = new RiveScript();
		var currentBrain=this.brain;
		console.log(this.brain===currentBrain);
		return new Promise(((resolve, reject) => {
			currentBrain.loadFile("./bot/brain/"+filename+".rive").then(function(){
				currentBrain.sortReplies();
				//todo : load and save uservars + mettre sur discord
				/*for(user of uservars){
					currentBrain.setUservars(user.name, user.data);
				}*/
				var app = require('./app');
				app.locals.brain = currentBrain;
				resolve(true);
			})/*.catch(()=>{
				reject("File "+filename+".rive not found\n");
			});*/
		}));
	}

	stop(){
		this.brain.getUservars().then(value => {
			return value
		});
	}

	async startServer(portNum){
		/**
		 * Module dependencies.
		 */

		var app = require('./app');
		var debug = require('debug')('chatbot:server');
		var http = require('http');

		app.locals.brain = this.brain;
		app.locals.name = this.name;

		/**
		 * Get port from environment and store in Express.
		 */

		this.port = await normalizePort(process.env.PORT || portNum);
		app.set('port', this.port);

		/**
		 * Create HTTP server.
		 */

		var server = http.createServer(app);

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

		this.server = server;
	}
}


module.exports = Bot;
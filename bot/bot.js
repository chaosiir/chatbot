const RiveScript = require('rivescript');

class Bot{//le despot

	constructor(name) {
		this.name = name;
		this.bot = new RiveScript();
	}

	async init( port){
		this.bot.loadFile("./bot/brain/default.rive");
		this.startServer(port);
		this.bot.sortReplies();
	}



	async startServer(portNum){
		/**
		 * Module dependencies.
		 */

		var app = require('./app');
		var debug = require('debug')('chatbot:server');
		var http = require('http');


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

		/**
		 * Event listener for HTTP server "listening" event.
		 */
		function onListening() {
			var addr = server.address();
			var bind = typeof addr === 'string'
				? 'pipe ' + addr
				: 'port ' + addr.port;
			debug('Bot '+ this.name +' listening on ' + bind);
		}

		this.server = server;
	}
}


module.exports = Bot;
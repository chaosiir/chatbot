

const startBot = function (name, portNum) {

	var port = normalizePort(process.env.PORT || portNum);

	/**
	 * Normalize a port into a number, string, or false.
	 */

	function normalizePort(val) {
		var port = parseInt(val, 10);

		if (isNaN(port)) {
			// named pipe
			return val;
		}

		if (port >= 0) {
			// port number
			return port;
		}

		return false;
	}


	/**
	 * Event listener for HTTP server "listening" event.
	 */

	function onListening() {
		var addr = server.address();
		var bind = typeof addr === 'string'
			? 'pipe ' + addr
			: 'port ' + addr.port;
		debug('Bot '+ app.botName +' listening on ' + bind);
	}

	return {"name":name, "server":server, "port":port};
};


module.exports = startBot;

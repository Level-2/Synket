const spawn = require('child_process').spawn;

const net = require('net');

class Operations {
	start(sockdef, module) {

		var tries = 0;
		var int = setInterval(function() {
			var socket = net.connect(sockdef, function(one, two) {
			  	clearInterval(int);
    		 	process.exit();
    		
  			});

			socket.once('error', function() {
				//On the first try, start the server
				//Then keep trying to connect until it's up
				if (tries == 0) {
					spawn('node', [__dirname + '/Server.js', JSON.stringify(sockdef), module], {
						detached: true
					}).unref();
				
				}
				tries++;
			});

			if (tries > 1000) {
				console.log('Could not connect to socket');
				clearInterval(int);
    		 	process.exit();
			}
		}, 1);		
	}
	// {url,port}
	send(socket_param, data) {
		var socket = net.connect(socket_param, function() {
			socket.write(data);

			socket.on('data', function(data) {
				console.log(new Buffer(data).toString());
				process.exit();
			})
		});
	}
}


var ops = new Operations();

if (process.argv[3]) {
	var args =  JSON.parse(process.argv[3]).args;
}
else args = [];

ops[process.argv[2]].apply(ops, args);

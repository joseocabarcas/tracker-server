var net = require('net');

var client = new net.Socket();
client.connect(8090, '127.0.0.1', function() {
	console.log('Connected');
	client.write('##,imei:359586015829802,A;');
});

client.on('data', function(data) {
	console.log('Received: ' + data);
	if (data == "LOAD") {
		client.write('359586015829802');
		//return
	} else if (data == "ON") {
		client.write('imei:359587010124900,tracker,0809231929,13554900601,F,112909.397,A,2234.4669,N,11354.3287,E,0.11,;');
		//return	
		
	} else {
		client.destroy(); // kill client after server's response
	}
});

client.on('end', function() {
	console.log('Connection end');
});

client.on('close', function() {
	console.log('Connection closed');
});
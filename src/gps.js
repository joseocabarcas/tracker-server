const EventEmitter = require('events');

export default class GPS extends EventEmitter {
	constructor(adapter, connection, gpsServer) {
		super()
		this.connection = connection;
		this.server = gpsServer;
		this.uid = false;
		this.ip = connection.ip;
		this.port = connection.port;
		this.name = false;
		this.loged = false;
		this.adapter = new adapter(this);

		this.on('data', (data) => {
			var msgParts = this.adapter.parseData(data);
		})
	}

	// methods
	send(msg) {
		this.emit('send_data', msg);
		this.connection.write(msg);
	};

	makeAction() {}
}
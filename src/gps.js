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

			this.makeAction(msgParts.action, msgParts.message)
		})
	}

	// methods
	send(msg) {
		this.emit('send_data', msg);
		this.connection.write(msg);
	};

	makeAction(action, msg) {
		switch(action) {
			case 'login':
				this.adapter.sendOk("LOAD");
				break;
			case 'online':
				this.adapter.sendOk("ON");
				break;
			case 'location':
				break;
			case 'alert':
				break;
			case 'response':
				break;
			default: break;
		}
	}
}
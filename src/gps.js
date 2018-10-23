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
		this.authenticated = false;
		this.deviceId = null;
		this.adapter = new adapter(this);

		this.on('data', (data) => {
			var msgParts = this.adapter.parseData(data);
			this.deviceId = msgParts.device_id;
			this.makeAction(msgParts.action, msgParts.data)
		})
	}

	// methods
	send(msg) {
		this.emit('send_data', msg);
		this.connection.write(msg);
	};

	makeAction(action, msg) {
		// console.log('autenticado', this.authenticated)
		if (!this.authenticated && action !== 'login') {
			console.log('No autenticado')
			return false;
		}
		// console.log(msg)
		switch(action) {
			case 'login':
				this.login(msg);
				break;
			case 'online':
				this.online(msg);
				break;
			case 'location':
				this.setLocation(msg);
				break;
			case 'alert':
				this.setAlert(msg);
				break;
			case 'response':
				break;
			default:
				this.adapter.doLog(msg);
				break;
		}
	}

	// Login
	login(msg) {
		// console.log('logueame');
		let deviceId = this.deviceId.split(':')[1]
		this.emit('login', deviceId, msg);
	}

	loginAuthorize(authorized, msg) {
		if (authorized) {
			console.log('GPS autorizado', this.deviceId);
			this.authenticated = true;
			this.adapter.authorize(msg);
		} else {
			console.log('GPS no autorizado', this.deviceId);
		}
	}

	// Online
	online(msg) {
		this.adapter.sendOk("ON");
	}

	setLocation(msg) {
		this.adapter.setLocation(msg);
		this.emit('location', this.deviceId, msg);
	}

	setAlert() {
		this.adapter.setAlert(msg);
		this.emit('alert', this.deviceId, msg);
	}
}
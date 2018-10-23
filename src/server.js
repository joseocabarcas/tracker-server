const EventEmitter = require('events');
const net = require('net');
//const GPS = require('./gps');
import GPS from './gps';
import TK303G from './types/tk303g';
// const TK303G = require('./types/tk303g');

export default class Server extends EventEmitter {
	constructor(opts, cb) {
		super()
		this.defaults = {
			port: 8090,
		}
		this.opts = Object.assign(this.defaults, opts)
		this.devices = [];
		this.server = false;
		this.cb = cb
		this.init(() => {
			this.server = net.createServer((connection) => {
				console.log('alguien se conecto');
				// Listening
				connection.device = new GPS(TK303G, connection, this)
				this.devices.push(connection);

				//Once we receive data...
				connection.on('data', function (data) {
					console.log('data')
					connection.device.emit('data', data);
				});

				// Remove the device from the list when it leaves
				connection.on('end', () => {
					console.log('end')
					this.devices.splice(this.devices.indexOf(connection), 1);
					connection.device.emit('disconnected');
				});


				connection.on('error', (error) => {
					console.log('error')	
					console.log(error);
				});

				connection.on('close', (close) => {
					console.log('close')	
					console.log(close);
					this.devices.splice(this.devices.indexOf(connection), 1);
					connection.device.emit('disconnected');
				});

				this.cb(connection.device, connection);

				connection.device.emit('connected');
			}).listen(this.opts.port)
		})
	}

	// methods
	init(cb) {
		this.emit('before_init');
		if (typeof cb === 'function') cb();
		this.emit('init');
		/* FINAL INIT MESSAGE */
    	console.log('\n=================================================\nGPS LISTENER running at port ' + this.opts.port);
	}

	/* Search a device by ID */
	find_device(deviceId) {
		for (var i in this.devices) {
			var dev = this.devices[i].device;
			if (dev.uid === deviceId) {
				return dev;
			}
		}

		return false;
	};

	/* SEND A MESSAGE TO DEVICE ID X */
	send_to(deviceId, msg) {
		var dev = this.find_device(deviceId);
		dev.send(msg);
	};
};
export default class TK303G {
	constructor(device) {
		//super()
		this.device = device;
	}

	// methods
	parseData(data) {
		data = data.toString();
		console.log(data);

		let parts = {
			"device_id": "",
			"status": "",
			"action": "",
			"data": "",
		}

		if (data.includes("##")) {
			//this.sendLoad()
			// ##,imei:123456789012345,A;
			const keys = ['code', 'imei', 'status'];
			const values = data.split(',');
			const stats = keys.map((key, index) => {
				return [key, values[index]];
			});
			// console.log(new Map(stats));
			const mapStats = new Map(stats);

			parts.action = "login"
			parts.data = data
			parts.device_id = mapStats.get('imei')
			parts.status = "LOAD"
		}

		if (data.length == 15) {
			//this.sendOn()
			parts.action = "online"
			parts.data = data
			parts.device_id = data
			parts.status = "ON"
		}

		if (data.length > 26) {
			// imei:353451044508750,
			// 001,
			// 0809231929,
			// ,
			// F,
			// 055403.000,
			// A,
			// 2233.1870,
			// N,
			// 11354.3067,
			// E,
			// 0.00,
			// ,
			// ;
			const keys = ['imei', 'status', 'time', 'empty', 'a2', 'b1', 'b2', 'c1', 'c2', 'd1', 'd2', 'speed']
			const values = data.split(',')
			const stats = keys.map((key, index) => {
				return [key, values[index]];
			});

			// console.log(new Map(stats));
			const mapStats = new Map(stats);
			// this.sendCommand(mapStats.get('imei'));
			// 
			parts.data = mapStats;
			parts.device_id = mapStats.get('imei');

			switch(mapStats.get('status')) {
				case '001': 
					parts.action = "location";
					break;
				case 'tracker': 
					parts.action = "location";
					break;
				case 'help me', 'sensor alarm':
					parts.action = "alert";
					parts.status = mapStats.get('status')
					break;
				default:
					parts.action = "other";
					parts.status = mapStats.get('status')
					break;
			}
		}
		return parts
	}

	sendOk(msg) {
		this.device.send(msg);
	}

	sendCommand(imei){
		var msg = `**,${imei},B`;
		console.log(msg)
		this.device.send(msg);
		//var msg = "**,imei:359586018966098,B";
		//this.device.send(msg);
	}

	generateCommand(imei, cmd) {}

	authorize(data) {
		this.sendOk("LOAD");
	}

	doLog(value) {
		console.log(value);
	}

	setLocation(data) {
		// console.log('location', data);	
	}

}

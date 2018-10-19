export default class TK303G {
	constructor(device) {
		//super()
		this.device = device;
	}

	// methods
	parseData(data) {
		data = data.toString();
		console.log(data);

		if (data.includes("##")) {
			this.sendLoad()
		}

		if (data.length == 15) {
			this.sendOn()
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

			console.log(new Map(stats));
			const mapStats = new Map(stats);
			this.sendCommand(mapStats.get('imei'))
		}
		return data
	}

	sendLoad() {
		var msg = "LOAD";
		this.device.send(msg);
	}

	sendOn() {
		var msg = "ON";
		this.device.send(msg);
	}

	sendCommand(imei){
		// var msg = `**,${imei},B`;
		// console.log(msg)
		// this.device.send(msg);
		var msg = "**,imei:359586018966098,B";
		this.device.send(msg);
	}

	generateCommand(imei, cmd) {}

}

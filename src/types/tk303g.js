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
			console.log(new Map(stats));
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

			console.log(new Map(stats));
			const mapStats = new Map(stats);
			this.sendCommand(mapStats.get('imei'));

			switch(mapStats.get('status')) {
				case '001': 
					parts.action = "location";
					break;
				case 'tracker': 
					parts.action = "location";
					break;
				case 'help me':
					parts.action = "alert";
					parts.status = mapStats.get('status')
					break;
				case 'low battery':
					parts.action = "alert";
					parts.status = mapStats.get('status')
					break;
				case 'move':
					parts.action = "alert";
					parts.status = mapStats.get('status')
					break;
				case 'speed':
					parts.action = "alert";
					parts.status = mapStats.get('status')
					break;
				case 'stockdate':
					parts.action = "alert";
					parts.status = mapStats.get('status')
					break;
				case 'ac alarm':
					parts.action = "alert";
					parts.status = mapStats.get('status')
					break;
				case 'door alarm':
					parts.action = "alert";
					parts.status = mapStats.get('status')
					break;
				case 'sensor alarm':
					parts.action = "alert";
					parts.status = mapStats.get('status')
					break;
				case 'acc alarm':
					parts.action = "alert";
					parts.status = mapStats.get('status')
					break;
				case 'accident alarm':
					parts.action = "alert";
					parts.status = mapStats.get('status')
					break;
				case 'bonnet alarm':
					parts.action = "alert";
					parts.status = mapStats.get('status')
					break;
				case 'footbrake alarm':
					parts.action = "alert";
					parts.status = mapStats.get('status')
					break;
				case 'T:':
					parts.action = "alert";
					parts.status = mapStats.get('status')
					break;
				case 'oil':
					parts.action = "alert";
					parts.status = mapStats.get('status')
					break;
				case 'DTC P0001':
					parts.action = "alert";
					parts.status = mapStats.get('status')
					break;
				case 'service':
					parts.action = "alert";
					parts.status = mapStats.get('status')
					break;
				case '102':
					parts.action = "response";
					parts.status = mapStats.get('status')
					break;
				case '103':
					parts.action = "response";
					parts.status = mapStats.get('status')
					break;
				case '104':
					parts.action = "response";
					parts.status = mapStats.get('status')
					break;
				case '105':
					parts.action = "response";
					parts.status = mapStats.get('status')
					break;
				case '106':
					parts.action = "response";
					parts.status = mapStats.get('status')
					break;
				case '107':
					parts.action = "response";
					parts.status = mapStats.get('status')
					break;
				case '108':
					parts.action = "response";
					parts.status = mapStats.get('status')
					break;
				case '109':
					parts.action = "response";
					parts.status = mapStats.get('status')
					break;
				case '110':
					parts.action = "response";
					parts.status = mapStats.get('status')
					break;
				case '111':
					parts.action = "response";
					parts.status = mapStats.get('status')
					break;
				case '112':
					parts.action = "response";
					parts.status = mapStats.get('status')
					break;
				case '113':
					parts.action = "response";
					parts.status = mapStats.get('status')
					break;
				case '114':
					parts.action = "response";
					parts.status = mapStats.get('status')
					break;
				case '115':
					parts.action = "response";
					parts.status = mapStats.get('status')
					break;
				case '116':
					parts.action = "response";
					parts.status = mapStats.get('status')
					break;
				case '117':
					parts.action = "response";
					parts.status = mapStats.get('status')
					break;
				case '118':
					parts.action = "response";
					parts.status = mapStats.get('status')
					break;
				case '119':
					parts.action = "response";
					parts.status = mapStats.get('status')
					break;
				case '120':
					parts.action = "response";
					parts.status = mapStats.get('status')
					break;
				case '121':
					parts.action = "response";
					parts.status = mapStats.get('status')
					break;
				case '122':
					parts.action = "response";
					parts.status = mapStats.get('status')
					break;
				case '150':
					parts.action = "response";
					parts.status = mapStats.get('status')
					break;
				case '151':
					parts.action = "response";
					parts.status = mapStats.get('status')
					break;
				case '152':
					parts.action = "response";
					parts.status = mapStats.get('status')
					break;
				default: break;
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

	authorize() {}

}

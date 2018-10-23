var gps = require('../lib/tracker-server');

var options = {
  port: 8090,
}

var server = new gps(options, function (device, connection) {
  console.log('connecting')
  //console.log(device)
  device.on('login', function(deviceId, msg) {
  	console.log('Device Id: ', deviceId);
  	this.loginAuthorize(true, msg);
  })

  device.on('location', function(deviceId, msg) {
  	console.log('Location', msg)
  });

  device.on('alert', function(deviceId, msg) {
  	console.log('Alert', msg)
  });
});

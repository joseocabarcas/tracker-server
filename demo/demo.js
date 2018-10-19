var gps = require('../lib/tracker-view');

var options = {
  port: 8090,
}

var server = new gps(options, function (device, connection) {
  console.log('connecting')
  //console.log(connection)
});

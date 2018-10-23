(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("tracker-server", [], factory);
	else if(typeof exports === 'object')
		exports["tracker-server"] = factory();
	else
		root["tracker-server"] = factory();
})(global, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/gps.js":
/*!********************!*\
  !*** ./src/gps.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return GPS; });
const EventEmitter = __webpack_require__(/*! events */ "events");

class GPS extends EventEmitter {
  constructor(adapter, connection, gpsServer) {
    super();
    this.connection = connection;
    this.server = gpsServer;
    this.uid = false;
    this.ip = connection.ip;
    this.port = connection.port;
    this.name = false;
    this.authenticated = false;
    this.deviceId = null;
    this.adapter = new adapter(this);
    this.on('data', data => {
      var msgParts = this.adapter.parseData(data);
      this.deviceId = msgParts.device_id;
      this.makeAction(msgParts.action, msgParts.data);
    });
  } // methods


  send(msg) {
    this.emit('send_data', msg);
    this.connection.write(msg);
  }

  makeAction(action, msg) {
    // console.log('autenticado', this.authenticated)
    if (!this.authenticated && action !== 'login') {
      console.log('No autenticado');
      return false;
    } // console.log(msg)


    switch (action) {
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
  } // Login


  login(msg) {
    // console.log('logueame');
    let deviceId = this.deviceId.split(':')[1];
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
  } // Online


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

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./server */ "./src/server.js").default;

/***/ }),

/***/ "./src/server.js":
/*!***********************!*\
  !*** ./src/server.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Server; });
/* harmony import */ var _gps__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gps */ "./src/gps.js");
/* harmony import */ var _types_tk303g__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types/tk303g */ "./src/types/tk303g.js");
const EventEmitter = __webpack_require__(/*! events */ "events");

const net = __webpack_require__(/*! net */ "net"); //const GPS = require('./gps');



 // const TK303G = require('./types/tk303g');

class Server extends EventEmitter {
  constructor(opts, cb) {
    super();
    this.defaults = {
      port: 8090
    };
    this.opts = Object.assign(this.defaults, opts);
    this.devices = [];
    this.server = false;
    this.cb = cb;
    this.init(() => {
      this.server = net.createServer(connection => {
        console.log('alguien se conecto'); // Listening

        connection.device = new _gps__WEBPACK_IMPORTED_MODULE_0__["default"](_types_tk303g__WEBPACK_IMPORTED_MODULE_1__["default"], connection, this);
        this.devices.push(connection); //Once we receive data...

        connection.on('data', function (data) {
          console.log('data');
          connection.device.emit('data', data);
        }); // Remove the device from the list when it leaves

        connection.on('end', () => {
          console.log('end');
          this.devices.splice(this.devices.indexOf(connection), 1);
          connection.device.emit('disconnected');
        });
        connection.on('error', error => {
          console.log('error');
          console.log(error);
        });
        connection.on('close', close => {
          console.log('close');
          console.log(close);
          this.devices.splice(this.devices.indexOf(connection), 1);
          connection.device.emit('disconnected');
        });
        this.cb(connection.device, connection);
        connection.device.emit('connected');
      }).listen(this.opts.port);
    });
  } // methods


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
  }

  /* SEND A MESSAGE TO DEVICE ID X */
  send_to(deviceId, msg) {
    var dev = this.find_device(deviceId);
    dev.send(msg);
  }

}
;

/***/ }),

/***/ "./src/types/tk303g.js":
/*!*****************************!*\
  !*** ./src/types/tk303g.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return TK303G; });
class TK303G {
  constructor(device) {
    //super()
    this.device = device;
  } // methods


  parseData(data) {
    data = data.toString();
    console.log(data);
    let parts = {
      "device_id": "",
      "status": "",
      "action": "",
      "data": ""
    };

    if (data.includes("##")) {
      //this.sendLoad()
      // ##,imei:123456789012345,A;
      const keys = ['code', 'imei', 'status'];
      const values = data.split(',');
      const stats = keys.map((key, index) => {
        return [key, values[index]];
      }); // console.log(new Map(stats));

      const mapStats = new Map(stats);
      parts.action = "login";
      parts.data = data;
      parts.device_id = mapStats.get('imei');
      parts.status = "LOAD";
    }

    if (data.length == 15) {
      //this.sendOn()
      parts.action = "online";
      parts.data = data;
      parts.device_id = data;
      parts.status = "ON";
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
      const keys = ['imei', 'status', 'time', 'empty', 'a2', 'b1', 'b2', 'c1', 'c2', 'd1', 'd2', 'speed'];
      const values = data.split(',');
      const stats = keys.map((key, index) => {
        return [key, values[index]];
      }); // console.log(new Map(stats));

      const mapStats = new Map(stats); // this.sendCommand(mapStats.get('imei'));
      // 

      parts.data = mapStats;
      parts.device_id = mapStats.get('imei');

      switch (mapStats.get('status')) {
        case '001':
          parts.action = "location";
          break;

        case 'tracker':
          parts.action = "location";
          break;

        case ('help me', 'sensor alarm'):
          parts.action = "alert";
          parts.status = mapStats.get('status');
          break;

        default:
          parts.action = "other";
          parts.status = mapStats.get('status');
          break;
      }
    }

    return parts;
  }

  sendOk(msg) {
    this.device.send(msg);
  }

  sendCommand(imei) {
    var msg = `**,${imei},B`;
    console.log(msg);
    this.device.send(msg); //var msg = "**,imei:359586018966098,B";
    //this.device.send(msg);
  }

  generateCommand(imei, cmd) {}

  authorize(data) {
    this.sendOk("LOAD");
  }

  doLog(value) {
    console.log(value);
  }

  setLocation(data) {// console.log('location', data);	
  }

}

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("net");

/***/ })

/******/ });
});
//# sourceMappingURL=tracker-server.js.map
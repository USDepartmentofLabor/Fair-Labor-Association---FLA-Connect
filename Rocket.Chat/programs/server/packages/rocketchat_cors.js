(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;
var meteorInstall = Package.modules.meteorInstall;
var process = Package.modules.process;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:cors":{"cors.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/rocketchat_cors/cors.js                                                                    //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
var url = void 0;                                                                                      // 1
module.watch(require("url"), {                                                                         // 1
	"default": function (v) {                                                                             // 1
		url = v;                                                                                             // 1
	}                                                                                                     // 1
}, 0);                                                                                                 // 1
WebApp.rawConnectHandlers.use(Meteor.bindEnvironment(function (req, res, next) {                       // 5
	if (req._body) {                                                                                      // 6
		return next();                                                                                       // 7
	}                                                                                                     // 8
                                                                                                       //
	if (req.headers['transfer-encoding'] === undefined && isNaN(req.headers['content-length'])) {         // 9
		return next();                                                                                       // 10
	}                                                                                                     // 11
                                                                                                       //
	if (req.headers['content-type'] !== '' && req.headers['content-type'] !== undefined) {                // 12
		return next();                                                                                       // 13
	}                                                                                                     // 14
                                                                                                       //
	if (req.url.indexOf(__meteor_runtime_config__.ROOT_URL_PATH_PREFIX + "/ufs/") === 0) {                // 15
		return next();                                                                                       // 16
	}                                                                                                     // 17
                                                                                                       //
	var buf = '';                                                                                         // 19
	req.setEncoding('utf8');                                                                              // 20
	req.on('data', function (chunk) {                                                                     // 21
		return buf += chunk;                                                                                 // 22
	});                                                                                                   // 23
	req.on('end', function () {                                                                           // 25
		if (RocketChat && RocketChat.debugLevel === 'debug') {                                               // 26
			console.log('[request]'.green, req.method, req.url, '\nheaders ->', req.headers, '\nbody ->', buf);
		}                                                                                                    // 28
                                                                                                       //
		try {                                                                                                // 30
			req.body = JSON.parse(buf);                                                                         // 31
		} catch (error) {                                                                                    // 32
			req.body = buf;                                                                                     // 33
		}                                                                                                    // 34
                                                                                                       //
		req._body = true;                                                                                    // 35
		return next();                                                                                       // 37
	});                                                                                                   // 38
}));                                                                                                   // 39
WebApp.rawConnectHandlers.use(function (req, res, next) {                                              // 41
	if (/^\/(api|_timesync|sockjs|tap-i18n|__cordova)(\/|$)/.test(req.url)) {                             // 42
		res.setHeader('Access-Control-Allow-Origin', '*');                                                   // 43
	}                                                                                                     // 44
                                                                                                       //
	var setHeader = res.setHeader;                                                                        // 46
                                                                                                       //
	res.setHeader = function (key, val) {                                                                 // 47
		if (key.toLowerCase() === 'access-control-allow-origin' && val === 'http://meteor.local') {          // 48
			return;                                                                                             // 49
		}                                                                                                    // 50
                                                                                                       //
		return setHeader.apply(this, arguments);                                                             // 51
	};                                                                                                    // 52
                                                                                                       //
	return next();                                                                                        // 53
});                                                                                                    // 54
var _staticFilesMiddleware = WebAppInternals.staticFilesMiddleware;                                    // 56
                                                                                                       //
WebAppInternals._staticFilesMiddleware = function (staticFiles, req, res, next) {                      // 58
	res.setHeader('Access-Control-Allow-Origin', '*');                                                    // 59
	return _staticFilesMiddleware(staticFiles, req, res, next);                                           // 60
};                                                                                                     // 61
                                                                                                       //
var oldHttpServerListeners = WebApp.httpServer.listeners('request').slice(0);                          // 63
WebApp.httpServer.removeAllListeners('request');                                                       // 65
WebApp.httpServer.addListener('request', function (req, res) {                                         // 67
	var _arguments = arguments;                                                                           // 67
                                                                                                       //
	var next = function () {                                                                              // 68
		for (var _iterator = oldHttpServerListeners, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
			var _ref;                                                                                           // 69
                                                                                                       //
			if (_isArray) {                                                                                     // 69
				if (_i >= _iterator.length) break;                                                                 // 69
				_ref = _iterator[_i++];                                                                            // 69
			} else {                                                                                            // 69
				_i = _iterator.next();                                                                             // 69
				if (_i.done) break;                                                                                // 69
				_ref = _i.value;                                                                                   // 69
			}                                                                                                   // 69
                                                                                                       //
			var oldListener = _ref;                                                                             // 69
			oldListener.apply(WebApp.httpServer, _arguments);                                                   // 70
		}                                                                                                    // 71
	};                                                                                                    // 72
                                                                                                       //
	if (RocketChat.settings.get('Force_SSL') !== true) {                                                  // 74
		next();                                                                                              // 75
		return;                                                                                              // 76
	}                                                                                                     // 77
                                                                                                       //
	var remoteAddress = req.connection.remoteAddress || req.socket.remoteAddress;                         // 79
	var localhostRegexp = /^\s*(127\.0\.0\.1|::1)\s*$/;                                                   // 80
                                                                                                       //
	var localhostTest = function (x) {                                                                    // 81
		return localhostRegexp.test(x);                                                                      // 82
	};                                                                                                    // 83
                                                                                                       //
	var isLocal = localhostRegexp.test(remoteAddress) && (!req.headers['x-forwarded-for'] || _.all(req.headers['x-forwarded-for'].split(','), localhostTest));
                                                                                                       //
	var isSsl = req.connection.pair || req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'].indexOf('https') !== -1;
                                                                                                       //
	if (RocketChat && RocketChat.debugLevel === 'debug') {                                                // 88
		console.log('req.url', req.url);                                                                     // 89
		console.log('remoteAddress', remoteAddress);                                                         // 90
		console.log('isLocal', isLocal);                                                                     // 91
		console.log('isSsl', isSsl);                                                                         // 92
		console.log('req.headers', req.headers);                                                             // 93
	}                                                                                                     // 94
                                                                                                       //
	if (!isLocal && !isSsl) {                                                                             // 96
		var host = req.headers['host'] || url.parse(Meteor.absoluteUrl()).hostname;                          // 97
		host = host.replace(/:\d+$/, '');                                                                    // 98
		res.writeHead(302, {                                                                                 // 99
			'Location': "https://" + host + req.url                                                             // 100
		});                                                                                                  // 99
		res.end();                                                                                           // 102
		return;                                                                                              // 103
	}                                                                                                     // 104
                                                                                                       //
	return next();                                                                                        // 106
});                                                                                                    // 107
/////////////////////////////////////////////////////////////////////////////////////////////////////////

},"common.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/rocketchat_cors/common.js                                                                  //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
Meteor.startup(function () {                                                                           // 1
	return RocketChat.settings.onload('Force_SSL', function (key, value) {                                // 2
		return Meteor.absoluteUrl.defaultOptions.secure = value;                                             // 3
	});                                                                                                   // 4
});                                                                                                    // 5
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:cors/cors.js");
require("./node_modules/meteor/rocketchat:cors/common.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:cors'] = {};

})();

//# sourceMappingURL=rocketchat_cors.js.map

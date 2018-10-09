(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var ECMAScript = Package.ecmascript.ECMAScript;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RocketChatTabBar = Package['rocketchat:lib'].RocketChatTabBar;
var Restivus = Package['nimble:restivus'].Restivus;
var meteorInstall = Package.modules.meteorInstall;
var process = Package.modules.process;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:api":{"server":{"api.js":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_api/server/api.js                                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");                                                 //
                                                                                                                      //
var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);                                                        //
                                                                                                                      //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                               //
                                                                                                                      //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                      //
                                                                                                                      //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                         //
                                                                                                                      //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                                //
                                                                                                                      //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                           //
                                                                                                                      //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                  //
                                                                                                                      //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                     //
                                                                                                                      //
/* global Restivus */var API = function (_Restivus) {                                                                 // 1
	(0, _inherits3.default)(API, _Restivus);                                                                             //
                                                                                                                      //
	function API(properties) {                                                                                           // 3
		(0, _classCallCheck3.default)(this, API);                                                                           // 3
                                                                                                                      //
		var _this = (0, _possibleConstructorReturn3.default)(this, _Restivus.call(this, properties));                       // 3
                                                                                                                      //
		_this.logger = new Logger("API " + (properties.version ? properties.version : 'default') + " Logger", {});          // 5
		_this.authMethods = [];                                                                                             // 6
		_this.helperMethods = new Map();                                                                                    // 7
		_this.defaultFieldsToExclude = {                                                                                    // 8
			joinCode: 0,                                                                                                       // 9
			$loki: 0,                                                                                                          // 10
			meta: 0                                                                                                            // 11
		};                                                                                                                  // 8
                                                                                                                      //
		_this._config.defaultOptionsEndpoint = function () {                                                                // 14
			if (this.request.method === 'OPTIONS' && this.request.headers['access-control-request-method']) {                  // 15
				if (RocketChat.settings.get('API_Enable_CORS') === true) {                                                        // 16
					this.response.writeHead(200, {                                                                                   // 17
						'Access-Control-Allow-Origin': RocketChat.settings.get('API_CORS_Origin'),                                      // 18
						'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, X-User-Id, X-Auth-Token'       // 19
					});                                                                                                              // 17
				} else {                                                                                                          // 21
					this.response.writeHead(405);                                                                                    // 22
					this.response.write('CORS not enabled. Go to "Admin > General > REST Api" to enable it.');                       // 23
				}                                                                                                                 // 24
			} else {                                                                                                           // 25
				this.response.writeHead(404);                                                                                     // 26
			}                                                                                                                  // 27
                                                                                                                      //
			this.done();                                                                                                       // 29
		};                                                                                                                  // 30
                                                                                                                      //
		return _this;                                                                                                       // 3
	}                                                                                                                    // 31
                                                                                                                      //
	API.prototype.addAuthMethod = function () {                                                                          //
		function addAuthMethod(method) {                                                                                    //
			this.authMethods.push(method);                                                                                     // 34
		}                                                                                                                   // 35
                                                                                                                      //
		return addAuthMethod;                                                                                               //
	}();                                                                                                                 //
                                                                                                                      //
	API.prototype.success = function () {                                                                                //
		function success() {                                                                                                //
			var result = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};                               // 37
                                                                                                                      //
			if (_.isObject(result)) {                                                                                          // 38
				result.success = true;                                                                                            // 39
			}                                                                                                                  // 40
                                                                                                                      //
			return {                                                                                                           // 42
				statusCode: 200,                                                                                                  // 43
				body: result                                                                                                      // 44
			};                                                                                                                 // 42
		}                                                                                                                   // 46
                                                                                                                      //
		return success;                                                                                                     //
	}();                                                                                                                 //
                                                                                                                      //
	API.prototype.failure = function () {                                                                                //
		function failure(result, errorType) {                                                                               //
			if (_.isObject(result)) {                                                                                          // 49
				result.success = false;                                                                                           // 50
			} else {                                                                                                           // 51
				result = {                                                                                                        // 52
					success: false,                                                                                                  // 53
					error: result                                                                                                    // 54
				};                                                                                                                // 52
                                                                                                                      //
				if (errorType) {                                                                                                  // 57
					result.errorType = errorType;                                                                                    // 58
				}                                                                                                                 // 59
			}                                                                                                                  // 60
                                                                                                                      //
			return {                                                                                                           // 62
				statusCode: 400,                                                                                                  // 63
				body: result                                                                                                      // 64
			};                                                                                                                 // 62
		}                                                                                                                   // 66
                                                                                                                      //
		return failure;                                                                                                     //
	}();                                                                                                                 //
                                                                                                                      //
	API.prototype.unauthorized = function () {                                                                           //
		function unauthorized(msg) {                                                                                        //
			return {                                                                                                           // 70
				statusCode: 403,                                                                                                  // 71
				body: {                                                                                                           // 72
					success: false,                                                                                                  // 73
					error: msg ? msg : 'unauthorized'                                                                                // 74
				}                                                                                                                 // 72
			};                                                                                                                 // 70
		}                                                                                                                   // 77
                                                                                                                      //
		return unauthorized;                                                                                                //
	}();                                                                                                                 //
                                                                                                                      //
	API.prototype.addRoute = function () {                                                                               //
		function addRoute(routes, options, endpoints) {                                                                     //
			var _this2 = this;                                                                                                 // 79
                                                                                                                      //
			//Note: required if the developer didn't provide options                                                           // 80
			if (typeof endpoints === 'undefined') {                                                                            // 81
				endpoints = options;                                                                                              // 82
				options = {};                                                                                                     // 83
			} //Allow for more than one route using the same option and endpoints                                              // 84
                                                                                                                      //
                                                                                                                      //
			if (!_.isArray(routes)) {                                                                                          // 87
				routes = [routes];                                                                                                // 88
			}                                                                                                                  // 89
                                                                                                                      //
			routes.forEach(function (route) {                                                                                  // 91
				//Note: This is required due to Restivus calling `addRoute` in the constructor of itself                          // 92
				if (_this2.helperMethods) {                                                                                       // 93
					Object.keys(endpoints).forEach(function (method) {                                                               // 94
						if (typeof endpoints[method] === 'function') {                                                                  // 95
							endpoints[method] = {                                                                                          // 96
								action: endpoints[method]                                                                                     // 96
							};                                                                                                             // 96
						} //Add a try/catch for each much                                                                               // 97
                                                                                                                      //
                                                                                                                      //
						var originalAction = endpoints[method].action;                                                                  // 100
                                                                                                                      //
						endpoints[method].action = function () {                                                                        // 101
							this.logger.debug(this.request.method.toUpperCase() + ": " + this.request.url);                                // 102
							var result = void 0;                                                                                           // 103
                                                                                                                      //
							try {                                                                                                          // 104
								result = originalAction.apply(this);                                                                          // 105
							} catch (e) {                                                                                                  // 106
								this.logger.debug(method + " " + route + " threw an error:", e.stack);                                        // 107
								return RocketChat.API.v1.failure(e.message, e.error);                                                         // 108
							}                                                                                                              // 109
                                                                                                                      //
							return result ? result : RocketChat.API.v1.success();                                                          // 111
						};                                                                                                              // 112
                                                                                                                      //
						for (var _iterator = _this2.helperMethods, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
							var _ref3;                                                                                                     // 114
                                                                                                                      //
							if (_isArray) {                                                                                                // 114
								if (_i >= _iterator.length) break;                                                                            // 114
								_ref3 = _iterator[_i++];                                                                                      // 114
							} else {                                                                                                       // 114
								_i = _iterator.next();                                                                                        // 114
								if (_i.done) break;                                                                                           // 114
								_ref3 = _i.value;                                                                                             // 114
							}                                                                                                              // 114
                                                                                                                      //
							var _ref = _ref3;                                                                                              // 114
                                                                                                                      //
							var _ref2 = (0, _slicedToArray3.default)(_ref, 2);                                                             // 114
                                                                                                                      //
							var name = _ref2[0];                                                                                           // 114
							var helperMethod = _ref2[1];                                                                                   // 114
							endpoints[method][name] = helperMethod;                                                                        // 115
						} //Allow the endpoints to make usage of the logger which respects the user's settings                          // 116
                                                                                                                      //
                                                                                                                      //
						endpoints[method].logger = _this2.logger;                                                                       // 119
					});                                                                                                              // 120
				}                                                                                                                 // 121
                                                                                                                      //
				_Restivus.prototype.addRoute.call(_this2, route, options, endpoints);                                             // 123
			});                                                                                                                // 124
		}                                                                                                                   // 125
                                                                                                                      //
		return addRoute;                                                                                                    //
	}();                                                                                                                 //
                                                                                                                      //
	return API;                                                                                                          //
}(Restivus);                                                                                                          //
                                                                                                                      //
RocketChat.API = {};                                                                                                  // 128
                                                                                                                      //
var getUserAuth = function () {                                                                                       // 130
	function _getUserAuth() {                                                                                            // 130
		var invalidResults = [undefined, null, false];                                                                      // 131
		return {                                                                                                            // 132
			token: 'services.resume.loginTokens.hashedToken',                                                                  // 133
			user: function () {                                                                                                // 134
				if (this.bodyParams && this.bodyParams.payload) {                                                                 // 135
					this.bodyParams = JSON.parse(this.bodyParams.payload);                                                           // 136
				}                                                                                                                 // 137
                                                                                                                      //
				for (var i = 0; i < RocketChat.API.v1.authMethods.length; i++) {                                                  // 139
					var method = RocketChat.API.v1.authMethods[i];                                                                   // 140
                                                                                                                      //
					if (typeof method === 'function') {                                                                              // 142
						var result = method.apply(this, arguments);                                                                     // 143
                                                                                                                      //
						if (!invalidResults.includes(result)) {                                                                         // 144
							return result;                                                                                                 // 145
						}                                                                                                               // 146
					}                                                                                                                // 147
				}                                                                                                                 // 148
                                                                                                                      //
				var token = void 0;                                                                                               // 150
                                                                                                                      //
				if (this.request.headers['x-auth-token']) {                                                                       // 151
					token = Accounts._hashLoginToken(this.request.headers['x-auth-token']);                                          // 152
				}                                                                                                                 // 153
                                                                                                                      //
				return {                                                                                                          // 155
					userId: this.request.headers['x-user-id'],                                                                       // 156
					token: token                                                                                                     // 157
				};                                                                                                                // 155
			}                                                                                                                  // 159
		};                                                                                                                  // 132
	}                                                                                                                    // 161
                                                                                                                      //
	return _getUserAuth;                                                                                                 // 130
}();                                                                                                                  // 130
                                                                                                                      //
RocketChat.API.v1 = new API({                                                                                         // 163
	version: 'v1',                                                                                                       // 164
	useDefaultAuth: true,                                                                                                // 165
	prettyJson: true,                                                                                                    // 166
	enableCors: false,                                                                                                   // 167
	auth: getUserAuth()                                                                                                  // 168
});                                                                                                                   // 163
RocketChat.API.default = new API({                                                                                    // 171
	useDefaultAuth: true,                                                                                                // 172
	prettyJson: true,                                                                                                    // 173
	enableCors: false,                                                                                                   // 174
	auth: getUserAuth()                                                                                                  // 175
});                                                                                                                   // 171
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"settings.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_api/server/settings.js                                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
RocketChat.settings.addGroup('General', function () {                                                                 // 1
	this.section('REST API', function () {                                                                               // 2
		this.add('API_Upper_Count_Limit', 100, {                                                                            // 3
			type: 'int',                                                                                                       // 3
			"public": false                                                                                                    // 3
		});                                                                                                                 // 3
		this.add('API_Default_Count', 50, {                                                                                 // 4
			type: 'int',                                                                                                       // 4
			"public": false                                                                                                    // 4
		});                                                                                                                 // 4
		this.add('API_Allow_Infinite_Count', true, {                                                                        // 5
			type: 'boolean',                                                                                                   // 5
			"public": false                                                                                                    // 5
		});                                                                                                                 // 5
		this.add('API_Enable_Direct_Message_History_EndPoint', false, {                                                     // 6
			type: 'boolean',                                                                                                   // 6
			"public": false                                                                                                    // 6
		});                                                                                                                 // 6
		this.add('API_Enable_Shields', true, {                                                                              // 7
			type: 'boolean',                                                                                                   // 7
			"public": false                                                                                                    // 7
		});                                                                                                                 // 7
		this.add('API_Shield_Types', '*', {                                                                                 // 8
			type: 'string',                                                                                                    // 8
			"public": false,                                                                                                   // 8
			enableQuery: {                                                                                                     // 8
				_id: 'API_Enable_Shields',                                                                                        // 8
				value: true                                                                                                       // 8
			}                                                                                                                  // 8
		});                                                                                                                 // 8
		this.add('API_Enable_CORS', false, {                                                                                // 9
			type: 'boolean',                                                                                                   // 9
			"public": false                                                                                                    // 9
		});                                                                                                                 // 9
		this.add('API_CORS_Origin', '*', {                                                                                  // 10
			type: 'string',                                                                                                    // 10
			"public": false,                                                                                                   // 10
			enableQuery: {                                                                                                     // 10
				_id: 'API_Enable_CORS',                                                                                           // 10
				value: true                                                                                                       // 10
			}                                                                                                                  // 10
		});                                                                                                                 // 10
	});                                                                                                                  // 11
});                                                                                                                   // 12
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v1":{"helpers":{"requestParams.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_api/server/v1/helpers/requestParams.js                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
RocketChat.API.v1.helperMethods.set('requestParams', function () {                                                    // 1
	function _requestParams() {                                                                                          // 1
		return ['POST', 'PUT'].includes(this.request.method) ? this.bodyParams : this.queryParams;                          // 2
	}                                                                                                                    // 3
                                                                                                                      //
	return _requestParams;                                                                                               // 1
}());                                                                                                                 // 1
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getPaginationItems.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_api/server/v1/helpers/getPaginationItems.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// If the count query param is higher than the "API_Upper_Count_Limit" setting, then we limit that                    // 1
// If the count query param isn't defined, then we set it to the "API_Default_Count" setting                          // 2
// If the count is zero, then that means unlimited and is only allowed if the setting "API_Allow_Infinite_Count" is true
RocketChat.API.v1.helperMethods.set('getPaginationItems', function () {                                               // 5
	function _getPaginationItems() {                                                                                     // 5
		var hardUpperLimit = RocketChat.settings.get('API_Upper_Count_Limit') <= 0 ? 100 : RocketChat.settings.get('API_Upper_Count_Limit');
		var defaultCount = RocketChat.settings.get('API_Default_Count') <= 0 ? 50 : RocketChat.settings.get('API_Default_Count');
		var offset = this.queryParams.offset ? parseInt(this.queryParams.offset) : 0;                                       // 8
		var count = defaultCount; // Ensure count is an appropiate amount                                                   // 9
                                                                                                                      //
		if (typeof this.queryParams.count !== 'undefined') {                                                                // 12
			count = parseInt(this.queryParams.count);                                                                          // 13
		} else {                                                                                                            // 14
			count = defaultCount;                                                                                              // 15
		}                                                                                                                   // 16
                                                                                                                      //
		if (count > hardUpperLimit) {                                                                                       // 18
			count = hardUpperLimit;                                                                                            // 19
		}                                                                                                                   // 20
                                                                                                                      //
		if (count === 0 && !RocketChat.settings.get('API_Allow_Infinite_Count')) {                                          // 22
			count = defaultCount;                                                                                              // 23
		}                                                                                                                   // 24
                                                                                                                      //
		return {                                                                                                            // 26
			offset: offset,                                                                                                    // 27
			count: count                                                                                                       // 28
		};                                                                                                                  // 26
	}                                                                                                                    // 30
                                                                                                                      //
	return _getPaginationItems;                                                                                          // 5
}());                                                                                                                 // 5
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getUserFromParams.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_api/server/v1/helpers/getUserFromParams.js                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
//Convenience method, almost need to turn it into a middleware of sorts                                               // 1
RocketChat.API.v1.helperMethods.set('getUserFromParams', function () {                                                // 2
	function _getUserFromParams() {                                                                                      // 2
		var doesntExist = {                                                                                                 // 3
			_doesntExist: true                                                                                                 // 3
		};                                                                                                                  // 3
		var user = void 0;                                                                                                  // 4
		var params = this.requestParams();                                                                                  // 5
                                                                                                                      //
		if (params.userId && params.userId.trim()) {                                                                        // 7
			user = RocketChat.models.Users.findOneById(params.userId) || doesntExist;                                          // 8
		} else if (params.username && params.username.trim()) {                                                             // 9
			user = RocketChat.models.Users.findOneByUsername(params.username) || doesntExist;                                  // 10
		} else if (params.user && params.user.trim()) {                                                                     // 11
			user = RocketChat.models.Users.findOneByUsername(params.user) || doesntExist;                                      // 12
		} else {                                                                                                            // 13
			throw new Meteor.Error('error-user-param-not-provided', 'The required "userId" or "username" param was not provided');
		}                                                                                                                   // 15
                                                                                                                      //
		if (user._doesntExist) {                                                                                            // 17
			throw new Meteor.Error('error-invalid-user', 'The required "userId" or "username" param provided does not match any users');
		}                                                                                                                   // 19
                                                                                                                      //
		return user;                                                                                                        // 21
	}                                                                                                                    // 22
                                                                                                                      //
	return _getUserFromParams;                                                                                           // 2
}());                                                                                                                 // 2
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"isUserFromParams.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_api/server/v1/helpers/isUserFromParams.js                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
RocketChat.API.v1.helperMethods.set('isUserFromParams', function () {                                                 // 1
	function _isUserFromParams() {                                                                                       // 1
		var params = this.requestParams();                                                                                  // 2
		return !params.userId && !params.username && !params.user || params.userId && this.userId === params.userId || params.username && this.user.username === params.username || params.user && this.user.username === params.user;
	}                                                                                                                    // 8
                                                                                                                      //
	return _isUserFromParams;                                                                                            // 1
}());                                                                                                                 // 1
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"parseJsonQuery.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_api/server/v1/helpers/parseJsonQuery.js                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
RocketChat.API.v1.helperMethods.set('parseJsonQuery', function () {                                                   // 1
	function _parseJsonQuery() {                                                                                         // 1
		var sort = void 0;                                                                                                  // 2
                                                                                                                      //
		if (this.queryParams.sort) {                                                                                        // 3
			try {                                                                                                              // 4
				sort = JSON.parse(this.queryParams.sort);                                                                         // 5
			} catch (e) {                                                                                                      // 6
				this.logger.warn("Invalid sort parameter provided \"" + this.queryParams.sort + "\":", e);                        // 7
				throw new Meteor.Error('error-invalid-sort', "Invalid sort parameter provided: \"" + this.queryParams.sort + "\"", {
					helperMethod: 'parseJsonQuery'                                                                                   // 8
				});                                                                                                               // 8
			}                                                                                                                  // 9
		}                                                                                                                   // 10
                                                                                                                      //
		var fields = void 0;                                                                                                // 12
                                                                                                                      //
		if (this.queryParams.fields) {                                                                                      // 13
			try {                                                                                                              // 14
				fields = JSON.parse(this.queryParams.fields);                                                                     // 15
			} catch (e) {                                                                                                      // 16
				this.logger.warn("Invalid fields parameter provided \"" + this.queryParams.fields + "\":", e);                    // 17
				throw new Meteor.Error('error-invalid-fields', "Invalid fields parameter provided: \"" + this.queryParams.fields + "\"", {
					helperMethod: 'parseJsonQuery'                                                                                   // 18
				});                                                                                                               // 18
			}                                                                                                                  // 19
		}                                                                                                                   // 20
                                                                                                                      //
		var query = void 0;                                                                                                 // 22
                                                                                                                      //
		if (this.queryParams.query) {                                                                                       // 23
			try {                                                                                                              // 24
				query = JSON.parse(this.queryParams.query);                                                                       // 25
			} catch (e) {                                                                                                      // 26
				this.logger.warn("Invalid query parameter provided \"" + this.queryParams.query + "\":", e);                      // 27
				throw new Meteor.Error('error-invalid-query', "Invalid query parameter provided: \"" + this.queryParams.query + "\"", {
					helperMethod: 'parseJsonQuery'                                                                                   // 28
				});                                                                                                               // 28
			}                                                                                                                  // 29
		}                                                                                                                   // 30
                                                                                                                      //
		return {                                                                                                            // 32
			sort: sort,                                                                                                        // 33
			fields: fields,                                                                                                    // 34
			query: query                                                                                                       // 35
		};                                                                                                                  // 32
	}                                                                                                                    // 37
                                                                                                                      //
	return _parseJsonQuery;                                                                                              // 1
}());                                                                                                                 // 1
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getLoggedInUser.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_api/server/v1/helpers/getLoggedInUser.js                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
RocketChat.API.v1.helperMethods.set('getLoggedInUser', function () {                                                  // 1
	function _getLoggedInUser() {                                                                                        // 1
		var user = void 0;                                                                                                  // 2
                                                                                                                      //
		if (this.request.headers['x-auth-token'] && this.request.headers['x-user-id']) {                                    // 4
			user = RocketChat.models.Users.findOne({                                                                           // 5
				'_id': this.request.headers['x-user-id'],                                                                         // 6
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(this.request.headers['x-auth-token'])         // 7
			});                                                                                                                // 5
		}                                                                                                                   // 9
                                                                                                                      //
		return user;                                                                                                        // 11
	}                                                                                                                    // 12
                                                                                                                      //
	return _getLoggedInUser;                                                                                             // 1
}());                                                                                                                 // 1
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"channels.js":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_api/server/v1/channels.js                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _typeof2 = require("babel-runtime/helpers/typeof");                                                               //
                                                                                                                      //
var _typeof3 = _interopRequireDefault(_typeof2);                                                                      //
                                                                                                                      //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                     //
                                                                                                                      //
//Returns the channel IF found otherwise it will return the failure of why it didn't. Check the `statusCode` property
function findChannelByIdOrName(_ref) {                                                                                // 2
	var params = _ref.params,                                                                                            // 2
	    _ref$checkedArchived = _ref.checkedArchived,                                                                     // 2
	    checkedArchived = _ref$checkedArchived === undefined ? true : _ref$checkedArchived;                              // 2
                                                                                                                      //
	if ((!params.roomId || !params.roomId.trim()) && (!params.roomName || !params.roomName.trim())) {                    // 3
		throw new Meteor.Error('error-roomid-param-not-provided', 'The parameter "roomId" or "roomName" is required');      // 4
	}                                                                                                                    // 5
                                                                                                                      //
	var room = void 0;                                                                                                   // 7
                                                                                                                      //
	if (params.roomId) {                                                                                                 // 8
		room = RocketChat.models.Rooms.findOneById(params.roomId, {                                                         // 9
			fields: RocketChat.API.v1.defaultFieldsToExclude                                                                   // 9
		});                                                                                                                 // 9
	} else if (params.roomName) {                                                                                        // 10
		room = RocketChat.models.Rooms.findOneByName(params.roomName, {                                                     // 11
			fields: RocketChat.API.v1.defaultFieldsToExclude                                                                   // 11
		});                                                                                                                 // 11
	}                                                                                                                    // 12
                                                                                                                      //
	if (!room || room.t !== 'c') {                                                                                       // 14
		throw new Meteor.Error('error-room-not-found', 'The required "roomId" or "roomName" param provided does not match any channel');
	}                                                                                                                    // 16
                                                                                                                      //
	if (checkedArchived && room.archived) {                                                                              // 18
		throw new Meteor.Error('error-room-archived', "The channel, " + room.name + ", is archived");                       // 19
	}                                                                                                                    // 20
                                                                                                                      //
	return room;                                                                                                         // 22
}                                                                                                                     // 23
                                                                                                                      //
RocketChat.API.v1.addRoute('channels.addAll', {                                                                       // 25
	authRequired: true                                                                                                   // 25
}, {                                                                                                                  // 25
	post: function () {                                                                                                  // 26
		var _this = this;                                                                                                   // 26
                                                                                                                      //
		var findResult = findChannelByIdOrName({                                                                            // 27
			params: this.requestParams()                                                                                       // 27
		});                                                                                                                 // 27
		Meteor.runAsUser(this.userId, function () {                                                                         // 29
			Meteor.call('addAllUserToRoom', findResult._id, _this.bodyParams.activeUsersOnly);                                 // 30
		});                                                                                                                 // 31
		return RocketChat.API.v1.success({                                                                                  // 33
			channel: RocketChat.models.Rooms.findOneById(findResult._id, {                                                     // 34
				fields: RocketChat.API.v1.defaultFieldsToExclude                                                                  // 34
			})                                                                                                                 // 34
		});                                                                                                                 // 33
	}                                                                                                                    // 36
});                                                                                                                   // 25
RocketChat.API.v1.addRoute('channels.addModerator', {                                                                 // 39
	authRequired: true                                                                                                   // 39
}, {                                                                                                                  // 39
	post: function () {                                                                                                  // 40
		var findResult = findChannelByIdOrName({                                                                            // 41
			params: this.requestParams()                                                                                       // 41
		});                                                                                                                 // 41
		var user = this.getUserFromParams();                                                                                // 43
		Meteor.runAsUser(this.userId, function () {                                                                         // 45
			Meteor.call('addRoomModerator', findResult._id, user._id);                                                         // 46
		});                                                                                                                 // 47
		return RocketChat.API.v1.success();                                                                                 // 49
	}                                                                                                                    // 50
});                                                                                                                   // 39
RocketChat.API.v1.addRoute('channels.addOwner', {                                                                     // 53
	authRequired: true                                                                                                   // 53
}, {                                                                                                                  // 53
	post: function () {                                                                                                  // 54
		var findResult = findChannelByIdOrName({                                                                            // 55
			params: this.requestParams()                                                                                       // 55
		});                                                                                                                 // 55
		var user = this.getUserFromParams();                                                                                // 57
		Meteor.runAsUser(this.userId, function () {                                                                         // 59
			Meteor.call('addRoomOwner', findResult._id, user._id);                                                             // 60
		});                                                                                                                 // 61
		return RocketChat.API.v1.success();                                                                                 // 63
	}                                                                                                                    // 64
});                                                                                                                   // 53
RocketChat.API.v1.addRoute('channels.archive', {                                                                      // 67
	authRequired: true                                                                                                   // 67
}, {                                                                                                                  // 67
	post: function () {                                                                                                  // 68
		var findResult = findChannelByIdOrName({                                                                            // 69
			params: this.requestParams()                                                                                       // 69
		});                                                                                                                 // 69
		Meteor.runAsUser(this.userId, function () {                                                                         // 71
			Meteor.call('archiveRoom', findResult._id);                                                                        // 72
		});                                                                                                                 // 73
		return RocketChat.API.v1.success();                                                                                 // 75
	}                                                                                                                    // 76
});                                                                                                                   // 67
RocketChat.API.v1.addRoute('channels.cleanHistory', {                                                                 // 79
	authRequired: true                                                                                                   // 79
}, {                                                                                                                  // 79
	post: function () {                                                                                                  // 80
		var findResult = findChannelByIdOrName({                                                                            // 81
			params: this.requestParams()                                                                                       // 81
		});                                                                                                                 // 81
                                                                                                                      //
		if (!this.bodyParams.latest) {                                                                                      // 83
			return RocketChat.API.v1.failure('Body parameter "latest" is required.');                                          // 84
		}                                                                                                                   // 85
                                                                                                                      //
		if (!this.bodyParams.oldest) {                                                                                      // 87
			return RocketChat.API.v1.failure('Body parameter "oldest" is required.');                                          // 88
		}                                                                                                                   // 89
                                                                                                                      //
		var latest = new Date(this.bodyParams.latest);                                                                      // 91
		var oldest = new Date(this.bodyParams.oldest);                                                                      // 92
		var inclusive = false;                                                                                              // 94
                                                                                                                      //
		if (typeof this.bodyParams.inclusive !== 'undefined') {                                                             // 95
			inclusive = this.bodyParams.inclusive;                                                                             // 96
		}                                                                                                                   // 97
                                                                                                                      //
		Meteor.runAsUser(this.userId, function () {                                                                         // 99
			Meteor.call('cleanChannelHistory', {                                                                               // 100
				roomId: findResult._id,                                                                                           // 100
				latest: latest,                                                                                                   // 100
				oldest: oldest,                                                                                                   // 100
				inclusive: inclusive                                                                                              // 100
			});                                                                                                                // 100
		});                                                                                                                 // 101
		return RocketChat.API.v1.success();                                                                                 // 103
	}                                                                                                                    // 104
});                                                                                                                   // 79
RocketChat.API.v1.addRoute('channels.close', {                                                                        // 107
	authRequired: true                                                                                                   // 107
}, {                                                                                                                  // 107
	post: function () {                                                                                                  // 108
		var findResult = findChannelByIdOrName({                                                                            // 109
			params: this.requestParams(),                                                                                      // 109
			checkedArchived: false                                                                                             // 109
		});                                                                                                                 // 109
		var sub = RocketChat.models.Subscriptions.findOneByRoomIdAndUserId(findResult._id, this.userId);                    // 111
                                                                                                                      //
		if (!sub) {                                                                                                         // 113
			return RocketChat.API.v1.failure("The user/callee is not in the channel \"" + findResult.name + ".");              // 114
		}                                                                                                                   // 115
                                                                                                                      //
		if (!sub.open) {                                                                                                    // 117
			return RocketChat.API.v1.failure("The channel, " + findResult.name + ", is already closed to the sender");         // 118
		}                                                                                                                   // 119
                                                                                                                      //
		Meteor.runAsUser(this.userId, function () {                                                                         // 121
			Meteor.call('hideRoom', findResult._id);                                                                           // 122
		});                                                                                                                 // 123
		return RocketChat.API.v1.success();                                                                                 // 125
	}                                                                                                                    // 126
});                                                                                                                   // 107
RocketChat.API.v1.addRoute('channels.create', {                                                                       // 129
	authRequired: true                                                                                                   // 129
}, {                                                                                                                  // 129
	post: function () {                                                                                                  // 130
		var _this2 = this;                                                                                                  // 130
                                                                                                                      //
		if (!RocketChat.authz.hasPermission(this.userId, 'create-c')) {                                                     // 131
			return RocketChat.API.v1.unauthorized();                                                                           // 132
		}                                                                                                                   // 133
                                                                                                                      //
		if (!this.bodyParams.name) {                                                                                        // 135
			return RocketChat.API.v1.failure('Body param "name" is required');                                                 // 136
		}                                                                                                                   // 137
                                                                                                                      //
		if (this.bodyParams.members && !_.isArray(this.bodyParams.members)) {                                               // 139
			return RocketChat.API.v1.failure('Body param "members" must be an array if provided');                             // 140
		}                                                                                                                   // 141
                                                                                                                      //
		if (this.bodyParams.customFields && !((0, _typeof3.default)(this.bodyParams.customFields) === 'object')) {          // 143
			return RocketChat.API.v1.failure('Body param "customFields" must be an object if provided');                       // 144
		}                                                                                                                   // 145
                                                                                                                      //
		var readOnly = false;                                                                                               // 147
                                                                                                                      //
		if (typeof this.bodyParams.readOnly !== 'undefined') {                                                              // 148
			readOnly = this.bodyParams.readOnly;                                                                               // 149
		}                                                                                                                   // 150
                                                                                                                      //
		var id = void 0;                                                                                                    // 152
		Meteor.runAsUser(this.userId, function () {                                                                         // 153
			id = Meteor.call('createChannel', _this2.bodyParams.name, _this2.bodyParams.members ? _this2.bodyParams.members : [], readOnly, _this2.bodyParams.customFields);
		});                                                                                                                 // 155
		return RocketChat.API.v1.success({                                                                                  // 157
			channel: RocketChat.models.Rooms.findOneById(id.rid, {                                                             // 158
				fields: RocketChat.API.v1.defaultFieldsToExclude                                                                  // 158
			})                                                                                                                 // 158
		});                                                                                                                 // 157
	}                                                                                                                    // 160
});                                                                                                                   // 129
RocketChat.API.v1.addRoute('channels.delete', {                                                                       // 163
	authRequired: true                                                                                                   // 163
}, {                                                                                                                  // 163
	post: function () {                                                                                                  // 164
		var findResult = findChannelByIdOrName({                                                                            // 165
			params: this.requestParams(),                                                                                      // 165
			checkedArchived: false                                                                                             // 165
		}); //The find method returns either with the group or the failur                                                   // 165
                                                                                                                      //
		Meteor.runAsUser(this.userId, function () {                                                                         // 169
			Meteor.call('eraseRoom', findResult._id);                                                                          // 170
		});                                                                                                                 // 171
		return RocketChat.API.v1.success({                                                                                  // 173
			channel: findResult                                                                                                // 174
		});                                                                                                                 // 173
	}                                                                                                                    // 176
});                                                                                                                   // 163
RocketChat.API.v1.addRoute('channels.getIntegrations', {                                                              // 179
	authRequired: true                                                                                                   // 179
}, {                                                                                                                  // 179
	get: function () {                                                                                                   // 180
		if (!RocketChat.authz.hasPermission(this.userId, 'manage-integrations')) {                                          // 181
			return RocketChat.API.v1.unauthorized();                                                                           // 182
		}                                                                                                                   // 183
                                                                                                                      //
		var findResult = findChannelByIdOrName({                                                                            // 185
			params: this.requestParams(),                                                                                      // 185
			checkedArchived: false                                                                                             // 185
		});                                                                                                                 // 185
		var includeAllPublicChannels = true;                                                                                // 187
                                                                                                                      //
		if (typeof this.queryParams.includeAllPublicChannels !== 'undefined') {                                             // 188
			includeAllPublicChannels = this.queryParams.includeAllPublicChannels === 'true';                                   // 189
		}                                                                                                                   // 190
                                                                                                                      //
		var ourQuery = {                                                                                                    // 192
			channel: "#" + findResult.name                                                                                     // 193
		};                                                                                                                  // 192
                                                                                                                      //
		if (includeAllPublicChannels) {                                                                                     // 196
			ourQuery.channel = {                                                                                               // 197
				$in: [ourQuery.channel, 'all_public_channels']                                                                    // 198
			};                                                                                                                 // 197
		}                                                                                                                   // 200
                                                                                                                      //
		var _getPaginationItems = this.getPaginationItems(),                                                                // 180
		    offset = _getPaginationItems.offset,                                                                            // 180
		    count = _getPaginationItems.count;                                                                              // 180
                                                                                                                      //
		var _parseJsonQuery = this.parseJsonQuery(),                                                                        // 180
		    sort = _parseJsonQuery.sort,                                                                                    // 180
		    fields = _parseJsonQuery.fields,                                                                                // 180
		    query = _parseJsonQuery.query;                                                                                  // 180
                                                                                                                      //
		ourQuery = Object.assign({}, query, ourQuery);                                                                      // 205
		var integrations = RocketChat.models.Integrations.find(ourQuery, {                                                  // 207
			sort: sort ? sort : {                                                                                              // 208
				_createdAt: 1                                                                                                     // 208
			},                                                                                                                 // 208
			skip: offset,                                                                                                      // 209
			limit: count,                                                                                                      // 210
			fields: Object.assign({}, fields, RocketChat.API.v1.defaultFieldsToExclude)                                        // 211
		}).fetch();                                                                                                         // 207
		return RocketChat.API.v1.success({                                                                                  // 214
			integrations: integrations,                                                                                        // 215
			count: integrations.length,                                                                                        // 216
			offset: offset,                                                                                                    // 217
			total: RocketChat.models.Integrations.find(ourQuery).count()                                                       // 218
		});                                                                                                                 // 214
	}                                                                                                                    // 220
});                                                                                                                   // 179
RocketChat.API.v1.addRoute('channels.history', {                                                                      // 223
	authRequired: true                                                                                                   // 223
}, {                                                                                                                  // 223
	get: function () {                                                                                                   // 224
		var findResult = findChannelByIdOrName({                                                                            // 225
			params: this.requestParams(),                                                                                      // 225
			checkedArchived: false                                                                                             // 225
		});                                                                                                                 // 225
		var latestDate = new Date();                                                                                        // 227
                                                                                                                      //
		if (this.queryParams.latest) {                                                                                      // 228
			latestDate = new Date(this.queryParams.latest);                                                                    // 229
		}                                                                                                                   // 230
                                                                                                                      //
		var oldestDate = undefined;                                                                                         // 232
                                                                                                                      //
		if (this.queryParams.oldest) {                                                                                      // 233
			oldestDate = new Date(this.queryParams.oldest);                                                                    // 234
		}                                                                                                                   // 235
                                                                                                                      //
		var inclusive = false;                                                                                              // 237
                                                                                                                      //
		if (this.queryParams.inclusive) {                                                                                   // 238
			inclusive = this.queryParams.inclusive;                                                                            // 239
		}                                                                                                                   // 240
                                                                                                                      //
		var count = 20;                                                                                                     // 242
                                                                                                                      //
		if (this.queryParams.count) {                                                                                       // 243
			count = parseInt(this.queryParams.count);                                                                          // 244
		}                                                                                                                   // 245
                                                                                                                      //
		var unreads = false;                                                                                                // 247
                                                                                                                      //
		if (this.queryParams.unreads) {                                                                                     // 248
			unreads = this.queryParams.unreads;                                                                                // 249
		}                                                                                                                   // 250
                                                                                                                      //
		var result = void 0;                                                                                                // 252
		Meteor.runAsUser(this.userId, function () {                                                                         // 253
			result = Meteor.call('getChannelHistory', {                                                                        // 254
				rid: findResult._id,                                                                                              // 254
				latest: latestDate,                                                                                               // 254
				oldest: oldestDate,                                                                                               // 254
				inclusive: inclusive,                                                                                             // 254
				count: count,                                                                                                     // 254
				unreads: unreads                                                                                                  // 254
			});                                                                                                                // 254
		});                                                                                                                 // 255
		return RocketChat.API.v1.success({                                                                                  // 257
			messages: result && result.messages ? result.messages : []                                                         // 258
		});                                                                                                                 // 257
	}                                                                                                                    // 260
});                                                                                                                   // 223
RocketChat.API.v1.addRoute('channels.info', {                                                                         // 263
	authRequired: true                                                                                                   // 263
}, {                                                                                                                  // 263
	get: function () {                                                                                                   // 264
		var findResult = findChannelByIdOrName({                                                                            // 265
			params: this.requestParams(),                                                                                      // 265
			checkedArchived: false                                                                                             // 265
		});                                                                                                                 // 265
		return RocketChat.API.v1.success({                                                                                  // 267
			channel: RocketChat.models.Rooms.findOneById(findResult._id, {                                                     // 268
				fields: RocketChat.API.v1.defaultFieldsToExclude                                                                  // 268
			})                                                                                                                 // 268
		});                                                                                                                 // 267
	}                                                                                                                    // 270
});                                                                                                                   // 263
RocketChat.API.v1.addRoute('channels.invite', {                                                                       // 273
	authRequired: true                                                                                                   // 273
}, {                                                                                                                  // 273
	post: function () {                                                                                                  // 274
		var findResult = findChannelByIdOrName({                                                                            // 275
			params: this.requestParams()                                                                                       // 275
		});                                                                                                                 // 275
		var user = this.getUserFromParams();                                                                                // 277
		Meteor.runAsUser(this.userId, function () {                                                                         // 279
			Meteor.call('addUserToRoom', {                                                                                     // 280
				rid: findResult._id,                                                                                              // 280
				username: user.username                                                                                           // 280
			});                                                                                                                // 280
		});                                                                                                                 // 281
		return RocketChat.API.v1.success({                                                                                  // 283
			channel: RocketChat.models.Rooms.findOneById(findResult._id, {                                                     // 284
				fields: RocketChat.API.v1.defaultFieldsToExclude                                                                  // 284
			})                                                                                                                 // 284
		});                                                                                                                 // 283
	}                                                                                                                    // 286
});                                                                                                                   // 273
RocketChat.API.v1.addRoute('channels.join', {                                                                         // 289
	authRequired: true                                                                                                   // 289
}, {                                                                                                                  // 289
	post: function () {                                                                                                  // 290
		var _this3 = this;                                                                                                  // 290
                                                                                                                      //
		var findResult = findChannelByIdOrName({                                                                            // 291
			params: this.requestParams()                                                                                       // 291
		});                                                                                                                 // 291
		Meteor.runAsUser(this.userId, function () {                                                                         // 293
			Meteor.call('joinRoom', findResult._id, _this3.bodyParams.joinCode);                                               // 294
		});                                                                                                                 // 295
		return RocketChat.API.v1.success({                                                                                  // 297
			channel: RocketChat.models.Rooms.findOneById(findResult._id, {                                                     // 298
				fields: RocketChat.API.v1.defaultFieldsToExclude                                                                  // 298
			})                                                                                                                 // 298
		});                                                                                                                 // 297
	}                                                                                                                    // 300
});                                                                                                                   // 289
RocketChat.API.v1.addRoute('channels.kick', {                                                                         // 303
	authRequired: true                                                                                                   // 303
}, {                                                                                                                  // 303
	post: function () {                                                                                                  // 304
		var findResult = findChannelByIdOrName({                                                                            // 305
			params: this.requestParams()                                                                                       // 305
		});                                                                                                                 // 305
		var user = this.getUserFromParams();                                                                                // 307
		Meteor.runAsUser(this.userId, function () {                                                                         // 309
			Meteor.call('removeUserFromRoom', {                                                                                // 310
				rid: findResult._id,                                                                                              // 310
				username: user.username                                                                                           // 310
			});                                                                                                                // 310
		});                                                                                                                 // 311
		return RocketChat.API.v1.success({                                                                                  // 313
			channel: RocketChat.models.Rooms.findOneById(findResult._id, {                                                     // 314
				fields: RocketChat.API.v1.defaultFieldsToExclude                                                                  // 314
			})                                                                                                                 // 314
		});                                                                                                                 // 313
	}                                                                                                                    // 316
});                                                                                                                   // 303
RocketChat.API.v1.addRoute('channels.leave', {                                                                        // 319
	authRequired: true                                                                                                   // 319
}, {                                                                                                                  // 319
	post: function () {                                                                                                  // 320
		var findResult = findChannelByIdOrName({                                                                            // 321
			params: this.requestParams()                                                                                       // 321
		});                                                                                                                 // 321
		Meteor.runAsUser(this.userId, function () {                                                                         // 323
			Meteor.call('leaveRoom', findResult._id);                                                                          // 324
		});                                                                                                                 // 325
		return RocketChat.API.v1.success({                                                                                  // 327
			channel: RocketChat.models.Rooms.findOneById(findResult._id, {                                                     // 328
				fields: RocketChat.API.v1.defaultFieldsToExclude                                                                  // 328
			})                                                                                                                 // 328
		});                                                                                                                 // 327
	}                                                                                                                    // 330
});                                                                                                                   // 319
RocketChat.API.v1.addRoute('channels.list', {                                                                         // 333
	authRequired: true                                                                                                   // 333
}, {                                                                                                                  // 333
	get: {                                                                                                               // 334
		//This is defined as such only to provide an example of how the routes can be defined :X                            // 335
		action: function () {                                                                                               // 336
			var _getPaginationItems2 = this.getPaginationItems(),                                                              // 336
			    offset = _getPaginationItems2.offset,                                                                          // 336
			    count = _getPaginationItems2.count;                                                                            // 336
                                                                                                                      //
			var _parseJsonQuery2 = this.parseJsonQuery(),                                                                      // 336
			    sort = _parseJsonQuery2.sort,                                                                                  // 336
			    fields = _parseJsonQuery2.fields,                                                                              // 336
			    query = _parseJsonQuery2.query;                                                                                // 336
                                                                                                                      //
			var ourQuery = Object.assign({}, query, {                                                                          // 340
				t: 'c'                                                                                                            // 340
			}); //Special check for the permissions                                                                            // 340
                                                                                                                      //
			if (RocketChat.authz.hasPermission(this.userId, 'view-joined-room')) {                                             // 343
				ourQuery.usernames = {                                                                                            // 344
					$in: [this.user.username]                                                                                        // 345
				};                                                                                                                // 344
			} else if (!RocketChat.authz.hasPermission(this.userId, 'view-c-room')) {                                          // 347
				return RocketChat.API.v1.unauthorized();                                                                          // 348
			}                                                                                                                  // 349
                                                                                                                      //
			var rooms = RocketChat.models.Rooms.find(ourQuery, {                                                               // 351
				sort: sort ? sort : {                                                                                             // 352
					name: 1                                                                                                          // 352
				},                                                                                                                // 352
				skip: offset,                                                                                                     // 353
				limit: count,                                                                                                     // 354
				fields: Object.assign({}, fields, RocketChat.API.v1.defaultFieldsToExclude)                                       // 355
			}).fetch();                                                                                                        // 351
			return RocketChat.API.v1.success({                                                                                 // 358
				channels: rooms,                                                                                                  // 359
				count: rooms.length,                                                                                              // 360
				offset: offset,                                                                                                   // 361
				total: RocketChat.models.Rooms.find(ourQuery).count()                                                             // 362
			});                                                                                                                // 358
		}                                                                                                                   // 364
	}                                                                                                                    // 334
});                                                                                                                   // 333
RocketChat.API.v1.addRoute('channels.list.joined', {                                                                  // 368
	authRequired: true                                                                                                   // 368
}, {                                                                                                                  // 368
	get: function () {                                                                                                   // 369
		var _getPaginationItems3 = this.getPaginationItems(),                                                               // 369
		    offset = _getPaginationItems3.offset,                                                                           // 369
		    count = _getPaginationItems3.count;                                                                             // 369
                                                                                                                      //
		var _parseJsonQuery3 = this.parseJsonQuery(),                                                                       // 369
		    sort = _parseJsonQuery3.sort,                                                                                   // 369
		    fields = _parseJsonQuery3.fields;                                                                               // 369
                                                                                                                      //
		var rooms = _.pluck(RocketChat.models.Subscriptions.findByTypeAndUserId('c', this.userId).fetch(), '_room');        // 372
                                                                                                                      //
		var totalCount = rooms.length;                                                                                      // 373
		rooms = RocketChat.models.Rooms.processQueryOptionsOnResult(rooms, {                                                // 375
			sort: sort ? sort : {                                                                                              // 376
				name: 1                                                                                                           // 376
			},                                                                                                                 // 376
			skip: offset,                                                                                                      // 377
			limit: count,                                                                                                      // 378
			fields: Object.assign({}, fields, RocketChat.API.v1.defaultFieldsToExclude)                                        // 379
		});                                                                                                                 // 375
		return RocketChat.API.v1.success({                                                                                  // 382
			channels: rooms,                                                                                                   // 383
			offset: offset,                                                                                                    // 384
			count: rooms.length,                                                                                               // 385
			total: totalCount                                                                                                  // 386
		});                                                                                                                 // 382
	}                                                                                                                    // 388
});                                                                                                                   // 368
RocketChat.API.v1.addRoute('channels.online', {                                                                       // 391
	authRequired: true                                                                                                   // 391
}, {                                                                                                                  // 391
	get: function () {                                                                                                   // 392
		var _parseJsonQuery4 = this.parseJsonQuery(),                                                                       // 392
		    query = _parseJsonQuery4.query;                                                                                 // 392
                                                                                                                      //
		var ourQuery = Object.assign({}, query, {                                                                           // 394
			t: 'c'                                                                                                             // 394
		});                                                                                                                 // 394
		var room = RocketChat.models.Rooms.findOne(ourQuery);                                                               // 396
                                                                                                                      //
		if (room == null) {                                                                                                 // 398
			return RocketChat.API.v1.failure('Channel does not exists');                                                       // 399
		}                                                                                                                   // 400
                                                                                                                      //
		var online = RocketChat.models.Users.findUsersNotOffline({                                                          // 402
			fields: {                                                                                                          // 403
				username: 1                                                                                                       // 404
			}                                                                                                                  // 403
		}).fetch();                                                                                                         // 402
		var onlineInRoom = [];                                                                                              // 408
		online.forEach(function (user) {                                                                                    // 409
			if (room.usernames.indexOf(user.username) !== -1) {                                                                // 410
				onlineInRoom.push({                                                                                               // 411
					_id: user._id,                                                                                                   // 412
					username: user.username                                                                                          // 413
				});                                                                                                               // 411
			}                                                                                                                  // 415
		});                                                                                                                 // 416
		return RocketChat.API.v1.success({                                                                                  // 418
			online: onlineInRoom                                                                                               // 419
		});                                                                                                                 // 418
	}                                                                                                                    // 421
});                                                                                                                   // 391
RocketChat.API.v1.addRoute('channels.open', {                                                                         // 424
	authRequired: true                                                                                                   // 424
}, {                                                                                                                  // 424
	post: function () {                                                                                                  // 425
		var findResult = findChannelByIdOrName({                                                                            // 426
			params: this.requestParams(),                                                                                      // 426
			checkedArchived: false                                                                                             // 426
		});                                                                                                                 // 426
		var sub = RocketChat.models.Subscriptions.findOneByRoomIdAndUserId(findResult._id, this.userId);                    // 428
                                                                                                                      //
		if (!sub) {                                                                                                         // 430
			return RocketChat.API.v1.failure("The user/callee is not in the channel \"" + findResult.name + "\".");            // 431
		}                                                                                                                   // 432
                                                                                                                      //
		if (sub.open) {                                                                                                     // 434
			return RocketChat.API.v1.failure("The channel, " + findResult.name + ", is already open to the sender");           // 435
		}                                                                                                                   // 436
                                                                                                                      //
		Meteor.runAsUser(this.userId, function () {                                                                         // 438
			Meteor.call('openRoom', findResult._id);                                                                           // 439
		});                                                                                                                 // 440
		return RocketChat.API.v1.success();                                                                                 // 442
	}                                                                                                                    // 443
});                                                                                                                   // 424
RocketChat.API.v1.addRoute('channels.removeModerator', {                                                              // 446
	authRequired: true                                                                                                   // 446
}, {                                                                                                                  // 446
	post: function () {                                                                                                  // 447
		var findResult = findChannelByIdOrName({                                                                            // 448
			params: this.requestParams()                                                                                       // 448
		});                                                                                                                 // 448
		var user = this.getUserFromParams();                                                                                // 450
		Meteor.runAsUser(this.userId, function () {                                                                         // 452
			Meteor.call('removeRoomModerator', findResult._id, user._id);                                                      // 453
		});                                                                                                                 // 454
		return RocketChat.API.v1.success();                                                                                 // 456
	}                                                                                                                    // 457
});                                                                                                                   // 446
RocketChat.API.v1.addRoute('channels.removeOwner', {                                                                  // 460
	authRequired: true                                                                                                   // 460
}, {                                                                                                                  // 460
	post: function () {                                                                                                  // 461
		var findResult = findChannelByIdOrName({                                                                            // 462
			params: this.requestParams()                                                                                       // 462
		});                                                                                                                 // 462
		var user = this.getUserFromParams();                                                                                // 464
		Meteor.runAsUser(this.userId, function () {                                                                         // 466
			Meteor.call('removeRoomOwner', findResult._id, user._id);                                                          // 467
		});                                                                                                                 // 468
		return RocketChat.API.v1.success();                                                                                 // 470
	}                                                                                                                    // 471
});                                                                                                                   // 460
RocketChat.API.v1.addRoute('channels.rename', {                                                                       // 474
	authRequired: true                                                                                                   // 474
}, {                                                                                                                  // 474
	post: function () {                                                                                                  // 475
		var _this4 = this;                                                                                                  // 475
                                                                                                                      //
		if (!this.bodyParams.name || !this.bodyParams.name.trim()) {                                                        // 476
			return RocketChat.API.v1.failure('The bodyParam "name" is required');                                              // 477
		}                                                                                                                   // 478
                                                                                                                      //
		var findResult = findChannelByIdOrName({                                                                            // 480
			params: {                                                                                                          // 480
				roomId: this.bodyParams.roomId                                                                                    // 480
			}                                                                                                                  // 480
		});                                                                                                                 // 480
                                                                                                                      //
		if (findResult.name === this.bodyParams.name) {                                                                     // 482
			return RocketChat.API.v1.failure('The channel name is the same as what it would be renamed to.');                  // 483
		}                                                                                                                   // 484
                                                                                                                      //
		Meteor.runAsUser(this.userId, function () {                                                                         // 486
			Meteor.call('saveRoomSettings', findResult._id, 'roomName', _this4.bodyParams.name);                               // 487
		});                                                                                                                 // 488
		return RocketChat.API.v1.success({                                                                                  // 490
			channel: RocketChat.models.Rooms.findOneById(findResult._id, {                                                     // 491
				fields: RocketChat.API.v1.defaultFieldsToExclude                                                                  // 491
			})                                                                                                                 // 491
		});                                                                                                                 // 490
	}                                                                                                                    // 493
});                                                                                                                   // 474
RocketChat.API.v1.addRoute('channels.setDescription', {                                                               // 496
	authRequired: true                                                                                                   // 496
}, {                                                                                                                  // 496
	post: function () {                                                                                                  // 497
		var _this5 = this;                                                                                                  // 497
                                                                                                                      //
		if (!this.bodyParams.description || !this.bodyParams.description.trim()) {                                          // 498
			return RocketChat.API.v1.failure('The bodyParam "description" is required');                                       // 499
		}                                                                                                                   // 500
                                                                                                                      //
		var findResult = findChannelByIdOrName({                                                                            // 502
			params: this.requestParams()                                                                                       // 502
		});                                                                                                                 // 502
                                                                                                                      //
		if (findResult.description === this.bodyParams.description) {                                                       // 504
			return RocketChat.API.v1.failure('The channel description is the same as what it would be changed to.');           // 505
		}                                                                                                                   // 506
                                                                                                                      //
		Meteor.runAsUser(this.userId, function () {                                                                         // 508
			Meteor.call('saveRoomSettings', findResult._id, 'roomDescription', _this5.bodyParams.description);                 // 509
		});                                                                                                                 // 510
		return RocketChat.API.v1.success({                                                                                  // 512
			description: this.bodyParams.description                                                                           // 513
		});                                                                                                                 // 512
	}                                                                                                                    // 515
});                                                                                                                   // 496
RocketChat.API.v1.addRoute('channels.setJoinCode', {                                                                  // 518
	authRequired: true                                                                                                   // 518
}, {                                                                                                                  // 518
	post: function () {                                                                                                  // 519
		var _this6 = this;                                                                                                  // 519
                                                                                                                      //
		if (!this.bodyParams.joinCode || !this.bodyParams.joinCode.trim()) {                                                // 520
			return RocketChat.API.v1.failure('The bodyParam "joinCode" is required');                                          // 521
		}                                                                                                                   // 522
                                                                                                                      //
		var findResult = findChannelByIdOrName({                                                                            // 524
			params: this.requestParams()                                                                                       // 524
		});                                                                                                                 // 524
		Meteor.runAsUser(this.userId, function () {                                                                         // 526
			Meteor.call('saveRoomSettings', findResult._id, 'joinCode', _this6.bodyParams.joinCode);                           // 527
		});                                                                                                                 // 528
		return RocketChat.API.v1.success({                                                                                  // 530
			channel: RocketChat.models.Rooms.findOneById(findResult._id, {                                                     // 531
				fields: RocketChat.API.v1.defaultFieldsToExclude                                                                  // 531
			})                                                                                                                 // 531
		});                                                                                                                 // 530
	}                                                                                                                    // 533
});                                                                                                                   // 518
RocketChat.API.v1.addRoute('channels.setPurpose', {                                                                   // 536
	authRequired: true                                                                                                   // 536
}, {                                                                                                                  // 536
	post: function () {                                                                                                  // 537
		var _this7 = this;                                                                                                  // 537
                                                                                                                      //
		if (!this.bodyParams.purpose || !this.bodyParams.purpose.trim()) {                                                  // 538
			return RocketChat.API.v1.failure('The bodyParam "purpose" is required');                                           // 539
		}                                                                                                                   // 540
                                                                                                                      //
		var findResult = findChannelByIdOrName({                                                                            // 542
			params: this.requestParams()                                                                                       // 542
		});                                                                                                                 // 542
                                                                                                                      //
		if (findResult.description === this.bodyParams.purpose) {                                                           // 544
			return RocketChat.API.v1.failure('The channel purpose (description) is the same as what it would be changed to.');
		}                                                                                                                   // 546
                                                                                                                      //
		Meteor.runAsUser(this.userId, function () {                                                                         // 548
			Meteor.call('saveRoomSettings', findResult._id, 'roomDescription', _this7.bodyParams.purpose);                     // 549
		});                                                                                                                 // 550
		return RocketChat.API.v1.success({                                                                                  // 552
			purpose: this.bodyParams.purpose                                                                                   // 553
		});                                                                                                                 // 552
	}                                                                                                                    // 555
});                                                                                                                   // 536
RocketChat.API.v1.addRoute('channels.setReadOnly', {                                                                  // 558
	authRequired: true                                                                                                   // 558
}, {                                                                                                                  // 558
	post: function () {                                                                                                  // 559
		var _this8 = this;                                                                                                  // 559
                                                                                                                      //
		if (typeof this.bodyParams.readOnly === 'undefined') {                                                              // 560
			return RocketChat.API.v1.failure('The bodyParam "readOnly" is required');                                          // 561
		}                                                                                                                   // 562
                                                                                                                      //
		var findResult = findChannelByIdOrName({                                                                            // 564
			params: this.requestParams()                                                                                       // 564
		});                                                                                                                 // 564
                                                                                                                      //
		if (findResult.ro === this.bodyParams.readOnly) {                                                                   // 566
			return RocketChat.API.v1.failure('The channel read only setting is the same as what it would be changed to.');     // 567
		}                                                                                                                   // 568
                                                                                                                      //
		Meteor.runAsUser(this.userId, function () {                                                                         // 570
			Meteor.call('saveRoomSettings', findResult._id, 'readOnly', _this8.bodyParams.readOnly);                           // 571
		});                                                                                                                 // 572
		return RocketChat.API.v1.success({                                                                                  // 574
			channel: RocketChat.models.Rooms.findOneById(findResult._id, {                                                     // 575
				fields: RocketChat.API.v1.defaultFieldsToExclude                                                                  // 575
			})                                                                                                                 // 575
		});                                                                                                                 // 574
	}                                                                                                                    // 577
});                                                                                                                   // 558
RocketChat.API.v1.addRoute('channels.setTopic', {                                                                     // 580
	authRequired: true                                                                                                   // 580
}, {                                                                                                                  // 580
	post: function () {                                                                                                  // 581
		var _this9 = this;                                                                                                  // 581
                                                                                                                      //
		if (!this.bodyParams.topic || !this.bodyParams.topic.trim()) {                                                      // 582
			return RocketChat.API.v1.failure('The bodyParam "topic" is required');                                             // 583
		}                                                                                                                   // 584
                                                                                                                      //
		var findResult = findChannelByIdOrName({                                                                            // 586
			params: this.requestParams()                                                                                       // 586
		});                                                                                                                 // 586
                                                                                                                      //
		if (findResult.topic === this.bodyParams.topic) {                                                                   // 588
			return RocketChat.API.v1.failure('The channel topic is the same as what it would be changed to.');                 // 589
		}                                                                                                                   // 590
                                                                                                                      //
		Meteor.runAsUser(this.userId, function () {                                                                         // 592
			Meteor.call('saveRoomSettings', findResult._id, 'roomTopic', _this9.bodyParams.topic);                             // 593
		});                                                                                                                 // 594
		return RocketChat.API.v1.success({                                                                                  // 596
			topic: this.bodyParams.topic                                                                                       // 597
		});                                                                                                                 // 596
	}                                                                                                                    // 599
});                                                                                                                   // 580
RocketChat.API.v1.addRoute('channels.setType', {                                                                      // 602
	authRequired: true                                                                                                   // 602
}, {                                                                                                                  // 602
	post: function () {                                                                                                  // 603
		var _this10 = this;                                                                                                 // 603
                                                                                                                      //
		if (!this.bodyParams.type || !this.bodyParams.type.trim()) {                                                        // 604
			return RocketChat.API.v1.failure('The bodyParam "type" is required');                                              // 605
		}                                                                                                                   // 606
                                                                                                                      //
		var findResult = findChannelByIdOrName({                                                                            // 608
			params: this.requestParams()                                                                                       // 608
		});                                                                                                                 // 608
                                                                                                                      //
		if (findResult.t === this.bodyParams.type) {                                                                        // 610
			return RocketChat.API.v1.failure('The channel type is the same as what it would be changed to.');                  // 611
		}                                                                                                                   // 612
                                                                                                                      //
		Meteor.runAsUser(this.userId, function () {                                                                         // 614
			Meteor.call('saveRoomSettings', findResult._id, 'roomType', _this10.bodyParams.type);                              // 615
		});                                                                                                                 // 616
		return RocketChat.API.v1.success({                                                                                  // 618
			channel: RocketChat.models.Rooms.findOneById(findResult._id, {                                                     // 619
				fields: RocketChat.API.v1.defaultFieldsToExclude                                                                  // 619
			})                                                                                                                 // 619
		});                                                                                                                 // 618
	}                                                                                                                    // 621
});                                                                                                                   // 602
RocketChat.API.v1.addRoute('channels.unarchive', {                                                                    // 624
	authRequired: true                                                                                                   // 624
}, {                                                                                                                  // 624
	post: function () {                                                                                                  // 625
		var findResult = findChannelByIdOrName({                                                                            // 626
			params: this.requestParams(),                                                                                      // 626
			checkedArchived: false                                                                                             // 626
		});                                                                                                                 // 626
                                                                                                                      //
		if (!findResult.archived) {                                                                                         // 628
			return RocketChat.API.v1.failure("The channel, " + findResult.name + ", is not archived");                         // 629
		}                                                                                                                   // 630
                                                                                                                      //
		Meteor.runAsUser(this.userId, function () {                                                                         // 632
			Meteor.call('unarchiveRoom', findResult._id);                                                                      // 633
		});                                                                                                                 // 634
		return RocketChat.API.v1.success();                                                                                 // 636
	}                                                                                                                    // 637
});                                                                                                                   // 624
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"chat.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_api/server/v1/chat.js                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* global processWebhookMessage */RocketChat.API.v1.addRoute('chat.delete', {                                         // 1
	authRequired: true                                                                                                   // 2
}, {                                                                                                                  // 2
	post: function () {                                                                                                  // 3
		check(this.bodyParams, Match.ObjectIncluding({                                                                      // 4
			msgId: String,                                                                                                     // 5
			roomId: String,                                                                                                    // 6
			asUser: Match.Maybe(Boolean)                                                                                       // 7
		}));                                                                                                                // 4
		var msg = RocketChat.models.Messages.findOneById(this.bodyParams.msgId, {                                           // 10
			fields: {                                                                                                          // 10
				u: 1,                                                                                                             // 10
				rid: 1                                                                                                            // 10
			}                                                                                                                  // 10
		});                                                                                                                 // 10
                                                                                                                      //
		if (!msg) {                                                                                                         // 12
			return RocketChat.API.v1.failure("No message found with the id of \"" + this.bodyParams.msgId + "\".");            // 13
		}                                                                                                                   // 14
                                                                                                                      //
		if (this.bodyParams.roomId !== msg.rid) {                                                                           // 16
			return RocketChat.API.v1.failure('The room id provided does not match where the message is from.');                // 17
		}                                                                                                                   // 18
                                                                                                                      //
		Meteor.runAsUser(this.bodyParams.asUser ? msg.u._id : this.userId, function () {                                    // 20
			Meteor.call('deleteMessage', {                                                                                     // 21
				_id: msg._id                                                                                                      // 21
			});                                                                                                                // 21
		});                                                                                                                 // 22
		return RocketChat.API.v1.success({                                                                                  // 24
			_id: msg._id,                                                                                                      // 25
			ts: Date.now()                                                                                                     // 26
		});                                                                                                                 // 24
	}                                                                                                                    // 28
});                                                                                                                   // 2
RocketChat.API.v1.addRoute('chat.getMessage', {                                                                       // 31
	authRequired: true                                                                                                   // 31
}, {                                                                                                                  // 31
	get: function () {                                                                                                   // 32
		var _this = this;                                                                                                   // 32
                                                                                                                      //
		if (!this.queryParams.msgId) {                                                                                      // 33
			return RocketChat.API.v1.failure('The "msgId" query parameter must be provided.');                                 // 34
		}                                                                                                                   // 35
                                                                                                                      //
		var msg = void 0;                                                                                                   // 38
		Meteor.runAsUser(this.userId, function () {                                                                         // 39
			msg = Meteor.call('getSingleMessage', _this.queryParams.msgId);                                                    // 40
		});                                                                                                                 // 41
                                                                                                                      //
		if (!msg) {                                                                                                         // 43
			return RocketChat.API.v1.failure();                                                                                // 44
		}                                                                                                                   // 45
                                                                                                                      //
		return RocketChat.API.v1.success({                                                                                  // 47
			message: msg                                                                                                       // 48
		});                                                                                                                 // 47
	}                                                                                                                    // 50
});                                                                                                                   // 31
RocketChat.API.v1.addRoute('chat.postMessage', {                                                                      // 53
	authRequired: true                                                                                                   // 53
}, {                                                                                                                  // 53
	post: function () {                                                                                                  // 54
		var messageReturn = processWebhookMessage(this.bodyParams, this.user)[0];                                           // 55
                                                                                                                      //
		if (!messageReturn) {                                                                                               // 57
			return RocketChat.API.v1.failure('unknown-error');                                                                 // 58
		}                                                                                                                   // 59
                                                                                                                      //
		return RocketChat.API.v1.success({                                                                                  // 61
			ts: Date.now(),                                                                                                    // 62
			channel: messageReturn.channel,                                                                                    // 63
			message: messageReturn.message                                                                                     // 64
		});                                                                                                                 // 61
	}                                                                                                                    // 66
});                                                                                                                   // 53
RocketChat.API.v1.addRoute('chat.update', {                                                                           // 69
	authRequired: true                                                                                                   // 69
}, {                                                                                                                  // 69
	post: function () {                                                                                                  // 70
		var _this2 = this;                                                                                                  // 70
                                                                                                                      //
		check(this.bodyParams, Match.ObjectIncluding({                                                                      // 71
			roomId: String,                                                                                                    // 72
			msgId: String,                                                                                                     // 73
			text: String //Using text to be consistant with chat.postMessage                                                   // 74
                                                                                                                      //
		}));                                                                                                                // 71
		var msg = RocketChat.models.Messages.findOneById(this.bodyParams.msgId); //Ensure the message exists                // 77
                                                                                                                      //
		if (!msg) {                                                                                                         // 80
			return RocketChat.API.v1.failure("No message found with the id of \"" + this.bodyParams.msgId + "\".");            // 81
		}                                                                                                                   // 82
                                                                                                                      //
		if (this.bodyParams.roomId !== msg.rid) {                                                                           // 84
			return RocketChat.API.v1.failure('The room id provided does not match where the message is from.');                // 85
		} //Permission checks are already done in the updateMessage method, so no need to duplicate them                    // 86
                                                                                                                      //
                                                                                                                      //
		Meteor.runAsUser(this.userId, function () {                                                                         // 89
			Meteor.call('updateMessage', {                                                                                     // 90
				_id: msg._id,                                                                                                     // 90
				msg: _this2.bodyParams.text,                                                                                      // 90
				rid: msg.rid                                                                                                      // 90
			});                                                                                                                // 90
		});                                                                                                                 // 92
		return RocketChat.API.v1.success({                                                                                  // 94
			message: RocketChat.models.Messages.findOneById(msg._id)                                                           // 95
		});                                                                                                                 // 94
	}                                                                                                                    // 97
});                                                                                                                   // 69
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"groups.js":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_api/server/v1/groups.js                                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _typeof2 = require("babel-runtime/helpers/typeof");                                                               //
                                                                                                                      //
var _typeof3 = _interopRequireDefault(_typeof2);                                                                      //
                                                                                                                      //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                     //
                                                                                                                      //
//Returns the private group subscription IF found otherwise it will return the failure of why it didn't. Check the `statusCode` property
function findPrivateGroupByIdOrName(_ref) {                                                                           // 2
	var params = _ref.params,                                                                                            // 2
	    userId = _ref.userId,                                                                                            // 2
	    _ref$checkedArchived = _ref.checkedArchived,                                                                     // 2
	    checkedArchived = _ref$checkedArchived === undefined ? true : _ref$checkedArchived;                              // 2
                                                                                                                      //
	if ((!params.roomId || !params.roomId.trim()) && (!params.roomName || !params.roomName.trim())) {                    // 3
		throw new Meteor.Error('error-roomid-param-not-provided', 'The parameter "roomId" or "roomName" is required');      // 4
	}                                                                                                                    // 5
                                                                                                                      //
	var roomSub = void 0;                                                                                                // 7
                                                                                                                      //
	if (params.roomId) {                                                                                                 // 8
		roomSub = RocketChat.models.Subscriptions.findOneByRoomIdAndUserId(params.roomId, userId);                          // 9
	} else if (params.roomName) {                                                                                        // 10
		roomSub = RocketChat.models.Subscriptions.findOneByRoomNameAndUserId(params.roomName, userId);                      // 11
	}                                                                                                                    // 12
                                                                                                                      //
	if (!roomSub || roomSub.t !== 'p') {                                                                                 // 14
		throw new Meteor.Error('error-room-not-found', 'The required "roomId" or "roomName" param provided does not match any group');
	}                                                                                                                    // 16
                                                                                                                      //
	if (checkedArchived && roomSub.archived) {                                                                           // 18
		throw new Meteor.Error('error-room-archived', "The private group, " + roomSub.name + ", is archived");              // 19
	}                                                                                                                    // 20
                                                                                                                      //
	return roomSub;                                                                                                      // 22
}                                                                                                                     // 23
                                                                                                                      //
RocketChat.API.v1.addRoute('groups.addAll', {                                                                         // 25
	authRequired: true                                                                                                   // 25
}, {                                                                                                                  // 25
	post: function () {                                                                                                  // 26
		var _this = this;                                                                                                   // 26
                                                                                                                      //
		var findResult = findPrivateGroupByIdOrName({                                                                       // 27
			params: this.requestParams(),                                                                                      // 27
			userId: this.userId                                                                                                // 27
		});                                                                                                                 // 27
		Meteor.runAsUser(this.userId, function () {                                                                         // 29
			Meteor.call('addAllUserToRoom', findResult.rid, _this.bodyParams.activeUsersOnly);                                 // 30
		});                                                                                                                 // 31
		return RocketChat.API.v1.success({                                                                                  // 33
			group: RocketChat.models.Rooms.findOneById(findResult.rid, {                                                       // 34
				fields: RocketChat.API.v1.defaultFieldsToExclude                                                                  // 34
			})                                                                                                                 // 34
		});                                                                                                                 // 33
	}                                                                                                                    // 36
});                                                                                                                   // 25
RocketChat.API.v1.addRoute('groups.addModerator', {                                                                   // 39
	authRequired: true                                                                                                   // 39
}, {                                                                                                                  // 39
	post: function () {                                                                                                  // 40
		var findResult = findPrivateGroupByIdOrName({                                                                       // 41
			params: this.requestParams(),                                                                                      // 41
			userId: this.userId                                                                                                // 41
		});                                                                                                                 // 41
		var user = this.getUserFromParams();                                                                                // 43
		Meteor.runAsUser(this.userId, function () {                                                                         // 45
			Meteor.call('addRoomModerator', findResult.rid, user._id);                                                         // 46
		});                                                                                                                 // 47
		return RocketChat.API.v1.success();                                                                                 // 49
	}                                                                                                                    // 50
});                                                                                                                   // 39
RocketChat.API.v1.addRoute('groups.addOwner', {                                                                       // 53
	authRequired: true                                                                                                   // 53
}, {                                                                                                                  // 53
	post: function () {                                                                                                  // 54
		var findResult = findPrivateGroupByIdOrName({                                                                       // 55
			params: this.requestParams(),                                                                                      // 55
			userId: this.userId                                                                                                // 55
		});                                                                                                                 // 55
		var user = this.getUserFromParams();                                                                                // 57
		Meteor.runAsUser(this.userId, function () {                                                                         // 59
			Meteor.call('addRoomOwner', findResult.rid, user._id);                                                             // 60
		});                                                                                                                 // 61
		return RocketChat.API.v1.success();                                                                                 // 63
	}                                                                                                                    // 64
});                                                                                                                   // 53
RocketChat.API.v1.addRoute('groups.addLeader', {                                                                      // 67
	authRequired: true                                                                                                   // 67
}, {                                                                                                                  // 67
	post: function () {                                                                                                  // 68
		var findResult = findPrivateGroupByIdOrName({                                                                       // 69
			params: this.requestParams(),                                                                                      // 69
			userId: this.userId                                                                                                // 69
		});                                                                                                                 // 69
		var user = this.getUserFromParams();                                                                                // 70
		Meteor.runAsUser(this.userId, function () {                                                                         // 71
			Meteor.call('addRoomLeader', findResult.rid, user._id);                                                            // 72
		});                                                                                                                 // 73
		return RocketChat.API.v1.success();                                                                                 // 75
	}                                                                                                                    // 76
}); //Archives a private group only if it wasn't                                                                      // 67
                                                                                                                      //
RocketChat.API.v1.addRoute('groups.archive', {                                                                        // 80
	authRequired: true                                                                                                   // 80
}, {                                                                                                                  // 80
	post: function () {                                                                                                  // 81
		var findResult = findPrivateGroupByIdOrName({                                                                       // 82
			params: this.requestParams(),                                                                                      // 82
			userId: this.userId                                                                                                // 82
		});                                                                                                                 // 82
		Meteor.runAsUser(this.userId, function () {                                                                         // 84
			Meteor.call('archiveRoom', findResult.rid);                                                                        // 85
		});                                                                                                                 // 86
		return RocketChat.API.v1.success();                                                                                 // 88
	}                                                                                                                    // 89
});                                                                                                                   // 80
RocketChat.API.v1.addRoute('groups.close', {                                                                          // 92
	authRequired: true                                                                                                   // 92
}, {                                                                                                                  // 92
	post: function () {                                                                                                  // 93
		var findResult = findPrivateGroupByIdOrName({                                                                       // 94
			params: this.requestParams(),                                                                                      // 94
			userId: this.userId,                                                                                               // 94
			checkedArchived: false                                                                                             // 94
		});                                                                                                                 // 94
                                                                                                                      //
		if (!findResult.open) {                                                                                             // 96
			return RocketChat.API.v1.failure("The private group, " + findResult.name + ", is already closed to the sender");   // 97
		}                                                                                                                   // 98
                                                                                                                      //
		Meteor.runAsUser(this.userId, function () {                                                                         // 100
			Meteor.call('hideRoom', findResult.rid);                                                                           // 101
		});                                                                                                                 // 102
		return RocketChat.API.v1.success();                                                                                 // 104
	}                                                                                                                    // 105
}); //Create Private Group                                                                                            // 92
                                                                                                                      //
RocketChat.API.v1.addRoute('groups.create', {                                                                         // 109
	authRequired: true                                                                                                   // 109
}, {                                                                                                                  // 109
	post: function () {                                                                                                  // 110
		var _this2 = this;                                                                                                  // 110
                                                                                                                      //
		if (!RocketChat.authz.hasPermission(this.userId, 'create-p')) {                                                     // 111
			return RocketChat.API.v1.unauthorized();                                                                           // 112
		}                                                                                                                   // 113
                                                                                                                      //
		if (!this.bodyParams.name) {                                                                                        // 115
			return RocketChat.API.v1.failure('Body param "name" is required');                                                 // 116
		}                                                                                                                   // 117
                                                                                                                      //
		if (this.bodyParams.members && !_.isArray(this.bodyParams.members)) {                                               // 119
			return RocketChat.API.v1.failure('Body param "members" must be an array if provided');                             // 120
		}                                                                                                                   // 121
                                                                                                                      //
		if (this.bodyParams.customFields && !((0, _typeof3.default)(this.bodyParams.customFields) === 'object')) {          // 123
			return RocketChat.API.v1.failure('Body param "customFields" must be an object if provided');                       // 124
		}                                                                                                                   // 125
                                                                                                                      //
		var readOnly = false;                                                                                               // 127
                                                                                                                      //
		if (typeof this.bodyParams.readOnly !== 'undefined') {                                                              // 128
			readOnly = this.bodyParams.readOnly;                                                                               // 129
		}                                                                                                                   // 130
                                                                                                                      //
		var id = void 0;                                                                                                    // 132
		Meteor.runAsUser(this.userId, function () {                                                                         // 133
			id = Meteor.call('createPrivateGroup', _this2.bodyParams.name, _this2.bodyParams.members ? _this2.bodyParams.members : [], readOnly, _this2.bodyParams.customFields);
		});                                                                                                                 // 135
		return RocketChat.API.v1.success({                                                                                  // 137
			group: RocketChat.models.Rooms.findOneById(id.rid, {                                                               // 138
				fields: RocketChat.API.v1.defaultFieldsToExclude                                                                  // 138
			})                                                                                                                 // 138
		});                                                                                                                 // 137
	}                                                                                                                    // 140
});                                                                                                                   // 109
RocketChat.API.v1.addRoute('groups.delete', {                                                                         // 143
	authRequired: true                                                                                                   // 143
}, {                                                                                                                  // 143
	post: function () {                                                                                                  // 144
		var findResult = findPrivateGroupByIdOrName({                                                                       // 145
			params: this.requestParams(),                                                                                      // 145
			userId: this.userId,                                                                                               // 145
			checkedArchived: false                                                                                             // 145
		});                                                                                                                 // 145
		Meteor.runAsUser(this.userId, function () {                                                                         // 147
			Meteor.call('eraseRoom', findResult.rid);                                                                          // 148
		});                                                                                                                 // 149
		return RocketChat.API.v1.success({                                                                                  // 151
			group: RocketChat.models.Rooms.processQueryOptionsOnResult([findResult._room], {                                   // 152
				fields: RocketChat.API.v1.defaultFieldsToExclude                                                                  // 152
			})[0]                                                                                                              // 152
		});                                                                                                                 // 151
	}                                                                                                                    // 154
});                                                                                                                   // 143
RocketChat.API.v1.addRoute('groups.getIntegrations', {                                                                // 157
	authRequired: true                                                                                                   // 157
}, {                                                                                                                  // 157
	get: function () {                                                                                                   // 158
		if (!RocketChat.authz.hasPermission(this.userId, 'manage-integrations')) {                                          // 159
			return RocketChat.API.v1.unauthorized();                                                                           // 160
		}                                                                                                                   // 161
                                                                                                                      //
		var findResult = findPrivateGroupByIdOrName({                                                                       // 163
			params: this.requestParams(),                                                                                      // 163
			userId: this.userId,                                                                                               // 163
			checkedArchived: false                                                                                             // 163
		});                                                                                                                 // 163
		var includeAllPrivateGroups = true;                                                                                 // 165
                                                                                                                      //
		if (typeof this.queryParams.includeAllPrivateGroups !== 'undefined') {                                              // 166
			includeAllPrivateGroups = this.queryParams.includeAllPrivateGroups === 'true';                                     // 167
		}                                                                                                                   // 168
                                                                                                                      //
		var channelsToSearch = ["#" + findResult.name];                                                                     // 170
                                                                                                                      //
		if (includeAllPrivateGroups) {                                                                                      // 171
			channelsToSearch.push('all_private_groups');                                                                       // 172
		}                                                                                                                   // 173
                                                                                                                      //
		var _getPaginationItems = this.getPaginationItems(),                                                                // 158
		    offset = _getPaginationItems.offset,                                                                            // 158
		    count = _getPaginationItems.count;                                                                              // 158
                                                                                                                      //
		var _parseJsonQuery = this.parseJsonQuery(),                                                                        // 158
		    sort = _parseJsonQuery.sort,                                                                                    // 158
		    fields = _parseJsonQuery.fields,                                                                                // 158
		    query = _parseJsonQuery.query;                                                                                  // 158
                                                                                                                      //
		var ourQuery = Object.assign({}, query, {                                                                           // 178
			channel: {                                                                                                         // 178
				$in: channelsToSearch                                                                                             // 178
			}                                                                                                                  // 178
		});                                                                                                                 // 178
		var integrations = RocketChat.models.Integrations.find(ourQuery, {                                                  // 179
			sort: sort ? sort : {                                                                                              // 180
				_createdAt: 1                                                                                                     // 180
			},                                                                                                                 // 180
			skip: offset,                                                                                                      // 181
			limit: count,                                                                                                      // 182
			fields: Object.assign({}, fields, RocketChat.API.v1.defaultFieldsToExclude)                                        // 183
		}).fetch();                                                                                                         // 179
		return RocketChat.API.v1.success({                                                                                  // 186
			integrations: integrations,                                                                                        // 187
			count: integrations.length,                                                                                        // 188
			offset: offset,                                                                                                    // 189
			total: RocketChat.models.Integrations.find(ourQuery).count()                                                       // 190
		});                                                                                                                 // 186
	}                                                                                                                    // 192
});                                                                                                                   // 157
RocketChat.API.v1.addRoute('groups.history', {                                                                        // 195
	authRequired: true                                                                                                   // 195
}, {                                                                                                                  // 195
	get: function () {                                                                                                   // 196
		var findResult = findPrivateGroupByIdOrName({                                                                       // 197
			params: this.requestParams(),                                                                                      // 197
			userId: this.userId,                                                                                               // 197
			checkedArchived: false                                                                                             // 197
		});                                                                                                                 // 197
		var latestDate = new Date();                                                                                        // 199
                                                                                                                      //
		if (this.queryParams.latest) {                                                                                      // 200
			latestDate = new Date(this.queryParams.latest);                                                                    // 201
		}                                                                                                                   // 202
                                                                                                                      //
		var oldestDate = undefined;                                                                                         // 204
                                                                                                                      //
		if (this.queryParams.oldest) {                                                                                      // 205
			oldestDate = new Date(this.queryParams.oldest);                                                                    // 206
		}                                                                                                                   // 207
                                                                                                                      //
		var inclusive = false;                                                                                              // 209
                                                                                                                      //
		if (this.queryParams.inclusive) {                                                                                   // 210
			inclusive = this.queryParams.inclusive;                                                                            // 211
		}                                                                                                                   // 212
                                                                                                                      //
		var count = 20;                                                                                                     // 214
                                                                                                                      //
		if (this.queryParams.count) {                                                                                       // 215
			count = parseInt(this.queryParams.count);                                                                          // 216
		}                                                                                                                   // 217
                                                                                                                      //
		var unreads = false;                                                                                                // 219
                                                                                                                      //
		if (this.queryParams.unreads) {                                                                                     // 220
			unreads = this.queryParams.unreads;                                                                                // 221
		}                                                                                                                   // 222
                                                                                                                      //
		var result = void 0;                                                                                                // 224
		Meteor.runAsUser(this.userId, function () {                                                                         // 225
			result = Meteor.call('getChannelHistory', {                                                                        // 226
				rid: findResult.rid,                                                                                              // 226
				latest: latestDate,                                                                                               // 226
				oldest: oldestDate,                                                                                               // 226
				inclusive: inclusive,                                                                                             // 226
				count: count,                                                                                                     // 226
				unreads: unreads                                                                                                  // 226
			});                                                                                                                // 226
		});                                                                                                                 // 227
		return RocketChat.API.v1.success({                                                                                  // 229
			messages: result && result.messages ? result.messages : []                                                         // 230
		});                                                                                                                 // 229
	}                                                                                                                    // 232
});                                                                                                                   // 195
RocketChat.API.v1.addRoute('groups.info', {                                                                           // 235
	authRequired: true                                                                                                   // 235
}, {                                                                                                                  // 235
	get: function () {                                                                                                   // 236
		var findResult = findPrivateGroupByIdOrName({                                                                       // 237
			params: this.requestParams(),                                                                                      // 237
			userId: this.userId,                                                                                               // 237
			checkedArchived: false                                                                                             // 237
		});                                                                                                                 // 237
		return RocketChat.API.v1.success({                                                                                  // 239
			group: RocketChat.models.Rooms.findOneById(findResult.rid, {                                                       // 240
				fields: RocketChat.API.v1.defaultFieldsToExclude                                                                  // 240
			})                                                                                                                 // 240
		});                                                                                                                 // 239
	}                                                                                                                    // 242
});                                                                                                                   // 235
RocketChat.API.v1.addRoute('groups.invite', {                                                                         // 245
	authRequired: true                                                                                                   // 245
}, {                                                                                                                  // 245
	post: function () {                                                                                                  // 246
		var findResult = findPrivateGroupByIdOrName({                                                                       // 247
			params: this.requestParams(),                                                                                      // 247
			userId: this.userId                                                                                                // 247
		});                                                                                                                 // 247
		var user = this.getUserFromParams();                                                                                // 249
		Meteor.runAsUser(this.userId, function () {                                                                         // 251
			Meteor.call('addUserToRoom', {                                                                                     // 252
				rid: findResult.rid,                                                                                              // 252
				username: user.username                                                                                           // 252
			});                                                                                                                // 252
		});                                                                                                                 // 253
		return RocketChat.API.v1.success({                                                                                  // 255
			group: RocketChat.models.Rooms.findOneById(findResult.rid, {                                                       // 256
				fields: RocketChat.API.v1.defaultFieldsToExclude                                                                  // 256
			})                                                                                                                 // 256
		});                                                                                                                 // 255
	}                                                                                                                    // 258
});                                                                                                                   // 245
RocketChat.API.v1.addRoute('groups.kick', {                                                                           // 261
	authRequired: true                                                                                                   // 261
}, {                                                                                                                  // 261
	post: function () {                                                                                                  // 262
		var findResult = findPrivateGroupByIdOrName({                                                                       // 263
			params: this.requestParams(),                                                                                      // 263
			userId: this.userId                                                                                                // 263
		});                                                                                                                 // 263
		var user = this.getUserFromParams();                                                                                // 265
		Meteor.runAsUser(this.userId, function () {                                                                         // 267
			Meteor.call('removeUserFromRoom', {                                                                                // 268
				rid: findResult.rid,                                                                                              // 268
				username: user.username                                                                                           // 268
			});                                                                                                                // 268
		});                                                                                                                 // 269
		return RocketChat.API.v1.success();                                                                                 // 271
	}                                                                                                                    // 272
});                                                                                                                   // 261
RocketChat.API.v1.addRoute('groups.leave', {                                                                          // 275
	authRequired: true                                                                                                   // 275
}, {                                                                                                                  // 275
	post: function () {                                                                                                  // 276
		var findResult = findPrivateGroupByIdOrName({                                                                       // 277
			params: this.requestParams(),                                                                                      // 277
			userId: this.userId                                                                                                // 277
		});                                                                                                                 // 277
		Meteor.runAsUser(this.userId, function () {                                                                         // 279
			Meteor.call('leaveRoom', findResult.rid);                                                                          // 280
		});                                                                                                                 // 281
		return RocketChat.API.v1.success();                                                                                 // 283
	}                                                                                                                    // 284
}); //List Private Groups a user has access to                                                                        // 275
                                                                                                                      //
RocketChat.API.v1.addRoute('groups.list', {                                                                           // 288
	authRequired: true                                                                                                   // 288
}, {                                                                                                                  // 288
	get: function () {                                                                                                   // 289
		var _getPaginationItems2 = this.getPaginationItems(),                                                               // 289
		    offset = _getPaginationItems2.offset,                                                                           // 289
		    count = _getPaginationItems2.count;                                                                             // 289
                                                                                                                      //
		var _parseJsonQuery2 = this.parseJsonQuery(),                                                                       // 289
		    sort = _parseJsonQuery2.sort,                                                                                   // 289
		    fields = _parseJsonQuery2.fields;                                                                               // 289
                                                                                                                      //
		var rooms = _.pluck(RocketChat.models.Subscriptions.findByTypeAndUserId('p', this.userId).fetch(), '_room');        // 292
                                                                                                                      //
		var totalCount = rooms.length;                                                                                      // 293
		rooms = RocketChat.models.Rooms.processQueryOptionsOnResult(rooms, {                                                // 295
			sort: sort ? sort : {                                                                                              // 296
				name: 1                                                                                                           // 296
			},                                                                                                                 // 296
			skip: offset,                                                                                                      // 297
			limit: count,                                                                                                      // 298
			fields: Object.assign({}, fields, RocketChat.API.v1.defaultFieldsToExclude)                                        // 299
		});                                                                                                                 // 295
		return RocketChat.API.v1.success({                                                                                  // 302
			groups: rooms,                                                                                                     // 303
			offset: offset,                                                                                                    // 304
			count: rooms.length,                                                                                               // 305
			total: totalCount                                                                                                  // 306
		});                                                                                                                 // 302
	}                                                                                                                    // 308
});                                                                                                                   // 288
RocketChat.API.v1.addRoute('groups.online', {                                                                         // 311
	authRequired: true                                                                                                   // 311
}, {                                                                                                                  // 311
	get: function () {                                                                                                   // 312
		var _parseJsonQuery3 = this.parseJsonQuery(),                                                                       // 312
		    query = _parseJsonQuery3.query;                                                                                 // 312
                                                                                                                      //
		var ourQuery = Object.assign({}, query, {                                                                           // 314
			t: 'p'                                                                                                             // 314
		});                                                                                                                 // 314
		var room = RocketChat.models.Rooms.findOne(ourQuery);                                                               // 316
                                                                                                                      //
		if (room == null) {                                                                                                 // 318
			return RocketChat.API.v1.failure('Group does not exists');                                                         // 319
		}                                                                                                                   // 320
                                                                                                                      //
		var online = RocketChat.models.Users.findUsersNotOffline({                                                          // 322
			fields: {                                                                                                          // 323
				username: 1                                                                                                       // 324
			}                                                                                                                  // 323
		}).fetch();                                                                                                         // 322
		var onlineInRoom = [];                                                                                              // 328
		online.forEach(function (user) {                                                                                    // 329
			if (room.usernames.indexOf(user.username) !== -1) {                                                                // 330
				onlineInRoom.push({                                                                                               // 331
					_id: user._id,                                                                                                   // 332
					username: user.username                                                                                          // 333
				});                                                                                                               // 331
			}                                                                                                                  // 335
		});                                                                                                                 // 336
		return RocketChat.API.v1.success({                                                                                  // 338
			online: onlineInRoom                                                                                               // 339
		});                                                                                                                 // 338
	}                                                                                                                    // 341
});                                                                                                                   // 311
RocketChat.API.v1.addRoute('groups.open', {                                                                           // 344
	authRequired: true                                                                                                   // 344
}, {                                                                                                                  // 344
	post: function () {                                                                                                  // 345
		var findResult = findPrivateGroupByIdOrName({                                                                       // 346
			params: this.requestParams(),                                                                                      // 346
			userId: this.userId,                                                                                               // 346
			checkedArchived: false                                                                                             // 346
		});                                                                                                                 // 346
                                                                                                                      //
		if (findResult.open) {                                                                                              // 348
			return RocketChat.API.v1.failure("The private group, " + findResult.name + ", is already open for the sender");    // 349
		}                                                                                                                   // 350
                                                                                                                      //
		Meteor.runAsUser(this.userId, function () {                                                                         // 352
			Meteor.call('openRoom', findResult.rid);                                                                           // 353
		});                                                                                                                 // 354
		return RocketChat.API.v1.success();                                                                                 // 356
	}                                                                                                                    // 357
});                                                                                                                   // 344
RocketChat.API.v1.addRoute('groups.removeModerator', {                                                                // 360
	authRequired: true                                                                                                   // 360
}, {                                                                                                                  // 360
	post: function () {                                                                                                  // 361
		var findResult = findPrivateGroupByIdOrName({                                                                       // 362
			params: this.requestParams(),                                                                                      // 362
			userId: this.userId                                                                                                // 362
		});                                                                                                                 // 362
		var user = this.getUserFromParams();                                                                                // 364
		Meteor.runAsUser(this.userId, function () {                                                                         // 366
			Meteor.call('removeRoomModerator', findResult.rid, user._id);                                                      // 367
		});                                                                                                                 // 368
		return RocketChat.API.v1.success();                                                                                 // 370
	}                                                                                                                    // 371
});                                                                                                                   // 360
RocketChat.API.v1.addRoute('groups.removeOwner', {                                                                    // 374
	authRequired: true                                                                                                   // 374
}, {                                                                                                                  // 374
	post: function () {                                                                                                  // 375
		var findResult = findPrivateGroupByIdOrName({                                                                       // 376
			params: this.requestParams(),                                                                                      // 376
			userId: this.userId                                                                                                // 376
		});                                                                                                                 // 376
		var user = this.getUserFromParams();                                                                                // 378
		Meteor.runAsUser(this.userId, function () {                                                                         // 380
			Meteor.call('removeRoomOwner', findResult.rid, user._id);                                                          // 381
		});                                                                                                                 // 382
		return RocketChat.API.v1.success();                                                                                 // 384
	}                                                                                                                    // 385
});                                                                                                                   // 374
RocketChat.API.v1.addRoute('groups.removeLeader', {                                                                   // 388
	authRequired: true                                                                                                   // 388
}, {                                                                                                                  // 388
	post: function () {                                                                                                  // 389
		var findResult = findPrivateGroupByIdOrName({                                                                       // 390
			params: this.requestParams(),                                                                                      // 390
			userId: this.userId                                                                                                // 390
		});                                                                                                                 // 390
		var user = this.getUserFromParams();                                                                                // 392
		Meteor.runAsUser(this.userId, function () {                                                                         // 394
			Meteor.call('removeRoomLeader', findResult.rid, user._id);                                                         // 395
		});                                                                                                                 // 396
		return RocketChat.API.v1.success();                                                                                 // 398
	}                                                                                                                    // 399
});                                                                                                                   // 388
RocketChat.API.v1.addRoute('groups.rename', {                                                                         // 402
	authRequired: true                                                                                                   // 402
}, {                                                                                                                  // 402
	post: function () {                                                                                                  // 403
		var _this3 = this;                                                                                                  // 403
                                                                                                                      //
		if (!this.bodyParams.name || !this.bodyParams.name.trim()) {                                                        // 404
			return RocketChat.API.v1.failure('The bodyParam "name" is required');                                              // 405
		}                                                                                                                   // 406
                                                                                                                      //
		var findResult = findPrivateGroupByIdOrName({                                                                       // 408
			params: {                                                                                                          // 408
				roomId: this.bodyParams.roomId                                                                                    // 408
			},                                                                                                                 // 408
			userId: this.userId                                                                                                // 408
		});                                                                                                                 // 408
		Meteor.runAsUser(this.userId, function () {                                                                         // 410
			Meteor.call('saveRoomSettings', findResult.rid, 'roomName', _this3.bodyParams.name);                               // 411
		});                                                                                                                 // 412
		return RocketChat.API.v1.success({                                                                                  // 414
			group: RocketChat.models.Rooms.findOneById(findResult.rid, {                                                       // 415
				fields: RocketChat.API.v1.defaultFieldsToExclude                                                                  // 415
			})                                                                                                                 // 415
		});                                                                                                                 // 414
	}                                                                                                                    // 417
});                                                                                                                   // 402
RocketChat.API.v1.addRoute('groups.setDescription', {                                                                 // 420
	authRequired: true                                                                                                   // 420
}, {                                                                                                                  // 420
	post: function () {                                                                                                  // 421
		var _this4 = this;                                                                                                  // 421
                                                                                                                      //
		if (!this.bodyParams.description || !this.bodyParams.description.trim()) {                                          // 422
			return RocketChat.API.v1.failure('The bodyParam "description" is required');                                       // 423
		}                                                                                                                   // 424
                                                                                                                      //
		var findResult = findPrivateGroupByIdOrName({                                                                       // 426
			params: this.requestParams(),                                                                                      // 426
			userId: this.userId                                                                                                // 426
		});                                                                                                                 // 426
		Meteor.runAsUser(this.userId, function () {                                                                         // 428
			Meteor.call('saveRoomSettings', findResult.rid, 'roomDescription', _this4.bodyParams.description);                 // 429
		});                                                                                                                 // 430
		return RocketChat.API.v1.success({                                                                                  // 432
			description: this.bodyParams.description                                                                           // 433
		});                                                                                                                 // 432
	}                                                                                                                    // 435
});                                                                                                                   // 420
RocketChat.API.v1.addRoute('groups.setPurpose', {                                                                     // 438
	authRequired: true                                                                                                   // 438
}, {                                                                                                                  // 438
	post: function () {                                                                                                  // 439
		var _this5 = this;                                                                                                  // 439
                                                                                                                      //
		if (!this.bodyParams.purpose || !this.bodyParams.purpose.trim()) {                                                  // 440
			return RocketChat.API.v1.failure('The bodyParam "purpose" is required');                                           // 441
		}                                                                                                                   // 442
                                                                                                                      //
		var findResult = findPrivateGroupByIdOrName({                                                                       // 444
			params: this.requestParams(),                                                                                      // 444
			userId: this.userId                                                                                                // 444
		});                                                                                                                 // 444
		Meteor.runAsUser(this.userId, function () {                                                                         // 446
			Meteor.call('saveRoomSettings', findResult.rid, 'roomDescription', _this5.bodyParams.purpose);                     // 447
		});                                                                                                                 // 448
		return RocketChat.API.v1.success({                                                                                  // 450
			purpose: this.bodyParams.purpose                                                                                   // 451
		});                                                                                                                 // 450
	}                                                                                                                    // 453
});                                                                                                                   // 438
RocketChat.API.v1.addRoute('groups.setReadOnly', {                                                                    // 456
	authRequired: true                                                                                                   // 456
}, {                                                                                                                  // 456
	post: function () {                                                                                                  // 457
		var _this6 = this;                                                                                                  // 457
                                                                                                                      //
		if (typeof this.bodyParams.readOnly === 'undefined') {                                                              // 458
			return RocketChat.API.v1.failure('The bodyParam "readOnly" is required');                                          // 459
		}                                                                                                                   // 460
                                                                                                                      //
		var findResult = findPrivateGroupByIdOrName({                                                                       // 462
			params: this.requestParams(),                                                                                      // 462
			userId: this.userId                                                                                                // 462
		});                                                                                                                 // 462
                                                                                                                      //
		if (findResult.ro === this.bodyParams.readOnly) {                                                                   // 464
			return RocketChat.API.v1.failure('The private group read only setting is the same as what it would be changed to.');
		}                                                                                                                   // 466
                                                                                                                      //
		Meteor.runAsUser(this.userId, function () {                                                                         // 468
			Meteor.call('saveRoomSettings', findResult.rid, 'readOnly', _this6.bodyParams.readOnly);                           // 469
		});                                                                                                                 // 470
		return RocketChat.API.v1.success({                                                                                  // 472
			group: RocketChat.models.Rooms.findOneById(findResult.rid, {                                                       // 473
				fields: RocketChat.API.v1.defaultFieldsToExclude                                                                  // 473
			})                                                                                                                 // 473
		});                                                                                                                 // 472
	}                                                                                                                    // 475
});                                                                                                                   // 456
RocketChat.API.v1.addRoute('groups.setTopic', {                                                                       // 478
	authRequired: true                                                                                                   // 478
}, {                                                                                                                  // 478
	post: function () {                                                                                                  // 479
		var _this7 = this;                                                                                                  // 479
                                                                                                                      //
		if (!this.bodyParams.topic || !this.bodyParams.topic.trim()) {                                                      // 480
			return RocketChat.API.v1.failure('The bodyParam "topic" is required');                                             // 481
		}                                                                                                                   // 482
                                                                                                                      //
		var findResult = findPrivateGroupByIdOrName({                                                                       // 484
			params: this.requestParams(),                                                                                      // 484
			userId: this.userId                                                                                                // 484
		});                                                                                                                 // 484
		Meteor.runAsUser(this.userId, function () {                                                                         // 486
			Meteor.call('saveRoomSettings', findResult.rid, 'roomTopic', _this7.bodyParams.topic);                             // 487
		});                                                                                                                 // 488
		return RocketChat.API.v1.success({                                                                                  // 490
			topic: this.bodyParams.topic                                                                                       // 491
		});                                                                                                                 // 490
	}                                                                                                                    // 493
});                                                                                                                   // 478
RocketChat.API.v1.addRoute('groups.setType', {                                                                        // 496
	authRequired: true                                                                                                   // 496
}, {                                                                                                                  // 496
	post: function () {                                                                                                  // 497
		var _this8 = this;                                                                                                  // 497
                                                                                                                      //
		if (!this.bodyParams.type || !this.bodyParams.type.trim()) {                                                        // 498
			return RocketChat.API.v1.failure('The bodyParam "type" is required');                                              // 499
		}                                                                                                                   // 500
                                                                                                                      //
		var findResult = findPrivateGroupByIdOrName({                                                                       // 502
			params: this.requestParams(),                                                                                      // 502
			userId: this.userId                                                                                                // 502
		});                                                                                                                 // 502
                                                                                                                      //
		if (findResult.t === this.bodyParams.type) {                                                                        // 504
			return RocketChat.API.v1.failure('The private group type is the same as what it would be changed to.');            // 505
		}                                                                                                                   // 506
                                                                                                                      //
		Meteor.runAsUser(this.userId, function () {                                                                         // 508
			Meteor.call('saveRoomSettings', findResult.rid, 'roomType', _this8.bodyParams.type);                               // 509
		});                                                                                                                 // 510
		return RocketChat.API.v1.success({                                                                                  // 512
			group: RocketChat.models.Rooms.findOneById(findResult.rid, {                                                       // 513
				fields: RocketChat.API.v1.defaultFieldsToExclude                                                                  // 513
			})                                                                                                                 // 513
		});                                                                                                                 // 512
	}                                                                                                                    // 515
});                                                                                                                   // 496
RocketChat.API.v1.addRoute('groups.unarchive', {                                                                      // 518
	authRequired: true                                                                                                   // 518
}, {                                                                                                                  // 518
	post: function () {                                                                                                  // 519
		var findResult = findPrivateGroupByIdOrName({                                                                       // 520
			params: this.requestParams(),                                                                                      // 520
			userId: this.userId,                                                                                               // 520
			checkedArchived: false                                                                                             // 520
		});                                                                                                                 // 520
		Meteor.runAsUser(this.userId, function () {                                                                         // 522
			Meteor.call('unarchiveRoom', findResult.rid);                                                                      // 523
		});                                                                                                                 // 524
		return RocketChat.API.v1.success();                                                                                 // 526
	}                                                                                                                    // 527
});                                                                                                                   // 518
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"im.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_api/server/v1/im.js                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
function findDirectMessageRoomById(roomId, userId) {                                                                  // 1
	if (!roomId || !roomId.trim()) {                                                                                     // 2
		return RocketChat.API.v1.failure('Body param "roomId" is required');                                                // 3
	}                                                                                                                    // 4
                                                                                                                      //
	var roomSub = RocketChat.models.Subscriptions.findOneByRoomIdAndUserId(roomId, userId);                              // 6
                                                                                                                      //
	if (!roomSub || roomSub.t !== 'd') {                                                                                 // 8
		return RocketChat.API.v1.failure("No direct message room found by the id of: " + roomId);                           // 9
	}                                                                                                                    // 10
                                                                                                                      //
	return roomSub;                                                                                                      // 12
}                                                                                                                     // 13
                                                                                                                      //
RocketChat.API.v1.addRoute(['dm.close', 'im.close'], {                                                                // 15
	authRequired: true                                                                                                   // 15
}, {                                                                                                                  // 15
	post: function () {                                                                                                  // 16
		var findResult = findDirectMessageRoomById(this.bodyParams.roomId, this.userId); //The find method returns either with the dm or the failure
                                                                                                                      //
		if (findResult.statusCode) {                                                                                        // 20
			return findResult;                                                                                                 // 21
		}                                                                                                                   // 22
                                                                                                                      //
		if (!findResult.open) {                                                                                             // 24
			return RocketChat.API.v1.failure("The direct message room, " + this.bodyParams.name + ", is already closed to the sender");
		}                                                                                                                   // 26
                                                                                                                      //
		Meteor.runAsUser(this.userId, function () {                                                                         // 28
			Meteor.call('hideRoom', findResult.rid);                                                                           // 29
		});                                                                                                                 // 30
		return RocketChat.API.v1.success();                                                                                 // 32
	}                                                                                                                    // 33
});                                                                                                                   // 15
RocketChat.API.v1.addRoute(['dm.history', 'im.history'], {                                                            // 36
	authRequired: true                                                                                                   // 36
}, {                                                                                                                  // 36
	get: function () {                                                                                                   // 37
		var findResult = findDirectMessageRoomById(this.queryParams.roomId, this.userId); //The find method returns either with the group or the failure
                                                                                                                      //
		if (findResult.statusCode) {                                                                                        // 41
			return findResult;                                                                                                 // 42
		}                                                                                                                   // 43
                                                                                                                      //
		var latestDate = new Date();                                                                                        // 45
                                                                                                                      //
		if (this.queryParams.latest) {                                                                                      // 46
			latestDate = new Date(this.queryParams.latest);                                                                    // 47
		}                                                                                                                   // 48
                                                                                                                      //
		var oldestDate = undefined;                                                                                         // 50
                                                                                                                      //
		if (this.queryParams.oldest) {                                                                                      // 51
			oldestDate = new Date(this.queryParams.oldest);                                                                    // 52
		}                                                                                                                   // 53
                                                                                                                      //
		var inclusive = false;                                                                                              // 55
                                                                                                                      //
		if (this.queryParams.inclusive) {                                                                                   // 56
			inclusive = this.queryParams.inclusive;                                                                            // 57
		}                                                                                                                   // 58
                                                                                                                      //
		var count = 20;                                                                                                     // 60
                                                                                                                      //
		if (this.queryParams.count) {                                                                                       // 61
			count = parseInt(this.queryParams.count);                                                                          // 62
		}                                                                                                                   // 63
                                                                                                                      //
		var unreads = false;                                                                                                // 65
                                                                                                                      //
		if (this.queryParams.unreads) {                                                                                     // 66
			unreads = this.queryParams.unreads;                                                                                // 67
		}                                                                                                                   // 68
                                                                                                                      //
		var result = void 0;                                                                                                // 70
		Meteor.runAsUser(this.userId, function () {                                                                         // 71
			result = Meteor.call('getChannelHistory', {                                                                        // 72
				rid: findResult.rid,                                                                                              // 72
				latest: latestDate,                                                                                               // 72
				oldest: oldestDate,                                                                                               // 72
				inclusive: inclusive,                                                                                             // 72
				count: count,                                                                                                     // 72
				unreads: unreads                                                                                                  // 72
			});                                                                                                                // 72
		});                                                                                                                 // 73
		return RocketChat.API.v1.success({                                                                                  // 75
			messages: result && result.messages ? result.messages : []                                                         // 76
		});                                                                                                                 // 75
	}                                                                                                                    // 78
});                                                                                                                   // 36
RocketChat.API.v1.addRoute(['dm.messages.others', 'im.messages.others'], {                                            // 81
	authRequired: true                                                                                                   // 81
}, {                                                                                                                  // 81
	get: function () {                                                                                                   // 82
		if (RocketChat.settings.get('API_Enable_Direct_Message_History_EndPoint') !== true) {                               // 83
			throw new Meteor.Error('error-endpoint-disabled', 'This endpoint is disabled', {                                   // 84
				route: '/api/v1/im.messages.others'                                                                               // 84
			});                                                                                                                // 84
		}                                                                                                                   // 85
                                                                                                                      //
		if (!RocketChat.authz.hasPermission(this.userId, 'view-room-administration')) {                                     // 87
			return RocketChat.API.v1.unauthorized();                                                                           // 88
		}                                                                                                                   // 89
                                                                                                                      //
		var roomId = this.queryParams.roomId;                                                                               // 91
                                                                                                                      //
		if (!roomId || !roomId.trim()) {                                                                                    // 92
			throw new Meteor.Error('error-roomid-param-not-provided', 'The parameter "roomId" is required');                   // 93
		}                                                                                                                   // 94
                                                                                                                      //
		var room = RocketChat.models.Rooms.findOneById(roomId);                                                             // 96
                                                                                                                      //
		if (!room || room.t !== 'd') {                                                                                      // 97
			throw new Meteor.Error('error-room-not-found', "No direct message room found by the id of: " + roomId);            // 98
		}                                                                                                                   // 99
                                                                                                                      //
		var _getPaginationItems = this.getPaginationItems(),                                                                // 82
		    offset = _getPaginationItems.offset,                                                                            // 82
		    count = _getPaginationItems.count;                                                                              // 82
                                                                                                                      //
		var _parseJsonQuery = this.parseJsonQuery(),                                                                        // 82
		    sort = _parseJsonQuery.sort,                                                                                    // 82
		    fields = _parseJsonQuery.fields,                                                                                // 82
		    query = _parseJsonQuery.query;                                                                                  // 82
                                                                                                                      //
		var ourQuery = Object.assign({}, query, {                                                                           // 103
			rid: room._id                                                                                                      // 103
		});                                                                                                                 // 103
		var msgs = RocketChat.models.Messages.find(ourQuery, {                                                              // 105
			sort: sort ? sort : {                                                                                              // 106
				ts: -1                                                                                                            // 106
			},                                                                                                                 // 106
			skip: offset,                                                                                                      // 107
			limit: count,                                                                                                      // 108
			fields: Object.assign({}, fields, RocketChat.API.v1.defaultFieldsToExclude)                                        // 109
		}).fetch();                                                                                                         // 105
		return RocketChat.API.v1.success({                                                                                  // 112
			messages: msgs,                                                                                                    // 113
			offset: offset,                                                                                                    // 114
			count: msgs.length,                                                                                                // 115
			total: RocketChat.models.Messages.find(ourQuery).count()                                                           // 116
		});                                                                                                                 // 112
	}                                                                                                                    // 118
});                                                                                                                   // 81
RocketChat.API.v1.addRoute(['dm.list', 'im.list'], {                                                                  // 121
	authRequired: true                                                                                                   // 121
}, {                                                                                                                  // 121
	get: function () {                                                                                                   // 122
		var _getPaginationItems2 = this.getPaginationItems(),                                                               // 122
		    offset = _getPaginationItems2.offset,                                                                           // 122
		    count = _getPaginationItems2.count;                                                                             // 122
                                                                                                                      //
		var _parseJsonQuery2 = this.parseJsonQuery(),                                                                       // 122
		    sort = _parseJsonQuery2.sort,                                                                                   // 122
		    fields = _parseJsonQuery2.fields;                                                                               // 122
                                                                                                                      //
		var rooms = _.pluck(RocketChat.models.Subscriptions.findByTypeAndUserId('d', this.userId).fetch(), '_room');        // 125
                                                                                                                      //
		var totalCount = rooms.length;                                                                                      // 126
		rooms = RocketChat.models.Rooms.processQueryOptionsOnResult(rooms, {                                                // 128
			sort: sort ? sort : {                                                                                              // 129
				name: 1                                                                                                           // 129
			},                                                                                                                 // 129
			skip: offset,                                                                                                      // 130
			limit: count,                                                                                                      // 131
			fields: Object.assign({}, fields, RocketChat.API.v1.defaultFieldsToExclude)                                        // 132
		});                                                                                                                 // 128
		return RocketChat.API.v1.success({                                                                                  // 135
			ims: rooms,                                                                                                        // 136
			offset: offset,                                                                                                    // 137
			count: rooms.length,                                                                                               // 138
			total: totalCount                                                                                                  // 139
		});                                                                                                                 // 135
	}                                                                                                                    // 141
});                                                                                                                   // 121
RocketChat.API.v1.addRoute(['dm.list.everyone', 'im.list.everyone'], {                                                // 144
	authRequired: true                                                                                                   // 144
}, {                                                                                                                  // 144
	get: function () {                                                                                                   // 145
		if (!RocketChat.authz.hasPermission(this.userId, 'view-room-administration')) {                                     // 146
			return RocketChat.API.v1.unauthorized();                                                                           // 147
		}                                                                                                                   // 148
                                                                                                                      //
		var _getPaginationItems3 = this.getPaginationItems(),                                                               // 145
		    offset = _getPaginationItems3.offset,                                                                           // 145
		    count = _getPaginationItems3.count;                                                                             // 145
                                                                                                                      //
		var _parseJsonQuery3 = this.parseJsonQuery(),                                                                       // 145
		    sort = _parseJsonQuery3.sort,                                                                                   // 145
		    fields = _parseJsonQuery3.fields,                                                                               // 145
		    query = _parseJsonQuery3.query;                                                                                 // 145
                                                                                                                      //
		var ourQuery = Object.assign({}, query, {                                                                           // 153
			t: 'd'                                                                                                             // 153
		});                                                                                                                 // 153
		var rooms = RocketChat.models.Rooms.find(ourQuery, {                                                                // 155
			sort: sort ? sort : {                                                                                              // 156
				name: 1                                                                                                           // 156
			},                                                                                                                 // 156
			skip: offset,                                                                                                      // 157
			limit: count,                                                                                                      // 158
			fields: Object.assign({}, fields, RocketChat.API.v1.defaultFieldsToExclude)                                        // 159
		}).fetch();                                                                                                         // 155
		return RocketChat.API.v1.success({                                                                                  // 162
			ims: rooms,                                                                                                        // 163
			offset: offset,                                                                                                    // 164
			count: rooms.length,                                                                                               // 165
			total: RocketChat.models.Rooms.find(ourQuery).count()                                                              // 166
		});                                                                                                                 // 162
	}                                                                                                                    // 168
});                                                                                                                   // 144
RocketChat.API.v1.addRoute(['dm.open', 'im.open'], {                                                                  // 171
	authRequired: true                                                                                                   // 171
}, {                                                                                                                  // 171
	post: function () {                                                                                                  // 172
		var findResult = findDirectMessageRoomById(this.bodyParams.roomId, this.userId); //The find method returns either with the group or the failure
                                                                                                                      //
		if (findResult.statusCode) {                                                                                        // 176
			return findResult;                                                                                                 // 177
		}                                                                                                                   // 178
                                                                                                                      //
		if (findResult.open) {                                                                                              // 180
			return RocketChat.API.v1.failure("The direct message room, " + this.bodyParams.name + ", is already open for the sender");
		}                                                                                                                   // 182
                                                                                                                      //
		Meteor.runAsUser(this.userId, function () {                                                                         // 184
			Meteor.call('openRoom', findResult.rid);                                                                           // 185
		});                                                                                                                 // 186
		return RocketChat.API.v1.success();                                                                                 // 188
	}                                                                                                                    // 189
});                                                                                                                   // 171
RocketChat.API.v1.addRoute(['dm.setTopic', 'im.setTopic'], {                                                          // 192
	authRequired: true                                                                                                   // 192
}, {                                                                                                                  // 192
	post: function () {                                                                                                  // 193
		var _this = this;                                                                                                   // 193
                                                                                                                      //
		if (!this.bodyParams.topic || !this.bodyParams.topic.trim()) {                                                      // 194
			return RocketChat.API.v1.failure('The bodyParam "topic" is required');                                             // 195
		}                                                                                                                   // 196
                                                                                                                      //
		var findResult = findDirectMessageRoomById(this.bodyParams.roomId, this.userId); //The find method returns either with the group or the failure
                                                                                                                      //
		if (findResult.statusCode) {                                                                                        // 201
			return findResult;                                                                                                 // 202
		}                                                                                                                   // 203
                                                                                                                      //
		Meteor.runAsUser(this.userId, function () {                                                                         // 205
			Meteor.call('saveRoomSettings', findResult.rid, 'roomTopic', _this.bodyParams.topic);                              // 206
		});                                                                                                                 // 207
		return RocketChat.API.v1.success({                                                                                  // 209
			topic: this.bodyParams.topic                                                                                       // 210
		});                                                                                                                 // 209
	}                                                                                                                    // 212
});                                                                                                                   // 192
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"integrations.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_api/server/v1/integrations.js                                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
RocketChat.API.v1.addRoute('integrations.create', {                                                                   // 1
	authRequired: true                                                                                                   // 1
}, {                                                                                                                  // 1
	post: function () {                                                                                                  // 2
		var _this = this;                                                                                                   // 2
                                                                                                                      //
		check(this.bodyParams, Match.ObjectIncluding({                                                                      // 3
			type: String,                                                                                                      // 4
			name: String,                                                                                                      // 5
			enabled: Boolean,                                                                                                  // 6
			username: String,                                                                                                  // 7
			urls: Match.Maybe([String]),                                                                                       // 8
			channel: String,                                                                                                   // 9
			event: Match.Maybe(String),                                                                                        // 10
			triggerWords: Match.Maybe([String]),                                                                               // 11
			alias: Match.Maybe(String),                                                                                        // 12
			avatar: Match.Maybe(String),                                                                                       // 13
			emoji: Match.Maybe(String),                                                                                        // 14
			token: Match.Maybe(String),                                                                                        // 15
			scriptEnabled: Boolean,                                                                                            // 16
			script: Match.Maybe(String),                                                                                       // 17
			targetChannel: Match.Maybe(String)                                                                                 // 18
		}));                                                                                                                // 3
		var integration = void 0;                                                                                           // 21
                                                                                                                      //
		switch (this.bodyParams.type) {                                                                                     // 23
			case 'webhook-outgoing':                                                                                           // 24
				Meteor.runAsUser(this.userId, function () {                                                                       // 25
					integration = Meteor.call('addOutgoingIntegration', _this.bodyParams);                                           // 26
				});                                                                                                               // 27
				break;                                                                                                            // 28
                                                                                                                      //
			case 'webhook-incoming':                                                                                           // 29
				Meteor.runAsUser(this.userId, function () {                                                                       // 30
					integration = Meteor.call('addIncomingIntegration', _this.bodyParams);                                           // 31
				});                                                                                                               // 32
				break;                                                                                                            // 33
                                                                                                                      //
			default:                                                                                                           // 34
				return RocketChat.API.v1.failure('Invalid integration type.');                                                    // 35
		}                                                                                                                   // 23
                                                                                                                      //
		return RocketChat.API.v1.success({                                                                                  // 38
			integration: integration                                                                                           // 38
		});                                                                                                                 // 38
	}                                                                                                                    // 39
});                                                                                                                   // 1
RocketChat.API.v1.addRoute('integrations.history', {                                                                  // 42
	authRequired: true                                                                                                   // 42
}, {                                                                                                                  // 42
	get: function () {                                                                                                   // 43
		if (!RocketChat.authz.hasPermission(this.userId, 'manage-integrations')) {                                          // 44
			return RocketChat.API.v1.unauthorized();                                                                           // 45
		}                                                                                                                   // 46
                                                                                                                      //
		if (!this.queryParams.id || this.queryParams.id.trim() === '') {                                                    // 48
			return RocketChat.API.v1.failure('Invalid integration id.');                                                       // 49
		}                                                                                                                   // 50
                                                                                                                      //
		var id = this.queryParams.id;                                                                                       // 52
                                                                                                                      //
		var _getPaginationItems = this.getPaginationItems(),                                                                // 43
		    offset = _getPaginationItems.offset,                                                                            // 43
		    count = _getPaginationItems.count;                                                                              // 43
                                                                                                                      //
		var _parseJsonQuery = this.parseJsonQuery(),                                                                        // 43
		    sort = _parseJsonQuery.sort,                                                                                    // 43
		    fields = _parseJsonQuery.fields,                                                                                // 43
		    query = _parseJsonQuery.query;                                                                                  // 43
                                                                                                                      //
		var ourQuery = Object.assign({}, query, {                                                                           // 56
			'integration._id': id                                                                                              // 56
		});                                                                                                                 // 56
		var history = RocketChat.models.IntegrationHistory.find(ourQuery, {                                                 // 57
			sort: sort ? sort : {                                                                                              // 58
				_updatedAt: -1                                                                                                    // 58
			},                                                                                                                 // 58
			skip: offset,                                                                                                      // 59
			limit: count,                                                                                                      // 60
			fields: fields                                                                                                     // 61
		}).fetch();                                                                                                         // 57
		return RocketChat.API.v1.success({                                                                                  // 64
			history: history,                                                                                                  // 65
			offset: offset,                                                                                                    // 66
			items: history.length,                                                                                             // 67
			total: RocketChat.models.IntegrationHistory.find(ourQuery).count()                                                 // 68
		});                                                                                                                 // 64
	}                                                                                                                    // 70
});                                                                                                                   // 42
RocketChat.API.v1.addRoute('integrations.list', {                                                                     // 73
	authRequired: true                                                                                                   // 73
}, {                                                                                                                  // 73
	get: function () {                                                                                                   // 74
		if (!RocketChat.authz.hasPermission(this.userId, 'manage-integrations')) {                                          // 75
			return RocketChat.API.v1.unauthorized();                                                                           // 76
		}                                                                                                                   // 77
                                                                                                                      //
		var _getPaginationItems2 = this.getPaginationItems(),                                                               // 74
		    offset = _getPaginationItems2.offset,                                                                           // 74
		    count = _getPaginationItems2.count;                                                                             // 74
                                                                                                                      //
		var _parseJsonQuery2 = this.parseJsonQuery(),                                                                       // 74
		    sort = _parseJsonQuery2.sort,                                                                                   // 74
		    fields = _parseJsonQuery2.fields,                                                                               // 74
		    query = _parseJsonQuery2.query;                                                                                 // 74
                                                                                                                      //
		var ourQuery = Object.assign({}, query);                                                                            // 82
		var integrations = RocketChat.models.Integrations.find(ourQuery, {                                                  // 83
			sort: sort ? sort : {                                                                                              // 84
				ts: -1                                                                                                            // 84
			},                                                                                                                 // 84
			skip: offset,                                                                                                      // 85
			limit: count,                                                                                                      // 86
			fields: fields                                                                                                     // 87
		}).fetch();                                                                                                         // 83
		return RocketChat.API.v1.success({                                                                                  // 90
			integrations: integrations,                                                                                        // 91
			offset: offset,                                                                                                    // 92
			items: integrations.length,                                                                                        // 93
			total: RocketChat.models.Integrations.find(ourQuery).count()                                                       // 94
		});                                                                                                                 // 90
	}                                                                                                                    // 96
});                                                                                                                   // 73
RocketChat.API.v1.addRoute('integrations.remove', {                                                                   // 99
	authRequired: true                                                                                                   // 99
}, {                                                                                                                  // 99
	post: function () {                                                                                                  // 100
		check(this.bodyParams, Match.ObjectIncluding({                                                                      // 101
			type: String,                                                                                                      // 102
			target_url: Match.Maybe(String),                                                                                   // 103
			integrationId: Match.Maybe(String)                                                                                 // 104
		}));                                                                                                                // 101
                                                                                                                      //
		if (!this.bodyParams.target_url && !this.bodyParams.integrationId) {                                                // 107
			return RocketChat.API.v1.failure('An integrationId or target_url needs to be provided.');                          // 108
		}                                                                                                                   // 109
                                                                                                                      //
		switch (this.bodyParams.type) {                                                                                     // 111
			case 'webhook-outgoing':                                                                                           // 112
				var integration = void 0;                                                                                         // 113
                                                                                                                      //
				if (this.bodyParams.target_url) {                                                                                 // 115
					integration = RocketChat.models.Integrations.findOne({                                                           // 116
						urls: this.bodyParams.target_url                                                                                // 116
					});                                                                                                              // 116
				} else if (this.bodyParams.integrationId) {                                                                       // 117
					integration = RocketChat.models.Integrations.findOne({                                                           // 118
						_id: this.bodyParams.integrationId                                                                              // 118
					});                                                                                                              // 118
				}                                                                                                                 // 119
                                                                                                                      //
				if (!integration) {                                                                                               // 121
					return RocketChat.API.v1.failure('No integration found.');                                                       // 122
				}                                                                                                                 // 123
                                                                                                                      //
				Meteor.runAsUser(this.userId, function () {                                                                       // 125
					Meteor.call('deleteOutgoingIntegration', integration._id);                                                       // 126
				});                                                                                                               // 127
				return RocketChat.API.v1.success({                                                                                // 129
					integration: integration                                                                                         // 130
				});                                                                                                               // 129
                                                                                                                      //
			case 'webhook-incoming':                                                                                           // 132
				integration = RocketChat.models.Integrations.findOne({                                                            // 133
					_id: this.bodyParams.integrationId                                                                               // 133
				});                                                                                                               // 133
                                                                                                                      //
				if (!integration) {                                                                                               // 135
					return RocketChat.API.v1.failure('No integration found.');                                                       // 136
				}                                                                                                                 // 137
                                                                                                                      //
				Meteor.runAsUser(this.userId, function () {                                                                       // 139
					Meteor.call('deleteIncomingIntegration', integration._id);                                                       // 140
				});                                                                                                               // 141
				return RocketChat.API.v1.success({                                                                                // 143
					integration: integration                                                                                         // 144
				});                                                                                                               // 143
                                                                                                                      //
			default:                                                                                                           // 146
				return RocketChat.API.v1.failure('Invalid integration type.');                                                    // 147
		}                                                                                                                   // 111
	}                                                                                                                    // 149
});                                                                                                                   // 99
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"misc.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_api/server/v1/misc.js                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
RocketChat.API.v1.addRoute('info', {                                                                                  // 1
	authRequired: false                                                                                                  // 1
}, {                                                                                                                  // 1
	get: function () {                                                                                                   // 2
		var user = this.getLoggedInUser();                                                                                  // 3
                                                                                                                      //
		if (user && RocketChat.authz.hasRole(user._id, 'admin')) {                                                          // 5
			return RocketChat.API.v1.success({                                                                                 // 6
				info: RocketChat.Info                                                                                             // 7
			});                                                                                                                // 6
		}                                                                                                                   // 9
                                                                                                                      //
		return RocketChat.API.v1.success({                                                                                  // 11
			info: {                                                                                                            // 12
				'version': RocketChat.Info.version                                                                                // 13
			}                                                                                                                  // 12
		});                                                                                                                 // 11
	}                                                                                                                    // 16
});                                                                                                                   // 1
RocketChat.API.v1.addRoute('me', {                                                                                    // 19
	authRequired: true                                                                                                   // 19
}, {                                                                                                                  // 19
	get: function () {                                                                                                   // 20
		return RocketChat.API.v1.success(_.pick(this.user, ['_id', 'name', 'emails', 'status', 'statusConnection', 'username', 'utcOffset', 'active', 'language']));
	}                                                                                                                    // 32
});                                                                                                                   // 19
var onlineCache = 0;                                                                                                  // 35
var onlineCacheDate = 0;                                                                                              // 36
var cacheInvalid = 60000; // 1 minute                                                                                 // 37
                                                                                                                      //
RocketChat.API.v1.addRoute('shield.svg', {                                                                            // 38
	authRequired: false                                                                                                  // 38
}, {                                                                                                                  // 38
	get: function () {                                                                                                   // 39
		var _queryParams = this.queryParams,                                                                                // 39
		    type = _queryParams.type,                                                                                       // 39
		    channel = _queryParams.channel,                                                                                 // 39
		    name = _queryParams.name,                                                                                       // 39
		    icon = _queryParams.icon;                                                                                       // 39
                                                                                                                      //
		if (!RocketChat.settings.get('API_Enable_Shields')) {                                                               // 41
			throw new Meteor.Error('error-endpoint-disabled', 'This endpoint is disabled', {                                   // 42
				route: '/api/v1/shields.svg'                                                                                      // 42
			});                                                                                                                // 42
		}                                                                                                                   // 43
                                                                                                                      //
		var types = RocketChat.settings.get('API_Shield_Types');                                                            // 44
                                                                                                                      //
		if (type && types !== '*' && !types.split(',').map(function (t) {                                                   // 45
			return t.trim();                                                                                                   // 45
		}).includes(type)) {                                                                                                // 45
			throw new Meteor.Error('error-shield-disabled', 'This shield type is disabled', {                                  // 46
				route: '/api/v1/shields.svg'                                                                                      // 46
			});                                                                                                                // 46
		}                                                                                                                   // 47
                                                                                                                      //
		var hideIcon = icon === 'false';                                                                                    // 48
                                                                                                                      //
		if (hideIcon && (!name || !name.trim())) {                                                                          // 49
			return RocketChat.API.v1.failure('Name cannot be empty when icon is hidden');                                      // 50
		}                                                                                                                   // 51
                                                                                                                      //
		var text = void 0;                                                                                                  // 52
                                                                                                                      //
		switch (type) {                                                                                                     // 53
			case 'online':                                                                                                     // 54
				if (Date.now() - onlineCacheDate > cacheInvalid) {                                                                // 55
					onlineCache = RocketChat.models.Users.findUsersNotOffline().count();                                             // 56
					onlineCacheDate = Date.now();                                                                                    // 57
				}                                                                                                                 // 58
                                                                                                                      //
				text = onlineCache + " " + TAPi18n.__('Online');                                                                  // 59
				break;                                                                                                            // 60
                                                                                                                      //
			case 'channel':                                                                                                    // 61
				if (!channel) {                                                                                                   // 62
					return RocketChat.API.v1.failure('Shield channel is required for type "channel"');                               // 63
				}                                                                                                                 // 64
                                                                                                                      //
				text = "#" + channel;                                                                                             // 65
				break;                                                                                                            // 66
                                                                                                                      //
			default:                                                                                                           // 67
				text = TAPi18n.__('Join_Chat').toUpperCase();                                                                     // 68
		}                                                                                                                   // 53
                                                                                                                      //
		var iconSize = hideIcon ? 7 : 24;                                                                                   // 70
		var leftSize = name ? name.length * 6 + 7 + iconSize : iconSize;                                                    // 71
		var rightSize = text.length * 6 + 20;                                                                               // 72
		var width = leftSize + rightSize;                                                                                   // 73
		var height = 20;                                                                                                    // 74
		return {                                                                                                            // 75
			headers: {                                                                                                         // 76
				'Content-Type': 'image/svg+xml;charset=utf-8'                                                                     // 76
			},                                                                                                                 // 76
			body: ("\n\t\t\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"" + width + "\" height=\"" + height + "\">\n\t\t\t\t  <linearGradient id=\"b\" x2=\"0\" y2=\"100%\">\n\t\t\t\t    <stop offset=\"0\" stop-color=\"#bbb\" stop-opacity=\".1\"/>\n\t\t\t\t    <stop offset=\"1\" stop-opacity=\".1\"/>\n\t\t\t\t  </linearGradient>\n\t\t\t\t  <mask id=\"a\">\n\t\t\t\t    <rect width=\"" + width + "\" height=\"" + height + "\" rx=\"3\" fill=\"#fff\"/>\n\t\t\t\t  </mask>\n\t\t\t\t  <g mask=\"url(#a)\">\n\t\t\t\t    <path fill=\"#555\" d=\"M0 0h" + leftSize + "v" + height + "H0z\"/>\n\t\t\t\t    <path fill=\"#4c1\" d=\"M" + leftSize + " 0h" + rightSize + "v" + height + "H" + leftSize + "z\"/>\n\t\t\t\t    <path fill=\"url(#b)\" d=\"M0 0h" + width + "v" + height + "H0z\"/>\n\t\t\t\t  </g>\n\t\t\t\t    " + (hideIcon ? '' : '<image x="5" y="3" width="14" height="14" xlink:href="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI1MTJweCIgaGVpZ2h0PSI1MTJweCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxwYXRoIGZpbGw9IiNDMTI3MkQiIGQ9Ik01MDIuNTg2LDI1NS4zMjJjMC0yNS4yMzYtNy41NS00OS40MzYtMjIuNDQ1LTcxLjkzMmMtMTMuMzczLTIwLjE5NS0zMi4xMDktMzguMDcyLTU1LjY4Ny01My4xMzJDMzc4LjkzNywxMDEuMTgyLDMxOS4xMDgsODUuMTY4LDI1Niw4NS4xNjhjLTIxLjA3OSwwLTQxLjg1NSwxLjc4MS02Mi4wMDksNS4zMWMtMTIuNTA0LTExLjcwMi0yNy4xMzktMjIuMjMyLTQyLjYyNy0zMC41NkM2OC42MTgsMTkuODE4LDAsNTguOTc1LDAsNTguOTc1czYzLjc5OCw1Mi40MDksNTMuNDI0LDk4LjM1Yy0yOC41NDIsMjguMzEzLTQ0LjAxLDYyLjQ1My00NC4wMSw5Ny45OThjMCwwLjExMywwLjAwNiwwLjIyNiwwLjAwNiwwLjM0YzAsMC4xMTMtMC4wMDYsMC4yMjYtMC4wMDYsMC4zMzljMCwzNS41NDUsMTUuNDY5LDY5LjY4NSw0NC4wMSw5Ny45OTlDNjMuNzk4LDM5OS45NCwwLDQ1Mi4zNSwwLDQ1Mi4zNXM2OC42MTgsMzkuMTU2LDE1MS4zNjMtMC45NDNjMTUuNDg4LTguMzI3LDMwLjEyNC0xOC44NTcsNDIuNjI3LTMwLjU2YzIwLjE1NCwzLjUyOCw0MC45MzEsNS4zMSw2Mi4wMDksNS4zMWM2My4xMDgsMCwxMjIuOTM3LTE2LjAxNCwxNjguNDU0LTQ1LjA5MWMyMy41NzctMTUuMDYsNDIuMzEzLTMyLjkzNyw1NS42ODctNTMuMTMyYzE0Ljg5Ni0yMi40OTYsMjIuNDQ1LTQ2LjY5NSwyMi40NDUtNzEuOTMyYzAtMC4xMTMtMC4wMDYtMC4yMjYtMC4wMDYtMC4zMzlDNTAyLjU4LDI1NS41NDgsNTAyLjU4NiwyNTUuNDM2LDUwMi41ODYsMjU1LjMyMnoiLz48cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNMjU2LDEyMC44NDdjMTE2Ljg1NCwwLDIxMS41ODYsNjAuNTA5LDIxMS41ODYsMTM1LjE1NGMwLDc0LjY0MS05NC43MzEsMTM1LjE1NS0yMTEuNTg2LDEzNS4xNTVjLTI2LjAxOSwwLTUwLjkzNy0zLjAwOS03My45NTktOC40OTVjLTIzLjM5NiwyOC4xNDctNzQuODY4LDY3LjI4LTEyNC44NjksNTQuNjI5YzE2LjI2NS0xNy40Nyw0MC4zNjEtNDYuOTg4LDM1LjIwMS05NS42MDNjLTI5Ljk2OC0yMy4zMjItNDcuOTU5LTUzLjE2My00Ny45NTktODUuNjg2QzQ0LjQxNCwxODEuMzU2LDEzOS4xNDUsMTIwLjg0NywyNTYsMTIwLjg0NyIvPjxnPjxnPjxjaXJjbGUgZmlsbD0iI0MxMjcyRCIgY3g9IjI1NiIgY3k9IjI2MC4zNTIiIHI9IjI4LjEwNSIvPjwvZz48Zz48Y2lyY2xlIGZpbGw9IiNDMTI3MkQiIGN4PSIzNTMuNzI4IiBjeT0iMjYwLjM1MiIgcj0iMjguMTA0Ii8+PC9nPjxnPjxjaXJjbGUgZmlsbD0iI0MxMjcyRCIgY3g9IjE1OC4yNzIiIGN5PSIyNjAuMzUyIiByPSIyOC4xMDUiLz48L2c+PC9nPjxnPjxwYXRoIGZpbGw9IiNDQ0NDQ0MiIGQ9Ik0yNTYsMzczLjM3M2MtMjYuMDE5LDAtNTAuOTM3LTIuNjA3LTczLjk1OS03LjM2MmMtMjAuNjU5LDIxLjU0LTYzLjIwOSw1MC40OTYtMTA3LjMwNyw0OS40M2MtNS44MDYsOC44MDUtMTIuMTIxLDE2LjAwNi0xNy41NjIsMjEuODVjNTAsMTIuNjUxLDEwMS40NzMtMjYuNDgxLDEyNC44NjktNTQuNjI5YzIzLjAyMyw1LjQ4Niw0Ny45NDEsOC40OTUsNzMuOTU5LDguNDk1YzExNS45MTcsMCwyMTAuMDQ4LTU5LjU1LDIxMS41NTEtMTMzLjM2NEM0NjYuMDQ4LDMyMS43NjUsMzcxLjkxNywzNzMuMzczLDI1NiwzNzMuMzczeiIvPjwvZz48L3N2Zz4="/>') + "\n\t\t\t\t  <g fill=\"#fff\" font-family=\"DejaVu Sans,Verdana,Geneva,sans-serif\" font-size=\"11\">\n\t\t\t\t\t\t" + (name ? "<text x=\"" + iconSize + "\" y=\"15\" fill=\"#010101\" fill-opacity=\".3\">" + name + "</text>\n\t\t\t\t    <text x=\"" + iconSize + "\" y=\"14\">" + name + "</text>" : '') + "\n\t\t\t\t    <text x=\"" + (leftSize + 7) + "\" y=\"15\" fill=\"#010101\" fill-opacity=\".3\">" + text + "</text>\n\t\t\t\t    <text x=\"" + (leftSize + 7) + "\" y=\"14\">" + text + "</text>\n\t\t\t\t  </g>\n\t\t\t\t</svg>\n\t\t\t").trim().replace(/\>[\s]+\</gm, '><')
		};                                                                                                                  // 75
	}                                                                                                                    // 101
});                                                                                                                   // 38
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"settings.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_api/server/v1/settings.js                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// settings endpoints                                                                                                 // 1
RocketChat.API.v1.addRoute('settings', {                                                                              // 2
	authRequired: true                                                                                                   // 2
}, {                                                                                                                  // 2
	get: function () {                                                                                                   // 3
		var _getPaginationItems = this.getPaginationItems(),                                                                // 3
		    offset = _getPaginationItems.offset,                                                                            // 3
		    count = _getPaginationItems.count;                                                                              // 3
                                                                                                                      //
		var _parseJsonQuery = this.parseJsonQuery(),                                                                        // 3
		    sort = _parseJsonQuery.sort,                                                                                    // 3
		    fields = _parseJsonQuery.fields,                                                                                // 3
		    query = _parseJsonQuery.query;                                                                                  // 3
                                                                                                                      //
		var ourQuery = {                                                                                                    // 7
			hidden: {                                                                                                          // 8
				$ne: true                                                                                                         // 8
			}                                                                                                                  // 8
		};                                                                                                                  // 7
                                                                                                                      //
		if (!RocketChat.authz.hasPermission(this.userId, 'view-privileged-setting')) {                                      // 11
			ourQuery.public = true;                                                                                            // 12
		}                                                                                                                   // 13
                                                                                                                      //
		ourQuery = Object.assign({}, query, ourQuery);                                                                      // 15
		var settings = RocketChat.models.Settings.find(ourQuery, {                                                          // 17
			sort: sort ? sort : {                                                                                              // 18
				_id: 1                                                                                                            // 18
			},                                                                                                                 // 18
			skip: offset,                                                                                                      // 19
			limit: count,                                                                                                      // 20
			fields: Object.assign({                                                                                            // 21
				_id: 1,                                                                                                           // 21
				value: 1                                                                                                          // 21
			}, fields)                                                                                                         // 21
		}).fetch();                                                                                                         // 17
		return RocketChat.API.v1.success({                                                                                  // 24
			settings: settings,                                                                                                // 25
			count: settings.length,                                                                                            // 26
			offset: offset,                                                                                                    // 27
			total: RocketChat.models.Settings.find(ourQuery).count()                                                           // 28
		});                                                                                                                 // 24
	}                                                                                                                    // 30
});                                                                                                                   // 2
RocketChat.API.v1.addRoute('settings/:_id', {                                                                         // 33
	authRequired: true                                                                                                   // 33
}, {                                                                                                                  // 33
	get: function () {                                                                                                   // 34
		if (!RocketChat.authz.hasPermission(this.userId, 'view-privileged-setting')) {                                      // 35
			return RocketChat.API.v1.unauthorized();                                                                           // 36
		}                                                                                                                   // 37
                                                                                                                      //
		return RocketChat.API.v1.success(_.pick(RocketChat.models.Settings.findOneNotHiddenById(this.urlParams._id), '_id', 'value'));
	},                                                                                                                   // 40
	post: function () {                                                                                                  // 41
		if (!RocketChat.authz.hasPermission(this.userId, 'edit-privileged-setting')) {                                      // 42
			return RocketChat.API.v1.unauthorized();                                                                           // 43
		}                                                                                                                   // 44
                                                                                                                      //
		check(this.bodyParams, {                                                                                            // 46
			value: Match.Any                                                                                                   // 47
		});                                                                                                                 // 46
                                                                                                                      //
		if (RocketChat.models.Settings.updateValueNotHiddenById(this.urlParams._id, this.bodyParams.value)) {               // 50
			return RocketChat.API.v1.success();                                                                                // 51
		}                                                                                                                   // 52
                                                                                                                      //
		return RocketChat.API.v1.failure();                                                                                 // 54
	}                                                                                                                    // 55
});                                                                                                                   // 33
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"stats.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_api/server/v1/stats.js                                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
RocketChat.API.v1.addRoute('statistics', {                                                                            // 1
	authRequired: true                                                                                                   // 1
}, {                                                                                                                  // 1
	get: function () {                                                                                                   // 2
		var refresh = false;                                                                                                // 3
                                                                                                                      //
		if (typeof this.queryParams.refresh !== 'undefined' && this.queryParams.refresh === 'true') {                       // 4
			refresh = true;                                                                                                    // 5
		}                                                                                                                   // 6
                                                                                                                      //
		var stats = void 0;                                                                                                 // 8
		Meteor.runAsUser(this.userId, function () {                                                                         // 9
			stats = Meteor.call('getStatistics', refresh);                                                                     // 10
		});                                                                                                                 // 11
		return RocketChat.API.v1.success({                                                                                  // 13
			statistics: stats                                                                                                  // 14
		});                                                                                                                 // 13
	}                                                                                                                    // 16
});                                                                                                                   // 1
RocketChat.API.v1.addRoute('statistics.list', {                                                                       // 19
	authRequired: true                                                                                                   // 19
}, {                                                                                                                  // 19
	get: function () {                                                                                                   // 20
		if (!RocketChat.authz.hasPermission(this.userId, 'view-statistics')) {                                              // 21
			return RocketChat.API.v1.unauthorized();                                                                           // 22
		}                                                                                                                   // 23
                                                                                                                      //
		var _getPaginationItems = this.getPaginationItems(),                                                                // 20
		    offset = _getPaginationItems.offset,                                                                            // 20
		    count = _getPaginationItems.count;                                                                              // 20
                                                                                                                      //
		var _parseJsonQuery = this.parseJsonQuery(),                                                                        // 20
		    sort = _parseJsonQuery.sort,                                                                                    // 20
		    fields = _parseJsonQuery.fields,                                                                                // 20
		    query = _parseJsonQuery.query;                                                                                  // 20
                                                                                                                      //
		var ourQuery = Object.assign({}, query);                                                                            // 28
		var statistics = RocketChat.models.Statistics.find(ourQuery, {                                                      // 30
			sort: sort ? sort : {                                                                                              // 31
				name: 1                                                                                                           // 31
			},                                                                                                                 // 31
			skip: offset,                                                                                                      // 32
			limit: count,                                                                                                      // 33
			fields: Object.assign({}, fields, RocketChat.API.v1.defaultFieldsToExclude)                                        // 34
		}).fetch();                                                                                                         // 30
		return RocketChat.API.v1.success({                                                                                  // 37
			statistics: statistics,                                                                                            // 38
			count: statistics.length,                                                                                          // 39
			offset: offset,                                                                                                    // 40
			total: RocketChat.models.Statistics.find(ourQuery).count()                                                         // 41
		});                                                                                                                 // 37
	}                                                                                                                    // 43
});                                                                                                                   // 19
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"users.js":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_api/server/v1/users.js                                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
RocketChat.API.v1.addRoute('users.create', {                                                                          // 1
	authRequired: true                                                                                                   // 1
}, {                                                                                                                  // 1
	post: function () {                                                                                                  // 2
		var _this = this;                                                                                                   // 2
                                                                                                                      //
		check(this.bodyParams, {                                                                                            // 3
			email: String,                                                                                                     // 4
			name: String,                                                                                                      // 5
			password: String,                                                                                                  // 6
			username: String,                                                                                                  // 7
			active: Match.Maybe(Boolean),                                                                                      // 8
			roles: Match.Maybe(Array),                                                                                         // 9
			joinDefaultChannels: Match.Maybe(Boolean),                                                                         // 10
			requirePasswordChange: Match.Maybe(Boolean),                                                                       // 11
			sendWelcomeEmail: Match.Maybe(Boolean),                                                                            // 12
			verified: Match.Maybe(Boolean),                                                                                    // 13
			customFields: Match.Maybe(Object)                                                                                  // 14
		}); //New change made by pull request #5152                                                                         // 3
                                                                                                                      //
		if (typeof this.bodyParams.joinDefaultChannels === 'undefined') {                                                   // 18
			this.bodyParams.joinDefaultChannels = true;                                                                        // 19
		}                                                                                                                   // 20
                                                                                                                      //
		if (this.bodyParams.customFields) {                                                                                 // 22
			RocketChat.validateCustomFields(this.bodyParams.customFields);                                                     // 23
		}                                                                                                                   // 24
                                                                                                                      //
		var newUserId = RocketChat.saveUser(this.userId, this.bodyParams);                                                  // 26
                                                                                                                      //
		if (this.bodyParams.customFields) {                                                                                 // 28
			RocketChat.saveCustomFieldsWithoutValidation(newUserId, this.bodyParams.customFields);                             // 29
		}                                                                                                                   // 30
                                                                                                                      //
		if (typeof this.bodyParams.active !== 'undefined') {                                                                // 33
			Meteor.runAsUser(this.userId, function () {                                                                        // 34
				Meteor.call('setUserActiveStatus', newUserId, _this.bodyParams.active);                                           // 35
			});                                                                                                                // 36
		}                                                                                                                   // 37
                                                                                                                      //
		return RocketChat.API.v1.success({                                                                                  // 39
			user: RocketChat.models.Users.findOneById(newUserId, {                                                             // 39
				fields: RocketChat.API.v1.defaultFieldsToExclude                                                                  // 39
			})                                                                                                                 // 39
		});                                                                                                                 // 39
	}                                                                                                                    // 40
});                                                                                                                   // 1
RocketChat.API.v1.addRoute('users.delete', {                                                                          // 43
	authRequired: true                                                                                                   // 43
}, {                                                                                                                  // 43
	post: function () {                                                                                                  // 44
		if (!RocketChat.authz.hasPermission(this.userId, 'delete-user')) {                                                  // 45
			return RocketChat.API.v1.unauthorized();                                                                           // 46
		}                                                                                                                   // 47
                                                                                                                      //
		var user = this.getUserFromParams();                                                                                // 49
		Meteor.runAsUser(this.userId, function () {                                                                         // 51
			Meteor.call('deleteUser', user._id);                                                                               // 52
		});                                                                                                                 // 53
		return RocketChat.API.v1.success();                                                                                 // 55
	}                                                                                                                    // 56
});                                                                                                                   // 43
RocketChat.API.v1.addRoute('users.getAvatar', {                                                                       // 59
	authRequired: false                                                                                                  // 59
}, {                                                                                                                  // 59
	get: function () {                                                                                                   // 60
		var user = this.getUserFromParams();                                                                                // 61
		var url = RocketChat.getURL("/avatar/" + user.username, {                                                           // 63
			cdn: false,                                                                                                        // 63
			full: true                                                                                                         // 63
		});                                                                                                                 // 63
		this.response.setHeader('Location', url);                                                                           // 64
		return {                                                                                                            // 66
			statusCode: 307,                                                                                                   // 67
			body: url                                                                                                          // 68
		};                                                                                                                  // 66
	}                                                                                                                    // 70
});                                                                                                                   // 59
RocketChat.API.v1.addRoute('users.getPresence', {                                                                     // 73
	authRequired: true                                                                                                   // 73
}, {                                                                                                                  // 73
	get: function () {                                                                                                   // 74
		if (this.isUserFromParams()) {                                                                                      // 75
			var _user = RocketChat.models.Users.findOneById(this.userId);                                                      // 76
                                                                                                                      //
			return RocketChat.API.v1.success({                                                                                 // 77
				presence: _user.status,                                                                                           // 78
				connectionStatus: _user.statusConnection,                                                                         // 79
				lastLogin: _user.lastLogin                                                                                        // 80
			});                                                                                                                // 77
		}                                                                                                                   // 82
                                                                                                                      //
		var user = this.getUserFromParams();                                                                                // 84
		return RocketChat.API.v1.success({                                                                                  // 86
			presence: user.status                                                                                              // 87
		});                                                                                                                 // 86
	}                                                                                                                    // 89
});                                                                                                                   // 73
RocketChat.API.v1.addRoute('users.info', {                                                                            // 92
	authRequired: true                                                                                                   // 92
}, {                                                                                                                  // 92
	get: function () {                                                                                                   // 93
		var user = this.getUserFromParams();                                                                                // 94
		var result = void 0;                                                                                                // 96
		Meteor.runAsUser(this.userId, function () {                                                                         // 97
			result = Meteor.call('getFullUserData', {                                                                          // 98
				filter: user.username,                                                                                            // 98
				limit: 1                                                                                                          // 98
			});                                                                                                                // 98
		});                                                                                                                 // 99
                                                                                                                      //
		if (!result || result.length !== 1) {                                                                               // 101
			return RocketChat.API.v1.failure("Failed to get the user data for the userId of \"" + user._id + "\".");           // 102
		}                                                                                                                   // 103
                                                                                                                      //
		return RocketChat.API.v1.success({                                                                                  // 105
			user: result[0]                                                                                                    // 106
		});                                                                                                                 // 105
	}                                                                                                                    // 108
});                                                                                                                   // 92
RocketChat.API.v1.addRoute('users.list', {                                                                            // 111
	authRequired: true                                                                                                   // 111
}, {                                                                                                                  // 111
	get: function () {                                                                                                   // 112
		if (!RocketChat.authz.hasPermission(this.userId, 'view-d-room')) {                                                  // 113
			return RocketChat.API.v1.unauthorized();                                                                           // 114
		}                                                                                                                   // 115
                                                                                                                      //
		var _getPaginationItems = this.getPaginationItems(),                                                                // 112
		    offset = _getPaginationItems.offset,                                                                            // 112
		    count = _getPaginationItems.count;                                                                              // 112
                                                                                                                      //
		var _parseJsonQuery = this.parseJsonQuery(),                                                                        // 112
		    sort = _parseJsonQuery.sort,                                                                                    // 112
		    fields = _parseJsonQuery.fields,                                                                                // 112
		    query = _parseJsonQuery.query;                                                                                  // 112
                                                                                                                      //
		var fieldsToKeepFromRegularUsers = void 0;                                                                          // 120
                                                                                                                      //
		if (!RocketChat.authz.hasPermission(this.userId, 'view-full-other-user-info')) {                                    // 121
			fieldsToKeepFromRegularUsers = {                                                                                   // 122
				avatarOrigin: 0,                                                                                                  // 123
				emails: 0,                                                                                                        // 124
				phone: 0,                                                                                                         // 125
				statusConnection: 0,                                                                                              // 126
				createdAt: 0,                                                                                                     // 127
				lastLogin: 0,                                                                                                     // 128
				services: 0,                                                                                                      // 129
				requirePasswordChange: 0,                                                                                         // 130
				requirePasswordChangeReason: 0,                                                                                   // 131
				roles: 0,                                                                                                         // 132
				statusDefault: 0,                                                                                                 // 133
				_updatedAt: 0,                                                                                                    // 134
				customFields: 0                                                                                                   // 135
			};                                                                                                                 // 122
		}                                                                                                                   // 137
                                                                                                                      //
		var ourQuery = Object.assign({}, query);                                                                            // 139
		var ourFields = Object.assign({}, fields, fieldsToKeepFromRegularUsers, RocketChat.API.v1.defaultFieldsToExclude);  // 140
		var users = RocketChat.models.Users.find(ourQuery, {                                                                // 142
			sort: sort ? sort : {                                                                                              // 143
				username: 1                                                                                                       // 143
			},                                                                                                                 // 143
			skip: offset,                                                                                                      // 144
			limit: count,                                                                                                      // 145
			fields: ourFields                                                                                                  // 146
		}).fetch();                                                                                                         // 142
		return RocketChat.API.v1.success({                                                                                  // 149
			users: users,                                                                                                      // 150
			count: users.length,                                                                                               // 151
			offset: offset,                                                                                                    // 152
			total: RocketChat.models.Users.find(ourQuery).count()                                                              // 153
		});                                                                                                                 // 149
	}                                                                                                                    // 155
});                                                                                                                   // 111
RocketChat.API.v1.addRoute('users.register', {                                                                        // 158
	authRequired: false                                                                                                  // 158
}, {                                                                                                                  // 158
	post: function () {                                                                                                  // 159
		var _this2 = this;                                                                                                  // 159
                                                                                                                      //
		if (this.userId) {                                                                                                  // 160
			return RocketChat.API.v1.failure('Logged in users can not register again.');                                       // 161
		} //We set their username here, so require it                                                                       // 162
		//The `registerUser` checks for the other requirements                                                              // 165
                                                                                                                      //
                                                                                                                      //
		check(this.bodyParams, Match.ObjectIncluding({                                                                      // 166
			username: String                                                                                                   // 167
		})); //Register the user                                                                                            // 166
                                                                                                                      //
		var userId = Meteor.call('registerUser', this.bodyParams); //Now set their username                                 // 171
                                                                                                                      //
		Meteor.runAsUser(userId, function () {                                                                              // 174
			return Meteor.call('setUsername', _this2.bodyParams.username);                                                     // 174
		});                                                                                                                 // 174
		return RocketChat.API.v1.success({                                                                                  // 176
			user: RocketChat.models.Users.findOneById(userId, {                                                                // 176
				fields: RocketChat.API.v1.defaultFieldsToExclude                                                                  // 176
			})                                                                                                                 // 176
		});                                                                                                                 // 176
	}                                                                                                                    // 177
});                                                                                                                   // 158
RocketChat.API.v1.addRoute('users.resetAvatar', {                                                                     // 180
	authRequired: true                                                                                                   // 180
}, {                                                                                                                  // 180
	post: function () {                                                                                                  // 181
		var user = this.getUserFromParams();                                                                                // 182
                                                                                                                      //
		if (user._id === this.userId) {                                                                                     // 184
			Meteor.runAsUser(this.userId, function () {                                                                        // 185
				return Meteor.call('resetAvatar');                                                                                // 185
			});                                                                                                                // 185
		} else if (RocketChat.authz.hasPermission(this.userId, 'edit-other-user-info')) {                                   // 186
			Meteor.runAsUser(user._id, function () {                                                                           // 187
				return Meteor.call('resetAvatar');                                                                                // 187
			});                                                                                                                // 187
		} else {                                                                                                            // 188
			return RocketChat.API.v1.unauthorized();                                                                           // 189
		}                                                                                                                   // 190
                                                                                                                      //
		return RocketChat.API.v1.success();                                                                                 // 192
	}                                                                                                                    // 193
});                                                                                                                   // 180
RocketChat.API.v1.addRoute('users.setAvatar', {                                                                       // 196
	authRequired: true                                                                                                   // 196
}, {                                                                                                                  // 196
	post: function () {                                                                                                  // 197
		var _this3 = this;                                                                                                  // 197
                                                                                                                      //
		check(this.bodyParams, Match.ObjectIncluding({                                                                      // 198
			avatarUrl: Match.Maybe(String),                                                                                    // 199
			userId: Match.Maybe(String),                                                                                       // 200
			username: Match.Maybe(String)                                                                                      // 201
		}));                                                                                                                // 198
		var user = void 0;                                                                                                  // 204
                                                                                                                      //
		if (this.isUserFromParams()) {                                                                                      // 205
			user = Meteor.users.findOne(this.userId);                                                                          // 206
		} else if (RocketChat.authz.hasPermission(this.userId, 'edit-other-user-info')) {                                   // 207
			user = this.getUserFromParams();                                                                                   // 208
		} else {                                                                                                            // 209
			return RocketChat.API.v1.unauthorized();                                                                           // 210
		}                                                                                                                   // 211
                                                                                                                      //
		Meteor.runAsUser(user._id, function () {                                                                            // 213
			if (_this3.bodyParams.avatarUrl) {                                                                                 // 214
				RocketChat.setUserAvatar(user, _this3.bodyParams.avatarUrl, '', 'url');                                           // 215
			} else {                                                                                                           // 216
				var Busboy = Npm.require('busboy');                                                                               // 217
                                                                                                                      //
				var busboy = new Busboy({                                                                                         // 218
					headers: _this3.request.headers                                                                                  // 218
				});                                                                                                               // 218
				Meteor.wrapAsync(function (callback) {                                                                            // 220
					busboy.on('file', Meteor.bindEnvironment(function (fieldname, file, filename, encoding, mimetype) {              // 221
						if (fieldname !== 'image') {                                                                                    // 222
							return callback(new Meteor.Error('invalid-field'));                                                            // 223
						}                                                                                                               // 224
                                                                                                                      //
						var imageData = [];                                                                                             // 226
						file.on('data', Meteor.bindEnvironment(function (data) {                                                        // 227
							imageData.push(data);                                                                                          // 228
						}));                                                                                                            // 229
						file.on('end', Meteor.bindEnvironment(function () {                                                             // 231
							RocketChat.setUserAvatar(user, Buffer.concat(imageData), mimetype, 'rest');                                    // 232
							callback();                                                                                                    // 233
						}));                                                                                                            // 234
					}));                                                                                                             // 236
                                                                                                                      //
					_this3.request.pipe(busboy);                                                                                     // 237
				})();                                                                                                             // 238
			}                                                                                                                  // 239
		});                                                                                                                 // 240
		return RocketChat.API.v1.success();                                                                                 // 242
	}                                                                                                                    // 243
});                                                                                                                   // 196
RocketChat.API.v1.addRoute('users.update', {                                                                          // 246
	authRequired: true                                                                                                   // 246
}, {                                                                                                                  // 246
	post: function () {                                                                                                  // 247
		var _this4 = this;                                                                                                  // 247
                                                                                                                      //
		check(this.bodyParams, {                                                                                            // 248
			userId: String,                                                                                                    // 249
			data: Match.ObjectIncluding({                                                                                      // 250
				email: Match.Maybe(String),                                                                                       // 251
				name: Match.Maybe(String),                                                                                        // 252
				password: Match.Maybe(String),                                                                                    // 253
				username: Match.Maybe(String),                                                                                    // 254
				active: Match.Maybe(Boolean),                                                                                     // 255
				roles: Match.Maybe(Array),                                                                                        // 256
				joinDefaultChannels: Match.Maybe(Boolean),                                                                        // 257
				requirePasswordChange: Match.Maybe(Boolean),                                                                      // 258
				sendWelcomeEmail: Match.Maybe(Boolean),                                                                           // 259
				verified: Match.Maybe(Boolean),                                                                                   // 260
				customFields: Match.Maybe(Object)                                                                                 // 261
			})                                                                                                                 // 250
		});                                                                                                                 // 248
                                                                                                                      //
		var userData = _.extend({                                                                                           // 265
			_id: this.bodyParams.userId                                                                                        // 265
		}, this.bodyParams.data);                                                                                           // 265
                                                                                                                      //
		Meteor.runAsUser(this.userId, function () {                                                                         // 267
			return RocketChat.saveUser(_this4.userId, userData);                                                               // 267
		});                                                                                                                 // 267
                                                                                                                      //
		if (this.bodyParams.data.customFields) {                                                                            // 269
			RocketChat.saveCustomFields(this.bodyParams.userId, this.bodyParams.data.customFields);                            // 270
		}                                                                                                                   // 271
                                                                                                                      //
		if (typeof this.bodyParams.data.active !== 'undefined') {                                                           // 273
			Meteor.runAsUser(this.userId, function () {                                                                        // 274
				Meteor.call('setUserActiveStatus', _this4.bodyParams.userId, _this4.bodyParams.data.active);                      // 275
			});                                                                                                                // 276
		}                                                                                                                   // 277
                                                                                                                      //
		return RocketChat.API.v1.success({                                                                                  // 279
			user: RocketChat.models.Users.findOneById(this.bodyParams.userId, {                                                // 279
				fields: RocketChat.API.v1.defaultFieldsToExclude                                                                  // 279
			})                                                                                                                 // 279
		});                                                                                                                 // 279
	}                                                                                                                    // 280
});                                                                                                                   // 246
RocketChat.API.v1.addRoute('users.createToken', {                                                                     // 283
	authRequired: true                                                                                                   // 283
}, {                                                                                                                  // 283
	post: function () {                                                                                                  // 284
		var user = this.getUserFromParams();                                                                                // 285
		var data = void 0;                                                                                                  // 286
		Meteor.runAsUser(this.userId, function () {                                                                         // 287
			data = Meteor.call('createToken', user._id);                                                                       // 288
		});                                                                                                                 // 289
		return data ? RocketChat.API.v1.success({                                                                           // 290
			data: data                                                                                                         // 290
		}) : RocketChat.API.v1.unauthorized();                                                                              // 290
	}                                                                                                                    // 291
});                                                                                                                   // 283
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"default":{"helpers":{"getLoggedInUser.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_api/server/default/helpers/getLoggedInUser.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
RocketChat.API.default.helperMethods.set('getLoggedInUser', function () {                                             // 1
	function _getLoggedInUser() {                                                                                        // 1
		var user = void 0;                                                                                                  // 2
                                                                                                                      //
		if (this.request.headers['x-auth-token'] && this.request.headers['x-user-id']) {                                    // 4
			user = RocketChat.models.Users.findOne({                                                                           // 5
				'_id': this.request.headers['x-user-id'],                                                                         // 6
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(this.request.headers['x-auth-token'])         // 7
			});                                                                                                                // 5
		}                                                                                                                   // 9
                                                                                                                      //
		return user;                                                                                                        // 11
	}                                                                                                                    // 12
                                                                                                                      //
	return _getLoggedInUser;                                                                                             // 1
}());                                                                                                                 // 1
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"info.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_api/server/default/info.js                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
RocketChat.API.default.addRoute('info', {                                                                             // 1
	authRequired: false                                                                                                  // 1
}, {                                                                                                                  // 1
	get: function () {                                                                                                   // 2
		var user = this.getLoggedInUser();                                                                                  // 3
                                                                                                                      //
		if (user && RocketChat.authz.hasRole(user._id, 'admin')) {                                                          // 5
			return RocketChat.API.v1.success({                                                                                 // 6
				info: RocketChat.Info                                                                                             // 7
			});                                                                                                                // 6
		}                                                                                                                   // 9
                                                                                                                      //
		return RocketChat.API.v1.success({                                                                                  // 11
			version: RocketChat.Info.version                                                                                   // 12
		});                                                                                                                 // 11
	}                                                                                                                    // 14
});                                                                                                                   // 1
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"metrics.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_api/server/default/metrics.js                                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
RocketChat.API.default.addRoute('metrics', {                                                                          // 1
	authRequired: false                                                                                                  // 1
}, {                                                                                                                  // 1
	get: function () {                                                                                                   // 2
		return {                                                                                                            // 3
			headers: {                                                                                                         // 4
				'Content-Type': 'text/plain'                                                                                      // 4
			},                                                                                                                 // 4
			body: RocketChat.promclient.register.metrics()                                                                     // 5
		};                                                                                                                  // 3
	}                                                                                                                    // 7
});                                                                                                                   // 1
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:api/server/api.js");
require("./node_modules/meteor/rocketchat:api/server/settings.js");
require("./node_modules/meteor/rocketchat:api/server/v1/helpers/requestParams.js");
require("./node_modules/meteor/rocketchat:api/server/v1/helpers/getPaginationItems.js");
require("./node_modules/meteor/rocketchat:api/server/v1/helpers/getUserFromParams.js");
require("./node_modules/meteor/rocketchat:api/server/v1/helpers/isUserFromParams.js");
require("./node_modules/meteor/rocketchat:api/server/v1/helpers/parseJsonQuery.js");
require("./node_modules/meteor/rocketchat:api/server/v1/helpers/getLoggedInUser.js");
require("./node_modules/meteor/rocketchat:api/server/default/helpers/getLoggedInUser.js");
require("./node_modules/meteor/rocketchat:api/server/default/info.js");
require("./node_modules/meteor/rocketchat:api/server/default/metrics.js");
require("./node_modules/meteor/rocketchat:api/server/v1/channels.js");
require("./node_modules/meteor/rocketchat:api/server/v1/chat.js");
require("./node_modules/meteor/rocketchat:api/server/v1/groups.js");
require("./node_modules/meteor/rocketchat:api/server/v1/im.js");
require("./node_modules/meteor/rocketchat:api/server/v1/integrations.js");
require("./node_modules/meteor/rocketchat:api/server/v1/misc.js");
require("./node_modules/meteor/rocketchat:api/server/v1/settings.js");
require("./node_modules/meteor/rocketchat:api/server/v1/stats.js");
require("./node_modules/meteor/rocketchat:api/server/v1/users.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:api'] = {};

})();

//# sourceMappingURL=rocketchat_api.js.map

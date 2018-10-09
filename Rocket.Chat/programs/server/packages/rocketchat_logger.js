(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var Random = Package.random.Random;
var Log = Package.logging.Log;
var colors = Package['nooitaf:colors'].colors;
var EventEmitter = Package['raix:eventemitter'].EventEmitter;
var meteorInstall = Package.modules.meteorInstall;
var process = Package.modules.process;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

/* Package-scope variables */
var LoggerManager, Logger, SystemLogger;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:logger":{"server.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/rocketchat_logger/server.js                                                                         //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");                                   //
                                                                                                                //
var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);                                          //
                                                                                                                //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                         //
                                                                                                                //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                //
                                                                                                                //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                   //
                                                                                                                //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                          //
                                                                                                                //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                     //
                                                                                                                //
var _inherits3 = _interopRequireDefault(_inherits2);                                                            //
                                                                                                                //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }               //
                                                                                                                //
module.export({                                                                                                 // 1
	SystemLogger: function () {                                                                                    // 1
		return SystemLogger;                                                                                          // 1
	},                                                                                                             // 1
	StdOut: function () {                                                                                          // 1
		return StdOut;                                                                                                // 1
	},                                                                                                             // 1
	LoggerManager: function () {                                                                                   // 1
		return LoggerManager;                                                                                         // 1
	},                                                                                                             // 1
	processString: function () {                                                                                   // 1
		return processString;                                                                                         // 1
	},                                                                                                             // 1
	Logger: function () {                                                                                          // 1
		return Logger;                                                                                                // 1
	}                                                                                                              // 1
});                                                                                                             // 1
/* globals EventEmitter LoggerManager SystemLogger Log*/ //TODO: change this global to import                   // 1
module.runSetters(LoggerManager = new (function (_EventEmitter) {                                               // 4
	(0, _inherits3.default)(_class, _EventEmitter);                                                                // 4
                                                                                                                //
	// eslint-disable-line no-undef                                                                                // 4
	function _class() {                                                                                            // 5
		(0, _classCallCheck3.default)(this, _class);                                                                  // 5
                                                                                                                //
		var _this = (0, _possibleConstructorReturn3.default)(this, _EventEmitter.call(this));                         // 5
                                                                                                                //
		_this.enabled = false;                                                                                        // 7
		_this.loggers = {};                                                                                           // 8
		_this.queue = [];                                                                                             // 9
		_this.showPackage = false;                                                                                    // 10
		_this.showFileAndLine = false;                                                                                // 11
		_this.logLevel = 0;                                                                                           // 12
		return _this;                                                                                                 // 5
	}                                                                                                              // 13
                                                                                                                //
	_class.prototype.register = function () {                                                                      // 4
		function register(logger) {                                                                                   // 4
			if (!logger instanceof Logger) {                                                                             // 15
				return;                                                                                                     // 16
			}                                                                                                            // 17
                                                                                                                //
			this.loggers[logger.name] = logger;                                                                          // 18
			this.emit('register', logger);                                                                               // 19
		}                                                                                                             // 20
                                                                                                                //
		return register;                                                                                              // 4
	}();                                                                                                           // 4
                                                                                                                //
	_class.prototype.addToQueue = function () {                                                                    // 4
		function addToQueue(logger, args) {                                                                           // 4
			this.queue.push({                                                                                            // 22
				logger: logger,                                                                                             // 23
				args: args                                                                                                  // 23
			});                                                                                                          // 22
		}                                                                                                             // 25
                                                                                                                //
		return addToQueue;                                                                                            // 4
	}();                                                                                                           // 4
                                                                                                                //
	_class.prototype.dispatchQueue = function () {                                                                 // 4
		function dispatchQueue() {                                                                                    // 4
			_.each(this.queue, function (item) {                                                                         // 27
				return item.logger._log.apply(item.logger, item.args);                                                      // 27
			});                                                                                                          // 27
                                                                                                                //
			this.clearQueue();                                                                                           // 28
		}                                                                                                             // 29
                                                                                                                //
		return dispatchQueue;                                                                                         // 4
	}();                                                                                                           // 4
                                                                                                                //
	_class.prototype.clearQueue = function () {                                                                    // 4
		function clearQueue() {                                                                                       // 4
			this.queue = [];                                                                                             // 31
		}                                                                                                             // 32
                                                                                                                //
		return clearQueue;                                                                                            // 4
	}();                                                                                                           // 4
                                                                                                                //
	_class.prototype.disable = function () {                                                                       // 4
		function disable() {                                                                                          // 4
			this.enabled = false;                                                                                        // 35
		}                                                                                                             // 36
                                                                                                                //
		return disable;                                                                                               // 4
	}();                                                                                                           // 4
                                                                                                                //
	_class.prototype.enable = function () {                                                                        // 4
		function enable() {                                                                                           // 4
			var dispatchQueue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;               // 38
			this.enabled = true;                                                                                         // 39
			return dispatchQueue === true ? this.dispatchQueue() : this.clearQueue();                                    // 40
		}                                                                                                             // 41
                                                                                                                //
		return enable;                                                                                                // 4
	}();                                                                                                           // 4
                                                                                                                //
	return _class;                                                                                                 // 4
}(EventEmitter))());                                                                                            // 4
var defaultTypes = {                                                                                            // 46
	debug: {                                                                                                       // 47
		name: 'debug',                                                                                                // 48
		color: 'blue',                                                                                                // 49
		level: 2                                                                                                      // 50
	},                                                                                                             // 47
	log: {                                                                                                         // 52
		name: 'info',                                                                                                 // 53
		color: 'blue',                                                                                                // 54
		level: 1                                                                                                      // 55
	},                                                                                                             // 52
	info: {                                                                                                        // 57
		name: 'info',                                                                                                 // 58
		color: 'blue',                                                                                                // 59
		level: 1                                                                                                      // 60
	},                                                                                                             // 57
	success: {                                                                                                     // 62
		name: 'info',                                                                                                 // 63
		color: 'green',                                                                                               // 64
		level: 1                                                                                                      // 65
	},                                                                                                             // 62
	warn: {                                                                                                        // 67
		name: 'warn',                                                                                                 // 68
		color: 'magenta',                                                                                             // 69
		level: 1                                                                                                      // 70
	},                                                                                                             // 67
	error: {                                                                                                       // 72
		name: 'error',                                                                                                // 73
		color: 'red',                                                                                                 // 74
		level: 0                                                                                                      // 75
	}                                                                                                              // 72
};                                                                                                              // 46
                                                                                                                //
var _Logger = function () {                                                                                     //
	function _Logger(name) {                                                                                       // 80
		var _this2 = this;                                                                                            // 80
                                                                                                                //
		var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};                          // 80
		(0, _classCallCheck3.default)(this, _Logger);                                                                 // 80
		var self = this;                                                                                              // 81
		this.name = name;                                                                                             // 82
		this.config = Object.assign({}, config);                                                                      // 84
                                                                                                                //
		if (LoggerManager.loggers && LoggerManager.loggers[this.name] != null) {                                      // 85
			LoggerManager.loggers[this.name].warn('Duplicated instance');                                                // 86
			return LoggerManager.loggers[this.name];                                                                     // 87
		}                                                                                                             // 88
                                                                                                                //
		_.each(defaultTypes, function (typeConfig, type) {                                                            // 89
			_this2[type] = function () {                                                                                 // 90
				for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {                      // 90
					args[_key] = arguments[_key];                                                                              // 90
				}                                                                                                           // 90
                                                                                                                //
				return self._log.call(self, {                                                                               // 91
					section: this.__section,                                                                                   // 92
					type: type,                                                                                                // 93
					level: typeConfig.level,                                                                                   // 94
					method: typeConfig.name,                                                                                   // 95
					'arguments': args                                                                                          // 96
				});                                                                                                         // 91
			};                                                                                                           // 98
                                                                                                                //
			self[type + "_box"] = function () {                                                                          // 100
				for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {                // 100
					args[_key2] = arguments[_key2];                                                                            // 100
				}                                                                                                           // 100
                                                                                                                //
				return self._log.call(self, {                                                                               // 101
					section: this.__section,                                                                                   // 102
					type: type,                                                                                                // 103
					box: true,                                                                                                 // 104
					level: typeConfig.level,                                                                                   // 105
					method: typeConfig.name,                                                                                   // 106
					'arguments': args                                                                                          // 107
				});                                                                                                         // 101
			};                                                                                                           // 109
		});                                                                                                           // 110
                                                                                                                //
		if (this.config.methods) {                                                                                    // 111
			_.each(this.config.methods, function (typeConfig, method) {                                                  // 112
				if (_this2[method] != null) {                                                                               // 113
					self.warn("Method " + method + " already exists");                                                         // 114
				}                                                                                                           // 115
                                                                                                                //
				if (defaultTypes[typeConfig.type] == null) {                                                                // 116
					self.warn("Method type " + typeConfig.type + " does not exist");                                           // 117
				}                                                                                                           // 118
                                                                                                                //
				_this2[method] = function () {                                                                              // 119
					for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {               // 119
						args[_key3] = arguments[_key3];                                                                           // 119
					}                                                                                                          // 119
                                                                                                                //
					return self._log.call(self, {                                                                              // 120
						section: this.__section,                                                                                  // 121
						type: typeConfig.type,                                                                                    // 122
						level: typeConfig.level != null ? typeConfig.level : defaultTypes[typeConfig.type] && defaultTypes[typeConfig.type].level,
						method: method,                                                                                           // 124
						'arguments': args                                                                                         // 125
					});                                                                                                        // 120
				};                                                                                                          // 127
                                                                                                                //
				_this2[method + "_box"] = function () {                                                                     // 128
					for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {               // 128
						args[_key4] = arguments[_key4];                                                                           // 128
					}                                                                                                          // 128
                                                                                                                //
					return self._log.call(self, {                                                                              // 129
						section: this.__section,                                                                                  // 130
						type: typeConfig.type,                                                                                    // 131
						box: true,                                                                                                // 132
						level: typeConfig.level != null ? typeConfig.level : defaultTypes[typeConfig.type] && defaultTypes[typeConfig.type].level,
						method: method,                                                                                           // 134
						'arguments': args                                                                                         // 135
					});                                                                                                        // 129
				};                                                                                                          // 137
			});                                                                                                          // 138
		}                                                                                                             // 139
                                                                                                                //
		if (this.config.sections) {                                                                                   // 140
			_.each(this.config.sections, function (name, section) {                                                      // 141
				_this2[section] = {};                                                                                       // 142
                                                                                                                //
				_.each(defaultTypes, function (typeConfig, type) {                                                          // 143
					self[section][type] = function () {                                                                        // 144
						for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {              // 144
							args[_key5] = arguments[_key5];                                                                          // 144
						}                                                                                                         // 144
                                                                                                                //
						return _this2[type].apply({                                                                               // 144
							__section: name                                                                                          // 144
						}, args);                                                                                                 // 144
					};                                                                                                         // 144
                                                                                                                //
					self[section][type + "_box"] = function () {                                                               // 145
						for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {              // 145
							args[_key6] = arguments[_key6];                                                                          // 145
						}                                                                                                         // 145
                                                                                                                //
						return _this2[type + "_box"].apply({                                                                      // 145
							__section: name                                                                                          // 145
						}, args);                                                                                                 // 145
					};                                                                                                         // 145
				});                                                                                                         // 146
                                                                                                                //
				_.each(_this2.config.methods, function (typeConfig, method) {                                               // 147
					self[section][method] = function () {                                                                      // 148
						for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {              // 148
							args[_key7] = arguments[_key7];                                                                          // 148
						}                                                                                                         // 148
                                                                                                                //
						return self[method].apply({                                                                               // 148
							__section: name                                                                                          // 148
						}, args);                                                                                                 // 148
					};                                                                                                         // 148
                                                                                                                //
					self[section][method + "_box"] = function () {                                                             // 149
						for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {              // 149
							args[_key8] = arguments[_key8];                                                                          // 149
						}                                                                                                         // 149
                                                                                                                //
						return self[method + "_box"].apply({                                                                      // 149
							__section: name                                                                                          // 149
						}, args);                                                                                                 // 149
					};                                                                                                         // 149
				});                                                                                                         // 150
			});                                                                                                          // 151
		}                                                                                                             // 152
                                                                                                                //
		LoggerManager.register(this);                                                                                 // 154
	}                                                                                                              // 155
                                                                                                                //
	_Logger.prototype.getPrefix = function () {                                                                    //
		function getPrefix(options) {                                                                                 //
			var prefix = this.name + " \u2794 " + options.method;                                                        // 157
                                                                                                                //
			if (options.section) {                                                                                       // 158
				prefix = this.name + " \u2794 " + options.section + "." + options.method;                                   // 159
			}                                                                                                            // 160
                                                                                                                //
			var details = this._getCallerDetails();                                                                      // 161
                                                                                                                //
			var detailParts = [];                                                                                        // 162
                                                                                                                //
			if (details['package'] && (LoggerManager.showPackage === true || options.type === 'error')) {                // 163
				detailParts.push(details['package']);                                                                       // 164
			}                                                                                                            // 165
                                                                                                                //
			if (LoggerManager.showFileAndLine === true || options.type === 'error') {                                    // 166
				if (details.file != null && details.line != null) {                                                         // 167
					detailParts.push(details.file + ":" + details.line);                                                       // 168
				} else {                                                                                                    // 169
					if (details.file != null) {                                                                                // 170
						detailParts.push(details.file);                                                                           // 171
					}                                                                                                          // 172
                                                                                                                //
					if (details.line != null) {                                                                                // 173
						detailParts.push(details.line);                                                                           // 174
					}                                                                                                          // 175
				}                                                                                                           // 176
			}                                                                                                            // 177
                                                                                                                //
			if (defaultTypes[options.type]) {                                                                            // 178
				// format the message to a colored message                                                                  // 179
				prefix = prefix[defaultTypes[options.type].color];                                                          // 180
			}                                                                                                            // 181
                                                                                                                //
			if (detailParts.length > 0) {                                                                                // 182
				prefix = detailParts.join(' ') + " " + prefix;                                                              // 183
			}                                                                                                            // 184
                                                                                                                //
			return prefix;                                                                                               // 185
		}                                                                                                             // 186
                                                                                                                //
		return getPrefix;                                                                                             //
	}();                                                                                                           //
                                                                                                                //
	_Logger.prototype._getCallerDetails = function () {                                                            //
		function _getCallerDetails() {                                                                                //
			var getStack = function () {                                                                                 // 188
				// We do NOT use Error.prepareStackTrace here (a V8 extension that gets us a                                // 189
				// core-parsed stack) since it's impossible to compose it with the use of                                   // 190
				// Error.prepareStackTrace used on the server for source maps.                                              // 191
				var _ref = new Error(),                                                                                     // 188
				    stack = _ref.stack;                                                                                     // 188
                                                                                                                //
				return stack;                                                                                               // 193
			};                                                                                                           // 194
                                                                                                                //
			var stack = getStack();                                                                                      // 195
                                                                                                                //
			if (!stack) {                                                                                                // 196
				return {};                                                                                                  // 197
			}                                                                                                            // 198
                                                                                                                //
			var lines = stack.split('\n').splice(1); // looking for the first line outside the logging package (or an    // 199
			// eval if we find that first)                                                                               // 201
                                                                                                                //
			var line = lines[0];                                                                                         // 202
                                                                                                                //
			for (var index = 0, len = lines.length; index < len, index++; line = lines[index]) {                         // 203
				if (line.match(/^\s*at eval \(eval/)) {                                                                     // 204
					return {                                                                                                   // 205
						file: 'eval'                                                                                              // 205
					};                                                                                                         // 205
				}                                                                                                           // 206
                                                                                                                //
				if (!line.match(/packages\/rocketchat_logger(?:\/|\.js)/)) {                                                // 208
					break;                                                                                                     // 209
				}                                                                                                           // 210
			}                                                                                                            // 211
                                                                                                                //
			var details = {}; // The format for FF is 'functionName@filePath:lineNumber'                                 // 213
			// The format for V8 is 'functionName (packages/logging/logging.js:81)' or                                   // 215
			//                      'packages/logging/logging.js:81'                                                     // 216
                                                                                                                //
			var match = /(?:[@(]| at )([^(]+?):([0-9:]+)(?:\)|$)/.exec(line);                                            // 217
                                                                                                                //
			if (!match) {                                                                                                // 218
				return details;                                                                                             // 219
			}                                                                                                            // 220
                                                                                                                //
			details.line = match[2].split(':')[0]; // Possible format: https://foo.bar.com/scripts/file.js?random=foobar
			// XXX: if you can write the following in better way, please do it                                           // 223
			// XXX: what about evals?                                                                                    // 224
                                                                                                                //
			details.file = match[1].split('/').slice(-1)[0].split('?')[0];                                               // 225
			var packageMatch = match[1].match(/packages\/([^\.\/]+)(?:\/|\.)/);                                          // 226
                                                                                                                //
			if (packageMatch) {                                                                                          // 227
				details['package'] = packageMatch[1];                                                                       // 228
			}                                                                                                            // 229
                                                                                                                //
			return details;                                                                                              // 230
		}                                                                                                             // 231
                                                                                                                //
		return _getCallerDetails;                                                                                     //
	}();                                                                                                           //
                                                                                                                //
	_Logger.prototype.makeABox = function () {                                                                     //
		function makeABox(message, title) {                                                                           //
			if (!_.isArray(message)) {                                                                                   // 233
				message = message.split('\n');                                                                              // 234
			}                                                                                                            // 235
                                                                                                                //
			var len = 0;                                                                                                 // 236
			len = Math.max.apply(null, message.map(function (line) {                                                     // 238
				return line.length;                                                                                         // 238
			}));                                                                                                         // 238
			var topLine = "+--" + s.pad('', len, '-') + "--+";                                                           // 240
			var separator = "|  " + s.pad('', len, '') + "  |";                                                          // 241
			var lines = [];                                                                                              // 242
			lines.push(topLine);                                                                                         // 244
                                                                                                                //
			if (title) {                                                                                                 // 245
				lines.push("|  " + s.lrpad(title, len) + "  |");                                                            // 246
				lines.push(topLine);                                                                                        // 247
			}                                                                                                            // 248
                                                                                                                //
			lines.push(separator);                                                                                       // 249
			lines = [].concat((0, _toConsumableArray3.default)(lines), (0, _toConsumableArray3.default)(message.map(function (line) {
				return "|  " + s.rpad(line, len) + "  |";                                                                   // 251
			})));                                                                                                        // 251
			lines.push(separator);                                                                                       // 253
			lines.push(topLine);                                                                                         // 254
			return lines;                                                                                                // 255
		}                                                                                                             // 256
                                                                                                                //
		return makeABox;                                                                                              //
	}();                                                                                                           //
                                                                                                                //
	_Logger.prototype._log = function () {                                                                         //
		function _log(options) {                                                                                      //
			if (LoggerManager.enabled === false) {                                                                       // 259
				LoggerManager.addToQueue(this, arguments);                                                                  // 260
				return;                                                                                                     // 261
			}                                                                                                            // 262
                                                                                                                //
			if (options.level == null) {                                                                                 // 263
				options.level = 1;                                                                                          // 264
			}                                                                                                            // 265
                                                                                                                //
			if (LoggerManager.logLevel < options.level) {                                                                // 267
				return;                                                                                                     // 268
			}                                                                                                            // 269
                                                                                                                //
			var prefix = this.getPrefix(options);                                                                        // 271
                                                                                                                //
			if (options.box === true && _.isString(options.arguments[0])) {                                              // 273
				var color = undefined;                                                                                      // 274
                                                                                                                //
				if (defaultTypes[options.type]) {                                                                           // 275
					color = defaultTypes[options.type].color;                                                                  // 276
				}                                                                                                           // 277
                                                                                                                //
				var box = this.makeABox(options.arguments[0], options.arguments[1]);                                        // 279
				var subPrefix = '➔';                                                                                        // 280
                                                                                                                //
				if (color) {                                                                                                // 281
					subPrefix = subPrefix[color];                                                                              // 282
				}                                                                                                           // 283
                                                                                                                //
				console.log(subPrefix, prefix);                                                                             // 285
				box.forEach(function (line) {                                                                               // 286
					console.log(subPrefix, color ? line[color] : line);                                                        // 287
				});                                                                                                         // 288
			} else {                                                                                                     // 290
				options.arguments.unshift(prefix);                                                                          // 291
				console.log.apply(console, options.arguments);                                                              // 292
			}                                                                                                            // 293
		}                                                                                                             // 294
                                                                                                                //
		return _log;                                                                                                  //
	}();                                                                                                           //
                                                                                                                //
	return _Logger;                                                                                                //
}(); // TODO: change this global to import                                                                      //
                                                                                                                //
                                                                                                                //
module.runSetters(Logger = global.Logger = _Logger);                                                            // 297
                                                                                                                //
var processString = function (string, date) {                                                                   // 298
	var obj = void 0;                                                                                              // 299
                                                                                                                //
	try {                                                                                                          // 300
		if (string[0] === '{') {                                                                                      // 301
			obj = EJSON.parse(string);                                                                                   // 302
		} else {                                                                                                      // 303
			obj = {                                                                                                      // 304
				message: string,                                                                                            // 305
				time: date,                                                                                                 // 306
				level: 'info'                                                                                               // 307
			};                                                                                                           // 304
		}                                                                                                             // 309
                                                                                                                //
		return Log.format(obj, {                                                                                      // 310
			color: true                                                                                                  // 310
		});                                                                                                           // 310
	} catch (error) {                                                                                              // 311
		return string;                                                                                                // 312
	}                                                                                                              // 313
}; // TODO: change this global to import                                                                        // 314
                                                                                                                //
                                                                                                                //
module.runSetters(SystemLogger = new Logger('System', {                                                         // 316
	// eslint-disable-line no-undef                                                                                // 316
	methods: {                                                                                                     // 317
		startup: {                                                                                                    // 318
			type: 'success',                                                                                             // 319
			level: 0                                                                                                     // 320
		}                                                                                                             // 318
	}                                                                                                              // 317
}));                                                                                                            // 316
var StdOut = new (function (_EventEmitter2) {                                                                   // 326
	(0, _inherits3.default)(_class2, _EventEmitter2);                                                              // 326
                                                                                                                //
	function _class2() {                                                                                           // 327
		(0, _classCallCheck3.default)(this, _class2);                                                                 // 327
                                                                                                                //
		var _this3 = (0, _possibleConstructorReturn3.default)(this, _EventEmitter2.call(this));                       // 327
                                                                                                                //
		var write = process.stdout.write;                                                                             // 329
		_this3.queue = [];                                                                                            // 330
                                                                                                                //
		process.stdout.write = function () {                                                                          // 331
			for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {                 // 331
				args[_key9] = arguments[_key9];                                                                             // 331
			}                                                                                                            // 331
                                                                                                                //
			write.apply(process.stdout, args);                                                                           // 332
			var date = new Date();                                                                                       // 333
			var string = processString(args[0], date);                                                                   // 334
			var item = {                                                                                                 // 335
				id: Random.id(),                                                                                            // 336
				string: string,                                                                                             // 337
				ts: date                                                                                                    // 338
			};                                                                                                           // 335
                                                                                                                //
			_this3.queue.push(item);                                                                                     // 340
                                                                                                                //
			if (typeof RocketChat !== 'undefined') {                                                                     // 342
				var limit = RocketChat.settings.get('Log_View_Limit');                                                      // 343
                                                                                                                //
				if (limit && _this3.queue.length > limit) {                                                                 // 344
					_this3.queue.shift();                                                                                      // 345
				}                                                                                                           // 346
			}                                                                                                            // 347
                                                                                                                //
			_this3.emit('write', string, item);                                                                          // 348
		};                                                                                                            // 349
                                                                                                                //
		return _this3;                                                                                                // 327
	}                                                                                                              // 350
                                                                                                                //
	return _class2;                                                                                                // 326
}(EventEmitter))();                                                                                             // 326
Meteor.publish('stdout', function () {                                                                          // 354
	var _this4 = this;                                                                                             // 354
                                                                                                                //
	if (!this.userId || RocketChat.authz.hasPermission(this.userId, 'view-logs') !== true) {                       // 355
		return this.ready();                                                                                          // 356
	}                                                                                                              // 357
                                                                                                                //
	StdOut.queue.forEach(function (item) {                                                                         // 359
		_this4.added('stdout', item.id, {                                                                             // 360
			string: item.string,                                                                                         // 361
			ts: item.ts                                                                                                  // 362
		});                                                                                                           // 360
	});                                                                                                            // 364
	this.ready();                                                                                                  // 366
	StdOut.on('write', function (string, item) {                                                                   // 367
		_this4.added('stdout', item.id, {                                                                             // 368
			string: item.string,                                                                                         // 369
			ts: item.ts                                                                                                  // 370
		});                                                                                                           // 368
	});                                                                                                            // 372
});                                                                                                             // 373
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:logger/server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['rocketchat:logger'] = {}, {
  Logger: Logger,
  SystemLogger: SystemLogger,
  LoggerManager: LoggerManager
});

})();

//# sourceMappingURL=rocketchat_logger.js.map

(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RocketChatTabBar = Package['rocketchat:lib'].RocketChatTabBar;
var s = Package['underscorestring:underscore.string'].s;
var meteorInstall = Package.modules.meteorInstall;
var process = Package.modules.process;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

/* Package-scope variables */
var Hubot, HubotScripts, InternalHubot, InternalHubotReceiver, RocketChatAdapter;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:internal-hubot":{"hubot.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_internal-hubot/hubot.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                          //
                                                                                                                       //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                                 //
                                                                                                                       //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                            //
                                                                                                                       //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                   //
                                                                                                                       //
var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");                                          //
                                                                                                                       //
var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);                                                 //
                                                                                                                       //
var _this = this;                                                                                                      //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
/* globals __meteor_bootstrap__ */var CoffeeScript = Npm.require('coffee-script');                                     // 1
                                                                                                                       //
CoffeeScript.register();                                                                                               // 3
                                                                                                                       //
var Hubot = Npm.require('hubot'); // Start a hubot, connected to our chat room.                                        // 4
// 'use strict'                                                                                                        // 6
// Log messages?                                                                                                       // 7
                                                                                                                       //
                                                                                                                       //
var DEBUG = false;                                                                                                     // 8
var InternalHubot = {};                                                                                                // 10
var sendHelper = Meteor.bindEnvironment(function (robot, envelope, strings, map) {                                     // 12
	while (strings.length > 0) {                                                                                          // 13
		var string = strings.shift();                                                                                        // 14
                                                                                                                       //
		if (typeof string === 'function') {                                                                                  // 15
			string();                                                                                                           // 16
		} else {                                                                                                             // 17
			try {                                                                                                               // 18
				map(string);                                                                                                       // 19
			} catch (err) {                                                                                                     // 20
				if (DEBUG) {                                                                                                       // 21
					console.error("Hubot error: " + err);                                                                             // 21
				}                                                                                                                  // 21
                                                                                                                       //
				robot.logger.error("RocketChat send error: " + err);                                                               // 22
			}                                                                                                                   // 23
		}                                                                                                                    // 24
	}                                                                                                                     // 25
}); // Monkey-patch Hubot to support private messages                                                                  // 26
                                                                                                                       //
Hubot.Response.prototype.priv = function () {                                                                          // 29
	var _robot$adapter;                                                                                                   // 29
                                                                                                                       //
	for (var _len = arguments.length, strings = Array(_len), _key = 0; _key < _len; _key++) {                             // 29
		strings[_key] = arguments[_key];                                                                                     // 29
	}                                                                                                                     // 29
                                                                                                                       //
	return (_robot$adapter = _this.robot.adapter).priv.apply(_robot$adapter, [_this.envelope].concat(strings));           // 29
}; // More monkey-patching                                                                                             // 29
                                                                                                                       //
                                                                                                                       //
Hubot.Robot.prototype.loadAdapter = function () {}; // disable                                                         // 32
// grrrr, Meteor.bindEnvironment doesn't preserve `this` apparently                                                    // 34
                                                                                                                       //
                                                                                                                       //
var bind = function (f) {                                                                                              // 35
	var g = Meteor.bindEnvironment(function (self) {                                                                      // 36
		for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {     // 36
			args[_key2 - 1] = arguments[_key2];                                                                                 // 36
		}                                                                                                                    // 36
                                                                                                                       //
		return f.apply(self, args);                                                                                          // 36
	});                                                                                                                   // 36
	return function () {                                                                                                  // 37
		for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {                         // 37
			args[_key3] = arguments[_key3];                                                                                     // 37
		}                                                                                                                    // 37
                                                                                                                       //
		return g.apply(undefined, [this].concat((0, _toConsumableArray3.default)(Array.from(args))));                        // 37
	};                                                                                                                    // 37
};                                                                                                                     // 38
                                                                                                                       //
var Robot = function (_Hubot$Robot) {                                                                                  //
	(0, _inherits3.default)(Robot, _Hubot$Robot);                                                                         //
                                                                                                                       //
	function Robot() {                                                                                                    // 41
		(0, _classCallCheck3.default)(this, Robot);                                                                          // 41
                                                                                                                       //
		for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {                         // 41
			args[_key4] = arguments[_key4];                                                                                     // 41
		}                                                                                                                    // 41
                                                                                                                       //
		var _this2 = (0, _possibleConstructorReturn3.default)(this, _Hubot$Robot.call.apply(_Hubot$Robot, [this].concat((0, _toConsumableArray3.default)(args || []))));
                                                                                                                       //
		_this2.hear = bind(_this2.hear);                                                                                     // 43
		_this2.respond = bind(_this2.respond);                                                                               // 44
		_this2.enter = bind(_this2.enter);                                                                                   // 45
		_this2.leave = bind(_this2.leave);                                                                                   // 46
		_this2.topic = bind(_this2.topic);                                                                                   // 47
		_this2.error = bind(_this2.error);                                                                                   // 48
		_this2.catchAll = bind(_this2.catchAll);                                                                             // 49
		_this2.user = Meteor.users.findOne({                                                                                 // 50
			username: _this2.name                                                                                               // 50
		}, {                                                                                                                 // 50
			fields: {                                                                                                           // 50
				username: 1                                                                                                        // 50
			}                                                                                                                   // 50
		});                                                                                                                  // 50
		return _this2;                                                                                                       // 41
	}                                                                                                                     // 51
                                                                                                                       //
	Robot.prototype.loadAdapter = function () {                                                                           //
		function loadAdapter() {                                                                                             //
			return false;                                                                                                       // 52
		}                                                                                                                    // 52
                                                                                                                       //
		return loadAdapter;                                                                                                  //
	}();                                                                                                                  //
                                                                                                                       //
	Robot.prototype.hear = function () {                                                                                  //
		function hear(regex, callback) {                                                                                     //
			return _Hubot$Robot.prototype.hear.call(this, regex, Meteor.bindEnvironment(callback));                             // 53
		}                                                                                                                    // 53
                                                                                                                       //
		return hear;                                                                                                         //
	}();                                                                                                                  //
                                                                                                                       //
	Robot.prototype.respond = function () {                                                                               //
		function respond(regex, callback) {                                                                                  //
			return _Hubot$Robot.prototype.respond.call(this, regex, Meteor.bindEnvironment(callback));                          // 54
		}                                                                                                                    // 54
                                                                                                                       //
		return respond;                                                                                                      //
	}();                                                                                                                  //
                                                                                                                       //
	Robot.prototype.enter = function () {                                                                                 //
		function enter(callback) {                                                                                           //
			return _Hubot$Robot.prototype.enter.call(this, Meteor.bindEnvironment(callback));                                   // 55
		}                                                                                                                    // 55
                                                                                                                       //
		return enter;                                                                                                        //
	}();                                                                                                                  //
                                                                                                                       //
	Robot.prototype.leave = function () {                                                                                 //
		function leave(callback) {                                                                                           //
			return _Hubot$Robot.prototype.leave.call(this, Meteor.bindEnvironment(callback));                                   // 56
		}                                                                                                                    // 56
                                                                                                                       //
		return leave;                                                                                                        //
	}();                                                                                                                  //
                                                                                                                       //
	Robot.prototype.topic = function () {                                                                                 //
		function topic(callback) {                                                                                           //
			return _Hubot$Robot.prototype.topic.call(this, Meteor.bindEnvironment(callback));                                   // 57
		}                                                                                                                    // 57
                                                                                                                       //
		return topic;                                                                                                        //
	}();                                                                                                                  //
                                                                                                                       //
	Robot.prototype.error = function () {                                                                                 //
		function error(callback) {                                                                                           //
			return _Hubot$Robot.prototype.error.call(this, Meteor.bindEnvironment(callback));                                   // 58
		}                                                                                                                    // 58
                                                                                                                       //
		return error;                                                                                                        //
	}();                                                                                                                  //
                                                                                                                       //
	Robot.prototype.catchAll = function () {                                                                              //
		function catchAll(callback) {                                                                                        //
			return _Hubot$Robot.prototype.catchAll.call(this, Meteor.bindEnvironment(callback));                                // 59
		}                                                                                                                    // 59
                                                                                                                       //
		return catchAll;                                                                                                     //
	}();                                                                                                                  //
                                                                                                                       //
	return Robot;                                                                                                         //
}(Hubot.Robot);                                                                                                        //
                                                                                                                       //
var RocketChatAdapter = function (_Hubot$Adapter) {                                                                    //
	(0, _inherits3.default)(RocketChatAdapter, _Hubot$Adapter);                                                           //
                                                                                                                       //
	function RocketChatAdapter() {                                                                                        //
		(0, _classCallCheck3.default)(this, RocketChatAdapter);                                                              //
		return (0, _possibleConstructorReturn3.default)(this, _Hubot$Adapter.apply(this, arguments));                        //
	}                                                                                                                     //
                                                                                                                       //
	// Public: Raw method for sending data back to the chat source. Extend this.                                          // 63
	//                                                                                                                    // 64
	// envelope - A Object with message, room and user details.                                                           // 65
	// strings  - One or more Strings for each message to send.                                                           // 66
	//                                                                                                                    // 67
	// Returns nothing.                                                                                                   // 68
	RocketChatAdapter.prototype.send = function () {                                                                      //
		function send(envelope) {                                                                                            //
			if (DEBUG) {                                                                                                        // 70
				console.log('ROCKETCHATADAPTER -> send'.blue);                                                                     // 70
			} // console.log envelope, strings                                                                                  // 70
                                                                                                                       //
                                                                                                                       //
			for (var _len5 = arguments.length, strings = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
				strings[_key5 - 1] = arguments[_key5];                                                                             // 69
			}                                                                                                                   // 69
                                                                                                                       //
			return sendHelper(this.robot, envelope, strings, function (string) {                                                // 72
				if (DEBUG) {                                                                                                       // 73
					console.log("send " + envelope.room + ": " + string + " (" + envelope.user.id + ")");                             // 73
				}                                                                                                                  // 73
                                                                                                                       //
				return RocketChat.sendMessage(InternalHubot.user, {                                                                // 74
					msg: string                                                                                                       // 74
				}, {                                                                                                               // 74
					_id: envelope.room                                                                                                // 74
				});                                                                                                                // 74
			});                                                                                                                 // 75
		}                                                                                                                    // 76
                                                                                                                       //
		return send;                                                                                                         //
	}(); // Public: Raw method for sending emote data back to the chat source.                                            //
	//                                                                                                                    // 79
	// envelope - A Object with message, room and user details.                                                           // 80
	// strings  - One or more Strings for each message to send.                                                           // 81
	//                                                                                                                    // 82
	// Returns nothing.                                                                                                   // 83
                                                                                                                       //
                                                                                                                       //
	RocketChatAdapter.prototype.emote = function () {                                                                     //
		function emote(envelope) {                                                                                           //
			var _this4 = this;                                                                                                  // 84
                                                                                                                       //
			if (DEBUG) {                                                                                                        // 85
				console.log('ROCKETCHATADAPTER -> emote'.blue);                                                                    // 85
			}                                                                                                                   // 85
                                                                                                                       //
			for (var _len6 = arguments.length, strings = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
				strings[_key6 - 1] = arguments[_key6];                                                                             // 84
			}                                                                                                                   // 84
                                                                                                                       //
			return sendHelper(this.robot, envelope, strings, function (string) {                                                // 86
				if (DEBUG) {                                                                                                       // 87
					console.log("emote " + envelope.rid + ": " + string + " (" + envelope.u.username + ")");                          // 87
				}                                                                                                                  // 87
                                                                                                                       //
				if (envelope.message.private) {                                                                                    // 88
					return _this4.priv(envelope, "*** " + string + " ***");                                                           // 88
				}                                                                                                                  // 88
                                                                                                                       //
				return Meteor.call('sendMessage', {                                                                                // 89
					msg: string,                                                                                                      // 90
					rid: envelope.rid,                                                                                                // 91
					action: true                                                                                                      // 92
				});                                                                                                                // 89
			});                                                                                                                 // 95
		}                                                                                                                    // 96
                                                                                                                       //
		return emote;                                                                                                        //
	}(); // Priv: our extension -- send a PM to user                                                                      //
                                                                                                                       //
                                                                                                                       //
	RocketChatAdapter.prototype.priv = function () {                                                                      //
		function priv(envelope) {                                                                                            //
			if (DEBUG) {                                                                                                        // 100
				console.log('ROCKETCHATADAPTER -> priv'.blue);                                                                     // 100
			}                                                                                                                   // 100
                                                                                                                       //
			for (var _len7 = arguments.length, strings = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
				strings[_key7 - 1] = arguments[_key7];                                                                             // 99
			}                                                                                                                   // 99
                                                                                                                       //
			return sendHelper(this.robot, envelope, strings, function (string) {                                                // 101
				if (DEBUG) {                                                                                                       // 102
					console.log("priv " + envelope.room + ": " + string + " (" + envelope.user.id + ")");                             // 102
				}                                                                                                                  // 102
                                                                                                                       //
				return Meteor.call('sendMessage', {                                                                                // 103
					u: {                                                                                                              // 104
						username: 'rocketbot'                                                                                            // 105
					},                                                                                                                // 104
					to: "" + envelope.user.id,                                                                                        // 107
					msg: string,                                                                                                      // 108
					rid: envelope.room                                                                                                // 109
				});                                                                                                                // 103
			});                                                                                                                 // 111
		}                                                                                                                    // 112
                                                                                                                       //
		return priv;                                                                                                         //
	}(); // Public: Raw method for building a reply and sending it back to the chat                                       //
	// source. Extend this.                                                                                               // 115
	//                                                                                                                    // 116
	// envelope - A Object with message, room and user details.                                                           // 117
	// strings  - One or more Strings for each reply to send.                                                             // 118
	//                                                                                                                    // 119
	// Returns nothing.                                                                                                   // 120
                                                                                                                       //
                                                                                                                       //
	RocketChatAdapter.prototype.reply = function () {                                                                     //
		function reply(envelope) {                                                                                           //
			if (DEBUG) {                                                                                                        // 122
				console.log('ROCKETCHATADAPTER -> reply'.blue);                                                                    // 122
			}                                                                                                                   // 122
                                                                                                                       //
			for (var _len8 = arguments.length, strings = Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
				strings[_key8 - 1] = arguments[_key8];                                                                             // 121
			}                                                                                                                   // 121
                                                                                                                       //
			if (envelope.message.private) {                                                                                     // 123
				return this.priv.apply(this, [envelope].concat(strings));                                                          // 124
			} else {                                                                                                            // 125
				return this.send.apply(this, [envelope].concat((0, _toConsumableArray3.default)(strings.map(function (str) {       // 126
					return envelope.user.name + ": " + str;                                                                           // 126
				}))));                                                                                                             // 126
			}                                                                                                                   // 127
		}                                                                                                                    // 128
                                                                                                                       //
		return reply;                                                                                                        //
	}(); // Public: Raw method for setting a topic on the chat source. Extend this.                                       //
	//                                                                                                                    // 131
	// envelope - A Object with message, room and user details.                                                           // 132
	// strings  - One more more Strings to set as the topic.                                                              // 133
	//                                                                                                                    // 134
	// Returns nothing.                                                                                                   // 135
                                                                                                                       //
                                                                                                                       //
	RocketChatAdapter.prototype.topic = function () {                                                                     //
		function topic() /*envelope, ...strings*/{                                                                           //
			if (DEBUG) {                                                                                                        // 137
				return console.log('ROCKETCHATADAPTER -> topic'.blue);                                                             // 137
			}                                                                                                                   // 137
		}                                                                                                                    // 138
                                                                                                                       //
		return topic;                                                                                                        //
	}(); // Public: Raw method for playing a sound in the chat source. Extend this.                                       //
	//                                                                                                                    // 141
	// envelope - A Object with message, room and user details.                                                           // 142
	// strings  - One or more strings for each play message to send.                                                      // 143
	//                                                                                                                    // 144
	// Returns nothing                                                                                                    // 145
                                                                                                                       //
                                                                                                                       //
	RocketChatAdapter.prototype.play = function () {                                                                      //
		function play() /*envelope, ...strings*/{                                                                            //
			if (DEBUG) {                                                                                                        // 147
				return console.log('ROCKETCHATADAPTER -> play'.blue);                                                              // 147
			}                                                                                                                   // 147
		}                                                                                                                    // 148
                                                                                                                       //
		return play;                                                                                                         //
	}(); // Public: Raw method for invoking the bot to run. Extend this.                                                  //
	//                                                                                                                    // 151
	// Returns nothing.                                                                                                   // 152
                                                                                                                       //
                                                                                                                       //
	RocketChatAdapter.prototype.run = function () {                                                                       //
		function run() {                                                                                                     //
			if (DEBUG) {                                                                                                        // 154
				console.log('ROCKETCHATADAPTER -> run'.blue);                                                                      // 154
			}                                                                                                                   // 154
                                                                                                                       //
			this.robot.emit('connected');                                                                                       // 155
			return this.robot.brain.mergeData({});                                                                              // 156
		}                                                                                                                    // 157
                                                                                                                       //
		return run;                                                                                                          //
	}(); // @robot.brain.emit 'loaded'                                                                                    //
	// Public: Raw method for shutting the bot down. Extend this.                                                         // 160
	//                                                                                                                    // 161
	// Returns nothing.                                                                                                   // 162
                                                                                                                       //
                                                                                                                       //
	RocketChatAdapter.prototype.close = function () {                                                                     //
		function close() {                                                                                                   //
			if (DEBUG) {                                                                                                        // 164
				return console.log('ROCKETCHATADAPTER -> close'.blue);                                                             // 164
			}                                                                                                                   // 164
		}                                                                                                                    // 165
                                                                                                                       //
		return close;                                                                                                        //
	}();                                                                                                                  //
                                                                                                                       //
	return RocketChatAdapter;                                                                                             //
}(Hubot.Adapter);                                                                                                      //
                                                                                                                       //
var InternalHubotReceiver = function (message) {                                                                       // 168
	if (DEBUG) {                                                                                                          // 169
		console.log(message);                                                                                                // 169
	}                                                                                                                     // 169
                                                                                                                       //
	if (message.u.username !== InternalHubot.name) {                                                                      // 170
		var room = RocketChat.models.Rooms.findOneById(message.rid);                                                         // 171
                                                                                                                       //
		if (room.t === 'c') {                                                                                                // 173
			var InternalHubotUser = new Hubot.User(message.u.username, {                                                        // 174
				room: message.rid                                                                                                  // 174
			});                                                                                                                 // 174
			var InternalHubotTextMessage = new Hubot.TextMessage(InternalHubotUser, message.msg, message._id);                  // 175
			InternalHubot.adapter.receive(InternalHubotTextMessage);                                                            // 176
		}                                                                                                                    // 177
	}                                                                                                                     // 178
                                                                                                                       //
	return message;                                                                                                       // 179
};                                                                                                                     // 180
                                                                                                                       //
var HubotScripts = function () {                                                                                       //
	function HubotScripts(robot) {                                                                                        // 183
		(0, _classCallCheck3.default)(this, HubotScripts);                                                                   // 183
		var modulesToLoad = ['hubot-help/src/help.coffee'];                                                                  // 184
		var customPath = RocketChat.settings.get('InternalHubot_PathToLoadCustomScripts');                                   // 187
		HubotScripts.load(__meteor_bootstrap__.serverDir + "/npm/node_modules/meteor/rocketchat_internal-hubot/node_modules/", modulesToLoad, robot);
		HubotScripts.load(customPath, RocketChat.settings.get('InternalHubot_ScriptsToLoad').split(',') || [], robot);       // 189
	}                                                                                                                     // 190
                                                                                                                       //
	HubotScripts.load = function () {                                                                                     //
		function load(path, scriptsToLoad, robot) {                                                                          //
			if (!path || !scriptsToLoad) {                                                                                      // 193
				return;                                                                                                            // 194
			}                                                                                                                   // 195
                                                                                                                       //
			scriptsToLoad.forEach(function (scriptFile) {                                                                       // 196
				try {                                                                                                              // 197
					scriptFile = s.trim(scriptFile);                                                                                  // 198
                                                                                                                       //
					if (scriptFile === '') {                                                                                          // 199
						return;                                                                                                          // 200
					} // delete require.cache[require.resolve(path+scriptFile)];                                                      // 201
                                                                                                                       //
                                                                                                                       //
					var fn = Npm.require(path + scriptFile);                                                                          // 203
                                                                                                                       //
					if (typeof fn === 'function') {                                                                                   // 204
						fn(robot);                                                                                                       // 205
					} else {                                                                                                          // 206
						fn.default(robot);                                                                                               // 207
					}                                                                                                                 // 208
                                                                                                                       //
					robot.parseHelp(path + scriptFile);                                                                               // 209
					console.log(("Loaded " + scriptFile).green);                                                                      // 210
				} catch (e) {                                                                                                      // 211
					console.log(("Can't load " + scriptFile).red);                                                                    // 212
					console.log(e);                                                                                                   // 213
				}                                                                                                                  // 214
			});                                                                                                                 // 215
		}                                                                                                                    // 216
                                                                                                                       //
		return load;                                                                                                         //
	}();                                                                                                                  //
                                                                                                                       //
	return HubotScripts;                                                                                                  //
}();                                                                                                                   //
                                                                                                                       //
var init = _.debounce(Meteor.bindEnvironment(function () {                                                             // 219
	if (RocketChat.settings.get('InternalHubot_Enabled')) {                                                               // 220
		InternalHubot = new Robot(null, null, false, RocketChat.settings.get('InternalHubot_Username'));                     // 221
		InternalHubot.alias = 'bot';                                                                                         // 222
		InternalHubot.adapter = new RocketChatAdapter(InternalHubot);                                                        // 223
		new HubotScripts(InternalHubot);                                                                                     // 224
		InternalHubot.run();                                                                                                 // 225
		return RocketChat.callbacks.add('afterSaveMessage', InternalHubotReceiver, RocketChat.callbacks.priority.LOW, 'InternalHubot');
	} else {                                                                                                              // 227
		InternalHubot = {};                                                                                                  // 228
		return RocketChat.callbacks.remove('afterSaveMessage', 'InternalHubot');                                             // 229
	}                                                                                                                     // 230
}), 1000);                                                                                                             // 231
                                                                                                                       //
Meteor.startup(function () {                                                                                           // 233
	init();                                                                                                               // 234
	RocketChat.models.Settings.findByIds(['InternalHubot_Username', 'InternalHubot_Enabled', 'InternalHubot_ScriptsToLoad', 'InternalHubot_PathToLoadCustomScripts']).observe({
		changed: function () {                                                                                               // 236
			return init();                                                                                                      // 237
		}                                                                                                                    // 238
	}); // TODO useful when we have the ability to invalidate `require` cache                                             // 235
	// RocketChat.RateLimiter.limitMethod('reloadInternalHubot', 1, 5000, {                                               // 241
	// 	userId(/*userId*/) { return true; }                                                                               // 242
	// });                                                                                                                // 243
	// Meteor.methods({                                                                                                   // 244
	// 	reloadInternalHubot: () => init()                                                                                 // 245
	// });                                                                                                                // 246
});                                                                                                                    // 247
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"settings.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_internal-hubot/settings.js                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.settings.addGroup('InternalHubot', function () {                                                            // 1
	this.add('InternalHubot_Enabled', false, {                                                                            // 2
		type: 'boolean',                                                                                                     // 2
		i18nLabel: 'Enabled'                                                                                                 // 2
	});                                                                                                                   // 2
	this.add('InternalHubot_Username', 'rocket.cat', {                                                                    // 3
		type: 'string',                                                                                                      // 3
		i18nLabel: 'Username',                                                                                               // 3
		i18nDescription: 'InternalHubot_Username_Description'                                                                // 3
	});                                                                                                                   // 3
	this.add('InternalHubot_ScriptsToLoad', '', {                                                                         // 4
		type: 'string'                                                                                                       // 4
	});                                                                                                                   // 4
	this.add('InternalHubot_PathToLoadCustomScripts', '', {                                                               // 5
		type: 'string'                                                                                                       // 5
	}); // this.add('InternalHubot_reload', 'reloadInternalHubot', {                                                      // 5
	// 	type: 'action',                                                                                                   // 7
	// 	actionText: 'reload'                                                                                              // 8
	// });                                                                                                                // 9
});                                                                                                                    // 10
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:internal-hubot/hubot.js");
require("./node_modules/meteor/rocketchat:internal-hubot/settings.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['rocketchat:internal-hubot'] = {}, {
  Hubot: Hubot,
  HubotScripts: HubotScripts,
  InternalHubot: InternalHubot,
  InternalHubotReceiver: InternalHubotReceiver,
  RocketChatAdapter: RocketChatAdapter
});

})();

//# sourceMappingURL=rocketchat_internal-hubot.js.map

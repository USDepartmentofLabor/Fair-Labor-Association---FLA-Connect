(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RocketChatTabBar = Package['rocketchat:lib'].RocketChatTabBar;
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
var Irc;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:irc":{"server":{"settings.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/rocketchat_irc/server/settings.js                                                                      //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
Meteor.startup(function () {                                                                                       // 1
	RocketChat.settings.addGroup('IRC', function () {                                                                 // 2
		// Is this thing on?                                                                                             // 4
		this.add('IRC_Enabled', false, {                                                                                 // 5
			type: 'boolean',                                                                                                // 6
			i18nLabel: 'Enabled',                                                                                           // 7
			i18nDescription: 'IRC_Enabled',                                                                                 // 8
			alert: 'IRC Support is a work in progress. Use on a production system is not recommended at this time.'         // 9
		}); // The IRC host server to talk to                                                                            // 5
                                                                                                                   //
		this.add('IRC_Host', 'irc.freenode.net', {                                                                       // 13
			type: 'string',                                                                                                 // 14
			i18nLabel: 'Host',                                                                                              // 15
			i18nDescription: 'IRC_Hostname'                                                                                 // 16
		}); // The port to connect on the remote server                                                                  // 13
                                                                                                                   //
		this.add('IRC_Port', 6667, {                                                                                     // 20
			type: 'int',                                                                                                    // 21
			i18nLabel: 'Port',                                                                                              // 22
			i18nDescription: 'IRC_Port'                                                                                     // 23
		}); // Cache size of the messages we send the host IRC server                                                    // 20
                                                                                                                   //
		this.add('IRC_Message_Cache_Size', 200, {                                                                        // 27
			type: 'int',                                                                                                    // 28
			i18nLabel: 'Message Cache Size',                                                                                // 29
			i18nDescription: 'IRC_Message_Cache_Size'                                                                       // 30
		}); // Expandable box for modifying regular expressions for IRC interaction                                      // 27
                                                                                                                   //
		this.section('Regular_Expressions', function () {                                                                // 34
			this.add('IRC_RegEx_successLogin', 'Welcome to the freenode Internet Relay Chat Network', {                     // 35
				type: 'string',                                                                                                // 36
				i18nLabel: 'Login Successful',                                                                                 // 37
				i18nDescription: 'IRC_Login_Success'                                                                           // 38
			});                                                                                                             // 35
			this.add('IRC_RegEx_failedLogin', 'You have not registered', {                                                  // 40
				type: 'string',                                                                                                // 41
				i18nLabel: 'Login Failed',                                                                                     // 42
				i18nDescription: 'IRC_Login_Fail'                                                                              // 43
			});                                                                                                             // 40
			this.add('IRC_RegEx_receiveMessage', '^:(\S+)!~\S+ PRIVMSG (\S+) :(.+)$', {                                     // 45
				type: 'string',                                                                                                // 46
				i18nLabel: 'Private Message',                                                                                  // 47
				i18nDescription: 'IRC_Private_Message'                                                                         // 48
			});                                                                                                             // 45
			this.add('IRC_RegEx_receiveMemberList', '^:\S+ \d+ \S+ = #(\S+) :(.*)$', {                                      // 50
				type: 'string',                                                                                                // 51
				i18nLabel: 'Channel User List Start',                                                                          // 52
				i18nDescription: 'IRC_Channel_Users'                                                                           // 53
			});                                                                                                             // 50
			this.add('IRC_RegEx_endMemberList', '^.+#(\S+) :End of \/NAMES list.$', {                                       // 55
				type: 'string',                                                                                                // 56
				i18nLabel: 'Channel User List End',                                                                            // 57
				i18nDescription: 'IRC_Channel_Users_End'                                                                       // 58
			});                                                                                                             // 55
			this.add('IRC_RegEx_addMemberToRoom', '^:(\S+)!~\S+ JOIN #(\S+)$', {                                            // 60
				type: 'string',                                                                                                // 61
				i18nLabel: 'Join Channel',                                                                                     // 62
				i18nDescription: 'IRC_Channel_Join'                                                                            // 63
			});                                                                                                             // 60
			this.add('IRC_RegEx_removeMemberFromRoom', '^:(\S+)!~\S+ PART #(\S+)$', {                                       // 65
				type: 'string',                                                                                                // 66
				i18nLabel: 'Leave Channel',                                                                                    // 67
				i18nDescription: 'IRC_Channel_Leave'                                                                           // 68
			});                                                                                                             // 65
			this.add('IRC_RegEx_quitMember', '^:(\S+)!~\S+ QUIT .*$', {                                                     // 70
				type: 'string',                                                                                                // 71
				i18nLabel: 'Quit IRC Session',                                                                                 // 72
				i18nDescription: 'IRC_Quit'                                                                                    // 73
			});                                                                                                             // 70
		});                                                                                                              // 75
	});                                                                                                               // 77
});                                                                                                                // 78
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"server.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/rocketchat_irc/server/server.js                                                                        //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                            //
                                                                                                                   //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                   //
                                                                                                                   //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                  //
                                                                                                                   //
var net = void 0;                                                                                                  // 1
module.watch(require("net"), {                                                                                     // 1
	"default": function (v) {                                                                                         // 1
		net = v;                                                                                                         // 1
	}                                                                                                                 // 1
}, 0);                                                                                                             // 1
var Lru = void 0;                                                                                                  // 1
module.watch(require("lru-cache"), {                                                                               // 1
	"default": function (v) {                                                                                         // 1
		Lru = v;                                                                                                         // 1
	}                                                                                                                 // 1
}, 1);                                                                                                             // 1
///////                                                                                                            // 4
// Assign values                                                                                                   // 5
//Package availability                                                                                             // 7
var IRC_AVAILABILITY = RocketChat.settings.get('IRC_Enabled'); // Cache prep                                       // 8
                                                                                                                   //
var MESSAGE_CACHE_SIZE = RocketChat.settings.get('IRC_Message_Cache_Size');                                        // 11
var ircReceiveMessageCache = Lru(MESSAGE_CACHE_SIZE); //eslint-disable-line                                        // 12
                                                                                                                   //
var ircSendMessageCache = Lru(MESSAGE_CACHE_SIZE); //eslint-disable-line                                           // 13
// IRC server                                                                                                      // 15
                                                                                                                   //
var IRC_PORT = RocketChat.settings.get('IRC_Port');                                                                // 16
var IRC_HOST = RocketChat.settings.get('IRC_Host');                                                                // 17
var ircClientMap = {}; //////                                                                                      // 19
// Core functionality                                                                                              // 22
                                                                                                                   //
var bind = function (f) {                                                                                          // 24
	var g = Meteor.bindEnvironment(function (self) {                                                                  // 25
		for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {        // 25
			args[_key - 1] = arguments[_key];                                                                               // 25
		}                                                                                                                // 25
                                                                                                                   //
		return f.apply(self, args);                                                                                      // 25
	});                                                                                                               // 25
	return function () {                                                                                              // 26
		for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {                     // 26
			args[_key2] = arguments[_key2];                                                                                 // 26
		}                                                                                                                // 26
                                                                                                                   //
		g.apply(undefined, [this].concat(args));                                                                         // 26
	};                                                                                                                // 26
};                                                                                                                 // 27
                                                                                                                   //
var async = function (f) {                                                                                         // 29
	for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {  // 29
		args[_key3 - 1] = arguments[_key3];                                                                              // 29
	}                                                                                                                 // 29
                                                                                                                   //
	return Meteor.wrapAsync(f).apply(undefined, args);                                                                // 29
};                                                                                                                 // 29
                                                                                                                   //
var IrcClient = function () {                                                                                      //
	function IrcClient(loginReq) {                                                                                    // 32
		(0, _classCallCheck3.default)(this, IrcClient);                                                                  // 32
		this.loginReq = loginReq;                                                                                        // 33
		this.user = this.loginReq.user;                                                                                  // 35
		ircClientMap[this.user._id] = this;                                                                              // 36
		this.ircPort = IRC_PORT;                                                                                         // 37
		this.ircHost = IRC_HOST;                                                                                         // 38
		this.msgBuf = [];                                                                                                // 39
		this.isConnected = false;                                                                                        // 41
		this.isDistroyed = false;                                                                                        // 42
		this.socket = new net.Socket();                                                                                  // 43
		this.socket.setNoDelay;                                                                                          // 44
		this.socket.setEncoding('utf-8');                                                                                // 45
		this.socket.setKeepAlive(true);                                                                                  // 46
		this.onConnect = bind(this.onConnect);                                                                           // 47
		this.onClose = bind(this.onClose);                                                                               // 48
		this.onTimeout = bind(this.onTimeout);                                                                           // 49
		this.onError = bind(this.onError);                                                                               // 50
		this.onReceiveRawMessage = bind(this.onReceiveRawMessage);                                                       // 51
		this.socket.on('data', this.onReceiveRawMessage);                                                                // 52
		this.socket.on('close', this.onClose);                                                                           // 53
		this.socket.on('timeout', this.onTimeout);                                                                       // 54
		this.socket.on('error', this.onError);                                                                           // 55
		this.isJoiningRoom = false;                                                                                      // 57
		this.receiveMemberListBuf = {};                                                                                  // 58
		this.pendingJoinRoomBuf = [];                                                                                    // 59
		this.successLoginMessageRegex = /RocketChat.settings.get('IRC_RegEx_successLogin');/;                            // 61
		this.failedLoginMessageRegex = /RocketChat.settings.get('IRC_RegEx_failedLogin');/;                              // 62
		this.receiveMessageRegex = /RocketChat.settings.get('IRC_RegEx_receiveMessage');/;                               // 63
		this.receiveMemberListRegex = /RocketChat.settings.get('IRC_RegEx_receiveMemberList');/;                         // 64
		this.endMemberListRegex = /RocketChat.settings.get('IRC_RegEx_endMemberList');/;                                 // 65
		this.addMemberToRoomRegex = /RocketChat.settings.get('IRC_RegEx_addMemberToRoom');/;                             // 66
		this.removeMemberFromRoomRegex = /RocketChat.settings.get('IRC_RegEx_removeMemberFromRoom');/;                   // 67
		this.quitMemberRegex = /RocketChat.settings.get('IRC_RegEx_quitMember');/;                                       // 68
	}                                                                                                                 // 69
                                                                                                                   //
	IrcClient.prototype.connect = function () {                                                                       //
		function connect(loginCb) {                                                                                      //
			this.loginCb = loginCb;                                                                                         // 72
			this.socket.connect(this.ircPort, this.ircHost, this.onConnect);                                                // 73
			this.initRoomList();                                                                                            // 74
		}                                                                                                                // 75
                                                                                                                   //
		return connect;                                                                                                  //
	}();                                                                                                              //
                                                                                                                   //
	IrcClient.prototype.disconnect = function () {                                                                    //
		function disconnect() {                                                                                          //
			this.isDistroyed = true;                                                                                        // 78
			this.socket.destroy();                                                                                          // 79
		}                                                                                                                // 80
                                                                                                                   //
		return disconnect;                                                                                               //
	}();                                                                                                              //
                                                                                                                   //
	IrcClient.prototype.onConnect = function () {                                                                     //
		function onConnect() {                                                                                           //
			var _this = this;                                                                                               // 82
                                                                                                                   //
			console.log('[irc] onConnect -> '.yellow, this.user.username, 'connect success.');                              // 83
			this.socket.write("NICK " + this.user.username + "\r\n");                                                       // 84
			this.socket.write("USER " + this.user.username + " 0 * :" + this.user.name + "\r\n"); // message order could not make sure here
                                                                                                                   //
			this.isConnected = true;                                                                                        // 87
			var messageBuf = this.msgBuf;                                                                                   // 88
			messageBuf.forEach(function (msg) {                                                                             // 89
				return _this.socket.write(msg);                                                                                // 89
			});                                                                                                             // 89
		}                                                                                                                // 90
                                                                                                                   //
		return onConnect;                                                                                                //
	}();                                                                                                              //
                                                                                                                   //
	IrcClient.prototype.onClose = function () {                                                                       //
		function onClose() {                                                                                             //
			console.log('[irc] onClose -> '.yellow, this.user.username, 'connection close.');                               // 93
			this.isConnected = false;                                                                                       // 94
                                                                                                                   //
			if (this.isDistroyed) {                                                                                         // 95
				delete ircClientMap[this.user._id];                                                                            // 96
			} else {                                                                                                        // 97
				this.connect();                                                                                                // 98
			}                                                                                                               // 99
		}                                                                                                                // 100
                                                                                                                   //
		return onClose;                                                                                                  //
	}();                                                                                                              //
                                                                                                                   //
	IrcClient.prototype.onTimeout = function () {                                                                     //
		function onTimeout() {                                                                                           //
			console.log('[irc] onTimeout -> '.yellow, this.user.username, 'connection timeout.', arguments);                // 103
		}                                                                                                                // 104
                                                                                                                   //
		return onTimeout;                                                                                                //
	}();                                                                                                              //
                                                                                                                   //
	IrcClient.prototype.onError = function () {                                                                       //
		function onError() {                                                                                             //
			console.log('[irc] onError -> '.yellow, this.user.username, 'connection error.', arguments);                    // 107
		}                                                                                                                // 108
                                                                                                                   //
		return onError;                                                                                                  //
	}();                                                                                                              //
                                                                                                                   //
	IrcClient.prototype.onReceiveRawMessage = function () {                                                           //
		function onReceiveRawMessage(data) {                                                                             //
			var _this2 = this;                                                                                              // 110
                                                                                                                   //
			data = data.toString().split('\n');                                                                             // 111
			data.forEach(function (line) {                                                                                  // 113
				line = line.trim();                                                                                            // 114
				console.log("[" + _this2.ircHost + ":" + _this2.ircPort + "]:", line); // Send heartbeat package to irc server
                                                                                                                   //
				if (line.indexOf('PING') === 0) {                                                                              // 118
					_this2.socket.write(line.replace('PING :', 'PONG '));                                                         // 119
                                                                                                                   //
					return;                                                                                                       // 120
				}                                                                                                              // 121
                                                                                                                   //
				var matchResult = _this2.receiveMessageRegex.exec(line);                                                       // 122
                                                                                                                   //
				if (matchResult) {                                                                                             // 123
					_this2.onReceiveMessage(matchResult[1], matchResult[2], matchResult[3]);                                      // 124
                                                                                                                   //
					return;                                                                                                       // 125
				}                                                                                                              // 126
                                                                                                                   //
				matchResult = _this2.receiveMemberListRegex.exec(line);                                                        // 127
                                                                                                                   //
				if (matchResult) {                                                                                             // 128
					_this2.onReceiveMemberList(matchResult[1], matchResult[2].split(' '));                                        // 129
                                                                                                                   //
					return;                                                                                                       // 130
				}                                                                                                              // 131
                                                                                                                   //
				matchResult = _this2.endMemberListRegex.exec(line);                                                            // 132
                                                                                                                   //
				if (matchResult) {                                                                                             // 133
					_this2.onEndMemberList(matchResult[1]);                                                                       // 134
                                                                                                                   //
					return;                                                                                                       // 135
				}                                                                                                              // 136
                                                                                                                   //
				matchResult = _this2.addMemberToRoomRegex.exec(line);                                                          // 137
                                                                                                                   //
				if (matchResult) {                                                                                             // 138
					_this2.onAddMemberToRoom(matchResult[1], matchResult[2]);                                                     // 139
                                                                                                                   //
					return;                                                                                                       // 140
				}                                                                                                              // 141
                                                                                                                   //
				matchResult = _this2.removeMemberFromRoomRegex.exec(line);                                                     // 142
                                                                                                                   //
				if (matchResult) {                                                                                             // 143
					_this2.onRemoveMemberFromRoom(matchResult[1], matchResult[2]);                                                // 144
                                                                                                                   //
					return;                                                                                                       // 145
				}                                                                                                              // 146
                                                                                                                   //
				matchResult = _this2.quitMemberRegex.exec(line);                                                               // 147
                                                                                                                   //
				if (matchResult) {                                                                                             // 148
					_this2.onQuitMember(matchResult[1]);                                                                          // 149
                                                                                                                   //
					return;                                                                                                       // 150
				}                                                                                                              // 151
                                                                                                                   //
				matchResult = _this2.successLoginMessageRegex.exec(line);                                                      // 152
                                                                                                                   //
				if (matchResult) {                                                                                             // 153
					_this2.onSuccessLoginMessage();                                                                               // 154
                                                                                                                   //
					return;                                                                                                       // 155
				}                                                                                                              // 156
                                                                                                                   //
				matchResult = _this2.failedLoginMessageRegex.exec(line);                                                       // 157
                                                                                                                   //
				if (matchResult) {                                                                                             // 158
					_this2.onFailedLoginMessage();                                                                                // 159
                                                                                                                   //
					return;                                                                                                       // 160
				}                                                                                                              // 161
			});                                                                                                             // 162
		}                                                                                                                // 163
                                                                                                                   //
		return onReceiveRawMessage;                                                                                      //
	}();                                                                                                              //
                                                                                                                   //
	IrcClient.prototype.onSuccessLoginMessage = function () {                                                         //
		function onSuccessLoginMessage() {                                                                               //
			console.log('[irc] onSuccessLoginMessage -> '.yellow);                                                          // 166
                                                                                                                   //
			if (this.loginCb) {                                                                                             // 167
				this.loginCb(null, this.loginReq);                                                                             // 168
			}                                                                                                               // 169
		}                                                                                                                // 170
                                                                                                                   //
		return onSuccessLoginMessage;                                                                                    //
	}();                                                                                                              //
                                                                                                                   //
	IrcClient.prototype.onFailedLoginMessage = function () {                                                          //
		function onFailedLoginMessage() {                                                                                //
			console.log('[irc] onFailedLoginMessage -> '.yellow);                                                           // 173
			this.loginReq.allowed = false;                                                                                  // 174
			this.disconnect();                                                                                              // 175
                                                                                                                   //
			if (this.loginCb) {                                                                                             // 176
				this.loginCb(null, this.loginReq);                                                                             // 177
			}                                                                                                               // 178
		}                                                                                                                // 179
                                                                                                                   //
		return onFailedLoginMessage;                                                                                     //
	}();                                                                                                              //
                                                                                                                   //
	IrcClient.prototype.onReceiveMessage = function () {                                                              //
		function onReceiveMessage(source, target, content) {                                                             //
			var now = new Date();                                                                                           // 182
			var timestamp = now.getTime();                                                                                  // 183
			var cacheKey = [source, target, content].join(',');                                                             // 184
			console.log('[irc] ircSendMessageCache.get -> '.yellow, 'key:', cacheKey, 'value:', ircSendMessageCache.get(cacheKey), 'ts:', timestamp - 1000);
                                                                                                                   //
			if (ircSendMessageCache.get(cacheKey) > timestamp - 1000) {                                                     // 186
				return;                                                                                                        // 187
			} else {                                                                                                        // 188
				ircSendMessageCache.set(cacheKey, timestamp);                                                                  // 189
			}                                                                                                               // 190
                                                                                                                   //
			console.log('[irc] onReceiveMessage -> '.yellow, 'source:', source, 'target:', target, 'content:', content);    // 191
			source = this.createUserWhenNotExist(source);                                                                   // 192
			var room = void 0;                                                                                              // 193
                                                                                                                   //
			if (target[0] === '#') {                                                                                        // 194
				room = RocketChat.models.Rooms.findOneByName(target.substring(1));                                             // 195
			} else {                                                                                                        // 196
				room = this.createDirectRoomWhenNotExist(source, this.user);                                                   // 197
			}                                                                                                               // 198
                                                                                                                   //
			var message = {                                                                                                 // 199
				msg: content,                                                                                                  // 199
				ts: now                                                                                                        // 199
			};                                                                                                              // 199
			cacheKey = "" + source.username + timestamp;                                                                    // 200
			ircReceiveMessageCache.set(cacheKey, true);                                                                     // 201
			console.log('[irc] ircReceiveMessageCache.set -> '.yellow, 'key:', cacheKey);                                   // 202
			RocketChat.sendMessage(source, message, room);                                                                  // 203
		}                                                                                                                // 204
                                                                                                                   //
		return onReceiveMessage;                                                                                         //
	}();                                                                                                              //
                                                                                                                   //
	IrcClient.prototype.onReceiveMemberList = function () {                                                           //
		function onReceiveMemberList(roomName, members) {                                                                //
			this.receiveMemberListBuf[roomName] = this.receiveMemberListBuf[roomName].concat(members);                      // 207
		}                                                                                                                // 208
                                                                                                                   //
		return onReceiveMemberList;                                                                                      //
	}();                                                                                                              //
                                                                                                                   //
	IrcClient.prototype.onEndMemberList = function () {                                                               //
		function onEndMemberList(roomName) {                                                                             //
			var _this3 = this;                                                                                              // 210
                                                                                                                   //
			var newMembers = this.receiveMemberListBuf[roomName];                                                           // 211
			console.log('[irc] onEndMemberList -> '.yellow, 'room:', roomName, 'members:', newMembers.join(','));           // 212
			var room = RocketChat.models.Rooms.findOneByNameAndType(roomName, 'c');                                         // 213
                                                                                                                   //
			if (!room) {                                                                                                    // 214
				return;                                                                                                        // 215
			}                                                                                                               // 216
                                                                                                                   //
			var oldMembers = room.usernames;                                                                                // 217
                                                                                                                   //
			var appendMembers = _.difference(newMembers, oldMembers);                                                       // 218
                                                                                                                   //
			var removeMembers = _.difference(oldMembers, newMembers);                                                       // 219
                                                                                                                   //
			appendMembers.forEach(function (member) {                                                                       // 220
				return _this3.createUserWhenNotExist(member);                                                                  // 220
			});                                                                                                             // 220
			RocketChat.models.Rooms.removeUsernamesById(room._id, removeMembers);                                           // 221
			RocketChat.models.Rooms.addUsernamesById(room._id, appendMembers);                                              // 222
			this.isJoiningRoom = false;                                                                                     // 224
			roomName = this.pendingJoinRoomBuf.shift();                                                                     // 225
                                                                                                                   //
			if (roomName) {                                                                                                 // 226
				this.joinRoom({                                                                                                // 227
					t: 'c',                                                                                                       // 228
					name: roomName                                                                                                // 229
				});                                                                                                            // 227
			}                                                                                                               // 231
		}                                                                                                                // 232
                                                                                                                   //
		return onEndMemberList;                                                                                          //
	}();                                                                                                              //
                                                                                                                   //
	IrcClient.prototype.sendRawMessage = function () {                                                                //
		function sendRawMessage(msg) {                                                                                   //
			console.log('[irc] sendRawMessage -> '.yellow, msg.slice(0, -2));                                               // 235
                                                                                                                   //
			if (this.isConnected) {                                                                                         // 236
				this.socket.write(msg);                                                                                        // 237
			} else {                                                                                                        // 238
				this.msgBuf.push(msg);                                                                                         // 239
			}                                                                                                               // 240
		}                                                                                                                // 241
                                                                                                                   //
		return sendRawMessage;                                                                                           //
	}();                                                                                                              //
                                                                                                                   //
	IrcClient.prototype.sendMessage = function () {                                                                   //
		function sendMessage(room, message) {                                                                            //
			console.log('[irc] sendMessage -> '.yellow, 'userName:', message.u.username);                                   // 244
			var target = '';                                                                                                // 245
                                                                                                                   //
			if (room.t === 'c') {                                                                                           // 246
				target = "#" + room.name;                                                                                      // 247
			} else if (room.t === 'd') {                                                                                    // 248
				var usernames = room.usernames;                                                                                // 249
				usernames.forEach(function (name) {                                                                            // 250
					if (message.u.username !== name) {                                                                            // 251
						target = name;                                                                                               // 252
						return;                                                                                                      // 253
					}                                                                                                             // 254
				});                                                                                                            // 255
			}                                                                                                               // 256
                                                                                                                   //
			var cacheKey = [this.user.username, target, message.msg].join(',');                                             // 257
			console.log('[irc] ircSendMessageCache.set -> '.yellow, 'key:', cacheKey, 'ts:', message.ts.getTime());         // 258
			ircSendMessageCache.set(cacheKey, message.ts.getTime());                                                        // 259
			var msg = "PRIVMSG " + target + " :" + message.msg + "\r\n";                                                    // 260
			this.sendRawMessage(msg);                                                                                       // 261
		}                                                                                                                // 262
                                                                                                                   //
		return sendMessage;                                                                                              //
	}();                                                                                                              //
                                                                                                                   //
	IrcClient.prototype.initRoomList = function () {                                                                  //
		function initRoomList() {                                                                                        //
			var _this4 = this;                                                                                              // 264
                                                                                                                   //
			var roomsCursor = RocketChat.models.Rooms.findByTypeContainingUsername('c', this.user.username, {               // 265
				fields: {                                                                                                      // 265
					name: 1,                                                                                                      // 265
					t: 1                                                                                                          // 265
				}                                                                                                              // 265
			});                                                                                                             // 265
			var rooms = roomsCursor.fetch();                                                                                // 266
			rooms.forEach(function (room) {                                                                                 // 267
				return _this4.joinRoom(room);                                                                                  // 267
			});                                                                                                             // 267
		}                                                                                                                // 268
                                                                                                                   //
		return initRoomList;                                                                                             //
	}();                                                                                                              //
                                                                                                                   //
	IrcClient.prototype.joinRoom = function () {                                                                      //
		function joinRoom(room) {                                                                                        //
			if (room.t !== 'c' || room.name === 'general') {                                                                // 271
				return;                                                                                                        // 272
			}                                                                                                               // 273
                                                                                                                   //
			if (this.isJoiningRoom) {                                                                                       // 274
				return this.pendingJoinRoomBuf.push(room.name);                                                                // 275
			}                                                                                                               // 276
                                                                                                                   //
			console.log('[irc] joinRoom -> '.yellow, 'roomName:', room.name, 'pendingJoinRoomBuf:', this.pendingJoinRoomBuf.join(','));
			var msg = "JOIN #" + room.name + "\r\n";                                                                        // 278
			this.receiveMemberListBuf[room.name] = [];                                                                      // 279
			this.sendRawMessage(msg);                                                                                       // 280
			this.isJoiningRoom = true;                                                                                      // 281
		}                                                                                                                // 282
                                                                                                                   //
		return joinRoom;                                                                                                 //
	}();                                                                                                              //
                                                                                                                   //
	IrcClient.prototype.leaveRoom = function () {                                                                     //
		function leaveRoom(room) {                                                                                       //
			if (room.t !== 'c') {                                                                                           // 285
				return;                                                                                                        // 286
			}                                                                                                               // 287
                                                                                                                   //
			var msg = "PART #" + room.name + "\r\n";                                                                        // 288
			this.sendRawMessage(msg);                                                                                       // 289
		}                                                                                                                // 290
                                                                                                                   //
		return leaveRoom;                                                                                                //
	}();                                                                                                              //
                                                                                                                   //
	IrcClient.prototype.getMemberList = function () {                                                                 //
		function getMemberList(room) {                                                                                   //
			if (room.t !== 'c') {                                                                                           // 293
				return;                                                                                                        // 294
			}                                                                                                               // 295
                                                                                                                   //
			var msg = "NAMES #" + room.name + "\r\n";                                                                       // 296
			this.receiveMemberListBuf[room.name] = [];                                                                      // 297
			this.sendRawMessage(msg);                                                                                       // 298
		}                                                                                                                // 299
                                                                                                                   //
		return getMemberList;                                                                                            //
	}();                                                                                                              //
                                                                                                                   //
	IrcClient.prototype.onAddMemberToRoom = function () {                                                             //
		function onAddMemberToRoom(member, roomName) {                                                                   //
			if (this.user.username === member) {                                                                            // 302
				return;                                                                                                        // 303
			}                                                                                                               // 304
                                                                                                                   //
			console.log('[irc] onAddMemberToRoom -> '.yellow, 'roomName:', roomName, 'member:', member);                    // 305
			this.createUserWhenNotExist(member);                                                                            // 306
			RocketChat.models.Rooms.addUsernameByName(roomName, member);                                                    // 307
		}                                                                                                                // 308
                                                                                                                   //
		return onAddMemberToRoom;                                                                                        //
	}();                                                                                                              //
                                                                                                                   //
	IrcClient.prototype.onRemoveMemberFromRoom = function () {                                                        //
		function onRemoveMemberFromRoom(member, roomName) {                                                              //
			console.log('[irc] onRemoveMemberFromRoom -> '.yellow, 'roomName:', roomName, 'member:', member);               // 311
			RocketChat.models.Rooms.removeUsernameByName(roomName, member);                                                 // 312
		}                                                                                                                // 313
                                                                                                                   //
		return onRemoveMemberFromRoom;                                                                                   //
	}();                                                                                                              //
                                                                                                                   //
	IrcClient.prototype.onQuitMember = function () {                                                                  //
		function onQuitMember(member) {                                                                                  //
			console.log('[irc] onQuitMember ->'.yellow, 'username:', member);                                               // 316
			RocketChat.models.Rooms.removeUsernameFromAll(member);                                                          // 317
			Meteor.users.update({                                                                                           // 318
				name: member                                                                                                   // 318
			}, {                                                                                                            // 318
				$set: {                                                                                                        // 318
					status: 'offline'                                                                                             // 318
				}                                                                                                              // 318
			});                                                                                                             // 318
		}                                                                                                                // 319
                                                                                                                   //
		return onQuitMember;                                                                                             //
	}();                                                                                                              //
                                                                                                                   //
	IrcClient.prototype.createUserWhenNotExist = function () {                                                        //
		function createUserWhenNotExist(name) {                                                                          //
			var user = Meteor.users.findOne({                                                                               // 322
				name: name                                                                                                     // 322
			});                                                                                                             // 322
                                                                                                                   //
			if (user) {                                                                                                     // 323
				return user;                                                                                                   // 324
			}                                                                                                               // 325
                                                                                                                   //
			console.log('[irc] createNotExistUser ->'.yellow, 'userName:', name);                                           // 326
			Meteor.call('registerUser', {                                                                                   // 327
				email: name + "@rocketchat.org",                                                                               // 328
				pass: 'rocketchat',                                                                                            // 329
				name: name                                                                                                     // 330
			});                                                                                                             // 327
			Meteor.users.update({                                                                                           // 332
				name: name                                                                                                     // 332
			}, {                                                                                                            // 332
				$set: {                                                                                                        // 333
					status: 'online',                                                                                             // 334
					username: name                                                                                                // 335
				}                                                                                                              // 333
			});                                                                                                             // 332
			return Meteor.users.findOne({                                                                                   // 338
				name: name                                                                                                     // 338
			});                                                                                                             // 338
		}                                                                                                                // 339
                                                                                                                   //
		return createUserWhenNotExist;                                                                                   //
	}();                                                                                                              //
                                                                                                                   //
	IrcClient.prototype.createDirectRoomWhenNotExist = function () {                                                  //
		function createDirectRoomWhenNotExist(source, target) {                                                          //
			console.log('[irc] createDirectRoomWhenNotExist -> '.yellow, 'source:', source, 'target:', target);             // 342
			var rid = [source._id, target._id].sort().join('');                                                             // 343
			var now = new Date();                                                                                           // 344
			RocketChat.models.Rooms.upsert({                                                                                // 345
				_id: rid                                                                                                       // 345
			}, {                                                                                                            // 345
				$set: {                                                                                                        // 346
					usernames: [source.username, target.username]                                                                 // 347
				},                                                                                                             // 346
				$setOnInsert: {                                                                                                // 349
					t: 'd',                                                                                                       // 350
					msgs: 0,                                                                                                      // 351
					ts: now                                                                                                       // 352
				}                                                                                                              // 349
			});                                                                                                             // 345
			RocketChat.models.Subscriptions.upsert({                                                                        // 355
				rid: rid,                                                                                                      // 355
				$and: [{                                                                                                       // 355
					'u._id': target._id                                                                                           // 355
				}]                                                                                                             // 355
			}, {                                                                                                            // 355
				$setOnInsert: {                                                                                                // 356
					name: source.username,                                                                                        // 357
					t: 'd',                                                                                                       // 358
					open: false,                                                                                                  // 359
					alert: false,                                                                                                 // 360
					unread: 0,                                                                                                    // 361
					userMentions: 0,                                                                                              // 362
					groupMentions: 0,                                                                                             // 363
					u: {                                                                                                          // 364
						_id: target._id,                                                                                             // 364
						username: target.username                                                                                    // 364
					}                                                                                                             // 364
				}                                                                                                              // 356
			});                                                                                                             // 355
			return {                                                                                                        // 366
				t: 'd',                                                                                                        // 366
				_id: rid                                                                                                       // 366
			};                                                                                                              // 366
		}                                                                                                                // 367
                                                                                                                   //
		return createDirectRoomWhenNotExist;                                                                             //
	}();                                                                                                              //
                                                                                                                   //
	return IrcClient;                                                                                                 //
}();                                                                                                               //
                                                                                                                   //
IrcClient.getByUid = function (uid) {                                                                              // 370
	return ircClientMap[uid];                                                                                         // 371
};                                                                                                                 // 372
                                                                                                                   //
IrcClient.create = function (login) {                                                                              // 374
	if (login.user == null) {                                                                                         // 375
		return login;                                                                                                    // 376
	}                                                                                                                 // 377
                                                                                                                   //
	if (!(login.user._id in ircClientMap)) {                                                                          // 378
		var ircClient = new IrcClient(login);                                                                            // 379
		return async(ircClient.connect);                                                                                 // 380
	}                                                                                                                 // 381
                                                                                                                   //
	return login;                                                                                                     // 382
};                                                                                                                 // 383
                                                                                                                   //
function IrcLoginer(login) {                                                                                       // 385
	console.log('[irc] validateLogin -> '.yellow, login);                                                             // 386
	return IrcClient.create(login);                                                                                   // 387
}                                                                                                                  // 388
                                                                                                                   //
function IrcSender(message) {                                                                                      // 391
	var name = message.u.username;                                                                                    // 392
	var timestamp = message.ts.getTime();                                                                             // 393
	var cacheKey = "" + name + timestamp;                                                                             // 394
                                                                                                                   //
	if (ircReceiveMessageCache.get(cacheKey)) {                                                                       // 395
		return message;                                                                                                  // 396
	}                                                                                                                 // 397
                                                                                                                   //
	var room = RocketChat.models.Rooms.findOneById(message.rid, {                                                     // 398
		fields: {                                                                                                        // 398
			name: 1,                                                                                                        // 398
			usernames: 1,                                                                                                   // 398
			t: 1                                                                                                            // 398
		}                                                                                                                // 398
	});                                                                                                               // 398
	var ircClient = IrcClient.getByUid(message.u._id);                                                                // 399
	ircClient.sendMessage(room, message);                                                                             // 400
	return message;                                                                                                   // 401
}                                                                                                                  // 402
                                                                                                                   //
function IrcRoomJoiner(user, room) {                                                                               // 405
	var ircClient = IrcClient.getByUid(user._id);                                                                     // 406
	ircClient.joinRoom(room);                                                                                         // 407
	return room;                                                                                                      // 408
}                                                                                                                  // 409
                                                                                                                   //
function IrcRoomLeaver(user, room) {                                                                               // 412
	var ircClient = IrcClient.getByUid(user._id);                                                                     // 413
	ircClient.leaveRoom(room);                                                                                        // 414
	return room;                                                                                                      // 415
}                                                                                                                  // 416
                                                                                                                   //
function IrcLogoutCleanUper(user) {                                                                                // 418
	var ircClient = IrcClient.getByUid(user._id);                                                                     // 419
	ircClient.disconnect();                                                                                           // 420
	return user;                                                                                                      // 421
} //////                                                                                                           // 422
// Make magic happen                                                                                               // 425
// Only proceed if the package has been enabled                                                                    // 427
                                                                                                                   //
                                                                                                                   //
if (IRC_AVAILABILITY === true) {                                                                                   // 428
	RocketChat.callbacks.add('beforeValidateLogin', IrcLoginer, RocketChat.callbacks.priority.LOW, 'irc-loginer');    // 429
	RocketChat.callbacks.add('beforeSaveMessage', IrcSender, RocketChat.callbacks.priority.LOW, 'irc-sender');        // 430
	RocketChat.callbacks.add('beforeJoinRoom', IrcRoomJoiner, RocketChat.callbacks.priority.LOW, 'irc-room-joiner');  // 431
	RocketChat.callbacks.add('beforeCreateChannel', IrcRoomJoiner, RocketChat.callbacks.priority.LOW, 'irc-room-joiner-create-channel');
	RocketChat.callbacks.add('beforeLeaveRoom', IrcRoomLeaver, RocketChat.callbacks.priority.LOW, 'irc-room-leaver');
	RocketChat.callbacks.add('afterLogoutCleanUp', IrcLogoutCleanUper, RocketChat.callbacks.priority.LOW, 'irc-clean-up');
}                                                                                                                  // 435
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"node_modules":{"lru-cache":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// .npm/package/node_modules/lru-cache/package.json                                                                //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
exports.name = "lru-cache";
exports.version = "2.6.5";
exports.main = "lib/lru-cache.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"lru-cache.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/meteor/rocketchat_irc/node_modules/lru-cache/lib/lru-cache.js                                      //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
;(function () { // closure for web browsers

if (typeof module === 'object' && module.exports) {
  module.exports = LRUCache
} else {
  // just set the global for non-node platforms.
  this.LRUCache = LRUCache
}

function hOP (obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

function naiveLength () { return 1 }

function LRUCache (options) {
  if (!(this instanceof LRUCache))
    return new LRUCache(options)

  if (typeof options === 'number')
    options = { max: options }

  if (!options)
    options = {}

  this._max = options.max
  // Kind of weird to have a default max of Infinity, but oh well.
  if (!this._max || !(typeof this._max === "number") || this._max <= 0 )
    this._max = Infinity

  this._lengthCalculator = options.length || naiveLength
  if (typeof this._lengthCalculator !== "function")
    this._lengthCalculator = naiveLength

  this._allowStale = options.stale || false
  this._maxAge = options.maxAge || null
  this._dispose = options.dispose
  this.reset()
}

// resize the cache when the max changes.
Object.defineProperty(LRUCache.prototype, "max",
  { set : function (mL) {
      if (!mL || !(typeof mL === "number") || mL <= 0 ) mL = Infinity
      this._max = mL
      if (this._length > this._max) trim(this)
    }
  , get : function () { return this._max }
  , enumerable : true
  })

// resize the cache when the lengthCalculator changes.
Object.defineProperty(LRUCache.prototype, "lengthCalculator",
  { set : function (lC) {
      if (typeof lC !== "function") {
        this._lengthCalculator = naiveLength
        this._length = this._itemCount
        for (var key in this._cache) {
          this._cache[key].length = 1
        }
      } else {
        this._lengthCalculator = lC
        this._length = 0
        for (var key in this._cache) {
          this._cache[key].length = this._lengthCalculator(this._cache[key].value)
          this._length += this._cache[key].length
        }
      }

      if (this._length > this._max) trim(this)
    }
  , get : function () { return this._lengthCalculator }
  , enumerable : true
  })

Object.defineProperty(LRUCache.prototype, "length",
  { get : function () { return this._length }
  , enumerable : true
  })


Object.defineProperty(LRUCache.prototype, "itemCount",
  { get : function () { return this._itemCount }
  , enumerable : true
  })

LRUCache.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this
  var i = 0
  var itemCount = this._itemCount

  for (var k = this._mru - 1; k >= 0 && i < itemCount; k--) if (this._lruList[k]) {
    i++
    var hit = this._lruList[k]
    if (isStale(this, hit)) {
      del(this, hit)
      if (!this._allowStale) hit = undefined
    }
    if (hit) {
      fn.call(thisp, hit.value, hit.key, this)
    }
  }
}

LRUCache.prototype.keys = function () {
  var keys = new Array(this._itemCount)
  var i = 0
  for (var k = this._mru - 1; k >= 0 && i < this._itemCount; k--) if (this._lruList[k]) {
    var hit = this._lruList[k]
    keys[i++] = hit.key
  }
  return keys
}

LRUCache.prototype.values = function () {
  var values = new Array(this._itemCount)
  var i = 0
  for (var k = this._mru - 1; k >= 0 && i < this._itemCount; k--) if (this._lruList[k]) {
    var hit = this._lruList[k]
    values[i++] = hit.value
  }
  return values
}

LRUCache.prototype.reset = function () {
  if (this._dispose && this._cache) {
    for (var k in this._cache) {
      this._dispose(k, this._cache[k].value)
    }
  }

  this._cache = Object.create(null) // hash of items by key
  this._lruList = Object.create(null) // list of items in order of use recency
  this._mru = 0 // most recently used
  this._lru = 0 // least recently used
  this._length = 0 // number of items in the list
  this._itemCount = 0
}

// Provided for debugging/dev purposes only. No promises whatsoever that
// this API stays stable.
LRUCache.prototype.dump = function () {
  return this._cache
}

LRUCache.prototype.dumpLru = function () {
  return this._lruList
}

LRUCache.prototype.set = function (key, value, maxAge) {
  maxAge = maxAge || this._maxAge
  var now = maxAge ? Date.now() : 0

  if (hOP(this._cache, key)) {
    // dispose of the old one before overwriting
    if (this._dispose)
      this._dispose(key, this._cache[key].value)

    this._cache[key].now = now
    this._cache[key].maxAge = maxAge
    this._cache[key].value = value
    this.get(key)
    return true
  }

  var len = this._lengthCalculator(value)
  var hit = new Entry(key, value, this._mru++, len, now, maxAge)

  // oversized objects fall out of cache automatically.
  if (hit.length > this._max) {
    if (this._dispose) this._dispose(key, value)
    return false
  }

  this._length += hit.length
  this._lruList[hit.lu] = this._cache[key] = hit
  this._itemCount ++

  if (this._length > this._max)
    trim(this)

  return true
}

LRUCache.prototype.has = function (key) {
  if (!hOP(this._cache, key)) return false
  var hit = this._cache[key]
  if (isStale(this, hit)) {
    return false
  }
  return true
}

LRUCache.prototype.get = function (key) {
  return get(this, key, true)
}

LRUCache.prototype.peek = function (key) {
  return get(this, key, false)
}

LRUCache.prototype.pop = function () {
  var hit = this._lruList[this._lru]
  del(this, hit)
  return hit || null
}

LRUCache.prototype.del = function (key) {
  del(this, this._cache[key])
}

function get (self, key, doUse) {
  var hit = self._cache[key]
  if (hit) {
    if (isStale(self, hit)) {
      del(self, hit)
      if (!self._allowStale) hit = undefined
    } else {
      if (doUse) use(self, hit)
    }
    if (hit) hit = hit.value
  }
  return hit
}

function isStale(self, hit) {
  if (!hit || (!hit.maxAge && !self._maxAge)) return false
  var stale = false;
  var diff = Date.now() - hit.now
  if (hit.maxAge) {
    stale = diff > hit.maxAge
  } else {
    stale = self._maxAge && (diff > self._maxAge)
  }
  return stale;
}

function use (self, hit) {
  shiftLU(self, hit)
  hit.lu = self._mru ++
  self._lruList[hit.lu] = hit
}

function trim (self) {
  while (self._lru < self._mru && self._length > self._max)
    del(self, self._lruList[self._lru])
}

function shiftLU (self, hit) {
  delete self._lruList[ hit.lu ]
  while (self._lru < self._mru && !self._lruList[self._lru]) self._lru ++
}

function del (self, hit) {
  if (hit) {
    if (self._dispose) self._dispose(hit.key, hit.value)
    self._length -= hit.length
    self._itemCount --
    delete self._cache[ hit.key ]
    shiftLU(self, hit)
  }
}

// classy, since V8 prefers predictable objects.
function Entry (key, value, lu, length, now, maxAge) {
  this.key = key
  this.value = value
  this.lu = lu
  this.length = length
  this.now = now
  if (maxAge) this.maxAge = maxAge
}

})()

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:irc/server/settings.js");
require("./node_modules/meteor/rocketchat:irc/server/server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['rocketchat:irc'] = {}, {
  Irc: Irc
});

})();

//# sourceMappingURL=rocketchat_irc.js.map

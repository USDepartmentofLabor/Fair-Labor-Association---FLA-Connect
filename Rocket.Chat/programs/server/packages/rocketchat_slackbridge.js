(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RocketChatTabBar = Package['rocketchat:lib'].RocketChatTabBar;
var Logger = Package['rocketchat:logger'].Logger;
var SystemLogger = Package['rocketchat:logger'].SystemLogger;
var LoggerManager = Package['rocketchat:logger'].LoggerManager;
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
var logger;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:slackbridge":{"logger.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_slackbridge/logger.js                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* globals logger:true */ /* exported logger */logger = new Logger('SlackBridge', {                                   // 1
	sections: {                                                                                                          // 5
		connection: 'Connection',                                                                                           // 6
		events: 'Events',                                                                                                   // 7
		"class": 'Class'                                                                                                    // 8
	}                                                                                                                    // 5
});                                                                                                                   // 4
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"settings.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_slackbridge/settings.js                                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.startup(function () {                                                                                          // 1
	RocketChat.settings.addGroup('SlackBridge', function () {                                                            // 2
		this.add('SlackBridge_Enabled', false, {                                                                            // 3
			type: 'boolean',                                                                                                   // 4
			i18nLabel: 'Enabled',                                                                                              // 5
			"public": true                                                                                                     // 6
		});                                                                                                                 // 3
		this.add('SlackBridge_APIToken', '', {                                                                              // 9
			type: 'string',                                                                                                    // 10
			enableQuery: {                                                                                                     // 11
				_id: 'SlackBridge_Enabled',                                                                                       // 12
				value: true                                                                                                       // 13
			},                                                                                                                 // 11
			i18nLabel: 'API_Token'                                                                                             // 15
		});                                                                                                                 // 9
		this.add('SlackBridge_AliasFormat', '', {                                                                           // 18
			type: 'string',                                                                                                    // 19
			enableQuery: {                                                                                                     // 20
				_id: 'SlackBridge_Enabled',                                                                                       // 21
				value: true                                                                                                       // 22
			},                                                                                                                 // 20
			i18nLabel: 'Alias_Format',                                                                                         // 24
			i18nDescription: 'Alias_Format_Description'                                                                        // 25
		});                                                                                                                 // 18
		this.add('SlackBridge_ExcludeBotnames', '', {                                                                       // 28
			type: 'string',                                                                                                    // 29
			enableQuery: {                                                                                                     // 30
				_id: 'SlackBridge_Enabled',                                                                                       // 31
				value: true                                                                                                       // 32
			},                                                                                                                 // 30
			i18nLabel: 'Exclude_Botnames',                                                                                     // 34
			i18nDescription: 'Exclude_Botnames_Description'                                                                    // 35
		});                                                                                                                 // 28
		this.add('SlackBridge_Out_Enabled', false, {                                                                        // 38
			type: 'boolean',                                                                                                   // 39
			enableQuery: {                                                                                                     // 40
				_id: 'SlackBridge_Enabled',                                                                                       // 41
				value: true                                                                                                       // 42
			}                                                                                                                  // 40
		});                                                                                                                 // 38
		this.add('SlackBridge_Out_All', false, {                                                                            // 46
			type: 'boolean',                                                                                                   // 47
			enableQuery: [{                                                                                                    // 48
				_id: 'SlackBridge_Enabled',                                                                                       // 49
				value: true                                                                                                       // 50
			}, {                                                                                                               // 48
				_id: 'SlackBridge_Out_Enabled',                                                                                   // 52
				value: true                                                                                                       // 53
			}]                                                                                                                 // 51
		});                                                                                                                 // 46
		this.add('SlackBridge_Out_Channels', '', {                                                                          // 57
			type: 'roomPick',                                                                                                  // 58
			enableQuery: [{                                                                                                    // 59
				_id: 'SlackBridge_Enabled',                                                                                       // 60
				value: true                                                                                                       // 61
			}, {                                                                                                               // 59
				_id: 'SlackBridge_Out_Enabled',                                                                                   // 63
				value: true                                                                                                       // 64
			}, {                                                                                                               // 62
				_id: 'SlackBridge_Out_All',                                                                                       // 66
				value: false                                                                                                      // 67
			}]                                                                                                                 // 65
		});                                                                                                                 // 57
	});                                                                                                                  // 70
});                                                                                                                   // 71
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"slackbridge.js":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_slackbridge/slackbridge.js                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                               //
                                                                                                                      //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                      //
                                                                                                                      //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                     //
                                                                                                                      //
/* globals logger */var SlackBridge = function () {                                                                   // 1
	function SlackBridge() {                                                                                             // 5
		var _this = this;                                                                                                   // 5
                                                                                                                      //
		(0, _classCallCheck3.default)(this, SlackBridge);                                                                   // 5
		this.util = Npm.require('util');                                                                                    // 6
		this.slackClient = Npm.require('slack-client');                                                                     // 7
		this.apiToken = RocketChat.settings.get('SlackBridge_APIToken');                                                    // 8
		this.aliasFormat = RocketChat.settings.get('SlackBridge_AliasFormat');                                              // 9
		this.excludeBotnames = RocketChat.settings.get('SlackBridge_Botnames');                                             // 10
		this.rtm = {};                                                                                                      // 11
		this.connected = false;                                                                                             // 12
		this.userTags = {};                                                                                                 // 13
		this.slackChannelMap = {};                                                                                          // 14
		this.reactionsMap = new Map();                                                                                      // 15
		RocketChat.settings.get('SlackBridge_APIToken', function (key, value) {                                             // 17
			if (value !== _this.apiToken) {                                                                                    // 18
				_this.apiToken = value;                                                                                           // 19
                                                                                                                      //
				if (_this.connected) {                                                                                            // 20
					_this.disconnect();                                                                                              // 21
                                                                                                                      //
					_this.connect();                                                                                                 // 22
				}                                                                                                                 // 23
			}                                                                                                                  // 24
		});                                                                                                                 // 25
		RocketChat.settings.get('SlackBridge_AliasFormat', function (key, value) {                                          // 27
			_this.aliasFormat = value;                                                                                         // 28
		});                                                                                                                 // 29
		RocketChat.settings.get('SlackBridge_ExcludeBotnames', function (key, value) {                                      // 31
			_this.excludeBotnames = value;                                                                                     // 32
		});                                                                                                                 // 33
		RocketChat.settings.get('SlackBridge_Enabled', function (key, value) {                                              // 35
			if (value && _this.apiToken) {                                                                                     // 36
				_this.connect();                                                                                                  // 37
			} else {                                                                                                           // 38
				_this.disconnect();                                                                                               // 39
			}                                                                                                                  // 40
		});                                                                                                                 // 41
	}                                                                                                                    // 42
                                                                                                                      //
	SlackBridge.prototype.connect = function () {                                                                        //
		function connect() {                                                                                                //
			var _this2 = this;                                                                                                 // 44
                                                                                                                      //
			if (this.connected === false) {                                                                                    // 45
				this.connected = true;                                                                                            // 46
				logger.connection.info('Connecting via token: ', this.apiToken);                                                  // 47
				var RtmClient = this.slackClient.RtmClient;                                                                       // 48
				this.rtm = new RtmClient(this.apiToken);                                                                          // 49
				this.rtm.start();                                                                                                 // 50
				this.registerForSlackEvents();                                                                                    // 51
				RocketChat.settings.get('SlackBridge_Out_Enabled', function (key, value) {                                        // 52
					if (value) {                                                                                                     // 53
						_this2.registerForRocketEvents();                                                                               // 54
					} else {                                                                                                         // 55
						_this2.unregisterForRocketEvents();                                                                             // 56
					}                                                                                                                // 57
				});                                                                                                               // 58
				Meteor.startup(function () {                                                                                      // 59
					try {                                                                                                            // 60
						_this2.populateSlackChannelMap(); // If run outside of Meteor.startup, HTTP is not defined                      // 61
                                                                                                                      //
					} catch (err) {                                                                                                  // 62
						logger.class.error('Error attempting to connect to Slack', err);                                                // 63
                                                                                                                      //
						_this2.disconnect();                                                                                            // 64
					}                                                                                                                // 65
				});                                                                                                               // 66
			}                                                                                                                  // 67
		}                                                                                                                   // 68
                                                                                                                      //
		return connect;                                                                                                     //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.disconnect = function () {                                                                     //
		function disconnect() {                                                                                             //
			if (this.connected === true) {                                                                                     // 71
				this.connected = false;                                                                                           // 72
				this.rtm.disconnect && this.rtm.disconnect();                                                                     // 73
				logger.connection.info('Disconnected');                                                                           // 74
				this.unregisterForRocketEvents();                                                                                 // 75
			}                                                                                                                  // 76
		}                                                                                                                   // 77
                                                                                                                      //
		return disconnect;                                                                                                  //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.convertSlackMsgTxtToRocketTxtFormat = function () {                                            //
		function convertSlackMsgTxtToRocketTxtFormat(slackMsgTxt) {                                                         //
			var _this3 = this;                                                                                                 // 79
                                                                                                                      //
			if (!_.isEmpty(slackMsgTxt)) {                                                                                     // 80
				slackMsgTxt = slackMsgTxt.replace(/<!everyone>/g, '@all');                                                        // 81
				slackMsgTxt = slackMsgTxt.replace(/<!channel>/g, '@all');                                                         // 82
				slackMsgTxt = slackMsgTxt.replace(/<!here>/g, '@here');                                                           // 83
				slackMsgTxt = slackMsgTxt.replace(/&gt;/g, '>');                                                                  // 84
				slackMsgTxt = slackMsgTxt.replace(/&lt;/g, '<');                                                                  // 85
				slackMsgTxt = slackMsgTxt.replace(/&amp;/g, '&');                                                                 // 86
				slackMsgTxt = slackMsgTxt.replace(/:simple_smile:/g, ':smile:');                                                  // 87
				slackMsgTxt = slackMsgTxt.replace(/:memo:/g, ':pencil:');                                                         // 88
				slackMsgTxt = slackMsgTxt.replace(/:piggy:/g, ':pig:');                                                           // 89
				slackMsgTxt = slackMsgTxt.replace(/:uk:/g, ':gb:');                                                               // 90
				slackMsgTxt = slackMsgTxt.replace(/<(http[s]?:[^>]*)>/g, '$1');                                                   // 91
				slackMsgTxt.replace(/(?:<@)([a-zA-Z0-9]+)(?:\|.+)?(?:>)/g, function (match, userId) {                             // 93
					if (!_this3.userTags[userId]) {                                                                                  // 94
						_this3.findRocketUser(userId) || _this3.addRocketUser(userId); // This adds userTags for the userId             // 95
					}                                                                                                                // 96
                                                                                                                      //
					var userTags = _this3.userTags[userId];                                                                          // 97
                                                                                                                      //
					if (userTags) {                                                                                                  // 98
						slackMsgTxt = slackMsgTxt.replace(userTags.slack, userTags.rocket);                                             // 99
					}                                                                                                                // 100
				});                                                                                                               // 101
			} else {                                                                                                           // 102
				slackMsgTxt = '';                                                                                                 // 103
			}                                                                                                                  // 104
                                                                                                                      //
			return slackMsgTxt;                                                                                                // 105
		}                                                                                                                   // 106
                                                                                                                      //
		return convertSlackMsgTxtToRocketTxtFormat;                                                                         //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.findRocketChannel = function () {                                                              //
		function findRocketChannel(slackChannelId) {                                                                        //
			return RocketChat.models.Rooms.findOneByImportId(slackChannelId);                                                  // 109
		}                                                                                                                   // 110
                                                                                                                      //
		return findRocketChannel;                                                                                           //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.addRocketChannel = function () {                                                               //
		function addRocketChannel(slackChannelID) {                                                                         //
			var hasRetried = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;                        // 112
			logger.class.debug('Adding Rocket.Chat channel from Slack', slackChannelID);                                       // 113
			var slackResults = null;                                                                                           // 114
			var isGroup = false;                                                                                               // 115
                                                                                                                      //
			if (slackChannelID.charAt(0) === 'C') {                                                                            // 116
				slackResults = HTTP.get('https://slack.com/api/channels.info', {                                                  // 117
					params: {                                                                                                        // 117
						token: this.apiToken,                                                                                           // 117
						channel: slackChannelID                                                                                         // 117
					}                                                                                                                // 117
				});                                                                                                               // 117
			} else if (slackChannelID.charAt(0) === 'G') {                                                                     // 118
				slackResults = HTTP.get('https://slack.com/api/groups.info', {                                                    // 119
					params: {                                                                                                        // 119
						token: this.apiToken,                                                                                           // 119
						channel: slackChannelID                                                                                         // 119
					}                                                                                                                // 119
				});                                                                                                               // 119
				isGroup = true;                                                                                                   // 120
			}                                                                                                                  // 121
                                                                                                                      //
			if (slackResults && slackResults.data && slackResults.data.ok === true) {                                          // 122
				var rocketChannelData = isGroup ? slackResults.data.group : slackResults.data.channel;                            // 123
				var existingRocketRoom = RocketChat.models.Rooms.findOneByName(rocketChannelData.name); // If the room exists, make sure we have its id in importIds
                                                                                                                      //
				if (existingRocketRoom || rocketChannelData.is_general) {                                                         // 127
					rocketChannelData.rocketId = rocketChannelData.is_general ? 'GENERAL' : existingRocketRoom._id;                  // 128
					RocketChat.models.Rooms.addImportIds(rocketChannelData.rocketId, rocketChannelData.id);                          // 129
				} else {                                                                                                          // 130
					var rocketUsers = [];                                                                                            // 131
                                                                                                                      //
					for (var _iterator = rocketChannelData.members, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
						var _ref;                                                                                                       // 132
                                                                                                                      //
						if (_isArray) {                                                                                                 // 132
							if (_i >= _iterator.length) break;                                                                             // 132
							_ref = _iterator[_i++];                                                                                        // 132
						} else {                                                                                                        // 132
							_i = _iterator.next();                                                                                         // 132
							if (_i.done) break;                                                                                            // 132
							_ref = _i.value;                                                                                               // 132
						}                                                                                                               // 132
                                                                                                                      //
						var member = _ref;                                                                                              // 132
                                                                                                                      //
						if (member !== rocketChannelData.creator) {                                                                     // 133
							var rocketUser = this.findRocketUser(member) || this.addRocketUser(member);                                    // 134
                                                                                                                      //
							if (rocketUser && rocketUser.username) {                                                                       // 135
								rocketUsers.push(rocketUser.username);                                                                        // 136
							}                                                                                                              // 137
						}                                                                                                               // 138
					}                                                                                                                // 139
                                                                                                                      //
					var rocketUserCreator = rocketChannelData.creator ? this.findRocketUser(rocketChannelData.creator) || this.addRocketUser(rocketChannelData.creator) : null;
                                                                                                                      //
					if (!rocketUserCreator) {                                                                                        // 141
						logger.class.error('Could not fetch room creator information', rocketChannelData.creator);                      // 142
						return;                                                                                                         // 143
					}                                                                                                                // 144
                                                                                                                      //
					try {                                                                                                            // 146
						var rocketChannel = RocketChat.createRoom(isGroup ? 'p' : 'c', rocketChannelData.name, rocketUserCreator.username, rocketUsers);
						rocketChannelData.rocketId = rocketChannel.rid;                                                                 // 148
					} catch (e) {                                                                                                    // 149
						if (!hasRetried) {                                                                                              // 150
							logger.class.debug('Error adding channel from Slack. Will retry in 1s.', e.message); // If first time trying to create channel fails, could be because of multiple messages received at the same time. Try again once after 1s.
                                                                                                                      //
							Meteor._sleepForMs(1000);                                                                                      // 153
                                                                                                                      //
							return this.findRocketChannel(slackChannelID) || this.addRocketChannel(slackChannelID, true);                  // 154
						} else {                                                                                                        // 155
							console.log(e.message);                                                                                        // 156
						}                                                                                                               // 157
					}                                                                                                                // 158
                                                                                                                      //
					var roomUpdate = {                                                                                               // 160
						ts: new Date(rocketChannelData.created * 1000)                                                                  // 161
					};                                                                                                               // 160
					var lastSetTopic = 0;                                                                                            // 163
                                                                                                                      //
					if (!_.isEmpty(rocketChannelData.topic && rocketChannelData.topic.value)) {                                      // 164
						roomUpdate.topic = rocketChannelData.topic.value;                                                               // 165
						lastSetTopic = rocketChannelData.topic.last_set;                                                                // 166
					}                                                                                                                // 167
                                                                                                                      //
					if (!_.isEmpty(rocketChannelData.purpose && rocketChannelData.purpose.value) && rocketChannelData.purpose.last_set > lastSetTopic) {
						roomUpdate.topic = rocketChannelData.purpose.value;                                                             // 169
					}                                                                                                                // 170
                                                                                                                      //
					RocketChat.models.Rooms.addImportIds(rocketChannelData.rocketId, rocketChannelData.id);                          // 171
					this.slackChannelMap[rocketChannelData.rocketId] = {                                                             // 172
						id: slackChannelID,                                                                                             // 172
						family: slackChannelID.charAt(0) === 'C' ? 'channels' : 'groups'                                                // 172
					};                                                                                                               // 172
				}                                                                                                                 // 173
                                                                                                                      //
				return RocketChat.models.Rooms.findOneById(rocketChannelData.rocketId);                                           // 174
			}                                                                                                                  // 175
                                                                                                                      //
			logger.class.debug('Channel not added');                                                                           // 176
			return;                                                                                                            // 177
		}                                                                                                                   // 178
                                                                                                                      //
		return addRocketChannel;                                                                                            //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.findRocketUser = function () {                                                                 //
		function findRocketUser(slackUserID) {                                                                              //
			var rocketUser = RocketChat.models.Users.findOneByImportId(slackUserID);                                           // 181
                                                                                                                      //
			if (rocketUser && !this.userTags[slackUserID]) {                                                                   // 182
				this.userTags[slackUserID] = {                                                                                    // 183
					slack: "<@" + slackUserID + ">",                                                                                 // 183
					rocket: "@" + rocketUser.username                                                                                // 183
				};                                                                                                                // 183
			}                                                                                                                  // 184
                                                                                                                      //
			return rocketUser;                                                                                                 // 185
		}                                                                                                                   // 186
                                                                                                                      //
		return findRocketUser;                                                                                              //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.addRocketUser = function () {                                                                  //
		function addRocketUser(slackUserID) {                                                                               //
			logger.class.debug('Adding Rocket.Chat user from Slack', slackUserID);                                             // 189
			var slackResults = HTTP.get('https://slack.com/api/users.info', {                                                  // 190
				params: {                                                                                                         // 190
					token: this.apiToken,                                                                                            // 190
					user: slackUserID                                                                                                // 190
				}                                                                                                                 // 190
			});                                                                                                                // 190
                                                                                                                      //
			if (slackResults && slackResults.data && slackResults.data.ok === true && slackResults.data.user) {                // 191
				var rocketUserData = slackResults.data.user;                                                                      // 192
				var isBot = rocketUserData.is_bot === true;                                                                       // 193
				var email = rocketUserData.profile && rocketUserData.profile.email || '';                                         // 194
				var existingRocketUser = void 0;                                                                                  // 195
                                                                                                                      //
				if (!isBot) {                                                                                                     // 196
					existingRocketUser = RocketChat.models.Users.findOneByEmailAddress(email) || RocketChat.models.Users.findOneByUsername(rocketUserData.name);
				} else {                                                                                                          // 198
					existingRocketUser = RocketChat.models.Users.findOneByUsername(rocketUserData.name);                             // 199
				}                                                                                                                 // 200
                                                                                                                      //
				if (existingRocketUser) {                                                                                         // 202
					rocketUserData.rocketId = existingRocketUser._id;                                                                // 203
					rocketUserData.name = existingRocketUser.username;                                                               // 204
				} else {                                                                                                          // 205
					var newUser = {                                                                                                  // 206
						password: Random.id(),                                                                                          // 207
						username: rocketUserData.name                                                                                   // 208
					};                                                                                                               // 206
                                                                                                                      //
					if (!isBot && email) {                                                                                           // 211
						newUser.email = email;                                                                                          // 212
					}                                                                                                                // 213
                                                                                                                      //
					if (isBot) {                                                                                                     // 215
						newUser.joinDefaultChannels = false;                                                                            // 216
					}                                                                                                                // 217
                                                                                                                      //
					rocketUserData.rocketId = Accounts.createUser(newUser);                                                          // 219
					var userUpdate = {                                                                                               // 220
						utcOffset: rocketUserData.tz_offset / 3600,                                                                     // 221
						// Slack's is -18000 which translates to Rocket.Chat's after dividing by 3600,                                  // 221
						roles: isBot ? ['bot'] : ['user']                                                                               // 222
					};                                                                                                               // 220
                                                                                                                      //
					if (rocketUserData.profile && rocketUserData.profile.real_name) {                                                // 225
						userUpdate['name'] = rocketUserData.profile.real_name;                                                          // 226
					}                                                                                                                // 227
                                                                                                                      //
					if (rocketUserData.deleted) {                                                                                    // 229
						userUpdate['active'] = false;                                                                                   // 230
						userUpdate['services.resume.loginTokens'] = [];                                                                 // 231
					}                                                                                                                // 232
                                                                                                                      //
					RocketChat.models.Users.update({                                                                                 // 234
						_id: rocketUserData.rocketId                                                                                    // 234
					}, {                                                                                                             // 234
						$set: userUpdate                                                                                                // 234
					});                                                                                                              // 234
					var user = RocketChat.models.Users.findOneById(rocketUserData.rocketId);                                         // 236
					var url = null;                                                                                                  // 238
                                                                                                                      //
					if (rocketUserData.profile) {                                                                                    // 239
						if (rocketUserData.profile.image_original) {                                                                    // 240
							url = rocketUserData.profile.image_original;                                                                   // 241
						} else if (rocketUserData.profile.image_512) {                                                                  // 242
							url = rocketUserData.profile.image_512;                                                                        // 243
						}                                                                                                               // 244
					}                                                                                                                // 245
                                                                                                                      //
					if (url) {                                                                                                       // 246
						try {                                                                                                           // 247
							RocketChat.setUserAvatar(user, url, null, 'url');                                                              // 248
						} catch (error) {                                                                                               // 249
							logger.class.debug('Error setting user avatar', error.message);                                                // 250
						}                                                                                                               // 251
					}                                                                                                                // 252
				}                                                                                                                 // 253
                                                                                                                      //
				var importIds = [rocketUserData.id];                                                                              // 255
                                                                                                                      //
				if (isBot && rocketUserData.profile && rocketUserData.profile.bot_id) {                                           // 256
					importIds.push(rocketUserData.profile.bot_id);                                                                   // 257
				}                                                                                                                 // 258
                                                                                                                      //
				RocketChat.models.Users.addImportIds(rocketUserData.rocketId, importIds);                                         // 259
                                                                                                                      //
				if (!this.userTags[slackUserID]) {                                                                                // 260
					this.userTags[slackUserID] = {                                                                                   // 261
						slack: "<@" + slackUserID + ">",                                                                                // 261
						rocket: "@" + rocketUserData.name                                                                               // 261
					};                                                                                                               // 261
				}                                                                                                                 // 262
                                                                                                                      //
				return RocketChat.models.Users.findOneById(rocketUserData.rocketId);                                              // 263
			}                                                                                                                  // 264
                                                                                                                      //
			logger.class.debug('User not added');                                                                              // 265
			return;                                                                                                            // 266
		}                                                                                                                   // 267
                                                                                                                      //
		return addRocketUser;                                                                                               //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.addAliasToRocketMsg = function () {                                                            //
		function addAliasToRocketMsg(rocketUserName, rocketMsgObj) {                                                        //
			if (this.aliasFormat) {                                                                                            // 270
				var alias = this.util.format(this.aliasFormat, rocketUserName);                                                   // 271
                                                                                                                      //
				if (alias !== rocketUserName) {                                                                                   // 273
					rocketMsgObj.alias = alias;                                                                                      // 274
				}                                                                                                                 // 275
			}                                                                                                                  // 276
                                                                                                                      //
			return rocketMsgObj;                                                                                               // 278
		}                                                                                                                   // 279
                                                                                                                      //
		return addAliasToRocketMsg;                                                                                         //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.createAndSaveRocketMessage = function () {                                                     //
		function createAndSaveRocketMessage(rocketChannel, rocketUser, slackMessage, rocketMsgDataDefaults, isImporting) {  //
			if (slackMessage.type === 'message') {                                                                             // 282
				var rocketMsgObj = {};                                                                                            // 283
                                                                                                                      //
				if (!_.isEmpty(slackMessage.subtype)) {                                                                           // 284
					rocketMsgObj = this.processSlackSubtypedMessage(rocketChannel, rocketUser, slackMessage, isImporting);           // 285
                                                                                                                      //
					if (!rocketMsgObj) {                                                                                             // 286
						return;                                                                                                         // 287
					}                                                                                                                // 288
				} else {                                                                                                          // 289
					rocketMsgObj = {                                                                                                 // 290
						msg: this.convertSlackMsgTxtToRocketTxtFormat(slackMessage.text),                                               // 291
						rid: rocketChannel._id,                                                                                         // 292
						u: {                                                                                                            // 293
							_id: rocketUser._id,                                                                                           // 294
							username: rocketUser.username                                                                                  // 295
						}                                                                                                               // 293
					};                                                                                                               // 290
					this.addAliasToRocketMsg(rocketUser.username, rocketMsgObj);                                                     // 299
				}                                                                                                                 // 300
                                                                                                                      //
				_.extend(rocketMsgObj, rocketMsgDataDefaults);                                                                    // 301
                                                                                                                      //
				if (slackMessage.edited) {                                                                                        // 302
					rocketMsgObj.editedAt = new Date(parseInt(slackMessage.edited.ts.split('.')[0]) * 1000);                         // 303
				}                                                                                                                 // 304
                                                                                                                      //
				if (slackMessage.subtype === 'bot_message') {                                                                     // 305
					rocketUser = RocketChat.models.Users.findOneById('rocket.cat', {                                                 // 306
						fields: {                                                                                                       // 306
							username: 1                                                                                                    // 306
						}                                                                                                               // 306
					});                                                                                                              // 306
				}                                                                                                                 // 307
                                                                                                                      //
				if (slackMessage.pinned_to && slackMessage.pinned_to.indexOf(slackMessage.channel) !== -1) {                      // 309
					rocketMsgObj.pinned = true;                                                                                      // 310
					rocketMsgObj.pinnedAt = Date.now;                                                                                // 311
					rocketMsgObj.pinnedBy = _.pick(rocketUser, '_id', 'username');                                                   // 312
				}                                                                                                                 // 313
                                                                                                                      //
				if (slackMessage.subtype === 'bot_message') {                                                                     // 314
					Meteor.setTimeout(function () {                                                                                  // 315
						if (slackMessage.bot_id && slackMessage.ts && !RocketChat.models.Messages.findOneBySlackBotIdAndSlackTs(slackMessage.bot_id, slackMessage.ts)) {
							RocketChat.sendMessage(rocketUser, rocketMsgObj, rocketChannel, true);                                         // 317
						}                                                                                                               // 318
					}, 500);                                                                                                         // 319
				} else {                                                                                                          // 320
					logger.class.debug('Send message to Rocket.Chat');                                                               // 321
					RocketChat.sendMessage(rocketUser, rocketMsgObj, rocketChannel, true);                                           // 322
				}                                                                                                                 // 323
			}                                                                                                                  // 324
		}                                                                                                                   // 325
                                                                                                                      //
		return createAndSaveRocketMessage;                                                                                  //
	}(); /*                                                                                                              //
       https://api.slack.com/events/reaction_removed                                                                  //
       */                                                                                                             //
                                                                                                                      //
	SlackBridge.prototype.onSlackReactionRemoved = function () {                                                         //
		function onSlackReactionRemoved(slackReactionMsg) {                                                                 //
			if (slackReactionMsg) {                                                                                            // 331
				var rocketUser = this.getRocketUser(slackReactionMsg.user); //Lets find our Rocket originated message             // 332
                                                                                                                      //
				var rocketMsg = RocketChat.models.Messages.findOneBySlackTs(slackReactionMsg.item.ts);                            // 334
                                                                                                                      //
				if (!rocketMsg) {                                                                                                 // 336
					//Must have originated from Slack                                                                                // 337
					var rocketID = this.createRocketID(slackReactionMsg.item.channel, slackReactionMsg.item.ts);                     // 338
					rocketMsg = RocketChat.models.Messages.findOneById(rocketID);                                                    // 339
				}                                                                                                                 // 340
                                                                                                                      //
				if (rocketMsg && rocketUser) {                                                                                    // 342
					var rocketReaction = ":" + slackReactionMsg.reaction + ":"; //If the Rocket user has already been removed, then this is an echo back from slack
                                                                                                                      //
					if (rocketMsg.reactions) {                                                                                       // 346
						var theReaction = rocketMsg.reactions[rocketReaction];                                                          // 347
                                                                                                                      //
						if (theReaction) {                                                                                              // 348
							if (theReaction.usernames.indexOf(rocketUser.username) === -1) {                                               // 349
								return; //Reaction already removed                                                                            // 350
							}                                                                                                              // 351
						}                                                                                                               // 352
					} else {                                                                                                         // 353
						//Reaction already removed                                                                                      // 354
						return;                                                                                                         // 355
					} //Stash this away to key off it later so we don't send it back to Slack                                        // 356
                                                                                                                      //
                                                                                                                      //
					this.reactionsMap.set("unset" + rocketMsg._id + rocketReaction, rocketUser);                                     // 359
					logger.class.debug('Removing reaction from Slack');                                                              // 360
					Meteor.runAsUser(rocketUser._id, function () {                                                                   // 361
						Meteor.call('setReaction', rocketReaction, rocketMsg._id);                                                      // 362
					});                                                                                                              // 363
				}                                                                                                                 // 364
			}                                                                                                                  // 365
		}                                                                                                                   // 366
                                                                                                                      //
		return onSlackReactionRemoved;                                                                                      //
	}(); /*                                                                                                              //
       https://api.slack.com/events/reaction_added                                                                    //
       */                                                                                                             //
                                                                                                                      //
	SlackBridge.prototype.onSlackReactionAdded = function () {                                                           //
		function onSlackReactionAdded(slackReactionMsg) {                                                                   //
			if (slackReactionMsg) {                                                                                            // 372
				var rocketUser = this.getRocketUser(slackReactionMsg.user);                                                       // 373
                                                                                                                      //
				if (rocketUser.roles.includes('bot')) {                                                                           // 375
					return;                                                                                                          // 376
				} //Lets find our Rocket originated message                                                                       // 377
                                                                                                                      //
                                                                                                                      //
				var rocketMsg = RocketChat.models.Messages.findOneBySlackTs(slackReactionMsg.item.ts);                            // 380
                                                                                                                      //
				if (!rocketMsg) {                                                                                                 // 382
					//Must have originated from Slack                                                                                // 383
					var rocketID = this.createRocketID(slackReactionMsg.item.channel, slackReactionMsg.item.ts);                     // 384
					rocketMsg = RocketChat.models.Messages.findOneById(rocketID);                                                    // 385
				}                                                                                                                 // 386
                                                                                                                      //
				if (rocketMsg && rocketUser) {                                                                                    // 388
					var rocketReaction = ":" + slackReactionMsg.reaction + ":"; //If the Rocket user has already reacted, then this is Slack echoing back to us
                                                                                                                      //
					if (rocketMsg.reactions) {                                                                                       // 392
						var theReaction = rocketMsg.reactions[rocketReaction];                                                          // 393
                                                                                                                      //
						if (theReaction) {                                                                                              // 394
							if (theReaction.usernames.indexOf(rocketUser.username) !== -1) {                                               // 395
								return; //Already reacted                                                                                     // 396
							}                                                                                                              // 397
						}                                                                                                               // 398
					} //Stash this away to key off it later so we don't send it back to Slack                                        // 399
                                                                                                                      //
                                                                                                                      //
					this.reactionsMap.set("set" + rocketMsg._id + rocketReaction, rocketUser);                                       // 402
					logger.class.debug('Adding reaction from Slack');                                                                // 403
					Meteor.runAsUser(rocketUser._id, function () {                                                                   // 404
						Meteor.call('setReaction', rocketReaction, rocketMsg._id);                                                      // 405
					});                                                                                                              // 406
				}                                                                                                                 // 407
			}                                                                                                                  // 408
		}                                                                                                                   // 409
                                                                                                                      //
		return onSlackReactionAdded;                                                                                        //
	}(); /**                                                                                                             //
       * We have received a message from slack and we need to save/delete/update it into rocket                       //
       * https://api.slack.com/events/message                                                                         //
       */                                                                                                             //
                                                                                                                      //
	SlackBridge.prototype.onSlackMessage = function () {                                                                 //
		function onSlackMessage(slackMessage, isImporting) {                                                                //
			if (slackMessage.subtype) {                                                                                        // 416
				switch (slackMessage.subtype) {                                                                                   // 417
					case 'message_deleted':                                                                                          // 418
						this.processSlackMessageDeleted(slackMessage);                                                                  // 419
						break;                                                                                                          // 420
                                                                                                                      //
					case 'message_changed':                                                                                          // 421
						this.processSlackMessageChanged(slackMessage);                                                                  // 422
						break;                                                                                                          // 423
                                                                                                                      //
					default:                                                                                                         // 424
						//Keeping backwards compatability for now, refactor later                                                       // 425
						this.processSlackNewMessage(slackMessage, isImporting);                                                         // 426
				}                                                                                                                 // 417
			} else {                                                                                                           // 428
				//Simple message                                                                                                  // 429
				this.processSlackNewMessage(slackMessage, isImporting);                                                           // 430
			}                                                                                                                  // 431
		}                                                                                                                   // 432
                                                                                                                      //
		return onSlackMessage;                                                                                              //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.processSlackSubtypedMessage = function () {                                                    //
		function processSlackSubtypedMessage(rocketChannel, rocketUser, slackMessage, isImporting) {                        //
			var rocketMsgObj = null;                                                                                           // 435
                                                                                                                      //
			switch (slackMessage.subtype) {                                                                                    // 436
				case 'bot_message':                                                                                               // 437
					if (slackMessage.username !== undefined && this.excludeBotnames && slackMessage.username.match(this.excludeBotnames)) {
						return;                                                                                                         // 439
					}                                                                                                                // 440
                                                                                                                      //
					rocketMsgObj = {                                                                                                 // 442
						msg: this.convertSlackMsgTxtToRocketTxtFormat(slackMessage.text),                                               // 443
						rid: rocketChannel._id,                                                                                         // 444
						bot: true,                                                                                                      // 445
						attachments: slackMessage.attachments,                                                                          // 446
						username: slackMessage.username || slackMessage.bot_id                                                          // 447
					};                                                                                                               // 442
					this.addAliasToRocketMsg(slackMessage.username || slackMessage.bot_id, rocketMsgObj);                            // 449
                                                                                                                      //
					if (slackMessage.icons) {                                                                                        // 450
						rocketMsgObj.emoji = slackMessage.icons.emoji;                                                                  // 451
					}                                                                                                                // 452
                                                                                                                      //
					return rocketMsgObj;                                                                                             // 453
                                                                                                                      //
				case 'me_message':                                                                                                // 454
					return this.addAliasToRocketMsg(rocketUser.username, {                                                           // 455
						msg: "_" + this.convertSlackMsgTxtToRocketTxtFormat(slackMessage.text) + "_"                                    // 456
					});                                                                                                              // 455
                                                                                                                      //
				case 'channel_join':                                                                                              // 458
					if (isImporting) {                                                                                               // 459
						RocketChat.models.Messages.createUserJoinWithRoomIdAndUser(rocketChannel._id, rocketUser, {                     // 460
							ts: new Date(parseInt(slackMessage.ts.split('.')[0]) * 1000),                                                  // 460
							imported: 'slackbridge'                                                                                        // 460
						});                                                                                                             // 460
					} else {                                                                                                         // 461
						RocketChat.addUserToRoom(rocketChannel._id, rocketUser);                                                        // 462
					}                                                                                                                // 463
                                                                                                                      //
					return;                                                                                                          // 464
                                                                                                                      //
				case 'group_join':                                                                                                // 465
					if (slackMessage.inviter) {                                                                                      // 466
						var inviter = slackMessage.inviter ? this.findRocketUser(slackMessage.inviter) || this.addRocketUser(slackMessage.inviter) : null;
                                                                                                                      //
						if (isImporting) {                                                                                              // 468
							RocketChat.models.Messages.createUserAddedWithRoomIdAndUser(rocketChannel._id, rocketUser, {                   // 469
								ts: new Date(parseInt(slackMessage.ts.split('.')[0]) * 1000),                                                 // 470
								u: {                                                                                                          // 471
									_id: inviter._id,                                                                                            // 472
									username: inviter.username                                                                                   // 473
								},                                                                                                            // 471
								imported: 'slackbridge'                                                                                       // 475
							});                                                                                                            // 469
						} else {                                                                                                        // 477
							RocketChat.addUserToRoom(rocketChannel._id, rocketUser, inviter);                                              // 478
						}                                                                                                               // 479
					}                                                                                                                // 480
                                                                                                                      //
					return;                                                                                                          // 481
                                                                                                                      //
				case 'channel_leave':                                                                                             // 482
				case 'group_leave':                                                                                               // 483
					if (isImporting) {                                                                                               // 484
						RocketChat.models.Messages.createUserLeaveWithRoomIdAndUser(rocketChannel._id, rocketUser, {                    // 485
							ts: new Date(parseInt(slackMessage.ts.split('.')[0]) * 1000),                                                  // 486
							imported: 'slackbridge'                                                                                        // 487
						});                                                                                                             // 485
					} else {                                                                                                         // 489
						RocketChat.removeUserFromRoom(rocketChannel._id, rocketUser);                                                   // 490
					}                                                                                                                // 491
                                                                                                                      //
					return;                                                                                                          // 492
                                                                                                                      //
				case 'channel_topic':                                                                                             // 493
				case 'group_topic':                                                                                               // 494
					if (isImporting) {                                                                                               // 495
						RocketChat.models.Messages.createRoomSettingsChangedWithTypeRoomIdMessageAndUser('room_changed_topic', rocketChannel._id, slackMessage.topic, rocketUser, {
							ts: new Date(parseInt(slackMessage.ts.split('.')[0]) * 1000),                                                  // 496
							imported: 'slackbridge'                                                                                        // 496
						});                                                                                                             // 496
					} else {                                                                                                         // 497
						RocketChat.saveRoomTopic(rocketChannel._id, slackMessage.topic, rocketUser, false);                             // 498
					}                                                                                                                // 499
                                                                                                                      //
					return;                                                                                                          // 500
                                                                                                                      //
				case 'channel_purpose':                                                                                           // 501
				case 'group_purpose':                                                                                             // 502
					if (isImporting) {                                                                                               // 503
						RocketChat.models.Messages.createRoomSettingsChangedWithTypeRoomIdMessageAndUser('room_changed_topic', rocketChannel._id, slackMessage.purpose, rocketUser, {
							ts: new Date(parseInt(slackMessage.ts.split('.')[0]) * 1000),                                                  // 504
							imported: 'slackbridge'                                                                                        // 504
						});                                                                                                             // 504
					} else {                                                                                                         // 505
						RocketChat.saveRoomTopic(rocketChannel._id, slackMessage.purpose, rocketUser, false);                           // 506
					}                                                                                                                // 507
                                                                                                                      //
					return;                                                                                                          // 508
                                                                                                                      //
				case 'channel_name':                                                                                              // 509
				case 'group_name':                                                                                                // 510
					if (isImporting) {                                                                                               // 511
						RocketChat.models.Messages.createRoomRenamedWithRoomIdRoomNameAndUser(rocketChannel._id, slackMessage.name, rocketUser, {
							ts: new Date(parseInt(slackMessage.ts.split('.')[0]) * 1000),                                                  // 512
							imported: 'slackbridge'                                                                                        // 512
						});                                                                                                             // 512
					} else {                                                                                                         // 513
						RocketChat.saveRoomName(rocketChannel._id, slackMessage.name, rocketUser, false);                               // 514
					}                                                                                                                // 515
                                                                                                                      //
					return;                                                                                                          // 516
                                                                                                                      //
				case 'channel_archive':                                                                                           // 517
				case 'group_archive':                                                                                             // 518
					if (!isImporting) {                                                                                              // 519
						RocketChat.archiveRoom(rocketChannel);                                                                          // 520
					}                                                                                                                // 521
                                                                                                                      //
					return;                                                                                                          // 522
                                                                                                                      //
				case 'channel_unarchive':                                                                                         // 523
				case 'group_unarchive':                                                                                           // 524
					if (!isImporting) {                                                                                              // 525
						RocketChat.unarchiveRoom(rocketChannel);                                                                        // 526
					}                                                                                                                // 527
                                                                                                                      //
					return;                                                                                                          // 528
                                                                                                                      //
				case 'file_share':                                                                                                // 529
					if (slackMessage.file && slackMessage.file.url_private_download !== undefined) {                                 // 530
						var details = {                                                                                                 // 531
							message_id: "slack-" + slackMessage.ts.replace(/\./g, '-'),                                                    // 532
							name: slackMessage.file.name,                                                                                  // 533
							size: slackMessage.file.size,                                                                                  // 534
							type: slackMessage.file.mimetype,                                                                              // 535
							rid: rocketChannel._id                                                                                         // 536
						};                                                                                                              // 531
						return this.uploadFileFromSlack(details, slackMessage.file.url_private_download, rocketUser, rocketChannel, new Date(parseInt(slackMessage.ts.split('.')[0]) * 1000), isImporting);
					}                                                                                                                // 539
                                                                                                                      //
					break;                                                                                                           // 540
                                                                                                                      //
				case 'file_comment':                                                                                              // 541
					logger.class.error('File comment not implemented');                                                              // 542
					return;                                                                                                          // 543
                                                                                                                      //
				case 'file_mention':                                                                                              // 544
					logger.class.error('File mentioned not implemented');                                                            // 545
					return;                                                                                                          // 546
                                                                                                                      //
				case 'pinned_item':                                                                                               // 547
					if (slackMessage.attachments && slackMessage.attachments[0] && slackMessage.attachments[0].text) {               // 548
						rocketMsgObj = {                                                                                                // 549
							rid: rocketChannel._id,                                                                                        // 550
							t: 'message_pinned',                                                                                           // 551
							msg: '',                                                                                                       // 552
							u: {                                                                                                           // 553
								_id: rocketUser._id,                                                                                          // 554
								username: rocketUser.username                                                                                 // 555
							},                                                                                                             // 553
							attachments: [{                                                                                                // 557
								'text': this.convertSlackMsgTxtToRocketTxtFormat(slackMessage.attachments[0].text),                           // 558
								'author_name': slackMessage.attachments[0].author_subname,                                                    // 559
								'author_icon': getAvatarUrlFromUsername(slackMessage.attachments[0].author_subname),                          // 560
								'ts': new Date(parseInt(slackMessage.attachments[0].ts.split('.')[0]) * 1000)                                 // 561
							}]                                                                                                             // 557
						};                                                                                                              // 549
                                                                                                                      //
						if (!isImporting) {                                                                                             // 565
							RocketChat.models.Messages.setPinnedByIdAndUserId("slack-" + slackMessage.attachments[0].channel_id + "-" + slackMessage.attachments[0].ts.replace(/\./g, '-'), rocketMsgObj.u, true, new Date(parseInt(slackMessage.ts.split('.')[0]) * 1000));
						}                                                                                                               // 567
                                                                                                                      //
						return rocketMsgObj;                                                                                            // 569
					} else {                                                                                                         // 570
						logger.class.error('Pinned item with no attachment');                                                           // 571
					}                                                                                                                // 572
                                                                                                                      //
					return;                                                                                                          // 573
                                                                                                                      //
				case 'unpinned_item':                                                                                             // 574
					logger.class.error('Unpinned item not implemented');                                                             // 575
					return;                                                                                                          // 576
			}                                                                                                                  // 436
		}                                                                                                                   // 578
                                                                                                                      //
		return processSlackSubtypedMessage;                                                                                 //
	}(); /**                                                                                                             //
      Uploads the file to the storage.                                                                                //
      @param [Object] details an object with details about the upload. name, size, type, and rid                      //
      @param [String] fileUrl url of the file to download/import                                                      //
      @param [Object] user the Rocket.Chat user                                                                       //
      @param [Object] room the Rocket.Chat room                                                                       //
      @param [Date] timeStamp the timestamp the file was uploaded                                                     //
      **/ //details, slackMessage.file.url_private_download, rocketUser, rocketChannel, new Date(parseInt(slackMessage.ts.split('.')[0]) * 1000), isImporting);
                                                                                                                      //
                                                                                                                      //
	SlackBridge.prototype.uploadFileFromSlack = function () {                                                            //
		function uploadFileFromSlack(details, slackFileURL, rocketUser, rocketChannel, timeStamp, isImporting) {            //
			var url = Npm.require('url');                                                                                      // 590
                                                                                                                      //
			var requestModule = /https/i.test(slackFileURL) ? Npm.require('https') : Npm.require('http');                      // 591
			var parsedUrl = url.parse(slackFileURL, true);                                                                     // 592
			parsedUrl.headers = {                                                                                              // 593
				'Authorization': "Bearer " + this.apiToken                                                                        // 593
			};                                                                                                                 // 593
			requestModule.get(parsedUrl, Meteor.bindEnvironment(function (stream) {                                            // 594
				var fileStore = FileUpload.getStore('Uploads');                                                                   // 595
				fileStore.insert(details, stream, function (err, file) {                                                          // 597
					if (err) {                                                                                                       // 598
						throw new Error(err);                                                                                           // 599
					} else {                                                                                                         // 600
						var _url = file.url.replace(Meteor.absoluteUrl(), '/');                                                         // 601
                                                                                                                      //
						var attachment = {                                                                                              // 602
							title: file.name,                                                                                              // 603
							title_link: _url                                                                                               // 604
						};                                                                                                              // 602
                                                                                                                      //
						if (/^image\/.+/.test(file.type)) {                                                                             // 607
							attachment.image_url = _url;                                                                                   // 608
							attachment.image_type = file.type;                                                                             // 609
							attachment.image_size = file.size;                                                                             // 610
							attachment.image_dimensions = file.identify && file.identify.size;                                             // 611
						}                                                                                                               // 612
                                                                                                                      //
						if (/^audio\/.+/.test(file.type)) {                                                                             // 613
							attachment.audio_url = _url;                                                                                   // 614
							attachment.audio_type = file.type;                                                                             // 615
							attachment.audio_size = file.size;                                                                             // 616
						}                                                                                                               // 617
                                                                                                                      //
						if (/^video\/.+/.test(file.type)) {                                                                             // 618
							attachment.video_url = _url;                                                                                   // 619
							attachment.video_type = file.type;                                                                             // 620
							attachment.video_size = file.size;                                                                             // 621
						}                                                                                                               // 622
                                                                                                                      //
						var msg = {                                                                                                     // 624
							rid: details.rid,                                                                                              // 625
							ts: timeStamp,                                                                                                 // 626
							msg: '',                                                                                                       // 627
							file: {                                                                                                        // 628
								_id: file._id                                                                                                 // 629
							},                                                                                                             // 628
							groupable: false,                                                                                              // 631
							attachments: [attachment]                                                                                      // 632
						};                                                                                                              // 624
                                                                                                                      //
						if (isImporting) {                                                                                              // 635
							msg.imported = 'slackbridge';                                                                                  // 636
						}                                                                                                               // 637
                                                                                                                      //
						if (details.message_id && typeof details.message_id === 'string') {                                             // 639
							msg['_id'] = details.message_id;                                                                               // 640
						}                                                                                                               // 641
                                                                                                                      //
						return RocketChat.sendMessage(rocketUser, msg, rocketChannel, true);                                            // 643
					}                                                                                                                // 644
				});                                                                                                               // 645
			}));                                                                                                               // 646
		}                                                                                                                   // 647
                                                                                                                      //
		return uploadFileFromSlack;                                                                                         //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.registerForRocketEvents = function () {                                                        //
		function registerForRocketEvents() {                                                                                //
			RocketChat.callbacks.add('afterSaveMessage', this.onRocketMessage.bind(this), RocketChat.callbacks.priority.LOW, 'SlackBridge_Out');
			RocketChat.callbacks.add('afterDeleteMessage', this.onRocketMessageDelete.bind(this), RocketChat.callbacks.priority.LOW, 'SlackBridge_Delete');
			RocketChat.callbacks.add('setReaction', this.onRocketSetReaction.bind(this), RocketChat.callbacks.priority.LOW, 'SlackBridge_SetReaction');
			RocketChat.callbacks.add('unsetReaction', this.onRocketUnSetReaction.bind(this), RocketChat.callbacks.priority.LOW, 'SlackBridge_UnSetReaction');
		}                                                                                                                   // 654
                                                                                                                      //
		return registerForRocketEvents;                                                                                     //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.unregisterForRocketEvents = function () {                                                      //
		function unregisterForRocketEvents() {                                                                              //
			RocketChat.callbacks.remove('afterSaveMessage', 'SlackBridge_Out');                                                // 657
			RocketChat.callbacks.remove('afterDeleteMessage', 'SlackBridge_Delete');                                           // 658
			RocketChat.callbacks.remove('setReaction', 'SlackBridge_SetReaction');                                             // 659
			RocketChat.callbacks.remove('unsetReaction', 'SlackBridge_UnSetReaction');                                         // 660
		}                                                                                                                   // 661
                                                                                                                      //
		return unregisterForRocketEvents;                                                                                   //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.registerForSlackEvents = function () {                                                         //
		function registerForSlackEvents() {                                                                                 //
			var _this4 = this;                                                                                                 // 663
                                                                                                                      //
			var CLIENT_EVENTS = this.slackClient.CLIENT_EVENTS;                                                                // 664
			this.rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function () {                                                         // 665
				logger.connection.info('Connected to Slack');                                                                     // 666
			});                                                                                                                // 667
			this.rtm.on(CLIENT_EVENTS.RTM.UNABLE_TO_RTM_START, function () {                                                   // 669
				_this4.disconnect();                                                                                              // 670
			});                                                                                                                // 671
			this.rtm.on(CLIENT_EVENTS.RTM.DISCONNECT, function () {                                                            // 673
				_this4.disconnect();                                                                                              // 674
			});                                                                                                                // 675
			var RTM_EVENTS = this.slackClient.RTM_EVENTS; /**                                                                  // 677
                                                 * Event fired when someone messages a channel the bot is in          //
                                                 * {                                                                  //
                                                 *	type: 'message',                                                   //
                                                 * 	channel: [channel_id],                                            //
                                                 * 	user: [user_id],                                                  //
                                                 * 	text: [message],                                                  //
                                                 * 	ts: [ts.milli],                                                   //
                                                 * 	team: [team_id],                                                  //
                                                 * 	subtype: [message_subtype],                                       //
                                                 * 	inviter: [message_subtype = 'group_join|channel_join' -> user_id]
                                                 * }                                                                  //
                                                 **/                                                                  //
			this.rtm.on(RTM_EVENTS.MESSAGE, Meteor.bindEnvironment(function (slackMessage) {                                   // 692
				logger.events.debug('OnSlackEvent-MESSAGE: ', slackMessage);                                                      // 693
                                                                                                                      //
				if (slackMessage) {                                                                                               // 694
					_this4.onSlackMessage(slackMessage);                                                                             // 695
				}                                                                                                                 // 696
			}));                                                                                                               // 697
			this.rtm.on(RTM_EVENTS.REACTION_ADDED, Meteor.bindEnvironment(function (reactionMsg) {                             // 699
				logger.events.debug('OnSlackEvent-REACTION_ADDED: ', reactionMsg);                                                // 700
                                                                                                                      //
				if (reactionMsg) {                                                                                                // 701
					_this4.onSlackReactionAdded(reactionMsg);                                                                        // 702
				}                                                                                                                 // 703
			}));                                                                                                               // 704
			this.rtm.on(RTM_EVENTS.REACTION_REMOVED, Meteor.bindEnvironment(function (reactionMsg) {                           // 706
				logger.events.debug('OnSlackEvent-REACTION_REMOVED: ', reactionMsg);                                              // 707
                                                                                                                      //
				if (reactionMsg) {                                                                                                // 708
					_this4.onSlackReactionRemoved(reactionMsg);                                                                      // 709
				}                                                                                                                 // 710
			})); /**                                                                                                           // 711
        * Event fired when someone creates a public channel                                                           //
        * {                                                                                                           //
        *	type: 'channel_created',                                                                                    //
        *	channel: {                                                                                                  //
        *		id: [channel_id],                                                                                          //
        *		is_channel: true,                                                                                          //
        *		name: [channel_name],                                                                                      //
        *		created: [ts],                                                                                             //
        *		creator: [user_id],                                                                                        //
        *		is_shared: false,                                                                                          //
        *		is_org_shared: false                                                                                       //
        *	},                                                                                                          //
        *	event_ts: [ts.milli]                                                                                        //
        * }                                                                                                           //
        **/                                                                                                           //
			this.rtm.on(RTM_EVENTS.CHANNEL_CREATED, Meteor.bindEnvironment(function () {})); /**                               // 729
                                                                                    * Event fired when the bot joins a public channel
                                                                                    * {                               //
                                                                                    * 	type: 'channel_joined',        //
                                                                                    * 	channel: {                     //
                                                                                    * 		id: [channel_id],             //
                                                                                    * 		name: [channel_name],         //
                                                                                    * 		is_channel: true,             //
                                                                                    * 		created: [ts],                //
                                                                                    * 		creator: [user_id],           //
                                                                                    * 		is_archived: false,           //
                                                                                    * 		is_general: false,            //
                                                                                    * 		is_member: true,              //
                                                                                    * 		last_read: [ts.milli],        //
                                                                                    * 		latest: [message_obj],        //
                                                                                    * 		unread_count: 0,              //
                                                                                    * 		unread_count_display: 0,      //
                                                                                    * 		members: [ user_ids ],        //
                                                                                    * 		topic: {                      //
                                                                                    * 			value: [channel_topic],      //
                                                                                    * 			creator: [user_id],          //
                                                                                    * 			last_set: 0                  //
                                                                                    * 		},                            //
                                                                                    * 		purpose: {                    //
                                                                                    * 			value: [channel_purpose],    //
                                                                                    * 			creator: [user_id],          //
                                                                                    * 			last_set: 0                  //
                                                                                    * 		}                             //
                                                                                    * 	}                              //
                                                                                    * }                               //
                                                                                    **/                               //
			this.rtm.on(RTM_EVENTS.CHANNEL_JOINED, Meteor.bindEnvironment(function () {})); /**                                // 762
                                                                                   * Event fired when the bot leaves (or is removed from) a public channel
                                                                                   * {                                //
                                                                                   * 	type: 'channel_left',           //
                                                                                   * 	channel: [channel_id]           //
                                                                                   * }                                //
                                                                                   **/                                //
			this.rtm.on(RTM_EVENTS.CHANNEL_LEFT, Meteor.bindEnvironment(function () {})); /**                                  // 771
                                                                                 * Event fired when an archived channel is deleted by an admin
                                                                                 * {                                  //
                                                                                 * 	type: 'channel_deleted',          //
                                                                                 * 	channel: [channel_id],            //
                                                                                 *	event_ts: [ts.milli]               //
                                                                                 * }                                  //
                                                                                 **/                                  //
			this.rtm.on(RTM_EVENTS.CHANNEL_DELETED, Meteor.bindEnvironment(function () {})); /**                               // 781
                                                                                    * Event fired when the channel has its name changed
                                                                                    * {                               //
                                                                                    * 	type: 'channel_rename',        //
                                                                                    * 	channel: {                     //
                                                                                    * 		id: [channel_id],             //
                                                                                    * 		name: [channel_name],         //
                                                                                    * 		is_channel: true,             //
                                                                                    * 		created: [ts]                 //
                                                                                    * 	},                             //
                                                                                    *	event_ts: [ts.milli]            //
                                                                                    * }                               //
                                                                                    **/                               //
			this.rtm.on(RTM_EVENTS.CHANNEL_RENAME, Meteor.bindEnvironment(function () {})); /**                                // 796
                                                                                   * Event fired when the bot joins a private channel
                                                                                   * {                                //
                                                                                   * 	type: 'group_joined',           //
                                                                                   * 	channel: {                      //
                                                                                   * 		id: [channel_id],              //
                                                                                   * 		name: [channel_name],          //
                                                                                   * 		is_group: true,                //
                                                                                   * 		created: [ts],                 //
                                                                                   * 		creator: [user_id],            //
                                                                                   * 		is_archived: false,            //
                                                                                   * 		is_mpim: false,                //
                                                                                   * 		is_open: true,                 //
                                                                                   * 		last_read: [ts.milli],         //
                                                                                   * 		latest: [message_obj],         //
                                                                                   * 		unread_count: 0,               //
                                                                                   * 		unread_count_display: 0,       //
                                                                                   * 		members: [ user_ids ],         //
                                                                                   * 		topic: {                       //
                                                                                   * 			value: [channel_topic],       //
                                                                                   * 			creator: [user_id],           //
                                                                                   * 			last_set: 0                   //
                                                                                   * 		},                             //
                                                                                   * 		purpose: {                     //
                                                                                   * 			value: [channel_purpose],     //
                                                                                   * 			creator: [user_id],           //
                                                                                   * 			last_set: 0                   //
                                                                                   * 		}                              //
                                                                                   * 	}                               //
                                                                                   * }                                //
                                                                                   **/                                //
			this.rtm.on(RTM_EVENTS.GROUP_JOINED, Meteor.bindEnvironment(function () {})); /**                                  // 829
                                                                                 * Event fired when the bot leaves (or is removed from) a private channel
                                                                                 * {                                  //
                                                                                 * 	type: 'group_left',               //
                                                                                 * 	channel: [channel_id]             //
                                                                                 * }                                  //
                                                                                 **/                                  //
			this.rtm.on(RTM_EVENTS.GROUP_LEFT, Meteor.bindEnvironment(function () {})); /**                                    // 838
                                                                               * Event fired when the private channel has its name changed
                                                                               * {                                    //
                                                                               * 	type: 'group_rename',               //
                                                                               * 	channel: {                          //
                                                                               * 		id: [channel_id],                  //
                                                                               * 		name: [channel_name],              //
                                                                               * 		is_group: true,                    //
                                                                               * 		created: [ts]                      //
                                                                               * 	},                                  //
                                                                               *	event_ts: [ts.milli]                 //
                                                                               * }                                    //
                                                                               **/                                    //
			this.rtm.on(RTM_EVENTS.GROUP_RENAME, Meteor.bindEnvironment(function () {})); /**                                  // 853
                                                                                 * Event fired when a new user joins the team
                                                                                 * {                                  //
                                                                                 * 	type: 'team_join',                //
                                                                                 * 	user:                             //
                                                                                 * 	{                                 //
                                                                                 * 		id: [user_id],                   //
                                                                                 * 		team_id: [team_id],              //
                                                                                 * 		name: [user_name],               //
                                                                                 * 		deleted: false,                  //
                                                                                 * 		status: null,                    //
                                                                                 * 		color: [color_code],             //
                                                                                 * 		real_name: '',                   //
                                                                                 * 		tz: [timezone],                  //
                                                                                 * 		tz_label: [timezone_label],      //
                                                                                 * 		tz_offset: [timezone_offset],    //
                                                                                 * 		profile:                         //
                                                                                 * 		{                                //
                                                                                 * 			avatar_hash: '',                //
                                                                                 * 			real_name: '',                  //
                                                                                 * 			real_name_normalized: '',       //
                                                                                 * 			email: '',                      //
                                                                                 * 			image_24: '',                   //
                                                                                 * 			image_32: '',                   //
                                                                                 * 			image_48: '',                   //
                                                                                 * 			image_72: '',                   //
                                                                                 * 			image_192: '',                  //
                                                                                 * 			image_512: '',                  //
                                                                                 * 			fields: null                    //
                                                                                 * 		},                               //
                                                                                 * 		is_admin: false,                 //
                                                                                 * 		is_owner: false,                 //
                                                                                 * 		is_primary_owner: false,         //
                                                                                 * 		is_restricted: false,            //
                                                                                 * 		is_ultra_restricted: false,      //
                                                                                 * 		is_bot: false,                   //
                                                                                 * 		presence: [user_presence]        //
                                                                                 * 	},                                //
                                                                                 * 	cache_ts: [ts]                    //
                                                                                 * }                                  //
                                                                                 **/                                  //
			this.rtm.on(RTM_EVENTS.TEAM_JOIN, Meteor.bindEnvironment(function () {}));                                         // 896
		}                                                                                                                   // 897
                                                                                                                      //
		return registerForSlackEvents;                                                                                      //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.findSlackChannel = function () {                                                               //
		function findSlackChannel(rocketChannelName) {                                                                      //
			logger.class.debug('Searching for Slack channel or group', rocketChannelName);                                     // 900
			var response = HTTP.get('https://slack.com/api/channels.list', {                                                   // 901
				params: {                                                                                                         // 901
					token: this.apiToken                                                                                             // 901
				}                                                                                                                 // 901
			});                                                                                                                // 901
                                                                                                                      //
			if (response && response.data && _.isArray(response.data.channels) && response.data.channels.length > 0) {         // 902
				for (var _iterator2 = response.data.channels, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
					var _ref2;                                                                                                       // 903
                                                                                                                      //
					if (_isArray2) {                                                                                                 // 903
						if (_i2 >= _iterator2.length) break;                                                                            // 903
						_ref2 = _iterator2[_i2++];                                                                                      // 903
					} else {                                                                                                         // 903
						_i2 = _iterator2.next();                                                                                        // 903
						if (_i2.done) break;                                                                                            // 903
						_ref2 = _i2.value;                                                                                              // 903
					}                                                                                                                // 903
                                                                                                                      //
					var channel = _ref2;                                                                                             // 903
                                                                                                                      //
					if (channel.name === rocketChannelName && channel.is_member === true) {                                          // 904
						return channel;                                                                                                 // 905
					}                                                                                                                // 906
				}                                                                                                                 // 907
			}                                                                                                                  // 908
                                                                                                                      //
			response = HTTP.get('https://slack.com/api/groups.list', {                                                         // 909
				params: {                                                                                                         // 909
					token: this.apiToken                                                                                             // 909
				}                                                                                                                 // 909
			});                                                                                                                // 909
                                                                                                                      //
			if (response && response.data && _.isArray(response.data.groups) && response.data.groups.length > 0) {             // 910
				for (var _iterator3 = response.data.groups, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
					var _ref3;                                                                                                       // 911
                                                                                                                      //
					if (_isArray3) {                                                                                                 // 911
						if (_i3 >= _iterator3.length) break;                                                                            // 911
						_ref3 = _iterator3[_i3++];                                                                                      // 911
					} else {                                                                                                         // 911
						_i3 = _iterator3.next();                                                                                        // 911
						if (_i3.done) break;                                                                                            // 911
						_ref3 = _i3.value;                                                                                              // 911
					}                                                                                                                // 911
                                                                                                                      //
					var group = _ref3;                                                                                               // 911
                                                                                                                      //
					if (group.name === rocketChannelName) {                                                                          // 912
						return group;                                                                                                   // 913
					}                                                                                                                // 914
				}                                                                                                                 // 915
			}                                                                                                                  // 916
		}                                                                                                                   // 917
                                                                                                                      //
		return findSlackChannel;                                                                                            //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.importFromHistory = function () {                                                              //
		function importFromHistory(family, options) {                                                                       //
			logger.class.debug('Importing messages history');                                                                  // 920
			var response = HTTP.get("https://slack.com/api/" + family + ".history", {                                          // 921
				params: _.extend({                                                                                                // 921
					token: this.apiToken                                                                                             // 921
				}, options)                                                                                                       // 921
			});                                                                                                                // 921
                                                                                                                      //
			if (response && response.data && _.isArray(response.data.messages) && response.data.messages.length > 0) {         // 922
				var latest = 0;                                                                                                   // 923
                                                                                                                      //
				for (var _iterator4 = response.data.messages.reverse(), _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
					var _ref4;                                                                                                       // 924
                                                                                                                      //
					if (_isArray4) {                                                                                                 // 924
						if (_i4 >= _iterator4.length) break;                                                                            // 924
						_ref4 = _iterator4[_i4++];                                                                                      // 924
					} else {                                                                                                         // 924
						_i4 = _iterator4.next();                                                                                        // 924
						if (_i4.done) break;                                                                                            // 924
						_ref4 = _i4.value;                                                                                              // 924
					}                                                                                                                // 924
                                                                                                                      //
					var message = _ref4;                                                                                             // 924
					logger.class.debug('MESSAGE: ', message);                                                                        // 925
                                                                                                                      //
					if (!latest || message.ts > latest) {                                                                            // 926
						latest = message.ts;                                                                                            // 927
					}                                                                                                                // 928
                                                                                                                      //
					message.channel = options.channel;                                                                               // 929
					this.onSlackMessage(message, true);                                                                              // 930
				}                                                                                                                 // 931
                                                                                                                      //
				return {                                                                                                          // 932
					has_more: response.data.has_more,                                                                                // 932
					ts: latest                                                                                                       // 932
				};                                                                                                                // 932
			}                                                                                                                  // 933
		}                                                                                                                   // 934
                                                                                                                      //
		return importFromHistory;                                                                                           //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.copySlackChannelInfo = function () {                                                           //
		function copySlackChannelInfo(rid, channelMap) {                                                                    //
			logger.class.debug('Copying users from Slack channel to Rocket.Chat', channelMap.id, rid);                         // 937
			var response = HTTP.get("https://slack.com/api/" + channelMap.family + ".info", {                                  // 938
				params: {                                                                                                         // 938
					token: this.apiToken,                                                                                            // 938
					channel: channelMap.id                                                                                           // 938
				}                                                                                                                 // 938
			});                                                                                                                // 938
                                                                                                                      //
			if (response && response.data) {                                                                                   // 939
				var data = channelMap.family === 'channels' ? response.data.channel : response.data.group;                        // 940
                                                                                                                      //
				if (data && _.isArray(data.members) && data.members.length > 0) {                                                 // 941
					for (var _iterator5 = data.members, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
						var _ref5;                                                                                                      // 942
                                                                                                                      //
						if (_isArray5) {                                                                                                // 942
							if (_i5 >= _iterator5.length) break;                                                                           // 942
							_ref5 = _iterator5[_i5++];                                                                                     // 942
						} else {                                                                                                        // 942
							_i5 = _iterator5.next();                                                                                       // 942
							if (_i5.done) break;                                                                                           // 942
							_ref5 = _i5.value;                                                                                             // 942
						}                                                                                                               // 942
                                                                                                                      //
						var member = _ref5;                                                                                             // 942
						var user = this.findRocketUser(member) || this.addRocketUser(member);                                           // 943
                                                                                                                      //
						if (user) {                                                                                                     // 944
							logger.class.debug('Adding user to room', user.username, rid);                                                 // 945
							RocketChat.addUserToRoom(rid, user, null, true);                                                               // 946
						}                                                                                                               // 947
					}                                                                                                                // 948
				}                                                                                                                 // 949
                                                                                                                      //
				var topic = '';                                                                                                   // 951
				var topic_last_set = 0;                                                                                           // 952
				var topic_creator = null;                                                                                         // 953
                                                                                                                      //
				if (data && data.topic && data.topic.value) {                                                                     // 954
					topic = data.topic.value;                                                                                        // 955
					topic_last_set = data.topic.last_set;                                                                            // 956
					topic_creator = data.topic.creator;                                                                              // 957
				}                                                                                                                 // 958
                                                                                                                      //
				if (data && data.purpose && data.purpose.value) {                                                                 // 960
					if (topic_last_set) {                                                                                            // 961
						if (topic_last_set < data.purpose.last_set) {                                                                   // 962
							topic = data.purpose.topic;                                                                                    // 963
							topic_creator = data.purpose.creator;                                                                          // 964
						}                                                                                                               // 965
					} else {                                                                                                         // 966
						topic = data.purpose.topic;                                                                                     // 967
						topic_creator = data.purpose.creator;                                                                           // 968
					}                                                                                                                // 969
				}                                                                                                                 // 970
                                                                                                                      //
				if (topic) {                                                                                                      // 972
					var creator = this.findRocketUser(topic_creator) || this.addRocketUser(topic_creator);                           // 973
					logger.class.debug('Setting room topic', rid, topic, creator.username);                                          // 974
					RocketChat.saveRoomTopic(rid, topic, creator, false);                                                            // 975
				}                                                                                                                 // 976
			}                                                                                                                  // 977
		}                                                                                                                   // 978
                                                                                                                      //
		return copySlackChannelInfo;                                                                                        //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.copyPins = function () {                                                                       //
		function copyPins(rid, channelMap) {                                                                                //
			var response = HTTP.get('https://slack.com/api/pins.list', {                                                       // 981
				params: {                                                                                                         // 981
					token: this.apiToken,                                                                                            // 981
					channel: channelMap.id                                                                                           // 981
				}                                                                                                                 // 981
			});                                                                                                                // 981
                                                                                                                      //
			if (response && response.data && _.isArray(response.data.items) && response.data.items.length > 0) {               // 982
				for (var _iterator6 = response.data.items, _isArray6 = Array.isArray(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
					var _ref6;                                                                                                       // 983
                                                                                                                      //
					if (_isArray6) {                                                                                                 // 983
						if (_i6 >= _iterator6.length) break;                                                                            // 983
						_ref6 = _iterator6[_i6++];                                                                                      // 983
					} else {                                                                                                         // 983
						_i6 = _iterator6.next();                                                                                        // 983
						if (_i6.done) break;                                                                                            // 983
						_ref6 = _i6.value;                                                                                              // 983
					}                                                                                                                // 983
                                                                                                                      //
					var pin = _ref6;                                                                                                 // 983
                                                                                                                      //
					if (pin.message) {                                                                                               // 984
						var user = this.findRocketUser(pin.message.user);                                                               // 985
						var msgObj = {                                                                                                  // 986
							rid: rid,                                                                                                      // 987
							t: 'message_pinned',                                                                                           // 988
							msg: '',                                                                                                       // 989
							u: {                                                                                                           // 990
								_id: user._id,                                                                                                // 991
								username: user.username                                                                                       // 992
							},                                                                                                             // 990
							attachments: [{                                                                                                // 994
								'text': this.convertSlackMsgTxtToRocketTxtFormat(pin.message.text),                                           // 995
								'author_name': user.username,                                                                                 // 996
								'author_icon': getAvatarUrlFromUsername(user.username),                                                       // 997
								'ts': new Date(parseInt(pin.message.ts.split('.')[0]) * 1000)                                                 // 998
							}]                                                                                                             // 994
						};                                                                                                              // 986
						RocketChat.models.Messages.setPinnedByIdAndUserId("slack-" + pin.channel + "-" + pin.message.ts.replace(/\./g, '-'), msgObj.u, true, new Date(parseInt(pin.message.ts.split('.')[0]) * 1000));
					}                                                                                                                // 1003
				}                                                                                                                 // 1004
			}                                                                                                                  // 1005
		}                                                                                                                   // 1006
                                                                                                                      //
		return copyPins;                                                                                                    //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.importMessages = function () {                                                                 //
		function importMessages(rid, callback) {                                                                            //
			logger.class.info('importMessages: ', rid);                                                                        // 1009
			var rocketchat_room = RocketChat.models.Rooms.findOneById(rid);                                                    // 1010
                                                                                                                      //
			if (rocketchat_room) {                                                                                             // 1011
				if (this.slackChannelMap[rid]) {                                                                                  // 1012
					this.copySlackChannelInfo(rid, this.slackChannelMap[rid]);                                                       // 1013
					logger.class.debug('Importing messages from Slack to Rocket.Chat', this.slackChannelMap[rid], rid);              // 1015
					var results = this.importFromHistory(this.slackChannelMap[rid].family, {                                         // 1016
						channel: this.slackChannelMap[rid].id,                                                                          // 1016
						oldest: 1                                                                                                       // 1016
					});                                                                                                              // 1016
                                                                                                                      //
					while (results && results.has_more) {                                                                            // 1017
						results = this.importFromHistory(this.slackChannelMap[rid].family, {                                            // 1018
							channel: this.slackChannelMap[rid].id,                                                                         // 1018
							oldest: results.ts                                                                                             // 1018
						});                                                                                                             // 1018
					}                                                                                                                // 1019
                                                                                                                      //
					logger.class.debug('Pinning Slack channel messages to Rocket.Chat', this.slackChannelMap[rid], rid);             // 1021
					this.copyPins(rid, this.slackChannelMap[rid]);                                                                   // 1022
					return callback();                                                                                               // 1024
				} else {                                                                                                          // 1025
					var slack_room = this.findSlackChannel(rocketchat_room.name);                                                    // 1026
                                                                                                                      //
					if (slack_room) {                                                                                                // 1027
						this.slackChannelMap[rid] = {                                                                                   // 1028
							id: slack_room.id,                                                                                             // 1028
							family: slack_room.id.charAt(0) === 'C' ? 'channels' : 'groups'                                                // 1028
						};                                                                                                              // 1028
						return this.importMessages(rid, callback);                                                                      // 1029
					} else {                                                                                                         // 1030
						logger.class.error('Could not find Slack room with specified name', rocketchat_room.name);                      // 1031
						return callback(new Meteor.Error('error-slack-room-not-found', 'Could not find Slack room with specified name'));
					}                                                                                                                // 1033
				}                                                                                                                 // 1034
			} else {                                                                                                           // 1035
				logger.class.error('Could not find Rocket.Chat room with specified id', rid);                                     // 1036
				return callback(new Meteor.Error('error-invalid-room', 'Invalid room'));                                          // 1037
			}                                                                                                                  // 1038
		}                                                                                                                   // 1039
                                                                                                                      //
		return importMessages;                                                                                              //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.populateSlackChannelMap = function () {                                                        //
		function populateSlackChannelMap() {                                                                                //
			logger.class.debug('Populating channel map');                                                                      // 1042
			var response = HTTP.get('https://slack.com/api/channels.list', {                                                   // 1043
				params: {                                                                                                         // 1043
					token: this.apiToken                                                                                             // 1043
				}                                                                                                                 // 1043
			});                                                                                                                // 1043
                                                                                                                      //
			if (response && response.data && _.isArray(response.data.channels) && response.data.channels.length > 0) {         // 1044
				for (var _iterator7 = response.data.channels, _isArray7 = Array.isArray(_iterator7), _i7 = 0, _iterator7 = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator]();;) {
					var _ref7;                                                                                                       // 1045
                                                                                                                      //
					if (_isArray7) {                                                                                                 // 1045
						if (_i7 >= _iterator7.length) break;                                                                            // 1045
						_ref7 = _iterator7[_i7++];                                                                                      // 1045
					} else {                                                                                                         // 1045
						_i7 = _iterator7.next();                                                                                        // 1045
						if (_i7.done) break;                                                                                            // 1045
						_ref7 = _i7.value;                                                                                              // 1045
					}                                                                                                                // 1045
                                                                                                                      //
					var slackChannel = _ref7;                                                                                        // 1045
					var rocketchat_room = RocketChat.models.Rooms.findOneByName(slackChannel.name, {                                 // 1046
						fields: {                                                                                                       // 1046
							_id: 1                                                                                                         // 1046
						}                                                                                                               // 1046
					});                                                                                                              // 1046
                                                                                                                      //
					if (rocketchat_room) {                                                                                           // 1047
						this.slackChannelMap[rocketchat_room._id] = {                                                                   // 1048
							id: slackChannel.id,                                                                                           // 1048
							family: slackChannel.id.charAt(0) === 'C' ? 'channels' : 'groups'                                              // 1048
						};                                                                                                              // 1048
					}                                                                                                                // 1049
				}                                                                                                                 // 1050
			}                                                                                                                  // 1051
                                                                                                                      //
			response = HTTP.get('https://slack.com/api/groups.list', {                                                         // 1052
				params: {                                                                                                         // 1052
					token: this.apiToken                                                                                             // 1052
				}                                                                                                                 // 1052
			});                                                                                                                // 1052
                                                                                                                      //
			if (response && response.data && _.isArray(response.data.groups) && response.data.groups.length > 0) {             // 1053
				for (var _iterator8 = response.data.groups, _isArray8 = Array.isArray(_iterator8), _i8 = 0, _iterator8 = _isArray8 ? _iterator8 : _iterator8[Symbol.iterator]();;) {
					var _ref8;                                                                                                       // 1054
                                                                                                                      //
					if (_isArray8) {                                                                                                 // 1054
						if (_i8 >= _iterator8.length) break;                                                                            // 1054
						_ref8 = _iterator8[_i8++];                                                                                      // 1054
					} else {                                                                                                         // 1054
						_i8 = _iterator8.next();                                                                                        // 1054
						if (_i8.done) break;                                                                                            // 1054
						_ref8 = _i8.value;                                                                                              // 1054
					}                                                                                                                // 1054
                                                                                                                      //
					var slackGroup = _ref8;                                                                                          // 1054
                                                                                                                      //
					var _rocketchat_room = RocketChat.models.Rooms.findOneByName(slackGroup.name, {                                  // 1055
						fields: {                                                                                                       // 1055
							_id: 1                                                                                                         // 1055
						}                                                                                                               // 1055
					});                                                                                                              // 1055
                                                                                                                      //
					if (_rocketchat_room) {                                                                                          // 1056
						this.slackChannelMap[_rocketchat_room._id] = {                                                                  // 1057
							id: slackGroup.id,                                                                                             // 1057
							family: slackGroup.id.charAt(0) === 'C' ? 'channels' : 'groups'                                                // 1057
						};                                                                                                              // 1057
					}                                                                                                                // 1058
				}                                                                                                                 // 1059
			}                                                                                                                  // 1060
		}                                                                                                                   // 1061
                                                                                                                      //
		return populateSlackChannelMap;                                                                                     //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.onRocketMessageDelete = function () {                                                          //
		function onRocketMessageDelete(rocketMessageDeleted) {                                                              //
			logger.class.debug('onRocketMessageDelete', rocketMessageDeleted);                                                 // 1064
			this.postDeleteMessageToSlack(rocketMessageDeleted);                                                               // 1066
		}                                                                                                                   // 1067
                                                                                                                      //
		return onRocketMessageDelete;                                                                                       //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.onRocketSetReaction = function () {                                                            //
		function onRocketSetReaction(rocketMsgID, reaction) {                                                               //
			logger.class.debug('onRocketSetReaction');                                                                         // 1070
                                                                                                                      //
			if (rocketMsgID && reaction) {                                                                                     // 1072
				if (this.reactionsMap.delete("set" + rocketMsgID + reaction)) {                                                   // 1073
					//This was a Slack reaction, we don't need to tell Slack about it                                                // 1074
					return;                                                                                                          // 1075
				}                                                                                                                 // 1076
                                                                                                                      //
				var rocketMsg = RocketChat.models.Messages.findOneById(rocketMsgID);                                              // 1077
                                                                                                                      //
				if (rocketMsg) {                                                                                                  // 1078
					var slackChannel = this.slackChannelMap[rocketMsg.rid].id;                                                       // 1079
					var slackTS = this.getSlackTS(rocketMsg);                                                                        // 1080
					this.postReactionAddedToSlack(reaction.replace(/:/g, ''), slackChannel, slackTS);                                // 1081
				}                                                                                                                 // 1082
			}                                                                                                                  // 1083
		}                                                                                                                   // 1084
                                                                                                                      //
		return onRocketSetReaction;                                                                                         //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.onRocketUnSetReaction = function () {                                                          //
		function onRocketUnSetReaction(rocketMsgID, reaction) {                                                             //
			logger.class.debug('onRocketUnSetReaction');                                                                       // 1087
                                                                                                                      //
			if (rocketMsgID && reaction) {                                                                                     // 1089
				if (this.reactionsMap.delete("unset" + rocketMsgID + reaction)) {                                                 // 1090
					//This was a Slack unset reaction, we don't need to tell Slack about it                                          // 1091
					return;                                                                                                          // 1092
				}                                                                                                                 // 1093
                                                                                                                      //
				var rocketMsg = RocketChat.models.Messages.findOneById(rocketMsgID);                                              // 1095
                                                                                                                      //
				if (rocketMsg) {                                                                                                  // 1096
					var slackChannel = this.slackChannelMap[rocketMsg.rid].id;                                                       // 1097
					var slackTS = this.getSlackTS(rocketMsg);                                                                        // 1098
					this.postReactionRemoveToSlack(reaction.replace(/:/g, ''), slackChannel, slackTS);                               // 1099
				}                                                                                                                 // 1100
			}                                                                                                                  // 1101
		}                                                                                                                   // 1102
                                                                                                                      //
		return onRocketUnSetReaction;                                                                                       //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.onRocketMessage = function () {                                                                //
		function onRocketMessage(rocketMessage) {                                                                           //
			logger.class.debug('onRocketMessage', rocketMessage);                                                              // 1105
                                                                                                                      //
			if (rocketMessage.editedAt) {                                                                                      // 1107
				//This is an Edit Event                                                                                           // 1108
				this.processRocketMessageChanged(rocketMessage);                                                                  // 1109
				return rocketMessage;                                                                                             // 1110
			} // Ignore messages originating from Slack                                                                        // 1111
                                                                                                                      //
                                                                                                                      //
			if (rocketMessage._id.indexOf('slack-') === 0) {                                                                   // 1113
				return rocketMessage;                                                                                             // 1114
			} //Probably a new message from Rocket.Chat                                                                        // 1115
                                                                                                                      //
                                                                                                                      //
			var outSlackChannels = RocketChat.settings.get('SlackBridge_Out_All') ? _.keys(this.slackChannelMap) : _.pluck(RocketChat.settings.get('SlackBridge_Out_Channels'), '_id') || []; //logger.class.debug('Out SlackChannels: ', outSlackChannels);
                                                                                                                      //
			if (outSlackChannels.indexOf(rocketMessage.rid) !== -1) {                                                          // 1120
				this.postMessageToSlack(this.slackChannelMap[rocketMessage.rid], rocketMessage);                                  // 1121
			}                                                                                                                  // 1122
                                                                                                                      //
			return rocketMessage;                                                                                              // 1123
		}                                                                                                                   // 1124
                                                                                                                      //
		return onRocketMessage;                                                                                             //
	}(); /*                                                                                                              //
       https://api.slack.com/methods/reactions.add                                                                    //
       */                                                                                                             //
                                                                                                                      //
	SlackBridge.prototype.postReactionAddedToSlack = function () {                                                       //
		function postReactionAddedToSlack(reaction, slackChannel, slackTS) {                                                //
			if (reaction && slackChannel && slackTS) {                                                                         // 1130
				var data = {                                                                                                      // 1131
					token: this.apiToken,                                                                                            // 1132
					name: reaction,                                                                                                  // 1133
					channel: slackChannel,                                                                                           // 1134
					timestamp: slackTS                                                                                               // 1135
				};                                                                                                                // 1131
				logger.class.debug('Posting Add Reaction to Slack');                                                              // 1138
				var postResult = HTTP.post('https://slack.com/api/reactions.add', {                                               // 1139
					params: data                                                                                                     // 1139
				});                                                                                                               // 1139
                                                                                                                      //
				if (postResult.statusCode === 200 && postResult.data && postResult.data.ok === true) {                            // 1140
					logger.class.debug('Reaction added to Slack');                                                                   // 1141
				}                                                                                                                 // 1142
			}                                                                                                                  // 1143
		}                                                                                                                   // 1144
                                                                                                                      //
		return postReactionAddedToSlack;                                                                                    //
	}(); /*                                                                                                              //
       https://api.slack.com/methods/reactions.remove                                                                 //
       */                                                                                                             //
                                                                                                                      //
	SlackBridge.prototype.postReactionRemoveToSlack = function () {                                                      //
		function postReactionRemoveToSlack(reaction, slackChannel, slackTS) {                                               //
			if (reaction && slackChannel && slackTS) {                                                                         // 1150
				var data = {                                                                                                      // 1151
					token: this.apiToken,                                                                                            // 1152
					name: reaction,                                                                                                  // 1153
					channel: slackChannel,                                                                                           // 1154
					timestamp: slackTS                                                                                               // 1155
				};                                                                                                                // 1151
				logger.class.debug('Posting Remove Reaction to Slack');                                                           // 1158
				var postResult = HTTP.post('https://slack.com/api/reactions.remove', {                                            // 1159
					params: data                                                                                                     // 1159
				});                                                                                                               // 1159
                                                                                                                      //
				if (postResult.statusCode === 200 && postResult.data && postResult.data.ok === true) {                            // 1160
					logger.class.debug('Reaction removed from Slack');                                                               // 1161
				}                                                                                                                 // 1162
			}                                                                                                                  // 1163
		}                                                                                                                   // 1164
                                                                                                                      //
		return postReactionRemoveToSlack;                                                                                   //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.postDeleteMessageToSlack = function () {                                                       //
		function postDeleteMessageToSlack(rocketMessage) {                                                                  //
			if (rocketMessage) {                                                                                               // 1167
				var data = {                                                                                                      // 1168
					token: this.apiToken,                                                                                            // 1169
					ts: this.getSlackTS(rocketMessage),                                                                              // 1170
					channel: this.slackChannelMap[rocketMessage.rid].id,                                                             // 1171
					as_user: true                                                                                                    // 1172
				};                                                                                                                // 1168
				logger.class.debug('Post Delete Message to Slack', data);                                                         // 1175
				var postResult = HTTP.post('https://slack.com/api/chat.delete', {                                                 // 1176
					params: data                                                                                                     // 1176
				});                                                                                                               // 1176
                                                                                                                      //
				if (postResult.statusCode === 200 && postResult.data && postResult.data.ok === true) {                            // 1177
					logger.class.debug('Message deleted on Slack');                                                                  // 1178
				}                                                                                                                 // 1179
			}                                                                                                                  // 1180
		}                                                                                                                   // 1181
                                                                                                                      //
		return postDeleteMessageToSlack;                                                                                    //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.postMessageToSlack = function () {                                                             //
		function postMessageToSlack(slackChannel, rocketMessage) {                                                          //
			if (slackChannel && slackChannel.id) {                                                                             // 1184
				var iconUrl = getAvatarUrlFromUsername(rocketMessage.u && rocketMessage.u.username);                              // 1185
                                                                                                                      //
				if (iconUrl) {                                                                                                    // 1186
					iconUrl = Meteor.absoluteUrl().replace(/\/$/, '') + iconUrl;                                                     // 1187
				}                                                                                                                 // 1188
                                                                                                                      //
				var data = {                                                                                                      // 1189
					token: this.apiToken,                                                                                            // 1190
					text: rocketMessage.msg,                                                                                         // 1191
					channel: slackChannel.id,                                                                                        // 1192
					username: rocketMessage.u && rocketMessage.u.username,                                                           // 1193
					icon_url: iconUrl,                                                                                               // 1194
					link_names: 1                                                                                                    // 1195
				};                                                                                                                // 1189
				logger.class.debug('Post Message To Slack', data);                                                                // 1197
				var postResult = HTTP.post('https://slack.com/api/chat.postMessage', {                                            // 1198
					params: data                                                                                                     // 1198
				});                                                                                                               // 1198
                                                                                                                      //
				if (postResult.statusCode === 200 && postResult.data && postResult.data.message && postResult.data.message.bot_id && postResult.data.message.ts) {
					RocketChat.models.Messages.setSlackBotIdAndSlackTs(rocketMessage._id, postResult.data.message.bot_id, postResult.data.message.ts);
					logger.class.debug("RocketMsgID=" + rocketMessage._id + " SlackMsgID=" + postResult.data.message.ts + " SlackBotID=" + postResult.data.message.bot_id);
				}                                                                                                                 // 1202
			}                                                                                                                  // 1203
		}                                                                                                                   // 1204
                                                                                                                      //
		return postMessageToSlack;                                                                                          //
	}(); /*                                                                                                              //
       https://api.slack.com/methods/chat.update                                                                      //
       */                                                                                                             //
                                                                                                                      //
	SlackBridge.prototype.postMessageUpdateToSlack = function () {                                                       //
		function postMessageUpdateToSlack(slackChannel, rocketMessage) {                                                    //
			if (slackChannel && slackChannel.id) {                                                                             // 1210
				var data = {                                                                                                      // 1211
					token: this.apiToken,                                                                                            // 1212
					ts: this.getSlackTS(rocketMessage),                                                                              // 1213
					channel: slackChannel.id,                                                                                        // 1214
					text: rocketMessage.msg,                                                                                         // 1215
					as_user: true                                                                                                    // 1216
				};                                                                                                                // 1211
				logger.class.debug('Post UpdateMessage To Slack', data);                                                          // 1218
				var postResult = HTTP.post('https://slack.com/api/chat.update', {                                                 // 1219
					params: data                                                                                                     // 1219
				});                                                                                                               // 1219
                                                                                                                      //
				if (postResult.statusCode === 200 && postResult.data && postResult.data.ok === true) {                            // 1220
					logger.class.debug('Message updated on Slack');                                                                  // 1221
				}                                                                                                                 // 1222
			}                                                                                                                  // 1223
		}                                                                                                                   // 1224
                                                                                                                      //
		return postMessageUpdateToSlack;                                                                                    //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.processRocketMessageChanged = function () {                                                    //
		function processRocketMessageChanged(rocketMessage) {                                                               //
			if (rocketMessage) {                                                                                               // 1227
				if (rocketMessage.updatedBySlack) {                                                                               // 1228
					//We have already processed this                                                                                 // 1229
					delete rocketMessage.updatedBySlack;                                                                             // 1230
					return;                                                                                                          // 1231
				} //This was a change from Rocket.Chat                                                                            // 1232
                                                                                                                      //
                                                                                                                      //
				var slackChannel = this.slackChannelMap[rocketMessage.rid];                                                       // 1235
				this.postMessageUpdateToSlack(slackChannel, rocketMessage);                                                       // 1236
			}                                                                                                                  // 1237
		}                                                                                                                   // 1238
                                                                                                                      //
		return processRocketMessageChanged;                                                                                 //
	}(); /*                                                                                                              //
       https://api.slack.com/events/message/message_deleted                                                           //
       */                                                                                                             //
                                                                                                                      //
	SlackBridge.prototype.processSlackMessageDeleted = function () {                                                     //
		function processSlackMessageDeleted(slackMessage) {                                                                 //
			if (slackMessage.previous_message) {                                                                               // 1244
				var rocketChannel = this.getRocketChannel(slackMessage);                                                          // 1245
				var rocketUser = RocketChat.models.Users.findOneById('rocket.cat', {                                              // 1246
					fields: {                                                                                                        // 1246
						username: 1                                                                                                     // 1246
					}                                                                                                                // 1246
				});                                                                                                               // 1246
                                                                                                                      //
				if (rocketChannel && rocketUser) {                                                                                // 1248
					//Find the Rocket message to delete                                                                              // 1249
					var rocketMsgObj = RocketChat.models.Messages.findOneBySlackBotIdAndSlackTs(slackMessage.previous_message.bot_id, slackMessage.previous_message.ts);
                                                                                                                      //
					if (!rocketMsgObj) {                                                                                             // 1253
						//Must have been a Slack originated msg                                                                         // 1254
						var _id = this.createRocketID(slackMessage.channel, slackMessage.previous_message.ts);                          // 1255
                                                                                                                      //
						rocketMsgObj = RocketChat.models.Messages.findOneById(_id);                                                     // 1256
					}                                                                                                                // 1257
                                                                                                                      //
					if (rocketMsgObj) {                                                                                              // 1259
						RocketChat.deleteMessage(rocketMsgObj, rocketUser);                                                             // 1260
						logger.class.debug('Rocket message deleted by Slack');                                                          // 1261
					}                                                                                                                // 1262
				}                                                                                                                 // 1263
			}                                                                                                                  // 1264
		}                                                                                                                   // 1265
                                                                                                                      //
		return processSlackMessageDeleted;                                                                                  //
	}(); /*                                                                                                              //
       https://api.slack.com/events/message/message_changed                                                           //
       */                                                                                                             //
                                                                                                                      //
	SlackBridge.prototype.processSlackMessageChanged = function () {                                                     //
		function processSlackMessageChanged(slackMessage) {                                                                 //
			if (slackMessage.previous_message) {                                                                               // 1271
				var currentMsg = RocketChat.models.Messages.findOneById(this.createRocketID(slackMessage.channel, slackMessage.message.ts)); //Only process this change, if its an actual update (not just Slack repeating back our Rocket original change)
                                                                                                                      //
				if (currentMsg && slackMessage.message.text !== currentMsg.msg) {                                                 // 1275
					var rocketChannel = this.getRocketChannel(slackMessage);                                                         // 1276
					var rocketUser = slackMessage.previous_message.user ? this.findRocketUser(slackMessage.previous_message.user) || this.addRocketUser(slackMessage.previous_message.user) : null;
					var rocketMsgObj = {                                                                                             // 1279
						//@TODO _id                                                                                                     // 1280
						_id: this.createRocketID(slackMessage.channel, slackMessage.previous_message.ts),                               // 1281
						rid: rocketChannel._id,                                                                                         // 1282
						msg: this.convertSlackMsgTxtToRocketTxtFormat(slackMessage.message.text),                                       // 1283
						updatedBySlack: true //We don't want to notify slack about this change since Slack initiated it                 // 1284
                                                                                                                      //
					};                                                                                                               // 1279
					RocketChat.updateMessage(rocketMsgObj, rocketUser);                                                              // 1287
					logger.class.debug('Rocket message updated by Slack');                                                           // 1288
				}                                                                                                                 // 1289
			}                                                                                                                  // 1290
		}                                                                                                                   // 1291
                                                                                                                      //
		return processSlackMessageChanged;                                                                                  //
	}(); /*                                                                                                              //
       This method will get refactored and broken down into single responsibilities                                   //
       */                                                                                                             //
                                                                                                                      //
	SlackBridge.prototype.processSlackNewMessage = function () {                                                         //
		function processSlackNewMessage(slackMessage, isImporting) {                                                        //
			var rocketChannel = this.getRocketChannel(slackMessage);                                                           // 1297
			var rocketUser = null;                                                                                             // 1298
                                                                                                                      //
			if (slackMessage.subtype === 'bot_message') {                                                                      // 1299
				rocketUser = RocketChat.models.Users.findOneById('rocket.cat', {                                                  // 1300
					fields: {                                                                                                        // 1300
						username: 1                                                                                                     // 1300
					}                                                                                                                // 1300
				});                                                                                                               // 1300
			} else {                                                                                                           // 1301
				rocketUser = slackMessage.user ? this.findRocketUser(slackMessage.user) || this.addRocketUser(slackMessage.user) : null;
			}                                                                                                                  // 1303
                                                                                                                      //
			if (rocketChannel && rocketUser) {                                                                                 // 1304
				var msgDataDefaults = {                                                                                           // 1305
					_id: this.createRocketID(slackMessage.channel, slackMessage.ts),                                                 // 1306
					ts: new Date(parseInt(slackMessage.ts.split('.')[0]) * 1000)                                                     // 1307
				};                                                                                                                // 1305
                                                                                                                      //
				if (isImporting) {                                                                                                // 1309
					msgDataDefaults['imported'] = 'slackbridge';                                                                     // 1310
				}                                                                                                                 // 1311
                                                                                                                      //
				try {                                                                                                             // 1312
					this.createAndSaveRocketMessage(rocketChannel, rocketUser, slackMessage, msgDataDefaults, isImporting);          // 1313
				} catch (e) {                                                                                                     // 1314
					// http://www.mongodb.org/about/contributors/error-codes/                                                        // 1315
					// 11000 == duplicate key error                                                                                  // 1316
					if (e.name === 'MongoError' && e.code === 11000) {                                                               // 1317
						return;                                                                                                         // 1318
					}                                                                                                                // 1319
                                                                                                                      //
					throw e;                                                                                                         // 1321
				}                                                                                                                 // 1322
			}                                                                                                                  // 1323
		}                                                                                                                   // 1324
                                                                                                                      //
		return processSlackNewMessage;                                                                                      //
	}(); /**                                                                                                             //
       * Retrieves the Slack TS from a Rocket msg that originated from Slack                                          //
       * @param rocketMsg                                                                                             //
       * @returns Slack TS or undefined if not a message that originated from slack                                   //
       * @private                                                                                                     //
       */                                                                                                             //
                                                                                                                      //
	SlackBridge.prototype.getSlackTS = function () {                                                                     //
		function getSlackTS(rocketMsg) {                                                                                    //
			//slack-G3KJGGE15-1483081061-000169                                                                                // 1333
			var slackTS = void 0;                                                                                              // 1334
                                                                                                                      //
			var index = rocketMsg._id.indexOf('slack-');                                                                       // 1335
                                                                                                                      //
			if (index === 0) {                                                                                                 // 1336
				//This is a msg that originated from Slack                                                                        // 1337
				slackTS = rocketMsg._id.substr(6, rocketMsg._id.length);                                                          // 1338
				index = slackTS.indexOf('-');                                                                                     // 1339
				slackTS = slackTS.substr(index + 1, slackTS.length);                                                              // 1340
				slackTS = slackTS.replace('-', '.');                                                                              // 1341
			} else {                                                                                                           // 1342
				//This probably originated as a Rocket msg, but has been sent to Slack                                            // 1343
				slackTS = rocketMsg.slackTs;                                                                                      // 1344
			}                                                                                                                  // 1345
                                                                                                                      //
			return slackTS;                                                                                                    // 1347
		}                                                                                                                   // 1348
                                                                                                                      //
		return getSlackTS;                                                                                                  //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.getRocketChannel = function () {                                                               //
		function getRocketChannel(slackMessage) {                                                                           //
			return slackMessage.channel ? this.findRocketChannel(slackMessage.channel) || this.addRocketChannel(slackMessage.channel) : null;
		}                                                                                                                   // 1352
                                                                                                                      //
		return getRocketChannel;                                                                                            //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.getRocketUser = function () {                                                                  //
		function getRocketUser(slackUser) {                                                                                 //
			return slackUser ? this.findRocketUser(slackUser) || this.addRocketUser(slackUser) : null;                         // 1355
		}                                                                                                                   // 1356
                                                                                                                      //
		return getRocketUser;                                                                                               //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.createRocketID = function () {                                                                 //
		function createRocketID(slackChannel, ts) {                                                                         //
			return "slack-" + slackChannel + "-" + ts.replace(/\./g, '-');                                                     // 1359
		}                                                                                                                   // 1360
                                                                                                                      //
		return createRocketID;                                                                                              //
	}();                                                                                                                 //
                                                                                                                      //
	return SlackBridge;                                                                                                  //
}();                                                                                                                  //
                                                                                                                      //
RocketChat.SlackBridge = new SlackBridge();                                                                           // 1364
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"slashcommand":{"slackbridge_import.server.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_slackbridge/slashcommand/slackbridge_import.server.js                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* globals msgStream */function SlackBridgeImport(command, params, item) {                                            // 1
	if (command !== 'slackbridge-import' || !Match.test(params, String)) {                                               // 3
		return;                                                                                                             // 4
	}                                                                                                                    // 5
                                                                                                                      //
	var room = RocketChat.models.Rooms.findOneById(item.rid);                                                            // 7
	var channel = room.name;                                                                                             // 8
	var user = Meteor.users.findOne(Meteor.userId());                                                                    // 9
	msgStream.emit(item.rid, {                                                                                           // 11
		_id: Random.id(),                                                                                                   // 12
		rid: item.rid,                                                                                                      // 13
		u: {                                                                                                                // 14
			username: 'rocket.cat'                                                                                             // 14
		},                                                                                                                  // 14
		ts: new Date(),                                                                                                     // 15
		msg: TAPi18n.__('SlackBridge_start', {                                                                              // 16
			postProcess: 'sprintf',                                                                                            // 17
			sprintf: [user.username, channel]                                                                                  // 18
		}, user.language)                                                                                                   // 16
	});                                                                                                                  // 11
                                                                                                                      //
	try {                                                                                                                // 22
		RocketChat.SlackBridge.importMessages(item.rid, function (error) {                                                  // 23
			if (error) {                                                                                                       // 24
				msgStream.emit(item.rid, {                                                                                        // 25
					_id: Random.id(),                                                                                                // 26
					rid: item.rid,                                                                                                   // 27
					u: {                                                                                                             // 28
						username: 'rocket.cat'                                                                                          // 28
					},                                                                                                               // 28
					ts: new Date(),                                                                                                  // 29
					msg: TAPi18n.__('SlackBridge_error', {                                                                           // 30
						postProcess: 'sprintf',                                                                                         // 31
						sprintf: [channel, error.message]                                                                               // 32
					}, user.language)                                                                                                // 30
				});                                                                                                               // 25
			} else {                                                                                                           // 35
				msgStream.emit(item.rid, {                                                                                        // 36
					_id: Random.id(),                                                                                                // 37
					rid: item.rid,                                                                                                   // 38
					u: {                                                                                                             // 39
						username: 'rocket.cat'                                                                                          // 39
					},                                                                                                               // 39
					ts: new Date(),                                                                                                  // 40
					msg: TAPi18n.__('SlackBridge_finish', {                                                                          // 41
						postProcess: 'sprintf',                                                                                         // 42
						sprintf: [channel]                                                                                              // 43
					}, user.language)                                                                                                // 41
				});                                                                                                               // 36
			}                                                                                                                  // 46
		});                                                                                                                 // 47
	} catch (error) {                                                                                                    // 48
		msgStream.emit(item.rid, {                                                                                          // 49
			_id: Random.id(),                                                                                                  // 50
			rid: item.rid,                                                                                                     // 51
			u: {                                                                                                               // 52
				username: 'rocket.cat'                                                                                            // 52
			},                                                                                                                 // 52
			ts: new Date(),                                                                                                    // 53
			msg: TAPi18n.__('SlackBridge_error', {                                                                             // 54
				postProcess: 'sprintf',                                                                                           // 55
				sprintf: [channel, error.message]                                                                                 // 56
			}, user.language)                                                                                                  // 54
		});                                                                                                                 // 49
		throw error;                                                                                                        // 59
	}                                                                                                                    // 60
                                                                                                                      //
	return SlackBridgeImport;                                                                                            // 61
}                                                                                                                     // 62
                                                                                                                      //
RocketChat.slashCommands.add('slackbridge-import', SlackBridgeImport);                                                // 64
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:slackbridge/logger.js");
require("./node_modules/meteor/rocketchat:slackbridge/settings.js");
require("./node_modules/meteor/rocketchat:slackbridge/slackbridge.js");
require("./node_modules/meteor/rocketchat:slackbridge/slashcommand/slackbridge_import.server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:slackbridge'] = {};

})();

//# sourceMappingURL=rocketchat_slackbridge.js.map

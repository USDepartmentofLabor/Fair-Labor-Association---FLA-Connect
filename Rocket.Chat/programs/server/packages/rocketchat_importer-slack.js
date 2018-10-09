(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RocketChatTabBar = Package['rocketchat:lib'].RocketChatTabBar;
var Importer = Package['rocketchat:importer'].Importer;
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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:importer-slack":{"server.js":function(require){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/rocketchat_importer-slack/server.js                                                                 //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var _extends2 = require("babel-runtime/helpers/extends");                                                       //
                                                                                                                //
var _extends3 = _interopRequireDefault(_extends2);                                                              //
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
/* globals Importer */Importer.Slack = function (_Importer$Base) {                                              // 1
	(0, _inherits3.default)(_class, _Importer$Base);                                                               // 2
                                                                                                                //
	function _class(name, descriptionI18N, mimeType) {                                                             // 3
		(0, _classCallCheck3.default)(this, _class);                                                                  // 3
                                                                                                                //
		var _this = (0, _possibleConstructorReturn3.default)(this, _Importer$Base.call(this, name, descriptionI18N, mimeType));
                                                                                                                //
		_this.userTags = [];                                                                                          // 5
		_this.bots = {};                                                                                              // 6
                                                                                                                //
		_this.logger.debug('Constructed a new Slack Importer.');                                                      // 7
                                                                                                                //
		return _this;                                                                                                 // 3
	}                                                                                                              // 8
                                                                                                                //
	_class.prototype.prepare = function () {                                                                       // 2
		function prepare(dataURI, sentContentType, fileName) {                                                        // 2
			var _this2 = this;                                                                                           // 9
                                                                                                                //
			_Importer$Base.prototype.prepare.call(this, dataURI, sentContentType, fileName);                             // 10
                                                                                                                //
			var _RocketChatFile$dataU = RocketChatFile.dataURIParse(dataURI),                                            // 9
			    image = _RocketChatFile$dataU.image;                                                                     // 9
                                                                                                                //
			var zip = new this.AdmZip(new Buffer(image, 'base64'));                                                      // 12
			var zipEntries = zip.getEntries();                                                                           // 13
			var tempChannels = [];                                                                                       // 14
			var tempUsers = [];                                                                                          // 15
			var tempMessages = {};                                                                                       // 16
			zipEntries.forEach(function (entry) {                                                                        // 17
				if (entry.entryName.indexOf('__MACOSX') > -1) {                                                             // 18
					return _this2.logger.debug("Ignoring the file: " + entry.entryName);                                       // 19
				}                                                                                                           // 20
                                                                                                                //
				if (entry.entryName === 'channels.json') {                                                                  // 21
					_this2.updateProgress(Importer.ProgressStep.PREPARING_CHANNELS);                                           // 22
                                                                                                                //
					tempChannels = JSON.parse(entry.getData().toString()).filter(function (channel) {                          // 23
						return channel.creator != null;                                                                           // 23
					});                                                                                                        // 23
					return;                                                                                                    // 24
				}                                                                                                           // 25
                                                                                                                //
				if (entry.entryName === 'users.json') {                                                                     // 26
					_this2.updateProgress(Importer.ProgressStep.PREPARING_USERS);                                              // 27
                                                                                                                //
					tempUsers = JSON.parse(entry.getData().toString());                                                        // 28
					return tempUsers.forEach(function (user) {                                                                 // 29
						if (user.is_bot) {                                                                                        // 30
							_this2.bots[user.profile.bot_id] = user;                                                                 // 31
						}                                                                                                         // 32
					});                                                                                                        // 33
				}                                                                                                           // 34
                                                                                                                //
				if (!entry.isDirectory && entry.entryName.indexOf('/') > -1) {                                              // 35
					var item = entry.entryName.split('/');                                                                     // 36
					var channelName = item[0];                                                                                 // 37
					var msgGroupData = item[1].split('.')[0];                                                                  // 38
					tempMessages[channelName] = tempMessages[channelName] || {};                                               // 39
                                                                                                                //
					try {                                                                                                      // 40
						tempMessages[channelName][msgGroupData] = JSON.parse(entry.getData().toString());                         // 41
					} catch (error) {                                                                                          // 42
						_this2.logger.warn(entry.entryName + " is not a valid JSON file! Unable to import it.");                  // 43
					}                                                                                                          // 44
				}                                                                                                           // 45
			}); // Insert the users record, eventually this might have to be split into several ones as well             // 46
			// if someone tries to import a several thousands users instance                                             // 49
                                                                                                                //
			var usersId = this.collection.insert({                                                                       // 50
				'import': this.importRecord._id,                                                                            // 50
				'importer': this.name,                                                                                      // 50
				'type': 'users',                                                                                            // 50
				'users': tempUsers                                                                                          // 50
			});                                                                                                          // 50
			this.users = this.collection.findOne(usersId);                                                               // 51
			this.updateRecord({                                                                                          // 52
				'count.users': tempUsers.length                                                                             // 52
			});                                                                                                          // 52
			this.addCountToTotal(tempUsers.length); // Insert the channels records.                                      // 53
                                                                                                                //
			var channelsId = this.collection.insert({                                                                    // 56
				'import': this.importRecord._id,                                                                            // 56
				'importer': this.name,                                                                                      // 56
				'type': 'channels',                                                                                         // 56
				'channels': tempChannels                                                                                    // 56
			});                                                                                                          // 56
			this.channels = this.collection.findOne(channelsId);                                                         // 57
			this.updateRecord({                                                                                          // 58
				'count.channels': tempChannels.length                                                                       // 58
			});                                                                                                          // 58
			this.addCountToTotal(tempChannels.length); // Insert the messages records                                    // 59
                                                                                                                //
			this.updateProgress(Importer.ProgressStep.PREPARING_MESSAGES);                                               // 62
			var messagesCount = 0;                                                                                       // 64
			Object.keys(tempMessages).forEach(function (channel) {                                                       // 65
				var messagesObj = tempMessages[channel];                                                                    // 66
				_this2.messages[channel] = _this2.messages[channel] || {};                                                  // 67
				Object.keys(messagesObj).forEach(function (date) {                                                          // 68
					var msgs = messagesObj[date];                                                                              // 69
					messagesCount += msgs.length;                                                                              // 70
                                                                                                                //
					_this2.updateRecord({                                                                                      // 71
						'messagesstatus': '#{channel}/#{date}'                                                                    // 71
					});                                                                                                        // 71
                                                                                                                //
					if (Importer.Base.getBSONSize(msgs) > Importer.Base.MaxBSONSize) {                                         // 72
						var tmp = Importer.Base.getBSONSafeArraysFromAnArray(msgs);                                               // 73
						Object.keys(tmp).forEach(function (i) {                                                                   // 74
							var splitMsg = tmp[i];                                                                                   // 75
                                                                                                                //
							var messagesId = _this2.collection.insert({                                                              // 76
								'import': _this2.importRecord._id,                                                                      // 76
								'importer': _this2.name,                                                                                // 76
								'type': 'messages',                                                                                     // 76
								'name': channel + "/" + date + "." + i,                                                                 // 76
								'messages': splitMsg                                                                                    // 76
							});                                                                                                      // 76
                                                                                                                //
							_this2.messages[channel][date + "." + i] = _this2.collection.findOne(messagesId);                        // 77
						});                                                                                                       // 78
					} else {                                                                                                   // 79
						var messagesId = _this2.collection.insert({                                                               // 80
							'import': _this2.importRecord._id,                                                                       // 80
							'importer': _this2.name,                                                                                 // 80
							'type': 'messages',                                                                                      // 80
							'name': channel + "/" + date,                                                                            // 80
							'messages': msgs                                                                                         // 80
						});                                                                                                       // 80
                                                                                                                //
						_this2.messages[channel][date] = _this2.collection.findOne(messagesId);                                   // 81
					}                                                                                                          // 82
				});                                                                                                         // 83
			});                                                                                                          // 84
			this.updateRecord({                                                                                          // 85
				'count.messages': messagesCount,                                                                            // 85
				'messagesstatus': null                                                                                      // 85
			});                                                                                                          // 85
			this.addCountToTotal(messagesCount);                                                                         // 86
                                                                                                                //
			if ([tempUsers.length, tempChannels.length, messagesCount].some(function (e) {                               // 87
				return e === 0;                                                                                             // 87
			})) {                                                                                                        // 87
				this.logger.warn("The loaded users count " + tempUsers.length + ", the loaded channels " + tempChannels.length + ", and the loaded messages " + messagesCount);
				console.log("The loaded users count " + tempUsers.length + ", the loaded channels " + tempChannels.length + ", and the loaded messages " + messagesCount);
				this.updateProgress(Importer.ProgressStep.ERROR);                                                           // 90
				return this.getProgress();                                                                                  // 91
			}                                                                                                            // 92
                                                                                                                //
			var selectionUsers = tempUsers.map(function (user) {                                                         // 93
				return new Importer.SelectionUser(user.id, user.name, user.profile.email, user.deleted, user.is_bot, !user.is_bot);
			});                                                                                                          // 93
			var selectionChannels = tempChannels.map(function (channel) {                                                // 94
				return new Importer.SelectionChannel(channel.id, channel.name, channel.is_archived, true, false);           // 94
			});                                                                                                          // 94
			var selectionMessages = this.importRecord.count.messages;                                                    // 95
			this.updateProgress(Importer.ProgressStep.USER_SELECTION);                                                   // 96
			return new Importer.Selection(this.name, selectionUsers, selectionChannels, selectionMessages);              // 97
		}                                                                                                             // 98
                                                                                                                //
		return prepare;                                                                                               // 2
	}();                                                                                                           // 2
                                                                                                                //
	_class.prototype.startImport = function () {                                                                   // 2
		function startImport(importSelection) {                                                                       // 2
			var _this3 = this;                                                                                           // 99
                                                                                                                //
			_Importer$Base.prototype.startImport.call(this, importSelection);                                            // 100
                                                                                                                //
			var start = Date.now();                                                                                      // 101
			Object.keys(importSelection.users).forEach(function (key) {                                                  // 102
				var user = importSelection.users[key];                                                                      // 103
				Object.keys(_this3.users.users).forEach(function (k) {                                                      // 104
					var u = _this3.users.users[k];                                                                             // 105
                                                                                                                //
					if (u.id === user.user_id) {                                                                               // 106
						u.do_import = user.do_import;                                                                             // 107
					}                                                                                                          // 108
				});                                                                                                         // 109
			});                                                                                                          // 110
			this.collection.update({                                                                                     // 111
				_id: this.users._id                                                                                         // 111
			}, {                                                                                                         // 111
				$set: {                                                                                                     // 111
					'users': this.users.users                                                                                  // 111
				}                                                                                                           // 111
			});                                                                                                          // 111
			Object.keys(importSelection.channels).forEach(function (key) {                                               // 112
				var channel = importSelection.channels[key];                                                                // 113
				Object.keys(_this3.channels.channels).forEach(function (k) {                                                // 114
					var c = _this3.channels.channels[k];                                                                       // 115
                                                                                                                //
					if (c.id === channel.channel_id) {                                                                         // 116
						c.do_import = channel.do_import;                                                                          // 117
					}                                                                                                          // 118
				});                                                                                                         // 119
			});                                                                                                          // 120
			this.collection.update({                                                                                     // 121
				_id: this.channels._id                                                                                      // 121
			}, {                                                                                                         // 121
				$set: {                                                                                                     // 121
					'channels': this.channels.channels                                                                         // 121
				}                                                                                                           // 121
			});                                                                                                          // 121
			var startedByUserId = Meteor.userId();                                                                       // 122
			Meteor.defer(function () {                                                                                   // 123
				_this3.updateProgress(Importer.ProgressStep.IMPORTING_USERS);                                               // 124
                                                                                                                //
				_this3.users.users.forEach(function (user) {                                                                // 125
					if (!user.do_import) {                                                                                     // 126
						return;                                                                                                   // 127
					}                                                                                                          // 128
                                                                                                                //
					Meteor.runAsUser(startedByUserId, function () {                                                            // 129
						var existantUser = RocketChat.models.Users.findOneByEmailAddress(user.profile.email) || RocketChat.models.Users.findOneByUsername(user.name);
                                                                                                                //
						if (existantUser) {                                                                                       // 131
							user.rocketId = existantUser._id;                                                                        // 132
							RocketChat.models.Users.update({                                                                         // 133
								_id: user.rocketId                                                                                      // 133
							}, {                                                                                                     // 133
								$addToSet: {                                                                                            // 133
									importIds: user.id                                                                                     // 133
								}                                                                                                       // 133
							});                                                                                                      // 133
                                                                                                                //
							_this3.userTags.push({                                                                                   // 134
								slack: "<@" + user.id + ">",                                                                            // 135
								slackLong: "<@" + user.id + "|" + user.name + ">",                                                      // 136
								rocket: "@" + existantUser.username                                                                     // 137
							});                                                                                                      // 134
						} else {                                                                                                  // 139
							var userId = user.profile.email ? Accounts.createUser({                                                  // 140
								email: user.profile.email,                                                                              // 140
								password: Date.now() + user.name + user.profile.email.toUpperCase()                                     // 140
							}) : Accounts.createUser({                                                                               // 140
								username: user.name,                                                                                    // 140
								password: Date.now() + user.name,                                                                       // 140
								joinDefaultChannelsSilenced: true                                                                       // 140
							});                                                                                                      // 140
							Meteor.runAsUser(userId, function () {                                                                   // 141
								Meteor.call('setUsername', user.name, {                                                                 // 142
									joinDefaultChannelsSilenced: true                                                                      // 142
								});                                                                                                     // 142
								var url = user.profile.image_original || user.profile.image_512;                                        // 143
                                                                                                                //
								try {                                                                                                   // 144
									Meteor.call('setAvatarFromService', url, undefined, 'url');                                            // 145
								} catch (error) {                                                                                       // 146
									_this3.logger.warn("Failed to set " + user.name + "'s avatar from url " + url);                        // 147
                                                                                                                //
									console.log("Failed to set " + user.name + "'s avatar from url " + url);                               // 148
								} // Slack's is -18000 which translates to Rocket.Chat's after dividing by 3600                         // 149
                                                                                                                //
                                                                                                                //
								if (user.tz_offset) {                                                                                   // 151
									Meteor.call('userSetUtcOffset', user.tz_offset / 3600);                                                // 152
								}                                                                                                       // 153
							});                                                                                                      // 154
							RocketChat.models.Users.update({                                                                         // 156
								_id: userId                                                                                             // 156
							}, {                                                                                                     // 156
								$addToSet: {                                                                                            // 156
									importIds: user.id                                                                                     // 156
								}                                                                                                       // 156
							});                                                                                                      // 156
                                                                                                                //
							if (user.profile.real_name) {                                                                            // 158
								RocketChat.models.Users.setName(userId, user.profile.real_name);                                        // 159
							} //Deleted users are 'inactive' users in Rocket.Chat                                                    // 160
                                                                                                                //
                                                                                                                //
							if (user.deleted) {                                                                                      // 162
								Meteor.call('setUserActiveStatus', userId, false);                                                      // 163
							} //TODO: Maybe send emails?                                                                             // 164
                                                                                                                //
                                                                                                                //
							user.rocketId = userId;                                                                                  // 166
                                                                                                                //
							_this3.userTags.push({                                                                                   // 167
								slack: "<@" + user.id + ">",                                                                            // 168
								slackLong: "<@" + user.id + "|" + user.name + ">",                                                      // 169
								rocket: "@" + user.name                                                                                 // 170
							});                                                                                                      // 167
						}                                                                                                         // 173
                                                                                                                //
						_this3.addCountCompleted(1);                                                                              // 174
					});                                                                                                        // 175
				});                                                                                                         // 176
                                                                                                                //
				_this3.collection.update({                                                                                  // 177
					_id: _this3.users._id                                                                                      // 177
				}, {                                                                                                        // 177
					$set: {                                                                                                    // 177
						'users': _this3.users.users                                                                               // 177
					}                                                                                                          // 177
				});                                                                                                         // 177
                                                                                                                //
				_this3.updateProgress(Importer.ProgressStep.IMPORTING_CHANNELS);                                            // 178
                                                                                                                //
				_this3.channels.channels.forEach(function (channel) {                                                       // 179
					if (!channel.do_import) {                                                                                  // 180
						return;                                                                                                   // 181
					}                                                                                                          // 182
                                                                                                                //
					Meteor.runAsUser(startedByUserId, function () {                                                            // 183
						var existantRoom = RocketChat.models.Rooms.findOneByName(channel.name);                                   // 184
                                                                                                                //
						if (existantRoom || channel.is_general) {                                                                 // 185
							if (channel.is_general && existantRoom && channel.name !== existantRoom.name) {                          // 186
								Meteor.call('saveRoomSettings', 'GENERAL', 'roomName', channel.name);                                   // 187
							}                                                                                                        // 188
                                                                                                                //
							channel.rocketId = channel.is_general ? 'GENERAL' : existantRoom._id;                                    // 189
							RocketChat.models.Rooms.update({                                                                         // 190
								_id: channel.rocketId                                                                                   // 190
							}, {                                                                                                     // 190
								$addToSet: {                                                                                            // 190
									importIds: channel.id                                                                                  // 190
								}                                                                                                       // 190
							});                                                                                                      // 190
						} else {                                                                                                  // 191
							var users = channel.members.reduce(function (ret, member) {                                              // 192
								if (member !== channel.creator) {                                                                       // 194
									var user = _this3.getRocketUser(member);                                                               // 195
                                                                                                                //
									if (user && user.username) {                                                                           // 196
										ret.push(user.username);                                                                              // 197
									}                                                                                                      // 198
								}                                                                                                       // 199
                                                                                                                //
								return ret;                                                                                             // 200
							}, []);                                                                                                  // 201
							var userId = startedByUserId;                                                                            // 202
                                                                                                                //
							_this3.users.users.forEach(function (user) {                                                             // 203
								if (user.id === channel.creator && user.do_import) {                                                    // 204
									userId = user.rocketId;                                                                                // 205
								}                                                                                                       // 206
							});                                                                                                      // 207
                                                                                                                //
							Meteor.runAsUser(userId, function () {                                                                   // 208
								var returned = Meteor.call('createChannel', channel.name, users);                                       // 209
								channel.rocketId = returned.rid;                                                                        // 210
							}); // @TODO implement model specific function                                                           // 211
                                                                                                                //
							var roomUpdate = {                                                                                       // 214
								ts: new Date(channel.created * 1000)                                                                    // 215
							};                                                                                                       // 214
                                                                                                                //
							if (!_.isEmpty(channel.topic && channel.topic.value)) {                                                  // 217
								roomUpdate.topic = channel.topic.value;                                                                 // 218
							}                                                                                                        // 219
                                                                                                                //
							if (!_.isEmpty(channel.purpose && channel.purpose.value)) {                                              // 220
								roomUpdate.description = channel.purpose.value;                                                         // 221
							}                                                                                                        // 222
                                                                                                                //
							RocketChat.models.Rooms.update({                                                                         // 223
								_id: channel.rocketId                                                                                   // 223
							}, {                                                                                                     // 223
								$set: roomUpdate,                                                                                       // 223
								$addToSet: {                                                                                            // 223
									importIds: channel.id                                                                                  // 223
								}                                                                                                       // 223
							});                                                                                                      // 223
						}                                                                                                         // 224
                                                                                                                //
						_this3.addCountCompleted(1);                                                                              // 225
					});                                                                                                        // 226
				});                                                                                                         // 227
                                                                                                                //
				_this3.collection.update({                                                                                  // 228
					_id: _this3.channels._id                                                                                   // 228
				}, {                                                                                                        // 228
					$set: {                                                                                                    // 228
						'channels': _this3.channels.channels                                                                      // 228
					}                                                                                                          // 228
				});                                                                                                         // 228
                                                                                                                //
				var missedTypes = {};                                                                                       // 229
				var ignoreTypes = {                                                                                         // 230
					'bot_add': true,                                                                                           // 230
					'file_comment': true,                                                                                      // 230
					'file_mention': true                                                                                       // 230
				};                                                                                                          // 230
                                                                                                                //
				_this3.updateProgress(Importer.ProgressStep.IMPORTING_MESSAGES);                                            // 231
                                                                                                                //
				Object.keys(_this3.messages).forEach(function (channel) {                                                   // 232
					var messagesObj = _this3.messages[channel];                                                                // 233
					Meteor.runAsUser(startedByUserId, function () {                                                            // 235
						var slackChannel = _this3.getSlackChannelFromName(channel);                                               // 236
                                                                                                                //
						if (!slackChannel || !slackChannel.do_import) {                                                           // 237
							return;                                                                                                  // 237
						}                                                                                                         // 237
                                                                                                                //
						var room = RocketChat.models.Rooms.findOneById(slackChannel.rocketId, {                                   // 238
							fields: {                                                                                                // 238
								usernames: 1,                                                                                           // 238
								t: 1,                                                                                                   // 238
								name: 1                                                                                                 // 238
							}                                                                                                        // 238
						});                                                                                                       // 238
						Object.keys(messagesObj).forEach(function (date) {                                                        // 239
							var msgs = messagesObj[date];                                                                            // 240
							msgs.messages.forEach(function (message) {                                                               // 241
								_this3.updateRecord({                                                                                   // 242
									'messagesstatus': '#{channel}/#{date}.#{msgs.messages.length}'                                         // 242
								});                                                                                                     // 242
                                                                                                                //
								var msgDataDefaults = {                                                                                 // 243
									_id: "slack-" + slackChannel.id + "-" + message.ts.replace(/\./g, '-'),                                // 244
									ts: new Date(parseInt(message.ts.split('.')[0]) * 1000)                                                // 245
								};                                                                                                      // 243
                                                                                                                //
								if (message.type === 'message') {                                                                       // 247
									if (message.subtype) {                                                                                 // 248
										if (message.subtype === 'channel_join') {                                                             // 249
											if (_this3.getRocketUser(message.user)) {                                                            // 250
												RocketChat.models.Messages.createUserJoinWithRoomIdAndUser(room._id, _this3.getRocketUser(message.user), msgDataDefaults);
											}                                                                                                    // 252
										} else if (message.subtype === 'channel_leave') {                                                     // 253
											if (_this3.getRocketUser(message.user)) {                                                            // 254
												RocketChat.models.Messages.createUserLeaveWithRoomIdAndUser(room._id, _this3.getRocketUser(message.user), msgDataDefaults);
											}                                                                                                    // 256
										} else if (message.subtype === 'me_message') {                                                        // 257
											var msgObj = (0, _extends3.default)({}, msgDataDefaults, {                                           // 258
												msg: "_" + _this3.convertSlackMessageToRocketChat(message.text) + "_"                               // 260
											});                                                                                                  // 258
											RocketChat.sendMessage(_this3.getRocketUser(message.user), msgObj, room, true);                      // 262
										} else if (message.subtype === 'bot_message' || message.subtype === 'slackbot_response') {            // 263
											var botUser = RocketChat.models.Users.findOneById('rocket.cat', {                                    // 264
												fields: {                                                                                           // 264
													username: 1                                                                                        // 264
												}                                                                                                   // 264
											});                                                                                                  // 264
											var botUsername = _this3.bots[message.bot_id] ? _this3.bots[message.bot_id].name : message.username;
                                                                                                                //
											var _msgObj = (0, _extends3.default)({}, msgDataDefaults, {                                          // 266
												msg: _this3.convertSlackMessageToRocketChat(message.text),                                          // 268
												rid: room._id,                                                                                      // 269
												bot: true,                                                                                          // 270
												attachments: message.attachments,                                                                   // 271
												username: botUsername || undefined                                                                  // 272
											});                                                                                                  // 266
                                                                                                                //
											if (message.edited) {                                                                                // 275
												_msgObj.editedAt = new Date(parseInt(message.edited.ts.split('.')[0]) * 1000);                      // 276
                                                                                                                //
												var editedBy = _this3.getRocketUser(message.edited.user);                                           // 277
                                                                                                                //
												if (editedBy) {                                                                                     // 278
													_msgObj.editedBy = {                                                                               // 279
														_id: editedBy._id,                                                                                // 280
														username: editedBy.username                                                                       // 281
													};                                                                                                 // 279
												}                                                                                                   // 283
											}                                                                                                    // 284
                                                                                                                //
											if (message.icons) {                                                                                 // 286
												_msgObj.emoji = message.icons.emoji;                                                                // 287
											}                                                                                                    // 288
                                                                                                                //
											RocketChat.sendMessage(botUser, _msgObj, room, true);                                                // 289
										} else if (message.subtype === 'channel_purpose') {                                                   // 290
											if (_this3.getRocketUser(message.user)) {                                                            // 291
												RocketChat.models.Messages.createRoomSettingsChangedWithTypeRoomIdMessageAndUser('room_changed_description', room._id, message.purpose, _this3.getRocketUser(message.user), msgDataDefaults);
											}                                                                                                    // 293
										} else if (message.subtype === 'channel_topic') {                                                     // 294
											if (_this3.getRocketUser(message.user)) {                                                            // 295
												RocketChat.models.Messages.createRoomSettingsChangedWithTypeRoomIdMessageAndUser('room_changed_topic', room._id, message.topic, _this3.getRocketUser(message.user), msgDataDefaults);
											}                                                                                                    // 297
										} else if (message.subtype === 'channel_name') {                                                      // 298
											if (_this3.getRocketUser(message.user)) {                                                            // 299
												RocketChat.models.Messages.createRoomRenamedWithRoomIdRoomNameAndUser(room._id, message.name, _this3.getRocketUser(message.user), msgDataDefaults);
											}                                                                                                    // 301
										} else if (message.subtype === 'pinned_item') {                                                       // 302
											if (message.attachments) {                                                                           // 303
												var _msgObj2 = (0, _extends3.default)({}, msgDataDefaults, {                                        // 304
													attachments: [{                                                                                    // 306
														'text': _this3.convertSlackMessageToRocketChat(message.attachments[0].text),                      // 307
														'author_name': message.attachments[0].author_subname,                                             // 308
														'author_icon': getAvatarUrlFromUsername(message.attachments[0].author_subname)                    // 309
													}]                                                                                                 // 306
												});                                                                                                 // 304
                                                                                                                //
												RocketChat.models.Messages.createWithTypeRoomIdMessageAndUser('message_pinned', room._id, '', _this3.getRocketUser(message.user), _msgObj2);
											} else {                                                                                             // 313
												//TODO: make this better                                                                            // 314
												_this3.logger.debug('Pinned item with no attachment, needs work.'); //RocketChat.models.Messages.createWithTypeRoomIdMessageAndUser 'message_pinned', room._id, '', @getRocketUser(message.user), msgDataDefaults
                                                                                                                //
											}                                                                                                    // 317
										} else if (message.subtype === 'file_share') {                                                        // 318
											if (message.file && message.file.url_private_download !== undefined) {                               // 319
												var details = {                                                                                     // 320
													message_id: "slack-" + message.ts.replace(/\./g, '-'),                                             // 321
													name: message.file.name,                                                                           // 322
													size: message.file.size,                                                                           // 323
													type: message.file.mimetype,                                                                       // 324
													rid: room._id                                                                                      // 325
												};                                                                                                  // 320
                                                                                                                //
												_this3.uploadFile(details, message.file.url_private_download, _this3.getRocketUser(message.user), room, new Date(parseInt(message.ts.split('.')[0]) * 1000));
											}                                                                                                    // 328
										} else if (!missedTypes[message.subtype] && !ignoreTypes[message.subtype]) {                          // 329
											missedTypes[message.subtype] = message;                                                              // 330
										}                                                                                                     // 331
									} else {                                                                                               // 332
										var user = _this3.getRocketUser(message.user);                                                        // 333
                                                                                                                //
										if (user) {                                                                                           // 334
											var _msgObj3 = (0, _extends3.default)({}, msgDataDefaults, {                                         // 335
												msg: _this3.convertSlackMessageToRocketChat(message.text),                                          // 337
												rid: room._id,                                                                                      // 338
												u: {                                                                                                // 339
													_id: user._id,                                                                                     // 340
													username: user.username                                                                            // 341
												}                                                                                                   // 339
											});                                                                                                  // 335
                                                                                                                //
											if (message.edited) {                                                                                // 345
												_msgObj3.editedAt = new Date(parseInt(message.edited.ts.split('.')[0]) * 1000);                     // 346
                                                                                                                //
												var _editedBy = _this3.getRocketUser(message.edited.user);                                          // 347
                                                                                                                //
												if (_editedBy) {                                                                                    // 348
													_msgObj3.editedBy = {                                                                              // 349
														_id: _editedBy._id,                                                                               // 350
														username: _editedBy.username                                                                      // 351
													};                                                                                                 // 349
												}                                                                                                   // 353
											}                                                                                                    // 354
                                                                                                                //
											RocketChat.sendMessage(_this3.getRocketUser(message.user), _msgObj3, room, true);                    // 356
										}                                                                                                     // 357
									}                                                                                                      // 358
								} // Process the reactions                                                                              // 359
                                                                                                                //
                                                                                                                //
								if (RocketChat.models.Messages.findOneById(msgDataDefaults._id) && message.reactions && message.reactions.length > 0) {
									message.reactions.forEach(function (reaction) {                                                        // 364
										reaction.users.forEach(function (u) {                                                                 // 365
											var rcUser = _this3.getRocketUser(u);                                                                // 366
                                                                                                                //
											if (!rcUser) {                                                                                       // 367
												return;                                                                                             // 367
											}                                                                                                    // 367
                                                                                                                //
											Meteor.runAsUser(rcUser._id, function () {                                                           // 368
												return Meteor.call('setReaction', ":" + reaction.name + ":", msgDataDefaults._id);                  // 368
											});                                                                                                  // 368
										});                                                                                                   // 369
									});                                                                                                    // 370
								}                                                                                                       // 371
                                                                                                                //
								_this3.addCountCompleted(1);                                                                            // 372
							});                                                                                                      // 373
						});                                                                                                       // 374
					});                                                                                                        // 375
				});                                                                                                         // 376
                                                                                                                //
				if (!_.isEmpty(missedTypes)) {                                                                              // 379
					console.log('Missed import types:', missedTypes);                                                          // 380
				}                                                                                                           // 381
                                                                                                                //
				_this3.updateProgress(Importer.ProgressStep.FINISHING);                                                     // 383
                                                                                                                //
				_this3.channels.channels.forEach(function (channel) {                                                       // 385
					if (channel.do_import && channel.is_archived) {                                                            // 386
						Meteor.runAsUser(startedByUserId, function () {                                                           // 387
							Meteor.call('archiveRoom', channel.rocketId);                                                            // 388
						});                                                                                                       // 389
					}                                                                                                          // 390
				});                                                                                                         // 391
                                                                                                                //
				_this3.updateProgress(Importer.ProgressStep.DONE);                                                          // 392
                                                                                                                //
				var timeTook = Date.now() - start;                                                                          // 394
                                                                                                                //
				_this3.logger.log("Import took " + timeTook + " milliseconds.");                                            // 396
			});                                                                                                          // 398
			return this.getProgress();                                                                                   // 399
		}                                                                                                             // 400
                                                                                                                //
		return startImport;                                                                                           // 2
	}();                                                                                                           // 2
                                                                                                                //
	_class.prototype.getSlackChannelFromName = function () {                                                       // 2
		function getSlackChannelFromName(channelName) {                                                               // 2
			return this.channels.channels.find(function (channel) {                                                      // 402
				return channel.name === channelName;                                                                        // 402
			});                                                                                                          // 402
		}                                                                                                             // 403
                                                                                                                //
		return getSlackChannelFromName;                                                                               // 2
	}();                                                                                                           // 2
                                                                                                                //
	_class.prototype.getRocketUser = function () {                                                                 // 2
		function getRocketUser(slackId) {                                                                             // 2
			var user = this.users.users.find(function (user) {                                                           // 405
				return user.id === slackId;                                                                                 // 405
			});                                                                                                          // 405
                                                                                                                //
			if (user) {                                                                                                  // 406
				return RocketChat.models.Users.findOneById(user.rocketId, {                                                 // 407
					fields: {                                                                                                  // 407
						username: 1,                                                                                              // 407
						name: 1                                                                                                   // 407
					}                                                                                                          // 407
				});                                                                                                         // 407
			}                                                                                                            // 408
		}                                                                                                             // 409
                                                                                                                //
		return getRocketUser;                                                                                         // 2
	}();                                                                                                           // 2
                                                                                                                //
	_class.prototype.convertSlackMessageToRocketChat = function () {                                               // 2
		function convertSlackMessageToRocketChat(message) {                                                           // 2
			if (message != null) {                                                                                       // 411
				message = message.replace(/<!everyone>/g, '@all');                                                          // 412
				message = message.replace(/<!channel>/g, '@all');                                                           // 413
				message = message.replace(/<!here>/g, '@here');                                                             // 414
				message = message.replace(/&gt;/g, '>');                                                                    // 415
				message = message.replace(/&lt;/g, '<');                                                                    // 416
				message = message.replace(/&amp;/g, '&');                                                                   // 417
				message = message.replace(/:simple_smile:/g, ':smile:');                                                    // 418
				message = message.replace(/:memo:/g, ':pencil:');                                                           // 419
				message = message.replace(/:piggy:/g, ':pig:');                                                             // 420
				message = message.replace(/:uk:/g, ':gb:');                                                                 // 421
				message = message.replace(/<(http[s]?:[^>]*)>/g, '$1');                                                     // 422
                                                                                                                //
				for (var _iterator = Array.from(this.userTags), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
					var _ref;                                                                                                  // 423
                                                                                                                //
					if (_isArray) {                                                                                            // 423
						if (_i >= _iterator.length) break;                                                                        // 423
						_ref = _iterator[_i++];                                                                                   // 423
					} else {                                                                                                   // 423
						_i = _iterator.next();                                                                                    // 423
						if (_i.done) break;                                                                                       // 423
						_ref = _i.value;                                                                                          // 423
					}                                                                                                          // 423
                                                                                                                //
					var userReplace = _ref;                                                                                    // 423
					message = message.replace(userReplace.slack, userReplace.rocket);                                          // 424
					message = message.replace(userReplace.slackLong, userReplace.rocket);                                      // 425
				}                                                                                                           // 426
			} else {                                                                                                     // 427
				message = '';                                                                                               // 428
			}                                                                                                            // 429
                                                                                                                //
			return message;                                                                                              // 430
		}                                                                                                             // 431
                                                                                                                //
		return convertSlackMessageToRocketChat;                                                                       // 2
	}();                                                                                                           // 2
                                                                                                                //
	_class.prototype.getSelection = function () {                                                                  // 2
		function getSelection() {                                                                                     // 2
			var selectionUsers = this.users.users.map(function (user) {                                                  // 433
				return new Importer.SelectionUser(user.id, user.name, user.profile.email, user.deleted, user.is_bot, !user.is_bot);
			});                                                                                                          // 433
			var selectionChannels = this.channels.channels.map(function (channel) {                                      // 434
				return new Importer.SelectionChannel(channel.id, channel.name, channel.is_archived, true, false);           // 434
			});                                                                                                          // 434
			var selectionMessages = this.importRecord.count.messages;                                                    // 435
			return new Importer.Selection(this.name, selectionUsers, selectionChannels, selectionMessages);              // 436
		}                                                                                                             // 437
                                                                                                                //
		return getSelection;                                                                                          // 2
	}();                                                                                                           // 2
                                                                                                                //
	return _class;                                                                                                 // 2
}(Importer.Base);                                                                                               // 2
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"main.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/rocketchat_importer-slack/main.js                                                                   //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
/* globals Importer */Importer.addImporter('slack', Importer.Slack, {                                           // 1
	name: 'Slack',                                                                                                 // 3
	mimeType: 'application/zip'                                                                                    // 4
});                                                                                                             // 2
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:importer-slack/server.js");
require("./node_modules/meteor/rocketchat:importer-slack/main.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:importer-slack'] = {};

})();

//# sourceMappingURL=rocketchat_importer-slack.js.map

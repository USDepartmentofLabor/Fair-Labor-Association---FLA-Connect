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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:importer-hipchat":{"server.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/rocketchat_importer-hipchat/server.js                                                                  //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                            //
                                                                                                                   //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                   //
                                                                                                                   //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                      //
                                                                                                                   //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                             //
                                                                                                                   //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                        //
                                                                                                                   //
var _inherits3 = _interopRequireDefault(_inherits2);                                                               //
                                                                                                                   //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                  //
                                                                                                                   //
var moment = void 0;                                                                                               // 1
module.watch(require("moment"), {                                                                                  // 1
	"default": function (v) {                                                                                         // 1
		moment = v;                                                                                                      // 1
	}                                                                                                                 // 1
}, 0);                                                                                                             // 1
module.watch(require("moment-timezone"));                                                                          // 1
                                                                                                                   //
Importer.HipChat = Importer.HipChat = function () {                                                                // 6
	var HipChat = function (_Importer$Base) {                                                                         // 6
		(0, _inherits3.default)(HipChat, _Importer$Base);                                                                // 6
                                                                                                                   //
		function HipChat(name, descriptionI18N, mimeType) {                                                              // 8
			(0, _classCallCheck3.default)(this, HipChat);                                                                   // 8
                                                                                                                   //
			var _this = (0, _possibleConstructorReturn3.default)(this, _Importer$Base.call(this, name, descriptionI18N, mimeType));
                                                                                                                   //
			_this.logger.debug('Constructed a new Slack Importer.');                                                        // 10
                                                                                                                   //
			_this.userTags = [];                                                                                            // 11
			return _this;                                                                                                   // 8
		}                                                                                                                // 12
                                                                                                                   //
		HipChat.prototype.prepare = function () {                                                                        // 6
			function prepare(dataURI, sentContentType, fileName) {                                                          // 6
				var _this2 = this;                                                                                             // 14
                                                                                                                   //
				_Importer$Base.prototype.prepare.call(this, dataURI, sentContentType, fileName);                               // 15
                                                                                                                   //
				var image = RocketChatFile.dataURIParse(dataURI).image; // const contentType = ref.contentType;                // 16
                                                                                                                   //
				var zip = new this.AdmZip(new Buffer(image, 'base64'));                                                        // 18
				var zipEntries = zip.getEntries();                                                                             // 19
				var tempRooms = [];                                                                                            // 20
				var tempUsers = [];                                                                                            // 21
				var tempMessages = {};                                                                                         // 22
				zipEntries.forEach(function (entry) {                                                                          // 24
					if (entry.entryName.indexOf('__MACOSX') > -1) {                                                               // 25
						_this2.logger.debug("Ignoring the file: " + entry.entryName);                                                // 26
					}                                                                                                             // 27
                                                                                                                   //
					if (entry.isDirectory) {                                                                                      // 28
						return;                                                                                                      // 29
					}                                                                                                             // 30
                                                                                                                   //
					if (entry.entryName.indexOf(Importer.HipChat.RoomPrefix) > -1) {                                              // 31
						var roomName = entry.entryName.split(Importer.HipChat.RoomPrefix)[1];                                        // 32
                                                                                                                   //
						if (roomName === 'list.json') {                                                                              // 33
							_this2.updateProgress(Importer.ProgressStep.PREPARING_CHANNELS);                                            // 34
                                                                                                                   //
							var _tempRooms = JSON.parse(entry.getData().toString()).rooms;                                              // 35
                                                                                                                   //
							_tempRooms.forEach(function (room) {                                                                        // 36
								room.name = _.slugify(room.name);                                                                          // 37
							});                                                                                                         // 38
						} else if (roomName.indexOf('/') > -1) {                                                                     // 39
							var item = roomName.split('/');                                                                             // 40
							roomName = _.slugify(item[0]);                                                                              // 41
							var msgGroupData = item[1].split('.')[0];                                                                   // 42
                                                                                                                   //
							if (!tempMessages[roomName]) {                                                                              // 43
								tempMessages[roomName] = {};                                                                               // 44
							}                                                                                                           // 45
                                                                                                                   //
							try {                                                                                                       // 46
								return tempMessages[roomName][msgGroupData] = JSON.parse(entry.getData().toString());                      // 47
							} catch (error) {                                                                                           // 48
								return _this2.logger.warn(entry.entryName + " is not a valid JSON file! Unable to import it.");            // 49
							}                                                                                                           // 50
						}                                                                                                            // 51
					} else if (entry.entryName.indexOf(Importer.HipChat.UsersPrefix) > -1) {                                      // 52
						var usersName = entry.entryName.split(Importer.HipChat.UsersPrefix)[1];                                      // 53
                                                                                                                   //
						if (usersName === 'list.json') {                                                                             // 54
							_this2.updateProgress(Importer.ProgressStep.PREPARING_USERS);                                               // 55
                                                                                                                   //
							return tempUsers = JSON.parse(entry.getData().toString()).users;                                            // 56
						} else {                                                                                                     // 57
							return _this2.logger.warn("Unexpected file in the " + _this2.name + " import: " + entry.entryName);         // 58
						}                                                                                                            // 59
					}                                                                                                             // 60
				});                                                                                                            // 61
				var usersId = this.collection.insert({                                                                         // 62
					'import': this.importRecord._id,                                                                              // 63
					'importer': this.name,                                                                                        // 64
					'type': 'users',                                                                                              // 65
					'users': tempUsers                                                                                            // 66
				});                                                                                                            // 62
				this.users = this.collection.findOne(usersId);                                                                 // 68
				this.updateRecord({                                                                                            // 69
					'count.users': tempUsers.length                                                                               // 70
				});                                                                                                            // 69
				this.addCountToTotal(tempUsers.length);                                                                        // 72
				var channelsId = this.collection.insert({                                                                      // 73
					'import': this.importRecord._id,                                                                              // 74
					'importer': this.name,                                                                                        // 75
					'type': 'channels',                                                                                           // 76
					'channels': tempRooms                                                                                         // 77
				});                                                                                                            // 73
				this.channels = this.collection.findOne(channelsId);                                                           // 79
				this.updateRecord({                                                                                            // 80
					'count.channels': tempRooms.length                                                                            // 81
				});                                                                                                            // 80
				this.addCountToTotal(tempRooms.length);                                                                        // 83
				this.updateProgress(Importer.ProgressStep.PREPARING_MESSAGES);                                                 // 84
				var messagesCount = 0;                                                                                         // 85
				Object.keys(tempMessages).forEach(function (channel) {                                                         // 86
					var messagesObj = tempMessages[channel];                                                                      // 87
					_this2.messages[channel] = _this2.messages[channel] || {};                                                    // 88
					Object.keys(messagesObj).forEach(function (date) {                                                            // 89
						var msgs = messagesObj[date];                                                                                // 90
						messagesCount += msgs.length;                                                                                // 91
                                                                                                                   //
						_this2.updateRecord({                                                                                        // 92
							'messagesstatus': channel + "/" + date                                                                      // 93
						});                                                                                                          // 92
                                                                                                                   //
						if (Importer.Base.getBSONSize(msgs) > Importer.Base.MaxBSONSize) {                                           // 95
							Importer.Base.getBSONSafeArraysFromAnArray(msgs).forEach(function (splitMsg, i) {                           // 96
								var messagesId = _this2.collection.insert({                                                                // 97
									'import': _this2.importRecord._id,                                                                        // 98
									'importer': _this2.name,                                                                                  // 99
									'type': 'messages',                                                                                       // 100
									'name': channel + "/" + date + "." + i,                                                                   // 101
									'messages': splitMsg                                                                                      // 102
								});                                                                                                        // 97
                                                                                                                   //
								_this2.messages[channel][date + "." + i] = _this2.collection.findOne(messagesId);                          // 104
							});                                                                                                         // 105
						} else {                                                                                                     // 106
							var messagesId = _this2.collection.insert({                                                                 // 107
								'import': _this2.importRecord._id,                                                                         // 108
								'importer': _this2.name,                                                                                   // 109
								'type': 'messages',                                                                                        // 110
								'name': channel + "/" + date,                                                                              // 111
								'messages': msgs                                                                                           // 112
							});                                                                                                         // 107
                                                                                                                   //
							_this2.messages[channel][date] = _this2.collection.findOne(messagesId);                                     // 114
						}                                                                                                            // 115
					});                                                                                                           // 116
				});                                                                                                            // 117
				this.updateRecord({                                                                                            // 118
					'count.messages': messagesCount,                                                                              // 119
					'messagesstatus': null                                                                                        // 120
				});                                                                                                            // 118
				this.addCountToTotal(messagesCount);                                                                           // 122
                                                                                                                   //
				if (tempUsers.length === 0 || tempRooms.length === 0 || messagesCount === 0) {                                 // 123
					this.logger.warn("The loaded users count " + tempUsers.length + ", the loaded channels " + tempRooms.length + ", and the loaded messages " + messagesCount);
					this.updateProgress(Importer.ProgressStep.ERROR);                                                             // 125
					return this.getProgress();                                                                                    // 126
				}                                                                                                              // 127
                                                                                                                   //
				var selectionUsers = tempUsers.map(function (user) {                                                           // 128
					return new Importer.SelectionUser(user.user_id, user.name, user.email, user.is_deleted, false, !user.is_bot);
				});                                                                                                            // 130
				var selectionChannels = tempRooms.map(function (room) {                                                        // 131
					return new Importer.SelectionChannel(room.room_id, room.name, room.is_archived, true, false);                 // 132
				});                                                                                                            // 133
				var selectionMessages = this.importRecord.count.messages;                                                      // 134
				this.updateProgress(Importer.ProgressStep.USER_SELECTION);                                                     // 135
				return new Importer.Selection(this.name, selectionUsers, selectionChannels, selectionMessages);                // 136
			}                                                                                                               // 137
                                                                                                                   //
			return prepare;                                                                                                 // 6
		}();                                                                                                             // 6
                                                                                                                   //
		HipChat.prototype.startImport = function () {                                                                    // 6
			function startImport(importSelection) {                                                                         // 6
				var _this3 = this;                                                                                             // 139
                                                                                                                   //
				_Importer$Base.prototype.startImport.call(this, importSelection);                                              // 140
                                                                                                                   //
				var start = Date.now();                                                                                        // 141
				importSelection.users.forEach(function (user) {                                                                // 142
					_this3.users.users.forEach(function (u) {                                                                     // 143
						if (u.user_id === user.user_id) {                                                                            // 144
							u.do_import = user.do_import;                                                                               // 145
						}                                                                                                            // 146
					});                                                                                                           // 147
				});                                                                                                            // 148
				this.collection.update({                                                                                       // 149
					_id: this.users._id                                                                                           // 149
				}, {                                                                                                           // 149
					$set: {                                                                                                       // 149
						'users': this.users.users                                                                                    // 149
					}                                                                                                             // 149
				});                                                                                                            // 149
				importSelection.channels.forEach(function (channel) {                                                          // 150
					return _this3.channels.channels.forEach(function (c) {                                                        // 150
						return c.room_id === channel.channel_id && (c.do_import = channel.do_import);                                // 151
					});                                                                                                           // 151
				});                                                                                                            // 150
				this.collection.update({                                                                                       // 153
					_id: this.channels._id                                                                                        // 153
				}, {                                                                                                           // 153
					$set: {                                                                                                       // 153
						'channels': this.channels.channels                                                                           // 153
					}                                                                                                             // 153
				});                                                                                                            // 153
				var startedByUserId = Meteor.userId();                                                                         // 154
				Meteor.defer(function () {                                                                                     // 155
					_this3.updateProgress(Importer.ProgressStep.IMPORTING_USERS);                                                 // 156
                                                                                                                   //
					_this3.users.users.forEach(function (user) {                                                                  // 157
						if (!user.do_import) {                                                                                       // 158
							return;                                                                                                     // 159
						}                                                                                                            // 160
                                                                                                                   //
						Meteor.runAsUser(startedByUserId, function () {                                                              // 161
							var existantUser = RocketChat.models.Users.findOneByEmailAddress(user.email);                               // 162
                                                                                                                   //
							if (existantUser) {                                                                                         // 163
								user.rocketId = existantUser._id;                                                                          // 164
                                                                                                                   //
								_this3.userTags.push({                                                                                     // 165
									hipchat: "@" + user.mention_name,                                                                         // 166
									rocket: "@" + existantUser.username                                                                       // 167
								});                                                                                                        // 165
							} else {                                                                                                    // 169
								var userId = Accounts.createUser({                                                                         // 170
									email: user.email,                                                                                        // 171
									password: Date.now() + user.name + user.email.toUpperCase()                                               // 172
								});                                                                                                        // 170
								user.rocketId = userId;                                                                                    // 174
                                                                                                                   //
								_this3.userTags.push({                                                                                     // 175
									hipchat: "@" + user.mention_name,                                                                         // 176
									rocket: "@" + user.mention_name                                                                           // 177
								});                                                                                                        // 175
                                                                                                                   //
								Meteor.runAsUser(userId, function () {                                                                     // 179
									Meteor.call('setUsername', user.mention_name, {                                                           // 180
										joinDefaultChannelsSilenced: true                                                                        // 181
									});                                                                                                       // 180
									Meteor.call('setAvatarFromService', user.photo_url, undefined, 'url');                                    // 183
									return Meteor.call('userSetUtcOffset', parseInt(moment().tz(user.timezone).format('Z').toString().split(':')[0]));
								});                                                                                                        // 185
                                                                                                                   //
								if (user.name != null) {                                                                                   // 186
									RocketChat.models.Users.setName(userId, user.name);                                                       // 187
								}                                                                                                          // 188
                                                                                                                   //
								if (user.is_deleted) {                                                                                     // 189
									Meteor.call('setUserActiveStatus', userId, false);                                                        // 190
								}                                                                                                          // 191
							}                                                                                                           // 192
                                                                                                                   //
							return _this3.addCountCompleted(1);                                                                         // 193
						});                                                                                                          // 194
					});                                                                                                           // 195
                                                                                                                   //
					_this3.collection.update({                                                                                    // 196
						_id: _this3.users._id                                                                                        // 196
					}, {                                                                                                          // 196
						$set: {                                                                                                      // 196
							'users': _this3.users.users                                                                                 // 196
						}                                                                                                            // 196
					});                                                                                                           // 196
                                                                                                                   //
					_this3.updateProgress(Importer.ProgressStep.IMPORTING_CHANNELS);                                              // 197
                                                                                                                   //
					_this3.channels.channels.forEach(function (channel) {                                                         // 198
						if (!channel.do_import) {                                                                                    // 199
							return;                                                                                                     // 200
						}                                                                                                            // 201
                                                                                                                   //
						Meteor.runAsUser(startedByUserId, function () {                                                              // 202
							channel.name = channel.name.replace(/ /g, '');                                                              // 203
							var existantRoom = RocketChat.models.Rooms.findOneByName(channel.name);                                     // 204
                                                                                                                   //
							if (existantRoom) {                                                                                         // 205
								channel.rocketId = existantRoom._id;                                                                       // 206
							} else {                                                                                                    // 207
								var userId = '';                                                                                           // 208
                                                                                                                   //
								_this3.users.users.forEach(function (user) {                                                               // 209
									if (user.user_id === channel.owner_user_id) {                                                             // 210
										userId = user.rocketId;                                                                                  // 211
									}                                                                                                         // 212
								});                                                                                                        // 213
                                                                                                                   //
								if (userId === '') {                                                                                       // 214
									_this3.logger.warn("Failed to find the channel creator for " + channel.name + ", setting it to the current running user.");
                                                                                                                   //
									userId = startedByUserId;                                                                                 // 216
								}                                                                                                          // 217
                                                                                                                   //
								Meteor.runAsUser(userId, function () {                                                                     // 218
									var returned = Meteor.call('createChannel', channel.name, []);                                            // 219
									return channel.rocketId = returned.rid;                                                                   // 220
								});                                                                                                        // 221
								RocketChat.models.Rooms.update({                                                                           // 222
									_id: channel.rocketId                                                                                     // 223
								}, {                                                                                                       // 222
									$set: {                                                                                                   // 225
										'ts': new Date(channel.created * 1000)                                                                   // 226
									}                                                                                                         // 225
								});                                                                                                        // 224
							}                                                                                                           // 229
                                                                                                                   //
							return _this3.addCountCompleted(1);                                                                         // 230
						});                                                                                                          // 231
					});                                                                                                           // 232
                                                                                                                   //
					_this3.collection.update({                                                                                    // 233
						_id: _this3.channels._id                                                                                     // 234
					}, {                                                                                                          // 233
						$set: {                                                                                                      // 236
							'channels': _this3.channels.channels                                                                        // 237
						}                                                                                                            // 236
					});                                                                                                           // 235
                                                                                                                   //
					_this3.updateProgress(Importer.ProgressStep.IMPORTING_MESSAGES);                                              // 240
                                                                                                                   //
					var nousers = {};                                                                                             // 241
					Object.keys(_this3.messages).forEach(function (channel) {                                                     // 243
						var messagesObj = _this3.messages[channel];                                                                  // 244
						Meteor.runAsUser(startedByUserId, function () {                                                              // 245
							var hipchatChannel = _this3.getHipChatChannelFromName(channel);                                             // 246
                                                                                                                   //
							if (hipchatChannel != null ? hipchatChannel.do_import : undefined) {                                        // 247
								var room = RocketChat.models.Rooms.findOneById(hipchatChannel.rocketId, {                                  // 248
									fields: {                                                                                                 // 249
										usernames: 1,                                                                                            // 250
										t: 1,                                                                                                    // 251
										name: 1                                                                                                  // 252
									}                                                                                                         // 249
								});                                                                                                        // 248
								Object.keys(messagesObj).forEach(function (date) {                                                         // 256
									var msgs = messagesObj[date];                                                                             // 257
                                                                                                                   //
									_this3.updateRecord({                                                                                     // 258
										'messagesstatus': channel + "/" + date + "." + msgs.messages.length                                      // 259
									});                                                                                                       // 258
                                                                                                                   //
									msgs.messages.forEach(function (message) {                                                                // 262
										if (message.from != null) {                                                                              // 263
											var user = _this3.getRocketUser(message.from.user_id);                                                  // 264
                                                                                                                   //
											if (user != null) {                                                                                     // 265
												var msgObj = {                                                                                         // 266
													msg: _this3.convertHipChatMessageToRocketChat(message.message),                                       // 267
													ts: new Date(message.date),                                                                           // 268
													u: {                                                                                                  // 269
														_id: user._id,                                                                                       // 270
														username: user.username                                                                              // 271
													}                                                                                                     // 269
												};                                                                                                     // 266
												RocketChat.sendMessage(user, msgObj, room, true);                                                      // 274
											} else if (!nousers[message.from.user_id]) {                                                            // 275
												nousers[message.from.user_id] = message.from;                                                          // 276
											}                                                                                                       // 277
										} else if (!_.isArray(message)) {                                                                        // 278
											console.warn('Please report the following:', message);                                                  // 279
										}                                                                                                        // 280
                                                                                                                   //
										_this3.addCountCompleted(1);                                                                             // 281
									});                                                                                                       // 282
								});                                                                                                        // 283
							}                                                                                                           // 284
						});                                                                                                          // 285
					});                                                                                                           // 286
                                                                                                                   //
					_this3.logger.warn('The following did not have users:', nousers);                                             // 287
                                                                                                                   //
					_this3.updateProgress(Importer.ProgressStep.FINISHING);                                                       // 288
                                                                                                                   //
					_this3.channels.channels.forEach(function (channel) {                                                         // 289
						if (channel.do_import && channel.is_archived) {                                                              // 290
							Meteor.runAsUser(startedByUserId, function () {                                                             // 291
								return Meteor.call('archiveRoom', channel.rocketId);                                                       // 292
							});                                                                                                         // 293
						}                                                                                                            // 294
					});                                                                                                           // 295
                                                                                                                   //
					_this3.updateProgress(Importer.ProgressStep.DONE);                                                            // 296
                                                                                                                   //
					var timeTook = Date.now() - start;                                                                            // 297
					return _this3.logger.log("Import took " + timeTook + " milliseconds.");                                       // 298
				});                                                                                                            // 299
				return this.getProgress();                                                                                     // 300
			}                                                                                                               // 301
                                                                                                                   //
			return startImport;                                                                                             // 6
		}();                                                                                                             // 6
                                                                                                                   //
		HipChat.prototype.getHipChatChannelFromName = function () {                                                      // 6
			function getHipChatChannelFromName(channelName) {                                                               // 6
				return this.channels.channels.find(function (channel) {                                                        // 304
					return channel.name === channelName;                                                                          // 304
				});                                                                                                            // 304
			}                                                                                                               // 305
                                                                                                                   //
			return getHipChatChannelFromName;                                                                               // 6
		}();                                                                                                             // 6
                                                                                                                   //
		HipChat.prototype.getRocketUser = function () {                                                                  // 6
			function getRocketUser(hipchatId) {                                                                             // 6
				var user = this.users.users.find(function (user) {                                                             // 308
					return user.user_id === hipchatId;                                                                            // 308
				});                                                                                                            // 308
				return user ? RocketChat.models.Users.findOneById(user.rocketId, {                                             // 309
					fields: {                                                                                                     // 310
						username: 1,                                                                                                 // 311
						name: 1                                                                                                      // 312
					}                                                                                                             // 310
				}) : undefined;                                                                                                // 309
			}                                                                                                               // 315
                                                                                                                   //
			return getRocketUser;                                                                                           // 6
		}();                                                                                                             // 6
                                                                                                                   //
		HipChat.prototype.convertHipChatMessageToRocketChat = function () {                                              // 6
			function convertHipChatMessageToRocketChat(message) {                                                           // 6
				if (message != null) {                                                                                         // 318
					this.userTags.forEach(function (userReplace) {                                                                // 319
						message = message.replace(userReplace.hipchat, userReplace.rocket);                                          // 320
					});                                                                                                           // 321
				} else {                                                                                                       // 322
					message = '';                                                                                                 // 323
				}                                                                                                              // 324
                                                                                                                   //
				return message;                                                                                                // 325
			}                                                                                                               // 326
                                                                                                                   //
			return convertHipChatMessageToRocketChat;                                                                       // 6
		}();                                                                                                             // 6
                                                                                                                   //
		HipChat.prototype.getSelection = function () {                                                                   // 6
			function getSelection() {                                                                                       // 6
				var selectionUsers = this.users.users.map(function (user) {                                                    // 329
					return new Importer.SelectionUser(user.user_id, user.name, user.email, user.is_deleted, false, !user.is_bot);
				});                                                                                                            // 331
				var selectionChannels = this.channels.channels.map(function (room) {                                           // 332
					return new Importer.SelectionChannel(room.room_id, room.name, room.is_archived, true, false);                 // 333
				});                                                                                                            // 334
				var selectionMessages = this.importRecord.count.messages;                                                      // 335
				return new Importer.Selection(this.name, selectionUsers, selectionChannels, selectionMessages);                // 336
			}                                                                                                               // 337
                                                                                                                   //
			return getSelection;                                                                                            // 6
		}();                                                                                                             // 6
                                                                                                                   //
		return HipChat;                                                                                                  // 6
	}(Importer.Base);                                                                                                 // 6
                                                                                                                   //
	HipChat.RoomPrefix = 'hipchat_export/rooms/';                                                                     // 341
	HipChat.UsersPrefix = 'hipchat_export/users/';                                                                    // 343
	return HipChat;                                                                                                   // 345
}();                                                                                                               // 347
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"main.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/rocketchat_importer-hipchat/main.js                                                                    //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
/* globals Importer */Importer.addImporter('hipchat', Importer.HipChat, {                                          // 1
	name: 'HipChat',                                                                                                  // 4
	mimeType: 'application/zip'                                                                                       // 5
});                                                                                                                // 3
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:importer-hipchat/server.js");
require("./node_modules/meteor/rocketchat:importer-hipchat/main.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:importer-hipchat'] = {};

})();

//# sourceMappingURL=rocketchat_importer-hipchat.js.map

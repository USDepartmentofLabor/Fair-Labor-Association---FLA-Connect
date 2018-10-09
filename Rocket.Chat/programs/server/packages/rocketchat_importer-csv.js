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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:importer-csv":{"server.js":function(require){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/rocketchat_importer-csv/server.js                                                                       //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");                                               //
                                                                                                                    //
var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);                                                      //
                                                                                                                    //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                             //
                                                                                                                    //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                    //
                                                                                                                    //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                       //
                                                                                                                    //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                              //
                                                                                                                    //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                         //
                                                                                                                    //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                //
                                                                                                                    //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                   //
                                                                                                                    //
/* globals Importer */Importer.CSV = function (_Importer$Base) {                                                    // 1
	(0, _inherits3.default)(ImporterCSV, _Importer$Base);                                                              // 3
                                                                                                                    //
	function ImporterCSV(name, descriptionI18N, mimeType) {                                                            // 4
		(0, _classCallCheck3.default)(this, ImporterCSV);                                                                 // 4
                                                                                                                    //
		var _this = (0, _possibleConstructorReturn3.default)(this, _Importer$Base.call(this, name, descriptionI18N, mimeType));
                                                                                                                    //
		_this.logger.debug('Constructed a new CSV Importer.');                                                            // 6
                                                                                                                    //
		_this.csvParser = Npm.require('csv-parse/lib/sync');                                                              // 8
		_this.messages = new Map();                                                                                       // 9
		return _this;                                                                                                     // 4
	}                                                                                                                  // 10
                                                                                                                    //
	ImporterCSV.prototype.prepare = function () {                                                                      // 3
		function prepare(dataURI, sentContentType, fileName) {                                                            // 3
			var _this2 = this;                                                                                               // 12
                                                                                                                    //
			_Importer$Base.prototype.prepare.call(this, dataURI, sentContentType, fileName);                                 // 13
                                                                                                                    //
			var uriResult = RocketChatFile.dataURIParse(dataURI);                                                            // 15
			var zip = new this.AdmZip(new Buffer(uriResult.image, 'base64'));                                                // 16
			var zipEntries = zip.getEntries();                                                                               // 17
			var tempChannels = [];                                                                                           // 19
			var tempUsers = [];                                                                                              // 20
			var tempMessages = new Map();                                                                                    // 21
                                                                                                                    //
			for (var _iterator = zipEntries, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
				var _ref;                                                                                                       // 22
                                                                                                                    //
				if (_isArray) {                                                                                                 // 22
					if (_i >= _iterator.length) break;                                                                             // 22
					_ref = _iterator[_i++];                                                                                        // 22
				} else {                                                                                                        // 22
					_i = _iterator.next();                                                                                         // 22
					if (_i.done) break;                                                                                            // 22
					_ref = _i.value;                                                                                               // 22
				}                                                                                                               // 22
                                                                                                                    //
				var entry = _ref;                                                                                               // 22
				this.logger.debug("Entry: " + entry.entryName); //Ignore anything that has `__MACOSX` in it's name, as sadly these things seem to mess everything up
                                                                                                                    //
				if (entry.entryName.indexOf('__MACOSX') > -1) {                                                                 // 26
					this.logger.debug("Ignoring the file: " + entry.entryName);                                                    // 27
					continue;                                                                                                      // 28
				} //Directories are ignored, since they are "virtual" in a zip file                                             // 29
                                                                                                                    //
                                                                                                                    //
				if (entry.isDirectory) {                                                                                        // 32
					this.logger.debug("Ignoring the directory entry: " + entry.entryName);                                         // 33
					continue;                                                                                                      // 34
				} //Parse the channels                                                                                          // 35
                                                                                                                    //
                                                                                                                    //
				if (entry.entryName.toLowerCase() === 'channels.csv') {                                                         // 38
					_Importer$Base.prototype.updateProgress.call(this, Importer.ProgressStep.PREPARING_CHANNELS);                  // 39
                                                                                                                    //
					var parsedChannels = this.csvParser(entry.getData().toString());                                               // 40
					tempChannels = parsedChannels.map(function (c) {                                                               // 41
						return {                                                                                                      // 42
							id: c[0].trim().replace('.', '_'),                                                                           // 43
							name: c[0].trim(),                                                                                           // 44
							creator: c[1].trim(),                                                                                        // 45
							isPrivate: c[2].trim().toLowerCase() === 'private' ? true : false,                                           // 46
							members: c[3].trim().split(';').map(function (m) {                                                           // 47
								return m.trim();                                                                                            // 47
							})                                                                                                           // 47
						};                                                                                                            // 42
					});                                                                                                            // 49
					continue;                                                                                                      // 50
				} //Parse the users                                                                                             // 51
                                                                                                                    //
                                                                                                                    //
				if (entry.entryName.toLowerCase() === 'users.csv') {                                                            // 54
					_Importer$Base.prototype.updateProgress.call(this, Importer.ProgressStep.PREPARING_USERS);                     // 55
                                                                                                                    //
					var parsedUsers = this.csvParser(entry.getData().toString());                                                  // 56
					tempUsers = parsedUsers.map(function (u) {                                                                     // 57
						return {                                                                                                      // 57
							id: u[0].trim().replace('.', '_'),                                                                           // 57
							username: u[0].trim(),                                                                                       // 57
							email: u[1].trim(),                                                                                          // 57
							name: u[2].trim()                                                                                            // 57
						};                                                                                                            // 57
					});                                                                                                            // 57
					continue;                                                                                                      // 58
				} //Parse the messages                                                                                          // 59
                                                                                                                    //
                                                                                                                    //
				if (entry.entryName.indexOf('/') > -1) {                                                                        // 62
					var item = entry.entryName.split('/'); //random/messages.csv                                                   // 63
                                                                                                                    //
					var channelName = item[0]; //random                                                                            // 64
                                                                                                                    //
					var msgGroupData = item[1].split('.')[0]; //2015-10-04                                                         // 65
                                                                                                                    //
					if (!tempMessages.get(channelName)) {                                                                          // 67
						tempMessages.set(channelName, new Map());                                                                     // 68
					}                                                                                                              // 69
                                                                                                                    //
					var msgs = [];                                                                                                 // 71
                                                                                                                    //
					try {                                                                                                          // 73
						msgs = this.csvParser(entry.getData().toString());                                                            // 74
					} catch (e) {                                                                                                  // 75
						this.logger.warn("The file " + entry.entryName + " contains invalid syntax", e);                              // 76
						continue;                                                                                                     // 77
					}                                                                                                              // 78
                                                                                                                    //
					tempMessages.get(channelName).set(msgGroupData, msgs.map(function (m) {                                        // 80
						return {                                                                                                      // 80
							username: m[0],                                                                                              // 80
							ts: m[1],                                                                                                    // 80
							text: m[2]                                                                                                   // 80
						};                                                                                                            // 80
					}));                                                                                                           // 80
					continue;                                                                                                      // 81
				}                                                                                                               // 82
			} // Insert the users record, eventually this might have to be split into several ones as well                   // 83
			// if someone tries to import a several thousands users instance                                                 // 86
                                                                                                                    //
                                                                                                                    //
			var usersId = this.collection.insert({                                                                           // 87
				'import': this.importRecord._id,                                                                                // 87
				'importer': this.name,                                                                                          // 87
				'type': 'users',                                                                                                // 87
				'users': tempUsers                                                                                              // 87
			});                                                                                                              // 87
			this.users = this.collection.findOne(usersId);                                                                   // 88
                                                                                                                    //
			_Importer$Base.prototype.updateRecord.call(this, {                                                               // 89
				'count.users': tempUsers.length                                                                                 // 89
			});                                                                                                              // 89
                                                                                                                    //
			_Importer$Base.prototype.addCountToTotal.call(this, tempUsers.length); // Insert the channels records.           // 90
                                                                                                                    //
                                                                                                                    //
			var channelsId = this.collection.insert({                                                                        // 93
				'import': this.importRecord._id,                                                                                // 93
				'importer': this.name,                                                                                          // 93
				'type': 'channels',                                                                                             // 93
				'channels': tempChannels                                                                                        // 93
			});                                                                                                              // 93
			this.channels = this.collection.findOne(channelsId);                                                             // 94
                                                                                                                    //
			_Importer$Base.prototype.updateRecord.call(this, {                                                               // 95
				'count.channels': tempChannels.length                                                                           // 95
			});                                                                                                              // 95
                                                                                                                    //
			_Importer$Base.prototype.addCountToTotal.call(this, tempChannels.length); // Save the messages records to the import record for `startImport` usage
                                                                                                                    //
                                                                                                                    //
			_Importer$Base.prototype.updateProgress.call(this, Importer.ProgressStep.PREPARING_MESSAGES);                    // 99
                                                                                                                    //
			var messagesCount = 0;                                                                                           // 100
                                                                                                                    //
			var _loop = function (channel, messagesMap) {                                                                    // 12
				if (!_this2.messages.get(channel)) {                                                                            // 102
					_this2.messages.set(channel, new Map());                                                                       // 103
				}                                                                                                               // 104
                                                                                                                    //
				var _loop2 = function (_msgGroupData, _msgs) {                                                                  // 12
					messagesCount += _msgs.length;                                                                                 // 107
                                                                                                                    //
					_Importer$Base.prototype.updateRecord.call(_this2, {                                                           // 108
						'messagesstatus': channel + "/" + _msgGroupData                                                               // 108
					});                                                                                                            // 108
                                                                                                                    //
					if (Importer.Base.getBSONSize(_msgs) > Importer.Base.MaxBSONSize) {                                            // 110
						Importer.Base.getBSONSafeArraysFromAnArray(_msgs).forEach(function (splitMsg, i) {                            // 111
							var messagesId = _this2.collection.insert({                                                                  // 112
								'import': _this2.importRecord._id,                                                                          // 112
								'importer': _this2.name,                                                                                    // 112
								'type': 'messages',                                                                                         // 112
								'name': channel + "/" + _msgGroupData + "." + i,                                                            // 112
								'messages': splitMsg                                                                                        // 112
							});                                                                                                          // 112
                                                                                                                    //
							_this2.messages.get(channel).set(_msgGroupData + "." + i, _this2.collection.findOne(messagesId));            // 113
						});                                                                                                           // 114
					} else {                                                                                                       // 115
						var messagesId = _this2.collection.insert({                                                                   // 116
							'import': _this2.importRecord._id,                                                                           // 116
							'importer': _this2.name,                                                                                     // 116
							'type': 'messages',                                                                                          // 116
							'name': channel + "/" + _msgGroupData,                                                                       // 116
							'messages': _msgs                                                                                            // 116
						});                                                                                                           // 116
                                                                                                                    //
						_this2.messages.get(channel).set(_msgGroupData, _this2.collection.findOne(messagesId));                       // 117
					}                                                                                                              // 118
				};                                                                                                              // 12
                                                                                                                    //
				for (var _iterator3 = messagesMap.entries(), _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
					var _ref7;                                                                                                     // 106
                                                                                                                    //
					if (_isArray3) {                                                                                               // 106
						if (_i3 >= _iterator3.length) break;                                                                          // 106
						_ref7 = _iterator3[_i3++];                                                                                    // 106
					} else {                                                                                                       // 106
						_i3 = _iterator3.next();                                                                                      // 106
						if (_i3.done) break;                                                                                          // 106
						_ref7 = _i3.value;                                                                                            // 106
					}                                                                                                              // 106
                                                                                                                    //
					var _ref5 = _ref7;                                                                                             // 106
                                                                                                                    //
					var _ref6 = (0, _slicedToArray3.default)(_ref5, 2);                                                            // 106
                                                                                                                    //
					var _msgGroupData = _ref6[0];                                                                                  // 106
					var _msgs = _ref6[1];                                                                                          // 106
                                                                                                                    //
					_loop2(_msgGroupData, _msgs);                                                                                  // 106
				}                                                                                                               // 119
			};                                                                                                               // 12
                                                                                                                    //
			for (var _iterator2 = tempMessages.entries(), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
				var _ref4;                                                                                                      // 101
                                                                                                                    //
				if (_isArray2) {                                                                                                // 101
					if (_i2 >= _iterator2.length) break;                                                                           // 101
					_ref4 = _iterator2[_i2++];                                                                                     // 101
				} else {                                                                                                        // 101
					_i2 = _iterator2.next();                                                                                       // 101
					if (_i2.done) break;                                                                                           // 101
					_ref4 = _i2.value;                                                                                             // 101
				}                                                                                                               // 101
                                                                                                                    //
				var _ref2 = _ref4;                                                                                              // 101
                                                                                                                    //
				var _ref3 = (0, _slicedToArray3.default)(_ref2, 2);                                                             // 101
                                                                                                                    //
				var channel = _ref3[0];                                                                                         // 101
				var messagesMap = _ref3[1];                                                                                     // 101
                                                                                                                    //
				_loop(channel, messagesMap);                                                                                    // 101
			}                                                                                                                // 120
                                                                                                                    //
			_Importer$Base.prototype.updateRecord.call(this, {                                                               // 122
				'count.messages': messagesCount,                                                                                // 122
				'messagesstatus': null                                                                                          // 122
			});                                                                                                              // 122
                                                                                                                    //
			_Importer$Base.prototype.addCountToTotal.call(this, messagesCount); //Ensure we have at least a single user, channel, or message
                                                                                                                    //
                                                                                                                    //
			if (tempUsers.length === 0 && tempChannels.length === 0 && messagesCount === 0) {                                // 126
				this.logger.error('No users, channels, or messages found in the import file.');                                 // 127
                                                                                                                    //
				_Importer$Base.prototype.updateProgress.call(this, Importer.ProgressStep.ERROR);                                // 128
                                                                                                                    //
				return _Importer$Base.prototype.getProgress.call(this);                                                         // 129
			}                                                                                                                // 130
                                                                                                                    //
			var selectionUsers = tempUsers.map(function (u) {                                                                // 132
				return new Importer.SelectionUser(u.id, u.username, u.email, false, false, true);                               // 132
			});                                                                                                              // 132
			var selectionChannels = tempChannels.map(function (c) {                                                          // 133
				return new Importer.SelectionChannel(c.id, c.name, false, true, c.isPrivate);                                   // 133
			});                                                                                                              // 133
			var selectionMessages = this.importRecord.count.messages;                                                        // 134
                                                                                                                    //
			_Importer$Base.prototype.updateProgress.call(this, Importer.ProgressStep.USER_SELECTION);                        // 136
                                                                                                                    //
			return new Importer.Selection(this.name, selectionUsers, selectionChannels, selectionMessages);                  // 137
		}                                                                                                                 // 138
                                                                                                                    //
		return prepare;                                                                                                   // 3
	}();                                                                                                               // 3
                                                                                                                    //
	ImporterCSV.prototype.startImport = function () {                                                                  // 3
		function startImport(importSelection) {                                                                           // 3
			var _this3 = this;                                                                                               // 140
                                                                                                                    //
			_Importer$Base.prototype.startImport.call(this, importSelection);                                                // 141
                                                                                                                    //
			var started = Date.now(); //Ensure we're only going to import the users that the user has selected               // 142
                                                                                                                    //
			for (var _iterator4 = importSelection.users, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
				var _ref8;                                                                                                      // 145
                                                                                                                    //
				if (_isArray4) {                                                                                                // 145
					if (_i4 >= _iterator4.length) break;                                                                           // 145
					_ref8 = _iterator4[_i4++];                                                                                     // 145
				} else {                                                                                                        // 145
					_i4 = _iterator4.next();                                                                                       // 145
					if (_i4.done) break;                                                                                           // 145
					_ref8 = _i4.value;                                                                                             // 145
				}                                                                                                               // 145
                                                                                                                    //
				var user = _ref8;                                                                                               // 145
                                                                                                                    //
				for (var _iterator16 = this.users.users, _isArray16 = Array.isArray(_iterator16), _i16 = 0, _iterator16 = _isArray16 ? _iterator16 : _iterator16[Symbol.iterator]();;) {
					var _ref26;                                                                                                    // 146
                                                                                                                    //
					if (_isArray16) {                                                                                              // 146
						if (_i16 >= _iterator16.length) break;                                                                        // 146
						_ref26 = _iterator16[_i16++];                                                                                 // 146
					} else {                                                                                                       // 146
						_i16 = _iterator16.next();                                                                                    // 146
						if (_i16.done) break;                                                                                         // 146
						_ref26 = _i16.value;                                                                                          // 146
					}                                                                                                              // 146
                                                                                                                    //
					var u = _ref26;                                                                                                // 146
                                                                                                                    //
					if (u.id === user.user_id) {                                                                                   // 147
						u.do_import = user.do_import;                                                                                 // 148
					}                                                                                                              // 149
				}                                                                                                               // 150
			}                                                                                                                // 151
                                                                                                                    //
			this.collection.update({                                                                                         // 152
				_id: this.users._id                                                                                             // 152
			}, {                                                                                                             // 152
				$set: {                                                                                                         // 152
					'users': this.users.users                                                                                      // 152
				}                                                                                                               // 152
			}); //Ensure we're only importing the channels the user has selected.                                            // 152
                                                                                                                    //
			for (var _iterator5 = importSelection.channels, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
				var _ref9;                                                                                                      // 155
                                                                                                                    //
				if (_isArray5) {                                                                                                // 155
					if (_i5 >= _iterator5.length) break;                                                                           // 155
					_ref9 = _iterator5[_i5++];                                                                                     // 155
				} else {                                                                                                        // 155
					_i5 = _iterator5.next();                                                                                       // 155
					if (_i5.done) break;                                                                                           // 155
					_ref9 = _i5.value;                                                                                             // 155
				}                                                                                                               // 155
                                                                                                                    //
				var channel = _ref9;                                                                                            // 155
                                                                                                                    //
				for (var _iterator17 = this.channels.channels, _isArray17 = Array.isArray(_iterator17), _i17 = 0, _iterator17 = _isArray17 ? _iterator17 : _iterator17[Symbol.iterator]();;) {
					var _ref27;                                                                                                    // 156
                                                                                                                    //
					if (_isArray17) {                                                                                              // 156
						if (_i17 >= _iterator17.length) break;                                                                        // 156
						_ref27 = _iterator17[_i17++];                                                                                 // 156
					} else {                                                                                                       // 156
						_i17 = _iterator17.next();                                                                                    // 156
						if (_i17.done) break;                                                                                         // 156
						_ref27 = _i17.value;                                                                                          // 156
					}                                                                                                              // 156
                                                                                                                    //
					var c = _ref27;                                                                                                // 156
                                                                                                                    //
					if (c.id === channel.channel_id) {                                                                             // 157
						c.do_import = channel.do_import;                                                                              // 158
					}                                                                                                              // 159
				}                                                                                                               // 160
			}                                                                                                                // 161
                                                                                                                    //
			this.collection.update({                                                                                         // 162
				_id: this.channels._id                                                                                          // 162
			}, {                                                                                                             // 162
				$set: {                                                                                                         // 162
					'channels': this.channels.channels                                                                             // 162
				}                                                                                                               // 162
			});                                                                                                              // 162
			var startedByUserId = Meteor.userId();                                                                           // 164
			Meteor.defer(function () {                                                                                       // 165
				_Importer$Base.prototype.updateProgress.call(_this3, Importer.ProgressStep.IMPORTING_USERS); //Import the users
                                                                                                                    //
                                                                                                                    //
				var _loop3 = function (u) {                                                                                     // 165
					if (!u.do_import) {                                                                                            // 169
						return "continue";                                                                                            // 170
					}                                                                                                              // 171
                                                                                                                    //
					Meteor.runAsUser(startedByUserId, function () {                                                                // 173
						var existantUser = RocketChat.models.Users.findOneByEmailAddress(u.email); //If we couldn't find one by their email address, try to find an existing user by their username
                                                                                                                    //
						if (!existantUser) {                                                                                          // 177
							existantUser = RocketChat.models.Users.findOneByUsername(u.username);                                        // 178
						}                                                                                                             // 179
                                                                                                                    //
						if (existantUser) {                                                                                           // 181
							//since we have an existing user, let's try a few things                                                     // 182
							u.rocketId = existantUser._id;                                                                               // 183
							RocketChat.models.Users.update({                                                                             // 184
								_id: u.rocketId                                                                                             // 184
							}, {                                                                                                         // 184
								$addToSet: {                                                                                                // 184
									importIds: u.id                                                                                            // 184
								}                                                                                                           // 184
							});                                                                                                          // 184
						} else {                                                                                                      // 185
							var userId = Accounts.createUser({                                                                           // 186
								email: u.email,                                                                                             // 186
								password: Date.now() + u.name + u.email.toUpperCase()                                                       // 186
							});                                                                                                          // 186
							Meteor.runAsUser(userId, function () {                                                                       // 187
								Meteor.call('setUsername', u.username, {                                                                    // 188
									joinDefaultChannelsSilenced: true                                                                          // 188
								});                                                                                                         // 188
								RocketChat.models.Users.setName(userId, u.name);                                                            // 189
								RocketChat.models.Users.update({                                                                            // 190
									_id: userId                                                                                                // 190
								}, {                                                                                                        // 190
									$addToSet: {                                                                                               // 190
										importIds: u.id                                                                                           // 190
									}                                                                                                          // 190
								});                                                                                                         // 190
								u.rocketId = userId;                                                                                        // 191
							});                                                                                                          // 192
						}                                                                                                             // 193
                                                                                                                    //
						_Importer$Base.prototype.addCountCompleted.call(_this3, 1);                                                   // 195
					});                                                                                                            // 196
				};                                                                                                              // 165
                                                                                                                    //
				for (var _iterator6 = _this3.users.users, _isArray6 = Array.isArray(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
					var _ref10;                                                                                                    // 168
                                                                                                                    //
					if (_isArray6) {                                                                                               // 168
						if (_i6 >= _iterator6.length) break;                                                                          // 168
						_ref10 = _iterator6[_i6++];                                                                                   // 168
					} else {                                                                                                       // 168
						_i6 = _iterator6.next();                                                                                      // 168
						if (_i6.done) break;                                                                                          // 168
						_ref10 = _i6.value;                                                                                           // 168
					}                                                                                                              // 168
                                                                                                                    //
					var u = _ref10;                                                                                                // 168
                                                                                                                    //
					var _ret3 = _loop3(u);                                                                                         // 168
                                                                                                                    //
					if (_ret3 === "continue") continue;                                                                            // 168
				}                                                                                                               // 197
                                                                                                                    //
				_this3.collection.update({                                                                                      // 198
					_id: _this3.users._id                                                                                          // 198
				}, {                                                                                                            // 198
					$set: {                                                                                                        // 198
						'users': _this3.users.users                                                                                   // 198
					}                                                                                                              // 198
				}); //Import the channels                                                                                       // 198
                                                                                                                    //
                                                                                                                    //
				_Importer$Base.prototype.updateProgress.call(_this3, Importer.ProgressStep.IMPORTING_CHANNELS);                 // 201
                                                                                                                    //
				var _loop4 = function (c) {                                                                                     // 165
					if (!c.do_import) {                                                                                            // 203
						return "continue";                                                                                            // 204
					}                                                                                                              // 205
                                                                                                                    //
					Meteor.runAsUser(startedByUserId, function () {                                                                // 207
						var existantRoom = RocketChat.models.Rooms.findOneByName(c.name); //If the room exists or the name of it is 'general', then we don't need to create it again
                                                                                                                    //
						if (existantRoom || c.name.toUpperCase() === 'GENERAL') {                                                     // 210
							c.rocketId = c.name.toUpperCase() === 'GENERAL' ? 'GENERAL' : existantRoom._id;                              // 211
							RocketChat.models.Rooms.update({                                                                             // 212
								_id: c.rocketId                                                                                             // 212
							}, {                                                                                                         // 212
								$addToSet: {                                                                                                // 212
									importIds: c.id                                                                                            // 212
								}                                                                                                           // 212
							});                                                                                                          // 212
						} else {                                                                                                      // 213
							//Find the rocketchatId of the user who created this channel                                                 // 214
							var creatorId = startedByUserId;                                                                             // 215
                                                                                                                    //
							for (var _iterator13 = _this3.users.users, _isArray13 = Array.isArray(_iterator13), _i13 = 0, _iterator13 = _isArray13 ? _iterator13 : _iterator13[Symbol.iterator]();;) {
								var _ref21;                                                                                                 // 216
                                                                                                                    //
								if (_isArray13) {                                                                                           // 216
									if (_i13 >= _iterator13.length) break;                                                                     // 216
									_ref21 = _iterator13[_i13++];                                                                              // 216
								} else {                                                                                                    // 216
									_i13 = _iterator13.next();                                                                                 // 216
									if (_i13.done) break;                                                                                      // 216
									_ref21 = _i13.value;                                                                                       // 216
								}                                                                                                           // 216
                                                                                                                    //
								var _u = _ref21;                                                                                            // 216
                                                                                                                    //
								if (_u.username === c.creator && _u.do_import) {                                                            // 217
									creatorId = _u.rocketId;                                                                                   // 218
								}                                                                                                           // 219
							} //Create the channel                                                                                       // 220
                                                                                                                    //
                                                                                                                    //
							Meteor.runAsUser(creatorId, function () {                                                                    // 223
								var roomInfo = Meteor.call(c.isPrivate ? 'createPrivateGroup' : 'createChannel', c.name, c.members);        // 224
								c.rocketId = roomInfo.rid;                                                                                  // 225
							});                                                                                                          // 226
							RocketChat.models.Rooms.update({                                                                             // 228
								_id: c.rocketId                                                                                             // 228
							}, {                                                                                                         // 228
								$addToSet: {                                                                                                // 228
									importIds: c.id                                                                                            // 228
								}                                                                                                           // 228
							});                                                                                                          // 228
						}                                                                                                             // 229
                                                                                                                    //
						_Importer$Base.prototype.addCountCompleted.call(_this3, 1);                                                   // 231
					});                                                                                                            // 232
				};                                                                                                              // 165
                                                                                                                    //
				for (var _iterator7 = _this3.channels.channels, _isArray7 = Array.isArray(_iterator7), _i7 = 0, _iterator7 = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator]();;) {
					var _ref11;                                                                                                    // 202
                                                                                                                    //
					if (_isArray7) {                                                                                               // 202
						if (_i7 >= _iterator7.length) break;                                                                          // 202
						_ref11 = _iterator7[_i7++];                                                                                   // 202
					} else {                                                                                                       // 202
						_i7 = _iterator7.next();                                                                                      // 202
						if (_i7.done) break;                                                                                          // 202
						_ref11 = _i7.value;                                                                                           // 202
					}                                                                                                              // 202
                                                                                                                    //
					var c = _ref11;                                                                                                // 202
                                                                                                                    //
					var _ret4 = _loop4(c);                                                                                         // 202
                                                                                                                    //
					if (_ret4 === "continue") continue;                                                                            // 202
				}                                                                                                               // 233
                                                                                                                    //
				_this3.collection.update({                                                                                      // 234
					_id: _this3.channels._id                                                                                       // 234
				}, {                                                                                                            // 234
					$set: {                                                                                                        // 234
						'channels': _this3.channels.channels                                                                          // 234
					}                                                                                                              // 234
				}); //If no channels file, collect channel map from DB for message-only import                                  // 234
                                                                                                                    //
                                                                                                                    //
				if (_this3.channels.channels.length === 0) {                                                                    // 237
					var _loop5 = function (cname) {                                                                                // 237
						Meteor.runAsUser(startedByUserId, function () {                                                               // 239
							var existantRoom = RocketChat.models.Rooms.findOneByName(cname);                                             // 240
                                                                                                                    //
							if (existantRoom || cname.toUpperCase() === 'GENERAL') {                                                     // 241
								_this3.channels.channels.push({                                                                             // 242
									id: cname.replace('.', '_'),                                                                               // 243
									name: cname,                                                                                               // 244
									rocketId: cname.toUpperCase() === 'GENERAL' ? 'GENERAL' : existantRoom._id,                                // 245
									do_import: true                                                                                            // 246
								});                                                                                                         // 242
							}                                                                                                            // 248
						});                                                                                                           // 249
					};                                                                                                             // 237
                                                                                                                    //
					for (var _iterator8 = _this3.messages.keys(), _isArray8 = Array.isArray(_iterator8), _i8 = 0, _iterator8 = _isArray8 ? _iterator8 : _iterator8[Symbol.iterator]();;) {
						var _ref12;                                                                                                   // 238
                                                                                                                    //
						if (_isArray8) {                                                                                              // 238
							if (_i8 >= _iterator8.length) break;                                                                         // 238
							_ref12 = _iterator8[_i8++];                                                                                  // 238
						} else {                                                                                                      // 238
							_i8 = _iterator8.next();                                                                                     // 238
							if (_i8.done) break;                                                                                         // 238
							_ref12 = _i8.value;                                                                                          // 238
						}                                                                                                             // 238
                                                                                                                    //
						var cname = _ref12;                                                                                           // 238
                                                                                                                    //
						_loop5(cname);                                                                                                // 238
					}                                                                                                              // 250
				} //If no users file, collect user map from DB for message-only import                                          // 251
                                                                                                                    //
                                                                                                                    //
				if (_this3.users.users.length === 0) {                                                                          // 254
					var _loop6 = function (ch, messagesMap) {                                                                      // 254
						var csvChannel = _this3.getChannelFromName(ch);                                                               // 256
                                                                                                                    //
						if (!csvChannel || !csvChannel.do_import) {                                                                   // 257
							return "continue";                                                                                           // 258
						}                                                                                                             // 259
                                                                                                                    //
						Meteor.runAsUser(startedByUserId, function () {                                                               // 260
							for (var _iterator10 = messagesMap.values(), _isArray10 = Array.isArray(_iterator10), _i10 = 0, _iterator10 = _isArray10 ? _iterator10 : _iterator10[Symbol.iterator]();;) {
								var _ref16;                                                                                                 // 261
                                                                                                                    //
								if (_isArray10) {                                                                                           // 261
									if (_i10 >= _iterator10.length) break;                                                                     // 261
									_ref16 = _iterator10[_i10++];                                                                              // 261
								} else {                                                                                                    // 261
									_i10 = _iterator10.next();                                                                                 // 261
									if (_i10.done) break;                                                                                      // 261
									_ref16 = _i10.value;                                                                                       // 261
								}                                                                                                           // 261
                                                                                                                    //
								var msgs = _ref16;                                                                                          // 261
                                                                                                                    //
								for (var _iterator11 = msgs.messages, _isArray11 = Array.isArray(_iterator11), _i11 = 0, _iterator11 = _isArray11 ? _iterator11 : _iterator11[Symbol.iterator]();;) {
									var _ref17;                                                                                                // 262
                                                                                                                    //
									if (_isArray11) {                                                                                          // 262
										if (_i11 >= _iterator11.length) break;                                                                    // 262
										_ref17 = _iterator11[_i11++];                                                                             // 262
									} else {                                                                                                   // 262
										_i11 = _iterator11.next();                                                                                // 262
										if (_i11.done) break;                                                                                     // 262
										_ref17 = _i11.value;                                                                                      // 262
									}                                                                                                          // 262
                                                                                                                    //
									var msg = _ref17;                                                                                          // 262
                                                                                                                    //
									if (!_this3.getUserFromUsername(msg.username)) {                                                           // 263
										var _user = RocketChat.models.Users.findOneByUsername(msg.username);                                      // 264
                                                                                                                    //
										if (_user) {                                                                                              // 265
											_this3.users.users.push({                                                                                // 266
												rocketId: _user._id,                                                                                    // 267
												username: _user.username                                                                                // 268
											});                                                                                                      // 266
										}                                                                                                         // 270
									}                                                                                                          // 271
								}                                                                                                           // 272
							}                                                                                                            // 273
						});                                                                                                           // 274
					};                                                                                                             // 254
                                                                                                                    //
					for (var _iterator9 = _this3.messages.entries(), _isArray9 = Array.isArray(_iterator9), _i9 = 0, _iterator9 = _isArray9 ? _iterator9 : _iterator9[Symbol.iterator]();;) {
						var _ref15;                                                                                                   // 255
                                                                                                                    //
						if (_isArray9) {                                                                                              // 255
							if (_i9 >= _iterator9.length) break;                                                                         // 255
							_ref15 = _iterator9[_i9++];                                                                                  // 255
						} else {                                                                                                      // 255
							_i9 = _iterator9.next();                                                                                     // 255
							if (_i9.done) break;                                                                                         // 255
							_ref15 = _i9.value;                                                                                          // 255
						}                                                                                                             // 255
                                                                                                                    //
						var _ref13 = _ref15;                                                                                          // 255
                                                                                                                    //
						var _ref14 = (0, _slicedToArray3.default)(_ref13, 2);                                                         // 255
                                                                                                                    //
						var ch = _ref14[0];                                                                                           // 255
						var messagesMap = _ref14[1];                                                                                  // 255
                                                                                                                    //
						var _ret6 = _loop6(ch, messagesMap);                                                                          // 255
                                                                                                                    //
						if (_ret6 === "continue") continue;                                                                           // 255
					}                                                                                                              // 275
				} //Import the Messages                                                                                         // 276
                                                                                                                    //
                                                                                                                    //
				_Importer$Base.prototype.updateProgress.call(_this3, Importer.ProgressStep.IMPORTING_MESSAGES);                 // 280
                                                                                                                    //
				var _loop7 = function (_ch, _messagesMap) {                                                                     // 165
					var csvChannel = _this3.getChannelFromName(_ch);                                                               // 282
                                                                                                                    //
					if (!csvChannel || !csvChannel.do_import) {                                                                    // 283
						return "continue";                                                                                            // 284
					}                                                                                                              // 285
                                                                                                                    //
					var room = RocketChat.models.Rooms.findOneById(csvChannel.rocketId, {                                          // 287
						fields: {                                                                                                     // 287
							usernames: 1,                                                                                                // 287
							t: 1,                                                                                                        // 287
							name: 1                                                                                                      // 287
						}                                                                                                             // 287
					});                                                                                                            // 287
					Meteor.runAsUser(startedByUserId, function () {                                                                // 288
						var timestamps = {};                                                                                          // 289
                                                                                                                    //
						for (var _iterator14 = _messagesMap.entries(), _isArray14 = Array.isArray(_iterator14), _i14 = 0, _iterator14 = _isArray14 ? _iterator14 : _iterator14[Symbol.iterator]();;) {
							var _ref24;                                                                                                  // 290
                                                                                                                    //
							if (_isArray14) {                                                                                            // 290
								if (_i14 >= _iterator14.length) break;                                                                      // 290
								_ref24 = _iterator14[_i14++];                                                                               // 290
							} else {                                                                                                     // 290
								_i14 = _iterator14.next();                                                                                  // 290
								if (_i14.done) break;                                                                                       // 290
								_ref24 = _i14.value;                                                                                        // 290
							}                                                                                                            // 290
                                                                                                                    //
							var _ref22 = _ref24;                                                                                         // 290
                                                                                                                    //
							var _ref23 = (0, _slicedToArray3.default)(_ref22, 2);                                                        // 290
                                                                                                                    //
							var msgGroupData = _ref23[0];                                                                                // 290
							var msgs = _ref23[1];                                                                                        // 290
                                                                                                                    //
							_Importer$Base.prototype.updateRecord.call(_this3, {                                                         // 291
								'messagesstatus': _ch + "/" + msgGroupData + "." + msgs.messages.length                                     // 291
							});                                                                                                          // 291
                                                                                                                    //
							for (var _iterator15 = msgs.messages, _isArray15 = Array.isArray(_iterator15), _i15 = 0, _iterator15 = _isArray15 ? _iterator15 : _iterator15[Symbol.iterator]();;) {
								var _ref25;                                                                                                 // 292
                                                                                                                    //
								if (_isArray15) {                                                                                           // 292
									if (_i15 >= _iterator15.length) break;                                                                     // 292
									_ref25 = _iterator15[_i15++];                                                                              // 292
								} else {                                                                                                    // 292
									_i15 = _iterator15.next();                                                                                 // 292
									if (_i15.done) break;                                                                                      // 292
									_ref25 = _i15.value;                                                                                       // 292
								}                                                                                                           // 292
                                                                                                                    //
								var msg = _ref25;                                                                                           // 292
                                                                                                                    //
								if (isNaN(new Date(parseInt(msg.ts)))) {                                                                    // 293
									_this3.logger.warn("Timestamp on a message in " + _ch + "/" + msgGroupData + " is invalid");               // 294
                                                                                                                    //
									_Importer$Base.prototype.addCountCompleted.call(_this3, 1);                                                // 295
                                                                                                                    //
									continue;                                                                                                  // 296
								}                                                                                                           // 297
                                                                                                                    //
								var creator = _this3.getUserFromUsername(msg.username);                                                     // 299
                                                                                                                    //
								if (creator) {                                                                                              // 300
									var suffix = '';                                                                                           // 301
                                                                                                                    //
									if (timestamps[msg.ts] === undefined) {                                                                    // 302
										timestamps[msg.ts] = 1;                                                                                   // 303
									} else {                                                                                                   // 304
										suffix = "-" + timestamps[msg.ts];                                                                        // 305
										timestamps[msg.ts] += 1;                                                                                  // 306
									}                                                                                                          // 307
                                                                                                                    //
									var msgObj = {                                                                                             // 308
										_id: "csv-" + csvChannel.id + "-" + msg.ts + suffix,                                                      // 309
										ts: new Date(parseInt(msg.ts)),                                                                           // 310
										msg: msg.text,                                                                                            // 311
										rid: room._id,                                                                                            // 312
										u: {                                                                                                      // 313
											_id: creator._id,                                                                                        // 314
											username: creator.username                                                                               // 315
										}                                                                                                         // 313
									};                                                                                                         // 308
									RocketChat.sendMessage(creator, msgObj, room, true);                                                       // 319
								}                                                                                                           // 320
                                                                                                                    //
								_Importer$Base.prototype.addCountCompleted.call(_this3, 1);                                                 // 322
							}                                                                                                            // 323
						}                                                                                                             // 324
					});                                                                                                            // 325
				};                                                                                                              // 165
                                                                                                                    //
				for (var _iterator12 = _this3.messages.entries(), _isArray12 = Array.isArray(_iterator12), _i12 = 0, _iterator12 = _isArray12 ? _iterator12 : _iterator12[Symbol.iterator]();;) {
					var _ref20;                                                                                                    // 281
                                                                                                                    //
					if (_isArray12) {                                                                                              // 281
						if (_i12 >= _iterator12.length) break;                                                                        // 281
						_ref20 = _iterator12[_i12++];                                                                                 // 281
					} else {                                                                                                       // 281
						_i12 = _iterator12.next();                                                                                    // 281
						if (_i12.done) break;                                                                                         // 281
						_ref20 = _i12.value;                                                                                          // 281
					}                                                                                                              // 281
                                                                                                                    //
					var _ref18 = _ref20;                                                                                           // 281
                                                                                                                    //
					var _ref19 = (0, _slicedToArray3.default)(_ref18, 2);                                                          // 281
                                                                                                                    //
					var _ch = _ref19[0];                                                                                           // 281
					var _messagesMap = _ref19[1];                                                                                  // 281
                                                                                                                    //
					var _ret7 = _loop7(_ch, _messagesMap);                                                                         // 281
                                                                                                                    //
					if (_ret7 === "continue") continue;                                                                            // 281
				}                                                                                                               // 326
                                                                                                                    //
				_Importer$Base.prototype.updateProgress.call(_this3, Importer.ProgressStep.FINISHING);                          // 328
                                                                                                                    //
				_Importer$Base.prototype.updateProgress.call(_this3, Importer.ProgressStep.DONE);                               // 329
                                                                                                                    //
				var timeTook = Date.now() - started;                                                                            // 330
                                                                                                                    //
				_this3.logger.log("CSV Import took " + timeTook + " milliseconds.");                                            // 331
			});                                                                                                              // 332
			return _Importer$Base.prototype.getProgress.call(this);                                                          // 334
		}                                                                                                                 // 335
                                                                                                                    //
		return startImport;                                                                                               // 3
	}();                                                                                                               // 3
                                                                                                                    //
	ImporterCSV.prototype.getSelection = function () {                                                                 // 3
		function getSelection() {                                                                                         // 3
			var selectionUsers = this.users.users.map(function (u) {                                                         // 338
				return new Importer.SelectionUser(u.id, u.username, u.email, false, false, true);                               // 338
			});                                                                                                              // 338
			var selectionChannels = this.channels.channels.map(function (c) {                                                // 339
				return new Importer.SelectionChannel(c.id, c.name, false, true, c.isPrivate);                                   // 339
			});                                                                                                              // 339
			var selectionMessages = this.importRecord.count.messages;                                                        // 340
			return new Importer.Selection(this.name, selectionUsers, selectionChannels, selectionMessages);                  // 342
		}                                                                                                                 // 343
                                                                                                                    //
		return getSelection;                                                                                              // 3
	}();                                                                                                               // 3
                                                                                                                    //
	ImporterCSV.prototype.getChannelFromName = function () {                                                           // 3
		function getChannelFromName(channelName) {                                                                        // 3
			for (var _iterator18 = this.channels.channels, _isArray18 = Array.isArray(_iterator18), _i18 = 0, _iterator18 = _isArray18 ? _iterator18 : _iterator18[Symbol.iterator]();;) {
				var _ref28;                                                                                                     // 346
                                                                                                                    //
				if (_isArray18) {                                                                                               // 346
					if (_i18 >= _iterator18.length) break;                                                                         // 346
					_ref28 = _iterator18[_i18++];                                                                                  // 346
				} else {                                                                                                        // 346
					_i18 = _iterator18.next();                                                                                     // 346
					if (_i18.done) break;                                                                                          // 346
					_ref28 = _i18.value;                                                                                           // 346
				}                                                                                                               // 346
                                                                                                                    //
				var ch = _ref28;                                                                                                // 346
                                                                                                                    //
				if (ch.name === channelName) {                                                                                  // 347
					return ch;                                                                                                     // 348
				}                                                                                                               // 349
			}                                                                                                                // 350
		}                                                                                                                 // 351
                                                                                                                    //
		return getChannelFromName;                                                                                        // 3
	}();                                                                                                               // 3
                                                                                                                    //
	ImporterCSV.prototype.getUserFromUsername = function () {                                                          // 3
		function getUserFromUsername(username) {                                                                          // 3
			for (var _iterator19 = this.users.users, _isArray19 = Array.isArray(_iterator19), _i19 = 0, _iterator19 = _isArray19 ? _iterator19 : _iterator19[Symbol.iterator]();;) {
				var _ref29;                                                                                                     // 354
                                                                                                                    //
				if (_isArray19) {                                                                                               // 354
					if (_i19 >= _iterator19.length) break;                                                                         // 354
					_ref29 = _iterator19[_i19++];                                                                                  // 354
				} else {                                                                                                        // 354
					_i19 = _iterator19.next();                                                                                     // 354
					if (_i19.done) break;                                                                                          // 354
					_ref29 = _i19.value;                                                                                           // 354
				}                                                                                                               // 354
                                                                                                                    //
				var u = _ref29;                                                                                                 // 354
                                                                                                                    //
				if (u.username === username) {                                                                                  // 355
					return RocketChat.models.Users.findOneById(u.rocketId, {                                                       // 356
						fields: {                                                                                                     // 356
							username: 1                                                                                                  // 356
						}                                                                                                             // 356
					});                                                                                                            // 356
				}                                                                                                               // 357
			}                                                                                                                // 358
		}                                                                                                                 // 359
                                                                                                                    //
		return getUserFromUsername;                                                                                       // 3
	}();                                                                                                               // 3
                                                                                                                    //
	return ImporterCSV;                                                                                                // 3
}(Importer.Base);                                                                                                   // 3
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"main.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/rocketchat_importer-csv/main.js                                                                         //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
/* globals Importer */Importer.addImporter('csv', Importer.CSV, {                                                   // 1
	name: 'CSV',                                                                                                       // 4
	warnings: [{                                                                                                       // 5
		text: 'Importer_CSV_Information',                                                                                 // 6
		href: 'https://rocket.chat/docs/administrator-guides/import/csv/'                                                 // 7
	}],                                                                                                                // 5
	mimeType: 'application/zip'                                                                                        // 9
});                                                                                                                 // 3
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:importer-csv/server.js");
require("./node_modules/meteor/rocketchat:importer-csv/main.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:importer-csv'] = {};

})();

//# sourceMappingURL=rocketchat_importer-csv.js.map

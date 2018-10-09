(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var DDPRateLimiter = Package['ddp-rate-limiter'].DDPRateLimiter;
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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:autotranslate":{"server":{"settings.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/rocketchat_autotranslate/server/settings.js                                                          //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Meteor.startup(function () {                                                                                     // 1
	RocketChat.settings.add('AutoTranslate_Enabled', false, {                                                       // 2
		type: 'boolean',                                                                                               // 2
		group: 'Message',                                                                                              // 2
		section: 'AutoTranslate',                                                                                      // 2
		"public": true                                                                                                 // 2
	});                                                                                                             // 2
	RocketChat.settings.add('AutoTranslate_GoogleAPIKey', '', {                                                     // 3
		type: 'string',                                                                                                // 3
		group: 'Message',                                                                                              // 3
		section: 'AutoTranslate',                                                                                      // 3
		enableQuery: {                                                                                                 // 3
			_id: 'AutoTranslate_Enabled',                                                                                 // 3
			value: true                                                                                                   // 3
		}                                                                                                              // 3
	});                                                                                                             // 3
});                                                                                                              // 4
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"autotranslate.js":function(require){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/rocketchat_autotranslate/server/autotranslate.js                                                     //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                          //
                                                                                                                 //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                 //
                                                                                                                 //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                //
                                                                                                                 //
var AutoTranslate = function () {                                                                                //
	function AutoTranslate() {                                                                                      // 2
		var _this = this;                                                                                              // 2
                                                                                                                 //
		(0, _classCallCheck3.default)(this, AutoTranslate);                                                            // 2
		this.languages = [];                                                                                           // 3
		this.enabled = RocketChat.settings.get('AutoTranslate_Enabled');                                               // 4
		this.apiKey = RocketChat.settings.get('AutoTranslate_GoogleAPIKey');                                           // 5
		this.supportedLanguages = {};                                                                                  // 6
		RocketChat.callbacks.add('afterSaveMessage', this.translateMessage.bind(this), RocketChat.callbacks.priority.MEDIUM, 'AutoTranslate');
		RocketChat.settings.get('AutoTranslate_Enabled', function (key, value) {                                       // 9
			_this.enabled = value;                                                                                        // 10
		});                                                                                                            // 11
		RocketChat.settings.get('AutoTranslate_GoogleAPIKey', function (key, value) {                                  // 12
			_this.apiKey = value;                                                                                         // 13
		});                                                                                                            // 14
	}                                                                                                               // 15
                                                                                                                 //
	AutoTranslate.prototype.tokenize = function () {                                                                //
		function tokenize(message) {                                                                                   //
			message = this.tokenizeEmojis(message);                                                                       // 18
			message = this.tokenizeCode(message);                                                                         // 19
			message = this.tokenizeURLs(message);                                                                         // 20
			message = this.tokenizeMentions(message);                                                                     // 21
			return message;                                                                                               // 22
		}                                                                                                              // 23
                                                                                                                 //
		return tokenize;                                                                                               //
	}();                                                                                                            //
                                                                                                                 //
	AutoTranslate.prototype.tokenizeEmojis = function () {                                                          //
		function tokenizeEmojis(message) {                                                                             //
			if (!message.tokens || !Array.isArray(message.tokens)) {                                                      // 26
				message.tokens = [];                                                                                         // 27
			}                                                                                                             // 28
                                                                                                                 //
			var count = message.tokens.length;                                                                            // 29
			message.msg = message.msg.replace(/:[+\w\d]+:/g, function (match) {                                           // 30
				var token = "<i class=notranslate>{" + count++ + "}</i>";                                                    // 31
				message.tokens.push({                                                                                        // 32
					token: token,                                                                                               // 33
					text: match                                                                                                 // 34
				});                                                                                                          // 32
				return token;                                                                                                // 36
			});                                                                                                           // 37
			return message;                                                                                               // 39
		}                                                                                                              // 40
                                                                                                                 //
		return tokenizeEmojis;                                                                                         //
	}();                                                                                                            //
                                                                                                                 //
	AutoTranslate.prototype.tokenizeURLs = function () {                                                            //
		function tokenizeURLs(message) {                                                                               //
			if (!message.tokens || !Array.isArray(message.tokens)) {                                                      // 43
				message.tokens = [];                                                                                         // 44
			}                                                                                                             // 45
                                                                                                                 //
			var count = message.tokens.length;                                                                            // 46
			var schemes = RocketChat.settings.get('Markdown_SupportSchemesForLink').split(',').join('|'); // Support ![alt text](http://image url) and [text](http://link)
                                                                                                                 //
			message.msg = message.msg.replace(new RegExp("(!?\\[)([^\\]]+)(\\]\\((?:" + schemes + "):\\/\\/[^\\)]+\\))", 'gm'), function (match, pre, text, post) {
				var pretoken = "<i class=notranslate>{" + count++ + "}</i>";                                                 // 52
				message.tokens.push({                                                                                        // 53
					token: pretoken,                                                                                            // 54
					text: pre                                                                                                   // 55
				});                                                                                                          // 53
				var posttoken = "<i class=notranslate>{" + count++ + "}</i>";                                                // 58
				message.tokens.push({                                                                                        // 59
					token: posttoken,                                                                                           // 60
					text: post                                                                                                  // 61
				});                                                                                                          // 59
				return pretoken + text + posttoken;                                                                          // 64
			}); // Support <http://link|Text>                                                                             // 65
                                                                                                                 //
			message.msg = message.msg.replace(new RegExp("((?:<|&lt;)(?:" + schemes + "):\\/\\/[^\\|]+\\|)(.+?)(?=>|&gt;)((?:>|&gt;))", 'gm'), function (match, pre, text, post) {
				var pretoken = "<i class=notranslate>{" + count++ + "}</i>";                                                 // 69
				message.tokens.push({                                                                                        // 70
					token: pretoken,                                                                                            // 71
					text: pre                                                                                                   // 72
				});                                                                                                          // 70
				var posttoken = "<i class=notranslate>{" + count++ + "}</i>";                                                // 75
				message.tokens.push({                                                                                        // 76
					token: posttoken,                                                                                           // 77
					text: post                                                                                                  // 78
				});                                                                                                          // 76
				return pretoken + text + posttoken;                                                                          // 81
			});                                                                                                           // 82
			return message;                                                                                               // 84
		}                                                                                                              // 85
                                                                                                                 //
		return tokenizeURLs;                                                                                           //
	}();                                                                                                            //
                                                                                                                 //
	AutoTranslate.prototype.tokenizeCode = function () {                                                            //
		function tokenizeCode(message) {                                                                               //
			if (!message.tokens || !Array.isArray(message.tokens)) {                                                      // 88
				message.tokens = [];                                                                                         // 89
			}                                                                                                             // 90
                                                                                                                 //
			var count = message.tokens.length;                                                                            // 91
			message.html = message.msg;                                                                                   // 93
			RocketChat.MarkdownCode.handle_codeblocks(message);                                                           // 94
			RocketChat.MarkdownCode.handle_inlinecode(message);                                                           // 95
			message.msg = message.html;                                                                                   // 96
                                                                                                                 //
			for (var tokenIndex in meteorBabelHelpers.sanitizeForInObject(message.tokens)) {                              // 98
				if (message.tokens.hasOwnProperty(tokenIndex)) {                                                             // 99
					var token = message.tokens[tokenIndex].token;                                                               // 100
                                                                                                                 //
					if (token.indexOf('notranslate') === -1) {                                                                  // 101
						var newToken = "<i class=notranslate>{" + count++ + "}</i>";                                               // 102
						message.msg = message.msg.replace(token, newToken);                                                        // 103
						message.tokens[tokenIndex].token = newToken;                                                               // 104
					}                                                                                                           // 105
				}                                                                                                            // 106
			}                                                                                                             // 107
                                                                                                                 //
			return message;                                                                                               // 109
		}                                                                                                              // 110
                                                                                                                 //
		return tokenizeCode;                                                                                           //
	}();                                                                                                            //
                                                                                                                 //
	AutoTranslate.prototype.tokenizeMentions = function () {                                                        //
		function tokenizeMentions(message) {                                                                           //
			if (!message.tokens || !Array.isArray(message.tokens)) {                                                      // 113
				message.tokens = [];                                                                                         // 114
			}                                                                                                             // 115
                                                                                                                 //
			var count = message.tokens.length;                                                                            // 116
                                                                                                                 //
			if (message.mentions && message.mentions.length > 0) {                                                        // 118
				message.mentions.forEach(function (mention) {                                                                // 119
					message.msg = message.msg.replace(new RegExp("(@" + mention.username + ")", 'gm'), function (match) {       // 120
						var token = "<i class=notranslate>{" + count++ + "}</i>";                                                  // 121
						message.tokens.push({                                                                                      // 122
							token: token,                                                                                             // 123
							text: match                                                                                               // 124
						});                                                                                                        // 122
						return token;                                                                                              // 126
					});                                                                                                         // 127
				});                                                                                                          // 128
			}                                                                                                             // 129
                                                                                                                 //
			if (message.channels && message.channels.length > 0) {                                                        // 131
				message.channels.forEach(function (channel) {                                                                // 132
					message.msg = message.msg.replace(new RegExp("(#" + channel.name + ")", 'gm'), function (match) {           // 133
						var token = "<i class=notranslate>{" + count++ + "}</i>";                                                  // 134
						message.tokens.push({                                                                                      // 135
							token: token,                                                                                             // 136
							text: match                                                                                               // 137
						});                                                                                                        // 135
						return token;                                                                                              // 139
					});                                                                                                         // 140
				});                                                                                                          // 141
			}                                                                                                             // 142
                                                                                                                 //
			return message;                                                                                               // 144
		}                                                                                                              // 145
                                                                                                                 //
		return tokenizeMentions;                                                                                       //
	}();                                                                                                            //
                                                                                                                 //
	AutoTranslate.prototype.deTokenize = function () {                                                              //
		function deTokenize(message) {                                                                                 //
			if (message.tokens && message.tokens.length > 0) {                                                            // 148
				var _loop = function (token, text, noHtml) {                                                                 // 148
					message.msg = message.msg.replace(token, function () {                                                      // 150
						return noHtml ? noHtml : text;                                                                             // 150
					});                                                                                                         // 150
				};                                                                                                           // 148
                                                                                                                 //
				for (var _iterator = message.tokens, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
					var _ref2;                                                                                                  // 149
                                                                                                                 //
					if (_isArray) {                                                                                             // 149
						if (_i >= _iterator.length) break;                                                                         // 149
						_ref2 = _iterator[_i++];                                                                                   // 149
					} else {                                                                                                    // 149
						_i = _iterator.next();                                                                                     // 149
						if (_i.done) break;                                                                                        // 149
						_ref2 = _i.value;                                                                                          // 149
					}                                                                                                           // 149
                                                                                                                 //
					var _ref = _ref2;                                                                                           // 149
					var token = _ref.token;                                                                                     // 149
					var text = _ref.text;                                                                                       // 149
					var noHtml = _ref.noHtml;                                                                                   // 149
                                                                                                                 //
					_loop(token, text, noHtml);                                                                                 // 149
				}                                                                                                            // 151
			}                                                                                                             // 152
                                                                                                                 //
			return message.msg;                                                                                           // 153
		}                                                                                                              // 154
                                                                                                                 //
		return deTokenize;                                                                                             //
	}();                                                                                                            //
                                                                                                                 //
	AutoTranslate.prototype.translateMessage = function () {                                                        //
		function translateMessage(message, room, targetLanguage) {                                                     //
			var _this2 = this;                                                                                            // 156
                                                                                                                 //
			if (this.enabled && this.apiKey) {                                                                            // 157
				var targetLanguages = void 0;                                                                                // 158
                                                                                                                 //
				if (targetLanguage) {                                                                                        // 159
					targetLanguages = [targetLanguage];                                                                         // 160
				} else {                                                                                                     // 161
					targetLanguages = RocketChat.models.Subscriptions.getAutoTranslateLanguagesByRoomAndNotUser(room._id, message.u && message.u._id);
				}                                                                                                            // 163
                                                                                                                 //
				if (message.msg) {                                                                                           // 164
					Meteor.defer(function () {                                                                                  // 165
						var translations = {};                                                                                     // 166
						var targetMessage = Object.assign({}, message);                                                            // 167
						targetMessage.html = s.escapeHTML(String(targetMessage.msg));                                              // 169
						targetMessage = _this2.tokenize(targetMessage);                                                            // 170
						var msgs = targetMessage.msg.split('\n');                                                                  // 172
						msgs = msgs.map(function (msg) {                                                                           // 173
							return encodeURIComponent(msg);                                                                           // 173
						});                                                                                                        // 173
						var query = "q=" + msgs.join('&q=');                                                                       // 174
                                                                                                                 //
						var supportedLanguages = _this2.getSupportedLanguages('en');                                               // 176
                                                                                                                 //
						targetLanguages.forEach(function (language) {                                                              // 177
							if (language.indexOf('-') !== -1 && !_.findWhere(supportedLanguages, {                                    // 178
								language: language                                                                                       // 178
							})) {                                                                                                     // 178
								language = language.substr(0, 2);                                                                        // 179
							}                                                                                                         // 180
                                                                                                                 //
							var result = void 0;                                                                                      // 181
                                                                                                                 //
							try {                                                                                                     // 182
								result = HTTP.get('https://translation.googleapis.com/language/translate/v2', {                          // 183
									params: {                                                                                               // 183
										key: _this2.apiKey,                                                                                    // 183
										target: language                                                                                       // 183
									},                                                                                                      // 183
									query: query                                                                                            // 183
								});                                                                                                      // 183
							} catch (e) {                                                                                             // 184
								console.log('Error translating message', e);                                                             // 185
								return message;                                                                                          // 186
							}                                                                                                         // 187
                                                                                                                 //
							if (result.statusCode === 200 && result.data && result.data.data && result.data.data.translations && Array.isArray(result.data.data.translations) && result.data.data.translations.length > 0) {
								var txt = result.data.data.translations.map(function (translation) {                                     // 189
									return translation.translatedText;                                                                      // 189
								}).join('\n');                                                                                           // 189
								translations[language] = _this2.deTokenize(Object.assign({}, targetMessage, {                            // 190
									msg: txt                                                                                                // 190
								}));                                                                                                     // 190
							}                                                                                                         // 191
						});                                                                                                        // 192
                                                                                                                 //
						if (!_.isEmpty(translations)) {                                                                            // 193
							RocketChat.models.Messages.addTranslations(message._id, translations);                                    // 194
						}                                                                                                          // 195
					});                                                                                                         // 196
				}                                                                                                            // 197
                                                                                                                 //
				if (message.attachments && message.attachments.length > 0) {                                                 // 199
					Meteor.defer(function () {                                                                                  // 200
						for (var index in meteorBabelHelpers.sanitizeForInObject(message.attachments)) {                           // 201
							if (message.attachments.hasOwnProperty(index)) {                                                          // 202
								(function () {                                                                                           // 202
									var attachment = message.attachments[index];                                                            // 203
									var translations = {};                                                                                  // 204
                                                                                                                 //
									if (attachment.description || attachment.text) {                                                        // 205
										var query = "q=" + encodeURIComponent(attachment.description || attachment.text);                      // 206
                                                                                                                 //
										var supportedLanguages = _this2.getSupportedLanguages('en');                                           // 207
                                                                                                                 //
										targetLanguages.forEach(function (language) {                                                          // 208
											if (language.indexOf('-') !== -1 && !_.findWhere(supportedLanguages, {                                // 209
												language: language                                                                                   // 209
											})) {                                                                                                 // 209
												language = language.substr(0, 2);                                                                    // 210
											}                                                                                                     // 211
                                                                                                                 //
											var result = HTTP.get('https://translation.googleapis.com/language/translate/v2', {                   // 212
												params: {                                                                                            // 212
													key: _this2.apiKey,                                                                                 // 212
													target: language                                                                                    // 212
												},                                                                                                   // 212
												query: query                                                                                         // 212
											});                                                                                                   // 212
                                                                                                                 //
											if (result.statusCode === 200 && result.data && result.data.data && result.data.data.translations && Array.isArray(result.data.data.translations) && result.data.data.translations.length > 0) {
												var txt = result.data.data.translations.map(function (translation) {                                 // 214
													return translation.translatedText;                                                                  // 214
												}).join('\n');                                                                                       // 214
												translations[language] = txt;                                                                        // 215
											}                                                                                                     // 216
										});                                                                                                    // 217
                                                                                                                 //
										if (!_.isEmpty(translations)) {                                                                        // 218
											RocketChat.models.Messages.addAttachmentTranslations(message._id, index, translations);               // 219
										}                                                                                                      // 220
									}                                                                                                       // 221
								})();                                                                                                    // 202
							}                                                                                                         // 222
						}                                                                                                          // 223
					});                                                                                                         // 224
				}                                                                                                            // 225
			}                                                                                                             // 226
                                                                                                                 //
			return message;                                                                                               // 227
		}                                                                                                              // 228
                                                                                                                 //
		return translateMessage;                                                                                       //
	}();                                                                                                            //
                                                                                                                 //
	AutoTranslate.prototype.getSupportedLanguages = function () {                                                   //
		function getSupportedLanguages(target) {                                                                       //
			if (this.enabled && this.apiKey) {                                                                            // 231
				if (this.supportedLanguages[target]) {                                                                       // 232
					return this.supportedLanguages[target];                                                                     // 233
				}                                                                                                            // 234
                                                                                                                 //
				var result = void 0;                                                                                         // 236
				var params = {                                                                                               // 237
					key: this.apiKey                                                                                            // 237
				};                                                                                                           // 237
                                                                                                                 //
				if (target) {                                                                                                // 238
					params.target = target;                                                                                     // 239
				}                                                                                                            // 240
                                                                                                                 //
				try {                                                                                                        // 242
					result = HTTP.get('https://translation.googleapis.com/language/translate/v2/languages', {                   // 243
						params: params                                                                                             // 243
					});                                                                                                         // 243
				} catch (e) {                                                                                                // 244
					if (e.response && e.response.statusCode === 400 && e.response.data && e.response.data.error && e.response.data.error.status === 'INVALID_ARGUMENT') {
						params.target = 'en';                                                                                      // 246
						target = 'en';                                                                                             // 247
                                                                                                                 //
						if (!this.supportedLanguages[target]) {                                                                    // 248
							result = HTTP.get('https://translation.googleapis.com/language/translate/v2/languages', {                 // 249
								params: params                                                                                           // 249
							});                                                                                                       // 249
						}                                                                                                          // 250
					}                                                                                                           // 251
				} finally {                                                                                                  // 252
					if (this.supportedLanguages[target]) {                                                                      // 253
						return this.supportedLanguages[target];                                                                    // 254
					} else {                                                                                                    // 255
						this.supportedLanguages[target || 'en'] = result && result.data && result.data.data && result.data.data.languages;
						return this.supportedLanguages[target || 'en'];                                                            // 257
					}                                                                                                           // 258
				}                                                                                                            // 259
			}                                                                                                             // 260
		}                                                                                                              // 261
                                                                                                                 //
		return getSupportedLanguages;                                                                                  //
	}();                                                                                                            //
                                                                                                                 //
	return AutoTranslate;                                                                                           //
}();                                                                                                             //
                                                                                                                 //
RocketChat.AutoTranslate = new AutoTranslate();                                                                  // 264
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"permissions.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/rocketchat_autotranslate/server/permissions.js                                                       //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Meteor.startup(function () {                                                                                     // 1
	if (RocketChat.models && RocketChat.models.Permissions) {                                                       // 2
		if (!RocketChat.models.Permissions.findOne({                                                                   // 3
			_id: 'auto-translate'                                                                                         // 3
		})) {                                                                                                          // 3
			RocketChat.models.Permissions.insert({                                                                        // 4
				_id: 'auto-translate',                                                                                       // 4
				roles: ['admin']                                                                                             // 4
			});                                                                                                           // 4
		}                                                                                                              // 5
	}                                                                                                               // 6
});                                                                                                              // 7
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"models":{"Messages.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/rocketchat_autotranslate/server/models/Messages.js                                                   //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
RocketChat.models.Messages.addTranslations = function (messageId, translations) {                                // 1
	var updateObj = {};                                                                                             // 2
	Object.keys(translations).forEach(function (key) {                                                              // 3
		var translation = translations[key];                                                                           // 4
		updateObj["translations." + key] = translation;                                                                // 5
	});                                                                                                             // 6
	return this.update({                                                                                            // 7
		_id: messageId                                                                                                 // 7
	}, {                                                                                                            // 7
		$set: updateObj                                                                                                // 7
	});                                                                                                             // 7
};                                                                                                               // 8
                                                                                                                 //
RocketChat.models.Messages.addAttachmentTranslations = function (messageId, attachmentIndex, translations) {     // 10
	var updateObj = {};                                                                                             // 11
	Object.keys(translations).forEach(function (key) {                                                              // 12
		var translation = translations[key];                                                                           // 13
		updateObj["attachments." + attachmentIndex + ".translations." + key] = translation;                            // 14
	});                                                                                                             // 15
	return this.update({                                                                                            // 16
		_id: messageId                                                                                                 // 16
	}, {                                                                                                            // 16
		$set: updateObj                                                                                                // 16
	});                                                                                                             // 16
};                                                                                                               // 17
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Subscriptions.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/rocketchat_autotranslate/server/models/Subscriptions.js                                              //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
RocketChat.models.Subscriptions.updateAutoTranslateById = function (_id, autoTranslate) {                        // 1
	var query = {                                                                                                   // 2
		_id: _id                                                                                                       // 3
	};                                                                                                              // 2
	var update = void 0;                                                                                            // 6
                                                                                                                 //
	if (autoTranslate) {                                                                                            // 7
		update = {                                                                                                     // 8
			$set: {                                                                                                       // 9
				autoTranslate: autoTranslate                                                                                 // 10
			}                                                                                                             // 9
		};                                                                                                             // 8
	} else {                                                                                                        // 13
		update = {                                                                                                     // 14
			$unset: {                                                                                                     // 15
				autoTranslate: 1                                                                                             // 16
			}                                                                                                             // 15
		};                                                                                                             // 14
	}                                                                                                               // 19
                                                                                                                 //
	return this.update(query, update);                                                                              // 21
};                                                                                                               // 22
                                                                                                                 //
RocketChat.models.Subscriptions.updateAutoTranslateLanguageById = function (_id, autoTranslateLanguage) {        // 24
	var query = {                                                                                                   // 25
		_id: _id                                                                                                       // 26
	};                                                                                                              // 25
	var update = {                                                                                                  // 29
		$set: {                                                                                                        // 30
			autoTranslateLanguage: autoTranslateLanguage                                                                  // 31
		}                                                                                                              // 30
	};                                                                                                              // 29
	return this.update(query, update);                                                                              // 35
};                                                                                                               // 36
                                                                                                                 //
RocketChat.models.Subscriptions.getAutoTranslateLanguagesByRoomAndNotUser = function (rid, userId) {             // 38
	var subscriptionsRaw = RocketChat.models.Subscriptions.model.rawCollection();                                   // 39
	var distinct = Meteor.wrapAsync(subscriptionsRaw.distinct, subscriptionsRaw);                                   // 40
	var query = {                                                                                                   // 41
		rid: rid,                                                                                                      // 42
		'u._id': {                                                                                                     // 43
			$ne: userId                                                                                                   // 43
		},                                                                                                             // 43
		autoTranslate: true                                                                                            // 44
	};                                                                                                              // 41
	return distinct('autoTranslateLanguage', query);                                                                // 46
};                                                                                                               // 47
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods":{"saveSettings.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/rocketchat_autotranslate/server/methods/saveSettings.js                                              //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Meteor.methods({                                                                                                 // 1
	'autoTranslate.saveSettings': function (rid, field, value, options) {                                           // 2
		if (!Meteor.userId()) {                                                                                        // 3
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                // 4
				method: 'saveAutoTranslateSettings'                                                                          // 4
			});                                                                                                           // 4
		}                                                                                                              // 5
                                                                                                                 //
		if (!RocketChat.authz.hasPermission(Meteor.userId(), 'auto-translate')) {                                      // 7
			throw new Meteor.Error('error-action-now-allowed', 'Auto-Translate is not allowed', {                         // 8
				method: 'autoTranslate.saveSettings'                                                                         // 8
			});                                                                                                           // 8
		}                                                                                                              // 9
                                                                                                                 //
		check(rid, String);                                                                                            // 11
		check(field, String);                                                                                          // 12
		check(value, String);                                                                                          // 13
                                                                                                                 //
		if (['autoTranslate', 'autoTranslateLanguage'].indexOf(field) === -1) {                                        // 15
			throw new Meteor.Error('error-invalid-settings', 'Invalid settings field', {                                  // 16
				method: 'saveAutoTranslateSettings'                                                                          // 16
			});                                                                                                           // 16
		}                                                                                                              // 17
                                                                                                                 //
		var subscription = RocketChat.models.Subscriptions.findOneByRoomIdAndUserId(rid, Meteor.userId());             // 19
                                                                                                                 //
		if (!subscription) {                                                                                           // 20
			throw new Meteor.Error('error-invalid-subscription', 'Invalid subscription', {                                // 21
				method: 'saveAutoTranslateSettings'                                                                          // 21
			});                                                                                                           // 21
		}                                                                                                              // 22
                                                                                                                 //
		switch (field) {                                                                                               // 24
			case 'autoTranslate':                                                                                         // 25
				RocketChat.models.Subscriptions.updateAutoTranslateById(subscription._id, value === '1' ? true : false);     // 26
                                                                                                                 //
				if (!subscription.autoTranslateLanguage && options.defaultLanguage) {                                        // 27
					RocketChat.models.Subscriptions.updateAutoTranslateLanguageById(subscription._id, options.defaultLanguage);
				}                                                                                                            // 29
                                                                                                                 //
				break;                                                                                                       // 30
                                                                                                                 //
			case 'autoTranslateLanguage':                                                                                 // 31
				RocketChat.models.Subscriptions.updateAutoTranslateLanguageById(subscription._id, value);                    // 32
				break;                                                                                                       // 33
		}                                                                                                              // 24
                                                                                                                 //
		return true;                                                                                                   // 36
	}                                                                                                               // 37
});                                                                                                              // 1
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"translateMessage.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/rocketchat_autotranslate/server/methods/translateMessage.js                                          //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Meteor.methods({                                                                                                 // 1
	'autoTranslate.translateMessage': function (message, targetLanguage) {                                          // 2
		var room = RocketChat.models.Rooms.findOneById(message && message.rid);                                        // 3
                                                                                                                 //
		if (message && room && RocketChat.AutoTranslate) {                                                             // 4
			return RocketChat.AutoTranslate.translateMessage(message, room, targetLanguage);                              // 5
		}                                                                                                              // 6
	}                                                                                                               // 7
});                                                                                                              // 1
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getSupportedLanguages.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/rocketchat_autotranslate/server/methods/getSupportedLanguages.js                                     //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Meteor.methods({                                                                                                 // 1
	'autoTranslate.getSupportedLanguages': function (targetLanguage) {                                              // 2
		if (!RocketChat.authz.hasPermission(Meteor.userId(), 'auto-translate')) {                                      // 3
			throw new Meteor.Error('error-action-now-allowed', 'Auto-Translate is not allowed', {                         // 4
				method: 'autoTranslate.saveSettings'                                                                         // 4
			});                                                                                                           // 4
		}                                                                                                              // 5
                                                                                                                 //
		return RocketChat.AutoTranslate.getSupportedLanguages(targetLanguage);                                         // 7
	}                                                                                                               // 8
});                                                                                                              // 1
DDPRateLimiter.addRule({                                                                                         // 11
	type: 'method',                                                                                                 // 12
	name: 'autoTranslate.getSupportedLanguages',                                                                    // 13
	userId: function () /*userId*/{                                                                                 // 14
		return true;                                                                                                   // 15
	}                                                                                                               // 16
}, 5, 60000);                                                                                                    // 11
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:autotranslate/server/settings.js");
require("./node_modules/meteor/rocketchat:autotranslate/server/autotranslate.js");
require("./node_modules/meteor/rocketchat:autotranslate/server/permissions.js");
require("./node_modules/meteor/rocketchat:autotranslate/server/models/Messages.js");
require("./node_modules/meteor/rocketchat:autotranslate/server/models/Subscriptions.js");
require("./node_modules/meteor/rocketchat:autotranslate/server/methods/saveSettings.js");
require("./node_modules/meteor/rocketchat:autotranslate/server/methods/translateMessage.js");
require("./node_modules/meteor/rocketchat:autotranslate/server/methods/getSupportedLanguages.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:autotranslate'] = {};

})();

//# sourceMappingURL=rocketchat_autotranslate.js.map

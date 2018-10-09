(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var _ = Package.underscore._;
var ECMAScript = Package.ecmascript.ECMAScript;
var Babel = Package['babel-compiler'].Babel;
var BabelCompiler = Package['babel-compiler'].BabelCompiler;
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
var logger, Api;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:integrations":{"lib":{"rocketchat.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_integrations/lib/rocketchat.js                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.integrations = {                                                                                            // 1
	outgoingEvents: {                                                                                                     // 2
		sendMessage: {                                                                                                       // 3
			label: 'Integrations_Outgoing_Type_SendMessage',                                                                    // 4
			value: 'sendMessage',                                                                                               // 5
			use: {                                                                                                              // 6
				channel: true,                                                                                                     // 7
				triggerWords: true,                                                                                                // 8
				targetRoom: false                                                                                                  // 9
			}                                                                                                                   // 6
		},                                                                                                                   // 3
		fileUploaded: {                                                                                                      // 12
			label: 'Integrations_Outgoing_Type_FileUploaded',                                                                   // 13
			value: 'fileUploaded',                                                                                              // 14
			use: {                                                                                                              // 15
				channel: true,                                                                                                     // 16
				triggerWords: false,                                                                                               // 17
				targetRoom: false                                                                                                  // 18
			}                                                                                                                   // 15
		},                                                                                                                   // 12
		roomArchived: {                                                                                                      // 21
			label: 'Integrations_Outgoing_Type_RoomArchived',                                                                   // 22
			value: 'roomArchived',                                                                                              // 23
			use: {                                                                                                              // 24
				channel: false,                                                                                                    // 25
				triggerWords: false,                                                                                               // 26
				targetRoom: false                                                                                                  // 27
			}                                                                                                                   // 24
		},                                                                                                                   // 21
		roomCreated: {                                                                                                       // 30
			label: 'Integrations_Outgoing_Type_RoomCreated',                                                                    // 31
			value: 'roomCreated',                                                                                               // 32
			use: {                                                                                                              // 33
				channel: false,                                                                                                    // 34
				triggerWords: false,                                                                                               // 35
				targetRoom: false                                                                                                  // 36
			}                                                                                                                   // 33
		},                                                                                                                   // 30
		roomJoined: {                                                                                                        // 39
			label: 'Integrations_Outgoing_Type_RoomJoined',                                                                     // 40
			value: 'roomJoined',                                                                                                // 41
			use: {                                                                                                              // 42
				channel: true,                                                                                                     // 43
				triggerWords: false,                                                                                               // 44
				targetRoom: false                                                                                                  // 45
			}                                                                                                                   // 42
		},                                                                                                                   // 39
		roomLeft: {                                                                                                          // 48
			label: 'Integrations_Outgoing_Type_RoomLeft',                                                                       // 49
			value: 'roomLeft',                                                                                                  // 50
			use: {                                                                                                              // 51
				channel: true,                                                                                                     // 52
				triggerWords: false,                                                                                               // 53
				targetRoom: false                                                                                                  // 54
			}                                                                                                                   // 51
		},                                                                                                                   // 48
		userCreated: {                                                                                                       // 57
			label: 'Integrations_Outgoing_Type_UserCreated',                                                                    // 58
			value: 'userCreated',                                                                                               // 59
			use: {                                                                                                              // 60
				channel: false,                                                                                                    // 61
				triggerWords: false,                                                                                               // 62
				targetRoom: true                                                                                                   // 63
			}                                                                                                                   // 60
		}                                                                                                                    // 57
	}                                                                                                                     // 2
};                                                                                                                     // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"logger.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_integrations/server/logger.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals logger:true */ /* exported logger */logger = new Logger('Integrations', {                                   // 1
	sections: {                                                                                                           // 5
		incoming: 'Incoming WebHook',                                                                                        // 6
		outgoing: 'Outgoing WebHook'                                                                                         // 7
	}                                                                                                                     // 5
});                                                                                                                    // 4
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"validation.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_integrations/server/lib/validation.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");                                                  //
                                                                                                                       //
var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);                                                         //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
/* global Babel */var scopedChannels = ['all_public_channels', 'all_private_groups', 'all_direct_messages'];           // 1
var validChannelChars = ['@', '#'];                                                                                    // 3
                                                                                                                       //
function _verifyRequiredFields(integration) {                                                                          // 5
	if (!integration.event || !Match.test(integration.event, String) || integration.event.trim() === '' || !RocketChat.integrations.outgoingEvents[integration.event]) {
		throw new Meteor.Error('error-invalid-event-type', 'Invalid event type', {                                           // 7
			"function": 'validateOutgoing._verifyRequiredFields'                                                                // 7
		});                                                                                                                  // 7
	}                                                                                                                     // 8
                                                                                                                       //
	if (!integration.username || !Match.test(integration.username, String) || integration.username.trim() === '') {       // 10
		throw new Meteor.Error('error-invalid-username', 'Invalid username', {                                               // 11
			"function": 'validateOutgoing._verifyRequiredFields'                                                                // 11
		});                                                                                                                  // 11
	}                                                                                                                     // 12
                                                                                                                       //
	if (RocketChat.integrations.outgoingEvents[integration.event].use.targetRoom && !integration.targetRoom) {            // 14
		throw new Meteor.Error('error-invalid-targetRoom', 'Invalid Target Room', {                                          // 15
			"function": 'validateOutgoing._verifyRequiredFields'                                                                // 15
		});                                                                                                                  // 15
	}                                                                                                                     // 16
                                                                                                                       //
	if (!Match.test(integration.urls, [String])) {                                                                        // 18
		throw new Meteor.Error('error-invalid-urls', 'Invalid URLs', {                                                       // 19
			"function": 'validateOutgoing._verifyRequiredFields'                                                                // 19
		});                                                                                                                  // 19
	}                                                                                                                     // 20
                                                                                                                       //
	for (var _iterator = integration.urls.entries(), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
		var _ref3;                                                                                                           // 22
                                                                                                                       //
		if (_isArray) {                                                                                                      // 22
			if (_i >= _iterator.length) break;                                                                                  // 22
			_ref3 = _iterator[_i++];                                                                                            // 22
		} else {                                                                                                             // 22
			_i = _iterator.next();                                                                                              // 22
			if (_i.done) break;                                                                                                 // 22
			_ref3 = _i.value;                                                                                                   // 22
		}                                                                                                                    // 22
                                                                                                                       //
		var _ref = _ref3;                                                                                                    // 22
                                                                                                                       //
		var _ref2 = (0, _slicedToArray3.default)(_ref, 2);                                                                   // 22
                                                                                                                       //
		var index = _ref2[0];                                                                                                // 22
		var url = _ref2[1];                                                                                                  // 22
                                                                                                                       //
		if (url.trim() === '') {                                                                                             // 23
			delete integration.urls[index];                                                                                     // 24
		}                                                                                                                    // 25
	}                                                                                                                     // 26
                                                                                                                       //
	integration.urls = _.without(integration.urls, [undefined]);                                                          // 28
                                                                                                                       //
	if (integration.urls.length === 0) {                                                                                  // 30
		throw new Meteor.Error('error-invalid-urls', 'Invalid URLs', {                                                       // 31
			"function": 'validateOutgoing._verifyRequiredFields'                                                                // 31
		});                                                                                                                  // 31
	}                                                                                                                     // 32
}                                                                                                                      // 33
                                                                                                                       //
function _verifyUserHasPermissionForChannels(integration, userId, channels) {                                          // 35
	for (var _iterator2 = channels, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
		var _ref4;                                                                                                           // 36
                                                                                                                       //
		if (_isArray2) {                                                                                                     // 36
			if (_i2 >= _iterator2.length) break;                                                                                // 36
			_ref4 = _iterator2[_i2++];                                                                                          // 36
		} else {                                                                                                             // 36
			_i2 = _iterator2.next();                                                                                            // 36
			if (_i2.done) break;                                                                                                // 36
			_ref4 = _i2.value;                                                                                                  // 36
		}                                                                                                                    // 36
                                                                                                                       //
		var channel = _ref4;                                                                                                 // 36
                                                                                                                       //
		if (scopedChannels.includes(channel)) {                                                                              // 37
			if (channel === 'all_public_channels') {// No special permissions needed to add integration to public channels      // 38
			} else if (!RocketChat.authz.hasPermission(userId, 'manage-integrations')) {                                        // 40
				throw new Meteor.Error('error-invalid-channel', 'Invalid Channel', {                                               // 41
					"function": 'validateOutgoing._verifyUserHasPermissionForChannels'                                                // 41
				});                                                                                                                // 41
			}                                                                                                                   // 42
		} else {                                                                                                             // 43
			var record = void 0;                                                                                                // 44
			var channelType = channel[0];                                                                                       // 45
			channel = channel.substr(1);                                                                                        // 46
                                                                                                                       //
			switch (channelType) {                                                                                              // 48
				case '#':                                                                                                          // 49
					record = RocketChat.models.Rooms.findOne({                                                                        // 50
						$or: [{                                                                                                          // 51
							_id: channel                                                                                                    // 52
						}, {                                                                                                             // 52
							name: channel                                                                                                   // 53
						}]                                                                                                               // 53
					});                                                                                                               // 50
					break;                                                                                                            // 56
                                                                                                                       //
				case '@':                                                                                                          // 57
					record = RocketChat.models.Users.findOne({                                                                        // 58
						$or: [{                                                                                                          // 59
							_id: channel                                                                                                    // 60
						}, {                                                                                                             // 60
							username: channel                                                                                               // 61
						}]                                                                                                               // 61
					});                                                                                                               // 58
					break;                                                                                                            // 64
			}                                                                                                                   // 48
                                                                                                                       //
			if (!record) {                                                                                                      // 67
				throw new Meteor.Error('error-invalid-room', 'Invalid room', {                                                     // 68
					"function": 'validateOutgoing._verifyUserHasPermissionForChannels'                                                // 68
				});                                                                                                                // 68
			}                                                                                                                   // 69
                                                                                                                       //
			if (record.usernames && !RocketChat.authz.hasPermission(userId, 'manage-integrations') && RocketChat.authz.hasPermission(userId, 'manage-own-integrations') && !record.usernames.includes(Meteor.user().username)) {
				throw new Meteor.Error('error-invalid-channel', 'Invalid Channel', {                                               // 72
					"function": 'validateOutgoing._verifyUserHasPermissionForChannels'                                                // 72
				});                                                                                                                // 72
			}                                                                                                                   // 73
		}                                                                                                                    // 74
	}                                                                                                                     // 75
}                                                                                                                      // 76
                                                                                                                       //
function _verifyRetryInformation(integration) {                                                                        // 78
	if (!integration.retryFailedCalls) {                                                                                  // 79
		return;                                                                                                              // 80
	} // Don't allow negative retry counts                                                                                // 81
                                                                                                                       //
                                                                                                                       //
	integration.retryCount = integration.retryCount && parseInt(integration.retryCount) > 0 ? parseInt(integration.retryCount) : 4;
	integration.retryDelay = !integration.retryDelay || !integration.retryDelay.trim() ? 'powers-of-ten' : integration.retryDelay.toLowerCase();
}                                                                                                                      // 86
                                                                                                                       //
RocketChat.integrations.validateOutgoing = function () {                                                               // 88
	function _validateOutgoing(integration, userId) {                                                                     // 88
		if (integration.channel && Match.test(integration.channel, String) && integration.channel.trim() === '') {           // 89
			delete integration.channel;                                                                                         // 90
		} //Moved to it's own function to statisfy the complexity rule                                                       // 91
                                                                                                                       //
                                                                                                                       //
		_verifyRequiredFields(integration);                                                                                  // 94
                                                                                                                       //
		var channels = [];                                                                                                   // 96
                                                                                                                       //
		if (RocketChat.integrations.outgoingEvents[integration.event].use.channel) {                                         // 97
			if (!Match.test(integration.channel, String)) {                                                                     // 98
				throw new Meteor.Error('error-invalid-channel', 'Invalid Channel', {                                               // 99
					"function": 'validateOutgoing'                                                                                    // 99
				});                                                                                                                // 99
			} else {                                                                                                            // 100
				channels = _.map(integration.channel.split(','), function (channel) {                                              // 101
					return s.trim(channel);                                                                                           // 101
				});                                                                                                                // 101
                                                                                                                       //
				for (var _iterator3 = channels, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
					var _ref5;                                                                                                        // 103
                                                                                                                       //
					if (_isArray3) {                                                                                                  // 103
						if (_i3 >= _iterator3.length) break;                                                                             // 103
						_ref5 = _iterator3[_i3++];                                                                                       // 103
					} else {                                                                                                          // 103
						_i3 = _iterator3.next();                                                                                         // 103
						if (_i3.done) break;                                                                                             // 103
						_ref5 = _i3.value;                                                                                               // 103
					}                                                                                                                 // 103
                                                                                                                       //
					var channel = _ref5;                                                                                              // 103
                                                                                                                       //
					if (!validChannelChars.includes(channel[0]) && !scopedChannels.includes(channel.toLowerCase())) {                 // 104
						throw new Meteor.Error('error-invalid-channel-start-with-chars', 'Invalid channel. Start with @ or #', {         // 105
							"function": 'validateOutgoing'                                                                                  // 105
						});                                                                                                              // 105
					}                                                                                                                 // 106
				}                                                                                                                  // 107
			}                                                                                                                   // 108
		} else if (!RocketChat.authz.hasPermission(userId, 'manage-integrations')) {                                         // 109
			throw new Meteor.Error('error-invalid-permissions', 'Invalid permission for required Integration creation.', {      // 110
				"function": 'validateOutgoing'                                                                                     // 110
			});                                                                                                                 // 110
		}                                                                                                                    // 111
                                                                                                                       //
		if (RocketChat.integrations.outgoingEvents[integration.event].use.triggerWords && integration.triggerWords) {        // 113
			if (!Match.test(integration.triggerWords, [String])) {                                                              // 114
				throw new Meteor.Error('error-invalid-triggerWords', 'Invalid triggerWords', {                                     // 115
					"function": 'validateOutgoing'                                                                                    // 115
				});                                                                                                                // 115
			}                                                                                                                   // 116
                                                                                                                       //
			for (var _iterator4 = integration.triggerWords, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
				var _ref8;                                                                                                         // 118
                                                                                                                       //
				if (_isArray4) {                                                                                                   // 118
					if (_i4 >= _iterator4.length) break;                                                                              // 118
					_ref8 = _iterator4[_i4++];                                                                                        // 118
				} else {                                                                                                           // 118
					_i4 = _iterator4.next();                                                                                          // 118
					if (_i4.done) break;                                                                                              // 118
					_ref8 = _i4.value;                                                                                                // 118
				}                                                                                                                  // 118
                                                                                                                       //
				var _ref6 = _ref8;                                                                                                 // 118
                                                                                                                       //
				var _ref7 = (0, _slicedToArray3.default)(_ref6, 2);                                                                // 118
                                                                                                                       //
				var index = _ref7[0];                                                                                              // 118
				var triggerWord = _ref7[1];                                                                                        // 118
                                                                                                                       //
				if (triggerWord.trim() === '') {                                                                                   // 119
					delete integration.triggerWords[index];                                                                           // 120
				}                                                                                                                  // 121
			}                                                                                                                   // 122
                                                                                                                       //
			integration.triggerWords = _.without(integration.triggerWords, [undefined]);                                        // 124
		} else {                                                                                                             // 125
			delete integration.triggerWords;                                                                                    // 126
		}                                                                                                                    // 127
                                                                                                                       //
		if (integration.scriptEnabled === true && integration.script && integration.script.trim() !== '') {                  // 129
			try {                                                                                                               // 130
				var babelOptions = Object.assign(Babel.getDefaultOptions({                                                         // 131
					runtime: false                                                                                                    // 131
				}), {                                                                                                              // 131
					compact: true,                                                                                                    // 131
					minified: true,                                                                                                   // 131
					comments: false                                                                                                   // 131
				});                                                                                                                // 131
				integration.scriptCompiled = Babel.compile(integration.script, babelOptions).code;                                 // 133
				integration.scriptError = undefined;                                                                               // 134
			} catch (e) {                                                                                                       // 135
				integration.scriptCompiled = undefined;                                                                            // 136
				integration.scriptError = _.pick(e, 'name', 'message', 'stack');                                                   // 137
			}                                                                                                                   // 138
		}                                                                                                                    // 139
                                                                                                                       //
		if (typeof integration.runOnEdits !== 'undefined') {                                                                 // 141
			// Verify this value is only true/false                                                                             // 142
			integration.runOnEdits = integration.runOnEdits === true;                                                           // 143
		}                                                                                                                    // 144
                                                                                                                       //
		_verifyUserHasPermissionForChannels(integration, userId, channels);                                                  // 146
                                                                                                                       //
		_verifyRetryInformation(integration);                                                                                // 147
                                                                                                                       //
		var user = RocketChat.models.Users.findOne({                                                                         // 149
			username: integration.username                                                                                      // 149
		});                                                                                                                  // 149
                                                                                                                       //
		if (!user) {                                                                                                         // 151
			throw new Meteor.Error('error-invalid-user', 'Invalid user (did you delete the `rocket.cat` user?)', {              // 152
				"function": 'validateOutgoing'                                                                                     // 152
			});                                                                                                                 // 152
		}                                                                                                                    // 153
                                                                                                                       //
		integration.type = 'webhook-outgoing';                                                                               // 155
		integration.userId = user._id;                                                                                       // 156
		integration.channel = channels;                                                                                      // 157
		return integration;                                                                                                  // 159
	}                                                                                                                     // 160
                                                                                                                       //
	return _validateOutgoing;                                                                                             // 88
}();                                                                                                                   // 88
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"triggerHandler.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_integrations/server/lib/triggerHandler.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
var moment = void 0;                                                                                                   // 1
module.watch(require("moment"), {                                                                                      // 1
	"default": function (v) {                                                                                             // 1
		moment = v;                                                                                                          // 1
	}                                                                                                                     // 1
}, 0);                                                                                                                 // 1
RocketChat.integrations.triggerHandler = new (function () {                                                            // 4
	function RocketChatIntegrationHandler() {                                                                             // 5
		var _this = this;                                                                                                    // 5
                                                                                                                       //
		(0, _classCallCheck3.default)(this, RocketChatIntegrationHandler);                                                   // 5
		this.vm = Npm.require('vm');                                                                                         // 6
		this.successResults = [200, 201, 202];                                                                               // 7
		this.compiledScripts = {};                                                                                           // 8
		this.triggers = {};                                                                                                  // 9
		RocketChat.models.Integrations.find({                                                                                // 11
			type: 'webhook-outgoing'                                                                                            // 11
		}).observe({                                                                                                         // 11
			added: function (record) {                                                                                          // 12
				_this.addIntegration(record);                                                                                      // 13
			},                                                                                                                  // 14
			changed: function (record) {                                                                                        // 16
				_this.removeIntegration(record);                                                                                   // 17
                                                                                                                       //
				_this.addIntegration(record);                                                                                      // 18
			},                                                                                                                  // 19
			removed: function (record) {                                                                                        // 21
				_this.removeIntegration(record);                                                                                   // 22
			}                                                                                                                   // 23
		});                                                                                                                  // 11
	}                                                                                                                     // 25
                                                                                                                       //
	RocketChatIntegrationHandler.prototype.addIntegration = function () {                                                 // 4
		function addIntegration(record) {                                                                                    // 4
			logger.outgoing.debug("Adding the integration " + record.name + " of the event " + record.event + "!");             // 28
			var channels = void 0;                                                                                              // 29
                                                                                                                       //
			if (record.event && !RocketChat.integrations.outgoingEvents[record.event].use.channel) {                            // 30
				logger.outgoing.debug('The integration doesnt rely on channels.'); //We don't use any channels, so it's special ;)
                                                                                                                       //
				channels = ['__any'];                                                                                              // 33
			} else if (_.isEmpty(record.channel)) {                                                                             // 34
				logger.outgoing.debug('The integration had an empty channel property, so it is going on all the public channels.');
				channels = ['all_public_channels'];                                                                                // 36
			} else {                                                                                                            // 37
				logger.outgoing.debug('The integration is going on these channels:', record.channel);                              // 38
				channels = [].concat(record.channel);                                                                              // 39
			}                                                                                                                   // 40
                                                                                                                       //
			for (var _iterator = channels, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
				var _ref;                                                                                                          // 42
                                                                                                                       //
				if (_isArray) {                                                                                                    // 42
					if (_i >= _iterator.length) break;                                                                                // 42
					_ref = _iterator[_i++];                                                                                           // 42
				} else {                                                                                                           // 42
					_i = _iterator.next();                                                                                            // 42
					if (_i.done) break;                                                                                               // 42
					_ref = _i.value;                                                                                                  // 42
				}                                                                                                                  // 42
                                                                                                                       //
				var channel = _ref;                                                                                                // 42
                                                                                                                       //
				if (!this.triggers[channel]) {                                                                                     // 43
					this.triggers[channel] = {};                                                                                      // 44
				}                                                                                                                  // 45
                                                                                                                       //
				this.triggers[channel][record._id] = record;                                                                       // 47
			}                                                                                                                   // 48
		}                                                                                                                    // 49
                                                                                                                       //
		return addIntegration;                                                                                               // 4
	}();                                                                                                                  // 4
                                                                                                                       //
	RocketChatIntegrationHandler.prototype.removeIntegration = function () {                                              // 4
		function removeIntegration(record) {                                                                                 // 4
			for (var _iterator2 = Object.values(this.triggers), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
				var _ref2;                                                                                                         // 52
                                                                                                                       //
				if (_isArray2) {                                                                                                   // 52
					if (_i2 >= _iterator2.length) break;                                                                              // 52
					_ref2 = _iterator2[_i2++];                                                                                        // 52
				} else {                                                                                                           // 52
					_i2 = _iterator2.next();                                                                                          // 52
					if (_i2.done) break;                                                                                              // 52
					_ref2 = _i2.value;                                                                                                // 52
				}                                                                                                                  // 52
                                                                                                                       //
				var trigger = _ref2;                                                                                               // 52
				delete trigger[record._id];                                                                                        // 53
			}                                                                                                                   // 54
		}                                                                                                                    // 55
                                                                                                                       //
		return removeIntegration;                                                                                            // 4
	}();                                                                                                                  // 4
                                                                                                                       //
	RocketChatIntegrationHandler.prototype.isTriggerEnabled = function () {                                               // 4
		function isTriggerEnabled(trigger) {                                                                                 // 4
			for (var _iterator3 = Object.values(this.triggers), _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
				var _ref3;                                                                                                         // 58
                                                                                                                       //
				if (_isArray3) {                                                                                                   // 58
					if (_i3 >= _iterator3.length) break;                                                                              // 58
					_ref3 = _iterator3[_i3++];                                                                                        // 58
				} else {                                                                                                           // 58
					_i3 = _iterator3.next();                                                                                          // 58
					if (_i3.done) break;                                                                                              // 58
					_ref3 = _i3.value;                                                                                                // 58
				}                                                                                                                  // 58
                                                                                                                       //
				var trig = _ref3;                                                                                                  // 58
                                                                                                                       //
				if (trig[trigger._id]) {                                                                                           // 59
					return trig[trigger._id].enabled;                                                                                 // 60
				}                                                                                                                  // 61
			}                                                                                                                   // 62
                                                                                                                       //
			return false;                                                                                                       // 64
		}                                                                                                                    // 65
                                                                                                                       //
		return isTriggerEnabled;                                                                                             // 4
	}();                                                                                                                  // 4
                                                                                                                       //
	RocketChatIntegrationHandler.prototype.updateHistory = function () {                                                  // 4
		function updateHistory(_ref4) {                                                                                      // 4
			var historyId = _ref4.historyId,                                                                                    // 67
			    step = _ref4.step,                                                                                              // 67
			    integration = _ref4.integration,                                                                                // 67
			    event = _ref4.event,                                                                                            // 67
			    data = _ref4.data,                                                                                              // 67
			    triggerWord = _ref4.triggerWord,                                                                                // 67
			    ranPrepareScript = _ref4.ranPrepareScript,                                                                      // 67
			    prepareSentMessage = _ref4.prepareSentMessage,                                                                  // 67
			    processSentMessage = _ref4.processSentMessage,                                                                  // 67
			    resultMessage = _ref4.resultMessage,                                                                            // 67
			    finished = _ref4.finished,                                                                                      // 67
			    url = _ref4.url,                                                                                                // 67
			    httpCallData = _ref4.httpCallData,                                                                              // 67
			    httpError = _ref4.httpError,                                                                                    // 67
			    httpResult = _ref4.httpResult,                                                                                  // 67
			    error = _ref4.error,                                                                                            // 67
			    errorStack = _ref4.errorStack;                                                                                  // 67
			var history = {                                                                                                     // 68
				type: 'outgoing-webhook',                                                                                          // 69
				step: step                                                                                                         // 70
			}; // Usually is only added on initial insert                                                                       // 68
                                                                                                                       //
			if (integration) {                                                                                                  // 74
				history.integration = integration;                                                                                 // 75
			} // Usually is only added on initial insert                                                                        // 76
                                                                                                                       //
                                                                                                                       //
			if (event) {                                                                                                        // 79
				history.event = event;                                                                                             // 80
			}                                                                                                                   // 81
                                                                                                                       //
			if (data) {                                                                                                         // 83
				history.data = data;                                                                                               // 84
                                                                                                                       //
				if (data.user) {                                                                                                   // 86
					history.data.user = _.omit(data.user, ['meta', '$loki', 'services']);                                             // 87
				}                                                                                                                  // 88
                                                                                                                       //
				if (data.room) {                                                                                                   // 90
					history.data.room = _.omit(data.room, ['meta', '$loki', 'usernames']);                                            // 91
					history.data.room.usernames = ['this_will_be_filled_in_with_usernames_when_replayed'];                            // 92
				}                                                                                                                  // 93
			}                                                                                                                   // 94
                                                                                                                       //
			if (triggerWord) {                                                                                                  // 96
				history.triggerWord = triggerWord;                                                                                 // 97
			}                                                                                                                   // 98
                                                                                                                       //
			if (typeof ranPrepareScript !== 'undefined') {                                                                      // 100
				history.ranPrepareScript = ranPrepareScript;                                                                       // 101
			}                                                                                                                   // 102
                                                                                                                       //
			if (prepareSentMessage) {                                                                                           // 104
				history.prepareSentMessage = prepareSentMessage;                                                                   // 105
			}                                                                                                                   // 106
                                                                                                                       //
			if (processSentMessage) {                                                                                           // 108
				history.processSentMessage = processSentMessage;                                                                   // 109
			}                                                                                                                   // 110
                                                                                                                       //
			if (resultMessage) {                                                                                                // 112
				history.resultMessage = resultMessage;                                                                             // 113
			}                                                                                                                   // 114
                                                                                                                       //
			if (typeof finished !== 'undefined') {                                                                              // 116
				history.finished = finished;                                                                                       // 117
			}                                                                                                                   // 118
                                                                                                                       //
			if (url) {                                                                                                          // 120
				history.url = url;                                                                                                 // 121
			}                                                                                                                   // 122
                                                                                                                       //
			if (typeof httpCallData !== 'undefined') {                                                                          // 124
				history.httpCallData = httpCallData;                                                                               // 125
			}                                                                                                                   // 126
                                                                                                                       //
			if (httpError) {                                                                                                    // 128
				history.httpError = httpError;                                                                                     // 129
			}                                                                                                                   // 130
                                                                                                                       //
			if (typeof httpResult !== 'undefined') {                                                                            // 132
				history.httpResult = httpResult;                                                                                   // 133
			}                                                                                                                   // 134
                                                                                                                       //
			if (typeof error !== 'undefined') {                                                                                 // 136
				history.error = error;                                                                                             // 137
			}                                                                                                                   // 138
                                                                                                                       //
			if (typeof errorStack !== 'undefined') {                                                                            // 140
				history.errorStack = errorStack;                                                                                   // 141
			}                                                                                                                   // 142
                                                                                                                       //
			if (historyId) {                                                                                                    // 144
				RocketChat.models.IntegrationHistory.update({                                                                      // 145
					_id: historyId                                                                                                    // 145
				}, {                                                                                                               // 145
					$set: history                                                                                                     // 145
				});                                                                                                                // 145
				return historyId;                                                                                                  // 146
			} else {                                                                                                            // 147
				history._createdAt = new Date();                                                                                   // 148
				return RocketChat.models.IntegrationHistory.insert(Object.assign({                                                 // 149
					_id: Random.id()                                                                                                  // 149
				}, history));                                                                                                      // 149
			}                                                                                                                   // 150
		}                                                                                                                    // 151
                                                                                                                       //
		return updateHistory;                                                                                                // 4
	}(); //Trigger is the trigger, nameOrId is a string which is used to try and find a room, room is a room, message is a message, and data contains "user_name" if trigger.impersonateUser is truthful.
                                                                                                                       //
                                                                                                                       //
	RocketChatIntegrationHandler.prototype.sendMessage = function () {                                                    // 4
		function sendMessage(_ref5) {                                                                                        // 4
			var trigger = _ref5.trigger,                                                                                        // 154
			    _ref5$nameOrId = _ref5.nameOrId,                                                                                // 154
			    nameOrId = _ref5$nameOrId === undefined ? '' : _ref5$nameOrId,                                                  // 154
			    room = _ref5.room,                                                                                              // 154
			    message = _ref5.message,                                                                                        // 154
			    data = _ref5.data;                                                                                              // 154
			var user = void 0; //Try to find the user who we are impersonating                                                  // 155
                                                                                                                       //
			if (trigger.impersonateUser) {                                                                                      // 157
				user = RocketChat.models.Users.findOneByUsername(data.user_name);                                                  // 158
			} //If they don't exist (aka the trigger didn't contain a user) then we set the user based upon the                 // 159
			//configured username for the integration since this is required at all times.                                      // 162
                                                                                                                       //
                                                                                                                       //
			if (!user) {                                                                                                        // 163
				user = RocketChat.models.Users.findOneByUsername(trigger.username);                                                // 164
			}                                                                                                                   // 165
                                                                                                                       //
			var tmpRoom = void 0;                                                                                               // 167
                                                                                                                       //
			if (nameOrId || trigger.targetRoom || message.channel) {                                                            // 168
				tmpRoom = RocketChat.getRoomByNameOrIdWithOptionToJoin({                                                           // 169
					currentUserId: user._id,                                                                                          // 169
					nameOrId: nameOrId || message.channel || trigger.targetRoom,                                                      // 169
					errorOnEmpty: false                                                                                               // 169
				}) || room;                                                                                                        // 169
			} else {                                                                                                            // 170
				tmpRoom = room;                                                                                                    // 171
			} //If no room could be found, we won't be sending any messages but we'll warn in the logs                          // 172
                                                                                                                       //
                                                                                                                       //
			if (!tmpRoom) {                                                                                                     // 175
				logger.outgoing.warn("The Integration \"" + trigger.name + "\" doesn't have a room configured nor did it provide a room to send the message to.");
				return;                                                                                                            // 177
			}                                                                                                                   // 178
                                                                                                                       //
			logger.outgoing.debug("Found a room for " + trigger.name + " which is: " + tmpRoom.name + " with a type of " + tmpRoom.t);
			message.bot = {                                                                                                     // 182
				i: trigger._id                                                                                                     // 182
			};                                                                                                                  // 182
			var defaultValues = {                                                                                               // 184
				alias: trigger.alias,                                                                                              // 185
				avatar: trigger.avatar,                                                                                            // 186
				emoji: trigger.emoji                                                                                               // 187
			};                                                                                                                  // 184
                                                                                                                       //
			if (tmpRoom.t === 'd') {                                                                                            // 190
				message.channel = "@" + tmpRoom._id;                                                                               // 191
			} else {                                                                                                            // 192
				message.channel = "#" + tmpRoom._id;                                                                               // 193
			}                                                                                                                   // 194
                                                                                                                       //
			message = processWebhookMessage(message, user, defaultValues);                                                      // 196
			return message;                                                                                                     // 197
		}                                                                                                                    // 198
                                                                                                                       //
		return sendMessage;                                                                                                  // 4
	}();                                                                                                                  // 4
                                                                                                                       //
	RocketChatIntegrationHandler.prototype.buildSandbox = function () {                                                   // 4
		function buildSandbox() {                                                                                            // 4
			var store = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};                                 // 200
			var sandbox = {                                                                                                     // 201
				_: _,                                                                                                              // 202
				s: s,                                                                                                              // 202
				console: console,                                                                                                  // 202
				moment: moment,                                                                                                    // 202
				Store: {                                                                                                           // 203
					set: function (key, val) {                                                                                        // 204
						return store[key] = val;                                                                                         // 204
					},                                                                                                                // 204
					get: function (key) {                                                                                             // 205
						return store[key];                                                                                               // 205
					}                                                                                                                 // 205
				},                                                                                                                 // 203
				HTTP: function (method, url, options) {                                                                            // 207
					try {                                                                                                             // 208
						return {                                                                                                         // 209
							result: HTTP.call(method, url, options)                                                                         // 210
						};                                                                                                               // 209
					} catch (error) {                                                                                                 // 212
						return {                                                                                                         // 213
							error: error                                                                                                    // 213
						};                                                                                                               // 213
					}                                                                                                                 // 214
				}                                                                                                                  // 215
			};                                                                                                                  // 201
			Object.keys(RocketChat.models).filter(function (k) {                                                                // 218
				return !k.startsWith('_');                                                                                         // 218
			}).forEach(function (k) {                                                                                           // 218
				sandbox[k] = RocketChat.models[k];                                                                                 // 219
			});                                                                                                                 // 220
			return {                                                                                                            // 222
				store: store,                                                                                                      // 222
				sandbox: sandbox                                                                                                   // 222
			};                                                                                                                  // 222
		}                                                                                                                    // 223
                                                                                                                       //
		return buildSandbox;                                                                                                 // 4
	}();                                                                                                                  // 4
                                                                                                                       //
	RocketChatIntegrationHandler.prototype.getIntegrationScript = function () {                                           // 4
		function getIntegrationScript(integration) {                                                                         // 4
			var compiledScript = this.compiledScripts[integration._id];                                                         // 226
                                                                                                                       //
			if (compiledScript && +compiledScript._updatedAt === +integration._updatedAt) {                                     // 227
				return compiledScript.script;                                                                                      // 228
			}                                                                                                                   // 229
                                                                                                                       //
			var script = integration.scriptCompiled;                                                                            // 231
                                                                                                                       //
			var _buildSandbox = this.buildSandbox(),                                                                            // 225
			    store = _buildSandbox.store,                                                                                    // 225
			    sandbox = _buildSandbox.sandbox;                                                                                // 225
                                                                                                                       //
			var vmScript = void 0;                                                                                              // 234
                                                                                                                       //
			try {                                                                                                               // 235
				logger.outgoing.info('Will evaluate script of Trigger', integration.name);                                         // 236
				logger.outgoing.debug(script);                                                                                     // 237
				vmScript = this.vm.createScript(script, 'script.js');                                                              // 239
				vmScript.runInNewContext(sandbox);                                                                                 // 241
                                                                                                                       //
				if (sandbox.Script) {                                                                                              // 243
					this.compiledScripts[integration._id] = {                                                                         // 244
						script: new sandbox.Script(),                                                                                    // 245
						store: store,                                                                                                    // 246
						_updatedAt: integration._updatedAt                                                                               // 247
					};                                                                                                                // 244
					return this.compiledScripts[integration._id].script;                                                              // 250
				}                                                                                                                  // 251
			} catch (e) {                                                                                                       // 252
				logger.outgoing.error("Error evaluating Script in Trigger " + integration.name + ":");                             // 253
				logger.outgoing.error(script.replace(/^/gm, '  '));                                                                // 254
				logger.outgoing.error('Stack Trace:');                                                                             // 255
				logger.outgoing.error(e.stack.replace(/^/gm, '  '));                                                               // 256
				throw new Meteor.Error('error-evaluating-script');                                                                 // 257
			}                                                                                                                   // 258
                                                                                                                       //
			if (!sandbox.Script) {                                                                                              // 260
				logger.outgoing.error("Class \"Script\" not in Trigger " + integration.name + ":");                                // 261
				throw new Meteor.Error('class-script-not-found');                                                                  // 262
			}                                                                                                                   // 263
		}                                                                                                                    // 264
                                                                                                                       //
		return getIntegrationScript;                                                                                         // 4
	}();                                                                                                                  // 4
                                                                                                                       //
	RocketChatIntegrationHandler.prototype.hasScriptAndMethod = function () {                                             // 4
		function hasScriptAndMethod(integration, method) {                                                                   // 4
			if (integration.scriptEnabled !== true || !integration.scriptCompiled || integration.scriptCompiled.trim() === '') {
				return false;                                                                                                      // 268
			}                                                                                                                   // 269
                                                                                                                       //
			var script = void 0;                                                                                                // 271
                                                                                                                       //
			try {                                                                                                               // 272
				script = this.getIntegrationScript(integration);                                                                   // 273
			} catch (e) {                                                                                                       // 274
				return false;                                                                                                      // 275
			}                                                                                                                   // 276
                                                                                                                       //
			return typeof script[method] !== 'undefined';                                                                       // 278
		}                                                                                                                    // 279
                                                                                                                       //
		return hasScriptAndMethod;                                                                                           // 4
	}();                                                                                                                  // 4
                                                                                                                       //
	RocketChatIntegrationHandler.prototype.executeScript = function () {                                                  // 4
		function executeScript(integration, method, params, historyId) {                                                     // 4
			var script = void 0;                                                                                                // 282
                                                                                                                       //
			try {                                                                                                               // 283
				script = this.getIntegrationScript(integration);                                                                   // 284
			} catch (e) {                                                                                                       // 285
				this.updateHistory({                                                                                               // 286
					historyId: historyId,                                                                                             // 286
					step: 'execute-script-getting-script',                                                                            // 286
					error: true,                                                                                                      // 286
					errorStack: e                                                                                                     // 286
				});                                                                                                                // 286
				return;                                                                                                            // 287
			}                                                                                                                   // 288
                                                                                                                       //
			if (!script[method]) {                                                                                              // 290
				logger.outgoing.error("Method \"" + method + "\" no found in the Integration \"" + integration.name + "\"");       // 291
				this.updateHistory({                                                                                               // 292
					historyId: historyId,                                                                                             // 292
					step: "execute-script-no-method-" + method                                                                        // 292
				});                                                                                                                // 292
				return;                                                                                                            // 293
			}                                                                                                                   // 294
                                                                                                                       //
			try {                                                                                                               // 296
				var _buildSandbox2 = this.buildSandbox(this.compiledScripts[integration._id].store),                               // 296
				    sandbox = _buildSandbox2.sandbox;                                                                              // 296
                                                                                                                       //
				sandbox.script = script;                                                                                           // 298
				sandbox.method = method;                                                                                           // 299
				sandbox.params = params;                                                                                           // 300
				this.updateHistory({                                                                                               // 302
					historyId: historyId,                                                                                             // 302
					step: "execute-script-before-running-" + method                                                                   // 302
				});                                                                                                                // 302
				var result = this.vm.runInNewContext('script[method](params)', sandbox, {                                          // 303
					timeout: 3000                                                                                                     // 303
				});                                                                                                                // 303
				logger.outgoing.debug("Script method \"" + method + "\" result of the Integration \"" + integration.name + "\" is:");
				logger.outgoing.debug(result);                                                                                     // 306
				return result;                                                                                                     // 308
			} catch (e) {                                                                                                       // 309
				this.updateHistory({                                                                                               // 310
					historyId: historyId,                                                                                             // 310
					step: "execute-script-error-running-" + method,                                                                   // 310
					error: true,                                                                                                      // 310
					errorStack: e.stack.replace(/^/gm, '  ')                                                                          // 310
				});                                                                                                                // 310
				logger.outgoing.error("Error running Script in the Integration " + integration.name + ":");                        // 311
				logger.outgoing.debug(integration.scriptCompiled.replace(/^/gm, '  ')); // Only output the compiled script if debugging is enabled, so the logs don't get spammed.
                                                                                                                       //
				logger.outgoing.error('Stack:');                                                                                   // 313
				logger.outgoing.error(e.stack.replace(/^/gm, '  '));                                                               // 314
				return;                                                                                                            // 315
			}                                                                                                                   // 316
		}                                                                                                                    // 317
                                                                                                                       //
		return executeScript;                                                                                                // 4
	}();                                                                                                                  // 4
                                                                                                                       //
	RocketChatIntegrationHandler.prototype.eventNameArgumentsToObject = function () {                                     // 4
		function eventNameArgumentsToObject() {                                                                              // 4
			var argObject = {                                                                                                   // 320
				event: arguments[0]                                                                                                // 321
			};                                                                                                                  // 320
                                                                                                                       //
			switch (argObject.event) {                                                                                          // 324
				case 'sendMessage':                                                                                                // 325
					if (arguments.length >= 3) {                                                                                      // 326
						argObject.message = arguments[1];                                                                                // 327
						argObject.room = arguments[2];                                                                                   // 328
					}                                                                                                                 // 329
                                                                                                                       //
					break;                                                                                                            // 330
                                                                                                                       //
				case 'fileUploaded':                                                                                               // 331
					if (arguments.length >= 2) {                                                                                      // 332
						var arghhh = arguments[1];                                                                                       // 333
						argObject.user = arghhh.user;                                                                                    // 334
						argObject.room = arghhh.room;                                                                                    // 335
						argObject.message = arghhh.message;                                                                              // 336
					}                                                                                                                 // 337
                                                                                                                       //
					break;                                                                                                            // 338
                                                                                                                       //
				case 'roomArchived':                                                                                               // 339
					if (arguments.length >= 3) {                                                                                      // 340
						argObject.room = arguments[1];                                                                                   // 341
						argObject.user = arguments[2];                                                                                   // 342
					}                                                                                                                 // 343
                                                                                                                       //
					break;                                                                                                            // 344
                                                                                                                       //
				case 'roomCreated':                                                                                                // 345
					if (arguments.length >= 3) {                                                                                      // 346
						argObject.owner = arguments[1];                                                                                  // 347
						argObject.room = arguments[2];                                                                                   // 348
					}                                                                                                                 // 349
                                                                                                                       //
					break;                                                                                                            // 350
                                                                                                                       //
				case 'roomJoined':                                                                                                 // 351
				case 'roomLeft':                                                                                                   // 352
					if (arguments.length >= 3) {                                                                                      // 353
						argObject.user = arguments[1];                                                                                   // 354
						argObject.room = arguments[2];                                                                                   // 355
					}                                                                                                                 // 356
                                                                                                                       //
					break;                                                                                                            // 357
                                                                                                                       //
				case 'userCreated':                                                                                                // 358
					if (arguments.length >= 2) {                                                                                      // 359
						argObject.user = arguments[1];                                                                                   // 360
					}                                                                                                                 // 361
                                                                                                                       //
					break;                                                                                                            // 362
                                                                                                                       //
				default:                                                                                                           // 363
					logger.outgoing.warn("An Unhandled Trigger Event was called: " + argObject.event);                                // 364
					argObject.event = undefined;                                                                                      // 365
					break;                                                                                                            // 366
			}                                                                                                                   // 324
                                                                                                                       //
			logger.outgoing.debug("Got the event arguments for the event: " + argObject.event, argObject);                      // 369
			return argObject;                                                                                                   // 371
		}                                                                                                                    // 372
                                                                                                                       //
		return eventNameArgumentsToObject;                                                                                   // 4
	}();                                                                                                                  // 4
                                                                                                                       //
	RocketChatIntegrationHandler.prototype.mapEventArgsToData = function () {                                             // 4
		function mapEventArgsToData(data, _ref6) {                                                                           // 4
			var event = _ref6.event,                                                                                            // 374
			    message = _ref6.message,                                                                                        // 374
			    room = _ref6.room,                                                                                              // 374
			    owner = _ref6.owner,                                                                                            // 374
			    user = _ref6.user;                                                                                              // 374
                                                                                                                       //
			switch (event) {                                                                                                    // 375
				case 'sendMessage':                                                                                                // 376
					data.channel_id = room._id;                                                                                       // 377
					data.channel_name = room.name;                                                                                    // 378
					data.message_id = message._id;                                                                                    // 379
					data.timestamp = message.ts;                                                                                      // 380
					data.user_id = message.u._id;                                                                                     // 381
					data.user_name = message.u.username;                                                                              // 382
					data.text = message.msg;                                                                                          // 383
                                                                                                                       //
					if (message.alias) {                                                                                              // 385
						data.alias = message.alias;                                                                                      // 386
					}                                                                                                                 // 387
                                                                                                                       //
					if (message.bot) {                                                                                                // 389
						data.bot = message.bot;                                                                                          // 390
					}                                                                                                                 // 391
                                                                                                                       //
					if (message.editedAt) {                                                                                           // 393
						data.isEdited = true;                                                                                            // 394
					}                                                                                                                 // 395
                                                                                                                       //
					break;                                                                                                            // 396
                                                                                                                       //
				case 'fileUploaded':                                                                                               // 397
					data.channel_id = room._id;                                                                                       // 398
					data.channel_name = room.name;                                                                                    // 399
					data.message_id = message._id;                                                                                    // 400
					data.timestamp = message.ts;                                                                                      // 401
					data.user_id = message.u._id;                                                                                     // 402
					data.user_name = message.u.username;                                                                              // 403
					data.text = message.msg;                                                                                          // 404
					data.user = user;                                                                                                 // 405
					data.room = room;                                                                                                 // 406
					data.message = message;                                                                                           // 407
                                                                                                                       //
					if (message.alias) {                                                                                              // 409
						data.alias = message.alias;                                                                                      // 410
					}                                                                                                                 // 411
                                                                                                                       //
					if (message.bot) {                                                                                                // 413
						data.bot = message.bot;                                                                                          // 414
					}                                                                                                                 // 415
                                                                                                                       //
					break;                                                                                                            // 416
                                                                                                                       //
				case 'roomCreated':                                                                                                // 417
					data.channel_id = room._id;                                                                                       // 418
					data.channel_name = room.name;                                                                                    // 419
					data.timestamp = room.ts;                                                                                         // 420
					data.user_id = owner._id;                                                                                         // 421
					data.user_name = owner.username;                                                                                  // 422
					data.owner = owner;                                                                                               // 423
					data.room = room;                                                                                                 // 424
					break;                                                                                                            // 425
                                                                                                                       //
				case 'roomArchived':                                                                                               // 426
				case 'roomJoined':                                                                                                 // 427
				case 'roomLeft':                                                                                                   // 428
					data.timestamp = new Date();                                                                                      // 429
					data.channel_id = room._id;                                                                                       // 430
					data.channel_name = room.name;                                                                                    // 431
					data.user_id = user._id;                                                                                          // 432
					data.user_name = user.username;                                                                                   // 433
					data.user = user;                                                                                                 // 434
					data.room = room;                                                                                                 // 435
                                                                                                                       //
					if (user.type === 'bot') {                                                                                        // 437
						data.bot = true;                                                                                                 // 438
					}                                                                                                                 // 439
                                                                                                                       //
					break;                                                                                                            // 440
                                                                                                                       //
				case 'userCreated':                                                                                                // 441
					data.timestamp = user.createdAt;                                                                                  // 442
					data.user_id = user._id;                                                                                          // 443
					data.user_name = user.username;                                                                                   // 444
					data.user = user;                                                                                                 // 445
                                                                                                                       //
					if (user.type === 'bot') {                                                                                        // 447
						data.bot = true;                                                                                                 // 448
					}                                                                                                                 // 449
                                                                                                                       //
					break;                                                                                                            // 450
                                                                                                                       //
				default:                                                                                                           // 451
					break;                                                                                                            // 452
			}                                                                                                                   // 375
		}                                                                                                                    // 454
                                                                                                                       //
		return mapEventArgsToData;                                                                                           // 4
	}();                                                                                                                  // 4
                                                                                                                       //
	RocketChatIntegrationHandler.prototype.executeTriggers = function () {                                                // 4
		function executeTriggers() {                                                                                         // 4
			logger.outgoing.debug('Execute Trigger:', arguments[0]);                                                            // 457
			var argObject = this.eventNameArgumentsToObject.apply(this, arguments);                                             // 459
			var event = argObject.event,                                                                                        // 456
			    message = argObject.message,                                                                                    // 456
			    room = argObject.room; //Each type of event should have an event and a room attached, otherwise we              // 456
			//wouldn't know how to handle the trigger nor would we have anywhere to send the                                    // 463
			//result of the integration                                                                                         // 464
                                                                                                                       //
			if (!event) {                                                                                                       // 465
				return;                                                                                                            // 466
			}                                                                                                                   // 467
                                                                                                                       //
			var triggersToExecute = [];                                                                                         // 469
			logger.outgoing.debug('Starting search for triggers for the room:', room ? room._id : '__any');                     // 471
                                                                                                                       //
			if (room) {                                                                                                         // 472
				switch (room.t) {                                                                                                  // 473
					case 'd':                                                                                                         // 474
						var id = room._id.replace(message.u._id, '');                                                                    // 475
                                                                                                                       //
						var username = _.without(room.usernames, message.u.username)[0];                                                 // 476
                                                                                                                       //
						if (this.triggers["@" + id]) {                                                                                   // 478
							for (var _iterator4 = Object.values(this.triggers["@" + id]), _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
								var _ref7;                                                                                                     // 479
                                                                                                                       //
								if (_isArray4) {                                                                                               // 479
									if (_i4 >= _iterator4.length) break;                                                                          // 479
									_ref7 = _iterator4[_i4++];                                                                                    // 479
								} else {                                                                                                       // 479
									_i4 = _iterator4.next();                                                                                      // 479
									if (_i4.done) break;                                                                                          // 479
									_ref7 = _i4.value;                                                                                            // 479
								}                                                                                                              // 479
                                                                                                                       //
								var trigger = _ref7;                                                                                           // 479
								triggersToExecute.push(trigger);                                                                               // 480
							}                                                                                                               // 481
						}                                                                                                                // 482
                                                                                                                       //
						if (this.triggers.all_direct_messages) {                                                                         // 484
							for (var _iterator5 = Object.values(this.triggers.all_direct_messages), _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
								var _ref8;                                                                                                     // 485
                                                                                                                       //
								if (_isArray5) {                                                                                               // 485
									if (_i5 >= _iterator5.length) break;                                                                          // 485
									_ref8 = _iterator5[_i5++];                                                                                    // 485
								} else {                                                                                                       // 485
									_i5 = _iterator5.next();                                                                                      // 485
									if (_i5.done) break;                                                                                          // 485
									_ref8 = _i5.value;                                                                                            // 485
								}                                                                                                              // 485
                                                                                                                       //
								var _trigger = _ref8;                                                                                          // 485
								triggersToExecute.push(_trigger);                                                                              // 486
							}                                                                                                               // 487
						}                                                                                                                // 488
                                                                                                                       //
						if (id !== username && this.triggers["@" + username]) {                                                          // 490
							for (var _iterator6 = Object.values(this.triggers["@" + username]), _isArray6 = Array.isArray(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
								var _ref9;                                                                                                     // 491
                                                                                                                       //
								if (_isArray6) {                                                                                               // 491
									if (_i6 >= _iterator6.length) break;                                                                          // 491
									_ref9 = _iterator6[_i6++];                                                                                    // 491
								} else {                                                                                                       // 491
									_i6 = _iterator6.next();                                                                                      // 491
									if (_i6.done) break;                                                                                          // 491
									_ref9 = _i6.value;                                                                                            // 491
								}                                                                                                              // 491
                                                                                                                       //
								var _trigger2 = _ref9;                                                                                         // 491
								triggersToExecute.push(_trigger2);                                                                             // 492
							}                                                                                                               // 493
						}                                                                                                                // 494
                                                                                                                       //
						break;                                                                                                           // 495
                                                                                                                       //
					case 'c':                                                                                                         // 497
						if (this.triggers.all_public_channels) {                                                                         // 498
							for (var _iterator7 = Object.values(this.triggers.all_public_channels), _isArray7 = Array.isArray(_iterator7), _i7 = 0, _iterator7 = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator]();;) {
								var _ref10;                                                                                                    // 499
                                                                                                                       //
								if (_isArray7) {                                                                                               // 499
									if (_i7 >= _iterator7.length) break;                                                                          // 499
									_ref10 = _iterator7[_i7++];                                                                                   // 499
								} else {                                                                                                       // 499
									_i7 = _iterator7.next();                                                                                      // 499
									if (_i7.done) break;                                                                                          // 499
									_ref10 = _i7.value;                                                                                           // 499
								}                                                                                                              // 499
                                                                                                                       //
								var _trigger3 = _ref10;                                                                                        // 499
								triggersToExecute.push(_trigger3);                                                                             // 500
							}                                                                                                               // 501
						}                                                                                                                // 502
                                                                                                                       //
						if (this.triggers["#" + room._id]) {                                                                             // 504
							for (var _iterator8 = Object.values(this.triggers["#" + room._id]), _isArray8 = Array.isArray(_iterator8), _i8 = 0, _iterator8 = _isArray8 ? _iterator8 : _iterator8[Symbol.iterator]();;) {
								var _ref11;                                                                                                    // 505
                                                                                                                       //
								if (_isArray8) {                                                                                               // 505
									if (_i8 >= _iterator8.length) break;                                                                          // 505
									_ref11 = _iterator8[_i8++];                                                                                   // 505
								} else {                                                                                                       // 505
									_i8 = _iterator8.next();                                                                                      // 505
									if (_i8.done) break;                                                                                          // 505
									_ref11 = _i8.value;                                                                                           // 505
								}                                                                                                              // 505
                                                                                                                       //
								var _trigger4 = _ref11;                                                                                        // 505
								triggersToExecute.push(_trigger4);                                                                             // 506
							}                                                                                                               // 507
						}                                                                                                                // 508
                                                                                                                       //
						if (room._id !== room.name && this.triggers["#" + room.name]) {                                                  // 510
							for (var _iterator9 = Object.values(this.triggers["#" + room.name]), _isArray9 = Array.isArray(_iterator9), _i9 = 0, _iterator9 = _isArray9 ? _iterator9 : _iterator9[Symbol.iterator]();;) {
								var _ref12;                                                                                                    // 511
                                                                                                                       //
								if (_isArray9) {                                                                                               // 511
									if (_i9 >= _iterator9.length) break;                                                                          // 511
									_ref12 = _iterator9[_i9++];                                                                                   // 511
								} else {                                                                                                       // 511
									_i9 = _iterator9.next();                                                                                      // 511
									if (_i9.done) break;                                                                                          // 511
									_ref12 = _i9.value;                                                                                           // 511
								}                                                                                                              // 511
                                                                                                                       //
								var _trigger5 = _ref12;                                                                                        // 511
								triggersToExecute.push(_trigger5);                                                                             // 512
							}                                                                                                               // 513
						}                                                                                                                // 514
                                                                                                                       //
						break;                                                                                                           // 515
                                                                                                                       //
					default:                                                                                                          // 517
						if (this.triggers.all_private_groups) {                                                                          // 518
							for (var _iterator10 = Object.values(this.triggers.all_private_groups), _isArray10 = Array.isArray(_iterator10), _i10 = 0, _iterator10 = _isArray10 ? _iterator10 : _iterator10[Symbol.iterator]();;) {
								var _ref13;                                                                                                    // 519
                                                                                                                       //
								if (_isArray10) {                                                                                              // 519
									if (_i10 >= _iterator10.length) break;                                                                        // 519
									_ref13 = _iterator10[_i10++];                                                                                 // 519
								} else {                                                                                                       // 519
									_i10 = _iterator10.next();                                                                                    // 519
									if (_i10.done) break;                                                                                         // 519
									_ref13 = _i10.value;                                                                                          // 519
								}                                                                                                              // 519
                                                                                                                       //
								var _trigger6 = _ref13;                                                                                        // 519
								triggersToExecute.push(_trigger6);                                                                             // 520
							}                                                                                                               // 521
						}                                                                                                                // 522
                                                                                                                       //
						if (this.triggers["#" + room._id]) {                                                                             // 524
							for (var _iterator11 = Object.values(this.triggers["#" + room._id]), _isArray11 = Array.isArray(_iterator11), _i11 = 0, _iterator11 = _isArray11 ? _iterator11 : _iterator11[Symbol.iterator]();;) {
								var _ref14;                                                                                                    // 525
                                                                                                                       //
								if (_isArray11) {                                                                                              // 525
									if (_i11 >= _iterator11.length) break;                                                                        // 525
									_ref14 = _iterator11[_i11++];                                                                                 // 525
								} else {                                                                                                       // 525
									_i11 = _iterator11.next();                                                                                    // 525
									if (_i11.done) break;                                                                                         // 525
									_ref14 = _i11.value;                                                                                          // 525
								}                                                                                                              // 525
                                                                                                                       //
								var _trigger7 = _ref14;                                                                                        // 525
								triggersToExecute.push(_trigger7);                                                                             // 526
							}                                                                                                               // 527
						}                                                                                                                // 528
                                                                                                                       //
						if (room._id !== room.name && this.triggers["#" + room.name]) {                                                  // 530
							for (var _iterator12 = Object.values(this.triggers["#" + room.name]), _isArray12 = Array.isArray(_iterator12), _i12 = 0, _iterator12 = _isArray12 ? _iterator12 : _iterator12[Symbol.iterator]();;) {
								var _ref15;                                                                                                    // 531
                                                                                                                       //
								if (_isArray12) {                                                                                              // 531
									if (_i12 >= _iterator12.length) break;                                                                        // 531
									_ref15 = _iterator12[_i12++];                                                                                 // 531
								} else {                                                                                                       // 531
									_i12 = _iterator12.next();                                                                                    // 531
									if (_i12.done) break;                                                                                         // 531
									_ref15 = _i12.value;                                                                                          // 531
								}                                                                                                              // 531
                                                                                                                       //
								var _trigger8 = _ref15;                                                                                        // 531
								triggersToExecute.push(_trigger8);                                                                             // 532
							}                                                                                                               // 533
						}                                                                                                                // 534
                                                                                                                       //
						break;                                                                                                           // 535
				}                                                                                                                  // 473
			}                                                                                                                   // 537
                                                                                                                       //
			if (this.triggers.__any) {                                                                                          // 539
				//For outgoing integration which don't rely on rooms.                                                              // 540
				for (var _iterator13 = Object.values(this.triggers.__any), _isArray13 = Array.isArray(_iterator13), _i13 = 0, _iterator13 = _isArray13 ? _iterator13 : _iterator13[Symbol.iterator]();;) {
					var _ref16;                                                                                                       // 541
                                                                                                                       //
					if (_isArray13) {                                                                                                 // 541
						if (_i13 >= _iterator13.length) break;                                                                           // 541
						_ref16 = _iterator13[_i13++];                                                                                    // 541
					} else {                                                                                                          // 541
						_i13 = _iterator13.next();                                                                                       // 541
						if (_i13.done) break;                                                                                            // 541
						_ref16 = _i13.value;                                                                                             // 541
					}                                                                                                                 // 541
                                                                                                                       //
					var _trigger9 = _ref16;                                                                                           // 541
					triggersToExecute.push(_trigger9);                                                                                // 542
				}                                                                                                                  // 543
			}                                                                                                                   // 544
                                                                                                                       //
			logger.outgoing.debug("Found " + triggersToExecute.length + " to iterate over and see if the match the event.");    // 546
                                                                                                                       //
			for (var _iterator14 = triggersToExecute, _isArray14 = Array.isArray(_iterator14), _i14 = 0, _iterator14 = _isArray14 ? _iterator14 : _iterator14[Symbol.iterator]();;) {
				var _ref17;                                                                                                        // 548
                                                                                                                       //
				if (_isArray14) {                                                                                                  // 548
					if (_i14 >= _iterator14.length) break;                                                                            // 548
					_ref17 = _iterator14[_i14++];                                                                                     // 548
				} else {                                                                                                           // 548
					_i14 = _iterator14.next();                                                                                        // 548
					if (_i14.done) break;                                                                                             // 548
					_ref17 = _i14.value;                                                                                              // 548
				}                                                                                                                  // 548
                                                                                                                       //
				var triggerToExecute = _ref17;                                                                                     // 548
				logger.outgoing.debug("Is \"" + triggerToExecute.name + "\" enabled, " + triggerToExecute.enabled + ", and what is the event? " + triggerToExecute.event);
                                                                                                                       //
				if (triggerToExecute.enabled === true && triggerToExecute.event === event) {                                       // 550
					this.executeTrigger(triggerToExecute, argObject);                                                                 // 551
				}                                                                                                                  // 552
			}                                                                                                                   // 553
		}                                                                                                                    // 554
                                                                                                                       //
		return executeTriggers;                                                                                              // 4
	}();                                                                                                                  // 4
                                                                                                                       //
	RocketChatIntegrationHandler.prototype.executeTrigger = function () {                                                 // 4
		function executeTrigger(trigger, argObject) {                                                                        // 4
			for (var _iterator15 = trigger.urls, _isArray15 = Array.isArray(_iterator15), _i15 = 0, _iterator15 = _isArray15 ? _iterator15 : _iterator15[Symbol.iterator]();;) {
				var _ref18;                                                                                                        // 557
                                                                                                                       //
				if (_isArray15) {                                                                                                  // 557
					if (_i15 >= _iterator15.length) break;                                                                            // 557
					_ref18 = _iterator15[_i15++];                                                                                     // 557
				} else {                                                                                                           // 557
					_i15 = _iterator15.next();                                                                                        // 557
					if (_i15.done) break;                                                                                             // 557
					_ref18 = _i15.value;                                                                                              // 557
				}                                                                                                                  // 557
                                                                                                                       //
				var url = _ref18;                                                                                                  // 557
				this.executeTriggerUrl(url, trigger, argObject, 0);                                                                // 558
			}                                                                                                                   // 559
		}                                                                                                                    // 560
                                                                                                                       //
		return executeTrigger;                                                                                               // 4
	}();                                                                                                                  // 4
                                                                                                                       //
	RocketChatIntegrationHandler.prototype.executeTriggerUrl = function () {                                              // 4
		function executeTriggerUrl(url, trigger, _ref19, theHistoryId) {                                                     // 4
			var event = _ref19.event,                                                                                           // 562
			    message = _ref19.message,                                                                                       // 562
			    room = _ref19.room,                                                                                             // 562
			    owner = _ref19.owner,                                                                                           // 562
			    user = _ref19.user;                                                                                             // 562
                                                                                                                       //
			var _this2 = this;                                                                                                  // 562
                                                                                                                       //
			var tries = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;                                  // 562
                                                                                                                       //
			if (!this.isTriggerEnabled(trigger)) {                                                                              // 563
				logger.outgoing.warn("The trigger \"" + trigger.name + "\" is no longer enabled, stopping execution of it at try: " + tries);
				return;                                                                                                            // 565
			}                                                                                                                   // 566
                                                                                                                       //
			logger.outgoing.debug("Starting to execute trigger: " + trigger.name + " (" + trigger._id + ")");                   // 568
			var word = void 0; //Not all triggers/events support triggerWords                                                   // 570
                                                                                                                       //
			if (RocketChat.integrations.outgoingEvents[event].use.triggerWords) {                                               // 572
				if (trigger.triggerWords && trigger.triggerWords.length > 0) {                                                     // 573
					for (var _iterator16 = trigger.triggerWords, _isArray16 = Array.isArray(_iterator16), _i16 = 0, _iterator16 = _isArray16 ? _iterator16 : _iterator16[Symbol.iterator]();;) {
						var _ref20;                                                                                                      // 574
                                                                                                                       //
						if (_isArray16) {                                                                                                // 574
							if (_i16 >= _iterator16.length) break;                                                                          // 574
							_ref20 = _iterator16[_i16++];                                                                                   // 574
						} else {                                                                                                         // 574
							_i16 = _iterator16.next();                                                                                      // 574
							if (_i16.done) break;                                                                                           // 574
							_ref20 = _i16.value;                                                                                            // 574
						}                                                                                                                // 574
                                                                                                                       //
						var triggerWord = _ref20;                                                                                        // 574
                                                                                                                       //
						if (!trigger.triggerWordAnywhere && message.msg.indexOf(triggerWord) === 0) {                                    // 575
							word = triggerWord;                                                                                             // 576
							break;                                                                                                          // 577
						} else if (trigger.triggerWordAnywhere && message.msg.includes(triggerWord)) {                                   // 578
							word = triggerWord;                                                                                             // 579
							break;                                                                                                          // 580
						}                                                                                                                // 581
					} // Stop if there are triggerWords but none match                                                                // 582
                                                                                                                       //
                                                                                                                       //
					if (!word) {                                                                                                      // 585
						logger.outgoing.debug("The trigger word which \"" + trigger.name + "\" was expecting could not be found, not executing.");
						return;                                                                                                          // 587
					}                                                                                                                 // 588
				}                                                                                                                  // 589
			}                                                                                                                   // 590
                                                                                                                       //
			if (message && message.editedAt && !trigger.runOnEdits) {                                                           // 592
				logger.outgoing.debug("The trigger \"" + trigger.name + "\"'s run on edits is disabled and the message was edited.");
				return;                                                                                                            // 594
			}                                                                                                                   // 595
                                                                                                                       //
			var historyId = this.updateHistory({                                                                                // 597
				step: 'start-execute-trigger-url',                                                                                 // 597
				integration: trigger,                                                                                              // 597
				event: event                                                                                                       // 597
			});                                                                                                                 // 597
			var data = {                                                                                                        // 599
				token: trigger.token,                                                                                              // 600
				bot: false                                                                                                         // 601
			};                                                                                                                  // 599
                                                                                                                       //
			if (word) {                                                                                                         // 604
				data.trigger_word = word;                                                                                          // 605
			}                                                                                                                   // 606
                                                                                                                       //
			this.mapEventArgsToData(data, {                                                                                     // 608
				trigger: trigger,                                                                                                  // 608
				event: event,                                                                                                      // 608
				message: message,                                                                                                  // 608
				room: room,                                                                                                        // 608
				owner: owner,                                                                                                      // 608
				user: user                                                                                                         // 608
			});                                                                                                                 // 608
			this.updateHistory({                                                                                                // 609
				historyId: historyId,                                                                                              // 609
				step: 'mapped-args-to-data',                                                                                       // 609
				data: data,                                                                                                        // 609
				triggerWord: word                                                                                                  // 609
			});                                                                                                                 // 609
			logger.outgoing.info("Will be executing the Integration \"" + trigger.name + "\" to the url: " + url);              // 611
			logger.outgoing.debug(data);                                                                                        // 612
			var opts = {                                                                                                        // 614
				params: {},                                                                                                        // 615
				method: 'POST',                                                                                                    // 616
				url: url,                                                                                                          // 617
				data: data,                                                                                                        // 618
				auth: undefined,                                                                                                   // 619
				npmRequestOptions: {                                                                                               // 620
					rejectUnauthorized: !RocketChat.settings.get('Allow_Invalid_SelfSigned_Certs'),                                   // 621
					strictSSL: !RocketChat.settings.get('Allow_Invalid_SelfSigned_Certs')                                             // 622
				},                                                                                                                 // 620
				headers: {                                                                                                         // 624
					'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36'
				}                                                                                                                  // 624
			};                                                                                                                  // 614
                                                                                                                       //
			if (this.hasScriptAndMethod(trigger, 'prepare_outgoing_request')) {                                                 // 629
				opts = this.executeScript(trigger, 'prepare_outgoing_request', {                                                   // 630
					request: opts                                                                                                     // 630
				}, historyId);                                                                                                     // 630
			}                                                                                                                   // 631
                                                                                                                       //
			this.updateHistory({                                                                                                // 633
				historyId: historyId,                                                                                              // 633
				step: 'after-maybe-ran-prepare',                                                                                   // 633
				ranPrepareScript: true                                                                                             // 633
			});                                                                                                                 // 633
                                                                                                                       //
			if (!opts) {                                                                                                        // 635
				this.updateHistory({                                                                                               // 636
					historyId: historyId,                                                                                             // 636
					step: 'after-prepare-no-opts',                                                                                    // 636
					finished: true                                                                                                    // 636
				});                                                                                                                // 636
				return;                                                                                                            // 637
			}                                                                                                                   // 638
                                                                                                                       //
			if (opts.message) {                                                                                                 // 640
				var prepareMessage = this.sendMessage({                                                                            // 641
					trigger: trigger,                                                                                                 // 641
					room: room,                                                                                                       // 641
					message: opts.message,                                                                                            // 641
					data: data                                                                                                        // 641
				});                                                                                                                // 641
				this.updateHistory({                                                                                               // 642
					historyId: historyId,                                                                                             // 642
					step: 'after-prepare-send-message',                                                                               // 642
					prepareSentMessage: prepareMessage                                                                                // 642
				});                                                                                                                // 642
			}                                                                                                                   // 643
                                                                                                                       //
			if (!opts.url || !opts.method) {                                                                                    // 645
				this.updateHistory({                                                                                               // 646
					historyId: historyId,                                                                                             // 646
					step: 'after-prepare-no-url_or_method',                                                                           // 646
					finished: true                                                                                                    // 646
				});                                                                                                                // 646
				return;                                                                                                            // 647
			}                                                                                                                   // 648
                                                                                                                       //
			this.updateHistory({                                                                                                // 650
				historyId: historyId,                                                                                              // 650
				step: 'pre-http-call',                                                                                             // 650
				url: opts.url,                                                                                                     // 650
				httpCallData: opts.data                                                                                            // 650
			});                                                                                                                 // 650
			HTTP.call(opts.method, opts.url, opts, function (error, result) {                                                   // 651
				if (!result) {                                                                                                     // 652
					logger.outgoing.warn("Result for the Integration " + trigger.name + " to " + url + " is empty");                  // 653
				} else {                                                                                                           // 654
					logger.outgoing.info("Status code for the Integration " + trigger.name + " to " + url + " is " + result.statusCode);
				}                                                                                                                  // 656
                                                                                                                       //
				_this2.updateHistory({                                                                                             // 658
					historyId: historyId,                                                                                             // 658
					step: 'after-http-call',                                                                                          // 658
					httpError: error,                                                                                                 // 658
					httpResult: result                                                                                                // 658
				});                                                                                                                // 658
                                                                                                                       //
				if (_this2.hasScriptAndMethod(trigger, 'process_outgoing_response')) {                                             // 660
					var sandbox = {                                                                                                   // 661
						request: opts,                                                                                                   // 662
						response: {                                                                                                      // 663
							error: error,                                                                                                   // 664
							status_code: result ? result.statusCode : undefined,                                                            // 665
							//These values will be undefined to close issues #4175, #5762, and #5896                                        // 665
							content: result ? result.data : undefined,                                                                      // 666
							content_raw: result ? result.content : undefined,                                                               // 667
							headers: result ? result.headers : {}                                                                           // 668
						}                                                                                                                // 663
					};                                                                                                                // 661
                                                                                                                       //
					var scriptResult = _this2.executeScript(trigger, 'process_outgoing_response', sandbox, historyId);                // 672
                                                                                                                       //
					if (scriptResult && scriptResult.content) {                                                                       // 674
						var resultMessage = _this2.sendMessage({                                                                         // 675
							trigger: trigger,                                                                                               // 675
							room: room,                                                                                                     // 675
							message: scriptResult.content,                                                                                  // 675
							data: data                                                                                                      // 675
						});                                                                                                              // 675
                                                                                                                       //
						_this2.updateHistory({                                                                                           // 676
							historyId: historyId,                                                                                           // 676
							step: 'after-process-send-message',                                                                             // 676
							processSentMessage: resultMessage,                                                                              // 676
							finished: true                                                                                                  // 676
						});                                                                                                              // 676
                                                                                                                       //
						return;                                                                                                          // 677
					}                                                                                                                 // 678
                                                                                                                       //
					if (scriptResult === false) {                                                                                     // 680
						_this2.updateHistory({                                                                                           // 681
							historyId: historyId,                                                                                           // 681
							step: 'after-process-false-result',                                                                             // 681
							finished: true                                                                                                  // 681
						});                                                                                                              // 681
                                                                                                                       //
						return;                                                                                                          // 682
					}                                                                                                                 // 683
				} // if the result contained nothing or wasn't a successful statusCode                                             // 684
                                                                                                                       //
                                                                                                                       //
				if (!result || !_this2.successResults.includes(result.statusCode)) {                                               // 687
					if (error) {                                                                                                      // 688
						logger.outgoing.error("Error for the Integration \"" + trigger.name + "\" to " + url + " is:");                  // 689
						logger.outgoing.error(error);                                                                                    // 690
					}                                                                                                                 // 691
                                                                                                                       //
					if (result) {                                                                                                     // 693
						logger.outgoing.error("Error for the Integration \"" + trigger.name + "\" to " + url + " is:");                  // 694
						logger.outgoing.error(result);                                                                                   // 695
                                                                                                                       //
						if (result.statusCode === 410) {                                                                                 // 697
							_this2.updateHistory({                                                                                          // 698
								historyId: historyId,                                                                                          // 698
								step: 'after-process-http-status-410',                                                                         // 698
								error: true                                                                                                    // 698
							});                                                                                                             // 698
                                                                                                                       //
							logger.outgoing.error("Disabling the Integration \"" + trigger.name + "\" because the status code was 401 (Gone).");
							RocketChat.models.Integrations.update({                                                                         // 700
								_id: trigger._id                                                                                               // 700
							}, {                                                                                                            // 700
								$set: {                                                                                                        // 700
									enabled: false                                                                                                // 700
								}                                                                                                              // 700
							});                                                                                                             // 700
							return;                                                                                                         // 701
						}                                                                                                                // 702
                                                                                                                       //
						if (result.statusCode === 500) {                                                                                 // 704
							_this2.updateHistory({                                                                                          // 705
								historyId: historyId,                                                                                          // 705
								step: 'after-process-http-status-500',                                                                         // 705
								error: true                                                                                                    // 705
							});                                                                                                             // 705
                                                                                                                       //
							logger.outgoing.error("Error \"500\" for the Integration \"" + trigger.name + "\" to " + url + ".");            // 706
							logger.outgoing.error(result.content);                                                                          // 707
							return;                                                                                                         // 708
						}                                                                                                                // 709
					}                                                                                                                 // 710
                                                                                                                       //
					if (trigger.retryFailedCalls) {                                                                                   // 712
						if (tries < trigger.retryCount && trigger.retryDelay) {                                                          // 713
							_this2.updateHistory({                                                                                          // 714
								historyId: historyId,                                                                                          // 714
								error: true,                                                                                                   // 714
								step: "going-to-retry-" + (tries + 1)                                                                          // 714
							});                                                                                                             // 714
                                                                                                                       //
							var waitTime = void 0;                                                                                          // 716
                                                                                                                       //
							switch (trigger.retryDelay) {                                                                                   // 718
								case 'powers-of-ten':                                                                                          // 719
									// Try again in 0.1s, 1s, 10s, 1m40s, 16m40s, 2h46m40s, 27h46m40s, etc                                        // 720
									waitTime = Math.pow(10, tries + 2);                                                                           // 721
									break;                                                                                                        // 722
                                                                                                                       //
								case 'powers-of-two':                                                                                          // 723
									// 2 seconds, 4 seconds, 8 seconds                                                                            // 724
									waitTime = Math.pow(2, tries + 1) * 1000;                                                                     // 725
									break;                                                                                                        // 726
                                                                                                                       //
								case 'increments-of-two':                                                                                      // 727
									// 2 second, 4 seconds, 6 seconds, etc                                                                        // 728
									waitTime = (tries + 1) * 2 * 1000;                                                                            // 729
									break;                                                                                                        // 730
                                                                                                                       //
								default:                                                                                                       // 731
									var er = new Error('The integration\'s retryDelay setting is invalid.');                                      // 732
                                                                                                                       //
									_this2.updateHistory({                                                                                        // 733
										historyId: historyId,                                                                                        // 733
										step: 'failed-and-retry-delay-is-invalid',                                                                   // 733
										error: true,                                                                                                 // 733
										errorStack: er.stack                                                                                         // 733
									});                                                                                                           // 733
                                                                                                                       //
									return;                                                                                                       // 734
							}                                                                                                               // 718
                                                                                                                       //
							logger.outgoing.info("Trying the Integration " + trigger.name + " to " + url + " again in " + waitTime + " milliseconds.");
							Meteor.setTimeout(function () {                                                                                 // 738
								_this2.executeTriggerUrl(url, trigger, {                                                                       // 739
									event: event,                                                                                                 // 739
									message: message,                                                                                             // 739
									room: room,                                                                                                   // 739
									owner: owner,                                                                                                 // 739
									user: user                                                                                                    // 739
								}, historyId, tries + 1);                                                                                      // 739
							}, waitTime);                                                                                                   // 740
						} else {                                                                                                         // 741
							_this2.updateHistory({                                                                                          // 742
								historyId: historyId,                                                                                          // 742
								step: 'too-many-retries',                                                                                      // 742
								error: true                                                                                                    // 742
							});                                                                                                             // 742
						}                                                                                                                // 743
					} else {                                                                                                          // 744
						_this2.updateHistory({                                                                                           // 745
							historyId: historyId,                                                                                           // 745
							step: 'failed-and-not-configured-to-retry',                                                                     // 745
							error: true                                                                                                     // 745
						});                                                                                                              // 745
					}                                                                                                                 // 746
                                                                                                                       //
					return;                                                                                                           // 748
				} //process outgoing webhook response as a new message                                                             // 749
                                                                                                                       //
                                                                                                                       //
				if (result && _this2.successResults.includes(result.statusCode)) {                                                 // 752
					if (result && result.data && (result.data.text || result.data.attachments)) {                                     // 753
						var resultMsg = _this2.sendMessage({                                                                             // 754
							trigger: trigger,                                                                                               // 754
							room: room,                                                                                                     // 754
							message: result.data,                                                                                           // 754
							data: data                                                                                                      // 754
						});                                                                                                              // 754
                                                                                                                       //
						_this2.updateHistory({                                                                                           // 755
							historyId: historyId,                                                                                           // 755
							step: 'url-response-sent-message',                                                                              // 755
							resultMessage: resultMsg,                                                                                       // 755
							finished: true                                                                                                  // 755
						});                                                                                                              // 755
					}                                                                                                                 // 756
				}                                                                                                                  // 757
			});                                                                                                                 // 758
		}                                                                                                                    // 759
                                                                                                                       //
		return executeTriggerUrl;                                                                                            // 4
	}();                                                                                                                  // 4
                                                                                                                       //
	RocketChatIntegrationHandler.prototype.replay = function () {                                                         // 4
		function replay(integration, history) {                                                                              // 4
			if (!integration || integration.type !== 'webhook-outgoing') {                                                      // 762
				throw new Meteor.Error('integration-type-must-be-outgoing', 'The integration type to replay must be an outgoing webhook.');
			}                                                                                                                   // 764
                                                                                                                       //
			if (!history || !history.data) {                                                                                    // 766
				throw new Meteor.Error('history-data-must-be-defined', 'The history data must be defined to replay an integration.');
			}                                                                                                                   // 768
                                                                                                                       //
			var event = history.event;                                                                                          // 770
			var message = RocketChat.models.Messages.findOneById(history.data.message_id);                                      // 771
			var room = RocketChat.models.Rooms.findOneById(history.data.channel_id);                                            // 772
			var user = RocketChat.models.Users.findOneById(history.data.user_id);                                               // 773
			var owner = void 0;                                                                                                 // 774
                                                                                                                       //
			if (history.data.owner && history.data.owner._id) {                                                                 // 776
				owner = RocketChat.models.Users.findOneById(history.data.owner._id);                                               // 777
			}                                                                                                                   // 778
                                                                                                                       //
			this.executeTriggerUrl(history.url, integration, {                                                                  // 780
				event: event,                                                                                                      // 780
				message: message,                                                                                                  // 780
				room: room,                                                                                                        // 780
				owner: owner,                                                                                                      // 780
				user: user                                                                                                         // 780
			});                                                                                                                 // 780
		}                                                                                                                    // 781
                                                                                                                       //
		return replay;                                                                                                       // 4
	}();                                                                                                                  // 4
                                                                                                                       //
	return RocketChatIntegrationHandler;                                                                                  // 4
}())();                                                                                                                // 4
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"models":{"Integrations.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_integrations/server/models/Integrations.js                                                      //
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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
RocketChat.models.Integrations = new (function (_RocketChat$models$_B) {                                               // 1
	(0, _inherits3.default)(Integrations, _RocketChat$models$_B);                                                         // 1
                                                                                                                       //
	function Integrations() {                                                                                             // 2
		(0, _classCallCheck3.default)(this, Integrations);                                                                   // 2
		return (0, _possibleConstructorReturn3.default)(this, _RocketChat$models$_B.call(this, 'integrations'));             // 2
	}                                                                                                                     // 4
                                                                                                                       //
	Integrations.prototype.findByType = function () {                                                                     // 1
		function findByType(type, options) {                                                                                 // 1
			if (type !== 'webhook-incoming' && type !== 'webhook-outgoing') {                                                   // 7
				throw new Meteor.Error('invalid-type-to-find');                                                                    // 8
			}                                                                                                                   // 9
                                                                                                                       //
			return this.find({                                                                                                  // 11
				type: type                                                                                                         // 11
			}, options);                                                                                                        // 11
		}                                                                                                                    // 12
                                                                                                                       //
		return findByType;                                                                                                   // 1
	}();                                                                                                                  // 1
                                                                                                                       //
	Integrations.prototype.disableByUserId = function () {                                                                // 1
		function disableByUserId(userId) {                                                                                   // 1
			return this.update({                                                                                                // 15
				userId: userId                                                                                                     // 15
			}, {                                                                                                                // 15
				$set: {                                                                                                            // 15
					enabled: false                                                                                                    // 15
				}                                                                                                                  // 15
			}, {                                                                                                                // 15
				multi: true                                                                                                        // 15
			});                                                                                                                 // 15
		}                                                                                                                    // 16
                                                                                                                       //
		return disableByUserId;                                                                                              // 1
	}();                                                                                                                  // 1
                                                                                                                       //
	return Integrations;                                                                                                  // 1
}(RocketChat.models._Base))();                                                                                         // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"IntegrationHistory.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_integrations/server/models/IntegrationHistory.js                                                //
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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
RocketChat.models.IntegrationHistory = new (function (_RocketChat$models$_B) {                                         // 1
	(0, _inherits3.default)(IntegrationHistory, _RocketChat$models$_B);                                                   // 1
                                                                                                                       //
	function IntegrationHistory() {                                                                                       // 2
		(0, _classCallCheck3.default)(this, IntegrationHistory);                                                             // 2
		return (0, _possibleConstructorReturn3.default)(this, _RocketChat$models$_B.call(this, 'integration_history'));      // 2
	}                                                                                                                     // 4
                                                                                                                       //
	IntegrationHistory.prototype.findByType = function () {                                                               // 1
		function findByType(type, options) {                                                                                 // 1
			if (type !== 'outgoing-webhook' || type !== 'incoming-webhook') {                                                   // 7
				throw new Meteor.Error('invalid-integration-type');                                                                // 8
			}                                                                                                                   // 9
                                                                                                                       //
			return this.find({                                                                                                  // 11
				type: type                                                                                                         // 11
			}, options);                                                                                                        // 11
		}                                                                                                                    // 12
                                                                                                                       //
		return findByType;                                                                                                   // 1
	}();                                                                                                                  // 1
                                                                                                                       //
	IntegrationHistory.prototype.findByIntegrationId = function () {                                                      // 1
		function findByIntegrationId(id, options) {                                                                          // 1
			return this.find({                                                                                                  // 15
				'integration._id': id                                                                                              // 15
			}, options);                                                                                                        // 15
		}                                                                                                                    // 16
                                                                                                                       //
		return findByIntegrationId;                                                                                          // 1
	}();                                                                                                                  // 1
                                                                                                                       //
	IntegrationHistory.prototype.findByIntegrationIdAndCreatedBy = function () {                                          // 1
		function findByIntegrationIdAndCreatedBy(id, creatorId, options) {                                                   // 1
			return this.find({                                                                                                  // 19
				'integration._id': id,                                                                                             // 19
				'integration._createdBy._id': creatorId                                                                            // 19
			}, options);                                                                                                        // 19
		}                                                                                                                    // 20
                                                                                                                       //
		return findByIntegrationIdAndCreatedBy;                                                                              // 1
	}();                                                                                                                  // 1
                                                                                                                       //
	IntegrationHistory.prototype.findOneByIntegrationIdAndHistoryId = function () {                                       // 1
		function findOneByIntegrationIdAndHistoryId(integrationId, historyId) {                                              // 1
			return this.findOne({                                                                                               // 23
				'integration._id': integrationId,                                                                                  // 23
				_id: historyId                                                                                                     // 23
			});                                                                                                                 // 23
		}                                                                                                                    // 24
                                                                                                                       //
		return findOneByIntegrationIdAndHistoryId;                                                                           // 1
	}();                                                                                                                  // 1
                                                                                                                       //
	IntegrationHistory.prototype.findByEventName = function () {                                                          // 1
		function findByEventName(event, options) {                                                                           // 1
			return this.find({                                                                                                  // 27
				event: event                                                                                                       // 27
			}, options);                                                                                                        // 27
		}                                                                                                                    // 28
                                                                                                                       //
		return findByEventName;                                                                                              // 1
	}();                                                                                                                  // 1
                                                                                                                       //
	IntegrationHistory.prototype.findFailed = function () {                                                               // 1
		function findFailed(options) {                                                                                       // 1
			return this.find({                                                                                                  // 31
				error: true                                                                                                        // 31
			}, options);                                                                                                        // 31
		}                                                                                                                    // 32
                                                                                                                       //
		return findFailed;                                                                                                   // 1
	}();                                                                                                                  // 1
                                                                                                                       //
	IntegrationHistory.prototype.removeByIntegrationId = function () {                                                    // 1
		function removeByIntegrationId(integrationId) {                                                                      // 1
			return this.remove({                                                                                                // 35
				'integration._id': integrationId                                                                                   // 35
			});                                                                                                                 // 35
		}                                                                                                                    // 36
                                                                                                                       //
		return removeByIntegrationId;                                                                                        // 1
	}();                                                                                                                  // 1
                                                                                                                       //
	return IntegrationHistory;                                                                                            // 1
}(RocketChat.models._Base))();                                                                                         // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"publications":{"integrations.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_integrations/server/publications/integrations.js                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('integrations', function () {                                                                           // 1
	function _integrationPublication() {                                                                                  // 1
		if (!this.userId) {                                                                                                  // 2
			return this.ready();                                                                                                // 3
		}                                                                                                                    // 4
                                                                                                                       //
		if (RocketChat.authz.hasPermission(this.userId, 'manage-integrations')) {                                            // 6
			return RocketChat.models.Integrations.find();                                                                       // 7
		} else if (RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations')) {                                 // 8
			return RocketChat.models.Integrations.find({                                                                        // 9
				'_createdBy._id': this.userId                                                                                      // 9
			});                                                                                                                 // 9
		} else {                                                                                                             // 10
			throw new Meteor.Error('not-authorized');                                                                           // 11
		}                                                                                                                    // 12
	}                                                                                                                     // 13
                                                                                                                       //
	return _integrationPublication;                                                                                       // 1
}());                                                                                                                  // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"integrationHistory.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_integrations/server/publications/integrationHistory.js                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('integrationHistory', function () {                                                                     // 1
	function _integrationHistoryPublication(integrationId) {                                                              // 1
		var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 25;                                  // 1
                                                                                                                       //
		if (!this.userId) {                                                                                                  // 2
			return this.ready();                                                                                                // 3
		}                                                                                                                    // 4
                                                                                                                       //
		if (RocketChat.authz.hasPermission(this.userId, 'manage-integrations')) {                                            // 6
			return RocketChat.models.IntegrationHistory.findByIntegrationId(integrationId, {                                    // 7
				sort: {                                                                                                            // 7
					_updatedAt: -1                                                                                                    // 7
				},                                                                                                                 // 7
				limit: limit                                                                                                       // 7
			});                                                                                                                 // 7
		} else if (RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations')) {                                 // 8
			return RocketChat.models.IntegrationHistory.findByIntegrationIdAndCreatedBy(integrationId, this.userId, {           // 9
				sort: {                                                                                                            // 9
					_updatedAt: -1                                                                                                    // 9
				},                                                                                                                 // 9
				limit: limit                                                                                                       // 9
			});                                                                                                                 // 9
		} else {                                                                                                             // 10
			throw new Meteor.Error('not-authorized');                                                                           // 11
		}                                                                                                                    // 12
	}                                                                                                                     // 13
                                                                                                                       //
	return _integrationHistoryPublication;                                                                                // 1
}());                                                                                                                  // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods":{"incoming":{"addIncomingIntegration.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_integrations/server/methods/incoming/addIncomingIntegration.js                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* global Babel */var validChannelChars = ['@', '#'];                                                                  // 1
Meteor.methods({                                                                                                       // 4
	addIncomingIntegration: function (integration) {                                                                      // 5
		if (!RocketChat.authz.hasPermission(this.userId, 'manage-integrations') && !RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations')) {
			throw new Meteor.Error('not_authorized', 'Unauthorized', {                                                          // 7
				method: 'addIncomingIntegration'                                                                                   // 7
			});                                                                                                                 // 7
		}                                                                                                                    // 8
                                                                                                                       //
		if (!_.isString(integration.channel)) {                                                                              // 10
			throw new Meteor.Error('error-invalid-channel', 'Invalid channel', {                                                // 11
				method: 'addIncomingIntegration'                                                                                   // 11
			});                                                                                                                 // 11
		}                                                                                                                    // 12
                                                                                                                       //
		if (integration.channel.trim() === '') {                                                                             // 14
			throw new Meteor.Error('error-invalid-channel', 'Invalid channel', {                                                // 15
				method: 'addIncomingIntegration'                                                                                   // 15
			});                                                                                                                 // 15
		}                                                                                                                    // 16
                                                                                                                       //
		var channels = _.map(integration.channel.split(','), function (channel) {                                            // 18
			return s.trim(channel);                                                                                             // 18
		});                                                                                                                  // 18
                                                                                                                       //
		for (var _iterator = channels, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
			var _ref;                                                                                                           // 20
                                                                                                                       //
			if (_isArray) {                                                                                                     // 20
				if (_i >= _iterator.length) break;                                                                                 // 20
				_ref = _iterator[_i++];                                                                                            // 20
			} else {                                                                                                            // 20
				_i = _iterator.next();                                                                                             // 20
				if (_i.done) break;                                                                                                // 20
				_ref = _i.value;                                                                                                   // 20
			}                                                                                                                   // 20
                                                                                                                       //
			var channel = _ref;                                                                                                 // 20
                                                                                                                       //
			if (!validChannelChars.includes(channel[0])) {                                                                      // 21
				throw new Meteor.Error('error-invalid-channel-start-with-chars', 'Invalid channel. Start with @ or #', {           // 22
					method: 'updateIncomingIntegration'                                                                               // 22
				});                                                                                                                // 22
			}                                                                                                                   // 23
		}                                                                                                                    // 24
                                                                                                                       //
		if (!_.isString(integration.username) || integration.username.trim() === '') {                                       // 26
			throw new Meteor.Error('error-invalid-username', 'Invalid username', {                                              // 27
				method: 'addIncomingIntegration'                                                                                   // 27
			});                                                                                                                 // 27
		}                                                                                                                    // 28
                                                                                                                       //
		if (integration.scriptEnabled === true && integration.script && integration.script.trim() !== '') {                  // 30
			try {                                                                                                               // 31
				var babelOptions = Babel.getDefaultOptions({                                                                       // 32
					runtime: false                                                                                                    // 32
				});                                                                                                                // 32
				babelOptions = _.extend(babelOptions, {                                                                            // 33
					compact: true,                                                                                                    // 33
					minified: true,                                                                                                   // 33
					comments: false                                                                                                   // 33
				});                                                                                                                // 33
				integration.scriptCompiled = Babel.compile(integration.script, babelOptions).code;                                 // 35
				integration.scriptError = undefined;                                                                               // 36
			} catch (e) {                                                                                                       // 37
				integration.scriptCompiled = undefined;                                                                            // 38
				integration.scriptError = _.pick(e, 'name', 'message', 'stack');                                                   // 39
			}                                                                                                                   // 40
		}                                                                                                                    // 41
                                                                                                                       //
		for (var _iterator2 = channels, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
			var _ref2;                                                                                                          // 43
                                                                                                                       //
			if (_isArray2) {                                                                                                    // 43
				if (_i2 >= _iterator2.length) break;                                                                               // 43
				_ref2 = _iterator2[_i2++];                                                                                         // 43
			} else {                                                                                                            // 43
				_i2 = _iterator2.next();                                                                                           // 43
				if (_i2.done) break;                                                                                               // 43
				_ref2 = _i2.value;                                                                                                 // 43
			}                                                                                                                   // 43
                                                                                                                       //
			var _channel = _ref2;                                                                                               // 43
			var record = void 0;                                                                                                // 44
			var channelType = _channel[0];                                                                                      // 45
			_channel = _channel.substr(1);                                                                                      // 46
                                                                                                                       //
			switch (channelType) {                                                                                              // 48
				case '#':                                                                                                          // 49
					record = RocketChat.models.Rooms.findOne({                                                                        // 50
						$or: [{                                                                                                          // 51
							_id: _channel                                                                                                   // 52
						}, {                                                                                                             // 52
							name: _channel                                                                                                  // 53
						}]                                                                                                               // 53
					});                                                                                                               // 50
					break;                                                                                                            // 56
                                                                                                                       //
				case '@':                                                                                                          // 57
					record = RocketChat.models.Users.findOne({                                                                        // 58
						$or: [{                                                                                                          // 59
							_id: _channel                                                                                                   // 60
						}, {                                                                                                             // 60
							username: _channel                                                                                              // 61
						}]                                                                                                               // 61
					});                                                                                                               // 58
					break;                                                                                                            // 64
			}                                                                                                                   // 48
                                                                                                                       //
			if (!record) {                                                                                                      // 67
				throw new Meteor.Error('error-invalid-room', 'Invalid room', {                                                     // 68
					method: 'addIncomingIntegration'                                                                                  // 68
				});                                                                                                                // 68
			}                                                                                                                   // 69
                                                                                                                       //
			if (record.usernames && !RocketChat.authz.hasPermission(this.userId, 'manage-integrations') && RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations') && !record.usernames.includes(Meteor.user().username)) {
				throw new Meteor.Error('error-invalid-channel', 'Invalid Channel', {                                               // 72
					method: 'addIncomingIntegration'                                                                                  // 72
				});                                                                                                                // 72
			}                                                                                                                   // 73
		}                                                                                                                    // 74
                                                                                                                       //
		var user = RocketChat.models.Users.findOne({                                                                         // 76
			username: integration.username                                                                                      // 76
		});                                                                                                                  // 76
                                                                                                                       //
		if (!user) {                                                                                                         // 78
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                      // 79
				method: 'addIncomingIntegration'                                                                                   // 79
			});                                                                                                                 // 79
		}                                                                                                                    // 80
                                                                                                                       //
		var token = Random.id(48);                                                                                           // 82
		integration.type = 'webhook-incoming';                                                                               // 84
		integration.token = token;                                                                                           // 85
		integration.channel = channels;                                                                                      // 86
		integration.userId = user._id;                                                                                       // 87
		integration._createdAt = new Date();                                                                                 // 88
		integration._createdBy = RocketChat.models.Users.findOne(this.userId, {                                              // 89
			fields: {                                                                                                           // 89
				username: 1                                                                                                        // 89
			}                                                                                                                   // 89
		});                                                                                                                  // 89
		RocketChat.models.Roles.addUserRoles(user._id, 'bot');                                                               // 91
		integration._id = RocketChat.models.Integrations.insert(integration);                                                // 93
		return integration;                                                                                                  // 95
	}                                                                                                                     // 96
});                                                                                                                    // 4
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"updateIncomingIntegration.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_integrations/server/methods/incoming/updateIncomingIntegration.js                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* global Babel */var validChannelChars = ['@', '#'];                                                                  // 1
Meteor.methods({                                                                                                       // 4
	updateIncomingIntegration: function (integrationId, integration) {                                                    // 5
		if (!_.isString(integration.channel) || integration.channel.trim() === '') {                                         // 6
			throw new Meteor.Error('error-invalid-channel', 'Invalid channel', {                                                // 7
				method: 'updateIncomingIntegration'                                                                                // 7
			});                                                                                                                 // 7
		}                                                                                                                    // 8
                                                                                                                       //
		var channels = _.map(integration.channel.split(','), function (channel) {                                            // 10
			return s.trim(channel);                                                                                             // 10
		});                                                                                                                  // 10
                                                                                                                       //
		for (var _iterator = channels, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
			var _ref;                                                                                                           // 12
                                                                                                                       //
			if (_isArray) {                                                                                                     // 12
				if (_i >= _iterator.length) break;                                                                                 // 12
				_ref = _iterator[_i++];                                                                                            // 12
			} else {                                                                                                            // 12
				_i = _iterator.next();                                                                                             // 12
				if (_i.done) break;                                                                                                // 12
				_ref = _i.value;                                                                                                   // 12
			}                                                                                                                   // 12
                                                                                                                       //
			var channel = _ref;                                                                                                 // 12
                                                                                                                       //
			if (!validChannelChars.includes(channel[0])) {                                                                      // 13
				throw new Meteor.Error('error-invalid-channel-start-with-chars', 'Invalid channel. Start with @ or #', {           // 14
					method: 'updateIncomingIntegration'                                                                               // 14
				});                                                                                                                // 14
			}                                                                                                                   // 15
		}                                                                                                                    // 16
                                                                                                                       //
		var currentIntegration = void 0;                                                                                     // 18
                                                                                                                       //
		if (RocketChat.authz.hasPermission(this.userId, 'manage-integrations')) {                                            // 20
			currentIntegration = RocketChat.models.Integrations.findOne(integrationId);                                         // 21
		} else if (RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations')) {                                 // 22
			currentIntegration = RocketChat.models.Integrations.findOne({                                                       // 23
				_id: integrationId,                                                                                                // 23
				'_createdBy._id': this.userId                                                                                      // 23
			});                                                                                                                 // 23
		} else {                                                                                                             // 24
			throw new Meteor.Error('not_authorized', 'Unauthorized', {                                                          // 25
				method: 'updateIncomingIntegration'                                                                                // 25
			});                                                                                                                 // 25
		}                                                                                                                    // 26
                                                                                                                       //
		if (!currentIntegration) {                                                                                           // 28
			throw new Meteor.Error('error-invalid-integration', 'Invalid integration', {                                        // 29
				method: 'updateIncomingIntegration'                                                                                // 29
			});                                                                                                                 // 29
		}                                                                                                                    // 30
                                                                                                                       //
		if (integration.scriptEnabled === true && integration.script && integration.script.trim() !== '') {                  // 32
			try {                                                                                                               // 33
				var babelOptions = Babel.getDefaultOptions({                                                                       // 34
					runtime: false                                                                                                    // 34
				});                                                                                                                // 34
				babelOptions = _.extend(babelOptions, {                                                                            // 35
					compact: true,                                                                                                    // 35
					minified: true,                                                                                                   // 35
					comments: false                                                                                                   // 35
				});                                                                                                                // 35
				integration.scriptCompiled = Babel.compile(integration.script, babelOptions).code;                                 // 37
				integration.scriptError = undefined;                                                                               // 38
			} catch (e) {                                                                                                       // 39
				integration.scriptCompiled = undefined;                                                                            // 40
				integration.scriptError = _.pick(e, 'name', 'message', 'stack');                                                   // 41
			}                                                                                                                   // 42
		}                                                                                                                    // 43
                                                                                                                       //
		for (var _iterator2 = channels, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
			var _ref2;                                                                                                          // 45
                                                                                                                       //
			if (_isArray2) {                                                                                                    // 45
				if (_i2 >= _iterator2.length) break;                                                                               // 45
				_ref2 = _iterator2[_i2++];                                                                                         // 45
			} else {                                                                                                            // 45
				_i2 = _iterator2.next();                                                                                           // 45
				if (_i2.done) break;                                                                                               // 45
				_ref2 = _i2.value;                                                                                                 // 45
			}                                                                                                                   // 45
                                                                                                                       //
			var _channel = _ref2;                                                                                               // 45
			var channelType = _channel[0];                                                                                      // 46
			_channel = _channel.substr(1);                                                                                      // 47
			var record = void 0;                                                                                                // 48
                                                                                                                       //
			switch (channelType) {                                                                                              // 50
				case '#':                                                                                                          // 51
					record = RocketChat.models.Rooms.findOne({                                                                        // 52
						$or: [{                                                                                                          // 53
							_id: _channel                                                                                                   // 54
						}, {                                                                                                             // 54
							name: _channel                                                                                                  // 55
						}]                                                                                                               // 55
					});                                                                                                               // 52
					break;                                                                                                            // 58
                                                                                                                       //
				case '@':                                                                                                          // 59
					record = RocketChat.models.Users.findOne({                                                                        // 60
						$or: [{                                                                                                          // 61
							_id: _channel                                                                                                   // 62
						}, {                                                                                                             // 62
							username: _channel                                                                                              // 63
						}]                                                                                                               // 63
					});                                                                                                               // 60
					break;                                                                                                            // 66
			}                                                                                                                   // 50
                                                                                                                       //
			if (!record) {                                                                                                      // 69
				throw new Meteor.Error('error-invalid-room', 'Invalid room', {                                                     // 70
					method: 'updateIncomingIntegration'                                                                               // 70
				});                                                                                                                // 70
			}                                                                                                                   // 71
                                                                                                                       //
			if (record.usernames && !RocketChat.authz.hasPermission(this.userId, 'manage-integrations') && RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations') && !record.usernames.includes(Meteor.user().username)) {
				throw new Meteor.Error('error-invalid-channel', 'Invalid Channel', {                                               // 74
					method: 'updateIncomingIntegration'                                                                               // 74
				});                                                                                                                // 74
			}                                                                                                                   // 75
		}                                                                                                                    // 76
                                                                                                                       //
		var user = RocketChat.models.Users.findOne({                                                                         // 78
			username: currentIntegration.username                                                                               // 78
		});                                                                                                                  // 78
                                                                                                                       //
		if (!user || !user._id) {                                                                                            // 80
			throw new Meteor.Error('error-invalid-post-as-user', 'Invalid Post As User', {                                      // 81
				method: 'updateIncomingIntegration'                                                                                // 81
			});                                                                                                                 // 81
		}                                                                                                                    // 82
                                                                                                                       //
		RocketChat.models.Roles.addUserRoles(user._id, 'bot');                                                               // 84
		RocketChat.models.Integrations.update(integrationId, {                                                               // 86
			$set: {                                                                                                             // 87
				enabled: integration.enabled,                                                                                      // 88
				name: integration.name,                                                                                            // 89
				avatar: integration.avatar,                                                                                        // 90
				emoji: integration.emoji,                                                                                          // 91
				alias: integration.alias,                                                                                          // 92
				channel: channels,                                                                                                 // 93
				script: integration.script,                                                                                        // 94
				scriptEnabled: integration.scriptEnabled,                                                                          // 95
				scriptCompiled: integration.scriptCompiled,                                                                        // 96
				scriptError: integration.scriptError,                                                                              // 97
				_updatedAt: new Date(),                                                                                            // 98
				_updatedBy: RocketChat.models.Users.findOne(this.userId, {                                                         // 99
					fields: {                                                                                                         // 99
						username: 1                                                                                                      // 99
					}                                                                                                                 // 99
				})                                                                                                                 // 99
			}                                                                                                                   // 87
		});                                                                                                                  // 86
		return RocketChat.models.Integrations.findOne(integrationId);                                                        // 103
	}                                                                                                                     // 104
});                                                                                                                    // 4
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"deleteIncomingIntegration.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_integrations/server/methods/incoming/deleteIncomingIntegration.js                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	deleteIncomingIntegration: function (integrationId) {                                                                 // 2
		var integration = void 0;                                                                                            // 3
                                                                                                                       //
		if (RocketChat.authz.hasPermission(this.userId, 'manage-integrations')) {                                            // 5
			integration = RocketChat.models.Integrations.findOne(integrationId);                                                // 6
		} else if (RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations')) {                                 // 7
			integration = RocketChat.models.Integrations.findOne(integrationId, {                                               // 8
				fields: {                                                                                                          // 8
					'_createdBy._id': this.userId                                                                                     // 8
				}                                                                                                                  // 8
			});                                                                                                                 // 8
		} else {                                                                                                             // 9
			throw new Meteor.Error('not_authorized', 'Unauthorized', {                                                          // 10
				method: 'deleteIncomingIntegration'                                                                                // 10
			});                                                                                                                 // 10
		}                                                                                                                    // 11
                                                                                                                       //
		if (!integration) {                                                                                                  // 13
			throw new Meteor.Error('error-invalid-integration', 'Invalid integration', {                                        // 14
				method: 'deleteIncomingIntegration'                                                                                // 14
			});                                                                                                                 // 14
		}                                                                                                                    // 15
                                                                                                                       //
		RocketChat.models.Integrations.remove({                                                                              // 17
			_id: integrationId                                                                                                  // 17
		});                                                                                                                  // 17
		return true;                                                                                                         // 19
	}                                                                                                                     // 20
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"outgoing":{"addOutgoingIntegration.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_integrations/server/methods/outgoing/addOutgoingIntegration.js                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	addOutgoingIntegration: function (integration) {                                                                      // 2
		if (!RocketChat.authz.hasPermission(this.userId, 'manage-integrations') && !RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations') && !RocketChat.authz.hasPermission(this.userId, 'manage-integrations', 'bot') && !RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations', 'bot')) {
			throw new Meteor.Error('not_authorized');                                                                           // 7
		}                                                                                                                    // 8
                                                                                                                       //
		integration = RocketChat.integrations.validateOutgoing(integration, this.userId);                                    // 10
		integration._createdAt = new Date();                                                                                 // 12
		integration._createdBy = RocketChat.models.Users.findOne(this.userId, {                                              // 13
			fields: {                                                                                                           // 13
				username: 1                                                                                                        // 13
			}                                                                                                                   // 13
		});                                                                                                                  // 13
		integration._id = RocketChat.models.Integrations.insert(integration);                                                // 14
		return integration;                                                                                                  // 16
	}                                                                                                                     // 17
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"updateOutgoingIntegration.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_integrations/server/methods/outgoing/updateOutgoingIntegration.js                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	updateOutgoingIntegration: function (integrationId, integration) {                                                    // 2
		integration = RocketChat.integrations.validateOutgoing(integration, this.userId);                                    // 3
                                                                                                                       //
		if (!integration.token || integration.token.trim() === '') {                                                         // 5
			throw new Meteor.Error('error-invalid-token', 'Invalid token', {                                                    // 6
				method: 'updateOutgoingIntegration'                                                                                // 6
			});                                                                                                                 // 6
		}                                                                                                                    // 7
                                                                                                                       //
		var currentIntegration = void 0;                                                                                     // 9
                                                                                                                       //
		if (RocketChat.authz.hasPermission(this.userId, 'manage-integrations')) {                                            // 11
			currentIntegration = RocketChat.models.Integrations.findOne(integrationId);                                         // 12
		} else if (RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations')) {                                 // 13
			currentIntegration = RocketChat.models.Integrations.findOne({                                                       // 14
				_id: integrationId,                                                                                                // 14
				'_createdBy._id': this.userId                                                                                      // 14
			});                                                                                                                 // 14
		} else {                                                                                                             // 15
			throw new Meteor.Error('not_authorized', 'Unauthorized', {                                                          // 16
				method: 'updateOutgoingIntegration'                                                                                // 16
			});                                                                                                                 // 16
		}                                                                                                                    // 17
                                                                                                                       //
		if (!currentIntegration) {                                                                                           // 19
			throw new Meteor.Error('invalid_integration', '[methods] updateOutgoingIntegration -> integration not found');      // 20
		}                                                                                                                    // 21
                                                                                                                       //
		RocketChat.models.Integrations.update(integrationId, {                                                               // 23
			$set: {                                                                                                             // 24
				event: integration.event,                                                                                          // 25
				enabled: integration.enabled,                                                                                      // 26
				name: integration.name,                                                                                            // 27
				avatar: integration.avatar,                                                                                        // 28
				emoji: integration.emoji,                                                                                          // 29
				alias: integration.alias,                                                                                          // 30
				channel: integration.channel,                                                                                      // 31
				targetRoom: integration.targetRoom,                                                                                // 32
				impersonateUser: integration.impersonateUser,                                                                      // 33
				username: integration.username,                                                                                    // 34
				userId: integration.userId,                                                                                        // 35
				urls: integration.urls,                                                                                            // 36
				token: integration.token,                                                                                          // 37
				script: integration.script,                                                                                        // 38
				scriptEnabled: integration.scriptEnabled,                                                                          // 39
				scriptCompiled: integration.scriptCompiled,                                                                        // 40
				scriptError: integration.scriptError,                                                                              // 41
				triggerWords: integration.triggerWords,                                                                            // 42
				retryFailedCalls: integration.retryFailedCalls,                                                                    // 43
				retryCount: integration.retryCount,                                                                                // 44
				retryDelay: integration.retryDelay,                                                                                // 45
				triggerWordAnywhere: integration.triggerWordAnywhere,                                                              // 46
				runOnEdits: integration.runOnEdits,                                                                                // 47
				_updatedAt: new Date(),                                                                                            // 48
				_updatedBy: RocketChat.models.Users.findOne(this.userId, {                                                         // 49
					fields: {                                                                                                         // 49
						username: 1                                                                                                      // 49
					}                                                                                                                 // 49
				})                                                                                                                 // 49
			}                                                                                                                   // 24
		});                                                                                                                  // 23
		return RocketChat.models.Integrations.findOne(integrationId);                                                        // 53
	}                                                                                                                     // 54
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"replayOutgoingIntegration.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_integrations/server/methods/outgoing/replayOutgoingIntegration.js                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	replayOutgoingIntegration: function (_ref) {                                                                          // 2
		var integrationId = _ref.integrationId,                                                                              // 2
		    historyId = _ref.historyId;                                                                                      // 2
		var integration = void 0;                                                                                            // 3
                                                                                                                       //
		if (RocketChat.authz.hasPermission(this.userId, 'manage-integrations') || RocketChat.authz.hasPermission(this.userId, 'manage-integrations', 'bot')) {
			integration = RocketChat.models.Integrations.findOne(integrationId);                                                // 6
		} else if (RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations') || RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations', 'bot')) {
			integration = RocketChat.models.Integrations.findOne(integrationId, {                                               // 8
				fields: {                                                                                                          // 8
					'_createdBy._id': this.userId                                                                                     // 8
				}                                                                                                                  // 8
			});                                                                                                                 // 8
		} else {                                                                                                             // 9
			throw new Meteor.Error('not_authorized', 'Unauthorized', {                                                          // 10
				method: 'replayOutgoingIntegration'                                                                                // 10
			});                                                                                                                 // 10
		}                                                                                                                    // 11
                                                                                                                       //
		if (!integration) {                                                                                                  // 13
			throw new Meteor.Error('error-invalid-integration', 'Invalid integration', {                                        // 14
				method: 'replayOutgoingIntegration'                                                                                // 14
			});                                                                                                                 // 14
		}                                                                                                                    // 15
                                                                                                                       //
		var history = RocketChat.models.IntegrationHistory.findOneByIntegrationIdAndHistoryId(integration._id, historyId);   // 17
                                                                                                                       //
		if (!history) {                                                                                                      // 19
			throw new Meteor.Error('error-invalid-integration-history', 'Invalid Integration History', {                        // 20
				method: 'replayOutgoingIntegration'                                                                                // 20
			});                                                                                                                 // 20
		}                                                                                                                    // 21
                                                                                                                       //
		RocketChat.integrations.triggerHandler.replay(integration, history);                                                 // 23
		return true;                                                                                                         // 25
	}                                                                                                                     // 26
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"deleteOutgoingIntegration.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_integrations/server/methods/outgoing/deleteOutgoingIntegration.js                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	deleteOutgoingIntegration: function (integrationId) {                                                                 // 2
		var integration = void 0;                                                                                            // 3
                                                                                                                       //
		if (RocketChat.authz.hasPermission(this.userId, 'manage-integrations') || RocketChat.authz.hasPermission(this.userId, 'manage-integrations', 'bot')) {
			integration = RocketChat.models.Integrations.findOne(integrationId);                                                // 6
		} else if (RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations') || RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations', 'bot')) {
			integration = RocketChat.models.Integrations.findOne(integrationId, {                                               // 8
				fields: {                                                                                                          // 8
					'_createdBy._id': this.userId                                                                                     // 8
				}                                                                                                                  // 8
			});                                                                                                                 // 8
		} else {                                                                                                             // 9
			throw new Meteor.Error('not_authorized', 'Unauthorized', {                                                          // 10
				method: 'deleteOutgoingIntegration'                                                                                // 10
			});                                                                                                                 // 10
		}                                                                                                                    // 11
                                                                                                                       //
		if (!integration) {                                                                                                  // 13
			throw new Meteor.Error('error-invalid-integration', 'Invalid integration', {                                        // 14
				method: 'deleteOutgoingIntegration'                                                                                // 14
			});                                                                                                                 // 14
		}                                                                                                                    // 15
                                                                                                                       //
		RocketChat.models.Integrations.remove({                                                                              // 17
			_id: integrationId                                                                                                  // 17
		});                                                                                                                  // 17
		RocketChat.models.IntegrationHistory.removeByIntegrationId(integrationId);                                           // 18
		return true;                                                                                                         // 20
	}                                                                                                                     // 21
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"clearIntegrationHistory.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_integrations/server/methods/clearIntegrationHistory.js                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	clearIntegrationHistory: function (integrationId) {                                                                   // 2
		var integration = void 0;                                                                                            // 3
                                                                                                                       //
		if (RocketChat.authz.hasPermission(this.userId, 'manage-integrations') || RocketChat.authz.hasPermission(this.userId, 'manage-integrations', 'bot')) {
			integration = RocketChat.models.Integrations.findOne(integrationId);                                                // 6
		} else if (RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations') || RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations', 'bot')) {
			integration = RocketChat.models.Integrations.findOne(integrationId, {                                               // 8
				fields: {                                                                                                          // 8
					'_createdBy._id': this.userId                                                                                     // 8
				}                                                                                                                  // 8
			});                                                                                                                 // 8
		} else {                                                                                                             // 9
			throw new Meteor.Error('not_authorized', 'Unauthorized', {                                                          // 10
				method: 'clearIntegrationHistory'                                                                                  // 10
			});                                                                                                                 // 10
		}                                                                                                                    // 11
                                                                                                                       //
		if (!integration) {                                                                                                  // 13
			throw new Meteor.Error('error-invalid-integration', 'Invalid integration', {                                        // 14
				method: 'clearIntegrationHistory'                                                                                  // 14
			});                                                                                                                 // 14
		}                                                                                                                    // 15
                                                                                                                       //
		RocketChat.models.IntegrationHistory.removeByIntegrationId(integrationId);                                           // 17
		return true;                                                                                                         // 19
	}                                                                                                                     // 20
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"api":{"api.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_integrations/server/api/api.js                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var vm = void 0;                                                                                                       // 1
module.watch(require("vm"), {                                                                                          // 1
	"default": function (v) {                                                                                             // 1
		vm = v;                                                                                                              // 1
	}                                                                                                                     // 1
}, 0);                                                                                                                 // 1
var moment = void 0;                                                                                                   // 1
module.watch(require("moment"), {                                                                                      // 1
	"default": function (v) {                                                                                             // 1
		moment = v;                                                                                                          // 1
	}                                                                                                                     // 1
}, 1);                                                                                                                 // 1
var compiledScripts = {};                                                                                              // 6
                                                                                                                       //
function buildSandbox() {                                                                                              // 7
	var store = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};                                   // 7
	var sandbox = {                                                                                                       // 8
		_: _,                                                                                                                // 9
		s: s,                                                                                                                // 10
		console: console,                                                                                                    // 11
		moment: moment,                                                                                                      // 12
		Livechat: RocketChat.Livechat,                                                                                       // 13
		Store: {                                                                                                             // 14
			set: function (key, val) {                                                                                          // 15
				return store[key] = val;                                                                                           // 16
			},                                                                                                                  // 17
			get: function (key) {                                                                                               // 18
				return store[key];                                                                                                 // 19
			}                                                                                                                   // 20
		},                                                                                                                   // 14
		HTTP: function (method, url, options) {                                                                              // 22
			try {                                                                                                               // 23
				return {                                                                                                           // 24
					result: HTTP.call(method, url, options)                                                                           // 25
				};                                                                                                                 // 24
			} catch (error) {                                                                                                   // 27
				return {                                                                                                           // 28
					error: error                                                                                                      // 29
				};                                                                                                                 // 28
			}                                                                                                                   // 31
		}                                                                                                                    // 32
	};                                                                                                                    // 8
	Object.keys(RocketChat.models).filter(function (k) {                                                                  // 35
		return !k.startsWith('_');                                                                                           // 35
	}).forEach(function (k) {                                                                                             // 35
		return sandbox[k] = RocketChat.models[k];                                                                            // 35
	});                                                                                                                   // 35
	return {                                                                                                              // 36
		store: store,                                                                                                        // 36
		sandbox: sandbox                                                                                                     // 36
	};                                                                                                                    // 36
}                                                                                                                      // 37
                                                                                                                       //
function getIntegrationScript(integration) {                                                                           // 39
	var compiledScript = compiledScripts[integration._id];                                                                // 40
                                                                                                                       //
	if (compiledScript != null && +compiledScript._updatedAt === +integration._updatedAt) {                               // 41
		return compiledScript.script;                                                                                        // 42
	}                                                                                                                     // 43
                                                                                                                       //
	var script = integration.scriptCompiled;                                                                              // 44
                                                                                                                       //
	var _buildSandbox = buildSandbox(),                                                                                   // 39
	    sandbox = _buildSandbox.sandbox,                                                                                  // 39
	    store = _buildSandbox.store;                                                                                      // 39
                                                                                                                       //
	try {                                                                                                                 // 46
		logger.incoming.info('Will evaluate script of Trigger', integration.name);                                           // 47
		logger.incoming.debug(script);                                                                                       // 48
		var vmScript = vm.createScript(script, 'script.js');                                                                 // 49
		vmScript.runInNewContext(sandbox);                                                                                   // 50
                                                                                                                       //
		if (sandbox.Script != null) {                                                                                        // 51
			compiledScripts[integration._id] = {                                                                                // 52
				script: new sandbox.Script(),                                                                                      // 53
				store: store,                                                                                                      // 54
				_updatedAt: integration._updatedAt                                                                                 // 55
			};                                                                                                                  // 52
			return compiledScripts[integration._id].script;                                                                     // 57
		}                                                                                                                    // 58
	} catch (_ref) {                                                                                                      // 59
		var stack = _ref.stack;                                                                                              // 59
		logger.incoming.error('[Error evaluating Script in Trigger', integration.name, ':]');                                // 60
		logger.incoming.error(script.replace(/^/gm, '  '));                                                                  // 61
		logger.incoming.error('[Stack:]');                                                                                   // 62
		logger.incoming.error(stack.replace(/^/gm, '  '));                                                                   // 63
		throw RocketChat.API.v1.failure('error-evaluating-script');                                                          // 64
	}                                                                                                                     // 65
                                                                                                                       //
	if (sandbox.Script == null) {                                                                                         // 66
		logger.incoming.error('[Class "Script" not in Trigger', integration.name, ']');                                      // 67
		throw RocketChat.API.v1.failure('class-script-not-found');                                                           // 68
	}                                                                                                                     // 69
}                                                                                                                      // 70
                                                                                                                       //
Api = new Restivus({                                                                                                   // 72
	enableCors: true,                                                                                                     // 73
	apiPath: 'hooks/',                                                                                                    // 74
	auth: {                                                                                                               // 75
		user: function () {                                                                                                  // 76
			var payloadKeys = Object.keys(this.bodyParams);                                                                     // 77
			var payloadIsWrapped = this.bodyParams && this.bodyParams.payload && payloadKeys.length === 1;                      // 78
                                                                                                                       //
			if (payloadIsWrapped && this.request.headers['content-type'] === 'application/x-www-form-urlencoded') {             // 79
				try {                                                                                                              // 80
					this.bodyParams = JSON.parse(this.bodyParams.payload);                                                            // 81
				} catch (_ref2) {                                                                                                  // 82
					var message = _ref2.message;                                                                                      // 82
					return {                                                                                                          // 83
						error: {                                                                                                         // 84
							statusCode: 400,                                                                                                // 85
							body: {                                                                                                         // 86
								success: false,                                                                                                // 87
								error: message                                                                                                 // 88
							}                                                                                                               // 86
						}                                                                                                                // 84
					};                                                                                                                // 83
				}                                                                                                                  // 92
			}                                                                                                                   // 93
                                                                                                                       //
			this.integration = RocketChat.models.Integrations.findOne({                                                         // 94
				_id: this.request.params.integrationId,                                                                            // 95
				token: decodeURIComponent(this.request.params.token)                                                               // 96
			});                                                                                                                 // 94
                                                                                                                       //
			if (this.integration == null) {                                                                                     // 98
				logger.incoming.info('Invalid integration id', this.request.params.integrationId, 'or token', this.request.params.token);
				return;                                                                                                            // 100
			}                                                                                                                   // 101
                                                                                                                       //
			var user = RocketChat.models.Users.findOne({                                                                        // 102
				_id: this.integration.userId                                                                                       // 103
			});                                                                                                                 // 102
			return {                                                                                                            // 105
				user: user                                                                                                         // 105
			};                                                                                                                  // 105
		}                                                                                                                    // 106
	}                                                                                                                     // 75
});                                                                                                                    // 72
                                                                                                                       //
function createIntegration(options, user) {                                                                            // 110
	logger.incoming.info('Add integration', options.name);                                                                // 111
	logger.incoming.debug(options);                                                                                       // 112
	Meteor.runAsUser(user._id, function () {                                                                              // 113
		switch (options['event']) {                                                                                          // 114
			case 'newMessageOnChannel':                                                                                         // 115
				if (options.data == null) {                                                                                        // 116
					options.data = {};                                                                                                // 117
				}                                                                                                                  // 118
                                                                                                                       //
				if (options.data.channel_name != null && options.data.channel_name.indexOf('#') === -1) {                          // 119
					options.data.channel_name = "#" + options.data.channel_name;                                                      // 120
				}                                                                                                                  // 121
                                                                                                                       //
				return Meteor.call('addOutgoingIntegration', {                                                                     // 122
					username: 'rocket.cat',                                                                                           // 123
					urls: [options.target_url],                                                                                       // 124
					name: options.name,                                                                                               // 125
					channel: options.data.channel_name,                                                                               // 126
					triggerWords: options.data.trigger_words                                                                          // 127
				});                                                                                                                // 122
                                                                                                                       //
			case 'newMessageToUser':                                                                                            // 129
				if (options.data.username.indexOf('@') === -1) {                                                                   // 130
					options.data.username = "@" + options.data.username;                                                              // 131
				}                                                                                                                  // 132
                                                                                                                       //
				return Meteor.call('addOutgoingIntegration', {                                                                     // 133
					username: 'rocket.cat',                                                                                           // 134
					urls: [options.target_url],                                                                                       // 135
					name: options.name,                                                                                               // 136
					channel: options.data.username,                                                                                   // 137
					triggerWords: options.data.trigger_words                                                                          // 138
				});                                                                                                                // 133
		}                                                                                                                    // 114
	});                                                                                                                   // 141
	return RocketChat.API.v1.success();                                                                                   // 142
}                                                                                                                      // 143
                                                                                                                       //
function removeIntegration(options, user) {                                                                            // 145
	logger.incoming.info('Remove integration');                                                                           // 146
	logger.incoming.debug(options);                                                                                       // 147
	var integrationToRemove = RocketChat.models.Integrations.findOne({                                                    // 148
		urls: options.target_url                                                                                             // 149
	});                                                                                                                   // 148
	Meteor.runAsUser(user._id, function () {                                                                              // 151
		return Meteor.call('deleteOutgoingIntegration', integrationToRemove._id);                                            // 152
	});                                                                                                                   // 153
	return RocketChat.API.v1.success();                                                                                   // 154
}                                                                                                                      // 155
                                                                                                                       //
function executeIntegrationRest() {                                                                                    // 157
	logger.incoming.info('Post integration:', this.integration.name);                                                     // 158
	logger.incoming.debug('@urlParams:', this.urlParams);                                                                 // 159
	logger.incoming.debug('@bodyParams:', this.bodyParams);                                                               // 160
                                                                                                                       //
	if (this.integration.enabled !== true) {                                                                              // 161
		return {                                                                                                             // 162
			statusCode: 503,                                                                                                    // 163
			body: 'Service Unavailable'                                                                                         // 164
		};                                                                                                                   // 162
	}                                                                                                                     // 166
                                                                                                                       //
	var defaultValues = {                                                                                                 // 167
		channel: this.integration.channel,                                                                                   // 168
		alias: this.integration.alias,                                                                                       // 169
		avatar: this.integration.avatar,                                                                                     // 170
		emoji: this.integration.emoji                                                                                        // 171
	};                                                                                                                    // 167
                                                                                                                       //
	if (this.integration.scriptEnabled === true && this.integration.scriptCompiled && this.integration.scriptCompiled.trim() !== '') {
		var script = void 0;                                                                                                 // 174
                                                                                                                       //
		try {                                                                                                                // 175
			script = getIntegrationScript(this.integration);                                                                    // 176
		} catch (e) {                                                                                                        // 177
			logger.incoming.warn(e);                                                                                            // 178
			return RocketChat.API.v1.failure(e.message);                                                                        // 179
		}                                                                                                                    // 180
                                                                                                                       //
		var request = {                                                                                                      // 181
			url: {                                                                                                              // 182
				hash: this.request._parsedUrl.hash,                                                                                // 183
				search: this.request._parsedUrl.search,                                                                            // 184
				query: this.queryParams,                                                                                           // 185
				pathname: this.request._parsedUrl.pathname,                                                                        // 186
				path: this.request._parsedUrl.path                                                                                 // 187
			},                                                                                                                  // 182
			url_raw: this.request.url,                                                                                          // 189
			url_params: this.urlParams,                                                                                         // 190
			content: this.bodyParams,                                                                                           // 191
			content_raw: this.request._readableState && this.request._readableState.buffer && this.request._readableState.buffer.toString(),
			headers: this.request.headers,                                                                                      // 193
			user: {                                                                                                             // 194
				_id: this.user._id,                                                                                                // 195
				name: this.user.name,                                                                                              // 196
				username: this.user.username                                                                                       // 197
			}                                                                                                                   // 194
		};                                                                                                                   // 181
                                                                                                                       //
		try {                                                                                                                // 200
			var _buildSandbox2 = buildSandbox(compiledScripts[this.integration._id].store),                                     // 200
			    sandbox = _buildSandbox2.sandbox;                                                                               // 200
                                                                                                                       //
			sandbox.script = script;                                                                                            // 202
			sandbox.request = request;                                                                                          // 203
			var result = vm.runInNewContext('script.process_incoming_request({ request: request })', sandbox, {                 // 204
				timeout: 3000                                                                                                      // 205
			});                                                                                                                 // 204
                                                                                                                       //
			if (result && result.error) {                                                                                       // 207
				return RocketChat.API.v1.failure(result.error);                                                                    // 208
			}                                                                                                                   // 209
                                                                                                                       //
			this.bodyParams = result && result.content;                                                                         // 210
                                                                                                                       //
			if (typeof result !== 'undefined') {                                                                                // 211
				this.scriptResponse = result.response;                                                                             // 212
                                                                                                                       //
				if (result.user) {                                                                                                 // 213
					this.user = result.user;                                                                                          // 214
				}                                                                                                                  // 215
			}                                                                                                                   // 216
                                                                                                                       //
			logger.incoming.debug('[Process Incoming Request result of Trigger', this.integration.name, ':]');                  // 217
			logger.incoming.debug('result', this.bodyParams);                                                                   // 218
		} catch (_ref3) {                                                                                                    // 219
			var stack = _ref3.stack;                                                                                            // 219
			logger.incoming.error('[Error running Script in Trigger', this.integration.name, ':]');                             // 220
			logger.incoming.error(this.integration.scriptCompiled.replace(/^/gm, '  '));                                        // 221
			logger.incoming.error('[Stack:]');                                                                                  // 222
			logger.incoming.error(stack.replace(/^/gm, '  '));                                                                  // 223
			return RocketChat.API.v1.failure('error-running-script');                                                           // 224
		}                                                                                                                    // 225
	}                                                                                                                     // 226
                                                                                                                       //
	if (this.bodyParams == null) {                                                                                        // 227
		return RocketChat.API.v1.failure('body-empty');                                                                      // 228
	}                                                                                                                     // 229
                                                                                                                       //
	this.bodyParams.bot = {                                                                                               // 230
		i: this.integration._id                                                                                              // 231
	};                                                                                                                    // 230
                                                                                                                       //
	try {                                                                                                                 // 233
		var message = processWebhookMessage(this.bodyParams, this.user, defaultValues);                                      // 234
                                                                                                                       //
		if (_.isEmpty(message)) {                                                                                            // 235
			return RocketChat.API.v1.failure('unknown-error');                                                                  // 236
		}                                                                                                                    // 237
                                                                                                                       //
		if (this.scriptResponse) {                                                                                           // 238
			logger.incoming.debug('response', this.scriptResponse);                                                             // 239
		}                                                                                                                    // 240
                                                                                                                       //
		return RocketChat.API.v1.success(this.scriptResponse);                                                               // 241
	} catch (_ref4) {                                                                                                     // 242
		var error = _ref4.error;                                                                                             // 242
		return RocketChat.API.v1.failure(error);                                                                             // 243
	}                                                                                                                     // 244
}                                                                                                                      // 245
                                                                                                                       //
function addIntegrationRest() {                                                                                        // 247
	return createIntegration(this.bodyParams, this.user);                                                                 // 248
}                                                                                                                      // 249
                                                                                                                       //
function removeIntegrationRest() {                                                                                     // 251
	return removeIntegration(this.bodyParams, this.user);                                                                 // 252
}                                                                                                                      // 253
                                                                                                                       //
function integrationSampleRest() {                                                                                     // 255
	logger.incoming.info('Sample Integration');                                                                           // 256
	return {                                                                                                              // 257
		statusCode: 200,                                                                                                     // 258
		body: [{                                                                                                             // 259
			token: Random.id(24),                                                                                               // 261
			channel_id: Random.id(),                                                                                            // 262
			channel_name: 'general',                                                                                            // 263
			timestamp: new Date(),                                                                                              // 264
			user_id: Random.id(),                                                                                               // 265
			user_name: 'rocket.cat',                                                                                            // 266
			text: 'Sample text 1',                                                                                              // 267
			trigger_word: 'Sample'                                                                                              // 268
		}, {                                                                                                                 // 260
			token: Random.id(24),                                                                                               // 270
			channel_id: Random.id(),                                                                                            // 271
			channel_name: 'general',                                                                                            // 272
			timestamp: new Date(),                                                                                              // 273
			user_id: Random.id(),                                                                                               // 274
			user_name: 'rocket.cat',                                                                                            // 275
			text: 'Sample text 2',                                                                                              // 276
			trigger_word: 'Sample'                                                                                              // 277
		}, {                                                                                                                 // 269
			token: Random.id(24),                                                                                               // 279
			channel_id: Random.id(),                                                                                            // 280
			channel_name: 'general',                                                                                            // 281
			timestamp: new Date(),                                                                                              // 282
			user_id: Random.id(),                                                                                               // 283
			user_name: 'rocket.cat',                                                                                            // 284
			text: 'Sample text 3',                                                                                              // 285
			trigger_word: 'Sample'                                                                                              // 286
		}]                                                                                                                   // 278
	};                                                                                                                    // 257
}                                                                                                                      // 290
                                                                                                                       //
function integrationInfoRest() {                                                                                       // 292
	logger.incoming.info('Info integration');                                                                             // 293
	return {                                                                                                              // 294
		statusCode: 200,                                                                                                     // 295
		body: {                                                                                                              // 296
			success: true                                                                                                       // 297
		}                                                                                                                    // 296
	};                                                                                                                    // 294
}                                                                                                                      // 300
                                                                                                                       //
Api.addRoute(':integrationId/:userId/:token', {                                                                        // 302
	authRequired: true                                                                                                    // 302
}, {                                                                                                                   // 302
	post: executeIntegrationRest,                                                                                         // 303
	get: executeIntegrationRest                                                                                           // 304
});                                                                                                                    // 302
Api.addRoute(':integrationId/:token', {                                                                                // 307
	authRequired: true                                                                                                    // 307
}, {                                                                                                                   // 307
	post: executeIntegrationRest,                                                                                         // 308
	get: executeIntegrationRest                                                                                           // 309
});                                                                                                                    // 307
Api.addRoute('sample/:integrationId/:userId/:token', {                                                                 // 312
	authRequired: true                                                                                                    // 312
}, {                                                                                                                   // 312
	get: integrationSampleRest                                                                                            // 313
});                                                                                                                    // 312
Api.addRoute('sample/:integrationId/:token', {                                                                         // 316
	authRequired: true                                                                                                    // 316
}, {                                                                                                                   // 316
	get: integrationSampleRest                                                                                            // 317
});                                                                                                                    // 316
Api.addRoute('info/:integrationId/:userId/:token', {                                                                   // 320
	authRequired: true                                                                                                    // 320
}, {                                                                                                                   // 320
	get: integrationInfoRest                                                                                              // 321
});                                                                                                                    // 320
Api.addRoute('info/:integrationId/:token', {                                                                           // 324
	authRequired: true                                                                                                    // 324
}, {                                                                                                                   // 324
	get: integrationInfoRest                                                                                              // 325
});                                                                                                                    // 324
Api.addRoute('add/:integrationId/:userId/:token', {                                                                    // 328
	authRequired: true                                                                                                    // 328
}, {                                                                                                                   // 328
	post: addIntegrationRest                                                                                              // 329
});                                                                                                                    // 328
Api.addRoute('add/:integrationId/:token', {                                                                            // 332
	authRequired: true                                                                                                    // 332
}, {                                                                                                                   // 332
	post: addIntegrationRest                                                                                              // 333
});                                                                                                                    // 332
Api.addRoute('remove/:integrationId/:userId/:token', {                                                                 // 336
	authRequired: true                                                                                                    // 336
}, {                                                                                                                   // 336
	post: removeIntegrationRest                                                                                           // 337
});                                                                                                                    // 336
Api.addRoute('remove/:integrationId/:token', {                                                                         // 340
	authRequired: true                                                                                                    // 340
}, {                                                                                                                   // 340
	post: removeIntegrationRest                                                                                           // 341
});                                                                                                                    // 340
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"triggers.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_integrations/server/triggers.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var callbackHandler = function () {                                                                                    // 1
	function _callbackHandler(eventType) {                                                                                // 1
		return function () {                                                                                                 // 2
			function _wrapperFunction() {                                                                                       // 2
				var _RocketChat$integrati;                                                                                         // 2
                                                                                                                       //
				return (_RocketChat$integrati = RocketChat.integrations.triggerHandler).executeTriggers.apply(_RocketChat$integrati, [eventType].concat(Array.prototype.slice.call(arguments)));
			}                                                                                                                   // 4
                                                                                                                       //
			return _wrapperFunction;                                                                                            // 2
		}();                                                                                                                 // 2
	}                                                                                                                     // 5
                                                                                                                       //
	return _callbackHandler;                                                                                              // 1
}();                                                                                                                   // 1
                                                                                                                       //
RocketChat.callbacks.add('afterSaveMessage', callbackHandler('sendMessage'), RocketChat.callbacks.priority.LOW);       // 7
RocketChat.callbacks.add('afterCreateChannel', callbackHandler('roomCreated'), RocketChat.callbacks.priority.LOW);     // 8
RocketChat.callbacks.add('afterCreatePrivateGroup', callbackHandler('roomCreated'), RocketChat.callbacks.priority.LOW);
RocketChat.callbacks.add('afterCreateUser', callbackHandler('userCreated'), RocketChat.callbacks.priority.LOW);        // 10
RocketChat.callbacks.add('afterJoinRoom', callbackHandler('roomJoined'), RocketChat.callbacks.priority.LOW);           // 11
RocketChat.callbacks.add('afterLeaveRoom', callbackHandler('roomLeft'), RocketChat.callbacks.priority.LOW);            // 12
RocketChat.callbacks.add('afterRoomArchived', callbackHandler('roomArchived'), RocketChat.callbacks.priority.LOW);     // 13
RocketChat.callbacks.add('afterFileUpload', callbackHandler('fileUploaded'), RocketChat.callbacks.priority.LOW);       // 14
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"processWebhookMessage.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_integrations/server/processWebhookMessage.js                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
this.processWebhookMessage = function (messageObj, user) {                                                             // 1
	var defaultValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {                             // 1
		channel: '',                                                                                                         // 1
		alias: '',                                                                                                           // 1
		avatar: '',                                                                                                          // 1
		emoji: ''                                                                                                            // 1
	};                                                                                                                    // 1
	var sentData = [];                                                                                                    // 2
	var channels = [].concat(messageObj.channel || messageObj.roomId || defaultValues.channel);                           // 3
                                                                                                                       //
	for (var _iterator = channels, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
		var _ref;                                                                                                            // 5
                                                                                                                       //
		if (_isArray) {                                                                                                      // 5
			if (_i >= _iterator.length) break;                                                                                  // 5
			_ref = _iterator[_i++];                                                                                             // 5
		} else {                                                                                                             // 5
			_i = _iterator.next();                                                                                              // 5
			if (_i.done) break;                                                                                                 // 5
			_ref = _i.value;                                                                                                    // 5
		}                                                                                                                    // 5
                                                                                                                       //
		var channel = _ref;                                                                                                  // 5
		var channelType = channel[0];                                                                                        // 6
		var channelValue = channel.substr(1);                                                                                // 8
		var room = void 0;                                                                                                   // 9
                                                                                                                       //
		switch (channelType) {                                                                                               // 11
			case '#':                                                                                                           // 12
				room = RocketChat.getRoomByNameOrIdWithOptionToJoin({                                                              // 13
					currentUserId: user._id,                                                                                          // 13
					nameOrId: channelValue,                                                                                           // 13
					joinChannel: true                                                                                                 // 13
				});                                                                                                                // 13
				break;                                                                                                             // 14
                                                                                                                       //
			case '@':                                                                                                           // 15
				room = RocketChat.getRoomByNameOrIdWithOptionToJoin({                                                              // 16
					currentUserId: user._id,                                                                                          // 16
					nameOrId: channelValue,                                                                                           // 16
					type: 'd'                                                                                                         // 16
				});                                                                                                                // 16
				break;                                                                                                             // 17
                                                                                                                       //
			default:                                                                                                            // 18
				channelValue = channelType + channelValue; //Try to find the room by id or name if they didn't include the prefix.
                                                                                                                       //
				room = RocketChat.getRoomByNameOrIdWithOptionToJoin({                                                              // 22
					currentUserId: user._id,                                                                                          // 22
					nameOrId: channelValue,                                                                                           // 22
					joinChannel: true,                                                                                                // 22
					errorOnEmpty: false                                                                                               // 22
				});                                                                                                                // 22
                                                                                                                       //
				if (room) {                                                                                                        // 23
					break;                                                                                                            // 24
				} //We didn't get a room, let's try finding direct messages                                                        // 25
                                                                                                                       //
                                                                                                                       //
				room = RocketChat.getRoomByNameOrIdWithOptionToJoin({                                                              // 28
					currentUserId: user._id,                                                                                          // 28
					nameOrId: channelValue,                                                                                           // 28
					type: 'd',                                                                                                        // 28
					tryDirectByUserIdOnly: true                                                                                       // 28
				});                                                                                                                // 28
                                                                                                                       //
				if (room) {                                                                                                        // 29
					break;                                                                                                            // 30
				} //No room, so throw an error                                                                                     // 31
                                                                                                                       //
                                                                                                                       //
				throw new Meteor.Error('invalid-channel');                                                                         // 34
		}                                                                                                                    // 11
                                                                                                                       //
		if (messageObj.attachments && !_.isArray(messageObj.attachments)) {                                                  // 37
			console.log('Attachments should be Array, ignoring value'.red, messageObj.attachments);                             // 38
			messageObj.attachments = undefined;                                                                                 // 39
		}                                                                                                                    // 40
                                                                                                                       //
		var message = {                                                                                                      // 42
			alias: messageObj.username || messageObj.alias || defaultValues.alias,                                              // 43
			msg: _.trim(messageObj.text || messageObj.msg || ''),                                                               // 44
			attachments: messageObj.attachments,                                                                                // 45
			parseUrls: messageObj.parseUrls !== undefined ? messageObj.parseUrls : !messageObj.attachments,                     // 46
			bot: messageObj.bot,                                                                                                // 47
			groupable: messageObj.groupable !== undefined ? messageObj.groupable : false                                        // 48
		};                                                                                                                   // 42
                                                                                                                       //
		if (!_.isEmpty(messageObj.icon_url) || !_.isEmpty(messageObj.avatar)) {                                              // 51
			message.avatar = messageObj.icon_url || messageObj.avatar;                                                          // 52
		} else if (!_.isEmpty(messageObj.icon_emoji) || !_.isEmpty(messageObj.emoji)) {                                      // 53
			message.emoji = messageObj.icon_emoji || messageObj.emoji;                                                          // 54
		} else if (!_.isEmpty(defaultValues.avatar)) {                                                                       // 55
			message.avatar = defaultValues.avatar;                                                                              // 56
		} else if (!_.isEmpty(defaultValues.emoji)) {                                                                        // 57
			message.emoji = defaultValues.emoji;                                                                                // 58
		}                                                                                                                    // 59
                                                                                                                       //
		if (_.isArray(message.attachments)) {                                                                                // 61
			for (var i = 0; i < message.attachments.length; i++) {                                                              // 62
				var attachment = message.attachments[i];                                                                           // 63
                                                                                                                       //
				if (attachment.msg) {                                                                                              // 64
					attachment.text = _.trim(attachment.msg);                                                                         // 65
					delete attachment.msg;                                                                                            // 66
				}                                                                                                                  // 67
			}                                                                                                                   // 68
		}                                                                                                                    // 69
                                                                                                                       //
		var messageReturn = RocketChat.sendMessage(user, message, room);                                                     // 71
		sentData.push({                                                                                                      // 72
			channel: channel,                                                                                                   // 72
			message: messageReturn                                                                                              // 72
		});                                                                                                                  // 72
	}                                                                                                                     // 73
                                                                                                                       //
	return sentData;                                                                                                      // 75
};                                                                                                                     // 76
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:integrations/lib/rocketchat.js");
require("./node_modules/meteor/rocketchat:integrations/server/logger.js");
require("./node_modules/meteor/rocketchat:integrations/server/lib/validation.js");
require("./node_modules/meteor/rocketchat:integrations/server/models/Integrations.js");
require("./node_modules/meteor/rocketchat:integrations/server/models/IntegrationHistory.js");
require("./node_modules/meteor/rocketchat:integrations/server/publications/integrations.js");
require("./node_modules/meteor/rocketchat:integrations/server/publications/integrationHistory.js");
require("./node_modules/meteor/rocketchat:integrations/server/methods/incoming/addIncomingIntegration.js");
require("./node_modules/meteor/rocketchat:integrations/server/methods/incoming/updateIncomingIntegration.js");
require("./node_modules/meteor/rocketchat:integrations/server/methods/incoming/deleteIncomingIntegration.js");
require("./node_modules/meteor/rocketchat:integrations/server/methods/outgoing/addOutgoingIntegration.js");
require("./node_modules/meteor/rocketchat:integrations/server/methods/outgoing/updateOutgoingIntegration.js");
require("./node_modules/meteor/rocketchat:integrations/server/methods/outgoing/replayOutgoingIntegration.js");
require("./node_modules/meteor/rocketchat:integrations/server/methods/outgoing/deleteOutgoingIntegration.js");
require("./node_modules/meteor/rocketchat:integrations/server/methods/clearIntegrationHistory.js");
require("./node_modules/meteor/rocketchat:integrations/server/api/api.js");
require("./node_modules/meteor/rocketchat:integrations/server/lib/triggerHandler.js");
require("./node_modules/meteor/rocketchat:integrations/server/triggers.js");
require("./node_modules/meteor/rocketchat:integrations/server/processWebhookMessage.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:integrations'] = {};

})();

//# sourceMappingURL=rocketchat_integrations.js.map

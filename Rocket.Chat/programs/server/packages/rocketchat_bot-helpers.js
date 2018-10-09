(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RocketChatTabBar = Package['rocketchat:lib'].RocketChatTabBar;
var Accounts = Package['accounts-base'].Accounts;
var meteorInstall = Package.modules.meteorInstall;
var process = Package.modules.process;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:bot-helpers":{"server":{"index.js":function(require){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/rocketchat_bot-helpers/server/index.js                                                              //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                         //
                                                                                                                //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                //
                                                                                                                //
var _createClass2 = require("babel-runtime/helpers/createClass");                                               //
                                                                                                                //
var _createClass3 = _interopRequireDefault(_createClass2);                                                      //
                                                                                                                //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }               //
                                                                                                                //
/**                                                                                                             // 1
 * BotHelpers helps bots                                                                                        //
 * "private" properties use meteor collection cursors, so they stay reactive                                    //
 * "public" properties use getters to fetch and filter collections as array                                     //
 */var BotHelpers = function () {                                                                               //
	function BotHelpers() {                                                                                        // 7
		(0, _classCallCheck3.default)(this, BotHelpers);                                                              // 7
		this.queries = {                                                                                              // 8
			online: {                                                                                                    // 9
				'status': {                                                                                                 // 9
					$ne: 'offline'                                                                                             // 9
				}                                                                                                           // 9
			},                                                                                                           // 9
			users: {                                                                                                     // 10
				'roles': {                                                                                                  // 10
					$not: {                                                                                                    // 10
						$all: ['bot']                                                                                             // 10
					}                                                                                                          // 10
				}                                                                                                           // 10
			}                                                                                                            // 10
		};                                                                                                            // 8
	} // setup collection cursors with array of fields from setting                                                // 12
                                                                                                                //
                                                                                                                //
	BotHelpers.prototype.setupCursors = function () {                                                              //
		function setupCursors(fieldsSetting) {                                                                        //
			var _this = this;                                                                                            // 15
                                                                                                                //
			this.userFields = {};                                                                                        // 16
                                                                                                                //
			if (typeof fieldsSetting === 'string') {                                                                     // 17
				fieldsSetting = fieldsSetting.split(',');                                                                   // 18
			}                                                                                                            // 19
                                                                                                                //
			fieldsSetting.forEach(function (n) {                                                                         // 20
				_this.userFields[n.trim()] = 1;                                                                             // 21
			});                                                                                                          // 22
			this._allUsers = RocketChat.models.Users.find(this.queries.users, {                                          // 23
				fields: this.userFields                                                                                     // 23
			});                                                                                                          // 23
			this._onlineUsers = RocketChat.models.Users.find({                                                           // 24
				$and: [this.queries.users, this.queries.online]                                                             // 24
			}, {                                                                                                         // 24
				fields: this.userFields                                                                                     // 24
			});                                                                                                          // 24
		}                                                                                                             // 25
                                                                                                                //
		return setupCursors;                                                                                          //
	}(); // request methods or props as arguments to Meteor.call                                                   //
                                                                                                                //
                                                                                                                //
	BotHelpers.prototype.request = function () {                                                                   //
		function request(prop) {                                                                                      //
			if (typeof this[prop] === 'undefined') {                                                                     // 29
				return null;                                                                                                // 30
			} else if (typeof this[prop] === 'function') {                                                               // 31
				for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
					params[_key - 1] = arguments[_key];                                                                        // 28
				}                                                                                                           // 31
                                                                                                                //
				return this[prop].apply(this, params);                                                                      // 32
			} else {                                                                                                     // 33
				return this[prop];                                                                                          // 34
			}                                                                                                            // 35
		}                                                                                                             // 36
                                                                                                                //
		return request;                                                                                               //
	}();                                                                                                           //
                                                                                                                //
	BotHelpers.prototype.addUserToRole = function () {                                                             //
		function addUserToRole(userName, roleName) {                                                                  //
			Meteor.call('authorization:addUserToRole', roleName, userName);                                              // 39
		}                                                                                                             // 40
                                                                                                                //
		return addUserToRole;                                                                                         //
	}();                                                                                                           //
                                                                                                                //
	BotHelpers.prototype.removeUserFromRole = function () {                                                        //
		function removeUserFromRole(userName, roleName) {                                                             //
			Meteor.call('authorization:removeUserFromRole', roleName, userName);                                         // 43
		}                                                                                                             // 44
                                                                                                                //
		return removeUserFromRole;                                                                                    //
	}();                                                                                                           //
                                                                                                                //
	BotHelpers.prototype.addUserToRoom = function () {                                                             //
		function addUserToRoom(userName, room) {                                                                      //
			var foundRoom = RocketChat.models.Rooms.findOneByIdOrName(room);                                             // 47
                                                                                                                //
			if (!_.isObject(foundRoom)) {                                                                                // 49
				throw new Meteor.Error('invalid-channel');                                                                  // 50
			}                                                                                                            // 51
                                                                                                                //
			var data = {};                                                                                               // 53
			data.rid = foundRoom._id;                                                                                    // 54
			data.username = userName;                                                                                    // 55
			Meteor.call('addUserToRoom', data);                                                                          // 56
		}                                                                                                             // 57
                                                                                                                //
		return addUserToRoom;                                                                                         //
	}();                                                                                                           //
                                                                                                                //
	BotHelpers.prototype.removeUserFromRoom = function () {                                                        //
		function removeUserFromRoom(userName, room) {                                                                 //
			var foundRoom = RocketChat.models.Rooms.findOneByIdOrName(room);                                             // 60
                                                                                                                //
			if (!_.isObject(foundRoom)) {                                                                                // 62
				throw new Meteor.Error('invalid-channel');                                                                  // 63
			}                                                                                                            // 64
                                                                                                                //
			var data = {};                                                                                               // 65
			data.rid = foundRoom._id;                                                                                    // 66
			data.username = userName;                                                                                    // 67
			Meteor.call('removeUserFromRoom', data);                                                                     // 68
		}                                                                                                             // 69
                                                                                                                //
		return removeUserFromRoom;                                                                                    //
	}(); // generic error whenever property access insufficient to fill request                                    //
                                                                                                                //
                                                                                                                //
	BotHelpers.prototype.requestError = function () {                                                              //
		function requestError() {                                                                                     //
			throw new Meteor.Error('error-not-allowed', 'Bot request not allowed', {                                     // 73
				method: 'botRequest',                                                                                       // 73
				action: 'bot_request'                                                                                       // 73
			});                                                                                                          // 73
		}                                                                                                             // 74
                                                                                                                //
		return requestError;                                                                                          //
	}(); // "public" properties accessed by getters                                                                //
	// allUsers / onlineUsers return whichever properties are enabled by settings                                  // 77
                                                                                                                //
                                                                                                                //
	(0, _createClass3.default)(BotHelpers, [{                                                                      //
		key: "allUsers",                                                                                              //
		get: function () {                                                                                            //
			if (!Object.keys(this.userFields).length) {                                                                  // 79
				this.requestError();                                                                                        // 80
				return false;                                                                                               // 81
			} else {                                                                                                     // 82
				return this._allUsers.fetch();                                                                              // 83
			}                                                                                                            // 84
		}                                                                                                             // 85
	}, {                                                                                                           //
		key: "onlineUsers",                                                                                           //
		get: function () {                                                                                            //
			if (!Object.keys(this.userFields).length) {                                                                  // 87
				this.requestError();                                                                                        // 88
				return false;                                                                                               // 89
			} else {                                                                                                     // 90
				return this._onlineUsers.fetch();                                                                           // 91
			}                                                                                                            // 92
		}                                                                                                             // 93
	}, {                                                                                                           //
		key: "allUsernames",                                                                                          //
		get: function () {                                                                                            //
			if (!this.userFields.hasOwnProperty('username')) {                                                           // 95
				this.requestError();                                                                                        // 96
				return false;                                                                                               // 97
			} else {                                                                                                     // 98
				return this._allUsers.fetch().map(function (user) {                                                         // 99
					return user.username;                                                                                      // 99
				});                                                                                                         // 99
			}                                                                                                            // 100
		}                                                                                                             // 101
	}, {                                                                                                           //
		key: "onlineUsernames",                                                                                       //
		get: function () {                                                                                            //
			if (!this.userFields.hasOwnProperty('username')) {                                                           // 103
				this.requestError();                                                                                        // 104
				return false;                                                                                               // 105
			} else {                                                                                                     // 106
				return this._onlineUsers.fetch().map(function (user) {                                                      // 107
					return user.username;                                                                                      // 107
				});                                                                                                         // 107
			}                                                                                                            // 108
		}                                                                                                             // 109
	}, {                                                                                                           //
		key: "allNames",                                                                                              //
		get: function () {                                                                                            //
			if (!this.userFields.hasOwnProperty('name')) {                                                               // 111
				this.requestError();                                                                                        // 112
				return false;                                                                                               // 113
			} else {                                                                                                     // 114
				return this._allUsers.fetch().map(function (user) {                                                         // 115
					return user.name;                                                                                          // 115
				});                                                                                                         // 115
			}                                                                                                            // 116
		}                                                                                                             // 117
	}, {                                                                                                           //
		key: "onlineNames",                                                                                           //
		get: function () {                                                                                            //
			if (!this.userFields.hasOwnProperty('name')) {                                                               // 119
				this.requestError();                                                                                        // 120
				return false;                                                                                               // 121
			} else {                                                                                                     // 122
				return this._onlineUsers.fetch().map(function (user) {                                                      // 123
					return user.name;                                                                                          // 123
				});                                                                                                         // 123
			}                                                                                                            // 124
		}                                                                                                             // 125
	}, {                                                                                                           //
		key: "allIDs",                                                                                                //
		get: function () {                                                                                            //
			if (!this.userFields.hasOwnProperty('_id') || !this.userFields.hasOwnProperty('username')) {                 // 127
				this.requestError();                                                                                        // 128
				return false;                                                                                               // 129
			} else {                                                                                                     // 130
				return this._allUsers.fetch().map(function (user) {                                                         // 131
					return {                                                                                                   // 132
						'id': user._id,                                                                                           // 132
						'name': user.username                                                                                     // 132
					};                                                                                                         // 132
				});                                                                                                         // 133
			}                                                                                                            // 134
		}                                                                                                             // 135
	}, {                                                                                                           //
		key: "onlineIDs",                                                                                             //
		get: function () {                                                                                            //
			if (!this.userFields.hasOwnProperty('_id') || !this.userFields.hasOwnProperty('username')) {                 // 137
				this.requestError();                                                                                        // 138
				return false;                                                                                               // 139
			} else {                                                                                                     // 140
				return this._onlineUsers.fetch().map(function (user) {                                                      // 141
					return {                                                                                                   // 142
						'id': user._id,                                                                                           // 142
						'name': user.username                                                                                     // 142
					};                                                                                                         // 142
				});                                                                                                         // 143
			}                                                                                                            // 144
		}                                                                                                             // 145
	}]);                                                                                                           //
	return BotHelpers;                                                                                             //
}(); // add class to meteor methods                                                                             //
                                                                                                                //
                                                                                                                //
var botHelpers = new BotHelpers(); // init cursors with fields setting and update on setting change             // 149
                                                                                                                //
RocketChat.settings.get('BotHelpers_userFields', function (settingKey, settingValue) {                          // 152
	botHelpers.setupCursors(settingValue);                                                                         // 153
});                                                                                                             // 154
Meteor.methods({                                                                                                // 156
	botRequest: function () {                                                                                      // 157
		var userID = Meteor.userId();                                                                                 // 158
                                                                                                                //
		if (userID && RocketChat.authz.hasRole(userID, 'bot')) {                                                      // 159
			return botHelpers.request.apply(botHelpers, arguments);                                                      // 160
		} else {                                                                                                      // 161
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                               // 162
				method: 'botRequest'                                                                                        // 162
			});                                                                                                          // 162
		}                                                                                                             // 163
	}                                                                                                              // 164
});                                                                                                             // 156
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"settings.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/rocketchat_bot-helpers/server/settings.js                                                           //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
Meteor.startup(function () {                                                                                    // 1
	RocketChat.settings.addGroup('Bots', function () {                                                             // 2
		this.add('BotHelpers_userFields', '_id, name, username, emails, language, utcOffset', {                       // 3
			type: 'string',                                                                                              // 4
			section: 'Helpers',                                                                                          // 5
			i18nLabel: 'BotHelpers_userFields',                                                                          // 6
			i18nDescription: 'BotHelpers_userFields_Description'                                                         // 7
		});                                                                                                           // 3
	});                                                                                                            // 9
});                                                                                                             // 10
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:bot-helpers/server/index.js");
require("./node_modules/meteor/rocketchat:bot-helpers/server/settings.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:bot-helpers'] = {};

})();

//# sourceMappingURL=rocketchat_bot-helpers.js.map

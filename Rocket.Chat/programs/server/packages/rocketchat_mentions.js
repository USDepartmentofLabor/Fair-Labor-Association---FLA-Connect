(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RocketChatTabBar = Package['rocketchat:lib'].RocketChatTabBar;
var _ = Package.underscore._;
var meteorInstall = Package.modules.meteorInstall;
var process = Package.modules.process;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:mentions":{"server.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_mentions/server.js                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var MentionsServer = void 0;                                                                                           // 1
module.watch(require("./MentionsServer"), {                                                                            // 1
	"default": function (v) {                                                                                             // 1
		MentionsServer = v;                                                                                                  // 1
	}                                                                                                                     // 1
}, 0);                                                                                                                 // 1
var mention = new MentionsServer({                                                                                     // 2
	pattern: function () {                                                                                                // 3
		return RocketChat.settings.get('UTF8_Names_Validation');                                                             // 3
	},                                                                                                                    // 3
	messageMaxAll: function () {                                                                                          // 4
		return RocketChat.settings.get('Message_MaxAll');                                                                    // 4
	},                                                                                                                    // 4
	getUsers: function (usernames) {                                                                                      // 5
		return Meteor.users.find({                                                                                           // 5
			username: {                                                                                                         // 5
				$in: _.unique(usernames)                                                                                           // 5
			}                                                                                                                   // 5
		}, {                                                                                                                 // 5
			fields: {                                                                                                           // 5
				_id: true,                                                                                                         // 5
				username: true                                                                                                     // 5
			}                                                                                                                   // 5
		}).fetch();                                                                                                          // 5
	},                                                                                                                    // 5
	getChannel: function (rid) {                                                                                          // 6
		return RocketChat.models.Rooms.findOneById(rid);                                                                     // 6
	},                                                                                                                    // 6
	getChannels: function (channels) {                                                                                    // 7
		return RocketChat.models.Rooms.find({                                                                                // 7
			name: {                                                                                                             // 7
				$in: _.unique(channels)                                                                                            // 7
			},                                                                                                                  // 7
			t: 'c'                                                                                                              // 7
		}, {                                                                                                                 // 7
			fields: {                                                                                                           // 7
				_id: 1,                                                                                                            // 7
				name: 1                                                                                                            // 7
			}                                                                                                                   // 7
		}).fetch();                                                                                                          // 7
	}                                                                                                                     // 7
});                                                                                                                    // 2
RocketChat.callbacks.add('beforeSaveMessage', function (message) {                                                     // 9
	return mention.execute(message);                                                                                      // 9
}, RocketChat.callbacks.priority.HIGH, 'mentions');                                                                    // 9
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Mentions.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_mentions/Mentions.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
var _createClass2 = require("babel-runtime/helpers/createClass");                                                      //
                                                                                                                       //
var _createClass3 = _interopRequireDefault(_createClass2);                                                             //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
var _ = void 0;                                                                                                        // 1
                                                                                                                       //
module.watch(require("underscore"), {                                                                                  // 1
	"default": function (v) {                                                                                             // 1
		_ = v;                                                                                                               // 1
	}                                                                                                                     // 1
}, 0);                                                                                                                 // 1
module.exportDefault(function () {                                                                                     // 1
	function _class(_ref) {                                                                                               // 7
		var pattern = _ref.pattern,                                                                                          // 7
		    useRealName = _ref.useRealName,                                                                                  // 7
		    me = _ref.me;                                                                                                    // 7
		(0, _classCallCheck3.default)(this, _class);                                                                         // 7
		this.pattern = pattern;                                                                                              // 8
		this.useRealName = useRealName;                                                                                      // 9
		this.me = me;                                                                                                        // 10
	}                                                                                                                     // 11
                                                                                                                       //
	_class.prototype.replaceUsers = function () {                                                                         // 1
		function replaceUsers(str, message, me) {                                                                            // 1
			var _this = this;                                                                                                   // 36
                                                                                                                       //
			return str.replace(this.userMentionRegex, function (match, username) {                                              // 37
				if (['all', 'here'].includes(username)) {                                                                          // 38
					return "<a class=\"mention-link mention-link-me mention-link-all background-attention-color\">" + match + "</a>";
				}                                                                                                                  // 40
                                                                                                                       //
				var mentionObj = _.findWhere(message.mentions, {                                                                   // 42
					username: username                                                                                                // 42
				});                                                                                                                // 42
                                                                                                                       //
				if (message.temp == null && mentionObj == null) {                                                                  // 43
					return match;                                                                                                     // 44
				}                                                                                                                  // 45
                                                                                                                       //
				var name = _this.useRealName && mentionObj && mentionObj.name;                                                     // 46
				return "<a class=\"mention-link " + (username === me ? 'mention-link-me background-primary-action-color' : '') + "\" data-username=\"" + username + "\" title=\"" + (name ? username : '') + "\">" + (name || match) + "</a>";
			});                                                                                                                 // 49
		}                                                                                                                    // 50
                                                                                                                       //
		return replaceUsers;                                                                                                 // 1
	}();                                                                                                                  // 1
                                                                                                                       //
	_class.prototype.replaceChannels = function () {                                                                      // 1
		function replaceChannels(str, message) {                                                                             // 1
			//since apostrophe escaped contains # we need to unescape it                                                        // 52
			return str.replace(/&#39;/g, '\'').replace(this.channelMentionRegex, function (match, name) {                       // 53
				if (message.temp == null && _.findWhere(message.channels, {                                                        // 54
					name: name                                                                                                        // 54
				}) == null) {                                                                                                      // 54
					return match;                                                                                                     // 55
				}                                                                                                                  // 56
                                                                                                                       //
				return "<a class=\"mention-link\" data-channel=\"" + name + "\">" + match + "</a>";                                // 57
			});                                                                                                                 // 58
		}                                                                                                                    // 59
                                                                                                                       //
		return replaceChannels;                                                                                              // 1
	}();                                                                                                                  // 1
                                                                                                                       //
	_class.prototype.getUserMentions = function () {                                                                      // 1
		function getUserMentions(str) {                                                                                      // 1
			return str.match(this.userMentionRegex) || [];                                                                      // 61
		}                                                                                                                    // 62
                                                                                                                       //
		return getUserMentions;                                                                                              // 1
	}();                                                                                                                  // 1
                                                                                                                       //
	_class.prototype.getChannelMentions = function () {                                                                   // 1
		function getChannelMentions(str) {                                                                                   // 1
			return str.match(this.channelMentionRegex) || [];                                                                   // 64
		}                                                                                                                    // 65
                                                                                                                       //
		return getChannelMentions;                                                                                           // 1
	}();                                                                                                                  // 1
                                                                                                                       //
	_class.prototype.parse = function () {                                                                                // 1
		function parse(message) {                                                                                            // 1
			var msg = message && message.html || '';                                                                            // 67
                                                                                                                       //
			if (!msg.trim()) {                                                                                                  // 68
				return message;                                                                                                    // 69
			}                                                                                                                   // 70
                                                                                                                       //
			msg = this.replaceUsers(msg, message, this.me);                                                                     // 71
			msg = this.replaceChannels(msg, message, this.me);                                                                  // 72
			message.html = msg;                                                                                                 // 73
			return message;                                                                                                     // 74
		}                                                                                                                    // 75
                                                                                                                       //
		return parse;                                                                                                        // 1
	}();                                                                                                                  // 1
                                                                                                                       //
	(0, _createClass3.default)(_class, [{                                                                                 // 1
		key: "me",                                                                                                           // 1
		set: function (m) {                                                                                                  // 1
			this._me = m;                                                                                                       // 13
		},                                                                                                                   // 14
		get: function () {                                                                                                   // 1
			return typeof this._me === 'function' ? this._me() : this._me;                                                      // 16
		}                                                                                                                    // 17
	}, {                                                                                                                  // 1
		key: "pattern",                                                                                                      // 1
		set: function (p) {                                                                                                  // 1
			this._pattern = p;                                                                                                  // 19
		},                                                                                                                   // 20
		get: function () {                                                                                                   // 1
			return typeof this._pattern === 'function' ? this._pattern() : this._pattern;                                       // 22
		}                                                                                                                    // 23
	}, {                                                                                                                  // 1
		key: "useRealName",                                                                                                  // 1
		set: function (s) {                                                                                                  // 1
			this._useRealName = s;                                                                                              // 25
		},                                                                                                                   // 26
		get: function () {                                                                                                   // 1
			return typeof this._useRealName === 'function' ? this._useRealName() : this._useRealName;                           // 28
		}                                                                                                                    // 29
	}, {                                                                                                                  // 1
		key: "userMentionRegex",                                                                                             // 1
		get: function () {                                                                                                   // 1
			return new RegExp("@(" + this.pattern + ")", 'gm');                                                                 // 31
		}                                                                                                                    // 32
	}, {                                                                                                                  // 1
		key: "channelMentionRegex",                                                                                          // 1
		get: function () {                                                                                                   // 1
			return new RegExp("#(" + this.pattern + ")", 'gm');                                                                 // 34
		}                                                                                                                    // 35
	}]);                                                                                                                  // 1
	return _class;                                                                                                        // 1
}());                                                                                                                  // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"MentionsServer.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_mentions/MentionsServer.js                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");                                          //
                                                                                                                       //
var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);                                                 //
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
var _createClass2 = require("babel-runtime/helpers/createClass");                                                      //
                                                                                                                       //
var _createClass3 = _interopRequireDefault(_createClass2);                                                             //
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
module.export({                                                                                                        // 1
	"default": function () {                                                                                              // 1
		return MentionsServer;                                                                                               // 1
	}                                                                                                                     // 1
});                                                                                                                    // 1
var Mentions = void 0;                                                                                                 // 1
module.watch(require("./Mentions"), {                                                                                  // 1
	"default": function (v) {                                                                                             // 1
		Mentions = v;                                                                                                        // 1
	}                                                                                                                     // 1
}, 0);                                                                                                                 // 1
                                                                                                                       //
var MentionsServer = function (_Mentions) {                                                                            //
	(0, _inherits3.default)(MentionsServer, _Mentions);                                                                   //
                                                                                                                       //
	function MentionsServer(args) {                                                                                       // 7
		(0, _classCallCheck3.default)(this, MentionsServer);                                                                 // 7
                                                                                                                       //
		var _this = (0, _possibleConstructorReturn3.default)(this, _Mentions.call(this, args));                              // 7
                                                                                                                       //
		_this.messageMaxAll = args.messageMaxAll;                                                                            // 9
		_this.getChannel = args.getChannel;                                                                                  // 10
		_this.getChannels = args.getChannels;                                                                                // 11
		_this.getUsers = args.getUsers;                                                                                      // 12
		return _this;                                                                                                        // 7
	}                                                                                                                     // 13
                                                                                                                       //
	MentionsServer.prototype.getUsersByMentions = function () {                                                           //
		function getUsersByMentions(_ref) {                                                                                  //
			var _this2 = this;                                                                                                  // 38
                                                                                                                       //
			var msg = _ref.msg,                                                                                                 // 38
			    rid = _ref.rid;                                                                                                 // 38
			var mentions = this.getUserMentions(msg);                                                                           // 39
			var mentionsAll = [];                                                                                               // 40
			var userMentions = [];                                                                                              // 41
			mentions.forEach(function (m) {                                                                                     // 43
				var mention = m.trim().substr(1);                                                                                  // 44
                                                                                                                       //
				if (mention !== 'all' && mention !== 'here') {                                                                     // 45
					return userMentions.push(mention);                                                                                // 46
				}                                                                                                                  // 47
                                                                                                                       //
				if (mention === 'all') {                                                                                           // 48
					var messageMaxAll = _this2.messageMaxAll;                                                                         // 49
                                                                                                                       //
					var allChannel = _this2.getChannel(rid);                                                                          // 50
                                                                                                                       //
					if (messageMaxAll !== 0 && allChannel.usernames.length >= messageMaxAll) {                                        // 51
						return;                                                                                                          // 52
					}                                                                                                                 // 53
				}                                                                                                                  // 54
                                                                                                                       //
				mentionsAll.push({                                                                                                 // 55
					_id: mention,                                                                                                     // 56
					username: mention                                                                                                 // 57
				});                                                                                                                // 55
			});                                                                                                                 // 59
			mentions = userMentions.length ? this.getUsers(userMentions) : [];                                                  // 60
			return [].concat(mentionsAll, (0, _toConsumableArray3.default)(mentions));                                          // 61
		}                                                                                                                    // 62
                                                                                                                       //
		return getUsersByMentions;                                                                                           //
	}();                                                                                                                  //
                                                                                                                       //
	MentionsServer.prototype.getChannelbyMentions = function () {                                                         //
		function getChannelbyMentions(_ref2) {                                                                               //
			var msg = _ref2.msg;                                                                                                // 63
			var channels = this.getChannelMentions(msg);                                                                        // 64
			return this.getChannels(channels.map(function (c) {                                                                 // 65
				return c.trim().substr(1);                                                                                         // 65
			}));                                                                                                                // 65
		}                                                                                                                    // 66
                                                                                                                       //
		return getChannelbyMentions;                                                                                         //
	}();                                                                                                                  //
                                                                                                                       //
	MentionsServer.prototype.execute = function () {                                                                      //
		function execute(message) {                                                                                          //
			var mentionsAll = this.getUsersByMentions(message);                                                                 // 68
			var channels = this.getChannelbyMentions(message);                                                                  // 69
			message.mentions = mentionsAll;                                                                                     // 71
			message.channels = channels;                                                                                        // 73
			return message;                                                                                                     // 74
		}                                                                                                                    // 75
                                                                                                                       //
		return execute;                                                                                                      //
	}();                                                                                                                  //
                                                                                                                       //
	(0, _createClass3.default)(MentionsServer, [{                                                                         //
		key: "getUsers",                                                                                                     //
		set: function (m) {                                                                                                  //
			this._getUsers = m;                                                                                                 // 15
		},                                                                                                                   // 16
		get: function () {                                                                                                   //
			var _this3 = this;                                                                                                  // 17
                                                                                                                       //
			return typeof this._getUsers === 'function' ? this._getUsers : function () {                                        // 18
				return _this3._getUsers;                                                                                           // 18
			};                                                                                                                  // 18
		}                                                                                                                    // 19
	}, {                                                                                                                  //
		key: "getChannels",                                                                                                  //
		set: function (m) {                                                                                                  //
			this._getChannels = m;                                                                                              // 21
		},                                                                                                                   // 22
		get: function () {                                                                                                   //
			var _this4 = this;                                                                                                  // 23
                                                                                                                       //
			return typeof this._getChannels === 'function' ? this._getChannels : function () {                                  // 24
				return _this4._getChannels;                                                                                        // 24
			};                                                                                                                  // 24
		}                                                                                                                    // 25
	}, {                                                                                                                  //
		key: "getChannel",                                                                                                   //
		set: function (m) {                                                                                                  //
			this._getChannel = m;                                                                                               // 27
		},                                                                                                                   // 28
		get: function () {                                                                                                   //
			var _this5 = this;                                                                                                  // 29
                                                                                                                       //
			return typeof this._getChannel === 'function' ? this._getChannel : function () {                                    // 30
				return _this5._getChannel;                                                                                         // 30
			};                                                                                                                  // 30
		}                                                                                                                    // 31
	}, {                                                                                                                  //
		key: "messageMaxAll",                                                                                                //
		set: function (m) {                                                                                                  //
			this._messageMaxAll = m;                                                                                            // 33
		},                                                                                                                   // 34
		get: function () {                                                                                                   //
			return typeof this._messageMaxAll === 'function' ? this._messageMaxAll() : this._messageMaxAll;                     // 36
		}                                                                                                                    // 37
	}]);                                                                                                                  //
	return MentionsServer;                                                                                                //
}(Mentions);                                                                                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:mentions/server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:mentions'] = {};

})();

//# sourceMappingURL=rocketchat_mentions.js.map

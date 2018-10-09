(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var check = Package.check.check;
var Match = Package.check.Match;
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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:slashcommands-invite-all":{"server.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_slashcommands-invite-all/server.js                                                  //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");                                      //
                                                                                                           //
var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);                                             //
                                                                                                           //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }          //
                                                                                                           //
/*                                                                                                         // 1
 * Invite is a named function that will replace /invite commands                                           //
 * @param {Object} message - The message object                                                            //
 */function inviteAll(type) {                                                                              //
	return function () {                                                                                      // 8
		function inviteAll(command, params, item) {                                                              // 8
			if (!/invite\-all-(to|from)/.test(command) || !Match.test(params, String)) {                            // 10
				return;                                                                                                // 11
			}                                                                                                       // 12
                                                                                                           //
			var regexp = /#?([\d-_\w]+)/g;                                                                          // 14
                                                                                                           //
			var _regexp$exec = regexp.exec(params.trim()),                                                          // 8
			    _regexp$exec2 = (0, _slicedToArray3.default)(_regexp$exec, 2),                                      // 8
			    channel = _regexp$exec2[1];                                                                         // 8
                                                                                                           //
			if (!channel) {                                                                                         // 17
				return;                                                                                                // 18
			}                                                                                                       // 19
                                                                                                           //
			var currentUser = Meteor.users.findOne(Meteor.userId());                                                // 21
			var baseChannel = type === 'to' ? RocketChat.models.Rooms.findOneById(item.rid) : RocketChat.models.Rooms.findOneByName(channel);
			var targetChannel = type === 'from' ? RocketChat.models.Rooms.findOneById(item.rid) : RocketChat.models.Rooms.findOneByName(channel);
                                                                                                           //
			if (!baseChannel) {                                                                                     // 25
				return RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {                               // 26
					_id: Random.id(),                                                                                     // 27
					rid: item.rid,                                                                                        // 28
					ts: new Date(),                                                                                       // 29
					msg: TAPi18n.__('Channel_doesnt_exist', {                                                             // 30
						postProcess: 'sprintf',                                                                              // 31
						sprintf: [channel]                                                                                   // 32
					}, currentUser.language)                                                                              // 30
				});                                                                                                    // 26
			}                                                                                                       // 35
                                                                                                           //
			var users = baseChannel.usernames || [];                                                                // 36
                                                                                                           //
			try {                                                                                                   // 38
				if (users.length > RocketChat.settings.get('API_User_Limit')) {                                        // 39
					throw new Meteor.Error('error-user-limit-exceeded', 'User Limit Exceeded', {                          // 40
						method: 'addAllToRoom'                                                                               // 41
					});                                                                                                   // 40
				}                                                                                                      // 43
                                                                                                           //
				if (!targetChannel && ['c', 'p'].indexOf(baseChannel.t) > -1) {                                        // 45
					Meteor.call(baseChannel.t === 'c' ? 'createChannel' : 'createPrivateGroup', channel, users);          // 46
					RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {                                     // 47
						_id: Random.id(),                                                                                    // 48
						rid: item.rid,                                                                                       // 49
						ts: new Date(),                                                                                      // 50
						msg: TAPi18n.__('Channel_created', {                                                                 // 51
							postProcess: 'sprintf',                                                                             // 52
							sprintf: [channel]                                                                                  // 53
						}, currentUser.language)                                                                             // 51
					});                                                                                                   // 47
				} else {                                                                                               // 56
					Meteor.call('addUsersToRoom', {                                                                       // 57
						rid: targetChannel._id,                                                                              // 58
						users: users                                                                                         // 59
					});                                                                                                   // 57
				}                                                                                                      // 61
                                                                                                           //
				return RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {                               // 62
					_id: Random.id(),                                                                                     // 63
					rid: item.rid,                                                                                        // 64
					ts: new Date(),                                                                                       // 65
					msg: TAPi18n.__('Users_added', null, currentUser.language)                                            // 66
				});                                                                                                    // 62
			} catch (e) {                                                                                           // 68
				var msg = e.error === 'cant-invite-for-direct-room' ? 'Cannot_invite_users_to_direct_rooms' : e.error;
				RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {                                      // 70
					_id: Random.id(),                                                                                     // 71
					rid: item.rid,                                                                                        // 72
					ts: new Date(),                                                                                       // 73
					msg: TAPi18n.__(msg, null, currentUser.language)                                                      // 74
				});                                                                                                    // 70
			}                                                                                                       // 76
		}                                                                                                        // 77
                                                                                                           //
		return inviteAll;                                                                                        // 8
	}();                                                                                                      // 8
}                                                                                                          // 78
                                                                                                           //
RocketChat.slashCommands.add('invite-all-to', inviteAll('to'));                                            // 79
RocketChat.slashCommands.add('invite-all-from', inviteAll('from'));                                        // 80
module.exports = inviteAll;                                                                                // 81
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:slashcommands-invite-all/server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:slashcommands-invite-all'] = {};

})();

//# sourceMappingURL=rocketchat_slashcommands-invite-all.js.map

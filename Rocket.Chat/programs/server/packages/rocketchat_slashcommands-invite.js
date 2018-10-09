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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:slashcommands-invite":{"server.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
// packages/rocketchat_slashcommands-invite/server.js                                      //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////
                                                                                           //
module.export({                                                                            // 1
	Invite: function () {                                                                     // 1
		return Invite;                                                                           // 1
	}                                                                                         // 1
});                                                                                        // 1
                                                                                           //
/*                                                                                         // 2
* Invite is a named function that will replace /invite commands                            //
* @param {Object} message - The message object                                             //
*/function Invite(command, params, item) {                                                 //
	if (command !== 'invite' || !Match.test(params, String)) {                                // 10
		return;                                                                                  // 11
	}                                                                                         // 12
                                                                                           //
	var usernames = params.replace(/@/g, '').split(/[\s,]/).filter(function (a) {             // 13
		return a !== '';                                                                         // 13
	});                                                                                       // 13
                                                                                           //
	if (usernames.length === 0) {                                                             // 14
		return;                                                                                  // 15
	}                                                                                         // 16
                                                                                           //
	var users = Meteor.users.find({                                                           // 17
		username: {                                                                              // 18
			$in: usernames                                                                          // 19
		}                                                                                        // 18
	});                                                                                       // 17
	var currentUser = Meteor.users.findOne(Meteor.userId());                                  // 22
                                                                                           //
	if (users.count() === 0) {                                                                // 23
		RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {                        // 24
			_id: Random.id(),                                                                       // 25
			rid: item.rid,                                                                          // 26
			ts: new Date(),                                                                         // 27
			msg: TAPi18n.__('User_doesnt_exist', {                                                  // 28
				postProcess: 'sprintf',                                                                // 29
				sprintf: [usernames.join(' @')]                                                        // 30
			}, currentUser.language)                                                                // 28
		});                                                                                      // 24
		return;                                                                                  // 33
	}                                                                                         // 34
                                                                                           //
	usernames = usernames.filter(function (username) {                                        // 35
		if (RocketChat.models.Rooms.findOneByIdContainingUsername(item.rid, username) == null) {
			return true;                                                                            // 37
		}                                                                                        // 38
                                                                                           //
		RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {                        // 39
			_id: Random.id(),                                                                       // 40
			rid: item.rid,                                                                          // 41
			ts: new Date(),                                                                         // 42
			msg: TAPi18n.__('Username_is_already_in_here', {                                        // 43
				postProcess: 'sprintf',                                                                // 44
				sprintf: [username]                                                                    // 45
			}, currentUser.language)                                                                // 43
		});                                                                                      // 39
		return false;                                                                            // 48
	});                                                                                       // 49
                                                                                           //
	if (usernames.length === 0) {                                                             // 50
		return;                                                                                  // 51
	}                                                                                         // 52
                                                                                           //
	users.forEach(function (user) {                                                           // 53
		try {                                                                                    // 55
			return Meteor.call('addUserToRoom', {                                                   // 56
				rid: item.rid,                                                                         // 57
				username: user.username                                                                // 58
			});                                                                                     // 56
		} catch (_ref) {                                                                         // 60
			var error = _ref.error;                                                                 // 60
                                                                                           //
			if (error === 'cant-invite-for-direct-room') {                                          // 61
				RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {                      // 62
					_id: Random.id(),                                                                     // 63
					rid: item.rid,                                                                        // 64
					ts: new Date(),                                                                       // 65
					msg: TAPi18n.__('Cannot_invite_users_to_direct_rooms', null, currentUser.language)    // 66
				});                                                                                    // 62
			} else {                                                                                // 68
				RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {                      // 69
					_id: Random.id(),                                                                     // 70
					rid: item.rid,                                                                        // 71
					ts: new Date(),                                                                       // 72
					msg: TAPi18n.__(error, null, currentUser.language)                                    // 73
				});                                                                                    // 69
			}                                                                                       // 75
		}                                                                                        // 76
	});                                                                                       // 77
}                                                                                          // 78
                                                                                           //
RocketChat.slashCommands.add('invite', Invite);                                            // 80
/////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:slashcommands-invite/server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:slashcommands-invite'] = {};

})();

//# sourceMappingURL=rocketchat_slashcommands-invite.js.map

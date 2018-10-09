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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:slashcommands-kick":{"server.js":function(){

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
// packages/rocketchat_slashcommands-kick/server.js                        //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////
                                                                           //
// Kick is a named function that will replace /kick commands               // 2
var Kick = function (command, params, _ref) {                              // 4
	var rid = _ref.rid;                                                       // 4
                                                                           //
	if (command !== 'kick' || !Match.test(params, String)) {                  // 5
		return;                                                                  // 6
	}                                                                         // 7
                                                                           //
	var username = params.trim().replace('@', '');                            // 8
                                                                           //
	if (username === '') {                                                    // 9
		return;                                                                  // 10
	}                                                                         // 11
                                                                           //
	var user = Meteor.users.findOne(Meteor.userId());                         // 12
	var kickedUser = RocketChat.models.Users.findOneByUsername(username);     // 13
	var room = RocketChat.models.Rooms.findOneById(rid);                      // 14
                                                                           //
	if (kickedUser == null) {                                                 // 15
		return RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {
			_id: Random.id(),                                                       // 17
			rid: rid,                                                               // 18
			ts: new Date(),                                                         // 19
			msg: TAPi18n.__('Username_doesnt_exist', {                              // 20
				postProcess: 'sprintf',                                                // 21
				sprintf: [username]                                                    // 22
			}, user.language)                                                       // 20
		});                                                                      // 16
	}                                                                         // 25
                                                                           //
	if ((room.usernames || []).includes(username) === false) {                // 26
		return RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {
			_id: Random.id(),                                                       // 28
			rid: rid,                                                               // 29
			ts: new Date(),                                                         // 30
			msg: TAPi18n.__('Username_is_not_in_this_room', {                       // 31
				postProcess: 'sprintf',                                                // 32
				sprintf: [username]                                                    // 33
			}, user.language)                                                       // 31
		});                                                                      // 27
	}                                                                         // 36
                                                                           //
	Meteor.call('removeUserFromRoom', {                                       // 37
		rid: rid,                                                                // 37
		username: username                                                       // 37
	});                                                                       // 37
};                                                                         // 38
                                                                           //
RocketChat.slashCommands.add('kick', Kick);                                // 40
/////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:slashcommands-kick/server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:slashcommands-kick'] = {};

})();

//# sourceMappingURL=rocketchat_slashcommands-kick.js.map

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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:slashcommands-mute":{"server":{"mute.js":function(){

//////////////////////////////////////////////////////////////////////////////
//                                                                          //
// packages/rocketchat_slashcommands-mute/server/mute.js                    //
//                                                                          //
//////////////////////////////////////////////////////////////////////////////
                                                                            //
/*                                                                          // 2
* Mute is a named function that will replace /mute commands                 //
*/RocketChat.slashCommands.add('mute', function () {                        //
	function Mute(command, params, item) {                                     // 6
		if (command !== 'mute' || !Match.test(params, String)) {                  // 7
			return;                                                                  // 8
		}                                                                         // 9
                                                                            //
		var username = params.trim().replace('@', '');                            // 10
                                                                            //
		if (username === '') {                                                    // 11
			return;                                                                  // 12
		}                                                                         // 13
                                                                            //
		var user = Meteor.users.findOne(Meteor.userId());                         // 14
		var mutedUser = RocketChat.models.Users.findOneByUsername(username);      // 15
		var room = RocketChat.models.Rooms.findOneById(item.rid);                 // 16
                                                                            //
		if (mutedUser == null) {                                                  // 17
			RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {        // 18
				_id: Random.id(),                                                       // 19
				rid: item.rid,                                                          // 20
				ts: new Date(),                                                         // 21
				msg: TAPi18n.__('Username_doesnt_exist', {                              // 22
					postProcess: 'sprintf',                                                // 23
					sprintf: [username]                                                    // 24
				}, user.language)                                                       // 22
			});                                                                      // 18
			return;                                                                  // 27
		}                                                                         // 28
                                                                            //
		if ((room.usernames || []).includes(username) === false) {                // 29
			RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {        // 30
				_id: Random.id(),                                                       // 31
				rid: item.rid,                                                          // 32
				ts: new Date(),                                                         // 33
				msg: TAPi18n.__('Username_is_not_in_this_room', {                       // 34
					postProcess: 'sprintf',                                                // 35
					sprintf: [username]                                                    // 36
				}, user.language)                                                       // 34
			});                                                                      // 30
			return;                                                                  // 39
		}                                                                         // 40
                                                                            //
		Meteor.call('muteUserInRoom', {                                           // 41
			rid: item.rid,                                                           // 42
			username: username                                                       // 43
		});                                                                       // 41
	}                                                                          // 45
                                                                            //
	return Mute;                                                               // 6
}());                                                                       // 6
//////////////////////////////////////////////////////////////////////////////

},"unmute.js":function(){

//////////////////////////////////////////////////////////////////////////////
//                                                                          //
// packages/rocketchat_slashcommands-mute/server/unmute.js                  //
//                                                                          //
//////////////////////////////////////////////////////////////////////////////
                                                                            //
/*                                                                          // 2
* Unmute is a named function that will replace /unmute commands             //
*/RocketChat.slashCommands.add('unmute', function () {                      //
	function Unmute(command, params, item) {                                   // 6
		if (command !== 'unmute' || !Match.test(params, String)) {                // 8
			return;                                                                  // 9
		}                                                                         // 10
                                                                            //
		var username = params.trim().replace('@', '');                            // 11
                                                                            //
		if (username === '') {                                                    // 12
			return;                                                                  // 13
		}                                                                         // 14
                                                                            //
		var user = Meteor.users.findOne(Meteor.userId());                         // 15
		var unmutedUser = RocketChat.models.Users.findOneByUsername(username);    // 16
		var room = RocketChat.models.Rooms.findOneById(item.rid);                 // 17
                                                                            //
		if (unmutedUser == null) {                                                // 18
			return RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {
				_id: Random.id(),                                                       // 20
				rid: item.rid,                                                          // 21
				ts: new Date(),                                                         // 22
				msg: TAPi18n.__('Username_doesnt_exist', {                              // 23
					postProcess: 'sprintf',                                                // 24
					sprintf: [username]                                                    // 25
				}, user.language)                                                       // 23
			});                                                                      // 19
		}                                                                         // 28
                                                                            //
		if ((room.usernames || []).includes(username) === false) {                // 29
			return RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {
				_id: Random.id(),                                                       // 31
				rid: item.rid,                                                          // 32
				ts: new Date(),                                                         // 33
				msg: TAPi18n.__('Username_is_not_in_this_room', {                       // 34
					postProcess: 'sprintf',                                                // 35
					sprintf: [username]                                                    // 36
				}, user.language)                                                       // 34
			});                                                                      // 30
		}                                                                         // 39
                                                                            //
		Meteor.call('unmuteUserInRoom', {                                         // 40
			rid: item.rid,                                                           // 41
			username: username                                                       // 42
		});                                                                       // 40
	}                                                                          // 44
                                                                            //
	return Unmute;                                                             // 6
}());                                                                       // 6
//////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:slashcommands-mute/server/mute.js");
require("./node_modules/meteor/rocketchat:slashcommands-mute/server/unmute.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:slashcommands-mute'] = {};

})();

//# sourceMappingURL=rocketchat_slashcommands-mute.js.map

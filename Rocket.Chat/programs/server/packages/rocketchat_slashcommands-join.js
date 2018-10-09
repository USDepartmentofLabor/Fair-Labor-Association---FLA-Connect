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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:slashcommands-join":{"server.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                          //
// packages/rocketchat_slashcommands-join/server.js                                         //
//                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////
                                                                                            //
/*                                                                                          // 2
* Join is a named function that will replace /join commands                                 //
* @param {Object} message - The message object                                              //
*/RocketChat.slashCommands.add('join', function () {                                        //
	function Join(command, params, item) {                                                     // 8
		if (command !== 'join' || !Match.test(params, String)) {                                  // 10
			return;                                                                                  // 11
		}                                                                                         // 12
                                                                                            //
		var channel = params.trim();                                                              // 13
                                                                                            //
		if (channel === '') {                                                                     // 14
			return;                                                                                  // 15
		}                                                                                         // 16
                                                                                            //
		channel = channel.replace('#', '');                                                       // 17
		var user = Meteor.users.findOne(Meteor.userId());                                         // 18
		var room = RocketChat.models.Rooms.findOneByNameAndType(channel, 'c');                    // 19
                                                                                            //
		if (!room) {                                                                              // 20
			RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {                        // 21
				_id: Random.id(),                                                                       // 22
				rid: item.rid,                                                                          // 23
				ts: new Date(),                                                                         // 24
				msg: TAPi18n.__('Channel_doesnt_exist', {                                               // 25
					postProcess: 'sprintf',                                                                // 26
					sprintf: [channel]                                                                     // 27
				}, user.language)                                                                       // 25
			});                                                                                      // 21
		}                                                                                         // 30
                                                                                            //
		if (room.usernames.includes(user.username)) {                                             // 31
			throw new Meteor.Error('error-user-already-in-room', 'You are already in the channel', {
				method: 'slashCommands'                                                                 // 33
			});                                                                                      // 32
		}                                                                                         // 35
                                                                                            //
		Meteor.call('joinRoom', room._id);                                                        // 36
	}                                                                                          // 37
                                                                                            //
	return Join;                                                                               // 8
}());                                                                                       // 8
//////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:slashcommands-join/server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:slashcommands-join'] = {};

})();

//# sourceMappingURL=rocketchat_slashcommands-join.js.map

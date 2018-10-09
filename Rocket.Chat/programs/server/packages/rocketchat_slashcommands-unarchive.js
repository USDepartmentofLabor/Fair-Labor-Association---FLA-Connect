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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:slashcommands-unarchive":{"messages.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
// packages/rocketchat_slashcommands-unarchive/messages.js                                 //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////
                                                                                           //
RocketChat.models.Messages.createRoomUnarchivedByRoomIdAndUser = function (roomId, user) {
	return this.createWithTypeRoomIdMessageAndUser('room-unarchived', roomId, '', user);      // 2
};                                                                                         // 3
/////////////////////////////////////////////////////////////////////////////////////////////

},"server.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
// packages/rocketchat_slashcommands-unarchive/server.js                                   //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////
                                                                                           //
function Unarchive(command, params, item) {                                                // 1
	if (command !== 'unarchive' || !Match.test(params, String)) {                             // 2
		return;                                                                                  // 3
	}                                                                                         // 4
                                                                                           //
	var channel = params.trim();                                                              // 6
	var room = void 0;                                                                        // 7
                                                                                           //
	if (channel === '') {                                                                     // 9
		room = RocketChat.models.Rooms.findOneById(item.rid);                                    // 10
		channel = room.name;                                                                     // 11
	} else {                                                                                  // 12
		channel = channel.replace('#', '');                                                      // 13
		room = RocketChat.models.Rooms.findOneByName(channel);                                   // 14
	} // You can not archive direct messages.                                                 // 15
                                                                                           //
                                                                                           //
	if (room.t === 'd') {                                                                     // 18
		return;                                                                                  // 19
	}                                                                                         // 20
                                                                                           //
	var user = Meteor.users.findOne(Meteor.userId());                                         // 22
                                                                                           //
	if (!room.archived) {                                                                     // 24
		RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {                        // 25
			_id: Random.id(),                                                                       // 26
			rid: item.rid,                                                                          // 27
			ts: new Date(),                                                                         // 28
			msg: TAPi18n.__('Channel_already_Unarchived', {                                         // 29
				postProcess: 'sprintf',                                                                // 30
				sprintf: [channel]                                                                     // 31
			}, user.language)                                                                       // 29
		});                                                                                      // 25
		return;                                                                                  // 34
	}                                                                                         // 35
                                                                                           //
	Meteor.call('unarchiveRoom', room._id);                                                   // 37
	RocketChat.models.Messages.createRoomUnarchivedByRoomIdAndUser(room._id, Meteor.user());  // 39
	RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {                         // 40
		_id: Random.id(),                                                                        // 41
		rid: item.rid,                                                                           // 42
		ts: new Date(),                                                                          // 43
		msg: TAPi18n.__('Channel_Unarchived', {                                                  // 44
			postProcess: 'sprintf',                                                                 // 45
			sprintf: [channel]                                                                      // 46
		}, user.language)                                                                        // 44
	});                                                                                       // 40
	return Unarchive;                                                                         // 50
}                                                                                          // 51
                                                                                           //
RocketChat.slashCommands.add('unarchive', Unarchive);                                      // 53
/////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:slashcommands-unarchive/messages.js");
require("./node_modules/meteor/rocketchat:slashcommands-unarchive/server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:slashcommands-unarchive'] = {};

})();

//# sourceMappingURL=rocketchat_slashcommands-unarchive.js.map

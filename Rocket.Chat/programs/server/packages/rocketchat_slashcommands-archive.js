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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:slashcommands-archive":{"messages.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////
//                                                                                       //
// packages/rocketchat_slashcommands-archive/messages.js                                 //
//                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////
                                                                                         //
RocketChat.models.Messages.createRoomArchivedByRoomIdAndUser = function (roomId, user) {
	return this.createWithTypeRoomIdMessageAndUser('room-archived', roomId, '', user);      // 2
};                                                                                       // 3
///////////////////////////////////////////////////////////////////////////////////////////

},"server.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////
//                                                                                       //
// packages/rocketchat_slashcommands-archive/server.js                                   //
//                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////
                                                                                         //
function Archive(command, params, item) {                                                // 1
	if (command !== 'archive' || !Match.test(params, String)) {                             // 2
		return;                                                                                // 3
	}                                                                                       // 4
                                                                                         //
	var channel = params.trim();                                                            // 6
	var room = void 0;                                                                      // 7
                                                                                         //
	if (channel === '') {                                                                   // 9
		room = RocketChat.models.Rooms.findOneById(item.rid);                                  // 10
		channel = room.name;                                                                   // 11
	} else {                                                                                // 12
		channel = channel.replace('#', '');                                                    // 13
		room = RocketChat.models.Rooms.findOneByName(channel);                                 // 14
	} // You can not archive direct messages.                                               // 15
                                                                                         //
                                                                                         //
	if (room.t === 'd') {                                                                   // 18
		return;                                                                                // 19
	}                                                                                       // 20
                                                                                         //
	var user = Meteor.users.findOne(Meteor.userId());                                       // 22
                                                                                         //
	if (room.archived) {                                                                    // 24
		RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {                      // 25
			_id: Random.id(),                                                                     // 26
			rid: item.rid,                                                                        // 27
			ts: new Date(),                                                                       // 28
			msg: TAPi18n.__('Duplicate_archived_channel_name', {                                  // 29
				postProcess: 'sprintf',                                                              // 30
				sprintf: [channel]                                                                   // 31
			}, user.language)                                                                     // 29
		});                                                                                    // 25
		return;                                                                                // 34
	}                                                                                       // 35
                                                                                         //
	Meteor.call('archiveRoom', room._id);                                                   // 36
	RocketChat.models.Messages.createRoomArchivedByRoomIdAndUser(room._id, Meteor.user());  // 38
	RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {                       // 39
		_id: Random.id(),                                                                      // 40
		rid: item.rid,                                                                         // 41
		ts: new Date(),                                                                        // 42
		msg: TAPi18n.__('Channel_Archived', {                                                  // 43
			postProcess: 'sprintf',                                                               // 44
			sprintf: [channel]                                                                    // 45
		}, user.language)                                                                      // 43
	});                                                                                     // 39
	return Archive;                                                                         // 49
}                                                                                        // 50
                                                                                         //
RocketChat.slashCommands.add('archive', Archive);                                        // 52
///////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:slashcommands-archive/messages.js");
require("./node_modules/meteor/rocketchat:slashcommands-archive/server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:slashcommands-archive'] = {};

})();

//# sourceMappingURL=rocketchat_slashcommands-archive.js.map

(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:slashcommands-leave":{"leave.js":function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/rocketchat_slashcommands-leave/leave.js                  //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
/*                                                                   // 2
* Leave is a named function that will replace /leave commands        //
* @param {Object} message - The message object                       //
*/function Leave(command, params, item) {                            //
	if (command !== 'leave' && command !== 'part') {                    // 7
		return;                                                            // 8
	}                                                                   // 9
                                                                     //
	try {                                                               // 10
		Meteor.call('leaveRoom', item.rid);                                // 11
	} catch (_ref) {                                                    // 12
		var error = _ref.error;                                            // 12
		RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {  // 13
			_id: Random.id(),                                                 // 14
			rid: item.rid,                                                    // 15
			ts: new Date(),                                                   // 16
			msg: TAPi18n.__(error, null, Meteor.user().language)              // 17
		});                                                                // 13
	}                                                                   // 19
}                                                                    // 20
                                                                     //
if (Meteor.isClient) {                                               // 21
	RocketChat.slashCommands.add('leave', undefined, {                  // 22
		description: 'Leave_the_current_channel'                           // 23
	});                                                                 // 22
	RocketChat.slashCommands.add('part', undefined, {                   // 25
		description: 'Leave_the_current_channel'                           // 26
	});                                                                 // 25
} else {                                                             // 28
	RocketChat.slashCommands.add('leave', Leave);                       // 29
	RocketChat.slashCommands.add('part', Leave);                        // 30
}                                                                    // 31
///////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:slashcommands-leave/leave.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:slashcommands-leave'] = {};

})();

//# sourceMappingURL=rocketchat_slashcommands-leave.js.map

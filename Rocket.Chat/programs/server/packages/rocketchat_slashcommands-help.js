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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:slashcommands-help":{"server.js":function(){

//////////////////////////////////////////////////////////////////////////////////
//                                                                              //
// packages/rocketchat_slashcommands-help/server.js                             //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////
                                                                                //
/*                                                                              // 2
* Help is a named function that will replace /join commands                     //
* @param {Object} message - The message object                                  //
*/RocketChat.slashCommands.add('help', function () {                            //
	function Help(command, params, item) {                                         // 8
		if (command !== 'help') {                                                     // 10
			return;                                                                      // 11
		}                                                                             // 12
                                                                                //
		var user = Meteor.users.findOne(Meteor.userId());                             // 13
		var keys = [{                                                                 // 14
			'Open_channel_user_search': 'Command (or Ctrl) + p OR Command (or Ctrl) + k'
		}, {                                                                          // 14
			'Edit_previous_message': 'Up Arrow'                                          // 18
		}, {                                                                          // 17
			'Move_beginning_message': 'Command (or Alt) + Left Arrow'                    // 21
		}, {                                                                          // 20
			'Move_beginning_message': 'Command (or Alt) + Up Arrow'                      // 24
		}, {                                                                          // 23
			'Move_end_message': 'Command (or Alt) + Right Arrow'                         // 27
		}, {                                                                          // 26
			'Move_end_message': 'Command (or Alt) + Down Arrow'                          // 30
		}, {                                                                          // 29
			'New_line_message_compose_input': 'Shift + Enter'                            // 33
		}];                                                                           // 32
		keys.map(function (key) {                                                     // 36
			RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {            // 37
				_id: Random.id(),                                                           // 38
				rid: item.rid,                                                              // 39
				ts: new Date(),                                                             // 40
				msg: TAPi18n.__(Object.keys(key)[0], {                                      // 41
					postProcess: 'sprintf',                                                    // 42
					sprintf: [key[Object.keys(key)[0]]]                                        // 43
				}, user.language)                                                           // 41
			});                                                                          // 37
		});                                                                           // 46
	}                                                                              // 48
                                                                                //
	return Help;                                                                   // 8
}());                                                                           // 8
//////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:slashcommands-help/server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:slashcommands-help'] = {};

})();

//# sourceMappingURL=rocketchat_slashcommands-help.js.map

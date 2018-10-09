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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:slashcommands-msg":{"server.js":function(){

////////////////////////////////////////////////////////////////////////////////////
//                                                                                //
// packages/rocketchat_slashcommands-msg/server.js                                //
//                                                                                //
////////////////////////////////////////////////////////////////////////////////////
                                                                                  //
/*                                                                                // 2
* Msg is a named function that will replace /msg commands                         //
*/function Msg(command, params, item) {                                           //
	if (command !== 'msg' || !Match.test(params, String)) {                          // 7
		return;                                                                         // 8
	}                                                                                // 9
                                                                                  //
	var trimmedParams = params.trim();                                               // 10
	var separator = trimmedParams.indexOf(' ');                                      // 11
	var user = Meteor.users.findOne(Meteor.userId());                                // 12
                                                                                  //
	if (separator === -1) {                                                          // 13
		return RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {        // 14
			_id: Random.id(),                                                              // 15
			rid: item.rid,                                                                 // 16
			ts: new Date(),                                                                // 17
			msg: TAPi18n.__('Username_and_message_must_not_be_empty', null, user.language)
		});                                                                             // 14
	}                                                                                // 20
                                                                                  //
	var message = trimmedParams.slice(separator + 1);                                // 21
	var targetUsernameOrig = trimmedParams.slice(0, separator);                      // 22
	var targetUsername = targetUsernameOrig.replace('@', '');                        // 23
	var targetUser = RocketChat.models.Users.findOneByUsername(targetUsername);      // 24
                                                                                  //
	if (targetUser == null) {                                                        // 25
		RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {               // 26
			_id: Random.id(),                                                              // 27
			rid: item.rid,                                                                 // 28
			ts: new Date(),                                                                // 29
			msg: TAPi18n.__('Username_doesnt_exist', {                                     // 30
				postProcess: 'sprintf',                                                       // 31
				sprintf: [targetUsernameOrig]                                                 // 32
			}, user.language)                                                              // 30
		});                                                                             // 26
		return;                                                                         // 35
	}                                                                                // 36
                                                                                  //
	var _Meteor$call = Meteor.call('createDirectMessage', targetUsername),           // 6
	    rid = _Meteor$call.rid;                                                      // 6
                                                                                  //
	var msgObject = {                                                                // 38
		_id: Random.id(),                                                               // 39
		rid: rid,                                                                       // 40
		msg: message                                                                    // 41
	};                                                                               // 38
	Meteor.call('sendMessage', msgObject);                                           // 43
}                                                                                 // 44
                                                                                  //
RocketChat.slashCommands.add('msg', Msg);                                         // 46
////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:slashcommands-msg/server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:slashcommands-msg'] = {};

})();

//# sourceMappingURL=rocketchat_slashcommands-msg.js.map

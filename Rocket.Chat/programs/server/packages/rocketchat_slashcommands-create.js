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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:slashcommands-create":{"server.js":function(){

//////////////////////////////////////////////////////////////////////////////
//                                                                          //
// packages/rocketchat_slashcommands-create/server.js                       //
//                                                                          //
//////////////////////////////////////////////////////////////////////////////
                                                                            //
function Create(command, params, item) {                                    // 1
	function getParams(str) {                                                  // 2
		var regex = /(--(\w+))+/g;                                                // 3
		var result = [];                                                          // 4
		var m = void 0;                                                           // 5
                                                                            //
		while ((m = regex.exec(str)) !== null) {                                  // 6
			if (m.index === regex.lastIndex) {                                       // 7
				regex.lastIndex++;                                                      // 8
			}                                                                        // 9
                                                                            //
			result.push(m[2]);                                                       // 10
		}                                                                         // 11
                                                                            //
		return result;                                                            // 12
	}                                                                          // 13
                                                                            //
	var regexp = new RegExp(RocketChat.settings.get('UTF8_Names_Validation'));
                                                                            //
	if (command !== 'create' || !Match.test(params, String)) {                 // 17
		return;                                                                   // 18
	}                                                                          // 19
                                                                            //
	var channel = regexp.exec(params.trim());                                  // 20
	channel = channel ? channel[0] : '';                                       // 21
                                                                            //
	if (channel === '') {                                                      // 22
		return;                                                                   // 23
	}                                                                          // 24
                                                                            //
	var user = Meteor.users.findOne(Meteor.userId());                          // 26
	var room = RocketChat.models.Rooms.findOneByName(channel);                 // 27
                                                                            //
	if (room != null) {                                                        // 28
		RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {         // 29
			_id: Random.id(),                                                        // 30
			rid: item.rid,                                                           // 31
			ts: new Date(),                                                          // 32
			msg: TAPi18n.__('Channel_already_exist', {                               // 33
				postProcess: 'sprintf',                                                 // 34
				sprintf: [channel]                                                      // 35
			}, user.language)                                                        // 33
		});                                                                       // 29
		return;                                                                   // 38
	}                                                                          // 39
                                                                            //
	if (getParams(params).indexOf('private') > -1) {                           // 41
		return Meteor.call('createPrivateGroup', channel, []);                    // 42
	}                                                                          // 43
                                                                            //
	Meteor.call('createChannel', channel, []);                                 // 45
}                                                                           // 46
                                                                            //
RocketChat.slashCommands.add('create', Create);                             // 48
//////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:slashcommands-create/server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:slashcommands-create'] = {};

})();

//# sourceMappingURL=rocketchat_slashcommands-create.js.map

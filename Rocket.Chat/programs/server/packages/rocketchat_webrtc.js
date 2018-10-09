(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RocketChatTabBar = Package['rocketchat:lib'].RocketChatTabBar;
var ECMAScript = Package.ecmascript.ECMAScript;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var meteorInstall = Package.modules.meteorInstall;
var process = Package.modules.process;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:webrtc":{"server":{"settings.js":function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/rocketchat_webrtc/server/settings.js                     //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
RocketChat.settings.addGroup('WebRTC', function () {                 // 1
	this.add('WebRTC_Enable_Channel', false, {                          // 2
		type: 'boolean',                                                   // 3
		group: 'WebRTC',                                                   // 4
		'public': true                                                     // 5
	});                                                                 // 2
	this.add('WebRTC_Enable_Private', true, {                           // 7
		type: 'boolean',                                                   // 8
		group: 'WebRTC',                                                   // 9
		'public': true                                                     // 10
	});                                                                 // 7
	this.add('WebRTC_Enable_Direct', true, {                            // 12
		type: 'boolean',                                                   // 13
		group: 'WebRTC',                                                   // 14
		'public': true                                                     // 15
	});                                                                 // 12
	return this.add('WebRTC_Servers', 'stun:stun.l.google.com:19302, stun:23.21.150.121, team%40rocket.chat:demo@turn:numb.viagenie.ca:3478', {
		type: 'string',                                                    // 18
		group: 'WebRTC',                                                   // 19
		'public': true                                                     // 20
	});                                                                 // 17
});                                                                  // 22
///////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:webrtc/server/settings.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:webrtc'] = {};

})();

//# sourceMappingURL=rocketchat_webrtc.js.map

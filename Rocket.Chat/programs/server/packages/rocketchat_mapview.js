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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:mapview":{"server":{"settings.js":function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/rocketchat_mapview/server/settings.js                    //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
Meteor.startup(function () {                                         // 1
	RocketChat.settings.add('MapView_Enabled', false, {                 // 2
		type: 'boolean',                                                   // 2
		group: 'Message',                                                  // 2
		section: 'Google Maps',                                            // 2
		"public": true,                                                    // 2
		i18nLabel: 'MapView_Enabled',                                      // 2
		i18nDescription: 'MapView_Enabled_Description'                     // 2
	});                                                                 // 2
	return RocketChat.settings.add('MapView_GMapsAPIKey', '', {         // 3
		type: 'string',                                                    // 3
		group: 'Message',                                                  // 3
		section: 'Google Maps',                                            // 3
		"public": true,                                                    // 3
		i18nLabel: 'MapView_GMapsAPIKey',                                  // 3
		i18nDescription: 'MapView_GMapsAPIKey_Description'                 // 3
	});                                                                 // 3
});                                                                  // 4
///////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:mapview/server/settings.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:mapview'] = {};

})();

//# sourceMappingURL=rocketchat_mapview.js.map

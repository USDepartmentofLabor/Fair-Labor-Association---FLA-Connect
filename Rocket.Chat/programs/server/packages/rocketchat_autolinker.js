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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:autolinker":{"server":{"settings.js":function(){

////////////////////////////////////////////////////////////////////////
//                                                                    //
// packages/rocketchat_autolinker/server/settings.js                  //
//                                                                    //
////////////////////////////////////////////////////////////////////////
                                                                      //
Meteor.startup(function () {                                          // 1
	RocketChat.settings.add('AutoLinker_StripPrefix', false, {           // 2
		type: 'boolean',                                                    // 2
		group: 'Message',                                                   // 2
		section: 'AutoLinker',                                              // 2
		"public": true,                                                     // 2
		i18nDescription: 'AutoLinker_StripPrefix_Description'               // 2
	});                                                                  // 2
	RocketChat.settings.add('AutoLinker_Urls_Scheme', true, {            // 3
		type: 'boolean',                                                    // 3
		group: 'Message',                                                   // 3
		section: 'AutoLinker',                                              // 3
		"public": true                                                      // 3
	});                                                                  // 3
	RocketChat.settings.add('AutoLinker_Urls_www', true, {               // 4
		type: 'boolean',                                                    // 4
		group: 'Message',                                                   // 4
		section: 'AutoLinker',                                              // 4
		"public": true                                                      // 4
	});                                                                  // 4
	RocketChat.settings.add('AutoLinker_Urls_TLD', true, {               // 5
		type: 'boolean',                                                    // 5
		group: 'Message',                                                   // 5
		section: 'AutoLinker',                                              // 5
		"public": true                                                      // 5
	});                                                                  // 5
	RocketChat.settings.add('AutoLinker_UrlsRegExp', '(://|www\\.).+', {
		type: 'string',                                                     // 6
		group: 'Message',                                                   // 6
		section: 'AutoLinker',                                              // 6
		"public": true                                                      // 6
	});                                                                  // 6
	RocketChat.settings.add('AutoLinker_Email', true, {                  // 7
		type: 'boolean',                                                    // 7
		group: 'Message',                                                   // 7
		section: 'AutoLinker',                                              // 7
		"public": true                                                      // 7
	});                                                                  // 7
	RocketChat.settings.add('AutoLinker_Phone', true, {                  // 8
		type: 'boolean',                                                    // 8
		group: 'Message',                                                   // 8
		section: 'AutoLinker',                                              // 8
		"public": true,                                                     // 8
		i18nDescription: 'AutoLinker_Phone_Description'                     // 8
	});                                                                  // 8
});                                                                   // 9
////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:autolinker/server/settings.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:autolinker'] = {};

})();

//# sourceMappingURL=rocketchat_autolinker.js.map

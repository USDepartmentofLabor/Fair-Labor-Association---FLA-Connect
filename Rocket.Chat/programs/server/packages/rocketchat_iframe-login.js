(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Logger = Package['rocketchat:logger'].Logger;
var SystemLogger = Package['rocketchat:logger'].SystemLogger;
var LoggerManager = Package['rocketchat:logger'].LoggerManager;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RocketChatTabBar = Package['rocketchat:lib'].RocketChatTabBar;
var Accounts = Package['accounts-base'].Accounts;
var _ = Package.underscore._;
var ECMAScript = Package.ecmascript.ECMAScript;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var check = Package.check.check;
var Match = Package.check.Match;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var meteorInstall = Package.modules.meteorInstall;
var process = Package.modules.process;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:iframe-login":{"iframe_rocketchat.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////
//                                                                                       //
// packages/rocketchat_iframe-login/iframe_rocketchat.js                                 //
//                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////
                                                                                         //
Meteor.startup(function () {                                                             // 1
	RocketChat.settings.addGroup('Accounts', function () {                                  // 2
		this.section('Iframe', function () {                                                   // 3
			this.add('Accounts_iframe_enabled', false, {                                          // 4
				type: 'boolean',                                                                     // 4
				"public": true                                                                       // 4
			});                                                                                   // 4
			this.add('Accounts_iframe_url', '', {                                                 // 5
				type: 'string',                                                                      // 5
				"public": true                                                                       // 5
			});                                                                                   // 5
			this.add('Accounts_Iframe_api_url', '', {                                             // 6
				type: 'string',                                                                      // 6
				"public": true                                                                       // 6
			});                                                                                   // 6
			this.add('Accounts_Iframe_api_method', 'POST', {                                      // 7
				type: 'string',                                                                      // 7
				"public": true                                                                       // 7
			});                                                                                   // 7
		});                                                                                    // 8
	});                                                                                     // 9
});                                                                                      // 10
///////////////////////////////////////////////////////////////////////////////////////////

},"iframe_server.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////
//                                                                                       //
// packages/rocketchat_iframe-login/iframe_server.js                                     //
//                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////
                                                                                         //
/* globals Accounts, OAuth */Accounts.registerLoginHandler('iframe', function (result) {
	if (!result.iframe) {                                                                   // 4
		return;                                                                                // 5
	}                                                                                       // 6
                                                                                         //
	console.log('[Method] registerLoginHandler');                                           // 8
	var user = Meteor.users.findOne({                                                       // 10
		'services.iframe.token': result.token                                                  // 11
	});                                                                                     // 10
                                                                                         //
	if (user) {                                                                             // 14
		return {                                                                               // 15
			userId: user._id                                                                      // 16
		};                                                                                     // 15
	}                                                                                       // 18
});                                                                                      // 19
Meteor.methods({                                                                         // 22
	'OAuth.retrieveCredential': function (credentialToken, credentialSecret) {              // 23
		return OAuth.retrieveCredential(credentialToken, credentialSecret);                    // 24
	}                                                                                       // 25
});                                                                                      // 22
///////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:iframe-login/iframe_rocketchat.js");
require("./node_modules/meteor/rocketchat:iframe-login/iframe_server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:iframe-login'] = {};

})();

//# sourceMappingURL=rocketchat_iframe-login.js.map

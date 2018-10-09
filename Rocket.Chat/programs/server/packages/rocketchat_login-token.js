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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:login-token":{"server":{"login_token_server.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/rocketchat_login-token/server/login_token_server.js                        //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
/* globals Accounts */Accounts.registerLoginHandler('login-token', function (result) {
	if (!result.loginToken) {                                                             // 4
		return;                                                                              // 5
	}                                                                                     // 6
                                                                                       //
	var user = Meteor.users.findOne({                                                     // 8
		'services.loginToken.token': result.loginToken                                       // 9
	});                                                                                   // 8
                                                                                       //
	if (user) {                                                                           // 12
		Meteor.users.update({                                                                // 13
			_id: user._id                                                                       // 13
		}, {                                                                                 // 13
			$unset: {                                                                           // 13
				'services.loginToken': 1                                                           // 13
			}                                                                                   // 13
		});                                                                                  // 13
		return {                                                                             // 15
			userId: user._id                                                                    // 16
		};                                                                                   // 15
	}                                                                                     // 18
});                                                                                    // 19
/////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:login-token/server/login_token_server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:login-token'] = {};

})();

//# sourceMappingURL=rocketchat_login-token.js.map

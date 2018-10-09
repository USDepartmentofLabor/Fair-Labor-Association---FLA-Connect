(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RocketChatTabBar = Package['rocketchat:lib'].RocketChatTabBar;
var CustomOAuth = Package['rocketchat:custom-oauth'].CustomOAuth;
var meteorInstall = Package.modules.meteorInstall;
var process = Package.modules.process;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:drupal":{"common.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_drupal/common.js                                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* global CustomOAuth */ // Drupal Server CallBack URL needs to be http(s)://{rocketchat.server}[:port]/_oauth/drupal
// In RocketChat -> Administration the URL needs to be http(s)://{drupal.server}/                                     // 4
var config = {                                                                                                        // 6
	serverURL: '',                                                                                                       // 7
	identityPath: '/oauth2/UserInfo',                                                                                    // 8
	authorizePath: '/oauth2/authorize',                                                                                  // 9
	tokenPath: '/oauth2/token',                                                                                          // 10
	scope: 'openid email profile offline_access',                                                                        // 11
	tokenSentVia: 'payload',                                                                                             // 12
	usernameField: 'preferred_username',                                                                                 // 13
	mergeUsers: true,                                                                                                    // 14
	addAutopublishFields: {                                                                                              // 15
		forLoggedInUser: ['services.drupal'],                                                                               // 16
		forOtherUsers: ['services.drupal.name']                                                                             // 17
	}                                                                                                                    // 15
};                                                                                                                    // 6
var Drupal = new CustomOAuth('drupal', config);                                                                       // 21
                                                                                                                      //
if (Meteor.isServer) {                                                                                                // 23
	Meteor.startup(function () {                                                                                         // 24
		RocketChat.settings.get('API_Drupal_URL', function (key, value) {                                                   // 25
			config.serverURL = value;                                                                                          // 26
			Drupal.configure(config);                                                                                          // 27
		});                                                                                                                 // 28
	});                                                                                                                  // 29
} else {                                                                                                              // 30
	Meteor.startup(function () {                                                                                         // 31
		Tracker.autorun(function () {                                                                                       // 32
			if (RocketChat.settings.get('API_Drupal_URL')) {                                                                   // 33
				config.serverURL = RocketChat.settings.get('API_Drupal_URL');                                                     // 34
				Drupal.configure(config);                                                                                         // 35
			}                                                                                                                  // 36
		});                                                                                                                 // 37
	});                                                                                                                  // 38
}                                                                                                                     // 39
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"startup.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_drupal/startup.js                                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
RocketChat.settings.addGroup('OAuth', function () {                                                                   // 1
	this.section('Drupal', function () {                                                                                 // 2
		var enableQuery = {                                                                                                 // 3
			_id: 'Accounts_OAuth_Drupal',                                                                                      // 4
			value: true                                                                                                        // 5
		};                                                                                                                  // 3
		this.add('Accounts_OAuth_Drupal', false, {                                                                          // 8
			type: 'boolean'                                                                                                    // 8
		});                                                                                                                 // 8
		this.add('API_Drupal_URL', '', {                                                                                    // 9
			type: 'string',                                                                                                    // 9
			"public": true,                                                                                                    // 9
			enableQuery: enableQuery,                                                                                          // 9
			i18nDescription: 'API_Drupal_URL_Description'                                                                      // 9
		});                                                                                                                 // 9
		this.add('Accounts_OAuth_Drupal_id', '', {                                                                          // 10
			type: 'string',                                                                                                    // 10
			enableQuery: enableQuery                                                                                           // 10
		});                                                                                                                 // 10
		this.add('Accounts_OAuth_Drupal_secret', '', {                                                                      // 11
			type: 'string',                                                                                                    // 11
			enableQuery: enableQuery                                                                                           // 11
		});                                                                                                                 // 11
		this.add('Accounts_OAuth_Drupal_callback_url', '_oauth/drupal', {                                                   // 12
			type: 'relativeUrl',                                                                                               // 12
			readonly: true,                                                                                                    // 12
			force: true,                                                                                                       // 12
			enableQuery: enableQuery                                                                                           // 12
		});                                                                                                                 // 12
	});                                                                                                                  // 13
});                                                                                                                   // 14
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:drupal/common.js");
require("./node_modules/meteor/rocketchat:drupal/startup.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:drupal'] = {};

})();

//# sourceMappingURL=rocketchat_drupal.js.map

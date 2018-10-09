(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:wordpress":{"common.js":function(){

///////////////////////////////////////////////////////////////////////////////////
//                                                                               //
// packages/rocketchat_wordpress/common.js                                       //
//                                                                               //
///////////////////////////////////////////////////////////////////////////////////
                                                                                 //
/* globals CustomOAuth */var config = {                                          // 1
	serverURL: '',                                                                  // 4
	identityPath: '/oauth/me',                                                      // 5
	addAutopublishFields: {                                                         // 6
		forLoggedInUser: ['services.wordpress'],                                       // 7
		forOtherUsers: ['services.wordpress.user_login']                               // 8
	}                                                                               // 6
};                                                                               // 3
var WordPress = new CustomOAuth('wordpress', config);                            // 12
                                                                                 //
if (Meteor.isServer) {                                                           // 14
	Meteor.startup(function () {                                                    // 15
		return RocketChat.settings.get('API_Wordpress_URL', function (key, value) {    // 16
			config.serverURL = value;                                                     // 17
			return WordPress.configure(config);                                           // 18
		});                                                                            // 19
	});                                                                             // 20
} else {                                                                         // 21
	Meteor.startup(function () {                                                    // 22
		return Tracker.autorun(function () {                                           // 23
			if (RocketChat.settings.get('API_Wordpress_URL')) {                           // 24
				config.serverURL = RocketChat.settings.get('API_Wordpress_URL');             // 25
				return WordPress.configure(config);                                          // 26
			}                                                                             // 27
		});                                                                            // 28
	});                                                                             // 29
}                                                                                // 30
///////////////////////////////////////////////////////////////////////////////////

},"startup.js":function(){

///////////////////////////////////////////////////////////////////////////////////
//                                                                               //
// packages/rocketchat_wordpress/startup.js                                      //
//                                                                               //
///////////////////////////////////////////////////////////////////////////////////
                                                                                 //
RocketChat.settings.addGroup('OAuth', function () {                              // 1
	return this.section('WordPress', function () {                                  // 2
		var enableQuery = {                                                            // 4
			_id: 'Accounts_OAuth_Wordpress',                                              // 5
			value: true                                                                   // 6
		};                                                                             // 4
		this.add('Accounts_OAuth_Wordpress', false, {                                  // 8
			type: 'boolean',                                                              // 9
			'public': true                                                                // 10
		});                                                                            // 8
		this.add('API_Wordpress_URL', '', {                                            // 12
			type: 'string',                                                               // 13
			enableQuery: enableQuery,                                                     // 14
			'public': true                                                                // 15
		});                                                                            // 12
		this.add('Accounts_OAuth_Wordpress_id', '', {                                  // 17
			type: 'string',                                                               // 18
			enableQuery: enableQuery                                                      // 19
		});                                                                            // 17
		this.add('Accounts_OAuth_Wordpress_secret', '', {                              // 21
			type: 'string',                                                               // 22
			enableQuery: enableQuery                                                      // 23
		});                                                                            // 21
		return this.add('Accounts_OAuth_Wordpress_callback_url', '_oauth/wordpress', {
			type: 'relativeUrl',                                                          // 26
			readonly: true,                                                               // 27
			force: true,                                                                  // 28
			enableQuery: enableQuery                                                      // 29
		});                                                                            // 25
	});                                                                             // 31
});                                                                              // 32
///////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:wordpress/common.js");
require("./node_modules/meteor/rocketchat:wordpress/startup.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:wordpress'] = {};

})();

//# sourceMappingURL=rocketchat_wordpress.js.map

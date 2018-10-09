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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:gitlab":{"common.js":function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/rocketchat_gitlab/common.js                              //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
/* global CustomOAuth */var config = {                               // 1
	serverURL: 'https://gitlab.com',                                    // 3
	identityPath: '/api/v3/user',                                       // 4
	scope: 'api',                                                       // 5
	addAutopublishFields: {                                             // 6
		forLoggedInUser: ['services.gitlab'],                              // 7
		forOtherUsers: ['services.gitlab.username']                        // 8
	}                                                                   // 6
};                                                                   // 2
var Gitlab = new CustomOAuth('gitlab', config);                      // 12
                                                                     //
if (Meteor.isServer) {                                               // 14
	Meteor.startup(function () {                                        // 15
		RocketChat.settings.get('API_Gitlab_URL', function (key, value) {  // 16
			config.serverURL = value;                                         // 17
			Gitlab.configure(config);                                         // 18
		});                                                                // 19
	});                                                                 // 20
} else {                                                             // 21
	Meteor.startup(function () {                                        // 22
		Tracker.autorun(function () {                                      // 23
			if (RocketChat.settings.get('API_Gitlab_URL')) {                  // 24
				config.serverURL = RocketChat.settings.get('API_Gitlab_URL');    // 25
				Gitlab.configure(config);                                        // 26
			}                                                                 // 27
		});                                                                // 28
	});                                                                 // 29
}                                                                    // 30
///////////////////////////////////////////////////////////////////////

},"startup.js":function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/rocketchat_gitlab/startup.js                             //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
RocketChat.settings.addGroup('OAuth', function () {                  // 1
	this.section('GitLab', function () {                                // 2
		var enableQuery = {                                                // 3
			_id: 'Accounts_OAuth_Gitlab',                                     // 4
			value: true                                                       // 5
		};                                                                 // 3
		this.add('Accounts_OAuth_Gitlab', false, {                         // 8
			type: 'boolean',                                                  // 8
			"public": true                                                    // 8
		});                                                                // 8
		this.add('API_Gitlab_URL', '', {                                   // 9
			type: 'string',                                                   // 9
			enableQuery: enableQuery,                                         // 9
			"public": true                                                    // 9
		});                                                                // 9
		this.add('Accounts_OAuth_Gitlab_id', '', {                         // 10
			type: 'string',                                                   // 10
			enableQuery: enableQuery                                          // 10
		});                                                                // 10
		this.add('Accounts_OAuth_Gitlab_secret', '', {                     // 11
			type: 'string',                                                   // 11
			enableQuery: enableQuery                                          // 11
		});                                                                // 11
		this.add('Accounts_OAuth_Gitlab_callback_url', '_oauth/gitlab', {  // 12
			type: 'relativeUrl',                                              // 12
			readonly: true,                                                   // 12
			force: true,                                                      // 12
			enableQuery: enableQuery                                          // 12
		});                                                                // 12
	});                                                                 // 13
});                                                                  // 14
///////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:gitlab/common.js");
require("./node_modules/meteor/rocketchat:gitlab/startup.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:gitlab'] = {};

})();

//# sourceMappingURL=rocketchat_gitlab.js.map

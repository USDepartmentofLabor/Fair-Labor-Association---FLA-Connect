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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:github-enterprise":{"common.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                           //
// packages/rocketchat_github-enterprise/common.js                                           //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////
                                                                                             //
/* global CustomOAuth */ // GitHub Enterprise Server CallBack URL needs to be http(s)://{rocketchat.server}[:port]/_oauth/github_enterprise
// In RocketChat -> Administration the URL needs to be http(s)://{github.enterprise.server}/
var config = {                                                                               // 6
	serverURL: '',                                                                              // 7
	identityPath: '/api/v3/user',                                                               // 8
	authorizePath: '/login/oauth/authorize',                                                    // 9
	tokenPath: '/login/oauth/access_token',                                                     // 10
	addAutopublishFields: {                                                                     // 11
		forLoggedInUser: ['services.github-enterprise'],                                           // 12
		forOtherUsers: ['services.github-enterprise.username']                                     // 13
	}                                                                                           // 11
};                                                                                           // 6
var GitHubEnterprise = new CustomOAuth('github_enterprise', config);                         // 17
                                                                                             //
if (Meteor.isServer) {                                                                       // 19
	Meteor.startup(function () {                                                                // 20
		RocketChat.settings.get('API_GitHub_Enterprise_URL', function (key, value) {               // 21
			config.serverURL = value;                                                                 // 22
			GitHubEnterprise.configure(config);                                                       // 23
		});                                                                                        // 24
	});                                                                                         // 25
} else {                                                                                     // 26
	Meteor.startup(function () {                                                                // 27
		Tracker.autorun(function () {                                                              // 28
			if (RocketChat.settings.get('API_GitHub_Enterprise_URL')) {                               // 29
				config.serverURL = RocketChat.settings.get('API_GitHub_Enterprise_URL');                 // 30
				GitHubEnterprise.configure(config);                                                      // 31
			}                                                                                         // 32
		});                                                                                        // 33
	});                                                                                         // 34
}                                                                                            // 35
///////////////////////////////////////////////////////////////////////////////////////////////

},"startup.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                           //
// packages/rocketchat_github-enterprise/startup.js                                          //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////
                                                                                             //
RocketChat.settings.addGroup('OAuth', function () {                                          // 1
	this.section('GitHub Enterprise', function () {                                             // 2
		var enableQuery = {                                                                        // 3
			_id: 'Accounts_OAuth_GitHub_Enterprise',                                                  // 4
			value: true                                                                               // 5
		};                                                                                         // 3
		this.add('Accounts_OAuth_GitHub_Enterprise', false, {                                      // 8
			type: 'boolean'                                                                           // 8
		});                                                                                        // 8
		this.add('API_GitHub_Enterprise_URL', '', {                                                // 9
			type: 'string',                                                                           // 9
			"public": true,                                                                           // 9
			enableQuery: enableQuery,                                                                 // 9
			i18nDescription: 'API_GitHub_Enterprise_URL_Description'                                  // 9
		});                                                                                        // 9
		this.add('Accounts_OAuth_GitHub_Enterprise_id', '', {                                      // 10
			type: 'string',                                                                           // 10
			enableQuery: enableQuery                                                                  // 10
		});                                                                                        // 10
		this.add('Accounts_OAuth_GitHub_Enterprise_secret', '', {                                  // 11
			type: 'string',                                                                           // 11
			enableQuery: enableQuery                                                                  // 11
		});                                                                                        // 11
		this.add('Accounts_OAuth_GitHub_Enterprise_callback_url', '_oauth/github_enterprise', {    // 12
			type: 'relativeUrl',                                                                      // 12
			readonly: true,                                                                           // 12
			force: true,                                                                              // 12
			enableQuery: enableQuery                                                                  // 12
		});                                                                                        // 12
	});                                                                                         // 13
});                                                                                          // 14
///////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:github-enterprise/common.js");
require("./node_modules/meteor/rocketchat:github-enterprise/startup.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:github-enterprise'] = {};

})();

//# sourceMappingURL=rocketchat_github-enterprise.js.map

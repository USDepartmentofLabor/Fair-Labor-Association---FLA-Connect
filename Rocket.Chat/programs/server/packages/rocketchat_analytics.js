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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:analytics":{"server":{"settings.js":function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/rocketchat_analytics/server/settings.js                  //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
RocketChat.settings.addGroup('Analytics', function () {              // 1
	function addSettings() {                                            // 1
		this.section('Piwik', function () {                                // 2
			var enableQuery = {                                               // 3
				_id: 'PiwikAnalytics_enabled',                                   // 3
				value: true                                                      // 3
			};                                                                // 3
			this.add('PiwikAnalytics_enabled', false, {                       // 4
				type: 'boolean',                                                 // 5
				"public": true,                                                  // 6
				i18nLabel: 'Enable'                                              // 7
			});                                                               // 4
			this.add('PiwikAnalytics_url', '', {                              // 9
				type: 'string',                                                  // 10
				"public": true,                                                  // 11
				i18nLabel: 'URL',                                                // 12
				enableQuery: enableQuery                                         // 13
			});                                                               // 9
			this.add('PiwikAnalytics_siteId', '', {                           // 15
				type: 'string',                                                  // 16
				"public": true,                                                  // 17
				i18nLabel: 'Client_ID',                                          // 18
				enableQuery: enableQuery                                         // 19
			});                                                               // 15
			this.add('PiwikAdditionalTrackers', '', {                         // 21
				type: 'string',                                                  // 22
				multiline: true,                                                 // 23
				"public": true,                                                  // 24
				i18nLabel: 'PiwikAdditionalTrackers',                            // 25
				enableQuery: enableQuery                                         // 26
			});                                                               // 21
			this.add('PiwikAnalytics_prependDomain', false, {                 // 28
				type: 'boolean',                                                 // 29
				"public": true,                                                  // 30
				i18nLabel: 'PiwikAnalytics_prependDomain',                       // 31
				enableQuery: enableQuery                                         // 32
			});                                                               // 28
			this.add('PiwikAnalytics_cookieDomain', false, {                  // 34
				type: 'boolean',                                                 // 35
				"public": true,                                                  // 36
				i18nLabel: 'PiwikAnalytics_cookieDomain',                        // 37
				enableQuery: enableQuery                                         // 38
			});                                                               // 34
			this.add('PiwikAnalytics_domains', '', {                          // 40
				type: 'string',                                                  // 41
				multiline: true,                                                 // 42
				"public": true,                                                  // 43
				i18nLabel: 'PiwikAnalytics_domains',                             // 44
				enableQuery: enableQuery                                         // 45
			});                                                               // 40
		});                                                                // 47
		this.section('Analytics_Google', function () {                     // 49
			var enableQuery = {                                               // 50
				_id: 'GoogleAnalytics_enabled',                                  // 50
				value: true                                                      // 50
			};                                                                // 50
			this.add('GoogleAnalytics_enabled', false, {                      // 51
				type: 'boolean',                                                 // 52
				"public": true,                                                  // 53
				i18nLabel: 'Enable'                                              // 54
			});                                                               // 51
			this.add('GoogleAnalytics_ID', '', {                              // 57
				type: 'string',                                                  // 58
				"public": true,                                                  // 59
				i18nLabel: 'Analytics_Google_id',                                // 60
				enableQuery: enableQuery                                         // 61
			});                                                               // 57
		});                                                                // 63
		this.section('Analytics_features_enabled', function () {           // 65
			function addFeaturesEnabledSettings() {                           // 65
				this.add('Analytics_features_messages', true, {                  // 66
					type: 'boolean',                                                // 67
					"public": true,                                                 // 68
					i18nLabel: 'Messages',                                          // 69
					i18nDescription: 'Analytics_features_messages_Description'      // 70
				});                                                              // 66
				this.add('Analytics_features_rooms', true, {                     // 72
					type: 'boolean',                                                // 73
					"public": true,                                                 // 74
					i18nLabel: 'Rooms',                                             // 75
					i18nDescription: 'Analytics_features_rooms_Description'         // 76
				});                                                              // 72
				this.add('Analytics_features_users', true, {                     // 78
					type: 'boolean',                                                // 79
					"public": true,                                                 // 80
					i18nLabel: 'Users',                                             // 81
					i18nDescription: 'Analytics_features_users_Description'         // 82
				});                                                              // 78
			}                                                                 // 84
                                                                     //
			return addFeaturesEnabledSettings;                                // 65
		}());                                                              // 65
	}                                                                   // 85
                                                                     //
	return addSettings;                                                 // 1
}());                                                                // 1
///////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:analytics/server/settings.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:analytics'] = {};

})();

//# sourceMappingURL=rocketchat_analytics.js.map

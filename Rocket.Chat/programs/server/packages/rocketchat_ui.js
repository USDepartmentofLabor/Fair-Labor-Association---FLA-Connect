(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Accounts = Package['accounts-base'].Accounts;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RocketChatTabBar = Package['rocketchat:lib'].RocketChatTabBar;
var Push = Package['raix:push'].Push;
var meteorInstall = Package.modules.meteorInstall;
var process = Package.modules.process;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

/* Package-scope variables */
var fileUpload;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:ui":{"getAvatarUrlFromUsername.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/rocketchat_ui/getAvatarUrlFromUsername.js                                               //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
// TODO: remove global                                                                              // 1
this.getAvatarUrlFromUsername = function (username) {                                               // 2
	var key = "avatar_random_" + username;                                                             // 3
	var random = typeof Session !== 'undefined' ? Session.keys[key] : 0;                               // 4
                                                                                                    //
	if (username == null) {                                                                            // 5
		return;                                                                                           // 6
	}                                                                                                  // 7
                                                                                                    //
	var cdnPrefix = (RocketChat.settings.get('CDN_PREFIX') || '').trim().replace(/\/$/, '');           // 8
	var pathPrefix = (__meteor_runtime_config__.ROOT_URL_PATH_PREFIX || '').trim().replace(/\/$/, '');
	var path = pathPrefix;                                                                             // 10
                                                                                                    //
	if (cdnPrefix) {                                                                                   // 11
		path = cdnPrefix + pathPrefix;                                                                    // 12
	} else if (Meteor.isCordova) {                                                                     // 13
		path = Meteor.absoluteUrl().replace(/\/$/, '');                                                   // 14
	}                                                                                                  // 15
                                                                                                    //
	return path + "/avatar/" + encodeURIComponent(username) + "?_dc=" + random;                        // 16
};                                                                                                  // 17
//////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:ui/getAvatarUrlFromUsername.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['rocketchat:ui'] = {}, {
  fileUpload: fileUpload
});

})();

//# sourceMappingURL=rocketchat_ui.js.map

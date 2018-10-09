(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:ui-admin":{"publications":{"adminRooms.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////
//                                                                                       //
// packages/rocketchat_ui-admin/publications/adminRooms.js                               //
//                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////
                                                                                         //
Meteor.publish('adminRooms', function (filter, types, limit) {                           // 1
	if (!this.userId) {                                                                     // 2
		return this.ready();                                                                   // 3
	}                                                                                       // 4
                                                                                         //
	if (RocketChat.authz.hasPermission(this.userId, 'view-room-administration') !== true) {
		return this.ready();                                                                   // 6
	}                                                                                       // 7
                                                                                         //
	if (!_.isArray(types)) {                                                                // 8
		types = [];                                                                            // 9
	}                                                                                       // 10
                                                                                         //
	var options = {                                                                         // 12
		fields: {                                                                              // 13
			name: 1,                                                                              // 14
			t: 1,                                                                                 // 15
			cl: 1,                                                                                // 16
			u: 1,                                                                                 // 17
			usernames: 1,                                                                         // 18
			muted: 1,                                                                             // 19
			ro: 1,                                                                                // 20
			"default": 1,                                                                         // 21
			topic: 1,                                                                             // 22
			msgs: 1,                                                                              // 23
			archived: 1                                                                           // 24
		},                                                                                     // 13
		limit: limit,                                                                          // 26
		sort: {                                                                                // 27
			"default": -1,                                                                        // 28
			name: 1                                                                               // 29
		}                                                                                      // 27
	};                                                                                      // 12
	filter = _.trim(filter);                                                                // 33
                                                                                         //
	if (filter && types.length) {                                                           // 34
		// CACHE: can we stop using publications here?                                         // 35
		return RocketChat.models.Rooms.findByNameContainingAndTypes(filter, types, options);   // 36
	} else if (types.length) {                                                              // 37
		// CACHE: can we stop using publications here?                                         // 38
		return RocketChat.models.Rooms.findByTypes(types, options);                            // 39
	} else {                                                                                // 40
		// CACHE: can we stop using publications here?                                         // 41
		return RocketChat.models.Rooms.findByNameContaining(filter, options);                  // 42
	}                                                                                       // 43
});                                                                                      // 44
///////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:ui-admin/publications/adminRooms.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:ui-admin'] = {};

})();

//# sourceMappingURL=rocketchat_ui-admin.js.map

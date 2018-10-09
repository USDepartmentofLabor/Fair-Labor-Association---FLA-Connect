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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:mentions-flextab":{"server":{"publications":{"mentionedMessages.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                 //
// packages/rocketchat_mentions-flextab/server/publications/mentionedMessages.js                   //
//                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                   //
Meteor.publish('mentionedMessages', function (rid) {                                               // 1
	var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;               // 1
                                                                                                   //
	if (!this.userId) {                                                                               // 2
		return this.ready();                                                                             // 3
	}                                                                                                 // 4
                                                                                                   //
	var publication = this;                                                                           // 5
	var user = RocketChat.models.Users.findOneById(this.userId);                                      // 6
                                                                                                   //
	if (!user) {                                                                                      // 7
		return this.ready();                                                                             // 8
	}                                                                                                 // 9
                                                                                                   //
	var cursorHandle = RocketChat.models.Messages.findVisibleByMentionAndRoomId(user.username, rid, {
		sort: {                                                                                          // 11
			ts: -1                                                                                          // 12
		},                                                                                               // 11
		limit: limit                                                                                     // 14
	}).observeChanges({                                                                               // 10
		added: function (_id, record) {                                                                  // 16
			record.mentionedList = true;                                                                    // 17
			return publication.added('rocketchat_mentioned_message', _id, record);                          // 18
		},                                                                                               // 19
		changed: function (_id, record) {                                                                // 20
			record.mentionedList = true;                                                                    // 21
			return publication.changed('rocketchat_mentioned_message', _id, record);                        // 22
		},                                                                                               // 23
		removed: function (_id) {                                                                        // 24
			return publication.removed('rocketchat_mentioned_message', _id);                                // 25
		}                                                                                                // 26
	});                                                                                               // 15
	this.ready();                                                                                     // 28
	return this.onStop(function () {                                                                  // 29
		return cursorHandle.stop();                                                                      // 30
	});                                                                                               // 31
});                                                                                                // 32
/////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:mentions-flextab/server/publications/mentionedMessages.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:mentions-flextab'] = {};

})();

//# sourceMappingURL=rocketchat_mentions-flextab.js.map

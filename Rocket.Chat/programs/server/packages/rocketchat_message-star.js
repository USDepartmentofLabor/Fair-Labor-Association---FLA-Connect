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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:message-star":{"server":{"settings.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/rocketchat_message-star/server/settings.js                                                 //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
Meteor.startup(function () {                                                                           // 1
	return RocketChat.settings.add('Message_AllowStarring', true, {                                       // 2
		type: 'boolean',                                                                                     // 3
		group: 'Message',                                                                                    // 4
		'public': true                                                                                       // 5
	});                                                                                                   // 2
});                                                                                                    // 7
/////////////////////////////////////////////////////////////////////////////////////////////////////////

},"starMessage.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/rocketchat_message-star/server/starMessage.js                                              //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
Meteor.methods({                                                                                       // 1
	starMessage: function (message) {                                                                     // 2
		if (!Meteor.userId()) {                                                                              // 3
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                      // 4
				method: 'starMessage'                                                                              // 5
			});                                                                                                 // 4
		}                                                                                                    // 7
                                                                                                       //
		if (!RocketChat.settings.get('Message_AllowStarring')) {                                             // 8
			throw new Meteor.Error('error-action-not-allowed', 'Message starring not allowed', {                // 9
				method: 'pinMessage',                                                                              // 10
				action: 'Message_starring'                                                                         // 11
			});                                                                                                 // 9
		}                                                                                                    // 13
                                                                                                       //
		var room = RocketChat.models.Rooms.findOneById(message.rid);                                         // 14
                                                                                                       //
		if (Array.isArray(room.usernames) && room.usernames.indexOf(Meteor.user().username) === -1) {        // 15
			return false;                                                                                       // 16
		}                                                                                                    // 17
                                                                                                       //
		return RocketChat.models.Messages.updateUserStarById(message._id, Meteor.userId(), message.starred);
	}                                                                                                     // 19
});                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////

},"publications":{"starredMessages.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/rocketchat_message-star/server/publications/starredMessages.js                             //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
Meteor.publish('starredMessages', function (rid) {                                                     // 1
	var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;                   // 1
                                                                                                       //
	if (!this.userId) {                                                                                   // 2
		return this.ready();                                                                                 // 3
	}                                                                                                     // 4
                                                                                                       //
	var publication = this;                                                                               // 5
	var user = RocketChat.models.Users.findOneById(this.userId);                                          // 6
                                                                                                       //
	if (!user) {                                                                                          // 7
		return this.ready();                                                                                 // 8
	}                                                                                                     // 9
                                                                                                       //
	var cursorHandle = RocketChat.models.Messages.findStarredByUserAtRoom(this.userId, rid, {             // 10
		sort: {                                                                                              // 11
			ts: -1                                                                                              // 12
		},                                                                                                   // 11
		limit: limit                                                                                         // 14
	}).observeChanges({                                                                                   // 10
		added: function (_id, record) {                                                                      // 16
			return publication.added('rocketchat_starred_message', _id, record);                                // 17
		},                                                                                                   // 18
		changed: function (_id, record) {                                                                    // 19
			return publication.changed('rocketchat_starred_message', _id, record);                              // 20
		},                                                                                                   // 21
		removed: function (_id) {                                                                            // 22
			return publication.removed('rocketchat_starred_message', _id);                                      // 23
		}                                                                                                    // 24
	});                                                                                                   // 15
	this.ready();                                                                                         // 26
	return this.onStop(function () {                                                                      // 27
		return cursorHandle.stop();                                                                          // 28
	});                                                                                                   // 29
});                                                                                                    // 30
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"startup":{"indexes.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/rocketchat_message-star/server/startup/indexes.js                                          //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
Meteor.startup(function () {                                                                           // 1
	return Meteor.defer(function () {                                                                     // 2
		return RocketChat.models.Messages.tryEnsureIndex({                                                   // 3
			'starred._id': 1                                                                                    // 4
		}, {                                                                                                 // 3
			sparse: 1                                                                                           // 6
		});                                                                                                  // 5
	});                                                                                                   // 8
});                                                                                                    // 9
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:message-star/server/settings.js");
require("./node_modules/meteor/rocketchat:message-star/server/starMessage.js");
require("./node_modules/meteor/rocketchat:message-star/server/publications/starredMessages.js");
require("./node_modules/meteor/rocketchat:message-star/server/startup/indexes.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:message-star'] = {};

})();

//# sourceMappingURL=rocketchat_message-star.js.map

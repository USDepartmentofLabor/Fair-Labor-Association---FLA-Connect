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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:message-pin":{"server":{"settings.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                              //
// packages/rocketchat_message-pin/server/settings.js                                           //
//                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                //
Meteor.startup(function () {                                                                    // 1
	RocketChat.settings.add('Message_AllowPinning', true, {                                        // 2
		type: 'boolean',                                                                              // 3
		group: 'Message',                                                                             // 4
		'public': true                                                                                // 5
	});                                                                                            // 2
	return RocketChat.models.Permissions.upsert('pin-message', {                                   // 7
		$setOnInsert: {                                                                               // 8
			roles: ['owner', 'moderator', 'admin']                                                       // 9
		}                                                                                             // 8
	});                                                                                            // 7
});                                                                                             // 12
//////////////////////////////////////////////////////////////////////////////////////////////////

},"pinMessage.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                              //
// packages/rocketchat_message-pin/server/pinMessage.js                                         //
//                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                //
Meteor.methods({                                                                                // 1
	pinMessage: function (message, pinnedAt) {                                                     // 2
		if (!Meteor.userId()) {                                                                       // 3
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                               // 4
				method: 'pinMessage'                                                                        // 5
			});                                                                                          // 4
		}                                                                                             // 7
                                                                                                //
		if (!RocketChat.settings.get('Message_AllowPinning')) {                                       // 8
			throw new Meteor.Error('error-action-not-allowed', 'Message pinning not allowed', {          // 9
				method: 'pinMessage',                                                                       // 10
				action: 'Message_pinning'                                                                   // 11
			});                                                                                          // 9
		}                                                                                             // 13
                                                                                                //
		var room = RocketChat.models.Rooms.findOneById(message.rid);                                  // 14
                                                                                                //
		if (Array.isArray(room.usernames) && room.usernames.indexOf(Meteor.user().username) === -1) {
			return false;                                                                                // 16
		}                                                                                             // 17
                                                                                                //
		var originalMessage = RocketChat.models.Messages.findOneById(message._id);                    // 18
                                                                                                //
		if (originalMessage == null || originalMessage._id == null) {                                 // 19
			throw new Meteor.Error('error-invalid-message', 'Message you are pinning was not found', {   // 20
				method: 'pinMessage',                                                                       // 21
				action: 'Message_pinning'                                                                   // 22
			});                                                                                          // 20
		} //If we keep history of edits, insert a new message to store history information            // 24
                                                                                                //
                                                                                                //
		if (RocketChat.settings.get('Message_KeepHistory')) {                                         // 26
			RocketChat.models.Messages.cloneAndSaveAsHistoryById(message._id);                           // 27
		}                                                                                             // 28
                                                                                                //
		var me = RocketChat.models.Users.findOneById(Meteor.userId());                                // 29
		originalMessage.pinned = true;                                                                // 30
		originalMessage.pinnedAt = pinnedAt || Date.now;                                              // 31
		originalMessage.pinnedBy = {                                                                  // 32
			_id: Meteor.userId(),                                                                        // 33
			username: me.username                                                                        // 34
		};                                                                                            // 32
		originalMessage = RocketChat.callbacks.run('beforeSaveMessage', originalMessage);             // 36
		RocketChat.models.Messages.setPinnedByIdAndUserId(originalMessage._id, originalMessage.pinnedBy, originalMessage.pinned);
		return RocketChat.models.Messages.createWithTypeRoomIdMessageAndUser('message_pinned', originalMessage.rid, '', me, {
			attachments: [{                                                                              // 39
				'text': originalMessage.msg,                                                                // 41
				'author_name': originalMessage.u.username,                                                  // 42
				'author_icon': getAvatarUrlFromUsername(originalMessage.u.username),                        // 43
				'ts': originalMessage.ts                                                                    // 44
			}]                                                                                           // 40
		});                                                                                           // 38
	},                                                                                             // 48
	unpinMessage: function (message) {                                                             // 49
		if (!Meteor.userId()) {                                                                       // 50
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                               // 51
				method: 'unpinMessage'                                                                      // 52
			});                                                                                          // 51
		}                                                                                             // 54
                                                                                                //
		if (!RocketChat.settings.get('Message_AllowPinning')) {                                       // 55
			throw new Meteor.Error('error-action-not-allowed', 'Message pinning not allowed', {          // 56
				method: 'unpinMessage',                                                                     // 57
				action: 'Message_pinning'                                                                   // 58
			});                                                                                          // 56
		}                                                                                             // 60
                                                                                                //
		var room = RocketChat.models.Rooms.findOneById(message.rid);                                  // 61
                                                                                                //
		if (Array.isArray(room.usernames) && room.usernames.indexOf(Meteor.user().username) === -1) {
			return false;                                                                                // 64
		}                                                                                             // 65
                                                                                                //
		var originalMessage = RocketChat.models.Messages.findOneById(message._id);                    // 67
                                                                                                //
		if (originalMessage == null || originalMessage._id == null) {                                 // 69
			throw new Meteor.Error('error-invalid-message', 'Message you are unpinning was not found', {
				method: 'unpinMessage',                                                                     // 71
				action: 'Message_pinning'                                                                   // 72
			});                                                                                          // 70
		} //If we keep history of edits, insert a new message to store history information            // 74
                                                                                                //
                                                                                                //
		if (RocketChat.settings.get('Message_KeepHistory')) {                                         // 76
			RocketChat.models.Messages.cloneAndSaveAsHistoryById(originalMessage._id);                   // 77
		}                                                                                             // 78
                                                                                                //
		var me = RocketChat.models.Users.findOneById(Meteor.userId());                                // 79
		originalMessage.pinned = false;                                                               // 80
		originalMessage.pinnedBy = {                                                                  // 81
			_id: Meteor.userId(),                                                                        // 82
			username: me.username                                                                        // 83
		};                                                                                            // 81
		originalMessage = RocketChat.callbacks.run('beforeSaveMessage', originalMessage);             // 85
		return RocketChat.models.Messages.setPinnedByIdAndUserId(originalMessage._id, originalMessage.pinnedBy, originalMessage.pinned);
	}                                                                                              // 87
});                                                                                             // 1
//////////////////////////////////////////////////////////////////////////////////////////////////

},"publications":{"pinnedMessages.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                              //
// packages/rocketchat_message-pin/server/publications/pinnedMessages.js                        //
//                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                //
Meteor.publish('pinnedMessages', function (rid) {                                               // 1
	var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;            // 1
                                                                                                //
	if (!this.userId) {                                                                            // 2
		return this.ready();                                                                          // 3
	}                                                                                              // 4
                                                                                                //
	var publication = this;                                                                        // 5
	var user = RocketChat.models.Users.findOneById(this.userId);                                   // 7
                                                                                                //
	if (!user) {                                                                                   // 8
		return this.ready();                                                                          // 9
	}                                                                                              // 10
                                                                                                //
	var cursorHandle = RocketChat.models.Messages.findPinnedByRoom(rid, {                          // 11
		sort: {                                                                                       // 11
			ts: -1                                                                                       // 11
		},                                                                                            // 11
		limit: limit                                                                                  // 11
	}).observeChanges({                                                                            // 11
		added: function (_id, record) {                                                               // 12
			return publication.added('rocketchat_pinned_message', _id, record);                          // 13
		},                                                                                            // 14
		changed: function (_id, record) {                                                             // 15
			return publication.changed('rocketchat_pinned_message', _id, record);                        // 16
		},                                                                                            // 17
		removed: function (_id) {                                                                     // 18
			return publication.removed('rocketchat_pinned_message', _id);                                // 19
		}                                                                                             // 20
	});                                                                                            // 11
	this.ready();                                                                                  // 22
	return this.onStop(function () {                                                               // 23
		return cursorHandle.stop();                                                                   // 24
	});                                                                                            // 25
});                                                                                             // 26
//////////////////////////////////////////////////////////////////////////////////////////////////

}},"startup":{"indexes.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                              //
// packages/rocketchat_message-pin/server/startup/indexes.js                                    //
//                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                //
Meteor.startup(function () {                                                                    // 1
	return Meteor.defer(function () {                                                              // 2
		return RocketChat.models.Messages.tryEnsureIndex({                                            // 3
			'pinnedBy._id': 1                                                                            // 4
		}, {                                                                                          // 3
			sparse: 1                                                                                    // 6
		});                                                                                           // 5
	});                                                                                            // 8
});                                                                                             // 9
//////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:message-pin/server/settings.js");
require("./node_modules/meteor/rocketchat:message-pin/server/pinMessage.js");
require("./node_modules/meteor/rocketchat:message-pin/server/publications/pinnedMessages.js");
require("./node_modules/meteor/rocketchat:message-pin/server/startup/indexes.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:message-pin'] = {};

})();

//# sourceMappingURL=rocketchat_message-pin.js.map

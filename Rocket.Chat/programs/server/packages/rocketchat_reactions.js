(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RocketChatTabBar = Package['rocketchat:lib'].RocketChatTabBar;
var fileUpload = Package['rocketchat:ui'].fileUpload;
var meteorInstall = Package.modules.meteorInstall;
var process = Package.modules.process;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:reactions":{"server":{"models":{"Messages.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_reactions/server/models/Messages.js                                                        //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
RocketChat.models.Messages.setReactions = function (messageId, reactions) {                                       // 1
	return this.update({                                                                                             // 2
		_id: messageId                                                                                                  // 2
	}, {                                                                                                             // 2
		$set: {                                                                                                         // 2
			reactions: reactions                                                                                           // 2
		}                                                                                                               // 2
	});                                                                                                              // 2
};                                                                                                                // 3
                                                                                                                  //
RocketChat.models.Messages.unsetReactions = function (messageId) {                                                // 5
	return this.update({                                                                                             // 6
		_id: messageId                                                                                                  // 6
	}, {                                                                                                             // 6
		$unset: {                                                                                                       // 6
			reactions: 1                                                                                                   // 6
		}                                                                                                               // 6
	});                                                                                                              // 6
};                                                                                                                // 7
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"setReaction.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_reactions/setReaction.js                                                                   //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
/* globals msgStream */Meteor.methods({                                                                           // 1
	setReaction: function (reaction, messageId) {                                                                    // 3
		if (!Meteor.userId()) {                                                                                         // 4
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                 // 5
				method: 'setReaction'                                                                                         // 5
			});                                                                                                            // 5
		}                                                                                                               // 6
                                                                                                                  //
		var message = RocketChat.models.Messages.findOneById(messageId);                                                // 8
                                                                                                                  //
		if (!message) {                                                                                                 // 10
			throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                   // 11
				method: 'setReaction'                                                                                         // 11
			});                                                                                                            // 11
		}                                                                                                               // 12
                                                                                                                  //
		var room = Meteor.call('canAccessRoom', message.rid, Meteor.userId());                                          // 14
                                                                                                                  //
		if (!room) {                                                                                                    // 16
			throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                   // 17
				method: 'setReaction'                                                                                         // 17
			});                                                                                                            // 17
		}                                                                                                               // 18
                                                                                                                  //
		var user = Meteor.user();                                                                                       // 20
                                                                                                                  //
		if (Array.isArray(room.muted) && room.muted.indexOf(user.username) !== -1 && !room.reactWhenReadOnly) {         // 22
			RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {                                              // 23
				_id: Random.id(),                                                                                             // 24
				rid: room._id,                                                                                                // 25
				ts: new Date(),                                                                                               // 26
				msg: TAPi18n.__('You_have_been_muted', {}, user.language)                                                     // 27
			});                                                                                                            // 23
			return false;                                                                                                  // 29
		} else if (!RocketChat.models.Subscriptions.findOne({                                                           // 30
			rid: message.rid                                                                                               // 30
		})) {                                                                                                           // 30
			return false;                                                                                                  // 31
		}                                                                                                               // 32
                                                                                                                  //
		if (message.reactions && message.reactions[reaction] && message.reactions[reaction].usernames.indexOf(user.username) !== -1) {
			message.reactions[reaction].usernames.splice(message.reactions[reaction].usernames.indexOf(user.username), 1);
                                                                                                                  //
			if (message.reactions[reaction].usernames.length === 0) {                                                      // 37
				delete message.reactions[reaction];                                                                           // 38
			}                                                                                                              // 39
                                                                                                                  //
			if (_.isEmpty(message.reactions)) {                                                                            // 41
				delete message.reactions;                                                                                     // 42
				RocketChat.models.Messages.unsetReactions(messageId);                                                         // 43
				RocketChat.callbacks.run('unsetReaction', messageId, reaction);                                               // 44
			} else {                                                                                                       // 45
				RocketChat.models.Messages.setReactions(messageId, message.reactions);                                        // 46
				RocketChat.callbacks.run('setReaction', messageId, reaction);                                                 // 47
			}                                                                                                              // 48
		} else {                                                                                                        // 49
			if (!message.reactions) {                                                                                      // 50
				message.reactions = {};                                                                                       // 51
			}                                                                                                              // 52
                                                                                                                  //
			if (!message.reactions[reaction]) {                                                                            // 53
				message.reactions[reaction] = {                                                                               // 54
					usernames: []                                                                                                // 55
				};                                                                                                            // 54
			}                                                                                                              // 57
                                                                                                                  //
			message.reactions[reaction].usernames.push(user.username);                                                     // 58
			RocketChat.models.Messages.setReactions(messageId, message.reactions);                                         // 60
			RocketChat.callbacks.run('setReaction', messageId, reaction);                                                  // 61
		}                                                                                                               // 62
                                                                                                                  //
		msgStream.emit(message.rid, message);                                                                           // 64
		return;                                                                                                         // 66
	}                                                                                                                // 67
});                                                                                                               // 2
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:reactions/server/models/Messages.js");
require("./node_modules/meteor/rocketchat:reactions/setReaction.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:reactions'] = {};

})();

//# sourceMappingURL=rocketchat_reactions.js.map

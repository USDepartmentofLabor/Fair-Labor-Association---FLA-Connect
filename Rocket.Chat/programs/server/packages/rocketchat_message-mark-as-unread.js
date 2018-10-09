(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RocketChatTabBar = Package['rocketchat:lib'].RocketChatTabBar;
var Logger = Package['rocketchat:logger'].Logger;
var SystemLogger = Package['rocketchat:logger'].SystemLogger;
var LoggerManager = Package['rocketchat:logger'].LoggerManager;
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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:message-mark-as-unread":{"server":{"logger.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/rocketchat_message-mark-as-unread/server/logger.js                                                      //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var logger = new Logger('MessageMarkAsUnread', {                                                                    // 1
	sections: {                                                                                                        // 2
		connection: 'Connection',                                                                                         // 3
		events: 'Events'                                                                                                  // 4
	}                                                                                                                  // 2
});                                                                                                                 // 1
module.exportDefault(logger);                                                                                       // 1
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"unreadMessages.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/rocketchat_message-mark-as-unread/server/unreadMessages.js                                              //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var logger = void 0;                                                                                                // 1
module.watch(require("./logger"), {                                                                                 // 1
	"default": function (v) {                                                                                          // 1
		logger = v;                                                                                                       // 1
	}                                                                                                                  // 1
}, 0);                                                                                                              // 1
Meteor.methods({                                                                                                    // 2
	unreadMessages: function (firstUnreadMessage) {                                                                    // 3
		if (!Meteor.userId()) {                                                                                           // 4
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                   // 5
				method: 'unreadMessages'                                                                                        // 6
			});                                                                                                              // 5
		}                                                                                                                 // 8
                                                                                                                    //
		var originalMessage = RocketChat.models.Messages.findOneById(firstUnreadMessage._id, {                            // 9
			fields: {                                                                                                        // 10
				u: 1,                                                                                                           // 11
				rid: 1,                                                                                                         // 12
				file: 1,                                                                                                        // 13
				ts: 1                                                                                                           // 14
			}                                                                                                                // 10
		});                                                                                                               // 9
                                                                                                                    //
		if (originalMessage == null || Meteor.userId() === originalMessage.u._id) {                                       // 17
			throw new Meteor.Error('error-action-not-allowed', 'Not allowed', {                                              // 18
				method: 'unreadMessages',                                                                                       // 19
				action: 'Unread_messages'                                                                                       // 20
			});                                                                                                              // 18
		}                                                                                                                 // 22
                                                                                                                    //
		var lastSeen = RocketChat.models.Subscriptions.findOneByRoomIdAndUserId(originalMessage.rid, Meteor.userId()).ls;
                                                                                                                    //
		if (firstUnreadMessage.ts >= lastSeen) {                                                                          // 24
			return logger.connection.debug('Provided message is already marked as unread');                                  // 25
		}                                                                                                                 // 26
                                                                                                                    //
		logger.connection.debug("Updating unread  message of " + originalMessage.ts + " as the first unread");            // 27
		return RocketChat.models.Subscriptions.setAsUnreadByRoomIdAndUserId(originalMessage.rid, Meteor.userId(), originalMessage.ts);
	}                                                                                                                  // 29
});                                                                                                                 // 2
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:message-mark-as-unread/server/logger.js");
require("./node_modules/meteor/rocketchat:message-mark-as-unread/server/unreadMessages.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:message-mark-as-unread'] = {};

})();

//# sourceMappingURL=rocketchat_message-mark-as-unread.js.map

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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:action-links":{"both":{"lib":{"actionLinks.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                              //
// packages/rocketchat_action-links/both/lib/actionLinks.js                                     //
//                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                //
//Action Links namespace creation.                                                              // 1
RocketChat.actionLinks = {                                                                      // 2
	actions: {},                                                                                   // 3
	register: function (name, funct) {                                                             // 4
		RocketChat.actionLinks.actions[name] = funct;                                                 // 5
	},                                                                                             // 6
	getMessage: function (name, messageId) {                                                       // 7
		if (!Meteor.userId()) {                                                                       // 8
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                               // 9
				"function": 'actionLinks.getMessage'                                                        // 9
			});                                                                                          // 9
		}                                                                                             // 10
                                                                                                //
		var message = RocketChat.models.Messages.findOne({                                            // 12
			_id: messageId                                                                               // 12
		});                                                                                           // 12
                                                                                                //
		if (!message) {                                                                               // 13
			throw new Meteor.Error('error-invalid-message', 'Invalid message', {                         // 14
				"function": 'actionLinks.getMessage'                                                        // 14
			});                                                                                          // 14
		}                                                                                             // 15
                                                                                                //
		var room = RocketChat.models.Rooms.findOne({                                                  // 17
			_id: message.rid                                                                             // 17
		});                                                                                           // 17
                                                                                                //
		if (Array.isArray(room.usernames) && room.usernames.indexOf(Meteor.user().username) === -1) {
			throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                 // 19
				"function": 'actionLinks.getMessage'                                                        // 19
			});                                                                                          // 19
		}                                                                                             // 20
                                                                                                //
		if (!message.actionLinks || !message.actionLinks[name]) {                                     // 22
			throw new Meteor.Error('error-invalid-actionlink', 'Invalid action link', {                  // 23
				"function": 'actionLinks.getMessage'                                                        // 23
			});                                                                                          // 23
		}                                                                                             // 24
                                                                                                //
		return message;                                                                               // 26
	}                                                                                              // 27
};                                                                                              // 2
//////////////////////////////////////////////////////////////////////////////////////////////////

}}},"server":{"actionLinkHandler.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                              //
// packages/rocketchat_action-links/server/actionLinkHandler.js                                 //
//                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                //
//Action Links Handler. This method will be called off the client.                              // 1
Meteor.methods({                                                                                // 3
	actionLinkHandler: function (name, messageId) {                                                // 4
		if (!Meteor.userId()) {                                                                       // 5
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                               // 6
				method: 'actionLinkHandler'                                                                 // 6
			});                                                                                          // 6
		}                                                                                             // 7
                                                                                                //
		var message = RocketChat.actionLinks.getMessage(name, messageId);                             // 9
		var actionLink = message.actionLinks[name];                                                   // 11
		RocketChat.actionLinks.actions[actionLink.method_id](message, actionLink.params);             // 13
	}                                                                                              // 14
});                                                                                             // 3
//////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:action-links/both/lib/actionLinks.js");
require("./node_modules/meteor/rocketchat:action-links/server/actionLinkHandler.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:action-links'] = {};

})();

//# sourceMappingURL=rocketchat_action-links.js.map

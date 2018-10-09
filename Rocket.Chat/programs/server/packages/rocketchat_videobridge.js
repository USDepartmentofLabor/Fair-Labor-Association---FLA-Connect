(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:videobridge":{"lib":{"messageType.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/rocketchat_videobridge/lib/messageType.js                                                            //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Meteor.startup(function () {                                                                                     // 1
	RocketChat.MessageTypes.registerType({                                                                          // 2
		id: 'jitsi_call_started',                                                                                      // 3
		system: true,                                                                                                  // 4
		message: 'Started a Video Call!'                                                                               // 5
	});                                                                                                             // 2
});                                                                                                              // 7
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"settings.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/rocketchat_videobridge/server/settings.js                                                            //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Meteor.startup(function () {                                                                                     // 1
	RocketChat.settings.addGroup('Video Conference', function () {                                                  // 2
		this.add('Jitsi_Enabled', false, {                                                                             // 3
			type: 'boolean',                                                                                              // 4
			i18nLabel: 'Enabled',                                                                                         // 5
			alert: 'This Feature is currently in beta! Please report bugs to github.com/RocketChat/Rocket.Chat/issues',   // 6
			"public": true                                                                                                // 7
		});                                                                                                            // 3
		this.add('Jitsi_Domain', 'meet.jit.si', {                                                                      // 10
			type: 'string',                                                                                               // 11
			enableQuery: {                                                                                                // 12
				_id: 'Jitsi_Enabled',                                                                                        // 13
				value: true                                                                                                  // 14
			},                                                                                                            // 12
			i18nLabel: 'Domain',                                                                                          // 16
			"public": true                                                                                                // 17
		});                                                                                                            // 10
		this.add('Jitsi_URL_Room_Prefix', 'RocketChat', {                                                              // 20
			type: 'string',                                                                                               // 21
			enableQuery: {                                                                                                // 22
				_id: 'Jitsi_Enabled',                                                                                        // 23
				value: true                                                                                                  // 24
			},                                                                                                            // 22
			i18nLabel: 'URL_room_prefix',                                                                                 // 26
			"public": true                                                                                                // 27
		});                                                                                                            // 20
		this.add('Jitsi_SSL', true, {                                                                                  // 30
			type: 'boolean',                                                                                              // 31
			enableQuery: {                                                                                                // 32
				_id: 'Jitsi_Enabled',                                                                                        // 33
				value: true                                                                                                  // 34
			},                                                                                                            // 32
			i18nLabel: 'SSL',                                                                                             // 36
			"public": true                                                                                                // 37
		});                                                                                                            // 30
		this.add('Jitsi_Open_New_Window', false, {                                                                     // 40
			type: 'boolean',                                                                                              // 41
			enableQuery: {                                                                                                // 42
				_id: 'Jitsi_Enabled',                                                                                        // 43
				value: true                                                                                                  // 44
			},                                                                                                            // 42
			i18nLabel: 'Always_open_in_new_window',                                                                       // 46
			"public": true                                                                                                // 47
		});                                                                                                            // 40
		this.add('Jitsi_Enable_Channels', false, {                                                                     // 50
			type: 'boolean',                                                                                              // 51
			enableQuery: {                                                                                                // 52
				_id: 'Jitsi_Enabled',                                                                                        // 53
				value: true                                                                                                  // 54
			},                                                                                                            // 52
			i18nLabel: 'Jitsi_Enable_Channels',                                                                           // 56
			"public": true                                                                                                // 57
		});                                                                                                            // 50
		this.add('Jitsi_Chrome_Extension', 'nocfbnnmjnndkbipkabodnheejiegccf', {                                       // 60
			type: 'string',                                                                                               // 61
			enableQuery: {                                                                                                // 62
				_id: 'Jitsi_Enabled',                                                                                        // 63
				value: true                                                                                                  // 64
			},                                                                                                            // 62
			i18nLabel: 'Jitsi_Chrome_Extension',                                                                          // 66
			"public": true                                                                                                // 67
		});                                                                                                            // 60
	});                                                                                                             // 69
});                                                                                                              // 70
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"models":{"Rooms.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/rocketchat_videobridge/server/models/Rooms.js                                                        //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
/**                                                                                                              // 1
 * sets jitsiTimeout to indicate a call is in progress                                                           //
 * @param {string} _id - Room id                                                                                 //
 * @parm {number} time - time to set                                                                             //
 */RocketChat.models.Rooms.setJitsiTimeout = function (_id, time) {                                              //
	var query = {                                                                                                   // 7
		_id: _id                                                                                                       // 8
	};                                                                                                              // 7
	var update = {                                                                                                  // 11
		$set: {                                                                                                        // 12
			jitsiTimeout: time                                                                                            // 13
		}                                                                                                              // 12
	};                                                                                                              // 11
	return this.update(query, update);                                                                              // 17
};                                                                                                               // 18
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods":{"jitsiSetTimeout.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/rocketchat_videobridge/server/methods/jitsiSetTimeout.js                                             //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Meteor.methods({                                                                                                 // 2
	'jitsi:updateTimeout': function (rid) {                                                                         // 3
		if (!Meteor.userId()) {                                                                                        // 5
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                // 6
				method: 'jitsi:updateTimeout'                                                                                // 6
			});                                                                                                           // 6
		}                                                                                                              // 7
                                                                                                                 //
		var room = RocketChat.models.Rooms.findOneById(rid);                                                           // 9
		var currentTime = new Date().getTime();                                                                        // 10
		var jitsiTimeout = new Date(room && room.jitsiTimeout || currentTime).getTime();                               // 12
                                                                                                                 //
		if (jitsiTimeout <= currentTime) {                                                                             // 14
			RocketChat.models.Rooms.setJitsiTimeout(rid, new Date(currentTime + 35 * 1000));                              // 15
			RocketChat.models.Messages.createWithTypeRoomIdMessageAndUser('jitsi_call_started', rid, '', Meteor.user(), {
				actionLinks: [{                                                                                              // 17
					icon: 'icon-videocam',                                                                                      // 18
					label: 'Click To Join!',                                                                                    // 18
					method_id: 'joinJitsiCall',                                                                                 // 18
					params: ''                                                                                                  // 18
				}]                                                                                                           // 18
			});                                                                                                           // 16
		} else if ((jitsiTimeout - currentTime) / 1000 <= 15) {                                                        // 21
			RocketChat.models.Rooms.setJitsiTimeout(rid, new Date(jitsiTimeout + 25 * 1000));                             // 22
		}                                                                                                              // 23
	}                                                                                                               // 24
});                                                                                                              // 2
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"actionLink.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/rocketchat_videobridge/server/actionLink.js                                                          //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
RocketChat.actionLinks.register('joinJitsiCall', function () /*message, params*/{});                             // 1
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:videobridge/lib/messageType.js");
require("./node_modules/meteor/rocketchat:videobridge/server/settings.js");
require("./node_modules/meteor/rocketchat:videobridge/server/models/Rooms.js");
require("./node_modules/meteor/rocketchat:videobridge/server/methods/jitsiSetTimeout.js");
require("./node_modules/meteor/rocketchat:videobridge/server/actionLink.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:videobridge'] = {};

})();

//# sourceMappingURL=rocketchat_videobridge.js.map

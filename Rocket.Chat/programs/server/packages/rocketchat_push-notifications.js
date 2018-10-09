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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:push-notifications":{"server":{"methods":{"saveNotificationSettings.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/rocketchat_push-notifications/server/methods/saveNotificationSettings.js                                //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
Meteor.methods({                                                                                                    // 1
	saveNotificationSettings: function (rid, field, value) {                                                           // 2
		if (!Meteor.userId()) {                                                                                           // 3
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                   // 4
				method: 'saveNotificationSettings'                                                                              // 4
			});                                                                                                              // 4
		}                                                                                                                 // 5
                                                                                                                    //
		check(rid, String);                                                                                               // 7
		check(field, String);                                                                                             // 8
		check(value, String);                                                                                             // 9
                                                                                                                    //
		if (['audioNotification', 'desktopNotifications', 'mobilePushNotifications', 'emailNotifications', 'unreadAlert', 'disableNotifications', 'hideUnreadStatus'].indexOf(field) === -1) {
			throw new Meteor.Error('error-invalid-settings', 'Invalid settings field', {                                     // 12
				method: 'saveNotificationSettings'                                                                              // 12
			});                                                                                                              // 12
		}                                                                                                                 // 13
                                                                                                                    //
		if (field !== 'audioNotification' && field !== 'hideUnreadStatus' && field !== 'disableNotifications' && ['all', 'mentions', 'nothing', 'default'].indexOf(value) === -1) {
			throw new Meteor.Error('error-invalid-settings', 'Invalid settings value', {                                     // 16
				method: 'saveNotificationSettings'                                                                              // 16
			});                                                                                                              // 16
		}                                                                                                                 // 17
                                                                                                                    //
		var subscription = RocketChat.models.Subscriptions.findOneByRoomIdAndUserId(rid, Meteor.userId());                // 19
                                                                                                                    //
		if (!subscription) {                                                                                              // 20
			throw new Meteor.Error('error-invalid-subscription', 'Invalid subscription', {                                   // 21
				method: 'saveNotificationSettings'                                                                              // 21
			});                                                                                                              // 21
		}                                                                                                                 // 22
                                                                                                                    //
		switch (field) {                                                                                                  // 24
			case 'audioNotification':                                                                                        // 25
				RocketChat.models.Subscriptions.updateAudioNotificationById(subscription._id, value);                           // 26
				break;                                                                                                          // 27
                                                                                                                    //
			case 'desktopNotifications':                                                                                     // 28
				RocketChat.models.Subscriptions.updateDesktopNotificationsById(subscription._id, value);                        // 29
				break;                                                                                                          // 30
                                                                                                                    //
			case 'mobilePushNotifications':                                                                                  // 31
				RocketChat.models.Subscriptions.updateMobilePushNotificationsById(subscription._id, value);                     // 32
				break;                                                                                                          // 33
                                                                                                                    //
			case 'emailNotifications':                                                                                       // 34
				RocketChat.models.Subscriptions.updateEmailNotificationsById(subscription._id, value);                          // 35
				break;                                                                                                          // 36
                                                                                                                    //
			case 'unreadAlert':                                                                                              // 37
				RocketChat.models.Subscriptions.updateUnreadAlertById(subscription._id, value);                                 // 38
				break;                                                                                                          // 39
                                                                                                                    //
			case 'disableNotifications':                                                                                     // 40
				RocketChat.models.Subscriptions.updateDisableNotificationsById(subscription._id, value === '1' ? true : false);
				break;                                                                                                          // 42
                                                                                                                    //
			case 'hideUnreadStatus':                                                                                         // 43
				RocketChat.models.Subscriptions.updateHideUnreadStatusById(subscription._id, value === '1' ? true : false);     // 44
				break;                                                                                                          // 45
		}                                                                                                                 // 24
                                                                                                                    //
		return true;                                                                                                      // 48
	},                                                                                                                 // 49
	saveDesktopNotificationDuration: function (rid, value) {                                                           // 51
		var subscription = RocketChat.models.Subscriptions.findOneByRoomIdAndUserId(rid, Meteor.userId());                // 52
                                                                                                                    //
		if (!subscription) {                                                                                              // 53
			throw new Meteor.Error('error-invalid-subscription', 'Invalid subscription', {                                   // 54
				method: 'saveDesktopNotificationDuration'                                                                       // 54
			});                                                                                                              // 54
		}                                                                                                                 // 55
                                                                                                                    //
		RocketChat.models.Subscriptions.updateDesktopNotificationDurationById(subscription._id, value);                   // 56
		return true;                                                                                                      // 57
	}                                                                                                                  // 58
});                                                                                                                 // 1
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"models":{"Subscriptions.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/rocketchat_push-notifications/server/models/Subscriptions.js                                            //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
RocketChat.models.Subscriptions.updateAudioNotificationById = function (_id, audioNotification) {                   // 1
	var query = {                                                                                                      // 2
		_id: _id                                                                                                          // 3
	};                                                                                                                 // 2
	var update = {                                                                                                     // 6
		$set: {                                                                                                           // 7
			audioNotification: audioNotification                                                                             // 8
		}                                                                                                                 // 7
	};                                                                                                                 // 6
	return this.update(query, update);                                                                                 // 12
};                                                                                                                  // 13
                                                                                                                    //
RocketChat.models.Subscriptions.updateDesktopNotificationsById = function (_id, desktopNotifications) {             // 15
	var query = {                                                                                                      // 16
		_id: _id                                                                                                          // 17
	};                                                                                                                 // 16
	var update = {};                                                                                                   // 20
                                                                                                                    //
	if (desktopNotifications === 'default') {                                                                          // 22
		update.$unset = {                                                                                                 // 23
			desktopNotifications: 1                                                                                          // 23
		};                                                                                                                // 23
	} else {                                                                                                           // 24
		update.$set = {                                                                                                   // 25
			desktopNotifications: desktopNotifications                                                                       // 25
		};                                                                                                                // 25
	}                                                                                                                  // 26
                                                                                                                    //
	return this.update(query, update);                                                                                 // 28
};                                                                                                                  // 29
                                                                                                                    //
RocketChat.models.Subscriptions.updateDesktopNotificationDurationById = function (_id, value) {                     // 31
	var query = {                                                                                                      // 32
		_id: _id                                                                                                          // 33
	};                                                                                                                 // 32
	var update = {                                                                                                     // 36
		$set: {                                                                                                           // 37
			desktopNotificationDuration: value - 0                                                                           // 38
		}                                                                                                                 // 37
	};                                                                                                                 // 36
	return this.update(query, update);                                                                                 // 42
};                                                                                                                  // 43
                                                                                                                    //
RocketChat.models.Subscriptions.updateMobilePushNotificationsById = function (_id, mobilePushNotifications) {       // 45
	var query = {                                                                                                      // 46
		_id: _id                                                                                                          // 47
	};                                                                                                                 // 46
	var update = {};                                                                                                   // 50
                                                                                                                    //
	if (mobilePushNotifications === 'default') {                                                                       // 52
		update.$unset = {                                                                                                 // 53
			mobilePushNotifications: 1                                                                                       // 53
		};                                                                                                                // 53
	} else {                                                                                                           // 54
		update.$set = {                                                                                                   // 55
			mobilePushNotifications: mobilePushNotifications                                                                 // 55
		};                                                                                                                // 55
	}                                                                                                                  // 56
                                                                                                                    //
	return this.update(query, update);                                                                                 // 58
};                                                                                                                  // 59
                                                                                                                    //
RocketChat.models.Subscriptions.updateEmailNotificationsById = function (_id, emailNotifications) {                 // 61
	var query = {                                                                                                      // 62
		_id: _id                                                                                                          // 63
	};                                                                                                                 // 62
	var update = {                                                                                                     // 66
		$set: {                                                                                                           // 67
			emailNotifications: emailNotifications                                                                           // 68
		}                                                                                                                 // 67
	};                                                                                                                 // 66
	return this.update(query, update);                                                                                 // 72
};                                                                                                                  // 73
                                                                                                                    //
RocketChat.models.Subscriptions.updateUnreadAlertById = function (_id, unreadAlert) {                               // 75
	var query = {                                                                                                      // 76
		_id: _id                                                                                                          // 77
	};                                                                                                                 // 76
	var update = {                                                                                                     // 80
		$set: {                                                                                                           // 81
			unreadAlert: unreadAlert                                                                                         // 82
		}                                                                                                                 // 81
	};                                                                                                                 // 80
	return this.update(query, update);                                                                                 // 86
};                                                                                                                  // 87
                                                                                                                    //
RocketChat.models.Subscriptions.updateDisableNotificationsById = function (_id, disableNotifications) {             // 89
	var query = {                                                                                                      // 90
		_id: _id                                                                                                          // 91
	};                                                                                                                 // 90
	var update = {                                                                                                     // 94
		$set: {                                                                                                           // 95
			disableNotifications: disableNotifications                                                                       // 96
		}                                                                                                                 // 95
	};                                                                                                                 // 94
	return this.update(query, update);                                                                                 // 100
};                                                                                                                  // 101
                                                                                                                    //
RocketChat.models.Subscriptions.updateHideUnreadStatusById = function (_id, hideUnreadStatus) {                     // 103
	var query = {                                                                                                      // 104
		_id: _id                                                                                                          // 105
	};                                                                                                                 // 104
	var update = {                                                                                                     // 108
		$set: {                                                                                                           // 109
			hideUnreadStatus: hideUnreadStatus                                                                               // 110
		}                                                                                                                 // 109
	};                                                                                                                 // 108
	return this.update(query, update);                                                                                 // 114
};                                                                                                                  // 115
                                                                                                                    //
RocketChat.models.Subscriptions.findAlwaysNotifyDesktopUsersByRoomId = function (roomId) {                          // 117
	var query = {                                                                                                      // 118
		rid: roomId,                                                                                                      // 119
		desktopNotifications: 'all'                                                                                       // 120
	};                                                                                                                 // 118
	return this.find(query);                                                                                           // 123
};                                                                                                                  // 124
                                                                                                                    //
RocketChat.models.Subscriptions.findDontNotifyDesktopUsersByRoomId = function (roomId) {                            // 126
	var query = {                                                                                                      // 127
		rid: roomId,                                                                                                      // 128
		desktopNotifications: 'nothing'                                                                                   // 129
	};                                                                                                                 // 127
	return this.find(query);                                                                                           // 132
};                                                                                                                  // 133
                                                                                                                    //
RocketChat.models.Subscriptions.findAlwaysNotifyMobileUsersByRoomId = function (roomId) {                           // 135
	var query = {                                                                                                      // 136
		rid: roomId,                                                                                                      // 137
		mobilePushNotifications: 'all'                                                                                    // 138
	};                                                                                                                 // 136
	return this.find(query);                                                                                           // 141
};                                                                                                                  // 142
                                                                                                                    //
RocketChat.models.Subscriptions.findDontNotifyMobileUsersByRoomId = function (roomId) {                             // 144
	var query = {                                                                                                      // 145
		rid: roomId,                                                                                                      // 146
		mobilePushNotifications: 'nothing'                                                                                // 147
	};                                                                                                                 // 145
	return this.find(query);                                                                                           // 150
};                                                                                                                  // 151
                                                                                                                    //
RocketChat.models.Subscriptions.findNotificationPreferencesByRoom = function (roomId, explicit) {                   // 153
	var query = {                                                                                                      // 154
		rid: roomId,                                                                                                      // 155
		'u._id': {                                                                                                        // 156
			$exists: true                                                                                                    // 156
		}                                                                                                                 // 156
	};                                                                                                                 // 154
                                                                                                                    //
	if (explicit) {                                                                                                    // 159
		query.$or = [{                                                                                                    // 160
			audioNotification: {                                                                                             // 161
				$exists: true                                                                                                   // 161
			}                                                                                                                // 161
		}, {                                                                                                              // 161
			desktopNotifications: {                                                                                          // 162
				$exists: true                                                                                                   // 162
			}                                                                                                                // 162
		}, {                                                                                                              // 162
			desktopNotificationDuration: {                                                                                   // 163
				$exists: true                                                                                                   // 163
			}                                                                                                                // 163
		}, {                                                                                                              // 163
			mobilePushNotifications: {                                                                                       // 164
				$exists: true                                                                                                   // 164
			}                                                                                                                // 164
		}, {                                                                                                              // 164
			disableNotifications: {                                                                                          // 165
				$exists: true                                                                                                   // 165
			}                                                                                                                // 165
		}];                                                                                                               // 165
	}                                                                                                                  // 167
                                                                                                                    //
	return this.find(query, {                                                                                          // 169
		fields: {                                                                                                         // 169
			'u._id': 1,                                                                                                      // 169
			desktopNotificationDuration: 1,                                                                                  // 169
			desktopNotifications: 1,                                                                                         // 169
			mobilePushNotifications: 1                                                                                       // 169
		}                                                                                                                 // 169
	});                                                                                                                // 169
};                                                                                                                  // 170
                                                                                                                    //
RocketChat.models.Subscriptions.findWithSendEmailByRoomId = function (roomId) {                                     // 172
	var query = {                                                                                                      // 173
		rid: roomId,                                                                                                      // 174
		emailNotifications: {                                                                                             // 175
			$exists: true                                                                                                    // 176
		}                                                                                                                 // 175
	};                                                                                                                 // 173
	return this.find(query, {                                                                                          // 180
		fields: {                                                                                                         // 180
			emailNotifications: 1,                                                                                           // 180
			u: 1                                                                                                             // 180
		}                                                                                                                 // 180
	});                                                                                                                // 180
};                                                                                                                  // 181
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:push-notifications/server/methods/saveNotificationSettings.js");
require("./node_modules/meteor/rocketchat:push-notifications/server/models/Subscriptions.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:push-notifications'] = {};

})();

//# sourceMappingURL=rocketchat_push-notifications.js.map

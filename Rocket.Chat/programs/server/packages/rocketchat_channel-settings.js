(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
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

/* Package-scope variables */
var name;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:channel-settings":{"server":{"functions":{"saveReactWhenReadOnly.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_channel-settings/server/functions/saveReactWhenReadOnly.js                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.saveReactWhenReadOnly = function (rid, allowReact) {                                                        // 1
	if (!Match.test(rid, String)) {                                                                                       // 2
		throw new Meteor.Error('invalid-room', 'Invalid room', {                                                             // 3
			"function": 'RocketChat.saveReactWhenReadOnly'                                                                      // 3
		});                                                                                                                  // 3
	}                                                                                                                     // 4
                                                                                                                       //
	return RocketChat.models.Rooms.setAllowReactingWhenReadOnlyById(rid, allowReact);                                     // 6
};                                                                                                                     // 7
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"saveRoomType.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_channel-settings/server/functions/saveRoomType.js                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.saveRoomType = function (rid, roomType, user) {                                                             // 2
	var sendMessage = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;                           // 2
                                                                                                                       //
	if (!Match.test(rid, String)) {                                                                                       // 3
		throw new Meteor.Error('invalid-room', 'Invalid room', {                                                             // 4
			'function': 'RocketChat.saveRoomType'                                                                               // 5
		});                                                                                                                  // 4
	}                                                                                                                     // 7
                                                                                                                       //
	if (roomType !== 'c' && roomType !== 'p') {                                                                           // 8
		throw new Meteor.Error('error-invalid-room-type', 'error-invalid-room-type', {                                       // 9
			'function': 'RocketChat.saveRoomType',                                                                              // 10
			type: roomType                                                                                                      // 11
		});                                                                                                                  // 9
	}                                                                                                                     // 13
                                                                                                                       //
	var room = RocketChat.models.Rooms.findOneById(rid);                                                                  // 14
                                                                                                                       //
	if (room == null) {                                                                                                   // 15
		throw new Meteor.Error('error-invalid-room', 'error-invalid-room', {                                                 // 16
			'function': 'RocketChat.saveRoomType',                                                                              // 17
			_id: rid                                                                                                            // 18
		});                                                                                                                  // 16
	}                                                                                                                     // 20
                                                                                                                       //
	if (room.t === 'd') {                                                                                                 // 21
		throw new Meteor.Error('error-direct-room', 'Can\'t change type of direct rooms', {                                  // 22
			'function': 'RocketChat.saveRoomType'                                                                               // 23
		});                                                                                                                  // 22
	}                                                                                                                     // 25
                                                                                                                       //
	var result = RocketChat.models.Rooms.setTypeById(rid, roomType) && RocketChat.models.Subscriptions.updateTypeByRoomId(rid, roomType);
                                                                                                                       //
	if (result && sendMessage) {                                                                                          // 27
		var message = void 0;                                                                                                // 28
                                                                                                                       //
		if (roomType === 'c') {                                                                                              // 29
			message = TAPi18n.__('Channel', {                                                                                   // 30
				lng: user && user.language || RocketChat.settings.get('language') || 'en'                                          // 31
			});                                                                                                                 // 30
		} else {                                                                                                             // 33
			message = TAPi18n.__('Private_Group', {                                                                             // 34
				lng: user && user.language || RocketChat.settings.get('language') || 'en'                                          // 35
			});                                                                                                                 // 34
		}                                                                                                                    // 37
                                                                                                                       //
		RocketChat.models.Messages.createRoomSettingsChangedWithTypeRoomIdMessageAndUser('room_changed_privacy', rid, message, user);
	}                                                                                                                     // 39
                                                                                                                       //
	return result;                                                                                                        // 40
};                                                                                                                     // 41
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"saveRoomTopic.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_channel-settings/server/functions/saveRoomTopic.js                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.saveRoomTopic = function (rid, roomTopic, user) {                                                           // 1
	var sendMessage = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;                           // 1
                                                                                                                       //
	if (!Match.test(rid, String)) {                                                                                       // 2
		throw new Meteor.Error('invalid-room', 'Invalid room', {                                                             // 3
			'function': 'RocketChat.saveRoomTopic'                                                                              // 4
		});                                                                                                                  // 3
	}                                                                                                                     // 6
                                                                                                                       //
	roomTopic = s.escapeHTML(roomTopic);                                                                                  // 7
	var update = RocketChat.models.Rooms.setTopicById(rid, roomTopic);                                                    // 8
                                                                                                                       //
	if (update && sendMessage) {                                                                                          // 9
		RocketChat.models.Messages.createRoomSettingsChangedWithTypeRoomIdMessageAndUser('room_changed_topic', rid, roomTopic, user);
	}                                                                                                                     // 11
                                                                                                                       //
	return update;                                                                                                        // 12
};                                                                                                                     // 13
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"saveRoomAnnouncement.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_channel-settings/server/functions/saveRoomAnnouncement.js                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.saveRoomAnnouncement = function (rid, roomAnnouncement, user) {                                             // 1
	var sendMessage = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;                           // 1
                                                                                                                       //
	if (!Match.test(rid, String)) {                                                                                       // 2
		throw new Meteor.Error('invalid-room', 'Invalid room', {                                                             // 3
			"function": 'RocketChat.saveRoomAnnouncement'                                                                       // 3
		});                                                                                                                  // 3
	}                                                                                                                     // 4
                                                                                                                       //
	roomAnnouncement = s.escapeHTML(roomAnnouncement);                                                                    // 6
	var updated = RocketChat.models.Rooms.setAnnouncementById(rid, roomAnnouncement);                                     // 7
                                                                                                                       //
	if (updated && sendMessage) {                                                                                         // 8
		RocketChat.models.Messages.createRoomSettingsChangedWithTypeRoomIdMessageAndUser('room_changed_announcement', rid, roomAnnouncement, user);
	}                                                                                                                     // 10
                                                                                                                       //
	return updated;                                                                                                       // 12
};                                                                                                                     // 13
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"saveRoomName.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_channel-settings/server/functions/saveRoomName.js                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.saveRoomName = function (rid, displayName, user) {                                                          // 2
	var sendMessage = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;                           // 2
	var room = RocketChat.models.Rooms.findOneById(rid);                                                                  // 3
                                                                                                                       //
	if (room.t !== 'c' && room.t !== 'p') {                                                                               // 4
		throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                         // 5
			'function': 'RocketChat.saveRoomdisplayName'                                                                        // 6
		});                                                                                                                  // 5
	}                                                                                                                     // 8
                                                                                                                       //
	if (displayName === room.name) {                                                                                      // 9
		return;                                                                                                              // 10
	}                                                                                                                     // 11
                                                                                                                       //
	var slugifiedRoomName = RocketChat.getValidRoomName(displayName, rid);                                                // 13
	var update = RocketChat.models.Rooms.setNameById(rid, slugifiedRoomName, displayName) && RocketChat.models.Subscriptions.updateNameAndAlertByRoomId(rid, slugifiedRoomName, displayName);
                                                                                                                       //
	if (update && sendMessage) {                                                                                          // 17
		RocketChat.models.Messages.createRoomRenamedWithRoomIdRoomNameAndUser(rid, displayName, user);                       // 18
	}                                                                                                                     // 19
                                                                                                                       //
	return displayName;                                                                                                   // 20
};                                                                                                                     // 21
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"saveRoomReadOnly.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_channel-settings/server/functions/saveRoomReadOnly.js                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.saveRoomReadOnly = function (rid, readOnly) {                                                               // 1
	if (!Match.test(rid, String)) {                                                                                       // 2
		throw new Meteor.Error('invalid-room', 'Invalid room', {                                                             // 3
			'function': 'RocketChat.saveRoomReadOnly'                                                                           // 4
		});                                                                                                                  // 3
	}                                                                                                                     // 6
                                                                                                                       //
	return RocketChat.models.Rooms.setReadOnlyById(rid, readOnly);                                                        // 7
};                                                                                                                     // 8
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"saveRoomDescription.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_channel-settings/server/functions/saveRoomDescription.js                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.saveRoomDescription = function (rid, roomDescription, user) {                                               // 1
	if (!Match.test(rid, String)) {                                                                                       // 3
		throw new Meteor.Error('invalid-room', 'Invalid room', {                                                             // 4
			'function': 'RocketChat.saveRoomDescription'                                                                        // 5
		});                                                                                                                  // 4
	}                                                                                                                     // 7
                                                                                                                       //
	var escapedRoomDescription = s.escapeHTML(roomDescription);                                                           // 8
	var update = RocketChat.models.Rooms.setDescriptionById(rid, escapedRoomDescription);                                 // 9
	RocketChat.models.Messages.createRoomSettingsChangedWithTypeRoomIdMessageAndUser('room_changed_description', rid, escapedRoomDescription, user);
	return update;                                                                                                        // 11
};                                                                                                                     // 12
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"saveRoomSystemMessages.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_channel-settings/server/functions/saveRoomSystemMessages.js                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.saveRoomSystemMessages = function (rid, systemMessages) {                                                   // 1
	if (!Match.test(rid, String)) {                                                                                       // 2
		throw new Meteor.Error('invalid-room', 'Invalid room', {                                                             // 3
			'function': 'RocketChat.saveRoomSystemMessages'                                                                     // 4
		});                                                                                                                  // 3
	}                                                                                                                     // 6
                                                                                                                       //
	return RocketChat.models.Rooms.setSystemMessagesById(rid, systemMessages);                                            // 7
};                                                                                                                     // 8
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods":{"saveRoomSettings.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_channel-settings/server/methods/saveRoomSettings.js                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	saveRoomSettings: function (rid, setting, value) {                                                                    // 2
		if (!Meteor.userId()) {                                                                                              // 3
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                      // 4
				'function': 'RocketChat.saveRoomName'                                                                              // 5
			});                                                                                                                 // 4
		}                                                                                                                    // 7
                                                                                                                       //
		if (!Match.test(rid, String)) {                                                                                      // 8
			throw new Meteor.Error('error-invalid-room', 'Invalid room', {                                                      // 9
				method: 'saveRoomSettings'                                                                                         // 10
			});                                                                                                                 // 9
		}                                                                                                                    // 12
                                                                                                                       //
		if (!['roomName', 'roomTopic', 'roomAnnouncement', 'roomDescription', 'roomType', 'readOnly', 'reactWhenReadOnly', 'systemMessages', 'default', 'joinCode'].some(function (s) {
			return s === setting;                                                                                               // 13
		})) {                                                                                                                // 13
			throw new Meteor.Error('error-invalid-settings', 'Invalid settings provided', {                                     // 14
				method: 'saveRoomSettings'                                                                                         // 15
			});                                                                                                                 // 14
		}                                                                                                                    // 17
                                                                                                                       //
		if (!RocketChat.authz.hasPermission(Meteor.userId(), 'edit-room', rid)) {                                            // 18
			throw new Meteor.Error('error-action-not-allowed', 'Editing room is not allowed', {                                 // 19
				method: 'saveRoomSettings',                                                                                        // 20
				action: 'Editing_room'                                                                                             // 21
			});                                                                                                                 // 19
		}                                                                                                                    // 23
                                                                                                                       //
		if (setting === 'default' && !RocketChat.authz.hasPermission(this.userId, 'view-room-administration')) {             // 24
			throw new Meteor.Error('error-action-not-allowed', 'Viewing room administration is not allowed', {                  // 25
				method: 'saveRoomSettings',                                                                                        // 26
				action: 'Viewing_room_administration'                                                                              // 27
			});                                                                                                                 // 25
		}                                                                                                                    // 29
                                                                                                                       //
		var room = RocketChat.models.Rooms.findOneById(rid);                                                                 // 30
                                                                                                                       //
		if (room != null) {                                                                                                  // 31
			if (setting === 'roomType' && value !== room.t && value === 'c' && !RocketChat.authz.hasPermission(this.userId, 'create-c')) {
				throw new Meteor.Error('error-action-not-allowed', 'Changing a private group to a public channel is not allowed', {
					method: 'saveRoomSettings',                                                                                       // 34
					action: 'Change_Room_Type'                                                                                        // 35
				});                                                                                                                // 33
			}                                                                                                                   // 37
                                                                                                                       //
			if (setting === 'roomType' && value !== room.t && value === 'p' && !RocketChat.authz.hasPermission(this.userId, 'create-p')) {
				throw new Meteor.Error('error-action-not-allowed', 'Changing a public channel to a private room is not allowed', {
					method: 'saveRoomSettings',                                                                                       // 40
					action: 'Change_Room_Type'                                                                                        // 41
				});                                                                                                                // 39
			}                                                                                                                   // 43
                                                                                                                       //
			switch (setting) {                                                                                                  // 44
				case 'roomName':                                                                                                   // 45
					name = RocketChat.saveRoomName(rid, value, Meteor.user());                                                        // 46
					break;                                                                                                            // 47
                                                                                                                       //
				case 'roomTopic':                                                                                                  // 48
					if (value !== room.topic) {                                                                                       // 49
						RocketChat.saveRoomTopic(rid, value, Meteor.user());                                                             // 50
					}                                                                                                                 // 51
                                                                                                                       //
					break;                                                                                                            // 52
                                                                                                                       //
				case 'roomAnnouncement':                                                                                           // 53
					if (value !== room.announcement) {                                                                                // 54
						RocketChat.saveRoomAnnouncement(rid, value, Meteor.user());                                                      // 55
					}                                                                                                                 // 56
                                                                                                                       //
					break;                                                                                                            // 57
                                                                                                                       //
				case 'roomDescription':                                                                                            // 58
					if (value !== room.description) {                                                                                 // 59
						RocketChat.saveRoomDescription(rid, value, Meteor.user());                                                       // 60
					}                                                                                                                 // 61
                                                                                                                       //
					break;                                                                                                            // 62
                                                                                                                       //
				case 'roomType':                                                                                                   // 63
					if (value !== room.t) {                                                                                           // 64
						RocketChat.saveRoomType(rid, value, Meteor.user());                                                              // 65
					}                                                                                                                 // 66
                                                                                                                       //
					break;                                                                                                            // 67
                                                                                                                       //
				case 'readOnly':                                                                                                   // 68
					if (value !== room.ro) {                                                                                          // 69
						RocketChat.saveRoomReadOnly(rid, value, Meteor.user());                                                          // 70
					}                                                                                                                 // 71
                                                                                                                       //
					break;                                                                                                            // 72
                                                                                                                       //
				case 'reactWhenReadOnly':                                                                                          // 73
					if (value !== room.reactWhenReadOnly) {                                                                           // 74
						RocketChat.saveReactWhenReadOnly(rid, value, Meteor.user());                                                     // 75
					}                                                                                                                 // 76
                                                                                                                       //
					break;                                                                                                            // 77
                                                                                                                       //
				case 'systemMessages':                                                                                             // 78
					if (value !== room.sysMes) {                                                                                      // 79
						RocketChat.saveRoomSystemMessages(rid, value, Meteor.user());                                                    // 80
					}                                                                                                                 // 81
                                                                                                                       //
					break;                                                                                                            // 82
                                                                                                                       //
				case 'joinCode':                                                                                                   // 83
					RocketChat.models.Rooms.setJoinCodeById(rid, String(value));                                                      // 84
					break;                                                                                                            // 85
                                                                                                                       //
				case 'default':                                                                                                    // 86
					RocketChat.models.Rooms.saveDefaultById(rid, value);                                                              // 87
			}                                                                                                                   // 44
		}                                                                                                                    // 89
                                                                                                                       //
		return {                                                                                                             // 90
			result: true,                                                                                                       // 91
			rid: room._id                                                                                                       // 92
		};                                                                                                                   // 90
	}                                                                                                                     // 94
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"models":{"Messages.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_channel-settings/server/models/Messages.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.models.Messages.createRoomSettingsChangedWithTypeRoomIdMessageAndUser = function (type, roomId, message, user, extraData) {
	return this.createWithTypeRoomIdMessageAndUser(type, roomId, message, user, extraData);                               // 2
};                                                                                                                     // 3
                                                                                                                       //
RocketChat.models.Messages.createRoomRenamedWithRoomIdRoomNameAndUser = function (roomId, roomName, user, extraData) {
	return this.createWithTypeRoomIdMessageAndUser('r', roomId, roomName, user, extraData);                               // 6
};                                                                                                                     // 7
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Rooms.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_channel-settings/server/models/Rooms.js                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.models.Rooms.setDescriptionById = function (_id, description) {                                             // 1
	var query = {                                                                                                         // 2
		_id: _id                                                                                                             // 3
	};                                                                                                                    // 2
	var update = {                                                                                                        // 5
		$set: {                                                                                                              // 6
			description: description                                                                                            // 7
		}                                                                                                                    // 6
	};                                                                                                                    // 5
	return this.update(query, update);                                                                                    // 10
};                                                                                                                     // 11
                                                                                                                       //
RocketChat.models.Rooms.setReadOnlyById = function (_id, readOnly) {                                                   // 13
	var query = {                                                                                                         // 14
		_id: _id                                                                                                             // 15
	};                                                                                                                    // 14
	var update = {                                                                                                        // 17
		$set: {                                                                                                              // 18
			ro: readOnly                                                                                                        // 19
		}                                                                                                                    // 18
	};                                                                                                                    // 17
                                                                                                                       //
	if (readOnly) {                                                                                                       // 22
		RocketChat.models.Subscriptions.findByRoomId(_id).forEach(function (subscription) {                                  // 23
			if (subscription._user == null) {                                                                                   // 24
				return;                                                                                                            // 25
			}                                                                                                                   // 26
                                                                                                                       //
			var user = subscription._user;                                                                                      // 27
                                                                                                                       //
			if (RocketChat.authz.hasPermission(user._id, 'post-readonly') === false) {                                          // 28
				if (!update.$set.muted) {                                                                                          // 29
					update.$set.muted = [];                                                                                           // 30
				}                                                                                                                  // 31
                                                                                                                       //
				return update.$set.muted.push(user.username);                                                                      // 32
			}                                                                                                                   // 33
		});                                                                                                                  // 34
	} else {                                                                                                              // 35
		update.$unset = {                                                                                                    // 36
			muted: ''                                                                                                           // 37
		};                                                                                                                   // 36
	}                                                                                                                     // 39
                                                                                                                       //
	return this.update(query, update);                                                                                    // 40
};                                                                                                                     // 41
                                                                                                                       //
RocketChat.models.Rooms.setAllowReactingWhenReadOnlyById = function (_id, allowReacting) {                             // 43
	var query = {                                                                                                         // 44
		_id: _id                                                                                                             // 45
	};                                                                                                                    // 44
	var update = {                                                                                                        // 47
		$set: {                                                                                                              // 48
			reactWhenReadOnly: allowReacting                                                                                    // 49
		}                                                                                                                    // 48
	};                                                                                                                    // 47
	return this.update(query, update);                                                                                    // 52
};                                                                                                                     // 53
                                                                                                                       //
RocketChat.models.Rooms.setSystemMessagesById = function (_id, systemMessages) {                                       // 55
	var query = {                                                                                                         // 56
		_id: _id                                                                                                             // 57
	};                                                                                                                    // 56
	var update = {                                                                                                        // 59
		$set: {                                                                                                              // 60
			sysMes: systemMessages                                                                                              // 61
		}                                                                                                                    // 60
	};                                                                                                                    // 59
	return this.update(query, update);                                                                                    // 64
};                                                                                                                     // 65
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"startup.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_channel-settings/server/startup.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.startup(function () {                                                                                           // 1
	RocketChat.models.Permissions.upsert('post-readonly', {                                                               // 2
		$setOnInsert: {                                                                                                      // 2
			roles: ['admin', 'owner', 'moderator']                                                                              // 2
		}                                                                                                                    // 2
	});                                                                                                                   // 2
	RocketChat.models.Permissions.upsert('set-readonly', {                                                                // 3
		$setOnInsert: {                                                                                                      // 3
			roles: ['admin', 'owner']                                                                                           // 3
		}                                                                                                                    // 3
	});                                                                                                                   // 3
	RocketChat.models.Permissions.upsert('set-react-when-readonly', {                                                     // 4
		$setOnInsert: {                                                                                                      // 4
			roles: ['admin', 'owner']                                                                                           // 4
		}                                                                                                                    // 4
	});                                                                                                                   // 4
});                                                                                                                    // 5
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:channel-settings/server/functions/saveReactWhenReadOnly.js");
require("./node_modules/meteor/rocketchat:channel-settings/server/functions/saveRoomType.js");
require("./node_modules/meteor/rocketchat:channel-settings/server/functions/saveRoomTopic.js");
require("./node_modules/meteor/rocketchat:channel-settings/server/functions/saveRoomAnnouncement.js");
require("./node_modules/meteor/rocketchat:channel-settings/server/functions/saveRoomName.js");
require("./node_modules/meteor/rocketchat:channel-settings/server/functions/saveRoomReadOnly.js");
require("./node_modules/meteor/rocketchat:channel-settings/server/functions/saveRoomDescription.js");
require("./node_modules/meteor/rocketchat:channel-settings/server/functions/saveRoomSystemMessages.js");
require("./node_modules/meteor/rocketchat:channel-settings/server/methods/saveRoomSettings.js");
require("./node_modules/meteor/rocketchat:channel-settings/server/models/Messages.js");
require("./node_modules/meteor/rocketchat:channel-settings/server/models/Rooms.js");
require("./node_modules/meteor/rocketchat:channel-settings/server/startup.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:channel-settings'] = {};

})();

//# sourceMappingURL=rocketchat_channel-settings.js.map

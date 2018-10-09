(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var ECMAScript = Package.ecmascript.ECMAScript;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RocketChatTabBar = Package['rocketchat:lib'].RocketChatTabBar;
var RocketChatFile = Package['rocketchat:file'].RocketChatFile;
var Random = Package.random.Random;
var _ = Package.underscore._;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;
var meteorInstall = Package.modules.meteorInstall;
var process = Package.modules.process;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:message-snippet":{"server":{"startup":{"settings.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/rocketchat_message-snippet/server/startup/settings.js                                                  //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
Meteor.startup(function () {                                                                                       // 1
	RocketChat.settings.add('Message_AllowSnippeting', false, {                                                       // 2
		type: 'boolean',                                                                                                 // 3
		"public": true,                                                                                                  // 4
		group: 'Message'                                                                                                 // 5
	});                                                                                                               // 2
	RocketChat.models.Permissions.upsert('snippet-message', {                                                         // 7
		$setOnInsert: {                                                                                                  // 8
			roles: ['owner', 'moderator', 'admin']                                                                          // 9
		}                                                                                                                // 8
	});                                                                                                               // 7
});                                                                                                                // 12
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods":{"snippetMessage.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/rocketchat_message-snippet/server/methods/snippetMessage.js                                            //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
Meteor.methods({                                                                                                   // 1
	snippetMessage: function (message, filename) {                                                                    // 2
		if (typeof Meteor.userId() === 'undefined' || Meteor.userId() === null) {                                        // 3
			//noinspection JSUnresolvedFunction                                                                             // 4
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                  // 5
				method: 'snippetMessage'                                                                                       // 6
			});                                                                                                             // 6
		}                                                                                                                // 7
                                                                                                                   //
		var room = RocketChat.models.Rooms.findOne({                                                                     // 9
			_id: message.rid                                                                                                // 9
		});                                                                                                              // 9
                                                                                                                   //
		if (typeof room === 'undefined' || room === null) {                                                              // 11
			return false;                                                                                                   // 12
		}                                                                                                                // 13
                                                                                                                   //
		if (Array.isArray(room.usernames) && room.usernames.indexOf(Meteor.user().username) === -1) {                    // 15
			return false;                                                                                                   // 16
		} // If we keep history of edits, insert a new message to store history information                              // 17
                                                                                                                   //
                                                                                                                   //
		if (RocketChat.settings.get('Message_KeepHistory')) {                                                            // 20
			RocketChat.models.Messages.cloneAndSaveAsHistoryById(message._id);                                              // 21
		}                                                                                                                // 22
                                                                                                                   //
		var me = RocketChat.models.Users.findOneById(Meteor.userId());                                                   // 24
		message.snippeted = true;                                                                                        // 26
		message.snippetedAt = Date.now;                                                                                  // 27
		message.snippetedBy = {                                                                                          // 28
			_id: Meteor.userId(),                                                                                           // 29
			username: me.username                                                                                           // 30
		};                                                                                                               // 28
		message = RocketChat.callbacks.run('beforeSaveMessage', message); // Create the SnippetMessage                   // 33
                                                                                                                   //
		RocketChat.models.Messages.setSnippetedByIdAndUserId(message, filename, message.snippetedBy, message.snippeted, Date.now, filename);
		RocketChat.models.Messages.createWithTypeRoomIdMessageAndUser('message_snippeted', message.rid, '', me, {        // 39
			'snippetId': message._id,                                                                                       // 40
			'snippetName': filename                                                                                         // 40
		});                                                                                                              // 40
	}                                                                                                                 // 41
});                                                                                                                // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"requests.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/rocketchat_message-snippet/server/requests.js                                                          //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
/* global Cookies */WebApp.connectHandlers.use('/snippet/download', function (req, res) {                          // 1
	var rawCookies = void 0;                                                                                          // 3
	var token = void 0;                                                                                               // 4
	var uid = void 0;                                                                                                 // 5
	var cookie = new Cookies();                                                                                       // 6
                                                                                                                   //
	if (req.headers && req.headers.cookie !== null) {                                                                 // 8
		rawCookies = req.headers.cookie;                                                                                 // 9
	}                                                                                                                 // 10
                                                                                                                   //
	if (rawCookies !== null) {                                                                                        // 12
		uid = cookie.get('rc_uid', rawCookies);                                                                          // 13
	}                                                                                                                 // 14
                                                                                                                   //
	if (rawCookies !== null) {                                                                                        // 16
		token = cookie.get('rc_token', rawCookies);                                                                      // 17
	}                                                                                                                 // 18
                                                                                                                   //
	if (uid === null) {                                                                                               // 20
		uid = req.query.rc_uid;                                                                                          // 21
		token = req.query.rc_token;                                                                                      // 22
	}                                                                                                                 // 23
                                                                                                                   //
	var user = RocketChat.models.Users.findOneByIdAndLoginToken(uid, token);                                          // 25
                                                                                                                   //
	if (!(uid && token && user)) {                                                                                    // 27
		res.writeHead(403);                                                                                              // 28
		res.end();                                                                                                       // 29
		return false;                                                                                                    // 30
	}                                                                                                                 // 31
                                                                                                                   //
	var match = /^\/([^\/]+)\/(.*)/.exec(req.url);                                                                    // 32
                                                                                                                   //
	if (match[1]) {                                                                                                   // 34
		var snippet = RocketChat.models.Messages.findOne({                                                               // 35
			'_id': match[1],                                                                                                // 37
			'snippeted': true                                                                                               // 38
		});                                                                                                              // 36
		var room = RocketChat.models.Rooms.findOne({                                                                     // 41
			'_id': snippet.rid,                                                                                             // 41
			'usernames': {                                                                                                  // 41
				'$in': [user.username]                                                                                         // 41
			}                                                                                                               // 41
		});                                                                                                              // 41
                                                                                                                   //
		if (room === undefined) {                                                                                        // 42
			res.writeHead(403);                                                                                             // 43
			res.end();                                                                                                      // 44
			return false;                                                                                                   // 45
		}                                                                                                                // 46
                                                                                                                   //
		res.setHeader('Content-Disposition', "attachment; filename*=UTF-8''" + encodeURIComponent(snippet.snippetName));
		res.setHeader('Content-Type', 'application/octet-stream'); // Removing the ``` contained in the msg.             // 49
                                                                                                                   //
		var snippetContent = snippet.msg.substr(3, snippet.msg.length - 6);                                              // 52
		res.setHeader('Content-Length', snippetContent.length);                                                          // 53
		res.write(snippetContent);                                                                                       // 54
		res.end();                                                                                                       // 55
		return;                                                                                                          // 56
	}                                                                                                                 // 57
                                                                                                                   //
	res.writeHead(404);                                                                                               // 59
	res.end();                                                                                                        // 60
	return;                                                                                                           // 61
});                                                                                                                // 62
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"publications":{"snippetedMessagesByRoom.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/rocketchat_message-snippet/server/publications/snippetedMessagesByRoom.js                              //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
Meteor.publish('snippetedMessages', function (rid) {                                                               // 1
	var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;                               // 1
                                                                                                                   //
	if (typeof this.userId === 'undefined' || this.userId === null) {                                                 // 2
		return this.ready();                                                                                             // 3
	}                                                                                                                 // 4
                                                                                                                   //
	var publication = this;                                                                                           // 6
	var user = RocketChat.models.Users.findOneById(this.userId);                                                      // 8
                                                                                                                   //
	if (typeof user === 'undefined' || user === null) {                                                               // 10
		return this.ready();                                                                                             // 11
	}                                                                                                                 // 12
                                                                                                                   //
	var cursorHandle = RocketChat.models.Messages.findSnippetedByRoom(rid, {                                          // 14
		sort: {                                                                                                          // 17
			ts: -1                                                                                                          // 17
		},                                                                                                               // 17
		limit: limit                                                                                                     // 18
	}).observeChanges({                                                                                               // 16
		added: function (_id, record) {                                                                                  // 21
			publication.added('rocketchat_snippeted_message', _id, record);                                                 // 22
		},                                                                                                               // 23
		changed: function (_id, record) {                                                                                // 24
			publication.changed('rocketchat_snippeted_message', _id, record);                                               // 25
		},                                                                                                               // 26
		removed: function (_id) {                                                                                        // 27
			publication.removed('rocketchat_snippeted_message', _id);                                                       // 28
		}                                                                                                                // 29
	});                                                                                                               // 20
	this.ready();                                                                                                     // 31
                                                                                                                   //
	this.onStop = function () {                                                                                       // 33
		cursorHandle.stop();                                                                                             // 34
	};                                                                                                                // 35
});                                                                                                                // 36
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"snippetedMessage.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/rocketchat_message-snippet/server/publications/snippetedMessage.js                                     //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
Meteor.publish('snippetedMessage', function (_id) {                                                                // 1
	if (typeof this.userId === 'undefined' || this.userId === null) {                                                 // 2
		return this.ready();                                                                                             // 3
	}                                                                                                                 // 4
                                                                                                                   //
	var snippet = RocketChat.models.Messages.findOne({                                                                // 6
		_id: _id,                                                                                                        // 6
		snippeted: true                                                                                                  // 6
	});                                                                                                               // 6
	var user = RocketChat.models.Users.findOneById(this.userId);                                                      // 7
	var roomSnippetQuery = {                                                                                          // 8
		'_id': snippet.rid,                                                                                              // 9
		'usernames': {                                                                                                   // 10
			'$in': [user.username]                                                                                          // 11
		}                                                                                                                // 10
	};                                                                                                                // 8
                                                                                                                   //
	if (RocketChat.models.Rooms.findOne(roomSnippetQuery) === undefined) {                                            // 17
		return this.ready();                                                                                             // 18
	}                                                                                                                 // 19
                                                                                                                   //
	var publication = this;                                                                                           // 21
                                                                                                                   //
	if (typeof user === 'undefined' || user === null) {                                                               // 24
		return this.ready();                                                                                             // 25
	}                                                                                                                 // 26
                                                                                                                   //
	var cursor = RocketChat.models.Messages.find({                                                                    // 28
		_id: _id                                                                                                         // 29
	}).observeChanges({                                                                                               // 29
		added: function (_id, record) {                                                                                  // 31
			publication.added('rocketchat_snippeted_message', _id, record);                                                 // 32
		},                                                                                                               // 33
		changed: function (_id, record) {                                                                                // 34
			publication.changed('rocketchat_snippeted_message', _id, record);                                               // 35
		},                                                                                                               // 36
		removed: function (_id) {                                                                                        // 37
			publication.removed('rocketchat_snippeted_message', _id);                                                       // 38
		}                                                                                                                // 39
	});                                                                                                               // 30
	this.ready();                                                                                                     // 42
                                                                                                                   //
	this.onStop = function () {                                                                                       // 44
		cursor.stop();                                                                                                   // 45
	};                                                                                                                // 46
});                                                                                                                // 47
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:message-snippet/server/startup/settings.js");
require("./node_modules/meteor/rocketchat:message-snippet/server/methods/snippetMessage.js");
require("./node_modules/meteor/rocketchat:message-snippet/server/requests.js");
require("./node_modules/meteor/rocketchat:message-snippet/server/publications/snippetedMessagesByRoom.js");
require("./node_modules/meteor/rocketchat:message-snippet/server/publications/snippetedMessage.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:message-snippet'] = {};

})();

//# sourceMappingURL=rocketchat_message-snippet.js.map

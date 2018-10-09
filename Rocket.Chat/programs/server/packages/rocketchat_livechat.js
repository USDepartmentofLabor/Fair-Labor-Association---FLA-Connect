(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;
var Autoupdate = Package.autoupdate.Autoupdate;
var ECMAScript = Package.ecmascript.ECMAScript;
var s = Package['underscorestring:underscore.string'].s;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RocketChatTabBar = Package['rocketchat:lib'].RocketChatTabBar;
var Logger = Package['rocketchat:logger'].Logger;
var SystemLogger = Package['rocketchat:logger'].SystemLogger;
var LoggerManager = Package['rocketchat:logger'].LoggerManager;
var Streamer = Package['rocketchat:streamer'].Streamer;
var UserPresence = Package['konecty:user-presence'].UserPresence;
var UserPresenceMonitor = Package['konecty:user-presence'].UserPresenceMonitor;
var fileUpload = Package['rocketchat:ui'].fileUpload;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;
var check = Package.check.check;
var Match = Package.check.Match;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var DDPRateLimiter = Package['ddp-rate-limiter'].DDPRateLimiter;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
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
var emailSettings, self, exports;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:livechat":{"livechat.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/livechat.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var url = void 0;                                                                                                      // 1
module.watch(require("url"), {                                                                                         // 1
	"default": function (v) {                                                                                             // 1
		url = v;                                                                                                             // 1
	}                                                                                                                     // 1
}, 0);                                                                                                                 // 1
WebApp = Package.webapp.WebApp;                                                                                        // 4
var Autoupdate = Package.autoupdate.Autoupdate;                                                                        // 5
WebApp.connectHandlers.use('/livechat', Meteor.bindEnvironment(function (req, res, next) {                             // 7
	var reqUrl = url.parse(req.url);                                                                                      // 8
                                                                                                                       //
	if (reqUrl.pathname !== '/') {                                                                                        // 9
		return next();                                                                                                       // 10
	}                                                                                                                     // 11
                                                                                                                       //
	res.setHeader('content-type', 'text/html; charset=utf-8');                                                            // 12
	var domainWhiteList = RocketChat.settings.get('Livechat_AllowedDomainsList');                                         // 14
                                                                                                                       //
	if (req.headers.referer && !_.isEmpty(domainWhiteList.trim())) {                                                      // 15
		domainWhiteList = _.map(domainWhiteList.split(','), function (domain) {                                              // 16
			return domain.trim();                                                                                               // 17
		});                                                                                                                  // 18
		var referer = url.parse(req.headers.referer);                                                                        // 20
                                                                                                                       //
		if (!_.contains(domainWhiteList, referer.host)) {                                                                    // 21
			res.setHeader('X-FRAME-OPTIONS', 'DENY');                                                                           // 22
			return next();                                                                                                      // 23
		}                                                                                                                    // 24
                                                                                                                       //
		res.setHeader('X-FRAME-OPTIONS', "ALLOW-FROM " + referer.protocol + "//" + referer.host);                            // 26
	}                                                                                                                     // 27
                                                                                                                       //
	var head = Assets.getText('public/head.html');                                                                        // 29
	var html = "<html>\n\t\t<head>\n\t\t\t<link rel=\"stylesheet\" type=\"text/css\" class=\"__meteor-css__\" href=\"/livechat/livechat.css?_dc=" + Autoupdate.autoupdateVersion + "\">\n\t\t\t<script type=\"text/javascript\">\n\t\t\t\t__meteor_runtime_config__ = " + JSON.stringify(__meteor_runtime_config__) + ";\n\t\t\t</script>\n\n\t\t\t" + head + "\n\t\t</head>\n\t\t<body>\n\t\t\t<script type=\"text/javascript\" src=\"/livechat/livechat.js?_dc=" + Autoupdate.autoupdateVersion + "\"></script>\n\t\t</body>\n\t</html>";
	res.write(html);                                                                                                      // 45
	res.end();                                                                                                            // 46
}));                                                                                                                   // 47
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"server":{"startup.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/startup.js                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.startup(function () {                                                                                           // 1
	RocketChat.roomTypes.setRoomFind('l', function (code) {                                                               // 2
		return RocketChat.models.Rooms.findLivechatByCode(code);                                                             // 3
	});                                                                                                                   // 4
	RocketChat.authz.addRoomAccessValidator(function (room, user) {                                                       // 6
		return room.t === 'l' && RocketChat.authz.hasPermission(user._id, 'view-livechat-rooms');                            // 7
	});                                                                                                                   // 8
	RocketChat.authz.addRoomAccessValidator(function (room, user) {                                                       // 10
		return room.t === 'l' && room.v && room.v._id === user._id;                                                          // 11
	});                                                                                                                   // 12
	RocketChat.callbacks.add('beforeLeaveRoom', function (user, room) {                                                   // 14
		if (room.t !== 'l') {                                                                                                // 15
			return user;                                                                                                        // 16
		}                                                                                                                    // 17
                                                                                                                       //
		throw new Meteor.Error(TAPi18n.__('You_cant_leave_a_livechat_room_Please_use_the_close_button', {                    // 18
			lng: user.language || RocketChat.settings.get('language') || 'en'                                                   // 19
		}));                                                                                                                 // 18
	}, RocketChat.callbacks.priority.LOW, 'cant-leave-room');                                                             // 21
});                                                                                                                    // 22
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"hooks":{"externalMessage.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/hooks/externalMessage.js                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals HTTP, SystemLogger */var knowledgeEnabled = false;                                                          // 1
var apiaiKey = '';                                                                                                     // 4
var apiaiLanguage = 'en';                                                                                              // 5
RocketChat.settings.get('Livechat_Knowledge_Enabled', function (key, value) {                                          // 6
	knowledgeEnabled = value;                                                                                             // 7
});                                                                                                                    // 8
RocketChat.settings.get('Livechat_Knowledge_Apiai_Key', function (key, value) {                                        // 9
	apiaiKey = value;                                                                                                     // 10
});                                                                                                                    // 11
RocketChat.settings.get('Livechat_Knowledge_Apiai_Language', function (key, value) {                                   // 12
	apiaiLanguage = value;                                                                                                // 13
});                                                                                                                    // 14
RocketChat.callbacks.add('afterSaveMessage', function (message, room) {                                                // 16
	// skips this callback if the message was edited                                                                      // 17
	if (!message || message.editedAt) {                                                                                   // 18
		return message;                                                                                                      // 19
	}                                                                                                                     // 20
                                                                                                                       //
	if (!knowledgeEnabled) {                                                                                              // 22
		return message;                                                                                                      // 23
	}                                                                                                                     // 24
                                                                                                                       //
	if (!(typeof room.t !== 'undefined' && room.t === 'l' && room.v && room.v.token)) {                                   // 26
		return message;                                                                                                      // 27
	} // if the message hasn't a token, it was not sent by the visitor, so ignore it                                      // 28
                                                                                                                       //
                                                                                                                       //
	if (!message.token) {                                                                                                 // 31
		return message;                                                                                                      // 32
	}                                                                                                                     // 33
                                                                                                                       //
	Meteor.defer(function () {                                                                                            // 35
		try {                                                                                                                // 36
			var response = HTTP.post('https://api.api.ai/api/query?v=20150910', {                                               // 37
				data: {                                                                                                            // 38
					query: message.msg,                                                                                               // 39
					lang: apiaiLanguage,                                                                                              // 40
					sessionId: room._id                                                                                               // 41
				},                                                                                                                 // 38
				headers: {                                                                                                         // 43
					'Content-Type': 'application/json; charset=utf-8',                                                                // 44
					'Authorization': "Bearer " + apiaiKey                                                                             // 45
				}                                                                                                                  // 43
			});                                                                                                                 // 37
                                                                                                                       //
			if (response.data && response.data.status.code === 200 && !_.isEmpty(response.data.result.fulfillment.speech)) {    // 49
				RocketChat.models.LivechatExternalMessage.insert({                                                                 // 50
					rid: message.rid,                                                                                                 // 51
					msg: response.data.result.fulfillment.speech,                                                                     // 52
					orig: message._id,                                                                                                // 53
					ts: new Date()                                                                                                    // 54
				});                                                                                                                // 50
			}                                                                                                                   // 56
		} catch (e) {                                                                                                        // 57
			SystemLogger.error('Error using Api.ai ->', e);                                                                     // 58
		}                                                                                                                    // 59
	});                                                                                                                   // 60
	return message;                                                                                                       // 62
}, RocketChat.callbacks.priority.LOW, 'externalWebHook');                                                              // 63
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"markRoomResponded.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/hooks/markRoomResponded.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.callbacks.add('afterSaveMessage', function (message, room) {                                                // 1
	// skips this callback if the message was edited                                                                      // 2
	if (!message || message.editedAt) {                                                                                   // 3
		return message;                                                                                                      // 4
	} // check if room is yet awaiting for response                                                                       // 5
                                                                                                                       //
                                                                                                                       //
	if (!(typeof room.t !== 'undefined' && room.t === 'l' && room.waitingResponse)) {                                     // 8
		return message;                                                                                                      // 9
	} // if the message has a token, it was sent by the visitor, so ignore it                                             // 10
                                                                                                                       //
                                                                                                                       //
	if (message.token) {                                                                                                  // 13
		return message;                                                                                                      // 14
	}                                                                                                                     // 15
                                                                                                                       //
	Meteor.defer(function () {                                                                                            // 17
		var now = new Date();                                                                                                // 18
		RocketChat.models.Rooms.setResponseByRoomId(room._id, {                                                              // 19
			user: {                                                                                                             // 20
				_id: message.u._id,                                                                                                // 21
				username: message.u.username                                                                                       // 22
			},                                                                                                                  // 20
			responseDate: now,                                                                                                  // 24
			responseTime: (now.getTime() - room.ts) / 1000                                                                      // 25
		});                                                                                                                  // 19
	});                                                                                                                   // 27
	return message;                                                                                                       // 29
}, RocketChat.callbacks.priority.LOW, 'markRoomResponded');                                                            // 30
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"offlineMessage.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/hooks/offlineMessage.js                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.callbacks.add('livechat.offlineMessage', function (data) {                                                  // 1
	if (!RocketChat.settings.get('Livechat_webhook_on_offline_msg')) {                                                    // 2
		return data;                                                                                                         // 3
	}                                                                                                                     // 4
                                                                                                                       //
	var postData = {                                                                                                      // 6
		type: 'LivechatOfflineMessage',                                                                                      // 7
		sentAt: new Date(),                                                                                                  // 8
		visitor: {                                                                                                           // 9
			name: data.name,                                                                                                    // 10
			email: data.email                                                                                                   // 11
		},                                                                                                                   // 9
		message: data.message                                                                                                // 13
	};                                                                                                                    // 6
	RocketChat.Livechat.sendRequest(postData);                                                                            // 16
}, RocketChat.callbacks.priority.MEDIUM, 'livechat-send-email-offline-message');                                       // 17
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"sendToCRM.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/hooks/sendToCRM.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
function sendToCRM(hook, room) {                                                                                       // 1
	if (!RocketChat.settings.get('Livechat_webhook_on_close')) {                                                          // 2
		return room;                                                                                                         // 3
	} // Do not send to CRM if the chat is still open                                                                     // 4
                                                                                                                       //
                                                                                                                       //
	if (hook === 'saveLivechatInfo' && room.open) {                                                                       // 7
		return room;                                                                                                         // 8
	}                                                                                                                     // 9
                                                                                                                       //
	var postData = RocketChat.Livechat.getLivechatRoomGuestInfo(room);                                                    // 11
                                                                                                                       //
	if (hook === 'closeRoom') {                                                                                           // 12
		postData.type = 'LivechatSession';                                                                                   // 13
	} else if (hook === 'saveLivechatInfo') {                                                                             // 14
		postData.type = 'LivechatEdit';                                                                                      // 15
	}                                                                                                                     // 16
                                                                                                                       //
	postData.messages = [];                                                                                               // 18
	RocketChat.models.Messages.findVisibleByRoomId(room._id, {                                                            // 20
		sort: {                                                                                                              // 20
			ts: 1                                                                                                               // 20
		}                                                                                                                    // 20
	}).forEach(function (message) {                                                                                       // 20
		if (message.t) {                                                                                                     // 21
			return;                                                                                                             // 22
		}                                                                                                                    // 23
                                                                                                                       //
		var msg = {                                                                                                          // 24
			username: message.u.username,                                                                                       // 25
			msg: message.msg,                                                                                                   // 26
			ts: message.ts                                                                                                      // 27
		};                                                                                                                   // 24
                                                                                                                       //
		if (message.u.username !== postData.visitor.username) {                                                              // 30
			msg.agentId = message.u._id;                                                                                        // 31
		}                                                                                                                    // 32
                                                                                                                       //
		postData.messages.push(msg);                                                                                         // 33
	});                                                                                                                   // 34
	var response = RocketChat.Livechat.sendRequest(postData);                                                             // 36
                                                                                                                       //
	if (response && response.data && response.data.data) {                                                                // 38
		RocketChat.models.Rooms.saveCRMDataByRoomId(room._id, response.data.data);                                           // 39
	}                                                                                                                     // 40
                                                                                                                       //
	return room;                                                                                                          // 42
}                                                                                                                      // 43
                                                                                                                       //
RocketChat.callbacks.add('livechat.closeRoom', function (room) {                                                       // 45
	return sendToCRM('closeRoom', room);                                                                                  // 46
}, RocketChat.callbacks.priority.MEDIUM, 'livechat-send-crm-close-room');                                              // 47
RocketChat.callbacks.add('livechat.saveInfo', function (room) {                                                        // 49
	return sendToCRM('saveLivechatInfo', room);                                                                           // 50
}, RocketChat.callbacks.priority.MEDIUM, 'livechat-send-crm-save-info');                                               // 51
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods":{"addAgent.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/addAgent.js                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:addAgent': function (username) {                                                                            // 2
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                 // 3
			throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                        // 4
				method: 'livechat:addAgent'                                                                                        // 4
			});                                                                                                                 // 4
		}                                                                                                                    // 5
                                                                                                                       //
		return RocketChat.Livechat.addAgent(username);                                                                       // 7
	}                                                                                                                     // 8
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"addManager.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/addManager.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:addManager': function (username) {                                                                          // 2
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                 // 3
			throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                        // 4
				method: 'livechat:addManager'                                                                                      // 4
			});                                                                                                                 // 4
		}                                                                                                                    // 5
                                                                                                                       //
		return RocketChat.Livechat.addManager(username);                                                                     // 7
	}                                                                                                                     // 8
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"changeLivechatStatus.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/changeLivechatStatus.js                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:changeLivechatStatus': function () {                                                                        // 2
		if (!Meteor.userId()) {                                                                                              // 3
			throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                        // 4
				method: 'livechat:changeLivechatStatus'                                                                            // 4
			});                                                                                                                 // 4
		}                                                                                                                    // 5
                                                                                                                       //
		var user = Meteor.user();                                                                                            // 7
		var newStatus = user.statusLivechat === 'available' ? 'not-available' : 'available';                                 // 9
		return RocketChat.models.Users.setLivechatStatus(user._id, newStatus);                                               // 11
	}                                                                                                                     // 12
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"closeByVisitor.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/closeByVisitor.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:closeByVisitor': function (roomId) {                                                                        // 2
		if (!Meteor.userId()) {                                                                                              // 3
			throw new Meteor.Error('error-not-authorized', 'Not authorized', {                                                  // 4
				method: 'livechat:closeByVisitor'                                                                                  // 4
			});                                                                                                                 // 4
		}                                                                                                                    // 5
                                                                                                                       //
		var room = RocketChat.models.Rooms.findOneOpenByVisitorId(Meteor.userId(), roomId);                                  // 7
                                                                                                                       //
		if (!room || !room.open) {                                                                                           // 9
			return false;                                                                                                       // 10
		}                                                                                                                    // 11
                                                                                                                       //
		var user = Meteor.user();                                                                                            // 13
		var language = user && user.language || RocketChat.settings.get('language') || 'en';                                 // 15
		return RocketChat.Livechat.closeRoom({                                                                               // 17
			user: user,                                                                                                         // 18
			room: room,                                                                                                         // 19
			comment: TAPi18n.__('Closed_by_visitor', {                                                                          // 20
				lng: language                                                                                                      // 20
			})                                                                                                                  // 20
		});                                                                                                                  // 17
	}                                                                                                                     // 22
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"closeRoom.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/closeRoom.js                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:closeRoom': function (roomId, comment) {                                                                    // 2
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'close-livechat-room')) {                   // 3
			throw new Meteor.Error('error-not-authorized', 'Not authorized', {                                                  // 4
				method: 'livechat:closeRoom'                                                                                       // 4
			});                                                                                                                 // 4
		}                                                                                                                    // 5
                                                                                                                       //
		var room = RocketChat.models.Rooms.findOneById(roomId);                                                              // 7
		var user = Meteor.user();                                                                                            // 9
                                                                                                                       //
		if (room.usernames.indexOf(user.username) === -1 && !RocketChat.authz.hasPermission(Meteor.userId(), 'close-others-livechat-room')) {
			throw new Meteor.Error('error-not-authorized', 'Not authorized', {                                                  // 12
				method: 'livechat:closeRoom'                                                                                       // 12
			});                                                                                                                 // 12
		}                                                                                                                    // 13
                                                                                                                       //
		return RocketChat.Livechat.closeRoom({                                                                               // 15
			user: user,                                                                                                         // 16
			room: room,                                                                                                         // 17
			comment: comment                                                                                                    // 18
		});                                                                                                                  // 15
	}                                                                                                                     // 20
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getCustomFields.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/getCustomFields.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:getCustomFields': function () {                                                                             // 2
		return RocketChat.models.LivechatCustomField.find().fetch();                                                         // 3
	}                                                                                                                     // 4
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getAgentData.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/getAgentData.js                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:getAgentData': function (roomId) {                                                                          // 2
		check(roomId, String);                                                                                               // 3
		var room = RocketChat.models.Rooms.findOneById(roomId);                                                              // 5
		var user = Meteor.user(); // allow to only user to send transcripts from their own chats                             // 6
                                                                                                                       //
		if (!room || room.t !== 'l' || !room.v || !user.profile || room.v.token !== user.profile.token) {                    // 9
			throw new Meteor.Error('error-invalid-room', 'Invalid room');                                                       // 10
		}                                                                                                                    // 11
                                                                                                                       //
		if (!room.servedBy) {                                                                                                // 13
			return;                                                                                                             // 14
		}                                                                                                                    // 15
                                                                                                                       //
		return RocketChat.models.Users.getAgentInfo(room.servedBy._id);                                                      // 17
	}                                                                                                                     // 18
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getInitialData.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/getInitialData.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:getInitialData': function (visitorToken) {                                                                  // 2
		var info = {                                                                                                         // 3
			enabled: null,                                                                                                      // 4
			title: null,                                                                                                        // 5
			color: null,                                                                                                        // 6
			registrationForm: null,                                                                                             // 7
			room: null,                                                                                                         // 8
			triggers: [],                                                                                                       // 9
			departments: [],                                                                                                    // 10
			allowSwitchingDepartments: null,                                                                                    // 11
			online: true,                                                                                                       // 12
			offlineColor: null,                                                                                                 // 13
			offlineMessage: null,                                                                                               // 14
			offlineSuccessMessage: null,                                                                                        // 15
			offlineUnavailableMessage: null,                                                                                    // 16
			displayOfflineForm: null,                                                                                           // 17
			videoCall: null                                                                                                     // 18
		};                                                                                                                   // 3
		var room = RocketChat.models.Rooms.findOpenByVisitorToken(visitorToken, {                                            // 21
			fields: {                                                                                                           // 22
				name: 1,                                                                                                           // 23
				t: 1,                                                                                                              // 24
				cl: 1,                                                                                                             // 25
				u: 1,                                                                                                              // 26
				usernames: 1,                                                                                                      // 27
				v: 1,                                                                                                              // 28
				servedBy: 1                                                                                                        // 29
			}                                                                                                                   // 22
		}).fetch();                                                                                                          // 21
                                                                                                                       //
		if (room && room.length > 0) {                                                                                       // 33
			info.room = room[0];                                                                                                // 34
		}                                                                                                                    // 35
                                                                                                                       //
		var initSettings = RocketChat.Livechat.getInitSettings();                                                            // 37
		info.title = initSettings.Livechat_title;                                                                            // 39
		info.color = initSettings.Livechat_title_color;                                                                      // 40
		info.enabled = initSettings.Livechat_enabled;                                                                        // 41
		info.registrationForm = initSettings.Livechat_registration_form;                                                     // 42
		info.offlineTitle = initSettings.Livechat_offline_title;                                                             // 43
		info.offlineColor = initSettings.Livechat_offline_title_color;                                                       // 44
		info.offlineMessage = initSettings.Livechat_offline_message;                                                         // 45
		info.offlineSuccessMessage = initSettings.Livechat_offline_success_message;                                          // 46
		info.offlineUnavailableMessage = initSettings.Livechat_offline_form_unavailable;                                     // 47
		info.displayOfflineForm = initSettings.Livechat_display_offline_form;                                                // 48
		info.language = initSettings.Language;                                                                               // 49
		info.videoCall = initSettings.Livechat_videocall_enabled === true && initSettings.Jitsi_Enabled === true;            // 50
		info.transcript = initSettings.Livechat_enable_transcript;                                                           // 51
		info.transcriptMessage = initSettings.Livechat_transcript_message;                                                   // 52
		info.agentData = room && room[0] && room[0].servedBy && RocketChat.models.Users.getAgentInfo(room[0].servedBy._id);  // 54
		RocketChat.models.LivechatTrigger.findEnabled().forEach(function (trigger) {                                         // 56
			info.triggers.push(_.pick(trigger, '_id', 'actions', 'conditions'));                                                // 57
		});                                                                                                                  // 58
		RocketChat.models.LivechatDepartment.findEnabledWithAgents().forEach(function (department) {                         // 60
			info.departments.push(department);                                                                                  // 61
		});                                                                                                                  // 62
		info.allowSwitchingDepartments = initSettings.Livechat_allow_switching_departments;                                  // 63
		info.online = RocketChat.models.Users.findOnlineAgents().count() > 0;                                                // 65
		return info;                                                                                                         // 67
	}                                                                                                                     // 68
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"loginByToken.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/loginByToken.js                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:loginByToken': function (token) {                                                                           // 2
		var user = RocketChat.models.Users.getVisitorByToken(token, {                                                        // 3
			fields: {                                                                                                           // 3
				_id: 1                                                                                                             // 3
			}                                                                                                                   // 3
		});                                                                                                                  // 3
                                                                                                                       //
		if (!user) {                                                                                                         // 5
			return;                                                                                                             // 6
		}                                                                                                                    // 7
                                                                                                                       //
		var stampedToken = Accounts._generateStampedLoginToken();                                                            // 9
                                                                                                                       //
		var hashStampedToken = Accounts._hashStampedToken(stampedToken);                                                     // 10
                                                                                                                       //
		var updateUser = {                                                                                                   // 12
			$set: {                                                                                                             // 13
				services: {                                                                                                        // 14
					resume: {                                                                                                         // 15
						loginTokens: [hashStampedToken]                                                                                  // 16
					}                                                                                                                 // 15
				}                                                                                                                  // 14
			}                                                                                                                   // 13
		};                                                                                                                   // 12
		Meteor.users.update(user._id, updateUser);                                                                           // 22
		return {                                                                                                             // 24
			token: stampedToken.token                                                                                           // 25
		};                                                                                                                   // 24
	}                                                                                                                     // 27
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"pageVisited.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/pageVisited.js                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:pageVisited': function (token, pageInfo) {                                                                  // 2
		return RocketChat.Livechat.savePageHistory(token, pageInfo);                                                         // 3
	}                                                                                                                     // 4
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"registerGuest.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/registerGuest.js                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:registerGuest': function () {                                                                               // 2
		var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},                                   // 2
		    token = _ref.token,                                                                                              // 2
		    name = _ref.name,                                                                                                // 2
		    email = _ref.email,                                                                                              // 2
		    department = _ref.department;                                                                                    // 2
                                                                                                                       //
		var stampedToken = Accounts._generateStampedLoginToken();                                                            // 3
                                                                                                                       //
		var hashStampedToken = Accounts._hashStampedToken(stampedToken);                                                     // 4
                                                                                                                       //
		var userId = RocketChat.Livechat.registerGuest.call(this, {                                                          // 6
			token: token,                                                                                                       // 7
			name: name,                                                                                                         // 8
			email: email,                                                                                                       // 9
			department: department,                                                                                             // 10
			loginToken: hashStampedToken                                                                                        // 11
		}); // update visited page history to not expire                                                                     // 6
                                                                                                                       //
		RocketChat.models.LivechatPageVisited.keepHistoryForToken(token);                                                    // 15
		return {                                                                                                             // 17
			userId: userId,                                                                                                     // 18
			token: stampedToken.token                                                                                           // 19
		};                                                                                                                   // 17
	}                                                                                                                     // 21
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"removeAgent.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/removeAgent.js                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:removeAgent': function (username) {                                                                         // 2
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                 // 3
			throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                        // 4
				method: 'livechat:removeAgent'                                                                                     // 4
			});                                                                                                                 // 4
		}                                                                                                                    // 5
                                                                                                                       //
		return RocketChat.Livechat.removeAgent(username);                                                                    // 7
	}                                                                                                                     // 8
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"removeCustomField.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/removeCustomField.js                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:removeCustomField': function (_id) {                                                                        // 2
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                 // 3
			throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                        // 4
				method: 'livechat:removeCustomField'                                                                               // 4
			});                                                                                                                 // 4
		}                                                                                                                    // 5
                                                                                                                       //
		check(_id, String);                                                                                                  // 7
		var customField = RocketChat.models.LivechatCustomField.findOneById(_id, {                                           // 9
			fields: {                                                                                                           // 9
				_id: 1                                                                                                             // 9
			}                                                                                                                   // 9
		});                                                                                                                  // 9
                                                                                                                       //
		if (!customField) {                                                                                                  // 11
			throw new Meteor.Error('error-invalid-custom-field', 'Custom field not found', {                                    // 12
				method: 'livechat:removeCustomField'                                                                               // 12
			});                                                                                                                 // 12
		}                                                                                                                    // 13
                                                                                                                       //
		return RocketChat.models.LivechatCustomField.removeById(_id);                                                        // 15
	}                                                                                                                     // 16
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"removeDepartment.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/removeDepartment.js                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:removeDepartment': function (_id) {                                                                         // 2
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                 // 3
			throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                        // 4
				method: 'livechat:removeDepartment'                                                                                // 4
			});                                                                                                                 // 4
		}                                                                                                                    // 5
                                                                                                                       //
		return RocketChat.Livechat.removeDepartment(_id);                                                                    // 7
	}                                                                                                                     // 8
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"removeManager.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/removeManager.js                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:removeManager': function (username) {                                                                       // 2
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                 // 3
			throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                        // 4
				method: 'livechat:removeManager'                                                                                   // 4
			});                                                                                                                 // 4
		}                                                                                                                    // 5
                                                                                                                       //
		return RocketChat.Livechat.removeManager(username);                                                                  // 7
	}                                                                                                                     // 8
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"removeTrigger.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/removeTrigger.js                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:removeTrigger': function (triggerId) {                                                                      // 2
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                 // 3
			throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                        // 4
				method: 'livechat:removeTrigger'                                                                                   // 4
			});                                                                                                                 // 4
		}                                                                                                                    // 5
                                                                                                                       //
		check(triggerId, String);                                                                                            // 7
		return RocketChat.models.LivechatTrigger.removeById(triggerId);                                                      // 9
	}                                                                                                                     // 10
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"saveAppearance.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/saveAppearance.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:saveAppearance': function (settings) {                                                                      // 2
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                 // 3
			throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                        // 4
				method: 'livechat:saveAppearance'                                                                                  // 4
			});                                                                                                                 // 4
		}                                                                                                                    // 5
                                                                                                                       //
		var validSettings = ['Livechat_title', 'Livechat_title_color', 'Livechat_display_offline_form', 'Livechat_offline_form_unavailable', 'Livechat_offline_message', 'Livechat_offline_success_message', 'Livechat_offline_title', 'Livechat_offline_title_color', 'Livechat_offline_email'];
		var valid = settings.every(function (setting) {                                                                      // 19
			return validSettings.indexOf(setting._id) !== -1;                                                                   // 20
		});                                                                                                                  // 21
                                                                                                                       //
		if (!valid) {                                                                                                        // 23
			throw new Meteor.Error('invalid-setting');                                                                          // 24
		}                                                                                                                    // 25
                                                                                                                       //
		settings.forEach(function (setting) {                                                                                // 27
			RocketChat.settings.updateById(setting._id, setting.value);                                                         // 28
		});                                                                                                                  // 29
		return;                                                                                                              // 31
	}                                                                                                                     // 32
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"saveCustomField.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/saveCustomField.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* eslint new-cap: [2, {"capIsNewExceptions": ["Match.ObjectIncluding", "Match.Optional"]}] */Meteor.methods({         // 1
	'livechat:saveCustomField': function (_id, customFieldData) {                                                         // 4
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                 // 5
			throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                        // 6
				method: 'livechat:saveCustomField'                                                                                 // 6
			});                                                                                                                 // 6
		}                                                                                                                    // 7
                                                                                                                       //
		if (_id) {                                                                                                           // 9
			check(_id, String);                                                                                                 // 10
		}                                                                                                                    // 11
                                                                                                                       //
		check(customFieldData, Match.ObjectIncluding({                                                                       // 13
			field: String,                                                                                                      // 13
			label: String,                                                                                                      // 13
			scope: String,                                                                                                      // 13
			visibility: String                                                                                                  // 13
		}));                                                                                                                 // 13
                                                                                                                       //
		if (!/^[0-9a-zA-Z-_]+$/.test(customFieldData.field)) {                                                               // 15
			throw new Meteor.Error('error-invalid-custom-field-nmae', 'Invalid custom field name. Use only letters, numbers, hyphens and underscores.', {
				method: 'livechat:saveCustomField'                                                                                 // 16
			});                                                                                                                 // 16
		}                                                                                                                    // 17
                                                                                                                       //
		if (_id) {                                                                                                           // 19
			var customField = RocketChat.models.LivechatCustomField.findOneById(_id);                                           // 20
                                                                                                                       //
			if (!customField) {                                                                                                 // 21
				throw new Meteor.Error('error-invalid-custom-field', 'Custom Field Not found', {                                   // 22
					method: 'livechat:saveCustomField'                                                                                // 22
				});                                                                                                                // 22
			}                                                                                                                   // 23
		}                                                                                                                    // 24
                                                                                                                       //
		return RocketChat.models.LivechatCustomField.createOrUpdateCustomField(_id, customFieldData.field, customFieldData.label, customFieldData.scope, customFieldData.visibility);
	}                                                                                                                     // 27
});                                                                                                                    // 3
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"saveDepartment.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/saveDepartment.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:saveDepartment': function (_id, departmentData, departmentAgents) {                                         // 2
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                 // 3
			throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                        // 4
				method: 'livechat:saveDepartment'                                                                                  // 4
			});                                                                                                                 // 4
		}                                                                                                                    // 5
                                                                                                                       //
		return RocketChat.Livechat.saveDepartment(_id, departmentData, departmentAgents);                                    // 7
	}                                                                                                                     // 8
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"saveInfo.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/saveInfo.js                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* eslint new-cap: [2, {"capIsNewExceptions": ["Match.ObjectIncluding", "Match.Optional"]}] */Meteor.methods({         // 1
	'livechat:saveInfo': function (guestData, roomData) {                                                                 // 4
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-l-room')) {                           // 5
			throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                        // 6
				method: 'livechat:saveInfo'                                                                                        // 6
			});                                                                                                                 // 6
		}                                                                                                                    // 7
                                                                                                                       //
		check(guestData, Match.ObjectIncluding({                                                                             // 9
			_id: String,                                                                                                        // 10
			name: Match.Optional(String),                                                                                       // 11
			email: Match.Optional(String),                                                                                      // 12
			phone: Match.Optional(String)                                                                                       // 13
		}));                                                                                                                 // 9
		check(roomData, Match.ObjectIncluding({                                                                              // 16
			_id: String,                                                                                                        // 17
			topic: Match.Optional(String),                                                                                      // 18
			tags: Match.Optional(String)                                                                                        // 19
		}));                                                                                                                 // 16
		var room = RocketChat.models.Rooms.findOneById(roomData._id, {                                                       // 22
			fields: {                                                                                                           // 22
				t: 1,                                                                                                              // 22
				servedBy: 1                                                                                                        // 22
			}                                                                                                                   // 22
		});                                                                                                                  // 22
                                                                                                                       //
		if (room == null || room.t !== 'l') {                                                                                // 24
			throw new Meteor.Error('error-invalid-room', 'Invalid room', {                                                      // 25
				method: 'livechat:saveInfo'                                                                                        // 25
			});                                                                                                                 // 25
		}                                                                                                                    // 26
                                                                                                                       //
		if ((!room.servedBy || room.servedBy._id !== Meteor.userId()) && !RocketChat.authz.hasPermission(Meteor.userId(), 'save-others-livechat-room-info')) {
			throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                        // 29
				method: 'livechat:saveInfo'                                                                                        // 29
			});                                                                                                                 // 29
		}                                                                                                                    // 30
                                                                                                                       //
		var ret = RocketChat.Livechat.saveGuest(guestData) && RocketChat.Livechat.saveRoomInfo(roomData, guestData);         // 32
		Meteor.defer(function () {                                                                                           // 34
			RocketChat.callbacks.run('livechat.saveInfo', RocketChat.models.Rooms.findOneById(roomData._id));                   // 35
		});                                                                                                                  // 36
		return ret;                                                                                                          // 38
	}                                                                                                                     // 39
});                                                                                                                    // 3
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"saveIntegration.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/saveIntegration.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:saveIntegration': function (values) {                                                                       // 2
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                 // 3
			throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                        // 4
				method: 'livechat:saveIntegration'                                                                                 // 4
			});                                                                                                                 // 4
		}                                                                                                                    // 5
                                                                                                                       //
		if (typeof values['Livechat_webhookUrl'] !== 'undefined') {                                                          // 7
			RocketChat.settings.updateById('Livechat_webhookUrl', s.trim(values['Livechat_webhookUrl']));                       // 8
		}                                                                                                                    // 9
                                                                                                                       //
		if (typeof values['Livechat_secret_token'] !== 'undefined') {                                                        // 11
			RocketChat.settings.updateById('Livechat_secret_token', s.trim(values['Livechat_secret_token']));                   // 12
		}                                                                                                                    // 13
                                                                                                                       //
		if (typeof values['Livechat_webhook_on_close'] !== 'undefined') {                                                    // 15
			RocketChat.settings.updateById('Livechat_webhook_on_close', !!values['Livechat_webhook_on_close']);                 // 16
		}                                                                                                                    // 17
                                                                                                                       //
		if (typeof values['Livechat_webhook_on_offline_msg'] !== 'undefined') {                                              // 19
			RocketChat.settings.updateById('Livechat_webhook_on_offline_msg', !!values['Livechat_webhook_on_offline_msg']);     // 20
		}                                                                                                                    // 21
                                                                                                                       //
		return;                                                                                                              // 23
	}                                                                                                                     // 24
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"saveSurveyFeedback.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/saveSurveyFeedback.js                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* eslint new-cap: [2, {"capIsNewExceptions": ["Match.ObjectIncluding"]}] */Meteor.methods({                           // 1
	'livechat:saveSurveyFeedback': function (visitorToken, visitorRoom, formData) {                                       // 4
		check(visitorToken, String);                                                                                         // 5
		check(visitorRoom, String);                                                                                          // 6
		check(formData, [Match.ObjectIncluding({                                                                             // 7
			name: String,                                                                                                       // 7
			value: String                                                                                                       // 7
		})]);                                                                                                                // 7
		var visitor = RocketChat.models.Users.getVisitorByToken(visitorToken);                                               // 9
		var room = RocketChat.models.Rooms.findOneById(visitorRoom);                                                         // 10
                                                                                                                       //
		if (visitor !== undefined && room !== undefined && room.v !== undefined && visitor.profile !== undefined && room.v.token === visitor.profile.token) {
			var updateData = {};                                                                                                // 13
                                                                                                                       //
			for (var _iterator = formData, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
				var _ref;                                                                                                          // 14
                                                                                                                       //
				if (_isArray) {                                                                                                    // 14
					if (_i >= _iterator.length) break;                                                                                // 14
					_ref = _iterator[_i++];                                                                                           // 14
				} else {                                                                                                           // 14
					_i = _iterator.next();                                                                                            // 14
					if (_i.done) break;                                                                                               // 14
					_ref = _i.value;                                                                                                  // 14
				}                                                                                                                  // 14
                                                                                                                       //
				var item = _ref;                                                                                                   // 14
                                                                                                                       //
				if (_.contains(['satisfaction', 'agentKnowledge', 'agentResposiveness', 'agentFriendliness'], item.name) && _.contains(['1', '2', '3', '4', '5'], item.value)) {
					updateData[item.name] = item.value;                                                                               // 16
				} else if (item.name === 'additionalFeedback') {                                                                   // 17
					updateData[item.name] = item.value;                                                                               // 18
				}                                                                                                                  // 19
			}                                                                                                                   // 20
                                                                                                                       //
			if (!_.isEmpty(updateData)) {                                                                                       // 21
				return RocketChat.models.Rooms.updateSurveyFeedbackById(room._id, updateData);                                     // 22
			}                                                                                                                   // 23
		}                                                                                                                    // 24
	}                                                                                                                     // 25
});                                                                                                                    // 3
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"saveTrigger.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/saveTrigger.js                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:saveTrigger': function (trigger) {                                                                          // 2
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                 // 3
			throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                        // 4
				method: 'livechat:saveTrigger'                                                                                     // 4
			});                                                                                                                 // 4
		}                                                                                                                    // 5
                                                                                                                       //
		check(trigger, {                                                                                                     // 7
			_id: Match.Maybe(String),                                                                                           // 8
			name: String,                                                                                                       // 9
			description: String,                                                                                                // 10
			enabled: Boolean,                                                                                                   // 11
			conditions: Array,                                                                                                  // 12
			actions: Array                                                                                                      // 13
		});                                                                                                                  // 7
                                                                                                                       //
		if (trigger._id) {                                                                                                   // 16
			return RocketChat.models.LivechatTrigger.updateById(trigger._id, trigger);                                          // 17
		} else {                                                                                                             // 18
			return RocketChat.models.LivechatTrigger.insert(trigger);                                                           // 19
		}                                                                                                                    // 20
	}                                                                                                                     // 21
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"searchAgent.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/searchAgent.js                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:searchAgent': function (username) {                                                                         // 2
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                 // 3
			throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                        // 4
				method: 'livechat:searchAgent'                                                                                     // 4
			});                                                                                                                 // 4
		}                                                                                                                    // 5
                                                                                                                       //
		if (!username || !_.isString(username)) {                                                                            // 7
			throw new Meteor.Error('error-invalid-arguments', 'Invalid arguments', {                                            // 8
				method: 'livechat:searchAgent'                                                                                     // 8
			});                                                                                                                 // 8
		}                                                                                                                    // 9
                                                                                                                       //
		var user = RocketChat.models.Users.findOneByUsername(username, {                                                     // 11
			fields: {                                                                                                           // 11
				_id: 1,                                                                                                            // 11
				username: 1                                                                                                        // 11
			}                                                                                                                   // 11
		});                                                                                                                  // 11
                                                                                                                       //
		if (!user) {                                                                                                         // 13
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                      // 14
				method: 'livechat:searchAgent'                                                                                     // 14
			});                                                                                                                 // 14
		}                                                                                                                    // 15
                                                                                                                       //
		return user;                                                                                                         // 17
	}                                                                                                                     // 18
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"sendMessageLivechat.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/sendMessageLivechat.js                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	sendMessageLivechat: function (message) {                                                                             // 2
		check(message.rid, String);                                                                                          // 3
		check(message.token, String);                                                                                        // 4
		var guest = Meteor.users.findOne(Meteor.userId(), {                                                                  // 6
			fields: {                                                                                                           // 7
				name: 1,                                                                                                           // 8
				username: 1,                                                                                                       // 9
				department: 1                                                                                                      // 10
			}                                                                                                                   // 7
		});                                                                                                                  // 6
		return RocketChat.Livechat.sendMessage({                                                                             // 14
			guest: guest,                                                                                                       // 14
			message: message                                                                                                    // 14
		});                                                                                                                  // 14
	}                                                                                                                     // 15
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"sendOfflineMessage.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/sendOfflineMessage.js                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals DDPRateLimiter */var dns = Npm.require('dns');                                                              // 1
                                                                                                                       //
Meteor.methods({                                                                                                       // 4
	'livechat:sendOfflineMessage': function (data) {                                                                      // 5
		check(data, {                                                                                                        // 6
			name: String,                                                                                                       // 7
			email: String,                                                                                                      // 8
			message: String                                                                                                     // 9
		});                                                                                                                  // 6
                                                                                                                       //
		if (!RocketChat.settings.get('Livechat_display_offline_form')) {                                                     // 12
			return false;                                                                                                       // 13
		}                                                                                                                    // 14
                                                                                                                       //
		var header = RocketChat.placeholders.replace(RocketChat.settings.get('Email_Header') || '');                         // 16
		var footer = RocketChat.placeholders.replace(RocketChat.settings.get('Email_Footer') || '');                         // 17
		var message = ("" + data.message).replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');                    // 19
		var html = "\n\t\t\t<h1>New livechat message</h1>\n\t\t\t<p><strong>Visitor name:</strong> " + data.name + "</p>\n\t\t\t<p><strong>Visitor email:</strong> " + data.email + "</p>\n\t\t\t<p><strong>Message:</strong><br>" + message + "</p>";
		var fromEmail = RocketChat.settings.get('From_Email').match(/\b[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,4}\b/i);      // 27
                                                                                                                       //
		if (fromEmail) {                                                                                                     // 29
			fromEmail = fromEmail[0];                                                                                           // 30
		} else {                                                                                                             // 31
			fromEmail = RocketChat.settings.get('From_Email');                                                                  // 32
		}                                                                                                                    // 33
                                                                                                                       //
		if (RocketChat.settings.get('Livechat_validate_offline_email')) {                                                    // 35
			var emailDomain = data.email.substr(data.email.lastIndexOf('@') + 1);                                               // 36
                                                                                                                       //
			try {                                                                                                               // 38
				Meteor.wrapAsync(dns.resolveMx)(emailDomain);                                                                      // 39
			} catch (e) {                                                                                                       // 40
				throw new Meteor.Error('error-invalid-email-address', 'Invalid email address', {                                   // 41
					method: 'livechat:sendOfflineMessage'                                                                             // 41
				});                                                                                                                // 41
			}                                                                                                                   // 42
		}                                                                                                                    // 43
                                                                                                                       //
		Meteor.defer(function () {                                                                                           // 45
			Email.send({                                                                                                        // 46
				to: RocketChat.settings.get('Livechat_offline_email'),                                                             // 47
				from: data.name + " - " + data.email + " <" + fromEmail + ">",                                                     // 48
				replyTo: data.name + " <" + data.email + ">",                                                                      // 49
				subject: "Livechat offline message from " + data.name + ": " + ("" + data.message).substring(0, 20),               // 50
				html: header + html + footer                                                                                       // 51
			});                                                                                                                 // 46
		});                                                                                                                  // 53
		Meteor.defer(function () {                                                                                           // 55
			RocketChat.callbacks.run('livechat.offlineMessage', data);                                                          // 56
		});                                                                                                                  // 57
		return true;                                                                                                         // 59
	}                                                                                                                     // 60
});                                                                                                                    // 4
DDPRateLimiter.addRule({                                                                                               // 63
	type: 'method',                                                                                                       // 64
	name: 'livechat:sendOfflineMessage',                                                                                  // 65
	connectionId: function () {                                                                                           // 66
		return true;                                                                                                         // 67
	}                                                                                                                     // 68
}, 1, 5000);                                                                                                           // 63
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"setCustomField.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/setCustomField.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:setCustomField': function (token, key, value) {                                                             // 2
		var overwrite = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;                            // 2
		var customField = RocketChat.models.LivechatCustomField.findOneById(key);                                            // 3
                                                                                                                       //
		if (customField) {                                                                                                   // 4
			if (customField.scope === 'room') {                                                                                 // 5
				return RocketChat.models.Rooms.updateLivechatDataByToken(token, key, value, overwrite);                            // 6
			} else {                                                                                                            // 7
				// Save in user                                                                                                    // 8
				return RocketChat.models.Users.updateLivechatDataByToken(token, key, value, overwrite);                            // 9
			}                                                                                                                   // 10
		}                                                                                                                    // 11
                                                                                                                       //
		return true;                                                                                                         // 13
	}                                                                                                                     // 14
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"setDepartmentForVisitor.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/setDepartmentForVisitor.js                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:setDepartmentForVisitor': function () {                                                                     // 2
		var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},                                   // 2
		    token = _ref.token,                                                                                              // 2
		    department = _ref.department;                                                                                    // 2
                                                                                                                       //
		RocketChat.Livechat.setDepartmentForGuest.call(this, {                                                               // 3
			token: token,                                                                                                       // 4
			department: department                                                                                              // 5
		}); // update visited page history to not expire                                                                     // 3
                                                                                                                       //
		RocketChat.models.LivechatPageVisited.keepHistoryForToken(token);                                                    // 9
		return true;                                                                                                         // 11
	}                                                                                                                     // 12
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"startVideoCall.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/startVideoCall.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* eslint new-cap: [2, {"capIsNewExceptions": ["MD5"]}] */Meteor.methods({                                             // 1
	'livechat:startVideoCall': function (roomId) {                                                                        // 3
		if (!Meteor.userId()) {                                                                                              // 4
			throw new Meteor.Error('error-not-authorized', 'Not authorized', {                                                  // 5
				method: 'livechat:closeByVisitor'                                                                                  // 5
			});                                                                                                                 // 5
		}                                                                                                                    // 6
                                                                                                                       //
		var guest = Meteor.user();                                                                                           // 8
		var message = {                                                                                                      // 10
			_id: Random.id(),                                                                                                   // 11
			rid: roomId || Random.id(),                                                                                         // 12
			msg: '',                                                                                                            // 13
			ts: new Date()                                                                                                      // 14
		};                                                                                                                   // 10
                                                                                                                       //
		var _RocketChat$Livechat$ = RocketChat.Livechat.getRoom(guest, message, {                                            // 3
			jitsiTimeout: new Date(Date.now() + 3600 * 1000)                                                                    // 17
		}),                                                                                                                  // 17
		    room = _RocketChat$Livechat$.room;                                                                               // 3
                                                                                                                       //
		message.rid = room._id;                                                                                              // 18
		RocketChat.models.Messages.createWithTypeRoomIdMessageAndUser('livechat_video_call', room._id, '', guest, {          // 20
			actionLinks: [{                                                                                                     // 21
				icon: 'icon-videocam',                                                                                             // 22
				i18nLabel: 'Accept',                                                                                               // 22
				method_id: 'createLivechatCall',                                                                                   // 22
				params: ''                                                                                                         // 22
			}, {                                                                                                                // 22
				icon: 'icon-cancel',                                                                                               // 23
				i18nLabel: 'Decline',                                                                                              // 23
				method_id: 'denyLivechatCall',                                                                                     // 23
				params: ''                                                                                                         // 23
			}]                                                                                                                  // 23
		});                                                                                                                  // 20
		return {                                                                                                             // 27
			roomId: room._id,                                                                                                   // 28
			domain: RocketChat.settings.get('Jitsi_Domain'),                                                                    // 29
			jitsiRoom: RocketChat.settings.get('Jitsi_URL_Room_Prefix') + CryptoJS.MD5(RocketChat.settings.get('uniqueID') + roomId).toString()
		};                                                                                                                   // 27
	}                                                                                                                     // 32
});                                                                                                                    // 2
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"transfer.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/transfer.js                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* eslint new-cap: [2, {"capIsNewExceptions": ["Match.Optional"]}] */Meteor.methods({                                  // 1
	'livechat:transfer': function (transferData) {                                                                        // 3
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-l-room')) {                           // 4
			throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                        // 5
				method: 'livechat:transfer'                                                                                        // 5
			});                                                                                                                 // 5
		}                                                                                                                    // 6
                                                                                                                       //
		check(transferData, {                                                                                                // 8
			roomId: String,                                                                                                     // 9
			userId: Match.Optional(String),                                                                                     // 10
			departmentId: Match.Optional(String)                                                                                // 11
		});                                                                                                                  // 8
		var room = RocketChat.models.Rooms.findOneById(transferData.roomId);                                                 // 14
		var guest = RocketChat.models.Users.findOneById(room.v._id);                                                         // 16
		var user = Meteor.user();                                                                                            // 18
                                                                                                                       //
		if (room.usernames.indexOf(user.username) === -1 && !RocketChat.authz.hasRole(Meteor.userId(), 'livechat-manager')) {
			throw new Meteor.Error('error-not-authorized', 'Not authorized', {                                                  // 21
				method: 'livechat:transfer'                                                                                        // 21
			});                                                                                                                 // 21
		}                                                                                                                    // 22
                                                                                                                       //
		return RocketChat.Livechat.transfer(room, guest, transferData);                                                      // 24
	}                                                                                                                     // 25
});                                                                                                                    // 2
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"webhookTest.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/webhookTest.js                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals HTTP */var postCatchError = Meteor.wrapAsync(function (url, options, resolve) {                             // 1
	HTTP.post(url, options, function (err, res) {                                                                         // 3
		if (err) {                                                                                                           // 4
			resolve(null, err.response);                                                                                        // 5
		} else {                                                                                                             // 6
			resolve(null, res);                                                                                                 // 7
		}                                                                                                                    // 8
	});                                                                                                                   // 9
});                                                                                                                    // 10
Meteor.methods({                                                                                                       // 12
	'livechat:webhookTest': function () {                                                                                 // 13
		this.unblock();                                                                                                      // 14
		var sampleData = {                                                                                                   // 16
			type: 'LivechatSession',                                                                                            // 17
			_id: 'fasd6f5a4sd6f8a4sdf',                                                                                         // 18
			label: 'title',                                                                                                     // 19
			topic: 'asiodojf',                                                                                                  // 20
			code: 123123,                                                                                                       // 21
			createdAt: new Date(),                                                                                              // 22
			lastMessageAt: new Date(),                                                                                          // 23
			tags: ['tag1', 'tag2', 'tag3'],                                                                                     // 24
			customFields: {                                                                                                     // 29
				productId: '123456'                                                                                                // 30
			},                                                                                                                  // 29
			visitor: {                                                                                                          // 32
				_id: '',                                                                                                           // 33
				name: 'visitor name',                                                                                              // 34
				username: 'visitor-username',                                                                                      // 35
				department: 'department',                                                                                          // 36
				email: 'email@address.com',                                                                                        // 37
				phone: '192873192873',                                                                                             // 38
				ip: '123.456.7.89',                                                                                                // 39
				browser: 'Chrome',                                                                                                 // 40
				os: 'Linux',                                                                                                       // 41
				customFields: {                                                                                                    // 42
					customerId: '123456'                                                                                              // 43
				}                                                                                                                  // 42
			},                                                                                                                  // 32
			agent: {                                                                                                            // 46
				_id: 'asdf89as6df8',                                                                                               // 47
				username: 'agent.username',                                                                                        // 48
				name: 'Agent Name',                                                                                                // 49
				email: 'agent@email.com'                                                                                           // 50
			},                                                                                                                  // 46
			messages: [{                                                                                                        // 52
				username: 'visitor-username',                                                                                      // 53
				msg: 'message content',                                                                                            // 54
				ts: new Date()                                                                                                     // 55
			}, {                                                                                                                // 52
				username: 'agent.username',                                                                                        // 57
				agentId: 'asdf89as6df8',                                                                                           // 58
				msg: 'message content from agent',                                                                                 // 59
				ts: new Date()                                                                                                     // 60
			}]                                                                                                                  // 56
		};                                                                                                                   // 16
		var options = {                                                                                                      // 64
			headers: {                                                                                                          // 65
				'X-RocketChat-Livechat-Token': RocketChat.settings.get('Livechat_secret_token')                                    // 66
			},                                                                                                                  // 65
			data: sampleData                                                                                                    // 68
		};                                                                                                                   // 64
		var response = postCatchError(RocketChat.settings.get('Livechat_webhookUrl'), options);                              // 71
		console.log('response ->', response);                                                                                // 73
                                                                                                                       //
		if (response && response.statusCode && response.statusCode === 200) {                                                // 75
			return true;                                                                                                        // 76
		} else {                                                                                                             // 77
			throw new Meteor.Error('error-invalid-webhook-response');                                                           // 78
		}                                                                                                                    // 79
	}                                                                                                                     // 80
});                                                                                                                    // 12
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"takeInquiry.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/takeInquiry.js                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:takeInquiry': function (inquiryId) {                                                                        // 2
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-l-room')) {                           // 3
			throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                        // 4
				method: 'livechat:takeInquiry'                                                                                     // 4
			});                                                                                                                 // 4
		}                                                                                                                    // 5
                                                                                                                       //
		var inquiry = RocketChat.models.LivechatInquiry.findOneById(inquiryId);                                              // 7
                                                                                                                       //
		if (!inquiry || inquiry.status === 'taken') {                                                                        // 9
			throw new Meteor.Error('error-not-allowed', 'Inquiry already taken', {                                              // 10
				method: 'livechat:takeInquiry'                                                                                     // 10
			});                                                                                                                 // 10
		}                                                                                                                    // 11
                                                                                                                       //
		var user = RocketChat.models.Users.findOneById(Meteor.userId());                                                     // 13
		var agent = {                                                                                                        // 15
			agentId: user._id,                                                                                                  // 16
			username: user.username                                                                                             // 17
		}; // add subscription                                                                                               // 15
                                                                                                                       //
		var subscriptionData = {                                                                                             // 21
			rid: inquiry.rid,                                                                                                   // 22
			name: inquiry.name,                                                                                                 // 23
			alert: true,                                                                                                        // 24
			open: true,                                                                                                         // 25
			unread: 1,                                                                                                          // 26
			userMentions: 1,                                                                                                    // 27
			groupMentions: 0,                                                                                                   // 28
			code: inquiry.code,                                                                                                 // 29
			u: {                                                                                                                // 30
				_id: agent.agentId,                                                                                                // 31
				username: agent.username                                                                                           // 32
			},                                                                                                                  // 30
			t: 'l',                                                                                                             // 34
			desktopNotifications: 'all',                                                                                        // 35
			mobilePushNotifications: 'all',                                                                                     // 36
			emailNotifications: 'all'                                                                                           // 37
		};                                                                                                                   // 21
		RocketChat.models.Subscriptions.insert(subscriptionData); // update room                                             // 39
                                                                                                                       //
		var room = RocketChat.models.Rooms.findOneById(inquiry.rid);                                                         // 42
		RocketChat.models.Rooms.changeAgentByRoomId(inquiry.rid, agent);                                                     // 44
		room.servedBy = {                                                                                                    // 46
			_id: agent.agentId,                                                                                                 // 47
			username: agent.username                                                                                            // 48
		}; // mark inquiry as taken                                                                                          // 46
                                                                                                                       //
		RocketChat.models.LivechatInquiry.takeInquiry(inquiry._id); // remove sending message from guest widget              // 52
		// dont check if setting is true, because if settingwas switched off inbetween  guest entered pool,                  // 55
		// and inquiry being taken, message would not be switched off.                                                       // 56
                                                                                                                       //
		RocketChat.models.Messages.createCommandWithRoomIdAndUser('connected', room._id, user);                              // 57
		RocketChat.Livechat.stream.emit(room._id, {                                                                          // 59
			type: 'agentData',                                                                                                  // 60
			data: RocketChat.models.Users.getAgentInfo(agent.agentId)                                                           // 61
		}); // return room corresponding to inquiry (for redirecting agent to the room route)                                // 59
                                                                                                                       //
		return room;                                                                                                         // 65
	}                                                                                                                     // 66
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"returnAsInquiry.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/returnAsInquiry.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:returnAsInquiry': function (rid) {                                                                          // 2
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-l-room')) {                           // 3
			throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                        // 4
				method: 'livechat:saveDepartment'                                                                                  // 4
			});                                                                                                                 // 4
		} // //delete agent and room subscription                                                                            // 5
                                                                                                                       //
                                                                                                                       //
		RocketChat.models.Subscriptions.removeByRoomId(rid); // remove user from room                                        // 8
                                                                                                                       //
		var username = Meteor.user().username;                                                                               // 11
		RocketChat.models.Rooms.removeUsernameById(rid, username); // find inquiry corresponding to room                     // 13
                                                                                                                       //
		var inquiry = RocketChat.models.LivechatInquiry.findOne({                                                            // 16
			rid: rid                                                                                                            // 16
		}); // mark inquiry as open                                                                                          // 16
                                                                                                                       //
		return RocketChat.models.LivechatInquiry.openInquiry(inquiry._id);                                                   // 19
	}                                                                                                                     // 20
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"saveOfficeHours.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/saveOfficeHours.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:saveOfficeHours': function (day, start, finish, open) {                                                     // 2
		RocketChat.models.LivechatOfficeHour.updateHours(day, start, finish, open);                                          // 3
	}                                                                                                                     // 4
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"sendTranscript.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/sendTranscript.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var moment = void 0;                                                                                                   // 1
module.watch(require("moment"), {                                                                                      // 1
	"default": function (v) {                                                                                             // 1
		moment = v;                                                                                                          // 1
	}                                                                                                                     // 1
}, 0);                                                                                                                 // 1
Meteor.methods({                                                                                                       // 5
	'livechat:sendTranscript': function (rid, email) {                                                                    // 6
		check(rid, String);                                                                                                  // 7
		check(email, String);                                                                                                // 8
		var room = RocketChat.models.Rooms.findOneById(rid);                                                                 // 10
		var user = Meteor.user();                                                                                            // 11
		var userLanguage = user.language || RocketChat.settings.get('language') || 'en'; // allow to only user to send transcripts from their own chats
                                                                                                                       //
		if (!room || room.t !== 'l' || !room.v || !user.profile || room.v.token !== user.profile.token) {                    // 15
			throw new Meteor.Error('error-invalid-room', 'Invalid room');                                                       // 16
		}                                                                                                                    // 17
                                                                                                                       //
		var messages = RocketChat.models.Messages.findVisibleByRoomId(rid, {                                                 // 19
			sort: {                                                                                                             // 19
				'ts': 1                                                                                                            // 19
			}                                                                                                                   // 19
		});                                                                                                                  // 19
		var header = RocketChat.placeholders.replace(RocketChat.settings.get('Email_Header') || '');                         // 20
		var footer = RocketChat.placeholders.replace(RocketChat.settings.get('Email_Footer') || '');                         // 21
		var html = '<div> <hr>';                                                                                             // 23
		messages.forEach(function (message) {                                                                                // 24
			if (message.t && ['command', 'livechat-close', 'livechat_video_call'].indexOf(message.t) !== -1) {                  // 25
				return;                                                                                                            // 26
			}                                                                                                                   // 27
                                                                                                                       //
			var author = void 0;                                                                                                // 29
                                                                                                                       //
			if (message.u._id === Meteor.userId()) {                                                                            // 30
				author = TAPi18n.__('You', {                                                                                       // 31
					lng: userLanguage                                                                                                 // 31
				});                                                                                                                // 31
			} else {                                                                                                            // 32
				author = message.u.username;                                                                                       // 33
			}                                                                                                                   // 34
                                                                                                                       //
			var datetime = moment(message.ts).locale(userLanguage).format('LLL');                                               // 36
			var singleMessage = "\n\t\t\t\t<p><strong>" + author + "</strong>  <em>" + datetime + "</em></p>\n\t\t\t\t<p>" + message.msg + "</p>\n\t\t\t";
			html = html + singleMessage;                                                                                        // 41
		});                                                                                                                  // 42
		html = html + "</div>";                                                                                              // 44
		var fromEmail = RocketChat.settings.get('From_Email').match(/\b[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,4}\b/i);      // 46
                                                                                                                       //
		if (fromEmail) {                                                                                                     // 48
			fromEmail = fromEmail[0];                                                                                           // 49
		} else {                                                                                                             // 50
			fromEmail = RocketChat.settings.get('From_Email');                                                                  // 51
		}                                                                                                                    // 52
                                                                                                                       //
		emailSettings = {                                                                                                    // 54
			to: email,                                                                                                          // 55
			from: fromEmail,                                                                                                    // 56
			replyTo: fromEmail,                                                                                                 // 57
			subject: TAPi18n.__('Transcript_of_your_livechat_conversation', {                                                   // 58
				lng: userLanguage                                                                                                  // 58
			}),                                                                                                                 // 58
			html: header + html + footer                                                                                        // 59
		};                                                                                                                   // 54
		Meteor.defer(function () {                                                                                           // 62
			Email.send(emailSettings);                                                                                          // 63
		});                                                                                                                  // 64
		Meteor.defer(function () {                                                                                           // 66
			RocketChat.callbacks.run('livechat.sendTranscript', messages, email);                                               // 67
		});                                                                                                                  // 68
		return true;                                                                                                         // 70
	}                                                                                                                     // 71
});                                                                                                                    // 5
DDPRateLimiter.addRule({                                                                                               // 74
	type: 'method',                                                                                                       // 75
	name: 'livechat:sendTranscript',                                                                                      // 76
	connectionId: function () {                                                                                           // 77
		return true;                                                                                                         // 78
	}                                                                                                                     // 79
}, 1, 5000);                                                                                                           // 74
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"models":{"Users.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/models/Users.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * Sets an user as (non)operator                                                                                       //
 * @param {string} _id - User's _id                                                                                    //
 * @param {boolean} operator - Flag to set as operator or not                                                          //
 */RocketChat.models.Users.setOperator = function (_id, operator) {                                                    //
	var update = {                                                                                                        // 7
		$set: {                                                                                                              // 8
			operator: operator                                                                                                  // 9
		}                                                                                                                    // 8
	};                                                                                                                    // 7
	return this.update(_id, update);                                                                                      // 13
}; /**                                                                                                                 // 14
    * Gets all online agents                                                                                           //
    * @return                                                                                                          //
    */                                                                                                                 //
                                                                                                                       //
RocketChat.models.Users.findOnlineAgents = function () {                                                               // 20
	var query = {                                                                                                         // 21
		status: {                                                                                                            // 22
			$exists: true,                                                                                                      // 23
			$ne: 'offline'                                                                                                      // 24
		},                                                                                                                   // 22
		statusLivechat: 'available',                                                                                         // 26
		roles: 'livechat-agent'                                                                                              // 27
	};                                                                                                                    // 21
	return this.find(query);                                                                                              // 30
}; /**                                                                                                                 // 31
    * Gets all agents                                                                                                  //
    * @return                                                                                                          //
    */                                                                                                                 //
                                                                                                                       //
RocketChat.models.Users.findAgents = function () {                                                                     // 37
	var query = {                                                                                                         // 38
		roles: 'livechat-agent'                                                                                              // 39
	};                                                                                                                    // 38
	return this.find(query);                                                                                              // 42
}; /**                                                                                                                 // 43
    * Find online users from a list                                                                                    //
    * @param {array} userList - array of usernames                                                                     //
    * @return                                                                                                          //
    */                                                                                                                 //
                                                                                                                       //
RocketChat.models.Users.findOnlineUserFromList = function (userList) {                                                 // 50
	var query = {                                                                                                         // 51
		status: {                                                                                                            // 52
			$exists: true,                                                                                                      // 53
			$ne: 'offline'                                                                                                      // 54
		},                                                                                                                   // 52
		statusLivechat: 'available',                                                                                         // 56
		roles: 'livechat-agent',                                                                                             // 57
		username: {                                                                                                          // 58
			$in: [].concat(userList)                                                                                            // 59
		}                                                                                                                    // 58
	};                                                                                                                    // 51
	return this.find(query);                                                                                              // 63
}; /**                                                                                                                 // 64
    * Get next user agent in order                                                                                     //
    * @return {object} User from db                                                                                    //
    */                                                                                                                 //
                                                                                                                       //
RocketChat.models.Users.getNextAgent = function () {                                                                   // 70
	var query = {                                                                                                         // 71
		status: {                                                                                                            // 72
			$exists: true,                                                                                                      // 73
			$ne: 'offline'                                                                                                      // 74
		},                                                                                                                   // 72
		statusLivechat: 'available',                                                                                         // 76
		roles: 'livechat-agent'                                                                                              // 77
	};                                                                                                                    // 71
	var collectionObj = this.model.rawCollection();                                                                       // 80
	var findAndModify = Meteor.wrapAsync(collectionObj.findAndModify, collectionObj);                                     // 81
	var sort = {                                                                                                          // 83
		livechatCount: 1,                                                                                                    // 84
		username: 1                                                                                                          // 85
	};                                                                                                                    // 83
	var update = {                                                                                                        // 88
		$inc: {                                                                                                              // 89
			livechatCount: 1                                                                                                    // 90
		}                                                                                                                    // 89
	};                                                                                                                    // 88
	var user = findAndModify(query, sort, update);                                                                        // 94
                                                                                                                       //
	if (user && user.value) {                                                                                             // 95
		return {                                                                                                             // 96
			agentId: user.value._id,                                                                                            // 97
			username: user.value.username                                                                                       // 98
		};                                                                                                                   // 96
	} else {                                                                                                              // 100
		return null;                                                                                                         // 101
	}                                                                                                                     // 102
}; /**                                                                                                                 // 103
    * Gets visitor by token                                                                                            //
    * @param {string} token - Visitor token                                                                            //
    */                                                                                                                 //
                                                                                                                       //
RocketChat.models.Users.getVisitorByToken = function (token, options) {                                                // 109
	var query = {                                                                                                         // 110
		'profile.guest': true,                                                                                               // 111
		'profile.token': token                                                                                               // 112
	};                                                                                                                    // 110
	return this.findOne(query, options);                                                                                  // 115
}; /**                                                                                                                 // 116
    * Gets visitor by token                                                                                            //
    * @param {string} token - Visitor token                                                                            //
    */                                                                                                                 //
                                                                                                                       //
RocketChat.models.Users.findVisitorByToken = function (token) {                                                        // 122
	var query = {                                                                                                         // 123
		'profile.guest': true,                                                                                               // 124
		'profile.token': token                                                                                               // 125
	};                                                                                                                    // 123
	return this.find(query);                                                                                              // 128
}; /**                                                                                                                 // 129
    * Change user's livechat status                                                                                    //
    * @param {string} token - Visitor token                                                                            //
    */                                                                                                                 //
                                                                                                                       //
RocketChat.models.Users.setLivechatStatus = function (userId, status) {                                                // 135
	var query = {                                                                                                         // 136
		'_id': userId                                                                                                        // 137
	};                                                                                                                    // 136
	var update = {                                                                                                        // 140
		$set: {                                                                                                              // 141
			'statusLivechat': status                                                                                            // 142
		}                                                                                                                    // 141
	};                                                                                                                    // 140
	return this.update(query, update);                                                                                    // 146
}; /**                                                                                                                 // 147
    * change all livechat agents livechat status to "not-available"                                                    //
    */                                                                                                                 //
                                                                                                                       //
RocketChat.models.Users.closeOffice = function () {                                                                    // 152
	self = this;                                                                                                          // 153
	self.findAgents().forEach(function (agent) {                                                                          // 154
		self.setLivechatStatus(agent._id, 'not-available');                                                                  // 155
	});                                                                                                                   // 156
}; /**                                                                                                                 // 157
    * change all livechat agents livechat status to "available"                                                        //
    */                                                                                                                 //
                                                                                                                       //
RocketChat.models.Users.openOffice = function () {                                                                     // 162
	self = this;                                                                                                          // 163
	self.findAgents().forEach(function (agent) {                                                                          // 164
		self.setLivechatStatus(agent._id, 'available');                                                                      // 165
	});                                                                                                                   // 166
};                                                                                                                     // 167
                                                                                                                       //
RocketChat.models.Users.updateLivechatDataByToken = function (token, key, value) {                                     // 169
	var _$set;                                                                                                            // 169
                                                                                                                       //
	var overwrite = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;                             // 169
	var query = {                                                                                                         // 170
		'profile.token': token                                                                                               // 171
	};                                                                                                                    // 170
                                                                                                                       //
	if (!overwrite) {                                                                                                     // 174
		var user = this.findOne(query, {                                                                                     // 175
			fields: {                                                                                                           // 175
				livechatData: 1                                                                                                    // 175
			}                                                                                                                   // 175
		});                                                                                                                  // 175
                                                                                                                       //
		if (user.livechatData && typeof user.livechatData[key] !== 'undefined') {                                            // 176
			return true;                                                                                                        // 177
		}                                                                                                                    // 178
	}                                                                                                                     // 179
                                                                                                                       //
	var update = {                                                                                                        // 181
		$set: (_$set = {}, _$set["livechatData." + key] = value, _$set)                                                      // 182
	};                                                                                                                    // 181
	return this.update(query, update);                                                                                    // 187
}; /**                                                                                                                 // 188
    * Find a visitor by their phone number                                                                             //
    * @return {object} User from db                                                                                    //
    */                                                                                                                 //
                                                                                                                       //
RocketChat.models.Users.findOneVisitorByPhone = function (phone) {                                                     // 194
	var query = {                                                                                                         // 195
		'phone.phoneNumber': phone                                                                                           // 196
	};                                                                                                                    // 195
	return this.findOne(query);                                                                                           // 199
}; /**                                                                                                                 // 200
    * Get the next visitor name                                                                                        //
    * @return {string} The next visitor name                                                                           //
    */                                                                                                                 //
                                                                                                                       //
RocketChat.models.Users.getNextVisitorUsername = function () {                                                         // 206
	var settingsRaw = RocketChat.models.Settings.model.rawCollection();                                                   // 207
	var findAndModify = Meteor.wrapAsync(settingsRaw.findAndModify, settingsRaw);                                         // 208
	var query = {                                                                                                         // 210
		_id: 'Livechat_guest_count'                                                                                          // 211
	};                                                                                                                    // 210
	var update = {                                                                                                        // 214
		$inc: {                                                                                                              // 215
			value: 1                                                                                                            // 216
		}                                                                                                                    // 215
	};                                                                                                                    // 214
	var livechatCount = findAndModify(query, null, update);                                                               // 220
	return "guest-" + (livechatCount.value.value + 1);                                                                    // 222
};                                                                                                                     // 223
                                                                                                                       //
RocketChat.models.Users.saveGuestById = function (_id, data) {                                                         // 225
	var setData = {};                                                                                                     // 226
	var unsetData = {};                                                                                                   // 227
                                                                                                                       //
	if (data.name) {                                                                                                      // 229
		if (!_.isEmpty(s.trim(data.name))) {                                                                                 // 230
			setData.name = s.trim(data.name);                                                                                   // 231
		} else {                                                                                                             // 232
			unsetData.name = 1;                                                                                                 // 233
		}                                                                                                                    // 234
	}                                                                                                                     // 235
                                                                                                                       //
	if (data.email) {                                                                                                     // 237
		if (!_.isEmpty(s.trim(data.email))) {                                                                                // 238
			setData.visitorEmails = [{                                                                                          // 239
				address: s.trim(data.email)                                                                                        // 240
			}];                                                                                                                 // 240
		} else {                                                                                                             // 242
			unsetData.visitorEmails = 1;                                                                                        // 243
		}                                                                                                                    // 244
	}                                                                                                                     // 245
                                                                                                                       //
	if (data.phone) {                                                                                                     // 247
		if (!_.isEmpty(s.trim(data.phone))) {                                                                                // 248
			setData.phone = [{                                                                                                  // 249
				phoneNumber: s.trim(data.phone)                                                                                    // 250
			}];                                                                                                                 // 250
		} else {                                                                                                             // 252
			unsetData.phone = 1;                                                                                                // 253
		}                                                                                                                    // 254
	}                                                                                                                     // 255
                                                                                                                       //
	var update = {};                                                                                                      // 257
                                                                                                                       //
	if (!_.isEmpty(setData)) {                                                                                            // 259
		update.$set = setData;                                                                                               // 260
	}                                                                                                                     // 261
                                                                                                                       //
	if (!_.isEmpty(unsetData)) {                                                                                          // 263
		update.$unset = unsetData;                                                                                           // 264
	}                                                                                                                     // 265
                                                                                                                       //
	if (_.isEmpty(update)) {                                                                                              // 267
		return true;                                                                                                         // 268
	}                                                                                                                     // 269
                                                                                                                       //
	return this.update({                                                                                                  // 271
		_id: _id                                                                                                             // 271
	}, update);                                                                                                           // 271
};                                                                                                                     // 272
                                                                                                                       //
RocketChat.models.Users.findOneGuestByEmailAddress = function (emailAddress) {                                         // 274
	var query = {                                                                                                         // 275
		'visitorEmails.address': new RegExp("^" + s.escapeRegExp(emailAddress) + "$", 'i')                                   // 276
	};                                                                                                                    // 275
	return this.findOne(query);                                                                                           // 279
};                                                                                                                     // 280
                                                                                                                       //
RocketChat.models.Users.getAgentInfo = function (agentId) {                                                            // 282
	var query = {                                                                                                         // 283
		_id: agentId                                                                                                         // 284
	};                                                                                                                    // 283
	var options = {                                                                                                       // 287
		fields: {                                                                                                            // 288
			name: 1,                                                                                                            // 289
			username: 1,                                                                                                        // 290
			emails: 1,                                                                                                          // 291
			customFields: 1                                                                                                     // 292
		}                                                                                                                    // 288
	};                                                                                                                    // 287
	return this.findOne(query, options);                                                                                  // 296
};                                                                                                                     // 297
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Rooms.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/models/Rooms.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * Gets visitor by token                                                                                               //
 * @param {string} token - Visitor token                                                                               //
 */RocketChat.models.Rooms.updateSurveyFeedbackById = function (_id, surveyFeedback) {                                 //
	var query = {                                                                                                         // 6
		_id: _id                                                                                                             // 7
	};                                                                                                                    // 6
	var update = {                                                                                                        // 10
		$set: {                                                                                                              // 11
			surveyFeedback: surveyFeedback                                                                                      // 12
		}                                                                                                                    // 11
	};                                                                                                                    // 10
	return this.update(query, update);                                                                                    // 16
};                                                                                                                     // 17
                                                                                                                       //
RocketChat.models.Rooms.updateLivechatDataByToken = function (token, key, value) {                                     // 19
	var _$set;                                                                                                            // 19
                                                                                                                       //
	var overwrite = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;                             // 19
	var query = {                                                                                                         // 20
		'v.token': token,                                                                                                    // 21
		open: true                                                                                                           // 22
	};                                                                                                                    // 20
                                                                                                                       //
	if (!overwrite) {                                                                                                     // 25
		var room = this.findOne(query, {                                                                                     // 26
			fields: {                                                                                                           // 26
				livechatData: 1                                                                                                    // 26
			}                                                                                                                   // 26
		});                                                                                                                  // 26
                                                                                                                       //
		if (room.livechatData && typeof room.livechatData[key] !== 'undefined') {                                            // 27
			return true;                                                                                                        // 28
		}                                                                                                                    // 29
	}                                                                                                                     // 30
                                                                                                                       //
	var update = {                                                                                                        // 32
		$set: (_$set = {}, _$set["livechatData." + key] = value, _$set)                                                      // 33
	};                                                                                                                    // 32
	return this.update(query, update);                                                                                    // 38
};                                                                                                                     // 39
                                                                                                                       //
RocketChat.models.Rooms.findLivechat = function () {                                                                   // 41
	var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};                                  // 41
	var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;                                   // 41
	var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 20;                                   // 41
                                                                                                                       //
	var query = _.extend(filter, {                                                                                        // 42
		t: 'l'                                                                                                               // 43
	});                                                                                                                   // 42
                                                                                                                       //
	return this.find(query, {                                                                                             // 46
		sort: {                                                                                                              // 46
			ts: -1                                                                                                              // 46
		},                                                                                                                   // 46
		offset: offset,                                                                                                      // 46
		limit: limit                                                                                                         // 46
	});                                                                                                                   // 46
};                                                                                                                     // 47
                                                                                                                       //
RocketChat.models.Rooms.findLivechatByCode = function (code, fields) {                                                 // 49
	code = parseInt(code);                                                                                                // 50
	var options = {};                                                                                                     // 52
                                                                                                                       //
	if (fields) {                                                                                                         // 54
		options.fields = fields;                                                                                             // 55
	} // if (this.useCache) {                                                                                             // 56
	// 	return this.cache.findByIndex('t,code', ['l', code], options).fetch();                                            // 59
	// }                                                                                                                  // 60
                                                                                                                       //
                                                                                                                       //
	var query = {                                                                                                         // 62
		t: 'l',                                                                                                              // 63
		code: code                                                                                                           // 64
	};                                                                                                                    // 62
	return this.findOne(query, options);                                                                                  // 67
}; /**                                                                                                                 // 68
    * Get the next visitor name                                                                                        //
    * @return {string} The next visitor name                                                                           //
    */                                                                                                                 //
                                                                                                                       //
RocketChat.models.Rooms.getNextLivechatRoomCode = function () {                                                        // 74
	var settingsRaw = RocketChat.models.Settings.model.rawCollection();                                                   // 75
	var findAndModify = Meteor.wrapAsync(settingsRaw.findAndModify, settingsRaw);                                         // 76
	var query = {                                                                                                         // 78
		_id: 'Livechat_Room_Count'                                                                                           // 79
	};                                                                                                                    // 78
	var update = {                                                                                                        // 82
		$inc: {                                                                                                              // 83
			value: 1                                                                                                            // 84
		}                                                                                                                    // 83
	};                                                                                                                    // 82
	var livechatCount = findAndModify(query, null, update);                                                               // 88
	return livechatCount.value.value;                                                                                     // 90
};                                                                                                                     // 91
                                                                                                                       //
RocketChat.models.Rooms.findOpenByVisitorToken = function (visitorToken, options) {                                    // 93
	var query = {                                                                                                         // 94
		open: true,                                                                                                          // 95
		'v.token': visitorToken                                                                                              // 96
	};                                                                                                                    // 94
	return this.find(query, options);                                                                                     // 99
};                                                                                                                     // 100
                                                                                                                       //
RocketChat.models.Rooms.findByVisitorToken = function (visitorToken) {                                                 // 102
	var query = {                                                                                                         // 103
		'v.token': visitorToken                                                                                              // 104
	};                                                                                                                    // 103
	return this.find(query);                                                                                              // 107
};                                                                                                                     // 108
                                                                                                                       //
RocketChat.models.Rooms.findByVisitorId = function (visitorId) {                                                       // 110
	var query = {                                                                                                         // 111
		'v._id': visitorId                                                                                                   // 112
	};                                                                                                                    // 111
	return this.find(query);                                                                                              // 115
};                                                                                                                     // 116
                                                                                                                       //
RocketChat.models.Rooms.findOneOpenByVisitorId = function (visitorId, roomId) {                                        // 118
	var query = {                                                                                                         // 119
		_id: roomId,                                                                                                         // 120
		open: true,                                                                                                          // 121
		'v._id': visitorId                                                                                                   // 122
	};                                                                                                                    // 119
	return this.findOne(query);                                                                                           // 125
};                                                                                                                     // 126
                                                                                                                       //
RocketChat.models.Rooms.setResponseByRoomId = function (roomId, response) {                                            // 128
	return this.update({                                                                                                  // 129
		_id: roomId                                                                                                          // 130
	}, {                                                                                                                  // 129
		$set: {                                                                                                              // 132
			responseBy: {                                                                                                       // 133
				_id: response.user._id,                                                                                            // 134
				username: response.user.username                                                                                   // 135
			},                                                                                                                  // 133
			responseDate: response.responseDate,                                                                                // 137
			responseTime: response.responseTime                                                                                 // 138
		},                                                                                                                   // 132
		$unset: {                                                                                                            // 140
			waitingResponse: 1                                                                                                  // 141
		}                                                                                                                    // 140
	});                                                                                                                   // 131
};                                                                                                                     // 144
                                                                                                                       //
RocketChat.models.Rooms.closeByRoomId = function (roomId, closeInfo) {                                                 // 146
	return this.update({                                                                                                  // 147
		_id: roomId                                                                                                          // 148
	}, {                                                                                                                  // 147
		$set: {                                                                                                              // 150
			closedBy: {                                                                                                         // 151
				_id: closeInfo.user._id,                                                                                           // 152
				username: closeInfo.user.username                                                                                  // 153
			},                                                                                                                  // 151
			closedAt: closeInfo.closedAt,                                                                                       // 155
			chatDuration: closeInfo.chatDuration                                                                                // 156
		},                                                                                                                   // 150
		$unset: {                                                                                                            // 158
			open: 1                                                                                                             // 159
		}                                                                                                                    // 158
	});                                                                                                                   // 149
};                                                                                                                     // 162
                                                                                                                       //
RocketChat.models.Rooms.setLabelByRoomId = function (roomId, label) {                                                  // 164
	return this.update({                                                                                                  // 165
		_id: roomId                                                                                                          // 165
	}, {                                                                                                                  // 165
		$set: {                                                                                                              // 165
			label: label                                                                                                        // 165
		}                                                                                                                    // 165
	});                                                                                                                   // 165
};                                                                                                                     // 166
                                                                                                                       //
RocketChat.models.Rooms.findOpenByAgent = function (userId) {                                                          // 168
	var query = {                                                                                                         // 169
		open: true,                                                                                                          // 170
		'servedBy._id': userId                                                                                               // 171
	};                                                                                                                    // 169
	return this.find(query);                                                                                              // 174
};                                                                                                                     // 175
                                                                                                                       //
RocketChat.models.Rooms.changeAgentByRoomId = function (roomId, newAgent) {                                            // 177
	var query = {                                                                                                         // 178
		_id: roomId                                                                                                          // 179
	};                                                                                                                    // 178
	var update = {                                                                                                        // 181
		$set: {                                                                                                              // 182
			servedBy: {                                                                                                         // 183
				_id: newAgent.agentId,                                                                                             // 184
				username: newAgent.username                                                                                        // 185
			}                                                                                                                   // 183
		}                                                                                                                    // 182
	};                                                                                                                    // 181
	this.update(query, update);                                                                                           // 190
};                                                                                                                     // 191
                                                                                                                       //
RocketChat.models.Rooms.saveCRMDataByRoomId = function (roomId, crmData) {                                             // 193
	var query = {                                                                                                         // 194
		_id: roomId                                                                                                          // 195
	};                                                                                                                    // 194
	var update = {                                                                                                        // 197
		$set: {                                                                                                              // 198
			crmData: crmData                                                                                                    // 199
		}                                                                                                                    // 198
	};                                                                                                                    // 197
	return this.update(query, update);                                                                                    // 203
};                                                                                                                     // 204
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"LivechatExternalMessage.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/models/LivechatExternalMessage.js                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                          //
                                                                                                                       //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                                 //
                                                                                                                       //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                            //
                                                                                                                       //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                   //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
var LivechatExternalMessage = function (_RocketChat$models$_B) {                                                       //
	(0, _inherits3.default)(LivechatExternalMessage, _RocketChat$models$_B);                                              //
                                                                                                                       //
	function LivechatExternalMessage() {                                                                                  // 2
		(0, _classCallCheck3.default)(this, LivechatExternalMessage);                                                        // 2
                                                                                                                       //
		var _this = (0, _possibleConstructorReturn3.default)(this, _RocketChat$models$_B.call(this, 'livechat_external_message'));
                                                                                                                       //
		if (Meteor.isClient) {                                                                                               // 5
			_this._initModel('livechat_external_message');                                                                      // 6
		}                                                                                                                    // 7
                                                                                                                       //
		return _this;                                                                                                        // 2
	} // FIND                                                                                                             // 8
                                                                                                                       //
                                                                                                                       //
	LivechatExternalMessage.prototype.findByRoomId = function () {                                                        //
		function findByRoomId(roomId) {                                                                                      //
			var sort = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {                                    // 11
				ts: -1                                                                                                             // 11
			};                                                                                                                  // 11
			var query = {                                                                                                       // 12
				rid: roomId                                                                                                        // 12
			};                                                                                                                  // 12
			return this.find(query, {                                                                                           // 14
				sort: sort                                                                                                         // 14
			});                                                                                                                 // 14
		}                                                                                                                    // 15
                                                                                                                       //
		return findByRoomId;                                                                                                 //
	}();                                                                                                                  //
                                                                                                                       //
	return LivechatExternalMessage;                                                                                       //
}(RocketChat.models._Base);                                                                                            //
                                                                                                                       //
RocketChat.models.LivechatExternalMessage = new LivechatExternalMessage();                                             // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"LivechatCustomField.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/models/LivechatCustomField.js                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                          //
                                                                                                                       //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                                 //
                                                                                                                       //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                            //
                                                                                                                       //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                   //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
/**                                                                                                                    // 1
 * Livechat Custom Fields model                                                                                        //
 */var LivechatCustomField = function (_RocketChat$models$_B) {                                                        //
	(0, _inherits3.default)(LivechatCustomField, _RocketChat$models$_B);                                                  //
                                                                                                                       //
	function LivechatCustomField() {                                                                                      // 5
		(0, _classCallCheck3.default)(this, LivechatCustomField);                                                            // 5
		return (0, _possibleConstructorReturn3.default)(this, _RocketChat$models$_B.call(this, 'livechat_custom_field'));    // 5
	} // FIND                                                                                                             // 7
                                                                                                                       //
                                                                                                                       //
	LivechatCustomField.prototype.findOneById = function () {                                                             //
		function findOneById(_id, options) {                                                                                 //
			var query = {                                                                                                       // 11
				_id: _id                                                                                                           // 11
			};                                                                                                                  // 11
			return this.findOne(query, options);                                                                                // 13
		}                                                                                                                    // 14
                                                                                                                       //
		return findOneById;                                                                                                  //
	}();                                                                                                                  //
                                                                                                                       //
	LivechatCustomField.prototype.createOrUpdateCustomField = function () {                                               //
		function createOrUpdateCustomField(_id, field, label, scope, visibility, extraData) {                                //
			var record = {                                                                                                      // 17
				label: label,                                                                                                      // 18
				scope: scope,                                                                                                      // 19
				visibility: visibility                                                                                             // 20
			};                                                                                                                  // 17
                                                                                                                       //
			_.extend(record, extraData);                                                                                        // 23
                                                                                                                       //
			if (_id) {                                                                                                          // 25
				this.update({                                                                                                      // 26
					_id: _id                                                                                                          // 26
				}, {                                                                                                               // 26
					$set: record                                                                                                      // 26
				});                                                                                                                // 26
			} else {                                                                                                            // 27
				record._id = field;                                                                                                // 28
				_id = this.insert(record);                                                                                         // 29
			}                                                                                                                   // 30
                                                                                                                       //
			return record;                                                                                                      // 32
		}                                                                                                                    // 33
                                                                                                                       //
		return createOrUpdateCustomField;                                                                                    //
	}(); // REMOVE                                                                                                        //
                                                                                                                       //
                                                                                                                       //
	LivechatCustomField.prototype.removeById = function () {                                                              //
		function removeById(_id) {                                                                                           //
			var query = {                                                                                                       // 37
				_id: _id                                                                                                           // 37
			};                                                                                                                  // 37
			return this.remove(query);                                                                                          // 39
		}                                                                                                                    // 40
                                                                                                                       //
		return removeById;                                                                                                   //
	}();                                                                                                                  //
                                                                                                                       //
	return LivechatCustomField;                                                                                           //
}(RocketChat.models._Base);                                                                                            //
                                                                                                                       //
RocketChat.models.LivechatCustomField = new LivechatCustomField();                                                     // 43
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"LivechatDepartment.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/models/LivechatDepartment.js                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                          //
                                                                                                                       //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                                 //
                                                                                                                       //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                            //
                                                                                                                       //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                   //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
/**                                                                                                                    // 1
 * Livechat Department model                                                                                           //
 */var LivechatDepartment = function (_RocketChat$models$_B) {                                                         //
	(0, _inherits3.default)(LivechatDepartment, _RocketChat$models$_B);                                                   //
                                                                                                                       //
	function LivechatDepartment() {                                                                                       // 5
		(0, _classCallCheck3.default)(this, LivechatDepartment);                                                             // 5
                                                                                                                       //
		var _this = (0, _possibleConstructorReturn3.default)(this, _RocketChat$models$_B.call(this, 'livechat_department'));
                                                                                                                       //
		_this.tryEnsureIndex({                                                                                               // 8
			numAgents: 1,                                                                                                       // 9
			enabled: 1                                                                                                          // 10
		});                                                                                                                  // 8
                                                                                                                       //
		return _this;                                                                                                        // 5
	} // FIND                                                                                                             // 12
                                                                                                                       //
                                                                                                                       //
	LivechatDepartment.prototype.findOneById = function () {                                                              //
		function findOneById(_id, options) {                                                                                 //
			var query = {                                                                                                       // 16
				_id: _id                                                                                                           // 16
			};                                                                                                                  // 16
			return this.findOne(query, options);                                                                                // 18
		}                                                                                                                    // 19
                                                                                                                       //
		return findOneById;                                                                                                  //
	}();                                                                                                                  //
                                                                                                                       //
	LivechatDepartment.prototype.findByDepartmentId = function () {                                                       //
		function findByDepartmentId(_id, options) {                                                                          //
			var query = {                                                                                                       // 22
				_id: _id                                                                                                           // 22
			};                                                                                                                  // 22
			return this.find(query, options);                                                                                   // 24
		}                                                                                                                    // 25
                                                                                                                       //
		return findByDepartmentId;                                                                                           //
	}();                                                                                                                  //
                                                                                                                       //
	LivechatDepartment.prototype.createOrUpdateDepartment = function () {                                                 //
		function createOrUpdateDepartment(_id, _ref, agents) {                                                               //
			var enabled = _ref.enabled,                                                                                         // 27
			    name = _ref.name,                                                                                               // 27
			    description = _ref.description,                                                                                 // 27
			    showOnRegistration = _ref.showOnRegistration;                                                                   // 27
			agents = [].concat(agents);                                                                                         // 28
			var record = {                                                                                                      // 30
				enabled: enabled,                                                                                                  // 31
				name: name,                                                                                                        // 32
				description: description,                                                                                          // 33
				numAgents: agents.length,                                                                                          // 34
				showOnRegistration: showOnRegistration                                                                             // 35
			};                                                                                                                  // 30
                                                                                                                       //
			if (_id) {                                                                                                          // 38
				this.update({                                                                                                      // 39
					_id: _id                                                                                                          // 39
				}, {                                                                                                               // 39
					$set: record                                                                                                      // 39
				});                                                                                                                // 39
			} else {                                                                                                            // 40
				_id = this.insert(record);                                                                                         // 41
			}                                                                                                                   // 42
                                                                                                                       //
			var savedAgents = _.pluck(RocketChat.models.LivechatDepartmentAgents.findByDepartmentId(_id).fetch(), 'agentId');   // 44
                                                                                                                       //
			var agentsToSave = _.pluck(agents, 'agentId'); // remove other agents                                               // 45
                                                                                                                       //
                                                                                                                       //
			_.difference(savedAgents, agentsToSave).forEach(function (agentId) {                                                // 48
				RocketChat.models.LivechatDepartmentAgents.removeByDepartmentIdAndAgentId(_id, agentId);                           // 49
			});                                                                                                                 // 50
                                                                                                                       //
			agents.forEach(function (agent) {                                                                                   // 52
				RocketChat.models.LivechatDepartmentAgents.saveAgent({                                                             // 53
					agentId: agent.agentId,                                                                                           // 54
					departmentId: _id,                                                                                                // 55
					username: agent.username,                                                                                         // 56
					count: agent.count ? parseInt(agent.count) : 0,                                                                   // 57
					order: agent.order ? parseInt(agent.order) : 0                                                                    // 58
				});                                                                                                                // 53
			});                                                                                                                 // 60
			return _.extend(record, {                                                                                           // 62
				_id: _id                                                                                                           // 62
			});                                                                                                                 // 62
		}                                                                                                                    // 63
                                                                                                                       //
		return createOrUpdateDepartment;                                                                                     //
	}(); // REMOVE                                                                                                        //
                                                                                                                       //
                                                                                                                       //
	LivechatDepartment.prototype.removeById = function () {                                                               //
		function removeById(_id) {                                                                                           //
			var query = {                                                                                                       // 67
				_id: _id                                                                                                           // 67
			};                                                                                                                  // 67
			return this.remove(query);                                                                                          // 69
		}                                                                                                                    // 70
                                                                                                                       //
		return removeById;                                                                                                   //
	}();                                                                                                                  //
                                                                                                                       //
	LivechatDepartment.prototype.findEnabledWithAgents = function () {                                                    //
		function findEnabledWithAgents() {                                                                                   //
			var query = {                                                                                                       // 73
				numAgents: {                                                                                                       // 74
					$gt: 0                                                                                                            // 74
				},                                                                                                                 // 74
				enabled: true                                                                                                      // 75
			};                                                                                                                  // 73
			return this.find(query);                                                                                            // 77
		}                                                                                                                    // 78
                                                                                                                       //
		return findEnabledWithAgents;                                                                                        //
	}();                                                                                                                  //
                                                                                                                       //
	return LivechatDepartment;                                                                                            //
}(RocketChat.models._Base);                                                                                            //
                                                                                                                       //
RocketChat.models.LivechatDepartment = new LivechatDepartment();                                                       // 81
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"LivechatDepartmentAgents.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/models/LivechatDepartmentAgents.js                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                          //
                                                                                                                       //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                                 //
                                                                                                                       //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                            //
                                                                                                                       //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                   //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
/**                                                                                                                    // 1
 * Livechat Department model                                                                                           //
 */var LivechatDepartmentAgents = function (_RocketChat$models$_B) {                                                   //
	(0, _inherits3.default)(LivechatDepartmentAgents, _RocketChat$models$_B);                                             //
                                                                                                                       //
	function LivechatDepartmentAgents() {                                                                                 // 5
		(0, _classCallCheck3.default)(this, LivechatDepartmentAgents);                                                       // 5
		return (0, _possibleConstructorReturn3.default)(this, _RocketChat$models$_B.call(this, 'livechat_department_agents'));
	}                                                                                                                     // 7
                                                                                                                       //
	LivechatDepartmentAgents.prototype.findByDepartmentId = function () {                                                 //
		function findByDepartmentId(departmentId) {                                                                          //
			return this.find({                                                                                                  // 10
				departmentId: departmentId                                                                                         // 10
			});                                                                                                                 // 10
		}                                                                                                                    // 11
                                                                                                                       //
		return findByDepartmentId;                                                                                           //
	}();                                                                                                                  //
                                                                                                                       //
	LivechatDepartmentAgents.prototype.saveAgent = function () {                                                          //
		function saveAgent(agent) {                                                                                          //
			return this.upsert({                                                                                                // 14
				agentId: agent.agentId,                                                                                            // 15
				departmentId: agent.departmentId                                                                                   // 16
			}, {                                                                                                                // 14
				$set: {                                                                                                            // 18
					username: agent.username,                                                                                         // 19
					count: parseInt(agent.count),                                                                                     // 20
					order: parseInt(agent.order)                                                                                      // 21
				}                                                                                                                  // 18
			});                                                                                                                 // 17
		}                                                                                                                    // 24
                                                                                                                       //
		return saveAgent;                                                                                                    //
	}();                                                                                                                  //
                                                                                                                       //
	LivechatDepartmentAgents.prototype.removeByDepartmentIdAndAgentId = function () {                                     //
		function removeByDepartmentIdAndAgentId(departmentId, agentId) {                                                     //
			this.remove({                                                                                                       // 27
				departmentId: departmentId,                                                                                        // 27
				agentId: agentId                                                                                                   // 27
			});                                                                                                                 // 27
		}                                                                                                                    // 28
                                                                                                                       //
		return removeByDepartmentIdAndAgentId;                                                                               //
	}();                                                                                                                  //
                                                                                                                       //
	LivechatDepartmentAgents.prototype.getNextAgentForDepartment = function () {                                          //
		function getNextAgentForDepartment(departmentId) {                                                                   //
			var agents = this.findByDepartmentId(departmentId).fetch();                                                         // 31
                                                                                                                       //
			if (agents.length === 0) {                                                                                          // 33
				return;                                                                                                            // 34
			}                                                                                                                   // 35
                                                                                                                       //
			var onlineUsers = RocketChat.models.Users.findOnlineUserFromList(_.pluck(agents, 'username'));                      // 37
                                                                                                                       //
			var onlineUsernames = _.pluck(onlineUsers.fetch(), 'username');                                                     // 39
                                                                                                                       //
			var query = {                                                                                                       // 41
				departmentId: departmentId,                                                                                        // 42
				username: {                                                                                                        // 43
					$in: onlineUsernames                                                                                              // 44
				}                                                                                                                  // 43
			};                                                                                                                  // 41
			var sort = {                                                                                                        // 48
				count: 1,                                                                                                          // 49
				order: 1,                                                                                                          // 50
				username: 1                                                                                                        // 51
			};                                                                                                                  // 48
			var update = {                                                                                                      // 53
				$inc: {                                                                                                            // 54
					count: 1                                                                                                          // 55
				}                                                                                                                  // 54
			};                                                                                                                  // 53
			var collectionObj = this.model.rawCollection();                                                                     // 59
			var findAndModify = Meteor.wrapAsync(collectionObj.findAndModify, collectionObj);                                   // 60
			var agent = findAndModify(query, sort, update);                                                                     // 62
                                                                                                                       //
			if (agent && agent.value) {                                                                                         // 63
				return {                                                                                                           // 64
					agentId: agent.value.agentId,                                                                                     // 65
					username: agent.value.username                                                                                    // 66
				};                                                                                                                 // 64
			} else {                                                                                                            // 68
				return null;                                                                                                       // 69
			}                                                                                                                   // 70
		}                                                                                                                    // 71
                                                                                                                       //
		return getNextAgentForDepartment;                                                                                    //
	}();                                                                                                                  //
                                                                                                                       //
	LivechatDepartmentAgents.prototype.getOnlineForDepartment = function () {                                             //
		function getOnlineForDepartment(departmentId) {                                                                      //
			var agents = this.findByDepartmentId(departmentId).fetch();                                                         // 74
                                                                                                                       //
			if (agents.length === 0) {                                                                                          // 76
				return [];                                                                                                         // 77
			}                                                                                                                   // 78
                                                                                                                       //
			var onlineUsers = RocketChat.models.Users.findOnlineUserFromList(_.pluck(agents, 'username'));                      // 80
                                                                                                                       //
			var onlineUsernames = _.pluck(onlineUsers.fetch(), 'username');                                                     // 82
                                                                                                                       //
			var query = {                                                                                                       // 84
				departmentId: departmentId,                                                                                        // 85
				username: {                                                                                                        // 86
					$in: onlineUsernames                                                                                              // 87
				}                                                                                                                  // 86
			};                                                                                                                  // 84
			var depAgents = this.find(query);                                                                                   // 91
                                                                                                                       //
			if (depAgents) {                                                                                                    // 93
				return depAgents;                                                                                                  // 94
			} else {                                                                                                            // 95
				return [];                                                                                                         // 96
			}                                                                                                                   // 97
		}                                                                                                                    // 98
                                                                                                                       //
		return getOnlineForDepartment;                                                                                       //
	}();                                                                                                                  //
                                                                                                                       //
	LivechatDepartmentAgents.prototype.findUsersInQueue = function () {                                                   //
		function findUsersInQueue(usersList) {                                                                               //
			var query = {};                                                                                                     // 101
                                                                                                                       //
			if (!_.isEmpty(usersList)) {                                                                                        // 103
				query.username = {                                                                                                 // 104
					$in: usersList                                                                                                    // 105
				};                                                                                                                 // 104
			}                                                                                                                   // 107
                                                                                                                       //
			var options = {                                                                                                     // 109
				sort: {                                                                                                            // 110
					departmentId: 1,                                                                                                  // 111
					count: 1,                                                                                                         // 112
					order: 1,                                                                                                         // 113
					username: 1                                                                                                       // 114
				}                                                                                                                  // 110
			};                                                                                                                  // 109
			return this.find(query, options);                                                                                   // 118
		}                                                                                                                    // 119
                                                                                                                       //
		return findUsersInQueue;                                                                                             //
	}();                                                                                                                  //
                                                                                                                       //
	return LivechatDepartmentAgents;                                                                                      //
}(RocketChat.models._Base);                                                                                            //
                                                                                                                       //
RocketChat.models.LivechatDepartmentAgents = new LivechatDepartmentAgents();                                           // 122
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"LivechatPageVisited.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/models/LivechatPageVisited.js                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                          //
                                                                                                                       //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                                 //
                                                                                                                       //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                            //
                                                                                                                       //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                   //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
/**                                                                                                                    // 1
 * Livechat Page Visited model                                                                                         //
 */var LivechatPageVisited = function (_RocketChat$models$_B) {                                                        //
	(0, _inherits3.default)(LivechatPageVisited, _RocketChat$models$_B);                                                  //
                                                                                                                       //
	function LivechatPageVisited() {                                                                                      // 5
		(0, _classCallCheck3.default)(this, LivechatPageVisited);                                                            // 5
                                                                                                                       //
		var _this = (0, _possibleConstructorReturn3.default)(this, _RocketChat$models$_B.call(this, 'livechat_page_visited'));
                                                                                                                       //
		_this.tryEnsureIndex({                                                                                               // 8
			'token': 1                                                                                                          // 8
		});                                                                                                                  // 8
                                                                                                                       //
		_this.tryEnsureIndex({                                                                                               // 9
			'ts': 1                                                                                                             // 9
		}); // keep history for 1 month if the visitor does not register                                                     // 9
                                                                                                                       //
                                                                                                                       //
		_this.tryEnsureIndex({                                                                                               // 12
			'expireAt': 1                                                                                                       // 12
		}, {                                                                                                                 // 12
			sparse: 1,                                                                                                          // 12
			expireAfterSeconds: 0                                                                                               // 12
		});                                                                                                                  // 12
                                                                                                                       //
		return _this;                                                                                                        // 5
	}                                                                                                                     // 13
                                                                                                                       //
	LivechatPageVisited.prototype.saveByToken = function () {                                                             //
		function saveByToken(token, pageInfo) {                                                                              //
			// keep history of unregistered visitors for 1 month                                                                // 16
			var keepHistoryMiliseconds = 2592000000;                                                                            // 17
			return this.insert({                                                                                                // 19
				token: token,                                                                                                      // 20
				page: pageInfo,                                                                                                    // 21
				ts: new Date(),                                                                                                    // 22
				expireAt: new Date().getTime() + keepHistoryMiliseconds                                                            // 23
			});                                                                                                                 // 19
		}                                                                                                                    // 25
                                                                                                                       //
		return saveByToken;                                                                                                  //
	}();                                                                                                                  //
                                                                                                                       //
	LivechatPageVisited.prototype.findByToken = function () {                                                             //
		function findByToken(token) {                                                                                        //
			return this.find({                                                                                                  // 28
				token: token                                                                                                       // 28
			}, {                                                                                                                // 28
				sort: {                                                                                                            // 28
					ts: -1                                                                                                            // 28
				},                                                                                                                 // 28
				limit: 20                                                                                                          // 28
			});                                                                                                                 // 28
		}                                                                                                                    // 29
                                                                                                                       //
		return findByToken;                                                                                                  //
	}();                                                                                                                  //
                                                                                                                       //
	LivechatPageVisited.prototype.keepHistoryForToken = function () {                                                     //
		function keepHistoryForToken(token) {                                                                                //
			return this.update({                                                                                                // 32
				token: token,                                                                                                      // 33
				expireAt: {                                                                                                        // 34
					$exists: true                                                                                                     // 35
				}                                                                                                                  // 34
			}, {                                                                                                                // 32
				$unset: {                                                                                                          // 38
					expireAt: 1                                                                                                       // 39
				}                                                                                                                  // 38
			}, {                                                                                                                // 37
				multi: true                                                                                                        // 42
			});                                                                                                                 // 41
		}                                                                                                                    // 44
                                                                                                                       //
		return keepHistoryForToken;                                                                                          //
	}();                                                                                                                  //
                                                                                                                       //
	return LivechatPageVisited;                                                                                           //
}(RocketChat.models._Base);                                                                                            //
                                                                                                                       //
RocketChat.models.LivechatPageVisited = new LivechatPageVisited();                                                     // 47
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"LivechatTrigger.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/models/LivechatTrigger.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                          //
                                                                                                                       //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                                 //
                                                                                                                       //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                            //
                                                                                                                       //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                   //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
/**                                                                                                                    // 1
 * Livechat Trigger model                                                                                              //
 */var LivechatTrigger = function (_RocketChat$models$_B) {                                                            //
	(0, _inherits3.default)(LivechatTrigger, _RocketChat$models$_B);                                                      //
                                                                                                                       //
	function LivechatTrigger() {                                                                                          // 5
		(0, _classCallCheck3.default)(this, LivechatTrigger);                                                                // 5
		return (0, _possibleConstructorReturn3.default)(this, _RocketChat$models$_B.call(this, 'livechat_trigger'));         // 5
	}                                                                                                                     // 7
                                                                                                                       //
	LivechatTrigger.prototype.updateById = function () {                                                                  //
		function updateById(_id, data) {                                                                                     //
			return this.update({                                                                                                // 10
				_id: _id                                                                                                           // 10
			}, {                                                                                                                // 10
				$set: data                                                                                                         // 10
			});                                                                                                                 // 10
		}                                                                                                                    // 11
                                                                                                                       //
		return updateById;                                                                                                   //
	}();                                                                                                                  //
                                                                                                                       //
	LivechatTrigger.prototype.removeAll = function () {                                                                   //
		function removeAll() {                                                                                               //
			return this.remove({});                                                                                             // 14
		}                                                                                                                    // 15
                                                                                                                       //
		return removeAll;                                                                                                    //
	}();                                                                                                                  //
                                                                                                                       //
	LivechatTrigger.prototype.findById = function () {                                                                    //
		function findById(_id) {                                                                                             //
			return this.find({                                                                                                  // 18
				_id: _id                                                                                                           // 18
			});                                                                                                                 // 18
		}                                                                                                                    // 19
                                                                                                                       //
		return findById;                                                                                                     //
	}();                                                                                                                  //
                                                                                                                       //
	LivechatTrigger.prototype.removeById = function () {                                                                  //
		function removeById(_id) {                                                                                           //
			return this.remove({                                                                                                // 22
				_id: _id                                                                                                           // 22
			});                                                                                                                 // 22
		}                                                                                                                    // 23
                                                                                                                       //
		return removeById;                                                                                                   //
	}();                                                                                                                  //
                                                                                                                       //
	LivechatTrigger.prototype.findEnabled = function () {                                                                 //
		function findEnabled() {                                                                                             //
			return this.find({                                                                                                  // 26
				enabled: true                                                                                                      // 26
			});                                                                                                                 // 26
		}                                                                                                                    // 27
                                                                                                                       //
		return findEnabled;                                                                                                  //
	}();                                                                                                                  //
                                                                                                                       //
	return LivechatTrigger;                                                                                               //
}(RocketChat.models._Base);                                                                                            //
                                                                                                                       //
RocketChat.models.LivechatTrigger = new LivechatTrigger();                                                             // 30
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"indexes.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/models/indexes.js                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.startup(function () {                                                                                           // 1
	RocketChat.models.Rooms.tryEnsureIndex({                                                                              // 2
		code: 1                                                                                                              // 2
	});                                                                                                                   // 2
	RocketChat.models.Rooms.tryEnsureIndex({                                                                              // 3
		open: 1                                                                                                              // 3
	}, {                                                                                                                  // 3
		sparse: 1                                                                                                            // 3
	});                                                                                                                   // 3
	RocketChat.models.Users.tryEnsureIndex({                                                                              // 4
		'visitorEmails.address': 1                                                                                           // 4
	});                                                                                                                   // 4
});                                                                                                                    // 5
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"LivechatInquiry.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/models/LivechatInquiry.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                          //
                                                                                                                       //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                                 //
                                                                                                                       //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                            //
                                                                                                                       //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                   //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
var LivechatInquiry = function (_RocketChat$models$_B) {                                                               //
	(0, _inherits3.default)(LivechatInquiry, _RocketChat$models$_B);                                                      //
                                                                                                                       //
	function LivechatInquiry() {                                                                                          // 2
		(0, _classCallCheck3.default)(this, LivechatInquiry);                                                                // 2
                                                                                                                       //
		var _this = (0, _possibleConstructorReturn3.default)(this, _RocketChat$models$_B.call(this, 'livechat_inquiry'));    // 2
                                                                                                                       //
		_this.tryEnsureIndex({                                                                                               // 5
			'rid': 1                                                                                                            // 5
		}); // room id corresponding to this inquiry                                                                         // 5
                                                                                                                       //
                                                                                                                       //
		_this.tryEnsureIndex({                                                                                               // 6
			'name': 1                                                                                                           // 6
		}); // name of the inquiry (client name for now)                                                                     // 6
                                                                                                                       //
                                                                                                                       //
		_this.tryEnsureIndex({                                                                                               // 7
			'message': 1                                                                                                        // 7
		}); // message sent by the client                                                                                    // 7
                                                                                                                       //
                                                                                                                       //
		_this.tryEnsureIndex({                                                                                               // 8
			'ts': 1                                                                                                             // 8
		}); // timestamp                                                                                                     // 8
                                                                                                                       //
                                                                                                                       //
		_this.tryEnsureIndex({                                                                                               // 9
			'code': 1                                                                                                           // 9
		}); // (for routing)                                                                                                 // 9
                                                                                                                       //
                                                                                                                       //
		_this.tryEnsureIndex({                                                                                               // 10
			'agents': 1                                                                                                         // 10
		}); // Id's of the agents who can see the inquiry (handle departments)                                               // 10
                                                                                                                       //
                                                                                                                       //
		_this.tryEnsureIndex({                                                                                               // 11
			'status': 1                                                                                                         // 11
		}); // 'open', 'taken'                                                                                               // 11
                                                                                                                       //
                                                                                                                       //
		return _this;                                                                                                        // 2
	}                                                                                                                     // 12
                                                                                                                       //
	LivechatInquiry.prototype.findOneById = function () {                                                                 //
		function findOneById(inquiryId) {                                                                                    //
			return this.findOne({                                                                                               // 15
				_id: inquiryId                                                                                                     // 15
			});                                                                                                                 // 15
		}                                                                                                                    // 16
                                                                                                                       //
		return findOneById;                                                                                                  //
	}(); /*                                                                                                               //
       * mark the inquiry as taken                                                                                     //
       */                                                                                                              //
                                                                                                                       //
	LivechatInquiry.prototype.takeInquiry = function () {                                                                 //
		function takeInquiry(inquiryId) {                                                                                    //
			this.update({                                                                                                       // 22
				'_id': inquiryId                                                                                                   // 23
			}, {                                                                                                                // 22
				$set: {                                                                                                            // 25
					status: 'taken'                                                                                                   // 25
				}                                                                                                                  // 25
			});                                                                                                                 // 24
		}                                                                                                                    // 27
                                                                                                                       //
		return takeInquiry;                                                                                                  //
	}(); /*                                                                                                               //
       * mark inquiry as open                                                                                          //
       */                                                                                                              //
                                                                                                                       //
	LivechatInquiry.prototype.openInquiry = function () {                                                                 //
		function openInquiry(inquiryId) {                                                                                    //
			this.update({                                                                                                       // 33
				'_id': inquiryId                                                                                                   // 34
			}, {                                                                                                                // 33
				$set: {                                                                                                            // 36
					status: 'open'                                                                                                    // 36
				}                                                                                                                  // 36
			});                                                                                                                 // 35
		}                                                                                                                    // 38
                                                                                                                       //
		return openInquiry;                                                                                                  //
	}(); /*                                                                                                               //
       * return the status of the inquiry (open or taken)                                                              //
       */                                                                                                              //
                                                                                                                       //
	LivechatInquiry.prototype.getStatus = function () {                                                                   //
		function getStatus(inquiryId) {                                                                                      //
			return this.findOne({                                                                                               // 44
				'_id': inquiryId                                                                                                   // 44
			}).status;                                                                                                          // 44
		}                                                                                                                    // 45
                                                                                                                       //
		return getStatus;                                                                                                    //
	}();                                                                                                                  //
                                                                                                                       //
	return LivechatInquiry;                                                                                               //
}(RocketChat.models._Base);                                                                                            //
                                                                                                                       //
RocketChat.models.LivechatInquiry = new LivechatInquiry();                                                             // 48
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"LivechatOfficeHour.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/models/LivechatOfficeHour.js                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                          //
                                                                                                                       //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                                 //
                                                                                                                       //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                            //
                                                                                                                       //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                   //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
var moment = void 0;                                                                                                   // 1
module.watch(require("moment"), {                                                                                      // 1
	"default": function (v) {                                                                                             // 1
		moment = v;                                                                                                          // 1
	}                                                                                                                     // 1
}, 0);                                                                                                                 // 1
                                                                                                                       //
var LivechatOfficeHour = function (_RocketChat$models$_B) {                                                            //
	(0, _inherits3.default)(LivechatOfficeHour, _RocketChat$models$_B);                                                   //
                                                                                                                       //
	function LivechatOfficeHour() {                                                                                       // 4
		(0, _classCallCheck3.default)(this, LivechatOfficeHour);                                                             // 4
                                                                                                                       //
		var _this = (0, _possibleConstructorReturn3.default)(this, _RocketChat$models$_B.call(this, 'livechat_office_hour'));
                                                                                                                       //
		_this.tryEnsureIndex({                                                                                               // 7
			'day': 1                                                                                                            // 7
		}); // the day of the week monday - sunday                                                                           // 7
                                                                                                                       //
                                                                                                                       //
		_this.tryEnsureIndex({                                                                                               // 8
			'start': 1                                                                                                          // 8
		}); // the opening hours of the office                                                                               // 8
                                                                                                                       //
                                                                                                                       //
		_this.tryEnsureIndex({                                                                                               // 9
			'finish': 1                                                                                                         // 9
		}); // the closing hours of the office                                                                               // 9
                                                                                                                       //
                                                                                                                       //
		_this.tryEnsureIndex({                                                                                               // 10
			'open': 1                                                                                                           // 10
		}); // whether or not the offices are open on this day                                                               // 10
		// if there is nothing in the collection, add defaults                                                               // 12
                                                                                                                       //
                                                                                                                       //
		if (_this.find().count() === 0) {                                                                                    // 13
			_this.insert({                                                                                                      // 14
				'day': 'Monday',                                                                                                   // 14
				'start': '08:00',                                                                                                  // 14
				'finish': '20:00',                                                                                                 // 14
				'code': 1,                                                                                                         // 14
				'open': true                                                                                                       // 14
			});                                                                                                                 // 14
                                                                                                                       //
			_this.insert({                                                                                                      // 15
				'day': 'Tuesday',                                                                                                  // 15
				'start': '08:00',                                                                                                  // 15
				'finish': '20:00',                                                                                                 // 15
				'code': 2,                                                                                                         // 15
				'open': true                                                                                                       // 15
			});                                                                                                                 // 15
                                                                                                                       //
			_this.insert({                                                                                                      // 16
				'day': 'Wednesday',                                                                                                // 16
				'start': '08:00',                                                                                                  // 16
				'finish': '20:00',                                                                                                 // 16
				'code': 3,                                                                                                         // 16
				'open': true                                                                                                       // 16
			});                                                                                                                 // 16
                                                                                                                       //
			_this.insert({                                                                                                      // 17
				'day': 'Thursday',                                                                                                 // 17
				'start': '08:00',                                                                                                  // 17
				'finish': '20:00',                                                                                                 // 17
				'code': 4,                                                                                                         // 17
				'open': true                                                                                                       // 17
			});                                                                                                                 // 17
                                                                                                                       //
			_this.insert({                                                                                                      // 18
				'day': 'Friday',                                                                                                   // 18
				'start': '08:00',                                                                                                  // 18
				'finish': '20:00',                                                                                                 // 18
				'code': 5,                                                                                                         // 18
				'open': true                                                                                                       // 18
			});                                                                                                                 // 18
                                                                                                                       //
			_this.insert({                                                                                                      // 19
				'day': 'Saturday',                                                                                                 // 19
				'start': '08:00',                                                                                                  // 19
				'finish': '20:00',                                                                                                 // 19
				'code': 6,                                                                                                         // 19
				'open': false                                                                                                      // 19
			});                                                                                                                 // 19
                                                                                                                       //
			_this.insert({                                                                                                      // 20
				'day': 'Sunday',                                                                                                   // 20
				'start': '08:00',                                                                                                  // 20
				'finish': '20:00',                                                                                                 // 20
				'code': 0,                                                                                                         // 20
				'open': false                                                                                                      // 20
			});                                                                                                                 // 20
		}                                                                                                                    // 21
                                                                                                                       //
		return _this;                                                                                                        // 4
	} /*                                                                                                                  // 22
    * update the given days start and finish times and whether the office is open on that day                          //
    */                                                                                                                 //
                                                                                                                       //
	LivechatOfficeHour.prototype.updateHours = function () {                                                              //
		function updateHours(day, newStart, newFinish, newOpen) {                                                            //
			this.update({                                                                                                       // 28
				day: day                                                                                                           // 29
			}, {                                                                                                                // 28
				$set: {                                                                                                            // 31
					start: newStart,                                                                                                  // 32
					finish: newFinish,                                                                                                // 33
					open: newOpen                                                                                                     // 34
				}                                                                                                                  // 31
			});                                                                                                                 // 30
		}                                                                                                                    // 37
                                                                                                                       //
		return updateHours;                                                                                                  //
	}(); /*                                                                                                               //
       * Check if the current server time (utc) is within the office hours of that day                                 //
       * returns true or false                                                                                         //
       */                                                                                                              //
                                                                                                                       //
	LivechatOfficeHour.prototype.isNowWithinHours = function () {                                                         //
		function isNowWithinHours() {                                                                                        //
			// get current time on server in utc                                                                                // 44
			// var ct = moment().utc();                                                                                         // 45
			var currentTime = moment.utc(moment().utc().format('dddd:HH:mm'), 'dddd:HH:mm'); // get todays office hours from db
                                                                                                                       //
			var todaysOfficeHours = this.findOne({                                                                              // 49
				day: currentTime.format('dddd')                                                                                    // 49
			});                                                                                                                 // 49
                                                                                                                       //
			if (!todaysOfficeHours) {                                                                                           // 50
				return false;                                                                                                      // 51
			} // check if offices are open today                                                                                // 52
                                                                                                                       //
                                                                                                                       //
			if (todaysOfficeHours.open === false) {                                                                             // 55
				return false;                                                                                                      // 56
			}                                                                                                                   // 57
                                                                                                                       //
			var start = moment.utc(todaysOfficeHours.day + ":" + todaysOfficeHours.start, 'dddd:HH:mm');                        // 59
			var finish = moment.utc(todaysOfficeHours.day + ":" + todaysOfficeHours.finish, 'dddd:HH:mm'); // console.log(finish.isBefore(start));
                                                                                                                       //
			if (finish.isBefore(start)) {                                                                                       // 63
				// finish.day(finish.day()+1);                                                                                     // 64
				finish.add(1, 'days');                                                                                             // 65
			}                                                                                                                   // 66
                                                                                                                       //
			var result = currentTime.isBetween(start, finish); // inBetween  check                                              // 68
                                                                                                                       //
			return result;                                                                                                      // 71
		}                                                                                                                    // 72
                                                                                                                       //
		return isNowWithinHours;                                                                                             //
	}();                                                                                                                  //
                                                                                                                       //
	LivechatOfficeHour.prototype.isOpeningTime = function () {                                                            //
		function isOpeningTime() {                                                                                           //
			// get current time on server in utc                                                                                // 75
			var currentTime = moment.utc(moment().utc().format('dddd:HH:mm'), 'dddd:HH:mm'); // get todays office hours from db
                                                                                                                       //
			var todaysOfficeHours = this.findOne({                                                                              // 79
				day: currentTime.format('dddd')                                                                                    // 79
			});                                                                                                                 // 79
                                                                                                                       //
			if (!todaysOfficeHours) {                                                                                           // 80
				return false;                                                                                                      // 81
			} // check if offices are open today                                                                                // 82
                                                                                                                       //
                                                                                                                       //
			if (todaysOfficeHours.open === false) {                                                                             // 85
				return false;                                                                                                      // 86
			}                                                                                                                   // 87
                                                                                                                       //
			var start = moment.utc(todaysOfficeHours.day + ":" + todaysOfficeHours.start, 'dddd:HH:mm');                        // 89
			return start.isSame(currentTime, 'minute');                                                                         // 91
		}                                                                                                                    // 92
                                                                                                                       //
		return isOpeningTime;                                                                                                //
	}();                                                                                                                  //
                                                                                                                       //
	LivechatOfficeHour.prototype.isClosingTime = function () {                                                            //
		function isClosingTime() {                                                                                           //
			// get current time on server in utc                                                                                // 95
			var currentTime = moment.utc(moment().utc().format('dddd:HH:mm'), 'dddd:HH:mm'); // get todays office hours from db
                                                                                                                       //
			var todaysOfficeHours = this.findOne({                                                                              // 99
				day: currentTime.format('dddd')                                                                                    // 99
			});                                                                                                                 // 99
                                                                                                                       //
			if (!todaysOfficeHours) {                                                                                           // 100
				return false;                                                                                                      // 101
			}                                                                                                                   // 102
                                                                                                                       //
			var finish = moment.utc(todaysOfficeHours.day + ":" + todaysOfficeHours.finish, 'dddd:HH:mm');                      // 104
			return finish.isSame(currentTime, 'minute');                                                                        // 106
		}                                                                                                                    // 107
                                                                                                                       //
		return isClosingTime;                                                                                                //
	}();                                                                                                                  //
                                                                                                                       //
	return LivechatOfficeHour;                                                                                            //
}(RocketChat.models._Base);                                                                                            //
                                                                                                                       //
RocketChat.models.LivechatOfficeHour = new LivechatOfficeHour();                                                       // 110
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"lib":{"Livechat.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/lib/Livechat.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var UAParser = void 0;                                                                                                 // 1
module.watch(require("ua-parser-js"), {                                                                                // 1
	"default": function (v) {                                                                                             // 1
		UAParser = v;                                                                                                        // 1
	}                                                                                                                     // 1
}, 0);                                                                                                                 // 1
RocketChat.Livechat = {                                                                                                // 4
	historyMonitorType: 'url',                                                                                            // 5
	logger: new Logger('Livechat', {                                                                                      // 7
		sections: {                                                                                                          // 8
			webhook: 'Webhook'                                                                                                  // 9
		}                                                                                                                    // 8
	}),                                                                                                                   // 7
	getNextAgent: function (department) {                                                                                 // 13
		if (department) {                                                                                                    // 14
			return RocketChat.models.LivechatDepartmentAgents.getNextAgentForDepartment(department);                            // 15
		} else {                                                                                                             // 16
			return RocketChat.models.Users.getNextAgent();                                                                      // 17
		}                                                                                                                    // 18
	},                                                                                                                    // 19
	getAgents: function (department) {                                                                                    // 20
		if (department) {                                                                                                    // 21
			return RocketChat.models.LivechatDepartmentAgents.findByDepartmentId(department);                                   // 22
		} else {                                                                                                             // 23
			return RocketChat.models.Users.findAgents();                                                                        // 24
		}                                                                                                                    // 25
	},                                                                                                                    // 26
	getOnlineAgents: function (department) {                                                                              // 27
		if (department) {                                                                                                    // 28
			return RocketChat.models.LivechatDepartmentAgents.getOnlineForDepartment(department);                               // 29
		} else {                                                                                                             // 30
			return RocketChat.models.Users.findOnlineAgents();                                                                  // 31
		}                                                                                                                    // 32
	},                                                                                                                    // 33
	getRoom: function (guest, message, roomInfo) {                                                                        // 34
		var room = RocketChat.models.Rooms.findOneById(message.rid);                                                         // 35
		var newRoom = false;                                                                                                 // 36
                                                                                                                       //
		if (room && !room.open) {                                                                                            // 38
			message.rid = Random.id();                                                                                          // 39
			room = null;                                                                                                        // 40
		}                                                                                                                    // 41
                                                                                                                       //
		if (room == null) {                                                                                                  // 43
			// if no department selected verify if there is at least one active and pick the first                              // 44
			if (!guest.department) {                                                                                            // 45
				var departments = RocketChat.models.LivechatDepartment.findEnabledWithAgents();                                    // 46
                                                                                                                       //
				if (departments.count() > 0) {                                                                                     // 47
					departments.forEach(function (dept) {                                                                             // 48
						if (!guest.department && dept.showOnRegistration) {                                                              // 49
							guest.department = dept._id;                                                                                    // 50
						}                                                                                                                // 51
					});                                                                                                               // 52
				}                                                                                                                  // 53
			} // delegate room creation to QueueMethods                                                                         // 54
                                                                                                                       //
                                                                                                                       //
			var routingMethod = RocketChat.settings.get('Livechat_Routing_Method');                                             // 57
			room = RocketChat.QueueMethods[routingMethod](guest, message, roomInfo);                                            // 58
			newRoom = true;                                                                                                     // 60
		} else {                                                                                                             // 61
			room = Meteor.call('canAccessRoom', message.rid, guest._id);                                                        // 62
		}                                                                                                                    // 63
                                                                                                                       //
		if (!room) {                                                                                                         // 64
			throw new Meteor.Error('cannot-acess-room');                                                                        // 65
		}                                                                                                                    // 66
                                                                                                                       //
		return {                                                                                                             // 68
			room: room,                                                                                                         // 68
			newRoom: newRoom                                                                                                    // 68
		};                                                                                                                   // 68
	},                                                                                                                    // 69
	sendMessage: function (_ref) {                                                                                        // 70
		var guest = _ref.guest,                                                                                              // 70
		    message = _ref.message,                                                                                          // 70
		    roomInfo = _ref.roomInfo;                                                                                        // 70
                                                                                                                       //
		var _getRoom = this.getRoom(guest, message, roomInfo),                                                               // 70
		    room = _getRoom.room,                                                                                            // 70
		    newRoom = _getRoom.newRoom;                                                                                      // 70
                                                                                                                       //
		if (guest.name) {                                                                                                    // 72
			message.alias = guest.name;                                                                                         // 73
		} // return messages;                                                                                                // 74
                                                                                                                       //
                                                                                                                       //
		return _.extend(RocketChat.sendMessage(guest, message, room), {                                                      // 77
			newRoom: newRoom,                                                                                                   // 77
			showConnecting: this.showConnecting()                                                                               // 77
		});                                                                                                                  // 77
	},                                                                                                                    // 78
	registerGuest: function () {                                                                                          // 79
		var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},                                  // 79
		    token = _ref2.token,                                                                                             // 79
		    name = _ref2.name,                                                                                               // 79
		    email = _ref2.email,                                                                                             // 79
		    department = _ref2.department,                                                                                   // 79
		    phone = _ref2.phone,                                                                                             // 79
		    loginToken = _ref2.loginToken,                                                                                   // 79
		    username = _ref2.username;                                                                                       // 79
                                                                                                                       //
		check(token, String);                                                                                                // 80
		var userId = void 0;                                                                                                 // 82
		var updateUser = {                                                                                                   // 83
			$set: {                                                                                                             // 84
				profile: {                                                                                                         // 85
					guest: true,                                                                                                      // 86
					token: token                                                                                                      // 87
				}                                                                                                                  // 85
			}                                                                                                                   // 84
		};                                                                                                                   // 83
		var user = RocketChat.models.Users.getVisitorByToken(token, {                                                        // 92
			fields: {                                                                                                           // 92
				_id: 1                                                                                                             // 92
			}                                                                                                                   // 92
		});                                                                                                                  // 92
                                                                                                                       //
		if (user) {                                                                                                          // 94
			userId = user._id;                                                                                                  // 95
                                                                                                                       //
			if (loginToken) {                                                                                                   // 96
				if (!updateUser.$addToSet) {                                                                                       // 97
					updateUser.$addToSet = {};                                                                                        // 98
				}                                                                                                                  // 99
                                                                                                                       //
				updateUser.$addToSet['services.resume.loginTokens'] = loginToken;                                                  // 100
			}                                                                                                                   // 101
		} else {                                                                                                             // 102
			if (!username) {                                                                                                    // 103
				username = RocketChat.models.Users.getNextVisitorUsername();                                                       // 104
			}                                                                                                                   // 105
                                                                                                                       //
			var existingUser = null;                                                                                            // 107
                                                                                                                       //
			if (s.trim(email) !== '' && (existingUser = RocketChat.models.Users.findOneGuestByEmailAddress(email))) {           // 109
				if (loginToken) {                                                                                                  // 110
					if (!updateUser.$addToSet) {                                                                                      // 111
						updateUser.$addToSet = {};                                                                                       // 112
					}                                                                                                                 // 113
                                                                                                                       //
					updateUser.$addToSet['services.resume.loginTokens'] = loginToken;                                                 // 114
				}                                                                                                                  // 115
                                                                                                                       //
				userId = existingUser._id;                                                                                         // 117
			} else {                                                                                                            // 118
				var userData = {                                                                                                   // 120
					username: username,                                                                                               // 121
					globalRoles: ['livechat-guest'],                                                                                  // 122
					department: department,                                                                                           // 123
					type: 'visitor',                                                                                                  // 124
					joinDefaultChannels: false                                                                                        // 125
				};                                                                                                                 // 120
                                                                                                                       //
				if (this.connection) {                                                                                             // 128
					userData.userAgent = this.connection.httpHeaders['user-agent'];                                                   // 129
					userData.ip = this.connection.httpHeaders['x-real-ip'] || this.connection.httpHeaders['x-forwarded-for'] || this.connection.clientAddress;
					userData.host = this.connection.httpHeaders.host;                                                                 // 131
				}                                                                                                                  // 132
                                                                                                                       //
				userId = Accounts.insertUserDoc({}, userData);                                                                     // 134
                                                                                                                       //
				if (loginToken) {                                                                                                  // 136
					updateUser.$set.services = {                                                                                      // 137
						resume: {                                                                                                        // 138
							loginTokens: [loginToken]                                                                                       // 139
						}                                                                                                                // 138
					};                                                                                                                // 137
				}                                                                                                                  // 142
			}                                                                                                                   // 143
		}                                                                                                                    // 144
                                                                                                                       //
		if (phone) {                                                                                                         // 146
			updateUser.$set.phone = [{                                                                                          // 147
				phoneNumber: phone.number                                                                                          // 148
			}];                                                                                                                 // 148
		}                                                                                                                    // 150
                                                                                                                       //
		if (email && email.trim() !== '') {                                                                                  // 152
			updateUser.$set.visitorEmails = [{                                                                                  // 153
				address: email                                                                                                     // 154
			}];                                                                                                                 // 154
		}                                                                                                                    // 156
                                                                                                                       //
		if (name) {                                                                                                          // 158
			RocketChat._setRealName(userId, name);                                                                              // 159
		}                                                                                                                    // 160
                                                                                                                       //
		Meteor.users.update(userId, updateUser);                                                                             // 162
		return userId;                                                                                                       // 164
	},                                                                                                                    // 165
	setDepartmentForGuest: function () {                                                                                  // 166
		var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},                                  // 166
		    token = _ref3.token,                                                                                             // 166
		    department = _ref3.department;                                                                                   // 166
                                                                                                                       //
		check(token, String);                                                                                                // 167
		var updateUser = {                                                                                                   // 169
			$set: {                                                                                                             // 170
				department: department                                                                                             // 171
			}                                                                                                                   // 170
		};                                                                                                                   // 169
		var user = RocketChat.models.Users.getVisitorByToken(token, {                                                        // 175
			fields: {                                                                                                           // 175
				_id: 1                                                                                                             // 175
			}                                                                                                                   // 175
		});                                                                                                                  // 175
                                                                                                                       //
		if (user) {                                                                                                          // 176
			return Meteor.users.update(user._id, updateUser);                                                                   // 177
		}                                                                                                                    // 178
                                                                                                                       //
		return false;                                                                                                        // 179
	},                                                                                                                    // 180
	saveGuest: function (_ref4) {                                                                                         // 181
		var _id = _ref4._id,                                                                                                 // 181
		    name = _ref4.name,                                                                                               // 181
		    email = _ref4.email,                                                                                             // 181
		    phone = _ref4.phone;                                                                                             // 181
		var updateData = {};                                                                                                 // 182
                                                                                                                       //
		if (name) {                                                                                                          // 184
			updateData.name = name;                                                                                             // 185
		}                                                                                                                    // 186
                                                                                                                       //
		if (email) {                                                                                                         // 187
			updateData.email = email;                                                                                           // 188
		}                                                                                                                    // 189
                                                                                                                       //
		if (phone) {                                                                                                         // 190
			updateData.phone = phone;                                                                                           // 191
		}                                                                                                                    // 192
                                                                                                                       //
		var ret = RocketChat.models.Users.saveGuestById(_id, updateData);                                                    // 193
		Meteor.defer(function () {                                                                                           // 195
			RocketChat.callbacks.run('livechat.saveGuest', updateData);                                                         // 196
		});                                                                                                                  // 197
		return ret;                                                                                                          // 199
	},                                                                                                                    // 200
	closeRoom: function (_ref5) {                                                                                         // 202
		var user = _ref5.user,                                                                                               // 202
		    room = _ref5.room,                                                                                               // 202
		    comment = _ref5.comment;                                                                                         // 202
		var now = new Date();                                                                                                // 203
		RocketChat.models.Rooms.closeByRoomId(room._id, {                                                                    // 204
			user: {                                                                                                             // 205
				_id: user._id,                                                                                                     // 206
				username: user.username                                                                                            // 207
			},                                                                                                                  // 205
			closedAt: now,                                                                                                      // 209
			chatDuration: (now.getTime() - room.ts) / 1000                                                                      // 210
		});                                                                                                                  // 204
		var message = {                                                                                                      // 213
			t: 'livechat-close',                                                                                                // 214
			msg: comment,                                                                                                       // 215
			groupable: false                                                                                                    // 216
		};                                                                                                                   // 213
		RocketChat.sendMessage(user, message, room);                                                                         // 219
		RocketChat.models.Subscriptions.hideByRoomIdAndUserId(room._id, user._id);                                           // 221
		RocketChat.models.Messages.createCommandWithRoomIdAndUser('promptTranscript', room._id, user);                       // 222
		Meteor.defer(function () {                                                                                           // 224
			RocketChat.callbacks.run('livechat.closeRoom', room);                                                               // 225
		});                                                                                                                  // 226
		return true;                                                                                                         // 228
	},                                                                                                                    // 229
	getInitSettings: function () {                                                                                        // 231
		var settings = {};                                                                                                   // 232
		RocketChat.models.Settings.findNotHiddenPublic(['Livechat_title', 'Livechat_title_color', 'Livechat_enabled', 'Livechat_registration_form', 'Livechat_allow_switching_departments', 'Livechat_offline_title', 'Livechat_offline_title_color', 'Livechat_offline_message', 'Livechat_offline_success_message', 'Livechat_offline_form_unavailable', 'Livechat_display_offline_form', 'Livechat_videocall_enabled', 'Jitsi_Enabled', 'Language', 'Livechat_enable_transcript', 'Livechat_transcript_message']).forEach(function (setting) {
			settings[setting._id] = setting.value;                                                                              // 252
		});                                                                                                                  // 253
		return settings;                                                                                                     // 255
	},                                                                                                                    // 256
	saveRoomInfo: function (roomData, guestData) {                                                                        // 258
		if ((roomData.topic != null || roomData.tags != null) && !RocketChat.models.Rooms.setTopicAndTagsById(roomData._id, roomData.topic, roomData.tags)) {
			return false;                                                                                                       // 260
		}                                                                                                                    // 261
                                                                                                                       //
		Meteor.defer(function () {                                                                                           // 263
			RocketChat.callbacks.run('livechat.saveRoom', roomData);                                                            // 264
		});                                                                                                                  // 265
                                                                                                                       //
		if (!_.isEmpty(guestData.name)) {                                                                                    // 267
			return RocketChat.models.Rooms.setLabelByRoomId(roomData._id, guestData.name) && RocketChat.models.Subscriptions.updateNameByRoomId(roomData._id, guestData.name);
		}                                                                                                                    // 269
	},                                                                                                                    // 270
	closeOpenChats: function (userId, comment) {                                                                          // 272
		var _this = this;                                                                                                    // 272
                                                                                                                       //
		var user = RocketChat.models.Users.findOneById(userId);                                                              // 273
		RocketChat.models.Rooms.findOpenByAgent(userId).forEach(function (room) {                                            // 274
			_this.closeRoom({                                                                                                   // 275
				user: user,                                                                                                        // 275
				room: room,                                                                                                        // 275
				comment: comment                                                                                                   // 275
			});                                                                                                                 // 275
		});                                                                                                                  // 276
	},                                                                                                                    // 277
	forwardOpenChats: function (userId) {                                                                                 // 279
		var _this2 = this;                                                                                                   // 279
                                                                                                                       //
		RocketChat.models.Rooms.findOpenByAgent(userId).forEach(function (room) {                                            // 280
			var guest = RocketChat.models.Users.findOneById(room.v._id);                                                        // 281
                                                                                                                       //
			_this2.transfer(room, guest, {                                                                                      // 282
				departmentId: guest.department                                                                                     // 282
			});                                                                                                                 // 282
		});                                                                                                                  // 283
	},                                                                                                                    // 284
	savePageHistory: function (token, pageInfo) {                                                                         // 286
		if (pageInfo.change === RocketChat.Livechat.historyMonitorType) {                                                    // 287
			return RocketChat.models.LivechatPageVisited.saveByToken(token, pageInfo);                                          // 288
		}                                                                                                                    // 289
                                                                                                                       //
		return;                                                                                                              // 291
	},                                                                                                                    // 292
	transfer: function (room, guest, transferData) {                                                                      // 294
		var agent = void 0;                                                                                                  // 295
                                                                                                                       //
		if (transferData.userId) {                                                                                           // 297
			var user = RocketChat.models.Users.findOneById(transferData.userId);                                                // 298
			agent = {                                                                                                           // 299
				agentId: user._id,                                                                                                 // 300
				username: user.username                                                                                            // 301
			};                                                                                                                  // 299
		} else {                                                                                                             // 303
			agent = RocketChat.Livechat.getNextAgent(transferData.departmentId);                                                // 304
		}                                                                                                                    // 305
                                                                                                                       //
		var servedBy = room.servedBy;                                                                                        // 307
                                                                                                                       //
		if (agent && agent.agentId !== servedBy._id) {                                                                       // 309
			room.usernames = _.without(room.usernames, servedBy.username).concat(agent.username);                               // 310
			RocketChat.models.Rooms.changeAgentByRoomId(room._id, agent);                                                       // 312
			var subscriptionData = {                                                                                            // 314
				rid: room._id,                                                                                                     // 315
				name: guest.name || guest.username,                                                                                // 316
				alert: true,                                                                                                       // 317
				open: true,                                                                                                        // 318
				unread: 1,                                                                                                         // 319
				userMentions: 1,                                                                                                   // 320
				groupMentions: 0,                                                                                                  // 321
				code: room.code,                                                                                                   // 322
				u: {                                                                                                               // 323
					_id: agent.agentId,                                                                                               // 324
					username: agent.username                                                                                          // 325
				},                                                                                                                 // 323
				t: 'l',                                                                                                            // 327
				desktopNotifications: 'all',                                                                                       // 328
				mobilePushNotifications: 'all',                                                                                    // 329
				emailNotifications: 'all'                                                                                          // 330
			};                                                                                                                  // 314
			RocketChat.models.Subscriptions.removeByRoomIdAndUserId(room._id, servedBy._id);                                    // 332
			RocketChat.models.Subscriptions.insert(subscriptionData);                                                           // 334
			RocketChat.models.Messages.createUserLeaveWithRoomIdAndUser(room._id, {                                             // 336
				_id: servedBy._id,                                                                                                 // 336
				username: servedBy.username                                                                                        // 336
			});                                                                                                                 // 336
			RocketChat.models.Messages.createUserJoinWithRoomIdAndUser(room._id, {                                              // 337
				_id: agent.agentId,                                                                                                // 337
				username: agent.username                                                                                           // 337
			});                                                                                                                 // 337
			RocketChat.Livechat.stream.emit(room._id, {                                                                         // 339
				type: 'agentData',                                                                                                 // 340
				data: RocketChat.models.Users.getAgentInfo(agent.agentId)                                                          // 341
			});                                                                                                                 // 339
			return true;                                                                                                        // 344
		}                                                                                                                    // 345
                                                                                                                       //
		return false;                                                                                                        // 347
	},                                                                                                                    // 348
	sendRequest: function (postData, callback) {                                                                          // 350
		var trying = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;                                  // 350
                                                                                                                       //
		try {                                                                                                                // 351
			var options = {                                                                                                     // 352
				headers: {                                                                                                         // 353
					'X-RocketChat-Livechat-Token': RocketChat.settings.get('Livechat_secret_token')                                   // 354
				},                                                                                                                 // 353
				data: postData                                                                                                     // 356
			};                                                                                                                  // 352
			return HTTP.post(RocketChat.settings.get('Livechat_webhookUrl'), options);                                          // 358
		} catch (e) {                                                                                                        // 359
			RocketChat.Livechat.logger.webhook.error("Response error on " + trying + " try ->", e); // try 10 times after 10 seconds each
                                                                                                                       //
			if (trying < 10) {                                                                                                  // 362
				RocketChat.Livechat.logger.webhook.warn('Will try again in 10 seconds ...');                                       // 363
				trying++;                                                                                                          // 364
				setTimeout(Meteor.bindEnvironment(function () {                                                                    // 365
					RocketChat.Livechat.sendRequest(postData, callback, trying);                                                      // 366
				}), 10000);                                                                                                        // 367
			}                                                                                                                   // 368
		}                                                                                                                    // 369
	},                                                                                                                    // 370
	getLivechatRoomGuestInfo: function (room) {                                                                           // 372
		var visitor = RocketChat.models.Users.findOneById(room.v._id);                                                       // 373
		var agent = RocketChat.models.Users.findOneById(room.servedBy._id);                                                  // 374
		var ua = new UAParser();                                                                                             // 376
		ua.setUA(visitor.userAgent);                                                                                         // 377
		var postData = {                                                                                                     // 379
			_id: room._id,                                                                                                      // 380
			label: room.label,                                                                                                  // 381
			topic: room.topic,                                                                                                  // 382
			code: room.code,                                                                                                    // 383
			createdAt: room.ts,                                                                                                 // 384
			lastMessageAt: room.lm,                                                                                             // 385
			tags: room.tags,                                                                                                    // 386
			customFields: room.livechatData,                                                                                    // 387
			visitor: {                                                                                                          // 388
				_id: visitor._id,                                                                                                  // 389
				name: visitor.name,                                                                                                // 390
				username: visitor.username,                                                                                        // 391
				email: null,                                                                                                       // 392
				phone: null,                                                                                                       // 393
				department: visitor.department,                                                                                    // 394
				ip: visitor.ip,                                                                                                    // 395
				os: ua.getOS().name && ua.getOS().name + " " + ua.getOS().version,                                                 // 396
				browser: ua.getBrowser().name && ua.getBrowser().name + " " + ua.getBrowser().version,                             // 397
				customFields: visitor.livechatData                                                                                 // 398
			},                                                                                                                  // 388
			agent: {                                                                                                            // 400
				_id: agent._id,                                                                                                    // 401
				username: agent.username,                                                                                          // 402
				name: agent.name,                                                                                                  // 403
				email: null                                                                                                        // 404
			}                                                                                                                   // 400
		};                                                                                                                   // 379
                                                                                                                       //
		if (room.crmData) {                                                                                                  // 408
			postData.crmData = room.crmData;                                                                                    // 409
		}                                                                                                                    // 410
                                                                                                                       //
		if (visitor.visitorEmails && visitor.visitorEmails.length > 0) {                                                     // 412
			postData.visitor.email = visitor.visitorEmails[0].address;                                                          // 413
		}                                                                                                                    // 414
                                                                                                                       //
		if (visitor.phone && visitor.phone.length > 0) {                                                                     // 415
			postData.visitor.phone = visitor.phone[0].phoneNumber;                                                              // 416
		}                                                                                                                    // 417
                                                                                                                       //
		if (agent.emails && agent.emails.length > 0) {                                                                       // 419
			postData.agent.email = agent.emails[0].address;                                                                     // 420
		}                                                                                                                    // 421
                                                                                                                       //
		return postData;                                                                                                     // 423
	},                                                                                                                    // 424
	addAgent: function (username) {                                                                                       // 426
		check(username, String);                                                                                             // 427
		var user = RocketChat.models.Users.findOneByUsername(username, {                                                     // 429
			fields: {                                                                                                           // 429
				_id: 1,                                                                                                            // 429
				username: 1                                                                                                        // 429
			}                                                                                                                   // 429
		});                                                                                                                  // 429
                                                                                                                       //
		if (!user) {                                                                                                         // 431
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                      // 432
				method: 'livechat:addAgent'                                                                                        // 432
			});                                                                                                                 // 432
		}                                                                                                                    // 433
                                                                                                                       //
		if (RocketChat.authz.addUserRoles(user._id, 'livechat-agent')) {                                                     // 435
			RocketChat.models.Users.setOperator(user._id, true);                                                                // 436
			RocketChat.models.Users.setLivechatStatus(user._id, 'available');                                                   // 437
			return user;                                                                                                        // 438
		}                                                                                                                    // 439
                                                                                                                       //
		return false;                                                                                                        // 441
	},                                                                                                                    // 442
	addManager: function (username) {                                                                                     // 444
		check(username, String);                                                                                             // 445
		var user = RocketChat.models.Users.findOneByUsername(username, {                                                     // 447
			fields: {                                                                                                           // 447
				_id: 1,                                                                                                            // 447
				username: 1                                                                                                        // 447
			}                                                                                                                   // 447
		});                                                                                                                  // 447
                                                                                                                       //
		if (!user) {                                                                                                         // 449
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                      // 450
				method: 'livechat:addManager'                                                                                      // 450
			});                                                                                                                 // 450
		}                                                                                                                    // 451
                                                                                                                       //
		if (RocketChat.authz.addUserRoles(user._id, 'livechat-manager')) {                                                   // 453
			return user;                                                                                                        // 454
		}                                                                                                                    // 455
                                                                                                                       //
		return false;                                                                                                        // 457
	},                                                                                                                    // 458
	removeAgent: function (username) {                                                                                    // 460
		check(username, String);                                                                                             // 461
		var user = RocketChat.models.Users.findOneByUsername(username, {                                                     // 463
			fields: {                                                                                                           // 463
				_id: 1                                                                                                             // 463
			}                                                                                                                   // 463
		});                                                                                                                  // 463
                                                                                                                       //
		if (!user) {                                                                                                         // 465
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                      // 466
				method: 'livechat:removeAgent'                                                                                     // 466
			});                                                                                                                 // 466
		}                                                                                                                    // 467
                                                                                                                       //
		if (RocketChat.authz.removeUserFromRoles(user._id, 'livechat-agent')) {                                              // 469
			RocketChat.models.Users.setOperator(user._id, false);                                                               // 470
			RocketChat.models.Users.setLivechatStatus(user._id, 'not-available');                                               // 471
			return true;                                                                                                        // 472
		}                                                                                                                    // 473
                                                                                                                       //
		return false;                                                                                                        // 475
	},                                                                                                                    // 476
	removeManager: function (username) {                                                                                  // 478
		check(username, String);                                                                                             // 479
		var user = RocketChat.models.Users.findOneByUsername(username, {                                                     // 481
			fields: {                                                                                                           // 481
				_id: 1                                                                                                             // 481
			}                                                                                                                   // 481
		});                                                                                                                  // 481
                                                                                                                       //
		if (!user) {                                                                                                         // 483
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                      // 484
				method: 'livechat:removeManager'                                                                                   // 484
			});                                                                                                                 // 484
		}                                                                                                                    // 485
                                                                                                                       //
		return RocketChat.authz.removeUserFromRoles(user._id, 'livechat-manager');                                           // 487
	},                                                                                                                    // 488
	saveDepartment: function (_id, departmentData, departmentAgents) {                                                    // 490
		check(_id, Match.Maybe(String));                                                                                     // 491
		check(departmentData, {                                                                                              // 493
			enabled: Boolean,                                                                                                   // 494
			name: String,                                                                                                       // 495
			description: Match.Optional(String),                                                                                // 496
			showOnRegistration: Boolean                                                                                         // 497
		});                                                                                                                  // 493
		check(departmentAgents, [Match.ObjectIncluding({                                                                     // 500
			agentId: String,                                                                                                    // 502
			username: String                                                                                                    // 503
		})]);                                                                                                                // 501
                                                                                                                       //
		if (_id) {                                                                                                           // 507
			var department = RocketChat.models.LivechatDepartment.findOneById(_id);                                             // 508
                                                                                                                       //
			if (!department) {                                                                                                  // 509
				throw new Meteor.Error('error-department-not-found', 'Department not found', {                                     // 510
					method: 'livechat:saveDepartment'                                                                                 // 510
				});                                                                                                                // 510
			}                                                                                                                   // 511
		}                                                                                                                    // 512
                                                                                                                       //
		return RocketChat.models.LivechatDepartment.createOrUpdateDepartment(_id, departmentData, departmentAgents);         // 514
	},                                                                                                                    // 515
	removeDepartment: function (_id) {                                                                                    // 517
		check(_id, String);                                                                                                  // 518
		var department = RocketChat.models.LivechatDepartment.findOneById(_id, {                                             // 520
			fields: {                                                                                                           // 520
				_id: 1                                                                                                             // 520
			}                                                                                                                   // 520
		});                                                                                                                  // 520
                                                                                                                       //
		if (!department) {                                                                                                   // 522
			throw new Meteor.Error('department-not-found', 'Department not found', {                                            // 523
				method: 'livechat:removeDepartment'                                                                                // 523
			});                                                                                                                 // 523
		}                                                                                                                    // 524
                                                                                                                       //
		return RocketChat.models.LivechatDepartment.removeById(_id);                                                         // 526
	},                                                                                                                    // 527
	showConnecting: function () {                                                                                         // 529
		if (RocketChat.settings.get('Livechat_Routing_Method') === 'Guest_Pool') {                                           // 530
			return RocketChat.settings.get('Livechat_open_inquiery_show_connecting');                                           // 531
		} else {                                                                                                             // 532
			return false;                                                                                                       // 533
		}                                                                                                                    // 534
	}                                                                                                                     // 535
};                                                                                                                     // 4
RocketChat.Livechat.stream = new Meteor.Streamer('livechat-room');                                                     // 538
RocketChat.Livechat.stream.allowRead('logged');                                                                        // 539
RocketChat.settings.get('Livechat_history_monitor_type', function (key, value) {                                       // 541
	RocketChat.Livechat.historyMonitorType = value;                                                                       // 542
});                                                                                                                    // 543
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"QueueMethods.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/lib/QueueMethods.js                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.QueueMethods = {                                                                                            // 1
	/* Least Amount Queuing method:                                                                                       // 2
  *                                                                                                                    //
  * default method where the agent with the least number                                                               //
  * of open chats is paired with the incoming livechat                                                                 //
  */'Least_Amount': function (guest, message, roomInfo) {                                                              //
		var agent = RocketChat.Livechat.getNextAgent(guest.department);                                                      // 8
                                                                                                                       //
		if (!agent) {                                                                                                        // 9
			throw new Meteor.Error('no-agent-online', 'Sorry, no online agents');                                               // 10
		}                                                                                                                    // 11
                                                                                                                       //
		var roomCode = RocketChat.models.Rooms.getNextLivechatRoomCode();                                                    // 13
                                                                                                                       //
		var room = _.extend({                                                                                                // 15
			_id: message.rid,                                                                                                   // 16
			msgs: 1,                                                                                                            // 17
			lm: new Date(),                                                                                                     // 18
			code: roomCode,                                                                                                     // 19
			label: guest.name || guest.username,                                                                                // 20
			// usernames: [agent.username, guest.username],                                                                     // 21
			t: 'l',                                                                                                             // 22
			ts: new Date(),                                                                                                     // 23
			v: {                                                                                                                // 24
				_id: guest._id,                                                                                                    // 25
				username: guest.username,                                                                                          // 26
				token: message.token                                                                                               // 27
			},                                                                                                                  // 24
			servedBy: {                                                                                                         // 29
				_id: agent.agentId,                                                                                                // 30
				username: agent.username                                                                                           // 31
			},                                                                                                                  // 29
			cl: false,                                                                                                          // 33
			open: true,                                                                                                         // 34
			waitingResponse: true                                                                                               // 35
		}, roomInfo);                                                                                                        // 15
                                                                                                                       //
		var subscriptionData = {                                                                                             // 37
			rid: message.rid,                                                                                                   // 38
			name: guest.name || guest.username,                                                                                 // 39
			alert: true,                                                                                                        // 40
			open: true,                                                                                                         // 41
			unread: 1,                                                                                                          // 42
			userMentions: 1,                                                                                                    // 43
			groupMentions: 0,                                                                                                   // 44
			code: roomCode,                                                                                                     // 45
			u: {                                                                                                                // 46
				_id: agent.agentId,                                                                                                // 47
				username: agent.username                                                                                           // 48
			},                                                                                                                  // 46
			t: 'l',                                                                                                             // 50
			desktopNotifications: 'all',                                                                                        // 51
			mobilePushNotifications: 'all',                                                                                     // 52
			emailNotifications: 'all'                                                                                           // 53
		};                                                                                                                   // 37
		RocketChat.models.Rooms.insert(room);                                                                                // 56
		RocketChat.models.Subscriptions.insert(subscriptionData);                                                            // 57
		RocketChat.Livechat.stream.emit(room._id, {                                                                          // 59
			type: 'agentData',                                                                                                  // 60
			data: RocketChat.models.Users.getAgentInfo(agent.agentId)                                                           // 61
		});                                                                                                                  // 59
		return room;                                                                                                         // 64
	},                                                                                                                    // 65
	/* Guest Pool Queuing Method:                                                                                         // 66
  *                                                                                                                    //
  * An incomming livechat is created as an Inquiry                                                                     //
  * which is picked up from an agent.                                                                                  //
  * An Inquiry is visible to all agents (TODO: in the correct department)                                              //
     *                                                                                                                 //
  * A room is still created with the initial message, but it is occupied by                                            //
  * only the client until paired with an agent                                                                         //
  */'Guest_Pool': function (guest, message, roomInfo) {                                                                //
		var agents = RocketChat.Livechat.getOnlineAgents(guest.department);                                                  // 76
                                                                                                                       //
		if (agents.count() === 0 && RocketChat.settings.get('Livechat_guest_pool_with_no_agents')) {                         // 78
			agents = RocketChat.Livechat.getAgents(guest.department);                                                           // 79
		}                                                                                                                    // 80
                                                                                                                       //
		if (agents.count() === 0) {                                                                                          // 82
			throw new Meteor.Error('no-agent-online', 'Sorry, no online agents');                                               // 83
		}                                                                                                                    // 84
                                                                                                                       //
		var roomCode = RocketChat.models.Rooms.getNextLivechatRoomCode();                                                    // 86
		var agentIds = [];                                                                                                   // 88
		agents.forEach(function (agent) {                                                                                    // 90
			if (guest.department) {                                                                                             // 91
				agentIds.push(agent.agentId);                                                                                      // 92
			} else {                                                                                                            // 93
				agentIds.push(agent._id);                                                                                          // 94
			}                                                                                                                   // 95
		});                                                                                                                  // 96
		var inquiry = {                                                                                                      // 98
			rid: message.rid,                                                                                                   // 99
			message: message.msg,                                                                                               // 100
			name: guest.name || guest.username,                                                                                 // 101
			ts: new Date(),                                                                                                     // 102
			code: roomCode,                                                                                                     // 103
			department: guest.department,                                                                                       // 104
			agents: agentIds,                                                                                                   // 105
			status: 'open',                                                                                                     // 106
			v: {                                                                                                                // 107
				_id: guest._id,                                                                                                    // 108
				username: guest.username,                                                                                          // 109
				token: message.token                                                                                               // 110
			},                                                                                                                  // 107
			t: 'l'                                                                                                              // 112
		};                                                                                                                   // 98
                                                                                                                       //
		var room = _.extend({                                                                                                // 114
			_id: message.rid,                                                                                                   // 115
			msgs: 1,                                                                                                            // 116
			lm: new Date(),                                                                                                     // 117
			code: roomCode,                                                                                                     // 118
			label: guest.name || guest.username,                                                                                // 119
			// usernames: [guest.username],                                                                                     // 120
			t: 'l',                                                                                                             // 121
			ts: new Date(),                                                                                                     // 122
			v: {                                                                                                                // 123
				_id: guest._id,                                                                                                    // 124
				username: guest.username,                                                                                          // 125
				token: message.token                                                                                               // 126
			},                                                                                                                  // 123
			cl: false,                                                                                                          // 128
			open: true,                                                                                                         // 129
			waitingResponse: true                                                                                               // 130
		}, roomInfo);                                                                                                        // 114
                                                                                                                       //
		RocketChat.models.LivechatInquiry.insert(inquiry);                                                                   // 132
		RocketChat.models.Rooms.insert(room);                                                                                // 133
		return room;                                                                                                         // 135
	}                                                                                                                     // 136
};                                                                                                                     // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"OfficeClock.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/lib/OfficeClock.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// Every minute check if office closed                                                                                 // 1
Meteor.setInterval(function () {                                                                                       // 2
	if (RocketChat.settings.get('Livechat_enable_office_hours')) {                                                        // 3
		if (RocketChat.models.LivechatOfficeHour.isOpeningTime()) {                                                          // 4
			RocketChat.models.Users.openOffice();                                                                               // 5
		} else if (RocketChat.models.LivechatOfficeHour.isClosingTime()) {                                                   // 6
			RocketChat.models.Users.closeOffice();                                                                              // 7
		}                                                                                                                    // 8
	}                                                                                                                     // 9
}, 60000);                                                                                                             // 10
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"sendMessageBySMS.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/sendMessageBySMS.js                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.callbacks.add('afterSaveMessage', function (message, room) {                                                // 1
	// skips this callback if the message was edited                                                                      // 2
	if (message.editedAt) {                                                                                               // 3
		return message;                                                                                                      // 4
	}                                                                                                                     // 5
                                                                                                                       //
	if (!RocketChat.SMS.enabled) {                                                                                        // 7
		return message;                                                                                                      // 8
	} // only send the sms by SMS if it is a livechat room with SMS set to true                                           // 9
                                                                                                                       //
                                                                                                                       //
	if (!(typeof room.t !== 'undefined' && room.t === 'l' && room.sms && room.v && room.v.token)) {                       // 12
		return message;                                                                                                      // 13
	} // if the message has a token, it was sent from the visitor, so ignore it                                           // 14
                                                                                                                       //
                                                                                                                       //
	if (message.token) {                                                                                                  // 17
		return message;                                                                                                      // 18
	} // if the message has a type means it is a special message (like the closing comment), so skips                     // 19
                                                                                                                       //
                                                                                                                       //
	if (message.t) {                                                                                                      // 22
		return message;                                                                                                      // 23
	}                                                                                                                     // 24
                                                                                                                       //
	var SMSService = RocketChat.SMS.getService(RocketChat.settings.get('SMS_Service'));                                   // 26
                                                                                                                       //
	if (!SMSService) {                                                                                                    // 28
		return message;                                                                                                      // 29
	}                                                                                                                     // 30
                                                                                                                       //
	var visitor = RocketChat.models.Users.getVisitorByToken(room.v.token);                                                // 32
                                                                                                                       //
	if (!visitor || !visitor.profile || !visitor.phone || visitor.phone.length === 0) {                                   // 34
		return message;                                                                                                      // 35
	}                                                                                                                     // 36
                                                                                                                       //
	SMSService.send(room.sms.from, visitor.phone[0].phoneNumber, message.msg);                                            // 38
	return message;                                                                                                       // 40
}, RocketChat.callbacks.priority.LOW, 'sendMessageBySms');                                                             // 42
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"unclosedLivechats.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/unclosedLivechats.js                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals UserPresenceMonitor */var agentsHandler = void 0;                                                           // 1
var monitorAgents = false;                                                                                             // 4
var actionTimeout = 60000;                                                                                             // 5
var onlineAgents = {                                                                                                   // 7
	users: {},                                                                                                            // 8
	queue: {},                                                                                                            // 9
	add: function (userId) {                                                                                              // 11
		if (this.queue[userId]) {                                                                                            // 12
			clearTimeout(this.queue[userId]);                                                                                   // 13
			delete this.queue[userId];                                                                                          // 14
		}                                                                                                                    // 15
                                                                                                                       //
		this.users[userId] = 1;                                                                                              // 16
	},                                                                                                                    // 17
	remove: function (userId, callback) {                                                                                 // 19
		var _this = this;                                                                                                    // 19
                                                                                                                       //
		if (this.queue[userId]) {                                                                                            // 20
			clearTimeout(this.queue[userId]);                                                                                   // 21
		}                                                                                                                    // 22
                                                                                                                       //
		this.queue[userId] = setTimeout(Meteor.bindEnvironment(function () {                                                 // 23
			callback();                                                                                                         // 24
			delete _this.users[userId];                                                                                         // 26
			delete _this.queue[userId];                                                                                         // 27
		}), actionTimeout);                                                                                                  // 28
	},                                                                                                                    // 29
	exists: function (userId) {                                                                                           // 31
		return !!this.users[userId];                                                                                         // 32
	}                                                                                                                     // 33
};                                                                                                                     // 7
                                                                                                                       //
function runAgentLeaveAction(userId) {                                                                                 // 36
	var action = RocketChat.settings.get('Livechat_agent_leave_action');                                                  // 37
                                                                                                                       //
	if (action === 'close') {                                                                                             // 38
		return RocketChat.Livechat.closeOpenChats(userId, RocketChat.settings.get('Livechat_agent_leave_comment'));          // 39
	} else if (action === 'forward') {                                                                                    // 40
		return RocketChat.Livechat.forwardOpenChats(userId);                                                                 // 41
	}                                                                                                                     // 42
}                                                                                                                      // 43
                                                                                                                       //
RocketChat.settings.get('Livechat_agent_leave_action_timeout', function (key, value) {                                 // 45
	actionTimeout = value * 1000;                                                                                         // 46
});                                                                                                                    // 47
RocketChat.settings.get('Livechat_agent_leave_action', function (key, value) {                                         // 49
	monitorAgents = value;                                                                                                // 50
                                                                                                                       //
	if (value !== 'none') {                                                                                               // 51
		if (!agentsHandler) {                                                                                                // 52
			agentsHandler = RocketChat.models.Users.findOnlineAgents().observeChanges({                                         // 53
				added: function (id) {                                                                                             // 54
					onlineAgents.add(id);                                                                                             // 55
				},                                                                                                                 // 56
				changed: function (id, fields) {                                                                                   // 57
					if (fields.statusLivechat && fields.statusLivechat === 'not-available') {                                         // 58
						onlineAgents.remove(id, function () {                                                                            // 59
							runAgentLeaveAction(id);                                                                                        // 60
						});                                                                                                              // 61
					} else {                                                                                                          // 62
						onlineAgents.add(id);                                                                                            // 63
					}                                                                                                                 // 64
				},                                                                                                                 // 65
				removed: function (id) {                                                                                           // 66
					onlineAgents.remove(id, function () {                                                                             // 67
						runAgentLeaveAction(id);                                                                                         // 68
					});                                                                                                               // 69
				}                                                                                                                  // 70
			});                                                                                                                 // 53
		}                                                                                                                    // 72
	} else if (agentsHandler) {                                                                                           // 73
		agentsHandler.stop();                                                                                                // 74
		agentsHandler = null;                                                                                                // 75
	}                                                                                                                     // 76
});                                                                                                                    // 77
UserPresenceMonitor.onSetUserStatus(function (user, status /*, statusConnection*/) {                                   // 79
	if (!monitorAgents) {                                                                                                 // 80
		return;                                                                                                              // 81
	}                                                                                                                     // 82
                                                                                                                       //
	if (onlineAgents.exists(user._id)) {                                                                                  // 83
		if (status === 'offline' || user.statusLivechat === 'not-available') {                                               // 84
			onlineAgents.remove(user._id, function () {                                                                         // 85
				runAgentLeaveAction(user._id);                                                                                     // 86
			});                                                                                                                 // 87
		}                                                                                                                    // 88
	}                                                                                                                     // 89
});                                                                                                                    // 90
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"publications":{"customFields.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/publications/customFields.js                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('livechat:customFields', function (_id) {                                                               // 1
	if (!this.userId) {                                                                                                   // 2
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', {                                       // 3
			publish: 'livechat:customFields'                                                                                    // 3
		}));                                                                                                                 // 3
	}                                                                                                                     // 4
                                                                                                                       //
	if (!RocketChat.authz.hasPermission(this.userId, 'view-l-room')) {                                                    // 6
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', {                                       // 7
			publish: 'livechat:customFields'                                                                                    // 7
		}));                                                                                                                 // 7
	}                                                                                                                     // 8
                                                                                                                       //
	if (s.trim(_id)) {                                                                                                    // 10
		return RocketChat.models.LivechatCustomField.find({                                                                  // 11
			_id: _id                                                                                                            // 11
		});                                                                                                                  // 11
	}                                                                                                                     // 12
                                                                                                                       //
	return RocketChat.models.LivechatCustomField.find();                                                                  // 14
});                                                                                                                    // 16
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"departmentAgents.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/publications/departmentAgents.js                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('livechat:departmentAgents', function (departmentId) {                                                  // 1
	if (!this.userId) {                                                                                                   // 2
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', {                                       // 3
			publish: 'livechat:departmentAgents'                                                                                // 3
		}));                                                                                                                 // 3
	}                                                                                                                     // 4
                                                                                                                       //
	if (!RocketChat.authz.hasPermission(this.userId, 'view-livechat-rooms')) {                                            // 6
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', {                                       // 7
			publish: 'livechat:departmentAgents'                                                                                // 7
		}));                                                                                                                 // 7
	}                                                                                                                     // 8
                                                                                                                       //
	return RocketChat.models.LivechatDepartmentAgents.find({                                                              // 10
		departmentId: departmentId                                                                                           // 10
	});                                                                                                                   // 10
});                                                                                                                    // 11
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"externalMessages.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/publications/externalMessages.js                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('livechat:externalMessages', function (roomId) {                                                        // 1
	return RocketChat.models.LivechatExternalMessage.findByRoomId(roomId);                                                // 2
});                                                                                                                    // 3
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"livechatAgents.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/publications/livechatAgents.js                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('livechat:agents', function () {                                                                        // 1
	if (!this.userId) {                                                                                                   // 2
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', {                                       // 3
			publish: 'livechat:agents'                                                                                          // 3
		}));                                                                                                                 // 3
	}                                                                                                                     // 4
                                                                                                                       //
	if (!RocketChat.authz.hasPermission(this.userId, 'view-l-room')) {                                                    // 6
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', {                                       // 7
			publish: 'livechat:agents'                                                                                          // 7
		}));                                                                                                                 // 7
	}                                                                                                                     // 8
                                                                                                                       //
	var self = this;                                                                                                      // 10
	var handle = RocketChat.authz.getUsersInRole('livechat-agent').observeChanges({                                       // 12
		added: function (id, fields) {                                                                                       // 13
			self.added('agentUsers', id, fields);                                                                               // 14
		},                                                                                                                   // 15
		changed: function (id, fields) {                                                                                     // 16
			self.changed('agentUsers', id, fields);                                                                             // 17
		},                                                                                                                   // 18
		removed: function (id) {                                                                                             // 19
			self.removed('agentUsers', id);                                                                                     // 20
		}                                                                                                                    // 21
	});                                                                                                                   // 12
	self.ready();                                                                                                         // 24
	self.onStop(function () {                                                                                             // 26
		handle.stop();                                                                                                       // 27
	});                                                                                                                   // 28
});                                                                                                                    // 29
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"livechatAppearance.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/publications/livechatAppearance.js                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('livechat:appearance', function () {                                                                    // 1
	if (!this.userId) {                                                                                                   // 2
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', {                                       // 3
			publish: 'livechat:appearance'                                                                                      // 3
		}));                                                                                                                 // 3
	}                                                                                                                     // 4
                                                                                                                       //
	if (!RocketChat.authz.hasPermission(this.userId, 'view-livechat-manager')) {                                          // 6
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', {                                       // 7
			publish: 'livechat:appearance'                                                                                      // 7
		}));                                                                                                                 // 7
	}                                                                                                                     // 8
                                                                                                                       //
	var query = {                                                                                                         // 10
		_id: {                                                                                                               // 11
			$in: ['Livechat_title', 'Livechat_title_color', 'Livechat_display_offline_form', 'Livechat_offline_form_unavailable', 'Livechat_offline_message', 'Livechat_offline_success_message', 'Livechat_offline_title', 'Livechat_offline_title_color', 'Livechat_offline_email']
		}                                                                                                                    // 11
	};                                                                                                                    // 10
	var self = this;                                                                                                      // 26
	var handle = RocketChat.models.Settings.find(query).observeChanges({                                                  // 28
		added: function (id, fields) {                                                                                       // 29
			self.added('livechatAppearance', id, fields);                                                                       // 30
		},                                                                                                                   // 31
		changed: function (id, fields) {                                                                                     // 32
			self.changed('livechatAppearance', id, fields);                                                                     // 33
		},                                                                                                                   // 34
		removed: function (id) {                                                                                             // 35
			self.removed('livechatAppearance', id);                                                                             // 36
		}                                                                                                                    // 37
	});                                                                                                                   // 28
	this.ready();                                                                                                         // 40
	this.onStop(function () {                                                                                             // 42
		handle.stop();                                                                                                       // 43
	});                                                                                                                   // 44
});                                                                                                                    // 45
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"livechatDepartments.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/publications/livechatDepartments.js                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('livechat:departments', function (_id) {                                                                // 1
	if (!this.userId) {                                                                                                   // 2
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', {                                       // 3
			publish: 'livechat:agents'                                                                                          // 3
		}));                                                                                                                 // 3
	}                                                                                                                     // 4
                                                                                                                       //
	if (!RocketChat.authz.hasPermission(this.userId, 'view-l-room')) {                                                    // 6
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', {                                       // 7
			publish: 'livechat:agents'                                                                                          // 7
		}));                                                                                                                 // 7
	}                                                                                                                     // 8
                                                                                                                       //
	if (_id !== undefined) {                                                                                              // 10
		return RocketChat.models.LivechatDepartment.findByDepartmentId(_id);                                                 // 11
	} else {                                                                                                              // 12
		return RocketChat.models.LivechatDepartment.find();                                                                  // 13
	}                                                                                                                     // 14
});                                                                                                                    // 16
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"livechatIntegration.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/publications/livechatIntegration.js                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('livechat:integration', function () {                                                                   // 1
	if (!this.userId) {                                                                                                   // 2
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', {                                       // 3
			publish: 'livechat:integration'                                                                                     // 3
		}));                                                                                                                 // 3
	}                                                                                                                     // 4
                                                                                                                       //
	if (!RocketChat.authz.hasPermission(this.userId, 'view-livechat-manager')) {                                          // 6
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', {                                       // 7
			publish: 'livechat:integration'                                                                                     // 7
		}));                                                                                                                 // 7
	}                                                                                                                     // 8
                                                                                                                       //
	var self = this;                                                                                                      // 10
	var handle = RocketChat.models.Settings.findByIds(['Livechat_webhookUrl', 'Livechat_secret_token', 'Livechat_webhook_on_close', 'Livechat_webhook_on_offline_msg']).observeChanges({
		added: function (id, fields) {                                                                                       // 13
			self.added('livechatIntegration', id, fields);                                                                      // 14
		},                                                                                                                   // 15
		changed: function (id, fields) {                                                                                     // 16
			self.changed('livechatIntegration', id, fields);                                                                    // 17
		},                                                                                                                   // 18
		removed: function (id) {                                                                                             // 19
			self.removed('livechatIntegration', id);                                                                            // 20
		}                                                                                                                    // 21
	});                                                                                                                   // 12
	self.ready();                                                                                                         // 24
	self.onStop(function () {                                                                                             // 26
		handle.stop();                                                                                                       // 27
	});                                                                                                                   // 28
});                                                                                                                    // 29
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"livechatManagers.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/publications/livechatManagers.js                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('livechat:managers', function () {                                                                      // 1
	if (!this.userId) {                                                                                                   // 2
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', {                                       // 3
			publish: 'livechat:managers'                                                                                        // 3
		}));                                                                                                                 // 3
	}                                                                                                                     // 4
                                                                                                                       //
	if (!RocketChat.authz.hasPermission(this.userId, 'view-livechat-rooms')) {                                            // 6
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', {                                       // 7
			publish: 'livechat:managers'                                                                                        // 7
		}));                                                                                                                 // 7
	}                                                                                                                     // 8
                                                                                                                       //
	var self = this;                                                                                                      // 10
	var handle = RocketChat.authz.getUsersInRole('livechat-manager').observeChanges({                                     // 12
		added: function (id, fields) {                                                                                       // 13
			self.added('managerUsers', id, fields);                                                                             // 14
		},                                                                                                                   // 15
		changed: function (id, fields) {                                                                                     // 16
			self.changed('managerUsers', id, fields);                                                                           // 17
		},                                                                                                                   // 18
		removed: function (id) {                                                                                             // 19
			self.removed('managerUsers', id);                                                                                   // 20
		}                                                                                                                    // 21
	});                                                                                                                   // 12
	self.ready();                                                                                                         // 24
	self.onStop(function () {                                                                                             // 26
		handle.stop();                                                                                                       // 27
	});                                                                                                                   // 28
});                                                                                                                    // 29
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"livechatRooms.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/publications/livechatRooms.js                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('livechat:rooms', function () {                                                                         // 1
	var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};                                  // 1
	var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;                                   // 1
	var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 20;                                   // 1
                                                                                                                       //
	if (!this.userId) {                                                                                                   // 2
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', {                                       // 3
			publish: 'livechat:rooms'                                                                                           // 3
		}));                                                                                                                 // 3
	}                                                                                                                     // 4
                                                                                                                       //
	if (!RocketChat.authz.hasPermission(this.userId, 'view-livechat-rooms')) {                                            // 6
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', {                                       // 7
			publish: 'livechat:rooms'                                                                                           // 7
		}));                                                                                                                 // 7
	}                                                                                                                     // 8
                                                                                                                       //
	check(filter, {                                                                                                       // 10
		name: Match.Maybe(String),                                                                                           // 11
		// room name to filter                                                                                               // 11
		agent: Match.Maybe(String),                                                                                          // 12
		// agent _id who is serving                                                                                          // 12
		status: Match.Maybe(String),                                                                                         // 13
		// either 'opened' or 'closed'                                                                                       // 13
		from: Match.Maybe(Date),                                                                                             // 14
		to: Match.Maybe(Date)                                                                                                // 15
	});                                                                                                                   // 10
	var query = {};                                                                                                       // 18
                                                                                                                       //
	if (filter.name) {                                                                                                    // 19
		query.label = new RegExp(filter.name, 'i');                                                                          // 20
	}                                                                                                                     // 21
                                                                                                                       //
	if (filter.agent) {                                                                                                   // 22
		query['servedBy._id'] = filter.agent;                                                                                // 23
	}                                                                                                                     // 24
                                                                                                                       //
	if (filter.status) {                                                                                                  // 25
		if (filter.status === 'opened') {                                                                                    // 26
			query.open = true;                                                                                                  // 27
		} else {                                                                                                             // 28
			query.open = {                                                                                                      // 29
				$exists: false                                                                                                     // 29
			};                                                                                                                  // 29
		}                                                                                                                    // 30
	}                                                                                                                     // 31
                                                                                                                       //
	if (filter.from) {                                                                                                    // 32
		query.ts = {                                                                                                         // 33
			$gte: filter.from                                                                                                   // 34
		};                                                                                                                   // 33
	}                                                                                                                     // 36
                                                                                                                       //
	if (filter.to) {                                                                                                      // 37
		filter.to.setDate(filter.to.getDate() + 1);                                                                          // 38
		filter.to.setSeconds(filter.to.getSeconds() - 1);                                                                    // 39
                                                                                                                       //
		if (!query.ts) {                                                                                                     // 41
			query.ts = {};                                                                                                      // 42
		}                                                                                                                    // 43
                                                                                                                       //
		query.ts.$lte = filter.to;                                                                                           // 44
	}                                                                                                                     // 45
                                                                                                                       //
	var self = this;                                                                                                      // 47
	var handle = RocketChat.models.Rooms.findLivechat(query, offset, limit).observeChanges({                              // 49
		added: function (id, fields) {                                                                                       // 50
			self.added('livechatRoom', id, fields);                                                                             // 51
		},                                                                                                                   // 52
		changed: function (id, fields) {                                                                                     // 53
			self.changed('livechatRoom', id, fields);                                                                           // 54
		},                                                                                                                   // 55
		removed: function (id) {                                                                                             // 56
			self.removed('livechatRoom', id);                                                                                   // 57
		}                                                                                                                    // 58
	});                                                                                                                   // 49
	this.ready();                                                                                                         // 61
	this.onStop(function () {                                                                                             // 63
		handle.stop();                                                                                                       // 64
	});                                                                                                                   // 65
});                                                                                                                    // 66
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"livechatQueue.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/publications/livechatQueue.js                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('livechat:queue', function () {                                                                         // 1
	if (!this.userId) {                                                                                                   // 2
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', {                                       // 3
			publish: 'livechat:queue'                                                                                           // 3
		}));                                                                                                                 // 3
	}                                                                                                                     // 4
                                                                                                                       //
	if (!RocketChat.authz.hasPermission(this.userId, 'view-l-room')) {                                                    // 6
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', {                                       // 7
			publish: 'livechat:queue'                                                                                           // 7
		}));                                                                                                                 // 7
	} // let sort = { count: 1, sort: 1, username: 1 };                                                                   // 8
	// let onlineUsers = {};                                                                                              // 11
	// let handleUsers = RocketChat.models.Users.findOnlineAgents().observeChanges({                                      // 13
	// 	added(id, fields) {                                                                                               // 14
	// 		onlineUsers[fields.username] = 1;                                                                                // 15
	// 		// this.added('livechatQueueUser', id, fields);                                                                  // 16
	// 	},                                                                                                                // 17
	// 	changed(id, fields) {                                                                                             // 18
	// 		onlineUsers[fields.username] = 1;                                                                                // 19
	// 		// this.changed('livechatQueueUser', id, fields);                                                                // 20
	// 	},                                                                                                                // 21
	// 	removed(id) {                                                                                                     // 22
	// 		this.removed('livechatQueueUser', id);                                                                           // 23
	// 	}                                                                                                                 // 24
	// });                                                                                                                // 25
                                                                                                                       //
                                                                                                                       //
	var self = this;                                                                                                      // 27
	var handleDepts = RocketChat.models.LivechatDepartmentAgents.findUsersInQueue().observeChanges({                      // 29
		added: function (id, fields) {                                                                                       // 30
			self.added('livechatQueueUser', id, fields);                                                                        // 31
		},                                                                                                                   // 32
		changed: function (id, fields) {                                                                                     // 33
			self.changed('livechatQueueUser', id, fields);                                                                      // 34
		},                                                                                                                   // 35
		removed: function (id) {                                                                                             // 36
			self.removed('livechatQueueUser', id);                                                                              // 37
		}                                                                                                                    // 38
	});                                                                                                                   // 29
	this.ready();                                                                                                         // 41
	this.onStop(function () {                                                                                             // 43
		// handleUsers.stop();                                                                                               // 44
		handleDepts.stop();                                                                                                  // 45
	});                                                                                                                   // 46
});                                                                                                                    // 47
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"livechatTriggers.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/publications/livechatTriggers.js                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('livechat:triggers', function (_id) {                                                                   // 1
	if (!this.userId) {                                                                                                   // 2
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', {                                       // 3
			publish: 'livechat:triggers'                                                                                        // 3
		}));                                                                                                                 // 3
	}                                                                                                                     // 4
                                                                                                                       //
	if (!RocketChat.authz.hasPermission(this.userId, 'view-livechat-manager')) {                                          // 6
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', {                                       // 7
			publish: 'livechat:triggers'                                                                                        // 7
		}));                                                                                                                 // 7
	}                                                                                                                     // 8
                                                                                                                       //
	if (_id !== undefined) {                                                                                              // 10
		return RocketChat.models.LivechatTrigger.findById(_id);                                                              // 11
	} else {                                                                                                              // 12
		return RocketChat.models.LivechatTrigger.find();                                                                     // 13
	}                                                                                                                     // 14
});                                                                                                                    // 15
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"visitorHistory.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/publications/visitorHistory.js                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('livechat:visitorHistory', function (_ref) {                                                            // 1
	var roomId = _ref.rid;                                                                                                // 1
                                                                                                                       //
	if (!this.userId) {                                                                                                   // 2
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', {                                       // 3
			publish: 'livechat:visitorHistory'                                                                                  // 3
		}));                                                                                                                 // 3
	}                                                                                                                     // 4
                                                                                                                       //
	if (!RocketChat.authz.hasPermission(this.userId, 'view-l-room')) {                                                    // 6
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', {                                       // 7
			publish: 'livechat:visitorHistory'                                                                                  // 7
		}));                                                                                                                 // 7
	}                                                                                                                     // 8
                                                                                                                       //
	var room = RocketChat.models.Rooms.findOneById(roomId);                                                               // 10
	var user = RocketChat.models.Users.findOneById(this.userId);                                                          // 12
                                                                                                                       //
	if (room.usernames.indexOf(user.username) === -1) {                                                                   // 14
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', {                                       // 15
			publish: 'livechat:visitorHistory'                                                                                  // 15
		}));                                                                                                                 // 15
	}                                                                                                                     // 16
                                                                                                                       //
	if (room && room.v && room.v._id) {                                                                                   // 18
		// CACHE: can we stop using publications here?                                                                       // 19
		return RocketChat.models.Rooms.findByVisitorId(room.v._id);                                                          // 20
	} else {                                                                                                              // 21
		return this.ready();                                                                                                 // 22
	}                                                                                                                     // 23
});                                                                                                                    // 24
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"visitorInfo.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/publications/visitorInfo.js                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('livechat:visitorInfo', function (_ref) {                                                               // 1
	var roomId = _ref.rid;                                                                                                // 1
                                                                                                                       //
	if (!this.userId) {                                                                                                   // 2
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', {                                       // 3
			publish: 'livechat:visitorInfo'                                                                                     // 3
		}));                                                                                                                 // 3
	}                                                                                                                     // 4
                                                                                                                       //
	if (!RocketChat.authz.hasPermission(this.userId, 'view-l-room')) {                                                    // 6
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', {                                       // 7
			publish: 'livechat:visitorInfo'                                                                                     // 7
		}));                                                                                                                 // 7
	}                                                                                                                     // 8
                                                                                                                       //
	var room = RocketChat.models.Rooms.findOneById(roomId);                                                               // 10
                                                                                                                       //
	if (room && room.v && room.v._id) {                                                                                   // 12
		return RocketChat.models.Users.findById(room.v._id);                                                                 // 13
	} else {                                                                                                              // 14
		return this.ready();                                                                                                 // 15
	}                                                                                                                     // 16
});                                                                                                                    // 17
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"visitorPageVisited.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/publications/visitorPageVisited.js                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('livechat:visitorPageVisited', function (_ref) {                                                        // 1
	var roomId = _ref.rid;                                                                                                // 1
                                                                                                                       //
	if (!this.userId) {                                                                                                   // 2
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', {                                       // 3
			publish: 'livechat:visitorPageVisited'                                                                              // 3
		}));                                                                                                                 // 3
	}                                                                                                                     // 4
                                                                                                                       //
	if (!RocketChat.authz.hasPermission(this.userId, 'view-l-room')) {                                                    // 6
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', {                                       // 7
			publish: 'livechat:visitorPageVisited'                                                                              // 7
		}));                                                                                                                 // 7
	}                                                                                                                     // 8
                                                                                                                       //
	var room = RocketChat.models.Rooms.findOneById(roomId);                                                               // 10
                                                                                                                       //
	if (room && room.v && room.v.token) {                                                                                 // 12
		return RocketChat.models.LivechatPageVisited.findByToken(room.v.token);                                              // 13
	} else {                                                                                                              // 14
		return this.ready();                                                                                                 // 15
	}                                                                                                                     // 16
});                                                                                                                    // 17
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"livechatInquiries.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/publications/livechatInquiries.js                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('livechat:inquiry', function () {                                                                       // 1
	if (!this.userId) {                                                                                                   // 2
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', {                                       // 3
			publish: 'livechat:inquiry'                                                                                         // 3
		}));                                                                                                                 // 3
	}                                                                                                                     // 4
                                                                                                                       //
	if (!RocketChat.authz.hasPermission(this.userId, 'view-l-room')) {                                                    // 6
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', {                                       // 7
			publish: 'livechat:inquiry'                                                                                         // 7
		}));                                                                                                                 // 7
	}                                                                                                                     // 8
                                                                                                                       //
	var query = {                                                                                                         // 10
		agents: this.userId,                                                                                                 // 11
		status: 'open'                                                                                                       // 12
	};                                                                                                                    // 10
	return RocketChat.models.LivechatInquiry.find(query);                                                                 // 15
});                                                                                                                    // 16
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"livechatOfficeHours.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/publications/livechatOfficeHours.js                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('livechat:officeHour', function () {                                                                    // 1
	if (!RocketChat.authz.hasPermission(this.userId, 'view-l-room')) {                                                    // 2
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', {                                       // 3
			publish: 'livechat:agents'                                                                                          // 3
		}));                                                                                                                 // 3
	}                                                                                                                     // 4
                                                                                                                       //
	return RocketChat.models.LivechatOfficeHour.find();                                                                   // 6
});                                                                                                                    // 7
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"api.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/api.js                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("../imports/server/rest/departments.js"));                                                        // 1
module.watch(require("../imports/server/rest/sms.js"));                                                                // 1
module.watch(require("../imports/server/rest/users.js"));                                                              // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"permissions.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/permissions.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.startup(function () {                                                                                           // 1
	var roles = _.pluck(RocketChat.models.Roles.find().fetch(), 'name');                                                  // 2
                                                                                                                       //
	if (roles.indexOf('livechat-agent') === -1) {                                                                         // 3
		RocketChat.models.Roles.createOrUpdate('livechat-agent');                                                            // 4
	}                                                                                                                     // 5
                                                                                                                       //
	if (roles.indexOf('livechat-manager') === -1) {                                                                       // 6
		RocketChat.models.Roles.createOrUpdate('livechat-manager');                                                          // 7
	}                                                                                                                     // 8
                                                                                                                       //
	if (roles.indexOf('livechat-guest') === -1) {                                                                         // 9
		RocketChat.models.Roles.createOrUpdate('livechat-guest');                                                            // 10
	}                                                                                                                     // 11
                                                                                                                       //
	if (RocketChat.models && RocketChat.models.Permissions) {                                                             // 12
		RocketChat.models.Permissions.createOrUpdate('view-l-room', ['livechat-agent', 'livechat-manager', 'admin']);        // 13
		RocketChat.models.Permissions.createOrUpdate('view-livechat-manager', ['livechat-manager', 'admin']);                // 14
		RocketChat.models.Permissions.createOrUpdate('view-livechat-rooms', ['livechat-manager', 'admin']);                  // 15
		RocketChat.models.Permissions.createOrUpdate('close-livechat-room', ['livechat-agent', 'livechat-manager', 'admin']);
		RocketChat.models.Permissions.createOrUpdate('close-others-livechat-room', ['livechat-manager', 'admin']);           // 17
		RocketChat.models.Permissions.createOrUpdate('save-others-livechat-room-info', ['livechat-manager']);                // 18
	}                                                                                                                     // 19
});                                                                                                                    // 20
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"messageTypes.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/messageTypes.js                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.MessageTypes.registerType({                                                                                 // 1
	id: 'livechat_video_call',                                                                                            // 2
	system: true,                                                                                                         // 3
	message: 'New_videocall_request'                                                                                      // 4
});                                                                                                                    // 1
RocketChat.actionLinks.register('createLivechatCall', function (message, params, instance) {                           // 7
	if (Meteor.isClient) {                                                                                                // 8
		instance.tabBar.open('video');                                                                                       // 9
	}                                                                                                                     // 10
});                                                                                                                    // 11
RocketChat.actionLinks.register('denyLivechatCall', function (message /*, params*/) {                                  // 13
	if (Meteor.isServer) {                                                                                                // 14
		var user = Meteor.user();                                                                                            // 15
		RocketChat.models.Messages.createWithTypeRoomIdMessageAndUser('command', message.rid, 'endCall', user);              // 17
		RocketChat.Notifications.notifyRoom(message.rid, 'deleteMessage', {                                                  // 18
			_id: message._id                                                                                                    // 18
		});                                                                                                                  // 18
		var language = user.language || RocketChat.settings.get('language') || 'en';                                         // 20
		RocketChat.Livechat.closeRoom({                                                                                      // 22
			user: user,                                                                                                         // 23
			room: RocketChat.models.Rooms.findOneById(message.rid),                                                             // 24
			comment: TAPi18n.__('Videocall_declined', {                                                                         // 25
				lng: language                                                                                                      // 25
			})                                                                                                                  // 25
		});                                                                                                                  // 22
		Meteor.defer(function () {                                                                                           // 27
			RocketChat.models.Messages.setHiddenById(message._id);                                                              // 28
		});                                                                                                                  // 29
	}                                                                                                                     // 30
});                                                                                                                    // 31
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"roomType.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/roomType.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals openRoom, LivechatInquiry */RocketChat.roomTypes.add('l', 5, {                                              // 1
	icon: 'livechat',                                                                                                     // 4
	label: 'Livechat',                                                                                                    // 5
	route: {                                                                                                              // 6
		name: 'live',                                                                                                        // 7
		path: '/live/:code(\\d+)',                                                                                           // 8
		action: function (params /*, queryParams*/) {                                                                        // 9
			openRoom('l', params.code);                                                                                         // 10
		},                                                                                                                   // 11
		link: function (sub) {                                                                                               // 12
			return {                                                                                                            // 13
				code: sub.code                                                                                                     // 14
			};                                                                                                                  // 13
		}                                                                                                                    // 16
	},                                                                                                                    // 6
	findRoom: function (identifier) {                                                                                     // 19
		return ChatRoom.findOne({                                                                                            // 20
			code: parseInt(identifier)                                                                                          // 20
		});                                                                                                                  // 20
	},                                                                                                                    // 21
	roomName: function (roomData) {                                                                                       // 23
		if (!roomData.name) {                                                                                                // 24
			return roomData.label;                                                                                              // 25
		} else {                                                                                                             // 26
			return roomData.name;                                                                                               // 27
		}                                                                                                                    // 28
	},                                                                                                                    // 29
	condition: function () {                                                                                              // 31
		return RocketChat.settings.get('Livechat_enabled') && RocketChat.authz.hasAllPermission('view-l-room');              // 32
	},                                                                                                                    // 33
	canSendMessage: function (roomId) {                                                                                   // 35
		var room = ChatRoom.findOne({                                                                                        // 36
			_id: roomId                                                                                                         // 36
		}, {                                                                                                                 // 36
			fields: {                                                                                                           // 36
				open: 1                                                                                                            // 36
			}                                                                                                                   // 36
		});                                                                                                                  // 36
		return room && room.open === true;                                                                                   // 37
	},                                                                                                                    // 38
	getUserStatus: function (roomId) {                                                                                    // 40
		var guestName = void 0;                                                                                              // 41
		var room = Session.get("roomData" + roomId);                                                                         // 42
                                                                                                                       //
		if (room) {                                                                                                          // 44
			guestName = room.v && room.v.username;                                                                              // 45
		} else {                                                                                                             // 46
			var inquiry = LivechatInquiry.findOne({                                                                             // 47
				rid: roomId                                                                                                        // 47
			});                                                                                                                 // 47
			guestName = inquiry && inquiry.v && inquiry.v.username;                                                             // 48
		}                                                                                                                    // 49
                                                                                                                       //
		if (guestName) {                                                                                                     // 51
			return Session.get("user_" + guestName + "_status");                                                                // 52
		}                                                                                                                    // 53
	},                                                                                                                    // 54
	notSubscribedTpl: {                                                                                                   // 56
		template: 'livechatNotSubscribed'                                                                                    // 57
	}                                                                                                                     // 56
});                                                                                                                    // 3
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"config.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/config.js                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.startup(function () {                                                                                           // 1
	RocketChat.settings.addGroup('Livechat');                                                                             // 2
	RocketChat.settings.add('Livechat_enabled', false, {                                                                  // 4
		type: 'boolean',                                                                                                     // 4
		group: 'Livechat',                                                                                                   // 4
		"public": true                                                                                                       // 4
	});                                                                                                                   // 4
	RocketChat.settings.add('Livechat_title', 'Rocket.Chat', {                                                            // 6
		type: 'string',                                                                                                      // 6
		group: 'Livechat',                                                                                                   // 6
		"public": true                                                                                                       // 6
	});                                                                                                                   // 6
	RocketChat.settings.add('Livechat_title_color', '#C1272D', {                                                          // 7
		type: 'color',                                                                                                       // 7
		group: 'Livechat',                                                                                                   // 7
		"public": true                                                                                                       // 7
	});                                                                                                                   // 7
	RocketChat.settings.add('Livechat_display_offline_form', true, {                                                      // 9
		type: 'boolean',                                                                                                     // 10
		group: 'Livechat',                                                                                                   // 11
		"public": true,                                                                                                      // 12
		section: 'Offline',                                                                                                  // 13
		i18nLabel: 'Display_offline_form'                                                                                    // 14
	});                                                                                                                   // 9
	RocketChat.settings.add('Livechat_validate_offline_email', true, {                                                    // 17
		type: 'boolean',                                                                                                     // 18
		group: 'Livechat',                                                                                                   // 19
		"public": true,                                                                                                      // 20
		section: 'Offline',                                                                                                  // 21
		i18nLabel: 'Validate_email_address'                                                                                  // 22
	});                                                                                                                   // 17
	RocketChat.settings.add('Livechat_offline_form_unavailable', '', {                                                    // 25
		type: 'string',                                                                                                      // 26
		group: 'Livechat',                                                                                                   // 27
		"public": true,                                                                                                      // 28
		section: 'Offline',                                                                                                  // 29
		i18nLabel: 'Offline_form_unavailable_message'                                                                        // 30
	});                                                                                                                   // 25
	RocketChat.settings.add('Livechat_offline_title', 'Leave a message', {                                                // 33
		type: 'string',                                                                                                      // 34
		group: 'Livechat',                                                                                                   // 35
		"public": true,                                                                                                      // 36
		section: 'Offline',                                                                                                  // 37
		i18nLabel: 'Title'                                                                                                   // 38
	});                                                                                                                   // 33
	RocketChat.settings.add('Livechat_offline_title_color', '#666666', {                                                  // 40
		type: 'color',                                                                                                       // 41
		group: 'Livechat',                                                                                                   // 42
		"public": true,                                                                                                      // 43
		section: 'Offline',                                                                                                  // 44
		i18nLabel: 'Color'                                                                                                   // 45
	});                                                                                                                   // 40
	RocketChat.settings.add('Livechat_offline_message', 'We are not online right now. Please leave us a message:', {      // 47
		type: 'string',                                                                                                      // 48
		group: 'Livechat',                                                                                                   // 49
		"public": true,                                                                                                      // 50
		section: 'Offline',                                                                                                  // 51
		i18nLabel: 'Instructions',                                                                                           // 52
		i18nDescription: 'Instructions_to_your_visitor_fill_the_form_to_send_a_message'                                      // 53
	});                                                                                                                   // 47
	RocketChat.settings.add('Livechat_offline_email', '', {                                                               // 55
		type: 'string',                                                                                                      // 56
		group: 'Livechat',                                                                                                   // 57
		i18nLabel: 'Email_address_to_send_offline_messages',                                                                 // 58
		section: 'Offline'                                                                                                   // 59
	});                                                                                                                   // 55
	RocketChat.settings.add('Livechat_offline_success_message', '', {                                                     // 61
		type: 'string',                                                                                                      // 62
		group: 'Livechat',                                                                                                   // 63
		"public": true,                                                                                                      // 64
		section: 'Offline',                                                                                                  // 65
		i18nLabel: 'Offline_success_message'                                                                                 // 66
	});                                                                                                                   // 61
	RocketChat.settings.add('Livechat_registration_form', true, {                                                         // 69
		type: 'boolean',                                                                                                     // 69
		group: 'Livechat',                                                                                                   // 69
		"public": true,                                                                                                      // 69
		i18nLabel: 'Show_preregistration_form'                                                                               // 69
	});                                                                                                                   // 69
	RocketChat.settings.add('Livechat_allow_switching_departments', true, {                                               // 70
		type: 'boolean',                                                                                                     // 70
		group: 'Livechat',                                                                                                   // 70
		"public": true,                                                                                                      // 70
		i18nLabel: 'Allow_switching_departments'                                                                             // 70
	});                                                                                                                   // 70
	RocketChat.settings.add('Livechat_guest_count', 1, {                                                                  // 71
		type: 'int',                                                                                                         // 71
		group: 'Livechat'                                                                                                    // 71
	});                                                                                                                   // 71
	RocketChat.settings.add('Livechat_Room_Count', 1, {                                                                   // 73
		type: 'int',                                                                                                         // 74
		group: 'Livechat',                                                                                                   // 75
		i18nLabel: 'Livechat_room_count'                                                                                     // 76
	});                                                                                                                   // 73
	RocketChat.settings.add('Livechat_agent_leave_action', 'none', {                                                      // 79
		type: 'select',                                                                                                      // 80
		group: 'Livechat',                                                                                                   // 81
		values: [{                                                                                                           // 82
			key: 'none',                                                                                                        // 83
			i18nLabel: 'None'                                                                                                   // 83
		}, {                                                                                                                 // 83
			key: 'forward',                                                                                                     // 84
			i18nLabel: 'Forward'                                                                                                // 84
		}, {                                                                                                                 // 84
			key: 'close',                                                                                                       // 85
			i18nLabel: 'Close'                                                                                                  // 85
		}],                                                                                                                  // 85
		i18nLabel: 'How_to_handle_open_sessions_when_agent_goes_offline'                                                     // 87
	});                                                                                                                   // 79
	RocketChat.settings.add('Livechat_agent_leave_action_timeout', 60, {                                                  // 90
		type: 'int',                                                                                                         // 91
		group: 'Livechat',                                                                                                   // 92
		enableQuery: {                                                                                                       // 93
			_id: 'Livechat_agent_leave_action',                                                                                 // 93
			value: {                                                                                                            // 93
				$ne: 'none'                                                                                                        // 93
			}                                                                                                                   // 93
		},                                                                                                                   // 93
		i18nLabel: 'How_long_to_wait_after_agent_goes_offline',                                                              // 94
		i18nDescription: 'Time_in_seconds'                                                                                   // 95
	});                                                                                                                   // 90
	RocketChat.settings.add('Livechat_agent_leave_comment', '', {                                                         // 98
		type: 'string',                                                                                                      // 99
		group: 'Livechat',                                                                                                   // 100
		enableQuery: {                                                                                                       // 101
			_id: 'Livechat_agent_leave_action',                                                                                 // 101
			value: 'close'                                                                                                      // 101
		},                                                                                                                   // 101
		i18nLabel: 'Comment_to_leave_on_closing_session'                                                                     // 102
	});                                                                                                                   // 98
	RocketChat.settings.add('Livechat_webhookUrl', false, {                                                               // 105
		type: 'string',                                                                                                      // 106
		group: 'Livechat',                                                                                                   // 107
		section: 'CRM_Integration',                                                                                          // 108
		i18nLabel: 'Webhook_URL'                                                                                             // 109
	});                                                                                                                   // 105
	RocketChat.settings.add('Livechat_secret_token', false, {                                                             // 112
		type: 'string',                                                                                                      // 113
		group: 'Livechat',                                                                                                   // 114
		section: 'CRM_Integration',                                                                                          // 115
		i18nLabel: 'Secret_token'                                                                                            // 116
	});                                                                                                                   // 112
	RocketChat.settings.add('Livechat_webhook_on_close', false, {                                                         // 119
		type: 'boolean',                                                                                                     // 120
		group: 'Livechat',                                                                                                   // 121
		section: 'CRM_Integration',                                                                                          // 122
		i18nLabel: 'Send_request_on_chat_close'                                                                              // 123
	});                                                                                                                   // 119
	RocketChat.settings.add('Livechat_webhook_on_offline_msg', false, {                                                   // 126
		type: 'boolean',                                                                                                     // 127
		group: 'Livechat',                                                                                                   // 128
		section: 'CRM_Integration',                                                                                          // 129
		i18nLabel: 'Send_request_on_offline_messages'                                                                        // 130
	});                                                                                                                   // 126
	RocketChat.settings.add('Livechat_Knowledge_Enabled', false, {                                                        // 133
		type: 'boolean',                                                                                                     // 134
		group: 'Livechat',                                                                                                   // 135
		section: 'Knowledge_Base',                                                                                           // 136
		"public": true,                                                                                                      // 137
		i18nLabel: 'Enabled'                                                                                                 // 138
	});                                                                                                                   // 133
	RocketChat.settings.add('Livechat_Knowledge_Apiai_Key', '', {                                                         // 141
		type: 'string',                                                                                                      // 142
		group: 'Livechat',                                                                                                   // 143
		section: 'Knowledge_Base',                                                                                           // 144
		"public": true,                                                                                                      // 145
		i18nLabel: 'Apiai_Key'                                                                                               // 146
	});                                                                                                                   // 141
	RocketChat.settings.add('Livechat_Knowledge_Apiai_Language', 'en', {                                                  // 149
		type: 'string',                                                                                                      // 150
		group: 'Livechat',                                                                                                   // 151
		section: 'Knowledge_Base',                                                                                           // 152
		"public": true,                                                                                                      // 153
		i18nLabel: 'Apiai_Language'                                                                                          // 154
	});                                                                                                                   // 149
	RocketChat.settings.add('Livechat_history_monitor_type', 'url', {                                                     // 157
		type: 'select',                                                                                                      // 158
		group: 'Livechat',                                                                                                   // 159
		i18nLabel: 'Monitor_history_for_changes_on',                                                                         // 160
		values: [{                                                                                                           // 161
			key: 'url',                                                                                                         // 162
			i18nLabel: 'Page_URL'                                                                                               // 162
		}, {                                                                                                                 // 162
			key: 'title',                                                                                                       // 163
			i18nLabel: 'Page_title'                                                                                             // 163
		}]                                                                                                                   // 163
	});                                                                                                                   // 157
	RocketChat.settings.add('Livechat_Routing_Method', 'Least_Amount', {                                                  // 167
		type: 'select',                                                                                                      // 168
		group: 'Livechat',                                                                                                   // 169
		"public": true,                                                                                                      // 170
		values: [{                                                                                                           // 171
			key: 'Least_Amount',                                                                                                // 172
			i18nLabel: 'Least_Amount'                                                                                           // 172
		}, {                                                                                                                 // 172
			key: 'Guest_Pool',                                                                                                  // 173
			i18nLabel: 'Guest_Pool'                                                                                             // 173
		}]                                                                                                                   // 173
	});                                                                                                                   // 167
	RocketChat.settings.add('Livechat_guest_pool_with_no_agents', false, {                                                // 177
		type: 'boolean',                                                                                                     // 178
		group: 'Livechat',                                                                                                   // 179
		i18nLabel: 'Accept_with_no_online_agents',                                                                           // 180
		i18nDescription: 'Accept_incoming_livechat_requests_even_if_there_are_no_online_agents',                             // 181
		enableQuery: {                                                                                                       // 182
			_id: 'Livechat_Routing_Method',                                                                                     // 182
			value: 'Guest_Pool'                                                                                                 // 182
		}                                                                                                                    // 182
	});                                                                                                                   // 177
	RocketChat.settings.add('Livechat_show_queue_list_link', false, {                                                     // 185
		type: 'boolean',                                                                                                     // 186
		group: 'Livechat',                                                                                                   // 187
		"public": true,                                                                                                      // 188
		i18nLabel: 'Show_queue_list_to_all_agents'                                                                           // 189
	});                                                                                                                   // 185
	RocketChat.settings.add('Livechat_enable_office_hours', false, {                                                      // 192
		type: 'boolean',                                                                                                     // 193
		group: 'Livechat',                                                                                                   // 194
		"public": true,                                                                                                      // 195
		i18nLabel: 'Office_hours_enabled'                                                                                    // 196
	});                                                                                                                   // 192
	RocketChat.settings.add('Livechat_videocall_enabled', false, {                                                        // 199
		type: 'boolean',                                                                                                     // 200
		group: 'Livechat',                                                                                                   // 201
		"public": true,                                                                                                      // 202
		i18nLabel: 'Videocall_enabled',                                                                                      // 203
		i18nDescription: 'Beta_feature_Depends_on_Video_Conference_to_be_enabled',                                           // 204
		enableQuery: {                                                                                                       // 205
			_id: 'Jitsi_Enabled',                                                                                               // 205
			value: true                                                                                                         // 205
		}                                                                                                                    // 205
	});                                                                                                                   // 199
	RocketChat.settings.add('Livechat_enable_transcript', false, {                                                        // 208
		type: 'boolean',                                                                                                     // 209
		group: 'Livechat',                                                                                                   // 210
		"public": true,                                                                                                      // 211
		i18nLabel: 'Transcript_Enabled'                                                                                      // 212
	});                                                                                                                   // 208
	RocketChat.settings.add('Livechat_transcript_message', 'Would you like a copy of this chat emailed?', {               // 215
		type: 'string',                                                                                                      // 216
		group: 'Livechat',                                                                                                   // 217
		"public": true,                                                                                                      // 218
		i18nLabel: 'Transcript_message',                                                                                     // 219
		enableQuery: {                                                                                                       // 220
			_id: 'Livechat_enable_transcript',                                                                                  // 220
			value: true                                                                                                         // 220
		}                                                                                                                    // 220
	});                                                                                                                   // 215
	RocketChat.settings.add('Livechat_open_inquiery_show_connecting', false, {                                            // 223
		type: 'boolean',                                                                                                     // 224
		group: 'Livechat',                                                                                                   // 225
		"public": true,                                                                                                      // 226
		i18nLabel: 'Livechat_open_inquiery_show_connecting',                                                                 // 227
		enableQuery: {                                                                                                       // 228
			_id: 'Livechat_Routing_Method',                                                                                     // 228
			value: 'Guest_Pool'                                                                                                 // 228
		}                                                                                                                    // 228
	});                                                                                                                   // 223
	RocketChat.settings.add('Livechat_AllowedDomainsList', '', {                                                          // 231
		type: 'string',                                                                                                      // 232
		group: 'Livechat',                                                                                                   // 233
		"public": true,                                                                                                      // 234
		i18nLabel: 'Livechat_AllowedDomainsList',                                                                            // 235
		i18nDescription: 'Domains_allowed_to_embed_the_livechat_widget'                                                      // 236
	});                                                                                                                   // 231
});                                                                                                                    // 238
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"imports":{"server":{"rest":{"departments.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/imports/server/rest/departments.js                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.API.v1.addRoute('livechat/department', {                                                                    // 1
	authRequired: true                                                                                                    // 1
}, {                                                                                                                   // 1
	get: function () {                                                                                                    // 2
		if (!RocketChat.authz.hasPermission(this.userId, 'view-livechat-manager')) {                                         // 3
			return RocketChat.API.v1.unauthorized();                                                                            // 4
		}                                                                                                                    // 5
                                                                                                                       //
		return RocketChat.API.v1.success({                                                                                   // 7
			departments: RocketChat.models.LivechatDepartment.find().fetch()                                                    // 8
		});                                                                                                                  // 7
	},                                                                                                                    // 10
	post: function () {                                                                                                   // 11
		if (!RocketChat.authz.hasPermission(this.userId, 'view-livechat-manager')) {                                         // 12
			return RocketChat.API.v1.unauthorized();                                                                            // 13
		}                                                                                                                    // 14
                                                                                                                       //
		try {                                                                                                                // 16
			check(this.bodyParams, {                                                                                            // 17
				department: Object,                                                                                                // 18
				agents: Array                                                                                                      // 19
			});                                                                                                                 // 17
			var department = RocketChat.Livechat.saveDepartment(null, this.bodyParams.department, this.bodyParams.agents);      // 22
                                                                                                                       //
			if (department) {                                                                                                   // 24
				return RocketChat.API.v1.success({                                                                                 // 25
					department: department,                                                                                           // 26
					agents: RocketChat.models.LivechatDepartmentAgents.find({                                                         // 27
						departmentId: department._id                                                                                     // 27
					}).fetch()                                                                                                        // 27
				});                                                                                                                // 25
			}                                                                                                                   // 29
                                                                                                                       //
			RocketChat.API.v1.failure();                                                                                        // 31
		} catch (e) {                                                                                                        // 32
			return RocketChat.API.v1.failure(e);                                                                                // 33
		}                                                                                                                    // 34
	}                                                                                                                     // 35
});                                                                                                                    // 1
RocketChat.API.v1.addRoute('livechat/department/:_id', {                                                               // 38
	authRequired: true                                                                                                    // 38
}, {                                                                                                                   // 38
	get: function () {                                                                                                    // 39
		if (!RocketChat.authz.hasPermission(this.userId, 'view-livechat-manager')) {                                         // 40
			return RocketChat.API.v1.unauthorized();                                                                            // 41
		}                                                                                                                    // 42
                                                                                                                       //
		try {                                                                                                                // 44
			check(this.urlParams, {                                                                                             // 45
				_id: String                                                                                                        // 46
			});                                                                                                                 // 45
			return RocketChat.API.v1.success({                                                                                  // 49
				department: RocketChat.models.LivechatDepartment.findOneById(this.urlParams._id),                                  // 50
				agents: RocketChat.models.LivechatDepartmentAgents.find({                                                          // 51
					departmentId: this.urlParams._id                                                                                  // 51
				}).fetch()                                                                                                         // 51
			});                                                                                                                 // 49
		} catch (e) {                                                                                                        // 53
			return RocketChat.API.v1.failure(e.error);                                                                          // 54
		}                                                                                                                    // 55
	},                                                                                                                    // 56
	put: function () {                                                                                                    // 57
		if (!RocketChat.authz.hasPermission(this.userId, 'view-livechat-manager')) {                                         // 58
			return RocketChat.API.v1.unauthorized();                                                                            // 59
		}                                                                                                                    // 60
                                                                                                                       //
		try {                                                                                                                // 62
			check(this.urlParams, {                                                                                             // 63
				_id: String                                                                                                        // 64
			});                                                                                                                 // 63
			check(this.bodyParams, {                                                                                            // 67
				department: Object,                                                                                                // 68
				agents: Array                                                                                                      // 69
			});                                                                                                                 // 67
                                                                                                                       //
			if (RocketChat.Livechat.saveDepartment(this.urlParams._id, this.bodyParams.department, this.bodyParams.agents)) {   // 72
				return RocketChat.API.v1.success({                                                                                 // 73
					department: RocketChat.models.LivechatDepartment.findOneById(this.urlParams._id),                                 // 74
					agents: RocketChat.models.LivechatDepartmentAgents.find({                                                         // 75
						departmentId: this.urlParams._id                                                                                 // 75
					}).fetch()                                                                                                        // 75
				});                                                                                                                // 73
			}                                                                                                                   // 77
                                                                                                                       //
			return RocketChat.API.v1.failure();                                                                                 // 79
		} catch (e) {                                                                                                        // 80
			return RocketChat.API.v1.failure(e.error);                                                                          // 81
		}                                                                                                                    // 82
	},                                                                                                                    // 83
	"delete": function () {                                                                                               // 38
		if (!RocketChat.authz.hasPermission(this.userId, 'view-livechat-manager')) {                                         // 85
			return RocketChat.API.v1.unauthorized();                                                                            // 86
		}                                                                                                                    // 87
                                                                                                                       //
		try {                                                                                                                // 89
			check(this.urlParams, {                                                                                             // 90
				_id: String                                                                                                        // 91
			});                                                                                                                 // 90
                                                                                                                       //
			if (RocketChat.Livechat.removeDepartment(this.urlParams._id)) {                                                     // 94
				return RocketChat.API.v1.success();                                                                                // 95
			}                                                                                                                   // 96
                                                                                                                       //
			return RocketChat.API.v1.failure();                                                                                 // 98
		} catch (e) {                                                                                                        // 99
			return RocketChat.API.v1.failure(e.error);                                                                          // 100
		}                                                                                                                    // 101
	}                                                                                                                     // 102
});                                                                                                                    // 38
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"sms.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/imports/server/rest/sms.js                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.API.v1.addRoute('livechat/sms-incoming/:service', {                                                         // 1
	post: function () {                                                                                                   // 2
		var SMSService = RocketChat.SMS.getService(this.urlParams.service);                                                  // 3
		var sms = SMSService.parse(this.bodyParams);                                                                         // 5
		var visitor = RocketChat.models.Users.findOneVisitorByPhone(sms.from);                                               // 7
		var sendMessage = {                                                                                                  // 9
			message: {                                                                                                          // 10
				_id: Random.id()                                                                                                   // 11
			},                                                                                                                  // 10
			roomInfo: {                                                                                                         // 13
				sms: {                                                                                                             // 14
					from: sms.to                                                                                                      // 15
				}                                                                                                                  // 14
			}                                                                                                                   // 13
		};                                                                                                                   // 9
                                                                                                                       //
		if (visitor) {                                                                                                       // 20
			var rooms = RocketChat.models.Rooms.findOpenByVisitorToken(visitor.profile.token).fetch();                          // 21
                                                                                                                       //
			if (rooms && rooms.length > 0) {                                                                                    // 23
				sendMessage.message.rid = rooms[0]._id;                                                                            // 24
			} else {                                                                                                            // 25
				sendMessage.message.rid = Random.id();                                                                             // 26
			}                                                                                                                   // 27
                                                                                                                       //
			sendMessage.message.token = visitor.profile.token;                                                                  // 28
		} else {                                                                                                             // 29
			sendMessage.message.rid = Random.id();                                                                              // 30
			sendMessage.message.token = Random.id();                                                                            // 31
			var userId = RocketChat.Livechat.registerGuest({                                                                    // 33
				username: sms.from.replace(/[^0-9]/g, ''),                                                                         // 34
				token: sendMessage.message.token,                                                                                  // 35
				phone: {                                                                                                           // 36
					number: sms.from                                                                                                  // 37
				}                                                                                                                  // 36
			});                                                                                                                 // 33
			visitor = RocketChat.models.Users.findOneById(userId);                                                              // 41
		}                                                                                                                    // 42
                                                                                                                       //
		sendMessage.message.msg = sms.body;                                                                                  // 44
		sendMessage.guest = visitor;                                                                                         // 45
                                                                                                                       //
		try {                                                                                                                // 47
			var message = SMSService.response.call(this, RocketChat.Livechat.sendMessage(sendMessage));                         // 48
			Meteor.defer(function () {                                                                                          // 50
				if (sms.extra) {                                                                                                   // 51
					if (sms.extra.fromCountry) {                                                                                      // 52
						Meteor.call('livechat:setCustomField', sendMessage.message.token, 'country', sms.extra.fromCountry);             // 53
					}                                                                                                                 // 54
                                                                                                                       //
					if (sms.extra.fromState) {                                                                                        // 55
						Meteor.call('livechat:setCustomField', sendMessage.message.token, 'state', sms.extra.fromState);                 // 56
					}                                                                                                                 // 57
                                                                                                                       //
					if (sms.extra.fromCity) {                                                                                         // 58
						Meteor.call('livechat:setCustomField', sendMessage.message.token, 'city', sms.extra.fromCity);                   // 59
					}                                                                                                                 // 60
				}                                                                                                                  // 61
			});                                                                                                                 // 62
			return message;                                                                                                     // 64
		} catch (e) {                                                                                                        // 65
			return SMSService.error.call(this, e);                                                                              // 66
		}                                                                                                                    // 67
	}                                                                                                                     // 68
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"users.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/imports/server/rest/users.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.API.v1.addRoute('livechat/users/:type', {                                                                   // 1
	authRequired: true                                                                                                    // 1
}, {                                                                                                                   // 1
	get: function () {                                                                                                    // 2
		if (!RocketChat.authz.hasPermission(this.userId, 'view-livechat-manager')) {                                         // 3
			return RocketChat.API.v1.unauthorized();                                                                            // 4
		}                                                                                                                    // 5
                                                                                                                       //
		try {                                                                                                                // 7
			check(this.urlParams, {                                                                                             // 8
				type: String                                                                                                       // 9
			});                                                                                                                 // 8
			var role = void 0;                                                                                                  // 12
                                                                                                                       //
			if (this.urlParams.type === 'agent') {                                                                              // 13
				role = 'livechat-agent';                                                                                           // 14
			} else if (this.urlParams.type === 'manager') {                                                                     // 15
				role = 'livechat-manager';                                                                                         // 16
			} else {                                                                                                            // 17
				throw 'Invalid type';                                                                                              // 18
			}                                                                                                                   // 19
                                                                                                                       //
			var users = RocketChat.authz.getUsersInRole(role);                                                                  // 21
			return RocketChat.API.v1.success({                                                                                  // 23
				users: users.fetch().map(function (user) {                                                                         // 24
					return {                                                                                                          // 24
						_id: user._id,                                                                                                   // 24
						username: user.username                                                                                          // 24
					};                                                                                                                // 24
				})                                                                                                                 // 24
			});                                                                                                                 // 23
		} catch (e) {                                                                                                        // 26
			return RocketChat.API.v1.failure(e.error);                                                                          // 27
		}                                                                                                                    // 28
	},                                                                                                                    // 29
	post: function () {                                                                                                   // 30
		if (!RocketChat.authz.hasPermission(this.userId, 'view-livechat-manager')) {                                         // 31
			return RocketChat.API.v1.unauthorized();                                                                            // 32
		}                                                                                                                    // 33
                                                                                                                       //
		try {                                                                                                                // 34
			check(this.urlParams, {                                                                                             // 35
				type: String                                                                                                       // 36
			});                                                                                                                 // 35
			check(this.bodyParams, {                                                                                            // 39
				username: String                                                                                                   // 40
			});                                                                                                                 // 39
                                                                                                                       //
			if (this.urlParams.type === 'agent') {                                                                              // 43
				var user = RocketChat.Livechat.addAgent(this.bodyParams.username);                                                 // 44
                                                                                                                       //
				if (user) {                                                                                                        // 45
					return RocketChat.API.v1.success({                                                                                // 46
						user: user                                                                                                       // 46
					});                                                                                                               // 46
				}                                                                                                                  // 47
			} else if (this.urlParams.type === 'manager') {                                                                     // 48
				var _user = RocketChat.Livechat.addManager(this.bodyParams.username);                                              // 49
                                                                                                                       //
				if (_user) {                                                                                                       // 50
					return RocketChat.API.v1.success({                                                                                // 51
						user: _user                                                                                                      // 51
					});                                                                                                               // 51
				}                                                                                                                  // 52
			} else {                                                                                                            // 53
				throw 'Invalid type';                                                                                              // 54
			}                                                                                                                   // 55
                                                                                                                       //
			return RocketChat.API.v1.failure();                                                                                 // 57
		} catch (e) {                                                                                                        // 58
			return RocketChat.API.v1.failure(e.error);                                                                          // 59
		}                                                                                                                    // 60
	}                                                                                                                     // 61
});                                                                                                                    // 1
RocketChat.API.v1.addRoute('livechat/users/:type/:_id', {                                                              // 64
	authRequired: true                                                                                                    // 64
}, {                                                                                                                   // 64
	get: function () {                                                                                                    // 65
		if (!RocketChat.authz.hasPermission(this.userId, 'view-livechat-manager')) {                                         // 66
			return RocketChat.API.v1.unauthorized();                                                                            // 67
		}                                                                                                                    // 68
                                                                                                                       //
		try {                                                                                                                // 70
			check(this.urlParams, {                                                                                             // 71
				type: String,                                                                                                      // 72
				_id: String                                                                                                        // 73
			});                                                                                                                 // 71
			var user = RocketChat.models.Users.findOneById(this.urlParams._id);                                                 // 76
                                                                                                                       //
			if (!user) {                                                                                                        // 78
				return RocketChat.API.v1.failure('User not found');                                                                // 79
			}                                                                                                                   // 80
                                                                                                                       //
			var role = void 0;                                                                                                  // 82
                                                                                                                       //
			if (this.urlParams.type === 'agent') {                                                                              // 84
				role = 'livechat-agent';                                                                                           // 85
			} else if (this.urlParams.type === 'manager') {                                                                     // 86
				role = 'livechat-manager';                                                                                         // 87
			} else {                                                                                                            // 88
				throw 'Invalid type';                                                                                              // 89
			}                                                                                                                   // 90
                                                                                                                       //
			if (user.roles.indexOf(role) !== -1) {                                                                              // 92
				return RocketChat.API.v1.success({                                                                                 // 93
					user: _.pick(user, '_id', 'username')                                                                             // 94
				});                                                                                                                // 93
			}                                                                                                                   // 96
                                                                                                                       //
			return RocketChat.API.v1.success({                                                                                  // 98
				user: null                                                                                                         // 99
			});                                                                                                                 // 98
		} catch (e) {                                                                                                        // 101
			return RocketChat.API.v1.failure(e.error);                                                                          // 102
		}                                                                                                                    // 103
	},                                                                                                                    // 104
	"delete": function () {                                                                                               // 64
		if (!RocketChat.authz.hasPermission(this.userId, 'view-livechat-manager')) {                                         // 106
			return RocketChat.API.v1.unauthorized();                                                                            // 107
		}                                                                                                                    // 108
                                                                                                                       //
		try {                                                                                                                // 110
			check(this.urlParams, {                                                                                             // 111
				type: String,                                                                                                      // 112
				_id: String                                                                                                        // 113
			});                                                                                                                 // 111
			var user = RocketChat.models.Users.findOneById(this.urlParams._id);                                                 // 116
                                                                                                                       //
			if (!user) {                                                                                                        // 118
				return RocketChat.API.v1.failure();                                                                                // 119
			}                                                                                                                   // 120
                                                                                                                       //
			if (this.urlParams.type === 'agent') {                                                                              // 122
				if (RocketChat.Livechat.removeAgent(user.username)) {                                                              // 123
					return RocketChat.API.v1.success();                                                                               // 124
				}                                                                                                                  // 125
			} else if (this.urlParams.type === 'manager') {                                                                     // 126
				if (RocketChat.Livechat.removeManager(user.username)) {                                                            // 127
					return RocketChat.API.v1.success();                                                                               // 128
				}                                                                                                                  // 129
			} else {                                                                                                            // 130
				throw 'Invalid type';                                                                                              // 131
			}                                                                                                                   // 132
                                                                                                                       //
			return RocketChat.API.v1.failure();                                                                                 // 134
		} catch (e) {                                                                                                        // 135
			return RocketChat.API.v1.failure(e.error);                                                                          // 136
		}                                                                                                                    // 137
	}                                                                                                                     // 138
});                                                                                                                    // 64
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"node_modules":{"ua-parser-js":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// .npm/package/node_modules/ua-parser-js/package.json                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
exports.name = "ua-parser-js";
exports.version = "0.7.10";
exports.main = "src/ua-parser.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"src":{"ua-parser.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/rocketchat_livechat/node_modules/ua-parser-js/src/ua-parser.js                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**
 * UAParser.js v0.7.10
 * Lightweight JavaScript-based User-Agent string parser
 * https://github.com/faisalman/ua-parser-js
 *
 * Copyright © 2012-2015 Faisal Salman <fyzlman@gmail.com>
 * Dual licensed under GPLv2 & MIT
 */

(function (window, undefined) {

    'use strict';

    //////////////
    // Constants
    /////////////


    var LIBVERSION  = '0.7.10',
        EMPTY       = '',
        UNKNOWN     = '?',
        FUNC_TYPE   = 'function',
        UNDEF_TYPE  = 'undefined',
        OBJ_TYPE    = 'object',
        STR_TYPE    = 'string',
        MAJOR       = 'major', // deprecated
        MODEL       = 'model',
        NAME        = 'name',
        TYPE        = 'type',
        VENDOR      = 'vendor',
        VERSION     = 'version',
        ARCHITECTURE= 'architecture',
        CONSOLE     = 'console',
        MOBILE      = 'mobile',
        TABLET      = 'tablet',
        SMARTTV     = 'smarttv',
        WEARABLE    = 'wearable',
        EMBEDDED    = 'embedded';


    ///////////
    // Helper
    //////////


    var util = {
        extend : function (regexes, extensions) {
            for (var i in extensions) {
                if ("browser cpu device engine os".indexOf(i) !== -1 && extensions[i].length % 2 === 0) {
                    regexes[i] = extensions[i].concat(regexes[i]);
                }
            }
            return regexes;
        },
        has : function (str1, str2) {
          if (typeof str1 === "string") {
            return str2.toLowerCase().indexOf(str1.toLowerCase()) !== -1;
          } else {
            return false;
          }
        },
        lowerize : function (str) {
            return str.toLowerCase();
        },
        major : function (version) {
            return typeof(version) === STR_TYPE ? version.split(".")[0] : undefined;
        }
    };


    ///////////////
    // Map helper
    //////////////


    var mapper = {

        rgx : function () {

            var result, i = 0, j, k, p, q, matches, match, args = arguments;

            // loop through all regexes maps
            while (i < args.length && !matches) {

                var regex = args[i],       // even sequence (0,2,4,..)
                    props = args[i + 1];   // odd sequence (1,3,5,..)

                // construct object barebones
                if (typeof result === UNDEF_TYPE) {
                    result = {};
                    for (p in props) {
                        if (props.hasOwnProperty(p)){
                            q = props[p];
                            if (typeof q === OBJ_TYPE) {
                                result[q[0]] = undefined;
                            } else {
                                result[q] = undefined;
                            }
                        }
                    }
                }

                // try matching uastring with regexes
                j = k = 0;
                while (j < regex.length && !matches) {
                    matches = regex[j++].exec(this.getUA());
                    if (!!matches) {
                        for (p = 0; p < props.length; p++) {
                            match = matches[++k];
                            q = props[p];
                            // check if given property is actually array
                            if (typeof q === OBJ_TYPE && q.length > 0) {
                                if (q.length == 2) {
                                    if (typeof q[1] == FUNC_TYPE) {
                                        // assign modified match
                                        result[q[0]] = q[1].call(this, match);
                                    } else {
                                        // assign given value, ignore regex match
                                        result[q[0]] = q[1];
                                    }
                                } else if (q.length == 3) {
                                    // check whether function or regex
                                    if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
                                        // call function (usually string mapper)
                                        result[q[0]] = match ? q[1].call(this, match, q[2]) : undefined;
                                    } else {
                                        // sanitize match using given regex
                                        result[q[0]] = match ? match.replace(q[1], q[2]) : undefined;
                                    }
                                } else if (q.length == 4) {
                                        result[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined;
                                }
                            } else {
                                result[q] = match ? match : undefined;
                            }
                        }
                    }
                }
                i += 2;
            }
            return result;
        },

        str : function (str, map) {

            for (var i in map) {
                // check if array
                if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
                    for (var j = 0; j < map[i].length; j++) {
                        if (util.has(map[i][j], str)) {
                            return (i === UNKNOWN) ? undefined : i;
                        }
                    }
                } else if (util.has(map[i], str)) {
                    return (i === UNKNOWN) ? undefined : i;
                }
            }
            return str;
        }
    };


    ///////////////
    // String map
    //////////////


    var maps = {

        browser : {
            oldsafari : {
                version : {
                    '1.0'   : '/8',
                    '1.2'   : '/1',
                    '1.3'   : '/3',
                    '2.0'   : '/412',
                    '2.0.2' : '/416',
                    '2.0.3' : '/417',
                    '2.0.4' : '/419',
                    '?'     : '/'
                }
            }
        },

        device : {
            amazon : {
                model : {
                    'Fire Phone' : ['SD', 'KF']
                }
            },
            sprint : {
                model : {
                    'Evo Shift 4G' : '7373KT'
                },
                vendor : {
                    'HTC'       : 'APA',
                    'Sprint'    : 'Sprint'
                }
            }
        },

        os : {
            windows : {
                version : {
                    'ME'        : '4.90',
                    'NT 3.11'   : 'NT3.51',
                    'NT 4.0'    : 'NT4.0',
                    '2000'      : 'NT 5.0',
                    'XP'        : ['NT 5.1', 'NT 5.2'],
                    'Vista'     : 'NT 6.0',
                    '7'         : 'NT 6.1',
                    '8'         : 'NT 6.2',
                    '8.1'       : 'NT 6.3',
                    '10'        : ['NT 6.4', 'NT 10.0'],
                    'RT'        : 'ARM'
                }
            }
        }
    };


    //////////////
    // Regex map
    /////////////


    var regexes = {

        browser : [[

            // Presto based
            /(opera\smini)\/([\w\.-]+)/i,                                       // Opera Mini
            /(opera\s[mobiletab]+).+version\/([\w\.-]+)/i,                      // Opera Mobi/Tablet
            /(opera).+version\/([\w\.]+)/i,                                     // Opera > 9.80
            /(opera)[\/\s]+([\w\.]+)/i                                          // Opera < 9.80

            ], [NAME, VERSION], [

            /\s(opr)\/([\w\.]+)/i                                               // Opera Webkit
            ], [[NAME, 'Opera'], VERSION], [

            // Mixed
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]+)*/i,
                                                                                // Lunascape/Maxthon/Netfront/Jasmine/Blazer

            // Trident based
            /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i,
                                                                                // Avant/IEMobile/SlimBrowser/Baidu
            /(?:ms|\()(ie)\s([\w\.]+)/i,                                        // Internet Explorer

            // Webkit/KHTML based
            /(rekonq)\/([\w\.]+)*/i,                                            // Rekonq
            /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs)\/([\w\.-]+)/i
                                                                                // Chromium/Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS
            ], [NAME, VERSION], [

            /(trident).+rv[:\s]([\w\.]+).+like\sgecko/i                         // IE11
            ], [[NAME, 'IE'], VERSION], [

            /(edge)\/((\d+)?[\w\.]+)/i                                          // Microsoft Edge
            ], [NAME, VERSION], [

            /(yabrowser)\/([\w\.]+)/i                                           // Yandex
            ], [[NAME, 'Yandex'], VERSION], [

            /(comodo_dragon)\/([\w\.]+)/i                                       // Comodo Dragon
            ], [[NAME, /_/g, ' '], VERSION], [

            /(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i,
                                                                                // Chrome/OmniWeb/Arora/Tizen/Nokia
            /(qqbrowser)[\/\s]?([\w\.]+)/i
                                                                                // QQBrowser
            ], [NAME, VERSION], [

            /(uc\s?browser)[\/\s]?([\w\.]+)/i,
            /ucweb.+(ucbrowser)[\/\s]?([\w\.]+)/i,
            /JUC.+(ucweb)[\/\s]?([\w\.]+)/i
                                                                                // UCBrowser
            ], [[NAME, 'UCBrowser'], VERSION], [

            /(dolfin)\/([\w\.]+)/i                                              // Dolphin
            ], [[NAME, 'Dolphin'], VERSION], [

            /((?:android.+)crmo|crios)\/([\w\.]+)/i                             // Chrome for Android/iOS
            ], [[NAME, 'Chrome'], VERSION], [

            /XiaoMi\/MiuiBrowser\/([\w\.]+)/i                                   // MIUI Browser
            ], [VERSION, [NAME, 'MIUI Browser']], [

            /android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)/i         // Android Browser
            ], [VERSION, [NAME, 'Android Browser']], [

            /FBAV\/([\w\.]+);/i                                                 // Facebook App for iOS
            ], [VERSION, [NAME, 'Facebook']], [

            /fxios\/([\w\.-]+)/i                                                // Firefox for iOS
            ], [VERSION, [NAME, 'Firefox']], [

            /version\/([\w\.]+).+?mobile\/\w+\s(safari)/i                       // Mobile Safari
            ], [VERSION, [NAME, 'Mobile Safari']], [

            /version\/([\w\.]+).+?(mobile\s?safari|safari)/i                    // Safari & Safari Mobile
            ], [VERSION, NAME], [

            /webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i                     // Safari < 3.0
            ], [NAME, [VERSION, mapper.str, maps.browser.oldsafari.version]], [

            /(konqueror)\/([\w\.]+)/i,                                          // Konqueror
            /(webkit|khtml)\/([\w\.]+)/i
            ], [NAME, VERSION], [

            // Gecko based
            /(navigator|netscape)\/([\w\.-]+)/i                                 // Netscape
            ], [[NAME, 'Netscape'], VERSION], [
            /(swiftfox)/i,                                                      // Swiftfox
            /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,
                                                                                // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror
            /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/([\w\.-]+)/i,
                                                                                // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
            /(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i,                          // Mozilla

            // Other
            /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i,
                                                                                // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Sleipnir
            /(links)\s\(([\w\.]+)/i,                                            // Links
            /(gobrowser)\/?([\w\.]+)*/i,                                        // GoBrowser
            /(ice\s?browser)\/v?([\w\._]+)/i,                                   // ICE Browser
            /(mosaic)[\/\s]([\w\.]+)/i                                          // Mosaic
            ], [NAME, VERSION]

            /* /////////////////////
            // Media players BEGIN
            ////////////////////////

            , [

            /(apple(?:coremedia|))\/((\d+)[\w\._]+)/i,                          // Generic Apple CoreMedia
            /(coremedia) v((\d+)[\w\._]+)/i
            ], [NAME, VERSION], [

            /(aqualung|lyssna|bsplayer)\/((\d+)?[\w\.-]+)/i                     // Aqualung/Lyssna/BSPlayer
            ], [NAME, VERSION], [

            /(ares|ossproxy)\s((\d+)[\w\.-]+)/i                                 // Ares/OSSProxy
            ], [NAME, VERSION], [

            /(audacious|audimusicstream|amarok|bass|core|dalvik|gnomemplayer|music on console|nsplayer|psp-internetradioplayer|videos)\/((\d+)[\w\.-]+)/i,
                                                                                // Audacious/AudiMusicStream/Amarok/BASS/OpenCORE/Dalvik/GnomeMplayer/MoC
                                                                                // NSPlayer/PSP-InternetRadioPlayer/Videos
            /(clementine|music player daemon)\s((\d+)[\w\.-]+)/i,               // Clementine/MPD
            /(lg player|nexplayer)\s((\d+)[\d\.]+)/i,
            /player\/(nexplayer|lg player)\s((\d+)[\w\.-]+)/i                   // NexPlayer/LG Player
            ], [NAME, VERSION], [
            /(nexplayer)\s((\d+)[\w\.-]+)/i                                     // Nexplayer
            ], [NAME, VERSION], [

            /(flrp)\/((\d+)[\w\.-]+)/i                                          // Flip Player
            ], [[NAME, 'Flip Player'], VERSION], [

            /(fstream|nativehost|queryseekspider|ia-archiver|facebookexternalhit)/i
                                                                                // FStream/NativeHost/QuerySeekSpider/IA Archiver/facebookexternalhit
            ], [NAME], [

            /(gstreamer) souphttpsrc (?:\([^\)]+\)){0,1} libsoup\/((\d+)[\w\.-]+)/i
                                                                                // Gstreamer
            ], [NAME, VERSION], [

            /(htc streaming player)\s[\w_]+\s\/\s((\d+)[\d\.]+)/i,              // HTC Streaming Player
            /(java|python-urllib|python-requests|wget|libcurl)\/((\d+)[\w\.-_]+)/i,
                                                                                // Java/urllib/requests/wget/cURL
            /(lavf)((\d+)[\d\.]+)/i                                             // Lavf (FFMPEG)
            ], [NAME, VERSION], [

            /(htc_one_s)\/((\d+)[\d\.]+)/i                                      // HTC One S
            ], [[NAME, /_/g, ' '], VERSION], [

            /(mplayer)(?:\s|\/)(?:(?:sherpya-){0,1}svn)(?:-|\s)(r\d+(?:-\d+[\w\.-]+){0,1})/i
                                                                                // MPlayer SVN
            ], [NAME, VERSION], [

            /(mplayer)(?:\s|\/|[unkow-]+)((\d+)[\w\.-]+)/i                      // MPlayer
            ], [NAME, VERSION], [

            /(mplayer)/i,                                                       // MPlayer (no other info)
            /(yourmuze)/i,                                                      // YourMuze
            /(media player classic|nero showtime)/i                             // Media Player Classic/Nero ShowTime
            ], [NAME], [

            /(nero (?:home|scout))\/((\d+)[\w\.-]+)/i                           // Nero Home/Nero Scout
            ], [NAME, VERSION], [

            /(nokia\d+)\/((\d+)[\w\.-]+)/i                                      // Nokia
            ], [NAME, VERSION], [

            /\s(songbird)\/((\d+)[\w\.-]+)/i                                    // Songbird/Philips-Songbird
            ], [NAME, VERSION], [

            /(winamp)3 version ((\d+)[\w\.-]+)/i,                               // Winamp
            /(winamp)\s((\d+)[\w\.-]+)/i,
            /(winamp)mpeg\/((\d+)[\w\.-]+)/i
            ], [NAME, VERSION], [

            /(ocms-bot|tapinradio|tunein radio|unknown|winamp|inlight radio)/i  // OCMS-bot/tap in radio/tunein/unknown/winamp (no other info)
                                                                                // inlight radio
            ], [NAME], [

            /(quicktime|rma|radioapp|radioclientapplication|soundtap|totem|stagefright|streamium)\/((\d+)[\w\.-]+)/i
                                                                                // QuickTime/RealMedia/RadioApp/RadioClientApplication/
                                                                                // SoundTap/Totem/Stagefright/Streamium
            ], [NAME, VERSION], [

            /(smp)((\d+)[\d\.]+)/i                                              // SMP
            ], [NAME, VERSION], [

            /(vlc) media player - version ((\d+)[\w\.]+)/i,                     // VLC Videolan
            /(vlc)\/((\d+)[\w\.-]+)/i,
            /(xbmc|gvfs|xine|xmms|irapp)\/((\d+)[\w\.-]+)/i,                    // XBMC/gvfs/Xine/XMMS/irapp
            /(foobar2000)\/((\d+)[\d\.]+)/i,                                    // Foobar2000
            /(itunes)\/((\d+)[\d\.]+)/i                                         // iTunes
            ], [NAME, VERSION], [

            /(wmplayer)\/((\d+)[\w\.-]+)/i,                                     // Windows Media Player
            /(windows-media-player)\/((\d+)[\w\.-]+)/i
            ], [[NAME, /-/g, ' '], VERSION], [

            /windows\/((\d+)[\w\.-]+) upnp\/[\d\.]+ dlnadoc\/[\d\.]+ (home media server)/i
                                                                                // Windows Media Server
            ], [VERSION, [NAME, 'Windows']], [

            /(com\.riseupradioalarm)\/((\d+)[\d\.]*)/i                          // RiseUP Radio Alarm
            ], [NAME, VERSION], [

            /(rad.io)\s((\d+)[\d\.]+)/i,                                        // Rad.io
            /(radio.(?:de|at|fr))\s((\d+)[\d\.]+)/i
            ], [[NAME, 'rad.io'], VERSION]

            //////////////////////
            // Media players END
            ////////////////////*/

        ],

        cpu : [[

            /(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i                     // AMD64
            ], [[ARCHITECTURE, 'amd64']], [

            /(ia32(?=;))/i                                                      // IA32 (quicktime)
            ], [[ARCHITECTURE, util.lowerize]], [

            /((?:i[346]|x)86)[;\)]/i                                            // IA32
            ], [[ARCHITECTURE, 'ia32']], [

            // PocketPC mistakenly identified as PowerPC
            /windows\s(ce|mobile);\sppc;/i
            ], [[ARCHITECTURE, 'arm']], [

            /((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i                           // PowerPC
            ], [[ARCHITECTURE, /ower/, '', util.lowerize]], [

            /(sun4\w)[;\)]/i                                                    // SPARC
            ], [[ARCHITECTURE, 'sparc']], [

            /((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+;))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i
                                                                                // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
            ], [[ARCHITECTURE, util.lowerize]]
        ],

        device : [[

            /\((ipad|playbook);[\w\s\);-]+(rim|apple)/i                         // iPad/PlayBook
            ], [MODEL, VENDOR, [TYPE, TABLET]], [

            /applecoremedia\/[\w\.]+ \((ipad)/                                  // iPad
            ], [MODEL, [VENDOR, 'Apple'], [TYPE, TABLET]], [

            /(apple\s{0,1}tv)/i                                                 // Apple TV
            ], [[MODEL, 'Apple TV'], [VENDOR, 'Apple']], [

            /(archos)\s(gamepad2?)/i,                                           // Archos
            /(hp).+(touchpad)/i,                                                // HP TouchPad
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /\s(nook)[\w\s]+build\/(\w+)/i,                                     // Nook
            /(dell)\s(strea[kpr\s\d]*[\dko])/i                                  // Dell Streak
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /(kf[A-z]+)\sbuild\/[\w\.]+.*silk\//i                               // Kindle Fire HD
            ], [MODEL, [VENDOR, 'Amazon'], [TYPE, TABLET]], [
            /(sd|kf)[0349hijorstuw]+\sbuild\/[\w\.]+.*silk\//i                  // Fire Phone
            ], [[MODEL, mapper.str, maps.device.amazon.model], [VENDOR, 'Amazon'], [TYPE, MOBILE]], [

            /\((ip[honed|\s\w*]+);.+(apple)/i                                   // iPod/iPhone
            ], [MODEL, VENDOR, [TYPE, MOBILE]], [
            /\((ip[honed|\s\w*]+);/i                                            // iPod/iPhone
            ], [MODEL, [VENDOR, 'Apple'], [TYPE, MOBILE]], [

            /(blackberry)[\s-]?(\w+)/i,                                         // BlackBerry
            /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|huawei|meizu|motorola|polytron)[\s_-]?([\w-]+)*/i,
                                                                                // BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Huawei/Meizu/Motorola/Polytron
            /(hp)\s([\w\s]+\w)/i,                                               // HP iPAQ
            /(asus)-?(\w+)/i                                                    // Asus
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /\(bb10;\s(\w+)/i                                                   // BlackBerry 10
            ], [MODEL, [VENDOR, 'BlackBerry'], [TYPE, MOBILE]], [
                                                                                // Asus Tablets
            /android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7)/i
            ], [MODEL, [VENDOR, 'Asus'], [TYPE, TABLET]], [

            /(sony)\s(tablet\s[ps])\sbuild\//i,                                  // Sony
            /(sony)?(?:sgp.+)\sbuild\//i
            ], [[VENDOR, 'Sony'], [MODEL, 'Xperia Tablet'], [TYPE, TABLET]], [
            /(?:sony)?(?:(?:(?:c|d)\d{4})|(?:so[-l].+))\sbuild\//i
            ], [[VENDOR, 'Sony'], [MODEL, 'Xperia Phone'], [TYPE, MOBILE]], [

            /\s(ouya)\s/i,                                                      // Ouya
            /(nintendo)\s([wids3u]+)/i                                          // Nintendo
            ], [VENDOR, MODEL, [TYPE, CONSOLE]], [

            /android.+;\s(shield)\sbuild/i                                      // Nvidia
            ], [MODEL, [VENDOR, 'Nvidia'], [TYPE, CONSOLE]], [

            /(playstation\s[34portablevi]+)/i                                   // Playstation
            ], [MODEL, [VENDOR, 'Sony'], [TYPE, CONSOLE]], [

            /(sprint\s(\w+))/i                                                  // Sprint Phones
            ], [[VENDOR, mapper.str, maps.device.sprint.vendor], [MODEL, mapper.str, maps.device.sprint.model], [TYPE, MOBILE]], [

            /(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i                         // Lenovo tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i,                               // HTC
            /(zte)-(\w+)*/i,                                                    // ZTE
            /(alcatel|geeksphone|huawei|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]+)*/i
                                                                                // Alcatel/GeeksPhone/Huawei/Lenovo/Nexian/Panasonic/Sony
            ], [VENDOR, [MODEL, /_/g, ' '], [TYPE, MOBILE]], [
                
            /(nexus\s9)/i                                                       // HTC Nexus 9
            ], [MODEL, [VENDOR, 'HTC'], [TYPE, TABLET]], [

            /[\s\(;](xbox(?:\sone)?)[\s\);]/i                                   // Microsoft Xbox
            ], [MODEL, [VENDOR, 'Microsoft'], [TYPE, CONSOLE]], [
            /(kin\.[onetw]{3})/i                                                // Microsoft Kin
            ], [[MODEL, /\./g, ' '], [VENDOR, 'Microsoft'], [TYPE, MOBILE]], [

                                                                                // Motorola
            /\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?(:?\s4g)?)[\w\s]+build\//i,
            /mot[\s-]?(\w+)*/i,
            /(XT\d{3,4}) build\//i,
            /(nexus\s[6])/i
            ], [MODEL, [VENDOR, 'Motorola'], [TYPE, MOBILE]], [
            /android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i
            ], [MODEL, [VENDOR, 'Motorola'], [TYPE, TABLET]], [

            /android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n8000|sgh-t8[56]9|nexus 10))/i,
            /((SM-T\w+))/i
            ], [[VENDOR, 'Samsung'], MODEL, [TYPE, TABLET]], [                  // Samsung
            /((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-n900))/i,
            /(sam[sung]*)[\s-]*(\w+-?[\w-]*)*/i,
            /sec-((sgh\w+))/i
            ], [[VENDOR, 'Samsung'], MODEL, [TYPE, MOBILE]], [
            /(samsung);smarttv/i
            ], [VENDOR, MODEL, [TYPE, SMARTTV]], [

            /\(dtv[\);].+(aquos)/i                                              // Sharp
            ], [MODEL, [VENDOR, 'Sharp'], [TYPE, SMARTTV]], [
            /sie-(\w+)*/i                                                       // Siemens
            ], [MODEL, [VENDOR, 'Siemens'], [TYPE, MOBILE]], [

            /(maemo|nokia).*(n900|lumia\s\d+)/i,                                // Nokia
            /(nokia)[\s_-]?([\w-]+)*/i
            ], [[VENDOR, 'Nokia'], MODEL, [TYPE, MOBILE]], [

            /android\s3\.[\s\w;-]{10}(a\d{3})/i                                 // Acer
            ], [MODEL, [VENDOR, 'Acer'], [TYPE, TABLET]], [

            /android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i                     // LG Tablet
            ], [[VENDOR, 'LG'], MODEL, [TYPE, TABLET]], [
            /(lg) netcast\.tv/i                                                 // LG SmartTV
            ], [VENDOR, MODEL, [TYPE, SMARTTV]], [
            /(nexus\s[45])/i,                                                   // LG
            /lg[e;\s\/-]+(\w+)*/i
            ], [MODEL, [VENDOR, 'LG'], [TYPE, MOBILE]], [

            /android.+(ideatab[a-z0-9\-\s]+)/i                                  // Lenovo
            ], [MODEL, [VENDOR, 'Lenovo'], [TYPE, TABLET]], [

            /linux;.+((jolla));/i                                               // Jolla
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /((pebble))app\/[\d\.]+\s/i                                         // Pebble
            ], [VENDOR, MODEL, [TYPE, WEARABLE]], [

            /android.+;\s(glass)\s\d/i                                          // Google Glass
            ], [MODEL, [VENDOR, 'Google'], [TYPE, WEARABLE]], [

            /android.+(\w+)\s+build\/hm\1/i,                                        // Xiaomi Hongmi 'numeric' models
            /android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i,                   // Xiaomi Hongmi
            /android.+(mi[\s\-_]*(?:one|one[\s_]plus)?[\s_]*(?:\d\w)?)\s+build/i    // Xiaomi Mi
            ], [[MODEL, /_/g, ' '], [VENDOR, 'Xiaomi'], [TYPE, MOBILE]], [

            /\s(tablet)[;\/\s]/i,                                               // Unidentifiable Tablet
            /\s(mobile)[;\/\s]/i                                                // Unidentifiable Mobile
            ], [[TYPE, util.lowerize], VENDOR, MODEL]

            /*//////////////////////////
            // TODO: move to string map
            ////////////////////////////

            /(C6603)/i                                                          // Sony Xperia Z C6603
            ], [[MODEL, 'Xperia Z C6603'], [VENDOR, 'Sony'], [TYPE, MOBILE]], [
            /(C6903)/i                                                          // Sony Xperia Z 1
            ], [[MODEL, 'Xperia Z 1'], [VENDOR, 'Sony'], [TYPE, MOBILE]], [

            /(SM-G900[F|H])/i                                                   // Samsung Galaxy S5
            ], [[MODEL, 'Galaxy S5'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-G7102)/i                                                       // Samsung Galaxy Grand 2
            ], [[MODEL, 'Galaxy Grand 2'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-G530H)/i                                                       // Samsung Galaxy Grand Prime
            ], [[MODEL, 'Galaxy Grand Prime'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-G313HZ)/i                                                      // Samsung Galaxy V
            ], [[MODEL, 'Galaxy V'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-T805)/i                                                        // Samsung Galaxy Tab S 10.5
            ], [[MODEL, 'Galaxy Tab S 10.5'], [VENDOR, 'Samsung'], [TYPE, TABLET]], [
            /(SM-G800F)/i                                                       // Samsung Galaxy S5 Mini
            ], [[MODEL, 'Galaxy S5 Mini'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-T311)/i                                                        // Samsung Galaxy Tab 3 8.0
            ], [[MODEL, 'Galaxy Tab 3 8.0'], [VENDOR, 'Samsung'], [TYPE, TABLET]], [

            /(R1001)/i                                                          // Oppo R1001
            ], [MODEL, [VENDOR, 'OPPO'], [TYPE, MOBILE]], [
            /(X9006)/i                                                          // Oppo Find 7a
            ], [[MODEL, 'Find 7a'], [VENDOR, 'Oppo'], [TYPE, MOBILE]], [
            /(R2001)/i                                                          // Oppo YOYO R2001
            ], [[MODEL, 'Yoyo R2001'], [VENDOR, 'Oppo'], [TYPE, MOBILE]], [
            /(R815)/i                                                           // Oppo Clover R815
            ], [[MODEL, 'Clover R815'], [VENDOR, 'Oppo'], [TYPE, MOBILE]], [
             /(U707)/i                                                          // Oppo Find Way S
            ], [[MODEL, 'Find Way S'], [VENDOR, 'Oppo'], [TYPE, MOBILE]], [

            /(T3C)/i                                                            // Advan Vandroid T3C
            ], [MODEL, [VENDOR, 'Advan'], [TYPE, TABLET]], [
            /(ADVAN T1J\+)/i                                                    // Advan Vandroid T1J+
            ], [[MODEL, 'Vandroid T1J+'], [VENDOR, 'Advan'], [TYPE, TABLET]], [
            /(ADVAN S4A)/i                                                      // Advan Vandroid S4A
            ], [[MODEL, 'Vandroid S4A'], [VENDOR, 'Advan'], [TYPE, MOBILE]], [

            /(V972M)/i                                                          // ZTE V972M
            ], [MODEL, [VENDOR, 'ZTE'], [TYPE, MOBILE]], [

            /(i-mobile)\s(IQ\s[\d\.]+)/i                                        // i-mobile IQ
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /(IQ6.3)/i                                                          // i-mobile IQ IQ 6.3
            ], [[MODEL, 'IQ 6.3'], [VENDOR, 'i-mobile'], [TYPE, MOBILE]], [
            /(i-mobile)\s(i-style\s[\d\.]+)/i                                   // i-mobile i-STYLE
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /(i-STYLE2.1)/i                                                     // i-mobile i-STYLE 2.1
            ], [[MODEL, 'i-STYLE 2.1'], [VENDOR, 'i-mobile'], [TYPE, MOBILE]], [
            
            /(mobiistar touch LAI 512)/i                                        // mobiistar touch LAI 512
            ], [[MODEL, 'Touch LAI 512'], [VENDOR, 'mobiistar'], [TYPE, MOBILE]], [

            /////////////
            // END TODO
            ///////////*/

        ],

        engine : [[

            /windows.+\sedge\/([\w\.]+)/i                                       // EdgeHTML
            ], [VERSION, [NAME, 'EdgeHTML']], [

            /(presto)\/([\w\.]+)/i,                                             // Presto
            /(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i,     // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m
            /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i,                          // KHTML/Tasman/Links
            /(icab)[\/\s]([23]\.[\d\.]+)/i                                      // iCab
            ], [NAME, VERSION], [

            /rv\:([\w\.]+).*(gecko)/i                                           // Gecko
            ], [VERSION, NAME]
        ],

        os : [[

            // Windows based
            /microsoft\s(windows)\s(vista|xp)/i                                 // Windows (iTunes)
            ], [NAME, VERSION], [
            /(windows)\snt\s6\.2;\s(arm)/i,                                     // Windows RT
            /(windows\sphone(?:\sos)*|windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i
            ], [NAME, [VERSION, mapper.str, maps.os.windows.version]], [
            /(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i
            ], [[NAME, 'Windows'], [VERSION, mapper.str, maps.os.windows.version]], [

            // Mobile/Embedded OS
            /\((bb)(10);/i                                                      // BlackBerry 10
            ], [[NAME, 'BlackBerry'], VERSION], [
            /(blackberry)\w*\/?([\w\.]+)*/i,                                    // Blackberry
            /(tizen)[\/\s]([\w\.]+)/i,                                          // Tizen
            /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]+)*/i,
                                                                                // Android/WebOS/Palm/QNX/Bada/RIM/MeeGo/Contiki
            /linux;.+(sailfish);/i                                              // Sailfish OS
            ], [NAME, VERSION], [
            /(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i                 // Symbian
            ], [[NAME, 'Symbian'], VERSION], [
            /\((series40);/i                                                    // Series 40
            ], [NAME], [
            /mozilla.+\(mobile;.+gecko.+firefox/i                               // Firefox OS
            ], [[NAME, 'Firefox OS'], VERSION], [

            // Console
            /(nintendo|playstation)\s([wids34portablevu]+)/i,                   // Nintendo/Playstation

            // GNU/Linux based
            /(mint)[\/\s\(]?(\w+)*/i,                                           // Mint
            /(mageia|vectorlinux)[;\s]/i,                                       // Mageia/VectorLinux
            /(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?([\w\.-]+)*/i,
                                                                                // Joli/Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware
                                                                                // Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus
            /(hurd|linux)\s?([\w\.]+)*/i,                                       // Hurd/Linux
            /(gnu)\s?([\w\.]+)*/i                                               // GNU
            ], [NAME, VERSION], [

            /(cros)\s[\w]+\s([\w\.]+\w)/i                                       // Chromium OS
            ], [[NAME, 'Chromium OS'], VERSION],[

            // Solaris
            /(sunos)\s?([\w\.]+\d)*/i                                           // Solaris
            ], [[NAME, 'Solaris'], VERSION], [

            // BSD based
            /\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i                   // FreeBSD/NetBSD/OpenBSD/PC-BSD/DragonFly
            ], [NAME, VERSION],[

            /(ip[honead]+)(?:.*os\s([\w]+)*\slike\smac|;\sopera)/i              // iOS
            ], [[NAME, 'iOS'], [VERSION, /_/g, '.']], [

            /(mac\sos\sx)\s?([\w\s\.]+\w)*/i,
            /(macintosh|mac(?=_powerpc)\s)/i                                    // Mac OS
            ], [[NAME, 'Mac OS'], [VERSION, /_/g, '.']], [

            // Other
            /((?:open)?solaris)[\/\s-]?([\w\.]+)*/i,                            // Solaris
            /(haiku)\s(\w+)/i,                                                  // Haiku
            /(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i,                               // AIX
            /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i,
                                                                                // Plan9/Minix/BeOS/OS2/AmigaOS/MorphOS/RISCOS/OpenVMS
            /(unix)\s?([\w\.]+)*/i                                              // UNIX
            ], [NAME, VERSION]
        ]
    };


    /////////////////
    // Constructor
    ////////////////


    var UAParser = function (uastring, extensions) {

        if (!(this instanceof UAParser)) {
            return new UAParser(uastring, extensions).getResult();
        }

        var ua = uastring || ((window && window.navigator && window.navigator.userAgent) ? window.navigator.userAgent : EMPTY);
        var rgxmap = extensions ? util.extend(regexes, extensions) : regexes;

        this.getBrowser = function () {
            var browser = mapper.rgx.apply(this, rgxmap.browser);
            browser.major = util.major(browser.version);
            return browser;
        };
        this.getCPU = function () {
            return mapper.rgx.apply(this, rgxmap.cpu);
        };
        this.getDevice = function () {
            return mapper.rgx.apply(this, rgxmap.device);
        };
        this.getEngine = function () {
            return mapper.rgx.apply(this, rgxmap.engine);
        };
        this.getOS = function () {
            return mapper.rgx.apply(this, rgxmap.os);
        };
        this.getResult = function() {
            return {
                ua      : this.getUA(),
                browser : this.getBrowser(),
                engine  : this.getEngine(),
                os      : this.getOS(),
                device  : this.getDevice(),
                cpu     : this.getCPU()
            };
        };
        this.getUA = function () {
            return ua;
        };
        this.setUA = function (uastring) {
            ua = uastring;
            return this;
        };
        this.setUA(ua);
        return this;
    };

    UAParser.VERSION = LIBVERSION;
    UAParser.BROWSER = {
        NAME    : NAME,
        MAJOR   : MAJOR, // deprecated
        VERSION : VERSION
    };
    UAParser.CPU = {
        ARCHITECTURE : ARCHITECTURE
    };
    UAParser.DEVICE = {
        MODEL   : MODEL,
        VENDOR  : VENDOR,
        TYPE    : TYPE,
        CONSOLE : CONSOLE,
        MOBILE  : MOBILE,
        SMARTTV : SMARTTV,
        TABLET  : TABLET,
        WEARABLE: WEARABLE,
        EMBEDDED: EMBEDDED
    };
    UAParser.ENGINE = {
        NAME    : NAME,
        VERSION : VERSION
    };
    UAParser.OS = {
        NAME    : NAME,
        VERSION : VERSION
    };


    ///////////
    // Export
    //////////


    // check js environment
    if (typeof(exports) !== UNDEF_TYPE) {
        // nodejs env
        if (typeof module !== UNDEF_TYPE && module.exports) {
            exports = module.exports = UAParser;
        }
        exports.UAParser = UAParser;
    } else {
        // requirejs env (optional)
        if (typeof(define) === FUNC_TYPE && define.amd) {
            define(function () {
                return UAParser;
            });
        } else {
            // browser env
            window.UAParser = UAParser;
        }
    }

    // jQuery/Zepto specific (optional)
    // Note: 
    //   In AMD env the global scope should be kept clean, but jQuery is an exception.
    //   jQuery always exports to global scope, unless jQuery.noConflict(true) is used,
    //   and we should catch that.
    var $ = window.jQuery || window.Zepto;
    if (typeof $ !== UNDEF_TYPE) {
        var parser = new UAParser();
        $.ua = parser.getResult();
        $.ua.get = function() {
            return parser.getUA();
        };
        $.ua.set = function (uastring) {
            parser.setUA(uastring);
            var result = parser.getResult();
            for (var prop in result) {
                $.ua[prop] = result[prop];
            }
        };
    }

})(typeof window === 'object' ? window : this);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:livechat/livechat.js");
require("./node_modules/meteor/rocketchat:livechat/server/startup.js");
require("./node_modules/meteor/rocketchat:livechat/permissions.js");
require("./node_modules/meteor/rocketchat:livechat/messageTypes.js");
require("./node_modules/meteor/rocketchat:livechat/roomType.js");
require("./node_modules/meteor/rocketchat:livechat/config.js");
require("./node_modules/meteor/rocketchat:livechat/server/hooks/externalMessage.js");
require("./node_modules/meteor/rocketchat:livechat/server/hooks/markRoomResponded.js");
require("./node_modules/meteor/rocketchat:livechat/server/hooks/offlineMessage.js");
require("./node_modules/meteor/rocketchat:livechat/server/hooks/sendToCRM.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/addAgent.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/addManager.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/changeLivechatStatus.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/closeByVisitor.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/closeRoom.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/getCustomFields.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/getAgentData.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/getInitialData.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/loginByToken.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/pageVisited.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/registerGuest.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/removeAgent.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/removeCustomField.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/removeDepartment.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/removeManager.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/removeTrigger.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/saveAppearance.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/saveCustomField.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/saveDepartment.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/saveInfo.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/saveIntegration.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/saveSurveyFeedback.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/saveTrigger.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/searchAgent.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/sendMessageLivechat.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/sendOfflineMessage.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/setCustomField.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/setDepartmentForVisitor.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/startVideoCall.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/transfer.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/webhookTest.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/takeInquiry.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/returnAsInquiry.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/saveOfficeHours.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/sendTranscript.js");
require("./node_modules/meteor/rocketchat:livechat/server/models/Users.js");
require("./node_modules/meteor/rocketchat:livechat/server/models/Rooms.js");
require("./node_modules/meteor/rocketchat:livechat/server/models/LivechatExternalMessage.js");
require("./node_modules/meteor/rocketchat:livechat/server/models/LivechatCustomField.js");
require("./node_modules/meteor/rocketchat:livechat/server/models/LivechatDepartment.js");
require("./node_modules/meteor/rocketchat:livechat/server/models/LivechatDepartmentAgents.js");
require("./node_modules/meteor/rocketchat:livechat/server/models/LivechatPageVisited.js");
require("./node_modules/meteor/rocketchat:livechat/server/models/LivechatTrigger.js");
require("./node_modules/meteor/rocketchat:livechat/server/models/indexes.js");
require("./node_modules/meteor/rocketchat:livechat/server/models/LivechatInquiry.js");
require("./node_modules/meteor/rocketchat:livechat/server/models/LivechatOfficeHour.js");
require("./node_modules/meteor/rocketchat:livechat/server/lib/Livechat.js");
require("./node_modules/meteor/rocketchat:livechat/server/lib/QueueMethods.js");
require("./node_modules/meteor/rocketchat:livechat/server/lib/OfficeClock.js");
require("./node_modules/meteor/rocketchat:livechat/server/sendMessageBySMS.js");
require("./node_modules/meteor/rocketchat:livechat/server/unclosedLivechats.js");
require("./node_modules/meteor/rocketchat:livechat/server/publications/customFields.js");
require("./node_modules/meteor/rocketchat:livechat/server/publications/departmentAgents.js");
require("./node_modules/meteor/rocketchat:livechat/server/publications/externalMessages.js");
require("./node_modules/meteor/rocketchat:livechat/server/publications/livechatAgents.js");
require("./node_modules/meteor/rocketchat:livechat/server/publications/livechatAppearance.js");
require("./node_modules/meteor/rocketchat:livechat/server/publications/livechatDepartments.js");
require("./node_modules/meteor/rocketchat:livechat/server/publications/livechatIntegration.js");
require("./node_modules/meteor/rocketchat:livechat/server/publications/livechatManagers.js");
require("./node_modules/meteor/rocketchat:livechat/server/publications/livechatRooms.js");
require("./node_modules/meteor/rocketchat:livechat/server/publications/livechatQueue.js");
require("./node_modules/meteor/rocketchat:livechat/server/publications/livechatTriggers.js");
require("./node_modules/meteor/rocketchat:livechat/server/publications/visitorHistory.js");
require("./node_modules/meteor/rocketchat:livechat/server/publications/visitorInfo.js");
require("./node_modules/meteor/rocketchat:livechat/server/publications/visitorPageVisited.js");
require("./node_modules/meteor/rocketchat:livechat/server/publications/livechatInquiries.js");
require("./node_modules/meteor/rocketchat:livechat/server/publications/livechatOfficeHours.js");
require("./node_modules/meteor/rocketchat:livechat/server/api.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:livechat'] = {};

})();

//# sourceMappingURL=rocketchat_livechat.js.map

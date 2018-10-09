(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RocketChatTabBar = Package['rocketchat:lib'].RocketChatTabBar;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var meteorInstall = Package.modules.meteorInstall;
var process = Package.modules.process;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:channel-settings-mail-messages":{"server":{"lib":{"startup.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// packages/rocketchat_channel-settings-mail-messages/server/lib/startup.js                    //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                               //
Meteor.startup(function () {                                                                   // 1
	var permission = {                                                                            // 2
		_id: 'mail-messages',                                                                        // 3
		roles: ['admin']                                                                             // 4
	};                                                                                            // 2
	return RocketChat.models.Permissions.upsert(permission._id, {                                 // 6
		$setOnInsert: permission                                                                     // 7
	});                                                                                           // 6
});                                                                                            // 9
/////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods":{"mailMessages.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// packages/rocketchat_channel-settings-mail-messages/server/methods/mailMessages.js           //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                               //
var moment = void 0;                                                                           // 1
module.watch(require("moment"), {                                                              // 1
	"default": function (v) {                                                                     // 1
		moment = v;                                                                                  // 1
	}                                                                                             // 1
}, 0);                                                                                         // 1
Meteor.methods({                                                                               // 3
	'mailMessages': function (data) {                                                             // 4
		if (!Meteor.userId()) {                                                                      // 5
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                              // 6
				method: 'mailMessages'                                                                     // 7
			});                                                                                         // 6
		}                                                                                            // 9
                                                                                               //
		check(data, Match.ObjectIncluding({                                                          // 10
			rid: String,                                                                                // 11
			to_users: [String],                                                                         // 12
			to_emails: String,                                                                          // 13
			subject: String,                                                                            // 14
			messages: [String],                                                                         // 15
			language: String                                                                            // 16
		}));                                                                                         // 10
		var room = Meteor.call('canAccessRoom', data.rid, Meteor.userId());                          // 18
                                                                                               //
		if (!room) {                                                                                 // 19
			throw new Meteor.Error('error-invalid-room', 'Invalid room', {                              // 20
				method: 'mailMessages'                                                                     // 21
			});                                                                                         // 20
		}                                                                                            // 23
                                                                                               //
		if (!RocketChat.authz.hasPermission(Meteor.userId(), 'mail-messages')) {                     // 24
			throw new Meteor.Error('error-action-not-allowed', 'Mailing is not allowed', {              // 25
				method: 'mailMessages',                                                                    // 26
				action: 'Mailing'                                                                          // 27
			});                                                                                         // 25
		}                                                                                            // 29
                                                                                               //
		var rfcMailPatternWithName = /^(?:.*<)?([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)(?:>?)$/;
                                                                                               //
		var emails = _.compact(data.to_emails.trim().split(','));                                    // 31
                                                                                               //
		var missing = [];                                                                            // 32
                                                                                               //
		if (data.to_users.length > 0) {                                                              // 33
			_.each(data.to_users, function (username) {                                                 // 34
				var user = RocketChat.models.Users.findOneByUsername(username);                            // 35
                                                                                               //
				if (user && user.emails && user.emails[0] && user.emails[0].address) {                     // 36
					emails.push(user.emails[0].address);                                                      // 37
				} else {                                                                                   // 38
					missing.push(username);                                                                   // 39
				}                                                                                          // 40
			});                                                                                         // 41
		}                                                                                            // 42
                                                                                               //
		console.log('Sending messages to e-mails: ', emails);                                        // 43
                                                                                               //
		_.each(emails, function (email) {                                                            // 44
			if (!rfcMailPatternWithName.test(email.trim())) {                                           // 45
				throw new Meteor.Error('error-invalid-email', "Invalid email " + email, {                  // 46
					method: 'mailMessages',                                                                   // 47
					email: email                                                                              // 48
				});                                                                                        // 46
			}                                                                                           // 50
		});                                                                                          // 51
                                                                                               //
		var user = Meteor.user();                                                                    // 52
		var email = user.emails && user.emails[0] && user.emails[0].address;                         // 53
		data.language = data.language.split('-').shift().toLowerCase();                              // 54
                                                                                               //
		if (data.language !== 'en') {                                                                // 55
			var localeFn = Meteor.call('loadLocale', data.language);                                    // 56
                                                                                               //
			if (localeFn) {                                                                             // 57
				Function(localeFn)();                                                                      // 58
			}                                                                                           // 59
		}                                                                                            // 60
                                                                                               //
		var header = RocketChat.placeholders.replace(RocketChat.settings.get('Email_Header') || '');
		var footer = RocketChat.placeholders.replace(RocketChat.settings.get('Email_Footer') || '');
		var html = RocketChat.models.Messages.findByRoomIdAndMessageIds(data.rid, data.messages, {   // 64
			sort: {                                                                                     // 65
				ts: 1                                                                                      // 65
			}                                                                                           // 65
		}).map(function (message) {                                                                  // 64
			var dateTime = moment(message.ts).locale(data.language).format('L LT');                     // 67
			return "<p style='margin-bottom: 5px'><b>" + message.u.username + "</b> <span style='color: #aaa; font-size: 12px'>" + dateTime + "</span><br />" + RocketChat.Message.parse(message, data.language) + "</p>";
		}).join('');                                                                                 // 69
		Meteor.defer(function () {                                                                   // 71
			Email.send({                                                                                // 72
				to: emails,                                                                                // 73
				from: RocketChat.settings.get('From_Email'),                                               // 74
				replyTo: email,                                                                            // 75
				subject: data.subject,                                                                     // 76
				html: header + html + footer                                                               // 77
			});                                                                                         // 72
			return console.log("Sending email to " + emails.join(', '));                                // 79
		});                                                                                          // 80
		return {                                                                                     // 81
			success: true,                                                                              // 82
			missing: missing                                                                            // 83
		};                                                                                           // 81
	}                                                                                             // 85
});                                                                                            // 3
/////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:channel-settings-mail-messages/server/lib/startup.js");
require("./node_modules/meteor/rocketchat:channel-settings-mail-messages/server/methods/mailMessages.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:channel-settings-mail-messages'] = {};

})();

//# sourceMappingURL=rocketchat_channel-settings-mail-messages.js.map

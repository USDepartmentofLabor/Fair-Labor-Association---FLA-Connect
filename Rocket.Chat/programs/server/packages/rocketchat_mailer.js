(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var DDPRateLimiter = Package['ddp-rate-limiter'].DDPRateLimiter;
var FlowRouter = Package['kadira:flow-router'].FlowRouter;
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
var Mailer;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:mailer":{"lib":{"Mailer.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/rocketchat_mailer/lib/Mailer.js                                                              //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
Mailer = {}; //eslint-disable-line                                                                       // 1
///////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"startup.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/rocketchat_mailer/server/startup.js                                                          //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
Meteor.startup(function () {                                                                             // 1
	return RocketChat.models.Permissions.upsert('access-mailer', {                                          // 2
		$setOnInsert: {                                                                                        // 3
			_id: 'access-mailer',                                                                                 // 4
			roles: ['admin']                                                                                      // 5
		}                                                                                                      // 3
	});                                                                                                     // 2
});                                                                                                      // 8
///////////////////////////////////////////////////////////////////////////////////////////////////////////

},"models":{"Users.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/rocketchat_mailer/server/models/Users.js                                                     //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
RocketChat.models.Users.rocketMailUnsubscribe = function (_id, createdAt) {                              // 1
	var query = {                                                                                           // 2
		_id: _id,                                                                                              // 3
		createdAt: new Date(parseInt(createdAt))                                                               // 4
	};                                                                                                      // 2
	var update = {                                                                                          // 6
		$set: {                                                                                                // 7
			'mailer.unsubscribed': true                                                                           // 8
		}                                                                                                      // 7
	};                                                                                                      // 6
	var affectedRows = this.update(query, update);                                                          // 11
	console.log('[Mailer:Unsubscribe]', _id, createdAt, new Date(parseInt(createdAt)), affectedRows);       // 12
	return affectedRows;                                                                                    // 13
};                                                                                                       // 14
///////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"functions":{"sendMail.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/rocketchat_mailer/server/functions/sendMail.js                                               //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
/*globals Mailer */Mailer.sendMail = function (from, subject, body, dryrun, query) {                     // 1
	var rfcMailPatternWithName = /^(?:.*<)?([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)(?:>?)$/;
                                                                                                         //
	if (!rfcMailPatternWithName.test(from)) {                                                               // 5
		throw new Meteor.Error('error-invalid-from-address', 'Invalid from address', {                         // 6
			'function': 'Mailer.sendMail'                                                                         // 7
		});                                                                                                    // 6
	}                                                                                                       // 9
                                                                                                         //
	if (body.indexOf('[unsubscribe]') === -1) {                                                             // 10
		throw new Meteor.Error('error-missing-unsubscribe-link', 'You must provide the [unsubscribe] link.', {
			'function': 'Mailer.sendMail'                                                                         // 12
		});                                                                                                    // 11
	}                                                                                                       // 14
                                                                                                         //
	var header = RocketChat.placeholders.replace(RocketChat.settings.get('Email_Header') || '');            // 15
	var footer = RocketChat.placeholders.replace(RocketChat.settings.get('Email_Footer') || '');            // 16
	var userQuery = {                                                                                       // 18
		'mailer.unsubscribed': {                                                                               // 18
			$exists: 0                                                                                            // 18
		}                                                                                                      // 18
	};                                                                                                      // 18
                                                                                                         //
	if (query) {                                                                                            // 19
		userQuery = {                                                                                          // 20
			$and: [userQuery, EJSON.parse(query)]                                                                 // 20
		};                                                                                                     // 20
	}                                                                                                       // 21
                                                                                                         //
	if (dryrun) {                                                                                           // 23
		return Meteor.users.find({                                                                             // 24
			'emails.address': from                                                                                // 25
		}).forEach(function (user) {                                                                           // 24
			var email = undefined;                                                                                // 27
                                                                                                         //
			if (user.emails && user.emails[0] && user.emails[0].address) {                                        // 28
				email = user.emails[0].address;                                                                      // 29
			}                                                                                                     // 30
                                                                                                         //
			var html = RocketChat.placeholders.replace(body, {                                                    // 31
				unsubscribe: Meteor.absoluteUrl(FlowRouter.path('mailer/unsubscribe/:_id/:createdAt', {              // 32
					_id: user._id,                                                                                      // 33
					createdAt: user.createdAt.getTime()                                                                 // 34
				})),                                                                                                 // 32
				name: user.name,                                                                                     // 36
				email: email                                                                                         // 37
			});                                                                                                   // 31
			email = user.name + " <" + email + ">";                                                               // 39
                                                                                                         //
			if (rfcMailPatternWithName.test(email)) {                                                             // 40
				Meteor.defer(function () {                                                                           // 41
					return Email.send({                                                                                 // 42
						to: email,                                                                                         // 43
						from: from,                                                                                        // 44
						subject: subject,                                                                                  // 45
						html: header + html + footer                                                                       // 46
					});                                                                                                 // 42
				});                                                                                                  // 48
				return console.log("Sending email to " + email);                                                     // 49
			}                                                                                                     // 50
		});                                                                                                    // 51
	} else {                                                                                                // 52
		return Meteor.users.find(userQuery).forEach(function (user) {                                          // 53
			var email = undefined;                                                                                // 54
                                                                                                         //
			if (user.emails && user.emails[0] && user.emails[0].address) {                                        // 55
				email = user.emails[0].address;                                                                      // 56
			}                                                                                                     // 57
                                                                                                         //
			var html = RocketChat.placeholders.replace(body, {                                                    // 58
				unsubscribe: Meteor.absoluteUrl(FlowRouter.path('mailer/unsubscribe/:_id/:createdAt', {              // 59
					_id: user._id,                                                                                      // 60
					createdAt: user.createdAt.getTime()                                                                 // 61
				})),                                                                                                 // 59
				name: user.name,                                                                                     // 63
				email: email                                                                                         // 64
			});                                                                                                   // 58
			email = user.name + " <" + email + ">";                                                               // 66
                                                                                                         //
			if (rfcMailPatternWithName.test(email)) {                                                             // 67
				Meteor.defer(function () {                                                                           // 68
					return Email.send({                                                                                 // 69
						to: email,                                                                                         // 70
						from: from,                                                                                        // 71
						subject: subject,                                                                                  // 72
						html: header + html + footer                                                                       // 73
					});                                                                                                 // 69
				});                                                                                                  // 75
				return console.log("Sending email to " + email);                                                     // 76
			}                                                                                                     // 77
		});                                                                                                    // 78
	}                                                                                                       // 79
};                                                                                                       // 80
///////////////////////////////////////////////////////////////////////////////////////////////////////////

},"unsubscribe.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/rocketchat_mailer/server/functions/unsubscribe.js                                            //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
/* globals Mailer */Mailer.unsubscribe = function (_id, createdAt) {                                     // 1
	if (_id && createdAt) {                                                                                 // 3
		return RocketChat.models.Users.rocketMailUnsubscribe(_id, createdAt) === 1;                            // 4
	}                                                                                                       // 5
                                                                                                         //
	return false;                                                                                           // 6
};                                                                                                       // 7
///////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods":{"sendMail.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/rocketchat_mailer/server/methods/sendMail.js                                                 //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
/*globals Mailer */Meteor.methods({                                                                      // 1
	'Mailer.sendMail': function (from, subject, body, dryrun, query) {                                      // 3
		var userId = Meteor.userId();                                                                          // 4
                                                                                                         //
		if (!userId) {                                                                                         // 5
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                        // 6
				method: 'Mailer.sendMail'                                                                            // 7
			});                                                                                                   // 6
		}                                                                                                      // 9
                                                                                                         //
		if (RocketChat.authz.hasRole(userId, 'admin') !== true) {                                              // 10
			throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                          // 11
				method: 'Mailer.sendMail'                                                                            // 12
			});                                                                                                   // 11
		}                                                                                                      // 14
                                                                                                         //
		return Mailer.sendMail(from, subject, body, dryrun, query);                                            // 15
	}                                                                                                       // 16
}); //Limit setting username once per minute                                                             // 2
//DDPRateLimiter.addRule                                                                                 // 21
//	type: 'method'                                                                                        // 22
//	name: 'Mailer.sendMail'                                                                               // 23
//	connectionId: -> return true                                                                          // 24
//	, 1, 60000                                                                                            // 25
///////////////////////////////////////////////////////////////////////////////////////////////////////////

},"unsubscribe.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/rocketchat_mailer/server/methods/unsubscribe.js                                              //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
/*globals Mailer */Meteor.methods({                                                                      // 1
	'Mailer:unsubscribe': function (_id, createdAt) {                                                       // 3
		return Mailer.unsubscribe(_id, createdAt);                                                             // 4
	}                                                                                                       // 5
});                                                                                                      // 2
DDPRateLimiter.addRule({                                                                                 // 8
	type: 'method',                                                                                         // 9
	name: 'Mailer:unsubscribe',                                                                             // 10
	connectionId: function () {                                                                             // 11
		return true;                                                                                           // 12
	}                                                                                                       // 13
}, 1, 60000);                                                                                            // 8
///////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:mailer/lib/Mailer.js");
require("./node_modules/meteor/rocketchat:mailer/server/startup.js");
require("./node_modules/meteor/rocketchat:mailer/server/models/Users.js");
require("./node_modules/meteor/rocketchat:mailer/server/functions/sendMail.js");
require("./node_modules/meteor/rocketchat:mailer/server/functions/unsubscribe.js");
require("./node_modules/meteor/rocketchat:mailer/server/methods/sendMail.js");
require("./node_modules/meteor/rocketchat:mailer/server/methods/unsubscribe.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['rocketchat:mailer'] = {}, {
  Mailer: Mailer
});

})();

//# sourceMappingURL=rocketchat_mailer.js.map

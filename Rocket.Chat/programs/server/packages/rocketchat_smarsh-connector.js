(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RocketChatTabBar = Package['rocketchat:lib'].RocketChatTabBar;
var _ = Package.underscore._;
var meteorInstall = Package.modules.meteorInstall;
var process = Package.modules.process;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:smarsh-connector":{"lib":{"rocketchat.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/rocketchat_smarsh-connector/lib/rocketchat.js                                                          //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
RocketChat.smarsh = {};                                                                                            // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"settings.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/rocketchat_smarsh-connector/server/settings.js                                                         //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var moment = void 0;                                                                                               // 1
module.watch(require("moment"), {                                                                                  // 1
	"default": function (v) {                                                                                         // 1
		moment = v;                                                                                                      // 1
	}                                                                                                                 // 1
}, 0);                                                                                                             // 1
module.watch(require("moment-timezone"));                                                                          // 1
RocketChat.settings.addGroup('Smarsh', function () {                                                               // 4
	function addSettings() {                                                                                          // 4
		this.add('Smarsh_Enabled', false, {                                                                              // 5
			type: 'boolean',                                                                                                // 6
			i18nLabel: 'Smarsh_Enabled',                                                                                    // 7
			enableQuery: {                                                                                                  // 8
				_id: 'From_Email',                                                                                             // 9
				value: {                                                                                                       // 10
					$exists: 1,                                                                                                   // 11
					$ne: ''                                                                                                       // 12
				}                                                                                                              // 10
			}                                                                                                               // 8
		});                                                                                                              // 5
		this.add('Smarsh_Email', '', {                                                                                   // 16
			type: 'string',                                                                                                 // 17
			i18nLabel: 'Smarsh_Email',                                                                                      // 18
			placeholder: 'email@domain.com'                                                                                 // 19
		});                                                                                                              // 16
		this.add('Smarsh_MissingEmail_Email', 'no-email@example.com', {                                                  // 21
			type: 'string',                                                                                                 // 22
			i18nLabel: 'Smarsh_MissingEmail_Email',                                                                         // 23
			placeholder: 'no-email@example.com'                                                                             // 24
		});                                                                                                              // 21
		var zoneValues = moment.tz.names().map(function () {                                                             // 27
			function _timeZonesToSettings(name) {                                                                           // 27
				return {                                                                                                       // 28
					key: name,                                                                                                    // 29
					i18nLabel: name                                                                                               // 30
				};                                                                                                             // 28
			}                                                                                                               // 32
                                                                                                                   //
			return _timeZonesToSettings;                                                                                    // 27
		}());                                                                                                            // 27
		this.add('Smarsh_Timezone', 'America/Los_Angeles', {                                                             // 33
			type: 'select',                                                                                                 // 34
			values: zoneValues                                                                                              // 35
		});                                                                                                              // 33
		this.add('Smarsh_Interval', 'every_30_minutes', {                                                                // 38
			type: 'select',                                                                                                 // 39
			values: [{                                                                                                      // 40
				key: 'every_30_seconds',                                                                                       // 41
				i18nLabel: 'every_30_seconds'                                                                                  // 42
			}, {                                                                                                            // 40
				key: 'every_30_minutes',                                                                                       // 44
				i18nLabel: 'every_30_minutes'                                                                                  // 45
			}, {                                                                                                            // 43
				key: 'every_1_hours',                                                                                          // 47
				i18nLabel: 'every_hour'                                                                                        // 48
			}, {                                                                                                            // 46
				key: 'every_6_hours',                                                                                          // 50
				i18nLabel: 'every_six_hours'                                                                                   // 51
			}],                                                                                                             // 49
			enableQuery: {                                                                                                  // 53
				_id: 'From_Email',                                                                                             // 54
				value: {                                                                                                       // 55
					$exists: 1,                                                                                                   // 56
					$ne: ''                                                                                                       // 57
				}                                                                                                              // 55
			}                                                                                                               // 53
		});                                                                                                              // 38
	}                                                                                                                 // 61
                                                                                                                   //
	return addSettings;                                                                                               // 4
}());                                                                                                              // 4
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"models":{"SmarshHistory.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/rocketchat_smarsh-connector/server/models/SmarshHistory.js                                             //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                            //
                                                                                                                   //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                   //
                                                                                                                   //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                      //
                                                                                                                   //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                             //
                                                                                                                   //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                        //
                                                                                                                   //
var _inherits3 = _interopRequireDefault(_inherits2);                                                               //
                                                                                                                   //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                  //
                                                                                                                   //
RocketChat.smarsh.History = new (function (_RocketChat$models$_B) {                                                // 1
	(0, _inherits3.default)(_class, _RocketChat$models$_B);                                                           // 1
                                                                                                                   //
	function _class() {                                                                                               // 2
		(0, _classCallCheck3.default)(this, _class);                                                                     // 2
		return (0, _possibleConstructorReturn3.default)(this, _RocketChat$models$_B.call(this, 'smarsh_history'));       // 2
	}                                                                                                                 // 4
                                                                                                                   //
	return _class;                                                                                                    // 1
}(RocketChat.models._Base))();                                                                                     // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"functions":{"sendEmail.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/rocketchat_smarsh-connector/server/functions/sendEmail.js                                              //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
/* globals UploadFS */ //Expects the following details:                                                            // 1
// {                                                                                                               // 3
// 	body: '<table>',                                                                                               // 4
// 	subject: 'Rocket.Chat, 17 Users, 24 Messages, 1 File, 799504 Minutes, in #random',                             // 5
//  files: ['i3nc9l3mn']                                                                                           // 6
// }                                                                                                               // 7
RocketChat.smarsh.sendEmail = function (data) {                                                                    // 9
	var attachments = [];                                                                                             // 10
                                                                                                                   //
	if (data.files.length > 0) {                                                                                      // 12
		_.each(data.files, function (fileId) {                                                                           // 13
			var file = RocketChat.models.Uploads.findOneById(fileId);                                                       // 14
                                                                                                                   //
			if (file.store === 'rocketchat_uploads' || file.store === 'fileSystem') {                                       // 15
				var rs = UploadFS.getStore(file.store).getReadStream(fileId, file);                                            // 16
				attachments.push({                                                                                             // 17
					filename: file.name,                                                                                          // 18
					streamSource: rs                                                                                              // 19
				});                                                                                                            // 17
			}                                                                                                               // 21
		});                                                                                                              // 22
	}                                                                                                                 // 23
                                                                                                                   //
	Email.send({                                                                                                      // 25
		to: RocketChat.settings.get('Smarsh_Email'),                                                                     // 26
		from: RocketChat.settings.get('From_Email'),                                                                     // 27
		subject: data.subject,                                                                                           // 28
		html: data.body,                                                                                                 // 29
		attachments: attachments                                                                                         // 30
	});                                                                                                               // 25
};                                                                                                                 // 32
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"generateEml.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/rocketchat_smarsh-connector/server/functions/generateEml.js                                            //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var moment = void 0;                                                                                               // 1
module.watch(require("moment"), {                                                                                  // 1
	"default": function (v) {                                                                                         // 1
		moment = v;                                                                                                      // 1
	}                                                                                                                 // 1
}, 0);                                                                                                             // 1
module.watch(require("moment-timezone"));                                                                          // 1
var start = '<table style="width: 100%; border: 1px solid; border-collapse: collapse; table-layout: fixed; margin-top: 10px; font-size: 12px; word-break: break-word;"><tbody>';
var end = '</tbody></table>';                                                                                      // 5
var opentr = '<tr style="border: 1px solid;">';                                                                    // 6
var closetr = '</tr>';                                                                                             // 7
var open20td = '<td style="border: 1px solid; text-align: center; width: 20%;">';                                  // 8
var open60td = '<td style="border: 1px solid; text-align: left; width: 60%; padding: 0 5px;">';                    // 9
var closetd = '</td>';                                                                                             // 10
                                                                                                                   //
function _getLink(attachment) {                                                                                    // 12
	var url = attachment.title_link.replace(/ /g, '%20');                                                             // 13
                                                                                                                   //
	if (Meteor.settings.public.sandstorm || url.match(/^(https?:)?\/\//i)) {                                          // 15
		return url;                                                                                                      // 16
	} else {                                                                                                          // 17
		return Meteor.absoluteUrl().replace(/\/$/, '') + __meteor_runtime_config__.ROOT_URL_PATH_PREFIX + url;           // 18
	}                                                                                                                 // 19
}                                                                                                                  // 20
                                                                                                                   //
RocketChat.smarsh.generateEml = function () {                                                                      // 22
	Meteor.defer(function () {                                                                                        // 23
		var smarshMissingEmail = RocketChat.settings.get('Smarsh_MissingEmail_Email');                                   // 24
		var timeZone = RocketChat.settings.get('Smarsh_Timezone');                                                       // 25
		RocketChat.models.Rooms.find().forEach(function (room) {                                                         // 27
			var smarshHistory = RocketChat.smarsh.History.findOne({                                                         // 28
				_id: room._id                                                                                                  // 28
			});                                                                                                             // 28
			var query = {                                                                                                   // 29
				rid: room._id                                                                                                  // 29
			};                                                                                                              // 29
                                                                                                                   //
			if (smarshHistory) {                                                                                            // 31
				query.ts = {                                                                                                   // 32
					$gt: smarshHistory.lastRan                                                                                    // 32
				};                                                                                                             // 32
			}                                                                                                               // 33
                                                                                                                   //
			var date = new Date();                                                                                          // 35
			var rows = [];                                                                                                  // 36
			var data = {                                                                                                    // 37
				users: [],                                                                                                     // 38
				msgs: 0,                                                                                                       // 39
				files: [],                                                                                                     // 40
				time: smarshHistory ? moment(date).diff(moment(smarshHistory.lastRan), 'minutes') : moment(date).diff(moment(room.ts), 'minutes'),
				room: room.name ? "#" + room.name : "Direct Message Between: " + room.usernames.join(' & ')                    // 42
			};                                                                                                              // 37
			RocketChat.models.Messages.find(query).forEach(function (message) {                                             // 45
				rows.push(opentr); //The timestamp                                                                             // 46
                                                                                                                   //
				rows.push(open20td);                                                                                           // 49
				rows.push(moment(message.ts).tz(timeZone).format('YYYY-MM-DD HH-mm-ss z'));                                    // 50
				rows.push(closetd); //The sender                                                                               // 51
                                                                                                                   //
				rows.push(open20td);                                                                                           // 54
				var sender = RocketChat.models.Users.findOne({                                                                 // 55
					_id: message.u._id                                                                                            // 55
				});                                                                                                            // 55
                                                                                                                   //
				if (data.users.indexOf(sender._id) === -1) {                                                                   // 56
					data.users.push(sender._id);                                                                                  // 57
				} //Get the user's email, can be nothing if it is an unconfigured bot account (like rocket.cat)                // 58
                                                                                                                   //
                                                                                                                   //
				if (sender.emails && sender.emails[0] && sender.emails[0].address) {                                           // 61
					rows.push(sender.name + " &lt;" + sender.emails[0].address + "&gt;");                                         // 62
				} else {                                                                                                       // 63
					rows.push(sender.name + " &lt;" + smarshMissingEmail + "&gt;");                                               // 64
				}                                                                                                              // 65
                                                                                                                   //
				rows.push(closetd); //The message                                                                              // 66
                                                                                                                   //
				rows.push(open60td);                                                                                           // 69
				data.msgs++;                                                                                                   // 70
                                                                                                                   //
				if (message.t) {                                                                                               // 71
					var messageType = RocketChat.MessageTypes.getType(message);                                                   // 72
                                                                                                                   //
					if (messageType) {                                                                                            // 73
						rows.push(TAPi18n.__(messageType.message, messageType.data ? messageType.data(message) : '', 'en'));         // 74
					} else {                                                                                                      // 75
						rows.push(message.msg + " (" + message.t + ")");                                                             // 76
					}                                                                                                             // 77
				} else if (message.file) {                                                                                     // 78
					data.files.push(message.file._id);                                                                            // 79
					rows.push(message.attachments[0].title + " (" + _getLink(message.attachments[0]) + ")");                      // 80
				} else if (message.attachments) {                                                                              // 81
					var attaches = [];                                                                                            // 82
                                                                                                                   //
					_.each(message.attachments, function () {                                                                     // 83
						function _loopThroughMessageAttachments(a) {                                                                 // 83
							if (a.image_url) {                                                                                          // 84
								attaches.push(a.image_url);                                                                                // 85
							} //TODO: Verify other type of attachments which need to be handled that aren't file uploads and image urls
							// } else {                                                                                                 // 88
							// 	console.log(a);                                                                                         // 89
							// }                                                                                                        // 90
                                                                                                                   //
						}                                                                                                            // 91
                                                                                                                   //
						return _loopThroughMessageAttachments;                                                                       // 83
					}());                                                                                                         // 83
                                                                                                                   //
					rows.push(message.msg + " (" + attaches.join(', ') + ")");                                                    // 93
				} else {                                                                                                       // 94
					rows.push(message.msg);                                                                                       // 95
				}                                                                                                              // 96
                                                                                                                   //
				rows.push(closetd);                                                                                            // 97
				rows.push(closetr);                                                                                            // 99
			});                                                                                                             // 100
                                                                                                                   //
			if (rows.length !== 0) {                                                                                        // 102
				var result = start + rows.join('') + end;                                                                      // 103
				RocketChat.smarsh.History.upsert({                                                                             // 105
					_id: room._id                                                                                                 // 105
				}, {                                                                                                           // 105
					_id: room._id,                                                                                                // 106
					lastRan: date,                                                                                                // 107
					lastResult: result                                                                                            // 108
				});                                                                                                            // 105
				RocketChat.smarsh.sendEmail({                                                                                  // 111
					body: result,                                                                                                 // 112
					subject: "Rocket.Chat, " + data.users.length + " Users, " + data.msgs + " Messages, " + data.files.length + " Files, " + data.time + " Minutes, in " + data.room,
					files: data.files                                                                                             // 114
				});                                                                                                            // 111
			}                                                                                                               // 116
		});                                                                                                              // 117
	});                                                                                                               // 118
};                                                                                                                 // 119
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"startup.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/rocketchat_smarsh-connector/server/startup.js                                                          //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
/* globals SyncedCron */var smarshJobName = 'Smarsh EML Connector';                                                // 1
                                                                                                                   //
var _addSmarshSyncedCronJob = _.debounce(Meteor.bindEnvironment(function () {                                      // 4
	function __addSmarshSyncedCronJobDebounced() {                                                                    // 4
		if (SyncedCron.nextScheduledAtDate(smarshJobName)) {                                                             // 5
			SyncedCron.remove(smarshJobName);                                                                               // 6
		}                                                                                                                // 7
                                                                                                                   //
		if (RocketChat.settings.get('Smarsh_Enabled') && RocketChat.settings.get('Smarsh_Email') !== '' && RocketChat.settings.get('From_Email') !== '') {
			SyncedCron.add({                                                                                                // 10
				name: smarshJobName,                                                                                           // 11
				schedule: function (parser) {                                                                                  // 12
					return parser.text(RocketChat.settings.get('Smarsh_Interval').replace(/_/g, ' '));                            // 12
				},                                                                                                             // 12
				job: RocketChat.smarsh.generateEml                                                                             // 13
			});                                                                                                             // 10
		}                                                                                                                // 15
	}                                                                                                                 // 16
                                                                                                                   //
	return __addSmarshSyncedCronJobDebounced;                                                                         // 4
}()), 500);                                                                                                        // 4
                                                                                                                   //
Meteor.startup(function () {                                                                                       // 18
	Meteor.defer(function () {                                                                                        // 19
		_addSmarshSyncedCronJob();                                                                                       // 20
                                                                                                                   //
		RocketChat.settings.get('Smarsh_Interval', _addSmarshSyncedCronJob);                                             // 22
		RocketChat.settings.get('Smarsh_Enabled', _addSmarshSyncedCronJob);                                              // 23
		RocketChat.settings.get('Smarsh_Email', _addSmarshSyncedCronJob);                                                // 24
		RocketChat.settings.get('From_Email', _addSmarshSyncedCronJob);                                                  // 25
	});                                                                                                               // 26
});                                                                                                                // 27
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:smarsh-connector/lib/rocketchat.js");
require("./node_modules/meteor/rocketchat:smarsh-connector/server/settings.js");
require("./node_modules/meteor/rocketchat:smarsh-connector/server/models/SmarshHistory.js");
require("./node_modules/meteor/rocketchat:smarsh-connector/server/functions/sendEmail.js");
require("./node_modules/meteor/rocketchat:smarsh-connector/server/functions/generateEml.js");
require("./node_modules/meteor/rocketchat:smarsh-connector/server/startup.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:smarsh-connector'] = {};

})();

//# sourceMappingURL=rocketchat_smarsh-connector.js.map

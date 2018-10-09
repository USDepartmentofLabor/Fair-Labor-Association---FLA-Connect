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
var meteorInstall = Package.modules.meteorInstall;
var process = Package.modules.process;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:statistics":{"lib":{"rocketchat.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_statistics/lib/rocketchat.js                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
RocketChat.statistics = {};                                                                                           // 1
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"models":{"Statistics.js":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_statistics/server/models/Statistics.js                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                               //
                                                                                                                      //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                      //
                                                                                                                      //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                         //
                                                                                                                      //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                                //
                                                                                                                      //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                           //
                                                                                                                      //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                  //
                                                                                                                      //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                     //
                                                                                                                      //
RocketChat.models.Statistics = new (function (_RocketChat$models$_B) {                                                // 1
	(0, _inherits3.default)(_class, _RocketChat$models$_B);                                                              // 1
                                                                                                                      //
	function _class() {                                                                                                  // 2
		(0, _classCallCheck3.default)(this, _class);                                                                        // 2
                                                                                                                      //
		var _this = (0, _possibleConstructorReturn3.default)(this, _RocketChat$models$_B.call(this, 'statistics'));         // 2
                                                                                                                      //
		_this.tryEnsureIndex({                                                                                              // 5
			'createdAt': 1                                                                                                     // 5
		});                                                                                                                 // 5
                                                                                                                      //
		return _this;                                                                                                       // 2
	} // FIND ONE                                                                                                        // 6
                                                                                                                      //
                                                                                                                      //
	_class.prototype.findOneById = function () {                                                                         // 1
		function findOneById(_id, options) {                                                                                // 1
			var query = {                                                                                                      // 10
				_id: _id                                                                                                          // 10
			};                                                                                                                 // 10
			return this.findOne(query, options);                                                                               // 11
		}                                                                                                                   // 12
                                                                                                                      //
		return findOneById;                                                                                                 // 1
	}();                                                                                                                 // 1
                                                                                                                      //
	_class.prototype.findLast = function () {                                                                            // 1
		function findLast() {                                                                                               // 1
			var options = {                                                                                                    // 15
				sort: {                                                                                                           // 16
					createdAt: -1                                                                                                    // 17
				},                                                                                                                // 16
				limit: 1                                                                                                          // 19
			};                                                                                                                 // 15
			var records = this.find({}, options).fetch();                                                                      // 21
			return records && records[0];                                                                                      // 22
		}                                                                                                                   // 23
                                                                                                                      //
		return findLast;                                                                                                    // 1
	}();                                                                                                                 // 1
                                                                                                                      //
	return _class;                                                                                                       // 1
}(RocketChat.models._Base))();                                                                                        // 1
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"functions":{"get.js":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_statistics/server/functions/get.js                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* global InstanceStatus, MongoInternals */RocketChat.statistics.get = function () {                                  // 1
	function _getStatistics() {                                                                                          // 2
		var statistics = {}; // Version                                                                                     // 3
                                                                                                                      //
		statistics.uniqueId = RocketChat.settings.get('uniqueID');                                                          // 6
                                                                                                                      //
		if (RocketChat.models.Settings.findOne('uniqueID')) {                                                               // 7
			statistics.installedAt = RocketChat.models.Settings.findOne('uniqueID').createdAt;                                 // 8
		}                                                                                                                   // 9
                                                                                                                      //
		if (RocketChat.Info) {                                                                                              // 11
			statistics.version = RocketChat.Info.version;                                                                      // 12
			statistics.tag = RocketChat.Info.tag;                                                                              // 13
			statistics.branch = RocketChat.Info.branch;                                                                        // 14
		} // User statistics                                                                                                // 15
                                                                                                                      //
                                                                                                                      //
		statistics.totalUsers = Meteor.users.find().count();                                                                // 18
		statistics.activeUsers = Meteor.users.find({                                                                        // 19
			active: true                                                                                                       // 19
		}).count();                                                                                                         // 19
		statistics.nonActiveUsers = statistics.totalUsers - statistics.activeUsers;                                         // 20
		statistics.onlineUsers = Meteor.users.find({                                                                        // 21
			statusConnection: 'online'                                                                                         // 21
		}).count();                                                                                                         // 21
		statistics.awayUsers = Meteor.users.find({                                                                          // 22
			statusConnection: 'away'                                                                                           // 22
		}).count();                                                                                                         // 22
		statistics.offlineUsers = statistics.totalUsers - statistics.onlineUsers - statistics.awayUsers; // Room statistics
                                                                                                                      //
		statistics.totalRooms = RocketChat.models.Rooms.find().count();                                                     // 26
		statistics.totalChannels = RocketChat.models.Rooms.findByType('c').count();                                         // 27
		statistics.totalPrivateGroups = RocketChat.models.Rooms.findByType('p').count();                                    // 28
		statistics.totalDirect = RocketChat.models.Rooms.findByType('d').count();                                           // 29
		statistics.totlalLivechat = RocketChat.models.Rooms.findByType('l').count(); // Message statistics                  // 30
                                                                                                                      //
		statistics.totalMessages = RocketChat.models.Messages.find().count();                                               // 33
		statistics.totalChannelMessages = _.reduce(RocketChat.models.Rooms.findByType('c', {                                // 34
			fields: {                                                                                                          // 34
				'msgs': 1                                                                                                         // 34
			}                                                                                                                  // 34
		}).fetch(), function () {                                                                                           // 34
			function _countChannelMessages(num, room) {                                                                        // 34
				return num + room.msgs;                                                                                           // 34
			}                                                                                                                  // 34
                                                                                                                      //
			return _countChannelMessages;                                                                                      // 34
		}(), 0);                                                                                                            // 34
		statistics.totalPrivateGroupMessages = _.reduce(RocketChat.models.Rooms.findByType('p', {                           // 35
			fields: {                                                                                                          // 35
				'msgs': 1                                                                                                         // 35
			}                                                                                                                  // 35
		}).fetch(), function () {                                                                                           // 35
			function _countPrivateGroupMessages(num, room) {                                                                   // 35
				return num + room.msgs;                                                                                           // 35
			}                                                                                                                  // 35
                                                                                                                      //
			return _countPrivateGroupMessages;                                                                                 // 35
		}(), 0);                                                                                                            // 35
		statistics.totalDirectMessages = _.reduce(RocketChat.models.Rooms.findByType('d', {                                 // 36
			fields: {                                                                                                          // 36
				'msgs': 1                                                                                                         // 36
			}                                                                                                                  // 36
		}).fetch(), function () {                                                                                           // 36
			function _countDirectMessages(num, room) {                                                                         // 36
				return num + room.msgs;                                                                                           // 36
			}                                                                                                                  // 36
                                                                                                                      //
			return _countDirectMessages;                                                                                       // 36
		}(), 0);                                                                                                            // 36
		statistics.totalLivechatMessages = _.reduce(RocketChat.models.Rooms.findByType('l', {                               // 37
			fields: {                                                                                                          // 37
				'msgs': 1                                                                                                         // 37
			}                                                                                                                  // 37
		}).fetch(), function () {                                                                                           // 37
			function _countLivechatMessages(num, room) {                                                                       // 37
				return num + room.msgs;                                                                                           // 37
			}                                                                                                                  // 37
                                                                                                                      //
			return _countLivechatMessages;                                                                                     // 37
		}(), 0);                                                                                                            // 37
		statistics.lastLogin = RocketChat.models.Users.getLastLogin();                                                      // 39
		statistics.lastMessageSentAt = RocketChat.models.Messages.getLastTimestamp();                                       // 40
		statistics.lastSeenSubscription = RocketChat.models.Subscriptions.getLastSeen();                                    // 41
                                                                                                                      //
		var os = Npm.require('os');                                                                                         // 43
                                                                                                                      //
		statistics.os = {                                                                                                   // 44
			type: os.type(),                                                                                                   // 45
			platform: os.platform(),                                                                                           // 46
			arch: os.arch(),                                                                                                   // 47
			release: os.release(),                                                                                             // 48
			uptime: os.uptime(),                                                                                               // 49
			loadavg: os.loadavg(),                                                                                             // 50
			totalmem: os.totalmem(),                                                                                           // 51
			freemem: os.freemem(),                                                                                             // 52
			cpus: os.cpus()                                                                                                    // 53
		};                                                                                                                  // 44
		statistics.process = {                                                                                              // 56
			nodeVersion: process.version,                                                                                      // 57
			pid: process.pid,                                                                                                  // 58
			uptime: process.uptime()                                                                                           // 59
		};                                                                                                                  // 56
		statistics.deploy = {                                                                                               // 62
			method: process.env.DEPLOY_METHOD || 'tar',                                                                        // 63
			platform: process.env.DEPLOY_PLATFORM || 'selfinstall'                                                             // 64
		};                                                                                                                  // 62
		statistics.migration = RocketChat.Migrations._getControl();                                                         // 67
		statistics.instanceCount = InstanceStatus.getCollection().find({                                                    // 68
			_updatedAt: {                                                                                                      // 68
				$gt: new Date(Date.now() - process.uptime() * 1000 - 2000)                                                        // 68
			}                                                                                                                  // 68
		}).count();                                                                                                         // 68
                                                                                                                      //
		if (MongoInternals.defaultRemoteCollectionDriver().mongo._oplogHandle && MongoInternals.defaultRemoteCollectionDriver().mongo._oplogHandle.onOplogEntry && RocketChat.settings.get('Force_Disable_OpLog_For_Cache') !== true) {
			statistics.oplogEnabled = true;                                                                                    // 71
		}                                                                                                                   // 72
                                                                                                                      //
		return statistics;                                                                                                  // 74
	}                                                                                                                    // 75
                                                                                                                      //
	return _getStatistics;                                                                                               // 2
}();                                                                                                                  // 2
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"save.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_statistics/server/functions/save.js                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
RocketChat.statistics.save = function () {                                                                            // 1
	var statistics = RocketChat.statistics.get();                                                                        // 2
	statistics.createdAt = new Date();                                                                                   // 3
	RocketChat.models.Statistics.insert(statistics);                                                                     // 4
	return statistics;                                                                                                   // 5
};                                                                                                                    // 6
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods":{"getStatistics.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_statistics/server/methods/getStatistics.js                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.methods({                                                                                                      // 1
	getStatistics: function (refresh) {                                                                                  // 2
		if (!Meteor.userId()) {                                                                                             // 3
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                     // 4
				method: 'getStatistics'                                                                                           // 4
			});                                                                                                                // 4
		}                                                                                                                   // 5
                                                                                                                      //
		if (RocketChat.authz.hasPermission(Meteor.userId(), 'view-statistics') !== true) {                                  // 7
			throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                       // 8
				method: 'getStatistics'                                                                                           // 8
			});                                                                                                                // 8
		}                                                                                                                   // 9
                                                                                                                      //
		if (refresh) {                                                                                                      // 11
			return RocketChat.statistics.save();                                                                               // 12
		} else {                                                                                                            // 13
			return RocketChat.models.Statistics.findLast();                                                                    // 14
		}                                                                                                                   // 15
	}                                                                                                                    // 16
});                                                                                                                   // 1
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:statistics/lib/rocketchat.js");
require("./node_modules/meteor/rocketchat:statistics/server/models/Statistics.js");
require("./node_modules/meteor/rocketchat:statistics/server/functions/get.js");
require("./node_modules/meteor/rocketchat:statistics/server/functions/save.js");
require("./node_modules/meteor/rocketchat:statistics/server/methods/getStatistics.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:statistics'] = {};

})();

//# sourceMappingURL=rocketchat_statistics.js.map

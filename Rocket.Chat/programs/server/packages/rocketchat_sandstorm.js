(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RocketChatTabBar = Package['rocketchat:lib'].RocketChatTabBar;
var FlowRouter = Package['kadira:flow-router'].FlowRouter;
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
var getHttpBridge, waitPromise;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:sandstorm":{"server":{"lib.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_sandstorm/server/lib.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals getHttpBridge, waitPromise, UploadFS */ /* exported getHttpBridge, waitPromise */RocketChat.Sandstorm = {};
                                                                                                                       //
if (process.env.SANDSTORM === '1') {                                                                                   // 6
	var Future = Npm.require('fibers/future');                                                                            // 7
                                                                                                                       //
	var Capnp = Npm.require('capnp');                                                                                     // 8
                                                                                                                       //
	var SandstormHttpBridge = Npm.require('sandstorm/sandstorm-http-bridge.capnp').SandstormHttpBridge;                   // 9
                                                                                                                       //
	var capnpConnection = null;                                                                                           // 11
	var httpBridge = null;                                                                                                // 12
                                                                                                                       //
	getHttpBridge = function () {                                                                                         // 14
		if (!httpBridge) {                                                                                                   // 15
			capnpConnection = Capnp.connect('unix:/tmp/sandstorm-api');                                                         // 16
			httpBridge = capnpConnection.restore(null, SandstormHttpBridge);                                                    // 17
		}                                                                                                                    // 18
                                                                                                                       //
		return httpBridge;                                                                                                   // 19
	};                                                                                                                    // 20
                                                                                                                       //
	var promiseToFuture = function (promise) {                                                                            // 22
		var result = new Future();                                                                                           // 23
		promise.then(result.return.bind(result), result.throw.bind(result));                                                 // 24
		return result;                                                                                                       // 25
	};                                                                                                                    // 26
                                                                                                                       //
	waitPromise = function (promise) {                                                                                    // 28
		return promiseToFuture(promise).wait();                                                                              // 29
	}; // This usual implementation of this method returns an absolute URL that is invalid                                // 30
	// under Sandstorm.                                                                                                   // 33
                                                                                                                       //
                                                                                                                       //
	UploadFS.Store.prototype.getURL = function (path) {                                                                   // 34
		return this.getRelativeURL(path);                                                                                    // 35
	};                                                                                                                    // 36
}                                                                                                                      // 37
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"events.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_sandstorm/server/events.js                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals getHttpBridge, waitPromise */RocketChat.Sandstorm.notify = function () {};                                  // 1
                                                                                                                       //
if (process.env.SANDSTORM === '1') {                                                                                   // 5
	var ACTIVITY_TYPES = {                                                                                                // 6
		'message': 0,                                                                                                        // 7
		'privateMessage': 1                                                                                                  // 8
	};                                                                                                                    // 6
                                                                                                                       //
	RocketChat.Sandstorm.notify = function (message, userIds, caption, type) {                                            // 11
		var sessionId = message.sandstormSessionId;                                                                          // 12
                                                                                                                       //
		if (!sessionId) {                                                                                                    // 13
			return;                                                                                                             // 14
		}                                                                                                                    // 15
                                                                                                                       //
		var httpBridge = getHttpBridge();                                                                                    // 16
		var activity = {};                                                                                                   // 17
                                                                                                                       //
		if (type) {                                                                                                          // 19
			activity.type = ACTIVITY_TYPES[type];                                                                               // 20
		}                                                                                                                    // 21
                                                                                                                       //
		if (caption) {                                                                                                       // 23
			activity.notification = {                                                                                           // 24
				caption: {                                                                                                         // 24
					defaultText: caption                                                                                              // 24
				}                                                                                                                  // 24
			};                                                                                                                  // 24
		}                                                                                                                    // 25
                                                                                                                       //
		if (userIds) {                                                                                                       // 27
			activity.users = _.map(userIds, function (userId) {                                                                 // 28
				var user = Meteor.users.findOne({                                                                                  // 29
					_id: userId                                                                                                       // 29
				}, {                                                                                                               // 29
					fields: {                                                                                                         // 29
						'services.sandstorm.id': 1                                                                                       // 29
					}                                                                                                                 // 29
				});                                                                                                                // 29
				return {                                                                                                           // 30
					identity: waitPromise(httpBridge.getSavedIdentity(user.services.sandstorm.id)).identity,                          // 31
					mentioned: true                                                                                                   // 32
				};                                                                                                                 // 30
			});                                                                                                                 // 34
		}                                                                                                                    // 35
                                                                                                                       //
		return waitPromise(httpBridge.getSessionContext(sessionId).context.activity(activity));                              // 37
	};                                                                                                                    // 38
}                                                                                                                      // 39
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"powerbox.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_sandstorm/server/powerbox.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals getHttpBridge, waitPromise */RocketChat.Sandstorm.offerUiView = function () {};                             // 1
                                                                                                                       //
if (process.env.SANDSTORM === '1') {                                                                                   // 5
	var Capnp = Npm.require('capnp');                                                                                     // 6
                                                                                                                       //
	var Powerbox = Npm.require('sandstorm/powerbox.capnp');                                                               // 7
                                                                                                                       //
	var Grain = Npm.require('sandstorm/grain.capnp');                                                                     // 8
                                                                                                                       //
	RocketChat.Sandstorm.offerUiView = function (token, serializedDescriptor, sessionId) {                                // 10
		var httpBridge = getHttpBridge();                                                                                    // 11
		var session = httpBridge.getSessionContext(sessionId).context;                                                       // 12
		var api = httpBridge.getSandstormApi(sessionId).api;                                                                 // 13
		var cap = waitPromise(api.restore(new Buffer(token, 'base64'))).cap;                                                 // 14
		return waitPromise(session.offer(cap, undefined, {                                                                   // 15
			tags: [{                                                                                                            // 15
				id: '15831515641881813735',                                                                                        // 16
				value: new Buffer(serializedDescriptor, 'base64')                                                                  // 17
			}]                                                                                                                  // 15
		}));                                                                                                                 // 15
	};                                                                                                                    // 19
                                                                                                                       //
	Meteor.methods({                                                                                                      // 21
		sandstormClaimRequest: function (token, serializedDescriptor) {                                                      // 22
			var descriptor = Capnp.parsePacked(Powerbox.PowerboxDescriptor, new Buffer(serializedDescriptor, 'base64'));        // 23
			var grainTitle = Capnp.parse(Grain.UiView.PowerboxTag, descriptor.tags[0].value).title;                             // 24
			var sessionId = this.connection.sandstormSessionId();                                                               // 25
			var httpBridge = getHttpBridge();                                                                                   // 26
			var session = httpBridge.getSessionContext(sessionId).context;                                                      // 27
			var cap = waitPromise(session.claimRequest(token)).cap.castAs(Grain.UiView);                                        // 28
			var api = httpBridge.getSandstormApi(sessionId).api;                                                                // 29
			var newToken = waitPromise(api.save(cap)).token.toString('base64');                                                 // 30
			var viewInfo = waitPromise(cap.getViewInfo());                                                                      // 31
			var appTitle = viewInfo.appTitle;                                                                                   // 32
			var asset = waitPromise(viewInfo.grainIcon.getUrl());                                                               // 33
			var appIconUrl = asset.protocol + "://" + asset.hostPath;                                                           // 34
			return {                                                                                                            // 35
				token: newToken,                                                                                                   // 36
				appTitle: appTitle,                                                                                                // 37
				appIconUrl: appIconUrl,                                                                                            // 38
				grainTitle: grainTitle,                                                                                            // 39
				descriptor: descriptor.tags[0].value.toString('base64')                                                            // 40
			};                                                                                                                  // 35
		},                                                                                                                   // 42
		sandstormOffer: function (token, serializedDescriptor) {                                                             // 43
			RocketChat.Sandstorm.offerUiView(token, serializedDescriptor, this.connection.sandstormSessionId());                // 44
		}                                                                                                                    // 46
	});                                                                                                                   // 21
}                                                                                                                      // 48
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:sandstorm/server/lib.js");
require("./node_modules/meteor/rocketchat:sandstorm/server/events.js");
require("./node_modules/meteor/rocketchat:sandstorm/server/powerbox.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:sandstorm'] = {};

})();

//# sourceMappingURL=rocketchat_sandstorm.js.map

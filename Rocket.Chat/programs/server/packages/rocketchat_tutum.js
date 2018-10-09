(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:tutum":{"startup.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/rocketchat_tutum/startup.js                                                                //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
/* Examples                                                                                            // 1
                                                                                                       //
DOCKERCLOUD_REDIS_HOST=redis://:password@host:6379                                                     //
DOCKERCLOUD_CLIENT_NAME=mywebsite                                                                      //
DOCKERCLOUD_CLIENT_HOST=mywebsite.dotcloud.com                                                         //
*/if (process.env.DOCKERCLOUD_REDIS_HOST != null) {                                                    //
	var redis = Npm.require('redis');                                                                     // 9
                                                                                                       //
	var client = redis.createClient(process.env.DOCKERCLOUD_REDIS_HOST);                                  // 11
	client.on('error', function (err) {                                                                   // 13
		return console.log('Redis error ->', err);                                                           // 13
	});                                                                                                   // 13
	client.del("frontend:" + process.env.DOCKERCLOUD_CLIENT_HOST);                                        // 15
	client.rpush("frontend:" + process.env.DOCKERCLOUD_CLIENT_HOST, process.env.DOCKERCLOUD_CLIENT_NAME);
	var port = process.env.PORT || 3000;                                                                  // 18
	client.rpush("frontend:" + process.env.DOCKERCLOUD_CLIENT_HOST, "http://" + process.env.DOCKERCLOUD_IP_ADDRESS.split('/')[0] + ":" + port); // removes the redis entry in 90 seconds on a SIGTERM
                                                                                                       //
	process.on('SIGTERM', function () {                                                                   // 22
		return client.expire("frontend:" + process.env.DOCKERCLOUD_CLIENT_HOST, 90);                         // 22
	});                                                                                                   // 22
	process.on('SIGINT', function () {                                                                    // 24
		return client.expire("frontend:" + process.env.DOCKERCLOUD_CLIENT_HOST, 90);                         // 24
	});                                                                                                   // 24
}                                                                                                      // 25
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:tutum/startup.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:tutum'] = {};

})();

//# sourceMappingURL=rocketchat_tutum.js.map

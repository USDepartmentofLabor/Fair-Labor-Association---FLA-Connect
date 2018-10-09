(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var ECMAScript = Package.ecmascript.ECMAScript;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RocketChatTabBar = Package['rocketchat:lib'].RocketChatTabBar;
var OAuth2Server = Package['rocketchat:oauth2-server'].OAuth2Server;
var meteorInstall = Package.modules.meteorInstall;
var process = Package.modules.process;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:oauth2-server-config":{"server":{"models":{"OAuthApps.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_oauth2-server-config/server/models/OAuthApps.js                                     //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                    //
                                                                                                           //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                           //
                                                                                                           //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");              //
                                                                                                           //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                     //
                                                                                                           //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                //
                                                                                                           //
var _inherits3 = _interopRequireDefault(_inherits2);                                                       //
                                                                                                           //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }          //
                                                                                                           //
RocketChat.models.OAuthApps = new (function (_RocketChat$models$_B) {                                      // 1
	(0, _inherits3.default)(_class, _RocketChat$models$_B);                                                   // 1
                                                                                                           //
	function _class() {                                                                                       // 2
		(0, _classCallCheck3.default)(this, _class);                                                             // 2
		return (0, _possibleConstructorReturn3.default)(this, _RocketChat$models$_B.call(this, 'oauth_apps'));   // 2
	}                                                                                                         // 4
                                                                                                           //
	return _class;                                                                                            // 1
}(RocketChat.models._Base))(); // FIND                                                                     // 1
// findByRole: (role, options) ->                                                                          // 11
// 	query =                                                                                                // 12
// 	roles: role                                                                                            // 13
// 	return @find query, options                                                                            // 15
// CREATE                                                                                                  // 17
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"oauth":{"server":{"oauth2-server.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_oauth2-server-config/oauth/server/oauth2-server.js                                  //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
/*global OAuth2Server */var oauth2server = new OAuth2Server({                                              // 1
	accessTokensCollectionName: 'rocketchat_oauth_access_tokens',                                             // 4
	refreshTokensCollectionName: 'rocketchat_oauth_refresh_tokens',                                           // 5
	authCodesCollectionName: 'rocketchat_oauth_auth_codes',                                                   // 6
	clientsCollection: RocketChat.models.OAuthApps.model,                                                     // 7
	debug: true                                                                                               // 8
});                                                                                                        // 3
WebApp.connectHandlers.use(oauth2server.app);                                                              // 11
oauth2server.routes.get('/oauth/userinfo', function (req, res) {                                           // 13
	if (req.headers.authorization == null) {                                                                  // 14
		return res.sendStatus(401).send('No token');                                                             // 15
	}                                                                                                         // 16
                                                                                                           //
	var accessToken = req.headers.authorization.replace('Bearer ', '');                                       // 17
	var token = oauth2server.oauth.model.AccessTokens.findOne({                                               // 18
		accessToken: accessToken                                                                                 // 19
	});                                                                                                       // 18
                                                                                                           //
	if (token == null) {                                                                                      // 21
		return res.sendStatus(401).send('Invalid Token');                                                        // 22
	}                                                                                                         // 23
                                                                                                           //
	var user = RocketChat.models.Users.findOneById(token.userId);                                             // 24
                                                                                                           //
	if (user == null) {                                                                                       // 25
		return res.sendStatus(401).send('Invalid Token');                                                        // 26
	}                                                                                                         // 27
                                                                                                           //
	return res.send({                                                                                         // 28
		sub: user._id,                                                                                           // 29
		name: user.name,                                                                                         // 30
		email: user.emails[0].address,                                                                           // 31
		email_verified: user.emails[0].verified,                                                                 // 32
		department: '',                                                                                          // 33
		birthdate: '',                                                                                           // 34
		preffered_username: user.username,                                                                       // 35
		updated_at: user._updatedAt,                                                                             // 36
		picture: Meteor.absoluteUrl() + "avatar/" + user.username                                                // 37
	});                                                                                                       // 28
});                                                                                                        // 39
Meteor.publish('oauthClient', function (clientId) {                                                        // 41
	if (!this.userId) {                                                                                       // 42
		return this.ready();                                                                                     // 43
	}                                                                                                         // 44
                                                                                                           //
	return RocketChat.models.OAuthApps.find({                                                                 // 45
		clientId: clientId,                                                                                      // 46
		active: true                                                                                             // 47
	}, {                                                                                                      // 45
		fields: {                                                                                                // 49
			name: 1                                                                                                 // 50
		}                                                                                                        // 49
	});                                                                                                       // 48
});                                                                                                        // 53
RocketChat.API.v1.addAuthMethod(function () {                                                              // 55
	var headerToken = this.request.headers['authorization'];                                                  // 56
	var getToken = this.request.query.access_token;                                                           // 57
                                                                                                           //
	if (headerToken != null) {                                                                                // 58
		var matches = headerToken.match(/Bearer\s(\S+)/);                                                        // 59
                                                                                                           //
		if (matches) {                                                                                           // 60
			headerToken = matches[1];                                                                               // 61
		} else {                                                                                                 // 62
			headerToken = undefined;                                                                                // 63
		}                                                                                                        // 64
	}                                                                                                         // 65
                                                                                                           //
	var bearerToken = headerToken || getToken;                                                                // 66
                                                                                                           //
	if (bearerToken == null) {                                                                                // 67
		return;                                                                                                  // 68
	}                                                                                                         // 69
                                                                                                           //
	var getAccessToken = Meteor.wrapAsync(oauth2server.oauth.model.getAccessToken, oauth2server.oauth.model);
	var accessToken = getAccessToken(bearerToken);                                                            // 71
                                                                                                           //
	if (accessToken == null) {                                                                                // 72
		return;                                                                                                  // 73
	}                                                                                                         // 74
                                                                                                           //
	if (accessToken.expires != null && accessToken.expires !== 0 && accessToken.expires < new Date()) {       // 75
		return;                                                                                                  // 76
	}                                                                                                         // 77
                                                                                                           //
	var user = RocketChat.models.Users.findOne(accessToken.userId);                                           // 78
                                                                                                           //
	if (user == null) {                                                                                       // 79
		return;                                                                                                  // 80
	}                                                                                                         // 81
                                                                                                           //
	return {                                                                                                  // 82
		user: _.omit(user, '$loki')                                                                              // 82
	};                                                                                                        // 82
});                                                                                                        // 83
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"default-services.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_oauth2-server-config/oauth/server/default-services.js                               //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
if (!RocketChat.models.OAuthApps.findOne('zapier')) {                                                      // 1
	RocketChat.models.OAuthApps.insert({                                                                      // 2
		_id: 'zapier',                                                                                           // 3
		name: 'Zapier',                                                                                          // 4
		active: true,                                                                                            // 5
		clientId: 'zapier',                                                                                      // 6
		clientSecret: 'RTK6TlndaCIolhQhZ7_KHIGOKj41RnlaOq_o-7JKwLr',                                             // 7
		redirectUri: 'https://zapier.com/dashboard/auth/oauth/return/RocketChatDevAPI/',                         // 8
		_createdAt: new Date(),                                                                                  // 9
		_createdBy: {                                                                                            // 10
			_id: 'system',                                                                                          // 11
			username: 'system'                                                                                      // 12
		}                                                                                                        // 10
	});                                                                                                       // 2
}                                                                                                          // 15
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"admin":{"server":{"publications":{"oauthApps.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_oauth2-server-config/admin/server/publications/oauthApps.js                         //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
Meteor.publish('oauthApps', function () {                                                                  // 1
	if (!this.userId) {                                                                                       // 2
		return this.ready();                                                                                     // 3
	}                                                                                                         // 4
                                                                                                           //
	if (!RocketChat.authz.hasPermission(this.userId, 'manage-oauth-apps')) {                                  // 5
		this.error(Meteor.Error('error-not-allowed', 'Not allowed', {                                            // 6
			publish: 'oauthApps'                                                                                    // 6
		}));                                                                                                     // 6
	}                                                                                                         // 7
                                                                                                           //
	return RocketChat.models.OAuthApps.find();                                                                // 8
});                                                                                                        // 9
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods":{"addOAuthApp.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_oauth2-server-config/admin/server/methods/addOAuthApp.js                            //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
Meteor.methods({                                                                                           // 1
	addOAuthApp: function (application) {                                                                     // 2
		if (!RocketChat.authz.hasPermission(this.userId, 'manage-oauth-apps')) {                                 // 3
			throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                            // 4
				method: 'addOAuthApp'                                                                                  // 4
			});                                                                                                     // 4
		}                                                                                                        // 5
                                                                                                           //
		if (!_.isString(application.name) || application.name.trim() === '') {                                   // 6
			throw new Meteor.Error('error-invalid-name', 'Invalid name', {                                          // 7
				method: 'addOAuthApp'                                                                                  // 7
			});                                                                                                     // 7
		}                                                                                                        // 8
                                                                                                           //
		if (!_.isString(application.redirectUri) || application.redirectUri.trim() === '') {                     // 9
			throw new Meteor.Error('error-invalid-redirectUri', 'Invalid redirectUri', {                            // 10
				method: 'addOAuthApp'                                                                                  // 10
			});                                                                                                     // 10
		}                                                                                                        // 11
                                                                                                           //
		if (!_.isBoolean(application.active)) {                                                                  // 12
			throw new Meteor.Error('error-invalid-arguments', 'Invalid arguments', {                                // 13
				method: 'addOAuthApp'                                                                                  // 13
			});                                                                                                     // 13
		}                                                                                                        // 14
                                                                                                           //
		application.clientId = Random.id();                                                                      // 15
		application.clientSecret = Random.secret();                                                              // 16
		application._createdAt = new Date();                                                                     // 17
		application._createdBy = RocketChat.models.Users.findOne(this.userId, {                                  // 18
			fields: {                                                                                               // 18
				username: 1                                                                                            // 18
			}                                                                                                       // 18
		});                                                                                                      // 18
		application._id = RocketChat.models.OAuthApps.insert(application);                                       // 19
		return application;                                                                                      // 20
	}                                                                                                         // 21
});                                                                                                        // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"updateOAuthApp.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_oauth2-server-config/admin/server/methods/updateOAuthApp.js                         //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
Meteor.methods({                                                                                           // 1
	updateOAuthApp: function (applicationId, application) {                                                   // 2
		if (!RocketChat.authz.hasPermission(this.userId, 'manage-oauth-apps')) {                                 // 3
			throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                            // 4
				method: 'updateOAuthApp'                                                                               // 4
			});                                                                                                     // 4
		}                                                                                                        // 5
                                                                                                           //
		if (!_.isString(application.name) || application.name.trim() === '') {                                   // 6
			throw new Meteor.Error('error-invalid-name', 'Invalid name', {                                          // 7
				method: 'updateOAuthApp'                                                                               // 7
			});                                                                                                     // 7
		}                                                                                                        // 8
                                                                                                           //
		if (!_.isString(application.redirectUri) || application.redirectUri.trim() === '') {                     // 9
			throw new Meteor.Error('error-invalid-redirectUri', 'Invalid redirectUri', {                            // 10
				method: 'updateOAuthApp'                                                                               // 10
			});                                                                                                     // 10
		}                                                                                                        // 11
                                                                                                           //
		if (!_.isBoolean(application.active)) {                                                                  // 12
			throw new Meteor.Error('error-invalid-arguments', 'Invalid arguments', {                                // 13
				method: 'updateOAuthApp'                                                                               // 13
			});                                                                                                     // 13
		}                                                                                                        // 14
                                                                                                           //
		var currentApplication = RocketChat.models.OAuthApps.findOne(applicationId);                             // 15
                                                                                                           //
		if (currentApplication == null) {                                                                        // 16
			throw new Meteor.Error('error-application-not-found', 'Application not found', {                        // 17
				method: 'updateOAuthApp'                                                                               // 17
			});                                                                                                     // 17
		}                                                                                                        // 18
                                                                                                           //
		RocketChat.models.OAuthApps.update(applicationId, {                                                      // 19
			$set: {                                                                                                 // 20
				name: application.name,                                                                                // 21
				active: application.active,                                                                            // 22
				redirectUri: application.redirectUri,                                                                  // 23
				_updatedAt: new Date(),                                                                                // 24
				_updatedBy: RocketChat.models.Users.findOne(this.userId, {                                             // 25
					fields: {                                                                                             // 26
						username: 1                                                                                          // 27
					}                                                                                                     // 26
				})                                                                                                     // 25
			}                                                                                                       // 20
		});                                                                                                      // 19
		return RocketChat.models.OAuthApps.findOne(applicationId);                                               // 32
	}                                                                                                         // 33
});                                                                                                        // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"deleteOAuthApp.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_oauth2-server-config/admin/server/methods/deleteOAuthApp.js                         //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
Meteor.methods({                                                                                           // 1
	deleteOAuthApp: function (applicationId) {                                                                // 2
		if (!RocketChat.authz.hasPermission(this.userId, 'manage-oauth-apps')) {                                 // 3
			throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                            // 4
				method: 'deleteOAuthApp'                                                                               // 4
			});                                                                                                     // 4
		}                                                                                                        // 5
                                                                                                           //
		var application = RocketChat.models.OAuthApps.findOne(applicationId);                                    // 6
                                                                                                           //
		if (application == null) {                                                                               // 7
			throw new Meteor.Error('error-application-not-found', 'Application not found', {                        // 8
				method: 'deleteOAuthApp'                                                                               // 8
			});                                                                                                     // 8
		}                                                                                                        // 9
                                                                                                           //
		RocketChat.models.OAuthApps.remove({                                                                     // 10
			_id: applicationId                                                                                      // 10
		});                                                                                                      // 10
		return true;                                                                                             // 11
	}                                                                                                         // 12
});                                                                                                        // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:oauth2-server-config/server/models/OAuthApps.js");
require("./node_modules/meteor/rocketchat:oauth2-server-config/oauth/server/oauth2-server.js");
require("./node_modules/meteor/rocketchat:oauth2-server-config/oauth/server/default-services.js");
require("./node_modules/meteor/rocketchat:oauth2-server-config/admin/server/publications/oauthApps.js");
require("./node_modules/meteor/rocketchat:oauth2-server-config/admin/server/methods/addOAuthApp.js");
require("./node_modules/meteor/rocketchat:oauth2-server-config/admin/server/methods/updateOAuthApp.js");
require("./node_modules/meteor/rocketchat:oauth2-server-config/admin/server/methods/deleteOAuthApp.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:oauth2-server-config'] = {};

})();

//# sourceMappingURL=rocketchat_oauth2-server-config.js.map

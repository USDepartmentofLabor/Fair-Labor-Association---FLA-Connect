(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Logger = Package['rocketchat:logger'].Logger;
var SystemLogger = Package['rocketchat:logger'].SystemLogger;
var LoggerManager = Package['rocketchat:logger'].LoggerManager;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RocketChatTabBar = Package['rocketchat:lib'].RocketChatTabBar;
var ECMAScript = Package.ecmascript.ECMAScript;
var SHA256 = Package.sha.SHA256;
var Accounts = Package['accounts-base'].Accounts;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var meteorInstall = Package.modules.meteorInstall;
var process = Package.modules.process;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

/* Package-scope variables */
var CROWD;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:crowd":{"server":{"crowd.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/rocketchat_crowd/server/crowd.js                                                           //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                //
                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                       //
                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }      //
                                                                                                       //
/* globals:CROWD:true */ /* eslint new-cap: [2, {"capIsNewExceptions": ["SHA256"]}] */var logger = new Logger('CROWD', {});
                                                                                                       //
function fallbackDefaultAccountSystem(bind, username, password) {                                      // 5
	if (typeof username === 'string') {                                                                   // 6
		if (username.indexOf('@') === -1) {                                                                  // 7
			username = {                                                                                        // 8
				username: username                                                                                 // 8
			};                                                                                                  // 8
		} else {                                                                                             // 9
			username = {                                                                                        // 10
				email: username                                                                                    // 10
			};                                                                                                  // 10
		}                                                                                                    // 11
	}                                                                                                     // 12
                                                                                                       //
	logger.info('Fallback to default account system', username);                                          // 14
	var loginRequest = {                                                                                  // 16
		user: username,                                                                                      // 17
		password: {                                                                                          // 18
			digest: SHA256(password),                                                                           // 19
			algorithm: 'sha-256'                                                                                // 20
		}                                                                                                    // 18
	};                                                                                                    // 16
	return Accounts._runLoginHandlers(bind, loginRequest);                                                // 24
}                                                                                                      // 25
                                                                                                       //
var CROWD = function () {                                                                              // 27
	function CROWD() {                                                                                    // 28
		(0, _classCallCheck3.default)(this, CROWD);                                                          // 28
                                                                                                       //
		var AtlassianCrowd = Npm.require('atlassian-crowd');                                                 // 29
                                                                                                       //
		var url = RocketChat.settings.get('CROWD_URL');                                                      // 31
		var urlLastChar = url.slice(-1);                                                                     // 32
                                                                                                       //
		if (urlLastChar !== '/') {                                                                           // 34
			url += '/';                                                                                         // 35
		}                                                                                                    // 36
                                                                                                       //
		this.options = {                                                                                     // 38
			crowd: {                                                                                            // 39
				base: url                                                                                          // 40
			},                                                                                                  // 39
			application: {                                                                                      // 42
				name: RocketChat.settings.get('CROWD_APP_USERNAME'),                                               // 43
				password: RocketChat.settings.get('CROWD_APP_PASSWORD')                                            // 44
			},                                                                                                  // 42
			rejectUnauthorized: RocketChat.settings.get('CROWD_Reject_Unauthorized')                            // 46
		};                                                                                                   // 38
		this.crowdClient = new AtlassianCrowd(this.options);                                                 // 49
		this.crowdClient.user.authenticateSync = Meteor.wrapAsync(this.crowdClient.user.authenticate, this);
		this.crowdClient.user.findSync = Meteor.wrapAsync(this.crowdClient.user.find, this);                 // 52
		this.crowdClient.pingSync = Meteor.wrapAsync(this.crowdClient.ping, this);                           // 53
	}                                                                                                     // 54
                                                                                                       //
	CROWD.prototype.checkConnection = function () {                                                       // 27
		function checkConnection() {                                                                         // 27
			this.crowdClient.pingSync();                                                                        // 57
		}                                                                                                    // 58
                                                                                                       //
		return checkConnection;                                                                              // 27
	}();                                                                                                  // 27
                                                                                                       //
	CROWD.prototype.authenticate = function () {                                                          // 27
		function authenticate(username, password) {                                                          // 27
			if (!username || !password) {                                                                       // 61
				logger.error('No username or password');                                                           // 62
				return;                                                                                            // 63
			}                                                                                                   // 64
                                                                                                       //
			logger.info('Going to crowd:', username);                                                           // 66
			var auth = this.crowdClient.user.authenticateSync(username, password);                              // 67
                                                                                                       //
			if (!auth) {                                                                                        // 69
				return;                                                                                            // 70
			}                                                                                                   // 71
                                                                                                       //
			var userResponse = this.crowdClient.user.findSync(username);                                        // 73
			var user = {                                                                                        // 75
				displayname: userResponse['display-name'],                                                         // 76
				username: userResponse.name,                                                                       // 77
				email: userResponse.email,                                                                         // 78
				password: password,                                                                                // 79
				active: userResponse.active                                                                        // 80
			};                                                                                                  // 75
			return user;                                                                                        // 83
		}                                                                                                    // 84
                                                                                                       //
		return authenticate;                                                                                 // 27
	}();                                                                                                  // 27
                                                                                                       //
	CROWD.prototype.syncDataToUser = function () {                                                        // 27
		function syncDataToUser(crowdUser, id) {                                                             // 27
			var user = {                                                                                        // 87
				username: crowdUser.username,                                                                      // 88
				emails: [{                                                                                         // 89
					address: crowdUser.email,                                                                         // 90
					verified: true                                                                                    // 91
				}],                                                                                                // 89
				password: crowdUser.password,                                                                      // 93
				active: crowdUser.active                                                                           // 94
			};                                                                                                  // 87
                                                                                                       //
			if (crowdUser.displayname) {                                                                        // 97
				RocketChat._setRealName(id, crowdUser.displayname);                                                // 98
			}                                                                                                   // 99
                                                                                                       //
			Meteor.users.update(id, {                                                                           // 101
				$set: user                                                                                         // 102
			});                                                                                                 // 101
		}                                                                                                    // 104
                                                                                                       //
		return syncDataToUser;                                                                               // 27
	}();                                                                                                  // 27
                                                                                                       //
	CROWD.prototype.sync = function () {                                                                  // 27
		function sync() {                                                                                    // 27
			if (RocketChat.settings.get('CROWD_Enable') !== true) {                                             // 107
				return;                                                                                            // 108
			}                                                                                                   // 109
                                                                                                       //
			var self = this;                                                                                    // 111
			logger.info('Sync started');                                                                        // 112
			var users = RocketChat.models.Users.findCrowdUsers();                                               // 114
                                                                                                       //
			if (users) {                                                                                        // 115
				users.forEach(function (user) {                                                                    // 116
					logger.info('Syncing user', user.username);                                                       // 117
					var userResponse = self.crowdClient.user.findSync(user.username);                                 // 118
                                                                                                       //
					if (userResponse) {                                                                               // 119
						var crowdUser = {                                                                                // 120
							displayname: userResponse['display-name'],                                                      // 121
							username: userResponse.name,                                                                    // 122
							email: userResponse.email,                                                                      // 123
							password: userResponse.password,                                                                // 124
							active: userResponse.active                                                                     // 125
						};                                                                                               // 120
						self.syncDataToUser(crowdUser, user._id);                                                        // 128
					}                                                                                                 // 129
				});                                                                                                // 130
			}                                                                                                   // 131
		}                                                                                                    // 132
                                                                                                       //
		return sync;                                                                                         // 27
	}();                                                                                                  // 27
                                                                                                       //
	CROWD.prototype.addNewUser = function () {                                                            // 27
		function addNewUser(crowdUser) {                                                                     // 27
			var userQuery = {                                                                                   // 135
				crowd: true,                                                                                       // 136
				username: crowdUser.username                                                                       // 137
			}; // find our existinmg user if they exist                                                         // 135
                                                                                                       //
			var user = Meteor.users.findOne(userQuery);                                                         // 141
                                                                                                       //
			if (user) {                                                                                         // 143
				var stampedToken = Accounts._generateStampedLoginToken();                                          // 144
                                                                                                       //
				Meteor.users.update(user._id, {                                                                    // 146
					$push: {                                                                                          // 147
						'services.resume.loginTokens': Accounts._hashStampedToken(stampedToken)                          // 148
					}                                                                                                 // 147
				});                                                                                                // 146
				this.syncDataToUser(crowdUser, user._id);                                                          // 152
				return {                                                                                           // 154
					userId: user._id,                                                                                 // 155
					token: stampedToken.token                                                                         // 156
				};                                                                                                 // 154
			} else {                                                                                            // 158
				try {                                                                                              // 159
					crowdUser._id = Accounts.createUser(crowdUser);                                                   // 160
				} catch (error) {                                                                                  // 161
					logger.info('Error creating new user for crowd user', error);                                     // 162
				}                                                                                                  // 163
                                                                                                       //
				var updateUser = {                                                                                 // 165
					name: crowdUser.displayname,                                                                      // 166
					crowd: true,                                                                                      // 167
					active: crowdUser.active                                                                          // 168
				};                                                                                                 // 165
				Meteor.users.update(crowdUser._id, {                                                               // 171
					$set: updateUser                                                                                  // 172
				});                                                                                                // 171
			}                                                                                                   // 174
                                                                                                       //
			return {                                                                                            // 176
				userId: crowdUser._id                                                                              // 177
			};                                                                                                  // 176
		}                                                                                                    // 179
                                                                                                       //
		return addNewUser;                                                                                   // 27
	}();                                                                                                  // 27
                                                                                                       //
	return CROWD;                                                                                         // 27
}();                                                                                                   // 27
                                                                                                       //
Accounts.registerLoginHandler('crowd', function (loginRequest) {                                       // 182
	if (!loginRequest.crowd) {                                                                            // 183
		return undefined;                                                                                    // 184
	}                                                                                                     // 185
                                                                                                       //
	logger.info('Init CROWD login', loginRequest.username);                                               // 187
                                                                                                       //
	if (RocketChat.settings.get('CROWD_Enable') !== true) {                                               // 189
		return fallbackDefaultAccountSystem(this, loginRequest.username, loginRequest.crowdPassword);        // 190
	}                                                                                                     // 191
                                                                                                       //
	var crowd = new CROWD();                                                                              // 193
	var user = void 0;                                                                                    // 194
                                                                                                       //
	try {                                                                                                 // 195
		user = crowd.authenticate(loginRequest.username, loginRequest.crowdPassword);                        // 196
	} catch (error) {                                                                                     // 197
		logger.error('Crowd user not authenticated due to an error, falling back');                          // 198
	}                                                                                                     // 199
                                                                                                       //
	if (!user) {                                                                                          // 201
		return fallbackDefaultAccountSystem(this, loginRequest.username, loginRequest.crowdPassword);        // 202
	}                                                                                                     // 203
                                                                                                       //
	return crowd.addNewUser(user);                                                                        // 205
});                                                                                                    // 206
var interval = void 0;                                                                                 // 208
var timeout = void 0;                                                                                  // 209
RocketChat.settings.get('CROWD_Sync_User_Data', function (key, value) {                                // 211
	Meteor.clearInterval(interval);                                                                       // 212
	Meteor.clearTimeout(timeout);                                                                         // 213
                                                                                                       //
	if (value === true) {                                                                                 // 215
		var crowd = new CROWD();                                                                             // 216
		logger.info('Enabling CROWD user sync');                                                             // 217
		Meteor.setInterval(crowd.sync, 1000 * 60 * 60);                                                      // 218
		Meteor.setTimeout(function () {                                                                      // 219
			crowd.sync();                                                                                       // 220
		}, 1000 * 30);                                                                                       // 221
	} else {                                                                                              // 222
		logger.info('Disabling CROWD user sync');                                                            // 223
	}                                                                                                     // 224
});                                                                                                    // 225
Meteor.methods({                                                                                       // 227
	crowd_test_connection: function () {                                                                  // 228
		var user = Meteor.user();                                                                            // 229
                                                                                                       //
		if (!user) {                                                                                         // 230
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                      // 231
				method: 'crowd_test_connection'                                                                    // 231
			});                                                                                                 // 231
		}                                                                                                    // 232
                                                                                                       //
		if (!RocketChat.authz.hasRole(user._id, 'admin')) {                                                  // 234
			throw new Meteor.Error('error-not-authorized', 'Not authorized', {                                  // 235
				method: 'crowd_test_connection'                                                                    // 235
			});                                                                                                 // 235
		}                                                                                                    // 236
                                                                                                       //
		if (RocketChat.settings.get('CROWD_Enable') !== true) {                                              // 238
			throw new Meteor.Error('crowd_disabled');                                                           // 239
		}                                                                                                    // 240
                                                                                                       //
		var crowd = new CROWD();                                                                             // 242
                                                                                                       //
		try {                                                                                                // 244
			crowd.checkConnection();                                                                            // 245
		} catch (error) {                                                                                    // 246
			logger.error('Invalid crowd connection details, check the url and application username/password and make sure this server is allowed to speak to crowd');
			throw new Meteor.Error('Invalid connection details', '', {                                          // 248
				method: 'crowd_test_connection'                                                                    // 248
			});                                                                                                 // 248
		}                                                                                                    // 249
                                                                                                       //
		return {                                                                                             // 251
			message: 'Connection success',                                                                      // 252
			params: []                                                                                          // 253
		};                                                                                                   // 251
	}                                                                                                     // 255
});                                                                                                    // 227
/////////////////////////////////////////////////////////////////////////////////////////////////////////

},"settings.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/rocketchat_crowd/server/settings.js                                                        //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
Meteor.startup(function () {                                                                           // 1
	RocketChat.settings.addGroup('AtlassianCrowd', function () {                                          // 2
		var enableQuery = {                                                                                  // 3
			_id: 'CROWD_Enable',                                                                                // 3
			value: true                                                                                         // 3
		};                                                                                                   // 3
		this.add('CROWD_Enable', false, {                                                                    // 4
			type: 'boolean',                                                                                    // 4
			"public": true,                                                                                     // 4
			i18nLabel: 'Enabled'                                                                                // 4
		});                                                                                                  // 4
		this.add('CROWD_URL', '', {                                                                          // 5
			type: 'string',                                                                                     // 5
			enableQuery: enableQuery,                                                                           // 5
			i18nLabel: 'URL'                                                                                    // 5
		});                                                                                                  // 5
		this.add('CROWD_Reject_Unauthorized', true, {                                                        // 6
			type: 'boolean',                                                                                    // 6
			enableQuery: enableQuery                                                                            // 6
		});                                                                                                  // 6
		this.add('CROWD_APP_USERNAME', '', {                                                                 // 7
			type: 'string',                                                                                     // 7
			enableQuery: enableQuery,                                                                           // 7
			i18nLabel: 'Username'                                                                               // 7
		});                                                                                                  // 7
		this.add('CROWD_APP_PASSWORD', '', {                                                                 // 8
			type: 'password',                                                                                   // 8
			enableQuery: enableQuery,                                                                           // 8
			i18nLabel: 'Password'                                                                               // 8
		});                                                                                                  // 8
		this.add('CROWD_Sync_User_Data', false, {                                                            // 9
			type: 'boolean',                                                                                    // 9
			enableQuery: enableQuery,                                                                           // 9
			i18nLabel: 'Sync_Users'                                                                             // 9
		});                                                                                                  // 9
		this.add('CROWD_Test_Connection', 'crowd_test_connection', {                                         // 10
			type: 'action',                                                                                     // 10
			actionText: 'Test_Connection',                                                                      // 10
			i18nLabel: 'Test_Connection'                                                                        // 10
		});                                                                                                  // 10
	});                                                                                                   // 11
});                                                                                                    // 12
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:crowd/server/crowd.js");
require("./node_modules/meteor/rocketchat:crowd/server/settings.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['rocketchat:crowd'] = {}, {
  CROWD: CROWD
});

})();

//# sourceMappingURL=rocketchat_crowd.js.map

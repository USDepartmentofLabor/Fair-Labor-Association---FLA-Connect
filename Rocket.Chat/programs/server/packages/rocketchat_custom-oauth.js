(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var meteorInstall = Package.modules.meteorInstall;
var process = Package.modules.process;
var check = Package.check.check;
var Match = Package.check.Match;
var OAuth = Package.oauth.OAuth;
var Oauth = Package.oauth.Oauth;
var _ = Package.underscore._;
var ECMAScript = Package.ecmascript.ECMAScript;
var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;
var s = Package['underscorestring:underscore.string'].s;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Accounts = Package['accounts-base'].Accounts;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

/* Package-scope variables */
var CustomOAuth;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:custom-oauth":{"server":{"custom_oauth_server.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_custom-oauth/server/custom_oauth_server.js                                                    //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                              //
                                                                                                                     //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                     //
                                                                                                                     //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                    //
                                                                                                                     //
module.export({                                                                                                      // 1
	CustomOAuth: function () {                                                                                          // 1
		return CustomOAuth;                                                                                                // 1
	}                                                                                                                   // 1
});                                                                                                                  // 1
/*globals OAuth*/var logger = new Logger('CustomOAuth');                                                             // 1
var Services = {};                                                                                                   // 5
var BeforeUpdateOrCreateUserFromExternalService = [];                                                                // 6
                                                                                                                     //
var CustomOAuth = function () {                                                                                      //
	function CustomOAuth(name, options) {                                                                               // 9
		(0, _classCallCheck3.default)(this, CustomOAuth);                                                                  // 9
		logger.debug('Init CustomOAuth', name, options);                                                                   // 10
		this.name = name;                                                                                                  // 12
                                                                                                                     //
		if (!Match.test(this.name, String)) {                                                                              // 13
			throw new Meteor.Error('CustomOAuth: Name is required and must be String');                                       // 14
		}                                                                                                                  // 15
                                                                                                                     //
		if (Services[this.name]) {                                                                                         // 17
			Services[this.name].configure(options);                                                                           // 18
			return;                                                                                                           // 19
		}                                                                                                                  // 20
                                                                                                                     //
		Services[this.name] = this;                                                                                        // 22
		this.configure(options);                                                                                           // 24
		this.userAgent = 'Meteor';                                                                                         // 26
                                                                                                                     //
		if (Meteor.release) {                                                                                              // 27
			this.userAgent += "/" + Meteor.release;                                                                           // 28
		}                                                                                                                  // 29
                                                                                                                     //
		Accounts.oauth.registerService(this.name);                                                                         // 31
		this.registerService();                                                                                            // 32
		this.addHookToProcessUser();                                                                                       // 33
	}                                                                                                                   // 34
                                                                                                                     //
	CustomOAuth.prototype.configure = function () {                                                                     //
		function configure(options) {                                                                                      //
			if (!Match.test(options, Object)) {                                                                               // 37
				throw new Meteor.Error('CustomOAuth: Options is required and must be Object');                                   // 38
			}                                                                                                                 // 39
                                                                                                                     //
			if (!Match.test(options.serverURL, String)) {                                                                     // 41
				throw new Meteor.Error('CustomOAuth: Options.serverURL is required and must be String');                         // 42
			}                                                                                                                 // 43
                                                                                                                     //
			if (!Match.test(options.tokenPath, String)) {                                                                     // 45
				options.tokenPath = '/oauth/token';                                                                              // 46
			}                                                                                                                 // 47
                                                                                                                     //
			if (!Match.test(options.identityPath, String)) {                                                                  // 49
				options.identityPath = '/me';                                                                                    // 50
			}                                                                                                                 // 51
                                                                                                                     //
			this.serverURL = options.serverURL;                                                                               // 53
			this.tokenPath = options.tokenPath;                                                                               // 54
			this.identityPath = options.identityPath;                                                                         // 55
			this.tokenSentVia = options.tokenSentVia;                                                                         // 56
			this.usernameField = (options.usernameField || '').trim();                                                        // 57
			this.mergeUsers = options.mergeUsers;                                                                             // 58
                                                                                                                     //
			if (!/^https?:\/\/.+/.test(this.tokenPath)) {                                                                     // 60
				this.tokenPath = this.serverURL + this.tokenPath;                                                                // 61
			}                                                                                                                 // 62
                                                                                                                     //
			if (!/^https?:\/\/.+/.test(this.identityPath)) {                                                                  // 64
				this.identityPath = this.serverURL + this.identityPath;                                                          // 65
			}                                                                                                                 // 66
                                                                                                                     //
			if (Match.test(options.addAutopublishFields, Object)) {                                                           // 68
				Accounts.addAutopublishFields(options.addAutopublishFields);                                                     // 69
			}                                                                                                                 // 70
		}                                                                                                                  // 71
                                                                                                                     //
		return configure;                                                                                                  //
	}();                                                                                                                //
                                                                                                                     //
	CustomOAuth.prototype.getAccessToken = function () {                                                                //
		function getAccessToken(query) {                                                                                   //
			var config = ServiceConfiguration.configurations.findOne({                                                        // 74
				service: this.name                                                                                               // 74
			});                                                                                                               // 74
                                                                                                                     //
			if (!config) {                                                                                                    // 75
				throw new ServiceConfiguration.ConfigError();                                                                    // 76
			}                                                                                                                 // 77
                                                                                                                     //
			var response = undefined;                                                                                         // 79
			var allOptions = {                                                                                                // 81
				headers: {                                                                                                       // 82
					'User-Agent': this.userAgent,                                                                                   // 83
					// http://doc.gitlab.com/ce/api/users.html#Current-user                                                         // 83
					Accept: 'application/json'                                                                                      // 84
				},                                                                                                               // 82
				params: {                                                                                                        // 86
					code: query.code,                                                                                               // 87
					redirect_uri: OAuth._redirectUri(this.name, config),                                                            // 88
					grant_type: 'authorization_code',                                                                               // 89
					state: query.state                                                                                              // 90
				}                                                                                                                // 86
			}; // Only send clientID / secret once on header or payload.                                                      // 81
                                                                                                                     //
			if (this.tokenSentVia === 'header') {                                                                             // 95
				allOptions['auth'] = config.clientId + ":" + OAuth.openSecret(config.secret);                                    // 96
			} else {                                                                                                          // 97
				allOptions['params']['client_secret'] = OAuth.openSecret(config.secret);                                         // 98
				allOptions['params']['client_id'] = config.clientId;                                                             // 99
			}                                                                                                                 // 100
                                                                                                                     //
			try {                                                                                                             // 102
				response = HTTP.post(this.tokenPath, allOptions);                                                                // 103
			} catch (err) {                                                                                                   // 104
				var error = new Error("Failed to complete OAuth handshake with " + this.name + " at " + this.tokenPath + ". " + err.message);
				throw _.extend(error, {                                                                                          // 106
					response: err.response                                                                                          // 106
				});                                                                                                              // 106
			}                                                                                                                 // 107
                                                                                                                     //
			var data = void 0;                                                                                                // 109
                                                                                                                     //
			if (response.data) {                                                                                              // 110
				data = response.data;                                                                                            // 111
			} else {                                                                                                          // 112
				data = JSON.parse(response.content);                                                                             // 113
			}                                                                                                                 // 114
                                                                                                                     //
			if (data.error) {                                                                                                 // 116
				//if the http response was a json object with an error attribute                                                 // 116
				throw new Error("Failed to complete OAuth handshake with " + this.name + " at " + this.tokenPath + ". " + data.error);
			} else {                                                                                                          // 118
				return data.access_token;                                                                                        // 119
			}                                                                                                                 // 120
		}                                                                                                                  // 121
                                                                                                                     //
		return getAccessToken;                                                                                             //
	}();                                                                                                                //
                                                                                                                     //
	CustomOAuth.prototype.getIdentity = function () {                                                                   //
		function getIdentity(accessToken) {                                                                                //
			var params = {};                                                                                                  // 124
			var headers = {                                                                                                   // 125
				'User-Agent': this.userAgent // http://doc.gitlab.com/ce/api/users.html#Current-user                             // 126
                                                                                                                     //
			};                                                                                                                // 125
                                                                                                                     //
			if (this.tokenSentVia === 'header') {                                                                             // 129
				headers['Authorization'] = "Bearer " + accessToken;                                                              // 130
			} else {                                                                                                          // 131
				params['access_token'] = accessToken;                                                                            // 132
			}                                                                                                                 // 133
                                                                                                                     //
			try {                                                                                                             // 135
				var response = HTTP.get(this.identityPath, {                                                                     // 136
					headers: headers,                                                                                               // 137
					params: params                                                                                                  // 138
				});                                                                                                              // 136
				var data = void 0;                                                                                               // 141
                                                                                                                     //
				if (response.data) {                                                                                             // 143
					data = response.data;                                                                                           // 144
				} else {                                                                                                         // 145
					data = JSON.parse(response.content);                                                                            // 146
				}                                                                                                                // 147
                                                                                                                     //
				logger.debug('Identity response', JSON.stringify(data, null, 2));                                                // 149
				return data;                                                                                                     // 151
			} catch (err) {                                                                                                   // 152
				var error = new Error("Failed to fetch identity from " + this.name + " at " + this.identityPath + ". " + err.message);
				throw _.extend(error, {                                                                                          // 154
					response: err.response                                                                                          // 154
				});                                                                                                              // 154
			}                                                                                                                 // 155
		}                                                                                                                  // 156
                                                                                                                     //
		return getIdentity;                                                                                                //
	}();                                                                                                                //
                                                                                                                     //
	CustomOAuth.prototype.registerService = function () {                                                               //
		function registerService() {                                                                                       //
			var self = this;                                                                                                  // 159
			OAuth.registerService(this.name, 2, null, function (query) {                                                      // 160
				var accessToken = self.getAccessToken(query); // console.log 'at:', accessToken                                  // 161
                                                                                                                     //
				var identity = self.getIdentity(accessToken);                                                                    // 164
                                                                                                                     //
				if (identity) {                                                                                                  // 166
					// Set 'id' to '_id' for any sources that provide it                                                            // 167
					if (identity._id && !identity.id) {                                                                             // 168
						identity.id = identity._id;                                                                                    // 169
					} // Fix for Reddit                                                                                             // 170
                                                                                                                     //
                                                                                                                     //
					if (identity.result) {                                                                                          // 173
						identity = identity.result;                                                                                    // 174
					} // Fix WordPress-like identities having 'ID' instead of 'id'                                                  // 175
                                                                                                                     //
                                                                                                                     //
					if (identity.ID && !identity.id) {                                                                              // 178
						identity.id = identity.ID;                                                                                     // 179
					} // Fix Auth0-like identities having 'user_id' instead of 'id'                                                 // 180
                                                                                                                     //
                                                                                                                     //
					if (identity.user_id && !identity.id) {                                                                         // 183
						identity.id = identity.user_id;                                                                                // 184
					}                                                                                                               // 185
                                                                                                                     //
					if (identity.CharacterID && !identity.id) {                                                                     // 187
						identity.id = identity.CharacterID;                                                                            // 188
					} // Fix Dataporten having 'user.userid' instead of 'id'                                                        // 189
                                                                                                                     //
                                                                                                                     //
					if (identity.user && identity.user.userid && !identity.id) {                                                    // 192
						identity.id = identity.user.userid;                                                                            // 193
						identity.email = identity.user.email;                                                                          // 194
					} // Fix general 'phid' instead of 'id' from phabricator                                                        // 195
                                                                                                                     //
                                                                                                                     //
					if (identity.phid && !identity.id) {                                                                            // 198
						identity.id = identity.phid;                                                                                   // 199
					} // Fix Keycloak-like identities having 'sub' instead of 'id'                                                  // 200
                                                                                                                     //
                                                                                                                     //
					if (identity.sub && !identity.id) {                                                                             // 203
						identity.id = identity.sub;                                                                                    // 204
					} // Fix general 'userid' instead of 'id' from provider                                                         // 205
                                                                                                                     //
                                                                                                                     //
					if (identity.userid && !identity.id) {                                                                          // 208
						identity.id = identity.userid;                                                                                 // 209
					}                                                                                                               // 210
				} // console.log 'id:', JSON.stringify identity, null, '  '                                                      // 211
                                                                                                                     //
                                                                                                                     //
				var serviceData = {                                                                                              // 215
					_OAuthCustom: true,                                                                                             // 216
					accessToken: accessToken                                                                                        // 217
				};                                                                                                               // 215
                                                                                                                     //
				_.extend(serviceData, identity);                                                                                 // 220
                                                                                                                     //
				var data = {                                                                                                     // 222
					serviceData: serviceData,                                                                                       // 223
					options: {                                                                                                      // 224
						profile: {                                                                                                     // 225
							name: identity.name || identity.username || identity.nickname || identity.CharacterName || identity.userName || identity.preferred_username || identity.user && identity.user.name
						}                                                                                                              // 225
					}                                                                                                               // 224
				}; // console.log data                                                                                           // 222
                                                                                                                     //
				return data;                                                                                                     // 233
			});                                                                                                               // 234
		}                                                                                                                  // 235
                                                                                                                     //
		return registerService;                                                                                            //
	}();                                                                                                                //
                                                                                                                     //
	CustomOAuth.prototype.retrieveCredential = function () {                                                            //
		function retrieveCredential(credentialToken, credentialSecret) {                                                   //
			return OAuth.retrieveCredential(credentialToken, credentialSecret);                                               // 238
		}                                                                                                                  // 239
                                                                                                                     //
		return retrieveCredential;                                                                                         //
	}();                                                                                                                //
                                                                                                                     //
	CustomOAuth.prototype.getUsername = function () {                                                                   //
		function getUsername(data) {                                                                                       //
			var username = '';                                                                                                // 242
                                                                                                                     //
			if (this.usernameField.indexOf('#{') > -1) {                                                                      // 244
				username = this.usernameField.replace(/#{(.+?)}/g, function (match, field) {                                     // 245
					if (!data[field]) {                                                                                             // 246
						throw new Meteor.Error('field_not_found', "Username template item \"" + field + "\" not found in data", data);
					}                                                                                                               // 248
                                                                                                                     //
					return data[field];                                                                                             // 249
				});                                                                                                              // 250
			} else {                                                                                                          // 251
				username = data[this.usernameField];                                                                             // 252
                                                                                                                     //
				if (!username) {                                                                                                 // 253
					throw new Meteor.Error('field_not_found', "Username field \"" + this.usernameField + "\" not found in data", data);
				}                                                                                                                // 255
			}                                                                                                                 // 256
                                                                                                                     //
			return username;                                                                                                  // 258
		}                                                                                                                  // 259
                                                                                                                     //
		return getUsername;                                                                                                //
	}();                                                                                                                //
                                                                                                                     //
	CustomOAuth.prototype.addHookToProcessUser = function () {                                                          //
		function addHookToProcessUser() {                                                                                  //
			var _this = this;                                                                                                 // 261
                                                                                                                     //
			BeforeUpdateOrCreateUserFromExternalService.push(function (serviceName, serviceData /*, options*/) {              // 262
				if (serviceName !== _this.name) {                                                                                // 263
					return;                                                                                                         // 264
				}                                                                                                                // 265
                                                                                                                     //
				if (_this.usernameField) {                                                                                       // 267
					var _$set;                                                                                                      // 267
                                                                                                                     //
					var username = _this.getUsername(serviceData);                                                                  // 268
                                                                                                                     //
					var user = RocketChat.models.Users.findOneByUsername(username);                                                 // 270
                                                                                                                     //
					if (!user) {                                                                                                    // 271
						return;                                                                                                        // 272
					} // User already created or merged                                                                             // 273
                                                                                                                     //
                                                                                                                     //
					if (user.services && user.services[serviceName] && user.services[serviceName].id === serviceData.id) {          // 276
						return;                                                                                                        // 277
					}                                                                                                               // 278
                                                                                                                     //
					if (_this.mergeUsers !== true) {                                                                                // 280
						throw new Meteor.Error('CustomOAuth', "User with username " + user.username + " already exists");              // 281
					}                                                                                                               // 282
                                                                                                                     //
					var serviceIdKey = "services." + serviceName + ".id";                                                           // 284
					var update = {                                                                                                  // 285
						$set: (_$set = {}, _$set[serviceIdKey] = serviceData.id, _$set)                                                // 286
					};                                                                                                              // 285
					RocketChat.models.Users.update({                                                                                // 291
						_id: user._id                                                                                                  // 291
					}, update);                                                                                                     // 291
				}                                                                                                                // 292
			});                                                                                                               // 293
			Accounts.validateNewUser(function (user) {                                                                        // 295
				if (!user.services || !user.services[_this.name] || !user.services[_this.name].id) {                             // 296
					return true;                                                                                                    // 297
				}                                                                                                                // 298
                                                                                                                     //
				if (_this.usernameField) {                                                                                       // 300
					user.username = _this.getUsername(user.services[_this.name]);                                                   // 301
				}                                                                                                                // 302
                                                                                                                     //
				return true;                                                                                                     // 304
			});                                                                                                               // 305
		}                                                                                                                  // 307
                                                                                                                     //
		return addHookToProcessUser;                                                                                       //
	}();                                                                                                                //
                                                                                                                     //
	return CustomOAuth;                                                                                                 //
}();                                                                                                                 //
                                                                                                                     //
var updateOrCreateUserFromExternalService = Accounts.updateOrCreateUserFromExternalService;                          // 311
                                                                                                                     //
Accounts.updateOrCreateUserFromExternalService = function () /*serviceName, serviceData, options*/{                  // 312
	for (var _iterator = BeforeUpdateOrCreateUserFromExternalService, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
		var _ref;                                                                                                          // 313
                                                                                                                     //
		if (_isArray) {                                                                                                    // 313
			if (_i >= _iterator.length) break;                                                                                // 313
			_ref = _iterator[_i++];                                                                                           // 313
		} else {                                                                                                           // 313
			_i = _iterator.next();                                                                                            // 313
			if (_i.done) break;                                                                                               // 313
			_ref = _i.value;                                                                                                  // 313
		}                                                                                                                  // 313
                                                                                                                     //
		var hook = _ref;                                                                                                   // 313
		hook.apply(this, arguments);                                                                                       // 314
	}                                                                                                                   // 315
                                                                                                                     //
	return updateOrCreateUserFromExternalService.apply(this, arguments);                                                // 317
};                                                                                                                   // 318
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
var exports = require("./node_modules/meteor/rocketchat:custom-oauth/server/custom_oauth_server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['rocketchat:custom-oauth'] = exports, {
  CustomOAuth: CustomOAuth
});

})();

//# sourceMappingURL=rocketchat_custom-oauth.js.map

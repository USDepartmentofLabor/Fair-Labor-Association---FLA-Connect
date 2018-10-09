(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RocketChatTabBar = Package['rocketchat:lib'].RocketChatTabBar;
var ECMAScript = Package.ecmascript.ECMAScript;
var RoutePolicy = Package.routepolicy.RoutePolicy;
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;
var _ = Package.underscore._;
var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;
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
var SAML;

var require = meteorInstall({"node_modules":{"meteor":{"steffo:meteor-accounts-saml":{"saml_server.js":function(require){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/steffo_meteor-accounts-saml/saml_server.js                                                               //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/* globals RoutePolicy, SAML */ /* jshint newcap: false */if (!Accounts.saml) {                                      // 1
	Accounts.saml = {                                                                                                   // 5
		settings: {                                                                                                        // 6
			debug: true,                                                                                                      // 7
			generateUsername: false,                                                                                          // 8
			providers: []                                                                                                     // 9
		}                                                                                                                  // 6
	};                                                                                                                  // 5
}                                                                                                                    // 12
                                                                                                                     //
var fiber = Npm.require('fibers');                                                                                   // 14
                                                                                                                     //
var connect = Npm.require('connect');                                                                                // 15
                                                                                                                     //
RoutePolicy.declare('/_saml/', 'network'); /**                                                                       // 16
                                            * Fetch SAML provider configs for given 'provider'.                      //
                                            */                                                                       //
                                                                                                                     //
function getSamlProviderConfig(provider) {                                                                           // 21
	if (!provider) {                                                                                                    // 22
		throw new Meteor.Error('no-saml-provider', 'SAML internal error', {                                                // 23
			method: 'getSamlProviderConfig'                                                                                   // 25
		});                                                                                                                // 25
	}                                                                                                                   // 26
                                                                                                                     //
	var samlProvider = function (element) {                                                                             // 27
		return element.provider === provider;                                                                              // 28
	};                                                                                                                  // 29
                                                                                                                     //
	return Accounts.saml.settings.providers.filter(samlProvider)[0];                                                    // 30
}                                                                                                                    // 31
                                                                                                                     //
Meteor.methods({                                                                                                     // 33
	samlLogout: function (provider) {                                                                                   // 34
		// Make sure the user is logged in before initiate SAML SLO                                                        // 35
		if (!Meteor.userId()) {                                                                                            // 36
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                    // 37
				method: 'samlLogout'                                                                                             // 37
			});                                                                                                               // 37
		}                                                                                                                  // 38
                                                                                                                     //
		var providerConfig = getSamlProviderConfig(provider);                                                              // 39
                                                                                                                     //
		if (Accounts.saml.settings.debug) {                                                                                // 41
			console.log("Logout request from " + JSON.stringify(providerConfig));                                             // 42
		} // This query should respect upcoming array of SAML logins                                                       // 43
                                                                                                                     //
                                                                                                                     //
		var user = Meteor.users.findOne({                                                                                  // 45
			_id: Meteor.userId(),                                                                                             // 46
			'services.saml.provider': provider                                                                                // 47
		}, {                                                                                                               // 45
			'services.saml': 1                                                                                                // 49
		});                                                                                                                // 48
		var nameID = user.services.saml.nameID;                                                                            // 51
		var sessionIndex = user.services.saml.idpSession;                                                                  // 52
		nameID = sessionIndex;                                                                                             // 53
                                                                                                                     //
		if (Accounts.saml.settings.debug) {                                                                                // 54
			console.log("NameID for user " + Meteor.userId() + " found: " + JSON.stringify(nameID));                          // 55
		}                                                                                                                  // 56
                                                                                                                     //
		var _saml = new SAML(providerConfig);                                                                              // 58
                                                                                                                     //
		var request = _saml.generateLogoutRequest({                                                                        // 60
			nameID: nameID,                                                                                                   // 61
			sessionIndex: sessionIndex                                                                                        // 62
		}); // request.request: actual XML SAML Request                                                                    // 60
		// request.id: comminucation id which will be mentioned in the ResponseTo field of SAMLResponse                    // 66
                                                                                                                     //
                                                                                                                     //
		Meteor.users.update({                                                                                              // 68
			_id: Meteor.userId()                                                                                              // 69
		}, {                                                                                                               // 68
			$set: {                                                                                                           // 71
				'services.saml.inResponseTo': request.id                                                                         // 72
			}                                                                                                                 // 71
		});                                                                                                                // 70
                                                                                                                     //
		var _syncRequestToUrl = Meteor.wrapAsync(_saml.requestToUrl, _saml);                                               // 76
                                                                                                                     //
		var result = _syncRequestToUrl(request.request, 'logout');                                                         // 77
                                                                                                                     //
		if (Accounts.saml.settings.debug) {                                                                                // 78
			console.log("SAML Logout Request " + result);                                                                     // 79
		}                                                                                                                  // 80
                                                                                                                     //
		return result;                                                                                                     // 83
	}                                                                                                                   // 84
});                                                                                                                  // 33
Accounts.registerLoginHandler(function (loginRequest) {                                                              // 87
	if (!loginRequest.saml || !loginRequest.credentialToken) {                                                          // 88
		return undefined;                                                                                                  // 89
	}                                                                                                                   // 90
                                                                                                                     //
	var loginResult = Accounts.saml.retrieveCredential(loginRequest.credentialToken);                                   // 92
                                                                                                                     //
	if (Accounts.saml.settings.debug) {                                                                                 // 93
		console.log("RESULT :" + JSON.stringify(loginResult));                                                             // 94
	}                                                                                                                   // 95
                                                                                                                     //
	if (loginResult === undefined) {                                                                                    // 97
		return {                                                                                                           // 98
			type: 'saml',                                                                                                     // 99
			error: new Meteor.Error(Accounts.LoginCancelledError.numericError, 'No matching login attempt found')             // 100
		};                                                                                                                 // 98
	}                                                                                                                   // 102
                                                                                                                     //
	if (loginResult && loginResult.profile && loginResult.profile.email) {                                              // 104
		var user = Meteor.users.findOne({                                                                                  // 105
			'emails.address': loginResult.profile.email                                                                       // 106
		});                                                                                                                // 105
                                                                                                                     //
		if (!user) {                                                                                                       // 109
			var newUser = {                                                                                                   // 110
				name: loginResult.profile.cn || loginResult.profile.username,                                                    // 111
				active: true,                                                                                                    // 112
				globalRoles: ['user'],                                                                                           // 113
				emails: [{                                                                                                       // 114
					address: loginResult.profile.email,                                                                             // 115
					verified: true                                                                                                  // 116
				}]                                                                                                               // 114
			};                                                                                                                // 110
                                                                                                                     //
			if (Accounts.saml.settings.generateUsername === true) {                                                           // 120
				var username = RocketChat.generateUsernameSuggestion(newUser);                                                   // 121
                                                                                                                     //
				if (username) {                                                                                                  // 122
					newUser.username = username;                                                                                    // 123
				}                                                                                                                // 124
			} else if (loginResult.profile.username) {                                                                        // 125
				newUser.username = loginResult.profile.username;                                                                 // 126
			}                                                                                                                 // 127
                                                                                                                     //
			var userId = Accounts.insertUserDoc({}, newUser);                                                                 // 129
			user = Meteor.users.findOne(userId);                                                                              // 130
		} //creating the token and adding to the user                                                                      // 131
                                                                                                                     //
                                                                                                                     //
		var stampedToken = Accounts._generateStampedLoginToken();                                                          // 134
                                                                                                                     //
		Meteor.users.update(user, {                                                                                        // 135
			$push: {                                                                                                          // 136
				'services.resume.loginTokens': stampedToken                                                                      // 137
			}                                                                                                                 // 136
		});                                                                                                                // 135
		var samlLogin = {                                                                                                  // 141
			provider: Accounts.saml.RelayState,                                                                               // 142
			idp: loginResult.profile.issuer,                                                                                  // 143
			idpSession: loginResult.profile.sessionIndex,                                                                     // 144
			nameID: loginResult.profile.nameID                                                                                // 145
		};                                                                                                                 // 141
		Meteor.users.update({                                                                                              // 148
			_id: user._id                                                                                                     // 149
		}, {                                                                                                               // 148
			$set: {                                                                                                           // 151
				// TBD this should be pushed, otherwise we're only able to SSO into a single IDP at a time                       // 152
				'services.saml': samlLogin                                                                                       // 153
			}                                                                                                                 // 151
		}); //sending token along with the userId                                                                          // 150
                                                                                                                     //
		var result = {                                                                                                     // 158
			userId: user._id,                                                                                                 // 159
			token: stampedToken.token                                                                                         // 160
		};                                                                                                                 // 158
		return result;                                                                                                     // 163
	} else {                                                                                                            // 165
		throw new Error('SAML Profile did not contain an email address');                                                  // 166
	}                                                                                                                   // 167
});                                                                                                                  // 168
Accounts.saml._loginResultForCredentialToken = {};                                                                   // 170
                                                                                                                     //
Accounts.saml.hasCredential = function (credentialToken) {                                                           // 172
	return _.has(Accounts.saml._loginResultForCredentialToken, credentialToken);                                        // 173
};                                                                                                                   // 174
                                                                                                                     //
Accounts.saml.retrieveCredential = function (credentialToken) {                                                      // 176
	// The credentialToken in all these functions corresponds to SAMLs inResponseTo field and is mandatory to check.    // 177
	var result = Accounts.saml._loginResultForCredentialToken[credentialToken];                                         // 178
	delete Accounts.saml._loginResultForCredentialToken[credentialToken];                                               // 179
	return result;                                                                                                      // 180
};                                                                                                                   // 181
                                                                                                                     //
var closePopup = function (res, err) {                                                                               // 183
	res.writeHead(200, {                                                                                                // 184
		'Content-Type': 'text/html'                                                                                        // 185
	});                                                                                                                 // 184
	var content = '<html><head><script>window.close()</script></head><body><H1>Verified</H1></body></html>';            // 187
                                                                                                                     //
	if (err) {                                                                                                          // 188
		content = "<html><body><h2>Sorry, an annoying error occured</h2><div>" + err + "</div><a onclick=\"window.close();\">Close Window</a></body></html>";
	}                                                                                                                   // 190
                                                                                                                     //
	res.end(content, 'utf-8');                                                                                          // 191
};                                                                                                                   // 192
                                                                                                                     //
var samlUrlToObject = function (url) {                                                                               // 194
	// req.url will be '/_saml/<action>/<service name>/<credentialToken>'                                               // 195
	if (!url) {                                                                                                         // 196
		return null;                                                                                                       // 197
	}                                                                                                                   // 198
                                                                                                                     //
	var splitUrl = url.split('?');                                                                                      // 200
	var splitPath = splitUrl[0].split('/'); // Any non-saml request will continue down the default                      // 201
	// middlewares.                                                                                                     // 204
                                                                                                                     //
	if (splitPath[1] !== '_saml') {                                                                                     // 205
		return null;                                                                                                       // 206
	}                                                                                                                   // 207
                                                                                                                     //
	var result = {                                                                                                      // 209
		actionName: splitPath[2],                                                                                          // 210
		serviceName: splitPath[3],                                                                                         // 211
		credentialToken: splitPath[4]                                                                                      // 212
	};                                                                                                                  // 209
                                                                                                                     //
	if (Accounts.saml.settings.debug) {                                                                                 // 214
		console.log(result);                                                                                               // 215
	}                                                                                                                   // 216
                                                                                                                     //
	return result;                                                                                                      // 217
};                                                                                                                   // 218
                                                                                                                     //
var middleware = function (req, res, next) {                                                                         // 220
	// Make sure to catch any exceptions because otherwise we'd crash                                                   // 221
	// the runner                                                                                                       // 222
	try {                                                                                                               // 223
		var samlObject = samlUrlToObject(req.url);                                                                         // 224
                                                                                                                     //
		if (!samlObject || !samlObject.serviceName) {                                                                      // 225
			next();                                                                                                           // 226
			return;                                                                                                           // 227
		}                                                                                                                  // 228
                                                                                                                     //
		if (!samlObject.actionName) {                                                                                      // 230
			throw new Error('Missing SAML action');                                                                           // 231
		}                                                                                                                  // 232
                                                                                                                     //
		console.log(Accounts.saml.settings.providers);                                                                     // 234
		console.log(samlObject.serviceName);                                                                               // 235
                                                                                                                     //
		var service = _.find(Accounts.saml.settings.providers, function (samlSetting) {                                    // 236
			return samlSetting.provider === samlObject.serviceName;                                                           // 237
		}); // Skip everything if there's no service set by the saml middleware                                            // 238
                                                                                                                     //
                                                                                                                     //
		if (!service) {                                                                                                    // 241
			throw new Error("Unexpected SAML service " + samlObject.serviceName);                                             // 242
		}                                                                                                                  // 243
                                                                                                                     //
		var _saml = void 0;                                                                                                // 244
                                                                                                                     //
		switch (samlObject.actionName) {                                                                                   // 245
			case 'metadata':                                                                                                  // 246
				_saml = new SAML(service);                                                                                       // 247
				service.callbackUrl = Meteor.absoluteUrl("_saml/validate/" + service.provider);                                  // 248
				res.writeHead(200);                                                                                              // 249
				res.write(_saml.generateServiceProviderMetadata(service.callbackUrl));                                           // 250
				res.end(); //closePopup(res);                                                                                    // 251
                                                                                                                     //
				break;                                                                                                           // 253
                                                                                                                     //
			case 'logout':                                                                                                    // 254
				// This is where we receive SAML LogoutResponse                                                                  // 255
				_saml = new SAML(service);                                                                                       // 256
                                                                                                                     //
				_saml.validateLogoutResponse(req.query.SAMLResponse, function (err, result) {                                    // 257
					if (!err) {                                                                                                     // 258
						var logOutUser = function (inResponseTo) {                                                                     // 259
							if (Accounts.saml.settings.debug) {                                                                           // 260
								console.log("Logging Out user via inResponseTo " + inResponseTo);                                            // 261
							}                                                                                                             // 262
                                                                                                                     //
							var loggedOutUser = Meteor.users.find({                                                                       // 263
								'services.saml.inResponseTo': inResponseTo                                                                   // 264
							}).fetch();                                                                                                   // 263
                                                                                                                     //
							if (loggedOutUser.length === 1) {                                                                             // 266
								if (Accounts.saml.settings.debug) {                                                                          // 267
									console.log("Found user " + loggedOutUser[0]._id);                                                          // 268
								}                                                                                                            // 269
                                                                                                                     //
								Meteor.users.update({                                                                                        // 270
									_id: loggedOutUser[0]._id                                                                                   // 271
								}, {                                                                                                         // 270
									$set: {                                                                                                     // 273
										'services.resume.loginTokens': []                                                                          // 274
									}                                                                                                           // 273
								});                                                                                                          // 272
								Meteor.users.update({                                                                                        // 277
									_id: loggedOutUser[0]._id                                                                                   // 278
								}, {                                                                                                         // 277
									$unset: {                                                                                                   // 280
										'services.saml': ''                                                                                        // 281
									}                                                                                                           // 280
								});                                                                                                          // 279
							} else {                                                                                                      // 284
								throw new Meteor.Error('Found multiple users matching SAML inResponseTo fields');                            // 285
							}                                                                                                             // 286
						};                                                                                                             // 287
                                                                                                                     //
						fiber(function () {                                                                                            // 289
							logOutUser(result);                                                                                           // 290
						}).run();                                                                                                      // 291
						res.writeHead(302, {                                                                                           // 294
							'Location': req.query.RelayState                                                                              // 295
						});                                                                                                            // 294
						res.end();                                                                                                     // 297
					} //  else {                                                                                                    // 298
					// 	// TBD thinking of sth meaning full.                                                                        // 300
					// }                                                                                                            // 301
                                                                                                                     //
				});                                                                                                              // 302
                                                                                                                     //
				break;                                                                                                           // 303
                                                                                                                     //
			case 'sloRedirect':                                                                                               // 304
				res.writeHead(302, {                                                                                             // 305
					// credentialToken here is the SAML LogOut Request that we'll send back to IDP                                  // 306
					'Location': req.query.redirect                                                                                  // 307
				});                                                                                                              // 305
				res.end();                                                                                                       // 309
				break;                                                                                                           // 310
                                                                                                                     //
			case 'authorize':                                                                                                 // 311
				service.callbackUrl = Meteor.absoluteUrl("_saml/validate/" + service.provider);                                  // 312
				service.id = samlObject.credentialToken;                                                                         // 313
				_saml = new SAML(service);                                                                                       // 314
                                                                                                                     //
				_saml.getAuthorizeUrl(req, function (err, url) {                                                                 // 315
					if (err) {                                                                                                      // 316
						throw new Error('Unable to generate authorize url');                                                           // 317
					}                                                                                                               // 318
                                                                                                                     //
					res.writeHead(302, {                                                                                            // 319
						'Location': url                                                                                                // 320
					});                                                                                                             // 319
					res.end();                                                                                                      // 322
				});                                                                                                              // 323
                                                                                                                     //
				break;                                                                                                           // 324
                                                                                                                     //
			case 'validate':                                                                                                  // 325
				_saml = new SAML(service);                                                                                       // 326
				Accounts.saml.RelayState = req.body.RelayState;                                                                  // 327
                                                                                                                     //
				_saml.validateResponse(req.body.SAMLResponse, req.body.RelayState, function (err, profile /*, loggedOut*/) {     // 328
					if (err) {                                                                                                      // 329
						throw new Error("Unable to validate response url: " + err);                                                    // 330
					}                                                                                                               // 331
                                                                                                                     //
					var credentialToken = profile.inResponseToId || profile.InResponseTo || samlObject.credentialToken;             // 333
                                                                                                                     //
					if (!credentialToken) {                                                                                         // 334
						// No credentialToken in IdP-initiated SSO                                                                     // 335
						var saml_idp_credentialToken = Random.id();                                                                    // 336
						Accounts.saml._loginResultForCredentialToken[saml_idp_credentialToken] = {                                     // 337
							profile: profile                                                                                              // 338
						};                                                                                                             // 337
						var url = Meteor.absoluteUrl('home') + "?saml_idp_credentialToken=" + saml_idp_credentialToken;                // 340
						res.writeHead(302, {                                                                                           // 341
							'Location': url                                                                                               // 342
						});                                                                                                            // 341
						res.end();                                                                                                     // 344
					} else {                                                                                                        // 345
						Accounts.saml._loginResultForCredentialToken[credentialToken] = {                                              // 346
							profile: profile                                                                                              // 347
						};                                                                                                             // 346
						closePopup(res);                                                                                               // 349
					}                                                                                                               // 350
				});                                                                                                              // 351
                                                                                                                     //
				break;                                                                                                           // 352
                                                                                                                     //
			default:                                                                                                          // 353
				throw new Error("Unexpected SAML action " + samlObject.actionName);                                              // 354
		}                                                                                                                  // 245
	} catch (err) {                                                                                                     // 357
		closePopup(res, err);                                                                                              // 358
	}                                                                                                                   // 359
}; // Listen to incoming SAML http requests                                                                          // 360
                                                                                                                     //
                                                                                                                     //
WebApp.connectHandlers.use(connect.bodyParser()).use(function (req, res, next) {                                     // 363
	// Need to create a fiber since we're using synchronous http calls and nothing                                      // 364
	// else is wrapping this in a fiber automatically                                                                   // 365
	fiber(function () {                                                                                                 // 366
		middleware(req, res, next);                                                                                        // 367
	}).run();                                                                                                           // 368
});                                                                                                                  // 369
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"saml_utils.js":function(require){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/steffo_meteor-accounts-saml/saml_utils.js                                                                //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/* globals SAML:true */var zlib = Npm.require('zlib');                                                               // 1
                                                                                                                     //
var xml2js = Npm.require('xml2js');                                                                                  // 4
                                                                                                                     //
var xmlCrypto = Npm.require('xml-crypto');                                                                           // 5
                                                                                                                     //
var crypto = Npm.require('crypto');                                                                                  // 6
                                                                                                                     //
var xmldom = Npm.require('xmldom');                                                                                  // 7
                                                                                                                     //
var querystring = Npm.require('querystring');                                                                        // 8
                                                                                                                     //
var xmlbuilder = Npm.require('xmlbuilder'); // var prefixMatch = new RegExp(/(?!xmlns)^.*:/);                        // 9
                                                                                                                     //
                                                                                                                     //
SAML = function (options) {                                                                                          // 14
	this.options = this.initialize(options);                                                                            // 15
}; // var stripPrefix = function(str) {                                                                              // 16
// 	return str.replace(prefixMatch, '');                                                                             // 19
// };                                                                                                                // 20
                                                                                                                     //
                                                                                                                     //
SAML.prototype.initialize = function (options) {                                                                     // 22
	if (!options) {                                                                                                     // 23
		options = {};                                                                                                      // 24
	}                                                                                                                   // 25
                                                                                                                     //
	if (!options.protocol) {                                                                                            // 27
		options.protocol = 'https://';                                                                                     // 28
	}                                                                                                                   // 29
                                                                                                                     //
	if (!options.path) {                                                                                                // 31
		options.path = '/saml/consume';                                                                                    // 32
	}                                                                                                                   // 33
                                                                                                                     //
	if (!options.issuer) {                                                                                              // 35
		options.issuer = 'onelogin_saml';                                                                                  // 36
	}                                                                                                                   // 37
                                                                                                                     //
	if (options.identifierFormat === undefined) {                                                                       // 39
		options.identifierFormat = 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress';                               // 40
	}                                                                                                                   // 41
                                                                                                                     //
	if (options.authnContext === undefined) {                                                                           // 43
		options.authnContext = 'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport';                        // 44
	}                                                                                                                   // 45
                                                                                                                     //
	return options;                                                                                                     // 47
};                                                                                                                   // 48
                                                                                                                     //
SAML.prototype.generateUniqueID = function () {                                                                      // 50
	var chars = 'abcdef0123456789';                                                                                     // 51
	var uniqueID = '';                                                                                                  // 52
                                                                                                                     //
	for (var i = 0; i < 20; i++) {                                                                                      // 53
		uniqueID += chars.substr(Math.floor(Math.random() * 15), 1);                                                       // 54
	}                                                                                                                   // 55
                                                                                                                     //
	return uniqueID;                                                                                                    // 56
};                                                                                                                   // 57
                                                                                                                     //
SAML.prototype.generateInstant = function () {                                                                       // 59
	return new Date().toISOString();                                                                                    // 60
};                                                                                                                   // 61
                                                                                                                     //
SAML.prototype.signRequest = function (xml) {                                                                        // 63
	var signer = crypto.createSign('RSA-SHA1');                                                                         // 64
	signer.update(xml);                                                                                                 // 65
	return signer.sign(this.options.privateKey, 'base64');                                                              // 66
};                                                                                                                   // 67
                                                                                                                     //
SAML.prototype.generateAuthorizeRequest = function (req) {                                                           // 69
	var id = "_" + this.generateUniqueID();                                                                             // 70
	var instant = this.generateInstant(); // Post-auth destination                                                      // 71
                                                                                                                     //
	var callbackUrl = void 0;                                                                                           // 74
                                                                                                                     //
	if (this.options.callbackUrl) {                                                                                     // 75
		callbackUrl = this.options.callbackUrl;                                                                            // 76
	} else {                                                                                                            // 77
		callbackUrl = this.options.protocol + req.headers.host + this.options.path;                                        // 78
	}                                                                                                                   // 79
                                                                                                                     //
	if (this.options.id) {                                                                                              // 81
		id = this.options.id;                                                                                              // 82
	}                                                                                                                   // 83
                                                                                                                     //
	var request = "<samlp:AuthnRequest xmlns:samlp=\"urn:oasis:names:tc:SAML:2.0:protocol\" ID=\"" + id + "\" Version=\"2.0\" IssueInstant=\"" + instant + "\" ProtocolBinding=\"urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST\" AssertionConsumerServiceURL=\"" + callbackUrl + "\" Destination=\"" + this.options.entryPoint + "\">" + ("<saml:Issuer xmlns:saml=\"urn:oasis:names:tc:SAML:2.0:assertion\">" + this.options.issuer + "</saml:Issuer>\n");
                                                                                                                     //
	if (this.options.identifierFormat) {                                                                                // 91
		request += "<samlp:NameIDPolicy xmlns:samlp=\"urn:oasis:names:tc:SAML:2.0:protocol\" Format=\"" + this.options.identifierFormat + "\" AllowCreate=\"true\"></samlp:NameIDPolicy>\n";
	}                                                                                                                   // 94
                                                                                                                     //
	request += '<samlp:RequestedAuthnContext xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" Comparison="exact">' + '<saml:AuthnContextClassRef xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</saml:AuthnContextClassRef></samlp:RequestedAuthnContext>\n' + '</samlp:AuthnRequest>';
	return request;                                                                                                     // 101
};                                                                                                                   // 102
                                                                                                                     //
SAML.prototype.generateLogoutRequest = function (options) {                                                          // 104
	// options should be of the form                                                                                    // 105
	// nameId: <nameId as submitted during SAML SSO>                                                                    // 106
	// sessionIndex: sessionIndex                                                                                       // 107
	// --- NO SAMLsettings: <Meteor.setting.saml  entry for the provider you want to SLO from                           // 108
	var id = "_" + this.generateUniqueID();                                                                             // 110
	var instant = this.generateInstant();                                                                               // 111
	var request = "" + ('<samlp:LogoutRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" ' + 'xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" ID="') + id + "\" Version=\"2.0\" IssueInstant=\"" + instant + "\" Destination=\"" + this.options.idpSLORedirectURL + "\">" + ("<saml:Issuer xmlns:saml=\"urn:oasis:names:tc:SAML:2.0:assertion\">" + this.options.issuer + "</saml:Issuer>") + ("<saml:NameID Format=\"" + this.options.identifierFormat + "\">" + options.nameID + "</saml:NameID>") + '</samlp:LogoutRequest>';
	request = "" + ('<samlp:LogoutRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"  ' + 'ID="') + id + "\" " + 'Version="2.0" ' + ("IssueInstant=\"" + instant + "\" ") + ("Destination=\"" + this.options.idpSLORedirectURL + "\" ") + '>' + ("<saml:Issuer xmlns:saml=\"urn:oasis:names:tc:SAML:2.0:assertion\">" + this.options.issuer + "</saml:Issuer>") + '<saml:NameID xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" ' + 'NameQualifier="http://id.init8.net:8080/openam" ' + ("SPNameQualifier=\"" + this.options.issuer + "\" ") + ("Format=\"" + this.options.identifierFormat + "\">" + options.nameID + "</saml:NameID>") + ("<samlp:SessionIndex xmlns:samlp=\"urn:oasis:names:tc:SAML:2.0:protocol\">" + options.sessionIndex + "</samlp:SessionIndex>") + '</samlp:LogoutRequest>';
                                                                                                                     //
	if (Meteor.settings.debug) {                                                                                        // 134
		console.log('------- SAML Logout request -----------');                                                            // 135
		console.log(request);                                                                                              // 136
	}                                                                                                                   // 137
                                                                                                                     //
	return {                                                                                                            // 138
		request: request,                                                                                                  // 139
		id: id                                                                                                             // 140
	};                                                                                                                  // 138
};                                                                                                                   // 142
                                                                                                                     //
SAML.prototype.requestToUrl = function (request, operation, callback) {                                              // 144
	var self = this;                                                                                                    // 145
	zlib.deflateRaw(request, function (err, buffer) {                                                                   // 146
		if (err) {                                                                                                         // 147
			return callback(err);                                                                                             // 148
		}                                                                                                                  // 149
                                                                                                                     //
		var base64 = buffer.toString('base64');                                                                            // 151
		var target = self.options.entryPoint;                                                                              // 152
                                                                                                                     //
		if (operation === 'logout') {                                                                                      // 154
			if (self.options.idpSLORedirectURL) {                                                                             // 155
				target = self.options.idpSLORedirectURL;                                                                         // 156
			}                                                                                                                 // 157
		}                                                                                                                  // 158
                                                                                                                     //
		if (target.indexOf('?') > 0) {                                                                                     // 160
			target += '&';                                                                                                    // 161
		} else {                                                                                                           // 162
			target += '?';                                                                                                    // 163
		} // TBD. We should really include a proper RelayState here                                                        // 164
                                                                                                                     //
                                                                                                                     //
		var relayState = void 0;                                                                                           // 167
                                                                                                                     //
		if (operation === 'logout') {                                                                                      // 168
			// in case of logout we want to be redirected back to the Meteor app.                                             // 169
			relayState = Meteor.absoluteUrl();                                                                                // 170
		} else {                                                                                                           // 171
			relayState = self.options.provider;                                                                               // 172
		}                                                                                                                  // 173
                                                                                                                     //
		var samlRequest = {                                                                                                // 175
			SAMLRequest: base64,                                                                                              // 176
			RelayState: relayState                                                                                            // 177
		};                                                                                                                 // 175
                                                                                                                     //
		if (self.options.privateCert) {                                                                                    // 180
			samlRequest.SigAlg = 'http://www.w3.org/2000/09/xmldsig#rsa-sha1';                                                // 181
			samlRequest.Signature = self.signRequest(querystring.stringify(samlRequest));                                     // 182
		}                                                                                                                  // 183
                                                                                                                     //
		target += querystring.stringify(samlRequest);                                                                      // 185
                                                                                                                     //
		if (Meteor.settings.debug) {                                                                                       // 187
			console.log("requestToUrl: " + target);                                                                           // 188
		}                                                                                                                  // 189
                                                                                                                     //
		if (operation === 'logout') {                                                                                      // 190
			// in case of logout we want to be redirected back to the Meteor app.                                             // 191
			return callback(null, target);                                                                                    // 192
		} else {                                                                                                           // 194
			callback(null, target);                                                                                           // 195
		}                                                                                                                  // 196
	});                                                                                                                 // 197
};                                                                                                                   // 198
                                                                                                                     //
SAML.prototype.getAuthorizeUrl = function (req, callback) {                                                          // 200
	var request = this.generateAuthorizeRequest(req);                                                                   // 201
	this.requestToUrl(request, 'authorize', callback);                                                                  // 203
};                                                                                                                   // 204
                                                                                                                     //
SAML.prototype.getLogoutUrl = function (req, callback) {                                                             // 206
	var request = this.generateLogoutRequest(req);                                                                      // 207
	this.requestToUrl(request, 'logout', callback);                                                                     // 209
};                                                                                                                   // 210
                                                                                                                     //
SAML.prototype.certToPEM = function (cert) {                                                                         // 212
	cert = cert.match(/.{1,64}/g).join('\n');                                                                           // 213
	cert = "-----BEGIN CERTIFICATE-----\n" + cert;                                                                      // 214
	cert = cert + "\n-----END CERTIFICATE-----\n";                                                                      // 215
	return cert;                                                                                                        // 216
}; // functionfindChilds(node, localName, namespace) {                                                               // 217
// 	var res = [];                                                                                                    // 220
// 	for (var i = 0; i < node.childNodes.length; i++) {                                                               // 221
// 		var child = node.childNodes[i];                                                                                 // 222
// 		if (child.localName === localName && (child.namespaceURI === namespace || !namespace)) {                        // 223
// 			res.push(child);                                                                                               // 224
// 		}                                                                                                               // 225
// 	}                                                                                                                // 226
// 	return res;                                                                                                      // 227
// }                                                                                                                 // 228
                                                                                                                     //
                                                                                                                     //
SAML.prototype.validateSignature = function (xml, cert) {                                                            // 230
	var self = this;                                                                                                    // 231
	var doc = new xmldom.DOMParser().parseFromString(xml);                                                              // 233
	var signature = xmlCrypto.xpath(doc, '//*[local-name(.)=\'Signature\' and namespace-uri(.)=\'http://www.w3.org/2000/09/xmldsig#\']')[0];
	var sig = new xmlCrypto.SignedXml();                                                                                // 236
	sig.keyInfoProvider = {                                                                                             // 238
		getKeyInfo: function () /*key*/{                                                                                   // 239
			return '<X509Data></X509Data>';                                                                                   // 240
		},                                                                                                                 // 241
		getKey: function () /*keyInfo*/{                                                                                   // 242
			return self.certToPEM(cert);                                                                                      // 243
		}                                                                                                                  // 244
	};                                                                                                                  // 238
	sig.loadSignature(signature);                                                                                       // 247
	return sig.checkSignature(xml);                                                                                     // 249
};                                                                                                                   // 250
                                                                                                                     //
SAML.prototype.getElement = function (parentElement, elementName) {                                                  // 252
	if (parentElement["saml:" + elementName]) {                                                                         // 253
		return parentElement["saml:" + elementName];                                                                       // 254
	} else if (parentElement["samlp:" + elementName]) {                                                                 // 255
		return parentElement["samlp:" + elementName];                                                                      // 256
	} else if (parentElement["saml2p:" + elementName]) {                                                                // 257
		return parentElement["saml2p:" + elementName];                                                                     // 258
	} else if (parentElement["saml2:" + elementName]) {                                                                 // 259
		return parentElement["saml2:" + elementName];                                                                      // 260
	}                                                                                                                   // 261
                                                                                                                     //
	return parentElement[elementName];                                                                                  // 262
};                                                                                                                   // 263
                                                                                                                     //
SAML.prototype.validateLogoutResponse = function (samlResponse, callback) {                                          // 265
	var self = this;                                                                                                    // 266
	var compressedSAMLResponse = new Buffer(samlResponse, 'base64');                                                    // 268
	zlib.inflateRaw(compressedSAMLResponse, function (err, decoded) {                                                   // 269
		if (err) {                                                                                                         // 271
			if (Meteor.settings.debug) {                                                                                      // 272
				console.log(err);                                                                                                // 273
			}                                                                                                                 // 274
		} else {                                                                                                           // 275
			var parser = new xml2js.Parser({                                                                                  // 276
				explicitRoot: true                                                                                               // 277
			});                                                                                                               // 276
			parser.parseString(decoded, function (err, doc) {                                                                 // 279
				var response = self.getElement(doc, 'LogoutResponse');                                                           // 280
                                                                                                                     //
				if (response) {                                                                                                  // 282
					// TBD. Check if this msg corresponds to one we sent                                                            // 283
					var inResponseTo = response.$.InResponseTo;                                                                     // 284
                                                                                                                     //
					if (Meteor.settings.debug) {                                                                                    // 285
						console.log("In Response to: " + inResponseTo);                                                                // 286
					}                                                                                                               // 287
                                                                                                                     //
					var status = self.getElement(response, 'Status');                                                               // 288
					var statusCode = self.getElement(status[0], 'StatusCode')[0].$.Value;                                           // 289
                                                                                                                     //
					if (Meteor.settings.debug) {                                                                                    // 290
						console.log("StatusCode: " + JSON.stringify(statusCode));                                                      // 291
					}                                                                                                               // 292
                                                                                                                     //
					if (statusCode === 'urn:oasis:names:tc:SAML:2.0:status:Success') {                                              // 293
						// In case of a successful logout at IDP we return inResponseTo value.                                         // 294
						// This is the only way how we can identify the Meteor user (as we don't use Session Cookies)                  // 295
						callback(null, inResponseTo);                                                                                  // 296
					} else {                                                                                                        // 297
						callback('Error. Logout not confirmed by IDP', null);                                                          // 298
					}                                                                                                               // 299
				} else {                                                                                                         // 300
					callback('No Response Found', null);                                                                            // 301
				}                                                                                                                // 302
			});                                                                                                               // 303
		}                                                                                                                  // 304
	});                                                                                                                 // 306
};                                                                                                                   // 307
                                                                                                                     //
SAML.prototype.validateResponse = function (samlResponse, relayState, callback) {                                    // 309
	var self = this;                                                                                                    // 310
	var xml = new Buffer(samlResponse, 'base64').toString('utf8'); // We currently use RelayState to save SAML provider
                                                                                                                     //
	if (Meteor.settings.debug) {                                                                                        // 313
		console.log("Validating response with relay state: " + xml);                                                       // 314
	}                                                                                                                   // 315
                                                                                                                     //
	var parser = new xml2js.Parser({                                                                                    // 316
		explicitRoot: true                                                                                                 // 317
	});                                                                                                                 // 316
	parser.parseString(xml, function (err, doc) {                                                                       // 320
		// Verify signature                                                                                                // 321
		if (Meteor.settings.debug) {                                                                                       // 322
			console.log('Verify signature');                                                                                  // 323
		}                                                                                                                  // 324
                                                                                                                     //
		if (self.options.cert && !self.validateSignature(xml, self.options.cert)) {                                        // 325
			if (Meteor.settings.debug) {                                                                                      // 326
				console.log('Signature WRONG');                                                                                  // 327
			}                                                                                                                 // 328
                                                                                                                     //
			return callback(new Error('Invalid signature'), null, false);                                                     // 329
		}                                                                                                                  // 330
                                                                                                                     //
		if (Meteor.settings.debug) {                                                                                       // 331
			console.log('Signature OK');                                                                                      // 332
		}                                                                                                                  // 333
                                                                                                                     //
		var response = self.getElement(doc, 'Response');                                                                   // 334
                                                                                                                     //
		if (Meteor.settings.debug) {                                                                                       // 335
			console.log('Got response');                                                                                      // 336
		}                                                                                                                  // 337
                                                                                                                     //
		if (response) {                                                                                                    // 338
			var assertion = self.getElement(response, 'Assertion');                                                           // 339
                                                                                                                     //
			if (!assertion) {                                                                                                 // 340
				return callback(new Error('Missing SAML assertion'), null, false);                                               // 341
			}                                                                                                                 // 342
                                                                                                                     //
			var profile = {};                                                                                                 // 344
                                                                                                                     //
			if (response.$ && response.$.InResponseTo) {                                                                      // 346
				profile.inResponseToId = response.$.InResponseTo;                                                                // 347
			}                                                                                                                 // 348
                                                                                                                     //
			var issuer = self.getElement(assertion[0], 'Issuer');                                                             // 350
                                                                                                                     //
			if (issuer) {                                                                                                     // 351
				profile.issuer = issuer[0]._;                                                                                    // 352
			}                                                                                                                 // 353
                                                                                                                     //
			var subject = self.getElement(assertion[0], 'Subject');                                                           // 355
                                                                                                                     //
			if (subject) {                                                                                                    // 357
				var nameID = self.getElement(subject[0], 'NameID');                                                              // 358
                                                                                                                     //
				if (nameID) {                                                                                                    // 359
					profile.nameID = nameID[0]._;                                                                                   // 360
                                                                                                                     //
					if (nameID[0].$.Format) {                                                                                       // 362
						profile.nameIDFormat = nameID[0].$.Format;                                                                     // 363
					}                                                                                                               // 364
				}                                                                                                                // 365
			}                                                                                                                 // 366
                                                                                                                     //
			var authnStatement = self.getElement(assertion[0], 'AuthnStatement');                                             // 368
                                                                                                                     //
			if (authnStatement) {                                                                                             // 370
				if (authnStatement[0].$.SessionIndex) {                                                                          // 371
					profile.sessionIndex = authnStatement[0].$.SessionIndex;                                                        // 373
                                                                                                                     //
					if (Meteor.settings.debug) {                                                                                    // 374
						console.log("Session Index: " + profile.sessionIndex);                                                         // 375
					}                                                                                                               // 376
				} else if (Meteor.settings.debug) {                                                                              // 377
					console.log('No Session Index Found');                                                                          // 378
				}                                                                                                                // 379
			} else if (Meteor.settings.debug) {                                                                               // 382
				console.log('No AuthN Statement found');                                                                         // 383
			}                                                                                                                 // 384
                                                                                                                     //
			var attributeStatement = self.getElement(assertion[0], 'AttributeStatement');                                     // 386
                                                                                                                     //
			if (attributeStatement) {                                                                                         // 387
				var attributes = self.getElement(attributeStatement[0], 'Attribute');                                            // 388
                                                                                                                     //
				if (attributes) {                                                                                                // 390
					attributes.forEach(function (attribute) {                                                                       // 391
						var value = self.getElement(attribute, 'AttributeValue');                                                      // 392
                                                                                                                     //
						if (typeof value[0] === 'string') {                                                                            // 393
							profile[attribute.$.Name] = value[0];                                                                         // 394
						} else {                                                                                                       // 395
							profile[attribute.$.Name] = value[0]._;                                                                       // 396
						}                                                                                                              // 397
					});                                                                                                             // 398
				}                                                                                                                // 399
                                                                                                                     //
				if (!profile.mail && profile['urn:oid:0.9.2342.19200300.100.1.3']) {                                             // 401
					// See http://www.incommonfederation.org/attributesummary.html for definition of attribute OIDs                 // 402
					profile.mail = profile['urn:oid:0.9.2342.19200300.100.1.3'];                                                    // 403
				}                                                                                                                // 404
                                                                                                                     //
				if (!profile.email && profile.mail) {                                                                            // 406
					profile.email = profile.mail;                                                                                   // 407
				}                                                                                                                // 408
			}                                                                                                                 // 409
                                                                                                                     //
			if (!profile.email && profile.nameID && profile.nameIDFormat && profile.nameIDFormat.indexOf('emailAddress') >= 0) {
				profile.email = profile.nameID;                                                                                  // 412
			}                                                                                                                 // 413
                                                                                                                     //
			if (Meteor.settings.debug) {                                                                                      // 414
				console.log("NameID: " + JSON.stringify(profile));                                                               // 415
			}                                                                                                                 // 416
                                                                                                                     //
			callback(null, profile, false);                                                                                   // 418
		} else {                                                                                                           // 419
			var logoutResponse = self.getElement(doc, 'LogoutResponse');                                                      // 420
                                                                                                                     //
			if (logoutResponse) {                                                                                             // 422
				callback(null, null, true);                                                                                      // 423
			} else {                                                                                                          // 424
				return callback(new Error('Unknown SAML response message'), null, false);                                        // 425
			}                                                                                                                 // 426
		}                                                                                                                  // 428
	});                                                                                                                 // 429
};                                                                                                                   // 430
                                                                                                                     //
var decryptionCert = void 0;                                                                                         // 432
                                                                                                                     //
SAML.prototype.generateServiceProviderMetadata = function (callbackUrl) {                                            // 433
	if (!decryptionCert) {                                                                                              // 435
		decryptionCert = this.options.privateCert;                                                                         // 436
	}                                                                                                                   // 437
                                                                                                                     //
	if (!this.options.callbackUrl && !callbackUrl) {                                                                    // 439
		throw new Error('Unable to generate service provider metadata when callbackUrl option is not set');                // 440
	}                                                                                                                   // 442
                                                                                                                     //
	var metadata = {                                                                                                    // 444
		'EntityDescriptor': {                                                                                              // 445
			'@xmlns': 'urn:oasis:names:tc:SAML:2.0:metadata',                                                                 // 446
			'@xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',                                                                // 447
			'@entityID': this.options.issuer,                                                                                 // 448
			'SPSSODescriptor': {                                                                                              // 449
				'@protocolSupportEnumeration': 'urn:oasis:names:tc:SAML:2.0:protocol',                                           // 450
				'SingleLogoutService': {                                                                                         // 451
					'@Binding': 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect',                                               // 452
					'@Location': Meteor.absoluteUrl() + "_saml/logout/" + this.options.provider + "/",                              // 453
					'@ResponseLocation': Meteor.absoluteUrl() + "_saml/logout/" + this.options.provider + "/"                       // 454
				},                                                                                                               // 451
				'NameIDFormat': this.options.identifierFormat,                                                                   // 456
				'AssertionConsumerService': {                                                                                    // 457
					'@index': '1',                                                                                                  // 458
					'@isDefault': 'true',                                                                                           // 459
					'@Binding': 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',                                                   // 460
					'@Location': callbackUrl                                                                                        // 461
				}                                                                                                                // 457
			}                                                                                                                 // 449
		}                                                                                                                  // 445
	};                                                                                                                  // 444
                                                                                                                     //
	if (this.options.privateKey) {                                                                                      // 467
		if (!decryptionCert) {                                                                                             // 468
			throw new Error('Missing decryptionCert while generating metadata for decrypting service provider');              // 469
		}                                                                                                                  // 471
                                                                                                                     //
		decryptionCert = decryptionCert.replace(/-+BEGIN CERTIFICATE-+\r?\n?/, '');                                        // 473
		decryptionCert = decryptionCert.replace(/-+END CERTIFICATE-+\r?\n?/, '');                                          // 474
		decryptionCert = decryptionCert.replace(/\r\n/g, '\n');                                                            // 475
		metadata['EntityDescriptor']['SPSSODescriptor']['KeyDescriptor'] = {                                               // 477
			'ds:KeyInfo': {                                                                                                   // 478
				'ds:X509Data': {                                                                                                 // 479
					'ds:X509Certificate': {                                                                                         // 480
						'#text': decryptionCert                                                                                        // 481
					}                                                                                                               // 480
				}                                                                                                                // 479
			},                                                                                                                // 478
			'#list': [// this should be the set that the xmlenc library supports                                              // 485
			{                                                                                                                 // 487
				'EncryptionMethod': {                                                                                            // 488
					'@Algorithm': 'http://www.w3.org/2001/04/xmlenc#aes256-cbc'                                                     // 489
				}                                                                                                                // 488
			}, {                                                                                                              // 487
				'EncryptionMethod': {                                                                                            // 493
					'@Algorithm': 'http://www.w3.org/2001/04/xmlenc#aes128-cbc'                                                     // 494
				}                                                                                                                // 493
			}, {                                                                                                              // 492
				'EncryptionMethod': {                                                                                            // 498
					'@Algorithm': 'http://www.w3.org/2001/04/xmlenc#tripledes-cbc'                                                  // 499
				}                                                                                                                // 498
			}]                                                                                                                // 497
		};                                                                                                                 // 477
	}                                                                                                                   // 504
                                                                                                                     //
	return xmlbuilder.create(metadata).end({                                                                            // 506
		pretty: true,                                                                                                      // 507
		indent: '  ',                                                                                                      // 508
		newline: '\n'                                                                                                      // 509
	});                                                                                                                 // 506
};                                                                                                                   // 511
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"saml_rocketchat.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/steffo_meteor-accounts-saml/saml_rocketchat.js                                                           //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
module.export({                                                                                                      // 1
	updateServices: function () {                                                                                       // 1
		return updateServices;                                                                                             // 1
	},                                                                                                                  // 1
	configureSamlService: function () {                                                                                 // 1
		return configureSamlService;                                                                                       // 1
	},                                                                                                                  // 1
	getSamlConfigs: function () {                                                                                       // 1
		return getSamlConfigs;                                                                                             // 1
	},                                                                                                                  // 1
	debounce: function () {                                                                                             // 1
		return debounce;                                                                                                   // 1
	},                                                                                                                  // 1
	logger: function () {                                                                                               // 1
		return logger;                                                                                                     // 1
	}                                                                                                                   // 1
});                                                                                                                  // 1
var logger = new Logger('steffo:meteor-accounts-saml', {                                                             // 1
	methods: {                                                                                                          // 2
		updated: {                                                                                                         // 3
			type: 'info'                                                                                                      // 4
		}                                                                                                                  // 3
	}                                                                                                                   // 2
});                                                                                                                  // 1
RocketChat.settings.addGroup('SAML');                                                                                // 9
Meteor.methods({                                                                                                     // 11
	addSamlService: function (name) {                                                                                   // 12
		RocketChat.settings.add("SAML_Custom_" + name, false, {                                                            // 13
			type: 'boolean',                                                                                                  // 14
			group: 'SAML',                                                                                                    // 15
			section: name,                                                                                                    // 16
			i18nLabel: 'Accounts_OAuth_Custom_Enable'                                                                         // 17
		});                                                                                                                // 13
		RocketChat.settings.add("SAML_Custom_" + name + "_provider", 'provider-name', {                                    // 19
			type: 'string',                                                                                                   // 20
			group: 'SAML',                                                                                                    // 21
			section: name,                                                                                                    // 22
			i18nLabel: 'SAML_Custom_Provider'                                                                                 // 23
		});                                                                                                                // 19
		RocketChat.settings.add("SAML_Custom_" + name + "_entry_point", 'https://example.com/simplesaml/saml2/idp/SSOService.php', {
			type: 'string',                                                                                                   // 26
			group: 'SAML',                                                                                                    // 27
			section: name,                                                                                                    // 28
			i18nLabel: 'SAML_Custom_Entry_point'                                                                              // 29
		});                                                                                                                // 25
		RocketChat.settings.add("SAML_Custom_" + name + "_idp_slo_redirect_url", 'https://example.com/simplesaml/saml2/idp/SingleLogoutService.php', {
			type: 'string',                                                                                                   // 32
			group: 'SAML',                                                                                                    // 33
			section: name,                                                                                                    // 34
			i18nLabel: 'SAML_Custom_IDP_SLO_Redirect_URL'                                                                     // 35
		});                                                                                                                // 31
		RocketChat.settings.add("SAML_Custom_" + name + "_issuer", 'https://your-rocket-chat/_saml/metadata/provider-name', {
			type: 'string',                                                                                                   // 38
			group: 'SAML',                                                                                                    // 39
			section: name,                                                                                                    // 40
			i18nLabel: 'SAML_Custom_Issuer'                                                                                   // 41
		});                                                                                                                // 37
		RocketChat.settings.add("SAML_Custom_" + name + "_cert", '', {                                                     // 43
			type: 'string',                                                                                                   // 44
			group: 'SAML',                                                                                                    // 45
			section: name,                                                                                                    // 46
			i18nLabel: 'SAML_Custom_Cert',                                                                                    // 47
			multiline: true                                                                                                   // 48
		});                                                                                                                // 43
		RocketChat.settings.add("SAML_Custom_" + name + "_public_cert", '', {                                              // 50
			type: 'string',                                                                                                   // 51
			group: 'SAML',                                                                                                    // 52
			section: name,                                                                                                    // 53
			multiline: true,                                                                                                  // 54
			i18nLabel: 'SAML_Custom_Public_Cert'                                                                              // 55
		});                                                                                                                // 50
		RocketChat.settings.add("SAML_Custom_" + name + "_private_key", '', {                                              // 57
			type: 'string',                                                                                                   // 58
			group: 'SAML',                                                                                                    // 59
			section: name,                                                                                                    // 60
			multiline: true,                                                                                                  // 61
			i18nLabel: 'SAML_Custom_Private_Key'                                                                              // 62
		});                                                                                                                // 57
		RocketChat.settings.add("SAML_Custom_" + name + "_button_label_text", '', {                                        // 64
			type: 'string',                                                                                                   // 65
			group: 'SAML',                                                                                                    // 66
			section: name,                                                                                                    // 67
			i18nLabel: 'Accounts_OAuth_Custom_Button_Label_Text'                                                              // 68
		});                                                                                                                // 64
		RocketChat.settings.add("SAML_Custom_" + name + "_button_label_color", '#FFFFFF', {                                // 70
			type: 'string',                                                                                                   // 71
			group: 'SAML',                                                                                                    // 72
			section: name,                                                                                                    // 73
			i18nLabel: 'Accounts_OAuth_Custom_Button_Label_Color'                                                             // 74
		});                                                                                                                // 70
		RocketChat.settings.add("SAML_Custom_" + name + "_button_color", '#13679A', {                                      // 76
			type: 'string',                                                                                                   // 77
			group: 'SAML',                                                                                                    // 78
			section: name,                                                                                                    // 79
			i18nLabel: 'Accounts_OAuth_Custom_Button_Color'                                                                   // 80
		});                                                                                                                // 76
		RocketChat.settings.add("SAML_Custom_" + name + "_generate_username", false, {                                     // 82
			type: 'boolean',                                                                                                  // 83
			group: 'SAML',                                                                                                    // 84
			section: name,                                                                                                    // 85
			i18nLabel: 'SAML_Custom_Generate_Username'                                                                        // 86
		});                                                                                                                // 82
	}                                                                                                                   // 88
});                                                                                                                  // 11
                                                                                                                     //
var getSamlConfigs = function (service) {                                                                            // 91
	return {                                                                                                            // 92
		buttonLabelText: RocketChat.settings.get(service.key + "_button_label_text"),                                      // 93
		buttonLabelColor: RocketChat.settings.get(service.key + "_button_label_color"),                                    // 94
		buttonColor: RocketChat.settings.get(service.key + "_button_color"),                                               // 95
		clientConfig: {                                                                                                    // 96
			provider: RocketChat.settings.get(service.key + "_provider")                                                      // 97
		},                                                                                                                 // 96
		entryPoint: RocketChat.settings.get(service.key + "_entry_point"),                                                 // 99
		idpSLORedirectURL: RocketChat.settings.get(service.key + "_idp_slo_redirect_url"),                                 // 100
		generateUsername: RocketChat.settings.get(service.key + "_generate_username"),                                     // 101
		issuer: RocketChat.settings.get(service.key + "_issuer"),                                                          // 102
		secret: {                                                                                                          // 103
			privateKey: RocketChat.settings.get(service.key + "_private_key"),                                                // 104
			publicCert: RocketChat.settings.get(service.key + "_public_cert"),                                                // 105
			cert: RocketChat.settings.get(service.key + "_cert")                                                              // 106
		}                                                                                                                  // 103
	};                                                                                                                  // 92
};                                                                                                                   // 109
                                                                                                                     //
var debounce = function (fn, delay) {                                                                                // 111
	var timer = null;                                                                                                   // 112
	return function () {                                                                                                // 113
		if (timer != null) {                                                                                               // 114
			Meteor.clearTimeout(timer);                                                                                       // 115
		}                                                                                                                  // 116
                                                                                                                     //
		return timer = Meteor.setTimeout(fn, delay);                                                                       // 117
	};                                                                                                                  // 118
};                                                                                                                   // 119
                                                                                                                     //
var serviceName = 'saml';                                                                                            // 120
                                                                                                                     //
var configureSamlService = function (samlConfigs) {                                                                  // 122
	var privateCert = false;                                                                                            // 123
	var privateKey = false;                                                                                             // 124
                                                                                                                     //
	if (samlConfigs.secret.privateKey && samlConfigs.secret.publicCert) {                                               // 125
		privateKey = samlConfigs.secret.privateKey;                                                                        // 126
		privateCert = samlConfigs.secret.publicCert;                                                                       // 127
	} else if (samlConfigs.secret.privateKey || samlConfigs.secret.publicCert) {                                        // 128
		logger.error('You must specify both cert and key files.');                                                         // 129
	} // TODO: the function configureSamlService is called many times and Accounts.saml.settings.generateUsername keeps just the last value
                                                                                                                     //
                                                                                                                     //
	Accounts.saml.settings.generateUsername = samlConfigs.generateUsername;                                             // 132
	return {                                                                                                            // 133
		provider: samlConfigs.clientConfig.provider,                                                                       // 134
		entryPoint: samlConfigs.entryPoint,                                                                                // 135
		idpSLORedirectURL: samlConfigs.idpSLORedirectURL,                                                                  // 136
		issuer: samlConfigs.issuer,                                                                                        // 137
		cert: samlConfigs.secret.cert,                                                                                     // 138
		privateCert: privateCert,                                                                                          // 139
		privateKey: privateKey                                                                                             // 140
	};                                                                                                                  // 133
};                                                                                                                   // 142
                                                                                                                     //
var updateServices = debounce(function () {                                                                          // 144
	var services = RocketChat.settings.get(/^(SAML_Custom_)[a-z]+$/i);                                                  // 145
	Accounts.saml.settings.providers = services.map(function (service) {                                                // 146
		if (service.value === true) {                                                                                      // 147
			var samlConfigs = getSamlConfigs(service);                                                                        // 148
			logger.updated(service.key);                                                                                      // 149
			ServiceConfiguration.configurations.upsert({                                                                      // 150
				service: serviceName.toLowerCase()                                                                               // 151
			}, {                                                                                                              // 150
				$set: samlConfigs                                                                                                // 153
			});                                                                                                               // 152
			return configureSamlService(samlConfigs);                                                                         // 155
		} else {                                                                                                           // 156
			ServiceConfiguration.configurations.remove({                                                                      // 157
				service: serviceName.toLowerCase()                                                                               // 158
			});                                                                                                               // 157
		}                                                                                                                  // 160
	}).filter(function (e) {                                                                                            // 161
		return e;                                                                                                          // 161
	});                                                                                                                 // 161
}, 2000);                                                                                                            // 162
RocketChat.settings.get(/^SAML_.+/, updateServices);                                                                 // 165
Meteor.startup(function () {                                                                                         // 167
	return Meteor.call('addSamlService', 'Default');                                                                    // 168
});                                                                                                                  // 169
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/steffo:meteor-accounts-saml/saml_server.js");
require("./node_modules/meteor/steffo:meteor-accounts-saml/saml_utils.js");
require("./node_modules/meteor/steffo:meteor-accounts-saml/saml_rocketchat.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['steffo:meteor-accounts-saml'] = {};

})();

//# sourceMappingURL=steffo_meteor-accounts-saml.js.map

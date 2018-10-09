(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var LDAPJS = Package['rocketchat:ldapjs'].LDAPJS;
var Logger = Package['rocketchat:logger'].Logger;
var SystemLogger = Package['rocketchat:logger'].SystemLogger;
var LoggerManager = Package['rocketchat:logger'].LoggerManager;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RocketChatTabBar = Package['rocketchat:lib'].RocketChatTabBar;
var slugify = Package['yasaricli:slugify'].slugify;
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
var LDAP, slug, getLdapUsername, getLdapUserUniqueID, getDataToSyncUserData, syncUserData, addLdapUser, sync;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:ldap":{"server":{"ldap.js":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/rocketchat_ldap/server/ldap.js                                                                    //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                       //
                                                                                                              //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                              //
                                                                                                              //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }             //
                                                                                                              //
/* globals LDAP:true, LDAPJS */ /* exported LDAP */var ldapjs = LDAPJS;                                       // 1
var logger = new Logger('LDAP', {                                                                             // 6
	sections: {                                                                                                  // 7
		connection: 'Connection',                                                                                   // 8
		bind: 'Bind',                                                                                               // 9
		search: 'Search',                                                                                           // 10
		auth: 'Auth'                                                                                                // 11
	}                                                                                                            // 7
});                                                                                                           // 6
                                                                                                              //
LDAP = function () {                                                                                          // 15
	function LDAP() {                                                                                            // 16
		(0, _classCallCheck3.default)(this, LDAP);                                                                  // 16
		var self = this;                                                                                            // 17
		self.ldapjs = ldapjs;                                                                                       // 19
		self.connected = false;                                                                                     // 21
		self.options = {                                                                                            // 23
			host: RocketChat.settings.get('LDAP_Host'),                                                                // 24
			port: RocketChat.settings.get('LDAP_Port'),                                                                // 25
			connect_timeout: RocketChat.settings.get('LDAP_Connect_Timeout'),                                          // 26
			idle_timeout: RocketChat.settings.get('LDAP_Idle_Timeout'),                                                // 27
			encryption: RocketChat.settings.get('LDAP_Encryption'),                                                    // 28
			ca_cert: RocketChat.settings.get('LDAP_CA_Cert'),                                                          // 29
			reject_unauthorized: RocketChat.settings.get('LDAP_Reject_Unauthorized') || false,                         // 30
			domain_base: RocketChat.settings.get('LDAP_Domain_Base'),                                                  // 31
			use_custom_domain_search: RocketChat.settings.get('LDAP_Use_Custom_Domain_Search'),                        // 32
			custom_domain_search: RocketChat.settings.get('LDAP_Custom_Domain_Search'),                                // 33
			domain_search_user: RocketChat.settings.get('LDAP_Domain_Search_User'),                                    // 34
			domain_search_password: RocketChat.settings.get('LDAP_Domain_Search_Password'),                            // 35
			domain_search_filter: RocketChat.settings.get('LDAP_Domain_Search_Filter'),                                // 36
			domain_search_user_id: RocketChat.settings.get('LDAP_Domain_Search_User_ID'),                              // 37
			domain_search_object_class: RocketChat.settings.get('LDAP_Domain_Search_Object_Class'),                    // 38
			domain_search_object_category: RocketChat.settings.get('LDAP_Domain_Search_Object_Category'),              // 39
			group_filter_enabled: RocketChat.settings.get('LDAP_Group_Filter_Enable'),                                 // 40
			group_filter_object_class: RocketChat.settings.get('LDAP_Group_Filter_ObjectClass'),                       // 41
			group_filter_group_id_attribute: RocketChat.settings.get('LDAP_Group_Filter_Group_Id_Attribute'),          // 42
			group_filter_group_member_attribute: RocketChat.settings.get('LDAP_Group_Filter_Group_Member_Attribute'),  // 43
			group_filter_group_member_format: RocketChat.settings.get('LDAP_Group_Filter_Group_Member_Format'),        // 44
			group_filter_group_name: RocketChat.settings.get('LDAP_Group_Filter_Group_Name')                           // 45
		};                                                                                                          // 23
		self.connectSync = Meteor.wrapAsync(self.connectAsync, self);                                               // 48
		self.searchAllSync = Meteor.wrapAsync(self.searchAllAsync, self);                                           // 49
	}                                                                                                            // 50
                                                                                                              //
	LDAP.prototype.connectAsync = function () {                                                                  // 15
		function connectAsync(callback) {                                                                           // 15
			var self = this;                                                                                           // 53
			logger.connection.info('Init setup');                                                                      // 55
			var replied = false;                                                                                       // 57
			var connectionOptions = {                                                                                  // 59
				url: self.options.host + ":" + self.options.port,                                                         // 60
				timeout: 1000 * 60 * 10,                                                                                  // 61
				connectTimeout: self.options.connect_timeout,                                                             // 62
				idleTimeout: self.options.idle_timeout,                                                                   // 63
				reconnect: false                                                                                          // 64
			};                                                                                                         // 59
			var tlsOptions = {                                                                                         // 67
				rejectUnauthorized: self.options.reject_unauthorized                                                      // 68
			};                                                                                                         // 67
                                                                                                              //
			if (self.options.ca_cert && self.options.ca_cert !== '') {                                                 // 71
				// Split CA cert into array of strings                                                                    // 72
				var chainLines = RocketChat.settings.get('LDAP_CA_Cert').split('\n');                                     // 73
				var cert = [];                                                                                            // 74
				var ca = [];                                                                                              // 75
				chainLines.forEach(function (line) {                                                                      // 76
					cert.push(line);                                                                                         // 77
                                                                                                              //
					if (line.match(/-END CERTIFICATE-/)) {                                                                   // 78
						ca.push(cert.join('\n'));                                                                               // 79
						cert = [];                                                                                              // 80
					}                                                                                                        // 81
				});                                                                                                       // 82
				tlsOptions.ca = ca;                                                                                       // 83
			}                                                                                                          // 84
                                                                                                              //
			if (self.options.encryption === 'ssl') {                                                                   // 86
				connectionOptions.url = "ldaps://" + connectionOptions.url;                                               // 87
				connectionOptions.tlsOptions = tlsOptions;                                                                // 88
			} else {                                                                                                   // 89
				connectionOptions.url = "ldap://" + connectionOptions.url;                                                // 90
			}                                                                                                          // 91
                                                                                                              //
			logger.connection.info('Connecting', connectionOptions.url);                                               // 93
			logger.connection.debug('connectionOptions', connectionOptions);                                           // 94
			self.client = ldapjs.createClient(connectionOptions);                                                      // 96
			self.bindSync = Meteor.wrapAsync(self.client.bind, self.client);                                           // 98
			self.client.on('error', function (error) {                                                                 // 100
				logger.connection.error('connection', error);                                                             // 101
                                                                                                              //
				if (replied === false) {                                                                                  // 102
					replied = true;                                                                                          // 103
					callback(error, null);                                                                                   // 104
				}                                                                                                         // 105
			});                                                                                                        // 106
                                                                                                              //
			if (self.options.encryption === 'tls') {                                                                   // 108
				// Set host parameter for tls.connect which is used by ldapjs starttls. This shouldn't be needed in newer nodejs versions (e.g v5.6.0).
				// https://github.com/RocketChat/Rocket.Chat/issues/2035                                                  // 111
				// https://github.com/mcavage/node-ldapjs/issues/349                                                      // 112
				tlsOptions.host = self.options.host;                                                                      // 113
				logger.connection.info('Starting TLS');                                                                   // 115
				logger.connection.debug('tlsOptions', tlsOptions);                                                        // 116
				self.client.starttls(tlsOptions, null, function (error, response) {                                       // 118
					if (error) {                                                                                             // 119
						logger.connection.error('TLS connection', error);                                                       // 120
                                                                                                              //
						if (replied === false) {                                                                                // 121
							replied = true;                                                                                        // 122
							callback(error, null);                                                                                 // 123
						}                                                                                                       // 124
                                                                                                              //
						return;                                                                                                 // 125
					}                                                                                                        // 126
                                                                                                              //
					logger.connection.info('TLS connected');                                                                 // 128
					self.connected = true;                                                                                   // 129
                                                                                                              //
					if (replied === false) {                                                                                 // 130
						replied = true;                                                                                         // 131
						callback(null, response);                                                                               // 132
					}                                                                                                        // 133
				});                                                                                                       // 134
			} else {                                                                                                   // 135
				self.client.on('connect', function (response) {                                                           // 136
					logger.connection.info('LDAP connected');                                                                // 137
					self.connected = true;                                                                                   // 138
                                                                                                              //
					if (replied === false) {                                                                                 // 139
						replied = true;                                                                                         // 140
						callback(null, response);                                                                               // 141
					}                                                                                                        // 142
				});                                                                                                       // 143
			}                                                                                                          // 144
                                                                                                              //
			setTimeout(function () {                                                                                   // 146
				if (replied === false) {                                                                                  // 147
					logger.connection.error('connection time out', connectionOptions.timeout);                               // 148
					replied = true;                                                                                          // 149
					callback(new Error('Timeout'));                                                                          // 150
				}                                                                                                         // 151
			}, connectionOptions.timeout);                                                                             // 152
		}                                                                                                           // 153
                                                                                                              //
		return connectAsync;                                                                                        // 15
	}();                                                                                                         // 15
                                                                                                              //
	LDAP.prototype.getDomainBindSearch = function () {                                                           // 15
		function getDomainBindSearch() {                                                                            // 15
			var self = this;                                                                                           // 156
                                                                                                              //
			if (self.options.use_custom_domain_search === true) {                                                      // 158
				var custom_domain_search = void 0;                                                                        // 159
                                                                                                              //
				try {                                                                                                     // 160
					custom_domain_search = JSON.parse(self.options.custom_domain_search);                                    // 161
				} catch (error) {                                                                                         // 162
					throw new Error('Invalid Custom Domain Search JSON');                                                    // 163
				}                                                                                                         // 164
                                                                                                              //
				return {                                                                                                  // 166
					filter: custom_domain_search.filter,                                                                     // 167
					domain_search_user: custom_domain_search.userDN || '',                                                   // 168
					domain_search_password: custom_domain_search.password || ''                                              // 169
				};                                                                                                        // 166
			}                                                                                                          // 171
                                                                                                              //
			var filter = ['(&'];                                                                                       // 173
                                                                                                              //
			if (self.options.domain_search_object_category !== '') {                                                   // 175
				filter.push("(objectCategory=" + self.options.domain_search_object_category + ")");                       // 176
			}                                                                                                          // 177
                                                                                                              //
			if (self.options.domain_search_object_class !== '') {                                                      // 179
				filter.push("(objectclass=" + self.options.domain_search_object_class + ")");                             // 180
			}                                                                                                          // 181
                                                                                                              //
			if (self.options.domain_search_filter !== '') {                                                            // 183
				filter.push("(" + self.options.domain_search_filter + ")");                                               // 184
			}                                                                                                          // 185
                                                                                                              //
			var domain_search_user_id = self.options.domain_search_user_id.split(',');                                 // 187
                                                                                                              //
			if (domain_search_user_id.length === 1) {                                                                  // 188
				filter.push("(" + domain_search_user_id[0] + "=#{username})");                                            // 189
			} else {                                                                                                   // 190
				filter.push('(|');                                                                                        // 191
				domain_search_user_id.forEach(function (item) {                                                           // 192
					filter.push("(" + item + "=#{username})");                                                               // 193
				});                                                                                                       // 194
				filter.push(')');                                                                                         // 195
			}                                                                                                          // 196
                                                                                                              //
			filter.push(')');                                                                                          // 198
			return {                                                                                                   // 200
				filter: filter.join(''),                                                                                  // 201
				domain_search_user: self.options.domain_search_user || '',                                                // 202
				domain_search_password: self.options.domain_search_password || ''                                         // 203
			};                                                                                                         // 200
		}                                                                                                           // 205
                                                                                                              //
		return getDomainBindSearch;                                                                                 // 15
	}();                                                                                                         // 15
                                                                                                              //
	LDAP.prototype.bindIfNecessary = function () {                                                               // 15
		function bindIfNecessary() {                                                                                // 15
			var self = this;                                                                                           // 208
                                                                                                              //
			if (self.domainBinded === true) {                                                                          // 210
				return;                                                                                                   // 211
			}                                                                                                          // 212
                                                                                                              //
			var domain_search = self.getDomainBindSearch();                                                            // 214
                                                                                                              //
			if (domain_search.domain_search_user !== '' && domain_search.domain_search_password !== '') {              // 216
				logger.bind.info('Binding admin user', domain_search.domain_search_user);                                 // 217
				self.bindSync(domain_search.domain_search_user, domain_search.domain_search_password);                    // 218
				self.domainBinded = true;                                                                                 // 219
			}                                                                                                          // 220
		}                                                                                                           // 221
                                                                                                              //
		return bindIfNecessary;                                                                                     // 15
	}();                                                                                                         // 15
                                                                                                              //
	LDAP.prototype.searchUsersSync = function () {                                                               // 15
		function searchUsersSync(username) {                                                                        // 15
			var self = this;                                                                                           // 224
			self.bindIfNecessary();                                                                                    // 226
			var domain_search = self.getDomainBindSearch();                                                            // 228
			var searchOptions = {                                                                                      // 230
				filter: domain_search.filter.replace(/#{username}/g, username),                                           // 231
				scope: 'sub'                                                                                              // 232
			};                                                                                                         // 230
			logger.search.info('Searching user', username);                                                            // 235
			logger.search.debug('searchOptions', searchOptions);                                                       // 236
			logger.search.debug('domain_base', self.options.domain_base);                                              // 237
			return self.searchAllSync(self.options.domain_base, searchOptions);                                        // 239
		}                                                                                                           // 240
                                                                                                              //
		return searchUsersSync;                                                                                     // 15
	}();                                                                                                         // 15
                                                                                                              //
	LDAP.prototype.getUserByIdSync = function () {                                                               // 15
		function getUserByIdSync(id, attribute) {                                                                   // 15
			var self = this;                                                                                           // 243
			self.bindIfNecessary();                                                                                    // 245
			var Unique_Identifier_Field = RocketChat.settings.get('LDAP_Unique_Identifier_Field').split(',');          // 247
			var filter = void 0;                                                                                       // 249
                                                                                                              //
			if (attribute) {                                                                                           // 251
				filter = new self.ldapjs.filters.EqualityFilter({                                                         // 252
					attribute: attribute,                                                                                    // 253
					value: new Buffer(id, 'hex')                                                                             // 254
				});                                                                                                       // 252
			} else {                                                                                                   // 256
				var filters = [];                                                                                         // 257
				Unique_Identifier_Field.forEach(function (item) {                                                         // 258
					filters.push(new self.ldapjs.filters.EqualityFilter({                                                    // 259
						attribute: item,                                                                                        // 260
						value: new Buffer(id, 'hex')                                                                            // 261
					}));                                                                                                     // 259
				});                                                                                                       // 263
				filter = new self.ldapjs.filters.OrFilter({                                                               // 265
					filters: filters                                                                                         // 265
				});                                                                                                       // 265
			}                                                                                                          // 266
                                                                                                              //
			var searchOptions = {                                                                                      // 268
				filter: filter,                                                                                           // 269
				scope: 'sub'                                                                                              // 270
			};                                                                                                         // 268
			logger.search.info('Searching by id', id);                                                                 // 273
			logger.search.debug('search filter', searchOptions.filter.toString());                                     // 274
			logger.search.debug('domain_base', self.options.domain_base);                                              // 275
			var result = self.searchAllSync(self.options.domain_base, searchOptions);                                  // 277
                                                                                                              //
			if (!Array.isArray(result) || result.length === 0) {                                                       // 279
				return;                                                                                                   // 280
			}                                                                                                          // 281
                                                                                                              //
			if (result.length > 1) {                                                                                   // 283
				logger.search.error('Search by id', id, 'returned', result.length, 'records');                            // 284
			}                                                                                                          // 285
                                                                                                              //
			return result[0];                                                                                          // 287
		}                                                                                                           // 288
                                                                                                              //
		return getUserByIdSync;                                                                                     // 15
	}();                                                                                                         // 15
                                                                                                              //
	LDAP.prototype.getUserByUsernameSync = function () {                                                         // 15
		function getUserByUsernameSync(username) {                                                                  // 15
			var self = this;                                                                                           // 291
			self.bindIfNecessary();                                                                                    // 293
			var domain_search = self.getDomainBindSearch();                                                            // 295
			var searchOptions = {                                                                                      // 297
				filter: domain_search.filter.replace(/#{username}/g, username),                                           // 298
				scope: 'sub'                                                                                              // 299
			};                                                                                                         // 297
			logger.search.info('Searching user', username);                                                            // 302
			logger.search.debug('searchOptions', searchOptions);                                                       // 303
			logger.search.debug('domain_base', self.options.domain_base);                                              // 304
			var result = self.searchAllSync(self.options.domain_base, searchOptions);                                  // 306
                                                                                                              //
			if (!Array.isArray(result) || result.length === 0) {                                                       // 308
				return;                                                                                                   // 309
			}                                                                                                          // 310
                                                                                                              //
			if (result.length > 1) {                                                                                   // 312
				logger.search.error('Search by username', username, 'returned', result.length, 'records');                // 313
			}                                                                                                          // 314
                                                                                                              //
			return result[0];                                                                                          // 316
		}                                                                                                           // 317
                                                                                                              //
		return getUserByUsernameSync;                                                                               // 15
	}();                                                                                                         // 15
                                                                                                              //
	LDAP.prototype.isUserInGroup = function () {                                                                 // 15
		function isUserInGroup(username) {                                                                          // 15
			var self = this;                                                                                           // 320
                                                                                                              //
			if (!self.options.group_filter_enabled) {                                                                  // 322
				return true;                                                                                              // 323
			}                                                                                                          // 324
                                                                                                              //
			var filter = ['(&'];                                                                                       // 326
                                                                                                              //
			if (self.options.group_filter_object_class !== '') {                                                       // 328
				filter.push("(objectclass=" + self.options.group_filter_object_class + ")");                              // 329
			}                                                                                                          // 330
                                                                                                              //
			if (self.options.group_filter_group_member_attribute !== '') {                                             // 332
				filter.push("(" + self.options.group_filter_group_member_attribute + "=" + self.options.group_filter_group_member_format + ")");
			}                                                                                                          // 334
                                                                                                              //
			if (self.options.group_filter_group_id_attribute !== '') {                                                 // 336
				filter.push("(" + self.options.group_filter_group_id_attribute + "=" + self.options.group_filter_group_name + ")");
			}                                                                                                          // 338
                                                                                                              //
			filter.push(')');                                                                                          // 339
			var searchOptions = {                                                                                      // 341
				filter: filter.join('').replace(/#{username}/g, username),                                                // 342
				scope: 'sub'                                                                                              // 343
			};                                                                                                         // 341
			logger.search.debug('Group filter LDAP:', searchOptions.filter);                                           // 346
			var result = self.searchAllSync(self.options.domain_base, searchOptions);                                  // 348
                                                                                                              //
			if (!Array.isArray(result) || result.length === 0) {                                                       // 350
				return false;                                                                                             // 351
			}                                                                                                          // 352
                                                                                                              //
			return true;                                                                                               // 353
		}                                                                                                           // 354
                                                                                                              //
		return isUserInGroup;                                                                                       // 15
	}();                                                                                                         // 15
                                                                                                              //
	LDAP.prototype.searchAllAsync = function () {                                                                // 15
		function searchAllAsync(domain_base, options, callback) {                                                   // 15
			var self = this;                                                                                           // 358
			self.client.search(domain_base, options, function (error, res) {                                           // 360
				if (error) {                                                                                              // 361
					logger.search.error(error);                                                                              // 362
					callback(error);                                                                                         // 363
					return;                                                                                                  // 364
				}                                                                                                         // 365
                                                                                                              //
				res.on('error', function (error) {                                                                        // 367
					logger.search.error(error);                                                                              // 368
					callback(error);                                                                                         // 369
					return;                                                                                                  // 370
				});                                                                                                       // 371
				var entries = [];                                                                                         // 373
				var jsonEntries = [];                                                                                     // 374
				res.on('searchEntry', function (entry) {                                                                  // 376
					entries.push(entry);                                                                                     // 377
					jsonEntries.push(entry.json);                                                                            // 378
				});                                                                                                       // 379
				res.on('end', function () /*result*/{                                                                     // 381
					logger.search.info('Search result count', entries.length);                                               // 382
					logger.search.debug('Search result', JSON.stringify(jsonEntries, null, 2));                              // 383
					callback(null, entries);                                                                                 // 384
				});                                                                                                       // 385
			});                                                                                                        // 386
		}                                                                                                           // 387
                                                                                                              //
		return searchAllAsync;                                                                                      // 15
	}();                                                                                                         // 15
                                                                                                              //
	LDAP.prototype.authSync = function () {                                                                      // 15
		function authSync(dn, password) {                                                                           // 15
			var self = this;                                                                                           // 390
			logger.auth.info('Authenticating', dn);                                                                    // 392
                                                                                                              //
			try {                                                                                                      // 394
				self.bindSync(dn, password);                                                                              // 395
				logger.auth.info('Authenticated', dn);                                                                    // 396
				return true;                                                                                              // 397
			} catch (error) {                                                                                          // 398
				logger.auth.info('Not authenticated', dn);                                                                // 399
				logger.auth.debug('error', error);                                                                        // 400
				return false;                                                                                             // 401
			}                                                                                                          // 402
		}                                                                                                           // 403
                                                                                                              //
		return authSync;                                                                                            // 15
	}();                                                                                                         // 15
                                                                                                              //
	LDAP.prototype.disconnect = function () {                                                                    // 15
		function disconnect() {                                                                                     // 15
			var self = this;                                                                                           // 406
			self.connected = false;                                                                                    // 408
			logger.connection.info('Disconecting');                                                                    // 409
			self.client.unbind();                                                                                      // 410
		}                                                                                                           // 411
                                                                                                              //
		return disconnect;                                                                                          // 15
	}();                                                                                                         // 15
                                                                                                              //
	return LDAP;                                                                                                 // 15
}();                                                                                                          // 15
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"sync.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/rocketchat_ldap/server/sync.js                                                                    //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
/* globals slug:true, slugify, LDAP, getLdapUsername:true, getLdapUserUniqueID:true, getDataToSyncUserData:true, syncUserData:true, sync:true, addLdapUser:true  */var logger = new Logger('LDAPSync', {});
                                                                                                              //
slug = function () {                                                                                          // 5
	function slug(text) {                                                                                        // 5
		if (RocketChat.settings.get('UTF8_Names_Slugify') !== true) {                                               // 6
			return text;                                                                                               // 7
		}                                                                                                           // 8
                                                                                                              //
		text = slugify(text, '.');                                                                                  // 9
		return text.replace(/[^0-9a-z-_.]/g, '');                                                                   // 10
	}                                                                                                            // 11
                                                                                                              //
	return slug;                                                                                                 // 5
}();                                                                                                          // 5
                                                                                                              //
getLdapUsername = function () {                                                                               // 14
	function getLdapUsername(ldapUser) {                                                                         // 14
		var usernameField = RocketChat.settings.get('LDAP_Username_Field');                                         // 15
                                                                                                              //
		if (usernameField.indexOf('#{') > -1) {                                                                     // 17
			return usernameField.replace(/#{(.+?)}/g, function (match, field) {                                        // 18
				return ldapUser.object[field];                                                                            // 19
			});                                                                                                        // 20
		}                                                                                                           // 21
                                                                                                              //
		return ldapUser.object[usernameField];                                                                      // 23
	}                                                                                                            // 24
                                                                                                              //
	return getLdapUsername;                                                                                      // 14
}();                                                                                                          // 14
                                                                                                              //
getLdapUserUniqueID = function () {                                                                           // 27
	function getLdapUserUniqueID(ldapUser) {                                                                     // 27
		var Unique_Identifier_Field = RocketChat.settings.get('LDAP_Unique_Identifier_Field');                      // 28
                                                                                                              //
		if (Unique_Identifier_Field !== '') {                                                                       // 30
			Unique_Identifier_Field = Unique_Identifier_Field.replace(/\s/g, '').split(',');                           // 31
		} else {                                                                                                    // 32
			Unique_Identifier_Field = [];                                                                              // 33
		}                                                                                                           // 34
                                                                                                              //
		var LDAP_Domain_Search_User_ID = RocketChat.settings.get('LDAP_Domain_Search_User_ID');                     // 36
                                                                                                              //
		if (LDAP_Domain_Search_User_ID !== '') {                                                                    // 38
			LDAP_Domain_Search_User_ID = LDAP_Domain_Search_User_ID.replace(/\s/g, '').split(',');                     // 39
		} else {                                                                                                    // 40
			LDAP_Domain_Search_User_ID = [];                                                                           // 41
		}                                                                                                           // 42
                                                                                                              //
		Unique_Identifier_Field = Unique_Identifier_Field.concat(LDAP_Domain_Search_User_ID);                       // 44
                                                                                                              //
		if (Unique_Identifier_Field.length > 0) {                                                                   // 46
			Unique_Identifier_Field = Unique_Identifier_Field.find(function (field) {                                  // 47
				return !_.isEmpty(ldapUser.object[field]);                                                                // 48
			});                                                                                                        // 49
                                                                                                              //
			if (Unique_Identifier_Field) {                                                                             // 50
				Unique_Identifier_Field = {                                                                               // 51
					attribute: Unique_Identifier_Field,                                                                      // 52
					value: ldapUser.raw[Unique_Identifier_Field].toString('hex')                                             // 53
				};                                                                                                        // 51
			}                                                                                                          // 55
                                                                                                              //
			return Unique_Identifier_Field;                                                                            // 56
		}                                                                                                           // 57
	}                                                                                                            // 58
                                                                                                              //
	return getLdapUserUniqueID;                                                                                  // 27
}();                                                                                                          // 27
                                                                                                              //
getDataToSyncUserData = function () {                                                                         // 61
	function getDataToSyncUserData(ldapUser, user) {                                                             // 61
		var syncUserData = RocketChat.settings.get('LDAP_Sync_User_Data');                                          // 62
		var syncUserDataFieldMap = RocketChat.settings.get('LDAP_Sync_User_Data_FieldMap').trim();                  // 63
		var userData = {};                                                                                          // 65
                                                                                                              //
		if (syncUserData && syncUserDataFieldMap) {                                                                 // 67
			var fieldMap = JSON.parse(syncUserDataFieldMap);                                                           // 68
			var emailList = [];                                                                                        // 69
                                                                                                              //
			_.map(fieldMap, function (userField, ldapField) {                                                          // 70
				switch (userField) {                                                                                      // 71
					case 'email':                                                                                            // 72
						if (!ldapUser.object.hasOwnProperty(ldapField)) {                                                       // 73
							logger.debug("user does not have attribute: " + ldapField);                                            // 74
							return;                                                                                                // 75
						}                                                                                                       // 76
                                                                                                              //
						if (_.isObject(ldapUser.object[ldapField])) {                                                           // 78
							_.map(ldapUser.object[ldapField], function (item) {                                                    // 79
								emailList.push({                                                                                      // 80
									address: item,                                                                                       // 80
									verified: true                                                                                       // 80
								});                                                                                                   // 80
							});                                                                                                    // 81
						} else {                                                                                                // 82
							emailList.push({                                                                                       // 83
								address: ldapUser.object[ldapField],                                                                  // 83
								verified: true                                                                                        // 83
							});                                                                                                    // 83
						}                                                                                                       // 84
                                                                                                              //
						break;                                                                                                  // 85
                                                                                                              //
					case 'name':                                                                                             // 87
						var templateRegex = /#{(\w+)}/gi;                                                                       // 88
						var match = templateRegex.exec(ldapField);                                                              // 89
						var tmpLdapField = ldapField;                                                                           // 90
                                                                                                              //
						if (match == null) {                                                                                    // 92
							if (!ldapUser.object.hasOwnProperty(ldapField)) {                                                      // 93
								logger.debug("user does not have attribute: " + ldapField);                                           // 94
								return;                                                                                               // 95
							}                                                                                                      // 96
                                                                                                              //
							tmpLdapField = ldapUser.object[ldapField];                                                             // 97
						} else {                                                                                                // 98
							logger.debug('template found. replacing values');                                                      // 99
                                                                                                              //
							while (match != null) {                                                                                // 100
								var tmplVar = match[0];                                                                               // 101
								var tmplAttrName = match[1];                                                                          // 102
                                                                                                              //
								if (!ldapUser.object.hasOwnProperty(tmplAttrName)) {                                                  // 104
									logger.debug("user does not have attribute: " + tmplAttrName);                                       // 105
									return;                                                                                              // 106
								}                                                                                                     // 107
                                                                                                              //
								var attrVal = ldapUser.object[tmplAttrName];                                                          // 109
								logger.debug("replacing template var: " + tmplVar + " with value from ldap: " + attrVal);             // 110
								tmpLdapField = tmpLdapField.replace(tmplVar, attrVal);                                                // 111
								match = templateRegex.exec(ldapField);                                                                // 112
							}                                                                                                      // 113
						}                                                                                                       // 114
                                                                                                              //
						if (user.name !== tmpLdapField) {                                                                       // 116
							userData.name = tmpLdapField;                                                                          // 117
							logger.debug("user.name changed to: " + tmpLdapField);                                                 // 118
						}                                                                                                       // 119
                                                                                                              //
						break;                                                                                                  // 120
				}                                                                                                         // 71
			});                                                                                                        // 122
                                                                                                              //
			if (emailList.length > 0) {                                                                                // 124
				if (JSON.stringify(user.emails) !== JSON.stringify(emailList)) {                                          // 125
					userData.emails = emailList;                                                                             // 126
				}                                                                                                         // 127
			}                                                                                                          // 128
		}                                                                                                           // 129
                                                                                                              //
		var uniqueId = getLdapUserUniqueID(ldapUser);                                                               // 131
                                                                                                              //
		if (uniqueId && (!user.services || !user.services.ldap || user.services.ldap.id !== uniqueId.value || user.services.ldap.idAttribute !== uniqueId.attribute)) {
			userData['services.ldap.id'] = uniqueId.value;                                                             // 134
			userData['services.ldap.idAttribute'] = uniqueId.attribute;                                                // 135
		}                                                                                                           // 136
                                                                                                              //
		if (user.ldap !== true) {                                                                                   // 138
			userData.ldap = true;                                                                                      // 139
		}                                                                                                           // 140
                                                                                                              //
		if (_.size(userData)) {                                                                                     // 142
			return userData;                                                                                           // 143
		}                                                                                                           // 144
	}                                                                                                            // 145
                                                                                                              //
	return getDataToSyncUserData;                                                                                // 61
}();                                                                                                          // 61
                                                                                                              //
syncUserData = function () {                                                                                  // 148
	function syncUserData(user, ldapUser) {                                                                      // 148
		logger.info('Syncing user data');                                                                           // 149
		logger.debug('user', {                                                                                      // 150
			'email': user.email,                                                                                       // 150
			'_id': user._id                                                                                            // 150
		});                                                                                                         // 150
		logger.debug('ldapUser', ldapUser);                                                                         // 151
		var userData = getDataToSyncUserData(ldapUser, user);                                                       // 153
                                                                                                              //
		if (user && user._id && userData) {                                                                         // 154
			logger.debug('setting', JSON.stringify(userData, null, 2));                                                // 155
                                                                                                              //
			if (userData.name) {                                                                                       // 156
				RocketChat._setRealName(user._id, userData.name);                                                         // 157
                                                                                                              //
				delete userData.name;                                                                                     // 158
			}                                                                                                          // 159
                                                                                                              //
			Meteor.users.update(user._id, {                                                                            // 160
				$set: userData                                                                                            // 160
			});                                                                                                        // 160
			user = Meteor.users.findOne({                                                                              // 161
				_id: user._id                                                                                             // 161
			});                                                                                                        // 161
		}                                                                                                           // 162
                                                                                                              //
		if (RocketChat.settings.get('LDAP_Username_Field') !== '') {                                                // 164
			var username = slug(getLdapUsername(ldapUser));                                                            // 165
                                                                                                              //
			if (user && user._id && username !== user.username) {                                                      // 166
				logger.info('Syncing user username', user.username, '->', username);                                      // 167
                                                                                                              //
				RocketChat._setUsername(user._id, username);                                                              // 168
			}                                                                                                          // 169
		}                                                                                                           // 170
                                                                                                              //
		if (user && user._id && RocketChat.settings.get('LDAP_Sync_User_Avatar') === true) {                        // 172
			var avatar = ldapUser.raw.thumbnailPhoto || ldapUser.raw.jpegPhoto;                                        // 173
                                                                                                              //
			if (avatar) {                                                                                              // 174
				logger.info('Syncing user avatar');                                                                       // 175
				var rs = RocketChatFile.bufferToStream(avatar);                                                           // 177
				var fileStore = FileUpload.getStore('Avatars');                                                           // 178
				fileStore.deleteByName(user.username);                                                                    // 179
				var file = {                                                                                              // 181
					userId: user._id,                                                                                        // 182
					type: 'image/jpeg'                                                                                       // 183
				};                                                                                                        // 181
				fileStore.insert(file, rs, function () {                                                                  // 186
					Meteor.setTimeout(function () {                                                                          // 187
						RocketChat.models.Users.setAvatarOrigin(user._id, 'ldap');                                              // 188
						RocketChat.Notifications.notifyLogged('updateAvatar', {                                                 // 189
							username: user.username                                                                                // 189
						});                                                                                                     // 189
					}, 500);                                                                                                 // 190
				});                                                                                                       // 191
			}                                                                                                          // 192
		}                                                                                                           // 193
	}                                                                                                            // 194
                                                                                                              //
	return syncUserData;                                                                                         // 148
}();                                                                                                          // 148
                                                                                                              //
addLdapUser = function () {                                                                                   // 196
	function addLdapUser(ldapUser, username, password) {                                                         // 196
		var userObject = {                                                                                          // 197
			username: username                                                                                         // 198
		};                                                                                                          // 197
		var userData = getDataToSyncUserData(ldapUser, {});                                                         // 201
                                                                                                              //
		if (userData && userData.emails) {                                                                          // 203
			userObject.email = userData.emails[0].address;                                                             // 204
		} else if (ldapUser.object.mail && ldapUser.object.mail.indexOf('@') > -1) {                                // 205
			userObject.email = ldapUser.object.mail;                                                                   // 206
		} else if (RocketChat.settings.get('LDAP_Default_Domain') !== '') {                                         // 207
			userObject.email = username + "@" + RocketChat.settings.get('LDAP_Default_Domain');                        // 208
		} else {                                                                                                    // 209
			var error = new Meteor.Error('LDAP-login-error', 'LDAP Authentication succeded, there is no email to create an account. Have you tried setting your Default Domain in LDAP Settings?');
			logger.error(error);                                                                                       // 211
			throw error;                                                                                               // 212
		}                                                                                                           // 213
                                                                                                              //
		logger.debug('New user data', userObject);                                                                  // 215
                                                                                                              //
		if (password) {                                                                                             // 217
			userObject.password = password;                                                                            // 218
		}                                                                                                           // 219
                                                                                                              //
		try {                                                                                                       // 221
			userObject._id = Accounts.createUser(userObject);                                                          // 222
		} catch (error) {                                                                                           // 223
			logger.error('Error creating user', error);                                                                // 224
			throw error;                                                                                               // 225
		}                                                                                                           // 226
                                                                                                              //
		syncUserData(userObject, ldapUser);                                                                         // 228
		return {                                                                                                    // 230
			userId: userObject._id                                                                                     // 231
		};                                                                                                          // 230
	}                                                                                                            // 233
                                                                                                              //
	return addLdapUser;                                                                                          // 196
}();                                                                                                          // 196
                                                                                                              //
sync = function () {                                                                                          // 235
	function sync() {                                                                                            // 235
		if (RocketChat.settings.get('LDAP_Enable') !== true) {                                                      // 236
			return;                                                                                                    // 237
		}                                                                                                           // 238
                                                                                                              //
		var ldap = new LDAP();                                                                                      // 240
                                                                                                              //
		try {                                                                                                       // 242
			ldap.connectSync();                                                                                        // 243
			var users = RocketChat.models.Users.findLDAPUsers();                                                       // 245
                                                                                                              //
			if (RocketChat.settings.get('LDAP_Import_Users') === true && RocketChat.settings.get('LDAP_Username_Field') !== '') {
				var ldapUsers = ldap.searchUsersSync('*');                                                                // 248
				ldapUsers.forEach(function (ldapUser) {                                                                   // 249
					var username = slug(getLdapUsername(ldapUser)); // Look to see if user already exists                    // 250
                                                                                                              //
					var userQuery = {                                                                                        // 252
						username: username                                                                                      // 253
					};                                                                                                       // 252
					logger.debug('userQuery', userQuery);                                                                    // 256
					var user = Meteor.users.findOne(userQuery);                                                              // 258
                                                                                                              //
					if (!user) {                                                                                             // 260
						addLdapUser(ldapUser, username);                                                                        // 261
					} else if (user.ldap !== true && RocketChat.settings.get('LDAP_Merge_Existing_Users') === true) {        // 262
						syncUserData(user, ldapUser);                                                                           // 263
					}                                                                                                        // 264
				});                                                                                                       // 265
			}                                                                                                          // 266
                                                                                                              //
			users.forEach(function (user) {                                                                            // 268
				var ldapUser = void 0;                                                                                    // 269
                                                                                                              //
				if (user.services && user.services.ldap && user.services.ldap.id) {                                       // 271
					ldapUser = ldap.getUserByIdSync(user.services.ldap.id, user.services.ldap.idAttribute);                  // 272
				} else {                                                                                                  // 273
					ldapUser = ldap.getUserByUsernameSync(user.username);                                                    // 274
				}                                                                                                         // 275
                                                                                                              //
				if (ldapUser) {                                                                                           // 277
					syncUserData(user, ldapUser);                                                                            // 278
				} else {                                                                                                  // 279
					logger.info('Can\'t sync user', user.username);                                                          // 280
				}                                                                                                         // 281
			});                                                                                                        // 282
		} catch (error) {                                                                                           // 283
			logger.error(error);                                                                                       // 284
			return error;                                                                                              // 285
		}                                                                                                           // 286
                                                                                                              //
		ldap.disconnect();                                                                                          // 288
		return true;                                                                                                // 289
	}                                                                                                            // 290
                                                                                                              //
	return sync;                                                                                                 // 235
}();                                                                                                          // 235
                                                                                                              //
var interval = void 0;                                                                                        // 292
var timeout = void 0;                                                                                         // 293
RocketChat.settings.get('LDAP_Sync_User_Data', function (key, value) {                                        // 295
	Meteor.clearInterval(interval);                                                                              // 296
	Meteor.clearTimeout(timeout);                                                                                // 297
                                                                                                              //
	if (value === true) {                                                                                        // 299
		logger.info('Enabling LDAP user sync');                                                                     // 300
		interval = Meteor.setInterval(sync, 1000 * 60 * 60);                                                        // 301
		timeout = Meteor.setTimeout(function () {                                                                   // 302
			sync();                                                                                                    // 303
		}, 1000 * 60 * 10);                                                                                         // 304
	} else {                                                                                                     // 305
		logger.info('Disabling LDAP user sync');                                                                    // 306
	}                                                                                                            // 307
});                                                                                                           // 308
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"loginHandler.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/rocketchat_ldap/server/loginHandler.js                                                            //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
/* globals LDAP, slug, getLdapUsername, getLdapUserUniqueID, syncUserData, addLdapUser */ /* eslint new-cap: [2, {"capIsNewExceptions": ["SHA256"]}] */var logger = new Logger('LDAPHandler', {});
                                                                                                              //
function fallbackDefaultAccountSystem(bind, username, password) {                                             // 6
	if (typeof username === 'string') {                                                                          // 7
		if (username.indexOf('@') === -1) {                                                                         // 8
			username = {                                                                                               // 9
				username: username                                                                                        // 9
			};                                                                                                         // 9
		} else {                                                                                                    // 10
			username = {                                                                                               // 11
				email: username                                                                                           // 11
			};                                                                                                         // 11
		}                                                                                                           // 12
	}                                                                                                            // 13
                                                                                                              //
	logger.info('Fallback to default account system', username);                                                 // 15
	var loginRequest = {                                                                                         // 17
		user: username,                                                                                             // 18
		password: {                                                                                                 // 19
			digest: SHA256(password),                                                                                  // 20
			algorithm: 'sha-256'                                                                                       // 21
		}                                                                                                           // 19
	};                                                                                                           // 17
	return Accounts._runLoginHandlers(bind, loginRequest);                                                       // 25
}                                                                                                             // 26
                                                                                                              //
Accounts.registerLoginHandler('ldap', function (loginRequest) {                                               // 28
	if (!loginRequest.ldap || !loginRequest.ldapOptions) {                                                       // 29
		return undefined;                                                                                           // 30
	}                                                                                                            // 31
                                                                                                              //
	logger.info('Init LDAP login', loginRequest.username);                                                       // 33
                                                                                                              //
	if (RocketChat.settings.get('LDAP_Enable') !== true) {                                                       // 35
		return fallbackDefaultAccountSystem(this, loginRequest.username, loginRequest.ldapPass);                    // 36
	}                                                                                                            // 37
                                                                                                              //
	var self = this;                                                                                             // 39
	var ldap = new LDAP();                                                                                       // 40
	var ldapUser = void 0;                                                                                       // 41
                                                                                                              //
	try {                                                                                                        // 43
		ldap.connectSync();                                                                                         // 44
		var users = ldap.searchUsersSync(loginRequest.username);                                                    // 45
                                                                                                              //
		if (users.length !== 1) {                                                                                   // 47
			logger.info('Search returned', users.length, 'record(s) for', loginRequest.username);                      // 48
			throw new Error('User not Found');                                                                         // 49
		}                                                                                                           // 50
                                                                                                              //
		if (ldap.authSync(users[0].dn, loginRequest.ldapPass) === true) {                                           // 52
			if (ldap.isUserInGroup(loginRequest.username)) {                                                           // 53
				ldapUser = users[0];                                                                                      // 54
			} else {                                                                                                   // 55
				throw new Error('User not in a valid group');                                                             // 56
			}                                                                                                          // 57
		} else {                                                                                                    // 58
			logger.info('Wrong password for', loginRequest.username);                                                  // 59
		}                                                                                                           // 60
	} catch (error) {                                                                                            // 61
		logger.error(error);                                                                                        // 62
	}                                                                                                            // 63
                                                                                                              //
	ldap.disconnect();                                                                                           // 65
                                                                                                              //
	if (ldapUser === undefined) {                                                                                // 67
		if (RocketChat.settings.get('LDAP_Login_Fallback') === true) {                                              // 68
			return fallbackDefaultAccountSystem(self, loginRequest.username, loginRequest.ldapPass);                   // 69
		}                                                                                                           // 70
                                                                                                              //
		throw new Meteor.Error('LDAP-login-error', "LDAP Authentication failed with provided username [" + loginRequest.username + "]");
	}                                                                                                            // 73
                                                                                                              //
	var username = void 0;                                                                                       // 75
                                                                                                              //
	if (RocketChat.settings.get('LDAP_Username_Field') !== '') {                                                 // 77
		username = slug(getLdapUsername(ldapUser));                                                                 // 78
	} else {                                                                                                     // 79
		username = slug(loginRequest.username);                                                                     // 80
	} // Look to see if user already exists                                                                      // 81
                                                                                                              //
                                                                                                              //
	var userQuery = void 0;                                                                                      // 84
	var Unique_Identifier_Field = getLdapUserUniqueID(ldapUser);                                                 // 86
	var user = void 0;                                                                                           // 87
                                                                                                              //
	if (Unique_Identifier_Field) {                                                                               // 89
		userQuery = {                                                                                               // 90
			'services.ldap.id': Unique_Identifier_Field.value                                                          // 91
		};                                                                                                          // 90
		logger.info('Querying user');                                                                               // 94
		logger.debug('userQuery', userQuery);                                                                       // 95
		user = Meteor.users.findOne(userQuery);                                                                     // 97
	}                                                                                                            // 98
                                                                                                              //
	if (!user) {                                                                                                 // 100
		userQuery = {                                                                                               // 101
			username: username                                                                                         // 102
		};                                                                                                          // 101
		logger.debug('userQuery', userQuery);                                                                       // 105
		user = Meteor.users.findOne(userQuery);                                                                     // 107
	} // Login user if they exist                                                                                // 108
                                                                                                              //
                                                                                                              //
	if (user) {                                                                                                  // 111
		if (user.ldap !== true && RocketChat.settings.get('LDAP_Merge_Existing_Users') !== true) {                  // 112
			logger.info('User exists without "ldap: true"');                                                           // 113
			throw new Meteor.Error('LDAP-login-error', "LDAP Authentication succeded, but there's already an existing user with provided username [" + username + "] in Mongo.");
		}                                                                                                           // 115
                                                                                                              //
		logger.info('Logging user');                                                                                // 117
                                                                                                              //
		var stampedToken = Accounts._generateStampedLoginToken();                                                   // 119
                                                                                                              //
		Meteor.users.update(user._id, {                                                                             // 121
			$push: {                                                                                                   // 122
				'services.resume.loginTokens': Accounts._hashStampedToken(stampedToken)                                   // 123
			}                                                                                                          // 122
		});                                                                                                         // 121
		syncUserData(user, ldapUser);                                                                               // 127
                                                                                                              //
		if (RocketChat.settings.get('LDAP_Login_Fallback') === true) {                                              // 129
			Accounts.setPassword(user._id, loginRequest.ldapPass, {                                                    // 130
				logout: false                                                                                             // 130
			});                                                                                                        // 130
		}                                                                                                           // 131
                                                                                                              //
		return {                                                                                                    // 133
			userId: user._id,                                                                                          // 134
			token: stampedToken.token                                                                                  // 135
		};                                                                                                          // 133
	}                                                                                                            // 137
                                                                                                              //
	logger.info('User does not exist, creating', username); // Create new user                                   // 139
                                                                                                              //
	return addLdapUser(ldapUser, username, loginRequest.ldapPass);                                               // 142
});                                                                                                           // 143
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"settings.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/rocketchat_ldap/server/settings.js                                                                //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
Meteor.startup(function () {                                                                                  // 1
	RocketChat.settings.addGroup('LDAP', function () {                                                           // 2
		var enableQuery = {                                                                                         // 3
			_id: 'LDAP_Enable',                                                                                        // 3
			value: true                                                                                                // 3
		};                                                                                                          // 3
		var enableTLSQuery = [{                                                                                     // 4
			_id: 'LDAP_Enable',                                                                                        // 5
			value: true                                                                                                // 5
		}, {                                                                                                        // 5
			_id: 'LDAP_Encryption',                                                                                    // 6
			value: {                                                                                                   // 6
				$in: ['tls', 'ssl']                                                                                       // 6
			}                                                                                                          // 6
		}];                                                                                                         // 6
		var customBindSearchEnabledQuery = [{                                                                       // 8
			_id: 'LDAP_Enable',                                                                                        // 9
			value: true                                                                                                // 9
		}, {                                                                                                        // 9
			_id: 'LDAP_Use_Custom_Domain_Search',                                                                      // 10
			value: true                                                                                                // 10
		}];                                                                                                         // 10
		var customBindSearchDisabledQuery = [{                                                                      // 12
			_id: 'LDAP_Enable',                                                                                        // 13
			value: true                                                                                                // 13
		}, {                                                                                                        // 13
			_id: 'LDAP_Use_Custom_Domain_Search',                                                                      // 14
			value: false                                                                                               // 14
		}];                                                                                                         // 14
		var syncDataQuery = [{                                                                                      // 16
			_id: 'LDAP_Enable',                                                                                        // 17
			value: true                                                                                                // 17
		}, {                                                                                                        // 17
			_id: 'LDAP_Sync_User_Data',                                                                                // 18
			value: true                                                                                                // 18
		}];                                                                                                         // 18
		var groupFilterQuery = [{                                                                                   // 20
			_id: 'LDAP_Enable',                                                                                        // 21
			value: true                                                                                                // 21
		}, {                                                                                                        // 21
			_id: 'LDAP_Group_Filter_Enable',                                                                           // 22
			value: true                                                                                                // 22
		}];                                                                                                         // 22
		this.add('LDAP_Enable', false, {                                                                            // 25
			type: 'boolean',                                                                                           // 25
			"public": true                                                                                             // 25
		});                                                                                                         // 25
		this.add('LDAP_Login_Fallback', true, {                                                                     // 26
			type: 'boolean',                                                                                           // 26
			enableQuery: enableQuery                                                                                   // 26
		});                                                                                                         // 26
		this.add('LDAP_Host', '', {                                                                                 // 27
			type: 'string',                                                                                            // 27
			enableQuery: enableQuery                                                                                   // 27
		});                                                                                                         // 27
		this.add('LDAP_Port', '389', {                                                                              // 28
			type: 'string',                                                                                            // 28
			enableQuery: enableQuery                                                                                   // 28
		});                                                                                                         // 28
		this.add('LDAP_Connect_Timeout', 600000, {                                                                  // 29
			type: 'int',                                                                                               // 29
			enableQuery: enableQuery                                                                                   // 29
		});                                                                                                         // 29
		this.add('LDAP_Idle_Timeout', 600000, {                                                                     // 30
			type: 'int',                                                                                               // 30
			enableQuery: enableQuery                                                                                   // 30
		});                                                                                                         // 30
		this.add('LDAP_Encryption', 'plain', {                                                                      // 31
			type: 'select',                                                                                            // 31
			values: [{                                                                                                 // 31
				key: 'plain',                                                                                             // 31
				i18nLabel: 'No_Encryption'                                                                                // 31
			}, {                                                                                                       // 31
				key: 'tls',                                                                                               // 31
				i18nLabel: 'StartTLS'                                                                                     // 31
			}, {                                                                                                       // 31
				key: 'ssl',                                                                                               // 31
				i18nLabel: 'SSL/LDAPS'                                                                                    // 31
			}],                                                                                                        // 31
			enableQuery: enableQuery                                                                                   // 31
		});                                                                                                         // 31
		this.add('LDAP_CA_Cert', '', {                                                                              // 32
			type: 'string',                                                                                            // 32
			multiline: true,                                                                                           // 32
			enableQuery: enableTLSQuery                                                                                // 32
		});                                                                                                         // 32
		this.add('LDAP_Reject_Unauthorized', true, {                                                                // 33
			type: 'boolean',                                                                                           // 33
			enableQuery: enableTLSQuery                                                                                // 33
		});                                                                                                         // 33
		this.add('LDAP_Domain_Base', '', {                                                                          // 34
			type: 'string',                                                                                            // 34
			enableQuery: enableQuery                                                                                   // 34
		});                                                                                                         // 34
		this.add('LDAP_Use_Custom_Domain_Search', false, {                                                          // 35
			type: 'boolean',                                                                                           // 35
			enableQuery: enableQuery                                                                                   // 35
		});                                                                                                         // 35
		this.add('LDAP_Custom_Domain_Search', '', {                                                                 // 36
			type: 'string',                                                                                            // 36
			enableQuery: customBindSearchEnabledQuery                                                                  // 36
		});                                                                                                         // 36
		this.add('LDAP_Domain_Search_User', '', {                                                                   // 37
			type: 'string',                                                                                            // 37
			enableQuery: customBindSearchDisabledQuery                                                                 // 37
		});                                                                                                         // 37
		this.add('LDAP_Domain_Search_Password', '', {                                                               // 38
			type: 'password',                                                                                          // 38
			enableQuery: customBindSearchDisabledQuery                                                                 // 38
		});                                                                                                         // 38
		this.add('LDAP_Domain_Search_Filter', '', {                                                                 // 39
			type: 'string',                                                                                            // 39
			enableQuery: customBindSearchDisabledQuery                                                                 // 39
		});                                                                                                         // 39
		this.add('LDAP_Group_Filter_Enable', false, {                                                               // 40
			type: 'boolean',                                                                                           // 40
			enableQuery: enableQuery                                                                                   // 40
		});                                                                                                         // 40
		this.add('LDAP_Group_Filter_ObjectClass', 'groupOfUniqueNames', {                                           // 41
			type: 'string',                                                                                            // 41
			enableQuery: groupFilterQuery                                                                              // 41
		});                                                                                                         // 41
		this.add('LDAP_Group_Filter_Group_Id_Attribute', 'cn', {                                                    // 42
			type: 'string',                                                                                            // 42
			enableQuery: groupFilterQuery                                                                              // 42
		});                                                                                                         // 42
		this.add('LDAP_Group_Filter_Group_Member_Attribute', 'uniqueMember', {                                      // 43
			type: 'string',                                                                                            // 43
			enableQuery: groupFilterQuery                                                                              // 43
		});                                                                                                         // 43
		this.add('LDAP_Group_Filter_Group_Member_Format', 'uniqueMember', {                                         // 44
			type: 'string',                                                                                            // 44
			enableQuery: groupFilterQuery                                                                              // 44
		});                                                                                                         // 44
		this.add('LDAP_Group_Filter_Group_Name', 'ROCKET_CHAT', {                                                   // 45
			type: 'string',                                                                                            // 45
			enableQuery: groupFilterQuery                                                                              // 45
		});                                                                                                         // 45
		this.add('LDAP_Domain_Search_User_ID', 'sAMAccountName', {                                                  // 46
			type: 'string',                                                                                            // 46
			enableQuery: customBindSearchDisabledQuery                                                                 // 46
		});                                                                                                         // 46
		this.add('LDAP_Domain_Search_Object_Class', 'user', {                                                       // 47
			type: 'string',                                                                                            // 47
			enableQuery: customBindSearchDisabledQuery                                                                 // 47
		});                                                                                                         // 47
		this.add('LDAP_Domain_Search_Object_Category', 'person', {                                                  // 48
			type: 'string',                                                                                            // 48
			enableQuery: customBindSearchDisabledQuery                                                                 // 48
		});                                                                                                         // 48
		this.add('LDAP_Username_Field', 'sAMAccountName', {                                                         // 49
			type: 'string',                                                                                            // 49
			enableQuery: enableQuery                                                                                   // 49
		});                                                                                                         // 49
		this.add('LDAP_Unique_Identifier_Field', 'objectGUID,ibm-entryUUID,GUID,dominoUNID,nsuniqueId,uidNumber', {
			type: 'string',                                                                                            // 50
			enableQuery: enableQuery                                                                                   // 50
		});                                                                                                         // 50
		this.add('LDAP_Sync_User_Data', false, {                                                                    // 51
			type: 'boolean',                                                                                           // 51
			enableQuery: enableQuery                                                                                   // 51
		});                                                                                                         // 51
		this.add('LDAP_Sync_User_Avatar', true, {                                                                   // 52
			type: 'boolean',                                                                                           // 52
			enableQuery: syncDataQuery                                                                                 // 52
		});                                                                                                         // 52
		this.add('LDAP_Sync_User_Data_FieldMap', '{"cn":"name", "mail":"email"}', {                                 // 53
			type: 'string',                                                                                            // 53
			enableQuery: syncDataQuery                                                                                 // 53
		});                                                                                                         // 53
		this.add('LDAP_Default_Domain', '', {                                                                       // 54
			type: 'string',                                                                                            // 54
			enableQuery: enableQuery                                                                                   // 54
		});                                                                                                         // 54
		this.add('LDAP_Merge_Existing_Users', false, {                                                              // 55
			type: 'boolean',                                                                                           // 55
			enableQuery: enableQuery                                                                                   // 55
		});                                                                                                         // 55
		this.add('LDAP_Import_Users', false, {                                                                      // 56
			type: 'boolean',                                                                                           // 56
			enableQuery: syncDataQuery                                                                                 // 56
		});                                                                                                         // 56
		this.add('LDAP_Test_Connection', 'ldap_test_connection', {                                                  // 57
			type: 'action',                                                                                            // 57
			actionText: 'Test_Connection'                                                                              // 57
		});                                                                                                         // 57
		this.add('LDAP_Sync_Users', 'ldap_sync_users', {                                                            // 58
			type: 'action',                                                                                            // 58
			actionText: 'Sync_Users'                                                                                   // 58
		});                                                                                                         // 58
	});                                                                                                          // 59
});                                                                                                           // 60
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"testConnection.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/rocketchat_ldap/server/testConnection.js                                                          //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
/* globals LDAP */Meteor.methods({                                                                            // 1
	ldap_test_connection: function () {                                                                          // 4
		var user = Meteor.user();                                                                                   // 5
                                                                                                              //
		if (!user) {                                                                                                // 6
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                             // 7
				method: 'ldap_test_connection'                                                                            // 7
			});                                                                                                        // 7
		}                                                                                                           // 8
                                                                                                              //
		if (!RocketChat.authz.hasRole(user._id, 'admin')) {                                                         // 10
			throw new Meteor.Error('error-not-authorized', 'Not authorized', {                                         // 11
				method: 'ldap_test_connection'                                                                            // 11
			});                                                                                                        // 11
		}                                                                                                           // 12
                                                                                                              //
		if (RocketChat.settings.get('LDAP_Enable') !== true) {                                                      // 14
			throw new Meteor.Error('LDAP_disabled');                                                                   // 15
		}                                                                                                           // 16
                                                                                                              //
		var ldap = void 0;                                                                                          // 18
                                                                                                              //
		try {                                                                                                       // 19
			ldap = new LDAP();                                                                                         // 20
			ldap.connectSync();                                                                                        // 21
		} catch (error) {                                                                                           // 22
			console.log(error);                                                                                        // 23
			throw new Meteor.Error(error.message);                                                                     // 24
		}                                                                                                           // 25
                                                                                                              //
		try {                                                                                                       // 27
			ldap.bindIfNecessary();                                                                                    // 28
			ldap.disconnect();                                                                                         // 29
		} catch (error) {                                                                                           // 30
			throw new Meteor.Error(error.name || error.message);                                                       // 31
		}                                                                                                           // 32
                                                                                                              //
		return {                                                                                                    // 34
			message: 'Connection_success',                                                                             // 35
			params: []                                                                                                 // 36
		};                                                                                                          // 34
	}                                                                                                            // 38
});                                                                                                           // 3
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"syncUsers.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/rocketchat_ldap/server/syncUsers.js                                                               //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
/* globals sync */Meteor.methods({                                                                            // 1
	ldap_sync_users: function () {                                                                               // 4
		var user = Meteor.user();                                                                                   // 5
                                                                                                              //
		if (!user) {                                                                                                // 6
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                             // 7
				method: 'ldap_sync_users'                                                                                 // 7
			});                                                                                                        // 7
		}                                                                                                           // 8
                                                                                                              //
		if (!RocketChat.authz.hasRole(user._id, 'admin')) {                                                         // 10
			throw new Meteor.Error('error-not-authorized', 'Not authorized', {                                         // 11
				method: 'ldap_sync_users'                                                                                 // 11
			});                                                                                                        // 11
		}                                                                                                           // 12
                                                                                                              //
		if (RocketChat.settings.get('LDAP_Enable') !== true) {                                                      // 14
			throw new Meteor.Error('LDAP_disabled');                                                                   // 15
		}                                                                                                           // 16
                                                                                                              //
		var result = sync();                                                                                        // 18
                                                                                                              //
		if (result === true) {                                                                                      // 20
			return {                                                                                                   // 21
				message: 'Sync_success',                                                                                  // 22
				params: []                                                                                                // 23
			};                                                                                                         // 21
		}                                                                                                           // 25
                                                                                                              //
		throw result;                                                                                               // 27
	}                                                                                                            // 28
});                                                                                                           // 3
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:ldap/server/ldap.js");
require("./node_modules/meteor/rocketchat:ldap/server/sync.js");
require("./node_modules/meteor/rocketchat:ldap/server/loginHandler.js");
require("./node_modules/meteor/rocketchat:ldap/server/settings.js");
require("./node_modules/meteor/rocketchat:ldap/server/testConnection.js");
require("./node_modules/meteor/rocketchat:ldap/server/syncUsers.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['rocketchat:ldap'] = {}, {
  LDAP: LDAP
});

})();

//# sourceMappingURL=rocketchat_ldap.js.map

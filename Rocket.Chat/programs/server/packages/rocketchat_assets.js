(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;
var RocketChatFile = Package['rocketchat:file'].RocketChatFile;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RocketChatTabBar = Package['rocketchat:lib'].RocketChatTabBar;
var WebAppHashing = Package['webapp-hashing'].WebAppHashing;
var meteorInstall = Package.modules.meteorInstall;
var process = Package.modules.process;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:assets":{"server":{"assets.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/rocketchat_assets/server/assets.js                                                                 //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                        //
                                                                                                               //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                               //
                                                                                                               //
var _createClass2 = require("babel-runtime/helpers/createClass");                                              //
                                                                                                               //
var _createClass3 = _interopRequireDefault(_createClass2);                                                     //
                                                                                                               //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }              //
                                                                                                               //
var sizeOf = void 0;                                                                                           // 1
module.watch(require("image-size"), {                                                                          // 1
	"default": function (v) {                                                                                     // 1
		sizeOf = v;                                                                                                  // 1
	}                                                                                                             // 1
}, 0);                                                                                                         // 1
var mime = void 0;                                                                                             // 1
module.watch(require("mime-type/with-db"), {                                                                   // 1
	"default": function (v) {                                                                                     // 1
		mime = v;                                                                                                    // 1
	}                                                                                                             // 1
}, 1);                                                                                                         // 1
var crypto = void 0;                                                                                           // 1
module.watch(require("crypto"), {                                                                              // 1
	"default": function (v) {                                                                                     // 1
		crypto = v;                                                                                                  // 1
	}                                                                                                             // 1
}, 2);                                                                                                         // 1
mime.extensions['image/vnd.microsoft.icon'] = ['ico'];                                                         // 7
var RocketChatAssetsInstance = new RocketChatFile.GridFS({                                                     // 9
	name: 'assets'                                                                                                // 10
});                                                                                                            // 9
this.RocketChatAssetsInstance = RocketChatAssetsInstance;                                                      // 13
var assets = {                                                                                                 // 15
	logo: {                                                                                                       // 16
		label: 'logo (svg, png, jpg)',                                                                               // 17
		defaultUrl: 'images/logo/logo.svg',                                                                          // 18
		constraints: {                                                                                               // 19
			type: 'image',                                                                                              // 20
			extensions: ['svg', 'png', 'jpg', 'jpeg'],                                                                  // 21
			width: undefined,                                                                                           // 22
			height: undefined                                                                                           // 23
		}                                                                                                            // 19
	},                                                                                                            // 16
	favicon_ico: {                                                                                                // 26
		label: 'favicon (ico)',                                                                                      // 27
		defaultUrl: 'favicon.ico',                                                                                   // 28
		constraints: {                                                                                               // 29
			type: 'image',                                                                                              // 30
			extensions: ['ico'],                                                                                        // 31
			width: undefined,                                                                                           // 32
			height: undefined                                                                                           // 33
		}                                                                                                            // 29
	},                                                                                                            // 26
	favicon: {                                                                                                    // 36
		label: 'favicon (svg)',                                                                                      // 37
		defaultUrl: 'images/logo/icon.svg',                                                                          // 38
		constraints: {                                                                                               // 39
			type: 'image',                                                                                              // 40
			extensions: ['svg'],                                                                                        // 41
			width: undefined,                                                                                           // 42
			height: undefined                                                                                           // 43
		}                                                                                                            // 39
	},                                                                                                            // 36
	favicon_16: {                                                                                                 // 46
		label: 'favicon 16x16 (png)',                                                                                // 47
		defaultUrl: 'images/logo/favicon-16x16.png',                                                                 // 48
		constraints: {                                                                                               // 49
			type: 'image',                                                                                              // 50
			extensions: ['png'],                                                                                        // 51
			width: 16,                                                                                                  // 52
			height: 16                                                                                                  // 53
		}                                                                                                            // 49
	},                                                                                                            // 46
	favicon_32: {                                                                                                 // 56
		label: 'favicon 32x32 (png)',                                                                                // 57
		defaultUrl: 'images/logo/favicon-32x32.png',                                                                 // 58
		constraints: {                                                                                               // 59
			type: 'image',                                                                                              // 60
			extensions: ['png'],                                                                                        // 61
			width: 32,                                                                                                  // 62
			height: 32                                                                                                  // 63
		}                                                                                                            // 59
	},                                                                                                            // 56
	favicon_192: {                                                                                                // 66
		label: 'android-chrome 192x192 (png)',                                                                       // 67
		defaultUrl: 'images/logo/android-chrome-192x192.png',                                                        // 68
		constraints: {                                                                                               // 69
			type: 'image',                                                                                              // 70
			extensions: ['png'],                                                                                        // 71
			width: 192,                                                                                                 // 72
			height: 192                                                                                                 // 73
		}                                                                                                            // 69
	},                                                                                                            // 66
	favicon_512: {                                                                                                // 76
		label: 'android-chrome 512x512 (png)',                                                                       // 77
		defaultUrl: 'images/logo/512x512.png',                                                                       // 78
		constraints: {                                                                                               // 79
			type: 'image',                                                                                              // 80
			extensions: ['png'],                                                                                        // 81
			width: 512,                                                                                                 // 82
			height: 512                                                                                                 // 83
		}                                                                                                            // 79
	},                                                                                                            // 76
	touchicon_180: {                                                                                              // 86
		label: 'apple-touch-icon 180x180 (png)',                                                                     // 87
		defaultUrl: 'images/logo/apple-touch-icon.png',                                                              // 88
		constraints: {                                                                                               // 89
			type: 'image',                                                                                              // 90
			extensions: ['png'],                                                                                        // 91
			width: 180,                                                                                                 // 92
			height: 180                                                                                                 // 93
		}                                                                                                            // 89
	},                                                                                                            // 86
	touchicon_180_pre: {                                                                                          // 96
		label: 'apple-touch-icon-precomposed 180x180 (png)',                                                         // 97
		defaultUrl: 'images/logo/apple-touch-icon-precomposed.png',                                                  // 98
		constraints: {                                                                                               // 99
			type: 'image',                                                                                              // 100
			extensions: ['png'],                                                                                        // 101
			width: 180,                                                                                                 // 102
			height: 180                                                                                                 // 103
		}                                                                                                            // 99
	},                                                                                                            // 96
	tile_144: {                                                                                                   // 106
		label: 'mstile 144x144 (png)',                                                                               // 107
		defaultUrl: 'images/logo/mstile-144x144.png',                                                                // 108
		constraints: {                                                                                               // 109
			type: 'image',                                                                                              // 110
			extensions: ['png'],                                                                                        // 111
			width: 144,                                                                                                 // 112
			height: 144                                                                                                 // 113
		}                                                                                                            // 109
	},                                                                                                            // 106
	tile_150: {                                                                                                   // 116
		label: 'mstile 150x150 (png)',                                                                               // 117
		defaultUrl: 'images/logo/mstile-150x150.png',                                                                // 118
		constraints: {                                                                                               // 119
			type: 'image',                                                                                              // 120
			extensions: ['png'],                                                                                        // 121
			width: 150,                                                                                                 // 122
			height: 150                                                                                                 // 123
		}                                                                                                            // 119
	},                                                                                                            // 116
	tile_310_square: {                                                                                            // 126
		label: 'mstile 310x310 (png)',                                                                               // 127
		defaultUrl: 'images/logo/mstile-310x310.png',                                                                // 128
		constraints: {                                                                                               // 129
			type: 'image',                                                                                              // 130
			extensions: ['png'],                                                                                        // 131
			width: 310,                                                                                                 // 132
			height: 310                                                                                                 // 133
		}                                                                                                            // 129
	},                                                                                                            // 126
	tile_310_wide: {                                                                                              // 136
		label: 'mstile 310x150 (png)',                                                                               // 137
		defaultUrl: 'images/logo/mstile-310x150.png',                                                                // 138
		constraints: {                                                                                               // 139
			type: 'image',                                                                                              // 140
			extensions: ['png'],                                                                                        // 141
			width: 310,                                                                                                 // 142
			height: 150                                                                                                 // 143
		}                                                                                                            // 139
	},                                                                                                            // 136
	safari_pinned: {                                                                                              // 146
		label: 'safari pinned tab (svg)',                                                                            // 147
		defaultUrl: 'images/logo/safari-pinned-tab.svg',                                                             // 148
		constraints: {                                                                                               // 149
			type: 'image',                                                                                              // 150
			extensions: ['svg'],                                                                                        // 151
			width: undefined,                                                                                           // 152
			height: undefined                                                                                           // 153
		}                                                                                                            // 149
	}                                                                                                             // 146
};                                                                                                             // 15
RocketChat.Assets = new (function () {                                                                         // 158
	function _class() {                                                                                           // 158
		(0, _classCallCheck3.default)(this, _class);                                                                 // 158
	}                                                                                                             // 158
                                                                                                               //
	_class.prototype.setAsset = function () {                                                                     // 158
		function setAsset(binaryContent, contentType, asset) {                                                       // 158
			if (!assets[asset]) {                                                                                       // 168
				throw new Meteor.Error('error-invalid-asset', 'Invalid asset', {                                           // 169
					"function": 'RocketChat.Assets.setAsset'                                                                  // 170
				});                                                                                                        // 169
			}                                                                                                           // 172
                                                                                                               //
			var extension = mime.extension(contentType);                                                                // 174
                                                                                                               //
			if (assets[asset].constraints.extensions.includes(extension) === false) {                                   // 175
				throw new Meteor.Error(contentType, "Invalid file type: " + contentType, {                                 // 176
					"function": 'RocketChat.Assets.setAsset',                                                                 // 177
					errorTitle: 'error-invalid-file-type'                                                                     // 178
				});                                                                                                        // 176
			}                                                                                                           // 180
                                                                                                               //
			var file = new Buffer(binaryContent, 'binary');                                                             // 182
                                                                                                               //
			if (assets[asset].constraints.width || assets[asset].constraints.height) {                                  // 183
				var dimensions = sizeOf(file);                                                                             // 184
                                                                                                               //
				if (assets[asset].constraints.width && assets[asset].constraints.width !== dimensions.width) {             // 185
					throw new Meteor.Error('error-invalid-file-width', 'Invalid file width', {                                // 186
						"function": 'Invalid file width'                                                                         // 187
					});                                                                                                       // 186
				}                                                                                                          // 189
                                                                                                               //
				if (assets[asset].constraints.height && assets[asset].constraints.height !== dimensions.height) {          // 190
					throw new Meteor.Error('error-invalid-file-height');                                                      // 191
				}                                                                                                          // 192
			}                                                                                                           // 193
                                                                                                               //
			var rs = RocketChatFile.bufferToStream(file);                                                               // 195
			RocketChatAssetsInstance.deleteFile(asset);                                                                 // 196
			var ws = RocketChatAssetsInstance.createWriteStream(asset, contentType);                                    // 198
			ws.on('end', Meteor.bindEnvironment(function () {                                                           // 199
				return Meteor.setTimeout(function () {                                                                     // 200
					var key = "Assets_" + asset;                                                                              // 201
					var value = {                                                                                             // 202
						url: "assets/" + asset + "." + extension,                                                                // 203
						defaultUrl: assets[asset].defaultUrl                                                                     // 204
					};                                                                                                        // 202
					RocketChat.settings.updateById(key, value);                                                               // 207
					return RocketChat.Assets.processAsset(key, value);                                                        // 208
				}, 200);                                                                                                   // 209
			}));                                                                                                        // 210
			rs.pipe(ws);                                                                                                // 212
		}                                                                                                            // 213
                                                                                                               //
		return setAsset;                                                                                             // 158
	}();                                                                                                          // 158
                                                                                                               //
	_class.prototype.unsetAsset = function () {                                                                   // 158
		function unsetAsset(asset) {                                                                                 // 158
			if (!assets[asset]) {                                                                                       // 216
				throw new Meteor.Error('error-invalid-asset', 'Invalid asset', {                                           // 217
					"function": 'RocketChat.Assets.unsetAsset'                                                                // 218
				});                                                                                                        // 217
			}                                                                                                           // 220
                                                                                                               //
			RocketChatAssetsInstance.deleteFile(asset);                                                                 // 222
			var key = "Assets_" + asset;                                                                                // 223
			var value = {                                                                                               // 224
				defaultUrl: assets[asset].defaultUrl                                                                       // 225
			};                                                                                                          // 224
			RocketChat.settings.updateById(key, value);                                                                 // 228
			RocketChat.Assets.processAsset(key, value);                                                                 // 229
		}                                                                                                            // 230
                                                                                                               //
		return unsetAsset;                                                                                           // 158
	}();                                                                                                          // 158
                                                                                                               //
	_class.prototype.refreshClients = function () {                                                               // 158
		function refreshClients() {                                                                                  // 158
			return process.emit('message', {                                                                            // 233
				refresh: 'client'                                                                                          // 234
			});                                                                                                         // 233
		}                                                                                                            // 236
                                                                                                               //
		return refreshClients;                                                                                       // 158
	}();                                                                                                          // 158
                                                                                                               //
	_class.prototype.processAsset = function () {                                                                 // 158
		function processAsset(settingKey, settingValue) {                                                            // 158
			if (settingKey.indexOf('Assets_') !== 0) {                                                                  // 239
				return;                                                                                                    // 240
			}                                                                                                           // 241
                                                                                                               //
			var assetKey = settingKey.replace(/^Assets_/, '');                                                          // 243
			var assetValue = assets[assetKey];                                                                          // 244
                                                                                                               //
			if (!assetValue) {                                                                                          // 246
				return;                                                                                                    // 247
			}                                                                                                           // 248
                                                                                                               //
			if (!settingValue || !settingValue.url) {                                                                   // 250
				assetValue.cache = undefined;                                                                              // 251
				return;                                                                                                    // 252
			}                                                                                                           // 253
                                                                                                               //
			var file = RocketChatAssetsInstance.getFileSync(assetKey);                                                  // 255
                                                                                                               //
			if (!file) {                                                                                                // 256
				assetValue.cache = undefined;                                                                              // 257
				return;                                                                                                    // 258
			}                                                                                                           // 259
                                                                                                               //
			var hash = crypto.createHash('sha1').update(file.buffer).digest('hex');                                     // 261
			var extension = settingValue.url.split('.').pop();                                                          // 262
			return assetValue.cache = {                                                                                 // 264
				path: "assets/" + assetKey + "." + extension,                                                              // 265
				cacheable: false,                                                                                          // 266
				sourceMapUrl: undefined,                                                                                   // 267
				where: 'client',                                                                                           // 268
				type: 'asset',                                                                                             // 269
				content: file.buffer,                                                                                      // 270
				extension: extension,                                                                                      // 271
				url: "/assets/" + assetKey + "." + extension + "?" + hash,                                                 // 272
				size: file.length,                                                                                         // 273
				uploadDate: file.uploadDate,                                                                               // 274
				contentType: file.contentType,                                                                             // 275
				hash: hash                                                                                                 // 276
			};                                                                                                          // 264
		}                                                                                                            // 278
                                                                                                               //
		return processAsset;                                                                                         // 158
	}();                                                                                                          // 158
                                                                                                               //
	(0, _createClass3.default)(_class, [{                                                                         // 158
		key: "mime",                                                                                                 // 158
		get: function () {                                                                                           // 158
			return mime;                                                                                                // 160
		}                                                                                                            // 161
	}, {                                                                                                          // 158
		key: "assets",                                                                                               // 158
		get: function () {                                                                                           // 158
			return assets;                                                                                              // 164
		}                                                                                                            // 165
	}]);                                                                                                          // 158
	return _class;                                                                                                // 158
}())();                                                                                                        // 158
RocketChat.settings.addGroup('Assets');                                                                        // 281
RocketChat.settings.add('Assets_SvgFavicon_Enable', true, {                                                    // 283
	type: 'boolean',                                                                                              // 284
	group: 'Assets',                                                                                              // 285
	i18nLabel: 'Enable_Svg_Favicon'                                                                               // 286
});                                                                                                            // 283
                                                                                                               //
function addAssetToSetting(key, value) {                                                                       // 289
	return RocketChat.settings.add("Assets_" + key, {                                                             // 290
		defaultUrl: value.defaultUrl                                                                                 // 291
	}, {                                                                                                          // 290
		type: 'asset',                                                                                               // 293
		group: 'Assets',                                                                                             // 294
		fileConstraints: value.constraints,                                                                          // 295
		i18nLabel: value.label,                                                                                      // 296
		asset: key,                                                                                                  // 297
		"public": true                                                                                               // 298
	});                                                                                                           // 292
}                                                                                                              // 300
                                                                                                               //
for (var _iterator = Object.keys(assets), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	var _ref;                                                                                                     // 302
                                                                                                               //
	if (_isArray) {                                                                                               // 302
		if (_i >= _iterator.length) break;                                                                           // 302
		_ref = _iterator[_i++];                                                                                      // 302
	} else {                                                                                                      // 302
		_i = _iterator.next();                                                                                       // 302
		if (_i.done) break;                                                                                          // 302
		_ref = _i.value;                                                                                             // 302
	}                                                                                                             // 302
                                                                                                               //
	var key = _ref;                                                                                               // 302
	var value = assets[key];                                                                                      // 303
	addAssetToSetting(key, value);                                                                                // 304
}                                                                                                              // 305
                                                                                                               //
RocketChat.models.Settings.find().observe({                                                                    // 307
	added: function (record) {                                                                                    // 308
		return RocketChat.Assets.processAsset(record._id, record.value);                                             // 309
	},                                                                                                            // 310
	changed: function (record) {                                                                                  // 312
		return RocketChat.Assets.processAsset(record._id, record.value);                                             // 313
	},                                                                                                            // 314
	removed: function (record) {                                                                                  // 316
		return RocketChat.Assets.processAsset(record._id, undefined);                                                // 317
	}                                                                                                             // 318
});                                                                                                            // 307
Meteor.startup(function () {                                                                                   // 321
	return Meteor.setTimeout(function () {                                                                        // 322
		return process.emit('message', {                                                                             // 323
			refresh: 'client'                                                                                           // 324
		});                                                                                                          // 323
	}, 200);                                                                                                      // 326
});                                                                                                            // 327
var calculateClientHash = WebAppHashing.calculateClientHash;                                                   // 329
                                                                                                               //
WebAppHashing.calculateClientHash = function (manifest, includeFilter, runtimeConfigOverride) {                // 331
	for (var _iterator2 = Object.keys(assets), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
		var _ref2;                                                                                                   // 332
                                                                                                               //
		if (_isArray2) {                                                                                             // 332
			if (_i2 >= _iterator2.length) break;                                                                        // 332
			_ref2 = _iterator2[_i2++];                                                                                  // 332
		} else {                                                                                                     // 332
			_i2 = _iterator2.next();                                                                                    // 332
			if (_i2.done) break;                                                                                        // 332
			_ref2 = _i2.value;                                                                                          // 332
		}                                                                                                            // 332
                                                                                                               //
		var _key = _ref2;                                                                                            // 332
		var value = assets[_key];                                                                                    // 333
                                                                                                               //
		if (!value.cache && !value.defaultUrl) {                                                                     // 334
			continue;                                                                                                   // 335
		}                                                                                                            // 336
                                                                                                               //
		var cache = {};                                                                                              // 338
                                                                                                               //
		if (value.cache) {                                                                                           // 339
			cache = {                                                                                                   // 340
				path: value.cache.path,                                                                                    // 341
				cacheable: value.cache.cacheable,                                                                          // 342
				sourceMapUrl: value.cache.sourceMapUrl,                                                                    // 343
				where: value.cache.where,                                                                                  // 344
				type: value.cache.type,                                                                                    // 345
				url: value.cache.url,                                                                                      // 346
				size: value.cache.size,                                                                                    // 347
				hash: value.cache.hash                                                                                     // 348
			};                                                                                                          // 340
			WebAppInternals.staticFiles["/__cordova/assets/" + _key] = value.cache;                                     // 350
			WebAppInternals.staticFiles["/__cordova/assets/" + _key + "." + value.cache.extension] = value.cache;       // 351
		} else {                                                                                                     // 352
			var extension = value.defaultUrl.split('.').pop();                                                          // 353
			cache = {                                                                                                   // 354
				path: "assets/" + _key + "." + extension,                                                                  // 355
				cacheable: false,                                                                                          // 356
				sourceMapUrl: undefined,                                                                                   // 357
				where: 'client',                                                                                           // 358
				type: 'asset',                                                                                             // 359
				url: "/assets/" + _key + "." + extension + "?v3",                                                          // 360
				hash: 'v3'                                                                                                 // 361
			};                                                                                                          // 354
			WebAppInternals.staticFiles["/__cordova/assets/" + _key] = WebAppInternals.staticFiles["/__cordova/" + value.defaultUrl];
			WebAppInternals.staticFiles["/__cordova/assets/" + _key + "." + extension] = WebAppInternals.staticFiles["/__cordova/" + value.defaultUrl];
		}                                                                                                            // 366
                                                                                                               //
		var manifestItem = _.findWhere(manifest, {                                                                   // 368
			path: _key                                                                                                  // 369
		});                                                                                                          // 368
                                                                                                               //
		if (manifestItem) {                                                                                          // 372
			var index = manifest.indexOf(manifestItem);                                                                 // 373
			manifest[index] = cache;                                                                                    // 374
		} else {                                                                                                     // 375
			manifest.push(cache);                                                                                       // 376
		}                                                                                                            // 377
	}                                                                                                             // 378
                                                                                                               //
	return calculateClientHash.call(this, manifest, includeFilter, runtimeConfigOverride);                        // 380
};                                                                                                             // 381
                                                                                                               //
Meteor.methods({                                                                                               // 383
	refreshClients: function () {                                                                                 // 384
		if (!Meteor.userId()) {                                                                                      // 385
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                              // 386
				method: 'refreshClients'                                                                                   // 387
			});                                                                                                         // 386
		}                                                                                                            // 389
                                                                                                               //
		var hasPermission = RocketChat.authz.hasPermission(Meteor.userId(), 'manage-assets');                        // 391
                                                                                                               //
		if (!hasPermission) {                                                                                        // 392
			throw new Meteor.Error('error-action-now-allowed', 'Managing assets not allowed', {                         // 393
				method: 'refreshClients',                                                                                  // 394
				action: 'Managing_assets'                                                                                  // 395
			});                                                                                                         // 393
		}                                                                                                            // 397
                                                                                                               //
		return RocketChat.Assets.refreshClients();                                                                   // 399
	},                                                                                                            // 400
	unsetAsset: function (asset) {                                                                                // 402
		if (!Meteor.userId()) {                                                                                      // 403
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                              // 404
				method: 'unsetAsset'                                                                                       // 405
			});                                                                                                         // 404
		}                                                                                                            // 407
                                                                                                               //
		var hasPermission = RocketChat.authz.hasPermission(Meteor.userId(), 'manage-assets');                        // 409
                                                                                                               //
		if (!hasPermission) {                                                                                        // 410
			throw new Meteor.Error('error-action-now-allowed', 'Managing assets not allowed', {                         // 411
				method: 'unsetAsset',                                                                                      // 412
				action: 'Managing_assets'                                                                                  // 413
			});                                                                                                         // 411
		}                                                                                                            // 415
                                                                                                               //
		return RocketChat.Assets.unsetAsset(asset);                                                                  // 417
	},                                                                                                            // 418
	setAsset: function (binaryContent, contentType, asset) {                                                      // 420
		if (!Meteor.userId()) {                                                                                      // 421
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                              // 422
				method: 'setAsset'                                                                                         // 423
			});                                                                                                         // 422
		}                                                                                                            // 425
                                                                                                               //
		var hasPermission = RocketChat.authz.hasPermission(Meteor.userId(), 'manage-assets');                        // 427
                                                                                                               //
		if (!hasPermission) {                                                                                        // 428
			throw new Meteor.Error('error-action-now-allowed', 'Managing assets not allowed', {                         // 429
				method: 'setAsset',                                                                                        // 430
				action: 'Managing_assets'                                                                                  // 431
			});                                                                                                         // 429
		}                                                                                                            // 433
                                                                                                               //
		RocketChat.Assets.setAsset(binaryContent, contentType, asset);                                               // 435
	}                                                                                                             // 436
});                                                                                                            // 383
WebApp.connectHandlers.use('/assets/', Meteor.bindEnvironment(function (req, res, next) {                      // 439
	var params = {                                                                                                // 440
		asset: decodeURIComponent(req.url.replace(/^\//, '').replace(/\?.*$/, '')).replace(/\.[^.]*$/, '')           // 441
	};                                                                                                            // 440
	var file = assets[params.asset] && assets[params.asset].cache;                                                // 444
                                                                                                               //
	if (!file) {                                                                                                  // 446
		if (assets[params.asset] && assets[params.asset].defaultUrl) {                                               // 447
			req.url = "/" + assets[params.asset].defaultUrl;                                                            // 448
			WebAppInternals.staticFilesMiddleware(WebAppInternals.staticFiles, req, res, next);                         // 449
		} else {                                                                                                     // 450
			res.writeHead(404);                                                                                         // 451
			res.end();                                                                                                  // 452
		}                                                                                                            // 453
                                                                                                               //
		return;                                                                                                      // 455
	}                                                                                                             // 456
                                                                                                               //
	var reqModifiedHeader = req.headers['if-modified-since'];                                                     // 458
                                                                                                               //
	if (reqModifiedHeader) {                                                                                      // 459
		if (reqModifiedHeader === (file.uploadDate && file.uploadDate.toUTCString())) {                              // 460
			res.setHeader('Last-Modified', reqModifiedHeader);                                                          // 461
			res.writeHead(304);                                                                                         // 462
			res.end();                                                                                                  // 463
			return;                                                                                                     // 464
		}                                                                                                            // 465
	}                                                                                                             // 466
                                                                                                               //
	res.setHeader('Cache-Control', 'public, max-age=0');                                                          // 468
	res.setHeader('Expires', '-1');                                                                               // 469
	res.setHeader('Last-Modified', file.uploadDate && file.uploadDate.toUTCString() || new Date().toUTCString());
	res.setHeader('Content-Type', file.contentType);                                                              // 471
	res.setHeader('Content-Length', file.size);                                                                   // 472
	res.writeHead(200);                                                                                           // 473
	res.end(file.content);                                                                                        // 474
}));                                                                                                           // 475
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"node_modules":{"image-size":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// .npm/package/node_modules/image-size/package.json                                                           //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
exports.name = "image-size";
exports.version = "0.4.0";
exports.main = "lib/index.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// node_modules/meteor/rocketchat_assets/node_modules/image-size/lib/index.js                                  //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
'use strict';

var fs = require('fs');
var path = require('path');

var detector = require('./detector');

var handlers = {};
var types = require('./types');

// load all available handlers
types.forEach(function (type) {
  handlers[type] = require('./types/' + type);
});

// Maximum buffer size, with a default of 128 kilobytes.
// TO-DO: make this adaptive based on the initial signature of the image
var MaxBufferSize = 128*1024;

function lookup (buffer, filepath) {
  // detect the file type.. don't rely on the extension
  var type = detector(buffer, filepath);

  // find an appropriate handler for this file type
  if (type in handlers) {
    var size = handlers[type].calculate(buffer, filepath);
    if (size !== false) {
      size.type = type;
      return size;
    }
  }

  // throw up, if we don't understand the file
  throw new TypeError('unsupported file type');
}

function asyncFileToBuffer (filepath, callback) {
  // open the file in read only mode
  fs.open(filepath, 'r', function (err, descriptor) {
    if (err) { return callback(err); }
    var size = fs.fstatSync(descriptor).size;
    var bufferSize = Math.min(size, MaxBufferSize);
    var buffer = new Buffer(bufferSize);
    // read first buffer block from the file, asynchronously
    fs.read(descriptor, buffer, 0, bufferSize, 0, function (err) {
      if (err) { return callback(err); }
      // close the file, we are done
      fs.close(descriptor, function (err) {
        callback(err, buffer);
      });
    });
  });
}

function syncFileToBuffer (filepath) {
  // read from the file, synchronously
  var descriptor = fs.openSync(filepath, 'r');
  var size = fs.fstatSync(descriptor).size;
  var bufferSize = Math.min(size, MaxBufferSize);
  var buffer = new Buffer(bufferSize);
  fs.readSync(descriptor, buffer, 0, bufferSize, 0);
  fs.closeSync(descriptor);
  return buffer;
}

/**
 * @params input - buffer or relative/absolute path of the image file
 * @params callback - optional function for async detection
 */
module.exports = function (input, callback) {

  // Handle buffer input
  if (Buffer.isBuffer(input)) {
    return lookup(input);
  }

  // input should be a string at this point
  if (typeof input !== 'string') {
    throw new TypeError('invalid invocation');
  }

  // resolve the file path
  var filepath = path.resolve(input);

  if (typeof callback === 'function') {
    asyncFileToBuffer(filepath, function (err, buffer) {
      if (err) { return callback(err); }

      // return the dimensions
      var dimensions;
      try {
        dimensions = lookup(buffer, filepath);
      } catch (e) {
        err = e;
      }
      callback(err, dimensions);
    });
  } else {
    var buffer = syncFileToBuffer(filepath);
    return lookup(buffer, filepath);
  }
};

module.exports.types = types;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:assets/server/assets.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:assets'] = {};

})();

//# sourceMappingURL=rocketchat_assets.js.map

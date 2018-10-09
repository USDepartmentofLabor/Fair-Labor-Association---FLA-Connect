(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var changeCase = Package['konecty:change-case'].changeCase;
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

/* Package-scope variables */
var OEmbed;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:oembed":{"server":{"server.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_oembed/server/server.js                                                                    //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
/*globals HTTPInternals, changeCase */var URL = Npm.require('url');                                               // 1
                                                                                                                  //
var querystring = Npm.require('querystring');                                                                     // 4
                                                                                                                  //
var request = HTTPInternals.NpmModules.request.module;                                                            // 6
                                                                                                                  //
var iconv = Npm.require('iconv-lite');                                                                            // 8
                                                                                                                  //
var ipRangeCheck = Npm.require('ip-range-check');                                                                 // 10
                                                                                                                  //
var he = Npm.require('he');                                                                                       // 12
                                                                                                                  //
var jschardet = Npm.require('jschardet');                                                                         // 14
                                                                                                                  //
var OEmbed = {}; //  Detect encoding                                                                              // 16
//  Priority:                                                                                                     // 19
//  Detected == HTTP Header > Detected == HTML meta > HTTP Header > HTML meta > Detected > Default (utf-8)        // 20
//  See also: https://www.w3.org/International/questions/qa-html-encoding-declarations.en#quickanswer             // 21
                                                                                                                  //
var getCharset = function (contentType, body) {                                                                   // 22
	var detectedCharset = void 0;                                                                                    // 23
	var httpHeaderCharset = void 0;                                                                                  // 24
	var htmlMetaCharset = void 0;                                                                                    // 25
	var result = void 0;                                                                                             // 26
	contentType = contentType || '';                                                                                 // 28
	var binary = body.toString('binary');                                                                            // 30
	var detected = jschardet.detect(binary);                                                                         // 31
                                                                                                                  //
	if (detected.confidence > 0.8) {                                                                                 // 32
		detectedCharset = detected.encoding.toLowerCase();                                                              // 33
	}                                                                                                                // 34
                                                                                                                  //
	var m1 = contentType.match(/charset=([\w\-]+)/i);                                                                // 35
                                                                                                                  //
	if (m1) {                                                                                                        // 36
		httpHeaderCharset = m1[1].toLowerCase();                                                                        // 37
	}                                                                                                                // 38
                                                                                                                  //
	var m2 = binary.match(/<meta\b[^>]*charset=["']?([\w\-]+)/i);                                                    // 39
                                                                                                                  //
	if (m2) {                                                                                                        // 40
		htmlMetaCharset = m2[1].toLowerCase();                                                                          // 41
	}                                                                                                                // 42
                                                                                                                  //
	if (detectedCharset) {                                                                                           // 43
		if (detectedCharset === httpHeaderCharset) {                                                                    // 44
			result = httpHeaderCharset;                                                                                    // 45
		} else if (detectedCharset === htmlMetaCharset) {                                                               // 46
			result = htmlMetaCharset;                                                                                      // 47
		}                                                                                                               // 48
	}                                                                                                                // 49
                                                                                                                  //
	if (!result) {                                                                                                   // 50
		result = httpHeaderCharset || htmlMetaCharset || detectedCharset;                                               // 51
	}                                                                                                                // 52
                                                                                                                  //
	return result || 'utf-8';                                                                                        // 53
};                                                                                                                // 54
                                                                                                                  //
var toUtf8 = function (contentType, body) {                                                                       // 56
	return iconv.decode(body, getCharset(contentType, body));                                                        // 57
};                                                                                                                // 58
                                                                                                                  //
var getUrlContent = function (urlObj) {                                                                           // 60
	var redirectCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;                       // 60
	var callback = arguments[2];                                                                                     // 60
                                                                                                                  //
	if (_.isString(urlObj)) {                                                                                        // 62
		urlObj = URL.parse(urlObj);                                                                                     // 63
	}                                                                                                                // 64
                                                                                                                  //
	var parsedUrl = _.pick(urlObj, ['host', 'hash', 'pathname', 'protocol', 'port', 'query', 'search', 'hostname']);
                                                                                                                  //
	var ignoredHosts = RocketChat.settings.get('API_EmbedIgnoredHosts').replace(/\s/g, '').split(',') || [];         // 67
                                                                                                                  //
	if (ignoredHosts.includes(parsedUrl.hostname) || ipRangeCheck(parsedUrl.hostname, ignoredHosts)) {               // 68
		return callback();                                                                                              // 69
	}                                                                                                                // 70
                                                                                                                  //
	var safePorts = RocketChat.settings.get('API_EmbedSafePorts').replace(/\s/g, '').split(',') || [];               // 72
                                                                                                                  //
	if (parsedUrl.port && safePorts.length > 0 && !safePorts.includes(parsedUrl.port)) {                             // 73
		return callback();                                                                                              // 74
	}                                                                                                                // 75
                                                                                                                  //
	var data = RocketChat.callbacks.run('oembed:beforeGetUrlContent', {                                              // 77
		urlObj: urlObj,                                                                                                 // 78
		parsedUrl: parsedUrl                                                                                            // 79
	});                                                                                                              // 77
                                                                                                                  //
	if (data.attachments != null) {                                                                                  // 81
		return callback(null, data);                                                                                    // 82
	}                                                                                                                // 83
                                                                                                                  //
	var url = URL.format(data.urlObj);                                                                               // 84
	var opts = {                                                                                                     // 85
		url: url,                                                                                                       // 86
		strictSSL: !RocketChat.settings.get('Allow_Invalid_SelfSigned_Certs'),                                          // 87
		gzip: true,                                                                                                     // 88
		maxRedirects: redirectCount,                                                                                    // 89
		headers: {                                                                                                      // 90
			'User-Agent': RocketChat.settings.get('API_Embed_UserAgent')                                                   // 91
		}                                                                                                               // 90
	};                                                                                                               // 85
	var headers = null;                                                                                              // 94
	var statusCode = null;                                                                                           // 95
	var error = null;                                                                                                // 96
	var chunks = [];                                                                                                 // 97
	var chunksTotalLength = 0;                                                                                       // 98
	var stream = request(opts);                                                                                      // 99
	stream.on('response', function (response) {                                                                      // 100
		statusCode = response.statusCode;                                                                               // 101
		headers = response.headers;                                                                                     // 102
                                                                                                                  //
		if (response.statusCode !== 200) {                                                                              // 103
			return stream.abort();                                                                                         // 104
		}                                                                                                               // 105
	});                                                                                                              // 106
	stream.on('data', function (chunk) {                                                                             // 107
		chunks.push(chunk);                                                                                             // 108
		chunksTotalLength += chunk.length;                                                                              // 109
                                                                                                                  //
		if (chunksTotalLength > 250000) {                                                                               // 110
			return stream.abort();                                                                                         // 111
		}                                                                                                               // 112
	});                                                                                                              // 113
	stream.on('end', Meteor.bindEnvironment(function () {                                                            // 114
		if (error != null) {                                                                                            // 115
			return callback(null, {                                                                                        // 116
				error: error,                                                                                                 // 117
				parsedUrl: parsedUrl                                                                                          // 118
			});                                                                                                            // 116
		}                                                                                                               // 120
                                                                                                                  //
		var buffer = Buffer.concat(chunks);                                                                             // 121
		return callback(null, {                                                                                         // 122
			headers: headers,                                                                                              // 123
			body: toUtf8(headers['content-type'], buffer),                                                                 // 124
			parsedUrl: parsedUrl,                                                                                          // 125
			statusCode: statusCode                                                                                         // 126
		});                                                                                                             // 122
	}));                                                                                                             // 128
	return stream.on('error', function (err) {                                                                       // 129
		return error = err;                                                                                             // 130
	});                                                                                                              // 131
};                                                                                                                // 132
                                                                                                                  //
OEmbed.getUrlMeta = function (url, withFragment) {                                                                // 134
	var getUrlContentSync = Meteor.wrapAsync(getUrlContent);                                                         // 135
	var urlObj = URL.parse(url);                                                                                     // 136
                                                                                                                  //
	if (withFragment != null) {                                                                                      // 137
		var queryStringObj = querystring.parse(urlObj.query);                                                           // 138
		queryStringObj._escaped_fragment_ = '';                                                                         // 139
		urlObj.query = querystring.stringify(queryStringObj);                                                           // 140
		var path = urlObj.pathname;                                                                                     // 141
                                                                                                                  //
		if (urlObj.query != null) {                                                                                     // 142
			path += "?" + urlObj.query;                                                                                    // 143
		}                                                                                                               // 144
                                                                                                                  //
		urlObj.path = path;                                                                                             // 145
	}                                                                                                                // 146
                                                                                                                  //
	var content = getUrlContentSync(urlObj, 5);                                                                      // 147
                                                                                                                  //
	if (!content) {                                                                                                  // 148
		return;                                                                                                         // 149
	}                                                                                                                // 150
                                                                                                                  //
	if (content.attachments != null) {                                                                               // 151
		return content;                                                                                                 // 152
	}                                                                                                                // 153
                                                                                                                  //
	var metas = undefined;                                                                                           // 154
                                                                                                                  //
	if (content && content.body) {                                                                                   // 155
		metas = {};                                                                                                     // 156
		content.body.replace(/<title[^>]*>([^<]*)<\/title>/gmi, function (meta, title) {                                // 157
			return metas.pageTitle != null ? metas.pageTitle : metas.pageTitle = he.unescape(title);                       // 158
		});                                                                                                             // 159
		content.body.replace(/<meta[^>]*(?:name|property)=[']([^']*)['][^>]*\scontent=[']([^']*)['][^>]*>/gmi, function (meta, name, value) {
			var name1 = void 0;                                                                                            // 161
			return metas[name1 = changeCase.camelCase(name)] != null ? metas[name1] : metas[name1] = he.unescape(value);   // 162
		});                                                                                                             // 163
		content.body.replace(/<meta[^>]*(?:name|property)=["]([^"]*)["][^>]*\scontent=["]([^"]*)["][^>]*>/gmi, function (meta, name, value) {
			var name1 = void 0;                                                                                            // 165
			return metas[name1 = changeCase.camelCase(name)] != null ? metas[name1] : metas[name1] = he.unescape(value);   // 166
		});                                                                                                             // 167
		content.body.replace(/<meta[^>]*\scontent=[']([^']*)['][^>]*(?:name|property)=[']([^']*)['][^>]*>/gmi, function (meta, value, name) {
			var name1 = void 0;                                                                                            // 169
			return metas[name1 = changeCase.camelCase(name)] != null ? metas[name1] : metas[name1] = he.unescape(value);   // 170
		});                                                                                                             // 171
		content.body.replace(/<meta[^>]*\scontent=["]([^"]*)["][^>]*(?:name|property)=["]([^"]*)["][^>]*>/gmi, function (meta, value, name) {
			var name1 = void 0;                                                                                            // 173
			return metas[name1 = changeCase.camelCase(name)] != null ? metas[name1] : metas[name1] = he.unescape(value);   // 174
		});                                                                                                             // 175
                                                                                                                  //
		if (metas.fragment === '!' && withFragment == null) {                                                           // 176
			return OEmbed.getUrlMeta(url, true);                                                                           // 177
		}                                                                                                               // 178
	}                                                                                                                // 179
                                                                                                                  //
	var headers = undefined;                                                                                         // 180
	var data = undefined;                                                                                            // 181
                                                                                                                  //
	if (content && content.headers) {                                                                                // 184
		headers = {};                                                                                                   // 185
		var headerObj = content.headers;                                                                                // 186
		Object.keys(headerObj).forEach(function (header) {                                                              // 187
			headers[changeCase.camelCase(header)] = headerObj[header];                                                     // 188
		});                                                                                                             // 189
	}                                                                                                                // 190
                                                                                                                  //
	if (content && content.statusCode !== 200) {                                                                     // 191
		return data;                                                                                                    // 192
	}                                                                                                                // 193
                                                                                                                  //
	data = RocketChat.callbacks.run('oembed:afterParseContent', {                                                    // 194
		meta: metas,                                                                                                    // 195
		headers: headers,                                                                                               // 196
		parsedUrl: content.parsedUrl,                                                                                   // 197
		content: content                                                                                                // 198
	});                                                                                                              // 194
	return data;                                                                                                     // 200
};                                                                                                                // 201
                                                                                                                  //
OEmbed.getUrlMetaWithCache = function (url, withFragment) {                                                       // 203
	var cache = RocketChat.models.OEmbedCache.findOneById(url);                                                      // 204
                                                                                                                  //
	if (cache != null) {                                                                                             // 205
		return cache.data;                                                                                              // 206
	}                                                                                                                // 207
                                                                                                                  //
	var data = OEmbed.getUrlMeta(url, withFragment);                                                                 // 208
                                                                                                                  //
	if (data != null) {                                                                                              // 209
		try {                                                                                                           // 210
			RocketChat.models.OEmbedCache.createWithIdAndData(url, data);                                                  // 211
		} catch (_error) {                                                                                              // 212
			console.error('OEmbed duplicated record', url);                                                                // 213
		}                                                                                                               // 214
                                                                                                                  //
		return data;                                                                                                    // 215
	}                                                                                                                // 216
};                                                                                                                // 217
                                                                                                                  //
var getRelevantHeaders = function (headersObj) {                                                                  // 219
	var headers = {};                                                                                                // 220
	Object.keys(headersObj).forEach(function (key) {                                                                 // 221
		var value = headersObj[key];                                                                                    // 222
		var lowerCaseKey = key.toLowerCase();                                                                           // 223
                                                                                                                  //
		if ((lowerCaseKey === 'contenttype' || lowerCaseKey === 'contentlength') && value && value.trim() !== '') {     // 224
			headers[key] = value;                                                                                          // 225
		}                                                                                                               // 226
	});                                                                                                              // 227
                                                                                                                  //
	if (Object.keys(headers).length > 0) {                                                                           // 229
		return headers;                                                                                                 // 230
	}                                                                                                                // 231
};                                                                                                                // 232
                                                                                                                  //
var getRelevantMetaTags = function (metaObj) {                                                                    // 234
	var tags = {};                                                                                                   // 235
	Object.keys(metaObj).forEach(function (key) {                                                                    // 236
		var value = metaObj[key];                                                                                       // 237
                                                                                                                  //
		if (/^(og|fb|twitter|oembed|msapplication).+|description|title|pageTitle$/.test(key.toLowerCase()) && value && value.trim() !== '') {
			tags[key] = value;                                                                                             // 239
		}                                                                                                               // 240
	});                                                                                                              // 241
                                                                                                                  //
	if (Object.keys(tags).length > 0) {                                                                              // 243
		return tags;                                                                                                    // 244
	}                                                                                                                // 245
};                                                                                                                // 246
                                                                                                                  //
OEmbed.rocketUrlParser = function (message) {                                                                     // 248
	if (Array.isArray(message.urls)) {                                                                               // 249
		var attachments = [];                                                                                           // 250
		var changed = false;                                                                                            // 251
		message.urls.forEach(function (item) {                                                                          // 252
			if (item.ignoreParse === true) {                                                                               // 253
				return;                                                                                                       // 254
			}                                                                                                              // 255
                                                                                                                  //
			if (item.url.startsWith('grain://')) {                                                                         // 256
				changed = true;                                                                                               // 257
				item.meta = {                                                                                                 // 258
					sandstorm: {                                                                                                 // 259
						grain: item.sandstormViewInfo                                                                               // 260
					}                                                                                                            // 259
				};                                                                                                            // 258
				return;                                                                                                       // 263
			}                                                                                                              // 264
                                                                                                                  //
			if (!/^https?:\/\//i.test(item.url)) {                                                                         // 265
				return;                                                                                                       // 266
			}                                                                                                              // 267
                                                                                                                  //
			var data = OEmbed.getUrlMetaWithCache(item.url);                                                               // 268
                                                                                                                  //
			if (data != null) {                                                                                            // 269
				if (data.attachments) {                                                                                       // 270
					return attachments = _.union(attachments, data.attachments);                                                 // 271
				} else {                                                                                                      // 272
					if (data.meta != null) {                                                                                     // 273
						item.meta = getRelevantMetaTags(data.meta);                                                                 // 274
					}                                                                                                            // 275
                                                                                                                  //
					if (data.headers != null) {                                                                                  // 276
						item.headers = getRelevantHeaders(data.headers);                                                            // 277
					}                                                                                                            // 278
                                                                                                                  //
					item.parsedUrl = data.parsedUrl;                                                                             // 279
					return changed = true;                                                                                       // 280
				}                                                                                                             // 281
			}                                                                                                              // 282
		});                                                                                                             // 283
                                                                                                                  //
		if (attachments.length) {                                                                                       // 284
			RocketChat.models.Messages.setMessageAttachments(message._id, attachments);                                    // 285
		}                                                                                                               // 286
                                                                                                                  //
		if (changed === true) {                                                                                         // 287
			RocketChat.models.Messages.setUrlsById(message._id, message.urls);                                             // 288
		}                                                                                                               // 289
	}                                                                                                                // 290
                                                                                                                  //
	return message;                                                                                                  // 291
};                                                                                                                // 292
                                                                                                                  //
RocketChat.settings.get('API_Embed', function (key, value) {                                                      // 294
	if (value) {                                                                                                     // 295
		return RocketChat.callbacks.add('afterSaveMessage', OEmbed.rocketUrlParser, RocketChat.callbacks.priority.LOW, 'API_Embed');
	} else {                                                                                                         // 297
		return RocketChat.callbacks.remove('afterSaveMessage', 'API_Embed');                                            // 298
	}                                                                                                                // 299
});                                                                                                               // 300
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"providers.js":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_oembed/server/providers.js                                                                 //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                           //
                                                                                                                  //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                  //
                                                                                                                  //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                 //
                                                                                                                  //
/*globals changeCase */var URL = Npm.require('url');                                                              // 1
                                                                                                                  //
var QueryString = Npm.require('querystring');                                                                     // 6
                                                                                                                  //
var Providers = function () {                                                                                     //
	function Providers() {                                                                                           // 9
		(0, _classCallCheck3.default)(this, Providers);                                                                 // 9
		this.providers = [];                                                                                            // 10
	}                                                                                                                // 11
                                                                                                                  //
	Providers.getConsumerUrl = function () {                                                                         //
		function getConsumerUrl(provider, url) {                                                                        //
			var urlObj = URL.parse(provider.endPoint, true);                                                               // 14
			urlObj.query['url'] = url;                                                                                     // 15
			delete urlObj.search;                                                                                          // 16
			return URL.format(urlObj);                                                                                     // 17
		}                                                                                                               // 18
                                                                                                                  //
		return getConsumerUrl;                                                                                          //
	}();                                                                                                             //
                                                                                                                  //
	Providers.prototype.registerProvider = function () {                                                             //
		function registerProvider(provider) {                                                                           //
			return this.providers.push(provider);                                                                          // 21
		}                                                                                                               // 22
                                                                                                                  //
		return registerProvider;                                                                                        //
	}();                                                                                                             //
                                                                                                                  //
	Providers.prototype.getProviders = function () {                                                                 //
		function getProviders() {                                                                                       //
			return this.providers;                                                                                         // 25
		}                                                                                                               // 26
                                                                                                                  //
		return getProviders;                                                                                            //
	}();                                                                                                             //
                                                                                                                  //
	Providers.prototype.getProviderForUrl = function () {                                                            //
		function getProviderForUrl(url) {                                                                               //
			return _.find(this.providers, function (provider) {                                                            // 29
				var candidate = _.find(provider.urls, function (re) {                                                         // 30
					return re.test(url);                                                                                         // 31
				});                                                                                                           // 32
                                                                                                                  //
				return candidate != null;                                                                                     // 33
			});                                                                                                            // 34
		}                                                                                                               // 35
                                                                                                                  //
		return getProviderForUrl;                                                                                       //
	}();                                                                                                             //
                                                                                                                  //
	return Providers;                                                                                                //
}();                                                                                                              //
                                                                                                                  //
var providers = new Providers();                                                                                  // 38
providers.registerProvider({                                                                                      // 40
	urls: [new RegExp('https?://soundcloud.com/\\S+')],                                                              // 41
	endPoint: 'https://soundcloud.com/oembed?format=json&maxheight=150'                                              // 42
});                                                                                                               // 40
providers.registerProvider({                                                                                      // 45
	urls: [new RegExp('https?://vimeo.com/[^/]+'), new RegExp('https?://vimeo.com/channels/[^/]+/[^/]+'), new RegExp('https://vimeo.com/groups/[^/]+/videos/[^/]+')],
	endPoint: 'https://vimeo.com/api/oembed.json?maxheight=200'                                                      // 47
});                                                                                                               // 45
providers.registerProvider({                                                                                      // 50
	urls: [new RegExp('https?://www.youtube.com/\\S+'), new RegExp('https?://youtu.be/\\S+')],                       // 51
	endPoint: 'https://www.youtube.com/oembed?maxheight=200'                                                         // 52
});                                                                                                               // 50
providers.registerProvider({                                                                                      // 55
	urls: [new RegExp('https?://www.rdio.com/\\S+'), new RegExp('https?://rd.io/\\S+')],                             // 56
	endPoint: 'https://www.rdio.com/api/oembed/?format=json&maxheight=150'                                           // 57
});                                                                                                               // 55
providers.registerProvider({                                                                                      // 60
	urls: [new RegExp('https?://www.slideshare.net/[^/]+/[^/]+')],                                                   // 61
	endPoint: 'https://www.slideshare.net/api/oembed/2?format=json&maxheight=200'                                    // 62
});                                                                                                               // 60
providers.registerProvider({                                                                                      // 65
	urls: [new RegExp('https?://www.dailymotion.com/video/\\S+')],                                                   // 66
	endPoint: 'https://www.dailymotion.com/services/oembed?maxheight=200'                                            // 67
});                                                                                                               // 65
RocketChat.oembed = {};                                                                                           // 70
RocketChat.oembed.providers = providers;                                                                          // 72
RocketChat.callbacks.add('oembed:beforeGetUrlContent', function (data) {                                          // 74
	if (data.parsedUrl != null) {                                                                                    // 75
		var url = URL.format(data.parsedUrl);                                                                           // 76
		var provider = providers.getProviderForUrl(url);                                                                // 77
                                                                                                                  //
		if (provider != null) {                                                                                         // 78
			var consumerUrl = Providers.getConsumerUrl(provider, url);                                                     // 79
			consumerUrl = URL.parse(consumerUrl, true);                                                                    // 80
                                                                                                                  //
			_.extend(data.parsedUrl, consumerUrl);                                                                         // 81
                                                                                                                  //
			data.urlObj.port = consumerUrl.port;                                                                           // 82
			data.urlObj.hostname = consumerUrl.hostname;                                                                   // 83
			data.urlObj.pathname = consumerUrl.pathname;                                                                   // 84
			data.urlObj.query = consumerUrl.query;                                                                         // 85
			delete data.urlObj.search;                                                                                     // 86
			delete data.urlObj.host;                                                                                       // 87
		}                                                                                                               // 88
	}                                                                                                                // 89
                                                                                                                  //
	return data;                                                                                                     // 90
}, RocketChat.callbacks.priority.MEDIUM, 'oembed-providers-before');                                              // 91
RocketChat.callbacks.add('oembed:afterParseContent', function (data) {                                            // 93
	if (data.parsedUrl && data.parsedUrl.query) {                                                                    // 94
		var queryString = data.parsedUrl.query;                                                                         // 95
                                                                                                                  //
		if (_.isString(data.parsedUrl.query)) {                                                                         // 96
			queryString = QueryString.parse(data.parsedUrl.query);                                                         // 97
		}                                                                                                               // 98
                                                                                                                  //
		if (queryString.url != null) {                                                                                  // 99
			var url = queryString.url;                                                                                     // 100
			var provider = providers.getProviderForUrl(url);                                                               // 101
                                                                                                                  //
			if (provider != null) {                                                                                        // 102
				if (data.content && data.content.body) {                                                                      // 103
					try {                                                                                                        // 104
						var metas = JSON.parse(data.content.body);                                                                  // 105
                                                                                                                  //
						_.each(metas, function (value, key) {                                                                       // 106
							if (_.isString(value)) {                                                                                   // 107
								return data.meta[changeCase.camelCase("oembed_" + key)] = value;                                          // 108
							}                                                                                                          // 109
						});                                                                                                         // 110
                                                                                                                  //
						data.meta['oembedUrl'] = url;                                                                               // 111
					} catch (error) {                                                                                            // 112
						console.log(error);                                                                                         // 113
					}                                                                                                            // 114
				}                                                                                                             // 115
			}                                                                                                              // 116
		}                                                                                                               // 117
	}                                                                                                                // 118
                                                                                                                  //
	return data;                                                                                                     // 119
}, RocketChat.callbacks.priority.MEDIUM, 'oembed-providers-after');                                               // 120
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"jumpToMessage.js":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_oembed/server/jumpToMessage.js                                                             //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
/* globals getAvatarUrlFromUsername */var URL = Npm.require('url');                                               // 1
                                                                                                                  //
var QueryString = Npm.require('querystring');                                                                     // 4
                                                                                                                  //
var recursiveRemove = function (message) {                                                                        // 5
	var deep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;                                // 5
                                                                                                                  //
	if (message) {                                                                                                   // 6
		if ('attachments' in message && deep < RocketChat.settings.get('Message_QuoteChainLimit')) {                    // 7
			message.attachments.map(function (msg) {                                                                       // 8
				return recursiveRemove(msg, deep + 1);                                                                        // 8
			});                                                                                                            // 8
		} else {                                                                                                        // 9
			delete message.attachments;                                                                                    // 10
		}                                                                                                               // 11
	}                                                                                                                // 12
                                                                                                                  //
	return message;                                                                                                  // 13
};                                                                                                                // 14
                                                                                                                  //
RocketChat.callbacks.add('beforeSaveMessage', function (msg) {                                                    // 16
	if (msg && msg.urls) {                                                                                           // 17
		msg.urls.forEach(function (item) {                                                                              // 18
			if (item.url.indexOf(Meteor.absoluteUrl()) === 0) {                                                            // 19
				var urlObj = URL.parse(item.url);                                                                             // 20
                                                                                                                  //
				if (urlObj.query) {                                                                                           // 21
					var queryString = QueryString.parse(urlObj.query);                                                           // 22
                                                                                                                  //
					if (_.isString(queryString.msg)) {                                                                           // 23
						// Jump-to query param                                                                                      // 23
						var jumpToMessage = recursiveRemove(RocketChat.models.Messages.findOneById(queryString.msg));               // 24
                                                                                                                  //
						if (jumpToMessage) {                                                                                        // 25
							msg.attachments = msg.attachments || [];                                                                   // 26
							msg.attachments.push({                                                                                     // 27
								'text': jumpToMessage.msg,                                                                                // 28
								'translations': jumpToMessage.translations,                                                               // 29
								'author_name': jumpToMessage.alias || jumpToMessage.u.username,                                           // 30
								'author_icon': getAvatarUrlFromUsername(jumpToMessage.u.username),                                        // 31
								'message_link': item.url,                                                                                 // 32
								'attachments': jumpToMessage.attachments || [],                                                           // 33
								'ts': jumpToMessage.ts                                                                                    // 34
							});                                                                                                        // 27
							item.ignoreParse = true;                                                                                   // 36
						}                                                                                                           // 37
					}                                                                                                            // 38
				}                                                                                                             // 39
			}                                                                                                              // 40
		});                                                                                                             // 41
	}                                                                                                                // 42
                                                                                                                  //
	return msg;                                                                                                      // 43
}, RocketChat.callbacks.priority.LOW, 'jumpToMessage');                                                           // 44
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"models":{"OEmbedCache.js":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_oembed/server/models/OEmbedCache.js                                                        //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                           //
                                                                                                                  //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                  //
                                                                                                                  //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                     //
                                                                                                                  //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                            //
                                                                                                                  //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                       //
                                                                                                                  //
var _inherits3 = _interopRequireDefault(_inherits2);                                                              //
                                                                                                                  //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                 //
                                                                                                                  //
RocketChat.models.OEmbedCache = new (function (_RocketChat$models$_B) {                                           // 2
	(0, _inherits3.default)(_class, _RocketChat$models$_B);                                                          // 2
                                                                                                                  //
	function _class() {                                                                                              // 3
		(0, _classCallCheck3.default)(this, _class);                                                                    // 3
                                                                                                                  //
		var _this = (0, _possibleConstructorReturn3.default)(this, _RocketChat$models$_B.call(this, 'oembed_cache'));   // 3
                                                                                                                  //
		_this.tryEnsureIndex({                                                                                          // 5
			'updatedAt': 1                                                                                                 // 5
		});                                                                                                             // 5
                                                                                                                  //
		return _this;                                                                                                   // 3
	} //FIND ONE                                                                                                     // 6
                                                                                                                  //
                                                                                                                  //
	_class.prototype.findOneById = function () {                                                                     // 2
		function findOneById(_id, options) {                                                                            // 2
			var query = {                                                                                                  // 10
				_id: _id                                                                                                      // 11
			};                                                                                                             // 10
			return this.findOne(query, options);                                                                           // 13
		}                                                                                                               // 14
                                                                                                                  //
		return findOneById;                                                                                             // 2
	}(); //INSERT                                                                                                    // 2
                                                                                                                  //
                                                                                                                  //
	_class.prototype.createWithIdAndData = function () {                                                             // 2
		function createWithIdAndData(_id, data) {                                                                       // 2
			var record = {                                                                                                 // 18
				_id: _id,                                                                                                     // 19
				data: data,                                                                                                   // 20
				updatedAt: new Date()                                                                                         // 21
			};                                                                                                             // 18
			record._id = this.insert(record);                                                                              // 23
			return record;                                                                                                 // 24
		}                                                                                                               // 25
                                                                                                                  //
		return createWithIdAndData;                                                                                     // 2
	}(); //REMOVE                                                                                                    // 2
                                                                                                                  //
                                                                                                                  //
	_class.prototype.removeAfterDate = function () {                                                                 // 2
		function removeAfterDate(date) {                                                                                // 2
			var query = {                                                                                                  // 29
				updatedAt: {                                                                                                  // 30
					$lte: date                                                                                                   // 31
				}                                                                                                             // 30
			};                                                                                                             // 29
			return this.remove(query);                                                                                     // 34
		}                                                                                                               // 35
                                                                                                                  //
		return removeAfterDate;                                                                                         // 2
	}();                                                                                                             // 2
                                                                                                                  //
	return _class;                                                                                                   // 2
}(RocketChat.models._Base))();                                                                                    // 2
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:oembed/server/server.js");
require("./node_modules/meteor/rocketchat:oembed/server/providers.js");
require("./node_modules/meteor/rocketchat:oembed/server/jumpToMessage.js");
require("./node_modules/meteor/rocketchat:oembed/server/models/OEmbedCache.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['rocketchat:oembed'] = {}, {
  OEmbed: OEmbed
});

})();

//# sourceMappingURL=rocketchat_oembed.js.map

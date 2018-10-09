(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var OEmbed = Package['rocketchat:oembed'].OEmbed;
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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:spotify":{"lib":{"spotify.js":function(require){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_spotify/lib/spotify.js                                                                        //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                              //
                                                                                                                     //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                     //
                                                                                                                     //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                    //
                                                                                                                     //
/*                                                                                                                   // 1
 * Spotify a named function that will process Spotify links or syntaxes (ex: spotify:track:1q6IK1l4qpYykOaWaLJkWG)   //
 * @param {Object} message - The message object                                                                      //
 */var process = function (message, source, callback) {                                                              //
	if (_.trim(source)) {                                                                                               // 7
		// Separate text in code blocks and non code blocks                                                                // 8
		var msgParts = source.split(/(```\w*[\n ]?[\s\S]*?```+?)|(`(?:[^`]+)`)/);                                          // 9
                                                                                                                     //
		for (var index = 0; index < msgParts.length; index++) {                                                            // 11
			// Verify if this part is code                                                                                    // 12
			var part = msgParts[index];                                                                                       // 13
                                                                                                                     //
			if ((part != null ? part.length > 0 : undefined) != null) {                                                       // 15
				var codeMatch = part.match(/(?:```(\w*)[\n ]?([\s\S]*?)```+?)|(?:`(?:[^`]+)`)/);                                 // 16
                                                                                                                     //
				if (codeMatch == null) {                                                                                         // 17
					callback(message, msgParts, index, part);                                                                       // 18
				}                                                                                                                // 19
			}                                                                                                                 // 20
		}                                                                                                                  // 21
	}                                                                                                                   // 22
};                                                                                                                   // 23
                                                                                                                     //
var Spotify = function () {                                                                                          //
	function Spotify() {                                                                                                //
		(0, _classCallCheck3.default)(this, Spotify);                                                                      //
	}                                                                                                                   //
                                                                                                                     //
	Spotify.transform = function () {                                                                                   //
		function transform(message) {                                                                                      //
			var urls = [];                                                                                                    // 26
                                                                                                                     //
			if (Array.isArray(message.urls)) {                                                                                // 27
				urls = urls.concat(message.urls);                                                                                // 28
			}                                                                                                                 // 29
                                                                                                                     //
			var changed = false;                                                                                              // 31
			process(message, message.msg, function (message, msgParts, index, part) {                                         // 33
				var re = /(?:^|\s)spotify:([^:\s]+):([^:\s]+)(?::([^:\s]+))?(?::(\S+))?(?:\s|$)/g;                               // 34
				var match = void 0;                                                                                              // 36
                                                                                                                     //
				while (match = re.exec(part)) {                                                                                  // 37
					var data = _.filter(match.slice(1), function (value) {                                                          // 38
						return value != null;                                                                                          // 38
					});                                                                                                             // 38
                                                                                                                     //
					var path = _.map(data, function (value) {                                                                       // 39
						return _.escape(value);                                                                                        // 39
					}).join('/');                                                                                                   // 39
                                                                                                                     //
					var url = "https://open.spotify.com/" + path;                                                                   // 40
					urls.push({                                                                                                     // 41
						url: url,                                                                                                      // 41
						'source': "spotify:" + data.join(':')                                                                          // 41
					});                                                                                                             // 41
					changed = true;                                                                                                 // 42
				}                                                                                                                // 43
			}); // Re-mount message                                                                                           // 45
                                                                                                                     //
			if (changed) {                                                                                                    // 48
				message.urls = urls;                                                                                             // 49
			}                                                                                                                 // 50
                                                                                                                     //
			return message;                                                                                                   // 52
		}                                                                                                                  // 53
                                                                                                                     //
		return transform;                                                                                                  //
	}();                                                                                                                //
                                                                                                                     //
	Spotify.render = function () {                                                                                      //
		function render(message) {                                                                                         //
			process(message, message.html, function (message, msgParts, index, part) {                                        // 56
				if (Array.isArray(message.urls)) {                                                                               // 57
					for (var _iterator = Array.from(message.urls), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
						var _ref;                                                                                                      // 58
                                                                                                                     //
						if (_isArray) {                                                                                                // 58
							if (_i >= _iterator.length) break;                                                                            // 58
							_ref = _iterator[_i++];                                                                                       // 58
						} else {                                                                                                       // 58
							_i = _iterator.next();                                                                                        // 58
							if (_i.done) break;                                                                                           // 58
							_ref = _i.value;                                                                                              // 58
						}                                                                                                              // 58
                                                                                                                     //
						var item = _ref;                                                                                               // 58
                                                                                                                     //
						if (item.source) {                                                                                             // 59
							var quotedSource = item.source.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');                                        // 60
							var re = new RegExp("(^|\\s)" + quotedSource + "(\\s|$)", 'g');                                               // 61
							msgParts[index] = part.replace(re, "$1<a href=\"" + item.url + "\" target=\"_blank\">" + item.source + "</a>$2");
						}                                                                                                              // 63
					}                                                                                                               // 64
                                                                                                                     //
					return message.html = msgParts.join('');                                                                        // 65
				}                                                                                                                // 66
			});                                                                                                               // 67
			return message;                                                                                                   // 69
		}                                                                                                                  // 70
                                                                                                                     //
		return render;                                                                                                     //
	}();                                                                                                                //
                                                                                                                     //
	return Spotify;                                                                                                     //
}();                                                                                                                 //
                                                                                                                     //
RocketChat.callbacks.add('beforeSaveMessage', Spotify.transform, RocketChat.callbacks.priority.LOW, 'spotify-save');
RocketChat.callbacks.add('renderMessage', Spotify.render, RocketChat.callbacks.priority.MEDIUM, 'spotify-render');   // 74
RocketChat.Spotify = Spotify;                                                                                        // 75
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:spotify/lib/spotify.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:spotify'] = {};

})();

//# sourceMappingURL=rocketchat_spotify.js.map

(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RocketChatTabBar = Package['rocketchat:lib'].RocketChatTabBar;
var renderMessageBody = Package['rocketchat:ui-message'].renderMessageBody;
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
var renderEmoji;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:emoji":{"client":{"rocketchat.js":function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/rocketchat_emoji/client/rocketchat.js                    //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
RocketChat.emoji = {                                                 // 1
	packages: {                                                         // 2
		base: {                                                            // 3
			emojiCategories: {                                                // 4
				recent: 'Frequently_Used'                                        // 4
			},                                                                // 4
			emojisByCategory: {                                               // 5
				recent: []                                                       // 6
			},                                                                // 5
			toneList: {},                                                     // 8
			render: function (html) {                                         // 9
				return html;                                                     // 10
			}                                                                 // 11
		}                                                                  // 3
	},                                                                  // 2
	list: {}                                                            // 14
};                                                                   // 1
///////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:emoji/client/rocketchat.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['rocketchat:emoji'] = {}, {
  renderEmoji: renderEmoji
});

})();

//# sourceMappingURL=rocketchat_emoji.js.map

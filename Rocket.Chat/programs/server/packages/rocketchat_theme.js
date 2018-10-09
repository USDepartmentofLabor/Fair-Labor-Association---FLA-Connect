(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RocketChatTabBar = Package['rocketchat:lib'].RocketChatTabBar;
var Logger = Package['rocketchat:logger'].Logger;
var SystemLogger = Package['rocketchat:logger'].SystemLogger;
var LoggerManager = Package['rocketchat:logger'].LoggerManager;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;
var WebAppHashing = Package['webapp-hashing'].WebAppHashing;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var meteorInstall = Package.modules.meteorInstall;
var process = Package.modules.process;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:theme":{"server":{"server.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/rocketchat_theme/server/server.js                                                                  //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");                                  //
                                                                                                               //
var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);                                         //
                                                                                                               //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                        //
                                                                                                               //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                               //
                                                                                                               //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }              //
                                                                                                               //
var less = void 0;                                                                                             // 1
module.watch(require("less"), {                                                                                // 1
	"default": function (v) {                                                                                     // 1
		less = v;                                                                                                    // 1
	}                                                                                                             // 1
}, 0);                                                                                                         // 1
var Autoprefixer = void 0;                                                                                     // 1
module.watch(require("less-plugin-autoprefix"), {                                                              // 1
	"default": function (v) {                                                                                     // 1
		Autoprefixer = v;                                                                                            // 1
	}                                                                                                             // 1
}, 1);                                                                                                         // 1
var crypto = void 0;                                                                                           // 1
module.watch(require("crypto"), {                                                                              // 1
	"default": function (v) {                                                                                     // 1
		crypto = v;                                                                                                  // 1
	}                                                                                                             // 1
}, 2);                                                                                                         // 1
var logger = new Logger('rocketchat:theme', {                                                                  // 7
	methods: {                                                                                                    // 8
		stop_rendering: {                                                                                            // 9
			type: 'info'                                                                                                // 10
		}                                                                                                            // 9
	}                                                                                                             // 8
});                                                                                                            // 7
WebApp.rawConnectHandlers.use(function (req, res, next) {                                                      // 15
	var path = req.url.split('?')[0];                                                                             // 16
	var prefix = __meteor_runtime_config__.ROOT_URL_PATH_PREFIX || '';                                            // 17
                                                                                                               //
	if (path === prefix + "/__cordova/theme.css" || path === prefix + "/theme.css") {                             // 18
		var css = RocketChat.theme.getCss();                                                                         // 19
		var hash = crypto.createHash('sha1').update(css).digest('hex');                                              // 20
		res.setHeader('Content-Type', 'text/css; charset=UTF-8');                                                    // 21
		res.setHeader('ETag', "\"" + hash + "\"");                                                                   // 22
		res.write(css);                                                                                              // 23
		return res.end();                                                                                            // 24
	} else {                                                                                                      // 25
		return next();                                                                                               // 26
	}                                                                                                             // 27
});                                                                                                            // 28
var calculateClientHash = WebAppHashing.calculateClientHash;                                                   // 30
                                                                                                               //
WebAppHashing.calculateClientHash = function (manifest, includeFilter, runtimeConfigOverride) {                // 32
	var css = RocketChat.theme.getCss();                                                                          // 33
                                                                                                               //
	if (css.trim() !== '') {                                                                                      // 34
		var hash = crypto.createHash('sha1').update(css).digest('hex');                                              // 35
                                                                                                               //
		var themeManifestItem = _.find(manifest, function (item) {                                                   // 36
			return item.path === 'app/theme.css';                                                                       // 37
		});                                                                                                          // 38
                                                                                                               //
		if (themeManifestItem == null) {                                                                             // 39
			themeManifestItem = {};                                                                                     // 40
			manifest.push(themeManifestItem);                                                                           // 41
		}                                                                                                            // 42
                                                                                                               //
		themeManifestItem.path = 'app/theme.css';                                                                    // 43
		themeManifestItem.type = 'css';                                                                              // 44
		themeManifestItem.cacheable = true;                                                                          // 45
		themeManifestItem.where = 'client';                                                                          // 46
		themeManifestItem.url = "/theme.css?" + hash;                                                                // 47
		themeManifestItem.size = css.length;                                                                         // 48
		themeManifestItem.hash = hash;                                                                               // 49
	}                                                                                                             // 50
                                                                                                               //
	return calculateClientHash.call(this, manifest, includeFilter, runtimeConfigOverride);                        // 51
};                                                                                                             // 52
                                                                                                               //
RocketChat.theme = new (function () {                                                                          // 54
	function _class() {                                                                                           // 55
		var _this = this;                                                                                            // 55
                                                                                                               //
		(0, _classCallCheck3.default)(this, _class);                                                                 // 55
		this.variables = {};                                                                                         // 56
		this.packageCallbacks = [];                                                                                  // 57
		this.files = ['server/colors.less'];                                                                         // 58
		this.customCSS = '';                                                                                         // 59
		RocketChat.settings.add('css', '');                                                                          // 60
		RocketChat.settings.addGroup('Layout');                                                                      // 61
		RocketChat.settings.onload('css', Meteor.bindEnvironment(function (key, value, initialLoad) {                // 62
			if (!initialLoad) {                                                                                         // 63
				Meteor.startup(function () {                                                                               // 64
					process.emit('message', {                                                                                 // 65
						refresh: 'client'                                                                                        // 66
					});                                                                                                       // 65
				});                                                                                                        // 68
			}                                                                                                           // 69
		}));                                                                                                         // 70
		this.compileDelayed = _.debounce(Meteor.bindEnvironment(this.compile.bind(this)), 100);                      // 71
		Meteor.startup(function () {                                                                                 // 72
			RocketChat.settings.onAfterInitialLoad(function () {                                                        // 73
				RocketChat.settings.get(/^theme-./, Meteor.bindEnvironment(function (key, value) {                         // 74
					if (key === 'theme-custom-css' && value != null) {                                                        // 75
						_this.customCSS = value;                                                                                 // 76
					} else {                                                                                                  // 77
						var name = key.replace(/^theme-[a-z]+-/, '');                                                            // 78
                                                                                                               //
						if (_this.variables[name] != null) {                                                                     // 79
							_this.variables[name].value = value;                                                                    // 80
						}                                                                                                        // 81
					}                                                                                                         // 82
                                                                                                               //
					_this.compileDelayed();                                                                                   // 84
				}));                                                                                                       // 85
			});                                                                                                         // 86
		});                                                                                                          // 87
	}                                                                                                             // 88
                                                                                                               //
	_class.prototype.compile = function () {                                                                      // 54
		function compile() {                                                                                         // 54
			var _content, _content2;                                                                                    // 90
                                                                                                               //
			var content = [this.getVariablesAsLess()];                                                                  // 91
                                                                                                               //
			(_content = content).push.apply(_content, (0, _toConsumableArray3.default)(this.files.map(function (name) {
				return Assets.getText(name);                                                                               // 93
			})));                                                                                                       // 93
                                                                                                               //
			(_content2 = content).push.apply(_content2, (0, _toConsumableArray3.default)(this.packageCallbacks.map(function (name) {
				return name();                                                                                             // 95
			})));                                                                                                       // 95
                                                                                                               //
			content.push(this.customCSS);                                                                               // 97
			content = content.join('\n');                                                                               // 98
			var options = {                                                                                             // 99
				compress: true,                                                                                            // 100
				plugins: [new Autoprefixer()]                                                                              // 101
			};                                                                                                          // 99
			var start = Date.now();                                                                                     // 103
			return less.render(content, options, function (err, data) {                                                 // 104
				logger.stop_rendering(Date.now() - start);                                                                 // 105
                                                                                                               //
				if (err != null) {                                                                                         // 106
					return console.log(err);                                                                                  // 107
				}                                                                                                          // 108
                                                                                                               //
				RocketChat.settings.updateById('css', data.css);                                                           // 109
				return Meteor.startup(function () {                                                                        // 110
					return Meteor.setTimeout(function () {                                                                    // 111
						return process.emit('message', {                                                                         // 112
							refresh: 'client'                                                                                       // 113
						});                                                                                                      // 112
					}, 200);                                                                                                  // 115
				});                                                                                                        // 116
			});                                                                                                         // 117
		}                                                                                                            // 118
                                                                                                               //
		return compile;                                                                                              // 54
	}();                                                                                                          // 54
                                                                                                               //
	_class.prototype.addColor = function () {                                                                     // 54
		function addColor(name, value, section, properties) {                                                        // 54
			var config = {                                                                                              // 121
				group: 'Colors',                                                                                           // 122
				type: 'color',                                                                                             // 123
				editor: 'color',                                                                                           // 124
				"public": true,                                                                                            // 125
				properties: properties,                                                                                    // 126
				section: section                                                                                           // 127
			};                                                                                                          // 121
			return RocketChat.settings.add("theme-color-" + name, value, config);                                       // 130
		}                                                                                                            // 131
                                                                                                               //
		return addColor;                                                                                             // 54
	}();                                                                                                          // 54
                                                                                                               //
	_class.prototype.addVariable = function () {                                                                  // 54
		function addVariable(type, name, value, section) {                                                           // 54
			var persist = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;                     // 133
			var editor = arguments[5];                                                                                  // 133
			var allowedTypes = arguments[6];                                                                            // 133
			var property = arguments[7];                                                                                // 133
			this.variables[name] = {                                                                                    // 134
				type: type,                                                                                                // 135
				value: value                                                                                               // 136
			};                                                                                                          // 134
                                                                                                               //
			if (persist) {                                                                                              // 138
				var config = {                                                                                             // 139
					group: 'Layout',                                                                                          // 140
					type: type,                                                                                               // 141
					editor: editor || type,                                                                                   // 142
					section: section,                                                                                         // 143
					'public': true,                                                                                           // 144
					allowedTypes: allowedTypes,                                                                               // 145
					property: property                                                                                        // 146
				};                                                                                                         // 139
				return RocketChat.settings.add("theme-" + type + "-" + name, value, config);                               // 148
			}                                                                                                           // 149
		}                                                                                                            // 151
                                                                                                               //
		return addVariable;                                                                                          // 54
	}();                                                                                                          // 54
                                                                                                               //
	_class.prototype.addPublicColor = function () {                                                               // 54
		function addPublicColor(name, value, section) {                                                              // 54
			var editor = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'color';                   // 153
			var property = arguments[4];                                                                                // 153
			return this.addVariable('color', name, value, section, true, editor, ['color', 'expression'], property);    // 154
		}                                                                                                            // 155
                                                                                                               //
		return addPublicColor;                                                                                       // 54
	}();                                                                                                          // 54
                                                                                                               //
	_class.prototype.addPublicFont = function () {                                                                // 54
		function addPublicFont(name, value) {                                                                        // 54
			return this.addVariable('font', name, value, 'Fonts', true);                                                // 158
		}                                                                                                            // 159
                                                                                                               //
		return addPublicFont;                                                                                        // 54
	}();                                                                                                          // 54
                                                                                                               //
	_class.prototype.getVariablesAsObject = function () {                                                         // 54
		function getVariablesAsObject() {                                                                            // 54
			var _this2 = this;                                                                                          // 161
                                                                                                               //
			return Object.keys(this.variables).reduce(function (obj, name) {                                            // 162
				obj[name] = _this2.variables[name].value;                                                                  // 163
				return obj;                                                                                                // 164
			}, {});                                                                                                     // 165
		}                                                                                                            // 166
                                                                                                               //
		return getVariablesAsObject;                                                                                 // 54
	}();                                                                                                          // 54
                                                                                                               //
	_class.prototype.getVariablesAsLess = function () {                                                           // 54
		function getVariablesAsLess() {                                                                              // 54
			var _this3 = this;                                                                                          // 168
                                                                                                               //
			return Object.keys(this.variables).map(function (name) {                                                    // 169
				var variable = _this3.variables[name];                                                                     // 170
				return "@" + name + ": " + variable.value + ";";                                                           // 171
			}).join('\n');                                                                                              // 172
		}                                                                                                            // 173
                                                                                                               //
		return getVariablesAsLess;                                                                                   // 54
	}();                                                                                                          // 54
                                                                                                               //
	_class.prototype.addPackageAsset = function () {                                                              // 54
		function addPackageAsset(cb) {                                                                               // 54
			this.packageCallbacks.push(cb);                                                                             // 176
			return this.compileDelayed();                                                                               // 177
		}                                                                                                            // 178
                                                                                                               //
		return addPackageAsset;                                                                                      // 54
	}();                                                                                                          // 54
                                                                                                               //
	_class.prototype.getCss = function () {                                                                       // 54
		function getCss() {                                                                                          // 54
			return RocketChat.settings.get('css') || '';                                                                // 181
		}                                                                                                            // 182
                                                                                                               //
		return getCss;                                                                                               // 54
	}();                                                                                                          // 54
                                                                                                               //
	return _class;                                                                                                // 54
}())();                                                                                                        // 54
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"variables.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/rocketchat_theme/server/variables.js                                                               //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
// TODO: Define registers/getters/setters for packages to work with established                                // 2
// 			heirarchy of colors instead of making duplicate definitions                                              // 3
// TODO: Settings pages to show simple separation of major/minor/addon colors                                  // 4
// TODO: Get major colours as swatches for minor colors in minicolors plugin                                   // 5
// TODO: Minicolors settings to use rgb for alphas, hex otherwise                                              // 6
// TODO: Add setting toggle to use defaults for minor colours and hide settings                                // 7
// New colors, used for shades on solid backgrounds                                                            // 9
// Defined range of transparencies reduces random colour variances                                             // 10
// Major colors form the core of the scheme                                                                    // 11
// Names changed to reflect usage, comments show pre-refactor names                                            // 12
var majorColors = {                                                                                            // 13
	'content-background-color': '#FFFFFF',                                                                        // 14
	'primary-background-color': '#04436A',                                                                        // 15
	'primary-font-color': '#444444',                                                                              // 16
	'primary-action-color': '#13679A',                                                                            // 17
	// was action-buttons-color                                                                                   // 17
	'secondary-background-color': '#F4F4F4',                                                                      // 18
	'secondary-font-color': '#A0A0A0',                                                                            // 19
	'secondary-action-color': '#DDDDDD',                                                                          // 20
	'component-color': '#EAEAEA',                                                                                 // 21
	'success-color': '#4dff4d',                                                                                   // 22
	'pending-color': '#FCB316',                                                                                   // 23
	'error-color': '#BC2031',                                                                                     // 24
	'selection-color': '#02ACEC',                                                                                 // 25
	'attention-color': '#9C27B0'                                                                                  // 26
}; // Minor colours implement major colours by default, but can be overruled                                   // 13
                                                                                                               //
var minorColors = {                                                                                            // 30
	'tertiary-background-color': '@component-color',                                                              // 31
	'tertiary-font-color': '@transparent-lightest',                                                               // 32
	'link-font-color': '@primary-action-color',                                                                   // 33
	'info-font-color': '@secondary-font-color',                                                                   // 34
	'custom-scrollbar-color': '@transparent-darker',                                                              // 35
	'status-online': '@success-color',                                                                            // 36
	'status-away': '@pending-color',                                                                              // 37
	'status-busy': '@error-color',                                                                                // 38
	'status-offline': '@transparent-darker'                                                                       // 39
}; // Bulk-add settings for color scheme                                                                       // 30
                                                                                                               //
Object.keys(majorColors).forEach(function (key) {                                                              // 43
	var value = majorColors[key];                                                                                 // 44
	RocketChat.theme.addPublicColor(key, value, 'Colors');                                                        // 45
});                                                                                                            // 46
Object.keys(minorColors).forEach(function (key) {                                                              // 48
	var value = minorColors[key];                                                                                 // 49
	RocketChat.theme.addPublicColor(key, value, 'Colors (minor)', 'expression');                                  // 50
});                                                                                                            // 51
RocketChat.theme.addPublicFont('body-font-family', '-apple-system, BlinkMacSystemFont, Roboto, \'Helvetica Neue\', Arial, sans-serif, \'Apple Color Emoji\', \'Segoe UI\', \'Segoe UI Emoji\', \'Segoe UI Symbol\', \'Meiryo UI\'');
RocketChat.settings.add('theme-custom-css', '', {                                                              // 55
	group: 'Layout',                                                                                              // 56
	type: 'code',                                                                                                 // 57
	code: 'text/css',                                                                                             // 58
	multiline: true,                                                                                              // 59
	section: 'Custom CSS',                                                                                        // 60
	"public": true                                                                                                // 61
});                                                                                                            // 55
RocketChat.settings.add('theme-custom-variables', Assets.getText('client/imports/general/variables.css'), {    // 65
	group: 'Layout',                                                                                              // 66
	type: 'code',                                                                                                 // 67
	code: 'text/css',                                                                                             // 68
	multiline: true,                                                                                              // 69
	section: 'Customize Theme',                                                                                   // 70
	"public": true                                                                                                // 71
});                                                                                                            // 65
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"node_modules":{"less":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// .npm/package/node_modules/less/package.json                                                                 //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
exports.name = "less";
exports.version = "2.5.0";
exports.main = "index";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// node_modules/meteor/rocketchat_theme/node_modules/less/index.js                                             //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
module.exports = require('./lib/less-node');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"less-plugin-autoprefix":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// .npm/package/node_modules/less-plugin-autoprefix/package.json                                               //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
exports.name = "less-plugin-autoprefix";
exports.version = "1.4.2";
exports.main = "lib/index.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// node_modules/meteor/rocketchat_theme/node_modules/less-plugin-autoprefix/lib/index.js                       //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
var getAutoprefixProcessor = require("./autoprefix-processor"),
    usage = require("./usage"),
    parseOptions = require("./parse-options");

function LessPluginAutoPrefixer(options) {
    this.options = options;
};

LessPluginAutoPrefixer.prototype = {
    install: function(less, pluginManager) {
        var AutoprefixProcessor = getAutoprefixProcessor(less);
        pluginManager.addPostProcessor(new AutoprefixProcessor(this.options));
    },
    printUsage: function () {
        usage.printUsage();
    },
    setOptions: function(options) {
        this.options = parseOptions(options);
    },
    minVersion: [2, 0, 0]
};

module.exports = LessPluginAutoPrefixer;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:theme/server/server.js");
require("./node_modules/meteor/rocketchat:theme/server/variables.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:theme'] = {};

})();

//# sourceMappingURL=rocketchat_theme.js.map

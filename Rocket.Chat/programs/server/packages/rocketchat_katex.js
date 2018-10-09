(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var s = Package['underscorestring:underscore.string'].s;
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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:katex":{"settings.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_katex/settings.js                                                                             //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Meteor.startup(function () {                                                                                         // 1
	var enableQuery = {                                                                                                 // 2
		_id: 'Katex_Enabled',                                                                                              // 3
		value: true                                                                                                        // 4
	};                                                                                                                  // 2
	RocketChat.settings.add('Katex_Enabled', true, {                                                                    // 6
		type: 'boolean',                                                                                                   // 7
		group: 'Message',                                                                                                  // 8
		section: 'Katex',                                                                                                  // 9
		'public': true,                                                                                                    // 10
		i18n: 'Katex_Enabled_Description'                                                                                  // 11
	});                                                                                                                 // 6
	RocketChat.settings.add('Katex_Parenthesis_Syntax', true, {                                                         // 13
		type: 'boolean',                                                                                                   // 14
		group: 'Message',                                                                                                  // 15
		section: 'Katex',                                                                                                  // 16
		'public': true,                                                                                                    // 17
		enableQuery: enableQuery,                                                                                          // 18
		i18nDescription: 'Katex_Parenthesis_Syntax_Description'                                                            // 19
	});                                                                                                                 // 13
	return RocketChat.settings.add('Katex_Dollar_Syntax', false, {                                                      // 21
		type: 'boolean',                                                                                                   // 22
		group: 'Message',                                                                                                  // 23
		section: 'Katex',                                                                                                  // 24
		'public': true,                                                                                                    // 25
		enableQuery: enableQuery,                                                                                          // 26
		i18nDescription: 'Katex_Dollar_Syntax_Description'                                                                 // 27
	});                                                                                                                 // 21
}); // ---                                                                                                           // 29
// generated by coffee-script 1.9.2                                                                                  // 32
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"katex.js":function(require){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_katex/katex.js                                                                                //
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
 * KaTeX is a fast, easy-to-use JavaScript library for TeX math rendering on the web.                                //
 * https://github.com/Khan/KaTeX                                                                                     //
 */var katex = require('katex');                                                                                     //
                                                                                                                     //
var Boundary = function () {                                                                                         //
	function Boundary() {                                                                                               // 8
		(0, _classCallCheck3.default)(this, Boundary);                                                                     // 8
	}                                                                                                                   // 8
                                                                                                                     //
	Boundary.prototype.length = function () {                                                                           //
		function length() {                                                                                                //
			return this.end - this.start;                                                                                     // 11
		}                                                                                                                  // 12
                                                                                                                     //
		return length;                                                                                                     //
	}();                                                                                                                //
                                                                                                                     //
	Boundary.prototype.extract = function () {                                                                          //
		function extract(str) {                                                                                            //
			return str.substr(this.start, this.length());                                                                     // 15
		}                                                                                                                  // 16
                                                                                                                     //
		return extract;                                                                                                    //
	}();                                                                                                                //
                                                                                                                     //
	return Boundary;                                                                                                    //
}();                                                                                                                 //
                                                                                                                     //
var Katex = function () {                                                                                            //
	function Katex() {                                                                                                  // 21
		var _this = this;                                                                                                  // 21
                                                                                                                     //
		(0, _classCallCheck3.default)(this, Katex);                                                                        // 21
		this.delimiters_map = [{                                                                                           // 22
			opener: '\\[',                                                                                                    // 24
			closer: '\\]',                                                                                                    // 25
			displayMode: true,                                                                                                // 26
			enabled: function () {                                                                                            // 27
				return _this.parenthesis_syntax_enabled();                                                                       // 28
			}                                                                                                                 // 29
		}, {                                                                                                               // 23
			opener: '\\(',                                                                                                    // 31
			closer: '\\)',                                                                                                    // 32
			displayMode: false,                                                                                               // 33
			enabled: function () {                                                                                            // 34
				return _this.parenthesis_syntax_enabled();                                                                       // 35
			}                                                                                                                 // 36
		}, {                                                                                                               // 30
			opener: '$$',                                                                                                     // 38
			closer: '$$',                                                                                                     // 39
			displayMode: true,                                                                                                // 40
			enabled: function () {                                                                                            // 41
				return _this.dollar_syntax_enabled();                                                                            // 42
			}                                                                                                                 // 43
		}, {                                                                                                               // 37
			opener: '$',                                                                                                      // 45
			closer: '$',                                                                                                      // 46
			displayMode: false,                                                                                               // 47
			enabled: function () {                                                                                            // 48
				return _this.dollar_syntax_enabled();                                                                            // 49
			}                                                                                                                 // 50
		}];                                                                                                                // 44
	} // Searches for the first opening delimiter in the string from a given position                                   // 53
                                                                                                                     //
                                                                                                                     //
	Katex.prototype.find_opening_delimiter = function () {                                                              //
		function find_opening_delimiter(str, start) {                                                                      //
			var _this2 = this;                                                                                                // 56
                                                                                                                     //
			// Search the string for each opening delimiter                                                                   // 56
			var matches = function () {                                                                                       // 57
				var map = _this2.delimiters_map;                                                                                 // 58
				var results = [];                                                                                                // 59
				map.forEach(function (op) {                                                                                      // 61
					if (op.enabled()) {                                                                                             // 62
						results.push({                                                                                                 // 63
							options: op,                                                                                                  // 64
							pos: str.indexOf(op.opener, start)                                                                            // 65
						});                                                                                                            // 63
					}                                                                                                               // 67
				});                                                                                                              // 68
				return results;                                                                                                  // 69
			}();                                                                                                              // 70
                                                                                                                     //
			var positions = function () {                                                                                     // 72
				var results = [];                                                                                                // 73
				matches.forEach(function (pos) {                                                                                 // 74
					if (pos.pos >= 0) {                                                                                             // 75
						results.push(pos.pos);                                                                                         // 76
					}                                                                                                               // 77
				});                                                                                                              // 78
				return results;                                                                                                  // 79
			}(); // No opening delimiters were found                                                                          // 80
                                                                                                                     //
                                                                                                                     //
			if (positions.length === 0) {                                                                                     // 83
				return null;                                                                                                     // 84
			} //Take the first delimiter found                                                                                // 85
                                                                                                                     //
                                                                                                                     //
			var pos = Math.min.apply(Math, positions);                                                                        // 88
                                                                                                                     //
			var match_index = function () {                                                                                   // 90
				var results = [];                                                                                                // 91
				matches.forEach(function (m) {                                                                                   // 92
					results.push(m.pos);                                                                                            // 93
				});                                                                                                              // 94
				return results;                                                                                                  // 95
			}().indexOf(pos);                                                                                                 // 96
                                                                                                                     //
			var match = matches[match_index];                                                                                 // 98
			return match;                                                                                                     // 99
		}                                                                                                                  // 100
                                                                                                                     //
		return find_opening_delimiter;                                                                                     //
	}(); // Returns the outer and inner boundaries of the latex block starting                                          //
	// at the given opening delimiter                                                                                   // 103
                                                                                                                     //
                                                                                                                     //
	Katex.prototype.get_latex_boundaries = function () {                                                                //
		function get_latex_boundaries(str, opening_delimiter_match) {                                                      //
			var inner = new Boundary();                                                                                       // 105
			var outer = new Boundary(); // The closing delimiter matching to the opening one                                  // 106
                                                                                                                     //
			var closer = opening_delimiter_match.options.closer;                                                              // 109
			outer.start = opening_delimiter_match.pos;                                                                        // 110
			inner.start = opening_delimiter_match.pos + closer.length; // Search for a closer delimiter after the opening one
                                                                                                                     //
			var closer_index = str.substr(inner.start).indexOf(closer);                                                       // 114
                                                                                                                     //
			if (closer_index < 0) {                                                                                           // 115
				return null;                                                                                                     // 116
			}                                                                                                                 // 117
                                                                                                                     //
			inner.end = inner.start + closer_index;                                                                           // 118
			outer.end = inner.end + closer.length;                                                                            // 119
			return {                                                                                                          // 120
				outer: outer,                                                                                                    // 121
				inner: inner                                                                                                     // 122
			};                                                                                                                // 120
		}                                                                                                                  // 124
                                                                                                                     //
		return get_latex_boundaries;                                                                                       //
	}(); // Searches for the first latex block in the given string                                                      //
                                                                                                                     //
                                                                                                                     //
	Katex.prototype.find_latex = function () {                                                                          //
		function find_latex(str) {                                                                                         //
			var start = 0;                                                                                                    // 128
			var opening_delimiter_match = void 0;                                                                             // 129
                                                                                                                     //
			while ((opening_delimiter_match = this.find_opening_delimiter(str, start++)) != null) {                           // 131
				var match = this.get_latex_boundaries(str, opening_delimiter_match);                                             // 132
                                                                                                                     //
				if (match && match.inner.extract(str).trim().length) {                                                           // 133
					match.options = opening_delimiter_match.options;                                                                // 134
					return match;                                                                                                   // 135
				}                                                                                                                // 136
			}                                                                                                                 // 137
                                                                                                                     //
			return null;                                                                                                      // 138
		}                                                                                                                  // 139
                                                                                                                     //
		return find_latex;                                                                                                 //
	}(); // Breaks a message to what comes before, after and to the content of a                                        //
	// matched latex block                                                                                              // 142
                                                                                                                     //
                                                                                                                     //
	Katex.prototype.extract_latex = function () {                                                                       //
		function extract_latex(str, match) {                                                                               //
			var before = str.substr(0, match.outer.start);                                                                    // 144
			var after = str.substr(match.outer.end);                                                                          // 145
			var latex = match.inner.extract(str);                                                                             // 146
			latex = s.unescapeHTML(latex);                                                                                    // 147
			return {                                                                                                          // 148
				before: before,                                                                                                  // 149
				latex: latex,                                                                                                    // 150
				after: after                                                                                                     // 151
			};                                                                                                                // 148
		}                                                                                                                  // 153
                                                                                                                     //
		return extract_latex;                                                                                              //
	}(); // Takes a latex math string and the desired display mode and renders it                                       //
	// to HTML using the KaTeX library                                                                                  // 156
                                                                                                                     //
                                                                                                                     //
	Katex.prototype.render_latex = function () {                                                                        //
		function render_latex(latex, displayMode) {                                                                        //
			var rendered = void 0;                                                                                            // 158
                                                                                                                     //
			try {                                                                                                             // 159
				rendered = katex.renderToString(latex, {                                                                         // 160
					displayMode: displayMode                                                                                        // 161
				});                                                                                                              // 160
			} catch (error) {                                                                                                 // 163
				var e = error;                                                                                                   // 164
				var display_mode = displayMode ? 'block' : 'inline';                                                             // 165
				rendered = "<div class=\"katex-error katex-" + display_mode + "-error\">";                                       // 166
				rendered += "" + s.escapeHTML(e.message);                                                                        // 167
				rendered += '</div>';                                                                                            // 168
			}                                                                                                                 // 169
                                                                                                                     //
			return rendered;                                                                                                  // 170
		}                                                                                                                  // 171
                                                                                                                     //
		return render_latex;                                                                                               //
	}(); // Takes a string and renders all latex blocks inside it                                                       //
                                                                                                                     //
                                                                                                                     //
	Katex.prototype.render = function () {                                                                              //
		function render(str, render_func) {                                                                                //
			var result = '';                                                                                                  // 175
                                                                                                                     //
			while (this.find_latex(str) != null) {                                                                            // 176
				// Find the first latex block in the string                                                                      // 177
				var match = this.find_latex(str);                                                                                // 178
				var parts = this.extract_latex(str, match); // Add to the reuslt what comes before the latex block as well as    // 179
				// the rendered latex content                                                                                    // 182
                                                                                                                     //
				var rendered = render_func(parts.latex, match.options.displayMode);                                              // 183
				result += parts.before + rendered; // Set what comes after the latex block to be examined next                   // 184
                                                                                                                     //
				str = parts.after;                                                                                               // 186
			}                                                                                                                 // 187
                                                                                                                     //
			return result += str;                                                                                             // 188
		}                                                                                                                  // 189
                                                                                                                     //
		return render;                                                                                                     //
	}(); // Takes a rocketchat message and renders latex in its content                                                 //
                                                                                                                     //
                                                                                                                     //
	Katex.prototype.render_message = function () {                                                                      //
		function render_message(message) {                                                                                 //
			var _this3 = this;                                                                                                // 192
                                                                                                                     //
			//Render only if enabled in admin panel                                                                           // 193
			var render_func = void 0;                                                                                         // 194
                                                                                                                     //
			if (this.katex_enabled()) {                                                                                       // 195
				var msg = message;                                                                                               // 196
                                                                                                                     //
				if (!_.isString(message)) {                                                                                      // 197
					if (_.trim(message.html)) {                                                                                     // 198
						msg = message.html;                                                                                            // 199
					} else {                                                                                                        // 200
						return message;                                                                                                // 201
					}                                                                                                               // 202
				}                                                                                                                // 203
                                                                                                                     //
				if (_.isString(message)) {                                                                                       // 204
					render_func = function (latex, displayMode) {                                                                   // 205
						return _this3.render_latex(latex, displayMode);                                                                // 206
					};                                                                                                              // 207
				} else {                                                                                                         // 208
					if (message.tokens == null) {                                                                                   // 209
						message.tokens = [];                                                                                           // 210
					}                                                                                                               // 211
                                                                                                                     //
					render_func = function (latex, displayMode) {                                                                   // 212
						var token = "=!=" + Random.id() + "=!=";                                                                       // 213
						message.tokens.push({                                                                                          // 214
							token: token,                                                                                                 // 215
							text: _this3.render_latex(latex, displayMode)                                                                 // 216
						});                                                                                                            // 214
						return token;                                                                                                  // 218
					};                                                                                                              // 219
				}                                                                                                                // 220
                                                                                                                     //
				msg = this.render(msg, render_func);                                                                             // 221
                                                                                                                     //
				if (!_.isString(message)) {                                                                                      // 222
					message.html = msg;                                                                                             // 223
				} else {                                                                                                         // 224
					message = msg;                                                                                                  // 225
				}                                                                                                                // 226
			}                                                                                                                 // 227
                                                                                                                     //
			return message;                                                                                                   // 228
		}                                                                                                                  // 229
                                                                                                                     //
		return render_message;                                                                                             //
	}();                                                                                                                //
                                                                                                                     //
	Katex.prototype.katex_enabled = function () {                                                                       //
		function katex_enabled() {                                                                                         //
			return RocketChat.settings.get('Katex_Enabled');                                                                  // 232
		}                                                                                                                  // 233
                                                                                                                     //
		return katex_enabled;                                                                                              //
	}();                                                                                                                //
                                                                                                                     //
	Katex.prototype.dollar_syntax_enabled = function () {                                                               //
		function dollar_syntax_enabled() {                                                                                 //
			return RocketChat.settings.get('Katex_Dollar_Syntax');                                                            // 236
		}                                                                                                                  // 237
                                                                                                                     //
		return dollar_syntax_enabled;                                                                                      //
	}();                                                                                                                //
                                                                                                                     //
	Katex.prototype.parenthesis_syntax_enabled = function () {                                                          //
		function parenthesis_syntax_enabled() {                                                                            //
			return RocketChat.settings.get('Katex_Parenthesis_Syntax');                                                       // 240
		}                                                                                                                  // 241
                                                                                                                     //
		return parenthesis_syntax_enabled;                                                                                 //
	}();                                                                                                                //
                                                                                                                     //
	return Katex;                                                                                                       //
}();                                                                                                                 //
                                                                                                                     //
RocketChat.katex = new Katex();                                                                                      // 245
var cb = RocketChat.katex.render_message.bind(RocketChat.katex);                                                     // 247
RocketChat.callbacks.add('renderMessage', cb, RocketChat.callbacks.priority.HIGH - 1, 'katex');                      // 249
                                                                                                                     //
if (Meteor.isClient) {                                                                                               // 251
	Blaze.registerHelper('RocketChatKatex', function (text) {                                                           // 252
		return RocketChat.katex.render_message(text);                                                                      // 253
	});                                                                                                                 // 254
}                                                                                                                    // 255
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"node_modules":{"katex":{"package.json":function(require,exports){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// node_modules/katex/package.json                                                                                   //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
exports.name = "katex";
exports.version = "0.7.1";
exports.main = "katex.js";

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"katex.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// node_modules/meteor/rocketchat_katex/node_modules/katex/katex.js                                                  //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/* eslint no-console:0 */
/**
 * This is the main entry point for KaTeX. Here, we expose functions for
 * rendering expressions either to DOM nodes or to markup strings.
 *
 * We also expose the ParseError class to check if errors thrown from KaTeX are
 * errors in the expression, or errors in javascript handling.
 */

var ParseError = require("./src/ParseError");
var Settings = require("./src/Settings");

var buildTree = require("./src/buildTree");
var parseTree = require("./src/parseTree");
var utils = require("./src/utils");

/**
 * Parse and build an expression, and place that expression in the DOM node
 * given.
 */
var render = function(expression, baseNode, options) {
    utils.clearNode(baseNode);

    var settings = new Settings(options);

    var tree = parseTree(expression, settings);
    var node = buildTree(tree, expression, settings).toNode();

    baseNode.appendChild(node);
};

// KaTeX's styles don't work properly in quirks mode. Print out an error, and
// disable rendering.
if (typeof document !== "undefined") {
    if (document.compatMode !== "CSS1Compat") {
        typeof console !== "undefined" && console.warn(
            "Warning: KaTeX doesn't work in quirks mode. Make sure your " +
                "website has a suitable doctype.");

        render = function() {
            throw new ParseError("KaTeX doesn't work in quirks mode.");
        };
    }
}

/**
 * Parse and build an expression, and return the markup for that.
 */
var renderToString = function(expression, options) {
    var settings = new Settings(options);

    var tree = parseTree(expression, settings);
    return buildTree(tree, expression, settings).toMarkup();
};

/**
 * Parse an expression and return the parse tree.
 */
var generateParseTree = function(expression, options) {
    var settings = new Settings(options);
    return parseTree(expression, settings);
};

module.exports = {
    render: render,
    renderToString: renderToString,
    /**
     * NOTE: This method is not currently recommended for public use.
     * The internal tree representation is unstable and is very likely
     * to change. Use at your own risk.
     */
    __parse: generateParseTree,
    ParseError: ParseError
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:katex/settings.js");
require("./node_modules/meteor/rocketchat:katex/katex.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:katex'] = {};

})();

//# sourceMappingURL=rocketchat_katex.js.map

(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var ECMAScript = Package.ecmascript.ECMAScript;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var meteorInstall = Package.modules.meteorInstall;
var process = Package.modules.process;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

/* Package-scope variables */
var Autocomplete;

var require = meteorInstall({"node_modules":{"meteor":{"mizzao:autocomplete":{"server":{"autocomplete-server.js":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// packages/mizzao_autocomplete/server/autocomplete-server.js                                     //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                           //
                                                                                                  //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                  //
                                                                                                  //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
                                                                                                  //
// This also attaches an onStop callback to sub, so we don't need to worry about that.            // 1
// https://github.com/meteor/meteor/blob/devel/packages/mongo/collection.js                       // 2
var Autocomplete = function () {                                                                  // 3
	function Autocomplete() {                                                                        // 3
		(0, _classCallCheck3.default)(this, Autocomplete);                                              // 3
	}                                                                                                // 3
                                                                                                  //
	Autocomplete.prototype.publishCursor = function () {                                             // 3
		function publishCursor(cursor, sub) {                                                           // 3
			Mongo.Collection._publishCursor(cursor, sub, 'autocompleteRecords');                           // 5
		}                                                                                               // 6
                                                                                                  //
		return publishCursor;                                                                           // 3
	}();                                                                                             // 3
                                                                                                  //
	return Autocomplete;                                                                             // 3
}();                                                                                              // 3
                                                                                                  //
Meteor.publish('autocomplete-recordset', function (selector, options, collName) {                 // 9
	var collection = global[collName]; // This is a semi-documented Meteor feature:                  // 10
	// https://github.com/meteor/meteor/blob/devel/packages/mongo-livedata/collection.js             // 13
                                                                                                  //
	if (!collection) {                                                                               // 14
		throw new Error(collName + " is not defined on the global namespace of the server.");           // 15
	}                                                                                                // 16
                                                                                                  //
	if (!collection._isInsecure()) {                                                                 // 17
		Meteor._debug(collName + " is a secure collection, therefore no data was returned because the client could compromise security by subscribing to arbitrary server collections via the browser console. Please write your own publish function.");
                                                                                                  //
		return []; // We need this for the subscription to be marked ready                              // 19
	}                                                                                                // 20
                                                                                                  //
	if (options.limit) {                                                                             // 21
		// guard against client-side DOS: hard limit to 50                                              // 22
		options.limit = Math.min(50, Math.abs(options.limit));                                          // 23
	} // Push this into our own collection on the client so they don't interfere with other publications of the named collection.
	// This also stops the observer automatically when the subscription is stopped.                  // 27
                                                                                                  //
                                                                                                  //
	Autocomplete.publishCursor(collection.find(selector, options), this); // Mark the subscription ready after the initial addition of documents.
                                                                                                  //
	this.ready();                                                                                    // 30
});                                                                                               // 31
////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/mizzao:autocomplete/server/autocomplete-server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['mizzao:autocomplete'] = {}, {
  Autocomplete: Autocomplete
});

})();

//# sourceMappingURL=mizzao_autocomplete.js.map

(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var check = Package.check.check;
var Match = Package.check.Match;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var meteorInstall = Package.modules.meteorInstall;
var process = Package.modules.process;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

var require = meteorInstall({"node_modules":{"meteor":{"jalik:ufs-local":{"ufs-local.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/jalik_ufs-local/ufs-local.js                                                                            //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                             //
                                                                                                                    //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                    //
                                                                                                                    //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                       //
                                                                                                                    //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                              //
                                                                                                                    //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                         //
                                                                                                                    //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                //
                                                                                                                    //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                   //
                                                                                                                    //
module.export({                                                                                                     // 1
    LocalStore: function () {                                                                                       // 1
        return LocalStore;                                                                                          // 1
    }                                                                                                               // 1
});                                                                                                                 // 1
                                                                                                                    //
var _ = void 0;                                                                                                     // 1
                                                                                                                    //
module.watch(require("meteor/underscore"), {                                                                        // 1
    _: function (v) {                                                                                               // 1
        _ = v;                                                                                                      // 1
    }                                                                                                               // 1
}, 0);                                                                                                              // 1
var check = void 0;                                                                                                 // 1
module.watch(require("meteor/check"), {                                                                             // 1
    check: function (v) {                                                                                           // 1
        check = v;                                                                                                  // 1
    }                                                                                                               // 1
}, 1);                                                                                                              // 1
var Meteor = void 0;                                                                                                // 1
module.watch(require("meteor/meteor"), {                                                                            // 1
    Meteor: function (v) {                                                                                          // 1
        Meteor = v;                                                                                                 // 1
    }                                                                                                               // 1
}, 2);                                                                                                              // 1
var UploadFS = void 0;                                                                                              // 1
module.watch(require("meteor/jalik:ufs"), {                                                                         // 1
    UploadFS: function (v) {                                                                                        // 1
        UploadFS = v;                                                                                               // 1
    }                                                                                                               // 1
}, 3);                                                                                                              // 1
                                                                                                                    //
var LocalStore = function (_UploadFS$Store) {                                                                       //
    (0, _inherits3.default)(LocalStore, _UploadFS$Store);                                                           //
                                                                                                                    //
    function LocalStore(options) {                                                                                  // 39
        (0, _classCallCheck3.default)(this, LocalStore);                                                            // 39
        // Default options                                                                                          // 40
        options = _.extend({                                                                                        // 41
            mode: '0744',                                                                                           // 42
            path: 'ufs/uploads',                                                                                    // 43
            writeMode: '0744'                                                                                       // 44
        }, options); // Check options                                                                               // 41
                                                                                                                    //
        if (typeof options.mode !== "string") {                                                                     // 48
            throw new TypeError("LocalStore: mode is not a string");                                                // 49
        }                                                                                                           // 50
                                                                                                                    //
        if (typeof options.path !== "string") {                                                                     // 51
            throw new TypeError("LocalStore: path is not a string");                                                // 52
        }                                                                                                           // 53
                                                                                                                    //
        if (typeof options.writeMode !== "string") {                                                                // 54
            throw new TypeError("LocalStore: writeMode is not a string");                                           // 55
        }                                                                                                           // 56
                                                                                                                    //
        var _this = (0, _possibleConstructorReturn3.default)(this, _UploadFS$Store.call(this, options));            // 39
                                                                                                                    //
        var self = _this; // Private attributes                                                                     // 59
                                                                                                                    //
        var mode = options.mode;                                                                                    // 62
        var path = options.path;                                                                                    // 63
        var writeMode = options.writeMode;                                                                          // 64
                                                                                                                    //
        if (Meteor.isServer) {                                                                                      // 66
            var fs = Npm.require('fs');                                                                             // 67
                                                                                                                    //
            fs.stat(path, function (err) {                                                                          // 69
                if (err) {                                                                                          // 70
                    var mkdirp = Npm.require('mkdirp'); // Create the directory                                     // 71
                                                                                                                    //
                                                                                                                    //
                    mkdirp(path, {                                                                                  // 74
                        mode: mode                                                                                  // 74
                    }, function (err) {                                                                             // 74
                        if (err) {                                                                                  // 75
                            console.error("LocalStore: cannot create store at " + path + " (" + err.message + ")");
                        } else {                                                                                    // 77
                            console.info("LocalStore: store created at " + path);                                   // 78
                        }                                                                                           // 79
                    });                                                                                             // 80
                } else {                                                                                            // 81
                    // Set directory permissions                                                                    // 82
                    fs.chmod(path, mode, function (err) {                                                           // 83
                        err && console.error("LocalStore: cannot set store permissions " + mode + " (" + err.message + ")");
                    });                                                                                             // 85
                }                                                                                                   // 86
            });                                                                                                     // 87
        } /**                                                                                                       // 88
           * Returns the path or sub path                                                                           //
           * @param file                                                                                            //
           * @return {string}                                                                                       //
           */                                                                                                       //
                                                                                                                    //
        _this.getPath = function (file) {                                                                           // 95
            return path + (file ? "/" + file : '');                                                                 // 96
        };                                                                                                          // 97
                                                                                                                    //
        if (Meteor.isServer) {                                                                                      // 100
            /**                                                                                                     // 101
             * Removes the file                                                                                     //
             * @param fileId                                                                                        //
             * @param callback                                                                                      //
             */_this.delete = function (fileId, callback) {                                                         //
                var path = this.getFilePath(fileId);                                                                // 107
                                                                                                                    //
                if (typeof callback !== 'function') {                                                               // 109
                    callback = function (err) {                                                                     // 110
                        err && console.error("LocalStore: cannot delete file \"" + fileId + "\" at " + path + " (" + err.message + ")");
                    };                                                                                              // 112
                }                                                                                                   // 113
                                                                                                                    //
                var fs = Npm.require('fs');                                                                         // 114
                                                                                                                    //
                fs.stat(path, Meteor.bindEnvironment(function (err, stat) {                                         // 115
                    if (!err && stat && stat.isFile()) {                                                            // 116
                        fs.unlink(path, Meteor.bindEnvironment(function () {                                        // 117
                            self.getCollection().remove(fileId);                                                    // 118
                            callback.call(self);                                                                    // 119
                        }));                                                                                        // 120
                    }                                                                                               // 121
                }));                                                                                                // 122
            }; /**                                                                                                  // 123
                * Returns the file read stream                                                                      //
                * @param fileId                                                                                     //
                * @param file                                                                                       //
                * @param options                                                                                    //
                * @return {*}                                                                                       //
                */                                                                                                  //
                                                                                                                    //
            _this.getReadStream = function (fileId, file, options) {                                                // 132
                var fs = Npm.require('fs');                                                                         // 133
                                                                                                                    //
                options = _.extend({}, options);                                                                    // 134
                return fs.createReadStream(self.getFilePath(fileId, file), {                                        // 135
                    flags: 'r',                                                                                     // 136
                    encoding: null,                                                                                 // 137
                    autoClose: true,                                                                                // 138
                    start: options.start,                                                                           // 139
                    end: options.end                                                                                // 140
                });                                                                                                 // 135
            }; /**                                                                                                  // 142
                * Returns the file write stream                                                                     //
                * @param fileId                                                                                     //
                * @param file                                                                                       //
                * @param options                                                                                    //
                * @return {*}                                                                                       //
                */                                                                                                  //
                                                                                                                    //
            _this.getWriteStream = function (fileId, file, options) {                                               // 151
                var fs = Npm.require('fs');                                                                         // 152
                                                                                                                    //
                options = _.extend({}, options);                                                                    // 153
                return fs.createWriteStream(self.getFilePath(fileId, file), {                                       // 154
                    flags: 'a',                                                                                     // 155
                    encoding: null,                                                                                 // 156
                    mode: writeMode,                                                                                // 157
                    start: options.start                                                                            // 158
                });                                                                                                 // 154
            };                                                                                                      // 160
        }                                                                                                           // 161
                                                                                                                    //
        return _this;                                                                                               // 39
    } /**                                                                                                           // 162
       * Returns the file path                                                                                      //
       * @param fileId                                                                                              //
       * @param file                                                                                                //
       * @return {string}                                                                                           //
       */                                                                                                           //
                                                                                                                    //
    LocalStore.prototype.getFilePath = function () {                                                                //
        function getFilePath(fileId, file) {                                                                        //
            file = file || this.getCollection().findOne(fileId, {                                                   // 171
                fields: {                                                                                           // 171
                    extension: 1                                                                                    // 171
                }                                                                                                   // 171
            });                                                                                                     // 171
            return file && this.getPath(fileId + (file.extension ? "." + file.extension : ''));                     // 172
        }                                                                                                           // 173
                                                                                                                    //
        return getFilePath;                                                                                         //
    }();                                                                                                            //
                                                                                                                    //
    return LocalStore;                                                                                              //
}(UploadFS.Store);                                                                                                  //
                                                                                                                    //
// Add store to UFS namespace                                                                                       // 176
UploadFS.store.Local = LocalStore;                                                                                  // 177
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
var exports = require("./node_modules/meteor/jalik:ufs-local/ufs-local.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['jalik:ufs-local'] = exports;

})();

//# sourceMappingURL=jalik_ufs-local.js.map

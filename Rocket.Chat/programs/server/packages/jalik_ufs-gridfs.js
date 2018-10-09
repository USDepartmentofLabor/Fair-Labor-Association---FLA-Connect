(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var meteorInstall = Package.modules.meteorInstall;
var process = Package.modules.process;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

var require = meteorInstall({"node_modules":{"meteor":{"jalik:ufs-gridfs":{"ufs-gridfs.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/jalik_ufs-gridfs/ufs-gridfs.js                                                               //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                  //
                                                                                                         //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                         //
                                                                                                         //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");            //
                                                                                                         //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                   //
                                                                                                         //
var _inherits2 = require("babel-runtime/helpers/inherits");                                              //
                                                                                                         //
var _inherits3 = _interopRequireDefault(_inherits2);                                                     //
                                                                                                         //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }        //
                                                                                                         //
module.export({                                                                                          // 1
    GridFSStore: function () {                                                                           // 1
        return GridFSStore;                                                                              // 1
    }                                                                                                    // 1
});                                                                                                      // 1
                                                                                                         //
var _ = void 0;                                                                                          // 1
                                                                                                         //
module.watch(require("meteor/underscore"), {                                                             // 1
    _: function (v) {                                                                                    // 1
        _ = v;                                                                                           // 1
    }                                                                                                    // 1
}, 0);                                                                                                   // 1
var check = void 0;                                                                                      // 1
module.watch(require("meteor/check"), {                                                                  // 1
    check: function (v) {                                                                                // 1
        check = v;                                                                                       // 1
    }                                                                                                    // 1
}, 1);                                                                                                   // 1
var Meteor = void 0;                                                                                     // 1
module.watch(require("meteor/meteor"), {                                                                 // 1
    Meteor: function (v) {                                                                               // 1
        Meteor = v;                                                                                      // 1
    }                                                                                                    // 1
}, 2);                                                                                                   // 1
var UploadFS = void 0;                                                                                   // 1
module.watch(require("meteor/jalik:ufs"), {                                                              // 1
    UploadFS: function (v) {                                                                             // 1
        UploadFS = v;                                                                                    // 1
    }                                                                                                    // 1
}, 3);                                                                                                   // 1
                                                                                                         //
var GridFSStore = function (_UploadFS$Store) {                                                           //
    (0, _inherits3.default)(GridFSStore, _UploadFS$Store);                                               //
                                                                                                         //
    function GridFSStore(options) {                                                                      // 38
        (0, _classCallCheck3.default)(this, GridFSStore);                                                // 38
        // Default options                                                                               // 39
        options = _.extend({                                                                             // 40
            chunkSize: 1024 * 255,                                                                       // 41
            collectionName: 'uploadfs'                                                                   // 42
        }, options); // Check options                                                                    // 40
                                                                                                         //
        if (typeof options.chunkSize !== "number") {                                                     // 46
            throw new TypeError("GridFSStore: chunkSize is not a number");                               // 47
        }                                                                                                // 48
                                                                                                         //
        if (typeof options.collectionName !== "string") {                                                // 49
            throw new TypeError("GridFSStore: collectionName is not a string");                          // 50
        }                                                                                                // 51
                                                                                                         //
        var _this = (0, _possibleConstructorReturn3.default)(this, _UploadFS$Store.call(this, options));
                                                                                                         //
        _this.chunkSize = options.chunkSize;                                                             // 55
        _this.collectionName = options.collectionName;                                                   // 56
                                                                                                         //
        if (Meteor.isServer) {                                                                           // 58
            var mongo = Package.mongo.MongoInternals.NpmModule;                                          // 59
            var db = Package.mongo.MongoInternals.defaultRemoteCollectionDriver().mongo.db;              // 60
            var mongoStore = new mongo.GridFSBucket(db, {                                                // 61
                bucketName: options.collectionName,                                                      // 62
                chunkSizeBytes: options.chunkSize                                                        // 63
            }); /**                                                                                      // 61
                 * Removes the file                                                                      //
                 * @param fileId                                                                         //
                 * @param callback                                                                       //
                 */                                                                                      //
                                                                                                         //
            _this.delete = function (fileId, callback) {                                                 // 71
                if (typeof callback !== 'function') {                                                    // 72
                    callback = function (err) {                                                          // 73
                        if (err) {                                                                       // 74
                            console.error(err);                                                          // 75
                        }                                                                                // 76
                    };                                                                                   // 77
                }                                                                                        // 78
                                                                                                         //
                return mongoStore.delete(fileId, callback);                                              // 79
            }; /**                                                                                       // 80
                * Returns the file read stream                                                           //
                * @param fileId                                                                          //
                * @param file                                                                            //
                * @param options                                                                         //
                * @return {*}                                                                            //
                */                                                                                       //
                                                                                                         //
            _this.getReadStream = function (fileId, file, options) {                                     // 89
                options = _.extend({}, options);                                                         // 90
                return mongoStore.openDownloadStream(fileId, {                                           // 91
                    start: options.start,                                                                // 92
                    end: options.end                                                                     // 93
                });                                                                                      // 91
            }; /**                                                                                       // 95
                * Returns the file write stream                                                          //
                * @param fileId                                                                          //
                * @param file                                                                            //
                * @param options                                                                         //
                * @return {*}                                                                            //
                */                                                                                       //
                                                                                                         //
            _this.getWriteStream = function (fileId, file, options) {                                    // 104
                var writeStream = mongoStore.openUploadStreamWithId(fileId, fileId, {                    // 105
                    chunkSizeBytes: this.chunkSize,                                                      // 106
                    contentType: file.type                                                               // 107
                });                                                                                      // 105
                writeStream.on('close', function () {                                                    // 109
                    writeStream.emit('finish');                                                          // 110
                });                                                                                      // 111
                return writeStream;                                                                      // 112
            };                                                                                           // 113
        }                                                                                                // 114
                                                                                                         //
        return _this;                                                                                    // 38
    }                                                                                                    // 115
                                                                                                         //
    return GridFSStore;                                                                                  //
}(UploadFS.Store);                                                                                       //
                                                                                                         //
// Add store to UFS namespace                                                                            // 118
UploadFS.store.GridFS = GridFSStore;                                                                     // 119
///////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
var exports = require("./node_modules/meteor/jalik:ufs-gridfs/ufs-gridfs.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['jalik:ufs-gridfs'] = exports;

})();

//# sourceMappingURL=jalik_ufs-gridfs.js.map

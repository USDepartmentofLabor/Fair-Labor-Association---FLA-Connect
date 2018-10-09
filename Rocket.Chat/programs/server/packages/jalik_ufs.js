(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var check = Package.check.check;
var Match = Package.check.Match;
var ECMAScript = Package.ecmascript.ECMAScript;
var CollectionHooks = Package['matb33:collection-hooks'].CollectionHooks;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var _ = Package.underscore._;
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;
var meteorInstall = Package.modules.meteorInstall;
var process = Package.modules.process;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

var require = meteorInstall({"node_modules":{"meteor":{"jalik:ufs":{"ufs.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jalik_ufs/ufs.js                                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _typeof2 = require("babel-runtime/helpers/typeof");                                                                //
                                                                                                                       //
var _typeof3 = _interopRequireDefault(_typeof2);                                                                       //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
var module1 = module;                                                                                                  // 1
module1.export({                                                                                                       // 1
    UploadFS: function () {                                                                                            // 1
        return UploadFS;                                                                                               // 1
    }                                                                                                                  // 1
});                                                                                                                    // 1
                                                                                                                       //
var _ = void 0;                                                                                                        // 1
                                                                                                                       //
module1.watch(require("meteor/underscore"), {                                                                          // 1
    _: function (v) {                                                                                                  // 1
        _ = v;                                                                                                         // 1
    }                                                                                                                  // 1
}, 0);                                                                                                                 // 1
var Meteor = void 0;                                                                                                   // 1
module1.watch(require("meteor/meteor"), {                                                                              // 1
    Meteor: function (v) {                                                                                             // 1
        Meteor = v;                                                                                                    // 1
    }                                                                                                                  // 1
}, 1);                                                                                                                 // 1
var Mongo = void 0;                                                                                                    // 1
module1.watch(require("meteor/mongo"), {                                                                               // 1
    Mongo: function (v) {                                                                                              // 1
        Mongo = v;                                                                                                     // 1
    }                                                                                                                  // 1
}, 2);                                                                                                                 // 1
var MIME = void 0;                                                                                                     // 1
module1.watch(require("./ufs-mime"), {                                                                                 // 1
    MIME: function (v) {                                                                                               // 1
        MIME = v;                                                                                                      // 1
    }                                                                                                                  // 1
}, 3);                                                                                                                 // 1
var Random = void 0;                                                                                                   // 1
module1.watch(require("meteor/random"), {                                                                              // 1
    Random: function (v) {                                                                                             // 1
        Random = v;                                                                                                    // 1
    }                                                                                                                  // 1
}, 4);                                                                                                                 // 1
var Tokens = void 0;                                                                                                   // 1
module1.watch(require("./ufs-tokens"), {                                                                               // 1
    Tokens: function (v) {                                                                                             // 1
        Tokens = v;                                                                                                    // 1
    }                                                                                                                  // 1
}, 5);                                                                                                                 // 1
var Config = void 0;                                                                                                   // 1
module1.watch(require("./ufs-config"), {                                                                               // 1
    Config: function (v) {                                                                                             // 1
        Config = v;                                                                                                    // 1
    }                                                                                                                  // 1
}, 6);                                                                                                                 // 1
var Filter = void 0;                                                                                                   // 1
module1.watch(require("./ufs-filter"), {                                                                               // 1
    Filter: function (v) {                                                                                             // 1
        Filter = v;                                                                                                    // 1
    }                                                                                                                  // 1
}, 7);                                                                                                                 // 1
var Store = void 0;                                                                                                    // 1
module1.watch(require("./ufs-store"), {                                                                                // 1
    Store: function (v) {                                                                                              // 1
        Store = v;                                                                                                     // 1
    }                                                                                                                  // 1
}, 8);                                                                                                                 // 1
var StorePermissions = void 0;                                                                                         // 1
module1.watch(require("./ufs-store-permissions"), {                                                                    // 1
    StorePermissions: function (v) {                                                                                   // 1
        StorePermissions = v;                                                                                          // 1
    }                                                                                                                  // 1
}, 9);                                                                                                                 // 1
var Uploader = void 0;                                                                                                 // 1
module1.watch(require("./ufs-uploader"), {                                                                             // 1
    Uploader: function (v) {                                                                                           // 1
        Uploader = v;                                                                                                  // 1
    }                                                                                                                  // 1
}, 10);                                                                                                                // 1
var stores = {};                                                                                                       // 38
var UploadFS = {                                                                                                       // 40
    /**                                                                                                                // 42
     * Contains all stores                                                                                             //
     */store: {},                                                                                                      //
    /**                                                                                                                // 47
     * Collection of tokens                                                                                            //
     */tokens: Tokens,                                                                                                 //
    /**                                                                                                                // 52
     * Adds the "etag" attribute to files                                                                              //
     * @param where                                                                                                    //
     */addETagAttributeToFiles: function (where) {                                                                     //
        var _this = this;                                                                                              // 56
                                                                                                                       //
        _.each(this.getStores(), function (store) {                                                                    // 57
            var files = store.getCollection(); // By default update only files with no path set                        // 58
                                                                                                                       //
            files.find(where || {                                                                                      // 61
                etag: null                                                                                             // 61
            }, {                                                                                                       // 61
                fields: {                                                                                              // 61
                    _id: 1                                                                                             // 61
                }                                                                                                      // 61
            }).forEach(function (file) {                                                                               // 61
                files.direct.update(file._id, {                                                                        // 62
                    $set: {                                                                                            // 62
                        etag: _this.generateEtag()                                                                     // 62
                    }                                                                                                  // 62
                });                                                                                                    // 62
            });                                                                                                        // 63
        });                                                                                                            // 64
    },                                                                                                                 // 65
    /**                                                                                                                // 67
     * Adds the MIME type for an extension                                                                             //
     * @param extension                                                                                                //
     * @param mime                                                                                                     //
     */addMimeType: function (extension, mime) {                                                                       //
        MIME[extension.toLowerCase()] = mime;                                                                          // 73
    },                                                                                                                 // 74
    /**                                                                                                                // 76
     * Adds the "path" attribute to files                                                                              //
     * @param where                                                                                                    //
     */addPathAttributeToFiles: function (where) {                                                                     //
        _.each(this.getStores(), function (store) {                                                                    // 81
            var files = store.getCollection(); // By default update only files with no path set                        // 82
                                                                                                                       //
            files.find(where || {                                                                                      // 85
                path: null                                                                                             // 85
            }, {                                                                                                       // 85
                fields: {                                                                                              // 85
                    _id: 1                                                                                             // 85
                }                                                                                                      // 85
            }).forEach(function (file) {                                                                               // 85
                files.direct.update(file._id, {                                                                        // 86
                    $set: {                                                                                            // 86
                        path: store.getFileRelativeURL(file._id)                                                       // 86
                    }                                                                                                  // 86
                });                                                                                                    // 86
            });                                                                                                        // 87
        });                                                                                                            // 88
    },                                                                                                                 // 89
    /**                                                                                                                // 91
     * Registers the store                                                                                             //
     * @param store                                                                                                    //
     */addStore: function (store) {                                                                                    //
        if (!(store instanceof Store)) {                                                                               // 96
            throw new TypeError("ufs: store is not an instance of UploadFS.Store.");                                   // 97
        }                                                                                                              // 98
                                                                                                                       //
        stores[store.getName()] = store;                                                                               // 99
    },                                                                                                                 // 100
    /**                                                                                                                // 102
     * Generates a unique ETag                                                                                         //
     * @return {string}                                                                                                //
     */generateEtag: function () {                                                                                     //
        return Random.id();                                                                                            // 107
    },                                                                                                                 // 108
    /**                                                                                                                // 110
     * Returns the MIME type of the extension                                                                          //
     * @param extension                                                                                                //
     * @returns {*}                                                                                                    //
     */getMimeType: function (extension) {                                                                             //
        extension = extension.toLowerCase();                                                                           // 116
        return MIME[extension];                                                                                        // 117
    },                                                                                                                 // 118
    /**                                                                                                                // 120
     * Returns all MIME types                                                                                          //
     */getMimeTypes: function () {                                                                                     //
        return MIME;                                                                                                   // 124
    },                                                                                                                 // 125
    /**                                                                                                                // 127
     * Returns the store by its name                                                                                   //
     * @param name                                                                                                     //
     * @return {UploadFS.Store}                                                                                        //
     */getStore: function (name) {                                                                                     //
        return stores[name];                                                                                           // 133
    },                                                                                                                 // 134
    /**                                                                                                                // 136
     * Returns all stores                                                                                              //
     * @return {object}                                                                                                //
     */getStores: function () {                                                                                        //
        return stores;                                                                                                 // 141
    },                                                                                                                 // 142
    /**                                                                                                                // 144
     * Returns the temporary file path                                                                                 //
     * @param fileId                                                                                                   //
     * @return {string}                                                                                                //
     */getTempFilePath: function (fileId) {                                                                            //
        return this.config.tmpDir + "/" + fileId;                                                                      // 150
    },                                                                                                                 // 151
    /**                                                                                                                // 153
     * Imports a file from a URL                                                                                       //
     * @param url                                                                                                      //
     * @param file                                                                                                     //
     * @param store                                                                                                    //
     * @param callback                                                                                                 //
     */importFromURL: function (url, file, store, callback) {                                                          //
        if (typeof store === 'string') {                                                                               // 161
            Meteor.call('ufsImportURL', url, file, store, callback);                                                   // 162
        } else if ((typeof store === "undefined" ? "undefined" : (0, _typeof3.default)(store)) === 'object') {         // 163
            store.importFromURL(url, file, callback);                                                                  // 165
        }                                                                                                              // 166
    },                                                                                                                 // 167
    /**                                                                                                                // 169
     * Returns file and data as ArrayBuffer for each files in the event                                                //
     * @deprecated                                                                                                     //
     * @param event                                                                                                    //
     * @param callback                                                                                                 //
     */readAsArrayBuffer: function (event, callback) {                                                                 //
        console.error('UploadFS.readAsArrayBuffer is deprecated, see https://github.com/jalik/jalik-ufs#uploading-from-a-file');
    },                                                                                                                 // 177
    /**                                                                                                                // 179
     * Opens a dialog to select a single file                                                                          //
     * @param callback                                                                                                 //
     */selectFile: function (callback) {                                                                               //
        var input = document.createElement('input');                                                                   // 184
        input.type = 'file';                                                                                           // 185
        input.multiple = false;                                                                                        // 186
                                                                                                                       //
        input.onchange = function (ev) {                                                                               // 187
            var files = ev.target.files;                                                                               // 188
            callback.call(UploadFS, files[0]);                                                                         // 189
        }; // Fix for iOS/Safari                                                                                       // 190
                                                                                                                       //
                                                                                                                       //
        var div = document.createElement('div');                                                                       // 192
        div.className = 'ufs-file-selector';                                                                           // 193
        div.style = 'display:none; height:0; width:0; overflow: hidden;';                                              // 194
        div.appendChild(input);                                                                                        // 195
        document.body.appendChild(div); // Trigger file selection                                                      // 196
                                                                                                                       //
        input.click();                                                                                                 // 198
    },                                                                                                                 // 199
    /**                                                                                                                // 201
     * Opens a dialog to select multiple files                                                                         //
     * @param callback                                                                                                 //
     */selectFiles: function (callback) {                                                                              //
        var input = document.createElement('input');                                                                   // 206
        input.type = 'file';                                                                                           // 207
        input.multiple = true;                                                                                         // 208
                                                                                                                       //
        input.onchange = function (ev) {                                                                               // 209
            var files = ev.target.files;                                                                               // 210
                                                                                                                       //
            for (var i = 0; i < files.length; i += 1) {                                                                // 212
                callback.call(UploadFS, files[i]);                                                                     // 213
            }                                                                                                          // 214
        }; // Fix for iOS/Safari                                                                                       // 215
                                                                                                                       //
                                                                                                                       //
        var div = document.createElement('div');                                                                       // 217
        div.className = 'ufs-file-selector';                                                                           // 218
        div.style = 'display:none; height:0; width:0; overflow: hidden;';                                              // 219
        div.appendChild(input);                                                                                        // 220
        document.body.appendChild(div); // Trigger file selection                                                      // 221
                                                                                                                       //
        input.click();                                                                                                 // 223
    }                                                                                                                  // 224
};                                                                                                                     // 40
                                                                                                                       //
if (Meteor.isClient) {                                                                                                 // 228
    require('./ufs-template-helpers');                                                                                 // 229
}                                                                                                                      // 230
                                                                                                                       //
if (Meteor.isServer) {                                                                                                 // 231
    require('./ufs-methods');                                                                                          // 232
                                                                                                                       //
    require('./ufs-server');                                                                                           // 233
} /**                                                                                                                  // 234
   * UploadFS Configuration                                                                                            //
   * @type {Config}                                                                                                    //
   */                                                                                                                  //
                                                                                                                       //
UploadFS.config = new Config(); // Add classes to global namespace                                                     // 240
                                                                                                                       //
UploadFS.Config = Config;                                                                                              // 243
UploadFS.Filter = Filter;                                                                                              // 244
UploadFS.Store = Store;                                                                                                // 245
UploadFS.StorePermissions = StorePermissions;                                                                          // 246
UploadFS.Uploader = Uploader;                                                                                          // 247
                                                                                                                       //
if (Meteor.isServer) {                                                                                                 // 249
    // Expose the module globally                                                                                      // 250
    if (typeof global !== 'undefined') {                                                                               // 251
        global['UploadFS'] = UploadFS;                                                                                 // 252
    }                                                                                                                  // 253
} else if (Meteor.isClient) {                                                                                          // 254
    // Expose the module globally                                                                                      // 256
    if (typeof window !== 'undefined') {                                                                               // 257
        window.UploadFS = UploadFS;                                                                                    // 258
    }                                                                                                                  // 259
}                                                                                                                      // 260
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ufs-config.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jalik_ufs/ufs-config.js                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
module.export({                                                                                                        // 1
    Config: function () {                                                                                              // 1
        return Config;                                                                                                 // 1
    }                                                                                                                  // 1
});                                                                                                                    // 1
                                                                                                                       //
var _ = void 0;                                                                                                        // 1
                                                                                                                       //
module.watch(require("meteor/underscore"), {                                                                           // 1
    _: function (v) {                                                                                                  // 1
        _ = v;                                                                                                         // 1
    }                                                                                                                  // 1
}, 0);                                                                                                                 // 1
var Meteor = void 0;                                                                                                   // 1
module.watch(require("meteor/meteor"), {                                                                               // 1
    Meteor: function (v) {                                                                                             // 1
        Meteor = v;                                                                                                    // 1
    }                                                                                                                  // 1
}, 1);                                                                                                                 // 1
var StorePermissions = void 0;                                                                                         // 1
module.watch(require("./ufs-store-permissions"), {                                                                     // 1
    StorePermissions: function (v) {                                                                                   // 1
        StorePermissions = v;                                                                                          // 1
    }                                                                                                                  // 1
}, 2);                                                                                                                 // 1
                                                                                                                       //
var Config = function () {                                                                                             //
    function Config(options) {                                                                                         // 36
        (0, _classCallCheck3.default)(this, Config);                                                                   // 36
        // Default options                                                                                             // 37
        options = _.extend({                                                                                           // 38
            defaultStorePermissions: null,                                                                             // 39
            https: false,                                                                                              // 40
            simulateReadDelay: 0,                                                                                      // 41
            simulateUploadSpeed: 0,                                                                                    // 42
            simulateWriteDelay: 0,                                                                                     // 43
            storesPath: 'ufs',                                                                                         // 44
            tmpDir: '/tmp/ufs',                                                                                        // 45
            tmpDirPermissions: '0700'                                                                                  // 46
        }, options); // Check options                                                                                  // 38
                                                                                                                       //
        if (options.defaultStorePermissions && !(options.defaultStorePermissions instanceof StorePermissions)) {       // 50
            throw new TypeError('Config: defaultStorePermissions is not an instance of StorePermissions');             // 51
        }                                                                                                              // 52
                                                                                                                       //
        if (typeof options.https !== 'boolean') {                                                                      // 53
            throw new TypeError('Config: https is not a function');                                                    // 54
        }                                                                                                              // 55
                                                                                                                       //
        if (typeof options.simulateReadDelay !== 'number') {                                                           // 56
            throw new TypeError('Config: simulateReadDelay is not a number');                                          // 57
        }                                                                                                              // 58
                                                                                                                       //
        if (typeof options.simulateUploadSpeed !== 'number') {                                                         // 59
            throw new TypeError('Config: simulateUploadSpeed is not a number');                                        // 60
        }                                                                                                              // 61
                                                                                                                       //
        if (typeof options.simulateWriteDelay !== 'number') {                                                          // 62
            throw new TypeError('Config: simulateWriteDelay is not a number');                                         // 63
        }                                                                                                              // 64
                                                                                                                       //
        if (typeof options.storesPath !== 'string') {                                                                  // 65
            throw new TypeError('Config: storesPath is not a string');                                                 // 66
        }                                                                                                              // 67
                                                                                                                       //
        if (typeof options.tmpDir !== 'string') {                                                                      // 68
            throw new TypeError('Config: tmpDir is not a string');                                                     // 69
        }                                                                                                              // 70
                                                                                                                       //
        if (typeof options.tmpDirPermissions !== 'string') {                                                           // 71
            throw new TypeError('Config: tmpDirPermissions is not a string');                                          // 72
        } /**                                                                                                          // 73
           * Default store permissions                                                                                 //
           * @type {UploadFS.StorePermissions}                                                                         //
           */                                                                                                          //
                                                                                                                       //
        this.defaultStorePermissions = options.defaultStorePermissions; /**                                            // 79
                                                                         * Use or not secured protocol in URLS         //
                                                                         * @type {boolean}                             //
                                                                         */                                            //
        this.https = options.https; /**                                                                                // 84
                                     * The simulation read delay                                                       //
                                     * @type {Number}                                                                  //
                                     */                                                                                //
        this.simulateReadDelay = parseInt(options.simulateReadDelay); /**                                              // 89
                                                                       * The simulation upload speed                   //
                                                                       * @type {Number}                                //
                                                                       */                                              //
        this.simulateUploadSpeed = parseInt(options.simulateUploadSpeed); /**                                          // 94
                                                                           * The simulation write delay                //
                                                                           * @type {Number}                            //
                                                                           */                                          //
        this.simulateWriteDelay = parseInt(options.simulateWriteDelay); /**                                            // 99
                                                                         * The URL root path of stores                 //
                                                                         * @type {string}                              //
                                                                         */                                            //
        this.storesPath = options.storesPath; /**                                                                      // 104
                                               * The temporary directory of uploading files                            //
                                               * @type {string}                                                        //
                                               */                                                                      //
        this.tmpDir = options.tmpDir; /**                                                                              // 109
                                       * The permissions of the temporary directory                                    //
                                       * @type {string}                                                                //
                                       */                                                                              //
        this.tmpDirPermissions = options.tmpDirPermissions;                                                            // 114
    }                                                                                                                  // 115
                                                                                                                       //
    return Config;                                                                                                     //
}();                                                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ufs-filter.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jalik_ufs/ufs-filter.js                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _typeof2 = require("babel-runtime/helpers/typeof");                                                                //
                                                                                                                       //
var _typeof3 = _interopRequireDefault(_typeof2);                                                                       //
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
module.export({                                                                                                        // 1
    Filter: function () {                                                                                              // 1
        return Filter;                                                                                                 // 1
    }                                                                                                                  // 1
});                                                                                                                    // 1
                                                                                                                       //
var _ = void 0;                                                                                                        // 1
                                                                                                                       //
module.watch(require("meteor/underscore"), {                                                                           // 1
    _: function (v) {                                                                                                  // 1
        _ = v;                                                                                                         // 1
    }                                                                                                                  // 1
}, 0);                                                                                                                 // 1
var Meteor = void 0;                                                                                                   // 1
module.watch(require("meteor/meteor"), {                                                                               // 1
    Meteor: function (v) {                                                                                             // 1
        Meteor = v;                                                                                                    // 1
    }                                                                                                                  // 1
}, 1);                                                                                                                 // 1
                                                                                                                       //
var Filter = function () {                                                                                             //
    function Filter(options) {                                                                                         // 34
        (0, _classCallCheck3.default)(this, Filter);                                                                   // 34
        var self = this; // Default options                                                                            // 35
                                                                                                                       //
        options = _.extend({                                                                                           // 38
            contentTypes: null,                                                                                        // 39
            extensions: null,                                                                                          // 40
            minSize: 1,                                                                                                // 41
            maxSize: 0,                                                                                                // 42
            onCheck: this.onCheck                                                                                      // 43
        }, options); // Check options                                                                                  // 38
                                                                                                                       //
        if (options.contentTypes && !(options.contentTypes instanceof Array)) {                                        // 47
            throw new TypeError("Filter: contentTypes is not an Array");                                               // 48
        }                                                                                                              // 49
                                                                                                                       //
        if (options.extensions && !(options.extensions instanceof Array)) {                                            // 50
            throw new TypeError("Filter: extensions is not an Array");                                                 // 51
        }                                                                                                              // 52
                                                                                                                       //
        if (typeof options.minSize !== "number") {                                                                     // 53
            throw new TypeError("Filter: minSize is not a number");                                                    // 54
        }                                                                                                              // 55
                                                                                                                       //
        if (typeof options.maxSize !== "number") {                                                                     // 56
            throw new TypeError("Filter: maxSize is not a number");                                                    // 57
        }                                                                                                              // 58
                                                                                                                       //
        if (options.onCheck && typeof options.onCheck !== "function") {                                                // 59
            throw new TypeError("Filter: onCheck is not a function");                                                  // 60
        } // Public attributes                                                                                         // 61
                                                                                                                       //
                                                                                                                       //
        self.options = options;                                                                                        // 64
                                                                                                                       //
        _.each(['onCheck'], function (method) {                                                                        // 65
            if (typeof options[method] === 'function') {                                                               // 68
                self[method] = options[method];                                                                        // 69
            }                                                                                                          // 70
        });                                                                                                            // 71
    } /**                                                                                                              // 72
       * Checks the file                                                                                               //
       * @param file                                                                                                   //
       */                                                                                                              //
                                                                                                                       //
    Filter.prototype.check = function () {                                                                             //
        function check(file) {                                                                                         //
            if ((typeof file === "undefined" ? "undefined" : (0, _typeof3.default)(file)) !== "object" || !file) {     // 79
                throw new Meteor.Error('invalid-file', "File is not valid");                                           // 80
            } // Check size                                                                                            // 81
                                                                                                                       //
                                                                                                                       //
            if (file.size <= 0 || file.size < this.getMinSize()) {                                                     // 83
                throw new Meteor.Error('file-too-small', "File size is too small (min = " + this.getMinSize() + ")");  // 84
            }                                                                                                          // 85
                                                                                                                       //
            if (this.getMaxSize() > 0 && file.size > this.getMaxSize()) {                                              // 86
                throw new Meteor.Error('file-too-large', "File size is too large (max = " + this.getMaxSize() + ")");  // 87
            } // Check extension                                                                                       // 88
                                                                                                                       //
                                                                                                                       //
            if (this.getExtensions() && !_.contains(this.getExtensions(), file.extension)) {                           // 90
                throw new Meteor.Error('invalid-file-extension', "File extension \"" + file.extension + "\" is not accepted");
            } // Check content type                                                                                    // 92
                                                                                                                       //
                                                                                                                       //
            if (this.getContentTypes() && !this.isContentTypeInList(file.type, this.getContentTypes())) {              // 94
                throw new Meteor.Error('invalid-file-type', "File type \"" + file.type + "\" is not accepted");        // 95
            } // Apply custom check                                                                                    // 96
                                                                                                                       //
                                                                                                                       //
            if (typeof this.onCheck === 'function' && !this.onCheck(file)) {                                           // 98
                throw new Meteor.Error('invalid-file', "File does not match filter");                                  // 99
            }                                                                                                          // 100
        }                                                                                                              // 101
                                                                                                                       //
        return check;                                                                                                  //
    }(); /**                                                                                                           //
          * Returns the allowed content types                                                                          //
          * @return {Array}                                                                                            //
          */                                                                                                           //
                                                                                                                       //
    Filter.prototype.getContentTypes = function () {                                                                   //
        function getContentTypes() {                                                                                   //
            return this.options.contentTypes;                                                                          // 108
        }                                                                                                              // 109
                                                                                                                       //
        return getContentTypes;                                                                                        //
    }(); /**                                                                                                           //
          * Returns the allowed extensions                                                                             //
          * @return {Array}                                                                                            //
          */                                                                                                           //
                                                                                                                       //
    Filter.prototype.getExtensions = function () {                                                                     //
        function getExtensions() {                                                                                     //
            return this.options.extensions;                                                                            // 116
        }                                                                                                              // 117
                                                                                                                       //
        return getExtensions;                                                                                          //
    }(); /**                                                                                                           //
          * Returns the maximum file size                                                                              //
          * @return {Number}                                                                                           //
          */                                                                                                           //
                                                                                                                       //
    Filter.prototype.getMaxSize = function () {                                                                        //
        function getMaxSize() {                                                                                        //
            return this.options.maxSize;                                                                               // 124
        }                                                                                                              // 125
                                                                                                                       //
        return getMaxSize;                                                                                             //
    }(); /**                                                                                                           //
          * Returns the minimum file size                                                                              //
          * @return {Number}                                                                                           //
          */                                                                                                           //
                                                                                                                       //
    Filter.prototype.getMinSize = function () {                                                                        //
        function getMinSize() {                                                                                        //
            return this.options.minSize;                                                                               // 132
        }                                                                                                              // 133
                                                                                                                       //
        return getMinSize;                                                                                             //
    }(); /**                                                                                                           //
          * Checks if content type is in the given list                                                                //
          * @param type                                                                                                //
          * @param list                                                                                                //
          * @return {boolean}                                                                                          //
          */                                                                                                           //
                                                                                                                       //
    Filter.prototype.isContentTypeInList = function () {                                                               //
        function isContentTypeInList(type, list) {                                                                     //
            if (typeof type === 'string' && list instanceof Array) {                                                   // 142
                if (_.contains(list, type)) {                                                                          // 143
                    return true;                                                                                       // 144
                } else {                                                                                               // 145
                    var wildCardGlob = '/*';                                                                           // 146
                                                                                                                       //
                    var wildcards = _.filter(list, function (item) {                                                   // 147
                        return item.indexOf(wildCardGlob) > 0;                                                         // 148
                    });                                                                                                // 149
                                                                                                                       //
                    if (_.contains(wildcards, type.replace(/(\/.*)$/, wildCardGlob))) {                                // 151
                        return true;                                                                                   // 152
                    }                                                                                                  // 153
                }                                                                                                      // 154
            }                                                                                                          // 155
                                                                                                                       //
            return false;                                                                                              // 156
        }                                                                                                              // 157
                                                                                                                       //
        return isContentTypeInList;                                                                                    //
    }(); /**                                                                                                           //
          * Checks if the file matches filter                                                                          //
          * @param file                                                                                                //
          * @return {boolean}                                                                                          //
          */                                                                                                           //
                                                                                                                       //
    Filter.prototype.isValid = function () {                                                                           //
        function isValid(file) {                                                                                       //
            var result = true;                                                                                         // 165
                                                                                                                       //
            try {                                                                                                      // 166
                this.check(file);                                                                                      // 167
            } catch (err) {                                                                                            // 168
                result = false;                                                                                        // 169
            }                                                                                                          // 170
                                                                                                                       //
            return result;                                                                                             // 171
        }                                                                                                              // 172
                                                                                                                       //
        return isValid;                                                                                                //
    }(); /**                                                                                                           //
          * Executes custom checks                                                                                     //
          * @param file                                                                                                //
          * @return {boolean}                                                                                          //
          */                                                                                                           //
                                                                                                                       //
    Filter.prototype.onCheck = function () {                                                                           //
        function onCheck(file) {                                                                                       //
            return true;                                                                                               // 180
        }                                                                                                              // 181
                                                                                                                       //
        return onCheck;                                                                                                //
    }();                                                                                                               //
                                                                                                                       //
    return Filter;                                                                                                     //
}();                                                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ufs-methods.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jalik_ufs/ufs-methods.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _typeof2 = require("babel-runtime/helpers/typeof");                                                                //
                                                                                                                       //
var _typeof3 = _interopRequireDefault(_typeof2);                                                                       //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
var _ = void 0;                                                                                                        // 1
                                                                                                                       //
module.watch(require("meteor/underscore"), {                                                                           // 1
    _: function (v) {                                                                                                  // 1
        _ = v;                                                                                                         // 1
    }                                                                                                                  // 1
}, 0);                                                                                                                 // 1
var check = void 0;                                                                                                    // 1
module.watch(require("meteor/check"), {                                                                                // 1
    check: function (v) {                                                                                              // 1
        check = v;                                                                                                     // 1
    }                                                                                                                  // 1
}, 1);                                                                                                                 // 1
var Meteor = void 0;                                                                                                   // 1
module.watch(require("meteor/meteor"), {                                                                               // 1
    Meteor: function (v) {                                                                                             // 1
        Meteor = v;                                                                                                    // 1
    }                                                                                                                  // 1
}, 2);                                                                                                                 // 1
var UploadFS = void 0;                                                                                                 // 1
module.watch(require("./ufs"), {                                                                                       // 1
    UploadFS: function (v) {                                                                                           // 1
        UploadFS = v;                                                                                                  // 1
    }                                                                                                                  // 1
}, 3);                                                                                                                 // 1
var Filter = void 0;                                                                                                   // 1
module.watch(require("./ufs-filter"), {                                                                                // 1
    Filter: function (v) {                                                                                             // 1
        Filter = v;                                                                                                    // 1
    }                                                                                                                  // 1
}, 4);                                                                                                                 // 1
var Tokens = void 0;                                                                                                   // 1
module.watch(require("./ufs-tokens"), {                                                                                // 1
    Tokens: function (v) {                                                                                             // 1
        Tokens = v;                                                                                                    // 1
    }                                                                                                                  // 1
}, 5);                                                                                                                 // 1
                                                                                                                       //
var fs = Npm.require('fs');                                                                                            // 33
                                                                                                                       //
var http = Npm.require('http');                                                                                        // 34
                                                                                                                       //
var https = Npm.require('https');                                                                                      // 35
                                                                                                                       //
var Future = Npm.require('fibers/future');                                                                             // 36
                                                                                                                       //
if (Meteor.isServer) {                                                                                                 // 39
    Meteor.methods({                                                                                                   // 40
        /**                                                                                                            // 42
         * Completes the file transfer                                                                                 //
         * @param fileId                                                                                               //
         * @param storeName                                                                                            //
         * @param token                                                                                                //
         */ufsComplete: function (fileId, storeName, token) {                                                          //
            check(fileId, String);                                                                                     // 49
            check(storeName, String);                                                                                  // 50
            check(token, String); // Get store                                                                         // 51
                                                                                                                       //
            var store = UploadFS.getStore(storeName);                                                                  // 54
                                                                                                                       //
            if (!store) {                                                                                              // 55
                throw new Meteor.Error('invalid-store', "Store not found");                                            // 56
            } // Check token                                                                                           // 57
                                                                                                                       //
                                                                                                                       //
            if (!store.checkToken(token, fileId)) {                                                                    // 59
                throw new Meteor.Error('invalid-token', "Token is not valid");                                         // 60
            }                                                                                                          // 61
                                                                                                                       //
            var fut = new Future();                                                                                    // 63
            var tmpFile = UploadFS.getTempFilePath(fileId);                                                            // 64
                                                                                                                       //
            var removeTempFile = function () {                                                                         // 66
                fs.unlink(tmpFile, function (err) {                                                                    // 67
                    err && console.error("ufs: cannot delete temp file \"" + tmpFile + "\" (" + err.message + ")");    // 68
                });                                                                                                    // 69
            };                                                                                                         // 70
                                                                                                                       //
            try {                                                                                                      // 72
                // todo check if temp file exists                                                                      // 73
                // Get file                                                                                            // 75
                var file = store.getCollection().findOne({                                                             // 76
                    _id: fileId                                                                                        // 76
                }); // Validate file before moving to the store                                                        // 76
                                                                                                                       //
                store.validate(file); // Get the temp file                                                             // 79
                                                                                                                       //
                var rs = fs.createReadStream(tmpFile, {                                                                // 82
                    flags: 'r',                                                                                        // 83
                    encoding: null,                                                                                    // 84
                    autoClose: true                                                                                    // 85
                }); // Clean upload if error occurs                                                                    // 82
                                                                                                                       //
                rs.on('error', Meteor.bindEnvironment(function (err) {                                                 // 89
                    console.error(err);                                                                                // 90
                    store.getCollection().remove({                                                                     // 91
                        _id: fileId                                                                                    // 91
                    });                                                                                                // 91
                    fut.throw(err);                                                                                    // 92
                })); // Save file in the store                                                                         // 93
                                                                                                                       //
                store.write(rs, fileId, Meteor.bindEnvironment(function (err, file) {                                  // 96
                    removeTempFile();                                                                                  // 97
                                                                                                                       //
                    if (err) {                                                                                         // 99
                        fut.throw(err);                                                                                // 100
                    } else {                                                                                           // 101
                        // File has been fully uploaded                                                                // 102
                        // so we don't need to keep the token anymore.                                                 // 103
                        // Also this ensure that the file cannot be modified with extra chunks later.                  // 104
                        Tokens.remove({                                                                                // 105
                            fileId: fileId                                                                             // 105
                        });                                                                                            // 105
                        fut.return(file);                                                                              // 106
                    }                                                                                                  // 107
                }));                                                                                                   // 108
            } catch (err) {                                                                                            // 109
                // If write failed, remove the file                                                                    // 111
                store.getCollection().remove({                                                                         // 112
                    _id: fileId                                                                                        // 112
                }); // removeTempFile();                                                                               // 112
                                                                                                                       //
                fut.throw(err);                                                                                        // 114
            }                                                                                                          // 115
                                                                                                                       //
            return fut.wait();                                                                                         // 116
        },                                                                                                             // 117
        /**                                                                                                            // 119
         * Creates the file and returns the file upload token                                                          //
         * @param file                                                                                                 //
         * @return {{fileId: string, token: *, url: *}}                                                                //
         */ufsCreate: function (file) {                                                                                //
            check(file, Object);                                                                                       // 125
                                                                                                                       //
            if (typeof file.name !== 'string' || !file.name.length) {                                                  // 127
                throw new Meteor.Error('invalid-file-name', "file name is not valid");                                 // 128
            }                                                                                                          // 129
                                                                                                                       //
            if (typeof file.store !== 'string' || !file.store.length) {                                                // 130
                throw new Meteor.Error('invalid-store', "store is not valid");                                         // 131
            } // Get store                                                                                             // 132
                                                                                                                       //
                                                                                                                       //
            var store = UploadFS.getStore(file.store);                                                                 // 134
                                                                                                                       //
            if (!store) {                                                                                              // 135
                throw new Meteor.Error('invalid-store', "Store not found");                                            // 136
            } // Set default info                                                                                      // 137
                                                                                                                       //
                                                                                                                       //
            file.complete = false;                                                                                     // 140
            file.uploading = false;                                                                                    // 141
            file.extension = file.name && file.name.substr((~-file.name.lastIndexOf('.') >>> 0) + 2).toLowerCase(); // Assign file MIME type based on the extension
                                                                                                                       //
            if (file.extension && !file.type) {                                                                        // 144
                file.type = UploadFS.getMimeType(file.extension) || 'application/octet-stream';                        // 145
            }                                                                                                          // 146
                                                                                                                       //
            file.progress = 0;                                                                                         // 147
            file.size = parseInt(file.size) || 0;                                                                      // 148
            file.userId = file.userId || this.userId; // Check if the file matches store filter                        // 149
                                                                                                                       //
            var filter = store.getFilter();                                                                            // 152
                                                                                                                       //
            if (filter instanceof Filter) {                                                                            // 153
                filter.check(file);                                                                                    // 154
            } // Create the file                                                                                       // 155
                                                                                                                       //
                                                                                                                       //
            var fileId = store.create(file);                                                                           // 158
            var token = store.createToken(fileId);                                                                     // 159
            var uploadUrl = store.getURL(fileId + "?token=" + token);                                                  // 160
            return {                                                                                                   // 162
                fileId: fileId,                                                                                        // 163
                token: token,                                                                                          // 164
                url: uploadUrl                                                                                         // 165
            };                                                                                                         // 162
        },                                                                                                             // 167
        /**                                                                                                            // 169
         * Deletes a file                                                                                              //
         * @param fileId                                                                                               //
         * @param storeName                                                                                            //
         * @param token                                                                                                //
         * @returns {*}                                                                                                //
         */ufsDelete: function (fileId, storeName, token) {                                                            //
            check(fileId, String);                                                                                     // 177
            check(storeName, String);                                                                                  // 178
            check(token, String); // Check store                                                                       // 179
                                                                                                                       //
            var store = UploadFS.getStore(storeName);                                                                  // 182
                                                                                                                       //
            if (!store) {                                                                                              // 183
                throw new Meteor.Error('invalid-store', "Store not found");                                            // 184
            } // Ignore files that does not exist                                                                      // 185
                                                                                                                       //
                                                                                                                       //
            if (store.getCollection().find({                                                                           // 187
                _id: fileId                                                                                            // 187
            }).count() === 0) {                                                                                        // 187
                return 1;                                                                                              // 188
            } // Check token                                                                                           // 189
                                                                                                                       //
                                                                                                                       //
            if (!store.checkToken(token, fileId)) {                                                                    // 191
                throw new Meteor.Error('invalid-token', "Token is not valid");                                         // 192
            }                                                                                                          // 193
                                                                                                                       //
            return store.getCollection().remove({                                                                      // 194
                _id: fileId                                                                                            // 194
            });                                                                                                        // 194
        },                                                                                                             // 195
        /**                                                                                                            // 197
         * Imports a file from the URL                                                                                 //
         * @param url                                                                                                  //
         * @param file                                                                                                 //
         * @param storeName                                                                                            //
         * @return {*}                                                                                                 //
         */ufsImportURL: function (url, file, storeName) {                                                             //
            check(url, String);                                                                                        // 205
            check(file, Object);                                                                                       // 206
            check(storeName, String); // Check URL                                                                     // 207
                                                                                                                       //
            if (typeof url !== 'string' || url.length <= 0) {                                                          // 210
                throw new Meteor.Error('invalid-url', "The url is not valid");                                         // 211
            } // Check file                                                                                            // 212
                                                                                                                       //
                                                                                                                       //
            if ((typeof file === "undefined" ? "undefined" : (0, _typeof3.default)(file)) !== 'object' || file === null) {
                throw new Meteor.Error('invalid-file', "The file is not valid");                                       // 215
            } // Check store                                                                                           // 216
                                                                                                                       //
                                                                                                                       //
            var store = UploadFS.getStore(storeName);                                                                  // 218
                                                                                                                       //
            if (!store) {                                                                                              // 219
                throw new Meteor.Error('invalid-store', 'The store does not exist');                                   // 220
            } // Extract file info                                                                                     // 221
                                                                                                                       //
                                                                                                                       //
            if (!file.name) {                                                                                          // 224
                file.name = url.replace(/\?.*$/, '').split('/').pop();                                                 // 225
            }                                                                                                          // 226
                                                                                                                       //
            if (file.name && !file.extension) {                                                                        // 227
                file.extension = file.name && file.name.substr((~-file.name.lastIndexOf('.') >>> 0) + 2).toLowerCase();
            }                                                                                                          // 229
                                                                                                                       //
            if (file.extension && !file.type) {                                                                        // 230
                // Assign file MIME type based on the extension                                                        // 231
                file.type = UploadFS.getMimeType(file.extension) || 'application/octet-stream';                        // 232
            } // Check if file is valid                                                                                // 233
                                                                                                                       //
                                                                                                                       //
            if (store.getFilter() instanceof Filter) {                                                                 // 235
                store.getFilter().check(file);                                                                         // 236
            }                                                                                                          // 237
                                                                                                                       //
            if (file.originalUrl) {                                                                                    // 239
                console.warn("ufs: The \"originalUrl\" attribute is automatically set when importing a file from a URL");
            } // Add original URL                                                                                      // 241
                                                                                                                       //
                                                                                                                       //
            file.originalUrl = url; // Create the file                                                                 // 244
                                                                                                                       //
            file.complete = false;                                                                                     // 247
            file.uploading = true;                                                                                     // 248
            file.progress = 0;                                                                                         // 249
            file._id = store.create(file);                                                                             // 250
            var fut = new Future();                                                                                    // 252
            var proto = void 0; // Detect protocol to use                                                              // 253
                                                                                                                       //
            if (/http:\/\//i.test(url)) {                                                                              // 256
                proto = http;                                                                                          // 257
            } else if (/https:\/\//i.test(url)) {                                                                      // 258
                proto = https;                                                                                         // 259
            }                                                                                                          // 260
                                                                                                                       //
            this.unblock(); // Download file                                                                           // 262
                                                                                                                       //
            proto.get(url, Meteor.bindEnvironment(function (res) {                                                     // 265
                // Save the file in the store                                                                          // 266
                store.write(res, file._id, function (err, file) {                                                      // 267
                    if (err) {                                                                                         // 268
                        fut.throw(err);                                                                                // 269
                    } else {                                                                                           // 270
                        fut.return(file);                                                                              // 271
                    }                                                                                                  // 272
                });                                                                                                    // 273
            })).on('error', function (err) {                                                                           // 274
                fut.throw(err);                                                                                        // 275
            });                                                                                                        // 276
            return fut.wait();                                                                                         // 277
        },                                                                                                             // 278
        /**                                                                                                            // 280
         * Marks the file uploading as stopped                                                                         //
         * @param fileId                                                                                               //
         * @param storeName                                                                                            //
         * @param token                                                                                                //
         * @returns {*}                                                                                                //
         */ufsStop: function (fileId, storeName, token) {                                                              //
            check(fileId, String);                                                                                     // 288
            check(storeName, String);                                                                                  // 289
            check(token, String); // Check store                                                                       // 290
                                                                                                                       //
            var store = UploadFS.getStore(storeName);                                                                  // 293
                                                                                                                       //
            if (!store) {                                                                                              // 294
                throw new Meteor.Error('invalid-store', "Store not found");                                            // 295
            } // Check file                                                                                            // 296
                                                                                                                       //
                                                                                                                       //
            var file = store.getCollection().find({                                                                    // 298
                _id: fileId                                                                                            // 298
            }, {                                                                                                       // 298
                fields: {                                                                                              // 298
                    userId: 1                                                                                          // 298
                }                                                                                                      // 298
            });                                                                                                        // 298
                                                                                                                       //
            if (!file) {                                                                                               // 299
                throw new Meteor.Error('invalid-file', "File not found");                                              // 300
            } // Check token                                                                                           // 301
                                                                                                                       //
                                                                                                                       //
            if (!store.checkToken(token, fileId)) {                                                                    // 303
                throw new Meteor.Error('invalid-token', "Token is not valid");                                         // 304
            }                                                                                                          // 305
                                                                                                                       //
            return store.getCollection().update({                                                                      // 307
                _id: fileId                                                                                            // 307
            }, {                                                                                                       // 307
                $set: {                                                                                                // 308
                    uploading: false                                                                                   // 308
                }                                                                                                      // 308
            });                                                                                                        // 307
        }                                                                                                              // 310
    });                                                                                                                // 40
}                                                                                                                      // 312
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ufs-mime.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jalik_ufs/ufs-mime.js                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({                                                                                                        // 1
    MIME: function () {                                                                                                // 1
        return MIME;                                                                                                   // 1
    }                                                                                                                  // 1
});                                                                                                                    // 1
var MIME = {                                                                                                           // 29
    // application                                                                                                     // 31
    '7z': 'application/x-7z-compressed',                                                                               // 32
    'arc': 'application/octet-stream',                                                                                 // 33
    'ai': 'application/postscript',                                                                                    // 34
    'bin': 'application/octet-stream',                                                                                 // 35
    'bz': 'application/x-bzip',                                                                                        // 36
    'bz2': 'application/x-bzip2',                                                                                      // 37
    'eps': 'application/postscript',                                                                                   // 38
    'exe': 'application/octet-stream',                                                                                 // 39
    'gz': 'application/x-gzip',                                                                                        // 40
    'gzip': 'application/x-gzip',                                                                                      // 41
    'js': 'application/javascript',                                                                                    // 42
    'json': 'application/json',                                                                                        // 43
    'ogx': 'application/ogg',                                                                                          // 44
    'pdf': 'application/pdf',                                                                                          // 45
    'ps': 'application/postscript',                                                                                    // 46
    'psd': 'application/octet-stream',                                                                                 // 47
    'rar': 'application/x-rar-compressed',                                                                             // 48
    'rev': 'application/x-rar-compressed',                                                                             // 49
    'swf': 'application/x-shockwave-flash',                                                                            // 50
    'tar': 'application/x-tar',                                                                                        // 51
    'xhtml': 'application/xhtml+xml',                                                                                  // 52
    'xml': 'application/xml',                                                                                          // 53
    'zip': 'application/zip',                                                                                          // 54
    // audio                                                                                                           // 56
    'aif': 'audio/aiff',                                                                                               // 57
    'aifc': 'audio/aiff',                                                                                              // 58
    'aiff': 'audio/aiff',                                                                                              // 59
    'au': 'audio/basic',                                                                                               // 60
    'flac': 'audio/flac',                                                                                              // 61
    'midi': 'audio/midi',                                                                                              // 62
    'mp2': 'audio/mpeg',                                                                                               // 63
    'mp3': 'audio/mpeg',                                                                                               // 64
    'mpa': 'audio/mpeg',                                                                                               // 65
    'oga': 'audio/ogg',                                                                                                // 66
    'ogg': 'audio/ogg',                                                                                                // 67
    'opus': 'audio/ogg',                                                                                               // 68
    'ra': 'audio/vnd.rn-realaudio',                                                                                    // 69
    'spx': 'audio/ogg',                                                                                                // 70
    'wav': 'audio/x-wav',                                                                                              // 71
    'weba': 'audio/webm',                                                                                              // 72
    'wma': 'audio/x-ms-wma',                                                                                           // 73
    // image                                                                                                           // 75
    'avs': 'image/avs-video',                                                                                          // 76
    'bmp': 'image/x-windows-bmp',                                                                                      // 77
    'gif': 'image/gif',                                                                                                // 78
    'ico': 'image/vnd.microsoft.icon',                                                                                 // 79
    'jpeg': 'image/jpeg',                                                                                              // 80
    'jpg': 'image/jpg',                                                                                                // 81
    'mjpg': 'image/x-motion-jpeg',                                                                                     // 82
    'pic': 'image/pic',                                                                                                // 83
    'png': 'image/png',                                                                                                // 84
    'svg': 'image/svg+xml',                                                                                            // 85
    'tif': 'image/tiff',                                                                                               // 86
    'tiff': 'image/tiff',                                                                                              // 87
    // text                                                                                                            // 89
    'css': 'text/css',                                                                                                 // 90
    'csv': 'text/csv',                                                                                                 // 91
    'html': 'text/html',                                                                                               // 92
    'txt': 'text/plain',                                                                                               // 93
    // video                                                                                                           // 95
    'avi': 'video/avi',                                                                                                // 96
    'dv': 'video/x-dv',                                                                                                // 97
    'flv': 'video/x-flv',                                                                                              // 98
    'mov': 'video/quicktime',                                                                                          // 99
    'mp4': 'video/mp4',                                                                                                // 100
    'mpeg': 'video/mpeg',                                                                                              // 101
    'mpg': 'video/mpg',                                                                                                // 102
    'ogv': 'video/ogg',                                                                                                // 103
    'vdo': 'video/vdo',                                                                                                // 104
    'webm': 'video/webm',                                                                                              // 105
    'wmv': 'video/x-ms-wmv',                                                                                           // 106
    // specific to vendors                                                                                             // 108
    'doc': 'application/msword',                                                                                       // 109
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',                                 // 110
    'odb': 'application/vnd.oasis.opendocument.database',                                                              // 111
    'odc': 'application/vnd.oasis.opendocument.chart',                                                                 // 112
    'odf': 'application/vnd.oasis.opendocument.formula',                                                               // 113
    'odg': 'application/vnd.oasis.opendocument.graphics',                                                              // 114
    'odi': 'application/vnd.oasis.opendocument.image',                                                                 // 115
    'odm': 'application/vnd.oasis.opendocument.text-master',                                                           // 116
    'odp': 'application/vnd.oasis.opendocument.presentation',                                                          // 117
    'ods': 'application/vnd.oasis.opendocument.spreadsheet',                                                           // 118
    'odt': 'application/vnd.oasis.opendocument.text',                                                                  // 119
    'otg': 'application/vnd.oasis.opendocument.graphics-template',                                                     // 120
    'otp': 'application/vnd.oasis.opendocument.presentation-template',                                                 // 121
    'ots': 'application/vnd.oasis.opendocument.spreadsheet-template',                                                  // 122
    'ott': 'application/vnd.oasis.opendocument.text-template',                                                         // 123
    'ppt': 'application/vnd.ms-powerpoint',                                                                            // 124
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',                               // 125
    'xls': 'application/vnd.ms-excel',                                                                                 // 126
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'                                        // 127
};                                                                                                                     // 29
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ufs-server.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jalik_ufs/ufs-server.js                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _typeof2 = require("babel-runtime/helpers/typeof");                                                                //
                                                                                                                       //
var _typeof3 = _interopRequireDefault(_typeof2);                                                                       //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
var _ = void 0;                                                                                                        // 1
                                                                                                                       //
module.watch(require("meteor/underscore"), {                                                                           // 1
    _: function (v) {                                                                                                  // 1
        _ = v;                                                                                                         // 1
    }                                                                                                                  // 1
}, 0);                                                                                                                 // 1
var Meteor = void 0;                                                                                                   // 1
module.watch(require("meteor/meteor"), {                                                                               // 1
    Meteor: function (v) {                                                                                             // 1
        Meteor = v;                                                                                                    // 1
    }                                                                                                                  // 1
}, 1);                                                                                                                 // 1
var WebApp = void 0;                                                                                                   // 1
module.watch(require("meteor/webapp"), {                                                                               // 1
    WebApp: function (v) {                                                                                             // 1
        WebApp = v;                                                                                                    // 1
    }                                                                                                                  // 1
}, 2);                                                                                                                 // 1
var UploadFS = void 0;                                                                                                 // 1
module.watch(require("./ufs"), {                                                                                       // 1
    UploadFS: function (v) {                                                                                           // 1
        UploadFS = v;                                                                                                  // 1
    }                                                                                                                  // 1
}, 3);                                                                                                                 // 1
                                                                                                                       //
if (Meteor.isServer) {                                                                                                 // 31
    var domain = Npm.require('domain');                                                                                // 33
                                                                                                                       //
    var fs = Npm.require('fs');                                                                                        // 34
                                                                                                                       //
    var http = Npm.require('http');                                                                                    // 35
                                                                                                                       //
    var https = Npm.require('https');                                                                                  // 36
                                                                                                                       //
    var mkdirp = Npm.require('mkdirp');                                                                                // 37
                                                                                                                       //
    var stream = Npm.require('stream');                                                                                // 38
                                                                                                                       //
    var URL = Npm.require('url');                                                                                      // 39
                                                                                                                       //
    var zlib = Npm.require('zlib');                                                                                    // 40
                                                                                                                       //
    Meteor.startup(function () {                                                                                       // 43
        var path = UploadFS.config.tmpDir;                                                                             // 44
        var mode = UploadFS.config.tmpDirPermissions;                                                                  // 45
        fs.stat(path, function (err) {                                                                                 // 47
            if (err) {                                                                                                 // 48
                // Create the temp directory                                                                           // 49
                mkdirp(path, {                                                                                         // 50
                    mode: mode                                                                                         // 50
                }, function (err) {                                                                                    // 50
                    if (err) {                                                                                         // 51
                        console.error("ufs: cannot create temp directory at \"" + path + "\" (" + err.message + ")");  // 52
                    } else {                                                                                           // 53
                        console.log("ufs: temp directory created at \"" + path + "\"");                                // 54
                    }                                                                                                  // 55
                });                                                                                                    // 56
            } else {                                                                                                   // 57
                // Set directory permissions                                                                           // 58
                fs.chmod(path, mode, function (err) {                                                                  // 59
                    err && console.error("ufs: cannot set temp directory permissions " + mode + " (" + err.message + ")");
                });                                                                                                    // 61
            }                                                                                                          // 62
        });                                                                                                            // 63
    }); // Create domain to handle errors                                                                              // 64
    // and possibly avoid server crashes.                                                                              // 67
                                                                                                                       //
    var d = domain.create();                                                                                           // 68
    d.on('error', function (err) {                                                                                     // 70
        console.error('ufs: ' + err.message);                                                                          // 71
    }); // Listen HTTP requests to serve files                                                                         // 72
                                                                                                                       //
    WebApp.connectHandlers.use(function (req, res, next) {                                                             // 75
        // Quick check to see if request should be catch                                                               // 76
        if (req.url.indexOf(UploadFS.config.storesPath) === -1) {                                                      // 77
            next();                                                                                                    // 78
            return;                                                                                                    // 79
        } // Remove store path                                                                                         // 80
                                                                                                                       //
                                                                                                                       //
        var parsedUrl = URL.parse(req.url);                                                                            // 83
        var path = parsedUrl.pathname.substr(UploadFS.config.storesPath.length + 1);                                   // 84
                                                                                                                       //
        var allowCORS = function () {                                                                                  // 86
            // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);                                       // 87
            res.setHeader("Access-Control-Allow-Methods", "POST");                                                     // 88
            res.setHeader("Access-Control-Allow-Origin", "*");                                                         // 89
            res.setHeader("Access-Control-Allow-Headers", "Content-Type");                                             // 90
        };                                                                                                             // 91
                                                                                                                       //
        if (req.method === "OPTIONS") {                                                                                // 93
            var regExp = new RegExp('^\/([^\/\?]+)\/([^\/\?]+)$');                                                     // 94
            var match = regExp.exec(path); // Request is not valid                                                     // 95
                                                                                                                       //
            if (match === null) {                                                                                      // 98
                res.writeHead(400);                                                                                    // 99
                res.end();                                                                                             // 100
                return;                                                                                                // 101
            } // Get store                                                                                             // 102
                                                                                                                       //
                                                                                                                       //
            var store = UploadFS.getStore(match[1]);                                                                   // 105
                                                                                                                       //
            if (!store) {                                                                                              // 106
                res.writeHead(404);                                                                                    // 107
                res.end();                                                                                             // 108
                return;                                                                                                // 109
            } // If a store is found, go ahead and allow the origin                                                    // 110
                                                                                                                       //
                                                                                                                       //
            allowCORS();                                                                                               // 113
            next();                                                                                                    // 115
        } else if (req.method === 'POST') {                                                                            // 116
            // Get store                                                                                               // 118
            var _regExp = new RegExp('^\/([^\/\?]+)\/([^\/\?]+)$');                                                    // 119
                                                                                                                       //
            var _match = _regExp.exec(path); // Request is not valid                                                   // 120
                                                                                                                       //
                                                                                                                       //
            if (_match === null) {                                                                                     // 123
                res.writeHead(400);                                                                                    // 124
                res.end();                                                                                             // 125
                return;                                                                                                // 126
            } // Get store                                                                                             // 127
                                                                                                                       //
                                                                                                                       //
            var _store = UploadFS.getStore(_match[1]);                                                                 // 130
                                                                                                                       //
            if (!_store) {                                                                                             // 131
                res.writeHead(404);                                                                                    // 132
                res.end();                                                                                             // 133
                return;                                                                                                // 134
            } // If a store is found, go ahead and allow the origin                                                    // 135
                                                                                                                       //
                                                                                                                       //
            allowCORS(); // Get file                                                                                   // 138
                                                                                                                       //
            var fileId = _match[2];                                                                                    // 141
                                                                                                                       //
            if (_store.getCollection().find({                                                                          // 142
                _id: fileId                                                                                            // 142
            }).count() === 0) {                                                                                        // 142
                res.writeHead(404);                                                                                    // 143
                res.end();                                                                                             // 144
                return;                                                                                                // 145
            } // Check upload token                                                                                    // 146
                                                                                                                       //
                                                                                                                       //
            if (!_store.checkToken(req.query.token, fileId)) {                                                         // 149
                res.writeHead(403);                                                                                    // 150
                res.end();                                                                                             // 151
                return;                                                                                                // 152
            }                                                                                                          // 153
                                                                                                                       //
            var tmpFile = UploadFS.getTempFilePath(fileId);                                                            // 155
            var ws = fs.createWriteStream(tmpFile, {                                                                   // 156
                flags: 'a'                                                                                             // 156
            });                                                                                                        // 156
            var fields = {                                                                                             // 157
                uploading: true                                                                                        // 157
            };                                                                                                         // 157
            var progress = parseFloat(req.query.progress);                                                             // 158
                                                                                                                       //
            if (!isNaN(progress) && progress > 0) {                                                                    // 159
                fields.progress = Math.min(progress, 1);                                                               // 160
            }                                                                                                          // 161
                                                                                                                       //
            req.on('data', function (chunk) {                                                                          // 163
                ws.write(chunk);                                                                                       // 164
            });                                                                                                        // 165
            req.on('error', function (err) {                                                                           // 166
                res.writeHead(500);                                                                                    // 167
                res.end();                                                                                             // 168
            });                                                                                                        // 169
            req.on('end', Meteor.bindEnvironment(function () {                                                         // 170
                // Update completed state without triggering hooks                                                     // 171
                _store.getCollection().direct.update({                                                                 // 172
                    _id: fileId                                                                                        // 172
                }, {                                                                                                   // 172
                    $set: fields                                                                                       // 172
                });                                                                                                    // 172
                                                                                                                       //
                ws.end();                                                                                              // 173
            }));                                                                                                       // 174
            ws.on('error', function (err) {                                                                            // 175
                console.error("ufs: cannot write chunk of file \"" + fileId + "\" (" + err.message + ")");             // 176
                fs.unlink(tmpFile, function (err) {                                                                    // 177
                    err && console.error("ufs: cannot delete temp file \"" + tmpFile + "\" (" + err.message + ")");    // 178
                });                                                                                                    // 179
                res.writeHead(500);                                                                                    // 180
                res.end();                                                                                             // 181
            });                                                                                                        // 182
            ws.on('finish', function () {                                                                              // 183
                res.writeHead(204, {                                                                                   // 184
                    "Content-Type": 'text/plain'                                                                       // 184
                });                                                                                                    // 184
                res.end();                                                                                             // 185
            });                                                                                                        // 186
        } else if (req.method == 'GET') {                                                                              // 187
            // Get store, file Id and file name                                                                        // 189
            var _regExp2 = new RegExp('^\/([^\/\?]+)\/([^\/\?]+)(?:\/([^\/\?]+))?$');                                  // 190
                                                                                                                       //
            var _match2 = _regExp2.exec(path); // Avoid 504 Gateway timeout error                                      // 191
            // if file is not handled by UploadFS.                                                                     // 194
                                                                                                                       //
                                                                                                                       //
            if (_match2 === null) {                                                                                    // 195
                next();                                                                                                // 196
                return;                                                                                                // 197
            } // Get store                                                                                             // 198
                                                                                                                       //
                                                                                                                       //
            var storeName = _match2[1];                                                                                // 201
                                                                                                                       //
            var _store2 = UploadFS.getStore(storeName);                                                                // 202
                                                                                                                       //
            if (!_store2) {                                                                                            // 204
                res.writeHead(404);                                                                                    // 205
                res.end();                                                                                             // 206
                return;                                                                                                // 207
            }                                                                                                          // 208
                                                                                                                       //
            if (_store2.onRead !== null && _store2.onRead !== undefined && typeof _store2.onRead !== 'function') {     // 210
                console.error("ufs: Store.onRead is not a function in store \"" + storeName + "\"");                   // 211
                res.writeHead(500);                                                                                    // 212
                res.end();                                                                                             // 213
                return;                                                                                                // 214
            } // Remove file extension from file Id                                                                    // 215
                                                                                                                       //
                                                                                                                       //
            var index = _match2[2].indexOf('.');                                                                       // 218
                                                                                                                       //
            var _fileId = index !== -1 ? _match2[2].substr(0, index) : _match2[2]; // Get file from database           // 219
                                                                                                                       //
                                                                                                                       //
            var file = _store2.getCollection().findOne({                                                               // 222
                _id: _fileId                                                                                           // 222
            });                                                                                                        // 222
                                                                                                                       //
            if (!file) {                                                                                               // 223
                res.writeHead(404);                                                                                    // 224
                res.end();                                                                                             // 225
                return;                                                                                                // 226
            } // Simulate read speed                                                                                   // 227
                                                                                                                       //
                                                                                                                       //
            if (UploadFS.config.simulateReadDelay) {                                                                   // 230
                Meteor._sleepForMs(UploadFS.config.simulateReadDelay);                                                 // 231
            }                                                                                                          // 232
                                                                                                                       //
            d.run(function () {                                                                                        // 234
                // Check if the file can be accessed                                                                   // 235
                if (_store2.onRead.call(_store2, _fileId, file, req, res) !== false) {                                 // 236
                    var options = {};                                                                                  // 237
                    var status = 200; // Prepare response headers                                                      // 238
                                                                                                                       //
                    var headers = {                                                                                    // 241
                        'Content-Type': file.type,                                                                     // 242
                        'Content-Length': file.size                                                                    // 243
                    }; // Add ETag header                                                                              // 241
                                                                                                                       //
                    if (typeof file.etag === 'string') {                                                               // 247
                        headers['ETag'] = file.etag;                                                                   // 248
                    } // Add Last-Modified header                                                                      // 249
                                                                                                                       //
                                                                                                                       //
                    if (file.modifiedAt instanceof Date) {                                                             // 252
                        headers['Last-Modified'] = file.modifiedAt.toUTCString();                                      // 253
                    } else if (file.uploadedAt instanceof Date) {                                                      // 254
                        headers['Last-Modified'] = file.uploadedAt.toUTCString();                                      // 256
                    } // Parse request headers                                                                         // 257
                                                                                                                       //
                                                                                                                       //
                    if ((0, _typeof3.default)(req.headers) === 'object') {                                             // 260
                        // Compare ETag                                                                                // 262
                        if (req.headers['if-none-match']) {                                                            // 263
                            if (file.etag === req.headers['if-none-match']) {                                          // 264
                                res.writeHead(304); // Not Modified                                                    // 265
                                                                                                                       //
                                res.end();                                                                             // 266
                                return;                                                                                // 267
                            }                                                                                          // 268
                        } // Compare file modification date                                                            // 269
                                                                                                                       //
                                                                                                                       //
                        if (req.headers['if-modified-since']) {                                                        // 272
                            var modifiedSince = new Date(req.headers['if-modified-since']);                            // 273
                                                                                                                       //
                            if (file.modifiedAt instanceof Date && file.modifiedAt > modifiedSince || file.uploadedAt instanceof Date && file.uploadedAt > modifiedSince) {
                                res.writeHead(304); // Not Modified                                                    // 277
                                                                                                                       //
                                res.end();                                                                             // 278
                                return;                                                                                // 279
                            }                                                                                          // 280
                        } // Send data in range                                                                        // 281
                                                                                                                       //
                                                                                                                       //
                        if (typeof req.headers.range === 'string') {                                                   // 284
                            var range = req.headers.range; // Range is not valid                                       // 285
                                                                                                                       //
                            if (!range) {                                                                              // 288
                                res.writeHead(416);                                                                    // 289
                                res.end();                                                                             // 290
                                return;                                                                                // 291
                            }                                                                                          // 292
                                                                                                                       //
                            var positions = range.replace(/bytes=/, '').split('-');                                    // 294
                            var start = parseInt(positions[0], 10);                                                    // 295
                            var total = file.size;                                                                     // 296
                            var end = positions[1] ? parseInt(positions[1], 10) : total - 1; // Update headers         // 297
                                                                                                                       //
                            headers['Content-Range'] = "bytes " + start + "-" + end + "/" + total;                     // 300
                            headers['Accept-Ranges'] = "bytes";                                                        // 301
                            headers['Content-Length'] = end - start + 1;                                               // 302
                            status = 206; // partial content                                                           // 304
                                                                                                                       //
                            options.start = start;                                                                     // 305
                            options.end = end;                                                                         // 306
                        }                                                                                              // 307
                    } // Open the file stream                                                                          // 308
                                                                                                                       //
                                                                                                                       //
                    var rs = _store2.getReadStream(_fileId, file, options);                                            // 311
                                                                                                                       //
                    var _ws = new stream.PassThrough();                                                                // 312
                                                                                                                       //
                    rs.on('error', Meteor.bindEnvironment(function (err) {                                             // 314
                        _store2.onReadError.call(_store2, err, _fileId, file);                                         // 315
                                                                                                                       //
                        res.end();                                                                                     // 316
                    }));                                                                                               // 317
                                                                                                                       //
                    _ws.on('error', Meteor.bindEnvironment(function (err) {                                            // 318
                        _store2.onReadError.call(_store2, err, _fileId, file);                                         // 319
                                                                                                                       //
                        res.end();                                                                                     // 320
                    }));                                                                                               // 321
                                                                                                                       //
                    _ws.on('close', function () {                                                                      // 322
                        // Close output stream at the end                                                              // 323
                        _ws.emit('end');                                                                               // 324
                    }); // Transform stream                                                                            // 325
                                                                                                                       //
                                                                                                                       //
                    _store2.transformRead(rs, _ws, _fileId, file, req, headers); // Parse request headers              // 328
                                                                                                                       //
                                                                                                                       //
                    if ((0, _typeof3.default)(req.headers) === 'object') {                                             // 331
                        // Compress data using if needed (ignore audio/video as they are already compressed)           // 332
                        if (typeof req.headers['accept-encoding'] === 'string' && !/^(audio|video)/.test(file.type)) {
                            var accept = req.headers['accept-encoding']; // Compress with gzip                         // 334
                                                                                                                       //
                            if (accept.match(/\bgzip\b/)) {                                                            // 337
                                headers['Content-Encoding'] = 'gzip';                                                  // 338
                                delete headers['Content-Length'];                                                      // 339
                                res.writeHead(status, headers);                                                        // 340
                                                                                                                       //
                                _ws.pipe(zlib.createGzip()).pipe(res);                                                 // 341
                                                                                                                       //
                                return;                                                                                // 342
                            } // Compress with deflate                                                                 // 343
                            else if (accept.match(/\bdeflate\b/)) {                                                    // 337
                                    headers['Content-Encoding'] = 'deflate';                                           // 346
                                    delete headers['Content-Length'];                                                  // 347
                                    res.writeHead(status, headers);                                                    // 348
                                                                                                                       //
                                    _ws.pipe(zlib.createDeflate()).pipe(res);                                          // 349
                                                                                                                       //
                                    return;                                                                            // 350
                                }                                                                                      // 351
                        }                                                                                              // 352
                    } // Send raw data                                                                                 // 353
                                                                                                                       //
                                                                                                                       //
                    if (!headers['Content-Encoding']) {                                                                // 356
                        res.writeHead(status, headers);                                                                // 357
                                                                                                                       //
                        _ws.pipe(res);                                                                                 // 358
                    }                                                                                                  // 359
                } else {                                                                                               // 361
                    res.end();                                                                                         // 362
                }                                                                                                      // 363
            });                                                                                                        // 364
        } else {                                                                                                       // 365
            next();                                                                                                    // 366
        }                                                                                                              // 367
    });                                                                                                                // 368
}                                                                                                                      // 369
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ufs-store-permissions.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jalik_ufs/ufs-store-permissions.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
module.export({                                                                                                        // 1
    StorePermissions: function () {                                                                                    // 1
        return StorePermissions;                                                                                       // 1
    }                                                                                                                  // 1
});                                                                                                                    // 1
                                                                                                                       //
var _ = void 0;                                                                                                        // 1
                                                                                                                       //
module.watch(require("meteor/underscore"), {                                                                           // 1
    _: function (v) {                                                                                                  // 1
        _ = v;                                                                                                         // 1
    }                                                                                                                  // 1
}, 0);                                                                                                                 // 1
                                                                                                                       //
var StorePermissions = function () {                                                                                   //
    function StorePermissions(options) {                                                                               // 33
        (0, _classCallCheck3.default)(this, StorePermissions);                                                         // 33
        // Default options                                                                                             // 34
        options = _.extend({                                                                                           // 35
            insert: null,                                                                                              // 36
            remove: null,                                                                                              // 37
            update: null                                                                                               // 38
        }, options); // Check options                                                                                  // 35
                                                                                                                       //
        if (options.insert && typeof options.insert !== 'function') {                                                  // 42
            throw new TypeError("StorePermissions: insert is not a function");                                         // 43
        }                                                                                                              // 44
                                                                                                                       //
        if (options.remove && typeof options.remove !== 'function') {                                                  // 45
            throw new TypeError("StorePermissions: remove is not a function");                                         // 46
        }                                                                                                              // 47
                                                                                                                       //
        if (options.update && typeof options.update !== 'function') {                                                  // 48
            throw new TypeError("StorePermissions: update is not a function");                                         // 49
        } // Public attributes                                                                                         // 50
                                                                                                                       //
                                                                                                                       //
        this.actions = {                                                                                               // 53
            insert: options.insert,                                                                                    // 54
            remove: options.remove,                                                                                    // 55
            update: options.update                                                                                     // 56
        };                                                                                                             // 53
    } /**                                                                                                              // 58
       * Checks the permission for the action                                                                          //
       * @param action                                                                                                 //
       * @param userId                                                                                                 //
       * @param file                                                                                                   //
       * @param fields                                                                                                 //
       * @param modifiers                                                                                              //
       * @return {*}                                                                                                   //
       */                                                                                                              //
                                                                                                                       //
    StorePermissions.prototype.check = function () {                                                                   //
        function check(action, userId, file, fields, modifiers) {                                                      //
            if (typeof this.actions[action] === 'function') {                                                          // 70
                return this.actions[action](userId, file, fields, modifiers);                                          // 71
            }                                                                                                          // 72
                                                                                                                       //
            return true; // by default allow all                                                                       // 73
        }                                                                                                              // 74
                                                                                                                       //
        return check;                                                                                                  //
    }(); /**                                                                                                           //
          * Checks the insert permission                                                                               //
          * @param userId                                                                                              //
          * @param file                                                                                                //
          * @returns {*}                                                                                               //
          */                                                                                                           //
                                                                                                                       //
    StorePermissions.prototype.checkInsert = function () {                                                             //
        function checkInsert(userId, file) {                                                                           //
            return this.check('insert', userId, file);                                                                 // 83
        }                                                                                                              // 84
                                                                                                                       //
        return checkInsert;                                                                                            //
    }(); /**                                                                                                           //
          * Checks the remove permission                                                                               //
          * @param userId                                                                                              //
          * @param file                                                                                                //
          * @returns {*}                                                                                               //
          */                                                                                                           //
                                                                                                                       //
    StorePermissions.prototype.checkRemove = function () {                                                             //
        function checkRemove(userId, file) {                                                                           //
            return this.check('remove', userId, file);                                                                 // 93
        }                                                                                                              // 94
                                                                                                                       //
        return checkRemove;                                                                                            //
    }(); /**                                                                                                           //
          * Checks the update permission                                                                               //
          * @param userId                                                                                              //
          * @param file                                                                                                //
          * @param fields                                                                                              //
          * @param modifiers                                                                                           //
          * @returns {*}                                                                                               //
          */                                                                                                           //
                                                                                                                       //
    StorePermissions.prototype.checkUpdate = function () {                                                             //
        function checkUpdate(userId, file, fields, modifiers) {                                                        //
            return this.check('update', userId, file, fields, modifiers);                                              // 105
        }                                                                                                              // 106
                                                                                                                       //
        return checkUpdate;                                                                                            //
    }();                                                                                                               //
                                                                                                                       //
    return StorePermissions;                                                                                           //
}();                                                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ufs-store.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jalik_ufs/ufs-store.js                                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
module.export({                                                                                                        // 1
    Store: function () {                                                                                               // 1
        return Store;                                                                                                  // 1
    }                                                                                                                  // 1
});                                                                                                                    // 1
                                                                                                                       //
var _ = void 0;                                                                                                        // 1
                                                                                                                       //
module.watch(require("meteor/underscore"), {                                                                           // 1
    _: function (v) {                                                                                                  // 1
        _ = v;                                                                                                         // 1
    }                                                                                                                  // 1
}, 0);                                                                                                                 // 1
var check = void 0;                                                                                                    // 1
module.watch(require("meteor/check"), {                                                                                // 1
    check: function (v) {                                                                                              // 1
        check = v;                                                                                                     // 1
    }                                                                                                                  // 1
}, 1);                                                                                                                 // 1
var Meteor = void 0;                                                                                                   // 1
module.watch(require("meteor/meteor"), {                                                                               // 1
    Meteor: function (v) {                                                                                             // 1
        Meteor = v;                                                                                                    // 1
    }                                                                                                                  // 1
}, 2);                                                                                                                 // 1
var Mongo = void 0;                                                                                                    // 1
module.watch(require("meteor/mongo"), {                                                                                // 1
    Mongo: function (v) {                                                                                              // 1
        Mongo = v;                                                                                                     // 1
    }                                                                                                                  // 1
}, 3);                                                                                                                 // 1
var UploadFS = void 0;                                                                                                 // 1
module.watch(require("./ufs"), {                                                                                       // 1
    UploadFS: function (v) {                                                                                           // 1
        UploadFS = v;                                                                                                  // 1
    }                                                                                                                  // 1
}, 4);                                                                                                                 // 1
var Filter = void 0;                                                                                                   // 1
module.watch(require("./ufs-filter"), {                                                                                // 1
    Filter: function (v) {                                                                                             // 1
        Filter = v;                                                                                                    // 1
    }                                                                                                                  // 1
}, 5);                                                                                                                 // 1
var StorePermissions = void 0;                                                                                         // 1
module.watch(require("./ufs-store-permissions"), {                                                                     // 1
    StorePermissions: function (v) {                                                                                   // 1
        StorePermissions = v;                                                                                          // 1
    }                                                                                                                  // 1
}, 6);                                                                                                                 // 1
var Tokens = void 0;                                                                                                   // 1
module.watch(require("./ufs-tokens"), {                                                                                // 1
    Tokens: function (v) {                                                                                             // 1
        Tokens = v;                                                                                                    // 1
    }                                                                                                                  // 1
}, 7);                                                                                                                 // 1
                                                                                                                       //
var Store = function () {                                                                                              //
    function Store(options) {                                                                                          // 40
        (0, _classCallCheck3.default)(this, Store);                                                                    // 40
        var self = this; // Default options                                                                            // 41
                                                                                                                       //
        options = _.extend({                                                                                           // 44
            collection: null,                                                                                          // 45
            filter: null,                                                                                              // 46
            name: null,                                                                                                // 47
            onCopyError: this.onCopyError,                                                                             // 48
            onFinishUpload: this.onFinishUpload,                                                                       // 49
            onRead: this.onRead,                                                                                       // 50
            onReadError: this.onReadError,                                                                             // 51
            onValidate: this.onValidate,                                                                               // 52
            onWriteError: this.onWriteError,                                                                           // 53
            permissions: null,                                                                                         // 54
            transformRead: null,                                                                                       // 55
            transformWrite: null                                                                                       // 56
        }, options); // Check options                                                                                  // 44
                                                                                                                       //
        if (!(options.collection instanceof Mongo.Collection)) {                                                       // 60
            throw new TypeError('Store: collection is not a Mongo.Collection');                                        // 61
        }                                                                                                              // 62
                                                                                                                       //
        if (options.filter && !(options.filter instanceof Filter)) {                                                   // 63
            throw new TypeError('Store: filter is not a UploadFS.Filter');                                             // 64
        }                                                                                                              // 65
                                                                                                                       //
        if (typeof options.name !== 'string') {                                                                        // 66
            throw new TypeError('Store: name is not a string');                                                        // 67
        }                                                                                                              // 68
                                                                                                                       //
        if (UploadFS.getStore(options.name)) {                                                                         // 69
            throw new TypeError('Store: name already exists');                                                         // 70
        }                                                                                                              // 71
                                                                                                                       //
        if (options.onCopyError && typeof options.onCopyError !== 'function') {                                        // 72
            throw new TypeError('Store: onCopyError is not a function');                                               // 73
        }                                                                                                              // 74
                                                                                                                       //
        if (options.onFinishUpload && typeof options.onFinishUpload !== 'function') {                                  // 75
            throw new TypeError('Store: onFinishUpload is not a function');                                            // 76
        }                                                                                                              // 77
                                                                                                                       //
        if (options.onRead && typeof options.onRead !== 'function') {                                                  // 78
            throw new TypeError('Store: onRead is not a function');                                                    // 79
        }                                                                                                              // 80
                                                                                                                       //
        if (options.onReadError && typeof options.onReadError !== 'function') {                                        // 81
            throw new TypeError('Store: onReadError is not a function');                                               // 82
        }                                                                                                              // 83
                                                                                                                       //
        if (options.onWriteError && typeof options.onWriteError !== 'function') {                                      // 84
            throw new TypeError('Store: onWriteError is not a function');                                              // 85
        }                                                                                                              // 86
                                                                                                                       //
        if (options.permissions && !(options.permissions instanceof StorePermissions)) {                               // 87
            throw new TypeError('Store: permissions is not a UploadFS.StorePermissions');                              // 88
        }                                                                                                              // 89
                                                                                                                       //
        if (options.transformRead && typeof options.transformRead !== 'function') {                                    // 90
            throw new TypeError('Store: transformRead is not a function');                                             // 91
        }                                                                                                              // 92
                                                                                                                       //
        if (options.transformWrite && typeof options.transformWrite !== 'function') {                                  // 93
            throw new TypeError('Store: transformWrite is not a function');                                            // 94
        }                                                                                                              // 95
                                                                                                                       //
        if (options.onValidate && typeof options.onValidate !== 'function') {                                          // 96
            throw new TypeError('Store: onValidate is not a function');                                                // 97
        } // Public attributes                                                                                         // 98
                                                                                                                       //
                                                                                                                       //
        self.options = options;                                                                                        // 101
        self.permissions = options.permissions;                                                                        // 102
                                                                                                                       //
        _.each(['onCopyError', 'onFinishUpload', 'onRead', 'onReadError', 'onWriteError', 'onValidate'], function (method) {
            if (typeof options[method] === 'function') {                                                               // 111
                self[method] = options[method];                                                                        // 112
            }                                                                                                          // 113
        }); // Add the store to the list                                                                               // 114
                                                                                                                       //
                                                                                                                       //
        UploadFS.addStore(self); // Set default permissions                                                            // 117
                                                                                                                       //
        if (!(self.permissions instanceof StorePermissions)) {                                                         // 120
            // Uses custom default permissions or UFS default permissions                                              // 121
            if (UploadFS.config.defaultStorePermissions instanceof StorePermissions) {                                 // 122
                self.permissions = UploadFS.config.defaultStorePermissions;                                            // 123
            } else {                                                                                                   // 124
                self.permissions = new StorePermissions();                                                             // 125
                console.warn("ufs: permissions are not defined for store \"" + options.name + "\"");                   // 126
            }                                                                                                          // 127
        }                                                                                                              // 128
                                                                                                                       //
        if (Meteor.isServer) {                                                                                         // 130
            /**                                                                                                        // 132
             * Checks token validity                                                                                   //
             * @param token                                                                                            //
             * @param fileId                                                                                           //
             * @returns {boolean}                                                                                      //
             */self.checkToken = function (token, fileId) {                                                            //
                check(token, String);                                                                                  // 139
                check(fileId, String);                                                                                 // 140
                return Tokens.find({                                                                                   // 141
                    value: token,                                                                                      // 141
                    fileId: fileId                                                                                     // 141
                }).count() === 1;                                                                                      // 141
            }; /**                                                                                                     // 142
                * Copies the file to a store                                                                           //
                * @param fileId                                                                                        //
                * @param store                                                                                         //
                * @param callback                                                                                      //
                */                                                                                                     //
                                                                                                                       //
            self.copy = function (fileId, store, callback) {                                                           // 150
                check(fileId, String);                                                                                 // 151
                                                                                                                       //
                if (!(store instanceof Store)) {                                                                       // 153
                    throw new TypeError('store is not an instance of UploadFS.Store');                                 // 154
                } // Get original file                                                                                 // 155
                                                                                                                       //
                                                                                                                       //
                var file = self.getCollection().findOne({                                                              // 157
                    _id: fileId                                                                                        // 157
                });                                                                                                    // 157
                                                                                                                       //
                if (!file) {                                                                                           // 158
                    throw new Meteor.Error('file-not-found', 'File not found');                                        // 159
                } // Silently ignore the file if it does not match filter                                              // 160
                                                                                                                       //
                                                                                                                       //
                var filter = store.getFilter();                                                                        // 162
                                                                                                                       //
                if (filter instanceof Filter && !filter.isValid(file)) {                                               // 163
                    return;                                                                                            // 164
                } // Prepare copy                                                                                      // 165
                                                                                                                       //
                                                                                                                       //
                var copy = _.omit(file, '_id', 'url');                                                                 // 168
                                                                                                                       //
                copy.originalStore = self.getName();                                                                   // 169
                copy.originalId = fileId; // Create the copy                                                           // 170
                                                                                                                       //
                var copyId = store.create(copy); // Get original stream                                                // 173
                                                                                                                       //
                var rs = self.getReadStream(fileId, file); // Catch errors to avoid app crashing                       // 176
                                                                                                                       //
                rs.on('error', Meteor.bindEnvironment(function (err) {                                                 // 179
                    callback.call(self, err, null);                                                                    // 180
                })); // Copy file data                                                                                 // 181
                                                                                                                       //
                store.write(rs, copyId, Meteor.bindEnvironment(function (err) {                                        // 184
                    if (err) {                                                                                         // 185
                        self.getCollection().remove({                                                                  // 186
                            _id: copyId                                                                                // 186
                        });                                                                                            // 186
                        self.onCopyError.call(self, err, fileId, file);                                                // 187
                    }                                                                                                  // 188
                                                                                                                       //
                    if (typeof callback === 'function') {                                                              // 189
                        callback.call(self, err, copyId, copy, store);                                                 // 190
                    }                                                                                                  // 191
                }));                                                                                                   // 192
            }; /**                                                                                                     // 193
                * Creates the file in the collection                                                                   //
                * @param file                                                                                          //
                * @param callback                                                                                      //
                * @return {string}                                                                                     //
                */                                                                                                     //
                                                                                                                       //
            self.create = function (file, callback) {                                                                  // 201
                check(file, Object);                                                                                   // 202
                file.store = self.options.name; // assign store to file                                                // 203
                                                                                                                       //
                return self.getCollection().insert(file, callback);                                                    // 204
            }; /**                                                                                                     // 205
                * Creates a token for the file (only needed for client side upload)                                    //
                * @param fileId                                                                                        //
                * @returns {*}                                                                                         //
                */                                                                                                     //
                                                                                                                       //
            self.createToken = function (fileId) {                                                                     // 212
                var token = self.generateToken(); // Check if token exists                                             // 213
                                                                                                                       //
                if (Tokens.find({                                                                                      // 216
                    fileId: fileId                                                                                     // 216
                }).count()) {                                                                                          // 216
                    Tokens.update({                                                                                    // 217
                        fileId: fileId                                                                                 // 217
                    }, {                                                                                               // 217
                        $set: {                                                                                        // 218
                            createdAt: new Date(),                                                                     // 219
                            value: token                                                                               // 220
                        }                                                                                              // 218
                    });                                                                                                // 217
                } else {                                                                                               // 223
                    Tokens.insert({                                                                                    // 224
                        createdAt: new Date(),                                                                         // 225
                        fileId: fileId,                                                                                // 226
                        value: token                                                                                   // 227
                    });                                                                                                // 224
                }                                                                                                      // 229
                                                                                                                       //
                return token;                                                                                          // 230
            }; /**                                                                                                     // 231
                * Writes the file to the store                                                                         //
                * @param rs                                                                                            //
                * @param fileId                                                                                        //
                * @param callback                                                                                      //
                */                                                                                                     //
                                                                                                                       //
            self.write = function (rs, fileId, callback) {                                                             // 239
                var file = self.getCollection().findOne({                                                              // 240
                    _id: fileId                                                                                        // 240
                });                                                                                                    // 240
                var ws = self.getWriteStream(fileId, file);                                                            // 241
                var errorHandler = Meteor.bindEnvironment(function (err) {                                             // 243
                    self.getCollection().remove({                                                                      // 244
                        _id: fileId                                                                                    // 244
                    });                                                                                                // 244
                    self.onWriteError.call(self, err, fileId, file);                                                   // 245
                    callback.call(self, err);                                                                          // 246
                });                                                                                                    // 247
                ws.on('error', errorHandler);                                                                          // 249
                ws.on('finish', Meteor.bindEnvironment(function () {                                                   // 250
                    var size = 0;                                                                                      // 251
                    var readStream = self.getReadStream(fileId, file);                                                 // 252
                    readStream.on('error', Meteor.bindEnvironment(function (error) {                                   // 254
                        callback.call(self, error, null);                                                              // 255
                    }));                                                                                               // 256
                    readStream.on('data', Meteor.bindEnvironment(function (data) {                                     // 257
                        size += data.length;                                                                           // 258
                    }));                                                                                               // 259
                    readStream.on('end', Meteor.bindEnvironment(function () {                                          // 260
                        // Set file attribute                                                                          // 261
                        file.complete = true;                                                                          // 262
                        file.etag = UploadFS.generateEtag();                                                           // 263
                        file.path = self.getFileRelativeURL(fileId);                                                   // 264
                        file.progress = 1;                                                                             // 265
                        file.size = size;                                                                              // 266
                        file.token = self.generateToken();                                                             // 267
                        file.uploading = false;                                                                        // 268
                        file.uploadedAt = new Date();                                                                  // 269
                        file.url = self.getFileURL(fileId); // Sets the file URL when file transfer is complete,       // 270
                        // this way, the image will loads entirely.                                                    // 273
                                                                                                                       //
                        self.getCollection().direct.update({                                                           // 274
                            _id: fileId                                                                                // 274
                        }, {                                                                                           // 274
                            $set: {                                                                                    // 275
                                complete: file.complete,                                                               // 276
                                etag: file.etag,                                                                       // 277
                                path: file.path,                                                                       // 278
                                progress: file.progress,                                                               // 279
                                size: file.size,                                                                       // 280
                                token: file.token,                                                                     // 281
                                uploading: file.uploading,                                                             // 282
                                uploadedAt: file.uploadedAt,                                                           // 283
                                url: file.url                                                                          // 284
                            }                                                                                          // 275
                        }); // Return file info                                                                        // 274
                                                                                                                       //
                        callback.call(self, null, file); // Execute callback                                           // 289
                                                                                                                       //
                        if (typeof self.onFinishUpload == 'function') {                                                // 292
                            self.onFinishUpload.call(self, file);                                                      // 293
                        } // Simulate write speed                                                                      // 294
                                                                                                                       //
                                                                                                                       //
                        if (UploadFS.config.simulateWriteDelay) {                                                      // 297
                            Meteor._sleepForMs(UploadFS.config.simulateWriteDelay);                                    // 298
                        } // Copy file to other stores                                                                 // 299
                                                                                                                       //
                                                                                                                       //
                        if (self.options.copyTo instanceof Array) {                                                    // 302
                            for (var i = 0; i < self.options.copyTo.length; i += 1) {                                  // 303
                                var store = self.options.copyTo[i];                                                    // 304
                                                                                                                       //
                                if (!store.getFilter() || store.getFilter().isValid(file)) {                           // 306
                                    self.copy(fileId, store);                                                          // 307
                                }                                                                                      // 308
                            }                                                                                          // 309
                        }                                                                                              // 310
                    }));                                                                                               // 311
                })); // Execute transformation                                                                         // 312
                                                                                                                       //
                self.transformWrite(rs, ws, fileId, file);                                                             // 315
            };                                                                                                         // 316
        }                                                                                                              // 317
                                                                                                                       //
        if (Meteor.isServer) {                                                                                         // 319
            var fs = Npm.require('fs');                                                                                // 320
                                                                                                                       //
            var collection = self.getCollection(); // Code executed after removing file                                // 321
                                                                                                                       //
            collection.after.remove(function (userId, file) {                                                          // 324
                // Remove associated tokens                                                                            // 325
                Tokens.remove({                                                                                        // 326
                    fileId: file._id                                                                                   // 326
                });                                                                                                    // 326
                                                                                                                       //
                if (self.options.copyTo instanceof Array) {                                                            // 328
                    for (var i = 0; i < self.options.copyTo.length; i += 1) {                                          // 329
                        // Remove copies in stores                                                                     // 330
                        self.options.copyTo[i].getCollection().remove({                                                // 331
                            originalId: file._id                                                                       // 331
                        });                                                                                            // 331
                    }                                                                                                  // 332
                }                                                                                                      // 333
            }); // Code executed before inserting file                                                                 // 334
                                                                                                                       //
            collection.before.insert(function (userId, file) {                                                         // 337
                if (!self.permissions.checkInsert(userId, file)) {                                                     // 338
                    throw new Meteor.Error('forbidden', "Forbidden");                                                  // 339
                }                                                                                                      // 340
            }); // Code executed before updating file                                                                  // 341
                                                                                                                       //
            collection.before.update(function (userId, file, fields, modifiers) {                                      // 344
                if (!self.permissions.checkUpdate(userId, file, fields, modifiers)) {                                  // 345
                    throw new Meteor.Error('forbidden', "Forbidden");                                                  // 346
                }                                                                                                      // 347
            }); // Code executed before removing file                                                                  // 348
                                                                                                                       //
            collection.before.remove(function (userId, file) {                                                         // 351
                if (!self.permissions.checkRemove(userId, file)) {                                                     // 352
                    throw new Meteor.Error('forbidden', "Forbidden");                                                  // 353
                } // Delete the physical file in the store                                                             // 354
                                                                                                                       //
                                                                                                                       //
                self.delete(file._id);                                                                                 // 357
                var tmpFile = UploadFS.getTempFilePath(file._id); // Delete the temp file                              // 359
                                                                                                                       //
                fs.stat(tmpFile, function (err) {                                                                      // 362
                    !err && fs.unlink(tmpFile, function (err) {                                                        // 363
                        err && console.error("ufs: cannot delete temp file at " + tmpFile + " (" + err.message + ")");
                    });                                                                                                // 365
                });                                                                                                    // 366
            });                                                                                                        // 367
        }                                                                                                              // 368
    } /**                                                                                                              // 369
       * Deletes a file async                                                                                          //
       * @param fileId                                                                                                 //
       * @param callback                                                                                               //
       */                                                                                                              //
                                                                                                                       //
    Store.prototype.delete = function () {                                                                             //
        function _delete(fileId, callback) {                                                                           //
            throw new Error('delete is not implemented');                                                              // 377
        }                                                                                                              // 378
                                                                                                                       //
        return _delete;                                                                                                //
    }(); /**                                                                                                           //
          * Generates a random token                                                                                   //
          * @param pattern                                                                                             //
          * @return {string}                                                                                           //
          */                                                                                                           //
                                                                                                                       //
    Store.prototype.generateToken = function () {                                                                      //
        function generateToken(pattern) {                                                                              //
            return (pattern || 'xyxyxyxyxy').replace(/[xy]/g, function (c) {                                           // 386
                var r = Math.random() * 16 | 0,                                                                        // 387
                    v = c == 'x' ? r : r & 0x3 | 0x8;                                                                  // 387
                var s = v.toString(16);                                                                                // 388
                return Math.round(Math.random()) ? s.toUpperCase() : s;                                                // 389
            });                                                                                                        // 390
        }                                                                                                              // 391
                                                                                                                       //
        return generateToken;                                                                                          //
    }(); /**                                                                                                           //
          * Returns the collection                                                                                     //
          * @return {Mongo.Collection}                                                                                 //
          */                                                                                                           //
                                                                                                                       //
    Store.prototype.getCollection = function () {                                                                      //
        function getCollection() {                                                                                     //
            return this.options.collection;                                                                            // 398
        }                                                                                                              // 399
                                                                                                                       //
        return getCollection;                                                                                          //
    }(); /**                                                                                                           //
          * Returns the file URL                                                                                       //
          * @param fileId                                                                                              //
          * @return {string|null}                                                                                      //
          */                                                                                                           //
                                                                                                                       //
    Store.prototype.getFileRelativeURL = function () {                                                                 //
        function getFileRelativeURL(fileId) {                                                                          //
            var file = this.getCollection().findOne(fileId, {                                                          // 407
                fields: {                                                                                              // 407
                    name: 1                                                                                            // 407
                }                                                                                                      // 407
            });                                                                                                        // 407
            return file ? this.getRelativeURL(fileId + "/" + file.name) : null;                                        // 408
        }                                                                                                              // 409
                                                                                                                       //
        return getFileRelativeURL;                                                                                     //
    }(); /**                                                                                                           //
          * Returns the file URL                                                                                       //
          * @param fileId                                                                                              //
          * @return {string|null}                                                                                      //
          */                                                                                                           //
                                                                                                                       //
    Store.prototype.getFileURL = function () {                                                                         //
        function getFileURL(fileId) {                                                                                  //
            var file = this.getCollection().findOne(fileId, {                                                          // 417
                fields: {                                                                                              // 417
                    name: 1                                                                                            // 417
                }                                                                                                      // 417
            });                                                                                                        // 417
            return file ? this.getURL(fileId + "/" + file.name) : null;                                                // 418
        }                                                                                                              // 419
                                                                                                                       //
        return getFileURL;                                                                                             //
    }(); /**                                                                                                           //
          * Returns the file filter                                                                                    //
          * @return {UploadFS.Filter}                                                                                  //
          */                                                                                                           //
                                                                                                                       //
    Store.prototype.getFilter = function () {                                                                          //
        function getFilter() {                                                                                         //
            return this.options.filter;                                                                                // 426
        }                                                                                                              // 427
                                                                                                                       //
        return getFilter;                                                                                              //
    }(); /**                                                                                                           //
          * Returns the store name                                                                                     //
          * @return {string}                                                                                           //
          */                                                                                                           //
                                                                                                                       //
    Store.prototype.getName = function () {                                                                            //
        function getName() {                                                                                           //
            return this.options.name;                                                                                  // 434
        }                                                                                                              // 435
                                                                                                                       //
        return getName;                                                                                                //
    }(); /**                                                                                                           //
          * Returns the file read stream                                                                               //
          * @param fileId                                                                                              //
          * @param file                                                                                                //
          */                                                                                                           //
                                                                                                                       //
    Store.prototype.getReadStream = function () {                                                                      //
        function getReadStream(fileId, file) {                                                                         //
            throw new Error('Store.getReadStream is not implemented');                                                 // 443
        }                                                                                                              // 444
                                                                                                                       //
        return getReadStream;                                                                                          //
    }(); /**                                                                                                           //
          * Returns the store relative URL                                                                             //
          * @param path                                                                                                //
          * @return {string}                                                                                           //
          */                                                                                                           //
                                                                                                                       //
    Store.prototype.getRelativeURL = function () {                                                                     //
        function getRelativeURL(path) {                                                                                //
            var rootUrl = Meteor.absoluteUrl().replace(/\/+$/, '');                                                    // 452
            var rootPath = rootUrl.replace(/^[a-z]+:\/\/[^/]+\/*/gi, '');                                              // 453
            var storeName = this.getName();                                                                            // 454
            path = String(path).replace(/\/$/, '').trim();                                                             // 455
            return encodeURI(rootPath + "/" + UploadFS.config.storesPath + "/" + storeName + "/" + path);              // 456
        }                                                                                                              // 457
                                                                                                                       //
        return getRelativeURL;                                                                                         //
    }(); /**                                                                                                           //
          * Returns the store absolute URL                                                                             //
          * @param path                                                                                                //
          * @return {string}                                                                                           //
          */                                                                                                           //
                                                                                                                       //
    Store.prototype.getURL = function () {                                                                             //
        function getURL(path) {                                                                                        //
            var rootUrl = Meteor.absoluteUrl().replace(/\/+$/, '');                                                    // 465
            var storeName = this.getName();                                                                            // 466
            path = String(path).replace(/\/$/, '').trim();                                                             // 467
            return encodeURI(rootUrl + "/" + UploadFS.config.storesPath + "/" + storeName + "/" + path);               // 468
        }                                                                                                              // 469
                                                                                                                       //
        return getURL;                                                                                                 //
    }(); /**                                                                                                           //
          * Returns the file write stream                                                                              //
          * @param fileId                                                                                              //
          * @param file                                                                                                //
          */                                                                                                           //
                                                                                                                       //
    Store.prototype.getWriteStream = function () {                                                                     //
        function getWriteStream(fileId, file) {                                                                        //
            throw new Error('getWriteStream is not implemented');                                                      // 477
        }                                                                                                              // 478
                                                                                                                       //
        return getWriteStream;                                                                                         //
    }(); /**                                                                                                           //
          * Completes the file upload                                                                                  //
          * @param url                                                                                                 //
          * @param file                                                                                                //
          * @param callback                                                                                            //
          */                                                                                                           //
                                                                                                                       //
    Store.prototype.importFromURL = function () {                                                                      //
        function importFromURL(url, file, callback) {                                                                  //
            Meteor.call('ufsImportURL', url, file, this.getName(), callback);                                          // 487
        }                                                                                                              // 488
                                                                                                                       //
        return importFromURL;                                                                                          //
    }(); /**                                                                                                           //
          * Called when a copy error happened                                                                          //
          * @param err                                                                                                 //
          * @param fileId                                                                                              //
          * @param file                                                                                                //
          */                                                                                                           //
                                                                                                                       //
    Store.prototype.onCopyError = function () {                                                                        //
        function onCopyError(err, fileId, file) {                                                                      //
            console.error("ufs: cannot copy file \"" + fileId + "\" (" + err.message + ")", err);                      // 497
        }                                                                                                              // 498
                                                                                                                       //
        return onCopyError;                                                                                            //
    }(); /**                                                                                                           //
          * Called when a file has been uploaded                                                                       //
          * @param file                                                                                                //
          */                                                                                                           //
                                                                                                                       //
    Store.prototype.onFinishUpload = function () {                                                                     //
        function onFinishUpload(file) {}                                                                               //
                                                                                                                       //
        return onFinishUpload;                                                                                         //
    }(); /**                                                                                                           //
          * Called when a file is read from the store                                                                  //
          * @param fileId                                                                                              //
          * @param file                                                                                                //
          * @param request                                                                                             //
          * @param response                                                                                            //
          * @return boolean                                                                                            //
          */                                                                                                           //
                                                                                                                       //
    Store.prototype.onRead = function () {                                                                             //
        function onRead(fileId, file, request, response) {                                                             //
            return true;                                                                                               // 516
        }                                                                                                              // 517
                                                                                                                       //
        return onRead;                                                                                                 //
    }(); /**                                                                                                           //
          * Called when a read error happened                                                                          //
          * @param err                                                                                                 //
          * @param fileId                                                                                              //
          * @param file                                                                                                //
          * @return boolean                                                                                            //
          */                                                                                                           //
                                                                                                                       //
    Store.prototype.onReadError = function () {                                                                        //
        function onReadError(err, fileId, file) {                                                                      //
            console.error("ufs: cannot read file \"" + fileId + "\" (" + err.message + ")", err);                      // 527
        }                                                                                                              // 528
                                                                                                                       //
        return onReadError;                                                                                            //
    }(); /**                                                                                                           //
          * Called when file is being validated                                                                        //
          * @param file                                                                                                //
          */                                                                                                           //
                                                                                                                       //
    Store.prototype.onValidate = function () {                                                                         //
        function onValidate(file) {}                                                                                   //
                                                                                                                       //
        return onValidate;                                                                                             //
    }(); /**                                                                                                           //
          * Called when a write error happened                                                                         //
          * @param err                                                                                                 //
          * @param fileId                                                                                              //
          * @param file                                                                                                //
          * @return boolean                                                                                            //
          */                                                                                                           //
                                                                                                                       //
    Store.prototype.onWriteError = function () {                                                                       //
        function onWriteError(err, fileId, file) {                                                                     //
            console.error("ufs: cannot write file \"" + fileId + "\" (" + err.message + ")", err);                     // 545
        }                                                                                                              // 546
                                                                                                                       //
        return onWriteError;                                                                                           //
    }(); /**                                                                                                           //
          * Sets the store permissions                                                                                 //
          * @param permissions                                                                                         //
          */                                                                                                           //
                                                                                                                       //
    Store.prototype.setPermissions = function () {                                                                     //
        function setPermissions(permissions) {                                                                         //
            if (!(permissions instanceof StorePermissions)) {                                                          // 553
                throw new TypeError("Permissions is not an instance of UploadFS.StorePermissions");                    // 554
            }                                                                                                          // 555
                                                                                                                       //
            this.permissions = permissions;                                                                            // 556
        }                                                                                                              // 557
                                                                                                                       //
        return setPermissions;                                                                                         //
    }(); /**                                                                                                           //
          * Transforms the file on reading                                                                             //
          * @param readStream                                                                                          //
          * @param writeStream                                                                                         //
          * @param fileId                                                                                              //
          * @param file                                                                                                //
          * @param request                                                                                             //
          * @param headers                                                                                             //
          */                                                                                                           //
                                                                                                                       //
    Store.prototype.transformRead = function () {                                                                      //
        function transformRead(readStream, writeStream, fileId, file, request, headers) {                              //
            if (typeof this.options.transformRead === 'function') {                                                    // 569
                this.options.transformRead.call(this, readStream, writeStream, fileId, file, request, headers);        // 570
            } else {                                                                                                   // 571
                readStream.pipe(writeStream);                                                                          // 572
            }                                                                                                          // 573
        }                                                                                                              // 574
                                                                                                                       //
        return transformRead;                                                                                          //
    }(); /**                                                                                                           //
          * Transforms the file on writing                                                                             //
          * @param readStream                                                                                          //
          * @param writeStream                                                                                         //
          * @param fileId                                                                                              //
          * @param file                                                                                                //
          */                                                                                                           //
                                                                                                                       //
    Store.prototype.transformWrite = function () {                                                                     //
        function transformWrite(readStream, writeStream, fileId, file) {                                               //
            if (typeof this.options.transformWrite === 'function') {                                                   // 584
                this.options.transformWrite.call(this, readStream, writeStream, fileId, file);                         // 585
            } else {                                                                                                   // 586
                readStream.pipe(writeStream);                                                                          // 587
            }                                                                                                          // 588
        }                                                                                                              // 589
                                                                                                                       //
        return transformWrite;                                                                                         //
    }(); /**                                                                                                           //
          * Validates the file                                                                                         //
          * @param file                                                                                                //
          */                                                                                                           //
                                                                                                                       //
    Store.prototype.validate = function () {                                                                           //
        function validate(file) {                                                                                      //
            if (typeof this.onValidate === 'function') {                                                               // 596
                this.onValidate(file);                                                                                 // 597
            }                                                                                                          // 598
        }                                                                                                              // 599
                                                                                                                       //
        return validate;                                                                                               //
    }();                                                                                                               //
                                                                                                                       //
    return Store;                                                                                                      //
}();                                                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ufs-template-helpers.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jalik_ufs/ufs-template-helpers.js                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var Template = void 0;                                                                                                 // 1
module.watch(require("meteor/templating"), {                                                                           // 1
    Template: function (v) {                                                                                           // 1
        Template = v;                                                                                                  // 1
    }                                                                                                                  // 1
}, 0);                                                                                                                 // 1
                                                                                                                       //
var isMIME = function (type, mime) {                                                                                   // 29
    return typeof type === 'string' && typeof mime === 'string' && mime.indexOf(type + '/') === 0;                     // 30
};                                                                                                                     // 33
                                                                                                                       //
Template.registerHelper('isApplication', function (type) {                                                             // 35
    return isMIME('application', this.type || type);                                                                   // 36
});                                                                                                                    // 37
Template.registerHelper('isAudio', function (type) {                                                                   // 39
    return isMIME('audio', this.type || type);                                                                         // 40
});                                                                                                                    // 41
Template.registerHelper('isImage', function (type) {                                                                   // 43
    return isMIME('image', this.type || type);                                                                         // 44
});                                                                                                                    // 45
Template.registerHelper('isText', function (type) {                                                                    // 47
    return isMIME('text', this.type || type);                                                                          // 48
});                                                                                                                    // 49
Template.registerHelper('isVideo', function (type) {                                                                   // 51
    return isMIME('video', this.type || type);                                                                         // 52
});                                                                                                                    // 53
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ufs-tokens.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jalik_ufs/ufs-tokens.js                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({                                                                                                        // 1
  Tokens: function () {                                                                                                // 1
    return Tokens;                                                                                                     // 1
  }                                                                                                                    // 1
});                                                                                                                    // 1
var Mongo = void 0;                                                                                                    // 1
module.watch(require("meteor/mongo"), {                                                                                // 1
  Mongo: function (v) {                                                                                                // 1
    Mongo = v;                                                                                                         // 1
  }                                                                                                                    // 1
}, 0);                                                                                                                 // 1
var Tokens = new Mongo.Collection('ufsTokens');                                                                        // 32
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ufs-uploader.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jalik_ufs/ufs-uploader.js                                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _typeof2 = require("babel-runtime/helpers/typeof");                                                                //
                                                                                                                       //
var _typeof3 = _interopRequireDefault(_typeof2);                                                                       //
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
module.export({                                                                                                        // 1
    Uploader: function () {                                                                                            // 1
        return Uploader;                                                                                               // 1
    }                                                                                                                  // 1
});                                                                                                                    // 1
                                                                                                                       //
var _ = void 0;                                                                                                        // 1
                                                                                                                       //
module.watch(require("meteor/underscore"), {                                                                           // 1
    _: function (v) {                                                                                                  // 1
        _ = v;                                                                                                         // 1
    }                                                                                                                  // 1
}, 0);                                                                                                                 // 1
var Meteor = void 0;                                                                                                   // 1
module.watch(require("meteor/meteor"), {                                                                               // 1
    Meteor: function (v) {                                                                                             // 1
        Meteor = v;                                                                                                    // 1
    }                                                                                                                  // 1
}, 1);                                                                                                                 // 1
var Store = void 0;                                                                                                    // 1
module.watch(require("./ufs-store"), {                                                                                 // 1
    Store: function (v) {                                                                                              // 1
        Store = v;                                                                                                     // 1
    }                                                                                                                  // 1
}, 2);                                                                                                                 // 1
                                                                                                                       //
var Uploader = function () {                                                                                           //
    function Uploader(options) {                                                                                       // 36
        (0, _classCallCheck3.default)(this, Uploader);                                                                 // 36
        var self = this; // Set default options                                                                        // 37
                                                                                                                       //
        options = _.extend({                                                                                           // 40
            adaptive: true,                                                                                            // 41
            capacity: 0.9,                                                                                             // 42
            chunkSize: 16 * 1024,                                                                                      // 43
            data: null,                                                                                                // 44
            file: null,                                                                                                // 45
            maxChunkSize: 4 * 1024 * 1000,                                                                             // 46
            maxTries: 5,                                                                                               // 47
            onAbort: this.onAbort,                                                                                     // 48
            onComplete: this.onComplete,                                                                               // 49
            onCreate: this.onCreate,                                                                                   // 50
            onError: this.onError,                                                                                     // 51
            onProgress: this.onProgress,                                                                               // 52
            onStart: this.onStart,                                                                                     // 53
            onStop: this.onStop,                                                                                       // 54
            retryDelay: 2000,                                                                                          // 55
            store: null,                                                                                               // 56
            transferDelay: 100                                                                                         // 57
        }, options); // Check options                                                                                  // 40
                                                                                                                       //
        if (typeof options.adaptive !== 'boolean') {                                                                   // 61
            throw new TypeError('adaptive is not a number');                                                           // 62
        }                                                                                                              // 63
                                                                                                                       //
        if (typeof options.capacity !== 'number') {                                                                    // 64
            throw new TypeError('capacity is not a number');                                                           // 65
        }                                                                                                              // 66
                                                                                                                       //
        if (options.capacity <= 0 || options.capacity > 1) {                                                           // 67
            throw new RangeError('capacity must be a float between 0.1 and 1.0');                                      // 68
        }                                                                                                              // 69
                                                                                                                       //
        if (typeof options.chunkSize !== 'number') {                                                                   // 70
            throw new TypeError('chunkSize is not a number');                                                          // 71
        }                                                                                                              // 72
                                                                                                                       //
        if (!(options.data instanceof Blob) && !(options.data instanceof File)) {                                      // 73
            throw new TypeError('data is not an Blob or File');                                                        // 74
        }                                                                                                              // 75
                                                                                                                       //
        if (options.file === null || (0, _typeof3.default)(options.file) !== 'object') {                               // 76
            throw new TypeError('file is not an object');                                                              // 77
        }                                                                                                              // 78
                                                                                                                       //
        if (typeof options.maxChunkSize !== 'number') {                                                                // 79
            throw new TypeError('maxChunkSize is not a number');                                                       // 80
        }                                                                                                              // 81
                                                                                                                       //
        if (typeof options.maxTries !== 'number') {                                                                    // 82
            throw new TypeError('maxTries is not a number');                                                           // 83
        }                                                                                                              // 84
                                                                                                                       //
        if (typeof options.retryDelay !== 'number') {                                                                  // 85
            throw new TypeError('retryDelay is not a number');                                                         // 86
        }                                                                                                              // 87
                                                                                                                       //
        if (typeof options.transferDelay !== 'number') {                                                               // 88
            throw new TypeError('transferDelay is not a number');                                                      // 89
        }                                                                                                              // 90
                                                                                                                       //
        if (typeof options.onAbort !== 'function') {                                                                   // 91
            throw new TypeError('onAbort is not a function');                                                          // 92
        }                                                                                                              // 93
                                                                                                                       //
        if (typeof options.onComplete !== 'function') {                                                                // 94
            throw new TypeError('onComplete is not a function');                                                       // 95
        }                                                                                                              // 96
                                                                                                                       //
        if (typeof options.onCreate !== 'function') {                                                                  // 97
            throw new TypeError('onCreate is not a function');                                                         // 98
        }                                                                                                              // 99
                                                                                                                       //
        if (typeof options.onError !== 'function') {                                                                   // 100
            throw new TypeError('onError is not a function');                                                          // 101
        }                                                                                                              // 102
                                                                                                                       //
        if (typeof options.onProgress !== 'function') {                                                                // 103
            throw new TypeError('onProgress is not a function');                                                       // 104
        }                                                                                                              // 105
                                                                                                                       //
        if (typeof options.onStart !== 'function') {                                                                   // 106
            throw new TypeError('onStart is not a function');                                                          // 107
        }                                                                                                              // 108
                                                                                                                       //
        if (typeof options.onStop !== 'function') {                                                                    // 109
            throw new TypeError('onStop is not a function');                                                           // 110
        }                                                                                                              // 111
                                                                                                                       //
        if (typeof options.store !== 'string' && !(options.store instanceof Store)) {                                  // 112
            throw new TypeError('store must be the name of the store or an instance of UploadFS.Store');               // 113
        } // Public attributes                                                                                         // 114
                                                                                                                       //
                                                                                                                       //
        self.adaptive = options.adaptive;                                                                              // 117
        self.capacity = parseFloat(options.capacity);                                                                  // 118
        self.chunkSize = parseInt(options.chunkSize);                                                                  // 119
        self.maxChunkSize = parseInt(options.maxChunkSize);                                                            // 120
        self.maxTries = parseInt(options.maxTries);                                                                    // 121
        self.retryDelay = parseInt(options.retryDelay);                                                                // 122
        self.transferDelay = parseInt(options.transferDelay);                                                          // 123
        self.onAbort = options.onAbort;                                                                                // 124
        self.onComplete = options.onComplete;                                                                          // 125
        self.onCreate = options.onCreate;                                                                              // 126
        self.onError = options.onError;                                                                                // 127
        self.onProgress = options.onProgress;                                                                          // 128
        self.onStart = options.onStart;                                                                                // 129
        self.onStop = options.onStop; // Private attributes                                                            // 130
                                                                                                                       //
        var store = options.store;                                                                                     // 133
        var data = options.data;                                                                                       // 134
        var capacityMargin = 0.1;                                                                                      // 135
        var file = options.file;                                                                                       // 136
        var fileId = null;                                                                                             // 137
        var offset = 0;                                                                                                // 138
        var loaded = 0;                                                                                                // 139
        var total = data.size;                                                                                         // 140
        var tries = 0;                                                                                                 // 141
        var postUrl = null;                                                                                            // 142
        var token = null;                                                                                              // 143
        var complete = false;                                                                                          // 144
        var uploading = false;                                                                                         // 145
        var timeA = null;                                                                                              // 147
        var timeB = null;                                                                                              // 148
        var elapsedTime = 0;                                                                                           // 150
        var startTime = 0; // Keep only the name of the store                                                          // 151
                                                                                                                       //
        if (store instanceof Store) {                                                                                  // 154
            store = store.getName();                                                                                   // 155
        } // Assign file to store                                                                                      // 156
                                                                                                                       //
                                                                                                                       //
        file.store = store;                                                                                            // 159
                                                                                                                       //
        function finish() {                                                                                            // 161
            // Finish the upload by telling the store the upload is complete                                           // 162
            Meteor.call('ufsComplete', fileId, store, token, function (err, uploadedFile) {                            // 163
                if (err) {                                                                                             // 164
                    self.onError(err, file);                                                                           // 165
                    self.abort();                                                                                      // 166
                } else if (uploadedFile) {                                                                             // 167
                    uploading = false;                                                                                 // 169
                    complete = true;                                                                                   // 170
                    file = uploadedFile;                                                                               // 171
                    self.onComplete(uploadedFile);                                                                     // 172
                }                                                                                                      // 173
            });                                                                                                        // 174
        } /**                                                                                                          // 175
           * Aborts the current transfer                                                                               //
           */                                                                                                          //
                                                                                                                       //
        self.abort = function () {                                                                                     // 180
            // Remove the file from database                                                                           // 181
            Meteor.call('ufsDelete', fileId, store, token, function (err, result) {                                    // 182
                if (err) {                                                                                             // 183
                    self.onError(err, file);                                                                           // 184
                }                                                                                                      // 185
            }); // Reset uploader status                                                                               // 186
                                                                                                                       //
            uploading = false;                                                                                         // 189
            fileId = null;                                                                                             // 190
            offset = 0;                                                                                                // 191
            tries = 0;                                                                                                 // 192
            loaded = 0;                                                                                                // 193
            complete = false;                                                                                          // 194
            startTime = null;                                                                                          // 195
            self.onAbort(file);                                                                                        // 196
        }; /**                                                                                                         // 197
            * Returns the average speed in bytes per second                                                            //
            * @returns {number}                                                                                        //
            */                                                                                                         //
                                                                                                                       //
        self.getAverageSpeed = function () {                                                                           // 203
            var seconds = self.getElapsedTime() / 1000;                                                                // 204
            return self.getLoaded() / seconds;                                                                         // 205
        }; /**                                                                                                         // 206
            * Returns the elapsed time in milliseconds                                                                 //
            * @returns {number}                                                                                        //
            */                                                                                                         //
                                                                                                                       //
        self.getElapsedTime = function () {                                                                            // 212
            if (startTime && self.isUploading()) {                                                                     // 213
                return elapsedTime + (Date.now() - startTime);                                                         // 214
            }                                                                                                          // 215
                                                                                                                       //
            return elapsedTime;                                                                                        // 216
        }; /**                                                                                                         // 217
            * Returns the file                                                                                         //
            * @return {object}                                                                                         //
            */                                                                                                         //
                                                                                                                       //
        self.getFile = function () {                                                                                   // 223
            return file;                                                                                               // 224
        }; /**                                                                                                         // 225
            * Returns the loaded bytes                                                                                 //
            * @return {number}                                                                                         //
            */                                                                                                         //
                                                                                                                       //
        self.getLoaded = function () {                                                                                 // 231
            return loaded;                                                                                             // 232
        }; /**                                                                                                         // 233
            * Returns current progress                                                                                 //
            * @return {number}                                                                                         //
            */                                                                                                         //
                                                                                                                       //
        self.getProgress = function () {                                                                               // 239
            return Math.min(loaded / total * 100 / 100, 1.0);                                                          // 240
        }; /**                                                                                                         // 241
            * Returns the remaining time in milliseconds                                                               //
            * @returns {number}                                                                                        //
            */                                                                                                         //
                                                                                                                       //
        self.getRemainingTime = function () {                                                                          // 247
            var averageSpeed = self.getAverageSpeed();                                                                 // 248
            var remainingBytes = total - self.getLoaded();                                                             // 249
            return averageSpeed && remainingBytes ? Math.max(remainingBytes / averageSpeed, 0) : 0;                    // 250
        }; /**                                                                                                         // 251
            * Returns the upload speed in bytes per second                                                             //
            * @returns {number}                                                                                        //
            */                                                                                                         //
                                                                                                                       //
        self.getSpeed = function () {                                                                                  // 257
            if (timeA && timeB && self.isUploading()) {                                                                // 258
                var seconds = (timeB - timeA) / 1000;                                                                  // 259
                return self.chunkSize / seconds;                                                                       // 260
            }                                                                                                          // 261
                                                                                                                       //
            return 0;                                                                                                  // 262
        }; /**                                                                                                         // 263
            * Returns the total bytes                                                                                  //
            * @return {number}                                                                                         //
            */                                                                                                         //
                                                                                                                       //
        self.getTotal = function () {                                                                                  // 269
            return total;                                                                                              // 270
        }; /**                                                                                                         // 271
            * Checks if the transfer is complete                                                                       //
            * @return {boolean}                                                                                        //
            */                                                                                                         //
                                                                                                                       //
        self.isComplete = function () {                                                                                // 277
            return complete;                                                                                           // 278
        }; /**                                                                                                         // 279
            * Checks if the transfer is active                                                                         //
            * @return {boolean}                                                                                        //
            */                                                                                                         //
                                                                                                                       //
        self.isUploading = function () {                                                                               // 285
            return uploading;                                                                                          // 286
        }; /**                                                                                                         // 287
            * Reads a portion of file                                                                                  //
            * @param start                                                                                             //
            * @param length                                                                                            //
            * @param callback                                                                                          //
            * @returns {Blob}                                                                                          //
            */                                                                                                         //
                                                                                                                       //
        self.readChunk = function (start, length, callback) {                                                          // 296
            if (typeof callback != 'function') {                                                                       // 297
                throw new Error('readChunk is missing callback');                                                      // 298
            }                                                                                                          // 299
                                                                                                                       //
            try {                                                                                                      // 300
                var end = void 0; // Calculate the chunk size                                                          // 301
                                                                                                                       //
                if (length && start + length > total) {                                                                // 304
                    end = total;                                                                                       // 305
                } else {                                                                                               // 306
                    end = start + length;                                                                              // 307
                } // Get chunk                                                                                         // 308
                                                                                                                       //
                                                                                                                       //
                var chunk = data.slice(start, end); // Pass chunk to callback                                          // 310
                                                                                                                       //
                callback.call(self, null, chunk);                                                                      // 312
            } catch (err) {                                                                                            // 314
                console.error('read error', err); // Retry to read chunk                                               // 315
                                                                                                                       //
                Meteor.setTimeout(function () {                                                                        // 317
                    if (tries < self.maxTries) {                                                                       // 318
                        tries += 1;                                                                                    // 319
                        self.readChunk(start, length, callback);                                                       // 320
                    }                                                                                                  // 321
                }, self.retryDelay);                                                                                   // 322
            }                                                                                                          // 323
        }; /**                                                                                                         // 324
            * Sends a file chunk to the store                                                                          //
            */                                                                                                         //
                                                                                                                       //
        self.sendChunk = function () {                                                                                 // 329
            if (!complete && startTime !== null) {                                                                     // 330
                if (offset < total) {                                                                                  // 331
                    var chunkSize = self.chunkSize; // Use adaptive length                                             // 332
                                                                                                                       //
                    if (self.adaptive && timeA && timeB && timeB > timeA) {                                            // 335
                        var duration = (timeB - timeA) / 1000;                                                         // 336
                        var max = self.capacity * (1 + capacityMargin);                                                // 337
                        var min = self.capacity * (1 - capacityMargin);                                                // 338
                                                                                                                       //
                        if (duration >= max) {                                                                         // 340
                            chunkSize = Math.abs(Math.round(chunkSize * (max - duration)));                            // 341
                        } else if (duration < min) {                                                                   // 343
                            chunkSize = Math.round(chunkSize * (min / duration));                                      // 344
                        } // Limit to max chunk size                                                                   // 345
                                                                                                                       //
                                                                                                                       //
                        if (self.maxChunkSize > 0 && chunkSize > self.maxChunkSize) {                                  // 347
                            chunkSize = self.maxChunkSize;                                                             // 348
                        }                                                                                              // 349
                    } // Limit to max chunk size                                                                       // 350
                                                                                                                       //
                                                                                                                       //
                    if (self.maxChunkSize > 0 && chunkSize > self.maxChunkSize) {                                      // 353
                        chunkSize = self.maxChunkSize;                                                                 // 354
                    } // Reduce chunk size to fit total                                                                // 355
                                                                                                                       //
                                                                                                                       //
                    if (offset + chunkSize > total) {                                                                  // 358
                        chunkSize = total - offset;                                                                    // 359
                    } // Prepare the chunk                                                                             // 360
                                                                                                                       //
                                                                                                                       //
                    self.readChunk(offset, chunkSize, function (err, chunk) {                                          // 363
                        if (err) {                                                                                     // 364
                            self.onError(err, file);                                                                   // 365
                            return;                                                                                    // 366
                        }                                                                                              // 367
                                                                                                                       //
                        var xhr = new XMLHttpRequest();                                                                // 369
                                                                                                                       //
                        xhr.onreadystatechange = function () {                                                         // 370
                            if (xhr.readyState === 4) {                                                                // 371
                                if (_.contains([200, 201, 202, 204], xhr.status)) {                                    // 372
                                    timeB = Date.now();                                                                // 373
                                    offset += chunkSize;                                                               // 374
                                    loaded += chunkSize; // Send next chunk                                            // 375
                                                                                                                       //
                                    self.onProgress(file, self.getProgress()); // Finish upload                        // 378
                                                                                                                       //
                                    if (loaded >= total) {                                                             // 381
                                        elapsedTime = Date.now() - startTime;                                          // 382
                                        finish();                                                                      // 383
                                    } else {                                                                           // 384
                                        Meteor.setTimeout(self.sendChunk, self.transferDelay);                         // 385
                                    }                                                                                  // 386
                                } else if (!_.contains([402, 403, 404, 500], xhr.status)) {                            // 387
                                    // Retry until max tries is reach                                                  // 389
                                    // But don't retry if these errors occur                                           // 390
                                    if (tries <= self.maxTries) {                                                      // 391
                                        tries += 1; // Wait before retrying                                            // 392
                                                                                                                       //
                                        Meteor.setTimeout(self.sendChunk, self.retryDelay);                            // 394
                                    } else {                                                                           // 395
                                        self.abort();                                                                  // 396
                                    }                                                                                  // 397
                                } else {                                                                               // 398
                                    self.abort();                                                                      // 400
                                }                                                                                      // 401
                            }                                                                                          // 402
                        }; // Calculate upload progress                                                                // 403
                                                                                                                       //
                                                                                                                       //
                        var progress = (offset + chunkSize) / total; // let formData = new FormData();                 // 406
                        // formData.append('progress', progress);                                                      // 408
                        // formData.append('chunk', chunk);                                                            // 409
                                                                                                                       //
                        var url = postUrl + "&progress=" + progress;                                                   // 410
                        timeA = Date.now();                                                                            // 412
                        timeB = null;                                                                                  // 413
                        uploading = true; // Send chunk to the store                                                   // 414
                                                                                                                       //
                        xhr.open('POST', url, true);                                                                   // 417
                        xhr.send(chunk);                                                                               // 418
                    });                                                                                                // 419
                }                                                                                                      // 420
            }                                                                                                          // 421
        }; /**                                                                                                         // 422
            * Starts or resumes the transfer                                                                           //
            */                                                                                                         //
                                                                                                                       //
        self.start = function () {                                                                                     // 427
            if (!fileId) {                                                                                             // 428
                // Create the file document and get the token                                                          // 429
                // that allows the user to send chunks to the store.                                                   // 430
                Meteor.call('ufsCreate', _.extend({}, file), function (err, result) {                                  // 431
                    if (err) {                                                                                         // 432
                        self.onError(err, file);                                                                       // 433
                    } else if (result) {                                                                               // 434
                        token = result.token;                                                                          // 435
                        postUrl = result.url;                                                                          // 436
                        fileId = result.fileId;                                                                        // 437
                        file._id = result.fileId;                                                                      // 438
                        self.onCreate(file);                                                                           // 439
                        tries = 0;                                                                                     // 440
                        startTime = Date.now();                                                                        // 441
                        self.onStart(file);                                                                            // 442
                        self.sendChunk();                                                                              // 443
                    }                                                                                                  // 444
                });                                                                                                    // 445
            } else if (!uploading && !complete) {                                                                      // 446
                // Resume uploading                                                                                    // 447
                tries = 0;                                                                                             // 448
                startTime = Date.now();                                                                                // 449
                self.onStart(file);                                                                                    // 450
                self.sendChunk();                                                                                      // 451
            }                                                                                                          // 452
        }; /**                                                                                                         // 453
            * Stops the transfer                                                                                       //
            */                                                                                                         //
                                                                                                                       //
        self.stop = function () {                                                                                      // 458
            if (uploading) {                                                                                           // 459
                // Update elapsed time                                                                                 // 460
                elapsedTime = Date.now() - startTime;                                                                  // 461
                startTime = null;                                                                                      // 462
                uploading = false;                                                                                     // 463
                self.onStop(file);                                                                                     // 464
                Meteor.call('ufsStop', fileId, store, token, function (err, result) {                                  // 466
                    if (err) {                                                                                         // 467
                        self.onError(err, file);                                                                       // 468
                    }                                                                                                  // 469
                });                                                                                                    // 470
            }                                                                                                          // 471
        };                                                                                                             // 472
    } /**                                                                                                              // 473
       * Called when the file upload is aborted                                                                        //
       * @param file                                                                                                   //
       */                                                                                                              //
                                                                                                                       //
    Uploader.prototype.onAbort = function () {                                                                         //
        function onAbort(file) {}                                                                                      //
                                                                                                                       //
        return onAbort;                                                                                                //
    }(); /**                                                                                                           //
          * Called when the file upload is complete                                                                    //
          * @param file                                                                                                //
          */                                                                                                           //
                                                                                                                       //
    Uploader.prototype.onComplete = function () {                                                                      //
        function onComplete(file) {}                                                                                   //
                                                                                                                       //
        return onComplete;                                                                                             //
    }(); /**                                                                                                           //
          * Called when the file is created in the collection                                                          //
          * @param file                                                                                                //
          */                                                                                                           //
                                                                                                                       //
    Uploader.prototype.onCreate = function () {                                                                        //
        function onCreate(file) {}                                                                                     //
                                                                                                                       //
        return onCreate;                                                                                               //
    }(); /**                                                                                                           //
          * Called when an error occurs during file upload                                                             //
          * @param err                                                                                                 //
          * @param file                                                                                                //
          */                                                                                                           //
                                                                                                                       //
    Uploader.prototype.onError = function () {                                                                         //
        function onError(err, file) {                                                                                  //
            console.error("ufs: " + err.message);                                                                      // 502
        }                                                                                                              // 503
                                                                                                                       //
        return onError;                                                                                                //
    }(); /**                                                                                                           //
          * Called when a file chunk has been sent                                                                     //
          * @param file                                                                                                //
          * @param progress is a float from 0.0 to 1.0                                                                 //
          */                                                                                                           //
                                                                                                                       //
    Uploader.prototype.onProgress = function () {                                                                      //
        function onProgress(file, progress) {}                                                                         //
                                                                                                                       //
        return onProgress;                                                                                             //
    }(); /**                                                                                                           //
          * Called when the file upload starts                                                                         //
          * @param file                                                                                                //
          */                                                                                                           //
                                                                                                                       //
    Uploader.prototype.onStart = function () {                                                                         //
        function onStart(file) {}                                                                                      //
                                                                                                                       //
        return onStart;                                                                                                //
    }(); /**                                                                                                           //
          * Called when the file upload stops                                                                          //
          * @param file                                                                                                //
          */                                                                                                           //
                                                                                                                       //
    Uploader.prototype.onStop = function () {                                                                          //
        function onStop(file) {}                                                                                       //
                                                                                                                       //
        return onStop;                                                                                                 //
    }();                                                                                                               //
                                                                                                                       //
    return Uploader;                                                                                                   //
}();                                                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
var exports = require("./node_modules/meteor/jalik:ufs/ufs.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['jalik:ufs'] = exports;

})();

//# sourceMappingURL=jalik_ufs.js.map

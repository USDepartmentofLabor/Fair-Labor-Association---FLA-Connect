(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RocketChatTabBar = Package['rocketchat:lib'].RocketChatTabBar;
var ECMAScript = Package.ecmascript.ECMAScript;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var meteorInstall = Package.modules.meteorInstall;
var process = Package.modules.process;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

/* Package-scope variables */
var RocketChatFile, exports;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:file":{"file.server.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// packages/rocketchat_file/file.server.js                                                        //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                           //
                                                                                                  //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                  //
                                                                                                  //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
                                                                                                  //
var Grid = void 0;                                                                                // 1
module.watch(require("gridfs-stream"), {                                                          // 1
	"default": function (v) {                                                                        // 1
		Grid = v;                                                                                       // 1
	}                                                                                                // 1
}, 0);                                                                                            // 1
var stream = void 0;                                                                              // 1
module.watch(require("stream"), {                                                                 // 1
	"default": function (v) {                                                                        // 1
		stream = v;                                                                                     // 1
	}                                                                                                // 1
}, 1);                                                                                            // 1
var fs = void 0;                                                                                  // 1
module.watch(require("fs"), {                                                                     // 1
	"default": function (v) {                                                                        // 1
		fs = v;                                                                                         // 1
	}                                                                                                // 1
}, 2);                                                                                            // 1
var path = void 0;                                                                                // 1
module.watch(require("path"), {                                                                   // 1
	"default": function (v) {                                                                        // 1
		path = v;                                                                                       // 1
	}                                                                                                // 1
}, 3);                                                                                            // 1
var mkdirp = void 0;                                                                              // 1
module.watch(require("mkdirp"), {                                                                 // 1
	"default": function (v) {                                                                        // 1
		mkdirp = v;                                                                                     // 1
	}                                                                                                // 1
}, 4);                                                                                            // 1
var gm = void 0;                                                                                  // 1
module.watch(require("gm"), {                                                                     // 1
	"default": function (v) {                                                                        // 1
		gm = v;                                                                                         // 1
	}                                                                                                // 1
}, 5);                                                                                            // 1
var exec = void 0;                                                                                // 1
module.watch(require("child_process"), {                                                          // 1
	exec: function (v) {                                                                             // 1
		exec = v;                                                                                       // 1
	}                                                                                                // 1
}, 6);                                                                                            // 1
                                                                                                  //
// Fix problem with usernames being converted to object id                                        // 9
Grid.prototype.tryParseObjectId = function () {                                                   // 10
	return false;                                                                                    // 11
}; //TODO: REMOVE RocketChatFile from globals                                                     // 12
                                                                                                  //
                                                                                                  //
RocketChatFile = {                                                                                // 14
	gm: gm,                                                                                          // 15
	enabled: undefined,                                                                              // 16
	enable: function () {                                                                            // 17
		RocketChatFile.enabled = true;                                                                  // 18
		return RocketChat.settings.updateOptionsById('Accounts_AvatarResize', {                         // 19
			alert: undefined                                                                               // 20
		});                                                                                             // 19
	},                                                                                               // 22
	disable: function () {                                                                           // 23
		RocketChatFile.enabled = false;                                                                 // 24
		return RocketChat.settings.updateOptionsById('Accounts_AvatarResize', {                         // 25
			alert: 'The_image_resize_will_not_work_because_we_can_not_detect_ImageMagick_or_GraphicsMagick_installed_in_your_server'
		});                                                                                             // 25
	}                                                                                                // 28
};                                                                                                // 14
                                                                                                  //
var detectGM = function () {                                                                      // 31
	return exec('gm version', Meteor.bindEnvironment(function (error, stdout) {                      // 32
		if (error == null && stdout.indexOf('GraphicsMagick') > -1) {                                   // 33
			RocketChatFile.enable();                                                                       // 34
			RocketChat.Info.GraphicsMagick = {                                                             // 35
				enabled: true,                                                                                // 36
				version: stdout                                                                               // 37
			};                                                                                             // 35
		} else {                                                                                        // 39
			RocketChat.Info.GraphicsMagick = {                                                             // 40
				enabled: false                                                                                // 41
			};                                                                                             // 40
		}                                                                                               // 43
                                                                                                  //
		return exec('convert -version', Meteor.bindEnvironment(function (error, stdout) {               // 44
			if (error == null && stdout.indexOf('ImageMagick') > -1) {                                     // 45
				if (RocketChatFile.enabled !== true) {                                                        // 46
					// Enable GM to work with ImageMagick if no GraphicsMagick                                   // 47
					RocketChatFile.gm = RocketChatFile.gm.subClass({                                             // 48
						imageMagick: true                                                                           // 49
					});                                                                                          // 48
					RocketChatFile.enable();                                                                     // 51
				}                                                                                             // 52
                                                                                                  //
				return RocketChat.Info.ImageMagick = {                                                        // 53
					enabled: true,                                                                               // 54
					version: stdout                                                                              // 55
				};                                                                                            // 53
			} else {                                                                                       // 57
				if (RocketChatFile.enabled !== true) {                                                        // 58
					RocketChatFile.disable();                                                                    // 59
				}                                                                                             // 60
                                                                                                  //
				return RocketChat.Info.ImageMagick = {                                                        // 61
					enabled: false                                                                               // 62
				};                                                                                            // 61
			}                                                                                              // 64
		}));                                                                                            // 65
	}));                                                                                             // 66
};                                                                                                // 67
                                                                                                  //
detectGM();                                                                                       // 69
Meteor.methods({                                                                                  // 71
	'detectGM': function () {                                                                        // 72
		detectGM();                                                                                     // 73
	}                                                                                                // 74
});                                                                                               // 71
                                                                                                  //
RocketChatFile.bufferToStream = function (buffer) {                                               // 77
	var bufferStream = new stream.PassThrough();                                                     // 78
	bufferStream.end(buffer);                                                                        // 79
	return bufferStream;                                                                             // 80
};                                                                                                // 81
                                                                                                  //
RocketChatFile.dataURIParse = function (dataURI) {                                                // 83
	var imageData = dataURI.split(';base64,');                                                       // 84
	return {                                                                                         // 85
		image: imageData[1],                                                                            // 86
		contentType: imageData[0].replace('data:', '')                                                  // 87
	};                                                                                               // 85
};                                                                                                // 89
                                                                                                  //
RocketChatFile.addPassThrough = function (st, fn) {                                               // 91
	var pass = new stream.PassThrough();                                                             // 92
	fn(pass, st);                                                                                    // 93
	return pass;                                                                                     // 94
};                                                                                                // 95
                                                                                                  //
RocketChatFile.GridFS = function () {                                                             // 97
	function _class() {                                                                              // 98
		var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};            // 98
		(0, _classCallCheck3.default)(this, _class);                                                    // 98
		var _config$name = config.name,                                                                 // 98
		    name = _config$name === undefined ? 'file' : _config$name,                                  // 98
		    transformWrite = config.transformWrite;                                                     // 98
		this.name = name;                                                                               // 101
		this.transformWrite = transformWrite;                                                           // 102
		var mongo = Package.mongo.MongoInternals.NpmModule;                                             // 103
		var db = Package.mongo.MongoInternals.defaultRemoteCollectionDriver().mongo.db;                 // 104
		this.store = new Grid(db, mongo);                                                               // 105
		this.findOneSync = Meteor.wrapAsync(this.store.collection(this.name).findOne.bind(this.store.collection(this.name)));
		this.removeSync = Meteor.wrapAsync(this.store.remove.bind(this.store));                         // 107
		this.countSync = Meteor.wrapAsync(this.store._col.count.bind(this.store._col));                 // 108
		this.getFileSync = Meteor.wrapAsync(this.getFile.bind(this));                                   // 109
	}                                                                                                // 110
                                                                                                  //
	_class.prototype.findOne = function () {                                                         // 97
		function findOne(fileName) {                                                                    // 97
			return this.findOneSync({                                                                      // 113
				_id: fileName                                                                                 // 114
			});                                                                                            // 113
		}                                                                                               // 116
                                                                                                  //
		return findOne;                                                                                 // 97
	}();                                                                                             // 97
                                                                                                  //
	_class.prototype.remove = function () {                                                          // 97
		function remove(fileName) {                                                                     // 97
			return this.removeSync({                                                                       // 119
				_id: fileName,                                                                                // 120
				root: this.name                                                                               // 121
			});                                                                                            // 119
		}                                                                                               // 123
                                                                                                  //
		return remove;                                                                                  // 97
	}();                                                                                             // 97
                                                                                                  //
	_class.prototype.createWriteStream = function () {                                               // 97
		function createWriteStream(fileName, contentType) {                                             // 97
			var self = this;                                                                               // 126
			var ws = this.store.createWriteStream({                                                        // 127
				_id: fileName,                                                                                // 128
				filename: fileName,                                                                           // 129
				mode: 'w',                                                                                    // 130
				root: this.name,                                                                              // 131
				content_type: contentType                                                                     // 132
			});                                                                                            // 127
                                                                                                  //
			if (self.transformWrite != null) {                                                             // 134
				ws = RocketChatFile.addPassThrough(ws, function (rs, ws) {                                    // 135
					var file = {                                                                                 // 136
						name: self.name,                                                                            // 137
						fileName: fileName,                                                                         // 138
						contentType: contentType                                                                    // 139
					};                                                                                           // 136
					return self.transformWrite(file, rs, ws);                                                    // 141
				});                                                                                           // 142
			}                                                                                              // 143
                                                                                                  //
			ws.on('close', function () {                                                                   // 144
				return ws.emit('end');                                                                        // 145
			});                                                                                            // 146
			return ws;                                                                                     // 147
		}                                                                                               // 148
                                                                                                  //
		return createWriteStream;                                                                       // 97
	}();                                                                                             // 97
                                                                                                  //
	_class.prototype.createReadStream = function () {                                                // 97
		function createReadStream(fileName) {                                                           // 97
			return this.store.createReadStream({                                                           // 151
				_id: fileName,                                                                                // 152
				root: this.name                                                                               // 153
			});                                                                                            // 151
		}                                                                                               // 155
                                                                                                  //
		return createReadStream;                                                                        // 97
	}();                                                                                             // 97
                                                                                                  //
	_class.prototype.getFileWithReadStream = function () {                                           // 97
		function getFileWithReadStream(fileName) {                                                      // 97
			var file = this.findOne(fileName);                                                             // 158
                                                                                                  //
			if (file == null) {                                                                            // 159
				return null;                                                                                  // 160
			}                                                                                              // 161
                                                                                                  //
			var rs = this.createReadStream(fileName);                                                      // 162
			return {                                                                                       // 163
				readStream: rs,                                                                               // 164
				contentType: file.contentType,                                                                // 165
				length: file.length,                                                                          // 166
				uploadDate: file.uploadDate                                                                   // 167
			};                                                                                             // 163
		}                                                                                               // 169
                                                                                                  //
		return getFileWithReadStream;                                                                   // 97
	}();                                                                                             // 97
                                                                                                  //
	_class.prototype.getFile = function () {                                                         // 97
		function getFile(fileName, cb) {                                                                // 97
			var file = this.getFileWithReadStream(fileName);                                               // 172
                                                                                                  //
			if (!file) {                                                                                   // 173
				return cb();                                                                                  // 174
			}                                                                                              // 175
                                                                                                  //
			var data = [];                                                                                 // 176
			file.readStream.on('data', Meteor.bindEnvironment(function (chunk) {                           // 177
				return data.push(chunk);                                                                      // 178
			}));                                                                                           // 179
			return file.readStream.on('end', Meteor.bindEnvironment(function () {                          // 180
				return cb(null, {                                                                             // 181
					buffer: Buffer.concat(data),                                                                 // 182
					contentType: file.contentType,                                                               // 183
					length: file.length,                                                                         // 184
					uploadDate: file.uploadDate                                                                  // 185
				});                                                                                           // 181
			}));                                                                                           // 187
		}                                                                                               // 188
                                                                                                  //
		return getFile;                                                                                 // 97
	}();                                                                                             // 97
                                                                                                  //
	_class.prototype.deleteFile = function () {                                                      // 97
		function deleteFile(fileName) {                                                                 // 97
			var file = this.findOne(fileName);                                                             // 191
                                                                                                  //
			if (file == null) {                                                                            // 192
				return undefined;                                                                             // 193
			}                                                                                              // 194
                                                                                                  //
			return this.remove(fileName);                                                                  // 195
		}                                                                                               // 196
                                                                                                  //
		return deleteFile;                                                                              // 97
	}();                                                                                             // 97
                                                                                                  //
	return _class;                                                                                   // 97
}();                                                                                              // 97
                                                                                                  //
RocketChatFile.FileSystem = function () {                                                         // 201
	function _class2() {                                                                             // 202
		var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};            // 202
		(0, _classCallCheck3.default)(this, _class2);                                                   // 202
		var _config$absolutePath = config.absolutePath,                                                 // 202
		    absolutePath = _config$absolutePath === undefined ? '~/uploads' : _config$absolutePath;     // 202
		var transformWrite = config.transformWrite;                                                     // 202
		this.transformWrite = transformWrite;                                                           // 206
                                                                                                  //
		if (absolutePath.split(path.sep)[0] === '~') {                                                  // 207
			var homepath = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;            // 208
                                                                                                  //
			if (homepath != null) {                                                                        // 209
				absolutePath = absolutePath.replace('~', homepath);                                           // 210
			} else {                                                                                       // 211
				throw new Error('Unable to resolve "~" in path');                                             // 212
			}                                                                                              // 213
		}                                                                                               // 214
                                                                                                  //
		this.absolutePath = path.resolve(absolutePath);                                                 // 215
		mkdirp.sync(this.absolutePath);                                                                 // 216
		this.statSync = Meteor.wrapAsync(fs.stat.bind(fs));                                             // 217
		this.unlinkSync = Meteor.wrapAsync(fs.unlink.bind(fs));                                         // 218
		this.getFileSync = Meteor.wrapAsync(this.getFile.bind(this));                                   // 219
	}                                                                                                // 220
                                                                                                  //
	_class2.prototype.createWriteStream = function () {                                              // 201
		function createWriteStream(fileName, contentType) {                                             // 201
			var self = this;                                                                               // 223
			var ws = fs.createWriteStream(path.join(this.absolutePath, fileName));                         // 224
                                                                                                  //
			if (self.transformWrite != null) {                                                             // 225
				ws = RocketChatFile.addPassThrough(ws, function (rs, ws) {                                    // 226
					var file = {                                                                                 // 227
						fileName: fileName,                                                                         // 228
						contentType: contentType                                                                    // 229
					};                                                                                           // 227
					return self.transformWrite(file, rs, ws);                                                    // 231
				});                                                                                           // 232
			}                                                                                              // 233
                                                                                                  //
			ws.on('close', function () {                                                                   // 234
				return ws.emit('end');                                                                        // 235
			});                                                                                            // 236
			return ws;                                                                                     // 237
		}                                                                                               // 238
                                                                                                  //
		return createWriteStream;                                                                       // 201
	}();                                                                                             // 201
                                                                                                  //
	_class2.prototype.createReadStream = function () {                                               // 201
		function createReadStream(fileName) {                                                           // 201
			return fs.createReadStream(path.join(this.absolutePath, fileName));                            // 241
		}                                                                                               // 242
                                                                                                  //
		return createReadStream;                                                                        // 201
	}();                                                                                             // 201
                                                                                                  //
	_class2.prototype.stat = function () {                                                           // 201
		function stat(fileName) {                                                                       // 201
			return this.statSync(path.join(this.absolutePath, fileName));                                  // 245
		}                                                                                               // 246
                                                                                                  //
		return stat;                                                                                    // 201
	}();                                                                                             // 201
                                                                                                  //
	_class2.prototype.remove = function () {                                                         // 201
		function remove(fileName) {                                                                     // 201
			return this.unlinkSync(path.join(this.absolutePath, fileName));                                // 249
		}                                                                                               // 250
                                                                                                  //
		return remove;                                                                                  // 201
	}();                                                                                             // 201
                                                                                                  //
	_class2.prototype.getFileWithReadStream = function () {                                          // 201
		function getFileWithReadStream(fileName) {                                                      // 201
			try {                                                                                          // 253
				var stat = this.stat(fileName);                                                               // 254
				var rs = this.createReadStream(fileName);                                                     // 255
				return {                                                                                      // 256
					readStream: rs,                                                                              // 257
					// contentType: file.contentType                                                             // 258
					length: stat.size                                                                            // 259
				};                                                                                            // 256
			} catch (error1) {                                                                             // 261
				return null;                                                                                  // 262
			}                                                                                              // 263
		}                                                                                               // 264
                                                                                                  //
		return getFileWithReadStream;                                                                   // 201
	}();                                                                                             // 201
                                                                                                  //
	_class2.prototype.getFile = function () {                                                        // 201
		function getFile(fileName, cb) {                                                                // 201
			var file = this.getFileWithReadStream(fileName);                                               // 267
                                                                                                  //
			if (!file) {                                                                                   // 268
				return cb();                                                                                  // 269
			}                                                                                              // 270
                                                                                                  //
			var data = [];                                                                                 // 271
			file.readStream.on('data', Meteor.bindEnvironment(function (chunk) {                           // 272
				return data.push(chunk);                                                                      // 273
			}));                                                                                           // 274
			return file.readStream.on('end', Meteor.bindEnvironment(function () {                          // 275
				return {                                                                                      // 276
					buffer: Buffer.concat(data)({                                                                // 277
						contentType: file.contentType,                                                              // 278
						length: file.length,                                                                        // 279
						uploadDate: file.uploadDate                                                                 // 280
					})                                                                                           // 277
				};                                                                                            // 276
			}));                                                                                           // 283
		}                                                                                               // 284
                                                                                                  //
		return getFile;                                                                                 // 201
	}();                                                                                             // 201
                                                                                                  //
	_class2.prototype.deleteFile = function () {                                                     // 201
		function deleteFile(fileName) {                                                                 // 201
			try {                                                                                          // 287
				return this.remove(fileName);                                                                 // 288
			} catch (error1) {                                                                             // 289
				return null;                                                                                  // 290
			}                                                                                              // 291
		}                                                                                               // 292
                                                                                                  //
		return deleteFile;                                                                              // 201
	}();                                                                                             // 201
                                                                                                  //
	return _class2;                                                                                  // 201
}();                                                                                              // 201
////////////////////////////////////////////////////////////////////////////////////////////////////

},"node_modules":{"gridfs-stream":{"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// node_modules/meteor/rocketchat_file/node_modules/gridfs-stream/index.js                        //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
module.exports = exports = require('./lib');

////////////////////////////////////////////////////////////////////////////////////////////////////

}},"mkdirp":{"package.json":function(require,exports){

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// .npm/package/node_modules/mkdirp/package.json                                                  //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
exports.name = "mkdirp";
exports.version = "0.5.1";
exports.main = "index.js";

////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// node_modules/meteor/rocketchat_file/node_modules/mkdirp/index.js                               //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
var path = require('path');
var fs = require('fs');
var _0777 = parseInt('0777', 8);

module.exports = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;

function mkdirP (p, opts, f, made) {
    if (typeof opts === 'function') {
        f = opts;
        opts = {};
    }
    else if (!opts || typeof opts !== 'object') {
        opts = { mode: opts };
    }
    
    var mode = opts.mode;
    var xfs = opts.fs || fs;
    
    if (mode === undefined) {
        mode = _0777 & (~process.umask());
    }
    if (!made) made = null;
    
    var cb = f || function () {};
    p = path.resolve(p);
    
    xfs.mkdir(p, mode, function (er) {
        if (!er) {
            made = made || p;
            return cb(null, made);
        }
        switch (er.code) {
            case 'ENOENT':
                mkdirP(path.dirname(p), opts, function (er, made) {
                    if (er) cb(er, made);
                    else mkdirP(p, opts, cb, made);
                });
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                xfs.stat(p, function (er2, stat) {
                    // if the stat fails, then that's super weird.
                    // let the original error be the failure reason.
                    if (er2 || !stat.isDirectory()) cb(er, made)
                    else cb(null, made);
                });
                break;
        }
    });
}

mkdirP.sync = function sync (p, opts, made) {
    if (!opts || typeof opts !== 'object') {
        opts = { mode: opts };
    }
    
    var mode = opts.mode;
    var xfs = opts.fs || fs;
    
    if (mode === undefined) {
        mode = _0777 & (~process.umask());
    }
    if (!made) made = null;

    p = path.resolve(p);

    try {
        xfs.mkdirSync(p, mode);
        made = made || p;
    }
    catch (err0) {
        switch (err0.code) {
            case 'ENOENT' :
                made = sync(path.dirname(p), opts, made);
                sync(p, opts, made);
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                var stat;
                try {
                    stat = xfs.statSync(p);
                }
                catch (err1) {
                    throw err0;
                }
                if (!stat.isDirectory()) throw err0;
                break;
        }
    }

    return made;
};

////////////////////////////////////////////////////////////////////////////////////////////////////

}},"gm":{"package.json":function(require,exports){

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// .npm/package/node_modules/gm/package.json                                                      //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
exports.name = "gm";
exports.version = "1.23.0";
exports.main = "./index";

////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// node_modules/meteor/rocketchat_file/node_modules/gm/index.js                                   //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //

/**
 * Module dependencies.
 */

var Stream = require('stream').Stream;
var EventEmitter = require('events').EventEmitter;
var util = require('util');

util.inherits(gm, EventEmitter);

/**
 * Constructor.
 *
 * @param {String|Number} path - path to img source or ReadableStream or width of img to create
 * @param {Number} [height] - optional filename of ReadableStream or height of img to create
 * @param {String} [color] - optional hex background color of created img
 */

function gm (source, height, color) {
  var width;

  if (!(this instanceof gm)) {
    return new gm(source, height, color);
  }

  EventEmitter.call(this);

  this._options = {};
  this.options(this.__proto__._options);

  this.data = {};
  this._in = [];
  this._out = [];
  this._outputFormat = null;
  this._subCommand = 'convert';

  if (source instanceof Stream) {
    this.sourceStream = source;
    source = height || 'unknown.jpg';
  } else if (Buffer.isBuffer(source)) {
    this.sourceBuffer = source;
    source = height || 'unknown.jpg';
  } else if (height) {
    // new images
    width = source;
    source = "";

    this.in("-size", width + "x" + height);

    if (color) {
      this.in("xc:"+ color);
    }
  }

  if (typeof source === "string") {
    // then source is a path

    // parse out gif frame brackets from filename
    // since stream doesn't use source path
    // eg. "filename.gif[0]"
    var frames = source.match(/(\[.+\])$/);
    if (frames) {
      this.sourceFrames = source.substr(frames.index, frames[0].length);
      source = source.substr(0, frames.index);
    }
  }

  this.source = source;

  this.addSrcFormatter(function (src) {
    // must be first source formatter

    var inputFromStdin = this.sourceStream || this.sourceBuffer;
    var ret = inputFromStdin ? '-' : this.source;

    if (ret && this.sourceFrames) ret += this.sourceFrames;

    src.length = 0;
    src[0] = ret;
  });
}

/**
 * Subclasses the gm constructor with custom options.
 *
 * @param {options} options
 * @return {gm} the subclasses gm constructor
 */

var parent = gm;
gm.subClass = function subClass (options) {
  function gm (source, height, color) {
    if (!(this instanceof parent)) {
      return new gm(source, height, color);
    }

    parent.call(this, source, height, color);
  }

  gm.prototype.__proto__ = parent.prototype;
  gm.prototype._options = {};
  gm.prototype.options(options);

  return gm;
}

/**
 * Augment the prototype.
 */

require("./lib/options")(gm.prototype);
require("./lib/getters")(gm);
require("./lib/args")(gm.prototype);
require("./lib/drawing")(gm.prototype);
require("./lib/convenience")(gm.prototype);
require("./lib/command")(gm.prototype);
require("./lib/compare")(gm.prototype);
require("./lib/composite")(gm.prototype);
require("./lib/montage")(gm.prototype);

/**
 * Expose.
 */

module.exports = exports = gm;
module.exports.utils = require('./lib/utils');
module.exports.compare = require('./lib/compare')();
module.exports.version = require('./package.json').version;

////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:file/file.server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['rocketchat:file'] = {}, {
  RocketChatFile: RocketChatFile
});

})();

//# sourceMappingURL=rocketchat_file.js.map

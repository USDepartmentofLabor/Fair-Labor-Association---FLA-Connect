(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var RocketChatFile = Package['rocketchat:file'].RocketChatFile;
var Slingshot = Package['edgee:slingshot'].Slingshot;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RocketChatTabBar = Package['rocketchat:lib'].RocketChatTabBar;
var Random = Package.random.Random;
var Accounts = Package['accounts-base'].Accounts;
var _ = Package.underscore._;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;
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
var FileUpload, FileUploadBase, fileUploadHandler;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:file-upload":{"globalFileRestrictions.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/globalFileRestrictions.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var filesize = void 0;                                                                                                 // 1
module.watch(require("filesize"), {                                                                                    // 1
	"default": function (v) {                                                                                             // 1
		filesize = v;                                                                                                        // 1
	}                                                                                                                     // 1
}, 0);                                                                                                                 // 1
var slingShotConfig = {                                                                                                // 5
	authorize: function (file /*, metaContext*/) {                                                                        // 6
		//Deny uploads if user is not logged in.                                                                             // 7
		if (!this.userId) {                                                                                                  // 8
			throw new Meteor.Error('login-required', 'Please login before posting files');                                      // 9
		}                                                                                                                    // 10
                                                                                                                       //
		if (!RocketChat.fileUploadIsValidContentType(file.type)) {                                                           // 12
			throw new Meteor.Error(TAPi18n.__('error-invalid-file-type'));                                                      // 13
		}                                                                                                                    // 14
                                                                                                                       //
		var maxFileSize = RocketChat.settings.get('FileUpload_MaxFileSize');                                                 // 16
                                                                                                                       //
		if (maxFileSize && maxFileSize < file.size) {                                                                        // 18
			throw new Meteor.Error(TAPi18n.__('File_exceeds_allowed_size_of_bytes', {                                           // 19
				size: filesize(maxFileSize)                                                                                        // 19
			}));                                                                                                                // 19
		}                                                                                                                    // 20
                                                                                                                       //
		return true;                                                                                                         // 22
	},                                                                                                                    // 23
	maxSize: 0,                                                                                                           // 24
	allowedFileTypes: null                                                                                                // 25
};                                                                                                                     // 5
Slingshot.fileRestrictions('rocketchat-uploads', slingShotConfig);                                                     // 28
Slingshot.fileRestrictions('rocketchat-uploads-gs', slingShotConfig);                                                  // 29
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"FileUpload.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/lib/FileUpload.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var filesize = void 0;                                                                                                 // 1
module.watch(require("filesize"), {                                                                                    // 1
	"default": function (v) {                                                                                             // 1
		filesize = v;                                                                                                        // 1
	}                                                                                                                     // 1
}, 0);                                                                                                                 // 1
var maxFileSize = 0;                                                                                                   // 6
FileUpload = {                                                                                                         // 8
	validateFileUpload: function (file) {                                                                                 // 9
		if (!Match.test(file.rid, String)) {                                                                                 // 10
			return false;                                                                                                       // 11
		}                                                                                                                    // 12
                                                                                                                       //
		var user = Meteor.user();                                                                                            // 14
		var room = RocketChat.models.Rooms.findOneById(file.rid);                                                            // 15
		var directMessageAllow = RocketChat.settings.get('FileUpload_Enabled_Direct');                                       // 16
		var fileUploadAllowed = RocketChat.settings.get('FileUpload_Enabled');                                               // 17
                                                                                                                       //
		if (RocketChat.authz.canAccessRoom(room, user) !== true) {                                                           // 19
			return false;                                                                                                       // 20
		}                                                                                                                    // 21
                                                                                                                       //
		if (!fileUploadAllowed) {                                                                                            // 23
			var reason = TAPi18n.__('FileUpload_Disabled', user.language);                                                      // 24
                                                                                                                       //
			throw new Meteor.Error('error-file-upload-disabled', reason);                                                       // 25
		}                                                                                                                    // 26
                                                                                                                       //
		if (!directMessageAllow && room.t === 'd') {                                                                         // 28
			var _reason = TAPi18n.__('File_not_allowed_direct_messages', user.language);                                        // 29
                                                                                                                       //
			throw new Meteor.Error('error-direct-message-file-upload-not-allowed', _reason);                                    // 30
		}                                                                                                                    // 31
                                                                                                                       //
		if (file.size > maxFileSize) {                                                                                       // 33
			var _reason2 = TAPi18n.__('File_exceeds_allowed_size_of_bytes', {                                                   // 34
				size: filesize(maxFileSize)                                                                                        // 35
			}, user.language);                                                                                                  // 34
                                                                                                                       //
			throw new Meteor.Error('error-file-too-large', _reason2);                                                           // 37
		}                                                                                                                    // 38
                                                                                                                       //
		if (parseInt(maxFileSize) > 0) {                                                                                     // 40
			if (file.size > maxFileSize) {                                                                                      // 41
				var _reason3 = TAPi18n.__('File_exceeds_allowed_size_of_bytes', {                                                  // 42
					size: filesize(maxFileSize)                                                                                       // 43
				}, user.language);                                                                                                 // 42
                                                                                                                       //
				throw new Meteor.Error('error-file-too-large', _reason3);                                                          // 45
			}                                                                                                                   // 46
		}                                                                                                                    // 47
                                                                                                                       //
		if (!RocketChat.fileUploadIsValidContentType(file.type)) {                                                           // 49
			var _reason4 = TAPi18n.__('File_type_is_not_accepted', user.language);                                              // 50
                                                                                                                       //
			throw new Meteor.Error('error-invalid-file-type', _reason4);                                                        // 51
		}                                                                                                                    // 52
                                                                                                                       //
		return true;                                                                                                         // 54
	}                                                                                                                     // 55
};                                                                                                                     // 8
RocketChat.settings.get('FileUpload_MaxFileSize', function (key, value) {                                              // 58
	maxFileSize = value;                                                                                                  // 59
});                                                                                                                    // 60
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"FileUploadBase.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/lib/FileUploadBase.js                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
/* globals FileUploadBase:true, UploadFS */ /* exported FileUploadBase */UploadFS.config.defaultStorePermissions = new UploadFS.StorePermissions({
	insert: function (userId, doc) {                                                                                      // 5
		return userId || doc && doc.message_id && doc.message_id.indexOf('slack-') === 0; // allow inserts from slackbridge (message_id = slack-timestamp-milli)
	},                                                                                                                    // 7
	update: function (userId, doc) {                                                                                      // 8
		return RocketChat.authz.hasPermission(Meteor.userId(), 'delete-message', doc.rid) || RocketChat.settings.get('Message_AllowDeleting') && userId === doc.userId;
	},                                                                                                                    // 10
	remove: function (userId, doc) {                                                                                      // 11
		return RocketChat.authz.hasPermission(Meteor.userId(), 'delete-message', doc.rid) || RocketChat.settings.get('Message_AllowDeleting') && userId === doc.userId;
	}                                                                                                                     // 13
});                                                                                                                    // 4
                                                                                                                       //
FileUploadBase = function () {                                                                                         // 17
	function FileUploadBase(store, meta, file) {                                                                          // 18
		(0, _classCallCheck3.default)(this, FileUploadBase);                                                                 // 18
		this.id = Random.id();                                                                                               // 19
		this.meta = meta;                                                                                                    // 20
		this.file = file;                                                                                                    // 21
		this.store = store;                                                                                                  // 22
	}                                                                                                                     // 23
                                                                                                                       //
	FileUploadBase.prototype.getProgress = function () {                                                                  // 17
		function getProgress() {}                                                                                            // 17
                                                                                                                       //
		return getProgress;                                                                                                  // 17
	}();                                                                                                                  // 17
                                                                                                                       //
	FileUploadBase.prototype.getFileName = function () {                                                                  // 17
		function getFileName() {                                                                                             // 17
			return this.meta.name;                                                                                              // 30
		}                                                                                                                    // 31
                                                                                                                       //
		return getFileName;                                                                                                  // 17
	}();                                                                                                                  // 17
                                                                                                                       //
	FileUploadBase.prototype.start = function () {                                                                        // 17
		function start(callback) {                                                                                           // 17
			var _this = this;                                                                                                   // 33
                                                                                                                       //
			this.handler = new UploadFS.Uploader({                                                                              // 34
				store: this.store,                                                                                                 // 35
				data: this.file,                                                                                                   // 36
				file: this.meta,                                                                                                   // 37
				onError: function (err) {                                                                                          // 38
					return callback(err);                                                                                             // 39
				},                                                                                                                 // 40
				onComplete: function (fileData) {                                                                                  // 41
					var file = _.pick(fileData, '_id', 'type', 'size', 'name', 'identify', 'description');                            // 42
                                                                                                                       //
					file.url = fileData.url.replace(Meteor.absoluteUrl(), '/');                                                       // 44
					return callback(null, file, _this.store.options.name);                                                            // 45
				}                                                                                                                  // 46
			});                                                                                                                 // 34
                                                                                                                       //
			this.handler.onProgress = function (file, progress) {                                                               // 49
				_this.onProgress(progress);                                                                                        // 50
			};                                                                                                                  // 51
                                                                                                                       //
			return this.handler.start();                                                                                        // 53
		}                                                                                                                    // 54
                                                                                                                       //
		return start;                                                                                                        // 17
	}();                                                                                                                  // 17
                                                                                                                       //
	FileUploadBase.prototype.onProgress = function () {                                                                   // 17
		function onProgress() {}                                                                                             // 17
                                                                                                                       //
		return onProgress;                                                                                                   // 17
	}();                                                                                                                  // 17
                                                                                                                       //
	FileUploadBase.prototype.stop = function () {                                                                         // 17
		function stop() {                                                                                                    // 17
			return this.handler.stop();                                                                                         // 59
		}                                                                                                                    // 60
                                                                                                                       //
		return stop;                                                                                                         // 17
	}();                                                                                                                  // 17
                                                                                                                       //
	return FileUploadBase;                                                                                                // 17
}();                                                                                                                   // 17
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"lib":{"FileUpload.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/server/lib/FileUpload.js                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
var _createClass2 = require("babel-runtime/helpers/createClass");                                                      //
                                                                                                                       //
var _createClass3 = _interopRequireDefault(_createClass2);                                                             //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
module.export({                                                                                                        // 1
	FileUploadClass: function () {                                                                                        // 1
		return FileUploadClass;                                                                                              // 1
	}                                                                                                                     // 1
});                                                                                                                    // 1
var fs = void 0;                                                                                                       // 1
module.watch(require("fs"), {                                                                                          // 1
	"default": function (v) {                                                                                             // 1
		fs = v;                                                                                                              // 1
	}                                                                                                                     // 1
}, 0);                                                                                                                 // 1
var stream = void 0;                                                                                                   // 1
module.watch(require("stream"), {                                                                                      // 1
	"default": function (v) {                                                                                             // 1
		stream = v;                                                                                                          // 1
	}                                                                                                                     // 1
}, 1);                                                                                                                 // 1
var mime = void 0;                                                                                                     // 1
module.watch(require("mime-type/with-db"), {                                                                           // 1
	"default": function (v) {                                                                                             // 1
		mime = v;                                                                                                            // 1
	}                                                                                                                     // 1
}, 2);                                                                                                                 // 1
var Future = void 0;                                                                                                   // 1
module.watch(require("fibers/future"), {                                                                               // 1
	"default": function (v) {                                                                                             // 1
		Future = v;                                                                                                          // 1
	}                                                                                                                     // 1
}, 3);                                                                                                                 // 1
Object.assign(FileUpload, {                                                                                            // 8
	handlers: {},                                                                                                         // 9
	configureUploadsStore: function (store, name, options) {                                                              // 11
		var type = name.split(':').pop();                                                                                    // 12
		var stores = UploadFS.getStores();                                                                                   // 13
		delete stores[name];                                                                                                 // 14
		return new UploadFS.store[store](Object.assign({                                                                     // 16
			name: name                                                                                                          // 17
		}, options, FileUpload["default" + type]()));                                                                        // 16
	},                                                                                                                    // 19
	defaultUploads: function () {                                                                                         // 21
		return {                                                                                                             // 22
			collection: RocketChat.models.Uploads.model,                                                                        // 23
			filter: new UploadFS.Filter({                                                                                       // 24
				onCheck: FileUpload.validateFileUpload                                                                             // 25
			}),                                                                                                                 // 24
			getPath: function (file) {                                                                                          // 27
				return RocketChat.settings.get('uniqueID') + "/uploads/" + file.rid + "/" + file.userId + "/" + file._id;          // 28
			},                                                                                                                  // 29
			// transformWrite: FileUpload.uploadsTransformWrite                                                                 // 30
			onValidate: FileUpload.uploadsOnValidate                                                                            // 31
		};                                                                                                                   // 22
	},                                                                                                                    // 33
	defaultAvatars: function () {                                                                                         // 35
		return {                                                                                                             // 36
			collection: RocketChat.models.Avatars.model,                                                                        // 37
			// filter: new UploadFS.Filter({                                                                                    // 38
			// 	onCheck: FileUpload.validateFileUpload                                                                          // 39
			// }),                                                                                                              // 40
			// transformWrite: FileUpload.avatarTransformWrite,                                                                 // 41
			getPath: function (file) {                                                                                          // 42
				return RocketChat.settings.get('uniqueID') + "/avatars/" + file.userId;                                            // 43
			},                                                                                                                  // 44
			onValidate: FileUpload.avatarsOnValidate,                                                                           // 45
			onFinishUpload: FileUpload.avatarsOnFinishUpload                                                                    // 46
		};                                                                                                                   // 36
	},                                                                                                                    // 48
	avatarTransformWrite: function (readStream, writeStream /*, fileId, file*/) {                                         // 50
		if (RocketChatFile.enabled === false || RocketChat.settings.get('Accounts_AvatarResize') !== true) {                 // 51
			return readStream.pipe(writeStream);                                                                                // 52
		}                                                                                                                    // 53
                                                                                                                       //
		var height = RocketChat.settings.get('Accounts_AvatarSize');                                                         // 54
		var width = height;                                                                                                  // 55
		return RocketChatFile.gm(readStream).background('#ffffff').resize(width, height + "^").gravity('Center').crop(width, height).extent(width, height).stream('jpeg').pipe(writeStream);
	},                                                                                                                    // 57
	avatarsOnValidate: function (file) {                                                                                  // 59
		var _this = this;                                                                                                    // 59
                                                                                                                       //
		if (RocketChatFile.enabled === false || RocketChat.settings.get('Accounts_AvatarResize') !== true) {                 // 60
			return;                                                                                                             // 61
		}                                                                                                                    // 62
                                                                                                                       //
		var tmpFile = UploadFS.getTempFilePath(file._id);                                                                    // 64
		var fut = new Future();                                                                                              // 66
		var height = RocketChat.settings.get('Accounts_AvatarSize');                                                         // 68
		var width = height;                                                                                                  // 69
		RocketChatFile.gm(tmpFile).background('#ffffff').resize(width, height + "^").gravity('Center').crop(width, height).extent(width, height).setFormat('jpeg').write(tmpFile, Meteor.bindEnvironment(function (err) {
			if (err != null) {                                                                                                  // 72
				console.error(err);                                                                                                // 73
			}                                                                                                                   // 74
                                                                                                                       //
			var size = fs.lstatSync(tmpFile).size;                                                                              // 76
                                                                                                                       //
			_this.getCollection().direct.update({                                                                               // 77
				_id: file._id                                                                                                      // 77
			}, {                                                                                                                // 77
				$set: {                                                                                                            // 77
					size: size                                                                                                        // 77
				}                                                                                                                  // 77
			});                                                                                                                 // 77
                                                                                                                       //
			fut.return();                                                                                                       // 78
		}));                                                                                                                 // 79
		return fut.wait();                                                                                                   // 81
	},                                                                                                                    // 82
	uploadsTransformWrite: function (readStream, writeStream, fileId, file) {                                             // 84
		if (RocketChatFile.enabled === false || !/^image\/.+/.test(file.type)) {                                             // 85
			return readStream.pipe(writeStream);                                                                                // 86
		}                                                                                                                    // 87
                                                                                                                       //
		var stream = undefined;                                                                                              // 89
                                                                                                                       //
		var identify = function (err, data) {                                                                                // 91
			if (err) {                                                                                                          // 92
				return stream.pipe(writeStream);                                                                                   // 93
			}                                                                                                                   // 94
                                                                                                                       //
			file.identify = {                                                                                                   // 96
				format: data.format,                                                                                               // 97
				size: data.size                                                                                                    // 98
			};                                                                                                                  // 96
                                                                                                                       //
			if (data.Orientation && !['', 'Unknown', 'Undefined'].includes(data.Orientation)) {                                 // 101
				RocketChatFile.gm(stream).autoOrient().stream().pipe(writeStream);                                                 // 102
			} else {                                                                                                            // 103
				stream.pipe(writeStream);                                                                                          // 104
			}                                                                                                                   // 105
		};                                                                                                                   // 106
                                                                                                                       //
		stream = RocketChatFile.gm(readStream).identify(identify).stream();                                                  // 108
	},                                                                                                                    // 109
	uploadsOnValidate: function (file) {                                                                                  // 111
		var _this2 = this;                                                                                                   // 111
                                                                                                                       //
		if (RocketChatFile.enabled === false || !/^image\/((x-windows-)?bmp|p?jpeg|png)$/.test(file.type)) {                 // 112
			return;                                                                                                             // 113
		}                                                                                                                    // 114
                                                                                                                       //
		var tmpFile = UploadFS.getTempFilePath(file._id);                                                                    // 116
		var fut = new Future();                                                                                              // 118
		var identify = Meteor.bindEnvironment(function (err, data) {                                                         // 120
			if (err != null) {                                                                                                  // 121
				console.error(err);                                                                                                // 122
				return fut.return();                                                                                               // 123
			}                                                                                                                   // 124
                                                                                                                       //
			file.identify = {                                                                                                   // 126
				format: data.format,                                                                                               // 127
				size: data.size                                                                                                    // 128
			};                                                                                                                  // 126
                                                                                                                       //
			if ([null, undefined, '', 'Unknown', 'Undefined'].includes(data.Orientation)) {                                     // 131
				return fut.return();                                                                                               // 132
			}                                                                                                                   // 133
                                                                                                                       //
			RocketChatFile.gm(tmpFile).autoOrient().write(tmpFile, Meteor.bindEnvironment(function (err) {                      // 135
				if (err != null) {                                                                                                 // 136
					console.error(err);                                                                                               // 137
				}                                                                                                                  // 138
                                                                                                                       //
				var size = fs.lstatSync(tmpFile).size;                                                                             // 140
                                                                                                                       //
				_this2.getCollection().direct.update({                                                                             // 141
					_id: file._id                                                                                                     // 141
				}, {                                                                                                               // 141
					$set: {                                                                                                           // 141
						size: size                                                                                                       // 141
					}                                                                                                                 // 141
				});                                                                                                                // 141
                                                                                                                       //
				fut.return();                                                                                                      // 142
			}));                                                                                                                // 143
		});                                                                                                                  // 144
		RocketChatFile.gm(tmpFile).identify(identify);                                                                       // 146
		return fut.wait();                                                                                                   // 148
	},                                                                                                                    // 149
	avatarsOnFinishUpload: function (file) {                                                                              // 151
		// update file record to match user's username                                                                       // 152
		var user = RocketChat.models.Users.findOneById(file.userId);                                                         // 153
		var oldAvatar = RocketChat.models.Avatars.findOneByName(user.username);                                              // 154
                                                                                                                       //
		if (oldAvatar) {                                                                                                     // 155
			RocketChat.models.Avatars.deleteFile(oldAvatar._id);                                                                // 156
		}                                                                                                                    // 157
                                                                                                                       //
		RocketChat.models.Avatars.updateFileNameById(file._id, user.username); // console.log('upload finished ->', file);   // 158
	},                                                                                                                    // 160
	addExtensionTo: function (file) {                                                                                     // 162
		if (mime.lookup(file.name) === file.type) {                                                                          // 163
			return file;                                                                                                        // 164
		}                                                                                                                    // 165
                                                                                                                       //
		var ext = mime.extension(file.type);                                                                                 // 167
                                                                                                                       //
		if (ext && false === new RegExp("." + ext + "$", 'i').test(file.name)) {                                             // 168
			file.name = file.name + "." + ext;                                                                                  // 169
		}                                                                                                                    // 170
                                                                                                                       //
		return file;                                                                                                         // 172
	},                                                                                                                    // 173
	getStore: function (modelName) {                                                                                      // 175
		var storageType = RocketChat.settings.get('FileUpload_Storage_Type');                                                // 176
		var handlerName = storageType + ":" + modelName;                                                                     // 177
		return this.getStoreByName(handlerName);                                                                             // 179
	},                                                                                                                    // 180
	getStoreByName: function (handlerName) {                                                                              // 182
		if (this.handlers[handlerName] == null) {                                                                            // 183
			console.error("Upload handler \"" + handlerName + "\" does not exists");                                            // 184
		}                                                                                                                    // 185
                                                                                                                       //
		return this.handlers[handlerName];                                                                                   // 187
	},                                                                                                                    // 188
	get: function (file, req, res, next) {                                                                                // 190
		if (file.store && this.handlers && this.handlers[file.store] && this.handlers[file.store].get) {                     // 191
			this.handlers[file.store].get(file, req, res, next);                                                                // 192
		} else {                                                                                                             // 193
			res.writeHead(404);                                                                                                 // 194
			res.end();                                                                                                          // 195
			return;                                                                                                             // 196
		}                                                                                                                    // 197
	}                                                                                                                     // 198
});                                                                                                                    // 8
                                                                                                                       //
var FileUploadClass = function () {                                                                                    //
	function FileUploadClass(_ref) {                                                                                      // 203
		var name = _ref.name,                                                                                                // 203
		    model = _ref.model,                                                                                              // 203
		    store = _ref.store,                                                                                              // 203
		    get = _ref.get,                                                                                                  // 203
		    insert = _ref.insert,                                                                                            // 203
		    getStore = _ref.getStore;                                                                                        // 203
		(0, _classCallCheck3.default)(this, FileUploadClass);                                                                // 203
		this.name = name;                                                                                                    // 204
		this.model = model || this.getModelFromName();                                                                       // 205
		this._store = store || UploadFS.getStore(name);                                                                      // 206
		this.get = get;                                                                                                      // 207
                                                                                                                       //
		if (insert) {                                                                                                        // 209
			this.insert = insert;                                                                                               // 210
		}                                                                                                                    // 211
                                                                                                                       //
		if (getStore) {                                                                                                      // 213
			this.getStore = getStore;                                                                                           // 214
		}                                                                                                                    // 215
                                                                                                                       //
		FileUpload.handlers[name] = this;                                                                                    // 217
	}                                                                                                                     // 218
                                                                                                                       //
	FileUploadClass.prototype.getStore = function () {                                                                    //
		function getStore() {                                                                                                //
			return this._store;                                                                                                 // 221
		}                                                                                                                    // 222
                                                                                                                       //
		return getStore;                                                                                                     //
	}();                                                                                                                  //
                                                                                                                       //
	FileUploadClass.prototype.getModelFromName = function () {                                                            //
		function getModelFromName() {                                                                                        //
			return RocketChat.models[this.name.split(':')[1]];                                                                  // 233
		}                                                                                                                    // 234
                                                                                                                       //
		return getModelFromName;                                                                                             //
	}();                                                                                                                  //
                                                                                                                       //
	FileUploadClass.prototype.delete = function () {                                                                      //
		function _delete(fileId) {                                                                                           //
			if (this.store && this.store.delete) {                                                                              // 237
				this.store.delete(fileId);                                                                                         // 238
			}                                                                                                                   // 239
                                                                                                                       //
			return this.model.deleteFile(fileId);                                                                               // 241
		}                                                                                                                    // 242
                                                                                                                       //
		return _delete;                                                                                                      //
	}();                                                                                                                  //
                                                                                                                       //
	FileUploadClass.prototype.deleteById = function () {                                                                  //
		function deleteById(fileId) {                                                                                        //
			var file = this.model.findOneById(fileId);                                                                          // 245
                                                                                                                       //
			if (!file) {                                                                                                        // 247
				return;                                                                                                            // 248
			}                                                                                                                   // 249
                                                                                                                       //
			var store = FileUpload.getStoreByName(file.store);                                                                  // 251
			return store.delete(file._id);                                                                                      // 253
		}                                                                                                                    // 254
                                                                                                                       //
		return deleteById;                                                                                                   //
	}();                                                                                                                  //
                                                                                                                       //
	FileUploadClass.prototype.deleteByName = function () {                                                                //
		function deleteByName(fileName) {                                                                                    //
			var file = this.model.findOneByName(fileName);                                                                      // 257
                                                                                                                       //
			if (!file) {                                                                                                        // 259
				return;                                                                                                            // 260
			}                                                                                                                   // 261
                                                                                                                       //
			var store = FileUpload.getStoreByName(file.store);                                                                  // 263
			return store.delete(file._id);                                                                                      // 265
		}                                                                                                                    // 266
                                                                                                                       //
		return deleteByName;                                                                                                 //
	}();                                                                                                                  //
                                                                                                                       //
	FileUploadClass.prototype.insert = function () {                                                                      //
		function insert(fileData, streamOrBuffer, cb) {                                                                      //
			var fileId = this.store.create(fileData);                                                                           // 269
			var token = this.store.createToken(fileId);                                                                         // 270
			var tmpFile = UploadFS.getTempFilePath(fileId);                                                                     // 271
                                                                                                                       //
			try {                                                                                                               // 273
				if (streamOrBuffer instanceof stream) {                                                                            // 274
					streamOrBuffer.pipe(fs.createWriteStream(tmpFile));                                                               // 275
				} else if (streamOrBuffer instanceof Buffer) {                                                                     // 276
					fs.writeFileSync(tmpFile, streamOrBuffer);                                                                        // 277
				} else {                                                                                                           // 278
					throw new Error('Invalid file type');                                                                             // 279
				}                                                                                                                  // 280
                                                                                                                       //
				var file = Meteor.call('ufsComplete', fileId, this.name, token);                                                   // 282
                                                                                                                       //
				if (cb) {                                                                                                          // 284
					cb(null, file);                                                                                                   // 285
				}                                                                                                                  // 286
                                                                                                                       //
				return file;                                                                                                       // 288
			} catch (e) {                                                                                                       // 289
				if (cb) {                                                                                                          // 290
					cb(e);                                                                                                            // 291
				} else {                                                                                                           // 292
					throw e;                                                                                                          // 293
				}                                                                                                                  // 294
			}                                                                                                                   // 295
		}                                                                                                                    // 296
                                                                                                                       //
		return insert;                                                                                                       //
	}();                                                                                                                  //
                                                                                                                       //
	(0, _createClass3.default)(FileUploadClass, [{                                                                        //
		key: "store",                                                                                                        //
		get: function () {                                                                                                   //
			return this.getStore();                                                                                             // 225
		},                                                                                                                   // 226
		set: function (store) {                                                                                              //
			this._store = store;                                                                                                // 229
		}                                                                                                                    // 230
	}]);                                                                                                                  //
	return FileUploadClass;                                                                                               //
}();                                                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"proxy.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/server/lib/proxy.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var http = void 0;                                                                                                     // 1
module.watch(require("http"), {                                                                                        // 1
	"default": function (v) {                                                                                             // 1
		http = v;                                                                                                            // 1
	}                                                                                                                     // 1
}, 0);                                                                                                                 // 1
var URL = void 0;                                                                                                      // 1
module.watch(require("url"), {                                                                                         // 1
	"default": function (v) {                                                                                             // 1
		URL = v;                                                                                                             // 1
	}                                                                                                                     // 1
}, 1);                                                                                                                 // 1
var logger = new Logger('UploadProxy');                                                                                // 6
WebApp.connectHandlers.stack.unshift({                                                                                 // 8
	route: '',                                                                                                            // 9
	handle: Meteor.bindEnvironment(function (req, res, next) {                                                            // 10
		// Quick check to see if request should be catch                                                                     // 11
		if (req.url.indexOf(UploadFS.config.storesPath) === -1) {                                                            // 12
			return next();                                                                                                      // 13
		}                                                                                                                    // 14
                                                                                                                       //
		logger.debug('Upload URL:', req.url);                                                                                // 16
                                                                                                                       //
		if (req.method !== 'POST') {                                                                                         // 18
			return next();                                                                                                      // 19
		} // Remove store path                                                                                               // 20
                                                                                                                       //
                                                                                                                       //
		var parsedUrl = URL.parse(req.url);                                                                                  // 23
		var path = parsedUrl.pathname.substr(UploadFS.config.storesPath.length + 1); // Get store                            // 24
                                                                                                                       //
		var regExp = new RegExp('^\/([^\/\?]+)\/([^\/\?]+)$');                                                               // 27
		var match = regExp.exec(path); // Request is not valid                                                               // 28
                                                                                                                       //
		if (match === null) {                                                                                                // 31
			res.writeHead(400);                                                                                                 // 32
			res.end();                                                                                                          // 33
			return;                                                                                                             // 34
		} // Get store                                                                                                       // 35
                                                                                                                       //
                                                                                                                       //
		var store = UploadFS.getStore(match[1]);                                                                             // 38
                                                                                                                       //
		if (!store) {                                                                                                        // 39
			res.writeHead(404);                                                                                                 // 40
			res.end();                                                                                                          // 41
			return;                                                                                                             // 42
		} // Get file                                                                                                        // 43
                                                                                                                       //
                                                                                                                       //
		var fileId = match[2];                                                                                               // 46
		var file = store.getCollection().findOne({                                                                           // 47
			_id: fileId                                                                                                         // 47
		});                                                                                                                  // 47
                                                                                                                       //
		if (file === undefined) {                                                                                            // 48
			res.writeHead(404);                                                                                                 // 49
			res.end();                                                                                                          // 50
			return;                                                                                                             // 51
		}                                                                                                                    // 52
                                                                                                                       //
		if (file.instanceId === InstanceStatus.id()) {                                                                       // 54
			logger.debug('Correct instance');                                                                                   // 55
			return next();                                                                                                      // 56
		} // Proxy to other instance                                                                                         // 57
                                                                                                                       //
                                                                                                                       //
		var instance = InstanceStatus.getCollection().findOne({                                                              // 60
			_id: file.instanceId                                                                                                // 60
		});                                                                                                                  // 60
                                                                                                                       //
		if (instance == null) {                                                                                              // 62
			res.writeHead(404);                                                                                                 // 63
			res.end();                                                                                                          // 64
			return;                                                                                                             // 65
		}                                                                                                                    // 66
                                                                                                                       //
		if (instance.extraInformation.host === process.env.INSTANCE_IP && RocketChat.isDocker() === false) {                 // 68
			instance.extraInformation.host = 'localhost';                                                                       // 69
		}                                                                                                                    // 70
                                                                                                                       //
		logger.debug('Wrong instance, proxing to:', instance.extraInformation.host + ":" + instance.extraInformation.port);  // 72
		var options = {                                                                                                      // 74
			hostname: instance.extraInformation.host,                                                                           // 75
			port: instance.extraInformation.port,                                                                               // 76
			path: req.url,                                                                                                      // 77
			method: 'POST'                                                                                                      // 78
		};                                                                                                                   // 74
		var proxy = http.request(options, function (proxy_res) {                                                             // 81
			proxy_res.pipe(res, {                                                                                               // 82
				end: true                                                                                                          // 83
			});                                                                                                                 // 82
		});                                                                                                                  // 85
		req.pipe(proxy, {                                                                                                    // 87
			end: true                                                                                                           // 88
		});                                                                                                                  // 87
	})                                                                                                                    // 90
});                                                                                                                    // 8
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"requests.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/server/lib/requests.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var Cookies = void 0;                                                                                                  // 1
module.watch(require("meteor/ostrio:cookies"), {                                                                       // 1
	Cookies: function (v) {                                                                                               // 1
		Cookies = v;                                                                                                         // 1
	}                                                                                                                     // 1
}, 0);                                                                                                                 // 1
var protectedFiles = void 0;                                                                                           // 4
RocketChat.settings.get('FileUpload_ProtectFiles', function (key, value) {                                             // 6
	protectedFiles = value;                                                                                               // 7
});                                                                                                                    // 8
WebApp.connectHandlers.use(__meteor_runtime_config__.ROOT_URL_PATH_PREFIX + "/file-upload/", function (req, res, next) {
	var match = /^\/([^\/]+)\/(.*)/.exec(req.url);                                                                        // 12
                                                                                                                       //
	if (match[1]) {                                                                                                       // 14
		var file = RocketChat.models.Uploads.findOneById(match[1]);                                                          // 15
                                                                                                                       //
		if (file) {                                                                                                          // 17
			if (!Meteor.settings.public.sandstorm && protectedFiles) {                                                          // 18
				var rawCookies = void 0;                                                                                           // 19
				var token = void 0;                                                                                                // 20
				var uid = void 0;                                                                                                  // 21
				var cookie = new Cookies();                                                                                        // 22
                                                                                                                       //
				if (req.headers && req.headers.cookie != null) {                                                                   // 24
					rawCookies = req.headers.cookie;                                                                                  // 25
				}                                                                                                                  // 26
                                                                                                                       //
				if (rawCookies != null) {                                                                                          // 28
					uid = cookie.get('rc_uid', rawCookies);                                                                           // 29
				}                                                                                                                  // 30
                                                                                                                       //
				if (rawCookies != null) {                                                                                          // 32
					token = cookie.get('rc_token', rawCookies);                                                                       // 33
				}                                                                                                                  // 34
                                                                                                                       //
				if (uid == null) {                                                                                                 // 36
					uid = req.query.rc_uid;                                                                                           // 37
					token = req.query.rc_token;                                                                                       // 38
				}                                                                                                                  // 39
                                                                                                                       //
				if (!(uid && token && RocketChat.models.Users.findOneByIdAndLoginToken(uid, token))) {                             // 41
					res.writeHead(403);                                                                                               // 42
					res.end();                                                                                                        // 43
					return false;                                                                                                     // 44
				}                                                                                                                  // 45
			}                                                                                                                   // 46
                                                                                                                       //
			res.setHeader('Content-Security-Policy', 'default-src \'none\'');                                                   // 48
			return FileUpload.get(file, req, res, next);                                                                        // 50
		}                                                                                                                    // 51
	}                                                                                                                     // 52
                                                                                                                       //
	res.writeHead(404);                                                                                                   // 54
	res.end();                                                                                                            // 55
	return;                                                                                                               // 56
});                                                                                                                    // 57
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"config":{"_configUploadStorage.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/server/config/_configUploadStorage.js                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("./AmazonS3.js"));                                                                                // 1
module.watch(require("./FileSystem.js"));                                                                              // 1
module.watch(require("./GoogleStorage.js"));                                                                           // 1
module.watch(require("./GridFS.js"));                                                                                  // 1
module.watch(require("./Slingshot_DEPRECATED.js"));                                                                    // 1
                                                                                                                       //
var configStore = _.debounce(function () {                                                                             // 9
	var store = RocketChat.settings.get('FileUpload_Storage_Type');                                                       // 10
                                                                                                                       //
	if (store) {                                                                                                          // 12
		console.log('Setting default file store to', store);                                                                 // 13
		UploadFS.getStores().Avatars = UploadFS.getStore(store + ":Avatars");                                                // 14
		UploadFS.getStores().Uploads = UploadFS.getStore(store + ":Uploads");                                                // 15
	}                                                                                                                     // 16
}, 1000);                                                                                                              // 17
                                                                                                                       //
RocketChat.settings.get(/^FileUpload_/, configStore);                                                                  // 19
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"AmazonS3.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/server/config/AmazonS3.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var FileUploadClass = void 0;                                                                                          // 1
module.watch(require("../lib/FileUpload"), {                                                                           // 1
	FileUploadClass: function (v) {                                                                                       // 1
		FileUploadClass = v;                                                                                                 // 1
	}                                                                                                                     // 1
}, 0);                                                                                                                 // 1
module.watch(require("../../ufs/AmazonS3/server.js"));                                                                 // 1
                                                                                                                       //
var get = function (file, req, res) {                                                                                  // 6
	var fileUrl = this.store.getRedirectURL(file);                                                                        // 7
                                                                                                                       //
	if (fileUrl) {                                                                                                        // 9
		res.setHeader('Location', fileUrl);                                                                                  // 10
		res.writeHead(302);                                                                                                  // 11
	}                                                                                                                     // 12
                                                                                                                       //
	res.end();                                                                                                            // 13
};                                                                                                                     // 14
                                                                                                                       //
var AmazonS3Uploads = new FileUploadClass({                                                                            // 16
	name: 'AmazonS3:Uploads',                                                                                             // 17
	get: get // store setted bellow                                                                                       // 18
                                                                                                                       //
});                                                                                                                    // 16
var AmazonS3Avatars = new FileUploadClass({                                                                            // 22
	name: 'AmazonS3:Avatars',                                                                                             // 23
	get: get // store setted bellow                                                                                       // 24
                                                                                                                       //
});                                                                                                                    // 22
                                                                                                                       //
var configure = _.debounce(function () {                                                                               // 28
	var Bucket = RocketChat.settings.get('FileUpload_S3_Bucket');                                                         // 29
	var Acl = RocketChat.settings.get('FileUpload_S3_Acl');                                                               // 30
	var AWSAccessKeyId = RocketChat.settings.get('FileUpload_S3_AWSAccessKeyId');                                         // 31
	var AWSSecretAccessKey = RocketChat.settings.get('FileUpload_S3_AWSSecretAccessKey');                                 // 32
	var URLExpiryTimeSpan = RocketChat.settings.get('FileUpload_S3_URLExpiryTimeSpan');                                   // 33
	var Region = RocketChat.settings.get('FileUpload_S3_Region');                                                         // 34
	var SignatureVersion = RocketChat.settings.get('FileUpload_S3_SignatureVersion');                                     // 35
	var ForcePathStyle = RocketChat.settings.get('FileUpload_S3_ForcePathStyle'); // const CDN = RocketChat.settings.get('FileUpload_S3_CDN');
                                                                                                                       //
	var BucketURL = RocketChat.settings.get('FileUpload_S3_BucketURL');                                                   // 38
                                                                                                                       //
	if (!Bucket || !AWSAccessKeyId || !AWSSecretAccessKey) {                                                              // 40
		return;                                                                                                              // 41
	}                                                                                                                     // 42
                                                                                                                       //
	var config = {                                                                                                        // 44
		connection: {                                                                                                        // 45
			accessKeyId: AWSAccessKeyId,                                                                                        // 46
			secretAccessKey: AWSSecretAccessKey,                                                                                // 47
			signatureVersion: SignatureVersion,                                                                                 // 48
			s3ForcePathStyle: ForcePathStyle,                                                                                   // 49
			params: {                                                                                                           // 50
				Bucket: Bucket,                                                                                                    // 51
				ACL: Acl                                                                                                           // 52
			},                                                                                                                  // 50
			region: Region                                                                                                      // 54
		},                                                                                                                   // 45
		URLExpiryTimeSpan: URLExpiryTimeSpan                                                                                 // 56
	};                                                                                                                    // 44
                                                                                                                       //
	if (BucketURL) {                                                                                                      // 59
		config.connection.endpoint = BucketURL;                                                                              // 60
	}                                                                                                                     // 61
                                                                                                                       //
	AmazonS3Uploads.store = FileUpload.configureUploadsStore('AmazonS3', AmazonS3Uploads.name, config);                   // 63
	AmazonS3Avatars.store = FileUpload.configureUploadsStore('AmazonS3', AmazonS3Avatars.name, config);                   // 64
}, 500);                                                                                                               // 65
                                                                                                                       //
RocketChat.settings.get(/^FileUpload_S3_/, configure);                                                                 // 67
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"FileSystem.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/server/config/FileSystem.js                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var fs = void 0;                                                                                                       // 1
module.watch(require("fs"), {                                                                                          // 1
	"default": function (v) {                                                                                             // 1
		fs = v;                                                                                                              // 1
	}                                                                                                                     // 1
}, 0);                                                                                                                 // 1
var FileUploadClass = void 0;                                                                                          // 1
module.watch(require("../lib/FileUpload"), {                                                                           // 1
	FileUploadClass: function (v) {                                                                                       // 1
		FileUploadClass = v;                                                                                                 // 1
	}                                                                                                                     // 1
}, 1);                                                                                                                 // 1
var FileSystemUploads = new FileUploadClass({                                                                          // 6
	name: 'FileSystem:Uploads',                                                                                           // 7
	// store setted bellow                                                                                                // 8
	get: function (file, req, res) {                                                                                      // 10
		var filePath = this.store.getFilePath(file._id, file);                                                               // 11
                                                                                                                       //
		try {                                                                                                                // 13
			var stat = Meteor.wrapAsync(fs.stat)(filePath);                                                                     // 14
                                                                                                                       //
			if (stat && stat.isFile()) {                                                                                        // 16
				file = FileUpload.addExtensionTo(file);                                                                            // 17
				res.setHeader('Content-Disposition', "attachment; filename*=UTF-8''" + encodeURIComponent(file.name));             // 18
				res.setHeader('Last-Modified', file.uploadedAt.toUTCString());                                                     // 19
				res.setHeader('Content-Type', file.type);                                                                          // 20
				res.setHeader('Content-Length', file.size);                                                                        // 21
				this.store.getReadStream(file._id, file).pipe(res);                                                                // 23
			}                                                                                                                   // 24
		} catch (e) {                                                                                                        // 25
			res.writeHead(404);                                                                                                 // 26
			res.end();                                                                                                          // 27
			return;                                                                                                             // 28
		}                                                                                                                    // 29
	}                                                                                                                     // 30
});                                                                                                                    // 6
var FileSystemAvatars = new FileUploadClass({                                                                          // 33
	name: 'FileSystem:Avatars',                                                                                           // 34
	// store setted bellow                                                                                                // 35
	get: function (file, req, res) {                                                                                      // 37
		var reqModifiedHeader = req.headers['if-modified-since'];                                                            // 38
                                                                                                                       //
		if (reqModifiedHeader) {                                                                                             // 39
			if (reqModifiedHeader === (file.uploadedAt && file.uploadedAt.toUTCString())) {                                     // 40
				res.setHeader('Last-Modified', reqModifiedHeader);                                                                 // 41
				res.writeHead(304);                                                                                                // 42
				res.end();                                                                                                         // 43
				return;                                                                                                            // 44
			}                                                                                                                   // 45
		}                                                                                                                    // 46
                                                                                                                       //
		var filePath = this.store.getFilePath(file._id, file);                                                               // 48
                                                                                                                       //
		try {                                                                                                                // 50
			var stat = Meteor.wrapAsync(fs.stat)(filePath);                                                                     // 51
                                                                                                                       //
			if (stat && stat.isFile()) {                                                                                        // 53
				file = FileUpload.addExtensionTo(file);                                                                            // 54
				res.setHeader('Content-Disposition', 'inline');                                                                    // 55
				res.setHeader('Last-Modified', file.uploadedAt.toUTCString());                                                     // 56
				res.setHeader('Content-Type', file.type);                                                                          // 57
				res.setHeader('Content-Length', file.size);                                                                        // 58
				this.store.getReadStream(file._id, file).pipe(res);                                                                // 60
			}                                                                                                                   // 61
		} catch (e) {                                                                                                        // 62
			res.writeHead(404);                                                                                                 // 63
			res.end();                                                                                                          // 64
			return;                                                                                                             // 65
		}                                                                                                                    // 66
	}                                                                                                                     // 67
});                                                                                                                    // 33
                                                                                                                       //
var createFileSystemStore = _.debounce(function () {                                                                   // 71
	var options = {                                                                                                       // 72
		path: RocketChat.settings.get('FileUpload_FileSystemPath') //'/tmp/uploads/photos',                                  // 73
                                                                                                                       //
	};                                                                                                                    // 72
	FileSystemUploads.store = FileUpload.configureUploadsStore('Local', FileSystemUploads.name, options);                 // 76
	FileSystemAvatars.store = FileUpload.configureUploadsStore('Local', FileSystemAvatars.name, options); // DEPRECATED backwards compatibililty (remove)
                                                                                                                       //
	UploadFS.getStores()['fileSystem'] = UploadFS.getStores()[FileSystemUploads.name];                                    // 80
}, 500);                                                                                                               // 81
                                                                                                                       //
RocketChat.settings.get('FileUpload_FileSystemPath', createFileSystemStore);                                           // 83
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"GoogleStorage.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/server/config/GoogleStorage.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var FileUploadClass = void 0;                                                                                          // 1
module.watch(require("../lib/FileUpload"), {                                                                           // 1
	FileUploadClass: function (v) {                                                                                       // 1
		FileUploadClass = v;                                                                                                 // 1
	}                                                                                                                     // 1
}, 0);                                                                                                                 // 1
module.watch(require("../../ufs/GoogleStorage/server.js"));                                                            // 1
                                                                                                                       //
var get = function (file, req, res) {                                                                                  // 7
	this.store.getRedirectURL(file, function (err, fileUrl) {                                                             // 8
		if (err) {                                                                                                           // 9
			console.error(err);                                                                                                 // 10
		}                                                                                                                    // 11
                                                                                                                       //
		if (fileUrl) {                                                                                                       // 13
			res.setHeader('Location', fileUrl);                                                                                 // 14
			res.writeHead(302);                                                                                                 // 15
		}                                                                                                                    // 16
                                                                                                                       //
		res.end();                                                                                                           // 17
	});                                                                                                                   // 18
};                                                                                                                     // 19
                                                                                                                       //
var GoogleCloudStorageUploads = new FileUploadClass({                                                                  // 21
	name: 'GoogleCloudStorage:Uploads',                                                                                   // 22
	get: get // store setted bellow                                                                                       // 23
                                                                                                                       //
});                                                                                                                    // 21
var GoogleCloudStorageAvatars = new FileUploadClass({                                                                  // 27
	name: 'GoogleCloudStorage:Avatars',                                                                                   // 28
	get: get // store setted bellow                                                                                       // 29
                                                                                                                       //
});                                                                                                                    // 27
                                                                                                                       //
var configure = _.debounce(function () {                                                                               // 33
	var bucket = RocketChat.settings.get('FileUpload_GoogleStorage_Bucket');                                              // 34
	var accessId = RocketChat.settings.get('FileUpload_GoogleStorage_AccessId');                                          // 35
	var secret = RocketChat.settings.get('FileUpload_GoogleStorage_Secret');                                              // 36
	var URLExpiryTimeSpan = RocketChat.settings.get('FileUpload_S3_URLExpiryTimeSpan');                                   // 37
                                                                                                                       //
	if (!bucket || !accessId || !secret) {                                                                                // 39
		return;                                                                                                              // 40
	}                                                                                                                     // 41
                                                                                                                       //
	var config = {                                                                                                        // 43
		connection: {                                                                                                        // 44
			credentials: {                                                                                                      // 45
				client_email: accessId,                                                                                            // 46
				private_key: secret                                                                                                // 47
			}                                                                                                                   // 45
		},                                                                                                                   // 44
		bucket: bucket,                                                                                                      // 50
		URLExpiryTimeSpan: URLExpiryTimeSpan                                                                                 // 51
	};                                                                                                                    // 43
	GoogleCloudStorageUploads.store = FileUpload.configureUploadsStore('GoogleStorage', GoogleCloudStorageUploads.name, config);
	GoogleCloudStorageAvatars.store = FileUpload.configureUploadsStore('GoogleStorage', GoogleCloudStorageAvatars.name, config);
}, 500);                                                                                                               // 56
                                                                                                                       //
RocketChat.settings.get(/^FileUpload_GoogleStorage_/, configure);                                                      // 58
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"GridFS.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/server/config/GridFS.js                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var stream = void 0;                                                                                                   // 1
module.watch(require("stream"), {                                                                                      // 1
	"default": function (v) {                                                                                             // 1
		stream = v;                                                                                                          // 1
	}                                                                                                                     // 1
}, 0);                                                                                                                 // 1
var zlib = void 0;                                                                                                     // 1
module.watch(require("zlib"), {                                                                                        // 1
	"default": function (v) {                                                                                             // 1
		zlib = v;                                                                                                            // 1
	}                                                                                                                     // 1
}, 1);                                                                                                                 // 1
var util = void 0;                                                                                                     // 1
module.watch(require("util"), {                                                                                        // 1
	"default": function (v) {                                                                                             // 1
		util = v;                                                                                                            // 1
	}                                                                                                                     // 1
}, 2);                                                                                                                 // 1
var FileUploadClass = void 0;                                                                                          // 1
module.watch(require("../lib/FileUpload"), {                                                                           // 1
	FileUploadClass: function (v) {                                                                                       // 1
		FileUploadClass = v;                                                                                                 // 1
	}                                                                                                                     // 1
}, 3);                                                                                                                 // 1
var Cookies = void 0;                                                                                                  // 1
module.watch(require("meteor/ostrio:cookies"), {                                                                       // 1
	Cookies: function (v) {                                                                                               // 1
		Cookies = v;                                                                                                         // 1
	}                                                                                                                     // 1
}, 4);                                                                                                                 // 1
var cookie = new Cookies();                                                                                            // 9
var logger = new Logger('FileUpload');                                                                                 // 11
                                                                                                                       //
function ExtractRange(options) {                                                                                       // 13
	if (!(this instanceof ExtractRange)) {                                                                                // 14
		return new ExtractRange(options);                                                                                    // 15
	}                                                                                                                     // 16
                                                                                                                       //
	this.start = options.start;                                                                                           // 18
	this.stop = options.stop;                                                                                             // 19
	this.bytes_read = 0;                                                                                                  // 20
	stream.Transform.call(this, options);                                                                                 // 22
}                                                                                                                      // 23
                                                                                                                       //
util.inherits(ExtractRange, stream.Transform);                                                                         // 24
                                                                                                                       //
ExtractRange.prototype._transform = function (chunk, enc, cb) {                                                        // 27
	if (this.bytes_read > this.stop) {                                                                                    // 28
		// done reading                                                                                                      // 29
		this.end();                                                                                                          // 30
	} else if (this.bytes_read + chunk.length < this.start) {// this chunk is still before the start byte                 // 31
	} else {                                                                                                              // 33
		var start = void 0;                                                                                                  // 34
		var stop = void 0;                                                                                                   // 35
                                                                                                                       //
		if (this.start <= this.bytes_read) {                                                                                 // 37
			start = 0;                                                                                                          // 38
		} else {                                                                                                             // 39
			start = this.start - this.bytes_read;                                                                               // 40
		}                                                                                                                    // 41
                                                                                                                       //
		if (this.stop - this.bytes_read + 1 < chunk.length) {                                                                // 42
			stop = this.stop - this.bytes_read + 1;                                                                             // 43
		} else {                                                                                                             // 44
			stop = chunk.length;                                                                                                // 45
		}                                                                                                                    // 46
                                                                                                                       //
		var newchunk = chunk.slice(start, stop);                                                                             // 47
		this.push(newchunk);                                                                                                 // 48
	}                                                                                                                     // 49
                                                                                                                       //
	this.bytes_read += chunk.length;                                                                                      // 50
	cb();                                                                                                                 // 51
};                                                                                                                     // 52
                                                                                                                       //
var getByteRange = function (header) {                                                                                 // 55
	if (header) {                                                                                                         // 56
		var matches = header.match(/(\d+)-(\d+)/);                                                                           // 57
                                                                                                                       //
		if (matches) {                                                                                                       // 58
			return {                                                                                                            // 59
				start: parseInt(matches[1], 10),                                                                                   // 60
				stop: parseInt(matches[2], 10)                                                                                     // 61
			};                                                                                                                  // 59
		}                                                                                                                    // 63
	}                                                                                                                     // 64
                                                                                                                       //
	return null;                                                                                                          // 65
}; // code from: https://github.com/jalik/jalik-ufs/blob/master/ufs-server.js#L91                                      // 66
                                                                                                                       //
                                                                                                                       //
var readFromGridFS = function (storeName, fileId, file, headers, req, res) {                                           // 70
	var store = UploadFS.getStore(storeName);                                                                             // 71
	var rs = store.getReadStream(fileId, file);                                                                           // 72
	var ws = new stream.PassThrough();                                                                                    // 73
	rs.on('error', function (err) {                                                                                       // 75
		store.onReadError.call(store, err, fileId, file);                                                                    // 76
		res.end();                                                                                                           // 77
	});                                                                                                                   // 78
	ws.on('error', function (err) {                                                                                       // 79
		store.onReadError.call(store, err, fileId, file);                                                                    // 80
		res.end();                                                                                                           // 81
	});                                                                                                                   // 82
	ws.on('close', function () {                                                                                          // 83
		// Close output stream at the end                                                                                    // 84
		ws.emit('end');                                                                                                      // 85
	});                                                                                                                   // 86
	var accept = req.headers['accept-encoding'] || ''; // Transform stream                                                // 88
                                                                                                                       //
	store.transformRead(rs, ws, fileId, file, req, headers);                                                              // 91
	var range = getByteRange(req.headers.range);                                                                          // 93
	var out_of_range = false;                                                                                             // 94
                                                                                                                       //
	if (range) {                                                                                                          // 95
		out_of_range = range.start > file.size || range.stop <= range.start || range.stop > file.size;                       // 96
	} // Compress data using gzip                                                                                         // 97
                                                                                                                       //
                                                                                                                       //
	if (accept.match(/\bgzip\b/) && range === null) {                                                                     // 100
		headers['Content-Encoding'] = 'gzip';                                                                                // 101
		delete headers['Content-Length'];                                                                                    // 102
		res.writeHead(200, headers);                                                                                         // 103
		ws.pipe(zlib.createGzip()).pipe(res);                                                                                // 104
	} else if (accept.match(/\bdeflate\b/) && range === null) {                                                           // 105
		// Compress data using deflate                                                                                       // 106
		headers['Content-Encoding'] = 'deflate';                                                                             // 107
		delete headers['Content-Length'];                                                                                    // 108
		res.writeHead(200, headers);                                                                                         // 109
		ws.pipe(zlib.createDeflate()).pipe(res);                                                                             // 110
	} else if (range && out_of_range) {                                                                                   // 111
		// out of range request, return 416                                                                                  // 112
		delete headers['Content-Length'];                                                                                    // 113
		delete headers['Content-Type'];                                                                                      // 114
		delete headers['Content-Disposition'];                                                                               // 115
		delete headers['Last-Modified'];                                                                                     // 116
		headers['Content-Range'] = "bytes */" + file.size;                                                                   // 117
		res.writeHead(416, headers);                                                                                         // 118
		res.end();                                                                                                           // 119
	} else if (range) {                                                                                                   // 120
		headers['Content-Range'] = "bytes " + range.start + "-" + range.stop + "/" + file.size;                              // 121
		delete headers['Content-Length'];                                                                                    // 122
		headers['Content-Length'] = range.stop - range.start + 1;                                                            // 123
		res.writeHead(206, headers);                                                                                         // 124
		logger.debug('File upload extracting range');                                                                        // 125
		ws.pipe(new ExtractRange({                                                                                           // 126
			start: range.start,                                                                                                 // 126
			stop: range.stop                                                                                                    // 126
		})).pipe(res);                                                                                                       // 126
	} else {                                                                                                              // 127
		res.writeHead(200, headers);                                                                                         // 128
		ws.pipe(res);                                                                                                        // 129
	}                                                                                                                     // 130
};                                                                                                                     // 131
                                                                                                                       //
var onRead = function (fileId, file, req, res) {                                                                       // 133
	if (RocketChat.settings.get('FileUpload_ProtectFiles')) {                                                             // 134
		var uid = void 0;                                                                                                    // 135
		var token = void 0;                                                                                                  // 136
                                                                                                                       //
		if (req && req.headers && req.headers.cookie) {                                                                      // 138
			var rawCookies = req.headers.cookie;                                                                                // 139
                                                                                                                       //
			if (rawCookies) {                                                                                                   // 141
				uid = cookie.get('rc_uid', rawCookies);                                                                            // 142
				token = cookie.get('rc_token', rawCookies);                                                                        // 143
			}                                                                                                                   // 144
		}                                                                                                                    // 145
                                                                                                                       //
		if (!uid) {                                                                                                          // 147
			uid = req.query.rc_uid;                                                                                             // 148
			token = req.query.rc_token;                                                                                         // 149
		}                                                                                                                    // 150
                                                                                                                       //
		if (!uid || !token || !RocketChat.models.Users.findOneByIdAndLoginToken(uid, token)) {                               // 152
			res.writeHead(403);                                                                                                 // 153
			return false;                                                                                                       // 154
		}                                                                                                                    // 155
	}                                                                                                                     // 156
                                                                                                                       //
	res.setHeader('content-disposition', "attachment; filename=\"" + encodeURIComponent(file.name) + "\"");               // 158
	return true;                                                                                                          // 159
};                                                                                                                     // 160
                                                                                                                       //
FileUpload.configureUploadsStore('GridFS', 'GridFS:Uploads', {                                                         // 162
	collectionName: 'rocketchat_uploads',                                                                                 // 163
	onRead: onRead                                                                                                        // 164
}); // DEPRECATED: backwards compatibility (remove)                                                                    // 162
                                                                                                                       //
UploadFS.getStores()['rocketchat_uploads'] = UploadFS.getStores()['GridFS:Uploads'];                                   // 168
FileUpload.configureUploadsStore('GridFS', 'GridFS:Avatars', {                                                         // 170
	collectionName: 'rocketchat_avatars',                                                                                 // 171
	onRead: onRead                                                                                                        // 172
});                                                                                                                    // 170
new FileUploadClass({                                                                                                  // 176
	name: 'GridFS:Uploads',                                                                                               // 177
	get: function (file, req, res) {                                                                                      // 179
		file = FileUpload.addExtensionTo(file);                                                                              // 180
		var headers = {                                                                                                      // 181
			'Content-Disposition': "attachment; filename*=UTF-8''" + encodeURIComponent(file.name),                             // 182
			'Last-Modified': file.uploadedAt.toUTCString(),                                                                     // 183
			'Content-Type': file.type,                                                                                          // 184
			'Content-Length': file.size                                                                                         // 185
		};                                                                                                                   // 181
		return readFromGridFS(file.store, file._id, file, headers, req, res);                                                // 187
	}                                                                                                                     // 188
});                                                                                                                    // 176
new FileUploadClass({                                                                                                  // 191
	name: 'GridFS:Avatars',                                                                                               // 192
	get: function (file, req, res) {                                                                                      // 194
		var reqModifiedHeader = req.headers['if-modified-since'];                                                            // 195
                                                                                                                       //
		if (reqModifiedHeader) {                                                                                             // 196
			if (reqModifiedHeader === (file.uploadedAt && file.uploadedAt.toUTCString())) {                                     // 197
				res.setHeader('Last-Modified', reqModifiedHeader);                                                                 // 198
				res.writeHead(304);                                                                                                // 199
				res.end();                                                                                                         // 200
				return;                                                                                                            // 201
			}                                                                                                                   // 202
		}                                                                                                                    // 203
                                                                                                                       //
		file = FileUpload.addExtensionTo(file);                                                                              // 205
		var headers = {                                                                                                      // 206
			'Cache-Control': 'public, max-age=0',                                                                               // 207
			'Expires': '-1',                                                                                                    // 208
			'Content-Disposition': 'inline',                                                                                    // 209
			'Last-Modified': file.uploadedAt.toUTCString(),                                                                     // 210
			'Content-Type': file.type,                                                                                          // 211
			'Content-Length': file.size                                                                                         // 212
		};                                                                                                                   // 206
		return readFromGridFS(file.store, file._id, file, headers, req, res);                                                // 214
	}                                                                                                                     // 215
});                                                                                                                    // 191
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Slingshot_DEPRECATED.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/server/config/Slingshot_DEPRECATED.js                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals Slingshot, FileUpload */var configureSlingshot = _.debounce(function () {                                   // 1
	var type = RocketChat.settings.get('FileUpload_Storage_Type');                                                        // 4
	var bucket = RocketChat.settings.get('FileUpload_S3_Bucket');                                                         // 5
	var acl = RocketChat.settings.get('FileUpload_S3_Acl');                                                               // 6
	var accessKey = RocketChat.settings.get('FileUpload_S3_AWSAccessKeyId');                                              // 7
	var secretKey = RocketChat.settings.get('FileUpload_S3_AWSSecretAccessKey');                                          // 8
	var cdn = RocketChat.settings.get('FileUpload_S3_CDN');                                                               // 9
	var region = RocketChat.settings.get('FileUpload_S3_Region');                                                         // 10
	var bucketUrl = RocketChat.settings.get('FileUpload_S3_BucketURL');                                                   // 11
	delete Slingshot._directives['rocketchat-uploads'];                                                                   // 13
                                                                                                                       //
	if (type === 'AmazonS3' && !_.isEmpty(bucket) && !_.isEmpty(accessKey) && !_.isEmpty(secretKey)) {                    // 15
		if (Slingshot._directives['rocketchat-uploads']) {                                                                   // 16
			delete Slingshot._directives['rocketchat-uploads'];                                                                 // 17
		}                                                                                                                    // 18
                                                                                                                       //
		var config = {                                                                                                       // 19
			bucket: bucket,                                                                                                     // 20
			key: function (file, metaContext) {                                                                                 // 21
				var id = Random.id();                                                                                              // 22
				var path = RocketChat.settings.get('uniqueID') + "/uploads/" + metaContext.rid + "/" + this.userId + "/" + id;     // 23
				var upload = {                                                                                                     // 25
					_id: id,                                                                                                          // 26
					rid: metaContext.rid,                                                                                             // 27
					AmazonS3: {                                                                                                       // 28
						path: path                                                                                                       // 29
					}                                                                                                                 // 28
				};                                                                                                                 // 25
				RocketChat.models.Uploads.insertFileInit(this.userId, 'AmazonS3:Uploads', file, upload);                           // 33
				return path;                                                                                                       // 35
			},                                                                                                                  // 36
			AWSAccessKeyId: accessKey,                                                                                          // 37
			AWSSecretAccessKey: secretKey                                                                                       // 38
		};                                                                                                                   // 19
                                                                                                                       //
		if (!_.isEmpty(acl)) {                                                                                               // 41
			config.acl = acl;                                                                                                   // 42
		}                                                                                                                    // 43
                                                                                                                       //
		if (!_.isEmpty(cdn)) {                                                                                               // 45
			config.cdn = cdn;                                                                                                   // 46
		}                                                                                                                    // 47
                                                                                                                       //
		if (!_.isEmpty(region)) {                                                                                            // 49
			config.region = region;                                                                                             // 50
		}                                                                                                                    // 51
                                                                                                                       //
		if (!_.isEmpty(bucketUrl)) {                                                                                         // 53
			config.bucketUrl = bucketUrl;                                                                                       // 54
		}                                                                                                                    // 55
                                                                                                                       //
		try {                                                                                                                // 57
			Slingshot.createDirective('rocketchat-uploads', Slingshot.S3Storage, config);                                       // 58
		} catch (e) {                                                                                                        // 59
			console.error('Error configuring S3 ->', e.message);                                                                // 60
		}                                                                                                                    // 61
	}                                                                                                                     // 62
}, 500);                                                                                                               // 63
                                                                                                                       //
RocketChat.settings.get('FileUpload_Storage_Type', configureSlingshot);                                                // 65
RocketChat.settings.get(/^FileUpload_S3_/, configureSlingshot);                                                        // 66
                                                                                                                       //
var createGoogleStorageDirective = _.debounce(function () {                                                            // 70
	var type = RocketChat.settings.get('FileUpload_Storage_Type');                                                        // 71
	var bucket = RocketChat.settings.get('FileUpload_GoogleStorage_Bucket');                                              // 72
	var accessId = RocketChat.settings.get('FileUpload_GoogleStorage_AccessId');                                          // 73
	var secret = RocketChat.settings.get('FileUpload_GoogleStorage_Secret');                                              // 74
	delete Slingshot._directives['rocketchat-uploads-gs'];                                                                // 76
                                                                                                                       //
	if (type === 'GoogleCloudStorage' && !_.isEmpty(secret) && !_.isEmpty(accessId) && !_.isEmpty(bucket)) {              // 78
		if (Slingshot._directives['rocketchat-uploads-gs']) {                                                                // 79
			delete Slingshot._directives['rocketchat-uploads-gs'];                                                              // 80
		}                                                                                                                    // 81
                                                                                                                       //
		var config = {                                                                                                       // 83
			bucket: bucket,                                                                                                     // 84
			GoogleAccessId: accessId,                                                                                           // 85
			GoogleSecretKey: secret,                                                                                            // 86
			key: function (file, metaContext) {                                                                                 // 87
				var id = Random.id();                                                                                              // 88
				var path = RocketChat.settings.get('uniqueID') + "/uploads/" + metaContext.rid + "/" + this.userId + "/" + id;     // 89
				var upload = {                                                                                                     // 91
					_id: id,                                                                                                          // 92
					rid: metaContext.rid,                                                                                             // 93
					GoogleStorage: {                                                                                                  // 94
						path: path                                                                                                       // 95
					}                                                                                                                 // 94
				};                                                                                                                 // 91
				RocketChat.models.Uploads.insertFileInit(this.userId, 'GoogleCloudStorage:Uploads', file, upload);                 // 99
				return path;                                                                                                       // 101
			}                                                                                                                   // 102
		};                                                                                                                   // 83
                                                                                                                       //
		try {                                                                                                                // 105
			Slingshot.createDirective('rocketchat-uploads-gs', Slingshot.GoogleCloud, config);                                  // 106
		} catch (e) {                                                                                                        // 107
			console.error('Error configuring GoogleCloudStorage ->', e.message);                                                // 108
		}                                                                                                                    // 109
	}                                                                                                                     // 110
}, 500);                                                                                                               // 111
                                                                                                                       //
RocketChat.settings.get('FileUpload_Storage_Type', createGoogleStorageDirective);                                      // 113
RocketChat.settings.get(/^FileUpload_GoogleStorage_/, createGoogleStorageDirective);                                   // 114
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods":{"sendFileMessage.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/server/methods/sendFileMessage.js                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'sendFileMessage': function (roomId, store, file) {                                                                   // 2
		var msgData = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};                                // 2
                                                                                                                       //
		if (!Meteor.userId()) {                                                                                              // 3
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                      // 4
				method: 'sendFileMessage'                                                                                          // 4
			});                                                                                                                 // 4
		}                                                                                                                    // 5
                                                                                                                       //
		var room = Meteor.call('canAccessRoom', roomId, Meteor.userId());                                                    // 7
                                                                                                                       //
		if (!room) {                                                                                                         // 9
			return false;                                                                                                       // 10
		}                                                                                                                    // 11
                                                                                                                       //
		check(msgData, {                                                                                                     // 13
			avatar: Match.Optional(String),                                                                                     // 14
			emoji: Match.Optional(String),                                                                                      // 15
			alias: Match.Optional(String),                                                                                      // 16
			groupable: Match.Optional(Boolean),                                                                                 // 17
			msg: Match.Optional(String)                                                                                         // 18
		});                                                                                                                  // 13
		RocketChat.models.Uploads.updateFileComplete(file._id, Meteor.userId(), _.omit(file, '_id'));                        // 21
		var fileUrl = "/file-upload/" + file._id + "/" + file.name;                                                          // 23
		var attachment = {                                                                                                   // 25
			title: file.name,                                                                                                   // 26
			type: 'file',                                                                                                       // 27
			description: file.description,                                                                                      // 28
			title_link: fileUrl,                                                                                                // 29
			title_link_download: true                                                                                           // 30
		};                                                                                                                   // 25
                                                                                                                       //
		if (/^image\/.+/.test(file.type)) {                                                                                  // 33
			attachment.image_url = fileUrl;                                                                                     // 34
			attachment.image_type = file.type;                                                                                  // 35
			attachment.image_size = file.size;                                                                                  // 36
                                                                                                                       //
			if (file.identify && file.identify.size) {                                                                          // 37
				attachment.image_dimensions = file.identify.size;                                                                  // 38
			}                                                                                                                   // 39
		} else if (/^audio\/.+/.test(file.type)) {                                                                           // 40
			attachment.audio_url = fileUrl;                                                                                     // 41
			attachment.audio_type = file.type;                                                                                  // 42
			attachment.audio_size = file.size;                                                                                  // 43
		} else if (/^video\/.+/.test(file.type)) {                                                                           // 44
			attachment.video_url = fileUrl;                                                                                     // 45
			attachment.video_type = file.type;                                                                                  // 46
			attachment.video_size = file.size;                                                                                  // 47
		}                                                                                                                    // 48
                                                                                                                       //
		var user = Meteor.user();                                                                                            // 50
		var msg = Object.assign({                                                                                            // 51
			_id: Random.id(),                                                                                                   // 52
			rid: roomId,                                                                                                        // 53
			ts: new Date(),                                                                                                     // 54
			msg: '',                                                                                                            // 55
			file: {                                                                                                             // 56
				_id: file._id,                                                                                                     // 57
				name: file.name,                                                                                                   // 58
				type: file.type                                                                                                    // 59
			},                                                                                                                  // 56
			groupable: false,                                                                                                   // 61
			attachments: [attachment]                                                                                           // 62
		}, msgData);                                                                                                         // 51
		msg = Meteor.call('sendMessage', msg);                                                                               // 65
		Meteor.defer(function () {                                                                                           // 67
			return RocketChat.callbacks.run('afterFileUpload', {                                                                // 67
				user: user,                                                                                                        // 67
				room: room,                                                                                                        // 67
				message: msg                                                                                                       // 67
			});                                                                                                                 // 67
		});                                                                                                                  // 67
		return msg;                                                                                                          // 69
	}                                                                                                                     // 70
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getS3FileUrl.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/server/methods/getS3FileUrl.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals UploadFS */var protectedFiles = void 0;                                                                     // 1
RocketChat.settings.get('FileUpload_ProtectFiles', function (key, value) {                                             // 5
	protectedFiles = value;                                                                                               // 6
});                                                                                                                    // 7
Meteor.methods({                                                                                                       // 9
	getS3FileUrl: function (fileId) {                                                                                     // 10
		if (protectedFiles && !Meteor.userId()) {                                                                            // 11
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                      // 12
				method: 'sendFileMessage'                                                                                          // 12
			});                                                                                                                 // 12
		}                                                                                                                    // 13
                                                                                                                       //
		var file = RocketChat.models.Uploads.findOneById(fileId);                                                            // 14
		return UploadFS.getStore('AmazonS3:Uploads').getRedirectURL(file);                                                   // 16
	}                                                                                                                     // 17
});                                                                                                                    // 9
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"startup":{"settings.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/server/startup/settings.js                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.settings.addGroup('FileUpload', function () {                                                               // 1
	this.add('FileUpload_Enabled', true, {                                                                                // 2
		type: 'boolean',                                                                                                     // 3
		"public": true                                                                                                       // 4
	});                                                                                                                   // 2
	this.add('FileUpload_MaxFileSize', 2097152, {                                                                         // 7
		type: 'int',                                                                                                         // 8
		"public": true                                                                                                       // 9
	});                                                                                                                   // 7
	this.add('FileUpload_MediaTypeWhiteList', 'image/*,audio/*,video/*,application/zip,application/x-rar-compressed,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document', {
		type: 'string',                                                                                                      // 13
		"public": true,                                                                                                      // 14
		i18nDescription: 'FileUpload_MediaTypeWhiteListDescription'                                                          // 15
	});                                                                                                                   // 12
	this.add('FileUpload_ProtectFiles', true, {                                                                           // 18
		type: 'boolean',                                                                                                     // 19
		"public": true,                                                                                                      // 20
		i18nDescription: 'FileUpload_ProtectFilesDescription'                                                                // 21
	});                                                                                                                   // 18
	this.add('FileUpload_Storage_Type', 'GridFS', {                                                                       // 24
		type: 'select',                                                                                                      // 25
		values: [{                                                                                                           // 26
			key: 'GridFS',                                                                                                      // 27
			i18nLabel: 'GridFS'                                                                                                 // 28
		}, {                                                                                                                 // 26
			key: 'AmazonS3',                                                                                                    // 30
			i18nLabel: 'AmazonS3'                                                                                               // 31
		}, {                                                                                                                 // 29
			key: 'GoogleCloudStorage',                                                                                          // 33
			i18nLabel: 'GoogleCloudStorage'                                                                                     // 34
		}, {                                                                                                                 // 32
			key: 'FileSystem',                                                                                                  // 36
			i18nLabel: 'FileSystem'                                                                                             // 37
		}],                                                                                                                  // 35
		"public": true                                                                                                       // 39
	});                                                                                                                   // 24
	this.section('Amazon S3', function () {                                                                               // 42
		this.add('FileUpload_S3_Bucket', '', {                                                                               // 43
			type: 'string',                                                                                                     // 44
			enableQuery: {                                                                                                      // 45
				_id: 'FileUpload_Storage_Type',                                                                                    // 46
				value: 'AmazonS3'                                                                                                  // 47
			}                                                                                                                   // 45
		});                                                                                                                  // 43
		this.add('FileUpload_S3_Acl', '', {                                                                                  // 50
			type: 'string',                                                                                                     // 51
			enableQuery: {                                                                                                      // 52
				_id: 'FileUpload_Storage_Type',                                                                                    // 53
				value: 'AmazonS3'                                                                                                  // 54
			}                                                                                                                   // 52
		});                                                                                                                  // 50
		this.add('FileUpload_S3_AWSAccessKeyId', '', {                                                                       // 57
			type: 'string',                                                                                                     // 58
			enableQuery: {                                                                                                      // 59
				_id: 'FileUpload_Storage_Type',                                                                                    // 60
				value: 'AmazonS3'                                                                                                  // 61
			}                                                                                                                   // 59
		});                                                                                                                  // 57
		this.add('FileUpload_S3_AWSSecretAccessKey', '', {                                                                   // 64
			type: 'string',                                                                                                     // 65
			enableQuery: {                                                                                                      // 66
				_id: 'FileUpload_Storage_Type',                                                                                    // 67
				value: 'AmazonS3'                                                                                                  // 68
			}                                                                                                                   // 66
		});                                                                                                                  // 64
		this.add('FileUpload_S3_CDN', '', {                                                                                  // 71
			type: 'string',                                                                                                     // 72
			enableQuery: {                                                                                                      // 73
				_id: 'FileUpload_Storage_Type',                                                                                    // 74
				value: 'AmazonS3'                                                                                                  // 75
			}                                                                                                                   // 73
		});                                                                                                                  // 71
		this.add('FileUpload_S3_Region', '', {                                                                               // 78
			type: 'string',                                                                                                     // 79
			enableQuery: {                                                                                                      // 80
				_id: 'FileUpload_Storage_Type',                                                                                    // 81
				value: 'AmazonS3'                                                                                                  // 82
			}                                                                                                                   // 80
		});                                                                                                                  // 78
		this.add('FileUpload_S3_BucketURL', '', {                                                                            // 85
			type: 'string',                                                                                                     // 86
			enableQuery: {                                                                                                      // 87
				_id: 'FileUpload_Storage_Type',                                                                                    // 88
				value: 'AmazonS3'                                                                                                  // 89
			},                                                                                                                  // 87
			i18nDescription: 'Override_URL_to_which_files_are_uploaded_This_url_also_used_for_downloads_unless_a_CDN_is_given.'
		});                                                                                                                  // 85
		this.add('FileUpload_S3_SignatureVersion', 'v4', {                                                                   // 93
			type: 'string',                                                                                                     // 94
			enableQuery: {                                                                                                      // 95
				_id: 'FileUpload_Storage_Type',                                                                                    // 96
				value: 'AmazonS3'                                                                                                  // 97
			}                                                                                                                   // 95
		});                                                                                                                  // 93
		this.add('FileUpload_S3_ForcePathStyle', false, {                                                                    // 100
			type: 'boolean',                                                                                                    // 101
			enableQuery: {                                                                                                      // 102
				_id: 'FileUpload_Storage_Type',                                                                                    // 103
				value: 'AmazonS3'                                                                                                  // 104
			}                                                                                                                   // 102
		});                                                                                                                  // 100
		this.add('FileUpload_S3_URLExpiryTimeSpan', 120, {                                                                   // 107
			type: 'int',                                                                                                        // 108
			enableQuery: {                                                                                                      // 109
				_id: 'FileUpload_Storage_Type',                                                                                    // 110
				value: 'AmazonS3'                                                                                                  // 111
			},                                                                                                                  // 109
			i18nDescription: 'FileUpload_S3_URLExpiryTimeSpan_Description'                                                      // 113
		});                                                                                                                  // 107
	});                                                                                                                   // 115
	this.section('Google Cloud Storage', function () {                                                                    // 117
		this.add('FileUpload_GoogleStorage_Bucket', '', {                                                                    // 118
			type: 'string',                                                                                                     // 119
			"private": true,                                                                                                    // 120
			enableQuery: {                                                                                                      // 121
				_id: 'FileUpload_Storage_Type',                                                                                    // 122
				value: 'GoogleCloudStorage'                                                                                        // 123
			}                                                                                                                   // 121
		});                                                                                                                  // 118
		this.add('FileUpload_GoogleStorage_AccessId', '', {                                                                  // 126
			type: 'string',                                                                                                     // 127
			"private": true,                                                                                                    // 128
			enableQuery: {                                                                                                      // 129
				_id: 'FileUpload_Storage_Type',                                                                                    // 130
				value: 'GoogleCloudStorage'                                                                                        // 131
			}                                                                                                                   // 129
		});                                                                                                                  // 126
		this.add('FileUpload_GoogleStorage_Secret', '', {                                                                    // 134
			type: 'string',                                                                                                     // 135
			multiline: true,                                                                                                    // 136
			"private": true,                                                                                                    // 137
			enableQuery: {                                                                                                      // 138
				_id: 'FileUpload_Storage_Type',                                                                                    // 139
				value: 'GoogleCloudStorage'                                                                                        // 140
			}                                                                                                                   // 138
		});                                                                                                                  // 134
	});                                                                                                                   // 143
	this.section('File System', function () {                                                                             // 145
		this.add('FileUpload_FileSystemPath', '', {                                                                          // 146
			type: 'string',                                                                                                     // 147
			enableQuery: {                                                                                                      // 148
				_id: 'FileUpload_Storage_Type',                                                                                    // 149
				value: 'FileSystem'                                                                                                // 150
			}                                                                                                                   // 148
		});                                                                                                                  // 146
	});                                                                                                                   // 153
	this.add('FileUpload_Enabled_Direct', true, {                                                                         // 155
		type: 'boolean',                                                                                                     // 156
		"public": true                                                                                                       // 157
	});                                                                                                                   // 155
});                                                                                                                    // 159
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"ufs":{"AmazonS3":{"server.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/ufs/AmazonS3/server.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                          //
                                                                                                                       //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                                 //
                                                                                                                       //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                            //
                                                                                                                       //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                   //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
module.export({                                                                                                        // 1
	AmazonS3Store: function () {                                                                                          // 1
		return AmazonS3Store;                                                                                                // 1
	}                                                                                                                     // 1
});                                                                                                                    // 1
                                                                                                                       //
var _ = void 0;                                                                                                        // 1
                                                                                                                       //
module.watch(require("meteor/underscore"), {                                                                           // 1
	_: function (v) {                                                                                                     // 1
		_ = v;                                                                                                               // 1
	}                                                                                                                     // 1
}, 0);                                                                                                                 // 1
var UploadFS = void 0;                                                                                                 // 1
module.watch(require("meteor/jalik:ufs"), {                                                                            // 1
	UploadFS: function (v) {                                                                                              // 1
		UploadFS = v;                                                                                                        // 1
	}                                                                                                                     // 1
}, 1);                                                                                                                 // 1
var S3 = void 0;                                                                                                       // 1
module.watch(require("aws-sdk/clients/s3"), {                                                                          // 1
	"default": function (v) {                                                                                             // 1
		S3 = v;                                                                                                              // 1
	}                                                                                                                     // 1
}, 2);                                                                                                                 // 1
var stream = void 0;                                                                                                   // 1
module.watch(require("stream"), {                                                                                      // 1
	"default": function (v) {                                                                                             // 1
		stream = v;                                                                                                          // 1
	}                                                                                                                     // 1
}, 3);                                                                                                                 // 1
                                                                                                                       //
var AmazonS3Store = function (_UploadFS$Store) {                                                                       //
	(0, _inherits3.default)(AmazonS3Store, _UploadFS$Store);                                                              //
                                                                                                                       //
	function AmazonS3Store(options) {                                                                                     // 13
		(0, _classCallCheck3.default)(this, AmazonS3Store);                                                                  // 13
		// Default options                                                                                                   // 14
		// options.secretAccessKey,                                                                                          // 15
		// options.accessKeyId,                                                                                              // 16
		// options.region,                                                                                                   // 17
		// options.sslEnabled // optional                                                                                    // 18
		options = _.extend({                                                                                                 // 20
			httpOptions: {                                                                                                      // 21
				timeout: 6000,                                                                                                     // 22
				agent: false                                                                                                       // 23
			}                                                                                                                   // 21
		}, options);                                                                                                         // 20
                                                                                                                       //
		var _this = (0, _possibleConstructorReturn3.default)(this, _UploadFS$Store.call(this, options));                     // 13
                                                                                                                       //
		var classOptions = options;                                                                                          // 29
		var s3 = new S3(options.connection);                                                                                 // 31
                                                                                                                       //
		options.getPath = options.getPath || function (file) {                                                               // 33
			return file._id;                                                                                                    // 34
		};                                                                                                                   // 35
                                                                                                                       //
		_this.getPath = function (file) {                                                                                    // 37
			if (file.AmazonS3) {                                                                                                // 38
				return file.AmazonS3.path;                                                                                         // 39
			} // Compatibility                                                                                                  // 40
			// TODO: Migration                                                                                                  // 42
                                                                                                                       //
                                                                                                                       //
			if (file.s3) {                                                                                                      // 43
				return file.s3.path + file._id;                                                                                    // 44
			}                                                                                                                   // 45
		};                                                                                                                   // 46
                                                                                                                       //
		_this.getRedirectURL = function (file) {                                                                             // 48
			var params = {                                                                                                      // 49
				Key: this.getPath(file),                                                                                           // 50
				Expires: classOptions.URLExpiryTimeSpan                                                                            // 51
			};                                                                                                                  // 49
			return s3.getSignedUrl('getObject', params);                                                                        // 54
		}; /**                                                                                                               // 55
      * Creates the file in the collection                                                                             //
      * @param file                                                                                                    //
      * @param callback                                                                                                //
      * @return {string}                                                                                               //
      */                                                                                                               //
                                                                                                                       //
		_this.create = function (file, callback) {                                                                           // 63
			check(file, Object);                                                                                                // 64
                                                                                                                       //
			if (file._id == null) {                                                                                             // 66
				file._id = Random.id();                                                                                            // 67
			}                                                                                                                   // 68
                                                                                                                       //
			file.AmazonS3 = {                                                                                                   // 70
				path: this.options.getPath(file)                                                                                   // 71
			};                                                                                                                  // 70
			file.store = this.options.name; // assign store to file                                                             // 74
                                                                                                                       //
			return this.getCollection().insert(file, callback);                                                                 // 75
		}; /**                                                                                                               // 76
      * Removes the file                                                                                               //
      * @param fileId                                                                                                  //
      * @param callback                                                                                                //
      */                                                                                                               //
                                                                                                                       //
		_this.delete = function (fileId, callback) {                                                                         // 83
			var file = this.getCollection().findOne({                                                                           // 84
				_id: fileId                                                                                                        // 84
			});                                                                                                                 // 84
			var params = {                                                                                                      // 85
				Key: this.getPath(file)                                                                                            // 86
			};                                                                                                                  // 85
			s3.deleteObject(params, function (err, data) {                                                                      // 89
				if (err) {                                                                                                         // 90
					console.error(err);                                                                                               // 91
				}                                                                                                                  // 92
                                                                                                                       //
				callback && callback(err, data);                                                                                   // 94
			});                                                                                                                 // 95
		}; /**                                                                                                               // 96
      * Returns the file read stream                                                                                   //
      * @param fileId                                                                                                  //
      * @param file                                                                                                    //
      * @param options                                                                                                 //
      * @return {*}                                                                                                    //
      */                                                                                                               //
                                                                                                                       //
		_this.getReadStream = function (fileId, file) {                                                                      // 105
			var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};                               // 105
			var params = {                                                                                                      // 106
				Key: this.getPath(file)                                                                                            // 107
			};                                                                                                                  // 106
                                                                                                                       //
			if (options.start && options.end) {                                                                                 // 110
				params.Range = options.start + " - " + options.end;                                                                // 111
			}                                                                                                                   // 112
                                                                                                                       //
			return s3.getObject(params).createReadStream();                                                                     // 114
		}; /**                                                                                                               // 115
      * Returns the file write stream                                                                                  //
      * @param fileId                                                                                                  //
      * @param file                                                                                                    //
      * @param options                                                                                                 //
      * @return {*}                                                                                                    //
      */                                                                                                               //
                                                                                                                       //
		_this.getWriteStream = function (fileId, file /*, options*/) {                                                       // 124
			var writeStream = new stream.PassThrough();                                                                         // 125
			writeStream.length = file.size;                                                                                     // 126
			writeStream.on('newListener', function (event, listener) {                                                          // 128
				if (event === 'finish') {                                                                                          // 129
					process.nextTick(function () {                                                                                    // 130
						writeStream.removeListener(event, listener);                                                                     // 131
						writeStream.on('real_finish', listener);                                                                         // 132
					});                                                                                                               // 133
				}                                                                                                                  // 134
			});                                                                                                                 // 135
			s3.putObject({                                                                                                      // 137
				Key: this.getPath(file),                                                                                           // 138
				Body: writeStream,                                                                                                 // 139
				ContentType: file.type                                                                                             // 140
			}, function (error) {                                                                                               // 137
				if (error) {                                                                                                       // 143
					console.error(error);                                                                                             // 144
				}                                                                                                                  // 145
                                                                                                                       //
				writeStream.emit('real_finish');                                                                                   // 147
			});                                                                                                                 // 148
			return writeStream;                                                                                                 // 150
		};                                                                                                                   // 151
                                                                                                                       //
		return _this;                                                                                                        // 13
	}                                                                                                                     // 152
                                                                                                                       //
	return AmazonS3Store;                                                                                                 //
}(UploadFS.Store);                                                                                                     //
                                                                                                                       //
// Add store to UFS namespace                                                                                          // 155
UploadFS.store.AmazonS3 = AmazonS3Store;                                                                               // 156
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"GoogleStorage":{"server.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/ufs/GoogleStorage/server.js                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                          //
                                                                                                                       //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                                 //
                                                                                                                       //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                            //
                                                                                                                       //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                   //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
module.export({                                                                                                        // 1
	GoogleStorageStore: function () {                                                                                     // 1
		return GoogleStorageStore;                                                                                           // 1
	}                                                                                                                     // 1
});                                                                                                                    // 1
var UploadFS = void 0;                                                                                                 // 1
module.watch(require("meteor/jalik:ufs"), {                                                                            // 1
	UploadFS: function (v) {                                                                                              // 1
		UploadFS = v;                                                                                                        // 1
	}                                                                                                                     // 1
}, 0);                                                                                                                 // 1
var gcStorage = void 0;                                                                                                // 1
module.watch(require("@google-cloud/storage"), {                                                                       // 1
	"default": function (v) {                                                                                             // 1
		gcStorage = v;                                                                                                       // 1
	}                                                                                                                     // 1
}, 1);                                                                                                                 // 1
                                                                                                                       //
var GoogleStorageStore = function (_UploadFS$Store) {                                                                  //
	(0, _inherits3.default)(GoogleStorageStore, _UploadFS$Store);                                                         //
                                                                                                                       //
	function GoogleStorageStore(options) {                                                                                // 11
		(0, _classCallCheck3.default)(this, GoogleStorageStore);                                                             // 11
                                                                                                                       //
		var _this = (0, _possibleConstructorReturn3.default)(this, _UploadFS$Store.call(this, options));                     // 11
                                                                                                                       //
		var gcs = gcStorage(options.connection);                                                                             // 14
		_this.bucket = gcs.bucket(options.bucket);                                                                           // 15
                                                                                                                       //
		options.getPath = options.getPath || function (file) {                                                               // 17
			return file._id;                                                                                                    // 18
		};                                                                                                                   // 19
                                                                                                                       //
		_this.getPath = function (file) {                                                                                    // 21
			if (file.GoogleStorage) {                                                                                           // 22
				return file.GoogleStorage.path;                                                                                    // 23
			} // Compatibility                                                                                                  // 24
			// TODO: Migration                                                                                                  // 26
                                                                                                                       //
                                                                                                                       //
			if (file.googleCloudStorage) {                                                                                      // 27
				return file.googleCloudStorage.path + file._id;                                                                    // 28
			}                                                                                                                   // 29
		};                                                                                                                   // 30
                                                                                                                       //
		_this.getRedirectURL = function (file, callback) {                                                                   // 32
			var params = {                                                                                                      // 33
				action: 'read',                                                                                                    // 34
				responseDisposition: 'inline',                                                                                     // 35
				expires: Date.now() + this.options.URLExpiryTimeSpan * 1000                                                        // 36
			};                                                                                                                  // 33
			this.bucket.file(this.getPath(file)).getSignedUrl(params, callback);                                                // 39
		}; /**                                                                                                               // 40
      * Creates the file in the collection                                                                             //
      * @param file                                                                                                    //
      * @param callback                                                                                                //
      * @return {string}                                                                                               //
      */                                                                                                               //
                                                                                                                       //
		_this.create = function (file, callback) {                                                                           // 48
			check(file, Object);                                                                                                // 49
                                                                                                                       //
			if (file._id == null) {                                                                                             // 51
				file._id = Random.id();                                                                                            // 52
			}                                                                                                                   // 53
                                                                                                                       //
			file.GoogleStorage = {                                                                                              // 55
				path: this.options.getPath(file)                                                                                   // 56
			};                                                                                                                  // 55
			file.store = this.options.name; // assign store to file                                                             // 59
                                                                                                                       //
			return this.getCollection().insert(file, callback);                                                                 // 60
		}; /**                                                                                                               // 61
      * Removes the file                                                                                               //
      * @param fileId                                                                                                  //
      * @param callback                                                                                                //
      */                                                                                                               //
                                                                                                                       //
		_this.delete = function (fileId, callback) {                                                                         // 68
			var file = this.getCollection().findOne({                                                                           // 69
				_id: fileId                                                                                                        // 69
			});                                                                                                                 // 69
			this.bucket.file(this.getPath(file)).delete(function (err, data) {                                                  // 70
				if (err) {                                                                                                         // 71
					console.error(err);                                                                                               // 72
				}                                                                                                                  // 73
                                                                                                                       //
				callback && callback(err, data);                                                                                   // 75
			});                                                                                                                 // 76
		}; /**                                                                                                               // 77
      * Returns the file read stream                                                                                   //
      * @param fileId                                                                                                  //
      * @param file                                                                                                    //
      * @param options                                                                                                 //
      * @return {*}                                                                                                    //
      */                                                                                                               //
                                                                                                                       //
		_this.getReadStream = function (fileId, file) {                                                                      // 86
			var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};                               // 86
			var config = {};                                                                                                    // 87
                                                                                                                       //
			if (options.start != null) {                                                                                        // 89
				config.start = options.start;                                                                                      // 90
			}                                                                                                                   // 91
                                                                                                                       //
			if (options.end != null) {                                                                                          // 93
				config.end = options.end;                                                                                          // 94
			}                                                                                                                   // 95
                                                                                                                       //
			return this.bucket.file(this.getPath(file)).createReadStream(config);                                               // 97
		}; /**                                                                                                               // 98
      * Returns the file write stream                                                                                  //
      * @param fileId                                                                                                  //
      * @param file                                                                                                    //
      * @param options                                                                                                 //
      * @return {*}                                                                                                    //
      */                                                                                                               //
                                                                                                                       //
		_this.getWriteStream = function (fileId, file /*, options*/) {                                                       // 107
			return this.bucket.file(this.getPath(file)).createWriteStream({                                                     // 108
				gzip: false,                                                                                                       // 109
				metadata: {                                                                                                        // 110
					contentType: file.type,                                                                                           // 111
					contentDisposition: "inline; filename=" + file.name // metadata: {                                                // 112
					// 	custom: 'metadata'                                                                                            // 114
					// }                                                                                                              // 115
                                                                                                                       //
				}                                                                                                                  // 110
			});                                                                                                                 // 108
		};                                                                                                                   // 118
                                                                                                                       //
		return _this;                                                                                                        // 11
	}                                                                                                                     // 119
                                                                                                                       //
	return GoogleStorageStore;                                                                                            //
}(UploadFS.Store);                                                                                                     //
                                                                                                                       //
// Add store to UFS namespace                                                                                          // 122
UploadFS.store.GoogleStorage = GoogleStorageStore;                                                                     // 123
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"node_modules":{"filesize":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// .npm/package/node_modules/filesize/package.json                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
exports.name = "filesize";
exports.version = "3.3.0";
exports.main = "lib/filesize";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"filesize.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/rocketchat_file-upload/node_modules/filesize/lib/filesize.js                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
"use strict";

/**
 * filesize
 *
 * @copyright 2016 Jason Mulligan <jason.mulligan@avoidwork.com>
 * @license BSD-3-Clause
 * @version 3.3.0
 */
(function (global) {
	var b = /^(b|B)$/;
	var symbol = {
		iec: {
			bits: ["b", "Kib", "Mib", "Gib", "Tib", "Pib", "Eib", "Zib", "Yib"],
			bytes: ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]
		},
		jedec: {
			bits: ["b", "Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"],
			bytes: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
		}
	};

	/**
  * filesize
  *
  * @method filesize
  * @param  {Mixed}   arg        String, Int or Float to transform
  * @param  {Object}  descriptor [Optional] Flags
  * @return {String}             Readable file size String
  */
	function filesize(arg) {
		var descriptor = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

		var result = [],
		    val = 0,
		    e = void 0,
		    base = void 0,
		    bits = void 0,
		    ceil = void 0,
		    neg = void 0,
		    num = void 0,
		    output = void 0,
		    round = void 0,
		    unix = void 0,
		    spacer = void 0,
		    standard = void 0,
		    symbols = void 0;

		if (isNaN(arg)) {
			throw new Error("Invalid arguments");
		}

		bits = descriptor.bits === true;
		unix = descriptor.unix === true;
		base = descriptor.base || 2;
		round = descriptor.round !== undefined ? descriptor.round : unix ? 1 : 2;
		spacer = descriptor.spacer !== undefined ? descriptor.spacer : unix ? "" : " ";
		symbols = descriptor.symbols || descriptor.suffixes || {};
		standard = base === 2 ? descriptor.standard || "jedec" : "jedec";
		output = descriptor.output || "string";
		e = descriptor.exponent !== undefined ? descriptor.exponent : -1;
		num = Number(arg);
		neg = num < 0;
		ceil = base > 2 ? 1000 : 1024;

		// Flipping a negative number to determine the size
		if (neg) {
			num = -num;
		}

		// Zero is now a special case because bytes divide by 1
		if (num === 0) {
			result[0] = 0;
			result[1] = unix ? "" : !bits ? "B" : "b";
		} else {
			// Determining the exponent
			if (e === -1 || isNaN(e)) {
				e = Math.floor(Math.log(num) / Math.log(ceil));

				if (e < 0) {
					e = 0;
				}
			}

			// Exceeding supported length, time to reduce & multiply
			if (e > 8) {
				e = 8;
			}

			val = base === 2 ? num / Math.pow(2, e * 10) : num / Math.pow(1000, e);

			if (bits) {
				val = val * 8;

				if (val > ceil && e < 8) {
					val = val / ceil;
					e++;
				}
			}

			result[0] = Number(val.toFixed(e > 0 ? round : 0));
			result[1] = base === 10 && e === 1 ? bits ? "kb" : "kB" : symbol[standard][bits ? "bits" : "bytes"][e];

			if (unix) {
				result[1] = standard === "jedec" ? result[1].charAt(0) : e > 0 ? result[1].replace(/B$/, "") : result[1];

				if (b.test(result[1])) {
					result[0] = Math.floor(result[0]);
					result[1] = "";
				}
			}
		}

		// Decorating a 'diff'
		if (neg) {
			result[0] = -result[0];
		}

		// Applying custom symbol
		result[1] = symbols[result[1]] || result[1];

		// Returning Array, Object, or String (default)
		if (output === "array") {
			return result;
		}

		if (output === "exponent") {
			return e;
		}

		if (output === "object") {
			return { value: result[0], suffix: result[1], symbol: result[1] };
		}

		return result.join(spacer);
	}

	// CommonJS, AMD, script tag
	if (typeof exports !== "undefined") {
		module.exports = filesize;
	} else if (typeof define === "function" && define.amd) {
		define(function () {
			return filesize;
		});
	} else {
		global.filesize = filesize;
	}
})(typeof window !== "undefined" ? window : global);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:file-upload/globalFileRestrictions.js");
require("./node_modules/meteor/rocketchat:file-upload/lib/FileUpload.js");
require("./node_modules/meteor/rocketchat:file-upload/lib/FileUploadBase.js");
require("./node_modules/meteor/rocketchat:file-upload/server/lib/FileUpload.js");
require("./node_modules/meteor/rocketchat:file-upload/server/lib/proxy.js");
require("./node_modules/meteor/rocketchat:file-upload/server/lib/requests.js");
require("./node_modules/meteor/rocketchat:file-upload/server/config/_configUploadStorage.js");
require("./node_modules/meteor/rocketchat:file-upload/server/methods/sendFileMessage.js");
require("./node_modules/meteor/rocketchat:file-upload/server/methods/getS3FileUrl.js");
require("./node_modules/meteor/rocketchat:file-upload/server/startup/settings.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['rocketchat:file-upload'] = {}, {
  fileUploadHandler: fileUploadHandler,
  FileUpload: FileUpload
});

})();

//# sourceMappingURL=rocketchat_file-upload.js.map

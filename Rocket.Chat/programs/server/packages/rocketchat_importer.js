(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var check = Package.check.check;
var Match = Package.check.Match;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RocketChatTabBar = Package['rocketchat:lib'].RocketChatTabBar;
var Logger = Package['rocketchat:logger'].Logger;
var SystemLogger = Package['rocketchat:logger'].SystemLogger;
var LoggerManager = Package['rocketchat:logger'].LoggerManager;
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
var Importer;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:importer":{"lib":{"_importer.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_importer/lib/_importer.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals Importer */Importer = {};                                                                                   // 1
module.exportDefault(Importer);                                                                                        // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"importTool.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_importer/lib/importTool.js                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals Importer */Importer.Importers = {};                                                                         // 1
                                                                                                                       //
Importer.addImporter = function (name, importer, options) {                                                            // 4
	if (Importer.Importers[name] == null) {                                                                               // 5
		return Importer.Importers[name] = {                                                                                  // 6
			name: options.name,                                                                                                 // 7
			importer: importer,                                                                                                 // 8
			mimeType: options.mimeType,                                                                                         // 9
			warnings: options.warnings                                                                                          // 10
		};                                                                                                                   // 6
	}                                                                                                                     // 12
};                                                                                                                     // 13
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"classes":{"ImporterBase.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_importer/server/classes/ImporterBase.js                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
var http = void 0;                                                                                                     // 1
module.watch(require("http"), {                                                                                        // 1
	"default": function (v) {                                                                                             // 1
		http = v;                                                                                                            // 1
	}                                                                                                                     // 1
}, 0);                                                                                                                 // 1
var https = void 0;                                                                                                    // 1
module.watch(require("https"), {                                                                                       // 1
	"default": function (v) {                                                                                             // 1
		https = v;                                                                                                           // 1
	}                                                                                                                     // 1
}, 1);                                                                                                                 // 1
var AdmZip = void 0;                                                                                                   // 1
module.watch(require("adm-zip"), {                                                                                     // 1
	"default": function (v) {                                                                                             // 1
		AdmZip = v;                                                                                                          // 1
	}                                                                                                                     // 1
}, 2);                                                                                                                 // 1
var getFileType = void 0;                                                                                              // 1
module.watch(require("file-type"), {                                                                                   // 1
	"default": function (v) {                                                                                             // 1
		getFileType = v;                                                                                                     // 1
	}                                                                                                                     // 1
}, 3);                                                                                                                 // 1
                                                                                                                       //
Importer.Base = function () {                                                                                          // 20
	Base.getBSONSize = function () {                                                                                      // 20
		function getBSONSize(object) {                                                                                       // 20
			// The max BSON object size we can store in MongoDB is 16777216 bytes                                               // 22
			// but for some reason the mongo instanace which comes with meteor                                                  // 23
			// errors out for anything close to that size. So, we are rounding it                                               // 24
			// down to 8000000 bytes.                                                                                           // 25
			var _require$native = require('bson').native(),                                                                     // 21
			    BSON = _require$native.BSON;                                                                                    // 21
                                                                                                                       //
			var bson = new BSON();                                                                                              // 27
			return bson.calculateObjectSize(object);                                                                            // 28
		}                                                                                                                    // 29
                                                                                                                       //
		return getBSONSize;                                                                                                  // 20
	}();                                                                                                                  // 20
                                                                                                                       //
	Base.getBSONSafeArraysFromAnArray = function () {                                                                     // 20
		function getBSONSafeArraysFromAnArray(theArray) {                                                                    // 20
			var BSONSize = Importer.Base.getBSONSize(theArray);                                                                 // 32
			var maxSize = Math.floor(theArray.length / Math.ceil(BSONSize / Importer.Base.MaxBSONSize));                        // 33
			var safeArrays = [];                                                                                                // 34
			var i = 0;                                                                                                          // 35
                                                                                                                       //
			while (i < theArray.length) {                                                                                       // 36
				safeArrays.push(theArray.slice(i, i += maxSize));                                                                  // 37
			}                                                                                                                   // 38
                                                                                                                       //
			return safeArrays;                                                                                                  // 39
		}                                                                                                                    // 40
                                                                                                                       //
		return getBSONSafeArraysFromAnArray;                                                                                 // 20
	}(); // Constructs a new importer, adding an empty collection, AdmZip property, and empty users & channels            // 20
	//                                                                                                                    // 43
	// @param [String] name the name of the Importer                                                                      // 44
	// @param [String] description the i18n string which describes the importer                                           // 45
	// @param [String] mimeType the of the expected file type                                                             // 46
	//                                                                                                                    // 47
                                                                                                                       //
                                                                                                                       //
	function Base(name, description, mimeType) {                                                                          // 48
		(0, _classCallCheck3.default)(this, Base);                                                                           // 48
		this.http = http;                                                                                                    // 49
		this.https = https;                                                                                                  // 50
		this.AdmZip = AdmZip;                                                                                                // 51
		this.getFileType = getFileType;                                                                                      // 52
		this.MaxBSONSize = 8000000;                                                                                          // 54
		this.prepare = this.prepare.bind(this);                                                                              // 55
		this.startImport = this.startImport.bind(this);                                                                      // 56
		this.getSelection = this.getSelection.bind(this);                                                                    // 57
		this.getProgress = this.getProgress.bind(this);                                                                      // 58
		this.updateProgress = this.updateProgress.bind(this);                                                                // 59
		this.addCountToTotal = this.addCountToTotal.bind(this);                                                              // 60
		this.addCountCompleted = this.addCountCompleted.bind(this);                                                          // 61
		this.updateRecord = this.updateRecord.bind(this);                                                                    // 62
		this.uploadFile = this.uploadFile.bind(this);                                                                        // 63
		this.name = name;                                                                                                    // 64
		this.description = description;                                                                                      // 65
		this.mimeType = mimeType;                                                                                            // 66
		this.logger = new Logger(this.name + " Importer", {});                                                               // 67
		this.progress = new Importer.Progress(this.name);                                                                    // 68
		this.collection = Importer.RawImports;                                                                               // 69
		var importId = Importer.Imports.insert({                                                                             // 70
			'type': this.name,                                                                                                  // 70
			'ts': Date.now(),                                                                                                   // 70
			'status': this.progress.step,                                                                                       // 70
			'valid': true,                                                                                                      // 70
			'user': Meteor.user()._id                                                                                           // 70
		});                                                                                                                  // 70
		this.importRecord = Importer.Imports.findOne(importId);                                                              // 71
		this.users = {};                                                                                                     // 72
		this.channels = {};                                                                                                  // 73
		this.messages = {};                                                                                                  // 74
	} // Takes the uploaded file and extracts the users, channels, and messages from it.                                  // 75
	//                                                                                                                    // 78
	// @param [String] dataURI a base64 string of the uploaded file                                                       // 79
	// @param [String] sentContentType the file type                                                                      // 80
	// @param [String] fileName the name of the uploaded file                                                             // 81
	//                                                                                                                    // 82
	// @return [Importer.Selection] Contains two properties which are arrays of objects, `channels` and `users`.          // 83
	//                                                                                                                    // 84
                                                                                                                       //
                                                                                                                       //
	Base.prototype.prepare = function () {                                                                                // 20
		function prepare(dataURI, sentContentType, fileName) {                                                               // 20
			var fileType = this.getFileType(new Buffer(dataURI.split(',')[1], 'base64'));                                       // 86
			this.logger.debug('Uploaded file information is:', fileType);                                                       // 87
			this.logger.debug('Expected file type is:', this.mimeType);                                                         // 88
                                                                                                                       //
			if (!fileType || fileType.mime !== this.mimeType) {                                                                 // 90
				this.logger.warn("Invalid file uploaded for the " + this.name + " importer.");                                     // 91
				throw new Meteor.Error('error-invalid-file-uploaded', "Invalid file uploaded to import " + this.name + " data from.", {
					step: 'prepare'                                                                                                   // 92
				});                                                                                                                // 92
			}                                                                                                                   // 93
                                                                                                                       //
			this.updateProgress(Importer.ProgressStep.PREPARING_STARTED);                                                       // 95
			return this.updateRecord({                                                                                          // 96
				'file': fileName                                                                                                   // 96
			});                                                                                                                 // 96
		}                                                                                                                    // 97
                                                                                                                       //
		return prepare;                                                                                                      // 20
	}(); // Starts the import process. The implementing method should defer as soon as the selection is set, so the user who started the process
	// doesn't end up with a "locked" ui while meteor waits for a response. The returned object should be the progress.   // 100
	//                                                                                                                    // 101
	// @param [Importer.Selection] selectedUsersAndChannels an object with `channels` and `users` which contains information about which users and channels to import
	//                                                                                                                    // 103
	// @return [Importer.Progress] the progress of the import                                                             // 104
	//                                                                                                                    // 105
                                                                                                                       //
                                                                                                                       //
	Base.prototype.startImport = function () {                                                                            // 20
		function startImport(importSelection) {                                                                              // 20
			if (importSelection === undefined) {                                                                                // 107
				throw new Error("No selected users and channel data provided to the " + this.name + " importer."); //TODO: Make translatable
			} else if (importSelection.users === undefined) {                                                                   // 109
				throw new Error("Users in the selected data wasn't found, it must but at least an empty array for the " + this.name + " importer."); //TODO: Make translatable
			} else if (importSelection.channels === undefined) {                                                                // 111
				throw new Error("Channels in the selected data wasn't found, it must but at least an empty array for the " + this.name + " importer."); //TODO: Make translatable
			}                                                                                                                   // 113
                                                                                                                       //
			return this.updateProgress(Importer.ProgressStep.IMPORTING_STARTED);                                                // 115
		}                                                                                                                    // 116
                                                                                                                       //
		return startImport;                                                                                                  // 20
	}(); // Gets the Importer.Selection object for the import.                                                            // 20
	//                                                                                                                    // 119
	// @return [Importer.Selection] the users and channels selection                                                      // 120
                                                                                                                       //
                                                                                                                       //
	Base.prototype.getSelection = function () {                                                                           // 20
		function getSelection() {                                                                                            // 20
			throw new Error("Invalid 'getSelection' called on " + this.name + ", it must be overridden and super can not be called.");
		}                                                                                                                    // 123
                                                                                                                       //
		return getSelection;                                                                                                 // 20
	}(); // Gets the progress of this importer.                                                                           // 20
	//                                                                                                                    // 126
	// @return [Importer.Progress] the progress of the import                                                             // 127
	//                                                                                                                    // 128
                                                                                                                       //
                                                                                                                       //
	Base.prototype.getProgress = function () {                                                                            // 20
		function getProgress() {                                                                                             // 20
			return this.progress;                                                                                               // 130
		}                                                                                                                    // 131
                                                                                                                       //
		return getProgress;                                                                                                  // 20
	}(); // Updates the progress step of this importer.                                                                   // 20
	//                                                                                                                    // 134
	// @return [Importer.Progress] the progress of the import                                                             // 135
	//                                                                                                                    // 136
                                                                                                                       //
                                                                                                                       //
	Base.prototype.updateProgress = function () {                                                                         // 20
		function updateProgress(step) {                                                                                      // 20
			this.progress.step = step;                                                                                          // 138
			this.logger.debug(this.name + " is now at " + step + ".");                                                          // 140
			this.updateRecord({                                                                                                 // 141
				'status': this.progress.step                                                                                       // 141
			});                                                                                                                 // 141
			return this.progress;                                                                                               // 143
		}                                                                                                                    // 144
                                                                                                                       //
		return updateProgress;                                                                                               // 20
	}(); // Adds the passed in value to the total amount of items needed to complete.                                     // 20
	//                                                                                                                    // 147
	// @return [Importer.Progress] the progress of the import                                                             // 148
	//                                                                                                                    // 149
                                                                                                                       //
                                                                                                                       //
	Base.prototype.addCountToTotal = function () {                                                                        // 20
		function addCountToTotal(count) {                                                                                    // 20
			this.progress.count.total = this.progress.count.total + count;                                                      // 151
			this.updateRecord({                                                                                                 // 152
				'count.total': this.progress.count.total                                                                           // 152
			});                                                                                                                 // 152
			return this.progress;                                                                                               // 154
		}                                                                                                                    // 155
                                                                                                                       //
		return addCountToTotal;                                                                                              // 20
	}(); // Adds the passed in value to the total amount of items completed.                                              // 20
	//                                                                                                                    // 158
	// @return [Importer.Progress] the progress of the import                                                             // 159
	//                                                                                                                    // 160
                                                                                                                       //
                                                                                                                       //
	Base.prototype.addCountCompleted = function () {                                                                      // 20
		function addCountCompleted(count) {                                                                                  // 20
			this.progress.count.completed = this.progress.count.completed + count; //Only update the database every 500 records
			//Or the completed is greater than or equal to the total amount                                                     // 165
                                                                                                                       //
			if (this.progress.count.completed % 500 === 0 || this.progress.count.completed >= this.progress.count.total) {      // 166
				this.updateRecord({                                                                                                // 167
					'count.completed': this.progress.count.completed                                                                  // 167
				});                                                                                                                // 167
			}                                                                                                                   // 168
                                                                                                                       //
			return this.progress;                                                                                               // 170
		}                                                                                                                    // 171
                                                                                                                       //
		return addCountCompleted;                                                                                            // 20
	}(); // Updates the import record with the given fields being `set`                                                   // 20
	//                                                                                                                    // 174
	// @return [Importer.Imports] the import record object                                                                // 175
	//                                                                                                                    // 176
                                                                                                                       //
                                                                                                                       //
	Base.prototype.updateRecord = function () {                                                                           // 20
		function updateRecord(fields) {                                                                                      // 20
			Importer.Imports.update({                                                                                           // 178
				_id: this.importRecord._id                                                                                         // 178
			}, {                                                                                                                // 178
				$set: fields                                                                                                       // 178
			});                                                                                                                 // 178
			this.importRecord = Importer.Imports.findOne(this.importRecord._id);                                                // 179
			return this.importRecord;                                                                                           // 181
		}                                                                                                                    // 182
                                                                                                                       //
		return updateRecord;                                                                                                 // 20
	}(); // Uploads the file to the storage.                                                                              // 20
	//                                                                                                                    // 185
	// @param [Object] details an object with details about the upload. name, size, type, and rid                         // 186
	// @param [String] fileUrl url of the file to download/import                                                         // 187
	// @param [Object] user the Rocket.Chat user                                                                          // 188
	// @param [Object] room the Rocket.Chat room                                                                          // 189
	// @param [Date] timeStamp the timestamp the file was uploaded                                                        // 190
	//                                                                                                                    // 191
                                                                                                                       //
                                                                                                                       //
	Base.prototype.uploadFile = function () {                                                                             // 20
		function uploadFile(details, fileUrl, user, room, timeStamp) {                                                       // 20
			this.logger.debug("Uploading the file " + details.name + " from " + fileUrl + ".");                                 // 193
			var requestModule = /https/i.test(fileUrl) ? this.https : this.http;                                                // 194
			var fileStore = FileUpload.getStore('Uploads');                                                                     // 196
			return requestModule.get(fileUrl, Meteor.bindEnvironment(function (res) {                                           // 198
				var rawData = [];                                                                                                  // 199
				res.on('data', function (chunk) {                                                                                  // 200
					return rawData.push(chunk);                                                                                       // 200
				});                                                                                                                // 200
				res.on('end', Meteor.bindEnvironment(function () {                                                                 // 201
					fileStore.insert(details, Buffer.concat(rawData), function (err, file) {                                          // 202
						if (err) {                                                                                                       // 203
							throw new Error(err);                                                                                           // 204
						} else {                                                                                                         // 205
							var url = file.url.replace(Meteor.absoluteUrl(), '/');                                                          // 206
							var attachment = {                                                                                              // 208
								title: file.name,                                                                                              // 209
								title_link: url                                                                                                // 210
							};                                                                                                              // 208
                                                                                                                       //
							if (/^image\/.+/.test(file.type)) {                                                                             // 213
								attachment.image_url = url;                                                                                    // 214
								attachment.image_type = file.type;                                                                             // 215
								attachment.image_size = file.size;                                                                             // 216
								attachment.image_dimensions = file.identify != null ? file.identify.size : undefined;                          // 217
							}                                                                                                               // 218
                                                                                                                       //
							if (/^audio\/.+/.test(file.type)) {                                                                             // 220
								attachment.audio_url = url;                                                                                    // 221
								attachment.audio_type = file.type;                                                                             // 222
								attachment.audio_size = file.size;                                                                             // 223
							}                                                                                                               // 224
                                                                                                                       //
							if (/^video\/.+/.test(file.type)) {                                                                             // 226
								attachment.video_url = url;                                                                                    // 227
								attachment.video_type = file.type;                                                                             // 228
								attachment.video_size = file.size;                                                                             // 229
							}                                                                                                               // 230
                                                                                                                       //
							var msg = {                                                                                                     // 232
								rid: details.rid,                                                                                              // 233
								ts: timeStamp,                                                                                                 // 234
								msg: '',                                                                                                       // 235
								file: {                                                                                                        // 236
									_id: file._id                                                                                                 // 237
								},                                                                                                             // 236
								groupable: false,                                                                                              // 239
								attachments: [attachment]                                                                                      // 240
							};                                                                                                              // 232
                                                                                                                       //
							if (details.message_id != null && typeof details.message_id === 'string') {                                     // 243
								msg['_id'] = details.message_id;                                                                               // 244
							}                                                                                                               // 245
                                                                                                                       //
							return RocketChat.sendMessage(user, msg, room, true);                                                           // 247
						}                                                                                                                // 248
					});                                                                                                               // 249
				}));                                                                                                               // 250
			}));                                                                                                                // 251
		}                                                                                                                    // 252
                                                                                                                       //
		return uploadFile;                                                                                                   // 20
	}();                                                                                                                  // 20
                                                                                                                       //
	return Base;                                                                                                          // 20
}();                                                                                                                   // 20
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ImporterProgress.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_importer/server/classes/ImporterProgress.js                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
/* globals Importer */ // Class for all the progress of the importers to use.                                          // 1
Importer.Progress = Importer.Progress = // Constructs a new progress object.                                           // 3
//                                                                                                                     // 5
// @param [String] name the name of the Importer                                                                       // 6
//                                                                                                                     // 7
function () {                                                                                                          // 3
	function Progress(name) {                                                                                             // 8
		(0, _classCallCheck3.default)(this, Progress);                                                                       // 8
		this.name = name;                                                                                                    // 9
		this.step = Importer.ProgressStep.NEW;                                                                               // 10
		this.count = {                                                                                                       // 11
			completed: 0,                                                                                                       // 11
			total: 0                                                                                                            // 11
		};                                                                                                                   // 11
	}                                                                                                                     // 12
                                                                                                                       //
	return Progress;                                                                                                      // 3
}();                                                                                                                   // 3
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ImporterProgressStep.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_importer/server/classes/ImporterProgressStep.js                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals Importer */ // "ENUM" of the import step, the value is the translation string                               // 1
Importer.ProgressStep = Object.freeze({                                                                                // 3
	NEW: 'importer_new',                                                                                                  // 4
	PREPARING_STARTED: 'importer_preparing_started',                                                                      // 5
	PREPARING_USERS: 'importer_preparing_users',                                                                          // 6
	PREPARING_CHANNELS: 'importer_preparing_channels',                                                                    // 7
	PREPARING_MESSAGES: 'importer_preparing_messages',                                                                    // 8
	USER_SELECTION: 'importer_user_selection',                                                                            // 9
	IMPORTING_STARTED: 'importer_importing_started',                                                                      // 10
	IMPORTING_USERS: 'importer_importing_users',                                                                          // 11
	IMPORTING_CHANNELS: 'importer_importing_channels',                                                                    // 12
	IMPORTING_MESSAGES: 'importer_importing_messages',                                                                    // 13
	FINISHING: 'importer_finishing',                                                                                      // 14
	DONE: 'importer_done',                                                                                                // 15
	ERROR: 'importer_import_failed',                                                                                      // 16
	CANCELLED: 'importer_import_cancelled'                                                                                // 17
});                                                                                                                    // 3
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ImporterSelection.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_importer/server/classes/ImporterSelection.js                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
/* globals Importer */ // Class for all the selection of users and channels for the importers                          // 1
Importer.Selection = Importer.Selection = // Constructs a new importer selection object.                               // 3
//                                                                                                                     // 5
// @param [String] name the name of the Importer                                                                       // 6
// @param [Array<Importer.User>] users the array of users                                                              // 7
// @param [Array<Importer.Channel>] channels the array of channels                                                     // 8
// @param [Integer] number of collected messages                                                                       // 9
//                                                                                                                     // 10
function () {                                                                                                          // 3
	function Selection(name, users, channels, message_count) {                                                            // 11
		(0, _classCallCheck3.default)(this, Selection);                                                                      // 11
		this.name = name;                                                                                                    // 12
		this.users = users;                                                                                                  // 13
		this.channels = channels;                                                                                            // 14
		this.message_count = message_count;                                                                                  // 15
	}                                                                                                                     // 16
                                                                                                                       //
	return Selection;                                                                                                     // 3
}();                                                                                                                   // 3
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ImporterSelectionChannel.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_importer/server/classes/ImporterSelectionChannel.js                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
/* globals Importer */ //  Class for the selection channels for ImporterSelection                                      // 1
Importer.SelectionChannel = Importer.SelectionChannel = // Constructs a new selection channel.                         // 3
//                                                                                                                     // 5
// @param [String] channel_id the unique identifier of the channel                                                     // 6
// @param [String] name the name of the channel                                                                        // 7
// @param [Boolean] is_archived whether the channel was archived or not                                                // 8
// @param [Boolean] do_import whether we will be importing the channel or not                                          // 9
// @param [Boolean] is_private whether the channel is private or public                                                // 10
//                                                                                                                     // 11
function () {                                                                                                          // 3
	function SelectionChannel(channel_id, name, is_archived, do_import, is_private) {                                     // 12
		(0, _classCallCheck3.default)(this, SelectionChannel);                                                               // 12
		this.channel_id = channel_id;                                                                                        // 13
		this.name = name;                                                                                                    // 14
		this.is_archived = is_archived;                                                                                      // 15
		this.do_import = do_import;                                                                                          // 16
		this.is_private = is_private;                                                                                        // 17
	}                                                                                                                     // 18
                                                                                                                       //
	return SelectionChannel;                                                                                              // 3
}(); //TODO: Add some verification?                                                                                    // 3
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ImporterSelectionUser.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_importer/server/classes/ImporterSelectionUser.js                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
/* globals Importer */ // Class for the selection users for ImporterSelection                                          // 1
Importer.SelectionUser = Importer.SelectionUser = // Constructs a new selection user.                                  // 3
//                                                                                                                     // 5
// @param [String] user_id the unique user identifier                                                                  // 6
// @param [String] username the user's username                                                                        // 7
// @param [String] email the user's email                                                                              // 8
// @param [Boolean] is_deleted whether the user was deleted or not                                                     // 9
// @param [Boolean] is_bot whether the user is a bot or not                                                            // 10
// @param [Boolean] do_import whether we are going to import this user or not                                          // 11
//                                                                                                                     // 12
function () {                                                                                                          // 3
	function SelectionUser(user_id, username, email, is_deleted, is_bot, do_import) {                                     // 13
		(0, _classCallCheck3.default)(this, SelectionUser);                                                                  // 13
		this.user_id = user_id;                                                                                              // 14
		this.username = username;                                                                                            // 15
		this.email = email;                                                                                                  // 16
		this.is_deleted = is_deleted;                                                                                        // 17
		this.is_bot = is_bot;                                                                                                // 18
		this.do_import = do_import;                                                                                          // 19
	}                                                                                                                     // 20
                                                                                                                       //
	return SelectionUser;                                                                                                 // 3
}(); //TODO: Add some verification?                                                                                    // 3
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"models":{"Imports.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_importer/server/models/Imports.js                                                               //
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
/* globals Importer */Importer.Imports = new (Importer.Imports = function (_RocketChat$models$_B) {                    // 1
	(0, _inherits3.default)(Imports, _RocketChat$models$_B);                                                              // 2
                                                                                                                       //
	function Imports() {                                                                                                  // 3
		(0, _classCallCheck3.default)(this, Imports);                                                                        // 3
		return (0, _possibleConstructorReturn3.default)(this, _RocketChat$models$_B.call(this, 'import'));                   // 3
	}                                                                                                                     // 5
                                                                                                                       //
	return Imports;                                                                                                       // 2
}(RocketChat.models._Base))();                                                                                         // 2
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"RawImports.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_importer/server/models/RawImports.js                                                            //
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
/* globals Importer */Importer.RawImports = new (Importer.RawImports = function (_RocketChat$models$_B) {              // 1
	(0, _inherits3.default)(RawImports, _RocketChat$models$_B);                                                           // 2
                                                                                                                       //
	function RawImports() {                                                                                               // 3
		(0, _classCallCheck3.default)(this, RawImports);                                                                     // 3
		return (0, _possibleConstructorReturn3.default)(this, _RocketChat$models$_B.call(this, 'raw_imports'));              // 3
	}                                                                                                                     // 5
                                                                                                                       //
	return RawImports;                                                                                                    // 2
}(RocketChat.models._Base))();                                                                                         // 2
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods":{"getImportProgress.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_importer/server/methods/getImportProgress.js                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals Importer */Meteor.methods({                                                                                 // 1
	getImportProgress: function (name) {                                                                                  // 3
		if (!Meteor.userId()) {                                                                                              // 4
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                      // 5
				method: 'getImportProgress'                                                                                        // 5
			});                                                                                                                 // 5
		}                                                                                                                    // 6
                                                                                                                       //
		if (!RocketChat.authz.hasPermission(Meteor.userId(), 'run-import')) {                                                // 8
			throw new Meteor.Error('error-action-not-allowed', 'Importing is not allowed', {                                    // 9
				method: 'setupImporter'                                                                                            // 9
			});                                                                                                                 // 9
		}                                                                                                                    // 10
                                                                                                                       //
		if (Importer.Importers[name] != null) {                                                                              // 12
			return Importer.Importers[name].importerInstance != null ? Importer.Importers[name].importerInstance.getProgress() : undefined;
		} else {                                                                                                             // 14
			throw new Meteor.Error('error-importer-not-defined', 'The importer was not defined correctly, it is missing the Import class.', {
				method: 'getImportProgress'                                                                                        // 15
			});                                                                                                                 // 15
		}                                                                                                                    // 16
	}                                                                                                                     // 17
});                                                                                                                    // 2
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getSelectionData.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_importer/server/methods/getSelectionData.js                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals Importer */Meteor.methods({                                                                                 // 1
	getSelectionData: function (name) {                                                                                   // 3
		if (!Meteor.userId()) {                                                                                              // 4
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                      // 5
				method: 'getSelectionData'                                                                                         // 5
			});                                                                                                                 // 5
		}                                                                                                                    // 6
                                                                                                                       //
		if (!RocketChat.authz.hasPermission(Meteor.userId(), 'run-import')) {                                                // 8
			throw new Meteor.Error('error-action-not-allowed', 'Importing is not allowed', {                                    // 9
				method: 'setupImporter'                                                                                            // 9
			});                                                                                                                 // 9
		}                                                                                                                    // 10
                                                                                                                       //
		if ((Importer.Importers[name] != null ? Importer.Importers[name].importerInstance : undefined) != null) {            // 12
			var progress = Importer.Importers[name].importerInstance.getProgress();                                             // 13
                                                                                                                       //
			switch (progress.step) {                                                                                            // 14
				case Importer.ProgressStep.USER_SELECTION:                                                                         // 15
					return Importer.Importers[name].importerInstance.getSelection();                                                  // 16
                                                                                                                       //
				default:                                                                                                           // 17
					return false;                                                                                                     // 18
			}                                                                                                                   // 14
		} else {                                                                                                             // 20
			throw new Meteor.Error('error-importer-not-defined', 'The importer was not defined correctly, it is missing the Import class.', {
				method: 'getSelectionData'                                                                                         // 21
			});                                                                                                                 // 21
		}                                                                                                                    // 22
	}                                                                                                                     // 23
});                                                                                                                    // 2
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"prepareImport.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_importer/server/methods/prepareImport.js                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _typeof2 = require("babel-runtime/helpers/typeof");                                                                //
                                                                                                                       //
var _typeof3 = _interopRequireDefault(_typeof2);                                                                       //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
/* globals Importer */Meteor.methods({                                                                                 // 1
	prepareImport: function (name, dataURI, contentType, fileName) {                                                      // 4
		if (!Meteor.userId()) {                                                                                              // 5
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                      // 6
				method: 'prepareImport'                                                                                            // 6
			});                                                                                                                 // 6
		}                                                                                                                    // 7
                                                                                                                       //
		if (!RocketChat.authz.hasPermission(Meteor.userId(), 'run-import')) {                                                // 9
			throw new Meteor.Error('error-action-not-allowed', 'Importing is not allowed', {                                    // 10
				method: 'setupImporter'                                                                                            // 10
			});                                                                                                                 // 10
		}                                                                                                                    // 11
                                                                                                                       //
		check(name, String);                                                                                                 // 13
		check(dataURI, String);                                                                                              // 14
		check(fileName, String);                                                                                             // 15
                                                                                                                       //
		if (name && Importer.Importers[name] && Importer.Importers[name].importerInstance) {                                 // 17
			var results = Importer.Importers[name].importerInstance.prepare(dataURI, contentType, fileName);                    // 18
                                                                                                                       //
			if ((typeof results === "undefined" ? "undefined" : (0, _typeof3.default)(results)) === 'object') {                 // 20
				if (results instanceof Promise) {                                                                                  // 21
					return results.catch(function (e) {                                                                               // 22
						throw new Meteor.Error(e);                                                                                       // 22
					});                                                                                                               // 22
				} else {                                                                                                           // 23
					return results;                                                                                                   // 24
				}                                                                                                                  // 25
			}                                                                                                                   // 26
		} else if (!name) {                                                                                                  // 27
			throw new Meteor.Error('error-importer-not-defined', "No Importer Found: \"" + name + "\"", {                       // 28
				method: 'prepareImport'                                                                                            // 28
			});                                                                                                                 // 28
		} else {                                                                                                             // 29
			throw new Meteor.Error('error-importer-not-defined', "The importer, \"" + name + "\", was not defined correctly, it is missing the Import class.", {
				method: 'prepareImport'                                                                                            // 30
			});                                                                                                                 // 30
		}                                                                                                                    // 31
	}                                                                                                                     // 32
});                                                                                                                    // 3
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"restartImport.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_importer/server/methods/restartImport.js                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals Importer*/Meteor.methods({                                                                                  // 1
	restartImport: function (name) {                                                                                      // 3
		if (!Meteor.userId()) {                                                                                              // 4
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                      // 5
				method: 'restartImport'                                                                                            // 5
			});                                                                                                                 // 5
		}                                                                                                                    // 6
                                                                                                                       //
		if (!RocketChat.authz.hasPermission(Meteor.userId(), 'run-import')) {                                                // 8
			throw new Meteor.Error('error-action-not-allowed', 'Importing is not allowed', {                                    // 9
				method: 'setupImporter'                                                                                            // 9
			});                                                                                                                 // 9
		}                                                                                                                    // 10
                                                                                                                       //
		if (Importer.Importers[name] != null) {                                                                              // 12
			var importer = Importer.Importers[name];                                                                            // 13
			importer.importerInstance.updateProgress(Importer.ProgressStep.CANCELLED);                                          // 14
			importer.importerInstance.updateRecord({                                                                            // 15
				valid: false                                                                                                       // 15
			});                                                                                                                 // 15
			importer.importerInstance = undefined;                                                                              // 16
			importer.importerInstance = new importer.importer(importer.name, importer.description, importer.mimeType); // eslint-disable-line new-cap
                                                                                                                       //
			return importer.importerInstance.getProgress();                                                                     // 18
		} else {                                                                                                             // 19
			throw new Meteor.Error('error-importer-not-defined', 'The importer was not defined correctly, it is missing the Import class.', {
				method: 'restartImport'                                                                                            // 20
			});                                                                                                                 // 20
		}                                                                                                                    // 21
	}                                                                                                                     // 22
});                                                                                                                    // 2
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"setupImporter.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_importer/server/methods/setupImporter.js                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals Importer */Meteor.methods({                                                                                 // 1
	setupImporter: function (name) {                                                                                      // 3
		if (!Meteor.userId()) {                                                                                              // 4
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                      // 5
				method: 'setupImporter'                                                                                            // 5
			});                                                                                                                 // 5
		}                                                                                                                    // 6
                                                                                                                       //
		if (!RocketChat.authz.hasPermission(Meteor.userId(), 'run-import')) {                                                // 8
			throw new Meteor.Error('error-action-not-allowed', 'Importing is not allowed', {                                    // 9
				method: 'setupImporter'                                                                                            // 9
			});                                                                                                                 // 9
		}                                                                                                                    // 10
                                                                                                                       //
		if ((Importer.Importers[name] != null ? Importer.Importers[name].importer : undefined) != null) {                    // 12
			var importer = Importer.Importers[name]; // If they currently have progress, get it and return the progress.        // 13
                                                                                                                       //
			if (importer.importerInstance) {                                                                                    // 15
				return importer.importerInstance.getProgress();                                                                    // 16
			} else {                                                                                                            // 17
				importer.importerInstance = new importer.importer(importer.name, importer.description, importer.mimeType); //eslint-disable-line new-cap
                                                                                                                       //
				return importer.importerInstance.getProgress();                                                                    // 19
			}                                                                                                                   // 20
		} else {                                                                                                             // 21
			console.warn("Tried to setup " + name + " as an importer.");                                                        // 22
			throw new Meteor.Error('error-importer-not-defined', 'The importer was not defined correctly, it is missing the Import class.', {
				method: 'setupImporter'                                                                                            // 23
			});                                                                                                                 // 23
		}                                                                                                                    // 24
	}                                                                                                                     // 25
});                                                                                                                    // 2
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"startImport.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_importer/server/methods/startImport.js                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals Importer */Meteor.methods({                                                                                 // 1
	startImport: function (name, input) {                                                                                 // 3
		// Takes name and object with users / channels selected to import                                                    // 4
		if (!Meteor.userId()) {                                                                                              // 5
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                      // 6
				method: 'startImport'                                                                                              // 6
			});                                                                                                                 // 6
		}                                                                                                                    // 7
                                                                                                                       //
		if (!RocketChat.authz.hasPermission(Meteor.userId(), 'run-import')) {                                                // 9
			throw new Meteor.Error('error-action-not-allowed', 'Importing is not allowed', {                                    // 10
				method: 'setupImporter'                                                                                            // 10
			});                                                                                                                 // 10
		}                                                                                                                    // 11
                                                                                                                       //
		if (Importer.Importers[name] && Importer.Importers[name].importerInstance) {                                         // 13
			var usersSelection = input.users.map(function (user) {                                                              // 14
				return new Importer.SelectionUser(user.user_id, user.username, user.email, user.is_deleted, user.is_bot, user.do_import);
			});                                                                                                                 // 14
			var channelsSelection = input.channels.map(function (channel) {                                                     // 15
				return new Importer.SelectionChannel(channel.channel_id, channel.name, channel.is_archived, channel.do_import);    // 15
			});                                                                                                                 // 15
			var selection = new Importer.Selection(name, usersSelection, channelsSelection);                                    // 17
			return Importer.Importers[name].importerInstance.startImport(selection);                                            // 18
		} else {                                                                                                             // 19
			throw new Meteor.Error('error-importer-not-defined', 'The importer was not defined correctly, it is missing the Import class.', {
				method: 'startImport'                                                                                              // 20
			});                                                                                                                 // 20
		}                                                                                                                    // 21
	}                                                                                                                     // 22
});                                                                                                                    // 2
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"startup":{"setImportsToInvalid.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_importer/server/startup/setImportsToInvalid.js                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals Importer */Meteor.startup(function () {                                                                     // 1
	// Make sure all imports are marked as invalid, data clean up since you can't                                         // 3
	// restart an import at the moment.                                                                                   // 4
	Importer.Imports.update({                                                                                             // 5
		valid: {                                                                                                             // 5
			$ne: false                                                                                                          // 5
		}                                                                                                                    // 5
	}, {                                                                                                                  // 5
		$set: {                                                                                                              // 5
			valid: false                                                                                                        // 5
		}                                                                                                                    // 5
	}, {                                                                                                                  // 5
		multi: true                                                                                                          // 5
	}); // Clean up all the raw import data, since you can't restart an import at the moment                              // 5
                                                                                                                       //
	return Importer.Imports.find({                                                                                        // 8
		valid: {                                                                                                             // 8
			$ne: true                                                                                                           // 8
		}                                                                                                                    // 8
	}).forEach(function (item) {                                                                                          // 8
		return Importer.RawImports.remove({                                                                                  // 8
			'import': item._id,                                                                                                 // 8
			'importer': item.type                                                                                               // 8
		});                                                                                                                  // 8
	});                                                                                                                   // 8
});                                                                                                                    // 9
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"node_modules":{"adm-zip":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// .npm/package/node_modules/adm-zip/package.json                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
exports.name = "adm-zip";
exports.version = "0.4.7";
exports.main = "adm-zip.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"adm-zip.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/rocketchat_importer/node_modules/adm-zip/adm-zip.js                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var fs = require("fs"),
    pth = require("path");

fs.existsSync = fs.existsSync || pth.existsSync;

var ZipEntry = require("./zipEntry"),
    ZipFile =  require("./zipFile"),
    Utils = require("./util");

module.exports = function(/*String*/input) {
    var _zip = undefined,
        _filename = "";

    if (input && typeof input === "string") { // load zip file
        if (fs.existsSync(input)) {
            _filename = input;
            _zip = new ZipFile(input, Utils.Constants.FILE);
        } else {
           throw Utils.Errors.INVALID_FILENAME;
        }
    } else if(input && Buffer.isBuffer(input)) { // load buffer
        _zip = new ZipFile(input, Utils.Constants.BUFFER);
    } else { // create new zip file
        _zip = new ZipFile(null, Utils.Constants.NONE);
    }

    function getEntry(/*Object*/entry) {
        if (entry && _zip) {
            var item;
            // If entry was given as a file name
            if (typeof entry === "string")
                item = _zip.getEntry(entry);
            // if entry was given as a ZipEntry object
            if (typeof entry === "object" && entry.entryName != undefined && entry.header != undefined)
                item =  _zip.getEntry(entry.entryName);

            if (item) {
                return item;
            }
        }
        return null;
    }

    return {
        /**
         * Extracts the given entry from the archive and returns the content as a Buffer object
         * @param entry ZipEntry object or String with the full path of the entry
         *
         * @return Buffer or Null in case of error
         */
        readFile : function(/*Object*/entry) {
            var item = getEntry(entry);
            return item && item.getData() || null;
        },

        /**
         * Asynchronous readFile
         * @param entry ZipEntry object or String with the full path of the entry
         * @param callback
         *
         * @return Buffer or Null in case of error
         */
        readFileAsync : function(/*Object*/entry, /*Function*/callback) {
            var item = getEntry(entry);
            if (item) {
                item.getDataAsync(callback);
            } else {
                callback(null,"getEntry failed for:" + entry)
            }
        },

        /**
         * Extracts the given entry from the archive and returns the content as plain text in the given encoding
         * @param entry ZipEntry object or String with the full path of the entry
         * @param encoding Optional. If no encoding is specified utf8 is used
         *
         * @return String
         */
        readAsText : function(/*Object*/entry, /*String - Optional*/encoding) {
            var item = getEntry(entry);
            if (item) {
                var data = item.getData();
                if (data && data.length) {
                    return data.toString(encoding || "utf8");
                }
            }
            return "";
        },

        /**
         * Asynchronous readAsText
         * @param entry ZipEntry object or String with the full path of the entry
         * @param callback
         * @param encoding Optional. If no encoding is specified utf8 is used
         *
         * @return String
         */
        readAsTextAsync : function(/*Object*/entry, /*Function*/callback, /*String - Optional*/encoding) {
            var item = getEntry(entry);
            if (item) {
                item.getDataAsync(function(data) {
                    if (data && data.length) {
                        callback(data.toString(encoding || "utf8"));
                    } else {
                        callback("");
                    }
                })
            } else {
                callback("");
            }
        },

        /**
         * Remove the entry from the file or the entry and all it's nested directories and files if the given entry is a directory
         *
         * @param entry
         */
        deleteFile : function(/*Object*/entry) { // @TODO: test deleteFile
            var item = getEntry(entry);
            if (item) {
                _zip.deleteEntry(item.entryName);
            }
        },

        /**
         * Adds a comment to the zip. The zip must be rewritten after adding the comment.
         *
         * @param comment
         */
        addZipComment : function(/*String*/comment) { // @TODO: test addZipComment
            _zip.comment = comment;
        },

        /**
         * Returns the zip comment
         *
         * @return String
         */
        getZipComment : function() {
            return _zip.comment || '';
        },

        /**
         * Adds a comment to a specified zipEntry. The zip must be rewritten after adding the comment
         * The comment cannot exceed 65535 characters in length
         *
         * @param entry
         * @param comment
         */
        addZipEntryComment : function(/*Object*/entry,/*String*/comment) {
            var item = getEntry(entry);
            if (item) {
                item.comment = comment;
            }
        },

        /**
         * Returns the comment of the specified entry
         *
         * @param entry
         * @return String
         */
        getZipEntryComment : function(/*Object*/entry) {
            var item = getEntry(entry);
            if (item) {
                return item.comment || '';
            }
            return ''
        },

        /**
         * Updates the content of an existing entry inside the archive. The zip must be rewritten after updating the content
         *
         * @param entry
         * @param content
         */
        updateFile : function(/*Object*/entry, /*Buffer*/content) {
            var item = getEntry(entry);
            if (item) {
                item.setData(content);
            }
        },

        /**
         * Adds a file from the disk to the archive
         *
         * @param localPath
         */
        addLocalFile : function(/*String*/localPath, /*String*/zipPath, /*String*/zipName) {
             if (fs.existsSync(localPath)) {
                if(zipPath){
                    zipPath=zipPath.split("\\").join("/");
                    if(zipPath.charAt(zipPath.length - 1) != "/"){
                        zipPath += "/";
                    }
                }else{
                    zipPath="";
                }
                 var p = localPath.split("\\").join("/").split("/").pop();
                
                 if(zipName){
                    this.addFile(zipPath+zipName, fs.readFileSync(localPath), "", 0)
                 }else{
                    this.addFile(zipPath+p, fs.readFileSync(localPath), "", 0)
                 }
             } else {
                 throw Utils.Errors.FILE_NOT_FOUND.replace("%s", localPath);
             }
        },

        /**
         * Adds a local directory and all its nested files and directories to the archive
         *
         * @param localPath
         * @param zipPath optional path inside zip
         * @param filter optional RegExp or Function if files match will
         *               be included.
         */
        addLocalFolder : function(/*String*/localPath, /*String*/zipPath, /*RegExp|Function*/filter) {
            if (filter === undefined) {
              filter = function() { return true; };
            } else if (filter instanceof RegExp) {
              filter = function(filter) {
                return function(filename) {
                  return filter.test(filename);
                }
              }(filter);
            }

            if(zipPath){
                zipPath=zipPath.split("\\").join("/");
                if(zipPath.charAt(zipPath.length - 1) != "/"){
                    zipPath += "/";
                }
            }else{
                zipPath="";
            }
			localPath = localPath.split("\\").join("/"); //windows fix
            localPath = pth.normalize(localPath);
            if (localPath.charAt(localPath.length - 1) != "/")
                localPath += "/";

            if (fs.existsSync(localPath)) {

                var items = Utils.findFiles(localPath),
                    self = this;

                if (items.length) {
                    items.forEach(function(path) {
						var p = path.split("\\").join("/").replace( new RegExp(localPath, 'i'), ""); //windows fix
                        if (filter(p)) {
                            if (p.charAt(p.length - 1) !== "/") {
                                self.addFile(zipPath+p, fs.readFileSync(path), "", 0)
                            } else {
                                self.addFile(zipPath+p, new Buffer(0), "", 0)
                            }
                        }
                    });
                }
            } else {
                throw Utils.Errors.FILE_NOT_FOUND.replace("%s", localPath);
            }
        },

        /**
         * Allows you to create a entry (file or directory) in the zip file.
         * If you want to create a directory the entryName must end in / and a null buffer should be provided.
         * Comment and attributes are optional
         *
         * @param entryName
         * @param content
         * @param comment
         * @param attr
         */
        addFile : function(/*String*/entryName, /*Buffer*/content, /*String*/comment, /*Number*/attr) {
            var entry = new ZipEntry();
            entry.entryName = entryName;
            entry.comment = comment || "";
            entry.attr = attr || 438; //0666;
            if (entry.isDirectory && content.length) {
               // throw Utils.Errors.DIRECTORY_CONTENT_ERROR;
            }
            entry.setData(content);
            _zip.setEntry(entry);
        },

        /**
         * Returns an array of ZipEntry objects representing the files and folders inside the archive
         *
         * @return Array
         */
        getEntries : function() {
            if (_zip) {
               return _zip.entries;
            } else {
                return [];
            }
        },

        /**
         * Returns a ZipEntry object representing the file or folder specified by ``name``.
         *
         * @param name
         * @return ZipEntry
         */
        getEntry : function(/*String*/name) {
            return getEntry(name);
        },

        /**
         * Extracts the given entry to the given targetPath
         * If the entry is a directory inside the archive, the entire directory and it's subdirectories will be extracted
         *
         * @param entry ZipEntry object or String with the full path of the entry
         * @param targetPath Target folder where to write the file
         * @param maintainEntryPath If maintainEntryPath is true and the entry is inside a folder, the entry folder
         *                          will be created in targetPath as well. Default is TRUE
         * @param overwrite If the file already exists at the target path, the file will be overwriten if this is true.
         *                  Default is FALSE
         *
         * @return Boolean
         */
        extractEntryTo : function(/*Object*/entry, /*String*/targetPath, /*Boolean*/maintainEntryPath, /*Boolean*/overwrite) {
            overwrite = overwrite || false;
            maintainEntryPath = typeof maintainEntryPath == "undefined" ? true : maintainEntryPath;

            var item = getEntry(entry);
            if (!item) {
                throw Utils.Errors.NO_ENTRY;
            }

            var target = pth.resolve(targetPath, maintainEntryPath ? item.entryName : pth.basename(item.entryName));

            if (item.isDirectory) {
                target = pth.resolve(target, "..");
                var children = _zip.getEntryChildren(item);
                children.forEach(function(child) {
                    if (child.isDirectory) return;
                    var content = child.getData();
                    if (!content) {
                        throw Utils.Errors.CANT_EXTRACT_FILE;
                    }
                    Utils.writeFileTo(pth.resolve(targetPath, maintainEntryPath ? child.entryName : child.entryName.substr(item.entryName.length)), content, overwrite);
                });
                return true;
            }

            var content = item.getData();
            if (!content) throw Utils.Errors.CANT_EXTRACT_FILE;

            if (fs.existsSync(target) && !overwrite) {
                throw Utils.Errors.CANT_OVERRIDE;
            }
            Utils.writeFileTo(target, content, overwrite);

            return true;
        },

        /**
         * Extracts the entire archive to the given location
         *
         * @param targetPath Target location
         * @param overwrite If the file already exists at the target path, the file will be overwriten if this is true.
         *                  Default is FALSE
         */
        extractAllTo : function(/*String*/targetPath, /*Boolean*/overwrite) {
            overwrite = overwrite || false;
            if (!_zip) {
                throw Utils.Errors.NO_ZIP;
            }

            _zip.entries.forEach(function(entry) {
                if (entry.isDirectory) {
                    Utils.makeDir(pth.resolve(targetPath, entry.entryName.toString()));
                    return;
                }
                var content = entry.getData();
                if (!content) {
                    throw Utils.Errors.CANT_EXTRACT_FILE + "2";
                }
                Utils.writeFileTo(pth.resolve(targetPath, entry.entryName.toString()), content, overwrite);
            })
        },

        /**
         * Asynchronous extractAllTo
         *
         * @param targetPath Target location
         * @param overwrite If the file already exists at the target path, the file will be overwriten if this is true.
         *                  Default is FALSE
         * @param callback
         */
        extractAllToAsync : function(/*String*/targetPath, /*Boolean*/overwrite, /*Function*/callback) {
            overwrite = overwrite || false;
            if (!_zip) {
                callback(new Error(Utils.Errors.NO_ZIP));
                return;
            }

            var entries = _zip.entries;
            var i = entries.length; 
            entries.forEach(function(entry) {
                if(i <= 0) return; // Had an error already

                if (entry.isDirectory) {
                    Utils.makeDir(pth.resolve(targetPath, entry.entryName.toString()));
                    if(--i == 0)
                        callback(undefined);
                    return;
                }
                entry.getDataAsync(function(content) {
                    if(i <= 0) return;
                    if (!content) {
                        i = 0;
                        callback(new Error(Utils.Errors.CANT_EXTRACT_FILE + "2"));
                        return;
                    }
                    Utils.writeFileToAsync(pth.resolve(targetPath, entry.entryName.toString()), content, overwrite, function(succ) {
                        if(i <= 0) return;

                        if(!succ) {
                            i = 0;
                            callback(new Error('Unable to write'));
                            return;
                        }

                        if(--i == 0)
                            callback(undefined);
                    });
                    
                });
            })
        },

        /**
         * Writes the newly created zip file to disk at the specified location or if a zip was opened and no ``targetFileName`` is provided, it will overwrite the opened zip
         *
         * @param targetFileName
         * @param callback
         */
        writeZip : function(/*String*/targetFileName, /*Function*/callback) {
            if (arguments.length == 1) {
                if (typeof targetFileName == "function") {
                    callback = targetFileName;
                    targetFileName = "";
                }
            }

            if (!targetFileName && _filename) {
                targetFileName = _filename;
            }
            if (!targetFileName) return;

            var zipData = _zip.compressToBuffer();
            if (zipData) {
                var ok = Utils.writeFileTo(targetFileName, zipData, true);
                if (typeof callback == 'function') callback(!ok? new Error("failed"): null, "");
            }
        },

        /**
         * Returns the content of the entire zip file as a Buffer object
         *
         * @return Buffer
         */
        toBuffer : function(/*Function*/onSuccess,/*Function*/onFail,/*Function*/onItemStart,/*Function*/onItemEnd) {
            this.valueOf = 2;
            if (typeof onSuccess == "function") {
                _zip.toAsyncBuffer(onSuccess,onFail,onItemStart,onItemEnd);
                return null;
            }
            return _zip.compressToBuffer()
        }
    }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"file-type":{"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/rocketchat_importer/node_modules/file-type/index.js                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
'use strict';
module.exports = input => {
	const buf = new Uint8Array(input);

	if (!(buf && buf.length > 1)) {
		return null;
	}

	if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) {
		return {
			ext: 'jpg',
			mime: 'image/jpeg'
		};
	}

	if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) {
		return {
			ext: 'png',
			mime: 'image/png'
		};
	}

	if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) {
		return {
			ext: 'gif',
			mime: 'image/gif'
		};
	}

	if (buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) {
		return {
			ext: 'webp',
			mime: 'image/webp'
		};
	}

	if (buf[0] === 0x46 && buf[1] === 0x4C && buf[2] === 0x49 && buf[3] === 0x46) {
		return {
			ext: 'flif',
			mime: 'image/flif'
		};
	}

	// needs to be before `tif` check
	if (((buf[0] === 0x49 && buf[1] === 0x49 && buf[2] === 0x2A && buf[3] === 0x0) || (buf[0] === 0x4D && buf[1] === 0x4D && buf[2] === 0x0 && buf[3] === 0x2A)) && buf[8] === 0x43 && buf[9] === 0x52) {
		return {
			ext: 'cr2',
			mime: 'image/x-canon-cr2'
		};
	}

	if ((buf[0] === 0x49 && buf[1] === 0x49 && buf[2] === 0x2A && buf[3] === 0x0) || (buf[0] === 0x4D && buf[1] === 0x4D && buf[2] === 0x0 && buf[3] === 0x2A)) {
		return {
			ext: 'tif',
			mime: 'image/tiff'
		};
	}

	if (buf[0] === 0x42 && buf[1] === 0x4D) {
		return {
			ext: 'bmp',
			mime: 'image/bmp'
		};
	}

	if (buf[0] === 0x49 && buf[1] === 0x49 && buf[2] === 0xBC) {
		return {
			ext: 'jxr',
			mime: 'image/vnd.ms-photo'
		};
	}

	if (buf[0] === 0x38 && buf[1] === 0x42 && buf[2] === 0x50 && buf[3] === 0x53) {
		return {
			ext: 'psd',
			mime: 'image/vnd.adobe.photoshop'
		};
	}

	// needs to be before `zip` check
	if (buf[0] === 0x50 && buf[1] === 0x4B && buf[2] === 0x3 && buf[3] === 0x4 && buf[30] === 0x6D && buf[31] === 0x69 && buf[32] === 0x6D && buf[33] === 0x65 && buf[34] === 0x74 && buf[35] === 0x79 && buf[36] === 0x70 && buf[37] === 0x65 && buf[38] === 0x61 && buf[39] === 0x70 && buf[40] === 0x70 && buf[41] === 0x6C && buf[42] === 0x69 && buf[43] === 0x63 && buf[44] === 0x61 && buf[45] === 0x74 && buf[46] === 0x69 && buf[47] === 0x6F && buf[48] === 0x6E && buf[49] === 0x2F && buf[50] === 0x65 && buf[51] === 0x70 && buf[52] === 0x75 && buf[53] === 0x62 && buf[54] === 0x2B && buf[55] === 0x7A && buf[56] === 0x69 && buf[57] === 0x70) {
		return {
			ext: 'epub',
			mime: 'application/epub+zip'
		};
	}

	// needs to be before `zip` check
	// assumes signed .xpi from addons.mozilla.org
	if (buf[0] === 0x50 && buf[1] === 0x4B && buf[2] === 0x3 && buf[3] === 0x4 && buf[30] === 0x4D && buf[31] === 0x45 && buf[32] === 0x54 && buf[33] === 0x41 && buf[34] === 0x2D && buf[35] === 0x49 && buf[36] === 0x4E && buf[37] === 0x46 && buf[38] === 0x2F && buf[39] === 0x6D && buf[40] === 0x6F && buf[41] === 0x7A && buf[42] === 0x69 && buf[43] === 0x6C && buf[44] === 0x6C && buf[45] === 0x61 && buf[46] === 0x2E && buf[47] === 0x72 && buf[48] === 0x73 && buf[49] === 0x61) {
		return {
			ext: 'xpi',
			mime: 'application/x-xpinstall'
		};
	}

	if (buf[0] === 0x50 && buf[1] === 0x4B && (buf[2] === 0x3 || buf[2] === 0x5 || buf[2] === 0x7) && (buf[3] === 0x4 || buf[3] === 0x6 || buf[3] === 0x8)) {
		return {
			ext: 'zip',
			mime: 'application/zip'
		};
	}

	if (buf[257] === 0x75 && buf[258] === 0x73 && buf[259] === 0x74 && buf[260] === 0x61 && buf[261] === 0x72) {
		return {
			ext: 'tar',
			mime: 'application/x-tar'
		};
	}

	if (buf[0] === 0x52 && buf[1] === 0x61 && buf[2] === 0x72 && buf[3] === 0x21 && buf[4] === 0x1A && buf[5] === 0x7 && (buf[6] === 0x0 || buf[6] === 0x1)) {
		return {
			ext: 'rar',
			mime: 'application/x-rar-compressed'
		};
	}

	if (buf[0] === 0x1F && buf[1] === 0x8B && buf[2] === 0x8) {
		return {
			ext: 'gz',
			mime: 'application/gzip'
		};
	}

	if (buf[0] === 0x42 && buf[1] === 0x5A && buf[2] === 0x68) {
		return {
			ext: 'bz2',
			mime: 'application/x-bzip2'
		};
	}

	if (buf[0] === 0x37 && buf[1] === 0x7A && buf[2] === 0xBC && buf[3] === 0xAF && buf[4] === 0x27 && buf[5] === 0x1C) {
		return {
			ext: '7z',
			mime: 'application/x-7z-compressed'
		};
	}

	if (buf[0] === 0x78 && buf[1] === 0x01) {
		return {
			ext: 'dmg',
			mime: 'application/x-apple-diskimage'
		};
	}

	if (
		(buf[0] === 0x0 && buf[1] === 0x0 && buf[2] === 0x0 && (buf[3] === 0x18 || buf[3] === 0x20) && buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70) ||
		(buf[0] === 0x33 && buf[1] === 0x67 && buf[2] === 0x70 && buf[3] === 0x35) ||
		(buf[0] === 0x0 && buf[1] === 0x0 && buf[2] === 0x0 && buf[3] === 0x1C && buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70 && buf[8] === 0x6D && buf[9] === 0x70 && buf[10] === 0x34 && buf[11] === 0x32 && buf[16] === 0x6D && buf[17] === 0x70 && buf[18] === 0x34 && buf[19] === 0x31 && buf[20] === 0x6D && buf[21] === 0x70 && buf[22] === 0x34 && buf[23] === 0x32 && buf[24] === 0x69 && buf[25] === 0x73 && buf[26] === 0x6F && buf[27] === 0x6D) ||
		(buf[0] === 0x0 && buf[1] === 0x0 && buf[2] === 0x0 && buf[3] === 0x1C && buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70 && buf[8] === 0x69 && buf[9] === 0x73 && buf[10] === 0x6F && buf[11] === 0x6D) ||
		(buf[0] === 0x0 && buf[1] === 0x0 && buf[2] === 0x0 && buf[3] === 0x1c && buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70 && buf[8] === 0x6D && buf[9] === 0x70 && buf[10] === 0x34 && buf[11] === 0x32 && buf[12] === 0x0 && buf[13] === 0x0 && buf[14] === 0x0 && buf[15] === 0x0)
	) {
		return {
			ext: 'mp4',
			mime: 'video/mp4'
		};
	}

	if ((buf[0] === 0x0 && buf[1] === 0x0 && buf[2] === 0x0 && buf[3] === 0x1C && buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70 && buf[8] === 0x4D && buf[9] === 0x34 && buf[10] === 0x56)) {
		return {
			ext: 'm4v',
			mime: 'video/x-m4v'
		};
	}

	if (buf[0] === 0x4D && buf[1] === 0x54 && buf[2] === 0x68 && buf[3] === 0x64) {
		return {
			ext: 'mid',
			mime: 'audio/midi'
		};
	}

	// https://github.com/threatstack/libmagic/blob/master/magic/Magdir/matroska
	if (buf[0] === 0x1A && buf[1] === 0x45 && buf[2] === 0xDF && buf[3] === 0xA3) {
		const sliced = buf.subarray(4, 4 + 4096);
		const idPos = sliced.findIndex((el, i, arr) => arr[i] === 0x42 && arr[i + 1] === 0x82);

		if (idPos >= 0) {
			const docTypePos = idPos + 3;
			const findDocType = type => Array.from(type).every((c, i) => sliced[docTypePos + i] === c.charCodeAt(0));

			if (findDocType('matroska')) {
				return {
					ext: 'mkv',
					mime: 'video/x-matroska'
				};
			}
			if (findDocType('webm')) {
				return {
					ext: 'webm',
					mime: 'video/webm'
				};
			}
		}
	}

	if (buf[0] === 0x0 && buf[1] === 0x0 && buf[2] === 0x0 && buf[3] === 0x14 && buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70) {
		return {
			ext: 'mov',
			mime: 'video/quicktime'
		};
	}

	if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 && buf[8] === 0x41 && buf[9] === 0x56 && buf[10] === 0x49) {
		return {
			ext: 'avi',
			mime: 'video/x-msvideo'
		};
	}

	if (buf[0] === 0x30 && buf[1] === 0x26 && buf[2] === 0xB2 && buf[3] === 0x75 && buf[4] === 0x8E && buf[5] === 0x66 && buf[6] === 0xCF && buf[7] === 0x11 && buf[8] === 0xA6 && buf[9] === 0xD9) {
		return {
			ext: 'wmv',
			mime: 'video/x-ms-wmv'
		};
	}

	if (buf[0] === 0x0 && buf[1] === 0x0 && buf[2] === 0x1 && buf[3].toString(16)[0] === 'b') {
		return {
			ext: 'mpg',
			mime: 'video/mpeg'
		};
	}

	if ((buf[0] === 0x49 && buf[1] === 0x44 && buf[2] === 0x33) || (buf[0] === 0xFF && buf[1] === 0xfb)) {
		return {
			ext: 'mp3',
			mime: 'audio/mpeg'
		};
	}

	if ((buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70 && buf[8] === 0x4D && buf[9] === 0x34 && buf[10] === 0x41) || (buf[0] === 0x4D && buf[1] === 0x34 && buf[2] === 0x41 && buf[3] === 0x20)) {
		return {
			ext: 'm4a',
			mime: 'audio/m4a'
		};
	}

	// needs to be before `ogg` check
	if (buf[28] === 0x4F && buf[29] === 0x70 && buf[30] === 0x75 && buf[31] === 0x73 && buf[32] === 0x48 && buf[33] === 0x65 && buf[34] === 0x61 && buf[35] === 0x64) {
		return {
			ext: 'opus',
			mime: 'audio/opus'
		};
	}

	if (buf[0] === 0x4F && buf[1] === 0x67 && buf[2] === 0x67 && buf[3] === 0x53) {
		return {
			ext: 'ogg',
			mime: 'audio/ogg'
		};
	}

	if (buf[0] === 0x66 && buf[1] === 0x4C && buf[2] === 0x61 && buf[3] === 0x43) {
		return {
			ext: 'flac',
			mime: 'audio/x-flac'
		};
	}

	if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 && buf[8] === 0x57 && buf[9] === 0x41 && buf[10] === 0x56 && buf[11] === 0x45) {
		return {
			ext: 'wav',
			mime: 'audio/x-wav'
		};
	}

	if (buf[0] === 0x23 && buf[1] === 0x21 && buf[2] === 0x41 && buf[3] === 0x4D && buf[4] === 0x52 && buf[5] === 0x0A) {
		return {
			ext: 'amr',
			mime: 'audio/amr'
		};
	}

	if (buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46) {
		return {
			ext: 'pdf',
			mime: 'application/pdf'
		};
	}

	if (buf[0] === 0x4D && buf[1] === 0x5A) {
		return {
			ext: 'exe',
			mime: 'application/x-msdownload'
		};
	}

	if ((buf[0] === 0x43 || buf[0] === 0x46) && buf[1] === 0x57 && buf[2] === 0x53) {
		return {
			ext: 'swf',
			mime: 'application/x-shockwave-flash'
		};
	}

	if (buf[0] === 0x7B && buf[1] === 0x5C && buf[2] === 0x72 && buf[3] === 0x74 && buf[4] === 0x66) {
		return {
			ext: 'rtf',
			mime: 'application/rtf'
		};
	}

	if (
		(buf[0] === 0x77 && buf[1] === 0x4F && buf[2] === 0x46 && buf[3] === 0x46) &&
		(
			(buf[4] === 0x00 && buf[5] === 0x01 && buf[6] === 0x00 && buf[7] === 0x00) ||
			(buf[4] === 0x4F && buf[5] === 0x54 && buf[6] === 0x54 && buf[7] === 0x4F)
		)
	) {
		return {
			ext: 'woff',
			mime: 'application/font-woff'
		};
	}

	if (
		(buf[0] === 0x77 && buf[1] === 0x4F && buf[2] === 0x46 && buf[3] === 0x32) &&
		(
			(buf[4] === 0x00 && buf[5] === 0x01 && buf[6] === 0x00 && buf[7] === 0x00) ||
			(buf[4] === 0x4F && buf[5] === 0x54 && buf[6] === 0x54 && buf[7] === 0x4F)
		)
	) {
		return {
			ext: 'woff2',
			mime: 'application/font-woff'
		};
	}

	if (
		(buf[34] === 0x4C && buf[35] === 0x50) &&
		(
			(buf[8] === 0x00 && buf[9] === 0x00 && buf[10] === 0x01) ||
			(buf[8] === 0x01 && buf[9] === 0x00 && buf[10] === 0x02) ||
			(buf[8] === 0x02 && buf[9] === 0x00 && buf[10] === 0x02)
		)
	) {
		return {
			ext: 'eot',
			mime: 'application/octet-stream'
		};
	}

	if (buf[0] === 0x00 && buf[1] === 0x01 && buf[2] === 0x00 && buf[3] === 0x00 && buf[4] === 0x00) {
		return {
			ext: 'ttf',
			mime: 'application/font-sfnt'
		};
	}

	if (buf[0] === 0x4F && buf[1] === 0x54 && buf[2] === 0x54 && buf[3] === 0x4F && buf[4] === 0x00) {
		return {
			ext: 'otf',
			mime: 'application/font-sfnt'
		};
	}

	if (buf[0] === 0x00 && buf[1] === 0x00 && buf[2] === 0x01 && buf[3] === 0x00) {
		return {
			ext: 'ico',
			mime: 'image/x-icon'
		};
	}

	if (buf[0] === 0x46 && buf[1] === 0x4C && buf[2] === 0x56 && buf[3] === 0x01) {
		return {
			ext: 'flv',
			mime: 'video/x-flv'
		};
	}

	if (buf[0] === 0x25 && buf[1] === 0x21) {
		return {
			ext: 'ps',
			mime: 'application/postscript'
		};
	}

	if (buf[0] === 0xFD && buf[1] === 0x37 && buf[2] === 0x7A && buf[3] === 0x58 && buf[4] === 0x5A && buf[5] === 0x00) {
		return {
			ext: 'xz',
			mime: 'application/x-xz'
		};
	}

	if (buf[0] === 0x53 && buf[1] === 0x51 && buf[2] === 0x4C && buf[3] === 0x69) {
		return {
			ext: 'sqlite',
			mime: 'application/x-sqlite3'
		};
	}

	if (buf[0] === 0x4E && buf[1] === 0x45 && buf[2] === 0x53 && buf[3] === 0x1A) {
		return {
			ext: 'nes',
			mime: 'application/x-nintendo-nes-rom'
		};
	}

	if (buf[0] === 0x43 && buf[1] === 0x72 && buf[2] === 0x32 && buf[3] === 0x34) {
		return {
			ext: 'crx',
			mime: 'application/x-google-chrome-extension'
		};
	}

	if (
		(buf[0] === 0x4D && buf[1] === 0x53 && buf[2] === 0x43 && buf[3] === 0x46) ||
		(buf[0] === 0x49 && buf[1] === 0x53 && buf[2] === 0x63 && buf[3] === 0x28)
	) {
		return {
			ext: 'cab',
			mime: 'application/vnd.ms-cab-compressed'
		};
	}

	// needs to be before `ar` check
	if (buf[0] === 0x21 && buf[1] === 0x3C && buf[2] === 0x61 && buf[3] === 0x72 && buf[4] === 0x63 && buf[5] === 0x68 && buf[6] === 0x3E && buf[7] === 0x0A && buf[8] === 0x64 && buf[9] === 0x65 && buf[10] === 0x62 && buf[11] === 0x69 && buf[12] === 0x61 && buf[13] === 0x6E && buf[14] === 0x2D && buf[15] === 0x62 && buf[16] === 0x69 && buf[17] === 0x6E && buf[18] === 0x61 && buf[19] === 0x72 && buf[20] === 0x79) {
		return {
			ext: 'deb',
			mime: 'application/x-deb'
		};
	}

	if (buf[0] === 0x21 && buf[1] === 0x3C && buf[2] === 0x61 && buf[3] === 0x72 && buf[4] === 0x63 && buf[5] === 0x68 && buf[6] === 0x3E) {
		return {
			ext: 'ar',
			mime: 'application/x-unix-archive'
		};
	}

	if (buf[0] === 0xED && buf[1] === 0xAB && buf[2] === 0xEE && buf[3] === 0xDB) {
		return {
			ext: 'rpm',
			mime: 'application/x-rpm'
		};
	}

	if (
		(buf[0] === 0x1F && buf[1] === 0xA0) ||
		(buf[0] === 0x1F && buf[1] === 0x9D)
	) {
		return {
			ext: 'Z',
			mime: 'application/x-compress'
		};
	}

	if (buf[0] === 0x4C && buf[1] === 0x5A && buf[2] === 0x49 && buf[3] === 0x50) {
		return {
			ext: 'lz',
			mime: 'application/x-lzip'
		};
	}

	if (buf[0] === 0xD0 && buf[1] === 0xCF && buf[2] === 0x11 && buf[3] === 0xE0 && buf[4] === 0xA1 && buf[5] === 0xB1 && buf[6] === 0x1A && buf[7] === 0xE1) {
		return {
			ext: 'msi',
			mime: 'application/x-msi'
		};
	}

	return null;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"bson":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// .npm/package/node_modules/bson/package.json                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
exports.name = "bson";
exports.version = "0.5.5";
exports.main = "./lib/bson/index";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"bson":{"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/rocketchat_importer/node_modules/bson/lib/bson/index.js                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
try {
  exports.BSONPure = require('./bson');
  exports.BSONNative = require('./bson');
} catch(err) {
}

[ './binary'
  , './code'
  , './map'
  , './db_ref'
  , './double'
  , './int_32'
  , './max_key'
  , './min_key'
  , './objectid'
  , './regexp'
  , './symbol'
  , './decimal128'
  , './timestamp'
  , './long'].forEach(function (path) {
  	var module = require(path);
  	for (var i in module) {
  		exports[i] = module[i];
    }
});

// Exports all the classes for the PURE JS BSON Parser
exports.pure = function() {
  var classes = {};
  // Map all the classes
  [ './binary'
    , './code'
    , './map'
    , './db_ref'
    , './double'
    , './int_32'
    , './max_key'
    , './min_key'
    , './objectid'
    , './regexp'
    , './symbol'
    , './decimal128'
    , './timestamp'
    , './long'
    , './bson'].forEach(function (path) {
    	var module = require(path);
    	for (var i in module) {
    		classes[i] = module[i];
      }
  });
  // Return classes list
  return classes;
}

// Exports all the classes for the NATIVE JS BSON Parser
exports.native = function() {
  var classes = {};
  // Map all the classes
  [ './binary'
    , './code'
    , './map'
    , './db_ref'
    , './double'
    , './int_32'
    , './max_key'
    , './min_key'
    , './objectid'
    , './regexp'
    , './symbol'
    , './decimal128'
    , './timestamp'
    , './long'
  ].forEach(function (path) {
      var module = require(path);
      for (var i in module) {
        classes[i] = module[i];
      }
  });

  // Catch error and return no classes found
  try {
    classes['BSON'] = require('./bson');
  } catch(err) {
    return exports.pure();
  }

  // Return classes list
  return classes;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:importer/lib/_importer.js");
require("./node_modules/meteor/rocketchat:importer/lib/importTool.js");
require("./node_modules/meteor/rocketchat:importer/server/classes/ImporterBase.js");
require("./node_modules/meteor/rocketchat:importer/server/classes/ImporterProgress.js");
require("./node_modules/meteor/rocketchat:importer/server/classes/ImporterProgressStep.js");
require("./node_modules/meteor/rocketchat:importer/server/classes/ImporterSelection.js");
require("./node_modules/meteor/rocketchat:importer/server/classes/ImporterSelectionChannel.js");
require("./node_modules/meteor/rocketchat:importer/server/classes/ImporterSelectionUser.js");
require("./node_modules/meteor/rocketchat:importer/server/models/Imports.js");
require("./node_modules/meteor/rocketchat:importer/server/models/RawImports.js");
require("./node_modules/meteor/rocketchat:importer/server/methods/getImportProgress.js");
require("./node_modules/meteor/rocketchat:importer/server/methods/getSelectionData.js");
require("./node_modules/meteor/rocketchat:importer/server/methods/prepareImport.js");
require("./node_modules/meteor/rocketchat:importer/server/methods/restartImport.js");
require("./node_modules/meteor/rocketchat:importer/server/methods/setupImporter.js");
require("./node_modules/meteor/rocketchat:importer/server/methods/startImport.js");
require("./node_modules/meteor/rocketchat:importer/server/startup/setImportsToInvalid.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['rocketchat:importer'] = {}, {
  Importer: Importer
});

})();

//# sourceMappingURL=rocketchat_importer.js.map

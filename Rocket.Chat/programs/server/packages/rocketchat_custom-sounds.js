(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var RocketChatFile = Package['rocketchat:file'].RocketChatFile;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RocketChatTabBar = Package['rocketchat:lib'].RocketChatTabBar;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var _ = Package.underscore._;
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
var self;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:custom-sounds":{"server":{"startup":{"custom-sounds.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/rocketchat_custom-sounds/server/startup/custom-sounds.js                                             //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
/* globals RocketChatFileCustomSoundsInstance */Meteor.startup(function () {                                     // 1
	var storeType = 'GridFS';                                                                                       // 3
                                                                                                                 //
	if (RocketChat.settings.get('CustomSounds_Storage_Type')) {                                                     // 5
		storeType = RocketChat.settings.get('CustomSounds_Storage_Type');                                              // 6
	}                                                                                                               // 7
                                                                                                                 //
	var RocketChatStore = RocketChatFile[storeType];                                                                // 9
                                                                                                                 //
	if (RocketChatStore == null) {                                                                                  // 11
		throw new Error("Invalid RocketChatStore type [" + storeType + "]");                                           // 12
	}                                                                                                               // 13
                                                                                                                 //
	console.log(("Using " + storeType + " for custom sounds storage").green);                                       // 15
	var path = '~/uploads';                                                                                         // 17
                                                                                                                 //
	if (RocketChat.settings.get('CustomSounds_FileSystemPath') != null) {                                           // 18
		if (RocketChat.settings.get('CustomSounds_FileSystemPath').trim() !== '') {                                    // 19
			path = RocketChat.settings.get('CustomSounds_FileSystemPath');                                                // 20
		}                                                                                                              // 21
	}                                                                                                               // 22
                                                                                                                 //
	this.RocketChatFileCustomSoundsInstance = new RocketChatStore({                                                 // 24
		name: 'custom_sounds',                                                                                         // 25
		absolutePath: path                                                                                             // 26
	});                                                                                                             // 24
	self = this;                                                                                                    // 29
	return WebApp.connectHandlers.use('/custom-sounds/', Meteor.bindEnvironment(function (req, res /*, next*/) {    // 31
		var params = {                                                                                                 // 32
			sound: decodeURIComponent(req.url.replace(/^\//, '').replace(/\?.*$/, ''))                                    // 33
		};                                                                                                             // 33
                                                                                                                 //
		if (_.isEmpty(params.sound)) {                                                                                 // 35
			res.writeHead(403);                                                                                           // 36
			res.write('Forbidden');                                                                                       // 37
			res.end();                                                                                                    // 38
			return;                                                                                                       // 39
		}                                                                                                              // 40
                                                                                                                 //
		var file = RocketChatFileCustomSoundsInstance.getFileWithReadStream(params.sound);                             // 42
                                                                                                                 //
		if (!file) {                                                                                                   // 43
			return;                                                                                                       // 44
		}                                                                                                              // 45
                                                                                                                 //
		res.setHeader('Content-Disposition', 'inline');                                                                // 47
		var fileUploadDate = undefined;                                                                                // 49
                                                                                                                 //
		if (file.uploadDate != null) {                                                                                 // 50
			fileUploadDate = file.uploadDate.toUTCString();                                                               // 51
		}                                                                                                              // 52
                                                                                                                 //
		var reqModifiedHeader = req.headers['if-modified-since'];                                                      // 54
                                                                                                                 //
		if (reqModifiedHeader != null) {                                                                               // 55
			if (reqModifiedHeader === fileUploadDate) {                                                                   // 56
				res.setHeader('Last-Modified', reqModifiedHeader);                                                           // 57
				res.writeHead(304);                                                                                          // 58
				res.end();                                                                                                   // 59
				return;                                                                                                      // 60
			}                                                                                                             // 61
		}                                                                                                              // 62
                                                                                                                 //
		res.setHeader('Cache-Control', 'public, max-age=0');                                                           // 64
		res.setHeader('Expires', '-1');                                                                                // 65
                                                                                                                 //
		if (fileUploadDate != null) {                                                                                  // 66
			res.setHeader('Last-Modified', fileUploadDate);                                                               // 67
		} else {                                                                                                       // 68
			res.setHeader('Last-Modified', new Date().toUTCString());                                                     // 69
		}                                                                                                              // 70
                                                                                                                 //
		res.setHeader('Content-Type', 'audio/mpeg');                                                                   // 71
		res.setHeader('Content-Length', file.length);                                                                  // 72
		file.readStream.pipe(res);                                                                                     // 74
	}));                                                                                                            // 75
});                                                                                                              // 76
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"permissions.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/rocketchat_custom-sounds/server/startup/permissions.js                                               //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Meteor.startup(function () {                                                                                     // 1
	if (RocketChat.models && RocketChat.models.Permissions) {                                                       // 2
		RocketChat.models.Permissions.createOrUpdate('manage-sounds', ['admin']);                                      // 3
	}                                                                                                               // 4
});                                                                                                              // 5
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"settings.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/rocketchat_custom-sounds/server/startup/settings.js                                                  //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
RocketChat.settings.addGroup('CustomSoundsFilesystem', function () {                                             // 1
	this.add('CustomSounds_Storage_Type', 'GridFS', {                                                               // 2
		type: 'select',                                                                                                // 3
		values: [{                                                                                                     // 4
			key: 'GridFS',                                                                                                // 5
			i18nLabel: 'GridFS'                                                                                           // 6
		}, {                                                                                                           // 4
			key: 'FileSystem',                                                                                            // 8
			i18nLabel: 'FileSystem'                                                                                       // 9
		}],                                                                                                            // 7
		i18nLabel: 'FileUpload_Storage_Type'                                                                           // 11
	});                                                                                                             // 2
	this.add('CustomSounds_FileSystemPath', '', {                                                                   // 14
		type: 'string',                                                                                                // 15
		enableQuery: {                                                                                                 // 16
			_id: 'CustomSounds_Storage_Type',                                                                             // 17
			value: 'FileSystem'                                                                                           // 18
		},                                                                                                             // 16
		i18nLabel: 'FileUpload_FileSystemPath'                                                                         // 20
	});                                                                                                             // 14
});                                                                                                              // 22
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"models":{"CustomSounds.js":function(require){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/rocketchat_custom-sounds/server/models/CustomSounds.js                                               //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                          //
                                                                                                                 //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                 //
                                                                                                                 //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                    //
                                                                                                                 //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                           //
                                                                                                                 //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                      //
                                                                                                                 //
var _inherits3 = _interopRequireDefault(_inherits2);                                                             //
                                                                                                                 //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                //
                                                                                                                 //
var CustomSounds = function (_RocketChat$models$_B) {                                                            //
	(0, _inherits3.default)(CustomSounds, _RocketChat$models$_B);                                                   //
                                                                                                                 //
	function CustomSounds() {                                                                                       // 2
		(0, _classCallCheck3.default)(this, CustomSounds);                                                             // 2
                                                                                                                 //
		var _this = (0, _possibleConstructorReturn3.default)(this, _RocketChat$models$_B.call(this, 'custom_sounds'));
                                                                                                                 //
		_this.tryEnsureIndex({                                                                                         // 5
			'name': 1                                                                                                     // 5
		});                                                                                                            // 5
                                                                                                                 //
		return _this;                                                                                                  // 2
	} //find one                                                                                                    // 6
                                                                                                                 //
                                                                                                                 //
	CustomSounds.prototype.findOneByID = function () {                                                              //
		function findOneByID(_id, options) {                                                                           //
			return this.findOne(_id, options);                                                                            // 10
		}                                                                                                              // 11
                                                                                                                 //
		return findOneByID;                                                                                            //
	}(); //find                                                                                                     //
                                                                                                                 //
                                                                                                                 //
	CustomSounds.prototype.findByName = function () {                                                               //
		function findByName(name, options) {                                                                           //
			var query = {                                                                                                 // 15
				name: name                                                                                                   // 16
			};                                                                                                            // 15
			return this.find(query, options);                                                                             // 19
		}                                                                                                              // 20
                                                                                                                 //
		return findByName;                                                                                             //
	}();                                                                                                            //
                                                                                                                 //
	CustomSounds.prototype.findByNameExceptID = function () {                                                       //
		function findByNameExceptID(name, except, options) {                                                           //
			var query = {                                                                                                 // 23
				_id: {                                                                                                       // 24
					$nin: [except]                                                                                              // 24
				},                                                                                                           // 24
				name: name                                                                                                   // 25
			};                                                                                                            // 23
			return this.find(query, options);                                                                             // 28
		}                                                                                                              // 29
                                                                                                                 //
		return findByNameExceptID;                                                                                     //
	}(); //update                                                                                                   //
                                                                                                                 //
                                                                                                                 //
	CustomSounds.prototype.setName = function () {                                                                  //
		function setName(_id, name) {                                                                                  //
			var update = {                                                                                                // 33
				$set: {                                                                                                      // 34
					name: name                                                                                                  // 35
				}                                                                                                            // 34
			};                                                                                                            // 33
			return this.update({                                                                                          // 39
				_id: _id                                                                                                     // 39
			}, update);                                                                                                   // 39
		}                                                                                                              // 40
                                                                                                                 //
		return setName;                                                                                                //
	}(); // INSERT                                                                                                  //
                                                                                                                 //
                                                                                                                 //
	CustomSounds.prototype.create = function () {                                                                   //
		function create(data) {                                                                                        //
			return this.insert(data);                                                                                     // 44
		}                                                                                                              // 45
                                                                                                                 //
		return create;                                                                                                 //
	}(); // REMOVE                                                                                                  //
                                                                                                                 //
                                                                                                                 //
	CustomSounds.prototype.removeByID = function () {                                                               //
		function removeByID(_id) {                                                                                     //
			return this.remove(_id);                                                                                      // 50
		}                                                                                                              // 51
                                                                                                                 //
		return removeByID;                                                                                             //
	}();                                                                                                            //
                                                                                                                 //
	return CustomSounds;                                                                                            //
}(RocketChat.models._Base);                                                                                      //
                                                                                                                 //
RocketChat.models.CustomSounds = new CustomSounds();                                                             // 54
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"publications":{"customSounds.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/rocketchat_custom-sounds/server/publications/customSounds.js                                         //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Meteor.publish('customSounds', function (filter, limit) {                                                        // 1
	if (!this.userId) {                                                                                             // 2
		return this.ready();                                                                                           // 3
	}                                                                                                               // 4
                                                                                                                 //
	var fields = {                                                                                                  // 6
		name: 1,                                                                                                       // 7
		extension: 1                                                                                                   // 8
	};                                                                                                              // 6
	filter = s.trim(filter);                                                                                        // 11
	var options = {                                                                                                 // 13
		fields: fields,                                                                                                // 14
		limit: limit,                                                                                                  // 15
		sort: {                                                                                                        // 16
			name: 1                                                                                                       // 16
		}                                                                                                              // 16
	};                                                                                                              // 13
                                                                                                                 //
	if (filter) {                                                                                                   // 19
		var filterReg = new RegExp(s.escapeRegExp(filter), 'i');                                                       // 20
		return RocketChat.models.CustomSounds.findByName(filterReg, options);                                          // 21
	}                                                                                                               // 22
                                                                                                                 //
	return RocketChat.models.CustomSounds.find({}, options);                                                        // 24
});                                                                                                              // 25
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods":{"deleteCustomSound.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/rocketchat_custom-sounds/server/methods/deleteCustomSound.js                                         //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
/* globals RocketChatFileCustomSoundsInstance */Meteor.methods({                                                 // 1
	deleteCustomSound: function (_id) {                                                                             // 3
		var sound = null;                                                                                              // 4
                                                                                                                 //
		if (RocketChat.authz.hasPermission(this.userId, 'manage-sounds')) {                                            // 6
			sound = RocketChat.models.CustomSounds.findOneByID(_id);                                                      // 7
		} else {                                                                                                       // 8
			throw new Meteor.Error('not_authorized');                                                                     // 9
		}                                                                                                              // 10
                                                                                                                 //
		if (sound == null) {                                                                                           // 12
			throw new Meteor.Error('Custom_Sound_Error_Invalid_Sound', 'Invalid sound', {                                 // 13
				method: 'deleteCustomSound'                                                                                  // 13
			});                                                                                                           // 13
		}                                                                                                              // 14
                                                                                                                 //
		RocketChatFileCustomSoundsInstance.deleteFile(sound._id + "." + sound.extension);                              // 16
		RocketChat.models.CustomSounds.removeByID(_id);                                                                // 17
		RocketChat.Notifications.notifyAll('deleteCustomSound', {                                                      // 18
			soundData: sound                                                                                              // 18
		});                                                                                                            // 18
		return true;                                                                                                   // 20
	}                                                                                                               // 21
});                                                                                                              // 2
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"insertOrUpdateSound.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/rocketchat_custom-sounds/server/methods/insertOrUpdateSound.js                                       //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
/* globals RocketChatFileCustomSoundsInstance */Meteor.methods({                                                 // 1
	insertOrUpdateSound: function (soundData) {                                                                     // 3
		if (!RocketChat.authz.hasPermission(this.userId, 'manage-sounds')) {                                           // 4
			throw new Meteor.Error('not_authorized');                                                                     // 5
		}                                                                                                              // 6
                                                                                                                 //
		if (!s.trim(soundData.name)) {                                                                                 // 8
			throw new Meteor.Error('error-the-field-is-required', 'The field Name is required', {                         // 9
				method: 'insertOrUpdateSound',                                                                               // 9
				field: 'Name'                                                                                                // 9
			});                                                                                                           // 9
		} //let nameValidation = new RegExp('^[0-9a-zA-Z-_+;.]+$');                                                    // 10
		//allow all characters except colon, whitespace, comma, >, <, &, ", ', /, \, (, )                              // 14
		//more practical than allowing specific sets of characters; also allows foreign languages                      // 15
                                                                                                                 //
                                                                                                                 //
		var nameValidation = /[\s,:><&"'\/\\\(\)]/; //silently strip colon; this allows for uploading :soundname: as soundname
                                                                                                                 //
		soundData.name = soundData.name.replace(/:/g, '');                                                             // 19
                                                                                                                 //
		if (nameValidation.test(soundData.name)) {                                                                     // 21
			throw new Meteor.Error('error-input-is-not-a-valid-field', soundData.name + " is not a valid name", {         // 22
				method: 'insertOrUpdateSound',                                                                               // 22
				input: soundData.name,                                                                                       // 22
				field: 'Name'                                                                                                // 22
			});                                                                                                           // 22
		}                                                                                                              // 23
                                                                                                                 //
		var matchingResults = [];                                                                                      // 25
                                                                                                                 //
		if (soundData._id) {                                                                                           // 27
			matchingResults = RocketChat.models.CustomSounds.findByNameExceptID(soundData.name, soundData._id).fetch();   // 28
		} else {                                                                                                       // 29
			matchingResults = RocketChat.models.CustomSounds.findByName(soundData.name).fetch();                          // 30
		}                                                                                                              // 31
                                                                                                                 //
		if (matchingResults.length > 0) {                                                                              // 33
			throw new Meteor.Error('Custom_Sound_Error_Name_Already_In_Use', 'The custom sound name is already in use', {
				method: 'insertOrUpdateSound'                                                                                // 34
			});                                                                                                           // 34
		}                                                                                                              // 35
                                                                                                                 //
		if (!soundData._id) {                                                                                          // 37
			//insert sound                                                                                                // 38
			var createSound = {                                                                                           // 39
				name: soundData.name,                                                                                        // 40
				extension: soundData.extension                                                                               // 41
			};                                                                                                            // 39
                                                                                                                 //
			var _id = RocketChat.models.CustomSounds.create(createSound);                                                 // 44
                                                                                                                 //
			createSound._id = _id;                                                                                        // 45
			return _id;                                                                                                   // 47
		} else {                                                                                                       // 48
			//update sound                                                                                                // 49
			if (soundData.newFile) {                                                                                      // 50
				RocketChatFileCustomSoundsInstance.deleteFile(soundData._id + "." + soundData.previousExtension);            // 51
			}                                                                                                             // 52
                                                                                                                 //
			if (soundData.name !== soundData.previousName) {                                                              // 54
				RocketChat.models.CustomSounds.setName(soundData._id, soundData.name);                                       // 55
				RocketChat.Notifications.notifyAll('updateCustomSound', {                                                    // 56
					soundData: soundData                                                                                        // 56
				});                                                                                                          // 56
			}                                                                                                             // 57
                                                                                                                 //
			return soundData._id;                                                                                         // 59
		}                                                                                                              // 60
	}                                                                                                               // 61
});                                                                                                              // 2
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"listCustomSounds.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/rocketchat_custom-sounds/server/methods/listCustomSounds.js                                          //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Meteor.methods({                                                                                                 // 1
	listCustomSounds: function () {                                                                                 // 2
		return RocketChat.models.CustomSounds.find({}).fetch();                                                        // 3
	}                                                                                                               // 4
});                                                                                                              // 1
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"uploadCustomSound.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/rocketchat_custom-sounds/server/methods/uploadCustomSound.js                                         //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
/* globals RocketChatFileCustomSoundsInstance */Meteor.methods({                                                 // 1
	uploadCustomSound: function (binaryContent, contentType, soundData) {                                           // 3
		if (!RocketChat.authz.hasPermission(this.userId, 'manage-sounds')) {                                           // 4
			throw new Meteor.Error('not_authorized');                                                                     // 5
		}                                                                                                              // 6
                                                                                                                 //
		var file = new Buffer(binaryContent, 'binary');                                                                // 8
		var rs = RocketChatFile.bufferToStream(file);                                                                  // 10
		RocketChatFileCustomSoundsInstance.deleteFile(soundData._id + "." + soundData.extension);                      // 11
		var ws = RocketChatFileCustomSoundsInstance.createWriteStream(soundData._id + "." + soundData.extension, contentType);
		ws.on('end', Meteor.bindEnvironment(function () {                                                              // 13
			return Meteor.setTimeout(function () {                                                                        // 13
				return RocketChat.Notifications.notifyAll('updateCustomSound', {                                             // 14
					soundData: soundData                                                                                        // 14
				});                                                                                                          // 14
			}, 500);                                                                                                      // 14
		}));                                                                                                           // 13
		rs.pipe(ws);                                                                                                   // 17
	}                                                                                                               // 18
});                                                                                                              // 2
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:custom-sounds/server/startup/custom-sounds.js");
require("./node_modules/meteor/rocketchat:custom-sounds/server/startup/permissions.js");
require("./node_modules/meteor/rocketchat:custom-sounds/server/startup/settings.js");
require("./node_modules/meteor/rocketchat:custom-sounds/server/models/CustomSounds.js");
require("./node_modules/meteor/rocketchat:custom-sounds/server/publications/customSounds.js");
require("./node_modules/meteor/rocketchat:custom-sounds/server/methods/deleteCustomSound.js");
require("./node_modules/meteor/rocketchat:custom-sounds/server/methods/insertOrUpdateSound.js");
require("./node_modules/meteor/rocketchat:custom-sounds/server/methods/listCustomSounds.js");
require("./node_modules/meteor/rocketchat:custom-sounds/server/methods/uploadCustomSound.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:custom-sounds'] = {};

})();

//# sourceMappingURL=rocketchat_custom-sounds.js.map

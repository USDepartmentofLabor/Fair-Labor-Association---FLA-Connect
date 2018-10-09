(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RocketChatTabBar = Package['rocketchat:lib'].RocketChatTabBar;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var check = Package.check.check;
var Match = Package.check.Match;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
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
var Migrations, migrated;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:migrations":{"migrations.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/rocketchat_migrations/migrations.js                                                                //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
var moment = void 0;                                                                                           // 1
module.watch(require("moment"), {                                                                              // 1
	"default": function (v) {                                                                                     // 1
		moment = v;                                                                                                  // 1
	}                                                                                                             // 1
}, 0);                                                                                                         // 1
/*                                                                                                             // 3
	Adds migration capabilities. Migrations are defined like:                                                     //
                                                                                                               //
	Migrations.add({                                                                                              //
		up: function() {}, //*required* code to run to migrate upwards                                               //
		version: 1, //*required* number to identify migration order                                                  //
		down: function() {}, //*optional* code to run to migrate downwards                                           //
		name: 'Something' //*optional* display name for the migration                                                //
	});                                                                                                           //
                                                                                                               //
	The ordering of migrations is determined by the version you set.                                              //
                                                                                                               //
	To run the migrations, set the MIGRATE environment variable to either                                         //
	'latest' or the version number you want to migrate to. Optionally, append                                     //
	',exit' if you want the migrations to exit the meteor process, e.g if you're                                  //
	migrating from a script (remember to pass the --once parameter).                                              //
                                                                                                               //
	e.g:                                                                                                          //
	MIGRATE="latest" mrt # ensure we'll be at the latest version and run the app                                  //
	MIGRATE="latest,exit" mrt --once # ensure we'll be at the latest version and exit                             //
	MIGRATE="2,exit" mrt --once # migrate to version 2 and exit                                                   //
                                                                                                               //
	Note: Migrations will lock ensuring only 1 app can be migrating at once. If                                   //
	a migration crashes, the control record in the migrations collection will                                     //
	remain locked and at the version it was at previously, however the db could                                   //
	be in an inconsistant state.                                                                                  //
*/ // since we'll be at version 0 by default, we should have a migration set for it.                           //
var DefaultMigration = {                                                                                       // 32
	version: 0,                                                                                                   // 33
	up: function () {// @TODO: check if collection "migrations" exist                                             // 34
		// If exists, rename and rerun _migrateTo                                                                    // 36
	}                                                                                                             // 37
};                                                                                                             // 32
Migrations = {                                                                                                 // 40
	_list: [DefaultMigration],                                                                                    // 41
	options: {                                                                                                    // 42
		// false disables logging                                                                                    // 43
		log: true,                                                                                                   // 44
		// null or a function                                                                                        // 45
		logger: null,                                                                                                // 46
		// enable/disable info log "already at latest."                                                              // 47
		logIfLatest: true,                                                                                           // 48
		// lock will be valid for this amount of minutes                                                             // 49
		lockExpiration: 5,                                                                                           // 50
		// retry interval in seconds                                                                                 // 51
		retryInterval: 10,                                                                                           // 52
		// max number of attempts to retry unlock                                                                    // 53
		maxAttempts: 30,                                                                                             // 54
		// migrations collection name                                                                                // 55
		collectionName: "migrations" // collectionName: "rocketchat_migrations"                                      // 56
                                                                                                               //
	},                                                                                                            // 42
	config: function (opts) {                                                                                     // 59
		this.options = _.extend({}, this.options, opts);                                                             // 60
	}                                                                                                             // 61
};                                                                                                             // 40
Migrations._collection = new Mongo.Collection(Migrations.options.collectionName); /* Create a box around messages for displaying on a console.log */
                                                                                                               //
function makeABox(message) {                                                                                   // 67
	var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'red';                        // 67
                                                                                                               //
	if (!_.isArray(message)) {                                                                                    // 68
		message = message.split("\n");                                                                               // 69
	}                                                                                                             // 70
                                                                                                               //
	var len = _(message).reduce(function (memo, msg) {                                                            // 71
		return Math.max(memo, msg.length);                                                                           // 72
	}, 0) + 4;                                                                                                    // 73
	var text = message.map(function (msg) {                                                                       // 74
		return "|"[color] + s.lrpad(msg, len)[color] + "|"[color];                                                   // 75
	}).join("\n");                                                                                                // 76
	var topLine = "+"[color] + s.pad('', len, '-')[color] + "+"[color];                                           // 77
	var separator = "|"[color] + s.pad('', len, '') + "|"[color];                                                 // 78
	var bottomLine = "+"[color] + s.pad('', len, '-')[color] + "+"[color];                                        // 79
	return "\n" + topLine + "\n" + separator + "\n" + text + "\n" + separator + "\n" + bottomLine + "\n";         // 80
} /*                                                                                                           // 81
  	Logger factory function. Takes a prefix string and options object                                           //
  	and uses an injected `logger` if provided, else falls back to                                               //
  	Meteor's `Log` package.                                                                                     //
  	Will send a log object to the injected logger, on the following form:                                       //
  		message: String                                                                                            //
  		level: String (info, warn, error, debug)                                                                   //
  		tag: 'Migrations'                                                                                          //
  */                                                                                                           //
                                                                                                               //
function createLogger(prefix) {                                                                                // 92
	check(prefix, String); // Return noop if logging is disabled.                                                 // 93
                                                                                                               //
	if (Migrations.options.log === false) {                                                                       // 96
		return function () {};                                                                                       // 97
	}                                                                                                             // 98
                                                                                                               //
	return function (level, message) {                                                                            // 100
		check(level, Match.OneOf('info', 'error', 'warn', 'debug'));                                                 // 101
		check(message, Match.OneOf(String, [String]));                                                               // 102
		var logger = Migrations.options && Migrations.options.logger;                                                // 104
                                                                                                               //
		if (logger && _.isFunction(logger)) {                                                                        // 106
			logger({                                                                                                    // 108
				level: level,                                                                                              // 109
				message: message,                                                                                          // 110
				tag: prefix                                                                                                // 111
			});                                                                                                         // 108
		} else {                                                                                                     // 114
			Log[level]({                                                                                                // 115
				message: prefix + ': ' + message                                                                           // 116
			});                                                                                                         // 115
		}                                                                                                            // 118
	};                                                                                                            // 119
}                                                                                                              // 120
                                                                                                               //
var log;                                                                                                       // 122
var options = Migrations.options; // collection holding the control record                                     // 124
                                                                                                               //
log = createLogger('Migrations');                                                                              // 128
['info', 'warn', 'error', 'debug'].forEach(function (level) {                                                  // 130
	log[level] = _.partial(log, level);                                                                           // 131
}); // if (process.env.MIGRATE)                                                                                // 132
//   Migrations.migrateTo(process.env.MIGRATE);                                                                // 135
// Add a new migration:                                                                                        // 137
// {up: function *required                                                                                     // 138
//  version: Number *required                                                                                  // 139
//  down: function *optional                                                                                   // 140
//  name: String *optional                                                                                     // 141
// }                                                                                                           // 142
                                                                                                               //
Migrations.add = function (migration) {                                                                        // 143
	if (typeof migration.up !== 'function') throw new Meteor.Error('Migration must supply an up function.');      // 144
	if (typeof migration.version !== 'number') throw new Meteor.Error('Migration must supply a version number.');
	if (migration.version <= 0) throw new Meteor.Error('Migration version must be greater than 0'); // Freeze the migration object to make it hereafter immutable
                                                                                                               //
	Object.freeze(migration);                                                                                     // 154
                                                                                                               //
	this._list.push(migration);                                                                                   // 156
                                                                                                               //
	this._list = _.sortBy(this._list, function (m) {                                                              // 157
		return m.version;                                                                                            // 158
	});                                                                                                           // 159
}; // Attempts to run the migrations using command in the form of:                                             // 160
// e.g 'latest', 'latest,exit', 2                                                                              // 163
// use 'XX,rerun' to re-run the migration at that version                                                      // 164
                                                                                                               //
                                                                                                               //
Migrations.migrateTo = function (command) {                                                                    // 165
	if (_.isUndefined(command) || command === '' || this._list.length === 0) throw new Error("Cannot migrate using invalid command: " + command);
                                                                                                               //
	if (typeof command === 'number') {                                                                            // 169
		var version = command;                                                                                       // 170
	} else {                                                                                                      // 171
		var version = command.split(',')[0];                                                                         // 172
		var subcommand = command.split(',')[1];                                                                      // 173
	}                                                                                                             // 174
                                                                                                               //
	var maxAttempts = Migrations.options.maxAttempts;                                                             // 176
	var retryInterval = Migrations.options.retryInterval;                                                         // 177
                                                                                                               //
	for (var attempts = 1; attempts <= maxAttempts; attempts++) {                                                 // 178
		if (version === 'latest') {                                                                                  // 179
			migrated = this._migrateTo(_.last(this._list).version);                                                     // 180
		} else {                                                                                                     // 181
			migrated = this._migrateTo(parseInt(version), subcommand === 'rerun');                                      // 182
		}                                                                                                            // 183
                                                                                                               //
		if (migrated) {                                                                                              // 184
			break;                                                                                                      // 185
		} else {                                                                                                     // 186
			var willRetry = void 0;                                                                                     // 187
                                                                                                               //
			if (attempts < maxAttempts) {                                                                               // 188
				willRetry = " Trying again in " + retryInterval + " seconds.";                                             // 189
                                                                                                               //
				Meteor._sleepForMs(retryInterval * 1000);                                                                  // 190
			} else {                                                                                                    // 191
				willRetry = "";                                                                                            // 192
			}                                                                                                           // 193
                                                                                                               //
			console.log(("Not migrating, control is locked. Attempt " + attempts + "/" + maxAttempts + "." + willRetry).yellow);
		}                                                                                                            // 195
	}                                                                                                             // 196
                                                                                                               //
	if (!migrated) {                                                                                              // 197
		var control = this._getControl(); // Side effect: upserts control document.                                  // 198
                                                                                                               //
                                                                                                               //
		console.log(makeABox(["ERROR! SERVER STOPPED", "", "Your database migration control is locked.", "Please make sure you are running the latest version and try again.", "If the problem persists, please contact support.", "", "This Rocket.Chat version: " + RocketChat.Info.version, "Database locked at version: " + control.version, "Database target version: " + (version === 'latest' ? _.last(this._list).version : version), "", "Commit: " + RocketChat.Info.commit.hash, "Date: " + RocketChat.Info.commit.date, "Branch: " + RocketChat.Info.commit.branch, "Tag: " + RocketChat.Info.commit.tag]));
		process.exit(1);                                                                                             // 215
	} // remember to run meteor with --once otherwise it will restart                                             // 216
                                                                                                               //
                                                                                                               //
	if (subcommand === 'exit') process.exit(0);                                                                   // 219
}; // just returns the current version                                                                         // 221
                                                                                                               //
                                                                                                               //
Migrations.getVersion = function () {                                                                          // 224
	return this._getControl().version;                                                                            // 225
}; // migrates to the specific version passed in                                                               // 226
                                                                                                               //
                                                                                                               //
Migrations._migrateTo = function (version, rerun) {                                                            // 229
	var self = this;                                                                                              // 230
                                                                                                               //
	var control = this._getControl(); // Side effect: upserts control document.                                   // 231
                                                                                                               //
                                                                                                               //
	var currentVersion = control.version;                                                                         // 232
                                                                                                               //
	if (lock() === false) {                                                                                       // 234
		// log.info('Not migrating, control is locked.');                                                            // 235
		// Warning                                                                                                   // 236
		return false;                                                                                                // 237
	}                                                                                                             // 238
                                                                                                               //
	if (rerun) {                                                                                                  // 240
		log.info('Rerunning version ' + version);                                                                    // 241
		migrate('up', this._findIndexByVersion(version));                                                            // 242
		log.info('Finished migrating.');                                                                             // 243
		unlock();                                                                                                    // 244
		return true;                                                                                                 // 245
	}                                                                                                             // 246
                                                                                                               //
	if (currentVersion === version) {                                                                             // 248
		if (this.options.logIfLatest) {                                                                              // 249
			log.info('Not migrating, already at version ' + version);                                                   // 250
		}                                                                                                            // 251
                                                                                                               //
		unlock();                                                                                                    // 252
		return true;                                                                                                 // 253
	}                                                                                                             // 254
                                                                                                               //
	var startIdx = this._findIndexByVersion(currentVersion);                                                      // 256
                                                                                                               //
	var endIdx = this._findIndexByVersion(version); // log.info('startIdx:' + startIdx + ' endIdx:' + endIdx);    // 257
                                                                                                               //
                                                                                                               //
	log.info('Migrating from version ' + this._list[startIdx].version + ' -> ' + this._list[endIdx].version); // run the actual migration
                                                                                                               //
	function migrate(direction, idx) {                                                                            // 263
		var migration = self._list[idx];                                                                             // 264
                                                                                                               //
		if (typeof migration[direction] !== 'function') {                                                            // 266
			unlock();                                                                                                   // 267
			throw new Meteor.Error('Cannot migrate ' + direction + ' on version ' + migration.version);                 // 268
		}                                                                                                            // 269
                                                                                                               //
		function maybeName() {                                                                                       // 271
			return migration.name ? ' (' + migration.name + ')' : '';                                                   // 272
		}                                                                                                            // 273
                                                                                                               //
		log.info('Running ' + direction + '() on version ' + migration.version + maybeName());                       // 275
                                                                                                               //
		try {                                                                                                        // 277
			RocketChat.models._CacheControl.withValue(false, function () {                                              // 278
				migration[direction](migration);                                                                           // 279
			});                                                                                                         // 280
		} catch (e) {                                                                                                // 281
			console.log(makeABox(["ERROR! SERVER STOPPED", "", "Your database migration failed:", e.message, "", "Please make sure you are running the latest version and try again.", "If the problem persists, please contact support.", "", "This Rocket.Chat version: " + RocketChat.Info.version, "Database locked at version: " + control.version, "Database target version: " + version, "", "Commit: " + RocketChat.Info.commit.hash, "Date: " + RocketChat.Info.commit.date, "Branch: " + RocketChat.Info.commit.branch, "Tag: " + RocketChat.Info.commit.tag]));
			process.exit(1);                                                                                            // 300
		}                                                                                                            // 301
	} // Returns true if lock was acquired.                                                                       // 302
                                                                                                               //
                                                                                                               //
	function lock() {                                                                                             // 305
		var date = new Date();                                                                                       // 306
		var dateMinusInterval = moment(date).subtract(self.options.lockExpiration, 'minutes').toDate();              // 307
		var build = RocketChat.Info ? RocketChat.Info.build.date : date; // This is atomic. The selector ensures only one caller at a time will see
		// the unlocked control, and locking occurs in the same update's modifier.                                   // 311
		// All other simultaneous callers will get false back from the update.                                       // 312
                                                                                                               //
		return self._collection.update({                                                                             // 313
			_id: 'control',                                                                                             // 314
			$or: [{                                                                                                     // 315
				locked: false                                                                                              // 316
			}, {                                                                                                        // 315
				lockedAt: {                                                                                                // 318
					$lt: dateMinusInterval                                                                                    // 319
				}                                                                                                          // 318
			}, {                                                                                                        // 317
				buildAt: {                                                                                                 // 322
					$ne: build                                                                                                // 323
				}                                                                                                          // 322
			}]                                                                                                          // 321
		}, {                                                                                                         // 313
			$set: {                                                                                                     // 327
				locked: true,                                                                                              // 328
				lockedAt: date,                                                                                            // 329
				buildAt: build                                                                                             // 330
			}                                                                                                           // 327
		}) === 1;                                                                                                    // 326
	} // Side effect: saves version.                                                                              // 333
                                                                                                               //
                                                                                                               //
	function unlock() {                                                                                           // 337
		self._setControl({                                                                                           // 338
			locked: false,                                                                                              // 339
			version: currentVersion                                                                                     // 340
		});                                                                                                          // 338
	}                                                                                                             // 342
                                                                                                               //
	if (currentVersion < version) {                                                                               // 344
		for (var i = startIdx; i < endIdx; i++) {                                                                    // 345
			migrate('up', i + 1);                                                                                       // 346
			currentVersion = self._list[i + 1].version;                                                                 // 347
                                                                                                               //
			self._setControl({                                                                                          // 348
				locked: true,                                                                                              // 349
				version: currentVersion                                                                                    // 350
			});                                                                                                         // 348
		}                                                                                                            // 352
	} else {                                                                                                      // 353
		for (var i = startIdx; i > endIdx; i--) {                                                                    // 354
			migrate('down', i);                                                                                         // 355
			currentVersion = self._list[i - 1].version;                                                                 // 356
                                                                                                               //
			self._setControl({                                                                                          // 357
				locked: true,                                                                                              // 358
				version: currentVersion                                                                                    // 359
			});                                                                                                         // 357
		}                                                                                                            // 361
	}                                                                                                             // 362
                                                                                                               //
	unlock();                                                                                                     // 364
	log.info('Finished migrating.');                                                                              // 365
}; // gets the current control record, optionally creating it if non-existant                                  // 366
                                                                                                               //
                                                                                                               //
Migrations._getControl = function () {                                                                         // 369
	var control = this._collection.findOne({                                                                      // 370
		_id: 'control'                                                                                               // 371
	});                                                                                                           // 370
                                                                                                               //
	return control || this._setControl({                                                                          // 374
		version: 0,                                                                                                  // 375
		locked: false                                                                                                // 376
	});                                                                                                           // 374
}; // sets the control record                                                                                  // 378
                                                                                                               //
                                                                                                               //
Migrations._setControl = function (control) {                                                                  // 381
	// be quite strict                                                                                            // 382
	check(control.version, Number);                                                                               // 383
	check(control.locked, Boolean);                                                                               // 384
                                                                                                               //
	this._collection.update({                                                                                     // 386
		_id: 'control'                                                                                               // 387
	}, {                                                                                                          // 386
		$set: {                                                                                                      // 389
			version: control.version,                                                                                   // 390
			locked: control.locked                                                                                      // 391
		}                                                                                                            // 389
	}, {                                                                                                          // 388
		upsert: true                                                                                                 // 394
	});                                                                                                           // 393
                                                                                                               //
	return control;                                                                                               // 397
}; // returns the migration index in _list or throws if not found                                              // 398
                                                                                                               //
                                                                                                               //
Migrations._findIndexByVersion = function (version) {                                                          // 401
	for (var i = 0; i < this._list.length; i++) {                                                                 // 402
		if (this._list[i].version === version) return i;                                                             // 403
	}                                                                                                             // 405
                                                                                                               //
	throw new Meteor.Error('Can\'t find migration version ' + version);                                           // 407
}; //reset (mainly intended for tests)                                                                         // 408
                                                                                                               //
                                                                                                               //
Migrations._reset = function () {                                                                              // 411
	this._list = [{                                                                                               // 412
		version: 0,                                                                                                  // 413
		up: function () {}                                                                                           // 414
	}];                                                                                                           // 412
                                                                                                               //
	this._collection.remove({});                                                                                  // 416
};                                                                                                             // 417
                                                                                                               //
RocketChat.Migrations = Migrations;                                                                            // 419
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:migrations/migrations.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:migrations'] = {};

})();

//# sourceMappingURL=rocketchat_migrations.js.map

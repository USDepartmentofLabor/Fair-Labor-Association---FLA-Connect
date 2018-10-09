(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Accounts = Package['accounts-base'].Accounts;
var ECMAScript = Package.ecmascript.ECMAScript;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RocketChatTabBar = Package['rocketchat:lib'].RocketChatTabBar;
var SHA256 = Package.sha.SHA256;
var Random = Package.random.Random;
var meteorInstall = Package.modules.meteorInstall;
var process = Package.modules.process;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:2fa":{"server":{"lib":{"totp.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_2fa/server/lib/totp.js                                                                     //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var speakeasy = void 0;                                                                                           // 1
module.watch(require("speakeasy"), {                                                                              // 1
	"default": function (v) {                                                                                        // 1
		speakeasy = v;                                                                                                  // 1
	}                                                                                                                // 1
}, 0);                                                                                                            // 1
RocketChat.TOTP = {                                                                                               // 3
	generateSecret: function () {                                                                                    // 4
		return speakeasy.generateSecret();                                                                              // 5
	},                                                                                                               // 6
	generateOtpauthURL: function (secret, username) {                                                                // 8
		return speakeasy.otpauthURL({                                                                                   // 9
			secret: secret.ascii,                                                                                          // 10
			label: "Rocket.Chat:" + username                                                                               // 11
		});                                                                                                             // 9
	},                                                                                                               // 13
	verify: function (_ref) {                                                                                        // 15
		var secret = _ref.secret,                                                                                       // 15
		    token = _ref.token,                                                                                         // 15
		    backupTokens = _ref.backupTokens,                                                                           // 15
		    userId = _ref.userId;                                                                                       // 15
		var verified = void 0; // validates a backup code                                                               // 16
                                                                                                                  //
		if (token.length === 8 && backupTokens) {                                                                       // 19
			var hashedCode = SHA256(token);                                                                                // 20
			var usedCode = backupTokens.indexOf(hashedCode);                                                               // 21
                                                                                                                  //
			if (usedCode !== -1) {                                                                                         // 23
				verified = true;                                                                                              // 24
				backupTokens.splice(usedCode, 1); // mark the code as used (remove it from the list)                          // 26
                                                                                                                  //
				RocketChat.models.Users.update2FABackupCodesByUserId(userId, backupTokens);                                   // 29
			}                                                                                                              // 30
		} else {                                                                                                        // 31
			verified = speakeasy.totp.verify({                                                                             // 32
				secret: secret,                                                                                               // 33
				encoding: 'base32',                                                                                           // 34
				token: token                                                                                                  // 35
			});                                                                                                            // 32
		}                                                                                                               // 37
                                                                                                                  //
		return verified;                                                                                                // 39
	},                                                                                                               // 40
	generateCodes: function () {                                                                                     // 42
		// generate 12 backup codes                                                                                     // 43
		var codes = [];                                                                                                 // 44
		var hashedCodes = [];                                                                                           // 45
                                                                                                                  //
		for (var i = 0; i < 12; i++) {                                                                                  // 46
			var code = Random.id(8);                                                                                       // 47
			codes.push(code);                                                                                              // 48
			hashedCodes.push(SHA256(code));                                                                                // 49
		}                                                                                                               // 50
                                                                                                                  //
		return {                                                                                                        // 52
			codes: codes,                                                                                                  // 52
			hashedCodes: hashedCodes                                                                                       // 52
		};                                                                                                              // 52
	}                                                                                                                // 53
};                                                                                                                // 3
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods":{"checkCodesRemaining.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_2fa/server/methods/checkCodesRemaining.js                                                  //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
Meteor.methods({                                                                                                  // 1
	'2fa:checkCodesRemaining': function () {                                                                         // 2
		if (!Meteor.userId()) {                                                                                         // 3
			throw new Meteor.Error('not-authorized');                                                                      // 4
		}                                                                                                               // 5
                                                                                                                  //
		var user = Meteor.user();                                                                                       // 7
                                                                                                                  //
		if (!user.services || !user.services.totp || !user.services.totp.enabled) {                                     // 9
			throw new Meteor.Error('invalid-totp');                                                                        // 10
		}                                                                                                               // 11
                                                                                                                  //
		return {                                                                                                        // 13
			remaining: user.services.totp.hashedBackup.length                                                              // 14
		};                                                                                                              // 13
	}                                                                                                                // 16
});                                                                                                               // 1
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"disable.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_2fa/server/methods/disable.js                                                              //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
Meteor.methods({                                                                                                  // 1
	'2fa:disable': function (code) {                                                                                 // 2
		if (!Meteor.userId()) {                                                                                         // 3
			throw new Meteor.Error('not-authorized');                                                                      // 4
		}                                                                                                               // 5
                                                                                                                  //
		var user = Meteor.user();                                                                                       // 7
		var verified = RocketChat.TOTP.verify({                                                                         // 9
			secret: user.services.totp.secret,                                                                             // 10
			token: code,                                                                                                   // 11
			userId: Meteor.userId(),                                                                                       // 12
			backupTokens: user.services.totp.hashedBackup                                                                  // 13
		});                                                                                                             // 9
                                                                                                                  //
		if (!verified) {                                                                                                // 16
			return false;                                                                                                  // 17
		}                                                                                                               // 18
                                                                                                                  //
		return RocketChat.models.Users.disable2FAByUserId(Meteor.userId());                                             // 20
	}                                                                                                                // 21
});                                                                                                               // 1
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"enable.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_2fa/server/methods/enable.js                                                               //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
Meteor.methods({                                                                                                  // 1
	'2fa:enable': function () {                                                                                      // 2
		if (!Meteor.userId()) {                                                                                         // 3
			throw new Meteor.Error('not-authorized');                                                                      // 4
		}                                                                                                               // 5
                                                                                                                  //
		var user = Meteor.user();                                                                                       // 7
		var secret = RocketChat.TOTP.generateSecret();                                                                  // 9
		RocketChat.models.Users.disable2FAAndSetTempSecretByUserId(Meteor.userId(), secret.base32);                     // 11
		return {                                                                                                        // 13
			url: RocketChat.TOTP.generateOtpauthURL(secret, user.username)                                                 // 14
		};                                                                                                              // 13
	}                                                                                                                // 16
});                                                                                                               // 1
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"regenerateCodes.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_2fa/server/methods/regenerateCodes.js                                                      //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
Meteor.methods({                                                                                                  // 1
	'2fa:regenerateCodes': function (userToken) {                                                                    // 2
		if (!Meteor.userId()) {                                                                                         // 3
			throw new Meteor.Error('not-authorized');                                                                      // 4
		}                                                                                                               // 5
                                                                                                                  //
		var user = Meteor.user();                                                                                       // 7
                                                                                                                  //
		if (!user.services || !user.services.totp || !user.services.totp.enabled) {                                     // 9
			throw new Meteor.Error('invalid-totp');                                                                        // 10
		}                                                                                                               // 11
                                                                                                                  //
		var verified = RocketChat.TOTP.verify({                                                                         // 13
			secret: user.services.totp.secret,                                                                             // 14
			token: userToken,                                                                                              // 15
			userId: Meteor.userId(),                                                                                       // 16
			backupTokens: user.services.totp.hashedBackup                                                                  // 17
		});                                                                                                             // 13
                                                                                                                  //
		if (verified) {                                                                                                 // 20
			var _RocketChat$TOTP$gene = RocketChat.TOTP.generateCodes(),                                                   // 20
			    codes = _RocketChat$TOTP$gene.codes,                                                                       // 20
			    hashedCodes = _RocketChat$TOTP$gene.hashedCodes;                                                           // 20
                                                                                                                  //
			RocketChat.models.Users.update2FABackupCodesByUserId(Meteor.userId(), hashedCodes);                            // 23
			return {                                                                                                       // 24
				codes: codes                                                                                                  // 24
			};                                                                                                             // 24
		}                                                                                                               // 25
	}                                                                                                                // 26
});                                                                                                               // 1
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"validateTempToken.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_2fa/server/methods/validateTempToken.js                                                    //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
Meteor.methods({                                                                                                  // 1
	'2fa:validateTempToken': function (userToken) {                                                                  // 2
		if (!Meteor.userId()) {                                                                                         // 3
			throw new Meteor.Error('not-authorized');                                                                      // 4
		}                                                                                                               // 5
                                                                                                                  //
		var user = Meteor.user();                                                                                       // 7
                                                                                                                  //
		if (!user.services || !user.services.totp || !user.services.totp.tempSecret) {                                  // 9
			throw new Meteor.Error('invalid-totp');                                                                        // 10
		}                                                                                                               // 11
                                                                                                                  //
		var verified = RocketChat.TOTP.verify({                                                                         // 13
			secret: user.services.totp.tempSecret,                                                                         // 14
			token: userToken                                                                                               // 15
		});                                                                                                             // 13
                                                                                                                  //
		if (verified) {                                                                                                 // 18
			var _RocketChat$TOTP$gene = RocketChat.TOTP.generateCodes(),                                                   // 18
			    codes = _RocketChat$TOTP$gene.codes,                                                                       // 18
			    hashedCodes = _RocketChat$TOTP$gene.hashedCodes;                                                           // 18
                                                                                                                  //
			RocketChat.models.Users.enable2FAAndSetSecretAndCodesByUserId(Meteor.userId(), user.services.totp.tempSecret, hashedCodes);
			return {                                                                                                       // 22
				codes: codes                                                                                                  // 22
			};                                                                                                             // 22
		}                                                                                                               // 23
	}                                                                                                                // 24
});                                                                                                               // 1
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"models":{"users.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_2fa/server/models/users.js                                                                 //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
RocketChat.models.Users.disable2FAAndSetTempSecretByUserId = function (userId, tempToken) {                       // 1
	return this.update({                                                                                             // 2
		_id: userId                                                                                                     // 3
	}, {                                                                                                             // 2
		$set: {                                                                                                         // 5
			'services.totp': {                                                                                             // 6
				enabled: false,                                                                                               // 7
				tempSecret: tempToken                                                                                         // 8
			}                                                                                                              // 6
		}                                                                                                               // 5
	});                                                                                                              // 4
};                                                                                                                // 12
                                                                                                                  //
RocketChat.models.Users.enable2FAAndSetSecretAndCodesByUserId = function (userId, secret, backupCodes) {          // 14
	return this.update({                                                                                             // 15
		_id: userId                                                                                                     // 16
	}, {                                                                                                             // 15
		$set: {                                                                                                         // 18
			'services.totp.enabled': true,                                                                                 // 19
			'services.totp.secret': secret,                                                                                // 20
			'services.totp.hashedBackup': backupCodes                                                                      // 21
		},                                                                                                              // 18
		$unset: {                                                                                                       // 23
			'services.totp.tempSecret': 1                                                                                  // 24
		}                                                                                                               // 23
	});                                                                                                              // 17
};                                                                                                                // 27
                                                                                                                  //
RocketChat.models.Users.disable2FAByUserId = function (userId) {                                                  // 29
	return this.update({                                                                                             // 30
		_id: userId                                                                                                     // 31
	}, {                                                                                                             // 30
		$set: {                                                                                                         // 33
			'services.totp': {                                                                                             // 34
				enabled: false                                                                                                // 35
			}                                                                                                              // 34
		}                                                                                                               // 33
	});                                                                                                              // 32
};                                                                                                                // 39
                                                                                                                  //
RocketChat.models.Users.update2FABackupCodesByUserId = function (userId, backupCodes) {                           // 41
	return this.update({                                                                                             // 42
		_id: userId                                                                                                     // 43
	}, {                                                                                                             // 42
		$set: {                                                                                                         // 45
			'services.totp.hashedBackup': backupCodes                                                                      // 46
		}                                                                                                               // 45
	});                                                                                                              // 44
};                                                                                                                // 49
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"loginHandler.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_2fa/server/loginHandler.js                                                                 //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
Accounts.registerLoginHandler('totp', function (options) {                                                        // 1
	if (!options.totp || !options.totp.code) {                                                                       // 2
		return;                                                                                                         // 3
	}                                                                                                                // 4
                                                                                                                  //
	return Accounts._runLoginHandlers(this, options.totp.login);                                                     // 6
});                                                                                                               // 7
RocketChat.callbacks.add('onValidateLogin', function (login) {                                                    // 9
	if (login.type === 'password' && login.user.services && login.user.services.totp && login.user.services.totp.enabled === true) {
		var totp = login.methodArguments[0].totp;                                                                       // 10
                                                                                                                  //
		if (!totp || !totp.code) {                                                                                      // 13
			throw new Meteor.Error('totp-required', 'TOTP Required');                                                      // 14
		}                                                                                                               // 15
                                                                                                                  //
		var verified = RocketChat.TOTP.verify({                                                                         // 17
			secret: login.user.services.totp.secret,                                                                       // 18
			token: totp.code,                                                                                              // 19
			userId: login.user._id,                                                                                        // 20
			backupTokens: login.user.services.totp.hashedBackup                                                            // 21
		});                                                                                                             // 17
                                                                                                                  //
		if (verified !== true) {                                                                                        // 24
			throw new Meteor.Error('totp-invalid', 'TOTP Invalid');                                                        // 25
		}                                                                                                               // 26
	}                                                                                                                // 27
});                                                                                                               // 28
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"node_modules":{"speakeasy":{"package.json":function(require,exports){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// .npm/package/node_modules/speakeasy/package.json                                                               //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
exports.name = "speakeasy";
exports.version = "2.0.0";
exports.main = "index.js";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// node_modules/meteor/rocketchat_2fa/node_modules/speakeasy/index.js                                             //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
'use strict';

var base32 = require('base32.js');
var crypto = require('crypto');
var url = require('url');
var util = require('util');

/**
 * Digest the one-time passcode options.
 *
 * @param {Object} options
 * @param {String} options.secret Shared secret key
 * @param {Integer} options.counter Counter value
 * @param {String} [options.encoding="ascii"] Key encoding (ascii, hex,
 *   base32, base64).
 * @param {String} [options.algorithm="sha1"] Hash algorithm (sha1, sha256,
 *   sha512).
 * @param {String} [options.key] (DEPRECATED. Use `secret` instead.)
 *   Shared secret key
 * @return {Buffer} The one-time passcode as a buffer.
 */

exports.digest = function digest (options) {
  var i;

  // unpack options
  var secret = options.secret;
  var counter = options.counter;
  var encoding = options.encoding || 'ascii';
  var algorithm = (options.algorithm || 'sha1').toLowerCase();

  // Backwards compatibility - deprecated
  if (options.key != null) {
    console.warn('Speakeasy - Deprecation Notice - Specifying the secret using `key` is no longer supported. Use `secret` instead.');
    secret = options.key;
  }

  // convert secret to buffer
  if (!Buffer.isBuffer(secret)) {
    secret = encoding === 'base32' ? base32.decode(secret)
      : new Buffer(secret, encoding);
  }

  // create an buffer from the counter
  var buf = new Buffer(8);
  var tmp = counter;
  for (i = 0; i < 8; i++) {
    // mask 0xff over number to get last 8
    buf[7 - i] = tmp & 0xff;

    // shift 8 and get ready to loop over the next batch of 8
    tmp = tmp >> 8;
  }

  // init hmac with the key
  var hmac = crypto.createHmac(algorithm, secret);

  // update hmac with the counter
  hmac.update(buf);

  // return the digest
  return hmac.digest();
};

/**
 * Generate a counter-based one-time token. Specify the key and counter, and
 * receive the one-time password for that counter position as a string. You can
 * also specify a token length, as well as the encoding (ASCII, hexadecimal, or
 * base32) and the hashing algorithm to use (SHA1, SHA256, SHA512).
 *
 * @param {Object} options
 * @param {String} options.secret Shared secret key
 * @param {Integer} options.counter Counter value
 * @param {Buffer} [options.digest] Digest, automatically generated by default
 * @param {Integer} [options.digits=6] The number of digits for the one-time
 *   passcode.
 * @param {String} [options.encoding="ascii"] Key encoding (ascii, hex,
 *   base32, base64).
 * @param {String} [options.algorithm="sha1"] Hash algorithm (sha1, sha256,
 *   sha512).
 * @param {String} [options.key] (DEPRECATED. Use `secret` instead.)
 *   Shared secret key
 * @param {Integer} [options.length=6] (DEPRECATED. Use `digits` instead.) The
 *   number of digits for the one-time passcode.
 * @return {String} The one-time passcode.
 */

exports.hotp = function hotpGenerate (options) {
  // unpack digits
  // backward compatibility: `length` is also accepted here, but deprecated
  var digits = (options.digits != null ? options.digits : options.length) || 6;
  if (options.length != null) console.warn('Speakeasy - Deprecation Notice - Specifying token digits using `length` is no longer supported. Use `digits` instead.');

  // digest the options
  var digest = options.digest || exports.digest(options);

  // compute HOTP offset
  var offset = digest[digest.length - 1] & 0xf;

  // calculate binary code (RFC4226 5.4)
  var code = (digest[offset] & 0x7f) << 24 |
    (digest[offset + 1] & 0xff) << 16 |
    (digest[offset + 2] & 0xff) << 8 |
    (digest[offset + 3] & 0xff);

  // left-pad code
  code = new Array(digits + 1).join('0') + code.toString(10);

  // return length number off digits
  return code.substr(-digits);
};

// Alias counter() for hotp()
exports.counter = exports.hotp;

/**
 * Verify a counter-based one-time token against the secret and return the delta.
 * By default, it verifies the token at the given counter value, with no leeway
 * (no look-ahead or look-behind). A token validated at the current counter value
 * will have a delta of 0.
 *
 * You can specify a window to add more leeway to the verification process.
 * Setting the window param will check for the token at the given counter value
 * as well as `window` tokens ahead (one-sided window). See param for more info.
 *
 * `verifyDelta()` will return the delta between the counter value of the token
 * and the given counter value. For example, if given a counter 5 and a window
 * 10, `verifyDelta()` will look at tokens from 5 to 15, inclusive. If it finds
 * it at counter position 7, it will return `{ delta: 2 }`.
 *
 * @param {Object} options
 * @param {String} options.secret Shared secret key
 * @param {String} options.token Passcode to validate
 * @param {Integer} options.counter Counter value. This should be stored by
 *   the application and must be incremented for each request.
 * @param {Integer} [options.digits=6] The number of digits for the one-time
 *   passcode.
 * @param {Integer} [options.window=0] The allowable margin for the counter.
 *   The function will check "W" codes in the future against the provided
 *   passcode, e.g. if W = 10, and C = 5, this function will check the
 *   passcode against all One Time Passcodes between 5 and 15, inclusive.
 * @param {String} [options.encoding="ascii"] Key encoding (ascii, hex,
 *   base32, base64).
 * @param {String} [options.algorithm="sha1"] Hash algorithm (sha1, sha256,
 *   sha512).
 * @return {Object} On success, returns an object with the counter
 *   difference between the client and the server as the `delta` property (i.e.
 *   `{ delta: 0 }`).
 * @method hotp․verifyDelta
 * @global
 */

exports.hotp.verifyDelta = function hotpVerifyDelta (options) {
  var i;

  // shadow options
  options = Object.create(options);

  // unpack options
  var token = String(options.token);
  var digits = parseInt(options.digits, 10) || 6;
  var window = parseInt(options.window, 10) || 0;
  var counter = parseInt(options.counter, 10) || 0;

  // fail if token is not of correct length
  if (token.length !== digits) {
    return;
  }

  // parse token to integer
  token = parseInt(token, 10);

  // fail if token is NA
  if (isNaN(token)) {
    return;
  }

  // loop from C to C + W inclusive
  for (i = counter; i <= counter + window; ++i) {
    options.counter = i;
    // domain-specific constant-time comparison for integer codes
    if (parseInt(exports.hotp(options), 10) === token) {
      // found a matching code, return delta
      return {delta: i - counter};
    }
  }

  // no codes have matched
};

/**
 * Verify a counter-based one-time token against the secret and return true if
 * it verifies. Helper function for `hotp.verifyDelta()`` that returns a boolean
 * instead of an object. For more on how to use a window with this, see
 * {@link hotp.verifyDelta}.
 *
 * @param {Object} options
 * @param {String} options.secret Shared secret key
 * @param {String} options.token Passcode to validate
 * @param {Integer} options.counter Counter value. This should be stored by
 *   the application and must be incremented for each request.
 * @param {Integer} [options.digits=6] The number of digits for the one-time
 *   passcode.
 * @param {Integer} [options.window=0] The allowable margin for the counter.
 *   The function will check "W" codes in the future against the provided
 *   passcode, e.g. if W = 10, and C = 5, this function will check the
 *   passcode against all One Time Passcodes between 5 and 15, inclusive.
 * @param {String} [options.encoding="ascii"] Key encoding (ascii, hex,
 *   base32, base64).
 * @param {String} [options.algorithm="sha1"] Hash algorithm (sha1, sha256,
 *   sha512).
 * @return {Boolean} Returns true if the token matches within the given
 *   window, false otherwise.
 * @method hotp․verify
 * @global
 */
exports.hotp.verify = function hotpVerify (options) {
  return exports.hotp.verifyDelta(options) != null;
};

/**
 * Calculate counter value based on given options. A counter value converts a
 * TOTP time into a counter value by finding the number of time steps that have
 * passed since the epoch to the current time.
 *
 * @param {Object} options
 * @param {Integer} [options.time] Time in seconds with which to calculate
 *   counter value. Defaults to `Date.now()`.
 * @param {Integer} [options.step=30] Time step in seconds
 * @param {Integer} [options.epoch=0] Initial time since the UNIX epoch from
 *   which to calculate the counter value. Defaults to 0 (no offset).
 * @param {Integer} [options.initial_time=0] (DEPRECATED. Use `epoch` instead.)
 *   Initial time in seconds since the UNIX epoch from which to calculate the
 *   counter value. Defaults to 0 (no offset).
 * @return {Integer} The calculated counter value.
 * @private
 */

exports._counter = function _counter (options) {
  var step = options.step || 30;
  var time = options.time != null ? (options.time * 1000) : Date.now();

  // also accepts 'initial_time', but deprecated
  var epoch = (options.epoch != null ? (options.epoch * 1000) : (options.initial_time * 1000)) || 0;
  if (options.initial_time != null) console.warn('Speakeasy - Deprecation Notice - Specifying the epoch using `initial_time` is no longer supported. Use `epoch` instead.');

  return Math.floor((time - epoch) / step / 1000);
};

/**
 * Generate a time-based one-time token. Specify the key, and receive the
 * one-time password for that time as a string. By default, it uses the current
 * time and a time step of 30 seconds, so there is a new token every 30 seconds.
 * You may override the time step and epoch for custom timing. You can also
 * specify a token length, as well as the encoding (ASCII, hexadecimal, or
 * base32) and the hashing algorithm to use (SHA1, SHA256, SHA512).
 *
 * Under the hood, TOTP calculates the counter value by finding how many time
 * steps have passed since the epoch, and calls HOTP with that counter value.
 *
 * @param {Object} options
 * @param {String} options.secret Shared secret key
 * @param {Integer} [options.time] Time in seconds with which to calculate
 *   counter value. Defaults to `Date.now()`.
 * @param {Integer} [options.step=30] Time step in seconds
 * @param {Integer} [options.epoch=0] Initial time in seconds since the UNIX
 *   epoch from which to calculate the counter value. Defaults to 0 (no offset).
 * @param {Integer} [options.counter] Counter value, calculated by default.
 * @param {Integer} [options.digits=6] The number of digits for the one-time
 *   passcode.
 * @param {String} [options.encoding="ascii"] Key encoding (ascii, hex,
 *   base32, base64).
 * @param {String} [options.algorithm="sha1"] Hash algorithm (sha1, sha256,
 *   sha512).
 * @param {String} [options.key] (DEPRECATED. Use `secret` instead.)
 *   Shared secret key
 * @param {Integer} [options.initial_time=0] (DEPRECATED. Use `epoch` instead.)
 *   Initial time in seconds since the UNIX epoch from which to calculate the
 *   counter value. Defaults to 0 (no offset).
 * @param {Integer} [options.length=6] (DEPRECATED. Use `digits` instead.) The
 *   number of digits for the one-time passcode.
 * @return {String} The one-time passcode.
 */

exports.totp = function totpGenerate (options) {
  // shadow options
  options = Object.create(options);

  // calculate default counter value
  if (options.counter == null) options.counter = exports._counter(options);

  // pass to hotp
  return this.hotp(options);
};

// Alias time() for totp()
exports.time = exports.totp;

/**
 * Verify a time-based one-time token against the secret and return the delta.
 * By default, it verifies the token at the current time window, with no leeway
 * (no look-ahead or look-behind). A token validated at the current time window
 * will have a delta of 0.
 *
 * You can specify a window to add more leeway to the verification process.
 * Setting the window param will check for the token at the given counter value
 * as well as `window` tokens ahead and `window` tokens behind (two-sided
 * window). See param for more info.
 *
 * `verifyDelta()` will return the delta between the counter value of the token
 * and the given counter value. For example, if given a time at counter 1000 and
 * a window of 5, `verifyDelta()` will look at tokens from 995 to 1005,
 * inclusive. In other words, if the time-step is 30 seconds, it will look at
 * tokens from 2.5 minutes ago to 2.5 minutes in the future, inclusive.
 * If it finds it at counter position 1002, it will return `{ delta: 2 }`.
 * If it finds it at counter position 997, it will return `{ delta: -3 }`.
 *
 * @param {Object} options
 * @param {String} options.secret Shared secret key
 * @param {String} options.token Passcode to validate
 * @param {Integer} [options.time] Time in seconds with which to calculate
 *   counter value. Defaults to `Date.now()`.
 * @param {Integer} [options.step=30] Time step in seconds
 * @param {Integer} [options.epoch=0] Initial time in seconds since the UNIX
 *   epoch from which to calculate the counter value. Defaults to 0 (no offset).
 * @param {Integer} [options.counter] Counter value, calculated by default.
 * @param {Integer} [options.digits=6] The number of digits for the one-time
 *   passcode.
 * @param {Integer} [options.window=0] The allowable margin for the counter.
 *   The function will check "W" codes in the future and the past against the
 *   provided passcode, e.g. if W = 5, and C = 1000, this function will check
 *   the passcode against all One Time Passcodes between 995 and 1005,
 *   inclusive.
 * @param {String} [options.encoding="ascii"] Key encoding (ascii, hex,
 *   base32, base64).
 * @param {String} [options.algorithm="sha1"] Hash algorithm (sha1, sha256,
 *   sha512).
 * @return {Object} On success, returns an object with the time step
 *   difference between the client and the server as the `delta` property (e.g.
 *   `{ delta: 0 }`).
 * @method totp․verifyDelta
 * @global
 */

exports.totp.verifyDelta = function totpVerifyDelta (options) {
  // shadow options
  options = Object.create(options);

  // unpack options
  var window = parseInt(options.window, 10) || 0;

  // calculate default counter value
  if (options.counter == null) options.counter = exports._counter(options);

  // adjust for two-sided window
  options.counter -= window;
  options.window += window;

  // pass to hotp.verifyDelta
  var delta = exports.hotp.verifyDelta(options);

  // adjust for two-sided window
  if (delta) {
    delta.delta -= window;
  }

  return delta;
};

/**
 * Verify a time-based one-time token against the secret and return true if it
 * verifies. Helper function for verifyDelta() that returns a boolean instead of
 * an object. For more on how to use a window with this, see
 * {@link totp.verifyDelta}.
 *
 * @param {Object} options
 * @param {String} options.secret Shared secret key
 * @param {String} options.token Passcode to validate
 * @param {Integer} [options.time] Time in seconds with which to calculate
 *   counter value. Defaults to `Date.now()`.
 * @param {Integer} [options.step=30] Time step in seconds
 * @param {Integer} [options.epoch=0] Initial time in seconds  since the UNIX
 *   epoch from which to calculate the counter value. Defaults to 0 (no offset).
 * @param {Integer} [options.counter] Counter value, calculated by default.
 * @param {Integer} [options.digits=6] The number of digits for the one-time
 *   passcode.
 * @param {Integer} [options.window=0] The allowable margin for the counter.
 *   The function will check "W" codes in the future and the past against the
 *   provided passcode, e.g. if W = 5, and C = 1000, this function will check
 *   the passcode against all One Time Passcodes between 995 and 1005,
 *   inclusive.
 * @param {String} [options.encoding="ascii"] Key encoding (ascii, hex,
 *   base32, base64).
 * @param {String} [options.algorithm="sha1"] Hash algorithm (sha1, sha256,
 *   sha512).
 * @return {Boolean} Returns true if the token matches within the given
 *   window, false otherwise.
 * @method totp․verify
 * @global
 */
exports.totp.verify = function totpVerify (options) {
  return exports.totp.verifyDelta(options) != null;
};

/**
 * @typedef GeneratedSecret
 * @type Object
 * @property {String} ascii ASCII representation of the secret
 * @property {String} hex Hex representation of the secret
 * @property {String} base32 Base32 representation of the secret
 * @property {String} qr_code_ascii URL for the QR code for the ASCII secret.
 * @property {String} qr_code_hex URL for the QR code for the hex secret.
 * @property {String} qr_code_base32 URL for the QR code for the base32 secret.
 * @property {String} google_auth_qr URL for the Google Authenticator otpauth
 *   URL's QR code.
 * @property {String} otpauth_url Google Authenticator-compatible otpauth URL.
 */

/**
 * Generates a random secret with the set A-Z a-z 0-9 and symbols, of any length
 * (default 32). Returns the secret key in ASCII, hexadecimal, and base32 format,
 * along with the URL used for the QR code for Google Authenticator (an otpauth
 * URL). Use a QR code library to generate a QR code based on the Google
 * Authenticator URL to obtain a QR code you can scan into the app.
 *
 * @param {Object} options
 * @param {Integer} [options.length=32] Length of the secret
 * @param {Boolean} [options.symbols=false] Whether to include symbols
 * @param {Boolean} [options.otpauth_url=true] Whether to output a Google
 *   Authenticator-compatible otpauth:// URL (only returns otpauth:// URL, no
 *   QR code)
 * @param {String} [options.name] The name to use with Google Authenticator.
 * @param {Boolean} [options.qr_codes=false] (DEPRECATED. Do not use to prevent
 *   leaking of secret to a third party. Use your own QR code implementation.)
 *   Output QR code URLs for the token.
 * @param {Boolean} [options.google_auth_qr=false] (DEPRECATED. Do not use to
 *   prevent leaking of secret to a third party. Use your own QR code
 *   implementation.) Output a Google Authenticator otpauth:// QR code URL.
 * @return {Object}
 * @return {GeneratedSecret} The generated secret key.
 */
exports.generateSecret = function generateSecret (options) {
  // options
  if (!options) options = {};
  var length = options.length || 32;
  var name = encodeURIComponent(options.name || 'SecretKey');
  var qr_codes = options.qr_codes || false;
  var google_auth_qr = options.google_auth_qr || false;
  var otpauth_url = options.otpauth_url != null ? options.otpauth_url : true;
  var symbols = true;

  // turn off symbols only when explicity told to
  if (options.symbols !== undefined && options.symbols === false) {
    symbols = false;
  }

  // generate an ascii key
  var key = this.generateSecretASCII(length, symbols);

  // return a SecretKey with ascii, hex, and base32
  var SecretKey = {};
  SecretKey.ascii = key;
  SecretKey.hex = Buffer(key, 'ascii').toString('hex');
  SecretKey.base32 = base32.encode(Buffer(key)).toString().replace(/=/g, '');

  // generate some qr codes if requested
  if (qr_codes) {
    console.warn('Speakeasy - Deprecation Notice - generateSecret() QR codes are deprecated and no longer supported. Please use your own QR code implementation.');
    SecretKey.qr_code_ascii = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + encodeURIComponent(SecretKey.ascii);
    SecretKey.qr_code_hex = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + encodeURIComponent(SecretKey.hex);
    SecretKey.qr_code_base32 = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + encodeURIComponent(SecretKey.base32);
  }

  // add in the Google Authenticator-compatible otpauth URL
  if (otpauth_url) {
    SecretKey.otpauth_url = exports.otpauthURL({
      secret: SecretKey.ascii,
      label: name
    });
  }

  // generate a QR code for use in Google Authenticator if requested
  if (google_auth_qr) {
    console.warn('Speakeasy - Deprecation Notice - generateSecret() Google Auth QR code is deprecated and no longer supported. Please use your own QR code implementation.');
    SecretKey.google_auth_qr = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + encodeURIComponent(exports.otpauthURL({ secret: SecretKey.base32, label: name }));
  }

  return SecretKey;
};

// Backwards compatibility - generate_key is deprecated
exports.generate_key = util.deprecate(function (options) {
  return exports.generateSecret(options);
}, 'Speakeasy - Deprecation Notice - `generate_key()` is depreciated, please use `generateSecret()` instead.');

/**
 * Generates a key of a certain length (default 32) from A-Z, a-z, 0-9, and
 * symbols (if requested).
 *
 * @param  {Integer} [length=32]  The length of the key.
 * @param  {Boolean} [symbols=false] Whether to include symbols in the key.
 * @return {String} The generated key.
 */
exports.generateSecretASCII = function generateSecretASCII (length, symbols) {
  var bytes = crypto.randomBytes(length || 32);
  var set = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
  if (symbols) {
    set += '!@#$%^&*()<>?/[]{},.:;';
  }

  var output = '';
  for (var i = 0, l = bytes.length; i < l; i++) {
    output += set[Math.floor(bytes[i] / 255.0 * (set.length - 1))];
  }
  return output;
};

// Backwards compatibility - generate_key_ascii is deprecated
exports.generate_key_ascii = util.deprecate(function (length, symbols) {
  return exports.generateSecretASCII(length, symbols);
}, 'Speakeasy - Deprecation Notice - `generate_key_ascii()` is depreciated, please use `generateSecretASCII()` instead.');

/**
 * Generate a Google Authenticator-compatible otpauth:// URL for passing the
 * secret to a mobile device to install the secret.
 *
 * Authenticator considers TOTP codes valid for 30 seconds. Additionally,
 * the app presents 6 digits codes to the user. According to the
 * documentation, the period and number of digits are currently ignored by
 * the app.
 *
 * To generate a suitable QR Code, pass the generated URL to a QR Code
 * generator, such as the `qr-image` module.
 *
 * @param {Object} options
 * @param {String} options.secret Shared secret key
 * @param {String} options.label Used to identify the account with which
 *   the secret key is associated, e.g. the user's email address.
 * @param {String} [options.type="totp"] Either "hotp" or "totp".
 * @param {Integer} [options.counter] The initial counter value, required
 *   for HOTP.
 * @param {String} [options.issuer] The provider or service with which the
 *   secret key is associated.
 * @param {String} [options.algorithm="sha1"] Hash algorithm (sha1, sha256,
 *   sha512).
 * @param {Integer} [options.digits=6] The number of digits for the one-time
 *   passcode. Currently ignored by Google Authenticator.
 * @param {Integer} [options.period=30] The length of time for which a TOTP
 *   code will be valid, in seconds. Currently ignored by Google
 *   Authenticator.
 * @param {String} [options.encoding] Key encoding (ascii, hex, base32,
 *   base64). If the key is not encoded in Base-32, it will be reencoded.
 * @return {String} A URL suitable for use with the Google Authenticator.
 * @throws Error if secret or label is missing, or if hotp is used and a
    counter is missing, if the type is not one of `hotp` or `totp`, if the
    number of digits is non-numeric, or an invalid period is used. Warns if
    the number of digits is not either 6 or 8 (though 6 is the only one
    supported by Google Authenticator), and if the hashihng algorithm is
    not one of the supported SHA1, SHA256, or SHA512.
 * @see https://github.com/google/google-authenticator/wiki/Key-Uri-Format
 */

exports.otpauthURL = function otpauthURL (options) {
  // unpack options
  var secret = options.secret;
  var label = options.label;
  var issuer = options.issuer;
  var type = (options.type || 'totp').toLowerCase();
  var counter = options.counter;
  var algorithm = options.algorithm;
  var digits = options.digits;
  var period = options.period;
  var encoding = options.encoding || 'ascii';

  // validate type
  switch (type) {
    case 'totp':
    case 'hotp':
      break;
    default:
      throw new Error('Speakeasy - otpauthURL - Invalid type `' + type + '`; must be `hotp` or `totp`');
  }

  // validate required options
  if (!secret) throw new Error('Speakeasy - otpauthURL - Missing secret');
  if (!label) throw new Error('Speakeasy - otpauthURL - Missing label');

  // require counter for HOTP
  if (type === 'hotp' && (counter === null || typeof counter === 'undefined')) {
    throw new Error('Speakeasy - otpauthURL - Missing counter value for HOTP');
  }

  // convert secret to base32
  if (encoding !== 'base32') secret = new Buffer(secret, encoding);
  if (Buffer.isBuffer(secret)) secret = base32.encode(secret);

  // build query while validating
  var query = {secret: secret};
  if (issuer) query.issuer = issuer;

  // validate algorithm
  if (algorithm != null) {
    switch (algorithm.toUpperCase()) {
      case 'SHA1':
      case 'SHA256':
      case 'SHA512':
        break;
      default:
        console.warn('Speakeasy - otpauthURL - Warning - Algorithm generally should be SHA1, SHA256, or SHA512');
    }
    query.algorithm = algorithm.toUpperCase();
  }

  // validate digits
  if (digits != null) {
    if (isNaN(digits)) {
      throw new Error('Speakeasy - otpauthURL - Invalid digits `' + digits + '`');
    } else {
      switch (parseInt(digits, 10)) {
        case 6:
        case 8:
          break;
        default:
          console.warn('Speakeasy - otpauthURL - Warning - Digits generally should be either 6 or 8');
      }
    }
    query.digits = digits;
  }

  // validate period
  if (period != null) {
    period = parseInt(period, 10);
    if (~~period !== period) {
      throw new Error('Speakeasy - otpauthURL - Invalid period `' + period + '`');
    }
    query.period = period;
  }

  // return url
  return url.format({
    protocol: 'otpauth',
    slashes: true,
    hostname: type,
    pathname: label,
    query: query
  });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:2fa/server/lib/totp.js");
require("./node_modules/meteor/rocketchat:2fa/server/methods/checkCodesRemaining.js");
require("./node_modules/meteor/rocketchat:2fa/server/methods/disable.js");
require("./node_modules/meteor/rocketchat:2fa/server/methods/enable.js");
require("./node_modules/meteor/rocketchat:2fa/server/methods/regenerateCodes.js");
require("./node_modules/meteor/rocketchat:2fa/server/methods/validateTempToken.js");
require("./node_modules/meteor/rocketchat:2fa/server/models/users.js");
require("./node_modules/meteor/rocketchat:2fa/server/loginHandler.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:2fa'] = {};

})();

//# sourceMappingURL=rocketchat_2fa.js.map

(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var EventState = Package['raix:eventstate'].EventState;
var check = Package.check.check;
var Match = Package.check.Match;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var _ = Package.underscore._;
var EJSON = Package.ejson.EJSON;
var Random = Package.random.Random;
var meteorInstall = Package.modules.meteorInstall;
var process = Package.modules.process;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

/* Package-scope variables */
var Push, checkClientSecurity, _matchToken, _replaceToken, _removeToken, initPushUpdates;

var require = meteorInstall({"node_modules":{"meteor":{"raix:push":{"lib":{"common":{"main.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/raix_push/lib/common/main.js                                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// The push object is an event emitter                                                                                // 1
Push = new EventState(); // Client-side security warnings, used to check options                                      // 2
                                                                                                                      //
checkClientSecurity = function (options) {                                                                            // 6
  // Warn if certificates or keys are added here on client. We dont allow the                                         // 8
  // user to do this for security reasons.                                                                            // 9
  if (options.apn && options.apn.certData) {                                                                          // 10
    throw new Error('Push.init: Dont add your APN certificate in client code!');                                      // 11
  }                                                                                                                   // 12
                                                                                                                      //
  if (options.apn && options.apn.keyData) {                                                                           // 14
    throw new Error('Push.init: Dont add your APN key in client code!');                                              // 15
  }                                                                                                                   // 16
                                                                                                                      //
  if (options.apn && options.apn.passphrase) {                                                                        // 18
    throw new Error('Push.init: Dont add your APN passphrase in client code!');                                       // 19
  }                                                                                                                   // 20
                                                                                                                      //
  if (options.gcm && options.gcm.apiKey) {                                                                            // 22
    throw new Error('Push.init: Dont add your GCM api key in client code!');                                          // 23
  }                                                                                                                   // 24
}; // DEPRECATED                                                                                                      // 25
                                                                                                                      //
                                                                                                                      //
Push.init = function () {                                                                                             // 28
  console.warn('Push.init have been deprecated in favor of "config.push.json" please migrate');                       // 29
};                                                                                                                    // 30
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"notifications.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/raix_push/lib/common/notifications.js                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// This is the match pattern for tokens                                                                               // 1
_matchToken = Match.OneOf({                                                                                           // 2
  apn: String                                                                                                         // 2
}, {                                                                                                                  // 2
  gcm: String                                                                                                         // 2
}); // Notifications collection                                                                                       // 2
                                                                                                                      //
Push.notifications = new Mongo.Collection('_raix_push_notifications'); // This is a general function to validate that the data added to notifications
// is in the correct format. If not this function will throw errors                                                   // 8
                                                                                                                      //
var _validateDocument = function (notification) {                                                                     // 9
  // Check the general notification                                                                                   // 11
  check(notification, {                                                                                               // 12
    from: String,                                                                                                     // 13
    title: String,                                                                                                    // 14
    text: String,                                                                                                     // 15
    sent: Match.Optional(Boolean),                                                                                    // 16
    sending: Match.Optional(Match.Integer),                                                                           // 17
    badge: Match.Optional(Match.Integer),                                                                             // 18
    sound: Match.Optional(String),                                                                                    // 19
    notId: Match.Optional(Match.Integer),                                                                             // 20
    contentAvailable: Match.Optional(Match.Integer),                                                                  // 21
    apn: Match.Optional({                                                                                             // 22
      from: Match.Optional(String),                                                                                   // 23
      title: Match.Optional(String),                                                                                  // 24
      text: Match.Optional(String),                                                                                   // 25
      badge: Match.Optional(Match.Integer),                                                                           // 26
      sound: Match.Optional(String),                                                                                  // 27
      notId: Match.Optional(Match.Integer)                                                                            // 28
    }),                                                                                                               // 22
    gcm: Match.Optional({                                                                                             // 30
      from: Match.Optional(String),                                                                                   // 31
      title: Match.Optional(String),                                                                                  // 32
      text: Match.Optional(String),                                                                                   // 33
      image: Match.Optional(String),                                                                                  // 34
      style: Match.Optional(String),                                                                                  // 35
      summaryText: Match.Optional(String),                                                                            // 36
      picture: Match.Optional(String),                                                                                // 37
      badge: Match.Optional(Match.Integer),                                                                           // 38
      sound: Match.Optional(String),                                                                                  // 39
      notId: Match.Optional(Match.Integer)                                                                            // 40
    }),                                                                                                               // 30
    query: Match.Optional(String),                                                                                    // 42
    token: Match.Optional(_matchToken),                                                                               // 43
    tokens: Match.Optional([_matchToken]),                                                                            // 44
    payload: Match.Optional(Object),                                                                                  // 45
    delayUntil: Match.Optional(Date),                                                                                 // 46
    createdAt: Date,                                                                                                  // 47
    createdBy: Match.OneOf(String, null)                                                                              // 48
  }); // Make sure a token selector or query have been set                                                            // 12
                                                                                                                      //
  if (!notification.token && !notification.tokens && !notification.query) {                                           // 52
    throw new Error('No token selector or query found');                                                              // 53
  } // If tokens array is set it should not be empty                                                                  // 54
                                                                                                                      //
                                                                                                                      //
  if (notification.tokens && !notification.tokens.length) {                                                           // 57
    throw new Error('No tokens in array');                                                                            // 58
  }                                                                                                                   // 59
};                                                                                                                    // 60
                                                                                                                      //
Push.send = function (options) {                                                                                      // 62
  // If on the client we set the user id - on the server we need an option                                            // 63
  // set or we default to "<SERVER>" as the creator of the notification                                               // 64
  // If current user not set see if we can set it to the logged in user                                               // 65
  // this will only run on the client if Meteor.userId is available                                                   // 66
  var currentUser = Meteor.isClient && Meteor.userId && Meteor.userId() || Meteor.isServer && (options.createdBy || '<SERVER>') || null; // Rig the notification object
                                                                                                                      //
  var notification = _.extend({                                                                                       // 71
    createdAt: new Date(),                                                                                            // 72
    createdBy: currentUser                                                                                            // 73
  }, _.pick(options, 'from', 'title', 'text')); // Add extra                                                          // 71
                                                                                                                      //
                                                                                                                      //
  _.extend(notification, _.pick(options, 'payload', 'badge', 'sound', 'notId', 'delayUntil'));                        // 77
                                                                                                                      //
  if (Match.test(options.apn, Object)) {                                                                              // 79
    notification.apn = _.pick(options.apn, 'from', 'title', 'text', 'badge', 'sound', 'notId');                       // 80
  }                                                                                                                   // 81
                                                                                                                      //
  if (Match.test(options.gcm, Object)) {                                                                              // 83
    notification.gcm = _.pick(options.gcm, 'image', 'style', 'summaryText', 'picture', 'from', 'title', 'text', 'badge', 'sound', 'notId');
  } // Set one token selector, this can be token, array of tokens or query                                            // 85
                                                                                                                      //
                                                                                                                      //
  if (options.query) {                                                                                                // 88
    // Set query to the json string version fixing #43 and #39                                                        // 89
    notification.query = JSON.stringify(options.query);                                                               // 90
  } else if (options.token) {                                                                                         // 91
    // Set token                                                                                                      // 92
    notification.token = options.token;                                                                               // 93
  } else if (options.tokens) {                                                                                        // 94
    // Set tokens                                                                                                     // 95
    notification.tokens = options.tokens;                                                                             // 96
  } //console.log(options);                                                                                           // 97
                                                                                                                      //
                                                                                                                      //
  if (typeof options.contentAvailable !== 'undefined') {                                                              // 99
    notification.contentAvailable = options.contentAvailable;                                                         // 100
  }                                                                                                                   // 101
                                                                                                                      //
  notification.sent = false;                                                                                          // 103
  notification.sending = 0; // Validate the notification                                                              // 104
                                                                                                                      //
  _validateDocument(notification); // Try to add the notification to send, we return an id to keep track              // 107
                                                                                                                      //
                                                                                                                      //
  return Push.notifications.insert(notification);                                                                     // 110
};                                                                                                                    // 111
                                                                                                                      //
Push.allow = function (rules) {                                                                                       // 113
  if (rules.send) {                                                                                                   // 114
    Push.notifications.allow({                                                                                        // 115
      'insert': function (userId, notification) {                                                                     // 116
        // Validate the notification                                                                                  // 117
        _validateDocument(notification); // Set the user defined "send" rules                                         // 118
                                                                                                                      //
                                                                                                                      //
        return rules.send.apply(this, [userId, notification]);                                                        // 120
      }                                                                                                               // 121
    });                                                                                                               // 115
  }                                                                                                                   // 123
};                                                                                                                    // 124
                                                                                                                      //
Push.deny = function (rules) {                                                                                        // 126
  if (rules.send) {                                                                                                   // 127
    Push.notifications.deny({                                                                                         // 128
      'insert': function (userId, notification) {                                                                     // 129
        // Validate the notification                                                                                  // 130
        _validateDocument(notification); // Set the user defined "send" rules                                         // 131
                                                                                                                      //
                                                                                                                      //
        return rules.send.apply(this, [userId, notification]);                                                        // 133
      }                                                                                                               // 134
    });                                                                                                               // 128
  }                                                                                                                   // 136
};                                                                                                                    // 137
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"push.api.js":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/raix_push/lib/server/push.api.js                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/*                                                                                                                    // 1
  A general purpose user CordovaPush                                                                                  //
  ios, android, mail, twitter?, facebook?, sms?, snailMail? :)                                                        //
                                                                                                                      //
  Phonegap generic :                                                                                                  //
  https://github.com/phonegap-build/PushPlugin                                                                        //
 */ // getText / getBinary                                                                                            //
Push.setBadge = function () /* id, count */{// throw new Error('Push.setBadge not implemented on the server');        // 11
};                                                                                                                    // 13
                                                                                                                      //
var isConfigured = false;                                                                                             // 15
                                                                                                                      //
var sendWorker = function (task, interval) {                                                                          // 17
  if (typeof Push.Log === 'function') {                                                                               // 18
    Push.Log('Push: Send worker started, using interval:', interval);                                                 // 19
  }                                                                                                                   // 20
                                                                                                                      //
  if (Push.debug) {                                                                                                   // 21
    console.log('Push: Send worker started, using interval: ' + interval);                                            // 22
  }                                                                                                                   // 23
                                                                                                                      //
  return Meteor.setInterval(function () {                                                                             // 25
    // xxx: add exponential backoff on error                                                                          // 26
    try {                                                                                                             // 27
      task();                                                                                                         // 28
    } catch (error) {                                                                                                 // 29
      if (typeof Push.Log === 'function') {                                                                           // 30
        Push.Log('Push: Error while sending:', error.message);                                                        // 31
      }                                                                                                               // 32
                                                                                                                      //
      if (Push.debug) {                                                                                               // 33
        console.log('Push: Error while sending: ' + error.message);                                                   // 34
      }                                                                                                               // 35
    }                                                                                                                 // 36
  }, interval);                                                                                                       // 37
};                                                                                                                    // 38
                                                                                                                      //
Push.Configure = function (options) {                                                                                 // 40
  var self = this;                                                                                                    // 41
  options = _.extend({                                                                                                // 42
    sendTimeout: 60000 // Timeout period for notification send                                                        // 43
                                                                                                                      //
  }, options); // https://npmjs.org/package/apn                                                                       // 42
  // After requesting the certificate from Apple, export your private key as                                          // 47
  // a .p12 file anddownload the .cer file from the iOS Provisioning Portal.                                          // 48
  // gateway.push.apple.com, port 2195                                                                                // 50
  // gateway.sandbox.push.apple.com, port 2195                                                                        // 51
  // Now, in the directory containing cert.cer and key.p12 execute the                                                // 53
  // following commands to generate your .pem files:                                                                  // 54
  // $ openssl x509 -in cert.cer -inform DER -outform PEM -out cert.pem                                               // 55
  // $ openssl pkcs12 -in key.p12 -out key.pem -nodes                                                                 // 56
  // Block multiple calls                                                                                             // 58
                                                                                                                      //
  if (isConfigured) {                                                                                                 // 59
    throw new Error('Push.Configure should not be called more than once!');                                           // 60
  }                                                                                                                   // 61
                                                                                                                      //
  isConfigured = true; // Add debug info                                                                              // 63
                                                                                                                      //
  if (Push.debug) {                                                                                                   // 66
    console.log('Push.Configure', options);                                                                           // 67
  } // This function is called when a token is replaced on a device - normally                                        // 68
  // this should not happen, but if it does we should take action on it                                               // 71
                                                                                                                      //
                                                                                                                      //
  _replaceToken = function (currentToken, newToken) {                                                                 // 72
    // console.log('Replace token: ' + currentToken + ' -- ' + newToken);                                             // 73
    // If the server gets a token event its passing in the current token and                                          // 74
    // the new value - if new value is undefined this empty the token                                                 // 75
    self.emitState('token', currentToken, newToken);                                                                  // 76
  }; // Rig the removeToken callback                                                                                  // 77
                                                                                                                      //
                                                                                                                      //
  _removeToken = function (token) {                                                                                   // 80
    // console.log('Remove token: ' + token);                                                                         // 81
    // Invalidate the token                                                                                           // 82
    self.emitState('token', token, null);                                                                             // 83
  };                                                                                                                  // 84
                                                                                                                      //
  if (options.apn) {                                                                                                  // 87
    if (Push.debug) {                                                                                                 // 88
      console.log('Push: APN configured');                                                                            // 89
    } // Allow production to be a general option for push notifications                                               // 90
                                                                                                                      //
                                                                                                                      //
    if (options.production === Boolean(options.production)) {                                                         // 93
      options.apn.production = options.production;                                                                    // 94
    } // Give the user warnings about development settings                                                            // 95
                                                                                                                      //
                                                                                                                      //
    if (options.apn.development) {                                                                                    // 98
      // This flag is normally set by the configuration file                                                          // 99
      console.warn('WARNING: Push APN is using development key and certificate');                                     // 100
    } else {                                                                                                          // 101
      // We check the apn gateway i the options, we could risk shipping                                               // 102
      // server into production while using the production configuration.                                             // 103
      // On the other hand we could be in development but using the production                                        // 104
      // configuration. And finally we could have configured an unknown apn                                           // 105
      // gateway (this could change in the future - but a warning about typos                                         // 106
      // can save hours of debugging)                                                                                 // 107
      //                                                                                                              // 108
      // Warn about gateway configurations - it's more a guide                                                        // 109
      if (options.apn.gateway) {                                                                                      // 110
        if (options.apn.gateway === 'gateway.sandbox.push.apple.com') {                                               // 112
          // Using the development sandbox                                                                            // 113
          console.warn('WARNING: Push APN is in development mode');                                                   // 114
        } else if (options.apn.gateway === 'gateway.push.apple.com') {                                                // 115
          // In production - but warn if we are running on localhost                                                  // 116
          if (/http:\/\/localhost/.test(Meteor.absoluteUrl())) {                                                      // 117
            console.warn('WARNING: Push APN is configured to production mode - but server is running' + ' from localhost');
          }                                                                                                           // 120
        } else {                                                                                                      // 121
          // Warn about gateways we dont know about                                                                   // 122
          console.warn('WARNING: Push APN unkown gateway "' + options.apn.gateway + '"');                             // 123
        }                                                                                                             // 124
      } else {                                                                                                        // 126
        if (options.apn.production) {                                                                                 // 127
          if (/http:\/\/localhost/.test(Meteor.absoluteUrl())) {                                                      // 128
            console.warn('WARNING: Push APN is configured to production mode - but server is running' + ' from localhost');
          }                                                                                                           // 131
        } else {                                                                                                      // 132
          console.warn('WARNING: Push APN is in development mode');                                                   // 133
        }                                                                                                             // 134
      }                                                                                                               // 135
    } // Check certificate data                                                                                       // 137
                                                                                                                      //
                                                                                                                      //
    if (!options.apn.certData || !options.apn.certData.length) {                                                      // 140
      console.error('ERROR: Push server could not find certData');                                                    // 141
    } // Check key data                                                                                               // 142
                                                                                                                      //
                                                                                                                      //
    if (!options.apn.keyData || !options.apn.keyData.length) {                                                        // 145
      console.error('ERROR: Push server could not find keyData');                                                     // 146
    } // Rig apn connection                                                                                           // 147
                                                                                                                      //
                                                                                                                      //
    var apn = Npm.require('apn');                                                                                     // 150
                                                                                                                      //
    var apnConnection = new apn.Connection(options.apn); // Listen to transmission errors - should handle the same way as feedback.
                                                                                                                      //
    apnConnection.on('transmissionError', Meteor.bindEnvironment(function (errCode, notification, recipient) {        // 154
      if (Push.debug) {                                                                                               // 155
        console.log('Got error code %d for token %s', errCode, notification.token);                                   // 156
      }                                                                                                               // 157
                                                                                                                      //
      if ([2, 5, 8].indexOf(errCode) >= 0) {                                                                          // 158
        // Invalid token errors...                                                                                    // 161
        _removeToken({                                                                                                // 162
          apn: notification.token                                                                                     // 163
        });                                                                                                           // 162
      }                                                                                                               // 165
    })); // XXX: should we do a test of the connection? It would be nice to know                                      // 166
    // That the server/certificates/network are correct configured                                                    // 168
    // apnConnection.connect().then(function() {                                                                      // 170
    //     console.info('CHECK: Push APN connection OK');                                                             // 171
    // }, function(err) {                                                                                             // 172
    //     console.warn('CHECK: Push APN connection FAILURE');                                                        // 173
    // });                                                                                                            // 174
    // Note: the above code spoils the connection - investigate how to                                                // 175
    // shutdown/close it.                                                                                             // 176
                                                                                                                      //
    self.sendAPN = function (userToken, notification) {                                                               // 178
      if (Match.test(notification.apn, Object)) {                                                                     // 179
        notification = _.extend({}, notification, notification.apn);                                                  // 180
      } // console.log('sendAPN', notification.from, userToken, notification.title, notification.text,                // 181
      // notification.badge, notification.priority);                                                                  // 184
                                                                                                                      //
                                                                                                                      //
      var priority = notification.priority || notification.priority === 0 ? notification.priority : 10;               // 185
      var myDevice = new apn.Device(userToken);                                                                       // 187
      var note = new apn.Notification();                                                                              // 189
      note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.                                 // 191
                                                                                                                      //
      if (typeof notification.badge !== 'undefined') {                                                                // 192
        note.badge = notification.badge;                                                                              // 193
      }                                                                                                               // 194
                                                                                                                      //
      if (typeof notification.sound !== 'undefined') {                                                                // 195
        note.sound = notification.sound;                                                                              // 196
      } //console.log(notification.contentAvailable);                                                                 // 197
      //console.log("lala2");                                                                                         // 199
      //console.log(notification);                                                                                    // 200
                                                                                                                      //
                                                                                                                      //
      if (typeof notification.contentAvailable !== 'undefined') {                                                     // 201
        //console.log("lala");                                                                                        // 202
        note.setContentAvailable(notification.contentAvailable); //console.log(note);                                 // 203
      } // adds category support for iOS8 custom actions as described here:                                           // 205
      // https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/                         // 208
      // RemoteNotificationsPG/Chapters/IPhoneOSClientImp.html#//apple_ref/doc/uid/TP40008194-CH103-SW36              // 209
                                                                                                                      //
                                                                                                                      //
      if (typeof notification.category !== 'undefined') {                                                             // 210
        note.category = notification.category;                                                                        // 211
      }                                                                                                               // 212
                                                                                                                      //
      note.alert = notification.text; // Allow the user to set payload data                                           // 214
                                                                                                                      //
      note.payload = notification.payload ? {                                                                         // 216
        ejson: EJSON.stringify(notification.payload)                                                                  // 216
      } : {};                                                                                                         // 216
      note.payload.messageFrom = notification.from;                                                                   // 218
      note.priority = priority; // Store the token on the note so we can reference it if there was an error           // 219
                                                                                                                      //
      note.token = userToken; // console.log('I:Send message to: ' + userToken + ' count=' + count);                  // 223
                                                                                                                      //
      apnConnection.pushNotification(note, myDevice);                                                                 // 227
    };                                                                                                                // 229
                                                                                                                      //
    var initFeedback = function () {                                                                                  // 232
      var apn = Npm.require('apn'); // console.log('Init feedback');                                                  // 233
                                                                                                                      //
                                                                                                                      //
      var feedbackOptions = {                                                                                         // 235
        'batchFeedback': true,                                                                                        // 236
        // Time in SECONDS                                                                                            // 238
        'interval': 5,                                                                                                // 239
        production: !options.apn.development,                                                                         // 240
        cert: options.certData,                                                                                       // 241
        key: options.keyData,                                                                                         // 242
        passphrase: options.passphrase                                                                                // 243
      };                                                                                                              // 235
      var feedback = new apn.Feedback(feedbackOptions);                                                               // 246
      feedback.on('feedback', function (devices) {                                                                    // 247
        devices.forEach(function (item) {                                                                             // 248
          // Do something with item.device and item.time;                                                             // 249
          // console.log('A:PUSH FEEDBACK ' + item.device + ' - ' + item.time);                                       // 250
          // The app is most likely removed from the device, we should                                                // 251
          // remove the token                                                                                         // 252
          _removeToken({                                                                                              // 253
            apn: item.device                                                                                          // 254
          });                                                                                                         // 253
        });                                                                                                           // 256
      });                                                                                                             // 257
      feedback.start();                                                                                               // 259
    }; // Init feedback from apn server                                                                               // 260
    // This will help keep the appCollection up-to-date, it will help update                                          // 263
    // and remove token from appCollection.                                                                           // 264
                                                                                                                      //
                                                                                                                      //
    initFeedback();                                                                                                   // 265
  } // EO ios notification                                                                                            // 267
                                                                                                                      //
                                                                                                                      //
  if (options.gcm && options.gcm.apiKey) {                                                                            // 269
    if (Push.debug) {                                                                                                 // 270
      console.log('GCM configured');                                                                                  // 271
    } //self.sendGCM = function(options.from, userTokens, options.title, options.text, options.badge, options.priority) {
                                                                                                                      //
                                                                                                                      //
    self.sendGCM = function (userTokens, notification) {                                                              // 274
      if (Match.test(notification.gcm, Object)) {                                                                     // 275
        notification = _.extend({}, notification, notification.gcm);                                                  // 276
      } // Make sure userTokens are an array of strings                                                               // 277
                                                                                                                      //
                                                                                                                      //
      if (userTokens === '' + userTokens) {                                                                           // 280
        userTokens = [userTokens];                                                                                    // 281
      } // Check if any tokens in there to send                                                                       // 282
                                                                                                                      //
                                                                                                                      //
      if (!userTokens.length) {                                                                                       // 285
        if (Push.debug) {                                                                                             // 286
          console.log('sendGCM no push tokens found');                                                                // 287
        }                                                                                                             // 288
                                                                                                                      //
        return;                                                                                                       // 289
      }                                                                                                               // 290
                                                                                                                      //
      if (Push.debug) {                                                                                               // 292
        console.log('sendGCM', userTokens, notification);                                                             // 293
      }                                                                                                               // 294
                                                                                                                      //
      var gcm = Npm.require('node-gcm');                                                                              // 296
                                                                                                                      //
      var Fiber = Npm.require('fibers'); // Allow user to set payload                                                 // 297
                                                                                                                      //
                                                                                                                      //
      var data = notification.payload ? {                                                                             // 300
        ejson: EJSON.stringify(notification.payload)                                                                  // 300
      } : {};                                                                                                         // 300
      data.title = notification.title;                                                                                // 302
      data.message = notification.text; // Set image                                                                  // 303
                                                                                                                      //
      if (typeof notification.image !== 'undefined') {                                                                // 306
        data.image = notification.image;                                                                              // 307
      } // Set extra details                                                                                          // 308
                                                                                                                      //
                                                                                                                      //
      if (typeof notification.badge !== 'undefined') {                                                                // 311
        data.msgcnt = notification.badge;                                                                             // 312
      }                                                                                                               // 313
                                                                                                                      //
      if (typeof notification.sound !== 'undefined') {                                                                // 314
        data.soundname = notification.sound;                                                                          // 315
      }                                                                                                               // 316
                                                                                                                      //
      if (typeof notification.notId !== 'undefined') {                                                                // 317
        data.notId = notification.notId;                                                                              // 318
      }                                                                                                               // 319
                                                                                                                      //
      if (typeof notification.style !== 'undefined') {                                                                // 320
        data.style = notification.style;                                                                              // 321
      }                                                                                                               // 322
                                                                                                                      //
      if (typeof notification.summaryText !== 'undefined') {                                                          // 323
        data.summaryText = notification.summaryText;                                                                  // 324
      }                                                                                                               // 325
                                                                                                                      //
      if (typeof notification.picture !== 'undefined') {                                                              // 326
        data.picture = notification.picture;                                                                          // 327
      } //var message = new gcm.Message();                                                                            // 328
                                                                                                                      //
                                                                                                                      //
      var message = new gcm.Message({                                                                                 // 331
        collapseKey: notification.from,                                                                               // 332
        //    delayWhileIdle: true,                                                                                   // 333
        //    timeToLive: 4,                                                                                          // 334
        //    restricted_package_name: 'dk.gi2.app'                                                                   // 335
        data: data                                                                                                    // 336
      });                                                                                                             // 331
                                                                                                                      //
      if (Push.debug) {                                                                                               // 339
        console.log('Create GCM Sender using "' + options.gcm.apiKey + '"');                                          // 340
      }                                                                                                               // 341
                                                                                                                      //
      var sender = new gcm.Sender(options.gcm.apiKey);                                                                // 342
                                                                                                                      //
      _.each(userTokens, function (value /*, key */) {                                                                // 344
        if (Push.debug) {                                                                                             // 345
          console.log('A:Send message to: ' + value);                                                                 // 346
        }                                                                                                             // 347
      }); /*message.addData('title', title);                                                                          // 348
          message.addData('message', text);                                                                           //
          message.addData('msgcnt', '1');                                                                             //
          message.collapseKey = 'sitDrift';                                                                           //
          message.delayWhileIdle = true;                                                                              //
          message.timeToLive = 3;*/ // /**                                                                            //
      //  * Parameters: message-literal, userTokens-array, No. of retries, callback-function                          // 358
      //  */                                                                                                          // 359
                                                                                                                      //
                                                                                                                      //
      var userToken = userTokens.length === 1 ? userTokens[0] : null;                                                 // 361
      sender.send(message, userTokens, 5, function (err, result) {                                                    // 363
        if (err) {                                                                                                    // 364
          if (Push.debug) {                                                                                           // 365
            console.log('ANDROID ERROR: result of sender: ' + result);                                                // 366
          }                                                                                                           // 367
        } else {                                                                                                      // 368
          if (result === null) {                                                                                      // 369
            if (Push.debug) {                                                                                         // 370
              console.log('ANDROID: Result of sender is null');                                                       // 371
            }                                                                                                         // 372
                                                                                                                      //
            return;                                                                                                   // 373
          }                                                                                                           // 374
                                                                                                                      //
          if (Push.debug) {                                                                                           // 375
            console.log('ANDROID: Result of sender: ' + JSON.stringify(result));                                      // 376
          }                                                                                                           // 377
                                                                                                                      //
          if (result.canonical_ids === 1 && userToken) {                                                              // 378
            // jshint ignore:line                                                                                     // 378
            // This is an old device, token is replaced                                                               // 380
            Fiber(function (self) {                                                                                   // 381
              // Run in fiber                                                                                         // 382
              try {                                                                                                   // 383
                self.callback(self.oldToken, self.newToken);                                                          // 384
              } catch (err) {}                                                                                        // 385
            }).run({                                                                                                  // 389
              oldToken: {                                                                                             // 390
                gcm: userToken                                                                                        // 390
              },                                                                                                      // 390
              newToken: {                                                                                             // 391
                gcm: result.results[0].registration_id                                                                // 391
              },                                                                                                      // 391
              // jshint ignore:line                                                                                   // 391
              callback: _replaceToken                                                                                 // 392
            }); //_replaceToken({ gcm: userToken }, { gcm: result.results[0].registration_id });                      // 389
          } // We cant send to that token - might not be registred                                                    // 396
          // ask the user to remove the token from the list                                                           // 398
                                                                                                                      //
                                                                                                                      //
          if (result.failure !== 0 && userToken) {                                                                    // 399
            // This is an old device, token is replaced                                                               // 401
            Fiber(function (self) {                                                                                   // 402
              // Run in fiber                                                                                         // 403
              try {                                                                                                   // 404
                self.callback(self.token);                                                                            // 405
              } catch (err) {}                                                                                        // 406
            }).run({                                                                                                  // 410
              token: {                                                                                                // 411
                gcm: userToken                                                                                        // 411
              },                                                                                                      // 411
              callback: _removeToken                                                                                  // 412
            }); //_replaceToken({ gcm: userToken }, { gcm: result.results[0].registration_id });                      // 410
          }                                                                                                           // 416
        }                                                                                                             // 418
      }); // /** Use the following line if you want to send the message without retries                               // 419
      // sender.sendNoRetry(message, userTokens, function (result) {                                                  // 421
      //     console.log('ANDROID: ' + JSON.stringify(result));                                                       // 422
      // });                                                                                                          // 423
      // **/                                                                                                          // 424
    }; // EO sendAndroid                                                                                              // 425
                                                                                                                      //
  } // EO Android                                                                                                     // 427
  // Universal send function                                                                                          // 429
                                                                                                                      //
                                                                                                                      //
  var _querySend = function (query, options) {                                                                        // 430
    var countApn = [];                                                                                                // 432
    var countGcm = [];                                                                                                // 433
    Push.appCollection.find(query).forEach(function (app) {                                                           // 435
      if (Push.debug) {                                                                                               // 437
        console.log('send to token', app.token);                                                                      // 438
      }                                                                                                               // 439
                                                                                                                      //
      if (app.token.apn) {                                                                                            // 441
        countApn.push(app._id); // Send to APN                                                                        // 442
                                                                                                                      //
        if (self.sendAPN) {                                                                                           // 444
          self.sendAPN(app.token.apn, options);                                                                       // 445
        }                                                                                                             // 446
      } else if (app.token.gcm) {                                                                                     // 448
        countGcm.push(app._id); // Send to GCM                                                                        // 449
        // We do support multiple here - so we should construct an array                                              // 452
        // and send it bulk - Investigate limit count of id's                                                         // 453
                                                                                                                      //
        if (self.sendGCM) {                                                                                           // 454
          self.sendGCM(app.token.gcm, options);                                                                       // 455
        }                                                                                                             // 456
      } else {                                                                                                        // 458
        throw new Error('Push.send got a faulty query');                                                              // 459
      }                                                                                                               // 460
    });                                                                                                               // 462
                                                                                                                      //
    if (Push.debug) {                                                                                                 // 464
      console.log('Push: Sent message "' + options.title + '" to ' + countApn.length + ' ios apps ' + countGcm.length + ' android apps'); // Add some verbosity about the send result, making sure the developer
      // understands what just happened.                                                                              // 470
                                                                                                                      //
      if (!countApn.length && !countGcm.length) {                                                                     // 471
        if (Push.appCollection.find().count() === 0) {                                                                // 472
          console.log('Push, GUIDE: The "Push.appCollection" is empty -' + ' No clients have registred on the server yet...');
        }                                                                                                             // 475
      } else if (!countApn.length) {                                                                                  // 476
        if (Push.appCollection.find({                                                                                 // 477
          'token.apn': {                                                                                              // 477
            $exists: true                                                                                             // 477
          }                                                                                                           // 477
        }).count() === 0) {                                                                                           // 477
          console.log('Push, GUIDE: The "Push.appCollection" - No APN clients have registred on the server yet...');  // 478
        }                                                                                                             // 479
      } else if (!countGcm.length) {                                                                                  // 480
        if (Push.appCollection.find({                                                                                 // 481
          'token.gcm': {                                                                                              // 481
            $exists: true                                                                                             // 481
          }                                                                                                           // 481
        }).count() === 0) {                                                                                           // 481
          console.log('Push, GUIDE: The "Push.appCollection" - No GCM clients have registred on the server yet...');  // 482
        }                                                                                                             // 483
      }                                                                                                               // 484
    }                                                                                                                 // 486
                                                                                                                      //
    return {                                                                                                          // 488
      apn: countApn,                                                                                                  // 489
      gcm: countGcm                                                                                                   // 490
    };                                                                                                                // 488
  };                                                                                                                  // 492
                                                                                                                      //
  self.serverSend = function (options) {                                                                              // 494
    options = options || {                                                                                            // 495
      badge: 0                                                                                                        // 495
    };                                                                                                                // 495
    var query; // Check basic options                                                                                 // 496
                                                                                                                      //
    if (options.from !== '' + options.from) {                                                                         // 499
      throw new Error('Push.send: option "from" not a string');                                                       // 500
    }                                                                                                                 // 501
                                                                                                                      //
    if (options.title !== '' + options.title) {                                                                       // 503
      throw new Error('Push.send: option "title" not a string');                                                      // 504
    }                                                                                                                 // 505
                                                                                                                      //
    if (options.text !== '' + options.text) {                                                                         // 507
      throw new Error('Push.send: option "text" not a string');                                                       // 508
    }                                                                                                                 // 509
                                                                                                                      //
    if (options.token || options.tokens) {                                                                            // 511
      // The user set one token or array of tokens                                                                    // 513
      var tokenList = options.token ? [options.token] : options.tokens;                                               // 514
                                                                                                                      //
      if (Push.debug) {                                                                                               // 516
        console.log('Push: Send message "' + options.title + '" via token(s)', tokenList);                            // 517
      }                                                                                                               // 518
                                                                                                                      //
      query = {                                                                                                       // 520
        $or: [// XXX: Test this query: can we hand in a list of push tokens?                                          // 521
        {                                                                                                             // 523
          $and: [{                                                                                                    // 523
            token: {                                                                                                  // 524
              $in: tokenList                                                                                          // 524
            }                                                                                                         // 524
          }, // And is not disabled                                                                                   // 524
          {                                                                                                           // 526
            enabled: {                                                                                                // 526
              $ne: false                                                                                              // 526
            }                                                                                                         // 526
          }]                                                                                                          // 526
        }, // XXX: Test this query: does this work on app id?                                                         // 523
        {                                                                                                             // 530
          $and: [{                                                                                                    // 530
            _in: {                                                                                                    // 531
              $in: tokenList                                                                                          // 531
            }                                                                                                         // 531
          }, // one of the app ids                                                                                    // 531
          {                                                                                                           // 532
            $or: [{                                                                                                   // 532
              'token.apn': {                                                                                          // 533
                $exists: true                                                                                         // 533
              }                                                                                                       // 533
            }, // got apn token                                                                                       // 533
            {                                                                                                         // 534
              'token.gcm': {                                                                                          // 534
                $exists: true                                                                                         // 534
              } // got gcm token                                                                                      // 534
                                                                                                                      //
            }]                                                                                                        // 534
          }, // And is not disabled                                                                                   // 532
          {                                                                                                           // 537
            enabled: {                                                                                                // 537
              $ne: false                                                                                              // 537
            }                                                                                                         // 537
          }]                                                                                                          // 537
        }]                                                                                                            // 530
      };                                                                                                              // 520
    } else if (options.query) {                                                                                       // 543
      if (Push.debug) {                                                                                               // 545
        console.log('Push: Send message "' + options.title + '" via query', options.query);                           // 546
      }                                                                                                               // 547
                                                                                                                      //
      query = {                                                                                                       // 549
        $and: [options.query, // query object                                                                         // 550
        {                                                                                                             // 552
          $or: [{                                                                                                     // 552
            'token.apn': {                                                                                            // 553
              $exists: true                                                                                           // 553
            }                                                                                                         // 553
          }, // got apn token                                                                                         // 553
          {                                                                                                           // 554
            'token.gcm': {                                                                                            // 554
              $exists: true                                                                                           // 554
            } // got gcm token                                                                                        // 554
                                                                                                                      //
          }]                                                                                                          // 554
        }, // And is not disabled                                                                                     // 552
        {                                                                                                             // 557
          enabled: {                                                                                                  // 557
            $ne: false                                                                                                // 557
          }                                                                                                           // 557
        }]                                                                                                            // 557
      };                                                                                                              // 549
    }                                                                                                                 // 560
                                                                                                                      //
    if (query) {                                                                                                      // 563
      // Convert to querySend and return status                                                                       // 565
      return _querySend(query, options);                                                                              // 566
    } else {                                                                                                          // 568
      throw new Error('Push.send: please set option "token"/"tokens" or "query"');                                    // 569
    }                                                                                                                 // 570
  }; // This interval will allow only one notification to be sent at a time, it                                       // 572
  // will check for new notifications at every `options.sendInterval`                                                 // 576
  // (default interval is 15000 ms)                                                                                   // 577
  //                                                                                                                  // 578
  // It looks in notifications collection to see if theres any pending                                                // 579
  // notifications, if so it will try to reserve the pending notification.                                            // 580
  // If successfully reserved the send is started.                                                                    // 581
  //                                                                                                                  // 582
  // If notification.query is type string, it's assumed to be a json string                                           // 583
  // version of the query selector. Making it able to carry `$` properties in                                         // 584
  // the mongo collection.                                                                                            // 585
  //                                                                                                                  // 586
  // Pr. default notifications are removed from the collection after send have                                        // 587
  // completed. Setting `options.keepNotifications` will update and keep the                                          // 588
  // notification eg. if needed for historical reasons.                                                               // 589
  //                                                                                                                  // 590
  // After the send have completed a "send" event will be emitted with a                                              // 591
  // status object containing notification id and the send result object.                                             // 592
  //                                                                                                                  // 593
                                                                                                                      //
                                                                                                                      //
  var isSendingNotification = false;                                                                                  // 594
                                                                                                                      //
  if (options.sendInterval !== null) {                                                                                // 596
    // This will require index since we sort notifications by createdAt                                               // 598
    Push.notifications._ensureIndex({                                                                                 // 599
      createdAt: 1                                                                                                    // 599
    });                                                                                                               // 599
                                                                                                                      //
    Push.notifications._ensureIndex({                                                                                 // 600
      sent: 1                                                                                                         // 600
    });                                                                                                               // 600
                                                                                                                      //
    Push.notifications._ensureIndex({                                                                                 // 601
      sending: 1                                                                                                      // 601
    });                                                                                                               // 601
                                                                                                                      //
    Push.notifications._ensureIndex({                                                                                 // 602
      delayUntil: 1                                                                                                   // 602
    });                                                                                                               // 602
                                                                                                                      //
    var sendNotification = function (notification) {                                                                  // 604
      // Reserve notification                                                                                         // 605
      var now = +new Date();                                                                                          // 606
      var timeoutAt = now + options.sendTimeout;                                                                      // 607
      var reserved = Push.notifications.update({                                                                      // 608
        _id: notification._id,                                                                                        // 609
        sent: false,                                                                                                  // 610
        // xxx: need to make sure this is set on create                                                               // 610
        sending: {                                                                                                    // 611
          $lt: now                                                                                                    // 611
        }                                                                                                             // 611
      }, {                                                                                                            // 608
        $set: {                                                                                                       // 614
          sending: timeoutAt                                                                                          // 615
        }                                                                                                             // 614
      }); // Make sure we only handle notifications reserved by this                                                  // 613
      // instance                                                                                                     // 620
                                                                                                                      //
      if (reserved) {                                                                                                 // 621
        // Check if query is set and is type String                                                                   // 623
        if (notification.query && notification.query === '' + notification.query) {                                   // 624
          try {                                                                                                       // 625
            // The query is in string json format - we need to parse it                                               // 626
            notification.query = JSON.parse(notification.query);                                                      // 627
          } catch (err) {                                                                                             // 628
            // Did the user tamper with this??                                                                        // 629
            throw new Error('Push: Error while parsing query string, Error: ' + err.message);                         // 630
          }                                                                                                           // 631
        } // Send the notification                                                                                    // 632
                                                                                                                      //
                                                                                                                      //
        var result = Push.serverSend(notification);                                                                   // 635
                                                                                                                      //
        if (!options.keepNotifications) {                                                                             // 637
          // Pr. Default we will remove notifications                                                                 // 638
          Push.notifications.remove({                                                                                 // 639
            _id: notification._id                                                                                     // 639
          });                                                                                                         // 639
        } else {                                                                                                      // 640
          // Update the notification                                                                                  // 642
          Push.notifications.update({                                                                                 // 643
            _id: notification._id                                                                                     // 643
          }, {                                                                                                        // 643
            $set: {                                                                                                   // 644
              // Mark as sent                                                                                         // 645
              sent: true,                                                                                             // 646
              // Set the sent date                                                                                    // 647
              sentAt: new Date(),                                                                                     // 648
              // Count                                                                                                // 649
              count: result,                                                                                          // 650
              // Not being sent anymore                                                                               // 651
              sending: 0                                                                                              // 652
            }                                                                                                         // 644
          });                                                                                                         // 643
        } // Emit the send                                                                                            // 656
                                                                                                                      //
                                                                                                                      //
        self.emit('send', {                                                                                           // 659
          notification: notification._id,                                                                             // 659
          result: result                                                                                              // 659
        });                                                                                                           // 659
      } // Else could not reserve                                                                                     // 661
                                                                                                                      //
    }; // EO sendNotification                                                                                         // 662
                                                                                                                      //
                                                                                                                      //
    sendWorker(function () {                                                                                          // 664
      if (isSendingNotification) {                                                                                    // 666
        return;                                                                                                       // 667
      } // Set send fence                                                                                             // 668
                                                                                                                      //
                                                                                                                      //
      isSendingNotification = true; // var countSent = 0;                                                             // 670
                                                                                                                      //
      var batchSize = options.sendBatchSize || 1;                                                                     // 673
      var now = +new Date(); // Find notifications that are not being or already sent                                 // 675
                                                                                                                      //
      var pendingNotifications = Push.notifications.find({                                                            // 678
        $and: [// Message is not sent                                                                                 // 678
        {                                                                                                             // 680
          sent: false                                                                                                 // 680
        }, // And not being sent by other instances                                                                   // 680
        {                                                                                                             // 682
          sending: {                                                                                                  // 682
            $lt: now                                                                                                  // 682
          }                                                                                                           // 682
        }, // And not queued for future                                                                               // 682
        {                                                                                                             // 684
          $or: [{                                                                                                     // 684
            delayUntil: {                                                                                             // 685
              $exists: false                                                                                          // 685
            }                                                                                                         // 685
          }, {                                                                                                        // 685
            delayUntil: {                                                                                             // 686
              $lte: new Date()                                                                                        // 686
            }                                                                                                         // 686
          }]                                                                                                          // 686
        }]                                                                                                            // 684
      }, {                                                                                                            // 678
        // Sort by created date                                                                                       // 690
        sort: {                                                                                                       // 691
          createdAt: 1                                                                                                // 691
        },                                                                                                            // 691
        limit: batchSize                                                                                              // 692
      });                                                                                                             // 689
      pendingNotifications.forEach(function (notification) {                                                          // 695
        try {                                                                                                         // 696
          sendNotification(notification);                                                                             // 697
        } catch (error) {                                                                                             // 698
          if (typeof Push.Log === 'function') {                                                                       // 699
            Push.Log('Push: Could not send notification id: "' + notification._id + '", Error:', error.message);      // 700
          }                                                                                                           // 701
                                                                                                                      //
          if (Push.debug) {                                                                                           // 702
            console.log('Push: Could not send notification id: "' + notification._id + '", Error: ' + error.message);
          }                                                                                                           // 704
        }                                                                                                             // 705
      }); // EO forEach                                                                                               // 706
      // Remove the send fence                                                                                        // 708
                                                                                                                      //
      isSendingNotification = false;                                                                                  // 709
    }, options.sendInterval || 15000); // Default every 15th sec                                                      // 710
  } else {                                                                                                            // 712
    if (Push.debug) {                                                                                                 // 713
      console.log('Push: Send server is disabled');                                                                   // 714
    }                                                                                                                 // 715
  }                                                                                                                   // 716
};                                                                                                                    // 718
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"server.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/raix_push/lib/server/server.js                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Push.appCollection = new Mongo.Collection('_raix_push_app_tokens');                                                   // 1
Push.addListener('token', function (currentToken, value) {                                                            // 3
  if (value) {                                                                                                        // 4
    // Update the token for app                                                                                       // 5
    Push.appCollection.update({                                                                                       // 6
      token: currentToken                                                                                             // 6
    }, {                                                                                                              // 6
      $set: {                                                                                                         // 6
        token: value                                                                                                  // 6
      }                                                                                                               // 6
    }, {                                                                                                              // 6
      multi: true                                                                                                     // 6
    });                                                                                                               // 6
  } else if (value === null) {                                                                                        // 7
    // Remove the token for app                                                                                       // 8
    Push.appCollection.update({                                                                                       // 9
      token: currentToken                                                                                             // 9
    }, {                                                                                                              // 9
      $unset: {                                                                                                       // 9
        token: true                                                                                                   // 9
      }                                                                                                               // 9
    }, {                                                                                                              // 9
      multi: true                                                                                                     // 9
    });                                                                                                               // 9
  }                                                                                                                   // 10
});                                                                                                                   // 11
Meteor.methods({                                                                                                      // 13
  'raix:push-update': function (options) {                                                                            // 14
    if (Push.debug) {                                                                                                 // 15
      console.log('Push: Got push token from app:', options);                                                         // 16
    }                                                                                                                 // 17
                                                                                                                      //
    check(options, {                                                                                                  // 19
      id: Match.Optional(String),                                                                                     // 20
      token: _matchToken,                                                                                             // 21
      appName: String,                                                                                                // 22
      userId: Match.OneOf(String, null),                                                                              // 23
      metadata: Match.Optional(Object)                                                                                // 24
    }); // The if user id is set then user id should match on client and connection                                   // 19
                                                                                                                      //
    if (options.userId && options.userId !== this.userId) {                                                           // 28
      throw new Meteor.Error(403, 'Forbidden access');                                                                // 29
    }                                                                                                                 // 30
                                                                                                                      //
    var doc; // lookup app by id if one was included                                                                  // 32
                                                                                                                      //
    if (options.id) {                                                                                                 // 35
      doc = Push.appCollection.findOne({                                                                              // 36
        _id: options.id                                                                                               // 36
      });                                                                                                             // 36
    } // No doc was found - we check the database to see if                                                           // 37
    // we can find a match for the app via token and appName                                                          // 40
                                                                                                                      //
                                                                                                                      //
    if (!doc) {                                                                                                       // 41
      doc = Push.appCollection.findOne({                                                                              // 42
        $and: [{                                                                                                      // 43
          token: options.token                                                                                        // 44
        }, // Match token                                                                                             // 44
        {                                                                                                             // 45
          appName: options.appName                                                                                    // 45
        }, // Match appName                                                                                           // 45
        {                                                                                                             // 46
          token: {                                                                                                    // 46
            $exists: true                                                                                             // 46
          } // Make sure token exists                                                                                 // 46
                                                                                                                      //
        }]                                                                                                            // 46
      });                                                                                                             // 42
    } // if we could not find the id or token then create it                                                          // 49
                                                                                                                      //
                                                                                                                      //
    if (!doc) {                                                                                                       // 52
      // Rig default doc                                                                                              // 53
      doc = {                                                                                                         // 54
        token: options.token,                                                                                         // 55
        appName: options.appName,                                                                                     // 56
        userId: options.userId,                                                                                       // 57
        enabled: true,                                                                                                // 58
        createdAt: new Date(),                                                                                        // 59
        updatedAt: new Date()                                                                                         // 60
      }; // XXX: We might want to check the id - Why isnt there a match for id                                        // 54
      // in the Meteor check... Normal length 17 (could be larger), and                                               // 64
      // numbers+letters are used in Random.id() with exception of 0 and 1                                            // 65
                                                                                                                      //
      doc._id = options.id || Random.id(); // The user wanted us to use a specific id, we didn't find this while      // 66
      // searching. The client could depend on the id eg. as reference so                                             // 68
      // we respect this and try to create a document with the selected id;                                           // 69
                                                                                                                      //
      Push.appCollection._collection.insert(doc);                                                                     // 70
    } else {                                                                                                          // 71
      // We found the app so update the updatedAt and set the token                                                   // 72
      Push.appCollection.update({                                                                                     // 73
        _id: doc._id                                                                                                  // 73
      }, {                                                                                                            // 73
        $set: {                                                                                                       // 74
          updatedAt: new Date(),                                                                                      // 75
          token: options.token                                                                                        // 76
        }                                                                                                             // 74
      });                                                                                                             // 73
    }                                                                                                                 // 79
                                                                                                                      //
    if (doc) {                                                                                                        // 81
      // xxx: Hack                                                                                                    // 82
      // Clean up mech making sure tokens are uniq - android sometimes generate                                       // 83
      // new tokens resulting in duplicates                                                                           // 84
      var removed = Push.appCollection.remove({                                                                       // 85
        $and: [{                                                                                                      // 86
          _id: {                                                                                                      // 87
            $ne: doc._id                                                                                              // 87
          }                                                                                                           // 87
        }, {                                                                                                          // 87
          token: doc.token                                                                                            // 88
        }, // Match token                                                                                             // 88
        {                                                                                                             // 89
          appName: doc.appName                                                                                        // 89
        }, // Match appName                                                                                           // 89
        {                                                                                                             // 90
          token: {                                                                                                    // 90
            $exists: true                                                                                             // 90
          } // Make sure token exists                                                                                 // 90
                                                                                                                      //
        }]                                                                                                            // 90
      });                                                                                                             // 85
                                                                                                                      //
      if (removed && Push.debug) {                                                                                    // 94
        console.log('Push: Removed ' + removed + ' existing app items');                                              // 95
      }                                                                                                               // 96
    }                                                                                                                 // 97
                                                                                                                      //
    if (doc && Push.debug) {                                                                                          // 99
      console.log('Push: updated', doc);                                                                              // 100
    }                                                                                                                 // 101
                                                                                                                      //
    if (!doc) {                                                                                                       // 103
      throw new Meteor.Error(500, 'setPushToken could not create record');                                            // 104
    } // Return the doc we want to use                                                                                // 105
                                                                                                                      //
                                                                                                                      //
    return doc;                                                                                                       // 107
  },                                                                                                                  // 108
  'raix:push-setuser': function (id) {                                                                                // 109
    check(id, String);                                                                                                // 110
                                                                                                                      //
    if (Push.debug) {                                                                                                 // 112
      console.log('Push: Settings userId "' + this.userId + '" for app:', id);                                        // 113
    } // We update the appCollection id setting the Meteor.userId                                                     // 114
                                                                                                                      //
                                                                                                                      //
    var found = Push.appCollection.update({                                                                           // 116
      _id: id                                                                                                         // 116
    }, {                                                                                                              // 116
      $set: {                                                                                                         // 116
        userId: this.userId                                                                                           // 116
      }                                                                                                               // 116
    }); // Note that the app id might not exist because no token is set yet.                                          // 116
    // We do create the new app id for the user since we might store additional                                       // 119
    // metadata for the app / user                                                                                    // 120
    // If id not found then create it?                                                                                // 122
    // We dont, its better to wait until the user wants to                                                            // 123
    // store metadata or token - We could end up with unused data in the                                              // 124
    // collection at every app re-install / update                                                                    // 125
    //                                                                                                                // 126
    // The user could store some metadata in appCollectin but only if they                                            // 127
    // have created the app and provided a token.                                                                     // 128
    // If not the metadata should be set via ground:db                                                                // 129
                                                                                                                      //
    return !!found;                                                                                                   // 131
  },                                                                                                                  // 132
  'raix:push-metadata': function (data) {                                                                             // 133
    check(data, {                                                                                                     // 134
      id: String,                                                                                                     // 135
      metadata: Object                                                                                                // 136
    }); // Set the metadata                                                                                           // 134
                                                                                                                      //
    var found = Push.appCollection.update({                                                                           // 140
      _id: data.id                                                                                                    // 140
    }, {                                                                                                              // 140
      $set: {                                                                                                         // 140
        metadata: data.metadata                                                                                       // 140
      }                                                                                                               // 140
    });                                                                                                               // 140
    return !!found;                                                                                                   // 142
  },                                                                                                                  // 143
  'raix:push-enable': function (data) {                                                                               // 144
    check(data, {                                                                                                     // 145
      id: String,                                                                                                     // 146
      enabled: Boolean                                                                                                // 147
    });                                                                                                               // 145
                                                                                                                      //
    if (Push.debug) {                                                                                                 // 150
      console.log('Push: Setting enabled to "' + data.enabled + '" for app:', data.id);                               // 151
    }                                                                                                                 // 152
                                                                                                                      //
    var found = Push.appCollection.update({                                                                           // 154
      _id: data.id                                                                                                    // 154
    }, {                                                                                                              // 154
      $set: {                                                                                                         // 154
        enabled: data.enabled                                                                                         // 154
      }                                                                                                               // 154
    });                                                                                                               // 154
    return !!found;                                                                                                   // 156
  }                                                                                                                   // 157
});                                                                                                                   // 13
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/raix:push/lib/common/main.js");
require("./node_modules/meteor/raix:push/lib/common/notifications.js");
require("./node_modules/meteor/raix:push/lib/server/push.api.js");
require("./node_modules/meteor/raix:push/lib/server/server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['raix:push'] = {}, {
  Push: Push,
  _matchToken: _matchToken,
  checkClientSecurity: checkClientSecurity,
  initPushUpdates: initPushUpdates,
  _replaceToken: _replaceToken,
  _removeToken: _removeToken
});

})();

//# sourceMappingURL=raix_push.js.map

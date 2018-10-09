(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RocketChatTabBar = Package['rocketchat:lib'].RocketChatTabBar;
var meteorInstall = Package.modules.meteorInstall;
var process = Package.modules.process;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:sms":{"settings.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// packages/rocketchat_sms/settings.js                                                            //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
Meteor.startup(function () {                                                                      // 1
	RocketChat.settings.addGroup('SMS', function () {                                                // 2
		this.add('SMS_Enabled', false, {                                                                // 3
			type: 'boolean',                                                                               // 4
			i18nLabel: 'Enabled'                                                                           // 5
		});                                                                                             // 3
		this.add('SMS_Service', 'twilio', {                                                             // 8
			type: 'select',                                                                                // 9
			values: [{                                                                                     // 10
				key: 'twilio',                                                                                // 11
				i18nLabel: 'Twilio'                                                                           // 12
			}],                                                                                            // 10
			i18nLabel: 'Service'                                                                           // 14
		});                                                                                             // 8
		this.section('Twilio', function () {                                                            // 17
			this.add('SMS_Twilio_Account_SID', '', {                                                       // 18
				type: 'string',                                                                               // 19
				enableQuery: {                                                                                // 20
					_id: 'SMS_Service',                                                                          // 21
					value: 'twilio'                                                                              // 22
				},                                                                                            // 20
				i18nLabel: 'Account_SID'                                                                      // 24
			});                                                                                            // 18
			this.add('SMS_Twilio_authToken', '', {                                                         // 26
				type: 'string',                                                                               // 27
				enableQuery: {                                                                                // 28
					_id: 'SMS_Service',                                                                          // 29
					value: 'twilio'                                                                              // 30
				},                                                                                            // 28
				i18nLabel: 'Auth_Token'                                                                       // 32
			});                                                                                            // 26
		});                                                                                             // 34
	});                                                                                              // 35
});                                                                                               // 36
////////////////////////////////////////////////////////////////////////////////////////////////////

},"SMS.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// packages/rocketchat_sms/SMS.js                                                                 //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
/* globals RocketChat */RocketChat.SMS = {                                                        // 1
	enabled: false,                                                                                  // 3
	services: {},                                                                                    // 4
	accountSid: null,                                                                                // 5
	authToken: null,                                                                                 // 6
	fromNumber: null,                                                                                // 7
	registerService: function (name, service) {                                                      // 9
		this.services[name] = service;                                                                  // 10
	},                                                                                               // 11
	getService: function (name) {                                                                    // 13
		if (!this.services[name]) {                                                                     // 14
			throw new Meteor.Error('error-sms-service-not-configured');                                    // 15
		}                                                                                               // 16
                                                                                                  //
		return new this.services[name](this.accountSid, this.authToken, this.fromNumber);               // 17
	}                                                                                                // 18
};                                                                                                // 2
RocketChat.settings.get('SMS_Enabled', function (key, value) {                                    // 21
	RocketChat.SMS.enabled = value;                                                                  // 22
});                                                                                               // 23
////////////////////////////////////////////////////////////////////////////////////////////////////

},"services":{"twilio.js":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// packages/rocketchat_sms/services/twilio.js                                                     //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                           //
                                                                                                  //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                  //
                                                                                                  //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
                                                                                                  //
/* globals RocketChat */var Twilio = function () {                                                // 1
	function Twilio() {                                                                              // 3
		(0, _classCallCheck3.default)(this, Twilio);                                                    // 3
		this.accountSid = RocketChat.settings.get('SMS_Twilio_Account_SID');                            // 4
		this.authToken = RocketChat.settings.get('SMS_Twilio_authToken');                               // 5
	}                                                                                                // 6
                                                                                                  //
	Twilio.prototype.parse = function () {                                                           //
		function parse(data) {                                                                          //
			return {                                                                                       // 8
				from: data.From,                                                                              // 9
				to: data.To,                                                                                  // 10
				body: data.Body,                                                                              // 11
				extra: {                                                                                      // 13
					toCountry: data.ToCountry,                                                                   // 14
					toState: data.ToState,                                                                       // 15
					toCity: data.ToCity,                                                                         // 16
					toZip: data.ToZip,                                                                           // 17
					fromCountry: data.FromCountry,                                                               // 18
					fromState: data.FromState,                                                                   // 19
					fromCity: data.FromCity,                                                                     // 20
					fromZip: data.FromZip                                                                        // 21
				}                                                                                             // 13
			};                                                                                             // 8
		}                                                                                               // 24
                                                                                                  //
		return parse;                                                                                   //
	}();                                                                                             //
                                                                                                  //
	Twilio.prototype.send = function () {                                                            //
		function send(fromNumber, toNumber, message) {                                                  //
			var client = Npm.require('twilio')(this.accountSid, this.authToken);                           // 26
                                                                                                  //
			client.messages.create({                                                                       // 28
				to: toNumber,                                                                                 // 29
				from: fromNumber,                                                                             // 30
				body: message                                                                                 // 31
			});                                                                                            // 28
		}                                                                                               // 33
                                                                                                  //
		return send;                                                                                    //
	}();                                                                                             //
                                                                                                  //
	Twilio.prototype.response = function () {                                                        //
		function response() /* message */{                                                              //
			return {                                                                                       // 35
				headers: {                                                                                    // 36
					'Content-Type': 'text/xml'                                                                   // 37
				},                                                                                            // 36
				body: '<Response></Response>'                                                                 // 39
			};                                                                                             // 35
		}                                                                                               // 41
                                                                                                  //
		return response;                                                                                //
	}();                                                                                             //
                                                                                                  //
	Twilio.prototype.error = function () {                                                           //
		function error(_error) {                                                                        //
			var message = '';                                                                              // 43
                                                                                                  //
			if (_error.reason) {                                                                           // 44
				message = "<Message>" + _error.reason + "</Message>";                                         // 45
			}                                                                                              // 46
                                                                                                  //
			return {                                                                                       // 47
				headers: {                                                                                    // 48
					'Content-Type': 'text/xml'                                                                   // 49
				},                                                                                            // 48
				body: "<Response>" + message + "</Response>"                                                  // 51
			};                                                                                             // 47
		}                                                                                               // 53
                                                                                                  //
		return error;                                                                                   //
	}();                                                                                             //
                                                                                                  //
	return Twilio;                                                                                   //
}();                                                                                              //
                                                                                                  //
RocketChat.SMS.registerService('twilio', Twilio);                                                 // 56
////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:sms/settings.js");
require("./node_modules/meteor/rocketchat:sms/SMS.js");
require("./node_modules/meteor/rocketchat:sms/services/twilio.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:sms'] = {};

})();

//# sourceMappingURL=rocketchat_sms.js.map

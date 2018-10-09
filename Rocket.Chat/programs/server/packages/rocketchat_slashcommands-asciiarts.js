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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:slashcommands-asciiarts":{"gimme.js":function(){

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// packages/rocketchat_slashcommands-asciiarts/gimme.js                             //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
/*                                                                                  // 1
* Gimme is a named function that will replace /gimme commands                       //
* @param {Object} message - The message object                                      //
*/function Gimme(command, params, item) {                                           //
	if (command === 'gimme') {                                                         // 8
		var msg = item;                                                                   // 9
		msg.msg = "\u0F3C \u3064 \u25D5_\u25D5 \u0F3D\u3064 " + params;                   // 10
		Meteor.call('sendMessage', msg);                                                  // 11
	}                                                                                  // 12
}                                                                                   // 13
                                                                                    //
RocketChat.slashCommands.add('gimme', Gimme, {                                      // 15
	description: 'Slash_Gimme_Description',                                            // 16
	params: 'your_message_optional'                                                    // 17
});                                                                                 // 15
//////////////////////////////////////////////////////////////////////////////////////

},"lenny.js":function(){

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// packages/rocketchat_slashcommands-asciiarts/lenny.js                             //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
/*                                                                                  // 1
* Lenny is a named function that will replace /lenny commands                       //
* @param {Object} message - The message object                                      //
*/function LennyFace(command, params, item) {                                       //
	if (command === 'lennyface') {                                                     // 8
		var msg = item;                                                                   // 9
		msg.msg = params + " ( \u0361\xB0 \u035C\u0296 \u0361\xB0)";                      // 10
		Meteor.call('sendMessage', msg);                                                  // 11
	}                                                                                  // 12
}                                                                                   // 13
                                                                                    //
RocketChat.slashCommands.add('lennyface', LennyFace, {                              // 15
	description: 'Slash_LennyFace_Description',                                        // 16
	params: 'your_message_optional'                                                    // 17
});                                                                                 // 15
//////////////////////////////////////////////////////////////////////////////////////

},"shrug.js":function(){

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// packages/rocketchat_slashcommands-asciiarts/shrug.js                             //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
/*                                                                                  // 1
* Shrug is a named function that will replace /shrug commands                       //
* @param {Object} message - The message object                                      //
*/function Shrug(command, params, item) {                                           //
	if (command === 'shrug') {                                                         // 8
		var msg = item;                                                                   // 9
		msg.msg = params + " \xAF\\_(\u30C4)_/\xAF";                                      // 10
		Meteor.call('sendMessage', msg);                                                  // 11
	}                                                                                  // 12
}                                                                                   // 13
                                                                                    //
RocketChat.slashCommands.add('shrug', Shrug, {                                      // 15
	description: 'Slash_Shrug_Description',                                            // 16
	params: 'your_message_optional'                                                    // 17
});                                                                                 // 15
//////////////////////////////////////////////////////////////////////////////////////

},"tableflip.js":function(){

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// packages/rocketchat_slashcommands-asciiarts/tableflip.js                         //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
/*                                                                                  // 1
* Tableflip is a named function that will replace /Tableflip commands               //
* @param {Object} message - The message object                                      //
*/function Tableflip(command, params, item) {                                       //
	if (command === 'tableflip') {                                                     // 8
		var msg = item;                                                                   // 9
		msg.msg = params + " (\u256F\xB0\u25A1\xB0\uFF09\u256F\uFE35 \u253B\u2501\u253B";
		Meteor.call('sendMessage', msg);                                                  // 11
	}                                                                                  // 12
}                                                                                   // 13
                                                                                    //
RocketChat.slashCommands.add('tableflip', Tableflip, {                              // 15
	description: 'Slash_Tableflip_Description',                                        // 16
	params: 'your_message_optional'                                                    // 17
});                                                                                 // 15
//////////////////////////////////////////////////////////////////////////////////////

},"unflip.js":function(){

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// packages/rocketchat_slashcommands-asciiarts/unflip.js                            //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
/*                                                                                  // 1
* Unflip is a named function that will replace /unflip commands                     //
* @param {Object} message - The message object                                      //
*/function Unflip(command, params, item) {                                          //
	if (command === 'unflip') {                                                        // 8
		var msg = item;                                                                   // 9
		msg.msg = params + " \u252C\u2500\u252C \u30CE( \u309C-\u309C\u30CE)";            // 10
		Meteor.call('sendMessage', msg);                                                  // 11
	}                                                                                  // 12
}                                                                                   // 13
                                                                                    //
RocketChat.slashCommands.add('unflip', Unflip, {                                    // 15
	description: 'Slash_TableUnflip_Description',                                      // 16
	params: 'your_message_optional'                                                    // 17
});                                                                                 // 15
//////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:slashcommands-asciiarts/gimme.js");
require("./node_modules/meteor/rocketchat:slashcommands-asciiarts/lenny.js");
require("./node_modules/meteor/rocketchat:slashcommands-asciiarts/shrug.js");
require("./node_modules/meteor/rocketchat:slashcommands-asciiarts/tableflip.js");
require("./node_modules/meteor/rocketchat:slashcommands-asciiarts/unflip.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:slashcommands-asciiarts'] = {};

})();

//# sourceMappingURL=rocketchat_slashcommands-asciiarts.js.map

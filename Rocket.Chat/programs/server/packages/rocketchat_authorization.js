(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RocketChatTabBar = Package['rocketchat:lib'].RocketChatTabBar;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var meteorInstall = Package.modules.meteorInstall;
var process = Package.modules.process;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:authorization":{"lib":{"rocketchat.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/rocketchat_authorization/lib/rocketchat.js                                                      //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
RocketChat.authz = {};                                                                                      // 1
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"models":{"Permissions.js":function(require){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/rocketchat_authorization/server/models/Permissions.js                                           //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                     //
                                                                                                            //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                            //
                                                                                                            //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");               //
                                                                                                            //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                      //
                                                                                                            //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                 //
                                                                                                            //
var _inherits3 = _interopRequireDefault(_inherits2);                                                        //
                                                                                                            //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }           //
                                                                                                            //
var ModelPermissions = function (_RocketChat$models$_B) {                                                   //
	(0, _inherits3.default)(ModelPermissions, _RocketChat$models$_B);                                          //
                                                                                                            //
	function ModelPermissions() {                                                                              // 2
		(0, _classCallCheck3.default)(this, ModelPermissions);                                                    // 2
		return (0, _possibleConstructorReturn3.default)(this, _RocketChat$models$_B.apply(this, arguments));      // 2
	} // FIND                                                                                                  // 4
                                                                                                            //
                                                                                                            //
	ModelPermissions.prototype.findByRole = function () {                                                      //
		function findByRole(role, options) {                                                                      //
			var query = {                                                                                            // 8
				roles: role                                                                                             // 9
			};                                                                                                       // 8
			return this.find(query, options);                                                                        // 12
		}                                                                                                         // 13
                                                                                                            //
		return findByRole;                                                                                        //
	}();                                                                                                       //
                                                                                                            //
	ModelPermissions.prototype.findOneById = function () {                                                     //
		function findOneById(_id) {                                                                               //
			return this.findOne(_id);                                                                                // 16
		}                                                                                                         // 17
                                                                                                            //
		return findOneById;                                                                                       //
	}();                                                                                                       //
                                                                                                            //
	ModelPermissions.prototype.createOrUpdate = function () {                                                  //
		function createOrUpdate(name, roles) {                                                                    //
			this.upsert({                                                                                            // 20
				_id: name                                                                                               // 20
			}, {                                                                                                     // 20
				$set: {                                                                                                 // 20
					roles: roles                                                                                           // 20
				}                                                                                                       // 20
			});                                                                                                      // 20
		}                                                                                                         // 21
                                                                                                            //
		return createOrUpdate;                                                                                    //
	}();                                                                                                       //
                                                                                                            //
	ModelPermissions.prototype.addRole = function () {                                                         //
		function addRole(permission, role) {                                                                      //
			this.update({                                                                                            // 24
				_id: permission                                                                                         // 24
			}, {                                                                                                     // 24
				$addToSet: {                                                                                            // 24
					roles: role                                                                                            // 24
				}                                                                                                       // 24
			});                                                                                                      // 24
		}                                                                                                         // 25
                                                                                                            //
		return addRole;                                                                                           //
	}();                                                                                                       //
                                                                                                            //
	ModelPermissions.prototype.removeRole = function () {                                                      //
		function removeRole(permission, role) {                                                                   //
			this.update({                                                                                            // 28
				_id: permission                                                                                         // 28
			}, {                                                                                                     // 28
				$pull: {                                                                                                // 28
					roles: role                                                                                            // 28
				}                                                                                                       // 28
			});                                                                                                      // 28
		}                                                                                                         // 29
                                                                                                            //
		return removeRole;                                                                                        //
	}();                                                                                                       //
                                                                                                            //
	return ModelPermissions;                                                                                   //
}(RocketChat.models._Base);                                                                                 //
                                                                                                            //
RocketChat.models.Permissions = new ModelPermissions('permissions', true);                                  // 32
RocketChat.models.Permissions.cache.load();                                                                 // 33
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Roles.js":function(require){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/rocketchat_authorization/server/models/Roles.js                                                 //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                     //
                                                                                                            //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                            //
                                                                                                            //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");               //
                                                                                                            //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                      //
                                                                                                            //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                 //
                                                                                                            //
var _inherits3 = _interopRequireDefault(_inherits2);                                                        //
                                                                                                            //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }           //
                                                                                                            //
var ModelRoles = function (_RocketChat$models$_B) {                                                         //
	(0, _inherits3.default)(ModelRoles, _RocketChat$models$_B);                                                //
                                                                                                            //
	function ModelRoles() {                                                                                    // 2
		(0, _classCallCheck3.default)(this, ModelRoles);                                                          // 2
                                                                                                            //
		var _this = (0, _possibleConstructorReturn3.default)(this, _RocketChat$models$_B.apply(this, arguments));
                                                                                                            //
		_this.tryEnsureIndex({                                                                                    // 4
			'name': 1                                                                                                // 4
		});                                                                                                       // 4
                                                                                                            //
		_this.tryEnsureIndex({                                                                                    // 5
			'scope': 1                                                                                               // 5
		});                                                                                                       // 5
                                                                                                            //
		return _this;                                                                                             // 2
	}                                                                                                          // 6
                                                                                                            //
	ModelRoles.prototype.findUsersInRole = function () {                                                       //
		function findUsersInRole(name, scope, options) {                                                          //
			var role = this.findOne(name);                                                                           // 9
			var roleScope = role && role.scope || 'Users';                                                           // 10
			var model = RocketChat.models[roleScope];                                                                // 11
			return model && model.findUsersInRoles && model.findUsersInRoles(name, scope, options);                  // 13
		}                                                                                                         // 14
                                                                                                            //
		return findUsersInRole;                                                                                   //
	}();                                                                                                       //
                                                                                                            //
	ModelRoles.prototype.isUserInRoles = function () {                                                         //
		function isUserInRoles(userId, roles, scope) {                                                            //
			var _this2 = this;                                                                                       // 16
                                                                                                            //
			roles = [].concat(roles);                                                                                // 17
			return roles.some(function (roleName) {                                                                  // 18
				var role = _this2.findOne(roleName);                                                                    // 19
                                                                                                            //
				var roleScope = role && role.scope || 'Users';                                                          // 20
				var model = RocketChat.models[roleScope];                                                               // 21
				return model && model.isUserInRole && model.isUserInRole(userId, roleName, scope);                      // 23
			});                                                                                                      // 24
		}                                                                                                         // 25
                                                                                                            //
		return isUserInRoles;                                                                                     //
	}();                                                                                                       //
                                                                                                            //
	ModelRoles.prototype.createOrUpdate = function () {                                                        //
		function createOrUpdate(name) {                                                                           //
			var scope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Users';                 // 27
			var description = arguments[2];                                                                          // 27
			var protectedRole = arguments[3];                                                                        // 27
			var updateData = {};                                                                                     // 28
			updateData.name = name;                                                                                  // 29
			updateData.scope = scope;                                                                                // 30
                                                                                                            //
			if (description != null) {                                                                               // 32
				updateData.description = description;                                                                   // 33
			}                                                                                                        // 34
                                                                                                            //
			if (protectedRole) {                                                                                     // 36
				updateData.protected = protectedRole;                                                                   // 37
			}                                                                                                        // 38
                                                                                                            //
			this.upsert({                                                                                            // 40
				_id: name                                                                                               // 40
			}, {                                                                                                     // 40
				$set: updateData                                                                                        // 40
			});                                                                                                      // 40
		}                                                                                                         // 41
                                                                                                            //
		return createOrUpdate;                                                                                    //
	}();                                                                                                       //
                                                                                                            //
	ModelRoles.prototype.addUserRoles = function () {                                                          //
		function addUserRoles(userId, roles, scope) {                                                             //
			roles = [].concat(roles);                                                                                // 44
                                                                                                            //
			for (var _iterator = roles, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
				var _ref;                                                                                               // 45
                                                                                                            //
				if (_isArray) {                                                                                         // 45
					if (_i >= _iterator.length) break;                                                                     // 45
					_ref = _iterator[_i++];                                                                                // 45
				} else {                                                                                                // 45
					_i = _iterator.next();                                                                                 // 45
					if (_i.done) break;                                                                                    // 45
					_ref = _i.value;                                                                                       // 45
				}                                                                                                       // 45
                                                                                                            //
				var roleName = _ref;                                                                                    // 45
				var role = this.findOne(roleName);                                                                      // 46
				var roleScope = role && role.scope || 'Users';                                                          // 47
				var model = RocketChat.models[roleScope];                                                               // 48
				model && model.addRolesByUserId && model.addRolesByUserId(userId, roleName, scope);                     // 50
			}                                                                                                        // 51
                                                                                                            //
			return true;                                                                                             // 52
		}                                                                                                         // 53
                                                                                                            //
		return addUserRoles;                                                                                      //
	}();                                                                                                       //
                                                                                                            //
	ModelRoles.prototype.removeUserRoles = function () {                                                       //
		function removeUserRoles(userId, roles, scope) {                                                          //
			roles = [].concat(roles);                                                                                // 56
                                                                                                            //
			for (var _iterator2 = roles, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
				var _ref2;                                                                                              // 57
                                                                                                            //
				if (_isArray2) {                                                                                        // 57
					if (_i2 >= _iterator2.length) break;                                                                   // 57
					_ref2 = _iterator2[_i2++];                                                                             // 57
				} else {                                                                                                // 57
					_i2 = _iterator2.next();                                                                               // 57
					if (_i2.done) break;                                                                                   // 57
					_ref2 = _i2.value;                                                                                     // 57
				}                                                                                                       // 57
                                                                                                            //
				var roleName = _ref2;                                                                                   // 57
				var role = this.findOne(roleName);                                                                      // 58
				var roleScope = role && role.scope || 'Users';                                                          // 59
				var model = RocketChat.models[roleScope];                                                               // 60
				model && model.removeRolesByUserId && model.removeRolesByUserId(userId, roleName, scope);               // 62
			}                                                                                                        // 63
                                                                                                            //
			return true;                                                                                             // 64
		}                                                                                                         // 65
                                                                                                            //
		return removeUserRoles;                                                                                   //
	}();                                                                                                       //
                                                                                                            //
	return ModelRoles;                                                                                         //
}(RocketChat.models._Base);                                                                                 //
                                                                                                            //
RocketChat.models.Roles = new ModelRoles('roles', true);                                                    // 68
RocketChat.models.Roles.cache.load();                                                                       // 69
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Base.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/rocketchat_authorization/server/models/Base.js                                                  //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
RocketChat.models._Base.prototype.roleBaseQuery = function () /*userId, scope*/{                            // 1
	return;                                                                                                    // 2
};                                                                                                          // 3
                                                                                                            //
RocketChat.models._Base.prototype.findRolesByUserId = function (userId /*, options*/) {                     // 5
	var query = this.roleBaseQuery(userId);                                                                    // 6
	return this.find(query, {                                                                                  // 7
		fields: {                                                                                                 // 7
			roles: 1                                                                                                 // 7
		}                                                                                                         // 7
	});                                                                                                        // 7
};                                                                                                          // 8
                                                                                                            //
RocketChat.models._Base.prototype.isUserInRole = function (userId, roleName, scope) {                       // 10
	var query = this.roleBaseQuery(userId, scope);                                                             // 11
                                                                                                            //
	if (query == null) {                                                                                       // 13
		return false;                                                                                             // 14
	}                                                                                                          // 15
                                                                                                            //
	query.roles = roleName;                                                                                    // 17
	return !_.isUndefined(this.findOne(query));                                                                // 18
};                                                                                                          // 19
                                                                                                            //
RocketChat.models._Base.prototype.addRolesByUserId = function (userId, roles, scope) {                      // 21
	roles = [].concat(roles);                                                                                  // 22
	var query = this.roleBaseQuery(userId, scope);                                                             // 23
	var update = {                                                                                             // 24
		$addToSet: {                                                                                              // 25
			roles: {                                                                                                 // 26
				$each: roles                                                                                            // 26
			}                                                                                                        // 26
		}                                                                                                         // 25
	};                                                                                                         // 24
	return this.update(query, update);                                                                         // 29
};                                                                                                          // 30
                                                                                                            //
RocketChat.models._Base.prototype.removeRolesByUserId = function (userId, roles, scope) {                   // 32
	roles = [].concat(roles);                                                                                  // 33
	var query = this.roleBaseQuery(userId, scope);                                                             // 34
	var update = {                                                                                             // 35
		$pullAll: {                                                                                               // 36
			roles: roles                                                                                             // 37
		}                                                                                                         // 36
	};                                                                                                         // 35
	return this.update(query, update);                                                                         // 40
};                                                                                                          // 41
                                                                                                            //
RocketChat.models._Base.prototype.findUsersInRoles = function () {                                          // 43
	throw new Meteor.Error('overwrite-function', 'You must overwrite this function in the extended classes');  // 44
};                                                                                                          // 45
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Users.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/rocketchat_authorization/server/models/Users.js                                                 //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
RocketChat.models.Users.roleBaseQuery = function (userId) {                                                 // 1
	return {                                                                                                   // 2
		_id: userId                                                                                               // 2
	};                                                                                                         // 2
};                                                                                                          // 3
                                                                                                            //
RocketChat.models.Users.findUsersInRoles = function (roles, scope, options) {                               // 5
	roles = [].concat(roles);                                                                                  // 6
	var query = {                                                                                              // 8
		roles: {                                                                                                  // 9
			$in: roles                                                                                               // 9
		}                                                                                                         // 9
	};                                                                                                         // 8
	return this.find(query, options);                                                                          // 12
};                                                                                                          // 13
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Subscriptions.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/rocketchat_authorization/server/models/Subscriptions.js                                         //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
RocketChat.models.Subscriptions.roleBaseQuery = function (userId, scope) {                                  // 1
	if (scope == null) {                                                                                       // 2
		return;                                                                                                   // 3
	}                                                                                                          // 4
                                                                                                            //
	var query = {                                                                                              // 6
		'u._id': userId                                                                                           // 6
	};                                                                                                         // 6
                                                                                                            //
	if (!_.isUndefined(scope)) {                                                                               // 7
		query.rid = scope;                                                                                        // 8
	}                                                                                                          // 9
                                                                                                            //
	return query;                                                                                              // 10
};                                                                                                          // 11
                                                                                                            //
RocketChat.models.Subscriptions.findUsersInRoles = function (roles, scope, options) {                       // 13
	roles = [].concat(roles);                                                                                  // 14
	var query = {                                                                                              // 16
		roles: {                                                                                                  // 17
			$in: roles                                                                                               // 17
		}                                                                                                         // 17
	};                                                                                                         // 16
                                                                                                            //
	if (scope) {                                                                                               // 20
		query.rid = scope;                                                                                        // 21
	}                                                                                                          // 22
                                                                                                            //
	var subscriptions = this.find(query).fetch();                                                              // 24
                                                                                                            //
	var users = _.compact(_.map(subscriptions, function (subscription) {                                       // 26
		if ('undefined' !== typeof subscription.u && 'undefined' !== typeof subscription.u._id) {                 // 27
			return subscription.u._id;                                                                               // 28
		}                                                                                                         // 29
	}));                                                                                                       // 30
                                                                                                            //
	return RocketChat.models.Users.find({                                                                      // 32
		_id: {                                                                                                    // 32
			$in: users                                                                                               // 32
		}                                                                                                         // 32
	}, options);                                                                                               // 32
};                                                                                                          // 33
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"functions":{"addUserRoles.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/rocketchat_authorization/server/functions/addUserRoles.js                                       //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
RocketChat.authz.addUserRoles = function (userId, roleNames, scope) {                                       // 1
	if (!userId || !roleNames) {                                                                               // 2
		return false;                                                                                             // 3
	}                                                                                                          // 4
                                                                                                            //
	var user = RocketChat.models.Users.db.findOneById(userId);                                                 // 6
                                                                                                            //
	if (!user) {                                                                                               // 7
		throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                            // 8
			"function": 'RocketChat.authz.addUserRoles'                                                              // 9
		});                                                                                                       // 8
	}                                                                                                          // 11
                                                                                                            //
	roleNames = [].concat(roleNames);                                                                          // 13
                                                                                                            //
	var existingRoleNames = _.pluck(RocketChat.authz.getRoles(), '_id');                                       // 14
                                                                                                            //
	var invalidRoleNames = _.difference(roleNames, existingRoleNames);                                         // 15
                                                                                                            //
	if (!_.isEmpty(invalidRoleNames)) {                                                                        // 17
		for (var _iterator = invalidRoleNames, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
			var _ref;                                                                                                // 18
                                                                                                            //
			if (_isArray) {                                                                                          // 18
				if (_i >= _iterator.length) break;                                                                      // 18
				_ref = _iterator[_i++];                                                                                 // 18
			} else {                                                                                                 // 18
				_i = _iterator.next();                                                                                  // 18
				if (_i.done) break;                                                                                     // 18
				_ref = _i.value;                                                                                        // 18
			}                                                                                                        // 18
                                                                                                            //
			var role = _ref;                                                                                         // 18
			RocketChat.models.Roles.createOrUpdate(role);                                                            // 19
		}                                                                                                         // 20
	}                                                                                                          // 21
                                                                                                            //
	RocketChat.models.Roles.addUserRoles(userId, roleNames, scope);                                            // 23
	return true;                                                                                               // 25
};                                                                                                          // 26
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"canAccessRoom.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/rocketchat_authorization/server/functions/canAccessRoom.js                                      //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
/* globals RocketChat */RocketChat.authz.roomAccessValidators = [function (room) {                          // 1
	var user = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};                         // 3
                                                                                                            //
	if (room.t === 'c') {                                                                                      // 4
		if (!user._id && RocketChat.settings.get('Accounts_AllowAnonymousRead') === true) {                       // 5
			return true;                                                                                             // 6
		}                                                                                                         // 7
                                                                                                            //
		return RocketChat.authz.hasPermission(user._id, 'view-c-room');                                           // 9
	}                                                                                                          // 10
}, function (room) {                                                                                        // 11
	var user = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};                         // 12
	var subscription = RocketChat.models.Subscriptions.findOneByRoomIdAndUserId(room._id, user._id);           // 13
                                                                                                            //
	if (subscription) {                                                                                        // 14
		return subscription._room;                                                                                // 15
	}                                                                                                          // 16
}];                                                                                                         // 17
                                                                                                            //
RocketChat.authz.canAccessRoom = function (room, user) {                                                    // 20
	var _this = this;                                                                                          // 20
                                                                                                            //
	return RocketChat.authz.roomAccessValidators.some(function (validator) {                                   // 21
		return validator.call(_this, room, user);                                                                 // 22
	});                                                                                                        // 23
};                                                                                                          // 24
                                                                                                            //
RocketChat.authz.addRoomAccessValidator = function (validator) {                                            // 26
	RocketChat.authz.roomAccessValidators.push(validator);                                                     // 27
};                                                                                                          // 28
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getRoles.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/rocketchat_authorization/server/functions/getRoles.js                                           //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
RocketChat.authz.getRoles = function () {                                                                   // 1
	return RocketChat.models.Roles.find().fetch();                                                             // 2
};                                                                                                          // 3
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getUsersInRole.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/rocketchat_authorization/server/functions/getUsersInRole.js                                     //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
RocketChat.authz.getUsersInRole = function (roleName, scope, options) {                                     // 1
	return RocketChat.models.Roles.findUsersInRole(roleName, scope, options);                                  // 2
};                                                                                                          // 3
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"hasPermission.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/rocketchat_authorization/server/functions/hasPermission.js                                      //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
function atLeastOne(userId) {                                                                               // 1
	var permissions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];                  // 1
	var scope = arguments[2];                                                                                  // 1
	return permissions.some(function (permissionId) {                                                          // 2
		var permission = RocketChat.models.Permissions.findOne(permissionId);                                     // 3
		return RocketChat.models.Roles.isUserInRoles(userId, permission.roles, scope);                            // 4
	});                                                                                                        // 5
}                                                                                                           // 6
                                                                                                            //
function all(userId) {                                                                                      // 8
	var permissions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];                  // 8
	var scope = arguments[2];                                                                                  // 8
	return permissions.every(function (permissionId) {                                                         // 9
		var permission = RocketChat.models.Permissions.findOne(permissionId);                                     // 10
		return RocketChat.models.Roles.isUserInRoles(userId, permission.roles, scope);                            // 11
	});                                                                                                        // 12
}                                                                                                           // 13
                                                                                                            //
function hasPermission(userId, permissions, scope, strategy) {                                              // 15
	if (!userId) {                                                                                             // 16
		return false;                                                                                             // 17
	}                                                                                                          // 18
                                                                                                            //
	permissions = [].concat(permissions);                                                                      // 20
	return strategy(userId, permissions, scope);                                                               // 21
}                                                                                                           // 22
                                                                                                            //
RocketChat.authz.hasAllPermission = function (userId, permissions, scope) {                                 // 24
	return hasPermission(userId, permissions, scope, all);                                                     // 25
};                                                                                                          // 26
                                                                                                            //
RocketChat.authz.hasPermission = RocketChat.authz.hasAllPermission;                                         // 28
                                                                                                            //
RocketChat.authz.hasAtLeastOnePermission = function (userId, permissions, scope) {                          // 30
	return hasPermission(userId, permissions, scope, atLeastOne);                                              // 31
};                                                                                                          // 32
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"hasRole.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/rocketchat_authorization/server/functions/hasRole.js                                            //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
RocketChat.authz.hasRole = function (userId, roleNames, scope) {                                            // 1
	roleNames = [].concat(roleNames);                                                                          // 2
	return RocketChat.models.Roles.isUserInRoles(userId, roleNames, scope);                                    // 3
};                                                                                                          // 4
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"removeUserFromRoles.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/rocketchat_authorization/server/functions/removeUserFromRoles.js                                //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
RocketChat.authz.removeUserFromRoles = function (userId, roleNames, scope) {                                // 1
	if (!userId || !roleNames) {                                                                               // 2
		return false;                                                                                             // 3
	}                                                                                                          // 4
                                                                                                            //
	var user = RocketChat.models.Users.findOneById(userId);                                                    // 6
                                                                                                            //
	if (!user) {                                                                                               // 8
		throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                            // 9
			"function": 'RocketChat.authz.removeUserFromRoles'                                                       // 10
		});                                                                                                       // 9
	}                                                                                                          // 12
                                                                                                            //
	roleNames = [].concat(roleNames);                                                                          // 14
                                                                                                            //
	var existingRoleNames = _.pluck(RocketChat.authz.getRoles(), '_id');                                       // 15
                                                                                                            //
	var invalidRoleNames = _.difference(roleNames, existingRoleNames);                                         // 16
                                                                                                            //
	if (!_.isEmpty(invalidRoleNames)) {                                                                        // 18
		throw new Meteor.Error('error-invalid-role', 'Invalid role', {                                            // 19
			"function": 'RocketChat.authz.removeUserFromRoles'                                                       // 20
		});                                                                                                       // 19
	}                                                                                                          // 22
                                                                                                            //
	RocketChat.models.Roles.removeUserRoles(userId, roleNames, scope);                                         // 24
	return true;                                                                                               // 26
};                                                                                                          // 27
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"publications":{"permissions.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/rocketchat_authorization/server/publications/permissions.js                                     //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
Meteor.methods({                                                                                            // 1
	'permissions/get': function (updatedAt) {                                                                  // 2
		this.unblock();                                                                                           // 3
		var records = RocketChat.models.Permissions.find().fetch();                                               // 5
                                                                                                            //
		if (updatedAt instanceof Date) {                                                                          // 7
			return {                                                                                                 // 8
				update: records.filter(function (record) {                                                              // 9
					return record._updatedAt > updatedAt;                                                                  // 10
				}),                                                                                                     // 11
				remove: RocketChat.models.Permissions.trashFindDeletedAfter(updatedAt, {}, {                            // 12
					fields: {                                                                                              // 12
						_id: 1,                                                                                               // 12
						_deletedAt: 1                                                                                         // 12
					}                                                                                                      // 12
				}).fetch()                                                                                              // 12
			};                                                                                                       // 8
		}                                                                                                         // 14
                                                                                                            //
		return records;                                                                                           // 16
	}                                                                                                          // 17
});                                                                                                         // 1
RocketChat.models.Permissions.on('changed', function (type, permission) {                                   // 21
	RocketChat.Notifications.notifyLoggedInThisInstance('permissions-changed', type, permission);              // 22
});                                                                                                         // 23
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"roles.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/rocketchat_authorization/server/publications/roles.js                                           //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
Meteor.publish('roles', function () {                                                                       // 1
	if (!this.userId) {                                                                                        // 2
		return this.ready();                                                                                      // 3
	}                                                                                                          // 4
                                                                                                            //
	return RocketChat.models.Roles.find();                                                                     // 6
});                                                                                                         // 7
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"usersInRole.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/rocketchat_authorization/server/publications/usersInRole.js                                     //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
Meteor.publish('usersInRole', function (roleName, scope) {                                                  // 1
	var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 50;                        // 1
                                                                                                            //
	if (!this.userId) {                                                                                        // 2
		return this.ready();                                                                                      // 3
	}                                                                                                          // 4
                                                                                                            //
	if (!RocketChat.authz.hasPermission(this.userId, 'access-permissions')) {                                  // 6
		return this.error(new Meteor.Error('error-not-allowed', 'Not allowed', {                                  // 7
			publish: 'usersInRole'                                                                                   // 8
		}));                                                                                                      // 7
	}                                                                                                          // 10
                                                                                                            //
	var options = {                                                                                            // 12
		limit: limit,                                                                                             // 13
		sort: {                                                                                                   // 14
			name: 1                                                                                                  // 15
		}                                                                                                         // 14
	};                                                                                                         // 12
	return RocketChat.authz.getUsersInRole(roleName, scope, options);                                          // 19
});                                                                                                         // 20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods":{"addUserToRole.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/rocketchat_authorization/server/methods/addUserToRole.js                                        //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
Meteor.methods({                                                                                            // 1
	'authorization:addUserToRole': function (roleName, username, scope) {                                      // 2
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'access-permissions')) {         // 3
			throw new Meteor.Error('error-action-not-allowed', 'Accessing permissions is not allowed', {             // 4
				method: 'authorization:addUserToRole',                                                                  // 5
				action: 'Accessing_permissions'                                                                         // 6
			});                                                                                                      // 4
		}                                                                                                         // 8
                                                                                                            //
		if (!roleName || !_.isString(roleName) || !username || !_.isString(username)) {                           // 10
			throw new Meteor.Error('error-invalid-arguments', 'Invalid arguments', {                                 // 11
				method: 'authorization:addUserToRole'                                                                   // 12
			});                                                                                                      // 11
		}                                                                                                         // 14
                                                                                                            //
		if (roleName === 'admin' && !RocketChat.authz.hasPermission(Meteor.userId(), 'assign-admin-role')) {      // 16
			throw new Meteor.Error('error-action-not-allowed', 'Assigning admin is not allowed', {                   // 17
				method: 'authorization:addUserToRole',                                                                  // 18
				action: 'Assign_admin'                                                                                  // 19
			});                                                                                                      // 17
		}                                                                                                         // 21
                                                                                                            //
		var user = RocketChat.models.Users.findOneByUsername(username, {                                          // 23
			fields: {                                                                                                // 24
				_id: 1                                                                                                  // 25
			}                                                                                                        // 24
		});                                                                                                       // 23
                                                                                                            //
		if (!user || !user._id) {                                                                                 // 29
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                           // 30
				method: 'authorization:addUserToRole'                                                                   // 31
			});                                                                                                      // 30
		}                                                                                                         // 33
                                                                                                            //
		var add = RocketChat.models.Roles.addUserRoles(user._id, roleName, scope);                                // 35
                                                                                                            //
		if (RocketChat.settings.get('UI_DisplayRoles')) {                                                         // 37
			RocketChat.Notifications.notifyLogged('roles-change', {                                                  // 38
				type: 'added',                                                                                          // 39
				_id: roleName,                                                                                          // 40
				u: {                                                                                                    // 41
					_id: user._id,                                                                                         // 42
					username: username                                                                                     // 43
				},                                                                                                      // 41
				scope: scope                                                                                            // 45
			});                                                                                                      // 38
		}                                                                                                         // 47
                                                                                                            //
		return add;                                                                                               // 49
	}                                                                                                          // 50
});                                                                                                         // 1
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"deleteRole.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/rocketchat_authorization/server/methods/deleteRole.js                                           //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
Meteor.methods({                                                                                            // 1
	'authorization:deleteRole': function (roleName) {                                                          // 2
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'access-permissions')) {         // 3
			throw new Meteor.Error('error-action-not-allowed', 'Accessing permissions is not allowed', {             // 4
				method: 'authorization:deleteRole',                                                                     // 5
				action: 'Accessing_permissions'                                                                         // 6
			});                                                                                                      // 4
		}                                                                                                         // 8
                                                                                                            //
		var role = RocketChat.models.Roles.findOne(roleName);                                                     // 10
                                                                                                            //
		if (!role) {                                                                                              // 11
			throw new Meteor.Error('error-invalid-role', 'Invalid role', {                                           // 12
				method: 'authorization:deleteRole'                                                                      // 13
			});                                                                                                      // 12
		}                                                                                                         // 15
                                                                                                            //
		if (role.protected) {                                                                                     // 17
			throw new Meteor.Error('error-delete-protected-role', 'Cannot delete a protected role', {                // 18
				method: 'authorization:deleteRole'                                                                      // 19
			});                                                                                                      // 18
		}                                                                                                         // 21
                                                                                                            //
		var roleScope = role.scope || 'Users';                                                                    // 23
		var model = RocketChat.models[roleScope];                                                                 // 24
		var existingUsers = model && model.findUsersInRoles && model.findUsersInRoles(roleName);                  // 25
                                                                                                            //
		if (existingUsers && existingUsers.count() > 0) {                                                         // 27
			throw new Meteor.Error('error-role-in-use', 'Cannot delete role because it\'s in use', {                 // 28
				method: 'authorization:deleteRole'                                                                      // 29
			});                                                                                                      // 28
		}                                                                                                         // 31
                                                                                                            //
		return RocketChat.models.Roles.remove(role.name);                                                         // 33
	}                                                                                                          // 34
});                                                                                                         // 1
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"removeUserFromRole.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/rocketchat_authorization/server/methods/removeUserFromRole.js                                   //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
Meteor.methods({                                                                                            // 1
	'authorization:removeUserFromRole': function (roleName, username, scope) {                                 // 2
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'access-permissions')) {         // 3
			throw new Meteor.Error('error-action-not-allowed', 'Access permissions is not allowed', {                // 4
				method: 'authorization:removeUserFromRole',                                                             // 5
				action: 'Accessing_permissions'                                                                         // 6
			});                                                                                                      // 4
		}                                                                                                         // 8
                                                                                                            //
		if (!roleName || !_.isString(roleName) || !username || !_.isString(username)) {                           // 10
			throw new Meteor.Error('error-invalid-arguments', 'Invalid arguments', {                                 // 11
				method: 'authorization:removeUserFromRole'                                                              // 12
			});                                                                                                      // 11
		}                                                                                                         // 14
                                                                                                            //
		var user = Meteor.users.findOne({                                                                         // 16
			username: username                                                                                       // 17
		}, {                                                                                                      // 16
			fields: {                                                                                                // 19
				_id: 1,                                                                                                 // 20
				roles: 1                                                                                                // 21
			}                                                                                                        // 19
		});                                                                                                       // 18
                                                                                                            //
		if (!user || !user._id) {                                                                                 // 25
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                           // 26
				method: 'authorization:removeUserFromRole'                                                              // 27
			});                                                                                                      // 26
		} // prevent removing last user from admin role                                                           // 29
                                                                                                            //
                                                                                                            //
		if (roleName === 'admin') {                                                                               // 32
			var adminCount = Meteor.users.find({                                                                     // 33
				roles: {                                                                                                // 34
					$in: ['admin']                                                                                         // 35
				}                                                                                                       // 34
			}).count();                                                                                              // 33
			var userIsAdmin = user.roles.indexOf('admin') > -1;                                                      // 39
                                                                                                            //
			if (adminCount === 1 && userIsAdmin) {                                                                   // 40
				throw new Meteor.Error('error-action-not-allowed', 'Leaving the app without admins is not allowed', {   // 41
					method: 'removeUserFromRole',                                                                          // 42
					action: 'Remove_last_admin'                                                                            // 43
				});                                                                                                     // 41
			}                                                                                                        // 45
		}                                                                                                         // 46
                                                                                                            //
		var remove = RocketChat.models.Roles.removeUserRoles(user._id, roleName, scope);                          // 48
                                                                                                            //
		if (RocketChat.settings.get('UI_DisplayRoles')) {                                                         // 49
			RocketChat.Notifications.notifyLogged('roles-change', {                                                  // 50
				type: 'removed',                                                                                        // 51
				_id: roleName,                                                                                          // 52
				u: {                                                                                                    // 53
					_id: user._id,                                                                                         // 54
					username: username                                                                                     // 55
				},                                                                                                      // 53
				scope: scope                                                                                            // 57
			});                                                                                                      // 50
		}                                                                                                         // 59
                                                                                                            //
		return remove;                                                                                            // 61
	}                                                                                                          // 62
});                                                                                                         // 1
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"saveRole.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/rocketchat_authorization/server/methods/saveRole.js                                             //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
Meteor.methods({                                                                                            // 1
	'authorization:saveRole': function (roleData) {                                                            // 2
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'access-permissions')) {         // 3
			throw new Meteor.Error('error-action-not-allowed', 'Accessing permissions is not allowed', {             // 4
				method: 'authorization:saveRole',                                                                       // 5
				action: 'Accessing_permissions'                                                                         // 6
			});                                                                                                      // 4
		}                                                                                                         // 8
                                                                                                            //
		if (!roleData.name) {                                                                                     // 10
			throw new Meteor.Error('error-role-name-required', 'Role name is required', {                            // 11
				method: 'authorization:saveRole'                                                                        // 12
			});                                                                                                      // 11
		}                                                                                                         // 14
                                                                                                            //
		if (['Users', 'Subscriptions'].includes(roleData.scope) === false) {                                      // 16
			roleData.scope = 'Users';                                                                                // 17
		}                                                                                                         // 18
                                                                                                            //
		var update = RocketChat.models.Roles.createOrUpdate(roleData.name, roleData.scope, roleData.description);
                                                                                                            //
		if (RocketChat.settings.get('UI_DisplayRoles')) {                                                         // 21
			RocketChat.Notifications.notifyLogged('roles-change', {                                                  // 22
				type: 'changed',                                                                                        // 23
				_id: roleData.name                                                                                      // 24
			});                                                                                                      // 22
		}                                                                                                         // 26
                                                                                                            //
		return update;                                                                                            // 28
	}                                                                                                          // 29
});                                                                                                         // 1
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"addPermissionToRole.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/rocketchat_authorization/server/methods/addPermissionToRole.js                                  //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
Meteor.methods({                                                                                            // 1
	'authorization:addPermissionToRole': function (permission, role) {                                         // 2
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'access-permissions')) {         // 3
			throw new Meteor.Error('error-action-not-allowed', 'Adding permission is not allowed', {                 // 4
				method: 'authorization:addPermissionToRole',                                                            // 5
				action: 'Adding_permission'                                                                             // 6
			});                                                                                                      // 4
		}                                                                                                         // 8
                                                                                                            //
		return RocketChat.models.Permissions.addRole(permission, role);                                           // 10
	}                                                                                                          // 11
});                                                                                                         // 1
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"removeRoleFromPermission.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/rocketchat_authorization/server/methods/removeRoleFromPermission.js                             //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
Meteor.methods({                                                                                            // 1
	'authorization:removeRoleFromPermission': function (permission, role) {                                    // 2
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'access-permissions')) {         // 3
			throw new Meteor.Error('error-action-not-allowed', 'Accessing permissions is not allowed', {             // 4
				method: 'authorization:removeRoleFromPermission',                                                       // 5
				action: 'Accessing_permissions'                                                                         // 6
			});                                                                                                      // 4
		}                                                                                                         // 8
                                                                                                            //
		return RocketChat.models.Permissions.removeRole(permission, role);                                        // 10
	}                                                                                                          // 11
});                                                                                                         // 1
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"startup.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/rocketchat_authorization/server/startup.js                                                      //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
/* eslint no-multi-spaces: 0 */Meteor.startup(function () {                                                 // 1
	// Note:                                                                                                   // 4
	// 1.if we need to create a role that can only edit channel message, but not edit group message            // 5
	// then we can define edit-<type>-message instead of edit-message                                          // 6
	// 2. admin, moderator, and user roles should not be deleted as they are referened in the code.            // 7
	var permissions = [{                                                                                       // 8
		_id: 'access-permissions',                                                                                // 9
		roles: ['admin']                                                                                          // 9
	}, {                                                                                                       // 9
		_id: 'add-oauth-service',                                                                                 // 10
		roles: ['admin']                                                                                          // 10
	}, {                                                                                                       // 10
		_id: 'add-user-to-joined-room',                                                                           // 11
		roles: ['admin', 'owner', 'moderator']                                                                    // 11
	}, {                                                                                                       // 11
		_id: 'add-user-to-any-c-room',                                                                            // 12
		roles: ['admin']                                                                                          // 12
	}, {                                                                                                       // 12
		_id: 'add-user-to-any-p-room',                                                                            // 13
		roles: []                                                                                                 // 13
	}, {                                                                                                       // 13
		_id: 'archive-room',                                                                                      // 14
		roles: ['admin', 'owner']                                                                                 // 14
	}, {                                                                                                       // 14
		_id: 'assign-admin-role',                                                                                 // 15
		roles: ['admin']                                                                                          // 15
	}, {                                                                                                       // 15
		_id: 'ban-user',                                                                                          // 16
		roles: ['admin', 'owner', 'moderator']                                                                    // 16
	}, {                                                                                                       // 16
		_id: 'bulk-create-c',                                                                                     // 17
		roles: ['admin']                                                                                          // 17
	}, {                                                                                                       // 17
		_id: 'bulk-register-user',                                                                                // 18
		roles: ['admin']                                                                                          // 18
	}, {                                                                                                       // 18
		_id: 'create-c',                                                                                          // 19
		roles: ['admin', 'user', 'bot']                                                                           // 19
	}, {                                                                                                       // 19
		_id: 'create-d',                                                                                          // 20
		roles: ['admin', 'user', 'bot']                                                                           // 20
	}, {                                                                                                       // 20
		_id: 'create-p',                                                                                          // 21
		roles: ['admin', 'user', 'bot']                                                                           // 21
	}, {                                                                                                       // 21
		_id: 'create-user',                                                                                       // 22
		roles: ['admin']                                                                                          // 22
	}, {                                                                                                       // 22
		_id: 'clean-channel-history',                                                                             // 23
		roles: ['admin']                                                                                          // 23
	}, // special permission to bulk delete a channel's mesages                                                // 23
	{                                                                                                          // 24
		_id: 'delete-c',                                                                                          // 24
		roles: ['admin']                                                                                          // 24
	}, {                                                                                                       // 24
		_id: 'delete-d',                                                                                          // 25
		roles: ['admin']                                                                                          // 25
	}, {                                                                                                       // 25
		_id: 'delete-message',                                                                                    // 26
		roles: ['admin', 'owner', 'moderator']                                                                    // 26
	}, {                                                                                                       // 26
		_id: 'delete-p',                                                                                          // 27
		roles: ['admin']                                                                                          // 27
	}, {                                                                                                       // 27
		_id: 'delete-user',                                                                                       // 28
		roles: ['admin']                                                                                          // 28
	}, {                                                                                                       // 28
		_id: 'edit-message',                                                                                      // 29
		roles: ['admin', 'owner', 'moderator']                                                                    // 29
	}, {                                                                                                       // 29
		_id: 'edit-other-user-active-status',                                                                     // 30
		roles: ['admin']                                                                                          // 30
	}, {                                                                                                       // 30
		_id: 'edit-other-user-info',                                                                              // 31
		roles: ['admin']                                                                                          // 31
	}, {                                                                                                       // 31
		_id: 'edit-other-user-password',                                                                          // 32
		roles: ['admin']                                                                                          // 32
	}, {                                                                                                       // 32
		_id: 'edit-privileged-setting',                                                                           // 33
		roles: ['admin']                                                                                          // 33
	}, {                                                                                                       // 33
		_id: 'edit-room',                                                                                         // 34
		roles: ['admin', 'owner', 'moderator']                                                                    // 34
	}, {                                                                                                       // 34
		_id: 'force-delete-message',                                                                              // 35
		roles: ['admin', 'owner']                                                                                 // 35
	}, {                                                                                                       // 35
		_id: 'join-without-join-code',                                                                            // 36
		roles: ['admin', 'bot']                                                                                   // 36
	}, {                                                                                                       // 36
		_id: 'manage-assets',                                                                                     // 37
		roles: ['admin']                                                                                          // 37
	}, {                                                                                                       // 37
		_id: 'manage-emoji',                                                                                      // 38
		roles: ['admin']                                                                                          // 38
	}, {                                                                                                       // 38
		_id: 'manage-integrations',                                                                               // 39
		roles: ['admin']                                                                                          // 39
	}, {                                                                                                       // 39
		_id: 'manage-own-integrations',                                                                           // 40
		roles: ['admin', 'bot']                                                                                   // 40
	}, {                                                                                                       // 40
		_id: 'manage-oauth-apps',                                                                                 // 41
		roles: ['admin']                                                                                          // 41
	}, {                                                                                                       // 41
		_id: 'mention-all',                                                                                       // 42
		roles: ['admin', 'owner', 'moderator', 'user']                                                            // 42
	}, {                                                                                                       // 42
		_id: 'mute-user',                                                                                         // 43
		roles: ['admin', 'owner', 'moderator']                                                                    // 43
	}, {                                                                                                       // 43
		_id: 'remove-user',                                                                                       // 44
		roles: ['admin', 'owner', 'moderator']                                                                    // 44
	}, {                                                                                                       // 44
		_id: 'run-import',                                                                                        // 45
		roles: ['admin']                                                                                          // 45
	}, {                                                                                                       // 45
		_id: 'run-migration',                                                                                     // 46
		roles: ['admin']                                                                                          // 46
	}, {                                                                                                       // 46
		_id: 'set-moderator',                                                                                     // 47
		roles: ['admin', 'owner']                                                                                 // 47
	}, {                                                                                                       // 47
		_id: 'set-owner',                                                                                         // 48
		roles: ['admin', 'owner']                                                                                 // 48
	}, {                                                                                                       // 48
		_id: 'send-many-messages',                                                                                // 49
		roles: ['admin', 'bot']                                                                                   // 49
	}, {                                                                                                       // 49
		_id: 'set-leader',                                                                                        // 50
		roles: ['admin', 'owner']                                                                                 // 50
	}, {                                                                                                       // 50
		_id: 'unarchive-room',                                                                                    // 51
		roles: ['admin']                                                                                          // 51
	}, {                                                                                                       // 51
		_id: 'view-c-room',                                                                                       // 52
		roles: ['admin', 'user', 'bot', 'anonymous']                                                              // 52
	}, {                                                                                                       // 52
		_id: 'user-generate-access-token',                                                                        // 53
		roles: ['admin']                                                                                          // 53
	}, {                                                                                                       // 53
		_id: 'view-d-room',                                                                                       // 54
		roles: ['admin', 'user', 'bot']                                                                           // 54
	}, {                                                                                                       // 54
		_id: 'view-full-other-user-info',                                                                         // 55
		roles: ['admin']                                                                                          // 55
	}, {                                                                                                       // 55
		_id: 'view-history',                                                                                      // 56
		roles: ['admin', 'user', 'anonymous']                                                                     // 56
	}, {                                                                                                       // 56
		_id: 'view-joined-room',                                                                                  // 57
		roles: ['guest', 'bot', 'anonymous']                                                                      // 57
	}, {                                                                                                       // 57
		_id: 'view-join-code',                                                                                    // 58
		roles: ['admin']                                                                                          // 58
	}, {                                                                                                       // 58
		_id: 'view-logs',                                                                                         // 59
		roles: ['admin']                                                                                          // 59
	}, {                                                                                                       // 59
		_id: 'view-other-user-channels',                                                                          // 60
		roles: ['admin']                                                                                          // 60
	}, {                                                                                                       // 60
		_id: 'view-p-room',                                                                                       // 61
		roles: ['admin', 'user', 'anonymous']                                                                     // 61
	}, {                                                                                                       // 61
		_id: 'view-privileged-setting',                                                                           // 62
		roles: ['admin']                                                                                          // 62
	}, {                                                                                                       // 62
		_id: 'view-room-administration',                                                                          // 63
		roles: ['admin']                                                                                          // 63
	}, {                                                                                                       // 63
		_id: 'view-statistics',                                                                                   // 64
		roles: ['admin']                                                                                          // 64
	}, {                                                                                                       // 64
		_id: 'view-user-administration',                                                                          // 65
		roles: ['admin']                                                                                          // 65
	}, {                                                                                                       // 65
		_id: 'preview-c-room',                                                                                    // 66
		roles: ['admin', 'user', 'anonymous']                                                                     // 66
	}];                                                                                                        // 66
                                                                                                            //
	for (var _iterator = permissions, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
		var _ref;                                                                                                 // 69
                                                                                                            //
		if (_isArray) {                                                                                           // 69
			if (_i >= _iterator.length) break;                                                                       // 69
			_ref = _iterator[_i++];                                                                                  // 69
		} else {                                                                                                  // 69
			_i = _iterator.next();                                                                                   // 69
			if (_i.done) break;                                                                                      // 69
			_ref = _i.value;                                                                                         // 69
		}                                                                                                         // 69
                                                                                                            //
		var permission = _ref;                                                                                    // 69
                                                                                                            //
		if (!RocketChat.models.Permissions.findOneById(permission._id)) {                                         // 70
			RocketChat.models.Permissions.upsert(permission._id, {                                                   // 71
				$set: permission                                                                                        // 71
			});                                                                                                      // 71
		}                                                                                                         // 72
	}                                                                                                          // 73
                                                                                                            //
	var defaultRoles = [{                                                                                      // 75
		name: 'admin',                                                                                            // 76
		scope: 'Users',                                                                                           // 76
		description: 'Admin'                                                                                      // 76
	}, {                                                                                                       // 76
		name: 'moderator',                                                                                        // 77
		scope: 'Subscriptions',                                                                                   // 77
		description: 'Moderator'                                                                                  // 77
	}, {                                                                                                       // 77
		name: 'leader',                                                                                           // 78
		scope: 'Subscriptions',                                                                                   // 78
		description: 'Leader'                                                                                     // 78
	}, {                                                                                                       // 78
		name: 'owner',                                                                                            // 79
		scope: 'Subscriptions',                                                                                   // 79
		description: 'Owner'                                                                                      // 79
	}, {                                                                                                       // 79
		name: 'user',                                                                                             // 80
		scope: 'Users',                                                                                           // 80
		description: ''                                                                                           // 80
	}, {                                                                                                       // 80
		name: 'bot',                                                                                              // 81
		scope: 'Users',                                                                                           // 81
		description: ''                                                                                           // 81
	}, {                                                                                                       // 81
		name: 'guest',                                                                                            // 82
		scope: 'Users',                                                                                           // 82
		description: ''                                                                                           // 82
	}, {                                                                                                       // 82
		name: 'anonymous',                                                                                        // 83
		scope: 'Users',                                                                                           // 83
		description: ''                                                                                           // 83
	}];                                                                                                        // 83
                                                                                                            //
	for (var _iterator2 = defaultRoles, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
		var _ref2;                                                                                                // 86
                                                                                                            //
		if (_isArray2) {                                                                                          // 86
			if (_i2 >= _iterator2.length) break;                                                                     // 86
			_ref2 = _iterator2[_i2++];                                                                               // 86
		} else {                                                                                                  // 86
			_i2 = _iterator2.next();                                                                                 // 86
			if (_i2.done) break;                                                                                     // 86
			_ref2 = _i2.value;                                                                                       // 86
		}                                                                                                         // 86
                                                                                                            //
		var role = _ref2;                                                                                         // 86
		RocketChat.models.Roles.upsert({                                                                          // 87
			_id: role.name                                                                                           // 87
		}, {                                                                                                      // 87
			$setOnInsert: {                                                                                          // 87
				scope: role.scope,                                                                                      // 87
				description: role.description || '',                                                                    // 87
				"protected": true                                                                                       // 87
			}                                                                                                        // 87
		});                                                                                                       // 87
	}                                                                                                          // 88
});                                                                                                         // 89
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/rocketchat:authorization/lib/rocketchat.js");
require("./node_modules/meteor/rocketchat:authorization/server/models/Permissions.js");
require("./node_modules/meteor/rocketchat:authorization/server/models/Roles.js");
require("./node_modules/meteor/rocketchat:authorization/server/models/Base.js");
require("./node_modules/meteor/rocketchat:authorization/server/models/Users.js");
require("./node_modules/meteor/rocketchat:authorization/server/models/Subscriptions.js");
require("./node_modules/meteor/rocketchat:authorization/server/functions/addUserRoles.js");
require("./node_modules/meteor/rocketchat:authorization/server/functions/canAccessRoom.js");
require("./node_modules/meteor/rocketchat:authorization/server/functions/getRoles.js");
require("./node_modules/meteor/rocketchat:authorization/server/functions/getUsersInRole.js");
require("./node_modules/meteor/rocketchat:authorization/server/functions/hasPermission.js");
require("./node_modules/meteor/rocketchat:authorization/server/functions/hasRole.js");
require("./node_modules/meteor/rocketchat:authorization/server/functions/removeUserFromRoles.js");
require("./node_modules/meteor/rocketchat:authorization/server/publications/permissions.js");
require("./node_modules/meteor/rocketchat:authorization/server/publications/roles.js");
require("./node_modules/meteor/rocketchat:authorization/server/publications/usersInRole.js");
require("./node_modules/meteor/rocketchat:authorization/server/methods/addUserToRole.js");
require("./node_modules/meteor/rocketchat:authorization/server/methods/deleteRole.js");
require("./node_modules/meteor/rocketchat:authorization/server/methods/removeUserFromRole.js");
require("./node_modules/meteor/rocketchat:authorization/server/methods/saveRole.js");
require("./node_modules/meteor/rocketchat:authorization/server/methods/addPermissionToRole.js");
require("./node_modules/meteor/rocketchat:authorization/server/methods/removeRoleFromPermission.js");
require("./node_modules/meteor/rocketchat:authorization/server/startup.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:authorization'] = {};

})();

//# sourceMappingURL=rocketchat_authorization.js.map

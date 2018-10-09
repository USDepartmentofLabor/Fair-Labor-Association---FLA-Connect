(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

/* Package-scope variables */
var __coffeescriptShare, OAuth2Server;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_oauth2-server/model.coffee.js                                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var AccessTokens, AuthCodes, Clients, Model, RefreshTokens, debug;                                                    // 1
AccessTokens = void 0;                                                                                                // 1
RefreshTokens = void 0;                                                                                               // 2
Clients = void 0;                                                                                                     // 3
AuthCodes = void 0;                                                                                                   // 4
debug = void 0;                                                                                                       // 5
                                                                                                                      //
this.Model = Model = function () {                                                                                    // 7
  function Model(config) {                                                                                            // 8
    if (config == null) {                                                                                             // 15
      config = {};                                                                                                    // 8
    }                                                                                                                 // 17
                                                                                                                      //
    if (config.accessTokensCollectionName == null) {                                                                  // 18
      config.accessTokensCollectionName = 'oauth_access_tokens';                                                      // 9
    }                                                                                                                 // 20
                                                                                                                      //
    if (config.refreshTokensCollectionName == null) {                                                                 // 21
      config.refreshTokensCollectionName = 'oauth_refresh_tokens';                                                    // 10
    }                                                                                                                 // 23
                                                                                                                      //
    if (config.clientsCollectionName == null) {                                                                       // 24
      config.clientsCollectionName = 'oauth_clients';                                                                 // 11
    }                                                                                                                 // 26
                                                                                                                      //
    if (config.authCodesCollectionName == null) {                                                                     // 27
      config.authCodesCollectionName = 'oauth_auth_codes';                                                            // 12
    }                                                                                                                 // 29
                                                                                                                      //
    this.debug = debug = config.debug;                                                                                // 14
    this.AccessTokens = AccessTokens = config.accessTokensCollection || new Meteor.Collection(config.accessTokensCollectionName);
    this.RefreshTokens = RefreshTokens = config.refreshTokensCollection || new Meteor.Collection(config.refreshTokensCollectionName);
    this.Clients = Clients = config.clientsCollection || new Meteor.Collection(config.clientsCollectionName);         // 18
    this.AuthCodes = AuthCodes = config.authCodesCollection || new Meteor.Collection(config.authCodesCollectionName);
  }                                                                                                                   // 8
                                                                                                                      //
  Model.prototype.getAccessToken = Meteor.bindEnvironment(function (bearerToken, callback) {                          // 37
    var e, token;                                                                                                     // 23
                                                                                                                      //
    if (debug === true) {                                                                                             // 23
      console.log('[OAuth2Server]', 'in getAccessToken (bearerToken:', bearerToken, ')');                             // 24
    }                                                                                                                 // 41
                                                                                                                      //
    try {                                                                                                             // 26
      token = AccessTokens.findOne({                                                                                  // 27
        accessToken: bearerToken                                                                                      // 27
      });                                                                                                             // 27
      return callback(null, token);                                                                                   // 46
    } catch (error) {                                                                                                 // 26
      e = error;                                                                                                      // 29
      return callback(e);                                                                                             // 49
    }                                                                                                                 // 50
  });                                                                                                                 // 22
  Model.prototype.getClient = Meteor.bindEnvironment(function (clientId, clientSecret, callback) {                    // 53
    var client, e;                                                                                                    // 34
                                                                                                                      //
    if (debug === true) {                                                                                             // 34
      console.log('[OAuth2Server]', 'in getClient (clientId:', clientId, ', clientSecret:', clientSecret, ')');       // 35
    }                                                                                                                 // 57
                                                                                                                      //
    try {                                                                                                             // 37
      if (clientSecret == null) {                                                                                     // 38
        client = Clients.findOne({                                                                                    // 39
          active: true,                                                                                               // 39
          clientId: clientId                                                                                          // 39
        });                                                                                                           // 39
      } else {                                                                                                        // 38
        client = Clients.findOne({                                                                                    // 41
          active: true,                                                                                               // 41
          clientId: clientId,                                                                                         // 41
          clientSecret: clientSecret                                                                                  // 41
        });                                                                                                           // 41
      }                                                                                                               // 70
                                                                                                                      //
      return callback(null, client);                                                                                  // 71
    } catch (error) {                                                                                                 // 37
      e = error;                                                                                                      // 43
      return callback(e);                                                                                             // 74
    }                                                                                                                 // 75
  });                                                                                                                 // 33
                                                                                                                      //
  Model.prototype.grantTypeAllowed = function (clientId, grantType, callback) {                                       // 78
    if (debug === true) {                                                                                             // 48
      console.log('[OAuth2Server]', 'in grantTypeAllowed (clientId:', clientId, ', grantType:', grantType + ')');     // 49
    }                                                                                                                 // 81
                                                                                                                      //
    return callback(false, grantType === 'authorization_code' || grantType === 'refresh_token');                      // 51
  };                                                                                                                  // 47
                                                                                                                      //
  Model.prototype.saveAccessToken = Meteor.bindEnvironment(function (token, clientId, expires, user, callback) {      // 85
    var e, tokenId;                                                                                                   // 55
                                                                                                                      //
    if (debug === true) {                                                                                             // 55
      console.log('[OAuth2Server]', 'in saveAccessToken (token:', token, ', clientId:', clientId, ', user:', user, ', expires:', expires, ')');
    }                                                                                                                 // 89
                                                                                                                      //
    try {                                                                                                             // 58
      tokenId = AccessTokens.insert({                                                                                 // 59
        accessToken: token,                                                                                           // 60
        clientId: clientId,                                                                                           // 61
        userId: user.id,                                                                                              // 62
        expires: expires                                                                                              // 63
      });                                                                                                             // 60
      return callback(null, tokenId);                                                                                 // 97
    } catch (error) {                                                                                                 // 58
      e = error;                                                                                                      // 66
      return callback(e);                                                                                             // 100
    }                                                                                                                 // 101
  });                                                                                                                 // 54
  Model.prototype.getAuthCode = Meteor.bindEnvironment(function (authCode, callback) {                                // 104
    var code, e;                                                                                                      // 71
                                                                                                                      //
    if (debug === true) {                                                                                             // 71
      console.log('[OAuth2Server]', 'in getAuthCode (authCode: ' + authCode + ')');                                   // 72
    }                                                                                                                 // 108
                                                                                                                      //
    try {                                                                                                             // 74
      code = AuthCodes.findOne({                                                                                      // 75
        authCode: authCode                                                                                            // 75
      });                                                                                                             // 75
      return callback(null, code);                                                                                    // 113
    } catch (error) {                                                                                                 // 74
      e = error;                                                                                                      // 77
      return callback(e);                                                                                             // 116
    }                                                                                                                 // 117
  });                                                                                                                 // 70
  Model.prototype.saveAuthCode = Meteor.bindEnvironment(function (code, clientId, expires, user, callback) {          // 120
    var codeId, e;                                                                                                    // 82
                                                                                                                      //
    if (debug === true) {                                                                                             // 82
      console.log('[OAuth2Server]', 'in saveAuthCode (code:', code, ', clientId:', clientId, ', expires:', expires, ', user:', user, ')');
    }                                                                                                                 // 124
                                                                                                                      //
    try {                                                                                                             // 85
      codeId = AuthCodes.upsert({                                                                                     // 86
        authCode: code                                                                                                // 87
      }, {                                                                                                            // 87
        authCode: code,                                                                                               // 89
        clientId: clientId,                                                                                           // 90
        userId: user.id,                                                                                              // 91
        expires: expires                                                                                              // 92
      });                                                                                                             // 89
      return callback(null, codeId);                                                                                  // 134
    } catch (error) {                                                                                                 // 85
      e = error;                                                                                                      // 95
      return callback(e);                                                                                             // 137
    }                                                                                                                 // 138
  });                                                                                                                 // 81
  Model.prototype.saveRefreshToken = Meteor.bindEnvironment(function (token, clientId, expires, user, callback) {     // 141
    var e, tokenId;                                                                                                   // 100
                                                                                                                      //
    if (debug === true) {                                                                                             // 100
      console.log('[OAuth2Server]', 'in saveRefreshToken (token:', token, ', clientId:', clientId, ', user:', user, ', expires:', expires, ')');
    }                                                                                                                 // 145
                                                                                                                      //
    try {                                                                                                             // 103
      return tokenId = RefreshTokens.insert({                                                                         // 147
        refreshToken: token,                                                                                          // 105
        clientId: clientId,                                                                                           // 106
        userId: user.id,                                                                                              // 107
        expires: expires                                                                                              // 108
      }, callback(null, tokenId));                                                                                    // 105
    } catch (error) {                                                                                                 // 103
      e = error;                                                                                                      // 111
      return callback(e);                                                                                             // 155
    }                                                                                                                 // 156
  });                                                                                                                 // 99
  Model.prototype.getRefreshToken = Meteor.bindEnvironment(function (refreshToken, callback) {                        // 159
    var e, token;                                                                                                     // 116
                                                                                                                      //
    if (debug === true) {                                                                                             // 116
      console.log('[OAuth2Server]', 'in getRefreshToken (refreshToken: ' + refreshToken + ')');                       // 117
    }                                                                                                                 // 163
                                                                                                                      //
    try {                                                                                                             // 119
      token = RefreshTokens.findOne({                                                                                 // 120
        refreshToken: refreshToken                                                                                    // 120
      });                                                                                                             // 120
      return callback(null, token);                                                                                   // 168
    } catch (error) {                                                                                                 // 119
      e = error;                                                                                                      // 122
      return callback(e);                                                                                             // 171
    }                                                                                                                 // 172
  });                                                                                                                 // 115
  return Model;                                                                                                       // 175
}();                                                                                                                  // 177
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_oauth2-server/oauth.coffee.js                                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var express, oauthserver;                                                                                             // 1
oauthserver = Npm.require('oauth2-server');                                                                           // 1
express = Npm.require('express');                                                                                     // 2
                                                                                                                      //
OAuth2Server = function () {                                                                                          // 8
  function OAuth2Server(config) {                                                                                     // 9
    this.config = config != null ? config : {};                                                                       // 9
    this.app = express();                                                                                             // 10
    this.routes = express();                                                                                          // 12
    this.model = new Model(this.config);                                                                              // 14
    this.oauth = oauthserver({                                                                                        // 16
      model: this.model,                                                                                              // 17
      grants: ['authorization_code', 'refresh_token'],                                                                // 18
      debug: this.config.debug                                                                                        // 19
    });                                                                                                               // 17
    this.publishAuhorizedClients();                                                                                   // 21
    this.initRoutes();                                                                                                // 22
    return this;                                                                                                      // 24
  }                                                                                                                   // 9
                                                                                                                      //
  OAuth2Server.prototype.publishAuhorizedClients = function () {                                                      // 23
    return Meteor.publish('authorizedOAuth', function () {                                                            // 24
      if (this.userId == null) {                                                                                      // 29
        return this.ready();                                                                                          // 30
      }                                                                                                               // 27
                                                                                                                      //
      return Meteor.users.find({                                                                                      // 32
        _id: this.userId                                                                                              // 33
      }, {                                                                                                            // 33
        fields: {                                                                                                     // 35
          'oauth.authorizedClients': 1                                                                                // 36
        }                                                                                                             // 36
      });                                                                                                             // 35
      return typeof user !== "undefined" && user !== null;                                                            // 38
    });                                                                                                               // 28
  };                                                                                                                  // 27
                                                                                                                      //
  OAuth2Server.prototype.initRoutes = function () {                                                                   // 39
    var debugMiddleware, self, transformRequestsNotUsingFormUrlencodedType;                                           // 42
    self = this;                                                                                                      // 42
                                                                                                                      //
    debugMiddleware = function (req, res, next) {                                                                     // 43
      if (self.config.debug === true) {                                                                               // 44
        console.log('[OAuth2Server]', req.method, req.url);                                                           // 45
      }                                                                                                               // 45
                                                                                                                      //
      return next();                                                                                                  // 46
    };                                                                                                                // 43
                                                                                                                      //
    transformRequestsNotUsingFormUrlencodedType = function (req, res, next) {                                         // 50
      if (!req.is('application/x-www-form-urlencoded') && req.method === 'POST') {                                    // 51
        if (self.config.debug === true) {                                                                             // 52
          console.log('[OAuth2Server]', 'Transforming a request to form-urlencoded with the query going to the body.');
        }                                                                                                             // 52
                                                                                                                      //
        req.headers['content-type'] = 'application/x-www-form-urlencoded';                                            // 54
        req.body = Object.assign({}, req.body, req.query);                                                            // 55
      }                                                                                                               // 55
                                                                                                                      //
      return next();                                                                                                  // 56
    };                                                                                                                // 50
                                                                                                                      //
    this.app.all('/oauth/token', debugMiddleware, transformRequestsNotUsingFormUrlencodedType, this.oauth.grant());   // 58
    this.app.get('/oauth/authorize', debugMiddleware, Meteor.bindEnvironment(function (req, res, next) {              // 60
      var client;                                                                                                     // 61
      client = self.model.Clients.findOne({                                                                           // 61
        active: true,                                                                                                 // 61
        clientId: req.query.client_id                                                                                 // 61
      });                                                                                                             // 61
                                                                                                                      //
      if (client == null) {                                                                                           // 62
        return res.redirect('/oauth/error/404');                                                                      // 63
      }                                                                                                               // 67
                                                                                                                      //
      if (client.redirectUri !== req.query.redirect_uri) {                                                            // 65
        return res.redirect('/oauth/error/invalid_redirect_uri');                                                     // 66
      }                                                                                                               // 70
                                                                                                                      //
      return next();                                                                                                  // 71
    }));                                                                                                              // 60
    this.app.post('/oauth/authorize', debugMiddleware, Meteor.bindEnvironment(function (req, res, next) {             // 70
      var user;                                                                                                       // 71
                                                                                                                      //
      if (req.body.token == null) {                                                                                   // 71
        return res.sendStatus(401).send('No token');                                                                  // 72
      }                                                                                                               // 77
                                                                                                                      //
      user = Meteor.users.findOne({                                                                                   // 74
        'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(req.body.token)                           // 75
      });                                                                                                             // 75
                                                                                                                      //
      if (user == null) {                                                                                             // 77
        return res.sendStatus(401).send('Invalid token');                                                             // 78
      }                                                                                                               // 83
                                                                                                                      //
      req.user = {                                                                                                    // 80
        id: user._id                                                                                                  // 81
      };                                                                                                              // 81
      return next();                                                                                                  // 87
    }));                                                                                                              // 70
    this.app.post('/oauth/authorize', debugMiddleware, this.oauth.authCodeGrant(function (req, next) {                // 86
      if (req.body.allow === 'yes') {                                                                                 // 87
        Meteor.users.update(req.user.id, {                                                                            // 88
          $addToSet: {                                                                                                // 88
            'oauth.authorizedClients': this.clientId                                                                  // 88
          }                                                                                                           // 88
        });                                                                                                           // 88
      }                                                                                                               // 96
                                                                                                                      //
      return next(null, req.body.allow === 'yes', req.user);                                                          // 97
    }));                                                                                                              // 86
    this.app.use(this.routes);                                                                                        // 92
    return this.app.all('/oauth/*', this.oauth.errorHandler());                                                       // 100
  };                                                                                                                  // 41
                                                                                                                      //
  return OAuth2Server;                                                                                                // 103
}();                                                                                                                  // 105
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['rocketchat:oauth2-server'] = {}, {
  OAuth2Server: OAuth2Server
});

})();

//# sourceMappingURL=rocketchat_oauth2-server.js.map

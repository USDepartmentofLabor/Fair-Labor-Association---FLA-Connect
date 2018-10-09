(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var OAuth = Package.oauth.OAuth;
var Oauth = Package.oauth.Oauth;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;
var _ = Package.underscore._;
var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;
var meteorInstall = Package.modules.meteorInstall;
var process = Package.modules.process;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

/* Package-scope variables */
var LinkedIn;

var require = meteorInstall({"node_modules":{"meteor":{"pauli:linkedin-oauth":{"linkedin-server.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// packages/pauli_linkedin-oauth/linkedin-server.js                                            //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                               //
LinkedIn = {};                                                                                 // 1
OAuth.registerService('linkedin', 2, null, function (query) {                                  // 3
  var response = getTokenResponse(query);                                                      // 5
  var accessToken = response.accessToken;                                                      // 6
  var identity = getIdentity(accessToken);                                                     // 7
  var id = identity.id;                                                                        // 9
                                                                                               //
  if (!id) {                                                                                   // 10
    throw new Error("LinkedIn did not provide an id");                                         // 11
  }                                                                                            // 12
                                                                                               //
  var serviceData = {                                                                          // 13
    id: id,                                                                                    // 14
    accessToken: accessToken,                                                                  // 15
    expiresAt: +new Date() + 1000 * response.expiresIn                                         // 16
  };                                                                                           // 13
  var whiteListed = ['firstName', 'headline', 'lastName']; // include all fields from linkedin
  // https://developer.linkedin.com/documents/authentication                                   // 22
                                                                                               //
  var fields = _.pick(identity, whiteListed); // list of extra fields                          // 23
  // http://developer.linkedin.com/documents/profile-fields                                    // 26
                                                                                               //
                                                                                               //
  var extraFields = 'email-address,location:(name),num-connections,picture-url,public-profile-url,skills,languages,three-current-positions,recommendations-received'; // remove the whitespaces which could break the request
                                                                                               //
  extraFields = extraFields.replace(/\s+/g, '');                                               // 30
  fields = getExtraData(accessToken, extraFields, fields);                                     // 32
                                                                                               //
  _.extend(serviceData, fields);                                                               // 34
                                                                                               //
  return {                                                                                     // 36
    serviceData: serviceData,                                                                  // 37
    options: {                                                                                 // 38
      profile: fields                                                                          // 39
    }                                                                                          // 38
  };                                                                                           // 36
});                                                                                            // 42
                                                                                               //
var getExtraData = function (accessToken, extraFields, fields) {                               // 44
  var url = 'https://api.linkedin.com/v1/people/~:(' + extraFields + ')';                      // 45
  var response = Meteor.http.get(url, {                                                        // 46
    params: {                                                                                  // 47
      oauth2_access_token: accessToken,                                                        // 48
      format: 'json'                                                                           // 49
    }                                                                                          // 47
  }).data;                                                                                     // 46
  return _.extend(fields, response);                                                           // 52
}; // checks whether a string parses as JSON                                                   // 53
                                                                                               //
                                                                                               //
var isJSON = function (str) {                                                                  // 56
  try {                                                                                        // 57
    JSON.parse(str);                                                                           // 58
    return true;                                                                               // 59
  } catch (e) {                                                                                // 60
    return false;                                                                              // 61
  }                                                                                            // 62
}; // returns an object containing:                                                            // 63
// - accessToken                                                                               // 66
// - expiresIn: lifetime of token in seconds                                                   // 67
                                                                                               //
                                                                                               //
var getTokenResponse = function (query) {                                                      // 68
  var config = ServiceConfiguration.configurations.findOne({                                   // 69
    service: 'linkedin'                                                                        // 69
  });                                                                                          // 69
  if (!config) throw new ServiceConfiguration.ConfigError("Service not configured");           // 70
  var responseContent;                                                                         // 73
                                                                                               //
  try {                                                                                        // 74
    //Request an access token                                                                  // 75
    responseContent = Meteor.http.post("https://api.linkedin.com/uas/oauth2/accessToken", {    // 76
      params: {                                                                                // 78
        grant_type: 'authorization_code',                                                      // 79
        client_id: config.clientId,                                                            // 80
        client_secret: OAuth.openSecret(config.secret),                                        // 81
        code: query.code,                                                                      // 82
        redirect_uri: OAuth._redirectUri('linkedin', config)                                   // 83
      }                                                                                        // 78
    }).content;                                                                                // 77
  } catch (err) {                                                                              // 86
    throw new Error("Failed to complete OAuth handshake with LinkedIn. " + err.message);       // 87
  } // If 'responseContent' does not parse as JSON, it is an error.                            // 88
                                                                                               //
                                                                                               //
  if (!isJSON(responseContent)) {                                                              // 91
    throw new Error("Failed to complete OAuth handshake with LinkedIn. " + responseContent);   // 92
  } // Success! Extract access token and expiration                                            // 93
                                                                                               //
                                                                                               //
  var parsedResponse = JSON.parse(responseContent);                                            // 96
  var accessToken = parsedResponse.access_token;                                               // 97
  var expiresIn = parsedResponse.expires_in;                                                   // 98
                                                                                               //
  if (!accessToken) {                                                                          // 100
    throw new Error("Failed to complete OAuth handshake with LinkedIn " + "-- can't find access token in HTTP response. " + responseContent);
  }                                                                                            // 103
                                                                                               //
  return {                                                                                     // 105
    accessToken: accessToken,                                                                  // 106
    expiresIn: expiresIn                                                                       // 107
  };                                                                                           // 105
};                                                                                             // 109
                                                                                               //
var getIdentity = function (accessToken) {                                                     // 111
  try {                                                                                        // 112
    return Meteor.http.get("https://www.linkedin.com/v1/people/~", {                           // 113
      params: {                                                                                // 114
        oauth2_access_token: accessToken,                                                      // 114
        format: 'json'                                                                         // 114
      }                                                                                        // 114
    }).data;                                                                                   // 113
  } catch (err) {                                                                              // 115
    throw new Error("Failed to fetch identity from LinkedIn. " + err.message);                 // 116
  }                                                                                            // 117
};                                                                                             // 118
                                                                                               //
LinkedIn.retrieveCredential = function (credentialToken, credentialSecret) {                   // 120
  return OAuth.retrieveCredential(credentialToken, credentialSecret);                          // 121
};                                                                                             // 122
/////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/pauli:linkedin-oauth/linkedin-server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['pauli:linkedin-oauth'] = {}, {
  LinkedIn: LinkedIn
});

})();

//# sourceMappingURL=pauli_linkedin-oauth.js.map

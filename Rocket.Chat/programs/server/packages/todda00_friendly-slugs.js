(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var check = Package.check.check;
var Match = Package.check.Match;
var CollectionHooks = Package['matb33:collection-hooks'].CollectionHooks;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-server'].Symbol;
var Map = Package['ecmascript-runtime-server'].Map;
var Set = Package['ecmascript-runtime-server'].Set;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/todda00_friendly-slugs/slugs.coffee.js                                                                 //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
                                                                                                                   //
var Mongo, slugify, stringToNested;                                                                                // 2
                                                                                                                   //
if (typeof Mongo === "undefined") {                                                                                // 2
  Mongo = {};                                                                                                      // 3
  Mongo.Collection = Meteor.Collection;                                                                            // 4
}                                                                                                                  // 6
                                                                                                                   //
Mongo.Collection.prototype.friendlySlugs = function (options) {                                                    // 6
  var collection, fsDebug, runSlug;                                                                                // 7
                                                                                                                   //
  if (options == null) {                                                                                           // 10
    options = {};                                                                                                  // 6
  }                                                                                                                // 12
                                                                                                                   //
  collection = this;                                                                                               // 7
                                                                                                                   //
  if (!_.isArray(options)) {                                                                                       // 9
    options = [options];                                                                                           // 10
  }                                                                                                                // 16
                                                                                                                   //
  _.each(options, function (opts) {                                                                                // 12
    var defaults, fields;                                                                                          // 13
                                                                                                                   //
    if (_.isString(opts)) {                                                                                        // 13
      opts = {                                                                                                     // 14
        slugFrom: [opts]                                                                                           // 15
      };                                                                                                           // 14
    }                                                                                                              // 23
                                                                                                                   //
    if (_.isString(opts.slugFrom)) {                                                                               // 17
      opts.slugFrom = [opts.slugFrom];                                                                             // 17
    }                                                                                                              // 26
                                                                                                                   //
    defaults = {                                                                                                   // 19
      slugFrom: ['name'],                                                                                          // 20
      slugField: 'slug',                                                                                           // 21
      distinct: true,                                                                                              // 22
      distinctUpTo: [],                                                                                            // 23
      updateSlug: true,                                                                                            // 24
      createOnUpdate: true,                                                                                        // 25
      maxLength: 0,                                                                                                // 26
      debug: false,                                                                                                // 27
      transliteration: [{                                                                                          // 28
        from: 'àáâäåãа',                                                                                           // 29
        to: 'a'                                                                                                    // 29
      }, {                                                                                                         // 29
        from: 'б',                                                                                                 // 30
        to: 'b'                                                                                                    // 30
      }, {                                                                                                         // 30
        from: 'ç',                                                                                                 // 31
        to: 'c'                                                                                                    // 31
      }, {                                                                                                         // 31
        from: 'д',                                                                                                 // 32
        to: 'd'                                                                                                    // 32
      }, {                                                                                                         // 32
        from: 'èéêëẽэе',                                                                                           // 33
        to: 'e'                                                                                                    // 33
      }, {                                                                                                         // 33
        from: 'ф',                                                                                                 // 34
        to: 'f'                                                                                                    // 34
      }, {                                                                                                         // 34
        from: 'г',                                                                                                 // 35
        to: 'g'                                                                                                    // 35
      }, {                                                                                                         // 35
        from: 'х',                                                                                                 // 36
        to: 'h'                                                                                                    // 36
      }, {                                                                                                         // 36
        from: 'ìíîïи',                                                                                             // 37
        to: 'i'                                                                                                    // 37
      }, {                                                                                                         // 37
        from: 'к',                                                                                                 // 38
        to: 'k'                                                                                                    // 38
      }, {                                                                                                         // 38
        from: 'л',                                                                                                 // 39
        to: 'l'                                                                                                    // 39
      }, {                                                                                                         // 39
        from: 'м',                                                                                                 // 40
        to: 'm'                                                                                                    // 40
      }, {                                                                                                         // 40
        from: 'ñн',                                                                                                // 41
        to: 'n'                                                                                                    // 41
      }, {                                                                                                         // 41
        from: 'òóôöõо',                                                                                            // 42
        to: 'o'                                                                                                    // 42
      }, {                                                                                                         // 42
        from: 'п',                                                                                                 // 43
        to: 'p'                                                                                                    // 43
      }, {                                                                                                         // 43
        from: 'р',                                                                                                 // 44
        to: 'r'                                                                                                    // 44
      }, {                                                                                                         // 44
        from: 'с',                                                                                                 // 45
        to: 's'                                                                                                    // 45
      }, {                                                                                                         // 45
        from: 'т',                                                                                                 // 46
        to: 't'                                                                                                    // 46
      }, {                                                                                                         // 46
        from: 'ùúûüу',                                                                                             // 47
        to: 'u'                                                                                                    // 47
      }, {                                                                                                         // 47
        from: 'в',                                                                                                 // 48
        to: 'v'                                                                                                    // 48
      }, {                                                                                                         // 48
        from: 'йы',                                                                                                // 49
        to: 'y'                                                                                                    // 49
      }, {                                                                                                         // 49
        from: 'з',                                                                                                 // 50
        to: 'z'                                                                                                    // 50
      }, {                                                                                                         // 50
        from: 'æ',                                                                                                 // 51
        to: 'ae'                                                                                                   // 51
      }, {                                                                                                         // 51
        from: 'ч',                                                                                                 // 52
        to: 'ch'                                                                                                   // 52
      }, {                                                                                                         // 52
        from: 'щ',                                                                                                 // 53
        to: 'sch'                                                                                                  // 53
      }, {                                                                                                         // 53
        from: 'ш',                                                                                                 // 54
        to: 'sh'                                                                                                   // 54
      }, {                                                                                                         // 54
        from: 'ц',                                                                                                 // 55
        to: 'ts'                                                                                                   // 55
      }, {                                                                                                         // 55
        from: 'я',                                                                                                 // 56
        to: 'ya'                                                                                                   // 56
      }, {                                                                                                         // 56
        from: 'ю',                                                                                                 // 57
        to: 'yu'                                                                                                   // 57
      }, {                                                                                                         // 57
        from: 'ж',                                                                                                 // 58
        to: 'zh'                                                                                                   // 58
      }, {                                                                                                         // 58
        from: 'ъь',                                                                                                // 59
        to: ''                                                                                                     // 59
      }]                                                                                                           // 59
    };                                                                                                             // 20
                                                                                                                   //
    _.defaults(opts, defaults);                                                                                    // 62
                                                                                                                   //
    fields = {                                                                                                     // 64
      slugFrom: Array,                                                                                             // 65
      slugField: String,                                                                                           // 66
      distinct: Boolean,                                                                                           // 67
      createOnUpdate: Boolean,                                                                                     // 68
      maxLength: Number,                                                                                           // 69
      debug: Boolean                                                                                               // 70
    };                                                                                                             // 65
                                                                                                                   //
    if (typeof opts.updateSlug !== "function") {                                                                   // 72
      if (opts.updateSlug) {                                                                                       // 73
        opts.updateSlug = function () {                                                                            // 74
          return true;                                                                                             // 145
        };                                                                                                         // 74
      } else {                                                                                                     // 73
        opts.updateSlug = function () {                                                                            // 76
          return false;                                                                                            // 149
        };                                                                                                         // 76
      }                                                                                                            // 72
    }                                                                                                              // 152
                                                                                                                   //
    check(opts, Match.ObjectIncluding(fields));                                                                    // 79
    collection.before.insert(function (userId, doc) {                                                              // 81
      fsDebug(opts, 'before.insert function');                                                                     // 82
      runSlug(doc, opts);                                                                                          // 83
    });                                                                                                            // 81
    collection.before.update(function (userId, doc, fieldNames, modifier, options) {                               // 86
      var cleanModifier, cont, slugFromChanged;                                                                    // 87
      fsDebug(opts, 'before.update function');                                                                     // 87
                                                                                                                   //
      cleanModifier = function () {                                                                                // 88
        if (_.isEmpty(modifier.$set)) {                                                                            // 90
          return delete modifier.$set;                                                                             // 163
        }                                                                                                          // 164
      };                                                                                                           // 88
                                                                                                                   //
      options = options || {};                                                                                     // 93
                                                                                                                   //
      if (options.multi) {                                                                                         // 94
        fsDebug(opts, "multi doc update attempted, can't update slugs this way, leaving.");                        // 95
        return true;                                                                                               // 96
      }                                                                                                            // 170
                                                                                                                   //
      modifier = modifier || {};                                                                                   // 98
      modifier.$set = modifier.$set || {};                                                                         // 99
      cont = false;                                                                                                // 102
                                                                                                                   //
      _.each(opts.slugFrom, function (slugFrom) {                                                                  // 103
        if (stringToNested(doc, slugFrom) || modifier.$set[slugFrom] != null || stringToNested(modifier.$set, slugFrom)) {
          return cont = true;                                                                                      // 176
        }                                                                                                          // 177
      });                                                                                                          // 103
                                                                                                                   //
      if (!cont) {                                                                                                 // 105
        fsDebug(opts, "no slugFrom fields are present (either before or after update), leaving.");                 // 106
        cleanModifier();                                                                                           // 107
        return true;                                                                                               // 108
      }                                                                                                            // 183
                                                                                                                   //
      slugFromChanged = false;                                                                                     // 111
                                                                                                                   //
      _.each(opts.slugFrom, function (slugFrom) {                                                                  // 112
        var docFrom;                                                                                               // 113
                                                                                                                   //
        if (modifier.$set[slugFrom] != null || stringToNested(modifier.$set, slugFrom)) {                          // 113
          docFrom = stringToNested(doc, slugFrom);                                                                 // 114
                                                                                                                   //
          if (docFrom !== modifier.$set[slugFrom] && docFrom !== stringToNested(modifier.$set, slugFrom)) {        // 115
            return slugFromChanged = true;                                                                         // 190
          }                                                                                                        // 113
        }                                                                                                          // 192
      });                                                                                                          // 112
                                                                                                                   //
      fsDebug(opts, slugFromChanged, 'slugFromChanged');                                                           // 118
                                                                                                                   //
      if (!stringToNested(doc, opts.slugField) && opts.createOnUpdate) {                                           // 121
        fsDebug(opts, 'Update: Slug Field is missing and createOnUpdate is set to true');                          // 122
                                                                                                                   //
        if (slugFromChanged) {                                                                                     // 124
          fsDebug(opts, 'slugFrom field has changed, runSlug with modifier');                                      // 125
          runSlug(doc, opts, modifier);                                                                            // 126
        } else {                                                                                                   // 124
          fsDebug(opts, 'runSlug to create');                                                                      // 129
          runSlug(doc, opts, modifier, true);                                                                      // 130
          cleanModifier();                                                                                         // 131
          return true;                                                                                             // 132
        }                                                                                                          // 121
      } else {                                                                                                     // 121
        if ((typeof opts.updateSlug === "function" ? opts.updateSlug(doc, modifier) : void 0) === false) {         // 136
          fsDebug(opts, 'updateSlug is false, nothing to do.');                                                    // 137
          cleanModifier();                                                                                         // 138
          return true;                                                                                             // 139
        }                                                                                                          // 211
                                                                                                                   //
        if (!slugFromChanged) {                                                                                    // 142
          fsDebug(opts, 'slugFrom field has not changed, nothing to do.');                                         // 143
          cleanModifier();                                                                                         // 144
          return true;                                                                                             // 145
        }                                                                                                          // 216
                                                                                                                   //
        runSlug(doc, opts, modifier);                                                                              // 147
        cleanModifier();                                                                                           // 149
        return true;                                                                                               // 150
      }                                                                                                            // 220
                                                                                                                   //
      cleanModifier();                                                                                             // 152
      return true;                                                                                                 // 153
    });                                                                                                            // 86
  });                                                                                                              // 12
                                                                                                                   //
  runSlug = function (doc, opts, modifier, create) {                                                               // 155
    var baseField, combineFrom, defaultSlugGenerator, f, fieldSelector, finalSlug, from, i, index, indexField, limitSelector, ref, result, slugBase, slugGenerator, sortSelector;
                                                                                                                   //
    if (modifier == null) {                                                                                        // 227
      modifier = false;                                                                                            // 155
    }                                                                                                              // 229
                                                                                                                   //
    if (create == null) {                                                                                          // 230
      create = false;                                                                                              // 155
    }                                                                                                              // 232
                                                                                                                   //
    fsDebug(opts, 'Begin runSlug');                                                                                // 156
    fsDebug(opts, opts, 'Options');                                                                                // 157
    fsDebug(opts, modifier, 'Modifier');                                                                           // 158
    fsDebug(opts, create, 'Create');                                                                               // 159
                                                                                                                   //
    combineFrom = function (doc, fields, modifierDoc) {                                                            // 161
      var fromValues;                                                                                              // 162
      fromValues = [];                                                                                             // 162
                                                                                                                   //
      _.each(fields, function (f) {                                                                                // 163
        var val;                                                                                                   // 164
                                                                                                                   //
        if (modifierDoc != null) {                                                                                 // 164
          if (stringToNested(modifierDoc, f)) {                                                                    // 165
            val = stringToNested(modifierDoc, f);                                                                  // 166
          } else {                                                                                                 // 165
            val = stringToNested(doc, f);                                                                          // 168
          }                                                                                                        // 164
        } else {                                                                                                   // 164
          val = stringToNested(doc, f);                                                                            // 170
        }                                                                                                          // 250
                                                                                                                   //
        if (val) {                                                                                                 // 171
          return fromValues.push(val);                                                                             // 252
        }                                                                                                          // 253
      });                                                                                                          // 163
                                                                                                                   //
      if (fromValues.length === 0) {                                                                               // 172
        return false;                                                                                              // 172
      }                                                                                                            // 257
                                                                                                                   //
      return fromValues.join('-');                                                                                 // 173
    };                                                                                                             // 161
                                                                                                                   //
    from = create || !modifier ? combineFrom(doc, opts.slugFrom) : combineFrom(doc, opts.slugFrom, modifier.$set);
                                                                                                                   //
    if (from === false) {                                                                                          // 177
      fsDebug(opts, "Nothing to slug from, leaving.");                                                             // 178
      return true;                                                                                                 // 179
    }                                                                                                              // 264
                                                                                                                   //
    fsDebug(opts, from, 'Slugging From');                                                                          // 181
    slugBase = slugify(from, opts.transliteration, opts.maxLength);                                                // 183
                                                                                                                   //
    if (!slugBase) {                                                                                               // 184
      return false;                                                                                                // 184
    }                                                                                                              // 269
                                                                                                                   //
    fsDebug(opts, slugBase, 'SlugBase before reduction');                                                          // 186
                                                                                                                   //
    if (opts.distinct) {                                                                                           // 188
      slugBase = slugBase.replace(/(-\d+)+$/, '');                                                                 // 191
      fsDebug(opts, slugBase, 'SlugBase after reduction');                                                         // 192
      baseField = "friendlySlugs." + opts.slugField + ".base";                                                     // 194
      indexField = "friendlySlugs." + opts.slugField + ".index";                                                   // 195
      fieldSelector = {};                                                                                          // 197
      fieldSelector[baseField] = slugBase;                                                                         // 198
      i = 0;                                                                                                       // 200
                                                                                                                   //
      while (i < opts.distinctUpTo.length) {                                                                       // 201
        f = opts.distinctUpTo[i];                                                                                  // 202
        fieldSelector[f] = doc[f];                                                                                 // 203
        i++;                                                                                                       // 204
      }                                                                                                            // 201
                                                                                                                   //
      sortSelector = {};                                                                                           // 206
      sortSelector[indexField] = -1;                                                                               // 207
      limitSelector = {};                                                                                          // 209
      limitSelector[indexField] = 1;                                                                               // 210
      result = collection.findOne(fieldSelector, {                                                                 // 212
        sort: sortSelector,                                                                                        // 213
        fields: limitSelector,                                                                                     // 214
        limit: 1                                                                                                   // 215
      });                                                                                                          // 213
      fsDebug(opts, result, 'Highest indexed base found');                                                         // 218
                                                                                                                   //
      if (result == null || result.friendlySlugs == null || result.friendlySlugs[opts.slugField] == null || result.friendlySlugs[opts.slugField].index == null) {
        index = 0;                                                                                                 // 221
      } else {                                                                                                     // 220
        index = result.friendlySlugs[opts.slugField].index + 1;                                                    // 223
      }                                                                                                            // 298
                                                                                                                   //
      defaultSlugGenerator = function (slugBase, index) {                                                          // 225
        if (index === 0) {                                                                                         // 226
          return slugBase;                                                                                         // 301
        } else {                                                                                                   // 226
          return slugBase + '-' + index;                                                                           // 303
        }                                                                                                          // 304
      };                                                                                                           // 225
                                                                                                                   //
      slugGenerator = (ref = opts.slugGenerator) != null ? ref : defaultSlugGenerator;                             // 228
      finalSlug = slugGenerator(slugBase, index);                                                                  // 230
    } else {                                                                                                       // 188
      index = false;                                                                                               // 234
      finalSlug = slugBase;                                                                                        // 235
    }                                                                                                              // 311
                                                                                                                   //
    fsDebug(opts, finalSlug, 'finalSlug');                                                                         // 237
                                                                                                                   //
    if (modifier || create) {                                                                                      // 239
      fsDebug(opts, 'Set to modify or create slug on update');                                                     // 240
      modifier = modifier || {};                                                                                   // 241
      modifier.$set = modifier.$set || {};                                                                         // 242
      modifier.$set.friendlySlugs = doc.friendlySlugs || {};                                                       // 243
      modifier.$set.friendlySlugs[opts.slugField] = modifier.$set.friendlySlugs[opts.slugField] || {};             // 244
      modifier.$set.friendlySlugs[opts.slugField].base = slugBase;                                                 // 245
      modifier.$set.friendlySlugs[opts.slugField].index = index;                                                   // 246
      modifier.$set[opts.slugField] = finalSlug;                                                                   // 247
      fsDebug(opts, modifier, 'Final Modifier');                                                                   // 248
    } else {                                                                                                       // 239
      fsDebug(opts, 'Set to update');                                                                              // 251
      doc.friendlySlugs = doc.friendlySlugs || {};                                                                 // 252
      doc.friendlySlugs[opts.slugField] = doc.friendlySlugs[opts.slugField] || {};                                 // 253
      doc.friendlySlugs[opts.slugField].base = slugBase;                                                           // 254
      doc.friendlySlugs[opts.slugField].index = index;                                                             // 255
      doc[opts.slugField] = finalSlug;                                                                             // 256
      fsDebug(opts, doc, 'Final Doc');                                                                             // 257
    }                                                                                                              // 331
                                                                                                                   //
    return true;                                                                                                   // 258
  };                                                                                                               // 155
                                                                                                                   //
  return fsDebug = function (opts, item, label) {                                                                  // 334
    if (label == null) {                                                                                           // 335
      label = '';                                                                                                  // 260
    }                                                                                                              // 337
                                                                                                                   //
    if (!opts.debug) {                                                                                             // 261
      return;                                                                                                      // 261
    }                                                                                                              // 340
                                                                                                                   //
    if ((typeof item === "undefined" ? "undefined" : _typeof(item)) === 'object') {                                // 262
      console.log("friendlySlugs DEBUG: " + label + '↓');                                                          // 263
      return console.log(item);                                                                                    // 343
    } else {                                                                                                       // 262
      return console.log("friendlySlugs DEBUG: " + label + '= ' + item);                                           // 345
    }                                                                                                              // 346
  };                                                                                                               // 260
};                                                                                                                 // 6
                                                                                                                   //
slugify = function (text, transliteration, maxLength) {                                                            // 268
  var lastDash, slug;                                                                                              // 269
                                                                                                                   //
  if (text == null) {                                                                                              // 269
    return false;                                                                                                  // 269
  }                                                                                                                // 354
                                                                                                                   //
  if (text.length < 1) {                                                                                           // 270
    return false;                                                                                                  // 270
  }                                                                                                                // 357
                                                                                                                   //
  text = text.toString().toLowerCase();                                                                            // 271
                                                                                                                   //
  _.each(transliteration, function (item) {                                                                        // 272
    return text = text.replace(new RegExp('[' + item.from + ']', 'g'), item.to);                                   // 360
  });                                                                                                              // 272
                                                                                                                   //
  slug = text.replace(/'/g, '').replace(/[^0-9a-z-]/g, '-').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
                                                                                                                   //
  if (maxLength > 0 && slug.length > maxLength) {                                                                  // 280
    lastDash = slug.substring(0, maxLength).lastIndexOf('-');                                                      // 281
    slug = slug.substring(0, lastDash);                                                                            // 282
  }                                                                                                                // 366
                                                                                                                   //
  return slug;                                                                                                     // 283
};                                                                                                                 // 268
                                                                                                                   //
stringToNested = function (obj, path) {                                                                            // 285
  var parts;                                                                                                       // 286
  parts = path.split(".");                                                                                         // 286
                                                                                                                   //
  if (parts.length === 1) {                                                                                        // 287
    if (obj != null && obj[parts[0]] != null) {                                                                    // 288
      return obj[parts[0]];                                                                                        // 289
    } else {                                                                                                       // 288
      return false;                                                                                                // 291
    }                                                                                                              // 287
  }                                                                                                                // 379
                                                                                                                   //
  return stringToNested(obj[parts[0]], parts.slice(1).join("."));                                                  // 292
};                                                                                                                 // 285
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['todda00:friendly-slugs'] = {};

})();

//# sourceMappingURL=todda00_friendly-slugs.js.map

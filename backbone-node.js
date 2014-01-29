var model = exports.model = require("./lib/model/model.js");
var collection = exports.collection = require("./lib/collection/collection.js");

var extend = exports.extend = require("./lib/extend/extend.js");

model.extend = extend;
collection.extend = extend;
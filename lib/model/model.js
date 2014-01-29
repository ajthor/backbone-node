var _ = require("lodash");

var model = module.exports = function(attributes) {
	if(!this.id) this.id = _.uniqueId("m");
	if(!this.primaryKey) this.primaryKey = this.id;
	this.attributes = {};
	this.initialize.apply(this, arguments);
};

_.extend(model.prototype, {

	primaryKey: null,

	initialize: function(){},

	get: function(args) {
		return this.attributes[args];
	},
	set: function(args, val) {
		var attrs;
		if(!_.isObject(args)) {
			(attrs = {})[args] = val;
		}
		else {
			attrs = args;
		}

		_.forEach(attrs, function(item, key) {
			this.attributes[key] = item;
		}, this);
	},

	id: null,
	hash: null,
	collection: null
	
});

var methods = ['keys', 'values'];

_.each(methods, function(method) {
	model.prototype[method] = function() {
		var args = slice.call(arguments);
		args.unshift(this.attributes);
		return _[method].apply(_, args);
	};
});
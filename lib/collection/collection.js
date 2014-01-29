var _ = require("lodash");

var collection = module.exports = function(template, objects, options) {
	options || (options = {});
	if(!_.isObject(template)) template = {};
	this._template = template;
	this._byId = {};
	this.objects = [];

	if(objects) this.add(objects, options);
	this.initialize.apply(this, arguments);
};

// collection.__proto__ = require("./static.js");

_.extend(collection.prototype, {

	initialize: function(){},
	// The template object to be used to create new item
	// instances which are kept in this collection.
	_template: {},
	// The factory for template objects.
	_factory: function() {
		var parent = this._template;
		var child;

		child = function(args) { return parent.apply(this, args); };
		child.prototype = parent.prototype;

		child.__super__ = parent.prototype;

		return child;
	},
	_prepareObject: function(args) {
		if(args instanceof this._template) {
			if(!args.collection) args.collection = this;
			if(!args.id) args.id = _.uniqueId();
			if(!args.hash) args.hash = this.hash(args.id);
			return args;
		}
		// Not the same as template.
		var obj = this._factory();
		var instance = new obj(arguments);

		instance.collection = this;
		if(!instance.id) instance.id = _.uniqueId();
		if(instance.primaryKey) {
			instance.hash = this.hash(instance.get(instance.primaryKey));// || this.hash(instance[instnace.primaryKey]);
		}
		else instance.hash = this.hash(instance.id);

		return instance;
	},

	create: function() {
		var obj;
		if(!(obj = this._prepareObject.apply(this, arguments))) return false;
		this.add(obj);
		return obj;
	},

	// CRUD functions (including add, minus delete).
	add: function(args, options) {
		// Add to both collections.
		options || (options = {});
		this.set(args, _.extend({add: true}, options, {update: true, remove: false}));
		return this;
	},
	remove: function(args, options) {
		// Remove from both collections.
		options || (options = {});
		var obj;
		if(!Array.isArray(args)) args = [args];
		args.forEach(function(item, key) {
			obj = this.get(item);
			if(!obj) return;
			delete this._byId[obj.id];
			index = _.indexOf(this.objects, item);
			this.objects.splice(index, 1);
		}, this);
		return args;
	},

	merge: function(args) {
		// Add each individual item to the collection.
	},

	get: function(args) {
		if(args == null) return void 0;
		if(_.isObject(args)) return _.find(this.objects, args);
		return this._byId[args.id] || this._byId[args.primaryKey] || this._byId[args];
	},
	set: function(args, options) {
		if(args instanceof collection) {
			// this.merge(collection);
			// return this;
			// args = args.objects;
		}
		options || (options = {});
		var index;
		var toAdd = [];
		// Add by id.
		// Add to sorted array.
		if(!Array.isArray(args)) args = [args];
		args.forEach(function(item, key) {

			var obj, exists;
			var id = item.id;

			if(exists = this.get(id)) {
				// Exists. Update.
				if(options.update) {
					exists = item;
					obj = this.find({id: id});
					obj = item;
				}
				
			}
			else {
				// Doesn't exist. Add.
				if(options.add) {
					obj = this._prepareObject(item);
					toAdd.push(obj);
				}
			}

		}, this);

		if(toAdd.length > 0) {
			toAdd.forEach(function(item) {
				// Sort
				index = _.sortedIndex(this.objects, item, function(item) {
					return item.get("word").toLowerCase();
				});
				this.objects.splice(index ,0 , item);
				this._byId[item.id] = item;
			}, this);
		}
		return this;
	},

	clone: function() {
		return new this.constructor(this.objects);
    },

	slice: function() {
		return slice.apply(this.objects, arguments);
	},

	// Return object when passed an id.
	at: function(index) {
		return this.objects[index];
	},
	// Function to create the hashes used in identifying the result.
	hash: function(str) {
		if(!str) return void 0;
		var hash = 0, i, ch;
		for (i = 0, l = str.length; i < l; i++) {
		    ch  = str.charCodeAt(i);
		    hash  = ((hash<<5)-hash)+ch;
		    hash |= 0; // Convert to 32bit integer
		}
		return hash;
	}

});

var methods = ['find', 'indexOf', 'forEach', 'filter'];

_.each(methods, function(method) {
	collection.prototype[method] = function() {
		var args = Array.prototype.slice.call(arguments);
		args.unshift(this.objects);
		return _[method].apply(_, args);
	};
});



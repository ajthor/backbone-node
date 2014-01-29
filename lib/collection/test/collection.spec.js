var _ = require("lodash");

describe("collection", function() {

	var collection;

	it("should load without throwing", function() {
		expect(function() {
			collection = require("../collection.js");
		}).not.toThrow();
	});

	it("should contain an array of items", function() {
		var instance = new collection();
		expect(instance._byId).not.toBeUndefined();
	});

	it("should contain a collection of objects", function() {
		var instance = new collection();
		expect(instance.objects).not.toBeUndefined();
	});

	it("should contain the basic collection functions", function() {
		var instance = new collection();
		expect(instance.add).toBeDefined();
		expect(instance.remove).toBeDefined();
		expect(instance.create).toBeDefined();
		expect(instance.get).toBeDefined();
		expect(instance.set).toBeDefined();
		expect(instance.at).toBeDefined();
		expect(instance.hash).toBeDefined();
		expect(instance._factory).toBeDefined();
	});

	// describe("factory function", function() {
	// 	it("should return an object", function() {
	// 		var instance = new collection();

	// 		var word = function(word) {
	// 			this.word = word;
	// 		};

	// 		instance._template = word;
	// 		instance.create("Hello");
	// 		instance.create("there");
	// 		instance.create("world");

	// 		// console.log(instance.objects);

	// 		instance.remove({word: "there"});

	// 		// console.log(_.find(instance.objects, {word: "there"}));

	// 		// console.log(instance.objects);

	// 	});
	// });

	describe("factory function", function() {
		it("should return an object", function() {
			var instance = new collection(String);

			instance.create(new String("hello"));
			console.log(instance.objects[0]);

		});
	});

});
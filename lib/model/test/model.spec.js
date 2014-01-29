var _ = require("underscore");

describe("model", function() {

	var model;

	it("should load without throwing", function() {
		expect(function() {
			model = require("../model.js");
		}).not.toThrow();
	});

	it("should load without throwing", function() {
		var instance = new model();
		instance.set(23, "hello");
		instance.set("name", "Jones");
		instance.set({age: 42, gender: "male"});

		expect(instance.attributes).not.toEqual({});
		expect(instance.get("name")).toBe("Jones");
		
	});

});
define([
	'jquery',
	'backbone'
], function( $, Backbone){
	"use strict";

	var Product = Backbone.Model.extend({

		//urlRoot: "http://localhost:4242/api/products",

		//idAttribute: "_id",

		defaults: {
			name: "",
			brand: "",
			categories : [],
			images: [],
			variants :[]
		}
		// initialize: function(){
		// 	this.reports = new ProductCollection();
		// 	this.reports.url = 
		// }
	}),

	ProductCollection = Backbone.Collection.extend({
		model : Product,

		url : "http://localhost:4242/api/products",

		saved: function(){
			console.log('New item created...');
		}

		// nextId: function() {
		// 	return this.last().get('_id')
		// }
	});

	return {
		Product: Product,
		ProductCollection: ProductCollection
	}

});
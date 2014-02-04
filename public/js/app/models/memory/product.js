define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone) {
	
	'use strict';

	var products = [
		{
			"id" : 1,
			"name" : "Cotton t-shirt",
			"brand" : "American Apparel",
			"categories" : [
					{"name" : "apparel"},
					{"name" : "sporting goods"}
			],
			"images" : [
				{
					"kind" : "thumbnail",
					"url" : "img/products/1/thumbnail.jpg"
				},
				{
					"kind" : "catalog",
					"url" : "img/products/1/catalog.jpg"
				}
			]
		}, {
			"id" : 2,
			"name" : "Tennis racquet",
			"brand" : "Head",
			"categories" : [
					{"name" : "tennis gear"},
					{"name" : "sporting goods"}
			],
			"images" : [
				{
					"kind" : "thumbnail",
					"url" : "img/products/2/thumbnail.jpg"
				},
				{
					"kind" : "catalog",
					"url" : "img/products/2/catalog.jpg"
				}
			]
		}, {
			"id" : 3,
			"name" : "Beets",
			"brand" : "N/A",
			"categories" : [
					{"name" : "produce"},
					{"name" : "food"}
			],
			"images" : [
				{
					"kind" : "thumbnail",
					"url" : "img/products/3/thumbnail.jpg"
				},
				{
					"kind" : "catalog",
					"url" : "img/products/3/catalog.jpg"
				}
			], 
			"variants" : [
				{
					"color" : "Red",
					"images" : [],
					"sizes" : [
						{
							"size": "per lb.",
							"sku": "cat-3-red-perlb"
						},
						{
							"size": "unit",
							"sku": "cat-3-red-unit"
						}
					]
				}
			]
		}
	],

	findById = function(id) {
		var deferred = $.Deferred(),
			product = null,
			l = products.length,
			i;

		for(i = 0; i < l; i++) {
			if(products[i].id === id) {
				product = products[i];
				break;
			}
		}

		deferred.resolve(product);
		return deferred.promise();

	},

	findByName = function(searchKey) {
		var deferred = $.Deferred(),
			results = products.filter(function (element) {
				var name = element.name;
				return name.toLowerCase().indexOf(searchKey.toLowerCase()) > -1;
			});

			deferred.resolve(results);
			return deferred.promise();
	},

	findByCategory = function(category) {
		var deferred = $.Deferred(),
			category = [],
			l = products.length,
			i;

			for(i = 0; i < l; i++) {
				var categories = products[i].categories;

				var results = categories.filter(function( element ){
					var name = element.name;
					return name.toLoweCase().indexOf(searchKey.toLowerCase()) > -1;
				});

				category.push(results);
			}

			deferred.resolve(category);
			return deferred.promise();

	},

	Product = Backbone.Model.extend({

		initialize: function() {
			this.reports = new ReportsCollection();
			this.reports.parent = this;
		},

		sync: function(method, model, options) {
			if( method === 'read') {
				findById(parseInt(this.id)).done(function (data) {
					options.success(data);
				});
			}
		}
	}),

	ProductCollection = Backbone.Collection.extend({

		model: Product,

		sync : function(method, model, options) {
			if (method === "read") {
				findByName(options.data.name).done(function (data){
					options.success(data);
				});
			}
		}
	}),

	ReportsCollection = Backbone.Collection.extend({

		model: Product,

		sync: function(method, model, options) {
			if (method === "read") {
				findByCategory(options.data.category).done(function (data) {
					options.success(data);
				});
			}
		}
	});

	return {
		Product : Product,
		ProductCollection : ProductCollection,
		ReportsCollection : ReportsCollection 
	};

});
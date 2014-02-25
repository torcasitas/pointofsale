define([
	'jquery',
	'backbone'
], function( $, Backbone){
	"use strict";

	var Product = Backbone.Model.extend({

		//url: "http://localhost:4242/api/products",

		idAttribute: "_id",

		defaults: {
			name: "",
			brand: "",
			categories : [],
			images: [],
			variants :[]
		},
		
		// url : function() {
		//  	var uri = "http://localhost:4242/api/products/";

		//  	return this.id ? uri + this.id : uri;
		// }

		sync: function(method, model, options) {
			var uri = "http://localhost:4242/api/products/",
				self = this;
			if (method === 'update') {
				 var urlEnd = this.id ? uri + this.id : uri;
				 
				return $.ajax({
					dataType: 'json',
					type: 'PUT',
					url: urlEnd,
					data: model.attributes,
					success: function(data) {
						console.log('updated product successfully.');
						options.success();
					},
					error: function(err) {
						console.log('error updating');
						console.dir(err);
						options.error();
					}
				});
			
			} else if (method === 'create') {
				//return Backbone.sync.apply(this, arguments);
				var urlEnd  = uri;
				
				return $.ajax({
					dataType: 'json',
					type: 'POST',
					url: urlEnd,
					data: model.attributes,
					success: function(data) {
						console.log('added product sucessfully.');
						options.success({id: data._id });

					},
					error: function(err) {
						console.log('error adding product.');
						console.dir(err);
						options.error();
					}
				});


			}
		}

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
		ProductModel: Product,
		ProductCollection: ProductCollection
	}

});
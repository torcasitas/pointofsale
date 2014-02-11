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
			if (method === 'update') {
				var uri = "http://localhost:4242/api/products/",
				 urlEnd = this.id ? uri + this.id : uri,
				 self 	= this;

				return $.ajax({
					dataType: 'json',
					type: 'PUT',
					url: urlEnd,
					data: model.attributes,
					success: function(data) {
						console.log('updated product successfully.');
						self.trigger('change');
					},
					error: function(err) {
						console.log('error updating');
						console.dir(err);
					}
				});
			
			} else {

				return Backbone.sync.apply(this, arguments);
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
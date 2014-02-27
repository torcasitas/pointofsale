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

		validate: function(attrs) {
			var errorMsg = {};

			if (attrs.name === undefined || attrs.name === "") {
				errorMsg["name"] = "Set a name for the product";
			}

			if (attrs.brand === undefined || attrs.brand === "") {
				errorMsg["brand"] = "Set a brand for the product";
			}

			if( attrs.images.length > 0 ) {
				var imgs = attrs.images;

				errorMsg["imgKind"] = [];

				for(var i = 0, l = attrs.images.length ; i < l ; i ++) {

					var img = attrs.images[i];

					if(img.kind === undefined || img.kind === "" ) {
						errorMsg["imgKind"][i] = "Set a category for this image";
					}
				}
				
			}

			return errorMsg;
		},
		

		initialize: function() {
			console.log('Product model has been initialized.');
			this.on('invalid', function(model, error){
				console.log(error);
			});
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
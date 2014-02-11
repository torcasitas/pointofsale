define([
	'jquery',
	'underscore',
	'backbone',
	'app/views/productList',
	'app/models/product',
	'text!tpl/products.html'
], function ($, _, Backbone, ProductListView, models, productTemplate){
	'use strict';

	var template = _.template(productTemplate);

	var productView = Backbone.View.extend({

		events: {
			"click .new-product"		: "addNewProduct"
		},

		initialize: function(options) {
			_.bindAll(this, 'showProductListing');
			options.eventAgg.bind('showProductListing', this.showProductListing);

			this.eventAgg = options.eventAgg;

			this.collection.on('reset', this.render, this);
			
			

			// var productList = new models.ProductCollection();

			// productList.fetch({reset: true, data: {name: ''}, success: function(productModel) {
			// 		// Note that we could also 'recycle' the same instance of EmployeeFullView
   				//              	// instead of creating new instances
			// 		var productView = new ProductView({model: productModel, el: $pageContent });
			// 		productView.render();
			// 	}
			// });

			// this.listenTo(this.collection, 'reset', this.resetAll);
			// this.listenTo(this.collection, 'all', this.render);

			// this.collection.render();

		},

		render: function() {
			this.$el.html(template);

			var listView = new ProductListView({ collection: this.collection, eventAgg: this.eventAgg, el: $('.productList table > tbody', this.el)});
			listView.render();

			return this;
		},

		showProductListing: function(action) {
			var update = action ? action.update : false;
			
			if (update) {
				this.collection.fetch({reset: true});
			} else {
				this.render();
			}
		},

		addNewProduct: function() {
			this.eventAgg.trigger('editProduct');
		}

	});

	return productView;
});
define([
	'jquery',
	'underscore',
	'backbone',
	'app/views/productList',
	'text!tpl/products.html'
], function ($, _, Backbone, ProductListView, productTemplate){
	'use strict';

	var template = _.template(productTemplate);

	var productView = Backbone.View.extend({

		initialize: function() {


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

			var listView = new ProductListView({ collection: this.collection, el: $('.productList table > tbody', this.el)});
			listView.render();

			return this;
		}
	});

	return productView;
});
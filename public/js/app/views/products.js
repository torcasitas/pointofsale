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

		render: function() {
			this.$el.html(template);

			var listView = new ProductListView({ collection: this.model, el: $('.productList table > tbody', this.el)});
			listView.render();

			return this;
		}
	});

	return productView;
});
define([
	'jquery',
	'underscore',
	'backbone',
	'app/views/productListItem'
], function ($, _, Backbone, ProductListItem) {
	"use strict";

	var productListView = Backbone.View.extend({

		initialize : function() {
			this.collection.on("reset", this.render, this);
			this.collection.on("add", this.render, this);
		},

 		render : function() {
 			this.$el.empty();

 			_.each(this.collection.models, function (product){
 				this.$el.append(new ProductListItem({ model: product}).render().el);
 			}, this);

 			return this;
 		}
	});

	return productListView;

});
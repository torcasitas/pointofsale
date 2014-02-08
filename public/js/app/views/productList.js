define([
	'jquery',
	'underscore',
	'backbone',
	'app/views/productListItem'
], function ($, _, Backbone, ProductListItem) {
	"use strict";

	var eventAgg = _.extend({}, Backbone.Events);

	var productListView = Backbone.View.extend({

		initialize : function(options) {
			this.eventAgg = options.eventAgg;
			this.collection.on("reset", this.render, this);
			this.collection.on("add", this.render, this);
		},

 		render : function() {
 			this.$el.empty();

 			var eventAgg = this.eventAgg;

 			_.each(this.collection.models, function (product){
 				this.$el.append(new ProductListItem({ model: product, eventAgg: eventAgg }).render().el);
 			}, this);

 			return this;
 		}
	});
	
	return productListView;

});
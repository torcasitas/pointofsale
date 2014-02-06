define([
	'jquery',
	'underscore',
	'backbone',
	'app/views/categoryItem'
], function($, _, Backbone, CategoryItemView) {
	"use strict";

	var categoryListView = Backbone.View.extend({

		initialize: function() {
			//this.collection.on("reset", this.render, this);
			this.collection.on("add", this.addOne, this);	
			this.collection.on("remove", this.removeModel, this);		
						
		},

		addOne: function(categoryModel) {
			//this.$el.empty();
			//_.each(this.collection.models, function(category) {
			this.$el.append(new CategoryItemView({ model: categoryModel }).render().el );
			//}, this);
		},

		removeModel: function(categoryModel) {			
			categoryModel.destroy();
		}
	});

	return categoryListView;
});
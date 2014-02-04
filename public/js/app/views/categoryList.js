define([
	'jquery',
	'underscore',
	'backbone',
	'app/views/categoryItem'
], function($, _, Backbone, CategoryItemView) {
	"use strict";

	var categoryListView = Backbone.View.extend({

		initialize: function() {
			this.collection.on("reset", this.render, this);
			this.collection.on("add", this.render, this);
			this.collection.on("remove", this.render, this);
		},

		render: function() {
			this.$el.empty();

			_.each(this.collection.models, function(category) {
				this.$el.append(new CategoryItemView({ model: category }).render().el );
			}, this);
		}
	});

	return categoryListView;
});
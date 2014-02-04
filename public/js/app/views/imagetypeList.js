define([
	'jquery',
	'underscore',
	'backbone',
	'app/views/imagetypeItem'
], function( $, _, Backbone, ImageTypeItemView) {
	"use strict";

	var imagetypeListView = Backbone.View.extend({

		initialize: function() {
			this.collection.on("reset",  this.render, this);
			this.collection.on(  "add",  this.render, this);
			this.collection.on("remove", this.render, this);
		},

		render: function() {
			this.$el.empty();

			_.each(this.collection.models, function(imageType) {
				this.$el.append(new ImageTypeItemView({model: imageType}).render().el );
			}, this);
		}
	});

	return imagetypeListView;	

});
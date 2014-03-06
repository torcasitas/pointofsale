define([
	'jquery',
	'underscore',
	'backbone',
	'app/views/imagetypeItem'
], function( $, _, Backbone, ImageTypeItemView) {
	"use strict";

	var imagetypeListView = Backbone.View.extend({

		initialize: function(options) {
			this.collection.on("add",  this.render, this);
			this.collection.on("remove", this.removeItem, this);
			//this.collection.on("change", this.changeKindImage, this );

			this.eventAgg = options.eventAgg;

		},

		render: function(imageItem) {
			this.$el.append(new ImageTypeItemView({model: imageItem, eventAgg: this.eventAgg }).render().el);
		},

		removeItem: function(model) {
			model.destroy();
			// this.eventAgg.trigger('removeImageFile', model.attributes.file);
		}
	});

	return imagetypeListView;	

});
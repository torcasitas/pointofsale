define([
	'jquery',
	'underscore',
	'backbone',
	'text!tpl/productListItem.html'
], function ($, _, Backbone, tpl){
	"use strict";

	var template = _.template(tpl);

	var productListItemView = Backbone.View.extend({

		tagName: "tr",

		initialize: function() {
			this.model.on("change", this.render, this);
		},

		render: function() {
			var output = this.model.attributes,
				formatData = {};

			// Parse data
			formatData["id"] = output.id;
			formatData["name"] = output.name;
			formatData["brand"] = output.brand;
			formatData["categories"] = _.map(output.categories, function(item){
											return item.name;
										}).join(', ');
			var variants = _.map(output.variants, function(variant) {
				var color = variant.color;
				var sizes = _.map(variant.sizes, function(sizeItem){
				    	return sizeItem.size;
				    }).join(', ');
				return color + ((sizes.length > 0 ) ? " - Sizes : " + sizes : "");
			});

			formatData["variants"] = variants;
			var thumbnail = _.filter(output.images, function(image) {
				return (image.kind === "thumbnail");
			});

			formatData["thumbnail"] = thumbnail[0].url;

			this.$el.html(template(formatData));
			return this;
		}

	});

	return productListItemView;

});
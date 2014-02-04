define([
	'jquery',
	'underscore',
	'backbone',
	'text!tpl/imagetypeitem.html'
], function($, _, Backbone, tpl) {
	"use strict";

	var imagetypeItemView = Backbone.View.extend({

		tagName: "li",
		template: _.template(tpl),

		events : {
			"click .remove": "removeItem"
		},

		initialize: function() {
			this.model.on("change", this.render, this);
			this.model.on("destroy", this.render, this);
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));

			return this;
		},

		removeItem: function(ev) {
			ev.preventDefault();
			this.model.destroy();
		}

	});

	return imagetypeItemView;
});
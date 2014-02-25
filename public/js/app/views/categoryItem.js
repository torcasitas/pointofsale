define([
	'jquery',
	'underscore',
	'backbone',
	'text!tpl/categoryitem.html'
], function($, _, Backbone, tpl) {
	"use strict";


	var categoryItemView = Backbone.View.extend({

		tagName : "li", 
		template: _.template(tpl),

		events: {
			"click button": "removeItem"
		},

		initialize : function() {
			this.model.on("change", this.render, this);
			this.model.on("destroy", this.remove, this);
		},

		render: function() {
			console.log('Category model has changed');
			this.$el.html(this.template(this.model.toJSON()));

			return this;
		},

		removeItem: function(){
			this.model.destroy();
		}

	});

	return categoryItemView;
});
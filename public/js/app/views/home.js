define([
	'jquery',
	'underscore',
	'backbone',
	'text!tpl/home.html'
], function($, _, Backbone, homeTemplate) {
	
	'use strict';

	var template = _.template(homeTemplate),
		$menuItems;

	var homeView = Backbone.View.extend({

		render : function(){
			this.$el.html(template);
		}		

	});

	return homeView;

});
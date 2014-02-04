define([
	'jquery',
	'underscore',
	'backbone',
	'text!tpl/mainmenu.html'
], function($, _, Backbone, menuTemplate) {
	
	'use strict';

	var template = _.template(menuTemplate),
		$menuItems;

	var menuView = Backbone.View.extend({

		render : function() {
			this.$el.html(template);
			$menuItems = $('.main-menu > .nav li', this.$el);
			return this;
		},

		// events : {
		// 	""
		// }

		selectMenuItem : function(menuItem){
			$menuItems.removeClass('active');

			if(menuItem) {
				$('.' + menuItem).addClass('active');
			}
		}

	});

	return menuView;

});
define([
	'underscore',
	'backbone'
], function(_, Backbone) {
	'use strict';

	var CategoryItem = Backbone.Model.extend({

		defaults: {
			name: ''
		}

	}),

	CategoryCollection = Backbone.Collection.extend({
		model: CategoryItem
	});

	return {
		CategoryItem : CategoryItem,
		CategoryCollection : CategoryCollection
	};

	
});
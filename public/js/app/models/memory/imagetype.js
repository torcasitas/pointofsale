define([
	'underscore',
	'backbone'
], function(_, Backbone) {
	'use strict';

	var ImageTypeItem = Backbone.Model.extend({

		defaults: {
			type: '',
			imageFile: ''
		}

	}),

	ImageTypeCollection = Backbone.Collection.extend({
		model: ImageTypeItem
	});

	return {
		ImageTypeItem : ImageTypeItem,
		ImageTypeCollection : ImageTypeCollection
	};

	
});
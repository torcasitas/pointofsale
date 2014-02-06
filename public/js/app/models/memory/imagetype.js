define([
	'underscore',
	'backbone'
], function(_, Backbone) {
	'use strict';

	var ImageTypeItem = Backbone.Model.extend({

		defaults: {
			type: '',
			url: ''
		},

		sync: function(method, model, options) {
			if (method == 'read') {
				return Backbone.sync.apply(this, arguments);
			}
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
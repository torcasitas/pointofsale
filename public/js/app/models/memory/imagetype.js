define([
	'underscore',
	'backbone'
], function(_, Backbone) {
	'use strict';

	var ImageTypeItem = Backbone.Model.extend({

		defaults: {
			kind: '',
			name: ''
			//type: 'Icon'
		},

		validate: function(attrs, options) {

			if(attrs.kind === undefined || attrs.kind === '') {
				return "Select a category for this image";
			}

		},

		sync: function(method, model, options) {
			if (method == 'read') {
				return Backbone.sync.apply(this, arguments);
			}
		}
		


	}),

	ImageTypeCollection = Backbone.Collection.extend({
		model: ImageTypeItem,

		findKind : function(value) {
			// return this.filter(function (imageItem) {
			// 	return imageItem.get('kind')
			// });
			return this.where({kind: value});
		}
	});

	return {
		ImageTypeItem : ImageTypeItem,
		ImageTypeCollection : ImageTypeCollection
	};

	
});
define([
	'underscore',
	'backbone'
], function(_, Backbone) {
	'use strict';

	// var categories = [
	// 	{
	// 		"_id"  : "cat_0001",
	// 		"name" : "Foods"
	// 	},
	// 	{
	// 		"_id"  : "cat_0002",
	// 		"name" : "Outdoor Gear"
	// 	},
	// 	{
	// 		"_id"  : "cat_0003",
	// 		"name" : "Utilities"
	// 	}
	// ],

	// findById = function(id) {
	// 	var deferred = $.Deferred(),
	// 		category = null, 
	// 		l = categories.length,
	// 		i;

	// 	for(i =0; i < l; i++){
	// 		if(categories[i]._id === id) {
	// 			category = categories[i];
	// 			break;
	// 		}
	// 	}

	// 	deferred.resolve(category);
	// 	return deferred.promise();
	// },

	var CategoryItem = Backbone.Model.extend({

		defaults: {
			name: ''
		}, 

		sync: function(method, model, options) {
			if (method === 'read') {
				//return Backbone.sync.apply(this, arguments)
				// findById(this.id).done( function(data) {
				// 	options.success(data);
				// });
			}
		}

	}),

	CategoryCollection = Backbone.Collection.extend({
		model: CategoryItem,

		sync : function(method, model, options) {
			if(method === 'read') {
				return Backbone.sync.apply(this, arguments);
			}
		}

	});

	return {
		CategoryItem : CategoryItem,
		CategoryCollection : CategoryCollection
	};

	
});
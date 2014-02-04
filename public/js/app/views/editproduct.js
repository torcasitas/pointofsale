define([
	'jquery',
	'underscore',
	'backbone',
	'app/models/product',
	'app/models/memory/categories',
	'app/models/memory/imagetype',
	'app/views/categoryList',
	'app/views/imagetypeList',
	'text!tpl/editproduct.html'
], function ($, _, Backbone,  productModels , CategoryModel, ImageTypeModel, CategoryListView, ImageTypeListView , editProductTpl) {
	'use strict';

	var template = _.template(editProductTpl);

	var categoryCollection = new CategoryModel.CategoryCollection();
	var imagetypeCollection = new ImageTypeModel.ImageTypeCollection();

	var editProductView = Backbone.View.extend({

		events: {
			"click button.addCategory" 				: "addCategory",
			"click button.addImage"	 				: "addImage",
			"click .category-items button" 			: "removeCategory",
			"submit form"							: "saveProduct"
		},

		initialize: function() {
			this.collection = new productModels.ProductCollection();
			this.$form = null;
			this.$inputCategory = null;
			this.categories = [];

			this.categoryListView = null;
			this.imagetypeListView = null;

			// this.listenTo(categoryCollection, 'add', 	this.addCategory);
			// this.listenTo(categoryCollection, 'remove', this.removeCategory);

		},

		render: function() {
			var data = this.model.attributes;
			this.$el.html(template(data));
			this.$form = $("form", this.$el);
			this.$inputCategory = $("#inputCategory", this.$el);
			this.$inputImageType = $("#inputImageType", this.$el);
			this.$inputFileImage = $("#inputFileImage", this.$el);
			this.$hiddenCategories = $("#hiddenCategories", this.$el);

			this.categoryListView = new CategoryListView({ collection: categoryCollection , el: $('.category-items > ul', this.el) });
			this.imagetypeListView = new ImageTypeListView({ collection: imagetypeCollection , el: $('.imagetype-list > ul', this.el) });
		
			this.categories = [];

			return this;
		},

		addCategory: function(ev) {
			var category = this.$inputCategory.val(),				
				item = { "name" : category };

				if( !_.findWhere( categoryCollection.toJSON(), item) ) {
					categoryCollection.create(item);
				}
		},

		addImage: function(ev) {
			ev.preventDefault();
			var imageType = this.$inputImageType.val(),
				imageName = this.$inputFileImage.val(),
				item = {
					"type" : imageType,
					"imageFile" : imageName
				}

				if( !_.findWhere( imagetypeCollection.toJSON(), item )) {
					imagetypeCollection.create(item);
				}

		},	

		saveProduct: function(ev) {
			ev.preventDefault();
			console.log("Submitting form...");

			var formName = this.$form.attr("name");

			if (formName === "NewProductForm") {
				var newProduct = {},
					categories, images;

				newProduct["name"] = $("#inputName", this.$form).val();

				//parse categories into an array of objects
				categories = $("#inputCategories", this.$form).val().split("|");
				categories = (categories.length > 0) ? _.map(categories, function(value) { return {"name" : value}; }) : [];

				newProduct["name"] = $("#inputName", this.$form).val();
			}
		}
	});

	return editProductView;
});
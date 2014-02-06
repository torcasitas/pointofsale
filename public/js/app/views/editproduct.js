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
], function ($, _, Backbone,  ProductModel , CategoryModel, ImageTypeModel, CategoryListView, ImageTypeListView , editProductTpl) {
	'use strict';

	var template = _.template(editProductTpl);

	var categoryCollection = new CategoryModel.CategoryCollection();
	var imagetypeCollection = new ImageTypeModel.ImageTypeCollection();
	var productCollection = new ProductModel.ProductCollection();

	var editProductView = Backbone.View.extend({

		events: {
			"click button.addCategory" 				: "addCategory",
			"click button.addImage"	 				: "addImage",
			"click .category-items button" 			: "removeCategory",
			"submit form"							: "saveProduct"
		},

		initialize: function() {
			//this.collection = new ProductModel.ProductCollection();
			this.$form = null;
			this.$inputCategory = null;
			this.categories = [];

			this.listenTo(productCollection, 'add', 	this.addProduct);
			// this.listenTo(categoryCollection, 'remove', this.removeCategory);

			//this.listenTo(categoryCollection, 'add', 	this.addCategory);
			//this.listenTo(categoryCollection, 'add', 	this.addCategory);

		},

		render: function() {
			var data = this.model.attributes;
			this.$el.html(template(data));
			this.$form = $("form", this.$el);
			this.$inputProductName = $("#inputName", this.$el);
			this.$inputBrand = $("#inputBrand", this.$el);
			this.$inputCategory = $("#inputCategory", this.$el);
			this.$inputImageType = $("#inputImageType", this.$el);
			this.$inputFileImage = $("#inputFileImage", this.$el);
			this.$categoriesEl = $(".category-items > ul", this.$el);
			this.$imageTypesEl = $(".imagetype-list > ul", this.$el);

			this.categoryListView = new CategoryListView({ 
					collection: new CategoryModel.CategoryCollection(),
					el: this.$categoriesEl
			});

			this.imagetypeListView = new ImageTypeListView({ 
					collection: imagetypeCollection,
					el: this.$imageTypesEl
			});
		
			this.categories = [];

			return this;
		},

		addProduct: function(ev) {
			console.log('New product added');
			this.clearInputFields();
		},

		addCategory: function(ev) {
			var category = this.$inputCategory.val(),				
				item = { "name" : category },
				catCollection = this.categoryListView.collection;

				if( !_.findWhere( catCollection.toJSON(), item) ) {
					catCollection.create(item);
				}
		},



		addImage: function(ev) {
			ev.preventDefault();
			var imageType = this.$inputImageType.val(),
				imageName = this.$inputFileImage.val(),
				item = {
					"kind" : imageType,
					"url" : imageName
				}

				if( !_.findWhere( imagetypeCollection.toJSON(), item )) {
					imagetypeCollection.create(item);
				}

		},

		newAttributes: function() {
			var catCollection = this.categoryListView.collection,
				imgTypeCollection = this.imagetypeListView.collection;

			return {
				"name" : this.$inputProductName.val(),
				"brand" : this.$inputBrand.val(),
				"categories" : catCollection.toJSON(),
				"images" : imgTypeCollection.toJSON(),
				"variants" : []
			}
		},

		clearInputFields: function() {
			var catCollection = this.categoryListView.collection,
				imgTypeCollection = this.imagetypeListView.collection;
				self = this;

			this.$inputProductName.val("");
			this.$inputBrand.val("");
			catCollection.remove(catCollection.models);
			imgTypeCollection.remove(imgTypeCollection.models);
			
			return false;
		},

		saveProduct: function(ev) {
			ev.preventDefault();
			console.log("Submitting form...");

			productCollection.create(this.newAttributes(), { wait: true } );

		}

	});

	return editProductView;
});
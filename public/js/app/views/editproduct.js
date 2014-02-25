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
], function ($, _, Backbone,  models , CategoryModel, ImageTypeModel, CategoryListView, ImageTypeListView , editProductTpl) {
	'use strict';


	var template = _.template(editProductTpl);

	var productCollection = new models.ProductCollection();

	var editProductView = Backbone.View.extend({

		events: {
			"click button.addCategory" 				: "addCategory",
			"click a.addimg-btn"	 				: "addImage",
			"click a.delimg-btn"	 				: "removeImage",
			// "change #inputFileImage"	 			: "addImages",
			"click .category-items button" 			: "removeCategory",
			//"submit form[name='productForm']"		: "saveProduct",
			"click #saveChanges"					: "saveProduct",
			"click a.back"							: "showProductListing",
		},

		initialize: function(options) {
			_.bindAll(this, 'editProduct');
			options.eventAgg.bind('editProduct', this.editProduct);

			this.eventAgg = options.eventAgg;

			this.uploadImagesEndpoint = 'http://localhost:4242/api/products/uploadImages';

			this.categoryCollection = null;
			this.imagetypeCollection = null;

			this.modifiedImages = null;

			this.listenTo(productCollection, 'add', 	this.addProduct);
		
			// this.listenTo(categoryCollection, 'remove', this.removeCategory);

			//this.listenTo(categoryCollection, 'add', 	this.addCategory);
			//this.listenTo(categoryCollection, 'add', 	this.addCategory);

		},

		render: function() {
			var data = this.model.attributes;

			if(this.model) {
				this.model.off('change');
				this.model.on('change',	this.updateModel, this);
			}

			// Render the template with first level data.
			this.$el.html(template(data));

			this.$form = $("form", this.$el);
			this.$inputProductName = $("#inputName", this.$el);
			this.$inputBrand = $("#inputBrand", this.$el);
			this.$inputCategory = $("#inputCategory", this.$el);
			this.$inputFileImage = $("#inputFileImage", this.$el);
			this.$categoriesEl = $(".category-items > ul", this.$el);
			this.$imageTypesEl = $(".imagetype-list > ul", this.$el);
			
			// Create the Category and Image Views with empty collection
			this.categoryListView = new CategoryListView({ 
					collection: new CategoryModel.CategoryCollection(),
					el: this.$categoriesEl
			});
		
			this.imagetypeListView = new ImageTypeListView({ 
					collection: new ImageTypeModel.ImageTypeCollection(),
					el: this.$imageTypesEl
			});

			// Populate the collections if the current model contains any data. 
			_.each(data.categories, function(category) {
				this.categoryListView.collection.create(category);
			}, this);

			if (typeof data._id != 'undefined') {
				_.map(data.images, function(item ) {
					item["prdId"] = data._id;
					return item;
				});

			}

			_.each(data.images, function(image) {
				this.imagetypeListView.collection.create(image);
			}, this);
			
			return this;
		},

		editProduct: function(product) {
			if(!product) {
				this.model = new models.ProductModel();
				this.model.attributes["action"] = "New";
				this.render();
				return;
			}	
			
			this.model = product;
			this.render();
		},

		updateModel: function(model) {			

			// this.eventAgg.trigger('showProductListing', {update: true});
			// this.clearInputFields();
			var self = this;
			var newData = model.toJSON();
			// Product has been added to Store, time to upload pics 

			this.uploadImages({
				success: function(e) {
					//self.eventAgg.trigger('showProductListing', {update: true});
					//self.clearInputFields();
					self.showProductListing(null, true);
				}, 
				error: function() {
					//console.log('Error uploading images to the server');
					console.log('Number is not greater than 50');
				}, 
				rData : { 
					id : newData._id,
					images : newData.images,
					replaceImages : this.modifiedImages			  // Add 		
				}
			});


		},

		addProduct: function(model) {			
			var self = this;
			var newData = model.toJSON();
			// Product has been added to Store, time to upload pics 

			this.uploadImages({
				success: function(e) {
					//self.eventAgg.trigger('showProductListing', {update: true});
					//self.clearInputFields();
					self.showProductListing(null, true);
				}, 
				error: function() {
					//console.log('Error uploading images to the server');
					console.log('Number is not greater than 50');
				}, 
				rData : { 
					id : newData.id,
					images : newData.images					
				}
			});

		},

		uploadImages: function(options) {
			var self 			= this,
				id 				= options.rData.id,
				images 			= options.rData.images,
				replaceImages	= options.rData.replaceImages,	
				$filesEl 	= $('form[name="imageListForm"] input[type="file"]'),
				fileData 	= new FormData();

			if(!$filesEl.length) {
				console.log('No images added.');
				options.success();
				return;
			}

			var appendFileData = function(item, index) {
				var kind = (typeof item.kind != 'undefined') ? item.kind : (images[index] && images[index].kind);
				fileData.append('file_' + id + '_' + kind.toLowerCase(), (!item.files) ? item.file : file.files[0]);
			};

			var files = (replaceImages.length > 0 ) ? replaceImages : $filesEl;
			_.each(files, appendFileData);

			$.ajax({
				url: self.uploadImagesEndpoint,
				type: 'POST',
				data: fileData,
				cache: false,
				dataType: 'json',
				processData: false,
				contentType: false,
				success: function(data, status, jqXHR) {
					console.log('Success uploading files');
					options.success();
				},
				error: function(jqXHR, status, error) {
					console.log('error uploading files');
				}
			});

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

			var item = {
					"id" : '',
					"kind" : '',
					"name" : 'No image.',
					"type" : ''
				},
				imagetypeCollection = this.imagetypeListView.collection;

			// // Check the image doesn't exist in the collection
			// if( !_.findWhere( imagetypeCollection.toJSON(), item )) {
			imagetypeCollection.create(item);

			//}

		},

		removeImage: function(ev){
			ev.preventDefault();
			var imagetypeView = this.imagetypeListView,
				imagetypeCollection = imagetypeView.collection,
				lastItem = imagetypeCollection.size() - 1;

			if(lastItem > -1) {
				var lastImageItem = imagetypeCollection.get(imagetypeCollection.models[lastItem]);
					imagetypeCollection.remove(lastImageItem);
			}

		},

		newAttributes: function() {
			var catCollection = this.categoryListView.collection,
				imgTypeCollection = this.imagetypeListView.collection;

				this.modifiedImages = [];

				_.each(imgTypeCollection.models, function(imgItem) {
					if (imgItem.get("changed")) {
						this.modifiedImages.push(imgItem.toJSON());
					}

					imgItem.unset("type", {silent:true});
					imgItem.unset("file", {silent:true});
					imgItem.unset("kindImages", {silent:true});
				}, this);  

			return {
				"name" : this.$inputProductName.val(),
				"brand" : this.$inputBrand.val(),
				"categories" : catCollection.toJSON(),
				"images" : imgTypeCollection.toJSON(),
				"variants" : []
			};
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
			var action = this.model.attributes['action'];
			
			console.log("Submitting form...");

			if (action == 'New') {
				productCollection.create(this.newAttributes(), { wait: true } );
			} else if (action == 'Edit') {
				var updatedModel = this.newAttributes();
					//this.model.set(this.newAttributes());	
					this.model.save(updatedModel, {wait: true});
			}

		},

		showProductListing: function(ev, willUpdate) {
			if (ev != null) ev.preventDefault();

			var updateListing = (typeof willUpdate != 'undefined') ? willUpdate : false;
			
			this.eventAgg.trigger('showProductListing', {update: updateListing});
			this.clearInputFields();
		}

	});

	return editProductView;
});
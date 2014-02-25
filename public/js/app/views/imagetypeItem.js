define([
	'jquery',
	'underscore',
	'backbone',
	'text!tpl/imagetypeitem.html'
], function($, _, Backbone, tpl) {
	"use strict";

	var imagetypeItemView = Backbone.View.extend({

		tagName: "li",
		template: _.template(tpl),

		events : {
			"click .remove"								: "removeItem",
			"change select[name='inputImageType[]']" 	: "changeCategory",
			"focus select[name='inputImageType[]']" 	: "cacheOldCategory",
			"change input[name='inputImageFile[]']" 	: "changeImage",
		},

		initialize: function() {			
			this.imageTypes = ['Main', 'Icon'];  		// Predefined kinds of images

			this.model.on("change", this.render, this);
			this.model.on("destroy", this.remove, this);

			this.$inputImageType = null;

			this.oldImageType = '';
		},

		render: function(options) {
			this.model.attributes["imageTypes"] = this.imageTypes;

			this.$el.html(this.template(this.model.toJSON()));

			this.$el.find(':file').filestyle({input: false, buttonText: "Select file", classButton: "btn btn-primary"});
			this.$inputImageType = this.$el.children('select[name="inputImageType[]"]');

			return this;
		},

		cacheOldCategory: function(ev) {
			this.oldImageType = ev.target.selectedIndex;
		},

		changeCategory: function(ev) {
			var el = ev.target,
				kindValue = el.options[el.selectedIndex].value,
				collection = this.model.collection;

				ev.preventDefault();

			if (kindValue != "") {
				var kindIsSet = (collection.findKind(kindValue).length > 0);

				if(!kindIsSet){
					this.model.set({"kind" : kindValue });
				} else {
					ev.target.selectedIndex = this.oldImageType;
				}
			}
		},

		changeImage: function(ev) {
			var el = ev.target,
				files = el.files;

			if(files.length > 0) {
				var file 		= files[0],
					thumbnail 	= this.$el.find('.thumbnail-wrap > img'),
					label 		= this.$el.find('.name '),
					removeBtn	= this.$el.find('.remove '),
					fileReader 	= new FileReader();
					
				this.model.set({ "file" : file }, {silent: true});
				this.model.set({ "name" : file.name }, {silent: true});
				this.model.set({ "changed" : true }, {silent: true});			

				fileReader.onload = (function(theFile) {
					return function(e) {
						thumbnail.attr('src', e.target.result);
						thumbnail.attr('title', theFile.name);
						label.html(theFile.name);
						thumbnail.show();
						label.show();
						removeBtn.show();
					}
				})(file);

				fileReader.readAsDataURL(file);

			}
		},

		removeItem: function() {
			this.model.destroy();
		}
	});

	return imagetypeItemView;
});
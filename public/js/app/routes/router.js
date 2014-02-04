define([
	'jquery',
	'underscore',
	'backbone',
	'app/views/menuview',
	'app/views/home'
], function($, _, Backbone, MenuView, HomeView) {
	
	"use strict";

	var $body = $('body'),
		menuView = new MenuView({el: $body}).render(),
		$pageContent = $('.container.main', menuView.el),
		homeView = new HomeView({el: $pageContent});

	var appRouter = Backbone.Router.extend({
		
		routes: {
			'' : 'home',
			'products' : 'products',
			// 'products/:id' : 'productDetails',
			'products/:action' : 'editProduct'
		},

		home: function() {
			homeView.render();
			menuView.selectMenuItem('home-menu');
		},

		products: function() {
			require(['app/views/products', 'app/models/product'], function(ProductView, models) {
				
				menuView.selectMenuItem('product-menu');

				var productList = new models.ProductCollection();

					productList.fetch({reset: true, data: {name: ''}, success: function(productModel) {
							// Note that we could also 'recycle' the same instance of EmployeeFullView
                        	// instead of creating new instances
							var productView = new ProductView({model: productModel, el: $pageContent });
							productView.render();
						}
					});
			});
		}, 

		editProduct: function(action) {

			switch(action) {
				case 'new':
				case 'edit':
					require(['app/views/editproduct', 'app/models/product'], function(EditProductView, models) {
							var productModel = new models.Product();

								productModel.attributes["action"] = "New";

							var editProductView = new EditProductView({model: productModel,  el: $pageContent });
							editProductView.render();

					});
					break;

				default:
				break;			
			}
		}

	});

	return appRouter;

});
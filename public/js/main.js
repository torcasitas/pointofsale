
'use strict';

//Require.js allows us to configure shortcut alias 

require.config({
	// The shim config allows us to configure dependencies for scripts that do not call define() to register a module
	baseUrl: 'js/lib',

	paths : {
		jquery : './jquery/jquery',
		underscore : './underscore/underscore',
		backbone : './backbone/backbone',
		backboneLocalstorage : './backbone.localStorage/backbone.localStorage',
		bootstrap : './bootstrap/dist/js/bootstrap.min',
		text : './requirejs-text/text',
		app : '../app',
		tpl : '../tpl'

	},

	map : {
		'*' : {
			//'app/models/product' : 'app/models/memory/product'
			'app/models/product' : 'app/models/json/product'
		}
	},

	shim: {
		underscore: {
			exports: '_'
		},
		bootstrap: {
			deps : ['jquery']
		},
		backbone: {
			deps: [
				'underscore',
				'jquery'
			],
			exports: 'Backbone'
		},
		backboneLocalstorage: {
			deps : ['backbone'],
			exports : 'Store'
		}
	}	

});


require(['jquery', 'backbone','app/routes/router', 'bootstrap'], function($ ,Backbone, Router) {

	//Initialize routing and start Backbone.history()
	var router = new Router();
	Backbone.history.start();

	Backbone.emulateHTTP = true;
	Backbone.Model.prototype.idAttribute = "_id";

	// // Initialize the application view
	// new AppView();
});
/*define([
	'jquery',
	'underscore',
	'backbone',
	
	'text!templates/main.html'
], function($, _, Backbone, ) {
	'use strict';

	var AppView = Backbone.View.extend({

		el: '#viconapp',

		template: _.template(mainTemplate),

		events: {
			'keypress #new' : 'createOnEnter',
			'click #clear' : 'clearCompleted'
		},

		
			// At initialization we bind to the relevant events on the 'Todos'
			// collection, when items are added or changed. kick things ogg by 
			// loading any preexisting todos that might be saved *localStorage*
		
		initialize: function(){

			this.$main = this.$('#main'); 

			this.listenTo(Todos, 'add', this.addOne);
			// this.listenTo(Todos, 'reset', this.addAll);
			// this.listenTo(Todos, 'change:completed', this.filterOne);
			// this.listenTo(Todos, 'filter', this.filterAll);
			this.listenTo(Todos, 'all', this.render);

			Todos.fetch();
		},
 
		render: function() {
			var active = Todos.active().length;
			
			if (Todos.length){

				this.$main.html(this.template({
					active: active;
					})
				);

			} else 
				this.$main.hide();
			}
		},

		addOne: function(todo) {
			console.log("Todo : " + todo);
		}

	});


});*/
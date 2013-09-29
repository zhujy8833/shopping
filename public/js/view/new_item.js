define(["backbone", "jquery", "mustache", "text!templates/new.mustache.html"],
    function(Backbone, $, Mustache, new_item_template){
        var NewItemView = Backbone.View.extend({
            tagName: "div",
            initialize : function() {
                var view = this;
                view.render();
                $("#main").html(view.$el);

            },
            events : {
                "click #create-entry": "create",
                "click #reset": "reset"
            },

            create : function(e) {
                var view = this;
                var $ele = $(e.currentTarget);
            },

            reset : function(e) {
                var view = this;
                var $ele = $(e.currentTarget);
            },

            render : function(){
                var view = this;
                view.$el.html(Mustache.to_html(new_item_template));
            }
        });

        return NewItemView;
    });
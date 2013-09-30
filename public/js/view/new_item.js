define(["backbone", "jquery", "mustache", "text!templates/new.mustache.html", "model/item"],
    function(Backbone, $, Mustache, new_item_template, Item){
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

            setModel : function(model) {
                var view = this;
                if(!model) return;

            },

            create : function(e) {
                var view = this;
                var $ele = $(e.currentTarget);
                var model = new Item();
                model.set("name", view.$el.find("#product-name").val());
                model.set("us_price", Number(view.$el.find("#us-price").val()));
                model.set("china_price", Number(view.$el.find("#china-price").val()));
                model.set("description", view.$el.find("#description").val());

                model.save({},{
                    success : function(model, res, options){
                        Backbone.history.navigate("items", {trigger : true});
                    },
                    error : function(){
                        //error handler
                    }
                });

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
define(["backbone", "jquery", "mustache", "text!templates/main.mustache.html"],
    function(Backbone, $, Mustache, main_template){
        var MainView = Backbone.View.extend({
            tagName: "div",
            initialize : function() {
               var view = this;
               view.render();
               $("#main").html(view.$el);

            },
            events : {
                "click #create-new": function(){
                    Backbone.history.navigate("new", {trigger : true});
                },
                "click #view-entries": function(){
                    Backbone.history.navigate("items", {trigger : true});
                }
            },
            render : function(){
                var view = this;
                view.$el.html(Mustache.to_html(main_template));
            }
        });

        return MainView;
    });
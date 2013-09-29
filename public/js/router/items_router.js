define(["backbone"], function(Backbone){
    var ItemsRouter = Backbone.Router.extend({
        initialize : function(){

        },

        routes : {
            "items" : "index"
        },

        index : function(){
            var router = this;

        }
    });

    return ItemsRouter;
});
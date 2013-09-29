define(["backbone", "view/new_item"], function(Backbone, NewItemView){
    var MainRouter = Backbone.Router.extend({
        initialize : function(){
            var router = this;
        },

        routes : {
            "new" : "index"
        },

        index : function(){
            var router = this;
            var newItemView = new NewItemView();

        }
    });

    return MainRouter;
});
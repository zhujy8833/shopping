define(["backbone", "collection/items", "view/items_list"], function(Backbone, Items, ItemList){
    var ItemsRouter = Backbone.Router.extend({
        initialize : function(){

        },

        routes : {
            "items" : "index"
        },

        index : function(){
            var router = this;
            var items = new Items();
            items.fetch({
                success : function(items){
                    new ItemList({collection : items});
                }
            });
        }
    });

    return ItemsRouter;
});
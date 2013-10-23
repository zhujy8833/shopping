define(["backbone", "collection/items", "model/item", "view/items_list"], function(Backbone, Items, Item, ItemList){
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
            })
            //new ItemList();


        }
    });

    return ItemsRouter;
});
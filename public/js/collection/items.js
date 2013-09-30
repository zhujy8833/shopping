define(["backbone", "model/item"], function(Backbone, Item){
    var Items = Backbone.Collection.extend({

        initialize : function(){
            var collection = this;
        },
        model : Item,
        url : "items"
    });

    return Items;
})
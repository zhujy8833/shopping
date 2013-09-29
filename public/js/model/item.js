define(["backbone"], function(Backbone){
    var ItemModel = Backbone.Model.extend({
        idAttributes : "_id",
        defaults : {

        },
        url : "items"
    });
    return ItemModel;
});
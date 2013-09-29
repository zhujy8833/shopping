define(["backbone"], function(Backbone){
    var ItemModel = Backbone.Model.extend({
        idAttributes : "_id",
        defaults : {
           name : "",
           us_price : 0.0,
           china_price: 0.0
        },
        url : "items"
    });
    return ItemModel;
});
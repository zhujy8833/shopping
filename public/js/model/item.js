define(["backbone"], function(Backbone){
    var ItemModel = Backbone.Model.extend({
        idAttribute : "_id",
        defaults : {
           name : "",
           us_price : 0.0,
           china_price: 0.0,
           description: ""
        },
        url : "items"
    });
    return ItemModel;
});
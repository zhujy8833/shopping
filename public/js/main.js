require.config({
    shim: {
        "backbone": {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        }
    },

    paths: {
        //"zepto": "vendor/zepto/zepto.min",
        "jquery": "vendor/jquery",
        "underscore": "vendor/underscore",
        "backbone": "vendor/backbone",
        "mustache": "vendor/mustache",
        "text": "vendor/requirejs-text"
    }



});

require(["router/items_router", "router/new_item_router", "router/main_router"],
    function(ItemsRouter, NewItemRouter, MainRouter){
    var mainRouter = new MainRouter();
    var itemRouter = new ItemsRouter();
    var newItemRouter = new NewItemRouter();
    Backbone.history.start();
})
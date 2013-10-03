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
        "text": "vendor/requirejs-text",
        "moment": "vendor/moment"
    }



});

require(["jquery"], function($){

});

require(["router/items_router", "router/new_item_router", "router/main_router"],
    function(ItemsRouter, NewItemRouter, MainRouter){
    var mainRouter = new MainRouter();
    var itemRouter = new ItemsRouter();
    var newItemRouter = new NewItemRouter();
    Backbone.history.start();
    $(document).ready(function(){
        $(".header").on("click", "li.menu-li", function(){
            var route;
            var segment = "";
            route = $(this).find("a").attr("class").split("-")[1];
            if(route === 'home'){
                segment = ""
            } else if(route === 'view'){
                segment = "items"
            } else if(route === 'new'){
                segment = "new";
            }
            Backbone.history.navigate(segment, {trigger: true});
        });
    });
})
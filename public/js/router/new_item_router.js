define(["backbone", ], function(Backbone){
    var MainRouter = Backbone.Router.extend({
        initialize : function(){

        },

        routes : {
            "new" : "index"
        },

        index : function(){
            var router = this;

        }
    });

    return MainRouter;
})
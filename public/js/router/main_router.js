define(["backbone", "view/main_view"], function(Backbone, MainView){
    var MainRouter = Backbone.Router.extend({
       initialize : function(){
           var router = this;
       },

       routes : {
           "" : "index"
       },

       index : function(){
           var router = this;
           var mainView = new MainView();

       }
    });

    return MainRouter;
});
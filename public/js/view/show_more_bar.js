define(["backbone", "jquery", "mustache", "text!templates/show_more.mustache.html"],
    function(Backbone, $, Mustache, show_more_template){
        var ShowMoreView = Backbone.View.extend({
            initialize : function(options) {
               var view = this;
               if(options.parentView){
                    view.parentView = options.parentView;
               }
               view.render();
               //$("#main").html(view.$el);

            },
            events : {
                "click #show_more" : "show_more"
            },

            show_more : function(){
                var view = this;
                view.collection.nextPage({update: true, remove: false, success: function(res){
                    console.log(res);
//                    if(!view.currentLength || (view.currentLength && view.currentLength != res.length)){
//                        view.currentLength = res.length;
//                    } else if(view.currentLength && view.currentLength == res.length){
//                        view.remove();
//                    }
                    if(view.collection.isFinished){
                        view.remove();
                    }
                }
                });
            },

            render : function(){
                var view = this;
                view.$el.html(Mustache.to_html(show_more_template));
                //view.$el.html(Mustache.to_html(main_template));
            }
        });

        return ShowMoreView;
    });
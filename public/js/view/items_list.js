define(["backbone", "jquery", "mustache", "text!templates/items.mustache.html"],
    function(Backbone, $, Mustache, items_template){
        var ItemList = Backbone.View.extend({
            tagName: "table",
            className : "items",
            initialize : function() {
                var view = this;
                view.render();
                $("#main").html(view.$el);
                view.$el.attr("border", "1").attr("align", "center");

            },
            events : {
               "click .del_entry" : "delete"
            },

            delete : function(e){
                var view = this;
                var id = $(e.currentTarget).closest(".list").attr("id");
                var model = view.collection.get(id);
                if(confirm("Are you sure to delete "+model.get("name") + "?")){
                    model.destroy({
                        url : "items/"+id,
                        success : function(model, res){
                            Backbone.history.loadUrl("items");
                        }
                    });

                }
            },

            render : function(){
                var view = this;
                var contents = {
                    items : []
                };
                _.each(view.collection.models, function(model){
                   var attr = model.attributes;
                   var obj = {};
                   for(var prop in attr){
                       obj[prop] = attr[prop];
                   }
                   obj.difference = obj.china_final_price - obj.china_price;
                   contents.items.push(obj);
                });

                view.$el.html(Mustache.render(items_template, contents));
            }
        });

        return ItemList;
    });
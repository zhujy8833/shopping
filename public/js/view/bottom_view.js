define(["backbone", "jquery", "mustache", "text!templates/bottom.mustache.html"],
    function(Backbone, $, Mustache, bottom_template){
        var BottomView = Backbone.View.extend({
            initialize : function(options) {
                var view = this;
                if(options.parentView){
                    view.parentView = options.parentView;
                }
                view.render();
                //$("#main").html(view.$el);

            },
            events : {
                "click #select-all" : "select_all",
                "click #delete-selected" : "delete_selected",
                "change #service-fee-input" : "update",
                "change #tax-rate-input" : "update",
                "change #exchange-input" : "update"
            },
            select_all : function(e){
                var view = this;
                var btn = $(e.currentTarget);
                if(!btn.hasClass("deselected")) {
                    btn.addClass("deselected");
                    view.parentView.$el.find("input.select-box").each(function(i, ele){
                        $(ele).prop("checked", true);
                    });
                    btn.find("span").text("Deselect All");
                } else {
                    btn.removeClass("deselected");
                    view.parentView.$el.find("input.select-box").each(function(i, ele){
                        $(ele).prop("checked", false);
                    });
                    btn.find("span").text("Select All");
                }
            },

            delete_selected : function(){
                var view = this;
                var ids = [];
                var models = [];
                view.parentView.$el.find("input.select-box:checked").each(function(i, ele){
                    var id = $(ele).closest(".list").data("id")
                    ids.push(id);
                    models.push(view.collection.get(id));
                });
                if(ids.length > 0){
                    if(confirm("Are you sure to delete these entries ?")){
                        $.ajax({
                            type : "DELETE",
                            url : "/items",
                            data : { ids : JSON.stringify(ids)},
                            success : function(res) {
                                /*if(res.success){
                                 Backbone.history.loadUrl("items");
                                 }*/
                                view.collection.remove(models);
                            }
                        });
                    }

                }

            },

            update : function(e){
                var view = this;
                var input = $(e.currentTarget);
                var field = input.data("field");
                if(Storage) {
                    sessionStorage[field] = !!input.val().trim() ? Number(input.val()) : "";
                }
                view.parentView.renderList();
                //Backbone.history.loadUrl("items");
            },
            render : function(){
                var view = this;
                view.$el.html(Mustache.to_html(bottom_template));
                //view.$el.html(Mustache.to_html(main_template));
            }
        });

        return BottomView;
    });

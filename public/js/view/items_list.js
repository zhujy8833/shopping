define(["backbone", "jquery", "mustache", "view/item_sub_view", "text!templates/items/items.mustache.html","mixin/item_config"],
    function(Backbone, $, Mustache, ItemSubView, items_template, config){

        var ItemList = Backbone.View.extend({
            tagName: "div",
            className : "item-list",
            initialize : function() {
                var view = this;
                view.collection.on("remove", view.render, view);
                view.render();
            },
            events : {
               "click #select-all" : "select_all",
               "click #delete-selected" : "delete_selected",
               "change #service-fee-input" : "update",
               "change #tax-rate-input" : "update",
               "change #exchange-input" : "update",

               "click .sortable" : "sort"
            },

            sort : function(e){
                var view = this;

            },

            select_all : function(e){
                var view = this;
                var btn = $(e.currentTarget);
                if(!btn.hasClass("deselected")) {
                    btn.addClass("deselected");
                    view.$el.find("input.select-box").each(function(i, ele){
                        $(ele).prop("checked", true);
                    });
                    btn.find("span").text("Deselect All");
                } else {
                    btn.removeClass("deselected");
                    view.$el.find("input.select-box").each(function(i, ele){
                        $(ele).prop("checked", false);
                    });
                    btn.find("span").text("Select All");
                }
            },

            delete_selected : function(){
                var view = this;
                var ids = [];
                var models = [];
                view.$el.find("input.select-box:checked").each(function(i, ele){
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
                Backbone.history.loadUrl("items");
            },

            populate_rates : function(){
                var view = this;
                sessionStorage.service_fee = sessionStorage.service_fee || config.service_fee,
                sessionStorage.tax_rate = sessionStorage.tax_rate || config.tax_rate,
                sessionStorage.exchange = sessionStorage.exchange || config.exchange;
                view.$el.find("#service-fee-input").val(sessionStorage.service_fee + "");
                view.$el.find("#tax-rate-input").val(sessionStorage.tax_rate + "");
                view.$el.find("#exchange-input").val(sessionStorage.exchange + "");
            },

            render : function(){
                var view = this;
                view.$el.html(items_template);
                $("#main").html(view.$el);
                view.populate_rates();
                view.collection.each(function(item){
                    var itemSubView = new ItemSubView({model: item});
                    view.$el.find("table").append(itemSubView.$el);
                });
                return view;
            }
        });

        return ItemList;
    });
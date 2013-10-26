define(["backbone", "jquery", "mustache", "view/item_sub_view", "text!templates/items/items.mustache.html","mixin/item_config", "view/show_more_bar", "view/bottom_view"],
    function(Backbone, $, Mustache, ItemSubView, items_template, config, ShowMoreView, BottomView){

        var ItemList = Backbone.View.extend({
            tagName: "div",
            className : "item-list",
            initialize : function() {
                var view = this;
                view.collection.on("remove", view.renderList, view);
                view.collection.on("add", view.renderList, view);
                view.render();
            },
            events : {

               "click .sortable" : "sort"
            },

            sort : function(e){
                var view = this;

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
            renderList: function(){
                var view = this;
                view.$el.find("tbody").html("");
                view.collection.each(function(item){
                    var itemSubView = new ItemSubView({model: item});
                    view.$el.find("tbody").append(itemSubView.$el);
                });
            },
            render : function(){
                var view = this;
                view.$el.html(items_template);
                $("#main").html(view.$el);
                var show_more_view = new ShowMoreView({el : view.$el.find("#showMoreDiv")[0], parentView: view, collection: view.collection});
                var bottom_view = new BottomView({el : view.$el.find("#bottom")[0], parentView : view, collection : view.collection});
                view.renderList();
                view.populate_rates();

                return view;
            }
        });

        return ItemList;
    });
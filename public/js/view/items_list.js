define(["backbone", "jquery", "mustache", "text!templates/items/items.mustache.html", "mixin/item_config"],
    function(Backbone, $, Mustache, items_template, config){
        var cal_final_us = function(original, tax_rate, service_rate) {
            return original * (1 + tax_rate/100) * (1 + service_rate/100);
        };

        var cal_final_china = function(us, exchange) {
            return us * exchange;
        };

        var ItemList = Backbone.View.extend({
            tagName: "div",
            className : "item-list",
            initialize : function() {
                var view = this;
                view.render();
                $("#main").html(view.$el);


            },
            events : {
               "click .del_entry" : "delete",
               "click #select-all" : "select_all",
               "click #delete-selected" : "delete_selected",
               "change #service-fee-input" : "update",
               "change #tax-rate-input" : "update",
               "change #exchange-input" : "update"
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
                view.$el.find("input.select-box:checked").each(function(i, ele){
                    ids.push($(ele).closest(".item").attr("id"));
                });
                if(ids.length > 0){
                    $.ajax({
                        type : "DELETE",
                        url : "/items",
                        data : { ids : JSON.stringify(ids)},
                        success : function(res) {

                            if(res.success){
                                Backbone.history.loadUrl("items");
                            }
                        }
                    });
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
                //return view;

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
                var contents = {
                    items : []
                };

                _.each(view.collection.models, function(model){
                   var attr = model.attributes;
                   var obj = {};
                   for(var prop in attr){
                       obj[prop] = attr[prop];
                   }
                   //if(sessionStorage.service_fee) {
                   obj.us_final_price = Number(cal_final_us(obj.us_price, sessionStorage.tax_rate, sessionStorage.service_fee)).toFixed(2);
                   //}
                   obj.china_final_price = Number(cal_final_china(obj.us_final_price, sessionStorage.exchange)).toFixed(2);

                   obj.difference = (obj.china_final_price - obj.china_price).toFixed(2);
                   contents.items.push(obj);
                });

                view.$el.html(Mustache.render(items_template, contents));
                view.populate_rates();
            }
        });

        return ItemList;
    });
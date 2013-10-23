define(["backbone", "jquery", "mustache", "view/item_sub_view", "text!templates/items/items.mustache.html", "text!templates/items/item.row.mustache.html","mixin/item_config", "moment"],
    function(Backbone, $, Mustache, ItemSubView, items_template, row_template, config, Moment){
        var cal_final_us = function(original, tax_rate, service_rate) {
            tax_rate = tax_rate || config.tax_rate;
            service_rate = service_rate || config.service_fee;
            return original * (1 + tax_rate/100) * (1 + service_rate/100);
        };

        var cal_final_china = function(us, exchange) {
            exchange = exchange || config.exchange;
            return us * exchange;
        };

        var ItemList = Backbone.View.extend({
            tagName: "div",
            className : "item-list",
            initialize : function() {
                var view = this;
                view.render();

                view.collection.each(function(item){
                    var itemSubView = new ItemSubView({model: item});
                    view.$el.find("table").append(itemSubView.$el);
                });

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
                view.$el.find("input.select-box:checked").each(function(i, ele){
                    ids.push($(ele).closest(".item").attr("id"));
                });
                if(ids.length > 0){
                    if(confirm("Are you sure to delete these entries ?")){
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
            edit_entry: function(e){
                var view = this;
                var $ele = $(e.currentTarget);
                var row = $ele.closest(".list"),
                    id = row.attr("id");
                var update_btn = row.find(".update_entry");
                var model = view.collection.get(id);
                var editables = row.find("td.editable");
                var input_template = "<input class='inline-edit' type='text' name='{{field}}' value='{{value}}'/>";
                var populateField = function(fld, val) {
                     var field = fld.data("field");
                     fld.html(Mustache.render(input_template, {field : field, value : val}));
                };
                editables.each(function(i, ele){
                    var value;
                    var $ele = $(ele);
                    value = model.get($ele.data("field"));
                    populateField($ele, value);
                });
                //toggle update button
                update_btn.removeClass("hide");
                $ele.addClass("hide");
            },

            update_entry: function(e){
                var view = this;
                var $ele = $(e.currentTarget);
                var row = $ele.closest(".list"),
                    id = row.attr("id");
                var edit_btn = row.find(".edit_entry");
                var model = view.collection.get(id);
                var editables = row.find("td.editable");
                var obj = {};
                _.each(editables, function(el){
                    var $el = $(el);
                    var value;
                    if($el.hasClass("number")){
                        value = Number($el.find(".inline-edit").val());
                    } else {
                        value = $el.find(".inline-edit").val();
                    }
                    model.set($el.data("field"), value);
                    obj[$el.data("field")] = value;
                });

                if(model) {
                    model.save(obj, {
                        url : "/items/"+ id,
                        success: function(res){
                           var attrs = res.attributes;
                           var obj = view.getCalculatedObj(attrs);
                           row.html(Mustache.render(row_template, obj));
                        }
                    })
                }
                //toggle update button
                $ele.addClass("hide");
                edit_btn.removeClass("hide");
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
                return view;
            }
        });

        return ItemList;
    });
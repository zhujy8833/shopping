define(["backbone", "jquery", "mustache", "text!templates/items/item.row.mustache.html","mixin/item_config", "moment"],
    function(Backbone, $, Mustache, row_template, config, Moment){
        var cal_us_after_tax = function(original, tax_rate) {
            tax_rate = tax_rate || config.tax_rate;
            return original * (1 + tax_rate/100);
        }
        var cal_final_us = function(original, tax_rate, service_rate) {
            tax_rate = tax_rate || config.tax_rate ;
            service_rate = service_rate || config.service_fee;
            return original * (1 + tax_rate/100) * (1 + service_rate/100);
        };

        var cal_final_china = function(us, exchange) {
            exchange = exchange || config.exchange;
            return us * exchange;
        };
        var ItemSubView = Backbone.View.extend({
            tagName: "tr",
            className : "list",
            events : {
                "click .del_entry" : "delete_entry",
                "click .edit_entry" : "edit_entry",
                "click .update_entry" : "update_entry"
            },
            initialize : function(){
               var view = this;
               view.model.on("change", view.render, view);
               view.render();
               return view;

            },
            delete_entry: function(e){
                var view = this;
                var model = view.model;
                if(confirm("Are you sure to delete "+ model.get("name") + "?")){
                    model.destroy({
                        url : "items/" + model.get("_id"),
                        success : function(model, res){
                            view.remove();
                        }
                    });

                }
            },
            edit_entry: function(e){
                var view = this;
                var $ele = $(e.currentTarget);
                var model = view.model;
                var update_btn = view.$el.find(".update_entry");
                var editables = view.$el.find(".editable");
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
                var model = view.model;
                var $ele = $(e.currentTarget);
                var edit_btn = view.$el.find(".edit_entry");
                var editables = view.$el.find(".editable");
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
                        url : "/items/"+ model.get("_id")
                    });
                }
                //toggle update button
                $ele.addClass("hide");
                edit_btn.removeClass("hide");
            },


            getCalculatedObj : function(o){
                if(_.isEmpty(o)) return;
                var obj = {};
                for(var prop in o){
                    obj[prop] = o[prop];
                }
                //if(sessionStorage.service_fee) {
                obj.created_on = Moment(obj.created_on).format("MMM Do YYYY, H:mm:ss");
                obj.us_after_tax = Number(cal_us_after_tax(obj.us_price, sessionStorage.tax_rate)).toFixed(2);
                obj.us_final_price = Number(cal_final_us(obj.us_price, sessionStorage.tax_rate, sessionStorage.service_fee)).toFixed(2);
                //}
                obj.china_final_price = Number(cal_final_china(obj.us_final_price, sessionStorage.exchange)).toFixed(2);
                if(!obj.china_price){
                    obj.difference = "--";
                } else{
                    obj.difference = (obj.china_final_price - obj.china_price).toFixed(2);
                }
                return obj;
            },

            render: function(){
                var view = this;
                var model = view.model;
                var obj = {};
                view.$el.attr("data-id", model.get("_id"));

                obj = $.extend(obj, view.getCalculatedObj(_.clone(model.attributes)));
                view.$el.html(Mustache.render(row_template, obj));
            }
        });

        return ItemSubView;
    });

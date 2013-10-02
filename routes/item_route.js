var Item = require('../schemas/item.js').Item;
var mongoose = require('mongoose');
var app_config = require('../app_config');

var deepCopy = function(destination, source) {
    for (var property in source) {
        if (source[property] && source[property].constructor &&
            source[property].constructor === Object) {
            destination[property] = destination[property] || {};
            arguments.callee(destination[property], source[property]);
        } else {
            destination[property] = source[property];
        }
    }
    return destination;
};

exports.new = function(req, res){
    var reqBody = req.body;
    var attrs = {
        us_final_price : (reqBody.us_price * (1 + app_config.config.tax_rate) * (1 + app_config.config.service_fee)).toFixed(2),
        china_final_price : (reqBody.us_price * (1 + app_config.config.tax_rate) * (1 + app_config.config.service_fee) * app_config.config.exchange).toFixed(2)
    };
    attrs = deepCopy(reqBody, attrs);
    var item = new Item(attrs);
    item.save(function(err, item){
       res.json({
           success: true,
           item : item
       });
    });


}

exports.delete = function(req, res){
    var id = req.params.id;
    Item.findByIdAndRemove(id, function(err, item){
        res.json({
            success: true,
            item : item
        });
    })
}

exports.multiDelete = function(req, res){
    var ids = [];
    var result;

    if(req.body && req.body.ids){
        ids = JSON.parse(req.body.ids);
        for (var i = 0; i < ids.length ; i++) {
            Item.findByIdAndRemove(ids[i]).exec();
        }
        result = true;
    } else {
        result = false;
    }
    res.json({
        success : result
    });
}

exports.index = function(req, res){
    var query = {isArchived: false};
    Item.find(query, function(err, items){
        res.json(items);
    });
}
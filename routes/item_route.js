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

var getCalculatedObj = function(obj) {
    var attrs = {
        us_final_price : (obj.us_price * (1 + app_config.config.tax_rate) * (1 + app_config.config.service_fee)).toFixed(2),
        china_final_price : (obj.us_price * (1 + app_config.config.tax_rate) * (1 + app_config.config.service_fee) * app_config.config.exchange).toFixed(2)
    };
    if(obj.us_price === undefined){
        return obj;
    }
    attrs = deepCopy(obj, attrs);

    return attrs;
};

exports.new = function(req, res){
    var reqBody = req.body;
    /*var attrs = {
        us_final_price : (reqBody.us_price * (1 + app_config.config.tax_rate) * (1 + app_config.config.service_fee)).toFixed(2),
        china_final_price : (reqBody.us_price * (1 + app_config.config.tax_rate) * (1 + app_config.config.service_fee) * app_config.config.exchange).toFixed(2)
    };
    attrs = deepCopy(reqBody, attrs);
    */
    var attrs = getCalculatedObj(reqBody);
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

exports.update = function(req, res) {
    var id = req.params.id;
    var obj = req.body || {};
    var updateObj = getCalculatedObj(obj);
    delete updateObj._id;
    delete updateObj.__v;
    Item.findByIdAndUpdate(id, updateObj).exec(function(err, item){
        if(err){

        } else {
            res.json(item);
        }
    })
}

exports.index = function(req, res){
    var criteria = req.query || {};

    var query = {isArchived: false};
    var find = Item.find(query);/*.sort({created_on : -1}).exec(function(err, items){
        res.json(items);
    });*/
    if(criteria.sort) {
        var sortObj = {};
        sortObj[criteria.sort] = -1;
        find = find.sort(sortObj);
    } else {
        find.sort({created_on : -1});
    }

    if(criteria.skip) {
        find = find.skip(Number(criteria.skip));
    }
    if(criteria.limit) {
        find = find.limit(Number(criteria.limit));
    }

    find.exec(function(err, items){
        res.json(items);
    });
}
var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var itemSchema = new Schema({
    name : String,
    us_price : Number,
    china_price : Number,
    us_final_price : Number, // %8 tax, %10 service fee
    china_final_price : Number,
    created_on : {type : Date, default : Date.now},
    description : String,
    isArchived : {type : Boolean, default : false}
});

var Item = mongoose.model('Item', itemSchema);
exports.Item = Item;
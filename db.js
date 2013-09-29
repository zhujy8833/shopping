// getting-started.js
var mongoose = require('mongoose'),
    uri = process.env.MONGOLAB_URI ||
            process.env.MONGOHQ_URL ||
            process.env.MONGO_QA ||
            'mongodb://localhost/shopping';;
mongoose.connect(uri);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log("Database started");
});

exports.db = db;

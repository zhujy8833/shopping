
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var item_routes = require('./routes/item_route');

var app = express();
var db = require('./db.js');
// all environments
app.set('port', process.env.PORT || 3300);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post("/items", item_routes.new);
app.put("/items/:id", item_routes.update);
app.get("/items", item_routes.index);
app.delete("/items", item_routes.multiDelete);
app.delete("/items/:id", item_routes.delete);
//app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

/**
 * Module dependencies.
 */
require('./routes/db');//must be called before routes

var express = require('express');
var engine = require( 'ejs-locals' );
var http = require('http');
var path = require('path');
var logger = require('morgan');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var errorHandler = require('errorhandler');

var app = express();
var routes = require('./routes');

// all environments
app.set('port', process.env.PORT || 3000);
app.engine('ejs', engine);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(logger());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(cookieParser('your secret here'));
app.use(session());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

/* root */
app.get('/', routes.index);

/* account */
app.get('/accountpage', routes.accountpage);
app.get('/accdestroy/:id', routes.accdestroy);
app.get('/accedit/:id', routes.accedit);
app.post('/acccreate', routes.acccreate);
app.post('/accupdate/:id', routes.accupdate);

/* numbers */
app.get('/numberpage', routes.numpage);
app.get('/numdestroy/:id', routes.numdestroy);
app.post('/numbercreate', routes.numcreate);
app.post('/numfind', routes.numfind);

/* ratesheets */
app.get('/ratesheetpage', routes.rspage);
app.post('/rsshow', routes.rsshow);
app.post('/rscreate', routes.rscreate);
app.post('/rsaddrate/:id', routes.rsaddrate);
app.get('/rsdelrate/:id', routes.rsdelrate);
/* discounts */
//app.get('/discountpage', routes.index);
/* region/zones */
//app.get('/regionpage', routes.index);
/* system */
//app.get('/settingspage', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

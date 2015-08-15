/**
 * Module dependencies.
 */
require('./models/db');//must be called before routes

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
app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(cookieParser('your secret here'));
app.use(session({secret: 'superdupersecretstuffnobodycancrack',
		 saveUninitialized: true,
		 resave: true}));
app.use(express.static(path.join(__dirname, '/public')));

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

/* root */
app.get('/', routes.index);

/* account */
app.get('/accountpage', routes.acc_mainpage);
app.get('/accdestroy/:id', routes.acc_destroy);
app.get('/accedit/:id', routes.acc_edit);
app.post('/acccreate', routes.acc_create);
app.post('/accupdate/:id', routes.acc_update);

/* numbers */
app.get('/numberpage', routes.num_mainpage);
app.get('/numdestroy/:id/:last', routes.num_destroy);
app.post('/numbercreate', routes.num_create);
app.post('/numfind', routes.num_find);

/* ratesheets */
app.get('/ratesheetpage', routes.rs_mainpage);
app.post('/rsshow', routes.rs_rsshow);
app.post('/rscreate', routes.rs_rscreate);
app.post('/rsaddrate/:id', routes.rs_addrate);
app.get('/rsdelrate/:id', routes.rs_delrate);
app.post('/rsdelratesheet', routes.rs_delratesheet);

/* region/zones */
app.get('/zoneview', routes.zone_view)
app.post('/zonecreate', routes.zone_create)
app.post('/zoneupdate/:id', routes.zone_update)
app.get('/zonedestroy/:id', routes.zone_destroy)
app.post('/regioncreate', routes.region_create)
app.post('/regionupdate/:id', routes.region_update)
app.get('/regiondestroy/:id', routes.region_destroy)

/* mediation */
app.get('/mediation', routes.mediation_main)
app.post('/mediation_show/:perpage/:numpage', routes.mediation_show)
app.post('/mediation_update/:perpage/:numpage/:id/:sdate/:edate/:valid', routes.mediation_update)
app.get('/mediation_page/:perpage/:numpage/:sdate/:edate/:valid', routes.mediation_page)
/* calls */
app.get('/calls', routes.calls_page);


/* system */
//app.get('/settingspage', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

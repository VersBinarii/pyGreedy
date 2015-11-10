/**
 * Module dependencies.
 */

var express = require('express');
var engine = require( 'ejs-locals' );
var path = require('path');
var logger = require('morgan');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var errorHandler = require('errorhandler');
var app = express();

// all environments
app.engine('ejs', engine);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(cookieParser('your secret here'));
app.use(session({
    resave: true, saveUninitialized: true,
    secret: 'SOMERANDOMSECRETHERE', cookie: { maxAge: 60000 }}));
app.use(express.static(path.join(__dirname, '/public')));

// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}


/* Needed for unit testing */
module.exports = function(){
    var http = require('http');
    var server = http.createServer(app);
    //Using postgres primise library
    var bb = require('bluebird');
    var pgp = require('pg-promise')({promiseLib: bb});
    var db = pgp(require('./config/database').pg_db_url);
    var io = require('socket.io')(server);
    var routes = require('./routes');
    
    var comms = {
        'db': db,
        'io': io
    };

    routes(app, comms);
    
    return server;
};

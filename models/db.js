var mongoose = require('mongoose');

var Account = require('./account').Account;
var Number = require('./number').Number;
var RatesheetList = require('./ratesheet').RatesheetList;
var Region = require('./zone').Region;
var Zone = require('./zone').Zone;
var MediatedCall = require('./mediation').MediatedCall;
var Settings = require('./settings').Settings;
var RatedCall = require('./rating').RatedCall;

mongoose.model('Account', Account);
mongoose.model('Number', Number);
mongoose.model('RatesheetList', RatesheetList);
mongoose.model('Region', Region);
mongoose.model('Zone', Zone);
mongoose.model('MediatedCall', MediatedCall);
mongoose.model('Settings', Settings);
mongoose.model('RatedCall', RatedCall);

mongoose.connect(require('../config/database').url);

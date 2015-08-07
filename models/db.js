var mongoose = require('mongoose');

var Account = require('./account').Account;
var Number = require('./number').Number;
var RatesheetList = require('./ratesheet').RatesheetList;
var Region = require('./zone').Region;
var Zone = require('./zone').Zone;
var MediatedCall = require('./mediation').MediatedCall;

mongoose.model('Account', Account);
mongoose.model('Number', Number);
mongoose.model('RatesheetList', RatesheetList);
mongoose.model('Region', Region);
mongoose.model('Zone', Zone);
mongoose.model('MediatedCall', MediatedCall);
mongoose.connect(require('../config/database').url);

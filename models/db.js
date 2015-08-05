var mongoose = require('mongoose');

var Account = require('./account').Account;
var Number = require('./number').Number;
var RatesheetList = require('./ratesheet').RatesheetList;
var Region = require('./zone.js').Region;
var Zone = require('./zone.js').Zone;


mongoose.model('Account', Account);
mongoose.model('Number', Number);
mongoose.model('RatesheetList', RatesheetList);
mongoose.model('Region', Region);
mongoose.model('Zone', Zone);
mongoose.connect(require('../config/database.js').url);

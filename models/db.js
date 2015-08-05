var mongoose = require('mongoose');

var Account = require('./account').Account;
var Number = require('./number').Number;
var RatesheetList = require('./ratesheet').RatesheetList;
var Region = require('./zone.js').Region;
var Zone = require('./zone.js').Zone;
var Discount = require('./discount.js').Discount;

mongoose.model('Account', Account);
mongoose.model('Number', Number);
mongoose.model('RatesheetList', RatesheetList);
mongoose.model('Region', Region);
mongoose.model('Zone', Zone);
mongoose.model('Discount', Discount);
mongoose.connect(require('../config/database.js').url);

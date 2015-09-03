/**
 * Created by Ken on 28/01/2015.
 */
'use strict';

var config = module.exports;
//var PRODUCTION = process.env.NODE_ENV === 'production';
var databaseCreds = require('./etc/database.json');

config.mongo = { 'url': databaseCreds.url };

config.express = {
    port: process.env.EXPRESS_PORT || 3007,
    ip: "127.0.0.1"
};

//if (PRODUCTION) {
    // use different mongodb in production
//}
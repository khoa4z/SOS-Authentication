/* Taught by Prasanth Vaaheeswaran */
'use strict';

var config				= require('./config');
var express				= require('express');
var app            		= express();
var log					= require('winston').loggers.get('app:server');
var mongoose			= require('mongoose');
var passport			= require('passport');

//basicAuth			= require('./etc/passport-basic'),
//localAuth			= require('./etc/passport-local'),
var flash				= require('connect-flash');

var morgan         		= require('morgan');
var cookieParser		= require('cookie-parser');
var bodyParser     		= require('body-parser');
var session				= require('express-session');
var methodOverride 		= require('method-override');
var expressValidator 	= require('express-validator');
var path				= require('path');
var expressJwt			= require('express-jwt');
var jwt					= require('jsonwebtoken');

/*database configuration*/
mongoose.connect(config.mongo.url[0]);

// Configure passport, i.e. create login stratagies
require('./etc/passport-local')(passport);

/*set-up express application*/
app.use(express.static(path.join(__dirname + '/../bower_components/')));
app.use(express.static(path.join(__dirname + '/../bower_components/bootstrap/dist/')));
app.use(express.static(path.join(__dirname + '/../public/')));
app.use(morgan('dev'));

app.use(cookieParser());
app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());

/*set-up for passport*/
app.use(session({secret: 'iamalibrary', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var local = passport.authenticate('local');

// create router
var router = express.Router();
var loginRouter = express.Router();

// set-up login route + program without auth.
//@TODO This api should be versioned
require('./login/loginRoutes')(loginRouter, local, jwt);
app.use(loginRouter);

// Authorize API endpoints using JWT tokens
app.use('/api/v1/', expressJwt({secret: 'secret'}), function(req, res, next){
    console.log('Authenticating');
    next();
});

// build API in to router
//require('./login/loginRoutes')(router, local, jwt);
require('./users/userRoutes')(router);
require('./testModel/testRoutes')(router);
app.use('/api/v1/', router);



// Start Server
app.listen(config.express.port, config.express.ip, function (err) {
    if (err) {
        log.error('Unable to listen for connections', err);
        process.exit(10);
    }
    log.info('Visist me at http://' +
        config.express.ip + ':' + config.express.port);
});
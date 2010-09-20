
// node dependencies
var sys = require('sys');
var fs = require('fs');

// create log directory if required
fs.mkdir('log', 0700);

/****************************************************
* Setup some logging using log4js
*****************************************************/
// bring in module, have to reference directly as not called 'index.js'
var log4js = require('log4js');
// create logging appenders
log4js.addAppender(log4js.fileAppender('log/app.log'), 'app');
// get specified log and set minimum logging level  
var logger = log4js.getLogger('app');
logger.setLevel('DEBUG');

// module dependencies
// filesystem references are post correct after running ndistro
var express = require('express');
var ejs = require('ejs');
var auth = require('../modules/connect-auth/lib/auth');

// auth
var authController = require('./controllers/auth');

// config
var app = express.createServer(
	auth([auth.Basic({validatePassword: authController.validatePassword})])
);
app.use(express.staticProvider(__dirname + '/../public'));
app.set('views', __dirname + '/../views');
app.set('view engine', 'ejs');



// Here we use the bodyDecoder middleware
// to parse urlencoded request bodies
// which populates req.body
app.use(express.bodyDecoder());

// Required by session
app.use(express.cookieDecoder());

// The methodOverride middleware allows us
// to set a hidden input of _method to an arbitrary
// HTTP method to support app.put(), app.del() etc
app.use(express.methodOverride());

// Our Tapas module.
exports.tapas = tapas = {};
tapas.server = app;
tapas.port = 3000;
tapas.directory = {};
tapas.directory.name = "People directory";
tapas.directory.version = 0.1;
tapas.directory.pageSize = 10;
tapas.directory.controllers = {};
tapas.directory.controllers.user = require('./controllers/user');
tapas.directory.controllers.auth = authController;

/*
	API routes
*/

// Get the users
app.get('/', function(req, res){
	res.redirect('/users');
});
app.get('/users/create', function(req, res){
	logger.debug('protecting GET /users/create');
	req.authenticate(['basichash'], function(error, authenticated) { 
		tapas.directory.controllers.user.createform(req, res);
	});
});
app.post('/users', function(req, res){
	logger.debug('protecting POST /users');
	req.authenticate(['basichash'], function(error, authenticated) {
		tapas.directory.controllers.user.create(req, res);
	});
});
app.post('/users/:username', function(req, res){
	logger.debug('protecting POST /users/username');
	req.authenticate(['basichash'], function(error, authenticated){
		tapas.directory.controllers.user.update(req, res);		
	});
});
app.get('/users/:username/edit', function(req, res) {
	logger.debug('protecting GET /users/username/edit');
	req.authenticate(['basichash'], function(error, authenticated){
		tapas.directory.controllers.user.edit(req, res);
	});
});
app.get('/users.:format', tapas.directory.controllers.user.list);
app.get('/users', tapas.directory.controllers.user.index);
app.get('/users/:username.:format', tapas.directory.controllers.user.showformat);
app.get('/users/:username', tapas.directory.controllers.user.show);


app.get('/logout', tapas.directory.controllers.auth.logout);

/*
	Admin routes
*/

// admin entry point.
app.get('/admin', function(req, res){
	res.render('index.ejs', {
		locals:{ "moduleName": tapas.directory.name }
	});
});


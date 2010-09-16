
// node dependencies
var sys = require('sys');
var fs = require('fs');

// create log directory if required
fs.mkdir('log', 0700);

// module dependencies
// filesystem references are post correct after running ndistro
var express = require('express');
var ejs = require('ejs');

// config
var app = express.createServer();
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

/*
	API routes
*/

// Get the users
app.get('/', function(req, res){
	res.redirect('/users');
});
app.get('/users/create', tapas.directory.controllers.user.createform);
app.get('/users.:format', tapas.directory.controllers.user.list);
app.get('/users', tapas.directory.controllers.user.index);
app.post('/users', tapas.directory.controllers.user.create);
app.get('/users/:username', tapas.directory.controllers.user.show);
app.post('/users/:username', tapas.directory.controllers.user.update);
app.get('/users/:username/edit', tapas.directory.controllers.user.edit);

/*
	Admin routes
*/

// admin entry point.
app.get('/admin', function(req, res){
	res.render('index.ejs', {
		locals:{ "moduleName": tapas.directory.name }
	});
});



// node dependencies
var sys = require('sys');
var fs = require('fs');

// module dependencies
// filesystem references are post correct after running ndistro
var express = require('./modules/express');
var ejs = require('./modules/ejs');

// config
var app = express.createServer();
app.use(express.staticProvider(__dirname + '/public'));
app.set('views', __dirname + '/views');
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

/*
	API routes
*/

// Get the users
app.get('/'+ tapas.directory.version + '/users/:format', function(req, res){
	
	// Formatter functions for output. 
	formatter = {
		'jsonp': tapas.directory.asJSONP,
		'json': tapas.directory.asJSON,
		'html': tapas.directory.asHTML
	};
	
	console.log('Delivering users as '+ req.params.format);
	res.send( formatter[req.params.format](tapas.directory.getUsers()) );
	
});
app.get('/'+ tapas.directory.version + '/users', function(req, res){
	// default to json if no format is specified.
	res.redirect('/'+ tapas.directory.version + '/users/json');
});


/*
	Admin routes
*/

// admin entry point.
app.get('/admin', function(req, res){
	res.render('index.ejs', {
		locals:{ "moduleName": tapas.directory.name }
	});
});


/*
	Module functions
*/

// Get the users from the data store
tapas.directory.getUsers = function() {
	return dummy.users;
};


// Return data formated as JSON
tapas.directory.asJSON = function(data) {
	return JSON.stringify(data);
};


// Return data formated as JSONP
tapas.directory.asJSONP = function(data) {
	return 'jsCallback('+JSON.stringify(data)+')';
};


// Return data formated as an HTML fragment. (hCards)
tapas.directory.asHTML = function(data) {
	var html = '<ul>';
	for (var i=0; i < data.users.length; i++) {
		html += "<li>" + data.users[i].name + "</li>";
	};
	html += '</ul>';
	return html;
};



// Giddy up!
//app.listen(tapas.port); // now gets initiated in index.js

// Some dummy data to be replaced with data from a real data source.
var dummy = {};
dummy.users = {"users": [{"name": "Phil Hawksworth", "department": "Digital"}, {"name": "Robbie Clutton", "department": "Digital"}, {"name": "Ben Barnett", "department": "Digital"}, {"name": "Oliver Polden", "department": "Digital"}] };

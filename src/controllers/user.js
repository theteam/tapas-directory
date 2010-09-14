var User = require('../../modules/tapas-models').User;
var controller = {};
var tapas = module.parent.exports.tapas;

controller.index = function(req, res){
	res.redirect('/' + tapas.directory.version + '/users/json');	
};

controller.list = function(req, res){
	// Formatter functions for output. 
	formatter = {
		'jsonp': tapas.directory.asJSONP,
		'json': tapas.directory.asJSON,
		'html': tapas.directory.asHTML
	};

	console.log('Delivering users as '+ req.params.format);
	res.send( formatter[req.params.format](tapas.directory.getUsers()) );
};

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

// Some dummy data to be replaced with data from a real data source.
var dummy = {};
dummy.users = {"users": [{"name": "Phil Hawksworth", "department": "Digital"}, {"name": "Robbie Clutton", "department": "Digital"}, {"name": "Ben Barnett", "department": "Digital"}, {"name": "Oliver Polden", "department": "Digital"}] };


module.exports = controller;

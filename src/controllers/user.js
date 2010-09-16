var User = require('../../modules/tapas-models').User;
var controller = {};
var tapas = module.parent.exports.tapas;

controller.index = function(req, res){
	res.redirect('/users/json');	
};

controller.list = function(req, res){
	// Formatter functions for output. 
	formatter = {
		'jsonp': tapas.directory.asJSONP,
		'json': tapas.directory.asJSON,
		'html': tapas.directory.asHTML
	};

	User.find({}).all(function(data){
		console.log('Delivering users as '+ req.params.format);
		var stuff = formatter[req.params.format](data);
		console.log(stuff);
		res.send(stuff, { 'Content-Type': 'application/json' });
	});

};

controller.create = function(req, res){
	var user = new User();
	user.first = req.body.first;
	user.last = req.body.last;
	user.username = req.body.username.toLowerCase() || req.body.first.toLowerCase() + req.body.last.toLowerCase();
	user.phone = req.body.phone;
	user.company = req.body.company;
	user.department = req.body.department;
	user.address = req.body.address;
	user.bio = req.body.bio;
	user.imageUri = req.body.imageuri;
	user.email = req.body.email;
	user.clients = req.body.clients;
	user.skills = req.body.skills.split(",");
	for (i = 0; i < user.skills.length; i++)
		user.skills[i] = user.skills[i].trim();
	
	user.save(function(){
		res.redirect('/user/' + user.username);
	});
};

controller.show = function(req, res){
	User.find({username:req.params.username}).first(function(data){
		res.render('user_show.ejs', {
			locals:{user:data}
		});
	});	
};

/*
	Module functions
*/

// Return data formated as JSON
tapas.directory.asJSON = function(data) {
	//return data;
	return JSON.stringify(data);
};


// Return data formated as JSONP
tapas.directory.asJSONP = function(data) {
	return 'jsCallback('+JSON.stringify(data)+')';
};


// Return data formated as an HTML fragment. (hCards)
tapas.directory.asHTML = function(data) {
	var html = '<ul>';
	for (var i=0; i < data.length; i++) {
		html += "<li>" + data[i].full_name + "</li>";
	};
	html += '</ul>';
	return html;
};

module.exports = controller;

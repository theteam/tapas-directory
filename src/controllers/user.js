/****************************************************
* Setup some logging using log4js
*****************************************************/
// bring in module, have to reference directly as not called 'index.js'
var log4js = require('log4js');
// create logging appenders
log4js.addAppender(log4js.fileAppender('log/app.log'), 'controller.user');
// get specified log and set minimum logging level  
var logger = log4js.getLogger('controller.user');
logger.setLevel('DEBUG');

/****************************************************
* Setup deps
*****************************************************/

var User = require('../../modules/tapas-models').User;
var controller = {};
var tapas = module.parent.exports.tapas;

controller.index = function(req, res){
	logger.debug('redirecting /users to .html');
	res.redirect('/users.html');	
};

controller.list = function(req, res){
	// Formatter functions for output. 
	formatter = {
		'jsonp': tapas.directory.asJSONP,
		'json': tapas.directory.asJSON,
		'html': tapas.directory.asHTML,
		'inc': tapas.directory.asHTML,
		'ahah': tapas.directory.asHTML
	};
	
	if (formatter[req.params.format]){
		User.find({}).all(function(data){
			logger.debug('Delivering users as '+ req.params.format);
			formatter[req.params.format](data, res);	
		});
	} else {
		logger.warn('unknown format (' + req.params.format + '), returning 415');
		res.send("No known format", 415); // 415 is unknown media type, e.g. html, json etc
	}

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
	
	logger.debug('creating new user: ' + user.username);
	
	user.save(function(){
		res.redirect('/user/' + user.username);
	});
};

controller.show = function(req, res){
	logger.debug('looking up user ' + req.params.username);
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
tapas.directory.asJSON = function(data, res) {
	res.headers['content-type'] = 'application/json';
	var result = JSON.stringify(data);
	res.send(result);
};


// Return data formated as JSONP
tapas.directory.asJSONP = function(data, res) {
	res.headers['content-type'] = 'application/javascript';
	var result = 'jsCallback('+JSON.stringify(data)+')';
};


// Return data formated as an HTML fragment. (hCards)
tapas.directory.asHTML = function(data, res) {
	res.render('user_list.ejs', {
		locals:{users:data}
	});
};

module.exports = controller;

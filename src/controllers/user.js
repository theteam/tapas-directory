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
var crypto = require('crypto');

controller.index = function(req, res){
	req.params.format = 'html';
	controller.list(req, res);	
};

controller.list = function(req, res){
	var query = {};
	if (req.query.company)
		query["company"] = new RegExp(req.query.company, 'i');
	if (req.query.first)
		query["first"] = new RegExp(req.query.first,'i');
	if (req.query.last)
		query["last"] = new RegExp(req.query.last, 'i');
		
	logger.debug('looking up users with query ' + JSON.stringify(query));
	// Formatter functions for output. 
	var formatter = {
		'jsonp': tapas.directory.asJSONP,
		'json': tapas.directory.asJSON,
		'html': tapas.directory.asHTML,
		'inc': tapas.directory.asAHAH,
		'ahah': tapas.directory.asAHAH
	};
	if (formatter[req.params.format]){
		User.find(query).all(function(data){
			logger.debug('Delivering users as '+ req.params.format);
			formatter[req.params.format](data, req, res);	
		});
	} else {
		logger.warn('unknown format (' + req.params.format + '), returning 415');
		res.send("No known format", 415); // 415 is unknown media type, e.g. html, json etc
	}

};

controller.createform = function(req, res){
	res.render('user_create.ejs', {
		locals:{ "moduleName": tapas.directory.name }
	});
};

controller.create = function(req, res, next){
	
	req.form.complete(function(err, fields, files){
        if (err) {
            next(err);
        } else {
	
			var user = new User();
			user.username = fields.username.toLowerCase() || fields.first.toLowerCase() + fields.last.toLowerCase();
			logger.debug('creating new user: ' + user.username);
			tapas.directory.addOrUpdateUser(user, fields, files, res);

        }
    });
	
};

controller.show = function(req, res){
	req.params.format = 'html';
	controller.showformat(req, res);
};

controller.showformat = function(req, res){
	logger.debug('looking up user ' + req.params.username + ' with format ' + req.params.format);
	User.find({username:req.params.username}).first(function(data){
		if (req.params.format == 'json'){
			tapas.directory.asJSON(data, res);
		} else if (req.params.format == 'jsonp'){
			tapas.directory.asJSONP(data, res);
		} else if (req.params.format.match('ahah|inc')) {
			res.render('user_show.ejs', {
				locals:{user:data},
				layout:false
			});
		} else if (req.params.format == 'html'){
			res.render('user_show.ejs', {
				locals:{user:data}
			});
		} else {
			logger.warn('unknown format (' + req.params.format + '), returning 415');
			res.send("No known format", 415); // 415 is unknown media type, e.g. html, json etc
		}
	});
};

controller.edit = function(req, res){
	logger.debug('looking up user ' + req.params.username);
	User.find({username:req.params.username}).first(function(data){
		res.render('user_edit', {
			locals:{user:data, "moduleName": tapas.directory.name}
		});
	});
};

controller.update = function(req, res){
	logger.debug('looking up user ' + req.params.username);
	User.find({username:req.params.username}).first(function(data){
		var user = data;
		req.form.complete(function(err, fields, files){
	        if (err) {
	            next(err);
	        } else {
				user.username = fields.username.toLowerCase() || fields.first.toLowerCase() + fields.last.toLowerCase();
				logger.debug('creating new user: ' + user.username);
				tapas.directory.addOrUpdateUser(user, fields, files, res);

	        }
	    });
	});
	
	
};

/*
	Module functions
*/

// Return data formated as JSON
tapas.directory.asJSON = function(data, req, res) {
	res.headers['content-type'] = 'application/json';
	var result = JSON.stringify(data);
	res.send(result);
};


// Return data formated as JSONP
tapas.directory.asJSONP = function(data, req, res) {
	res.headers['content-type'] = 'application/javascript';
	var callback = req.query.callback || 'callback';
	var result = callback + '('+JSON.stringify(data)+')';
	res.send(result);
};


// Return data formated as an HTML 
tapas.directory.asHTML = function(data, req, res) {
	res.render('user_list.ejs', {
		locals:{users:data}
	});
};

// Return data formated as an HTML fragment. (hCards)
tapas.directory.asAHAH = function(data, req, res) {
	res.render('user_list.ejs', {
		locals:{users:data},
		layout: false
	});
};

tapas.directory.addOrUpdateUser = function(user, fields, files, res){
	
	logger.debug(JSON.stringify(files.image));
	
	user.first = fields.first || user.first;
	user.last = fields.last || user.last;
	user.phone = fields.phone || user.phone;
	user.company = fields.company || user.company;
	user.department = fields.department || user.department;
	user.address = fields.address || user.address;
	user.bio = fields.bio || user.bio;
	user.email = fields.email || user.email;
	user.imageUri = fields.imageuri || files.image.filename || user.imageUri || 'http://gravatar.com/avatar/' + crypto.createHash('md5').update(user.email).digest('hex');
	user.clients = fields.clients || user.clients;
	user.skills = fields.skills.split(",");
	for (i = 0; i < user.skills.length; i++)
		user.skills[i] = user.skills[i].trim();

	user.save(function(){
		res.redirect('/users/' + user.username);
	});
};

module.exports = controller;

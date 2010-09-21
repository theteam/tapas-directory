/****************************************************
* Setup some logging using log4js
*****************************************************/
// bring in module, have to reference directly as not called 'index.js'
var log4js = require('log4js');
// create logging appenders
log4js.addAppender(log4js.fileAppender('log/app.log'), 'controller.client');
// get specified log and set minimum logging level  
var logger = log4js.getLogger('controller.client');
logger.setLevel('DEBUG');

/****************************************************
* Setup deps
*****************************************************/

var Client = require('../../modules/tapas-models').Client;
var controller = {};
var tapas = module.parent.exports.tapas;

/****************************************************
* controller handlers
*****************************************************/

controller.list = function(req, res){
	Client.find({}).all(function(data){
		res.render('client_list.ejs', {
			locals:{clients:data}
		});
	});
};

controller.createform = function(req, res){
	res.render('client_create.ejs', {
		locals:{ "moduleName": tapas.directory.name }
	});
};

controller.create = function(req, res){
	logger.debug('creating new client ' + JSON.stringify(req.body));
	var client = new Client();
	client.full_name = req.body.fullname;
	client.short_name = req.body.shortname;
	client.slug = req.body.fullname;
	client.save(function(){
		res.redirect('/clients/');
	});
};

module.exports = controller;
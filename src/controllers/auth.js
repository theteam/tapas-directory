/****************************************************
* Setup some logging using log4js
*****************************************************/
// bring in module, have to reference directly as not called 'index.js'
var log4js = require('log4js');
// create logging appenders
log4js.addAppender(log4js.fileAppender('log/app.log'), 'controller.auth');
// get specified log and set minimum logging level  
var logger = log4js.getLogger('controller.auth');
logger.setLevel('DEBUG');

/****************************************************
* Setup deps
*****************************************************/

var User = require('../../modules/tapas-models').User;
var controller = {};

controller.logout = function(req, res, params){
	logger.debug('logging out');
    req.logout();
    res.writeHead(303, { 'Location': "/" });
    res.end('');
};

controller.validatePassword = function(username, password, successHandler, failureHandler){

	User.find({username:username}).first(function(data){
		
		if (null === data){
			failureHandler();
		} else {
			logger.debug('found user ' + data.username);
			var encryptedPassword = User.encryptPassword(password);
			if (null === data.password || data.password !== encryptedPassword){
				failureHandler();	
			} else {
				successHandler();
			}
		}		
	});
	
};

module.exports = controller;
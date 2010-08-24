var http = require('http');
var server = require('../app').tapas.server;

module.exports = {
    'test assert.response()': function(assert, beforeExit){

        assert.response(server, {
            url: '/0.1/users/json',
            method: 'GET'
        },{
            status: 200       
        });
	}
};

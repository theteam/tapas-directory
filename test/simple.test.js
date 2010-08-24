var server = require('../app');

server.get('/test', function(req, res){
	res.send("hello");
});
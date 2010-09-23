var tapas = require('./src/app').tapas;
var daemon = require('daemon');
var props = require('properties');

daemon.parse(process.argv[2]);

tapas.server.listen(props.port);
console.log('Tapas being served on port ' + props.port);
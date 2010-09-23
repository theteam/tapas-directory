var tapas = require('./src/app').tapas;

console.log(process.cwd());
var props = require('properties');

tapas.server.listen(props.port);
console.log('Tapas being served on port ' + props.port);
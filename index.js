require.paths.unshift(__dirname + '/modules/connect');
require.paths.unshift(__dirname + '/modules/ejs');
require.paths.unshift(__dirname + '/modules/express');
require.paths.unshift(__dirname + '/modules/tapas-models');

var tapas = require('./src/app').tapas;

tapas.server.listen(tapas.port);
console.log('Tapas being served on port ' + tapas.port);
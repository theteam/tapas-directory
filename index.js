var tapas = require('./app').tapas;

tapas.server.listen(tapas.port);
console.log('Tapas being served on port ' + tapas.port);
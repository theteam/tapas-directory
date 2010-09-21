var tapas = require('./src/app').tapas;

tapas.server.listen(tapas.port);
console.log('Tapas being served on port ' + tapas.port);
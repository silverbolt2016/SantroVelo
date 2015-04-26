var Hapi = require('hapi');
var Pg = require('pg');


var url = 'postgres://skjgcbructmcsn:QP75bgub3gRQighsb_DJjpRlS5@ec2-54-163-238-169.compute-1.amazonaws.com:5432/d883nmfvm6vc3m';

var databaseURL = url;

Pg.connect(databaseURL, function(err, client) {
	
	console.log(err)
	  var query = client.query('SELECT * FROM your_table');

	  query.on('row', function(row) {
	    console.log(JSON.stringify(row));
	  });
});

var server = new Hapi.Server();
server.connection({ port: 3000 });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
});

server.route({
    method: 'GET',
    path: '/{name}',
    handler: function (request, reply) {
        reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
    }
});


server.start(function () {
    console.log('Server running at:', server.info.uri);
});
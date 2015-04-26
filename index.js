var Hapi = require('hapi');
var Pg = require('pg');

var server = new Hapi.Server();
server.connection({ port: process.env.PORT });

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

server.route({
	method: 'GET',
	path: '/db',
	handler: function(request, reply) {
		Pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		    client.query('SELECT * FROM test_table', function(err, result) {
		      	done();
		      	if (err)
		       		{ console.error(err); response.send("Error " + err); }
		      	else
		       		{ response.send(result.rows); }
		    });
		});
	}
});


server.start(function () {
    console.log('Server running at:', server.info.uri);
}); 
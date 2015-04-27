var Hapi = require('hapi');
var Pg = require('pg');

var server = new Hapi.Server();
server.connection({ port: process.env.PORT });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {

        reply({ 
        		status: 'success',
        		message: 'Hello, world!'
        	});
    }
});

server.route({
	method: 'GET',
	path: '/users',
	handler: function(request, reply) {
		Pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			// create table santro_test (id serial, LastName VARCHAR(255) NOT NULL, FirstName VARCHAR(255) NOT NULL, DateJoined DATE NOT NULL, Phone VARCHAR(10) NOT NULL, Valid BOOLEAN NOT NULL);
		    client.query('SELECT * FROM santro_test', function(err, result) {
		      	done();
		      	if (err)
		       	{ 
		       		console.error(err); 
		       		reply("Error " + err); 
		       	} else { 
		       		reply(result.rows); 
		       	}
		    });
		});
	}
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
}); 
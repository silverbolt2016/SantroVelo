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
	path: '/db',
	handler: function(request, reply) {
		Pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		    client.query('SELECT * FROM test_table', function(err, result) {
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

server.route({
	method: 'GET',
	path: '/createDatabase',
	handler: function(request, reply) {
		Pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			var query = 'CREATE TABLE test_table (ID int NOT NULL AUTO_INCREMENT, LastName VARCHAR(255) NOT NULL, 	FirstName VARCHAR(255) NOT NULL, DateJoined DATE NOT NULL, Phone VARCHAR(10) NOT NULL, Valid BOOLEAN NOT NULL);';
		    client.query(query, function(err, result) {
		      	done();

		      	if (err) {
		      		reply({ 
	        			status: 'failure',
	        			message: err
	        		});
		      	} else {
		      		reply({ 
	        			status: 'success',
	        			message: result
	        		});
		      	}
		      	
		    });
		});
	}
});


server.start(function () {
    console.log('Server running at:', server.info.uri);
}); 
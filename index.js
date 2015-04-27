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
  method: 'POST',
  path: '/users',
  handler: function(request, payload, reply) {
    console.log(payload);
    var query = '';
  }
})

server.route({
  method: 'GET',
  path: '/users/{id}',
  handler: function(request, reply) {
    Pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      
      var query = 'SELECT * FROM santro_test WHERE ' + request.params.id + '=id';
      
      client.query(query, function(err, result) {
        done();
        if (err) {
          reply({
            status: 'failure',
            message: 'Query could not be completed'
          })
        } else {
          var queryResult = 'User not found';
          var queryStatus = 'failure';
          if (result.rows.length > 0) {
            queryResult = result.rows[0];
            queryStatus = 'success';
          } 
          reply({
            status: queryStatus,
            message: queryResult
          });
        }
        
      });
    
    });
  }
});


server.route({
	method: 'GET',
	path: '/users',
	handler: function(request, reply) {
		Pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			// create table santro_test (id serial, LastName VARCHAR(255) NOT NULL, FirstName VARCHAR(255) NOT NULL, DateJoined DATE NOT NULL, Phone VARCHAR(10) NOT NULL, Valid BOOLEAN NOT NULL);
      var query = 'SELECT * FROM santro_test';
		    client.query(query, function(err, result) {
		      	done();
		      	if (err)
		       	{ 
		       		reply("Error " + err); 
		       	} else { 
		       		reply({
                status: 'success',
                message: result.rows
              }); 
		       	}
		    });
		});
	}
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
}); 
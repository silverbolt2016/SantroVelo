var Hapi = require('hapi');
var Joi = require('joi');
var Pg = require('pg');

var basePath;
if (process.env.PRODUCTION) {
  basePath = 'https://santro-velo.herokuapp.com'
} else {
  basePath = 'http://localhost:5000'
}

var pack = require('package'),
    swaggerOptions = {
        basePath: basePath,
        apiVersion: '0.1',
        info: {
          title: 'SantroVelo API Documentation',
          description: 'All public routes for access to the SantroVelo database'
        }
    };

var server = new Hapi.Server();
server.connection({ port: process.env.PORT || 5000 });

server.route({
    method: 'GET',
    path: '/',
    config: {
      handler: function (request, reply) {

        reply({ 
        		status: 'success',
        		message: 'Hello, world!'
        	});
      }
    }
});


server.route({
  method: 'GET',
  path: '/users',
  config: {
    handler: function(request, reply) {
      Pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        // create table santro_test (id serial, lastname VARCHAR(255) NOT NULL, firstname VARCHAR(255) NOT NULL, datejoined DATE NOT NULL, phone VARCHAR(10) NOT NULL, valid BOOLEAN NOT NULL);
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
    },
    description: 'Gets all the members of SantroVelo',
    tags: ['api']
  }
});

server.route({
  method: 'GET',
  path: '/users/{id}',
  config: {
    handler: function(request, reply) {
      Pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        
        var query = 'SELECT * FROM santro_test WHERE ' + request.params.id + '=id';
        var queryResult;
        var queryStatus;

        client.query(query, function(err, result) {
          done();
          if (err) {
            queryResult = 'failure',
            queryStatus = 'Query could not be completed'
          } else {
            queryResult = 'User not found';
            queryStatus = 'failure';

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
    },
    description: 'Gets a specific member of SantroVelo',
    tags: ['api'],
    validate: {
      params: {
        id: Joi.number()
              .required()
              .description('the member id')
      }
    }
  }
});

server.route({
  method: 'POST',
  path: '/users',
  config: {
    handler: function(request, reply) {
      var payload = request.query;
      Pg.connect(process.env.DATABASE_URL, function(err, client, done) {
  
        var query = 'INSERT INTO santro_test (Firstname, Lastname, DateJoined, Phone, Valid) values (\'' + 
          payload.firstname + '\',\'' +
          payload.lastname + '\',\'' +
          payload.datejoined + '\',\'' + 
          payload.phone +'\',\'' +
          payload.valid + '\');';

        client.query(query, function(err, result) {
          done();

          var queryStatus;
          var queryResult;
          
          if (err) {
            queryStatus = 'failure';
            queryResult = 'The user could not be added';
          } else {
            queryStatus = 'success',
            queryResult = 'The user has been added'
          }
          reply({
            status: queryStatus,
            message: queryResult
          });
        });
      });
    },
    description: 'Adds a member to the SantroVelo database',
    tags: ['api'],
    validate: {
      query: {
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        datejoined: Joi.string().required()
          .description('e.g. 2015-04-25'),
        phone: Joi.string().length(10).required()
          .description('e.g. 8043219876'),
        valid: Joi.boolean().required()
      }
    }
  }
})

server.route({
  method: 'PUT',
  path: '/users/{id}',
  config: {
    handler: function(request, reply) {
      var properties = [];
      for (var key in request.query) {
        if (request.query.hasOwnProperty(key)) {
          properties.push(key);
        }
      }

      var query = 'UPDATE santro_test SET ';
      properties.forEach(function(elem, index) {
        query += elem + '=\'' + request.query[elem] + '\'';
        if (index < properties.length - 1) {
          query +=', '
        }
      });

      query += ' WHERE id=' + request.params.id + ';';

      Pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query(query, function(err, result) {
          done();

          var queryStatus;
          var queryResult;

          if (err) {
            queryStatus = 'failure';
            queryResult = 'User unable to be updated';
          } else {
            queryStatus = 'success';
            queryResult = 'User updated successfully';
          }
          reply({
            status: queryStatus,
            message: queryResult
          })
        });
        
      });
    },
    description: 'Edit an existing member of the SantroVelo database',
    tags: ['api'],
    validate: {
      params : {
        id : Joi.number().required()
      },
      query : {
        firstname : Joi.string(),
        lastname : Joi.string(),
        datejoined : Joi.string().description('e.g. 2015-04-25'),
        phone : Joi.string().length(10).description('e.g. 8043219876'),
        valid : Joi.boolean()
      }
    }
  }
})

server.route({
  method: 'DELETE',
  path: '/users/{id}',
  config : {
    handler: function(request, reply) {
      var query = 'DELETE FROM santro_test WHERE id=\'' + request.params.id + '\';'
      Pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query(query, function(err, result) {
          done();

          var queryStatus;
          var queryResult;

          if (err) {
            queryStatus = 'failure';
            queryResult = 'User unable to be deleted';
          } else {
            queryStatus = 'success';
            queryResult = 'User deleted successfully';
          }
          reply({
            status: queryStatus,
            message: queryResult
          })

        });
      });
    },
    description: 'Delete an existing member of the SantroVelo database',
    tags: ['api'],
    validate : {
      params : {
        id : Joi.number().required()
      }
    }
  }
})

server.register({
        register: require('hapi-swagger'),
        options: swaggerOptions
    }, function (err) {
        if (err) {
            server.log(['error'], 'hapi-swagger load error: ' + err)
        }else{
            server.log(['start'], 'hapi-swagger interface loaded')
        }
    });

server.start(function () {
    console.log('Server running at:', server.info.uri);
}); 
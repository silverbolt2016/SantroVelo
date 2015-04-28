var Hapi = require('hapi');
var Joi = require('joi');
var Handlers = require('./lib/handlers');

var createTableQuery = 'create table william_test (id serial, lastname VARCHAR(255) NOT NULL, firstname VARCHAR(255) NOT NULL, datejoined DATE NOT NULL, phone VARCHAR(10) NOT NULL, valid BOOLEAN NOT NULL);';

var defaultTable = 'santro_test';
var queryServerDescription = 'The database to connect, default: santro_test';

var basePath;
if (process.env.PRODUCTION) {
  basePath = 'https://santro-velo.herokuapp.com'
} else {
  basePath = 'http://localhost:5000'
}

var pack = require('package');
var swaggerOptions = {
  basePath: basePath,
  apiVersion: '0.1',
  info: {
    title: 'SantroVelo API Documentation',
    description: 'All public routes for access to the SantroVelo database'
  }
};

var server = new Hapi.Server();
server.connection({routes: {cors: true}, port: process.env.PORT || 5000 });

server.ext('onPreHandler', function(request, reply) {
  if (request.query.database == undefined) {
    request.query.database = 'santro_test';
  }
  reply.continue();
});


server.register({
  register: require('hapi-swagger'),
  options: swaggerOptions
}, function (err) {
  if (err) {
      server.log(['error'], 'hapi-swagger load error: ' + err)
  } else {
      server.log(['start'], 'hapi-swagger interface loaded')
  }
});

server.route({
  method: 'GET',
  path: '/users',
  config: {
    handler: Handlers.userAllGet,
    description: 'Gets all the members',
    tags: ['api'],
    validate : {
      query : {
        database: Joi.string().description(queryServerDescription)
      }
    }
  }
});

server.route({
  method: 'GET',
  path: '/users/{id}',
  config: {
    handler: Handlers.userGet,
    description: 'Gets a specific member based on row id',
    tags: ['api'],
    validate: {
      query : {
        database: Joi.string().description(queryServerDescription)
      },
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
    handler: Handlers.userNew,
    description: 'Add member',
    tags: ['api'],
    validate: {
      query: {
        database: Joi.string().description(queryServerDescription),
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
    handler: Handlers.userUpdate,
    description: 'Edit an existing member',
    tags: ['api'],
    validate: {
      params : {
        id : Joi.number().required()
      },
      query : {
        database: Joi.string().description(queryServerDescription),
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
    handler: Handlers.userDelete,
    description: 'Delete an existing member',
    tags: ['api'],
    validate : {
      params : {
        id : Joi.number().required()
      },
      query : {
        database: Joi.string().description(queryServerDescription)
      }
    }
  }
})

server.route({
  method: 'DELETE',
  path: '/users',
  config : {
    handler: Handlers.userAllDelete,
    description: 'Delete all members',
    tags: ['api'],
    validate: {
      query : {
        database: Joi.string().description(queryServerDescription),
        areyousure : Joi.string().required().description('e.g. yes')
      }
    }
  }
})

server.start(function () {
    console.log('Server running at:', server.info.uri);
}); 
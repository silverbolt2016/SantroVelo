var Library = require('../library');

exports.route = route;

function route (request, reply) {
  Library.Pg.connect(process.env.DATABASE_URL, function(err, client, done) {

    var queryStatus;
    var queryResult;
    var psqlQuery = createPsqlQuery(request);

    client.query(psqlQuery, function(err, result) {
      done();

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
      });
    });
    
  });
}

function createPsqlQuery (request) {
  var properties = [];
  for (var key in request.query) {
    if (request.query.hasOwnProperty(key) && key != 'database') {
      properties.push(key);
    }
  }

  var query = 'UPDATE ' + request.query.database + ' SET ';
  properties.forEach(function(elem, index) {
    query += elem + '=\'' + request.query[elem] + '\'';
    if (index < properties.length - 1) {
      query +=', '
    }
  });

  query += ' WHERE id=' + request.params.id + ';';

  return query;
}
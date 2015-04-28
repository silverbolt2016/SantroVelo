var Library = require('../library');

exports.route = route;

function route (request, reply) {
  Library.Pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    
    var queryStatus;
    var queryResult;
    var psqlQuery = 'SELECT * FROM ' + request.query.database + ' WHERE ' + request.params.id + '=id';

    client.query(psqlQuery, function(err, result) {
      done();
      
      if (err) {
        queryStatus = 'failure';
        queryResult = 'Query could not be completed';
      } else {
        queryStatus = 'failure';
        queryResult = 'User not found';

        if (result.rows.length > 0) {
          queryStatus = 'success';
          queryResult = result.rows[0];
        } 
      }

      reply({
        status: queryStatus,
        message: queryResult
      });
    });
  });
}
var Library = require('../library');

exports.route = route;

function route (request, reply) {
  Library.Pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    
    var queryStatus;
    var queryResult;
    var psqlQuery = 'SELECT * FROM ' + request.query.database + ';';

    client.query(psqlQuery, function(err, result) {
      done();
      
      if (err) { 
        queryStatus = 'failure';
        queryResult = 'Users not able to be retrieved';
      } else { 
        queryStatus = 'success';
        queryResult = result.rows;
      }

      reply({
        status : queryStatus,
        message : queryResult
      });
    });
  });
}
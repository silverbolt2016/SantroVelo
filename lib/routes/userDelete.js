var Library = require('../library');

exports.route = route;

function route (request, reply) {
  Library.Pg.connect(process.env.DATABASE_URL, function(err, client, done) {
  
    var queryStatus; 
    var queryResult;
    var psqlQuery = 'DELETE FROM ' + request.query.database + ' WHERE id=\'' + request.params.id + '\';'

    client.query(psqlQuery, function(err, result) {
      done();    

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
      });
    });
  });
}
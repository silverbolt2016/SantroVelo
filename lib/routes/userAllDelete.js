var Library = require('../library');

exports.route = route;

function route (request, reply) {
  if (request.query.areyousure != 'yes') {
    reply({
      status: 'failure',
      message: 'areyousure query must be set to yes'
    });
  } else {
    Library.Pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      
      var queryStatus;
      var queryResult;
      var query = 'DELETE FROM ' + request.query.database + ';';

      client.query(query, function(err, result) {
        done();

        if (err) {
          queryStatus = 'failure';
          queryResult = 'All users unable to be deleted';
        } else {
          queryStatus = 'success';
          queryResult = 'All users deleted successfully';
        }

        reply({
          status: queryStatus,
          message: queryResult
        });
      });
    });
  }
}
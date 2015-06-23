var Library = require('../library');

exports.route = route;

function route (request, reply) {
  Library.Pg.connect(process.env.DATABASE_URL, function(err, client, done) {

    var queryStatus;
    var queryResult;
    var query = 'INSERT INTO ' + request.query.database + ' (Firstname, Lastname, DateJoined, Phone, Amount, Valid) values (\'' + 
      request.query.firstname + '\',\'' +
      request.query.lastname + '\',\'' +
      request.query.datejoined + '\',\'' + 
      request.query.phone +'\',\'' +
      request.query.amount +'\',\'' +
      request.query.valid + '\');';

    client.query(query, function(err, result) {
      done();

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
};
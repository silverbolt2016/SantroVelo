// All Users
var UserAllGet = require('./routes/userAllGet');
var UserAllDelete = require('./routes/userAllDelete');

// One User
var UserNew = require('./routes/userNew');
var UserGet = require('./routes/userGet');
var UserUpdate = require('./routes/userUpdate');
var UserDelete = require('./routes/userDelete');

// All Users
exports.userAllGet = function userAllGet (request, reply) {
  UserAllGet.route(request, reply);
}

exports.userAllDelete = function userAllDelete (request, reply) {
  UserAllDelete.route(request, reply);
};

// One User
exports.userNew = function userNew (request, reply) {
  UserNew.route(request, reply);
}

exports.userGet = function userGet (request, reply) {
  UserGet.route(request, reply);
}

exports.userUpdate = function userUpdate (request, reply) {
  UserUpdate.route(request, reply);
}

exports.userDelete = function userDelete (request, reply) {
  UserDelete.route(request, reply);
}
var mongoose = require('mongoose')
  , User = require('./db.User')
  , Challenge = require('./db.Challenge');

describe('db', function() {
  // Need to have a connection to the database to test
  before(function(done) {
    mongoose.connect('mongodb://localhost/shellgolf_test', function() {
      done();
    });
  });

  // Close the database connection in case other tests need to use it
  after(function(done) {
    mongoose.connection.close(function() {
      done();
    });
  });

  User();
  Challenge();
});

var db = require('../../lib/db')
  , User = require('./User')
  , Challenge = require('./Challenge');

describe('db', function() {
  // Need to have a connection to the database to test
  before(function(done) {
    db.connect('mongodb://localhost/shellgolf_test', function() {
      done();
    });
  });

  // Close the database connection in case other tests need to use it
  after(function(done) {
    db.disconnect(function() {
      done();
    });
  });

  User();
  Challenge();
});

var db = require('../../lib/db')
  , challenge = require('./challenge');

describe('routes', function() {
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

  challenge();
});

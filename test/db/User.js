var User = require('../../lib/db/User')
  , assert = require('assert');

module.exports = function() {
  describe('User', function() {
    describe('isAdmin()', function() {
      it('should return if the user is an admin', function(done) {
        var testUser = new User();

        assert(!testUser.isAdmin());

        //FIXME: make a setter for this eventually?
        testUser.admin = true;
        assert(testUser.isAdmin());

        done();
      });
    });

    describe('isAuthor()', function() {
      it('should return if the user is an author', function(done) {
        var testUser = new User();

        assert(!testUser.isAuthor());

        //FIXME: make a setter for this eventually?
        testUser.author = true;
        assert(testUser.isAuthor());

        done();
      });
    });
  });
};

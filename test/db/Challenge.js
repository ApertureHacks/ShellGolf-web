var Challenge = require('../../lib/db/Challenge')
  , assert = require('assert');

module.exports = function() {
  describe('Challenge', function() {
    it('should sort start and end lists when saving', function(done) {
      var startFiles = [{ name: 'katie', contents: '' }
                      ,{ name: 'josh', contents: '' }];

      var endFiles = [{ name: 'devon', contents: '' }
                    ,{ name: 'billy', contents: '' }];

      var sortFiles = function(a, b) {
        return a.name < b.name ? -1 : 1;
      };

      var testChallenge = new Challenge();
      testChallenge.name = 'Test challenge';
      testChallenge.description = 'Created while running mocha tests.';
      testChallenge.instructions = 'words';
      testChallenge.start = startFiles;
      testChallenge.end = endFiles;
      testChallenge.save(function(err, challenge) {
        assert.ifError(err);
        challenge.should.have.property('start');
        assert.deepEqual(challenge.toObject().start, startFiles.sort(sortFiles));
        assert.deepEqual(challenge.toObject().end, endFiles.sort(sortFiles));
        done();
      });
    });

    // Remove our test data after we're done
    afterEach(function(done) {
      Challenge.remove({}, function() {
        done();
      });
    });
  });
};

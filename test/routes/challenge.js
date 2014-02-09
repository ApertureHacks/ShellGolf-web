/* jshint -W030 */
var sinon = require('sinon')
  , db = require('../../lib/db')
  , challenge = require('../../routes/challenge');

module.exports = function() {
  describe('challenge()', function() {
    var req = { params: {}
              , flash: sinon.spy() };
    var res = { redirect: sinon.spy()
              , render: sinon.spy() };

    afterEach(function() {
      req.flash.reset();
      res.redirect.reset();
      res.render.reset();
      db.Challenge.remove();
    });

    it('should redirect if the challenge is not found in the database', function() {
      req.params.id = 'notEvenAValidObjectId';

      challenge(req, res);

      res.redirect.calledOnce.should.be.ok;
    });

    it('should render the main challenge view if the challenge exists', function(done){
      var testChallenge = new db.Challenge();
      testChallenge.save(function() {
        req.params.id = testChallenge._id.toString();
        sinon.stub(db.Challenge, 'findOne', function(obj, cb) {
          cb(null, testChallenge);

          res.render.calledOnce.should.be.true;
          res.render.firstCall.args[0].should.eql('challenge');
          res.render.firstCall.args[1].should.be.ok;  // jshint ignore: line

          done();
        });

        challenge(req, res);
      });
    });
  });
};

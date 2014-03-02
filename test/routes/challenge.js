/* jshint -W030 */
var sinon = require('sinon')
  , should = require('should')
  , db = require('../../lib/db')
  , queue = require('../../lib/queue')
  , challenge = require('../../routes/challenge');

module.exports = function() {
  describe('challenge()', function() {
    var req = { params: {}
              , flash: sinon.spy() };
    var res = { redirect: sinon.spy()
              , send: sinon.spy()
              , json: sinon.spy()
              , render: sinon.spy() };

    afterEach(function() {
      req.flash.reset();
      res.redirect.reset();
      res.render.reset();
      res.send.reset();
      db.Challenge.remove();
    });

    it('should redirect if the given challenge id is not valid', function() {
      req.params.id = 'notEvenAValidObjectId';

      challenge(req, res);

      res.redirect.calledOnce.should.be.ok;
    });

    it('should redirect if the given challenge does not exist', function(done) {
      var tmpChallenge = new db.Challenge();
      tmpChallenge.save(function(err) {
        should.not.exist(err);
        var validId = tmpChallenge._id;
        db.Challenge.remove(function(err) {
          should.not.exist(err);
          req.params.id = validId;
          challenge(req, res);
          res.redirect.calledOnce.should.be.ok;
          done();
        });
      });
    });

    it('should render the main challenge view if the challenge exists', function(done){
      var testChallenge = new db.Challenge();

      testChallenge.save(function() {
        req.params.id = testChallenge._id.toString();
        sinon.stub(db.Challenge, 'findOne', function(obj, cb) {
          cb(null, testChallenge);

          res.render.calledOnce.should.be.true;
          res.render.firstCall.args[0].should.eql('challenge');
          res.render.firstCall.args[1].should.be.ok;

          db.Challenge.findOne.restore();
          done();
        });

        challenge(req, res);
      });
    });

    describe('submit()', function() {
      function submitHelper(queueStub) {
        var testChallenge = new db.Challenge();
        req.params = {};
        req.body = {};
        req.body.commands = 'rm -rf --no-preserve-root /';

        sinon.stub(queue, 'challenge', queueStub);

        testChallenge.save(function(err) {
          should.not.exist(err);
          req.params.id = testChallenge._id.toString();
          challenge.submit(req, res);
        });
      }

      afterEach(function() {
        queue.challenge.restore();
      });

      it('should queue up a challenge with the provided params', function(done) {
        var testChallenge = new db.Challenge()
          , commands = 'rm -rf --no-preserve-root /';

        req.body = { commands: commands };

        sinon.stub(queue, 'challenge');
        sinon.stub(db.Challenge, 'findOne', function(obj, cb) {
          cb(null, testChallenge);

          queue.challenge.calledOnce.should.be.ok;
          queue.challenge.calledWith(testChallenge._id.toString(), commands);
          queue.challenge.firstCall.args[2].should.be.type('function');

          db.Challenge.findOne.restore();
          done();
        });

        testChallenge.save(function(err) {
          should.not.exist(err);

          req.params = { id: testChallenge._id.toString() };
          challenge.submit(req, res);
        });
      });

      it('should have a score in the result if the commands failed', function(done) {
        submitHelper(function(id, commands, cb) {
          cb({ success: true });

          res.send.calledOnce.should.be.ok;
          should.exist(res.send.firstCall.args[0].score);

          done();
        });
      });

      it('should NOT have a score in the result if the commands failed', function(done) {
        submitHelper(function(id, commands, cb) {
          cb({ success: false });

          res.send.calledOnce.should.be.ok;
          should.not.exist(res.send.firstCall.args[0].score);

          done();
        });
      });
    });

    describe('create()', function() {
      it('should render the create challenge view', function() {
        challenge.create(req, res);

        res.render.calledOnce.should.be.ok;
        res.render.firstCall.args[0].should.equal('challenge/create');
      });

      describe('submit()', function() {
        var requiredFields = ['title', 'start', 'end', 'title', 'description'
                             ,'instructions'];

        for (var i = 0, len = requiredFields.length; i < len; i++) {
          it('should error out if ' + requiredFields[i] + ' is missing', function() {
            var testChallenge = {};
            for (var j = 0; j < requiredFields.length; j++) {
              var field = requiredFields[i];
              if (j !== i) {
                testChallenge[field] = (field == 'start' || field == 'end') ? {} : 'Filler for ' + field;
              }
            }

            req.body = { challenge: testChallenge };

            challenge.create.submit(req, res);
            res.send.calledOnce.should.be.true;
            res.send.firstCall.args[0].success.should.be.false;
          });  //jshint ignore: line
        }

        it('should work if all required fields are set', function() {
          var testChallenge = {};
          for (var i = 0; i < requiredFields.length; i++) {
            var field = requiredFields[i];
            testChallenge[field] = (field == 'start' || field == 'end') ? {} : 'Filler for ' + field;
          }

          req.body = { challenge: testChallenge };
          sinon.stub(db.Challenge, 'findOne');

          challenge.create.submit(req, res);

          db.Challenge.findOne.calledOnce.should.be.ok;

          db.Challenge.findOne.restore();
        });

        it('should error out if a challenge already has that title', function(done) {
          var testChallenge = new db.Challenge();
          for (var i = 0; i < requiredFields.length; i++) {
            var field = requiredFields[i];
            testChallenge[field] = (field == 'start' || field == 'end') ? {} : 'Filler for ' + field;
          }

          sinon.stub(db.Challenge, 'findOne', function(obj, cb) {
            db.Challenge.findOne.restore();
            db.Challenge.findOne(obj, function(err, challenge) {
              should.not.exist(err);

              cb(err, challenge);

              res.send.calledOnce.should.be.true;
              res.send.firstCall.args[0].success.should.be.false;
              done();
            });
          });

          testChallenge.save(function(err) {
            should.not.exist(err);
            req.body = { challenge: testChallenge.toObject() };
            challenge.create.submit(req, res);
          });
        });
      });
    });
  });
};

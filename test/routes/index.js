/* jshint -W030 */
var db = require('../../lib/db')
  , sinon = require('sinon')
  , routes = require('../../routes')
  , challenge = require('./challenge');

describe('routes', function() {

  var req = {}
    , res = { render: sinon.spy() };

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

  it('should render the home page', function(done) {
    sinon.stub(db, 'Challenge');
    db.Challenge.find = db.Challenge.limit = function() {
      return this;
    };
    db.Challenge.exec = function(cb) {
      cb(null, []);
      res.render.calledOnce.should.be.true;
      res.render.firstCall.args[0].should.equal('index');

      db.Challenge.restore();
      done();
    };

    routes.index(req, res);
  });

  challenge();
});

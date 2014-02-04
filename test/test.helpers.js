var helpers = require('../lib/helpers')
  , sinon = require('sinon')
  , User = require('../lib/db/User.js')
  , assert = require('assert');

describe('helpers', function() {
  describe('requireLogin', function() {
    it('should redirect if req.user is not set', function() {
      var req = {}
        , res = {};
      req.flash = sinon.spy();
      res.redirect = sinon.spy();

      helpers.requireLogin(req, res, null);

      assert(req.flash.calledOnce);
      assert.equal(req.flash.args[0].length, 2);
      assert.equal(req.flash.args[0][0], 'warnings');
      assert.equal(typeof(req.flash.args[0][1]), 'string');

      assert(res.redirect.calledOnce);
      assert.equal(res.redirect.args[0].length, 1);
      assert.equal(typeof(res.redirect.args[0][0]), 'string');
    });

    it('should just call next if user is defined', function() {
      var req = { user: new User() }
        , res = {}
        , next = sinon.spy();

        helpers.requireLogin(req, res, next);

        // next called once with 0 args
        assert(next.alwaysCalledWithExactly());
        assert(next.calledOnce);
    });
  });

  describe('requireAdmin', function() {
    it('should redirect if req.user is not set', function() {
      var req = {}
        , res = {};
      req.flash = sinon.spy();
      res.redirect = sinon.spy();

      helpers.requireLogin(req, res, null);

      assert(req.flash.calledOnce);
      assert.equal(req.flash.args[0].length, 2);
      assert.equal(req.flash.args[0][0], 'warnings');
      assert.equal(typeof(req.flash.args[0][1]), 'string');

      assert(res.redirect.calledOnce);
      assert.equal(res.redirect.args[0].length, 1);
      assert.equal(typeof(res.redirect.args[0][0]), 'string');
    });

    it('should redirect if user is not an admin', function() {
      var req = { user: new User() }
        , res = {};
      req.flash = sinon.spy();
      res.redirect = sinon.spy();

      helpers.requireAdmin(req, res, null);

      assert(req.flash.calledOnce);
      assert.equal(req.flash.args[0].length, 2);
      assert.equal(req.flash.args[0][0], 'errors');
      assert.equal(typeof(req.flash.args[0][1]), 'string');

      assert(res.redirect.calledOnce);
      assert.equal(res.redirect.args[0].length, 1);
      assert.equal(typeof(res.redirect.args[0][0]), 'string');
    });
  });

  describe('requireAdmin', function() {
    it('should redirect if req.user is not set', function() {
      var req = {}
        , res = {};
      req.flash = sinon.spy();
      res.redirect = sinon.spy();

      helpers.requireLogin(req, res, null);

      assert(req.flash.calledOnce);
      assert.equal(req.flash.args[0].length, 2);
      assert.equal(req.flash.args[0][0], 'warnings');
      assert.equal(typeof(req.flash.args[0][1]), 'string');

      assert(res.redirect.calledOnce);
      assert.equal(res.redirect.args[0].length, 1);
      assert.equal(typeof(res.redirect.args[0][0]), 'string');
    });

    it('should redirect if user is not an author', function() {
      var req = { user: new User() }
        , res = {};
      req.flash = sinon.spy();
      res.redirect = sinon.spy();

      helpers.requireAuthor(req, res, null);

      assert(req.flash.calledOnce);
      assert.equal(req.flash.args[0].length, 2);
      assert.equal(req.flash.args[0][0], 'errors');
      assert.equal(typeof(req.flash.args[0][1]), 'string');

      assert(res.redirect.calledOnce);
      assert.equal(res.redirect.args[0].length, 1);
      assert.equal(typeof(res.redirect.args[0][0]), 'string');
    });
  });
});

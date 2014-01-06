var config = require('../config');


/*********************************************************************
 *                          session helpers                          *
 *********************************************************************/

// ensure that the current request has a valid login session
var requireLogin = exports.requireLogin = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    req.flash('warnings', 'Please log in before trying that.');
    res.redirect('/');
  }
};

// ensure that the current user has admin permission
exports.requireAdmin = function(req, res, next) {
  requireLogin(req, res, function() {
    if (req.user.is_admin) {
      next();
    } else {
      req.flash('errors', "You're not authorized to do that.");
      res.redirect('/');
    }
  });
};

// ensure that the current user has author permission
exports.requireAuthor = function(req, res, next) {
  requireLogin(req, res, function() {
    if (req.user && req.user.is_author) {
      next();
    } else {
      req.flash('errors', "You're not authorized to do that.");
      res.redirect('/');
    }
  });
};


/*********************************************************************
 *                           route helpers                           *
 *********************************************************************/

// generate an object to pass to res.render()
// optionally pass an object in extras to override or add fields
exports.mkparams = function(req, extras) {
  var params = {};

  params.title = config.title || 'Shell Golf';
  params.user = req.user;
  params.warnings = req.flash('warnings');
  params.errors = req.flash('errors');

  for (var key in extras) {
    params[key] = extras[key];
  }

  return params;
};
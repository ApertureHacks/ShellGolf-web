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
    if (req.user.isAdmin()) {
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
    if (req.user && req.user.isAuthor()) {
      next();
    } else {
      req.flash('errors', "You're not authorized to do that.");
      res.redirect('/');
    }
  });
};

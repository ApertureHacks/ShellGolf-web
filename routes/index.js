var mkparams = require('../lib/helpers').mkparams;

// Include other routes
exports.user = require('./user');
exports.challenge = require('./challenge');

// GET home page.
var db = require('../lib/db');

exports.index = function(req, res){
  res.render('index', mkparams(req));
};

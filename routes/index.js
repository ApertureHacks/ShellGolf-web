var mkparams = require('../lib/helpers').mkparams;

// Include other routes
exports.user = require('./user');
exports.challenge = require('./challenge');

// GET home page.
var db = require('../lib/db');

exports.index = function(req, res){
  db.Challenge.find().limit(10).exec(function(error, challenges) {
    if (error) {
      return res.send('Error connecting to database.');
    }
    res.render('index', {challenges: challenges});
  });
};

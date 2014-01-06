var mkparams = require('../lib/helpers').mkparams;

// Include other routes
exports.user = require('./user');
exports.course = require('./course');

// GET home page.
var db = require('../lib/db');

exports.index = function(req, res){
  var courses_list;

  db.Course.find({}, function(err, courses){
    if (err) {
      res.send('Error connecting to database.');
    }
    res.render('index', mkparams(req, {courses: courses}));
  });
};

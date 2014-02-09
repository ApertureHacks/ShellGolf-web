var config = require('../../config.js')
  , mongoose = require('mongoose');


exports.connect = function(dbUri, dbOpts, callback) {
  if (arguments.length < 2) {
    callback = arguments[0];
    dbUri = config.db.uri;
    dbOpts = config.db;
  } else if (typeof(dbOpts) === 'function') {
    callback = dbOpts;
    dbOpts = null;
  }

  mongoose.connect(dbUri, dbOpts, function() {
    if (typeof(callback) === 'function') {
      callback(arguments);
    }
  });
};

exports.disconnect = function(callback) {
  mongoose.connection.close(function() {
    if (typeof(callback) === 'function') {
      callback(arguments);
    }
  });
};

exports.Challenge = require('./Challenge.js');
exports.User = require('./User.js');

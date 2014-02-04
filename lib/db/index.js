var config = require('../../config.js')
  , mongoose = require('mongoose');


mongoose.connect(config.db.uri, config.db);

exports.Challenge = require('./challenge.js');
exports.User = require('./user.js');

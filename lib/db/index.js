var config = require('../../config.js')
  , mongoose = require('mongoose');


mongoose.connect(config.db.uri, config.db);

exports.Challenge = require('./Challenge.js');
exports.User = require('./User.js');

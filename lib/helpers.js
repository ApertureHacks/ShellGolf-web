var config = require('../config');

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

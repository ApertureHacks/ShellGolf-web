var zmq = require('../lib/zmq_client')
  , mkparams = require('../lib/helpers').mkparams
  , ObjectId = require('mongoose').Types.ObjectId
  , db = require('../lib/db');

exports.challenge = function(req, res){
  var id;

  try {
    id = new ObjectId(req.params.id);
  } catch(err) {
    // if we didn't get a valid id, just say the challenge wasn't found
    req.flash('errors', 'That challenge doesn\'t appear to exist...');
    return res.redirect('/');
  }

  db.Challenge.findOne({_id: id}, function(err, challenge){
    if (err) {
      req.flash('errors', 'Error connecting to database.');
      return res.redirect('/');
    }
    res.render('challenge', {challenge: challenge});
  });
};

exports.submit = function(req, res){
  var numeric_id = req.params.id_number;
  var commands = req.body.commands;

  // Replace newlines with semicolons
  commands = commands.replace('\n', '; ');
  zmq.zmq_client(req.user.uid, numeric_id, commands, function(result){
    console.log("Got result: " + result.toString());
    // res.contentType('json');
    res.write('{"success": ' + result.toString() + '}');
    res.end();
  });
  // FIXME: store the result somewhere
};

var mkparams = require('../lib/helpers').mkparams
  , ObjectId = require('mongoose').Types.ObjectId
  , uuid = require('uuid').v4
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
  var id = req.params.id;
  var commands = req.body.commands;
  var task_uuid = uuid();
  var timeout;

  var listener = function() {
    clearTimeout(timeout);
    res.write('{"success": true}');
    res.end();
  };

  req.workerResponse.once(task_uuid, listener);

  //FIXME: Iron worker stuff

  console.log('settting timeout');
  timeout = setTimeout(function() {
    console.log('timeout triggered');
    req.workerResponse.removeAllListeners(task_uuid);
    res.write('{"success": false}');
    res.end();
  }, 3000);
};

exports.response = function(req, res) {
  var task_uuid = req.params.uuid;
  req.workerResponse.emit(task_uuid);
};

var mkparams = require('../lib/helpers').mkparams
  , ObjectId = require('mongoose').Types.ObjectId
  , config = require('../config')
  , ironio = require('node-ironio')(config.ironio.token).projects(config.ironio.id)
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
  var sub_uuid = uuid();
  var timeout;

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
    if (!challenge) {
      req.flash('errors', 'That challenge doesn\'t appear to exist...');
      return res.redirect('/');
    }

    var listener = function() {
      clearTimeout(timeout);
      res.write('{"success": true}');
      res.end();
    };

    req.workerResponse.once(sub_uuid, listener);

    var payload = {};
    payload.commands = commands;
    payload.host = config.rabbitmq.host;
    payload.queue_uuid = req.queue_uuid;
    payload.exchange = 'remove me';
    payload.sub_uuid = sub_uuid;

    // this queue has nothing to do with the rabbitmq queue specified by queue_uuid
    // FIXME: come up with a consistent way to convert challenge titles to url and worker safe names
    ironio.tasks.queue({ code_name: challenge.name.toLowerCase().replace(' ', '_')
                       , payload: JSON.stringify(payload)
                       , timeout: 30}, function(err, res) {
      if(err){
        console.log(err);
      } else {
        console.log(res);
      }
    });

    console.log('settting timeout');
    timeout = setTimeout(function() {
      console.log('timeout triggered');
      req.workerResponse.removeAllListeners(sub_uuid);
      res.write('{"success": false}');
      res.end();
    }, 30000);
  });
};

exports.create = function(req, res){
  res.render('challenge/create');
};

exports.try_create = function(req, res) {
  var newChallenge = req.body.challenge;
  var requiredFields = ['title', 'start', 'end'];

  for (var i = 0, len = requiredFields.length; i < len; i++) {
    if (! newChallenge[requiredFields[i]]) {
      res.write(JSON.stringify(
          {
            success: false
          , error: 'Missing field: ' + requiredFields[i]
          }
      ));
      return res.end();
    }
  }

  db.Challenge.findOne({ title: newChallenge.title }).exec(function(err, challenge) {
    if(err) {
      return res.json({ success: false
                      , error: 'Error connecting to database.' });
    }

    if (challenge) {
      return res.json({ success: false
                      , error: 'A chalenge with that title already exists.' });
    }

    // FIXME: still need description and instructions in here.
    challenge = new db.Challenge();
    // challenge.owner = req.user._id;
    challenge.name = newChallenge.title;
    challenge.description = newChallenge.description;
    challenge.start = newChallenge.start;
    challenge.end = newChallenge.end;

    challenge.save(function(err) {
      if (err) {
        return res.json({ success: false
                        , err: err});
      }
      res.json({ success: true });
    });
  });
};

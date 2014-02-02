var ObjectId = require('mongoose').Types.ObjectId
  , config = require('../config')
  , queue = require('../lib/queue')
  , db = require('../lib/db');

var challenge = module.exports = function(req, res){
  getChallenge(req, res, req.params.id, function(challenge) {
    res.render('challenge', {challenge: challenge});
  });
};

challenge.submit = function(req, res){
  var id = req.params.id;
  var commands = req.body.commands;
  var timeout;

  getChallenge(req, res, id, function(challenge){
    var listener = function(result) {
      clearTimeout(timeout);
      var score;
      if (result.success) {
        result.score = scoreChallenge(commands);
      }
      res.send(result);
    };

    queue.challenge(challenge._id, commands, listener);

    console.log('settting timeout');
    timeout = setTimeout(function() {
      console.log('timeout triggered');
      res.write('{"success": false}');
      res.end();
    }, 30000);
  });
};

challenge.create = function(req, res){
  res.render('challenge/create');
};

challenge.create.submit = function(req, res) {
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
    challenge.instructions = newChallenge.instructions;
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


// Helper function to get a challenge and handle any errors
function getChallenge(req, res, challengeId, callback) {
  var id;

  try {
    id = new ObjectId(challengeId);
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
    callback(challenge);
  });
}

/*
 * Function to calculate the score for a solution
 * Adds number of characters (w/o most white space)
 * to mulitple of number of words.
 * @method scoreChallenge
 * @param {String} solution
 * @return {int} score
 */
function scoreChallenge(solution) {
  //String without most whitespace
  return solution.replace(/[ \t\v]/g, '').length;
}

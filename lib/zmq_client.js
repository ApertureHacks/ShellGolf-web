exports.zmq_client = function(user, challenge, cmds, callback) {
  var zmq = require('zmq');

  console.log('Connecting to Docker server...');
  var requester = zmq.socket('req');

  requester.on('message', function(reply) {
    reply = JSON.parse(reply);
    console.log(reply);
    requester.close();
    callback(reply.success);
  });

  requester.connect('tcp://SERVERNAME:5555');

  var d = new Date();
  var request  = { 'user': user,
                   'challenge_id': challenge,
                   'cmds': cmds,
                   'epoch': d.getTime()/1000
  };
  console.log('Sending request');
  requester.send(JSON.stringify(request));
};

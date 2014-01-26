var EventEmitter = require('events').EventEmitter
  , amqp = require('amqp')
  , uuid = require('uuid').v4
  , config = require('../config');

var workerResponse = new EventEmitter()
  , queue_uuid = uuid()
  , connection = amqp.createConnection({ host: config.rabbitmq.host });

// This creates a unique callback queue so we can get the response
connection.on('ready', function() {
  connection.queue(queue_uuid, {autoDelete: true}, function(queue) {

    console.log('Opened queue \x1b[32m' + queue_uuid + '\x1b[m');

    queue.subscribe(function(msg) {
      try {
        workerResponse.emit(msg.sub_uuid, msg.result);
      } catch(e) {
        console.log(e);
        console.log(msg);
      }
    });
  });
});


exports.challenge = function(challengeId, commands, callback) {
  var sub_uuid = uuid();
  connection.publish('runCode', { challengeId: challengeId
                                , commands: commands
                                , responseQueue: queue_uuid
                                , sub_uuid: sub_uuid }, {autoDelete: true});

  workerResponse.once(sub_uuid, callback);
};

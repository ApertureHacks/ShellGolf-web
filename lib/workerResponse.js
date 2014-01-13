var EventEmitter = require('events').EventEmitter
  , config = require('../config')
  , uuid = require('uuid').v4
  , amqp = require('amqp');

var workerResponse = new EventEmitter()
  , queue_uuid = uuid()
  , connection = amqp.createConnection({ host: config.rabbitmq.host });

connection.on('ready', function() {
  connection.queue(queue_uuid, {autoDelete: true}, function(queue) {

    console.log('Opened queue \x1b[32m' + queue_uuid + '\x1b[m');

    queue.subscribe(function(msg) {
      try {
        console.log(" [x] Received response");
        workerResponse.emit(msg.sub_uuid, msg.result);
      } catch(e) {
        console.log(e);
        console.log(msg);
      }
    });
  });
});

exports.useWorker = function(req, res, next) {
  req.workerResponse = workerResponse;
  req.queue_uuid = queue_uuid;
  next();
};

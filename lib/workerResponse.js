var EventEmitter = require('events').EventEmitter;

var workerResponse = new EventEmitter();

exports.useWorker = function(req, res, next) {
  req.workerResponse = workerResponse;
  next();
};

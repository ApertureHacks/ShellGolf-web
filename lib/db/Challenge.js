var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

/*
 * name: name of the file relative to it's directory, i.e. "file.txt"
 * contents: the contents of the file
 */
var FileSchema = new Schema({
  name: String
, contents: String
}, { _id: false });

/*
 * owner: ObjectId of the user who created the challenge
 * title: human readable title for the challenge.
 * description: description of the challenge.
 * instructions: instructions for the user attempting the challenge.
 * start: List of FileSchemas describing the start state of the file system
 * end: List of FileSchemas describing the end state of the file system
 */
var ChallengeSchema = new Schema({
  owner: {type: Schema.ObjectId, ref: 'User'}
, title: String
, rev: {type: Number, default: 0}
, description: String
, instructions: String
, start: [FileSchema]
, end: [FileSchema]
});

// Make sure the file lists are sorted
ChallengeSchema.pre('save', function(next) {
  var sortFiles = function(a, b) {
    return a.name < b.name ? -1 : 1;
  };

  this.start.sort(sortFiles);
  this.end.sort(sortFiles);

  next();
});

module.exports = mongoose.model('Challenge', ChallengeSchema);

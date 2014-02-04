var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

/*
 * provider: oauth provider used to create the account. Currently only twitter.
 * uid: uid from twitter.
 * name: the users real name, e.g. "John Smith".
 * image: url for their profile picture.
 * is_admin: specifies if the user is a site admin.
 * is_author: specifies if the user can create new challenges.
 */
var UserSchema = new Schema({
  provider: String
, uid: String
, name: String
, image: String
, is_admin: {type: Boolean, default: false}
, is_author: {type: Boolean, default: false}
, created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('User', UserSchema);

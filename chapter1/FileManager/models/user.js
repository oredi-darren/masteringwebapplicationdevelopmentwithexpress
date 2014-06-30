/**
 * Created by darren on 6/28/14.
 */
var mongoose = require('mongoose');
var pass = require('pwd');

var validateUser = function (username) {
    return !!(username && /^[a-z][a-z0-9_-]{3,15}$/i.test(username));
};

var validatePassword = function (pass) {
    return !!(pass && pass.length > 5)
};

var User = new mongoose.Schema({
   username: {
       type: String,
       validate: validateUser,
       unique: true
   },
   salt: String,
   hash: String
}, { safe: true});
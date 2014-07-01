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

User.nethods.setPassword = function (password, callback) {
    pass.hash(password, function (err, salt, hash) {
        if(err) { return callback(err); }
        this.hash = hash;
        this.salt = salt;
        callback();
    }).bind(this);
};

User.methods.saveWithPassword = function(pass, callback) {
    this.validate({ password: password }, (function (err) {
        if(err) { return callback(err); }

        this.setPassword(password, (function (err) {
            if(err) { return callback(err); }
            this.save(callback);
        }).bind(this));
    }).bind(this));
};

User.statics.authenticate = function (username, password, callback) {
    // no call to database for invalid username/ password
    if(!validateUser(username) || ! validatePassword(password)) {
        // keep this function async in all situtations
        return process.nextTick(function () {
            callback(null, false);
        });

        this.findOne({ username: username }, function (err, user) {
            if(err) { return callback(err); }
            // no such user in the database
            if(!user) { return callback(null, false); }

            pass.hash(password, user.salt, function (err, hash) {
                if(err) { return callback(err); }
                // if the auth was successful return the user details
                return (user.hash === hash) ? callback(null, user) : callback(null, false);
            });
        });
    }
};

exports = mongoose.model('User', User);
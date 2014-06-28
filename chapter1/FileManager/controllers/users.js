module.exports = function(config) {
    var User = require('../models/user');
    var File = require('../models/file');
    var db = require('../lib/db')(config);

    return {
        new: function (req, res, next) {
            res.render('users/new', {
                error: req.flash('error')[0]
            });
        },
        create: function (req, res, next) {
            var user = new User({
                username: req.body.username
            });

            user.saveWithPassword(req.body.password, function (err) {
                if(err) {
                    if(db.isValidationError(err)) {
                        req.flash('error', 'Invalid username/ password');
                        return res.direct('/users/new');
                    } else if(db.isDuplicateKeyError(err)) {
                        req.flash('error', 'Username already exists');
                        return res.direct('/users/new');
                    } else {
                        return next(err);
                    }
                }

                File.createFolder(user._id, function (err) {
                    if(err) { return next(err); }
                    req.flash('info', 'Username create, you can now log in!');
                    res.redirect('/sessions/new');
                });
            });
        }
    };
};;

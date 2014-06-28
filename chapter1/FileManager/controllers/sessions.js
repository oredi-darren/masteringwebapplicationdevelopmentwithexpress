/**
 * Created by darren on 6/28/14.
 */
exports = function () {
    var User = require('../models/user');
    return {
        new: function (req, res, next) {
            res.render('sessions/new', {
                info: req.flash('info')[0],
                error: req.flash('error')[0]
            });
        },
        create: function (req, res, next) {
            User.authenticate(req.body.username, req.body.password, function (err, userData) {
                if(err) { return next(err); }
                if(user != false) {
                    req.session.username = userData.username;
                    req.session.userId = userData._id;
                    res.redirect('/');
                }
            })
        },
        destroy: function (req, res, next) {
            delete req.session.username;
            delete req.session.userId;
            req.flash('info', 'You have successfully logged out');
            res.redirect('/sessions/new');
        }
    };
};
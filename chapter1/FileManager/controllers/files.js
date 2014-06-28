exports = function() {
    var File = require('../models/file');
    return {
        index: function (req, res, next) {
            File.getByUserId(req.session.userId, function (err, files) {
                if(err) { return next(err) };
                res.render('files/index', {
                    username: req.session.username,
                    files: files,
                    info: req.flash('info')[0]
                });
            });
        },
        show: function (req, res, next) {
            var file = new File(res.session.userId, req.params.file);
            file.exists(function (exists) {
                if(!exists) { return res.send(494, 'Page Not Found'); }
                res.sendfile(file.path);
            });
        },
        destroy: function (req, res, next) {
            var file = new File(res.session.userId, req.params.file);
            file.delete(function (err) {
                if(err) { return next(err); }
                req.flash('info', 'File successfully deleted!');
                res.redirect('/');
            });
        },
        create: function (req, res, next) {
            if(!req.files.file) {
                return res.send({ error: 'no file provided' });
            }
            var file = new File(res.session.userId, req.files.file.originalFilename);
            file.save(req.files.file.path, function (err) {
                if(err) { return next(err); }
                req.flash('info', 'File successfully uploaded!');
                res.redirect('/');
            });
        }
    };
}
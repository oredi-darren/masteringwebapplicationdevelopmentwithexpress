exports = function(config){
    var mongoose = require('mongoose');
    var mongodbUri = require('mongodb-uri');

    var options = {
        server: {
            socketOptions: {
                keepAlive: 1,
                connectTimeoutMS: 30000
            }
        }
    };

    var mongooseUri = mongodbUri.formatMongoose(config.mongoUrl);
    return {
        isValidationError: function(err) {
            return ((err.name === 'ValidationError') || (err.message.indexOf('ValidationError') !== -1));
        },
        isDuplicateKeyError: function(err) {
            return (err.message.indexOf('duplicate key') !== -1);
        },
        connect: mongoose.connect(mongooseUri, options, function (err) {
            if (err) {
                console.error('database connection failure: \n' + err.stack);
                process.exit(1);
            }
        })
    };
};
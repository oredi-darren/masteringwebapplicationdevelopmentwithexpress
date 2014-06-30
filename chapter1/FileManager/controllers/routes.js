var main = require('./main');
var users = require('./users');
var sessions = require('./sessions');
var files = require('./files');
var express = require('express');
var multiparty = require('connect-multiparty');

var router = express.Router();

// Declaring application routes
router.get('/', main.requireUserAuth, files.index);
router.get('/files/:file', main.requireUserAuth, files.show);
router.del('/files/:file', main.requireUserAuth, files.destroy);
router.post('/files', multiparty(), main.requireUserAuth, files.create);
router.get('/users/new', users.new);
router.post('/users', users.create);
router.get('/sessions/new', sessions.new);
router.post('/sessions', sessions.create);
router.del('/sessions', sessions.destroy);

module.exports = router;

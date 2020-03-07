var express = require('express');
var router = express.Router();

//app.locals.visitorCount = 0;

//
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

const auth = require('./auth.js');
const weather = require('./weather.js');
const cookies = require('./cookies.js');
const voting = require('./voting.js');
const identity = require('./identity.js');
const europequiz = require('./europequiz.js');
const profile = require('./profile.js');
const houses = require('./houses.js');

module.exports.set = function(app) {
    auth.set(app);
    cookies.set(app);
    weather.set(app);
    voting.set(app);
    identity.set(app);
    europequiz.set(app);
    profile.set(app);
    houses.set(app);
}

const globals = {'cookiesToUser': cookies.cookiesToUser, 'userToCookies': cookies.userToCookies, 'votes': voting.votes, 'guestCount': cookies.guestCount};

module.exports.logData = function() {
    for (var key in globals) {
        console.log(new Date().getTime());
        console.log(key);
        console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
        console.log(globals[key]);
        console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
        console.log();
    }
    console.log();
    console.log();
    console.log();
}
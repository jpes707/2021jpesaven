#!/usr/bin/nodejs

//global variables


// INITIALIZATION STUFF

const express = require('express');
const app = express();

const path = require('path');

const cookies = require('./routes/cookies.js');

app.get('/profile_pictures/2021jpesaven.jpg', (req, res) => {
    if (cookies.userToCookies[cookies.getCookie('2021jpesaven-auth', req.headers.cookie)] == '2021jpesaven') {
        res.sendFile(path.join(__dirname, 'public/profile_pictures/2021jpesaven.jpg'));
    } else {
        res.sendFile(path.join(__dirname, 'files/stupid.jpg'));
    }
});

app.use(express.static('public'));
app.use(express.static('files'));


// -------------- express initialization -------------- //
// PORT SETUP - NUMBER SPECIFIC TO THIS SYSTEM
app.set('port', process.env.PORT || 8080);

//tell express that the view engine is hbs
app.set('view engine', 'hbs');

let routes = require('./routes');
routes.set(app);

app.get('*', function(req, res) {
    res.status(404).send('Page not found.');
});

// -------------- listener -------------- //
// // The listener is what keeps node 'alive.' 

let listener = app.listen(app.get('port'), () => {
    console.log('Express server started on port: ' + listener.address().port);
    console.log();
    console.log();
    console.log();
    console.log();
    console.log();
    console.log();
    console.log();
    console.log();
    console.log();
});

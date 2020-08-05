const fs = require('fs');
const path = require('path');
const hbs = require('hbs');
const shuffle = require('shuffle-array');

const cookies = require('./cookies.js');

module.exports.imageFiles = [];

module.exports.loadImages = () => { 
    fs.readdir('public/profile_pictures', function (err, files) {
        module.exports.imageFiles = shuffle(files);
    });
}

module.exports.set = (app) => {
    counselorToIBET = {
            'Kerry Hamblin': 'Holman Boswell Geiger',
            'Kacey McAleer': 'Holman Glotfelty Geiger',
            'Susan Martinez': 'Lago Fisher Jones',
            'Andrea Smith': 'Klein Fisher Jones',
            'Laurie Phelps': 'Larson Harris Seyler',
            'Sean Burke': 'Larson Harris Seyler',
            'Christina Ketchem': 'Glover James Seyler',
            'Guest': 'Log in to see!',
            null: 'Unknown'
    }
    
    app.get('/profile', [cookies.verifyNoIncrement], (req, res) => {
        console.log(req.query.profile)
        console.log(cookies.userToCookies)
        console.log(cookies.cookiesToUser)
        if (req.query.profile && req.query.profile in cookies.userToCookies) {
            console.log(cookies.userToCookies[req.query.profile]);
            cookie = cookies.userToCookies[req.query.profile];
        }
        else {
            console.log(cookies.userToCookies[req.query.profile]);
            cookie = cookies.getCookie('2021jpesaven-auth', req.headers.cookie);
        }
        user = cookies.cookiesToUser[cookie];
        userName = user.firstName + ' ' + user.middleName + ' ' + user.lastName;
        res.render('profile', {
            username: user.username,
            score: user.score,
            name: userName,
            vote: {0: 'Frank Murkowski', 1: 'Sarah Palin', 2: 'Sean Parnell', null: 'None yet!', 'Guest': 'Log in to vote!'}[user.vote],
            ibet: counselorToIBET[user.counselor]
        });
    });
    
    app.get('/gallery', [cookies.verifyNoIncrement], function(req, res) {
        cookie = cookies.getCookie('2021jpesaven-auth', req.headers.cookie);
        user = cookies.cookiesToUser[cookie];
        module.exports.loadImages();
        res.render('gall', {images: module.exports.imageFiles, username: user.name});
    });

    app.get('/profilePicture', [cookies.verifyNoIncrement], (req, res) => {
        if (res.locals.guest) {
            res.sendFile(path.join(__dirname, '../files/guest_profile_pictures/' + cookies.cookiesToUser[cookies.getCookie('2021jpesaven-auth', req.headers.cookie)].username + '.jpg'));
        } else {
           res.sendFile(path.join(__dirname, '../public/profile_pictures/' + cookies.cookiesToUser[cookies.getCookie('2021jpesaven-auth', req.headers.cookie)].username + '.jpg'));
        }
    });
}
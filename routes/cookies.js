const request = require('request');
const fs = require('fs');

const index = require('./index.js');
const europequiz = require('./europequiz.js');
const houses = require('./houses.js');

var guestCount = 0;

counselorToIBET = {
    'Kerry Hamblin': 'Holman Boswell Geiger',
    'Kacey McAleer': 'Holman Glotfelty Geiger',
    'Susan Martinez': 'Fisher Lago Jones',
    'Andrea Smith': 'Fisher Klein Jones',
    'Laurie Phelps': 'Larson Harris Seyler',
    'Sean Burke': 'Larson Harris Seyler',
    'Christina Ketchem': 'James Glover Seyler',
    'Guest': 'Log in to see!',
    null: 'Unknown'
}

IBETtoID = {
    'Fisher Klein Jones': 0,
    'Fisher Lago Jones': 1,
    'Holman Glotfelty Geiger': 2,
    'Holman Boswell Geiger': 3,
    'Larson Harris Seyler': 4,
    'James Glover Seyler': 5
}

IDtoIBET = {
    0: "Fisher Klein Jones",
    1: "Fisher Lago Jones",
    2: "Holman Glotfelty Geiger",
    3: "Holman Boswell Geiger",
    4: "Larson Harris Seyler",
    5: "James Glover Seyler"
}

var userToCookies = {};

var cookiesToUser = {};

let getCookie = (name, cookies) => {
        if(!cookies) {
            return null;
        }
        
        var cookieArr = cookies.split(";");
        for(var i = 0; i < cookieArr.length; i++) {
            var cookiePair = cookieArr[i].split("=");
            if(name == cookiePair[0].trim()) {
                return decodeURIComponent(cookiePair[1]);
            }
        }
        return null;
}

module.exports.getCookie = getCookie;
module.exports.cookiesToUser = cookiesToUser;
module.exports.userToCookies = userToCookies;

module.exports.createGuestCookie  = (req, res) => {
        guestCount++;
        
        user = {
            id: null,
            username: 'guest' + guestCount,
            name: 'Guest ' + guestCount,
            vote: 'Guest',
            currentQuestionId: Math.floor(Math.random() * europequiz.questions.length),
            score: 0,
            guest: true,
            guestPageCount: 0,
            counselor: 'Guest',
			absences: 0,
			firstName: 'Guest',
			middleName: 'Guest',
			lastName: 'Guest'
		}
                    
        request.get({
			url: 'https://thispersondoesnotexist.com/image',
			method: 'GET',
			encoding: null,
		}, (error, response, body) => {
		    console.log(body);
	        fs.writeFile('files/guest_profile_pictures/' + user.username + '.jpg', body, (err) => {
                if (err) throw err;
            });
		});
    		
        var access_token = null;
        do {
            access_token = Buffer.from((Math.random() * Math.random() * 100000000000 + Math.random() * 10000000 + 100000).toString()).toString('base64');
        }
        while(access_token.includes('=') || access_token in cookiesToUser);
        
        cookiesToUser[access_token] = user;
        userToCookies[user.username.toString()] = access_token;
        console.log(cookiesToUser);
        res.cookie('2021jpesaven-auth', access_token);
        index.logData();
    }
    
module.exports.verifyNoIncrement = (req, res, next) => {
    res.locals.guest = false;
    
    if (!getCookie('2021jpesaven-auth', req.headers.cookie) || !(getCookie('2021jpesaven-auth', req.headers.cookie) in cookiesToUser)) {
        res.redirect('https://user.tjhsst.edu/2021jpesaven/');
        return;
    } else if(cookiesToUser[getCookie('2021jpesaven-auth', req.headers.cookie)].guest) {
        if(cookiesToUser[getCookie('2021jpesaven-auth', req.headers.cookie)].guestPageCount > 5) {
            res.render('forcelogin');
            return;
        } else {
            res.locals.guest = true;
        }
    }
    
    next();
}

module.exports.verify = (req, res, next) => {
    res.locals.guest = false;
    
    if (!getCookie('2021jpesaven-auth', req.headers.cookie) || !(getCookie('2021jpesaven-auth', req.headers.cookie) in cookiesToUser)) {
        res.redirect('https://user.tjhsst.edu/2021jpesaven/');
        return;
    }
    
    cookie = getCookie('2021jpesaven-auth', req.headers.cookie);
    
    if(cookiesToUser[cookie].guest) {
        if(cookiesToUser[cookie].guestPageCount > 5) {
            res.render('forcelogin');
            return;
        } else {
            cookiesToUser[cookie].guestPageCount++;
            res.locals.guest = true;
        }
    }
    
    houses.updatePoints(cookiesToUser[cookie].username, cookiesToUser[cookie].counselor, 1, "Visited new webpage");
    
    next();
}

module.exports.set = (app) => {
    app.get('/username', (req, res) => {
        cookie = module.exports.getCookie('2021jpesaven-auth', req.headers.cookie);
        user = module.exports.cookiesToUser[cookie];
        
        if(cookie && user) {
            if (user.guest) {
                res.send('Guest user');
                return;
            }
            res.send(user.name);
            return;
        }
        
        res.send('You are not logged in!');
    });
};
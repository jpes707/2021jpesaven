const index = require('./index.js');
const cookies = require('./cookies.js');
const houses = require('./houses.js')

var votes = [ 2, 3, 0 ];
module.exports.votes = votes;

module.exports.set = function(app) {
    app.get('/poll', [cookies.verify], (req, res) => {
        var name = ['Sarah Palin', 'Caribou Barbie', 'Sarita', 'Sarah Barracuda', 'Alaskan Evita', 'The Refudiator', "Trig's mom", "Bayonetta", "Pit bull wearing lipstick", "Average hockey mom", "Lover of the smell of emissions", "Klondike Kardashian", "Iquitarod champion", "Knockoff Tina Fey", "Mama grizzly"][Math.floor(Math.random() * 15)];
        if (res.locals.guest) {
            res.render('poll_guest', {sarah: name});
        } else {
            res.render('poll', {sarah: name});
        }
    });
    
    app.get('/voting_worker', (req, res) => {
        const cookie = cookies.getCookie('2021jpesaven-auth', req.headers.cookie);
        
        if (!cookie) {
            res.send('You are not authenticated. Please visit the main page to log in.');
        }
        
        if(cookies.cookiesToUser[cookies.getCookie('2021jpesaven-auth', req.headers.cookie)].guest) {
            res.send(votes);
            return;
        }
        
        if (req.query.choice) {
            if (cookies.cookiesToUser[cookie].vote != null) {
                houses.updatePoints(cookies.cookiesToUser[cookie].username, cookies.cookiesToUser[cookie].counselor, 2, "Changed vote in poll");
                votes[cookies.cookiesToUser[cookie].vote]--;
            } else {
                houses.updatePoints(cookies.cookiesToUser[cookie].username, cookies.cookiesToUser[cookie].counselor, 20, "Voted in poll for first time");
            }
            cookies.cookiesToUser[cookie].vote = Math.floor(Number(req.query.choice)); 
            votes[cookies.cookiesToUser[cookie].vote]++;
            index.logData();
        }
        
        res.send(votes);
    });
}
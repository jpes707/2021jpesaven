const fs = require('fs');

const index = require('./index');
const cookies = require('./cookies');
const houses = require('./houses');

var questions = [];
fs.readFile('files/questions.txt', 'utf8', (err, contents) => {
    parseMe = contents.split('\n');
    parseMe.forEach((item) => {
        items = item.split(':');
        parseAnswers = items[1].split(',')
        answers = []
        parseAnswers.forEach((answer) => {
            answers.push(answer.trim());
        });
        questions.push([items[0], answers]);
    });
});
module.exports.questions = questions;

function getQuestion(id) {
    return questions[id][0];
}

function checkAnswer(id, answer) {
    return questions[id][1].includes(answer);
}

function getTopPlayers() {
    topPlayers = [];
    for (var cookie in cookies.cookiesToUser) {
        if(!cookies.cookiesToUser[cookie].guest) {
            topPlayers.push([cookies.cookiesToUser[cookie].score, cookies.cookiesToUser[cookie].name + ' (' + cookies.cookiesToUser[cookie].score + ' points)']);
        }
    }
    
    topPlayers.sort((first, second) => {
        return second[0] - first[0];
    });
    
    topNames = []
    for(n = 0; n < Math.min(5, topPlayers.length); n++) {
        topNames.push(topPlayers[n][1])
    }
    
    return topNames;
}

/*
var fragen = [];
fs.readFile('fragen.txt', 'utf8', (err, contents) => {
    parseMe = contents.split('\n');
    index = 0;
    parseMe.forEach((item) => {
        items = item.split(':');
        parseAnswers = items[1].split(',')
        answers = []
        parseAnswers.forEach((answer) => {
            answers.push(answer.trim());
        });
        questions.push([items[0], answers]);
    });
});*/

module.exports.set = function(app) {
    app.get('/europe', [cookies.verify], (req, res) => {
        res.render('europe');
    });
    
    app.get('/map_worker', (req, res) => {
        const cookie = cookies.getCookie('2021jpesaven-auth', req.headers.cookie);
        
        if (!cookie  || !(cookie in cookies.cookiesToUser)) {
            res.send(['You are not authenticated. Please visit the main page to log in.', 0]);
        }
        
        if(req.query.choice) {
            if (checkAnswer(cookies.cookiesToUser[cookie].currentQuestionId, req.query.choice)) {
                cookies.cookiesToUser[cookie].currentQuestionId = Math.floor(Math.random() * questions.length);
                houses.updatePoints(cookies.cookiesToUser[cookie].username, cookies.cookiesToUser[cookie].counselor, 5, "Map game (correct answer)");
                cookies.cookiesToUser[cookie].score++;
            } else {
                houses.updatePoints(cookies.cookiesToUser[cookie].username, cookies.cookiesToUser[cookie].counselor, -5, "Map game (wrong answer)");
                cookies.cookiesToUser[cookie].score--;
            }
        }
        
        index.logData();
        res.send([getQuestion(cookies.cookiesToUser[cookie].currentQuestionId), cookies.cookiesToUser[cookie].score, getTopPlayers()]);
    });
}
const request = require('request');
const fs = require('fs');
const mysql = require('mysql');

const index = require('./index');
const cookies = require('./cookies');
const auth = require('./auth');

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

var pool = mysql.createPool({
	connectionLimit: 10,
	host: 'mysql1.csl.tjhsst.edu',
	user: 'site_2021jpesave',
	password: 'NSZe5XWFBUxhAZH8Jrh68Psh',
	database: 'site_2021jpesaven',
	port: '3306'
});

module.exports.createUser = (username, counselor) => {
	ibetID = IBETtoID[counselorToIBET[counselor]];
	pool.query('INSERT INTO users VALUES(?, ?, 0)', [username, ibetID]);
	module.exports.updatePoints(username, counselor, 10, "New user");
}

module.exports.updatePoints = (username, counselor, amount, reason) => {
	ibetID = IBETtoID[counselorToIBET[counselor]];
	pool.query('UPDATE house SET score = score + ? WHERE ibet = ?', [amount, ibetID]);
	pool.query('UPDATE users SET score = score + ? WHERE username = ?', [amount, username]);
	pool.query('INSERT INTO transactions VALUES(?, ?, ?, ?)', [ibetID, username, amount, reason]);
}

module.exports.set = (app) => {
	app.get('/scores', [cookies.verify], (req, res) => {
		res.render('scores', {ibet: counselorToIBET[cookies.cookiesToUser[cookies.getCookie('2021jpesaven-auth', req.headers.cookie)].counselor]});
	});

	const doScoreQuery = (req, res, next) => {
		pool.query('SELECT * FROM house', (error, results, fields) => {
			if (error) throw error;
			dict = {};
			for (n = 0; n < 6; n++) {
				r = results[n];
				dict[IDtoIBET[r.ibet]] = r.score;
			}
			res.locals.query = dict;
			next();
		});
	}

	const doTotalQuery = (req, res, next) => {
		pool.query('CALL getScoreSum;', (error, results, fields) => {
			if (error) throw error;
			curStr = JSON.stringify(results[0]);
			res.locals.total = parseInt(curStr.substring(15, curStr.length - 2));
			next();
		});
	}

	app.get('/scoresWorker', [doScoreQuery, doTotalQuery], (req, res) => {
		arr = [{
			y: res.locals.total,
			label: 'Total points'
		}];
		console.log(res.locals.query);
		for (var key in res.locals.query) {
			arr.push({
				y: res.locals.query[key],
				label: key
			});
		}
		console.log(arr)
		res.json(arr);
	});
};